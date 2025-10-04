export const LOGIN_PATH = "/auth/login";
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/applications",
  "/client",
] as const;

export const buildMatcher = () => PROTECTED_PREFIXES.map((p) => `${p}/:path*`);
export const isProtectedPath = (pathname: string) =>
  PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
