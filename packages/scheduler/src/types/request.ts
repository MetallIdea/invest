import { users } from "common/src/entities/users";
import { NextRequest } from "next/server";

export type NextRequestWithUser = NextRequest & {
  user: typeof users.$inferSelect;
};
