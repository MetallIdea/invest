import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '@/data/db';
import { candles } from '@/data/entities/candles';
import { indicators } from '@/data/entities/indicators';
import { shares } from '@/data/entities/shares';

const BATCH_SIZE = 500;
const INTERVAL = 'CANDLE_INTERVAL_DAY';
const INDICATOR_NAME = 'vwap';

export interface CalculateIndicatorResult {
  valuesCount: number;
  sharesCount: number;
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
          indicator: INDICATOR_NAME,
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