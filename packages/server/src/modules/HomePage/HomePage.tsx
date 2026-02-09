'use client';
import styles from "./HomePage.module.css";
import { useNotificationsSW } from "@/hooks/useNotificationsSW";
import { dateFormat } from "common/src/utils/time";
import { useHomeContext } from "./HomeContext";
import { BaseCard } from "@/components/cards/BaseCard";
import { useCallback, useRef, useState } from "react";
import { SharesFilter } from "@/components/SharesFilter/SharesFilter";

export const HomePage = () => {
    const { allSharesWithLastCandles, lastSuggestions, allSuggestions } = useHomeContext();

    const [filters, setFilters] = useState({ search: '', minProfit: '' });

    const [isShowLastGrowth, setIsShowLastGrowth] = useState(true);
    const intersectedItems = useRef<Record<string, string>>({});

    useNotificationsSW();

    const toggleLastGrowth = () => {
        setIsShowLastGrowth(state => !state);
    }

    const handleIntersection = useCallback((id: string) => () => {
        if (!intersectedItems.current[id]) {
            intersectedItems.current[id] = 'pending';
            console.log(id);
        }
    }, [intersectedItems]);

    const filterFunction = ({ invest_shares: share, invest_candles: candle }: any) => {
        return share.name?.includes(filters.search) &&
            (!filters.minProfit || candle.diff > Number(filters.minProfit))
    }

    return <div>
        <SharesFilter onSubmit={setFilters} />
        <div>
            <div onClick={toggleLastGrowth}>
                Последний рост
            </div>
            {
                isShowLastGrowth && (
                    <div
                        className={styles.items}>
                        {
                            allSharesWithLastCandles.filter(filterFunction).map(({ invest_shares: share, invest_candles: candle }) => (
                                <BaseCard
                                    key={candle.id}
                                    className={styles.item}
                                    title={<a href={`/shares/${share.id}`}>{share.name} ({share.figi})</a>}
                                    rightTitle={<a
                                        href={`https://www.tbank.ru/invest/stocks/${share.ticker}`}
                                        target={'_blank'}
                                    >Купить
                                    </a>}
                                    items={[
                                        {
                                            label: candle.time ? dateFormat(candle.time) : null,
                                            value: candle.close,
                                        },
                                        {
                                            value: candle.diff
                                        }
                                    ]}
                                    onIntersection={handleIntersection(share.id)}
                                />
                            ))
                        }
                    </div>
                )
            }
        </div>
        <div>
            <div>
                Последние 3 дня
            </div>
            <div
                className={styles.items}>
                {
                    lastSuggestions.filter(({ invest_shares: share }) => share.name?.includes(filters.search)).map(({ invest_shares: share, invest_suggestions: suggestion }) => (
                        <BaseCard
                            key={suggestion.id}
                            className={styles.item}
                            title={<a href={`/shares/${share.id}`}>{share.name} ({share.figi})</a>}
                            rightTitle={<a
                                href={`https://www.tbank.ru/invest/stocks/${share.ticker}`}
                                target={'_blank'}
                            >{suggestion.sell ? 'Продать' : 'Купить'}
                            </a>}
                            items={[
                                {
                                    label: suggestion.buyTime ? dateFormat(suggestion.buyTime) : null,
                                    value: suggestion.buy,
                                },
                                {
                                    label: suggestion.sellTime ? dateFormat(suggestion.sellTime) : null,
                                    value: <div className={suggestion.sell > 0 ? styles.green : styles.red}>{suggestion.sell}</div>
                                }
                            ]}
                        />
                    ))
                }
            </div>
        </div>
        <div>
            <div>Все</div>
            <div
                className={styles.items}>
                {
                    allSuggestions.filter(({ invest_shares: share }) => share.name?.includes(filters.search)).map(({ invest_shares: share, invest_suggestions: suggestion }) => (
                        <BaseCard
                            key={suggestion.id}
                            className={styles.item}
                            title={<a href={`/shares/${share.id}`}>{share.name}</a>}
                            rightTitle={<a
                                href={`https://www.tbank.ru/invest/stocks/${share.ticker}`}
                                target={'_blank'}
                            >{suggestion.sell ? 'Продать' : 'Купить'}
                            </a>}
                            items={[
                                {
                                    label: suggestion.buyTime ? dateFormat(suggestion.buyTime) : null,
                                    value: suggestion.buy,
                                },
                                {
                                    label: suggestion.sellTime ? dateFormat(suggestion.sellTime) : null,
                                    value: <div className={suggestion.sell && suggestion.buy && suggestion.sell - suggestion.buy > 0 ? styles.green : styles.red}>{suggestion.sell}</div>
                                }
                            ]}
                        />
                    ))
                }
            </div>
        </div>
    </div>;
}