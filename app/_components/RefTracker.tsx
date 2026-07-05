"use client";

import { useEffect } from "react";

function genRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "REF";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
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
    } catch {}
  }, []);

  return null;
}
