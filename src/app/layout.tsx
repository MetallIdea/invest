import type { Metadata } from 'next';
import './globals.css';
import { Space } from 'antd';
import Link from 'next/link';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata: Metadata = {
  title: 'AdmPanel',
  description: 'Admin panel for you',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <Space vertical>
            <Space>
              <Link href='/websites'>Websites</Link>
            </Space>
            {children}
          </Space>
        </AntdRegistry>
      </body>
    </html>
  );
}
