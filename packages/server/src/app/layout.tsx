import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import styles from './layout.module.css';
import { getDevice, getUser } from "common/src/utils/user";
import cn from "classnames";
import StoreProvider from "@/state/StoreProvider";
import { MainLayout } from "@/components/MainLayout/MainLayout";

export const metadata: Metadata = {
  title: "AlCoInvest - Алгоритмическое компьютерное инвестирование",
  description: "Алгоритмическое компьютерное инвестирование. Вам оно не нужно.",
};

const getInitialData = async () => {
  const user = await getUser();
  const { isMobile } = await getDevice();

  return {
    common: {
      user,
      isMobile,
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getInitialData();

  return (
    <html lang="ru">
      <body className={cn({
        [styles.isMobile]: initialData.common.isMobile,
      })}>
        <AntdRegistry>
          <StoreProvider initialData={initialData}>
            <MainLayout>
              {children}
            </MainLayout>
          </StoreProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
