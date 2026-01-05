import { db } from "common/src/data/db";
import { desc, eq } from "drizzle-orm";
import { shares } from "common/src/entities/shares";
import { fetchShares } from "common/src/requests/shares";

export async function fetchActualShares() {
  console.log("Start fetchActualShares");
  console.time("End fetchActualShares");
  const response = await fetchShares({
    investApiUrl: process.env.TINVEST_API_URL!,
    investApiToken: process.env.TINVEST_API_TOKEN!,
  });
  let data: any = { shares: [] };

  if (response.status === 200) {
    try {
      data = await response.json();
    } catch (e) {
      console.log(response.status, e);
      console.log(await response.text());
    }
  }

  if (!data.instruments) {
    return;
  }

  for (let i = 0; i < data.instruments.length; i++) {
    const share = data.instruments[i];
    // Берем последнюю свечу
    const [existShare] = await db
      .select()
      .from(shares)
      .where(eq(shares.figi, share.figi))
      .limit(1);

    if (existShare) {
      await db
        .update(shares)
        .set({
          ...share,
        })
        .where(eq(shares.id, existShare.id));
    } else {
      await db.insert(shares).values({
        ...share,
      });
    }
  }

  console.timeEnd("End fetchActualShares");
}
