import styles from "./page.module.css";
import { desc, eq, gt, or } from "drizzle-orm";
import { suggestions } from 'common/src/entities/suggestions';
import { shares } from 'common/src/entities/shares';
import { db } from "common/src/data/db";
import { BaseCard } from "@/components/cards/BaseCard";
import { dateFormat } from "common/src/utils/time";

export default async function Home() {
  const date = new Date();

  if (date.getDay() === 6 || date.getDay() === 0) {
    date.setDate(date.getDate() - 3);
  } else {
    date.setDate(date.getDate() - 1);
  }

  const lastSuggestions = await db.select().from(suggestions)
    .where(or(gt(suggestions.buyTime, date), gt(suggestions.sellTime, date)))
    .innerJoin(shares, eq(shares.id, suggestions.instrumentId))
    .orderBy(suggestions.sell);



  const allSuggestions = await db.select().from(suggestions)
    .innerJoin(shares, eq(shares.id, suggestions.instrumentId))
    .orderBy(desc(suggestions.buyTime));

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
            allSuggestions.map(({ invest_shares: share, invest_suggestions: suggestion }) => (
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
    </div>
  );
}
