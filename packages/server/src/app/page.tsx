import styles from "./page.module.css";
import { desc, eq, gt, or } from "drizzle-orm";
import { suggestions } from 'common/src/entities/suggestions';
import { shares } from 'common/src/entities/shares';
import { db } from "common/src/data/db";
import { HomePage } from "@/modules/HomePage/HomePage";
import { HomeContextProvider } from "@/modules/HomePage/HomeContext";

export default async function Home() {
  const date = new Date();

  if (date.getDay() === 6 || date.getDay() === 0) {
    date.setDate(date.getDate() - 5);
  } else {
    date.setDate(date.getDate() - 3);
  }

  const lastSuggestions = await db.select().from(suggestions)
    .where(or(gt(suggestions.buyTime, date)))
    .innerJoin(shares, eq(shares.id, suggestions.instrumentId))
    .orderBy(desc(suggestions.sell));

  const allSuggestions = await db.select().from(suggestions)
    .innerJoin(shares, eq(shares.id, suggestions.instrumentId))
    .orderBy(desc(suggestions.buyTime));

  return (
    <div className={styles.page}>
      <HomeContextProvider value={{
        lastSuggestions,
        allSuggestions,
      }}>
        <HomePage />
      </HomeContextProvider>
    </div>
  );
}
