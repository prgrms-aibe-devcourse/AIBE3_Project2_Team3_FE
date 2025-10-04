"use client";

import React from "react";

import { AuthProvider } from "../global/contexts/authProvider";
import { QueryClientCustomProvider } from "../global/contexts/queryProvider";
import ClientLayout from "./ClientLayout";

const ContextLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientCustomProvider>
      <AuthProvider>
        <ClientLayout children={children} />
      </AuthProvider>
    </QueryClientCustomProvider>
  );
};

export default ContextLayout;
