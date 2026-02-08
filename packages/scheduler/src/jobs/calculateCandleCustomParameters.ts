import { db } from "common/src/data/db";
import { Candle, candles } from "common/src/entities/candles";
import { candlesParams } from "common/src/entities/candlesParams";
import { candlesParamsValues } from "common/src/entities/candlesParamsValues";
import { shares } from "common/src/entities/shares";
import { eq } from "drizzle-orm";

export async function calculateCandleCustomParameters() {
  console.log("Start calculateCandleCustomParameters");
  console.time("End calculateCandleCustomParameters");

  const allCandleParams = await db.select().from(candlesParams);

  const allShares = await db
    .select()
    .from(shares)
    .where(eq(shares.countryOfRisk, "RU"));

  // Перебираем все инструменты
  for (let i = 0; i < allShares.length; i++) {
    const allCandles = await db
      .select()
      .from(candles)
      .where(eq(candles.instrumentId, allShares[i].figi))
      .orderBy(candles.time);

    for (let j = 0; j < allCandles.length; j++) {
      const candle = allCandles[j];

      await db
        .update(candlesParamsValues)
        .set({})
        .where(eq(candles.id, candle.id));
    }
  }

  console.timeEnd("End calculateCandleCustomParameters");
}
