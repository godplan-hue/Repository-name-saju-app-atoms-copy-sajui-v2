"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const MONTH_EMOJI = ["🌱","❄️","🌸","🌿","☀️","🌊","🔥","🌻","🍁","🌙","⭐","🎆"];

export default function YearlyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [yearlyText, setYearlyText] = useState("");
  const [monthlyText, setMonthlyText] = useState("");
  const [scores, setScores] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) { router.push("/main-v2"); return; }
    const p = JSON.parse(saved);
    setProfile(p);

    const isPaid = sessionStorage.getItem("yearlyPaid") === "1";
    setPaid(isPaid);

    const birth = `${p.birthYear}-${String(p.birthMonth).padStart(2,"0")}-${String(p.birthDay).padStart(2,"0")}`;
    fetchYearly(p.name, birth, p.gender || "여", p.birthHour || "unknown", isPaid);
  }, []);

  const fetchYearly = async (name: string, birth: string, gender: string, birthHour: string, isPaid: boolean) => {
    setLoading(true);
    try {
      const [yearlyRes, monthlyRes] = await Promise.all([
        fetch("/api/v2/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, birth, birthHour, gender, category: "☀️ 올해 운세", planType: "select" }),
        }),
        isPaid ? fetch("/api/v2/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, birth, birthHour, gender, category: "📅 월별운세", planType: "select" }),
        }) : Promise.resolve(null),
      ]);
      const yearlyData = await yearlyRes.json();
      setYearlyText(yearlyData.analysis ?? "");
      setScores(yearlyData.scores ?? null);
      if (monthlyRes) {
        const monthlyData = await monthlyRes.json();
        setMonthlyText(monthlyData.analysis ?? "");
      }
    } catch { } finally {
      setLoading(false);
    }
  };

  // 점수에서 막대 색 계산
  const scoreColor = (s: number) => s >= 75 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";

  // 연도 점수 요약
  const totalScore = scores?.total ?? 0;
  const scoreLabel = totalScore >= 75 ? "강한 길운 ✨" : totalScore >= 60 ? "안정적인 흐름 🌿" : "변화가 필요한 시기 🌱";

  // 무료 미리보기: 첫 3줄만
  const teaserLines = yearlyText.split("\n").filter(l => l.trim()).slice(0, 4).join("\n");

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)",
      color: "#1f2937", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative",
    }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(255,255,255,0.3)", zIndex: 1, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 520, margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => router.push("/main-v2")} style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.3)", color: "#1d4ed8", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>📅</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#1d4ed8", margin: "0 0 6px" }}>연도별운세</h1>
            <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>올해 전체 흐름 + 12개월 로드맵</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
            <p>운세를 계산하는 중...</p>
          </div>
        ) : (
          <>
            {/* 운세 점수 요약 */}
            {profile && scores && (
              <div style={{ background: "white", border: "1.5px solid rgba(37,99,235,0.2)", borderRadius: 14, padding: "16px", marginBottom: 20, textAlign: "center", boxShadow: "0 2px 12px rgba(37,99,235,0.08)" }}>
                <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 8px" }}>{profile.name}님의 2026년 운세</p>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#2563eb", margin: "0 0 4px" }}>{totalScore}점</div>
                <p style={{ color: "#374151", fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>{scoreLabel}</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {[
                    { label: "재물", score: scores.wealth },
                    { label: "연애", score: scores.love },
                    { label: "건강", score: scores.health },
                    { label: "성공", score: scores.success },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 14px", minWidth: 70 }}>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{s.label}운</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: scoreColor(s.score) }}>{s.score}점</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 올해 운세 */}
            <div style={{ background: "white", border: "1.5px solid rgba(37,99,235,0.15)", borderRadius: 14, padding: "20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(37,99,235,0.06)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1d4ed8", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                ☀️ 2026년 올해 운세
              </h2>
              {paid ? (
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line", wordBreak: "keep-all" }}>{yearlyText}</p>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: "0 0 10px", whiteSpace: "pre-line", wordBreak: "keep-all" }}>{teaserLines}</p>
                  <div style={{ borderRadius: 10, background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.95))", height: 60, marginTop: -60, position: "relative", pointerEvents: "none" }} />
                  <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "8px 0 0" }}>🔒 전체 내용은 결제 후 확인할 수 있어요</p>
                </>
              )}
            </div>

            {/* 12개월 로드맵 — 유료 */}
            {paid && monthlyText ? (
              <div style={{ background: "white", border: "1.5px solid rgba(37,99,235,0.15)", borderRadius: 14, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(37,99,235,0.06)" }}>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1d4ed8", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 6 }}>
                  📅 2026년 월별 상세 운세
                </h2>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line", wordBreak: "keep-all" }}>{monthlyText}</p>
              </div>
            ) : !paid ? (
              /* 월별 미리보기 — 잠금 */
              <div style={{ background: "white", border: "1.5px solid rgba(37,99,235,0.15)", borderRadius: 14, padding: "20px", marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: "#1d4ed8", margin: "0 0 16px" }}>📅 2026년 월별 운세 미리보기</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {MONTHS.map((m, i) => (
                    <div key={m} style={{ background: i < 2 ? "#eff6ff" : "#f9fafb", border: `1px solid ${i < 2 ? "rgba(37,99,235,0.3)" : "#e5e7eb"}`, borderRadius: 10, padding: "10px 12px", filter: i >= 2 ? "blur(1.5px)" : "none", opacity: i >= 2 ? 0.6 : 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{MONTH_EMOJI[i]} {m}</div>
                      {i < 2 ? (
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                          {i === 0 ? "올해 목표 수립의 달" : "새로운 인연이 열리는 달"}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: "#d1d5db", marginTop: 2 }}>🔒 결제 후 공개</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* 결제 섹션 */}
            {!paid && (
              <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.06))", border: "1.5px solid rgba(37,99,235,0.35)", borderRadius: 18, padding: "24px 20px", textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🔓</div>
                <h3 style={{ color: "#1d4ed8", fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>올해 운세 전체 + 12개월 로드맵</h3>
                <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7, margin: "0 0 16px" }}>
                  2026년 전체 흐름 상세 해설<br />
                  1월~12월 월별 맞춤 운세 완전 공개
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                  {["☀️ 올해 운세 전체", "📅 12개월 상세", "💡 월별 조언"].map(t => (
                    <span key={t} style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.3)", color: "#2563eb", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
                <div style={{ color: "#2563eb", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>₩2,900</div>
                <p style={{ color: "#9ca3af", fontSize: 11, margin: "0 0 16px", textDecoration: "line-through" }}>₩14,900</p>
                <button
                  onClick={() => router.push("/payment-complete?yearly=1&paid=2900")}
                  style={{ background: "linear-gradient(135deg, #2563eb, #6366f1)", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 900, cursor: "pointer", width: "100%", boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}
                >
                  📅 연도별운세 전체 보기
                </button>
              </div>
            )}

            {paid && (
              <div style={{ textAlign: "center", padding: "16px 0", color: "#6b7280", fontSize: 13 }}>
                ✅ 2026년 연도별운세 해금 완료
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
