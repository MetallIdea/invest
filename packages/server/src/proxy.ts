import { NextResponse } from "next/server";
import { getUser } from "common/src/utils/user";

export default async function proxy() {
  const user = await getUser();

  if (!user) {
    return NextResponse.error();
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|.*\\.png$).*)"],
};
