"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

interface FortuneAngle {
  type: string;
  emoji: string;
  content: string;
}

interface Props {
  fortuneAngles: FortuneAngle[];
  keyword: string;
  emoji: string;
  luck: string;
}

export default function FortuneAnglesSection({ fortuneAngles, keyword, emoji, luck }: Props) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const unlockUntil = Number(localStorage.getItem("haemong_unlock_until") || "0");
      if (unlockUntil > Date.now()) { setUnlocked(true); return; }
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const hasRecentPurchase = hist.some((h: { isPaid?: boolean; date?: string }) => {
        if (!h.isPaid || !h.date) return false;
        return new Date(h.date).getTime() > oneDayAgo;
      });
      setUnlocked(hasRecentPurchase);
    } catch {}
  }, []);

  if (!fortuneAngles || fortuneAngles.length === 0) return null;

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px", marginBottom: 14, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>⭐</span>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>운세별 관점</span>
        {unlocked ? (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#f0fdf4", color: "#16a34a" }}>✅ 오늘 전체 공개</span>
        ) : (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#fef3c7", color: "#b45309" }}>🔒 결제 후 공개</span>
        )}
      </div>

      {unlocked ? (
        /* 사주앱 결제자 — 전체 공개 */
        <>
          {fortuneAngles.map((fa, i) => (
            <div key={i} style={{ background: "#fafafa", borderRadius: 12, padding: "14px", border: "1px solid #f3e8ff", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 6 }}>{fa.emoji} {fa.type}</div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{fa.content}</div>
            </div>
          ))}
          <div style={{ marginTop: 4, padding: "10px 14px", borderRadius: 12, background: "linear-gradient(135deg,#fef2f2,#fee2e2)", border: "1.5px solid #fca5a5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 700 }}>📸 소개·추천 글 올리면 쿠폰 5장 + 꿈해몽 무료!</span>
            <Link href="/share-coupon" style={{ fontSize: 11, fontWeight: 900, textDecoration: "none", background: "#dc2626", color: "#fff", padding: "4px 10px", borderRadius: 10 }}>받기 →</Link>
          </div>
        </>
      ) : (
        /* 미결제 — 전체 잠금 */
        <>
          {fortuneAngles.map((fa, i) => (
            <div key={i} style={{ background: "#fafafa", borderRadius: 12, padding: "12px 14px", border: "1px solid #f3e8ff", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 3 }}>{fa.emoji} {fa.type}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>🔐 결제 후 전체 해석 공개</div>
              </div>
              <span style={{ fontSize: 22, opacity: 0.5 }}>🔒</span>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 12, background: "linear-gradient(135deg,#fef2f2,#fee2e2)", border: "1.5px solid #fca5a5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 700 }}>📸 소개·추천 글 올리면 쿠폰 5장 + 꿈해몽 무료!</span>
            <Link href="/share-coupon" style={{ fontSize: 11, fontWeight: 900, textDecoration: "none", background: "#dc2626", color: "#fff", padding: "4px 10px", borderRadius: 10 }}>받기 →</Link>
          </div>
        </>
      )}
    </div>
  );
}
