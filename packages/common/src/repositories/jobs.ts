import { eq } from "drizzle-orm";
import { db } from "../data/db";
import { Job, jobs } from "../entities/jobs";

export async function getAllJobs() {
  return await db.select().from(jobs);
}

export async function getJobById(id: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
  return job;
}

export async function createJob(job: {
  name: string;
  schedule: string;
  method: string;
}) {
  return await db.insert(jobs).values(job);
}

export async function updateJob(
  id: string,
  job: Partial<Job>
) {
  return await db.update(jobs).set(job).where(eq(jobs.id, id));
}

export async function deleteJob(id: string) {
  await db.delete(jobs).where(eq(jobs.id, id));
}

export async function deleteAllJobsYesIWant() {
  await db.delete(jobs);
}
