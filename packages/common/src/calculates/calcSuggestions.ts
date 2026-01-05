import { Candle } from "../entities/candles";

export const calcBuy = (allCandles: Candle[], index: number) => {
  if (index < 1) {
    return false;
  }
  const candle = allCandles[index];
  const prevCandle = allCandles[index - 1];

  if (
    !prevCandle.ema50 ||
    !prevCandle.sma200 ||
    !candle.ema50 ||
    !candle.sma200
  ) {
    return false;
  }
  return prevCandle.ema50 > prevCandle.sma200 && candle.ema50 <= candle.sma200;
};

export const calcSell = ({
  allCandles,
  index,
  days,
  currentSuggestion,
}: {
  allCandles: Candle[];
  index: number;
  days: number;
  currentSuggestion: any;
}) => {
  if (index === 0) {
    return false;
  }
  const candle = allCandles[index];
  const prevCandle = allCandles[index - 1];

  if (
    !prevCandle.ema50 ||
    !prevCandle.sma200 ||
    !candle.ema50 ||
    !candle.sma200
  ) {
    return false;
  }
  return prevCandle.ema50 < prevCandle.sma200 && candle.ema50 >= candle.sma200;
};
