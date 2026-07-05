"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

interface Situation {
  case: string;
  meaning: string;
}

interface Props {
  situations: Situation[];
}

export default function SituationsSection({ situations }: Props) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const unlockUntil = Number(localStorage.getItem("haemong_unlock_until") || "0");
      if (unlockUntil > Date.now()) { setUnlocked(true); return; }
      if (sessionStorage.getItem("v2_paid") === "1") { setUnlocked(true); return; }
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const hasRecentPurchase = hist.some((h: { isPaid?: boolean; date?: string }) => {
        if (!h.isPaid || !h.date) return false;
        return new Date(h.date).getTime() > oneDayAgo;
      });
      setUnlocked(hasRecentPurchase);
    } catch {}
  }, []);

  if (!situations || situations.length === 0) return null;

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px", marginBottom: 14, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>🔍</span>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#4c1d95" }}>상황별 해석</span>
        {unlocked ? (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#f0fdf4", color: "#16a34a" }}>✅ 오늘 전체 공개</span>
        ) : (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: "#fef3c7", color: "#b45309" }}>1개 무료</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* 첫 번째 상황 — 항상 무료 */}
        {situations[0] && (
          <div style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", borderRadius: 12, padding: "14px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>💭 {situations[0].case}</div>
            <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{situations[0].meaning}</div>
          </div>
        )}

        {situations.length > 1 && (
          unlocked ? (
            <>
              {situations.slice(1).map((s, i) => (
                <div key={i} style={{ background: "linear-gradient(135deg,#fdf2f8,#f5f3ff)", borderRadius: 12, padding: "14px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>💭 {s.case}</div>
                  <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{s.meaning}</div>
                </div>
              ))}
              {/* 결제 후에도 SNS 공유 배너 표시 */}
              <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 12, background: "linear-gradient(135deg,#fef2f2,#fee2e2)", border: "1.5px solid #fca5a5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 700 }}>📸 SNS에 올리면 990원 쿠폰 5장!</span>
                <Link href="/share-coupon" style={{ fontSize: 11, fontWeight: 900, textDecoration: "none", background: "#dc2626", color: "#fff", padding: "4px 10px", borderRadius: 10 }}>
                  받기 →
                </Link>
              </div>
            </>
          ) : (
            <>
              {situations.slice(1).map((s, i) => (
                <div key={i} style={{ background: "#fafafa", borderRadius: 12, padding: "12px 14px", border: "1px solid #f3e8ff", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed", marginBottom: 3 }}>💭 {s.case}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>🔐 결제 후 해석 공개</div>
                  </div>
                  <span style={{ fontSize: 20, opacity: 0.5 }}>🔒</span>
                </div>
              ))}
              <div style={{ marginTop: 6, padding: "14px", borderRadius: 14, background: "linear-gradient(135deg,#fdf4ff,#ede9fe)", border: "1.5px solid #c4b5fd", textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: "#4c1d95", margin: "0 0 4px" }}>🐱 사주 결제하면 24시간 전체 공개!</p>
                <p style={{ fontSize: 11, color: "#6d28d9", margin: "0 0 10px" }}>결제 후 꿈해몽으로 돌아오면 바로 해제</p>
                <Link href="/main-v2" style={{ background: G, color: "#fff", fontSize: 14, fontWeight: 900, padding: "11px 28px", borderRadius: 24, textDecoration: "none", boxShadow: "0 4px 16px rgba(236,72,153,0.45)", display: "inline-block" }}>
                  💳 990원으로 전체 보기
                </Link>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
