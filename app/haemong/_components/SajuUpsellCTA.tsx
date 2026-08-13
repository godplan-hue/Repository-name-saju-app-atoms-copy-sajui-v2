"use client";
import { useEffect, useState } from "react";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

export default function SajuUpsellCTA() {
  const [href, setHref] = useState("/main-v2");

  useEffect(() => {
    try {
      const sp = localStorage.getItem("v2_saved_profile");
      if (sp) {
        const p = JSON.parse(sp);
        if (p.name && p.birthYear && p.gender && p.birthHour) {
          setHref("/main-v2/payment");
        }
      }
    } catch {}
  }, []);

  return (
    <a
      href={href}
      style={{ display: "block", textAlign: "center", padding: "13px 0", borderRadius: 12, background: G, color: "#fff", fontSize: 15, fontWeight: 900, textDecoration: "none", boxShadow: "0 4px 14px rgba(236,72,153,0.4)" }}
    >
      🐱 990원으로 사주 보기 → 꿈해몽 무료
    </a>
  );
}
