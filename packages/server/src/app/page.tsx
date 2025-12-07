import styles from "./page.module.css";
import { eq, gt, or } from "drizzle-orm";
import { suggestions } from 'common/entities/suggestions';
import { shares } from 'common/entities/shares';
import { db } from "common/data/db";
import { Button } from "@vkontakte/vkui";
import { BaseCard } from "@/components/cards/BaseCard";
import { dateFormat } from "@/utils/time";

export default async function Home() {
  const date = new Date();

  if (date.getDay() === 6 || date.getDay() === 0) {
    date.setDate(date.getDate() - 3);
  } else {
    date.setDate(date.getDate() - 1);
  }

  const lastSuggestions = await db.select().from(suggestions)
    .where(or(gt(suggestions.buyTime, date), gt(suggestions.sellTime, date)))
    .innerJoin(shares, eq(shares.figi, suggestions.instrumentId))
    .orderBy(suggestions.sell);

  return (
    <div className={styles.page}>
      <div>
        <div>
          Последние 3 дня
        </div>
        <div
          className={styles.items}>
          {
            lastSuggestions.map(({ invest_shares: share, invest_suggestions: suggestion }) => (
              <BaseCard
                key={suggestion.id}
                className={styles.item}
                title={<a href={`/shares/${share.id}`}>{share.name}</a>}
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
                    value: <div className={suggestion.sell - suggestion.buy > 0 ? styles.green : styles.red}>{suggestion.sell}</div>
                  },
                  {
                    value: suggestion.sellTime ? dateFormat(suggestion.sellTime) : null,
                  }
                ]}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}
