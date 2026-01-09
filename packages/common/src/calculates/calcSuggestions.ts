import { Candle } from "../entities/candles";
import { Suggestion } from "../entities/suggestions";

export const calcBuy = (allCandles: Candle[], index: number) => {
  if (index < 30) {
    return false;
  }
  const countDays = 4;

  let coundProfitDays = 0;

  const startIndex = index - countDays;

  for (let i = 0; i < countDays; i++) {
    if (
      allCandles[startIndex + i - 1].sma200! <
      allCandles[startIndex + i].sma200!
    ) {
      if (i > 2) {
        if (
          allCandles[startIndex + i - 1].ema50! <
          allCandles[startIndex + i].ema50!
        ) {
          coundProfitDays++;
        }
      } else {
        if (
          allCandles[startIndex + i - 1].ema50! >
          allCandles[startIndex + i].ema50!
        ) {
          coundProfitDays++;
        }
      }
    }
  }

  return (
    coundProfitDays === countDays &&
    allCandles[index - 1].sma200! < allCandles[index].sma200! &&
    allCandles[index].ema50! > allCandles[index].sma200!
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
  const countDays = 4;

  let countLossDays = 0;

  const startIndex = index - countDays;

  for (let i = 0; i < countDays; i++) {
    if (i > 2) {
      if (
        allCandles[startIndex + i - 1].ema50! >
        allCandles[startIndex + i].ema50!
      ) {
        countLossDays++;
      }
    } else {
      if (
        allCandles[startIndex + i - 1].ema50! <
        allCandles[startIndex + i].ema50!
      ) {
        countLossDays++;
      }
    }
  }

  return countLossDays === countDays;
};
