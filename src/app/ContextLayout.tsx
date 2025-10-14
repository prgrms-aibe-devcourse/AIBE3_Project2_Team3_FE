"use client";

import React from "react";

import { QueryClientCustomProvider } from "../global/contexts/queryProvider";
import ClientLayout from "./ClientLayout";

const ContextLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientCustomProvider>
      <ClientLayout>{children}</ClientLayout>
    </QueryClientCustomProvider>
  );
};

export default ContextLayout;
