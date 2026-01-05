import { Candle } from "../entities/candles";

export function calcSMA(candles: Candle[]) {
  return candles.reduce((acc, curr) => acc + curr.close, 0) / candles.length;
}

export function calcKoeff(n: number) {
  return 2 / (n + 1);
}

export function calcEMA(candle: Candle, prevEMA: number, k: number) {
  return candle.close * k + prevEMA * (1 - k);
}

export function calcTR(candle: Candle, prev: Candle) {
  return Math.max(
    candle.high - candle.low,
    Math.abs(candle.high - prev.close),
    Math.abs(candle.low - prev.close)
  );
}

export function calcAvgTR(candles: Candle[]) {
  return (
    candles.reduce(
      (acc, curr, index) =>
        index > 0 ? acc + calcTR(curr, candles[index - 1]) : 0,
      0
    ) /
      candles.length -
    1
  );
}

export function calcATR(tr: number, prevATR: number, n: number) {
  return (prevATR * (n - 1) + tr) / n;
}
