import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import ContextLayout from "./ContextLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "잡픽(JOB+PICK)",
  description: "구인과 구직이 만나는 가장 간단한 방법",
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
