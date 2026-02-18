import type { Metadata } from "next";
import styles from './layout.module.css';
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "AlCoInvest - Алгоритмическое компьютерное инвестирование",
  description: "Алгоритмическое компьютерное инвестирование. Вам оно не нужно.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={styles.html}>
      <body className={styles.body}>
        <AntdRegistry>
          {children}
        </AntdRegistry>
      </body>
    </html>
  );
}
