import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '@/data/db';
import { candles } from '@/data/entities/candles';
import { indicators } from '@/data/entities/indicators';
import { shares } from '@/data/entities/shares';
import type { Indicator } from '@/data/entities/indicators';

const BATCH_SIZE = 500;
const INTERVAL = 'CANDLE_INTERVAL_DAY';

/** Период ATR (стандартный по Уайлдеру). */
const ATR_PERIOD = 14;

/** Периоды EMA. */
const EMA_PERIODS = [9, 21];

/** Период расчёта исторической волатильности (торговых дней). */
const VOLATILITY_PERIOD = 21;

/** Периоды RSI. */
const RSI_PERIODS = [9, 14];

/** Параметры MACD: быстрая EMA, медленная EMA и сигнальная EMA. */
interface MacdParams {
  fast: number;
  slow: number;
  signal: number;
}

/** Наборы параметров MACD для расчёта. */
const MACD_VARIANTS: MacdParams[] = [
  { fast: 12, slow: 26, signal: 9 },
  { fast: 5, slow: 13, signal: 9 },
  { fast: 3, slow: 10, signal: 16 },
];

export interface CalculateIndicatorResult {
  valuesCount: number;
  sharesCount: number;
}

export interface CalculateIndicatorsResult {
  /** Сколько значений индикаторов сохранено всего. */
  valuesCount: number;
  /** Сколько акций обработано. */
  sharesCount: number;
  atr: number;
  rsi: number;
  macd: number;
  ema: number;
  volatility: number;
}

interface CandleRow {
  time: Date;
  high: string;
  low: string;
  close: string;
}

/**
 * Экспоненциальное скользящее среднее (EMA) ряда значений.
 * Затравка — SMA по первым period непустым значениям, далее сглаживание с коэффициентом 2/(period + 1).
 * До появления затравки возвращает null, на разрывах переносит предыдущее значение.
 */
function emaSeries(values: readonly (number | null)[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null);
  const k = 2 / (period + 1);

  let seedIndex = -1;
  let sum = 0;
  let count = 0;

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (value === null) {
      continue;
    }
    if (seedIndex === -1) {
      seedIndex = i;
    }
    sum += value;
    count++;

    if (count === period) {
      break;
    }
  }

  if (count < period) {
    return result;
  }

  let prev = sum / period;
  result[seedIndex + period - 1] = prev;

  for (let i = seedIndex + period; i < values.length; i++) {
    const value = values[i];
    if (value === null) {
      result[i] = prev;
      continue;
    }
    prev = value * k + prev * (1 - k);
    result[i] = prev;
  }

  return result;
}

function createIndicatorRow(
  figi: string,
  candle: CandleRow,
  indicator: string,
  parameters: Record<string, number>,
  value: number,
): Indicator {
  return {
    figi,
    time: candle.time,
    interval: INTERVAL,
    indicator,
    parameters,
    value: value.toFixed(9),
  };
}

/**
 * Вычисляет индикатор VWAP (Volume Weighted Average Price) для всех акций
 * на основе сохранённых дневных свечей и сохраняет результат в таблицу indicators.
 *
 * Формула для каждого бара:
 *   typicalPrice = (high + low + close) / 3
 *   vwap = сумма(typicalPrice * volume) за период / сумма(volume) за период
 *
 * Значение считается накопительно с начала доступной истории свечей,
 * поэтому для каждой даты получается одна точка VWAP.
 * Повторный расчёт обновляет существующие значения (upsert по figi + interval + time + indicator + parameters).
 * Возвращает количество сохранённых значений и обработанных акций.
 */
export async function calculateVwap(): Promise<CalculateIndicatorResult> {
  const shareList = await db.select({ figi: shares.figi, name: shares.name }).from(shares);

  let total = 0;

  for (const share of shareList) {
    try {
      // Свечи инструмента по возрастанию времени
      const candleRows = await db
        .select({ time: candles.time, high: candles.high, low: candles.low, close: candles.close, volume: candles.volume })
        .from(candles)
        .where(and(eq(candles.figi, share.figi!), eq(candles.interval, INTERVAL)))
        .orderBy(asc(candles.time));

      let sumTypicalVolume = 0;
      let sumVolume = 0;

      const rows = [];

      for (const candle of candleRows) {
        const typicalPrice = (Number(candle.high) + Number(candle.low) + Number(candle.close)) / 3;
        const volume = Number(candle.volume ?? 0);

        sumTypicalVolume += typicalPrice * volume;
        sumVolume += volume;

        if (sumVolume === 0) {
          continue;
        }

        rows.push({
          figi: share.figi!,
          time: candle.time,
          interval: INTERVAL,
          indicator: 'vwap',
          parameters: {},
          value: (sumTypicalVolume / sumVolume).toFixed(9),
        });
      }

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);

        // upsert: повторный расчёт перезаписывает значение VWAP для той же точки
        await db.insert(indicators)
          .values(chunk)
          .onConflictDoUpdate({
            target: [indicators.figi, indicators.interval, indicators.time, indicators.indicator, indicators.parameters],
            set: {
              value: sql`excluded.value`,
            },
          });
      }

      total += rows.length;
    } catch (error) {
      console.error(`Не удалось рассчитать VWAP для ${share.figi}:`, error);
    }
  }

  return { valuesCount: total, sharesCount: shareList.length };
}

