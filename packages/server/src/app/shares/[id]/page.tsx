import { db } from "common/data/db";
import styles from "./page.module.css";
import { shares } from "common/entities/shares";
import { candles } from "common/entities/candles";
import { desc, eq } from "drizzle-orm";
import cn from "classnames";
import { calcBuy, calcSell } from 'common/calculates/suggestions';
import { CandleCharts } from "@/components/charts/CandleCharts";

export default async function Share({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const [share] = await db.select().from(shares).where(eq(shares.id, id));
    const allCandles = await db.select().from(candles).where(eq(candles.instrumentId, share.figi)).orderBy(desc(candles.time));

    return (
        <div className={styles.page}>
            <div>Название: {share.name}</div>
            <div>Тикер: {share.ticker}</div>
            <div>Акции</div>
            <div>
                <CandleCharts data={allCandles} />
            </div>
            <div>
                {allCandles.map((candle, index) => (
                    <div key={candle.id} className={cn(styles.candle, {
                        [styles.green]: candle.diff > 0,
                        [styles.red]: candle.diff < 0
                    })}>
                        <div>{candle.time?.toISOString().split('T')[0]}</div>
                        <div>{Math.round(candle.close * 100) / 100}</div>
                        <div>{Math.round(candle.diff * 100) / 100}</div>
                        <div>{Math.round(candle.diffLow * 100) / 100}</div>
                        <div>{Math.round(candle.diffHigh * 100) / 100}</div>
                        <div>{calcBuy(allCandles, index) ? 'buy' : ''}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
