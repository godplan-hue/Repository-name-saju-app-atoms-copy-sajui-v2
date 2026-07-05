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
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#fef3c7", color: "#b45309" }}>1개 무료</span>
        )}
      </div>

      {/* 첫 번째 — 항상 무료 공개 */}
      <div style={{ background: "#fafafa", borderRadius: 12, padding: "14px", border: "1px solid #f3e8ff", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 6 }}>{fortuneAngles[0].emoji} {fortuneAngles[0].type}</div>
        <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{fortuneAngles[0].content}</div>
      </div>

      {unlocked ? (
        /* 사주앱 결제자 — 나머지 전체 공개 */
        <>
          {fortuneAngles.slice(1).map((fa, i) => (
            <div key={i} style={{ background: "#fafafa", borderRadius: 12, padding: "14px", border: "1px solid #f3e8ff", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#be185d", marginBottom: 6 }}>{fa.emoji} {fa.type}</div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{fa.content}</div>
            </div>
          ))}
        </>
      ) : (
        /* 미결제 — 잠금 */
        <>
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: 90 }}>
            <div style={{ filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
              <div style={{ background: "#fafafa", borderRadius: 12, padding: "12px 14px", border: "1px solid #f3e8ff", marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#be185d", marginBottom: 4 }}>
                  {fortuneAngles[1].emoji} {fortuneAngles[1].type}
                </div>
                <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>
                  {fortuneAngles[1].content}
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.97) 75%)" }} />
          </div>
          <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
            <p style={{ fontSize: 13, color: "#374151", fontWeight: 600, margin: "0 0 8px", lineHeight: 1.6, textAlign: "left", background: "#fafafa", borderRadius: 10, padding: "10px 12px", border: "1px solid #f3e8ff" }}>
              🔐 잠긴 해석 {fortuneAngles.length - 1}개 —{" "}
              {fortuneAngles.slice(1).map(fa => `${fa.emoji} ${fa.type}`).join(" · ")}
            </p>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#4c1d95", margin: "0 0 4px" }}>사주 결제 시 24시간 전체 해제</p>
            <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 800, margin: "0 0 10px" }}>결제 후 꿈해몽 페이지로 다시 오면 잠금 해제돼요</p>
            <Link href="/main-v2" style={{ background: G, color: "#fff", fontSize: 14, fontWeight: 900, padding: "12px 28px", borderRadius: 24, textDecoration: "none", boxShadow: "0 4px 16px rgba(236,72,153,0.45)", display: "inline-block" }}>
              🐱 990원으로 전체 보기
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
