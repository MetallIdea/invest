import { db } from "common/src/data/db";
import styles from "./page.module.css";
import { shares } from "common/src/entities/shares";
import { candles } from "common/src/entities/candles";
import { and, desc, eq, gte } from "drizzle-orm";
import cn from "classnames";
import { CandleCharts } from "@/components/charts/CandleCharts";
import { suggestions } from "common/src/entities/suggestions";

const getInitialData = async ({ id }: { id: string }) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    const share = await db.query.shares.findFirst({
        with: {
            candles: {
                where: and(eq(candles.shareId, id), gte(candles.time, startDate)),
                orderBy: desc(candles.time),
            },
        },
        where: eq(shares.id, id),
    });

    return {
        share,
    }
}

export default async function Share({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const { share } = await getInitialData({ id });

    if (!share) {
        return null;
    }

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
                <CandleCharts data={share.candles} />
            </div>
            <div>
                {share.candles.map((candle) => (
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
