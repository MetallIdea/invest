import { db } from "common/src/data/db";
import styles from "./page.module.css";
import { shares } from "common/src/entities/shares";
import { candles } from "common/src/entities/candles";
import { candlesParams } from "common/src/entities/candlesParams";
import { and, desc, eq, gte } from "drizzle-orm";
import cn from "classnames";
import { calcBuy, calcSell } from 'common/src/calculates/calcSuggestions';
import { CandleCharts } from "@/components/charts/CandleCharts";
import { suggestions } from "common/src/entities/suggestions";

export default async function Share({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const [share] = await db.select().from(shares).where(eq(shares.id, id));
    const allCandles = await db.select().from(candles).where(and(eq(candles.instrumentId, share.figi), gte(candles.time, startDate)))
        .orderBy(desc(candles.time));
    const shareSuggestions = await db.select().from(suggestions).where(and(eq(suggestions.instrumentId, share.id), gte(suggestions.buyTime, startDate)))
        .orderBy(desc(suggestions.buyTime));

    return (
        <div className={styles.page}>
            <div>Название: {share.name}</div>
            <div>Тикер: {share.ticker}</div>
            <div><a
                href={`https://www.tbank.ru/invest/stocks/${share.ticker}`}
                target={'_blank'}
            >Перейти
            </a></div>
            <div>
                <CandleCharts data={allCandles} suggestions={shareSuggestions} />
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
                    </div>
                ))}
            </div>
        </div>
    );
}
