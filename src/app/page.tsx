import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/data/db';
import { candles } from '@/data/entities/candles';
import { indicators } from '@/data/entities/indicators';
import { shares } from '@/data/entities/shares';
import { shareWeights } from '@/data/entities/share-weights';
import { SharesTable } from '@/components/shares-table/shares-table';
import { WeightsTable } from '@/components/weights-table/weights-table';
import { SyncPanel } from '../components/sync-panel/sync-panel';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const CANDLE_INTERVAL_DAY = 'CANDLE_INTERVAL_DAY';
const VWAP_INDICATOR = 'vwap';
const VOLATILITY_INDICATOR = 'volatility';
const VOLATILITY_PARAMS = { period: 21 };
const COUNTRY_RU = 'Российская Федерация';

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

  // свечи каждого инструмента с рангом по времени (1 — самая свежая)
  const rankedCandles = db
    .select({
      figi: candles.figi,
      close: candles.close,
      rn: sql<number>`row_number() over (partition by ${candles.figi} order by ${candles.time} desc)`.as('rn'),
    })
    .from(candles)
    .where(eq(candles.interval, CANDLE_INTERVAL_DAY))
    .as('ranked_candles');

  // предыдущая (вторая с конца) дневная свеча для каждого figi
  const prevCandles = db
    .select({
      figi: rankedCandles.figi,
      close: rankedCandles.close,
    })
    .from(rankedCandles)
    .where(eq(rankedCandles.rn, 2))
    .as('prev_candles');

  // последнее (по времени) значение индикатора VWAP для каждого figi
  const lastVwaps = db
    .selectDistinctOn([indicators.figi], {
      figi: indicators.figi,
      value: indicators.value,
      time: indicators.time,
    })
    .from(indicators)
    .where(eq(indicators.indicator, VWAP_INDICATOR))
    .orderBy(indicators.figi, desc(indicators.time))
    .as('last_vwaps');

  // последнее (по времени) значение годовой волатильности для каждого figi
  const lastVolatilities = db
    .selectDistinctOn([indicators.figi], {
      figi: indicators.figi,
      value: indicators.value,
    })
    .from(indicators)
    .where(
      and(
        eq(indicators.indicator, VOLATILITY_INDICATOR),
        sql`${indicators.parameters} = ${JSON.stringify(VOLATILITY_PARAMS)}::jsonb`,
      ),
    )
    .orderBy(indicators.figi, desc(indicators.time))
    .as('last_volatilities');

  const [sharesList, weightsList] = await Promise.all([
    db
      .select({
        name: shares.name,
        ticker: shares.ticker,
        figi: shares.figi,
        lastCandleClose: lastCandles.close,
        previousCandleClose: prevCandles.close,
        lastCandleTime: lastCandles.time,
        lastVwap: lastVwaps.value,
        lastVwapTime: lastVwaps.time,
      })
      .from(shares)
      .leftJoin(lastCandles, eq(shares.figi, lastCandles.figi))
      .leftJoin(lastVwaps, eq(shares.figi, lastVwaps.figi))
      .leftJoin(prevCandles, eq(shares.figi, prevCandles.figi))
      .where(eq(shares.country, COUNTRY_RU))
      .orderBy(asc(shares.ticker)),
    db
      .select({
        name: shares.name,
        ticker: shares.ticker,
        figi: shares.figi,
        buyWeight: shareWeights.buyWeight,
        sellWeight: shareWeights.sellWeight,
        signal: shareWeights.signal,
        volatility: lastVolatilities.value,
        calculatedAt: shareWeights.lastIndicatorTime,
      })
      .from(shares)
      .leftJoin(shareWeights, eq(shares.figi, shareWeights.figi))
      .leftJoin(lastVolatilities, eq(shares.figi, lastVolatilities.figi))
      .where(eq(shares.country, COUNTRY_RU))
      .orderBy(asc(shares.ticker)),
  ]);

  return { shares: sharesList, weights: weightsList };
};

export default async function Home() {
  const initialData = await getInitialData();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Акции</h1>
      <SyncPanel />
      <h2 className={styles.sectionTitle}>Веса покупки / продажи</h2>
      <WeightsTable weights={initialData.weights} />
      <h2 className={styles.sectionTitle}>Свечи и индикаторы</h2>
      <SharesTable shares={initialData.shares} />
    </div>
  );
}
