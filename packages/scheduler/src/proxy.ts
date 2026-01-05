import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { NextRequestWithUser } from "./types/request";
import { getUser } from "common/src/utils/user";
import { db } from "common/src/data/db";
import { users } from "common/src/entities/users";

export default async function proxy(req: NextRequestWithUser) {
  const user = await getUser();

  if (!user) {
    return NextResponse.error();
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
