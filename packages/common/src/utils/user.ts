import { decrypt, encrypt } from "./encryption";
import { users } from "common/src/entities/users";
import { cookies, headers } from "next/headers";

export async function getUser(): Promise<typeof users.$inferSelect | null> {
  const cookieStore = await cookies();

  const userString = cookieStore.get("user");

  return userString?.value ? JSON.parse(decrypt(userString?.value)) : null;
}

export async function setUser(user: typeof users.$inferSelect) {
  const cookieStore = await cookies();

  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 2);

  cookieStore.set({
    name: "user",
    value: encrypt(
      JSON.stringify({
        id: user.id,
        login: user.login,
      }),
    ),
    httpOnly: true,
    path: "/",
    expires: expires.getTime(),
  });
}

export async function getDevice() {
  const headersValues = await headers();
  const userAgent = headersValues.get("user-agent") ?? "";
  const isMobile = /Mobi|Android|iPhone/i.test(userAgent);

  return {
    isMobile,
  };
}
