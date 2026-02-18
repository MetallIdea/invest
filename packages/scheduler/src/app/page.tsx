import styles from "./page.module.css";
import { initDb } from "@/db/initDB";
import { HomePage } from "@/components/pages/HomePage/HomePage";
import { getAllJobs } from "common/src/repositories/jobs";

export default async function Home() {
  await initDb();

  const jobs = await getAllJobs();

  return (
    <HomePage jobs={jobs} />
  );
}
