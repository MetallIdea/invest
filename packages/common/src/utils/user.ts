import { decrypt, encrypt } from "./encryption";
import { users } from "common/src/entities/users";
import { cookies } from "next/headers";

export async function getUser(): Promise<typeof users.$inferSelect | null> {
  const cookieStore = await cookies();

  const userString = cookieStore.get("user");

  return userString?.value ? JSON.parse(decrypt(userString?.value)) : null;
}

export async function setUser(user: typeof users.$inferSelect) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "user",
    value: encrypt(
      JSON.stringify({
        id: user.id,
      })
    ),
    httpOnly: true,
    path: "/",
  });
}
