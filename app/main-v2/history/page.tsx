"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

interface HistoryItem {
  id: number;
  date: string;
  name: string;
  category: string;
  scores: { total: number; wealth: number; love: number; health: number; success: number };
  analysis: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function V2History() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("v2_history") || "[]");
    setHistory(h);
  }, []);

  const clearHistory = () => {
    if (confirm("보관함을 모두 삭제하시겠습니까?")) {
      localStorage.removeItem("v2_history");
      setHistory([]);
    }
  };

  const catIcons: Record<string, string> = {
    "💰 재물운": "💰",
    "💕 연애운": "💕",
    "🎯 성공운": "🎯",
    "💪 건강운": "💪",
    "✨ 총운": "✨",
  };

  const scoreColor = (s: number) => s >= 80 ? "#10b981" : s >= 65 ? "#f59e0b" : "#ec4899";

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>🐱</span>
          <span style={{ fontWeight: 900, fontSize: 15, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운 v2</span>
        </button>
        {history.length > 0 && (
          <button onClick={clearHistory} style={{ padding: "6px 14px", background: "#fff1f2", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            전체 삭제
          </button>
        )}
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px 60px" }}>

        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>📂 보관함</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 28px" }}>내 운세 분석 기록</p>

        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>😿</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px" }}>분석 기록이 없어요</h2>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 28px" }}>운세를 분석하면 여기에 저장됩니다</p>
            <button
              onClick={() => router.push("/main-v2/analysis")}
              style={{ padding: "14px 36px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer" }}
            >
              🔮 지금 분석하기
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {history.map(item => (
              <div key={item.id} style={{ background: "white", borderRadius: 20, padding: "20px", border: "1.5px solid rgba(236,72,153,0.12)", boxShadow: "0 4px 16px rgba(139,92,246,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 44, height: 44, background: BG, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {catIcons[item.category] ?? "✨"}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#1a1a2e" }}>{item.name}님 · {item.category.replace(/\S+\s/, "")}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{formatDate(item.date)}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: scoreColor(item.scores?.total ?? 0) }}>{item.scores?.total ?? "—"}</div>
                    <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>총운</div>
                  </div>
                </div>

                {/* 미니 점수 */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  {[
                    { k: "wealth", l: "재물" },
                    { k: "love", l: "연애" },
                    { k: "health", l: "건강" },
                    { k: "success", l: "성공" },
                  ].map(s => (
                    <div key={s.k} style={{ background: BG, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#6b7280" }}>
                      {s.l} <span style={{ color: scoreColor(item.scores?.[s.k as keyof typeof item.scores] ?? 0), fontWeight: 900 }}>{item.scores?.[s.k as keyof typeof item.scores] ?? "—"}</span>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{item.analysis}</p>
              </div>
            ))}

            <button
              onClick={() => router.push("/main-v2/analysis")}
              style={{ padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", marginTop: 8 }}
            >
              🔮 새로 분석하기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
