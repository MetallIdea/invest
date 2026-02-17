import { db } from "common/src/data/db";
import { candles } from "common/src/entities/candles";
import { shares } from "common/src/entities/shares";
import { strategies } from "common/src/entities/strategies";
import { suggestions } from "common/src/entities/suggestions";
import { calcBuy } from "common/src/calculates/calcSuggestions";
import { eq } from "drizzle-orm";

export async function calculateSuggestions() {
  console.log("Start calculateSuggestions");
  console.time("End calculateSuggestions");

  const [strategy] = await db
    .select()
    .from(strategies)
    .where(eq(strategies.name, "Простая стратегия"));

  // Удаляем все вычисления стратегии
  await db.delete(suggestions).where(eq(suggestions.strategyId, strategy.id));

  const allShares = await db
    .select()
    .from(shares)
    .where(eq(shares.countryOfRisk, "RU"));

  // Перебираем все инструменты
  for (let i = 0; i < allShares.length; i++) {
    // Берем последнюю свечу
    const allCandles = await db
      .select()
      .from(candles)
      .where(eq(candles.shareId, allShares[i].id))
      .orderBy(candles.time);

    for (let j = 0; j < allCandles.length; j++) {
      const candle = allCandles[j];
      // Вычислить свечи
      if (calcBuy(allCandles, j)) {
        await db.insert(suggestions).values({
          instrumentId: allShares[i].id,
          strategyId: strategy.id,
          buy: candle.close,
          buyTime: candle.time,
          sell: candle.diff,
          sellTime: null,
          max: candle.close,
        });
      }
    }
  }

  console.timeEnd("End calculateSuggestions");
}
