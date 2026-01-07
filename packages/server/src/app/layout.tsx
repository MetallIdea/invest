import type { Metadata } from "next";
import styles from './layout.module.css';
import { getUser } from "common/src/utils/user";
import { Menu } from "@/components/menu/Menu";

export const metadata: Metadata = {
  title: "AlCoInvest - Алгоритмическое компьютерное инвестирование",
  description: "Алгоритмическое компьютерное инвестирование. Вам оно не нужно.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en" className={styles.html}>
      <body className={styles.body}>
        {user && (<div>{user.login}</div>)}
        {children}
        <Menu />
      </body>
    </html>
  );
}
