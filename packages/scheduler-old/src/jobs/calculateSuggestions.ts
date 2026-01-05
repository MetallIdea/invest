import { db } from "common/src/data/db";
import { candles } from "common/src/entities/candles";
import { shares } from "common/src/entities/shares";
import { strategies } from "common/src/entities/strategies";
import { suggestions } from "common/src/entities/suggestions";
import { calcBuy, calcSell } from "common/src/calculates/calcSuggestions";
import { desc, eq } from "drizzle-orm";

export async function calculateSuggestions() {
  console.log("Start calculateSuggestions");
  console.time("End calculateSuggestions");

  let money = 0;

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
      .where(eq(candles.instrumentId, allShares[i].figi))
      .orderBy(candles.time);

    let days = 0;
    let currentSuggestion: any = null;

    for (let j = 0; j < allCandles.length; j++) {
      const candle = allCandles[j];
      // Вычислить свечи
      if (!currentSuggestion && calcBuy(allCandles, j)) {
        currentSuggestion = {
          instrumentId: allShares[i].figi,
          strategyId: strategy.id,
          buy: candle.close,
          buyTime: candle.time,
          sell: null,
          sellTime: null,
        };
        const [{ id }] = await db
          .insert(suggestions)
          .values(currentSuggestion)
          .returning({
            id: suggestions.id,
          });
        currentSuggestion.id = id;
      } else if (
        currentSuggestion &&
        calcSell({
          allCandles,
          index: j,
          days,
          currentSuggestion,
        })
      ) {
        currentSuggestion.sell = candle.close;
        currentSuggestion.sellTime = candle.time;

        await db
          .update(suggestions)
          .set({
            sell: currentSuggestion.sell,
            sellTime: currentSuggestion.sellTime,
          })
          .where(eq(suggestions.id, currentSuggestion.id));

        money += currentSuggestion.sell - currentSuggestion.buy;

        currentSuggestion = null;
        days = 0;
      } else {
        days++;
      }
    }

    currentSuggestion = null;
  }

  console.log(money);

  console.timeEnd("End calculateSuggestions");
}