/**
 * EMA для каждого бара, начиная с момента накопления period цен закрытия.
 * Значения считаются по цене закрытия.
 */
function buildEmaRows(figi: string, candles: CandleRow[], closes: number[], period: number): Indicator[] {
  const rows: Indicator[] = [];
  const ema = emaSeries(closes, period);

  for (let i = 0; i < ema.length; i++) {
    if (ema[i] !== null) {
      rows.push(createIndicatorRow(figi, candles[i], 'ema', { period }, ema[i]!));
    }
  }

  return rows;
}

/**
 * RSI (Relative Strength Index) по Уайлдеру.
 * Первое значение считается по SMA приростов/падений за первые period изменений цены,
 * далее применяется экспоненциальное сглаживание Уайлдера.
 */
function buildRsiRows(figi: string, candles: CandleRow[], closes: number[], period: number): Indicator[] {
  const rows: Indicator[] = [];

  // Нужно period изменений цены закрытия (period + 1 свечей)
  if (closes.length <= period) {
    return rows;
  }

  let gainSum = 0;
  let lossSum = 0;

  for (let i = 1; i <= period; i++) {
    const delta = closes[i] - closes[i - 1];
    gainSum += Math.max(delta, 0);
    lossSum += Math.max(-delta, 0);
  }

  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  const push = (index: number, avgGain: number, avgLoss: number) => {
    const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    rows.push(createIndicatorRow(figi, candles[index], 'rsi', { period }, rsi));
  };

  push(period, avgGain, avgLoss);

  for (let i = period + 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(delta, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-delta, 0)) / period;
    push(i, avgGain, avgLoss);
  }

  return rows;
}

/**
 * ATR (Average True Range) по Уайлдеру.
 * True Range для первого бара — high - low, далее максимум из high-low,
 * |high - close.prev| и |low - close.prev|. Сглаживание Уайлдера с периодом period.
 */
function buildAtrRows(
  figi: string,
  candles: CandleRow[],
  highs: number[],
  lows: number[],
  closes: number[],
  period: number,
): Indicator[] {
  const rows: Indicator[] = [];

  // Для затравки нужно period значений TR (period свечей)
  if (candles.length < period) {
    return rows;
  }

  const tr: number[] = [highs[0] - lows[0]];

  for (let i = 1; i < candles.length; i++) {
    tr.push(
      Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1]),
      ),
    );
  }

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += tr[i];
  }

  let atr = sum / period;
  rows.push(createIndicatorRow(figi, candles[period - 1], 'atr', { period }, atr));

  for (let i = period; i < tr.length; i++) {
    atr = (atr * (period - 1) + tr[i]) / period;
    rows.push(createIndicatorRow(figi, candles[i], 'atr', { period }, atr));
  }

  return rows;
}

/**
 * Историческая волатильность по цене закрытия.
 * Для каждого бара берётся окно из последних period дневных логарифмических
 * доходностей, считается их стандартное отклонение и умножается на √252 —
 * получается годовая волатильность в процентах (например, 35 = 35% годовых).
 */
function buildVolatilityRows(
  figi: string,
  candles: CandleRow[],
  closes: number[],
  period: number,
): Indicator[] {
  const rows: Indicator[] = [];

  // Для окна из period доходностей нужно минимум period + 1 цен закрытия
  if (closes.length <= period) {
    return rows;
  }

  // Дневные логарифмические доходности (индекс бара = i, доходность за i-1 → i)
  const returns: (number | null)[] = new Array(closes.length).fill(null);

  for (let i = 1; i < closes.length; i++) {
    if (closes[i - 1] > 0 && closes[i] > 0) {
      returns[i] = Math.log(closes[i] / closes[i - 1]);
    }
  }

  let sum = 0;
  let squaresSum = 0;
  let count = 0;

  for (let i = 1; i <= period; i++) {
    const value = returns[i];
    if (value !== null) {
      sum += value;
      squaresSum += value * value;
      count++;
    }
  }

  const push = (index: number) => {
    if (count < period) {
      return;
    }

    const mean = sum / count;
    const variance = Math.max(squaresSum / count - mean * mean, 0);
    const volatilityPct = Math.sqrt(variance) * Math.sqrt(252) * 100;

    rows.push(createIndicatorRow(figi, candles[index], 'volatility', { period }, volatilityPct));
  };

  push(period);

  // Скользящее окно: на каждом шаге удаляем выпавшую доходность и добавляем новую
  for (let i = period + 1; i < closes.length; i++) {
    const removed = returns[i - period];
    if (removed !== null) {
      sum -= removed;
      squaresSum -= removed * removed;
      count--;
    }

    const added = returns[i];
    if (added !== null) {
      sum += added;
      squaresSum += added * added;
      count++;
    }

    push(i);
  }

  return rows;
}

