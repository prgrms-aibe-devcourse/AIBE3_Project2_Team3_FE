"use client";

import { createContext, use } from "react";

import useAuth from "../auth/hooks/useAuth";

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(
  null,
);

export function useAuthContext() {
  const authState = use(AuthContext);

  if (authState === null) throw new Error("AuthContext is not found");

  return authState;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuth();
  return <AuthContext value={authState}>{children}</AuthContext>;
}
