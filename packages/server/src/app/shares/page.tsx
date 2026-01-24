import { db } from "common/src/data/db";
import styles from "./page.module.css";
import { shares } from "common/src/entities/shares";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Candle, candles } from "common/src/entities/candles";
import { round } from 'common/src/utils/candles';
import cn from 'classnames';

export default async function Shares() {
    const allShares = await db.select().from(shares).where(eq(shares.countryOfRisk, 'RU')).orderBy(shares.name);

    const lastCandles = await Promise.all(allShares.map(share => db.select().from(candles).where(eq(candles.instrumentId, share.figi)).limit(10).orderBy(desc(candles.time))))

    const calcUp = (candles: Candle[]) => {
        if (candles.length === 0) {
            return false;
        }
        return candles[0]?.close - candles[9]?.close > 0;
    }

    return (
        <div className={styles.page}>
            <div>
                {allShares.map((share, index) => (
                    <Link className={cn({
                        [styles.green]: calcUp(lastCandles[index])
                    })} key={share.id} href={`/shares/${share.id}`}>
                        <div>{share.name}</div>
                        <div>{lastCandles[index][0]?.close}</div>
                        <div>{round(lastCandles[index][0]?.close - lastCandles[index][9]?.close, 4)}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
