"use client";

import { useEffect } from "react";

function genRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "REF";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function detectSource(referer: string): string {
  return referer.includes("google") ? "구글"
    : referer.includes("naver") ? "네이버"
    : referer.includes("daum") ? "다음"
    : referer.includes("bing") ? "빙"
    : referer.includes("kakao") || referer.includes("kakaotalk") ? "카카오"
    : referer.includes("instagram") ? "인스타"
    : referer.includes("youtube") ? "유튜브"
    : referer.includes("tiktok") ? "틱톡"
    : referer.includes("facebook") ? "페이스북"
    : referer.includes("daangn") ? "당근"
    : referer.includes("blog.naver") ? "네이버블로그"
    : referer.includes("tistory") ? "티스토리"
    : referer.includes("jeomun.com/main-v2/share") ? "공유페이지"
    : referer.includes("jeomun.com/main-v2/result") ? "결과지"
    : referer.includes("jeomun.com/free") ? "무료랜딩"
    : referer.includes("jeomun.com/main-v2") ? "메인"
    : referer.includes("jeomun.com/love") || referer.includes("jeomun.com/career") || referer.includes("jeomun.com/wealth") || referer.includes("jeomun.com/marriage") || referer.includes("jeomun.com/health") ? "SEO랜딩"
    : referer.includes("jeomun") ? "점운내부"
    : referer ? referer.split("/")[2] || "기타"
    : "직접";
}

export default function RefTracker() {
  useEffect(() => {
    try {
      // 내 추천 코드가 없으면 생성
      if (!localStorage.getItem("my_ref_code")) {
        localStorage.setItem("my_ref_code", genRefCode());
      }

      // URL에 ?ref=... 있으면 저장 (단, 내 코드면 무시)
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      const myCode = localStorage.getItem("my_ref_code");
      if (ref && ref !== myCode) {
        localStorage.setItem("referred_by", ref);
      }

      // 최초 유입경로(틱톡·유튜브 등)를 한 번만 저장해둠 — 이후 사이트 내부를
      // window.location.href로 이동할 때마다 document.referrer가 직전 내부
      // 페이지로 계속 바뀌어버려서, 가입/결제 시점엔 최초 유입경로가 사라지고
      // "점운내부"로만 잡히던 문제를 막기 위함
      if (!localStorage.getItem("first_source")) {
        localStorage.setItem("first_source", detectSource(document.referrer || ""));
      }
    } catch {}
  }, []);

  return null;
}
