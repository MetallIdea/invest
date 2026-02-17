import { db } from "common/src/data/db";
import { evalFunction } from "common/src/utils/evalFunction";
import { candles } from "common/src/entities/candles";
import { candlesParams } from "common/src/entities/candlesParams";
import { candlesParamsValues } from "common/src/entities/candlesParamsValues";
import { shares } from "common/src/entities/shares";
import { and, eq } from "drizzle-orm";
import { calcSMA } from "common/src/calculates/calcCandleParameters";

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
      .where(eq(candles.shareId, allShares[i].id))
      .orderBy(candles.time)
      .limit(100);

    for (let j = 0; j < allCandles.length; j++) {
      const candle = allCandles[j];

      for (const candleParam of allCandleParams) {
        const value = evalFunction(candleParam.calculate, {
          allCandles,
          index: j,
          sma: calcSMA,
        });

        const [existParam] = await db
          .select()
          .from(candlesParamsValues)
          .where(
            and(
              eq(candlesParamsValues.candleId, candle.id),
              eq(candlesParamsValues.paramId, candleParam.id),
            ),
          );

        if (value !== undefined) {
          if (existParam) {
            await db
              .update(candlesParamsValues)
              .set({
                value,
              })
              .where(
                and(
                  eq(candlesParamsValues.candleId, candle.id),
                  eq(candlesParamsValues.paramId, candleParam.id),
                ),
              );
          } else {
            await db.insert(candlesParamsValues).values({
              candleId: candle.id,
              paramId: candleParam.id,
              value,
            });
          }
        }
      }
    }
  }

  console.timeEnd("End calculateCandleCustomParameters");
}
