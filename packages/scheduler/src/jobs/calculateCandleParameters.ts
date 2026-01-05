import { db } from "common/src/data/db";
import { Candle, candles } from "common/src/entities/candles";
import { shares } from "common/src/entities/shares";
import { CandleParams, candlesParams } from "common/src/entities/candlesParams";
import { desc, eq } from "drizzle-orm";
import {
  calcATR,
  calcAvgTR,
  calcEMA,
  calcKoeff,
  calcSMA,
  calcTR,
} from "common/src/calculates/calcCandleParameters";

export async function calculateCandleParameters() {
  console.log("Start calculateCandleParameters");
  console.time("End calculateCandleParameters");

  const k = calcKoeff(50);

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

    let prevCandleParams = null;

    for (let j = 200; j < allCandles.length; j++) {
      const candle = allCandles[j];

      const tr = calcTR(candle, allCandles[j - 1]);

      const newCandleParams: Partial<Candle> = {
        sma200: calcSMA(allCandles.slice(j - 200, j)),
        tr,
      };

      newCandleParams.ema50 = prevCandleParams?.ema50
        ? calcEMA(candle, prevCandleParams.ema50, k)
        : newCandleParams.sma200;

      newCandleParams.atr14 = prevCandleParams?.atr14
        ? calcATR(tr, prevCandleParams.atr14, 14)
        : calcATR(tr, calcAvgTR(allCandles.slice(j - 15, j)), 14);

      await db
        .update(candles)
        .set(newCandleParams)
        .where(eq(candles.id, candle.id));

      prevCandleParams = newCandleParams;
    }
  }

  console.timeEnd("End calculateCandleParameters");
}
