import { NextResponse } from "next/server";
import { NextRequestWithUser } from "./types/request";

export default async function proxy(req: NextRequestWithUser) {
  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
