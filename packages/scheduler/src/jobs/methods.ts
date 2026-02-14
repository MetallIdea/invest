"use server";

import * as schedule from "node-schedule";
import {
  getAllJobs,
  getJobById,
  updateJob,
} from "common/src/repositories/jobs";
import { JOB_DEFINITIONS, runningJobs } from "./runningJobs";

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
      },
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

  await updateJob(jobId, {
    isRunning: true,
  });

  await JOB_DEFINITIONS[job.method]();

  await updateJob(jobId, {
    isRunning: false,
  });
}

export async function stopJob(jobId: string) {
  const job = await getJobById(jobId);

  const scheduleJob = runningJobs.find(
    (runningJob) => runningJob.name === job.id,
  );

  await scheduleJob?.cancel();

  await updateJob(job.id, {
    nextRun: null,
    isEnabled: false,
  });
}

export async function runJob({
  jobId,
  schedule,
}: {
  jobId: string;
  schedule: string;
}) {
  const scheduleJob = runningJobs.find(
    (runningJob) => runningJob.name === jobId,
  );

  if (scheduleJob) {
    await scheduleJob.reschedule(schedule);

    await updateJob(jobId, {
      nextRun: scheduleJob.nextInvocation(),
      isEnabled: true,
    });
  }
}

export async function getJobsStatus() {
  const jobs = await getAllJobs();

  return jobs;
}
