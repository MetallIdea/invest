import { Candle } from "../entities/candles";
import { Suggestion } from "../entities/suggestions";

export const calcBuy = (allCandles: Candle[], index: number) => {
  if (index < 30) {
    return false;
  }
  const countDays = 7;

  let coundProfitDays = 0;
  let coundProfitSMADays = 0;
  let coundProfitEMADays = 0;

  const startIndex = index - countDays;

  for (let i = 0; i < countDays; i++) {
    if (
      allCandles[startIndex + i - 1].sma50! < allCandles[startIndex + i].sma50!
    ) {
      coundProfitSMADays++;
      if (
        allCandles[startIndex + i - 1].ema12! <
        allCandles[startIndex + i].ema12!
      ) {
        coundProfitEMADays++;
      }
      if (i > 2) {
        if (
          allCandles[startIndex + i - 1].ema12! <
          allCandles[startIndex + i].ema12!
        ) {
          coundProfitDays++;
        }
      } else {
        if (
          allCandles[startIndex + i - 1].ema12! >
          allCandles[startIndex + i].ema12!
        ) {
          coundProfitDays++;
        }
      }
    }
  }

  return (
    (coundProfitSMADays === countDays &&
      coundProfitEMADays === countDays &&
      allCandles[index - 1].ema12! < allCandles[index - 1].sma50! &&
      allCandles[index].ema12! > allCandles[index].sma50!) ||
    (coundProfitDays === countDays &&
      allCandles[index - 1].sma50! < allCandles[index].sma50! &&
      allCandles[index].ema12! > allCandles[index].sma50!)
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
  const countDays = 6;

  let countLossDays = 0;

  const startIndex = index - countDays;

  for (let i = 0; i < countDays; i++) {
    if (i > 2) {
      if (
        allCandles[startIndex + i - 1].ema12! >
        allCandles[startIndex + i].ema12!
      ) {
        countLossDays++;
      }
    } else {
      if (
        allCandles[startIndex + i - 1].ema12! <
        allCandles[startIndex + i].ema12!
      ) {
        countLossDays++;
      }
    }
  }

  return countLossDays === countDays;
};
