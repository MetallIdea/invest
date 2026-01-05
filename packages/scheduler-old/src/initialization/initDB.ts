import { db } from "common/src/data/db";
import { strategies } from "common/src/entities/strategies";

export async function initDb() {
  const allStrategies = await db.select().from(strategies);

  ["Простая стратегия"].forEach(async (strategyName) => {
    const isExist = allStrategies.some(
      (strategy) => strategy.name === strategyName
    );
    console.log(isExist);
    if (!isExist) {
      await db.insert(strategies).values({
        name: strategyName,
      });
    }
  });
}
