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

  const k50 = calcKoeff(50);
  const k9 = calcKoeff(9);
  const k12 = calcKoeff(12);
  const k26 = calcKoeff(26);

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
      .orderBy(candles.time);

    let prevCandleParams = null;

    for (let j = 200; j < allCandles.length; j++) {
      const candle = allCandles[j];

      const tr = calcTR(candle, allCandles[j - 1]);

      const newCandleParams: Partial<Candle> = {
        sma27: calcSMA(allCandles.slice(j - 27, j)),
        sma50: calcSMA(allCandles.slice(j - 50, j)),
        sma200: calcSMA(allCandles.slice(j - 200, j)),
        tr,
      };

      newCandleParams.ema9 = prevCandleParams?.ema9
        ? calcEMA(candle.close, prevCandleParams.ema9, k9)
        : candle.close;

      newCandleParams.ema12 = prevCandleParams?.ema12
        ? calcEMA(candle.close, prevCandleParams.ema12, k12)
        : candle.close;

      newCandleParams.ema26 = prevCandleParams?.ema26
        ? calcEMA(candle.close, prevCandleParams.ema26, k26)
        : candle.close;

      newCandleParams.ema50 = prevCandleParams?.ema50
        ? calcEMA(candle.close, prevCandleParams.ema50, k50)
        : candle.close;

      newCandleParams.atr14 = prevCandleParams?.atr14
        ? calcATR(tr, prevCandleParams.atr14, 14)
        : calcATR(tr, calcAvgTR(allCandles.slice(j - 15, j)), 14);

      newCandleParams.macd =
        prevCandleParams?.ema26 && prevCandleParams.ema12
          ? prevCandleParams?.ema12 - prevCandleParams.ema26
          : null;

      newCandleParams.signal =
        newCandleParams.macd && prevCandleParams?.signal
          ? calcEMA(newCandleParams.macd, prevCandleParams.signal, k9)
          : newCandleParams.macd;

      newCandleParams.signalValue =
        newCandleParams?.macd && newCandleParams.signal
          ? newCandleParams?.macd - newCandleParams.signal
          : null;

      await db
        .update(candles)
        .set(newCandleParams)
        .where(eq(candles.id, candle.id));

      prevCandleParams = newCandleParams;
    }
  }

  console.timeEnd("End calculateCandleParameters");
}
