"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DREAMS } from "@/lib/haemong/data";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

export default function SavedDreamsPage() {
  const [saved, setSaved] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const data: string[] = JSON.parse(localStorage.getItem("haemong-saved") || "[]");
    setSaved(data.filter(k => DREAMS[k]));
    setLoaded(true);
  }, []);

  function remove(keyword: string) {
    const next = saved.filter(k => k !== keyword);
    setSaved(next);
    localStorage.setItem("haemong-saved", JSON.stringify(next));
  }

  function clearAll() {
    setSaved([]);
    localStorage.removeItem("haemong-saved");
  }

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)", position: "sticky", top: 0, zIndex: 200 }}>
        <Link href="/haemong" style={{ color: "#8b5cf6", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>← 꿈해몽</Link>
        <span style={{ color: "#d1d5db", fontSize: 12 }}>›</span>
        <span style={{ fontSize: 14, color: "#6d28d9", fontWeight: 600 }}>내 보관함</span>
        {saved.length > 0 && (
          <button onClick={clearAll} style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af", background: "none", border: "1px solid #e5e7eb", borderRadius: 12, padding: "4px 10px", cursor: "pointer" }}>
            전체 삭제
          </button>
        )}
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 14px 80px" }}>

        {!loaded ? null : saved.length === 0 ? (
          /* 빈 상태 */
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📂</div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#4c1d95", margin: "0 0 8px" }}>보관한 꿈이 없어요</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px", lineHeight: 1.6 }}>꿈해몽 결과 페이지에서<br />🔖 보관하기 버튼을 눌러보세요</p>
            <Link href="/haemong" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 24, background: G, color: "#fff", fontSize: 14, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}>
              🌙 꿈해몽 보러 가기
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 14 }}>총 {saved.length}개 저장됨</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {saved.map(kw => {
                const d = DREAMS[kw];
                const luckColor = d.luck === "길몽" ? "#16a34a" : d.luck === "흉몽" ? "#dc2626" : "#7c3aed";
                const luckBg   = d.luck === "길몽" ? "#f0fdf4" : d.luck === "흉몽" ? "#fef2f2" : "#f5f3ff";
                return (
                  <div key={kw} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "14px", boxShadow: "0 2px 10px rgba(139,92,246,0.1)", border: "1px solid rgba(236,72,153,0.08)" }}>
                    <Link href={`/haemong/${encodeURIComponent(kw)}`} style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                      <span style={{ fontSize: 28 }}>{d.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: "#4c1d95", marginBottom: 3 }}>{kw}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{d.summary.slice(0, 26)}…</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 12, background: luckBg, color: luckColor }}>{d.luck}</span>
                    </Link>
                    <button
                      onClick={() => remove(kw)}
                      style={{ background: "none", border: "none", color: "#d1d5db", fontSize: 16, cursor: "pointer", padding: "4px", lineHeight: 1 }}
                      title="삭제"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Link href="/haemong" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 24, background: G, color: "#fff", fontSize: 14, fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 16px rgba(236,72,153,0.35)" }}>
                + 꿈 더 보관하기
              </Link>
            </div>

            {/* 꿈해몽 이용권 버튼 */}
            <a href="/haemong/pay" style={{ display: "block", borderRadius: 16, overflow: "hidden", marginTop: 14, boxShadow: "0 2px 14px rgba(245,158,11,0.2)", border: "2px solid #f59e0b", textDecoration: "none" }}>
              <div style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>🌙 꿈해몽 24시간 이용권</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11 }}>꿈해몽 단독</span>
              </div>
              <div style={{ background: "#fffbeb", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: 11, color: "#92400e", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>꿈해몽 전체 해석 · 재물·연애·건강·성공운</p>
                <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#f59e0b,#ef4444)", padding: "5px 14px", borderRadius: 20, marginLeft: 8 }}>₩990 →</span>
              </div>
            </a>
          </>
        )}

      </div>
    </main>
  );
}
