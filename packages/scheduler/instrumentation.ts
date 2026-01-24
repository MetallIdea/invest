import { initJobs } from "@/jobs/methods";

// instrumentation.ts or app/instrumentation.ts
export async function register() {
  // Стартуем все регулярные процессы
  await initJobs();
}
