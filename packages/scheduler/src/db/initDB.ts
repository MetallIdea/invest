import { db } from "common/src/data/db";
import { strategies } from "common/src/entities/strategies";
import {
  createJob,
  deleteAllJobsYesIWant,
  deleteJob,
  getAllJobs,
} from "common/src/repositories/jobs";
import { METHODS } from "http";

export async function initDb() {
  const allStrategies = await db.select().from(strategies);

  ["Простая стратегия"].forEach(async (strategyName) => {
    const isExist = allStrategies.some(
      (strategy) => strategy.name === strategyName
    );

    if (!isExist) {
      await db.insert(strategies).values({
        name: strategyName,
      });
    }
  });

  const jobs = await getAllJobs();

  if (jobs.length === 0) {
    await createJob({
      name: "Получить акции",
      schedule: "* * * * *",
      method: "fetchActualShares",
    });
    await createJob({
      name: "Получить свечи",
      schedule: "* * * * *",
      method: "fetchLastCandles",
    });
    await createJob({
      name: "Вычислить параметры",
      schedule: "* * * * *",
      method: "calculateCandleParameters",
    });
    await createJob({
      name: "Вычислить параметры за 30 дней",
      schedule: "* * * * *",
      method: "calculateLast30CandleParameters",
    });
    await createJob({
      name: "Рассчитать свечи",
      schedule: "* * * * *",
      method: "calculateSuggestions",
    });
    await createJob({
      name: "Получить все свечи",
      schedule: "* * * * *",
      method: "fetchOldCandles",
    });
  }
}
