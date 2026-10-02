import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/data/db';
import { candles } from '@/data/entities/candles';
import { indicators } from '@/data/entities/indicators';
import { shares } from '@/data/entities/shares';
import { shareWeights } from '@/data/entities/share-weights';

const BATCH_SIZE = 500;
const INTERVAL = 'CANDLE_INTERVAL_DAY';

const RSI_PERIOD = 14;
const ATR_PERIOD = 14;
const MACD_PARAMS = { fast: 12, slow: 26, signal: 9 };
const EMA_PERIODS = [9, 21];
/** Период расчёта исторической волатильности (торговых дней). */
const VOLATILITY_PERIOD = 21;

/** Веса групп индикаторов при расчёте итогового веса (сумма 100). */
const WEIGHT_RSI = 25;
const WEIGHT_MACD = 25;
const WEIGHT_EMA = 30;
const WEIGHT_VWAP = 20;

/**
 * Базовая годовая волатильность (%): при значениях ниже неё сигнал не корректируется.
 * Типичный уровень для российских акций — порядка 40% годовых.
 */
const VOLATILITY_REF = 40;

/** Сила коррекции силы сигнала на волатильность (0 — коррекция выключена). */
const VOLATILITY_STRENGTH = 1.5;

/** Порог разницы весов для формирования сигнала. */
const SIGNAL_THRESHOLD = 15;

export interface CalculateWeightsResult {
  /** Сколько записей весов сохранено. */
  weightsCount: number;
  /** Сколько акций обработано. */
  sharesCount: number;
}

interface IndicatorRow {
  figi: string | null;
  value: string | null;
  time: Date | null;
}

/** Фильтр по набору параметров jsonb (например, {"period":14}). */
const byParameters = (params: Record<string, number>) =>
  sql`${indicators.parameters} = ${JSON.stringify(params)}::jsonb`;

/** Ограничивает значение отрезком [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Оценка RSI: ниже 30 — перепроданность (сигнал покупки),
 * выше 70 — перекупленность (сигнал продажи). Чем дальше от 30/70, тем сильнее сигнал.
 */
function rsiScores(rsi: number): { buy: number; sell: number } {
  if (rsi >= 30 && rsi <= 70) {
    return { buy: 0, sell: 0 };
  }

  return {
    buy: clamp((30 - rsi) / 30, 0, 1),
    sell: clamp((rsi - 70) / 30, 0, 1),
  };
}

/**
 * Оценка MACD-гистограммы, нормированной на ATR:
 * hist > 0 — положительная динамика (покупка), hist < 0 — продажа.
 * Величина в долях ATR (0.1 ATR = 100% силы сигнала).
 */
function macdScores(hist: number, atr: number | null): { buy: number; sell: number } {
  if (hist === 0) {
    return { buy: 0, sell: 0 };
  }

  const ratio = atr !== null && atr > 0 ? hist / atr : hist > 0 ? 0.5 : -0.5;

  return {
    buy: ratio > 0 ? clamp(ratio / 0.1, 0, 1) : 0,
    sell: ratio < 0 ? clamp(-ratio / 0.1, 0, 1) : 0,
  };
}

/**
 * Оценка отклонения цены закрытия от скользящей средней в процентах:
 * цена выше EMA — покупка, ниже — продажа (1% отклонения = 100% силы сигнала).
 */
function emaScores(close: number, ema: number): { buy: number; sell: number } {
  const deviationPct = ((close - ema) / ema) * 100;

  return {
    buy: deviationPct > 0 ? clamp(deviationPct / 1, 0, 1) : 0,
    sell: deviationPct < 0 ? clamp(-deviationPct / 1, 0, 1) : 0,
  };
}

/** Оценка отклонения цены закрытия от VWAP в процентах (1% = 100% силы сигнала). */
function vwapScores(close: number, vwap: number): { buy: number; sell: number } {
  const deviationPct = ((close - vwap) / vwap) * 100;

  return {
    buy: deviationPct > 0 ? clamp(deviationPct / 1, 0, 1) : 0,
    sell: deviationPct < 0 ? clamp(-deviationPct / 1, 0, 1) : 0,
  };
}

