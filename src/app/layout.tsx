import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import ContextLayout from "./ContextLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "프리랜서 매칭 플랫폼",
  description: "재능있는 프리랜서와 클라이언트를 연결하는 전문 매칭 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <ContextLayout children={children} />
      </body>
    </html>
  );
}
