import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { NextRequestWithUser } from "./types/request";
import { getUser } from "common/src/utils/user";
import { db } from "common/src/data/db";
import { users } from "common/src/entities/users";

export default async function proxy(req: NextRequestWithUser) {
  const user = await getUser();

  if (!user) {
    const [existUser] = await db
      .select()
      .from(users)
      .where(eq(users.login, "admin"));

    if (!existUser) {
      console.log("create admin");
      await db.insert(users).values({
        login: "admin",
        password: "admin!2#4%",
      });
    }

    return NextResponse.error();
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|.*\\.png$).*)"],
};
