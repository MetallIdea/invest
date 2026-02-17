"use server";

import { db } from "common/src/data/db";
import { CandleParams, candlesParams } from "common/src/entities/candlesParams";
import { eq } from "drizzle-orm";

export async function submitForm(values: CandleParams) {
  if (values.id) {
    await db
      .update(candlesParams)
      .set(values)
      .where(eq(candlesParams.id, values.id));
  } else {
    await db.insert(candlesParams).values(values);
  }
}