/** Возвращает последнее (по времени) значение индикатора для каждого инструмента. */
async function lastIndicatorValues(
  alias: string,
  indicator: string,
  params: Record<string, number> | null,
): Promise<IndicatorRow[]> {
  const base = db
    .selectDistinctOn([indicators.figi], {
      figi: indicators.figi,
      value: indicators.value,
      time: indicators.time,
    })
    .from(indicators)
    .where(
      params === null
        ? eq(indicators.indicator, indicator)
        : and(eq(indicators.indicator, indicator), byParameters(params)),
    )
    .orderBy(indicators.figi, desc(indicators.time))
    .as(alias);

  return db.select({ figi: base.figi, value: base.value, time: base.time }).from(base);
}

/**
 * Рассчитывает веса «покупка»/«продажа» для каждой акции на основе
 * последних значений технических индикаторов (RSI, MACD, EMA, VWAP, ATR,
 * волатильность) и сохраняет результат в таблицу share_weights.
 *
 * Итоговый вес — взвешенная сумма оценок сигналов (0–100):
 *   - RSI (14) — 25%;
 *   - MACD-гистограмма (12/26/9), нормированная на ATR — 25%;
 *   - отклонение цены от EMA (9 и 21) — 30%;
 *   - отклонение цены от VWAP — 20%.
 *
 * Если часть индикаторов отсутствует, веса пересчитываются пропорционально
 * доступным группам.
 *
 * Коррекция на волатильность: чем волатильнее акция (годовая историческая
 * волатильность выше VOLATILITY_REF), тем ниже доверие к сигналу —
 * разница между весом покупки и продажи сжимается вокруг их среднего.
 *
 * Повторный расчёт обновляет записи (upsert по figi).
 */
