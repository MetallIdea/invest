import { db } from "common/src/data/db";
import { candles } from "common/src/entities/candles";
import { shares } from "common/src/entities/shares";
import { fetchCandles } from "common/src/requests/cnadles";
import { desc, eq } from "drizzle-orm";
import { calcCandle, calcPercent } from "../utils/candles";
import { globalStore } from "../globalStore";

export async function fetchLastCandles() {
  console.log("Start fetchLastCandles");
  console.time("End fetchLastCandles");
  const allShares = await db
    .select()
    .from(shares)
    .where(eq(shares.countryOfRisk, "RU"));

  // Перебираем все инструменты
  for (let i = 0; i < allShares.length; i++) {
    // Берем последнюю свечу
    const [lastCandle] = await db
      .select()
      .from(candles)
      .where(eq(candles.instrumentId, allShares[i].figi))
      .limit(1)
      .orderBy(desc(candles.time));

    let startTime = new Date();
    let startTimeISO = "";
    const endTime = new Date();
    const endTimeISO = endTime.toISOString();

    if (lastCandle?.time) {
      // Если свеча есть то берем ее время
      startTime = new Date(lastCandle.time);
      startTime.setDate(startTime.getDate());
    } else {
      startTime.setMonth(startTime.getMonth() - 12);
    }
    startTimeISO = startTime.toISOString();

    // Делаем запрос в апи инвестиций
    const response = await fetchCandles({
      investApiUrl: globalStore.investApiUrl,
      investApiToken: globalStore.investApiToken,
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

        if (lastCandle && lastCandle.time === candle.time) {
          await db
            .update(candles)
            .set({
              ...fields,
            })
            .where(eq(candles.id, lastCandle.id));
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

  console.timeEnd("End fetchLastCandles");
}
