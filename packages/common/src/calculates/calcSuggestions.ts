import { Candle } from "../entities/candles";

export const calcBuy = (allCandles: Candle[], index: number) => {
  if (index < 30) {
    return false;
  }
  const candle = allCandles[index];
  const prevCandle = allCandles[index - 1];
  const countDays = 10;

  let coundProfitDays = 0;
  const koeff = 1.01;

  for (let i = index - countDays; i < index; i++) {
    if (
      allCandles[i - 1].sma200! < allCandles[i].sma200! &&
      allCandles[i - 1].ema50! < allCandles[i].ema50!
    ) {
      coundProfitDays++;
    }
  }

  if (
    !prevCandle.ema50 ||
    !prevCandle.sma200 ||
    !candle.ema50 ||
    !candle.sma200
  ) {
    return false;
  }
  return coundProfitDays >= 9;
};

export const calcSell = ({
  allCandles,
  index,
  days,
  currentSuggestion,
}: {
  allCandles: Candle[];
  index: number;
  days?: number;
  currentSuggestion?: any;
}) => {
  if (index < 30) {
    return false;
  }
  const candle = allCandles[index];
  const prevCandle = allCandles[index - 1];
  const countLossDays = 5;

  let coundLossDays = 0;

  for (let i = index - countLossDays; i < index; i++) {
    if (allCandles[i - 1].ema50! > allCandles[i].ema50!) {
      coundLossDays++;
    }
  }

  if (
    !prevCandle.ema50 ||
    !prevCandle.sma200 ||
    !candle.ema50 ||
    !candle.sma200
  ) {
    return false;
  }
  return coundLossDays >= 3;
};
