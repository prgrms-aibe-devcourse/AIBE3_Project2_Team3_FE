"use client";

import { Header } from "@/global/components/ui/header";
import { Toaster } from "@/global/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
        {children}
      </Suspense>
      <Toaster />
      <Analytics />
    </>
  );
};

export default ClientLayout;
