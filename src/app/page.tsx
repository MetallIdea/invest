import { asc, desc, eq } from 'drizzle-orm';
import { db } from '@/data/db';
import { candles } from '@/data/entities/candles';
import { shares } from '@/data/entities/shares';
import { SyncPanel } from '../components/sync-panel/sync-panel';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const CANDLE_INTERVAL_DAY = 'CANDLE_INTERVAL_DAY';

/** Форматирует дату свечи в формате ДД.ММ.ГГГГ. */
const formatDate = (date: Date): string => date.toLocaleDateString('ru-RU');

/** Убирает хвостовые нули у цены (numeric из БД приходит строкой). */
const formatClose = (value: string | null): string => {
  if (!value) {
    return '—';
  }

  return value.includes('.') ? value.replace(/0+$/, '').replace(/\.$/, '') : value;
};

const getInitialData = async () => {
  // последняя (по времени) дневная свеча для каждого figi
  const lastCandles = db
    .selectDistinctOn([candles.figi], {
      figi: candles.figi,
      close: candles.close,
      time: candles.time,
    })
    .from(candles)
    .where(eq(candles.interval, CANDLE_INTERVAL_DAY))
    .orderBy(candles.figi, desc(candles.time))
    .as('last_candles');

  const sharesList = await db
    .select({
      name: shares.name,
      ticker: shares.ticker,
      figi: shares.figi,
      lastCandleClose: lastCandles.close,
      lastCandleTime: lastCandles.time,
    })
    .from(shares)
    .leftJoin(lastCandles, eq(shares.figi, lastCandles.figi))
    .where(eq(shares.country, 'Российская Федерация'))
    .orderBy(asc(shares.ticker));

  return { shares: sharesList };
};

export default async function Home() {
  const initialData = await getInitialData();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Акции</h1>
      <SyncPanel />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Тикер</th>
            <th>ФИГИ</th>
            <th>Дата последней свечи</th>
            <th>Цена закрытия</th>
          </tr>
        </thead>
        <tbody>
          {initialData.shares.map((share) => (
            <tr key={share.figi}>
              <td>{share.name}</td>
              <td>{share.ticker}</td>
              <td>{share.figi}</td>
              <td>{share.lastCandleTime ? formatDate(share.lastCandleTime) : '—'}</td>
              <td>{formatClose(share.lastCandleClose)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