/**
 * MACD (Moving Average Convergence Divergence).
 * Для каждого бара сохраняются три значения:
 *   macd — разница быстрой и медленной EMA цены закрытия;
 *   macd_signal — EMA линии MACD с периодом signal;
 *   macd_hist — гистограмма (разница macd и signal).
 * Параметры (fast, slow, signal) сохраняются в колонке parameters.
 */
function buildMacdRows(figi: string, candles: CandleRow[], closes: number[], params: MacdParams): Indicator[] {
  const rows: Indicator[] = [];
  const parameters = { fast: params.fast, slow: params.slow, signal: params.signal };

  const emaFast = emaSeries(closes, params.fast);
  const emaSlow = emaSeries(closes, params.slow);

  const macdLine: (number | null)[] = closes.map((_, i) =>
    emaFast[i] !== null && emaSlow[i] !== null ? emaFast[i]! - emaSlow[i]! : null,
  );

  const signalLine = emaSeries(macdLine, params.signal);

  for (let i = 0; i < closes.length; i++) {
    const macd = macdLine[i];
    const signal = signalLine[i];

    if (macd !== null && signal !== null) {
      rows.push(createIndicatorRow(figi, candles[i], 'macd', parameters, macd));
      rows.push(createIndicatorRow(figi, candles[i], 'macd_signal', parameters, signal));
      rows.push(createIndicatorRow(figi, candles[i], 'macd_hist', parameters, macd - signal));
    }
  }

  return rows;
}

/**
 * Рассчитывает технические индикаторы (ATR, RSI, MACD, EMA, волатильность)
 * для всех акций на основе сохранённых дневных свечей и сохраняет результат в таблицу indicators.
 *
 * Наборы значений:
 *   - ATR (период 14);
 *   - RSI (периоды 9 и 14);
 *   - MACD (12, 26, 9), (5, 13, 9) и (3, 10, 16) — линия, сигнал и гистограмма;
 *   - EMA (периоды 9 и 21);
 *   - волатильность (период 21, годовая, в процентах).
 *
 * Повторный расчёт обновляет существующие значения (upsert по figi + interval + time + indicator + parameters).
 * Возвращает количество сохранённых значений и обработанных акций.
 */
export async function calculateIndicators(): Promise<CalculateIndicatorsResult> {
  const shareList = await db.select({ figi: shares.figi }).from(shares);

  const counters = { atr: 0, rsi: 0, macd: 0, ema: 0, volatility: 0 };
  let total = 0;

  for (const share of shareList) {
    try {
      // Свечи инструмента по возрастанию времени
      const candleRows = await db
        .select({ time: candles.time, high: candles.high, low: candles.low, close: candles.close })
        .from(candles)
        .where(and(eq(candles.figi, share.figi!), eq(candles.interval, INTERVAL)))
        .orderBy(asc(candles.time));

      if (candleRows.length === 0) {
        continue;
      }

      const figi = share.figi!;
      const highs = candleRows.map((candle) => Number(candle.high));
      const lows = candleRows.map((candle) => Number(candle.low));
      const closes = candleRows.map((candle) => Number(candle.close));

      const rows: Indicator[] = [
        ...EMA_PERIODS.flatMap((period) => buildEmaRows(figi, candleRows, closes, period)),
        ...RSI_PERIODS.flatMap((period) => buildRsiRows(figi, candleRows, closes, period)),
        ...buildAtrRows(figi, candleRows, highs, lows, closes, ATR_PERIOD),
        ...MACD_VARIANTS.flatMap((params) => buildMacdRows(figi, candleRows, closes, params)),
        ...buildVolatilityRows(figi, candleRows, closes, VOLATILITY_PERIOD),
      ];

      for (const row of rows) {
        if (row.indicator === 'atr') {
          counters.atr++;
        } else if (row.indicator === 'rsi') {
          counters.rsi++;
        } else if (row.indicator.startsWith('macd')) {
          counters.macd++;
        } else if (row.indicator === 'ema') {
          counters.ema++;
        } else if (row.indicator === 'volatility') {
          counters.volatility++;
        }
      }

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);

        // upsert: повторный расчёт перезаписывает значения для той же точки
        await db.insert(indicators)
          .values(chunk)
          .onConflictDoUpdate({
            target: [indicators.figi, indicators.interval, indicators.time, indicators.indicator, indicators.parameters],
            set: {
              value: sql`excluded.value`,
            },
          });
      }

      total += rows.length;
    } catch (error) {
      console.error(`Не удалось рассчитать индикаторы для ${share.figi}:`, error);
    }
  }

  return { valuesCount: total, sharesCount: shareList.length, ...counters };
}