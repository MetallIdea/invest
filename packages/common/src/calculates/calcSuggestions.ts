import { Candle } from "../entities/candles";
import { Suggestion } from "../entities/suggestions";

export const calcBuy = (allCandles: Candle[], index: number) => {
  if (index < 30) {
    return false;
  }

  return (
    allCandles[index - 2].signalValue! > allCandles[index - 1].signalValue! &&
    allCandles[index - 1].signalValue! * 2 < allCandles[index].signalValue!
  );
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
  currentSuggestion?: Suggestion;
}) => {
  if (index < 30) {
    return false;
  }
  return (
    allCandles[index - 2].signalValue! < allCandles[index - 1].signalValue! &&
    allCandles[index - 1].signalValue! > allCandles[index].signalValue! * 2
  );
};
