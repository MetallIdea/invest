export const calcBuy = (allCandles: any[], index: number) => {
  const candle = allCandles[index];
  return candle.diffHigh > 1 && candle.diffHigh > candle.diffLow * 3;
};

export const calcSell = ({
  allCandles,
  index,
  days,
  currentSuggestion,
}: {
  allCandles: any[];
  index: number;
  days: number;
  currentSuggestion: any;
}) => {
  const candle = allCandles[index];
  return days > 1 || candle.diffLow > candle.diffHigh * 3;
};
