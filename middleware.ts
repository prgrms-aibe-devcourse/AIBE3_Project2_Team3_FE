import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PROTECTED_PREFIXES } from "./auth.config";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // ▽ 인증 여부 판정 (택1)
  // 1) 쿠키 기반 (커스텀 Auth)
  const hasSession = Boolean(req.cookies.get("session"));
  // 2) NextAuth JWT
  // const token = await getToken({ req });
  // const hasSession = Boolean(token);

  if (!hasSession) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  // 공개 경로는 제외하고, 보호 경로만 매칭
  matcher: ["/dashboard/:path*", "/applications/:path*", "/client/:path*"],
};
