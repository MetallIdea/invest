import * as schedule from "node-schedule";
import { fetchActualShares } from "./fetchActualShares";
import { fetchLastCandles } from "./fetchLastCandles";
import { calculateSuggestions } from "./calculateSuggestions";
import { calculateCandleParameters } from "./calculateCandleParameters";
import { fetchOldCandles } from "./fetchOldCandles";
import { calculateLast30CandleParameters } from "./calculateLast30CandleParameters";
import { calculateCandleCustomParameters } from "./calculateCandleCustomParameters";

export const JOB_DEFINITIONS: Record<string, () => void> = {
  fetchActualShares: fetchActualShares,
  fetchLastCandles: fetchLastCandles,
  fetchOldCandles: fetchOldCandles,
  calculateCandleParameters: calculateCandleParameters,
  calculateLast30CandleParameters: calculateLast30CandleParameters,
  calculateSuggestions: calculateSuggestions,
  calculateCandleCustomParameters: calculateCandleCustomParameters,
};

export const runningJobs: schedule.Job[] = [];
