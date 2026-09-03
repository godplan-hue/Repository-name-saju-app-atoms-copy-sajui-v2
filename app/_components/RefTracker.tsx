"use client";

import { useEffect } from "react";

function genRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "REF";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function detectFromParams(params: URLSearchParams): string | null {
  if (params.get("gclid")) return "구글애즈";
  const utmSource = params.get("utm_source");
  if (!utmSource) return null;
  const u = utmSource.toLowerCase();
  if (u.includes("tiktok")) return "틱톡";
  if (u.includes("daangn") || u.includes("karrot") || u.includes("당근")) return "당근";
  if (u.includes("google")) return "구글애즈";
  if (u.includes("naver")) return "네이버";
  if (u.includes("kakao")) return "카카오";
  if (u.includes("instagram") || u.includes("insta")) return "인스타";
  if (u.includes("facebook") || u.includes("meta")) return "페이스북";
  return utmSource;
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
      // "점운내부"로만 잡히던 문제를 막기 위함.
      // 단, 이번 방문 URL에 utm_source/gclid 같은 실제 광고 파라미터가 붙어있으면
      // 예전에 저장된 값(같은 기기로 재테스트했거나 예전에 다른 경로로 들어왔던 경우)을
      // 덮어써서 항상 최신 광고 클릭을 우선한다.
      const fromParams = detectFromParams(params);
      if (fromParams) {
        localStorage.setItem("first_source", fromParams);
      } else if (!localStorage.getItem("first_source")) {
        localStorage.setItem("first_source", detectSource(document.referrer || ""));
      }
    } catch {}
  }, []);

  return null;
}
