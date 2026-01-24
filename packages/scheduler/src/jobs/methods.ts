"use server";

import * as schedule from "node-schedule";
import {
  getAllJobs,
  getJobById,
  updateJob,
} from "common/src/repositories/jobs";
import { fetchActualShares } from "./fetchActualShares";
import { fetchLastCandles } from "./fetchLastCandles";
import { calculateSuggestions } from "./calculateSuggestions";
import { runningJobs } from "./runningJobs";
import { calculateCandleParameters } from "./calculateCandleParameters";
import { fetchOldCandles } from "./fetchOldCandles";
import { calculateLast30CandleParameters } from "./calculateLast30CandleParameters";

const JOB_DEFINITIONS: Record<string, () => void> = {
  fetchActualShares: fetchActualShares,
  fetchLastCandles: fetchLastCandles,
  fetchOldCandles: fetchOldCandles,
  calculateCandleParameters: calculateCandleParameters,
  calculateLast30CandleParameters: calculateLast30CandleParameters,
  calculateSuggestions: calculateSuggestions,
};

export async function initJobs() {
  console.log("Запуск всех заданий");
  const jobs = await getAllJobs();

  for (const job of jobs) {
    const runningJob = schedule.scheduleJob(
      job.id,
      job.schedule,
      async (fireDate: Date) => {
        await updateJob(job.id, {
          lastRun: fireDate,
          nextRun: runningJob.nextInvocation(),
          isRunning: true,
        });
        await JOB_DEFINITIONS[job.method]();

        await updateJob(job.id, {
          isRunning: false,
        });
      }
    );

    await updateJob(job.id, {
      isEnabled: true,
      isRunning: false,
      nextRun: runningJob.nextInvocation(),
    });

    runningJobs.push(runningJob);
  }
  console.log("Запуск всех заданий завершен");
}

export async function runJobOnce(jobId: string) {
  const job = await getJobById(jobId);

  await JOB_DEFINITIONS[job.method]();
}

export async function stopJob(jobId: string) {
  const job = await getJobById(jobId);

  const scheduleJob = runningJobs.find(
    (runningJob) => runningJob.name === job.id
  );

  await scheduleJob?.cancel();

  await updateJob(job.id, {
    isEnabled: false,
  });
}

export async function runJob(jobId: string) {
  const scheduleJob = runningJobs.find(
    (runningJob) => runningJob.name === jobId
  );

  if (scheduleJob) {
    await scheduleJob.cancel(true);

    await updateJob(jobId, {
      isEnabled: true,
    });
  }
}
