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
        if (sort.price !== undefined) {
            if (a.candles[0] && b.candles[0]) {
                return sort.price ? a.candles[0].diff - b.candles[0].diff : b.candles[0].diff - a.candles[0].diff;
            }
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
                        className={styles.item}
                        title={<a href={`/shares/${share.id}`}>{share.ticker}</a>}
                        rightTitle={<a
                            href={`https://www.tbank.ru/invest/stocks/${share.ticker}`}
                            target={'_blank'}
                        >{share.candles[0]?.close}
                        </a>}
                        items={[
                            {
                                value: (share.candles[0]?.macd ?? 0) - (share.candles[1]?.macd ?? 0),
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