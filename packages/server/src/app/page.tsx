import { desc, eq } from "drizzle-orm";
import { db } from "common/src/data/db";
import { HomePage } from "@/app-pages/HomePage/HomePage";
import { candles } from "common/src/entities/candles";
import { shares } from "common/src/entities/shares";

const getInitialData = async () => {
  const sharesWithCandles = await db.query.shares.findMany({
    with: {
      candles: {
        limit: 5,
        orderBy: desc(candles.time),
      },
    },
    where: eq(shares.countryOfRisk, 'RU'),
  });

  return {
    sharesWithCandles,
  }
}

export default async function Home() {
  const initialData = await getInitialData();

  return (
    <HomePage initialData={initialData} />
  );
}
