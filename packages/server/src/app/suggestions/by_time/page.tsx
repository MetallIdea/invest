import { desc, eq } from "drizzle-orm";
import { suggestions } from 'common/entities/suggestions';
import { shares } from 'common/entities/shares';
import { db } from "common/data/db";
import Link from "next/link";

import styles from './page.module.css';
import { dateFormat } from "@/utils/time";
import { BaseCard } from "@/components/cards/BaseCard";
import { Button } from "@vkontakte/vkui";

export default async function SuggestionsByTime() {
    const allSuggestion = await db.select().from(suggestions).innerJoin(shares, eq(shares.figi, suggestions.instrumentId)).orderBy(desc(suggestions.buyTime));

    return (
        <div className={styles.page}>
            {
                allSuggestion.map(({ invest_shares: share, invest_suggestions: suggestion }) => (
                    <BaseCard
                        key={suggestion.id}
                        className={styles.item}
                        title={share.name}
                        rightTitle={<Button
                            href={`https://www.tbank.ru/invest/stocks/${share.ticker}`}
                            target={'_blank'}
                        >{suggestion.sell ? 'Продать' : 'Купить'}
                        </Button>}
                        items={[
                        {
                            value: suggestion.buy,
                        },
                        {
                            value: suggestion.buyTime ? dateFormat(suggestion.buyTime) : null,
                        },
                        {
                            value: suggestion.sell
                        },
                        {
                            value: suggestion.sellTime ? dateFormat(suggestion.sellTime) : null,
                        }
                        ]}
                    />
                ))
            }
        </div>
    );
}
