import { decrypt, encrypt } from "./encryption";
import { User } from "common/src/entities/users";
import { cookies, headers } from "next/headers";

export async function getUser(): Promise<User | undefined> {
  const cookieStore = await cookies();

  const userString = cookieStore.get("user");

  return userString?.value ? JSON.parse(decrypt(userString?.value)) : undefined;
}

export async function setUser(user: User) {
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
