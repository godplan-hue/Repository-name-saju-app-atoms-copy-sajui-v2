import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  // 메인 사이트 & 개발/배포 환경은 그대로 통과
  const isMain =
    host === "jeomun.com" ||
    host === "www.jeomun.com" ||
    host.startsWith("localhost") ||
    host.includes("vercel.app");

  // /main-v2/profile 직접 접근(구글, URL 직접 입력 등) 차단 — 파란/보라 창 깜빡임 방지
  // 앱 내부에서 올 때는 jeomun_from_app 쿠키를 심고 이동하므로 쿠키 있으면 통과
  if (pathname === "/main-v2/profile") {
    const fromApp = req.cookies.get("jeomun_from_app");
    if (!fromApp) {
      return NextResponse.redirect(new URL("/main-v2", req.url));
    }
  }

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
