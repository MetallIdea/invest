'use client';
import styles from "./HomePage.module.css";
import { useNotificationsSW } from "@/hooks/useNotificationsSW";
import { HomeState, setHomeInitialData } from "./homeSlice";
import { BaseCard } from "@/components/cards/BaseCard";
import { memo } from "react";
import { SharesFilter } from "@/components/SharesFilter/SharesFilter";
import { useAppSelector } from "@/state/store";
import { ShareWithCandles } from "common/src/entities/shares";
import { useSetInitialData } from "@/hooks/useSetInitialData";
import { Candle } from "common/src/entities/candles";
import cn from 'classnames';

const calcMacd = (candles: Candle[]) => {
    if (candles.length > 3 && candles[0].macd && candles[1].macd && candles[2].macd && candles[3].macd && candles[0].macd > candles[1].macd &&
        candles[1].macd > candles[2].macd &&
        candles[2].macd < candles[3].macd
    ) {
        return 'ВнизВВерх'
    }

    return 'Ничего'
}

const calcSMA = (candles: Candle[]) => {
    if (candles.length > 3 && candles[0]?.sma27 && candles[3]?.sma27 && candles[0].sma27 > candles[3].sma27
    ) {
        return 'Рост'
    }

    return 'Ничего'
}

type Props = {
    initialData: Partial<HomeState>;
}

export const HomePage = memo(({ initialData }: Props) => {
    useSetInitialData(setHomeInitialData(initialData));

    const { sharesWithCandles, filters, sort } = useAppSelector(state => state.home);

    useNotificationsSW();

    const filterFunction = (share: ShareWithCandles) => {
        return share.name?.includes(filters.search) &&
            (!filters.minProfit || share.candles[0]?.diff > Number(filters.minProfit))
    }

    const sortFunction = (a: ShareWithCandles, b: ShareWithCandles) => {
        if (a.candles[0] && b.candles[0]) {
            return sort.price ? a.candles[0].diff - b.candles[0].diff : b.candles[0].diff - a.candles[0].diff;
        }
        return 0;
    }

    return <div>
        <SharesFilter />

        <div
            className={styles.items}>
            {
                sharesWithCandles?.filter(filterFunction).sort(sortFunction).map((share) => (
                    <BaseCard
                        key={share.id}
                        className={cn(styles.item, {
                            [styles.green]: calcMacd(share.candles) === 'ВнизВВерх',
                        })}
                        title={<a href={`/shares/${share.id}`}>{share.ticker}</a>}
                        rightTitle={<a
                            href={`https://www.tbank.ru/invest/stocks/${share.ticker}`}
                            target={'_blank'}
                        >{share.candles[0]?.close}
                        </a>}
                        items={[
                            {
                                value: calcMacd(share.candles),
                            },
                            {
                                value: calcSMA(share.candles),
                            },
                            {
                                value: share.candles[0]?.diff
                            }
                        ]}
                    />
                ))
            }
        </div>
    </div>;
});