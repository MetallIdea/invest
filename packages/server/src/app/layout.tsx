import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import styles from './layout.module.css';
import { getDevice, getUser } from "common/src/utils/user";
import { Menu } from "@/components/menu/Menu";
import cn from "classnames";

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
  const { isMobile } = await getDevice();

  return (
    <html lang="en" className={styles.html}>
      <body className={cn(styles.body, {
        [styles.isMobile]: isMobile,
      })}>
        <AntdRegistry>
          {user && (<div>{user.login}</div>)}
          {children}
          {
            isMobile ? <Menu /> : null
          }
        </AntdRegistry>
      </body>
    </html>
  );
}
