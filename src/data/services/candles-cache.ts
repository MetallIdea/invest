import { eq } from 'drizzle-orm';
import { db } from '@/data/db';
import { getCandlesByShare } from '@/api/tinvest';
import { candles } from '@/data/entities/candles';
import { shares } from '@/data/entities/shares';

const BATCH_SIZE = 500;
const INTERVAL = 'CANDLE_INTERVAL_DAY';
const DAYS_BACK = 365;

const NANO = BigInt(1000000000);

/**
 * Преобразует котировку Tinkoff (units + nano) в строку decimal
 * с точностью до 9 знаков после запятой.
 */
function quotationToString(value: { units?: string | number; nano?: number } | null | undefined): string {
  if (!value) {
    return '0';
  }

  const combined = BigInt(value.units ?? 0) * NANO + BigInt(value.nano ?? 0);
  const zero = BigInt(0);
  const sign = combined < zero ? '-' : '';
  const abs = combined < zero ? -combined : combined;
  const intPart = abs / NANO;
  const fracPart = abs % NANO;

  return `${sign}${intPart}.${fracPart.toString().padStart(9, '0')}`;
}

export interface SyncCandlesResult {
  candlesCount: number;
  sharesCount: number;
}

/**
 * Скачивает дневные свечи за последние DAYS_BACK дней для всех акций из таблицы shares
 * и сохраняет их в таблицу candles (upsert по figi + interval + time).
 * Возвращает количество сохранённых свечей и обработанных акций.
 */
export async function syncCandles(): Promise<SyncCandlesResult> {
  const shareList = await db.select({ figi: shares.figi }).from(shares).where(eq(shares.country, 'Российская Федерация'));

  if (shareList.length === 0) {
    return { candlesCount: 0, sharesCount: 0 };
  }

  const to = new Date();
  const from = new Date(to.getTime() - DAYS_BACK * 24 * 60 * 60 * 1000);

  let total = 0;

  for (const share of shareList) {
    try {
      const candlesResult = await getCandlesByShare(share.figi, from, to, INTERVAL);

      const rows = candlesResult
        .filter((candle) => candle.time)
        .map((candle) => ({
          figi: share.figi!,
          interval: INTERVAL,
          open: quotationToString(candle.open),
          high: quotationToString(candle.high),
          low: quotationToString(candle.low),
          close: quotationToString(candle.close),
          volume: Number(candle.volume ?? 0),
          time: new Date(candle.time!),
        }));

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);

        console.log(chunk);

        await db.insert(candles)
          .values(chunk)
          .onConflictDoNothing();
      }

      total += rows.length;
    } catch (error) {
      console.error(`Не удалось получить свечи для ${share.figi}:`, error);
    }
  }

  return { candlesCount: total, sharesCount: shareList.length };
}