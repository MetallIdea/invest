'use client';
import styles from "./HomePage.module.css";
import { useNotificationsSW } from "@/hooks/useNotificationsSW";
import { dateFormat } from "common/src/utils/time";
import { useHomeContext } from "./HomeContext";
import { BaseCard } from "@/components/cards/BaseCard";
import { useState } from "react";
import { Input } from "antd";

export const HomePage = () => {
    const { lastSuggestions, allSuggestions } = useHomeContext();

    const [search, setSearch] = useState('');

    useNotificationsSW();

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    return <div>
        <Input value={search} onChange={handleChange} />
        <div>
            Последние 3 дня
        </div>
        <div
            className={styles.items}>
            {
                lastSuggestions.filter(({ invest_shares: share }) => share.name?.includes(search)).map(({ invest_shares: share, invest_suggestions: suggestion }) => (
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
                                value: suggestion.buy,
                            },
                            {
                                value: suggestion.buyTime ? dateFormat(suggestion.buyTime) : null,
                            },
                            {
                                value: <div className={suggestion.sell && suggestion.buy && suggestion.sell - suggestion.buy > 0 ? styles.green : styles.red}>{suggestion.sell}</div>
                            },
                            {
                                value: suggestion.sellTime ? dateFormat(suggestion.sellTime) : null,
                            }
                        ]}
                    />
                ))
            }
        </div>
        <div>
            <div>Все</div>
            {
                allSuggestions.filter(({ invest_shares: share }) => share.name?.includes(search)).map(({ invest_shares: share, invest_suggestions: suggestion }) => (
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
    </div>;
}