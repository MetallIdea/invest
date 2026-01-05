"use server";

import * as schedule from "node-schedule";
import { getAllJobs, updateJob } from "common/src/repositories/jobs";
import { fetchActualShares } from "./fetchActualShares";
import { fetchLastCandles } from "./fetchLastCandles";
import { calculateSuggestions } from "./calculateSuggestions";
import { runningJobs } from "./runningJobs";
import { calculateCandleParameters } from "./calculateCandleParameters";
import { fetchOldCandles } from "./fetchOldCandles";

const JOB_DEFINITIONS: Record<string, () => void> = {
  fetchActualShares: fetchActualShares,
  fetchLastCandles: fetchLastCandles,
  calculateCandleParameters: calculateCandleParameters,
  calculateSuggestions: calculateSuggestions,
};

export async function initJobs() {
  const jobs = await getAllJobs();

  jobs.forEach((job) => {
    const runningJob = schedule.scheduleJob(
      job.schedule,
      async (fireDate: Date) => {
        await updateJob(job.id, {
          lastRun: fireDate,
          nextRun: runningJob.nextInvocation(),
        });
        await JOB_DEFINITIONS[job.method]();
      }
    );

    runningJobs.push(runningJob);
  });
}
