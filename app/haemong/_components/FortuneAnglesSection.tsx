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
}

export default function FortuneAnglesSection({ fortuneAngles }: Props) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      const hasPurchase = hist.some((h: { isPaid?: boolean }) => h.isPaid === true);
      setUnlocked(hasPurchase);
    } catch {}
  }, []);

  if (!fortuneAngles || fortuneAngles.length === 0) return null;

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px", marginBottom: 14, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>⭐</span>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>운세별 관점</span>
        {unlocked ? (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#f0fdf4", color: "#16a34a" }}>✅ 전체 공개</span>
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
                <div style={{ fontSize: 12, fontWeight: 700, color: "#be185d", marginBottom: 4 }}>💰 재물운 — 연애운 — 건강운 — 🔮 사주 종합해석</div>
                <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>이 꿈이 재물에 미치는 영향은... 연애에서 나타나는 신호는... 사주 오행과 결합하면...</div>
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.97) 75%)" }} />
          </div>
          <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#4c1d95", margin: "0 0 4px" }}>🔐 운세별 전체 해석 보기</p>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 10px" }}>점운 사주앱 이용 중이라면 자동으로 해제돼요</p>
            <Link href="/main-v2" style={{ background: G, color: "#fff", fontSize: 14, fontWeight: 900, padding: "12px 28px", borderRadius: 24, textDecoration: "none", boxShadow: "0 4px 16px rgba(236,72,153,0.45)", display: "inline-block" }}>
              🐱 무료로 사주 보기
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
