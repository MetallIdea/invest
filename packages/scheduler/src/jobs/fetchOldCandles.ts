import { db } from "common/src/data/db";
import { candles } from "common/src/entities/candles";
import { shares } from "common/src/entities/shares";
import { fetchCandles } from "common/src/requests/cnadles";
import { and, desc, eq } from "drizzle-orm";
import { calcCandle, calcPercent } from "common/src/utils/candles";

export async function fetchOldCandles() {
  console.log("Start fetchOldCandles");
  console.time("End fetchOldCandles");
  const allShares = await db
    .select()
    .from(shares)
    .where(eq(shares.countryOfRisk, "RU"));

  // Перебираем все инструменты
  for (let i = 0; i < allShares.length; i++) {
    for (let year = 0; year < 5; year++) {
      const startTime = new Date();
      startTime.setMonth(startTime.getMonth() - (year + 1) * 12);
      const startTimeISO = startTime.toISOString();
      const endTime = new Date();
      startTime.setMonth(startTime.getMonth() - year * 12);
      const endTimeISO = endTime.toISOString();

      // Делаем запрос в апи инвестиций
      const response = await fetchCandles({
        investApiUrl: process.env.TINVEST_API_URL!,
        investApiToken: process.env.TINVEST_API_TOKEN!,
        instrumentId: allShares[i].figi,
        startTime: startTimeISO,
        endTime: endTimeISO,
      });
      let data: any = { candles: [] };

      if (response.status === 200) {
        try {
          data = await response.json();
        } catch (e) {
          console.log(response.status, e);
          console.log(await response.text());
        }
      }

      if (data.candles) {
        for (let j = 0; j < data.candles.length; j++) {
          const candle = data.candles[j];

          const open = calcCandle(candle.open);
          const close = calcCandle(candle.close);
          const low = calcCandle(candle.low);
          const high = calcCandle(candle.high);

          const min = Math.min(open, close);
          const max = Math.max(open, close);

          const fields = {
            open: calcCandle(candle.open),
            close: calcCandle(candle.close),
            low: calcCandle(candle.low),
            high: calcCandle(candle.high),
            diff: calcPercent(open, close),
            diffLow: Math.abs(calcPercent(min, low)),
            diffHigh: Math.abs(calcPercent(max, high)),
            isComplete: candle.isComplete,
          };

          const [existCandle] = await db
            .select()
            .from(candles)
            .where(
              and(
                eq(candles.instrumentId, allShares[i].figi),
                eq(candles.time, new Date(candle.time))
              )
            );

          if (existCandle) {
            await db
              .update(candles)
              .set({
                ...fields,
              })
              .where(eq(candles.id, existCandle.id));
          } else {
            await db.insert(candles).values({
              instrumentId: allShares[i].figi,
              time: new Date(candle.time),
              ...fields,
            });
          }
        }
      } else {
        console.log("Empty candles", data);
      }
    }
  }

  console.timeEnd("End fetchOldCandles");
}
