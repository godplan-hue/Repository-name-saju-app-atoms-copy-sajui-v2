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
                  {luck === "길몽"
                    ? `✨ ${keyword}이 주는 행운, 진짜 언제 어떻게 현실로 오는지`
                    : luck === "흉몽"
                    ? `⚠️ ${keyword}이 보내는 경고 신호와 구체적 대처법`
                    : `${emoji} ${keyword}의 숨겨진 의미 — 재물·연애·건강 각각에 미치는 영향`}
                </div>
                <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6 }}>
                  {luck === "길몽"
                    ? `재물운에서 어떻게 작용하는지, 연애·직장에서 나타나는 신호, 사주 오행과 결합하면 얼마나 강한 길몽인지...`
                    : luck === "흉몽"
                    ? `어떤 분야에서 주의해야 하는지, 피하는 방법, 사주 오행으로 본 실제 영향력과 해소법...`
                    : `${keyword}이 재물에 미치는 구체적 영향, 연애에서 나타나는 신호, 사주와 결합한 종합 해석...`}
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.97) 75%)" }} />
          </div>
          <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#4c1d95", margin: "0 0 4px" }}>🔐 {keyword} 전체 해석 3개 더 보기</p>
            <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 800, margin: "0 0 10px" }}>오늘 사주 결제 시 24시간 전체 해제 · 더 자세한 내용이 나와요</p>
            <Link href="/main-v2" style={{ background: G, color: "#fff", fontSize: 14, fontWeight: 900, padding: "12px 28px", borderRadius: 24, textDecoration: "none", boxShadow: "0 4px 16px rgba(236,72,153,0.45)", display: "inline-block" }}>
              🐱 990원으로 전체 보기
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
