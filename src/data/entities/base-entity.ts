import { timestamp, uuid } from 'drizzle-orm/pg-core';

export const baseEntity = {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
  createdBy: uuid(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  updatedBy: uuid(),
};