export async function calculateShareWeights(): Promise<CalculateWeightsResult> {
  const [lastCloses, lastVwaps, lastAtrs, lastRsis, lastMacdHist, lastEma9, lastEma21, lastVolatilities] =
    await Promise.all([
      db
        .selectDistinctOn([candles.figi], {
          figi: candles.figi,
          value: candles.close,
          time: candles.time,
        })
        .from(candles)
        .where(eq(candles.interval, INTERVAL))
        .orderBy(candles.figi, desc(candles.time)),
      lastIndicatorValues('last_vwap', 'vwap', null),
      lastIndicatorValues('last_atr', 'atr', { period: ATR_PERIOD }),
      lastIndicatorValues('last_rsi', 'rsi', { period: RSI_PERIOD }),
      lastIndicatorValues('last_macd_hist', 'macd_hist', MACD_PARAMS),
      lastIndicatorValues('last_ema_9', 'ema', { period: EMA_PERIODS[0] }),
      lastIndicatorValues('last_ema_21', 'ema', { period: EMA_PERIODS[1] }),
      lastIndicatorValues('last_volatility', 'volatility', { period: VOLATILITY_PERIOD }),
    ]);

  const sharesList = await db
    .select({ figi: shares.figi })
    .from(shares)
    .where(eq(shares.country, 'Российская Федерация'));

  const valuesByFigi = (rows: IndicatorRow[]): Map<string, IndicatorRow> => {
    const map = new Map<string, IndicatorRow>();
    for (const row of rows) {
      if (row.figi) {
        map.set(row.figi, row);
      }
    }
    return map;
  };

  const closeMap = valuesByFigi(lastCloses);
  const vwapMap = valuesByFigi(lastVwaps);
  const atrMap = valuesByFigi(lastAtrs);
  const rsiMap = valuesByFigi(lastRsis);
  const macdMap = valuesByFigi(lastMacdHist);
  const ema9Map = valuesByFigi(lastEma9);
  const ema21Map = valuesByFigi(lastEma21);
  const volatilityMap = valuesByFigi(lastVolatilities);

  const rows: (typeof shareWeights.$inferInsert)[] = [];

  for (const share of sharesList) {
    const figi = share.figi!;
    const closeRow = closeMap.get(figi);

    if (!closeRow?.value) {
      continue;
    }

    const closeValue = Number(closeRow.value);

    // Группы сигналов с их весами; группы без данных пропускаются,
    // итог нормализуется по сумме весов доступных групп.
    const groups: { weight: number; buy: number; sell: number }[] = [];
    const times: Date[] = [];

    if (closeRow.time) {
      times.push(closeRow.time);
    }

    const rsiRow = rsiMap.get(figi);
    if (rsiRow?.value) {
      const scores = rsiScores(Number(rsiRow.value));
      groups.push({ weight: WEIGHT_RSI, ...scores });

      if (rsiRow.time) {
        times.push(rsiRow.time);
      }
    }

    const macdRow = macdMap.get(figi);
    if (macdRow?.value) {
      const atrValue = atrMap.get(figi)?.value ? Number(atrMap.get(figi)!.value) : null;
      const scores = macdScores(Number(macdRow.value), atrValue);
      groups.push({ weight: WEIGHT_MACD, ...scores });

      if (macdRow.time) {
        times.push(macdRow.time);
      }
    }

    const ema9Row = ema9Map.get(figi);
    const ema21Row = ema21Map.get(figi);

    if (ema9Row?.value || ema21Row?.value) {
      const emaScoresList: { buy: number; sell: number }[] = [];

      if (ema9Row?.value) {
        emaScoresList.push(emaScores(closeValue, Number(ema9Row.value)));

        if (ema9Row.time) {
          times.push(ema9Row.time);
        }
      }
      if (ema21Row?.value) {
        emaScoresList.push(emaScores(closeValue, Number(ema21Row.value)));

        if (ema21Row.time) {
          times.push(ema21Row.time);
        }
      }

      groups.push({
        weight: WEIGHT_EMA,
        buy: emaScoresList.reduce((sum, score) => sum + score.buy, 0) / emaScoresList.length,
        sell: emaScoresList.reduce((sum, score) => sum + score.sell, 0) / emaScoresList.length,
      });
    }

    const vwapRow = vwapMap.get(figi);
    if (vwapRow?.value) {
      const scores = vwapScores(closeValue, Number(vwapRow.value));
      groups.push({ weight: WEIGHT_VWAP, ...scores });

      if (vwapRow.time) {
        times.push(vwapRow.time);
      }
    }

    if (groups.length === 0) {
      continue;
    }

    const totalWeight = groups.reduce((sum, group) => sum + group.weight, 0);
    let buyWeight = (groups.reduce((sum, group) => sum + group.weight * group.buy, 0) / totalWeight) * 100;
    let sellWeight = (groups.reduce((sum, group) => sum + group.weight * group.sell, 0) / totalWeight) * 100;

    // Коррекция силы сигнала на волатильность: чем волатильнее акция, тем ниже
    // доверие к сигналу — разница весов сжимается вокруг их среднего значения.
    const volatilityRow = volatilityMap.get(figi);
    const volatilityPct = volatilityRow?.value ? Number(volatilityRow.value) : null;

    if (volatilityPct !== null && volatilityPct > VOLATILITY_REF) {
      const excess = (volatilityPct - VOLATILITY_REF) / VOLATILITY_REF;
      const damping = 1 / (1 + excess * VOLATILITY_STRENGTH);

      const center = (buyWeight + sellWeight) / 2;
      buyWeight = center + (buyWeight - center) * damping;
      sellWeight = center + (sellWeight - center) * damping;

      if (volatilityRow?.time) {
        times.push(volatilityRow.time);
      }
    }

    const difference = buyWeight - sellWeight;
    const signal = difference >= SIGNAL_THRESHOLD ? 'buy' : difference <= -SIGNAL_THRESHOLD ? 'sell' : 'neutral';

    rows.push({
      figi,
      buyWeight: buyWeight.toFixed(2),
      sellWeight: sellWeight.toFixed(2),
      signal,
      lastIndicatorTime: new Date(Math.max(...times.map((time) => time.getTime()))),
    });
  }

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);

    // upsert: повторный расчёт перезаписывает веса для того же figi
    await db.insert(shareWeights)
      .values(chunk)
      .onConflictDoUpdate({
        target: [shareWeights.figi],
        set: {
          buyWeight: sql`excluded.buy_weight`,
          sellWeight: sql`excluded.sell_weight`,
          signal: sql`excluded.signal`,
          lastIndicatorTime: sql`excluded.last_indicator_time`,
        },
      });
  }

  return { weightsCount: rows.length, sharesCount: sharesList.length };
}