import { Candle } from "../entities/candles";
import { Suggestion } from "../entities/suggestions";
import { calcPercent } from "../utils/candles";

export const calcBuy = (allCandles: Candle[], index: number) => {
  if (index < 30) {
    return false;
  }
  return (
    allCandles[index - 15].sma27! < allCandles[index].sma27! &&
    allCandles[index - 1].signalValue! < 0 &&
    allCandles[index].signalValue! > 0 &&
    allCandles[index - 2].signalValue! < allCandles[index - 1].signalValue! &&
    allCandles[index - 1].signalValue! < allCandles[index].signalValue!
  );
};

export const calcSell = ({
  allCandles,
  index,
}: {
  allCandles: Candle[];
  index: number;
}) => {
  if (index < 30) {
    return false;
  }

  return (
    allCandles[index].signalValue! > 0 &&
    allCandles[index - 2].signalValue! < allCandles[index - 1].signalValue! &&
    allCandles[index - 1].signalValue! > allCandles[index].signalValue!
  );
};
