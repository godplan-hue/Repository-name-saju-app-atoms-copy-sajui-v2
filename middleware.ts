import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // 메인 사이트 & 개발/배포 환경은 그대로 통과
  const isMain =
    host === "jeomun.com" ||
    host === "www.jeomun.com" ||
    host.startsWith("localhost") ||
    host.includes("vercel.app");

  const res = NextResponse.next();

  if (!isMain) {
    // 파트너 서브도메인(예: kim.jeomun.com) → 검색엔진 수집 차단
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
