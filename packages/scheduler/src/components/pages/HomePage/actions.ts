"use server";

import { runJob, stopJob } from "@/jobs/methods";
import { db } from "common/src/data/db";
import { Job, jobs } from "common/src/entities/jobs";
import { eq } from "drizzle-orm";

export async function saveJobs(jobsToUpdate: Job[]) {
  for (const jobToUpdate of jobsToUpdate) {
    await db.update(jobs).set(jobToUpdate).where(eq(jobs.id, jobToUpdate.id));

    if (jobToUpdate.isEnabled) {
      await runJob({
        jobId: jobToUpdate.id,
        schedule: jobToUpdate.schedule,
      });
    } else {
      await stopJob(jobToUpdate.id);
    }
  }
}
