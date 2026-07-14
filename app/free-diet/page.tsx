"use client";
import { useState } from "react";
import { OH_DIET, getOhFromYear } from "@/lib/foodDb";

type Step = "form" | "loading" | "result";

export default function FreeDietPage() {
  const [step, setStep] = useState<Step>("form");
  const [birthYear, setBirthYear] = useState("");
  const [phone, setPhone] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [oh, setOh] = useState<"목"|"화"|"토"|"금"|"수"|null>(null);

  async function handleSubmit() {
    const yr = Number(birthYear);
    if (!yr || yr < 1930 || yr > 2020) { alert("출생연도를 정확히 입력해주세요."); return; }
    const ph = phone.replace(/\D/g, "");
    if (ph.length < 10) { alert("전화번호를 정확히 입력해주세요."); return; }
    setStep("loading");
    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, app: "diet" }),
      });
      const data = await res.json();
      setAlreadyUsed(!!data.alreadyUsed);
      setOh(getOhFromYear(yr));
      setStep("result");
    } catch {
      alert("오류가 발생했어요. 다시 시도해주세요.");
      setStep("form");
    }
  }

  const diet = oh ? OH_DIET[oh] : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0fdf4 0%,#ecfdf5 100%)", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,#16a34a,#0d9488)", padding: "20px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>🥗</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>점운 다이어트</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>오행 체질 다이어트 · 1회 무료 체험</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {step === "form" && (
          <>
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "2px solid #16a34a", boxShadow: "0 4px 20px rgba(22,163,74,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ background: "#16a34a", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800 }}>🎁 무료</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>내 오행 체질 다이어트 1회 무료</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                출생연도로 오행 체질을 분석해<br />나에게 맞는 식단 유형을 무료로 알려드려요.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>출생연도 <span style={{ color: "#16a34a" }}>*</span></label>
              <input value={birthYear} onChange={e => setBirthYear(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="예) 1990" inputMode="numeric" maxLength={4}
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#16a34a" }}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="01012345678" inputMode="tel"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0" }}>전화번호 1개당 앱 1회 무료 체험 가능</p>
            </div>

            <button onClick={handleSubmit}
              style={{ width: "100%", background: "linear-gradient(135deg,#16a34a,#0d9488)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(22,163,74,0.4)" }}>
              🥗 체질 분석받기
            </button>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>체질을 분석하고 있어요...</p>
          </div>
        )}

        {step === "result" && (
          <>
            {alreadyUsed ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", border: "2px solid #fde047" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>이미 무료 체험을 사용하셨어요</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>해당 전화번호로 다이어트 무료 체험이 완료됐어요.</p>
                <button onClick={() => window.open("/diet/pay", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#16a34a,#0d9488)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                  🥗 다이어트 30일 이용권 ₩990
                </button>
                <button onClick={() => window.open("/pass", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
                  🔥 7개앱 풀패스 ₩4,900/30일
                </button>
              </div>
            ) : diet && (
              <>
                <div style={{ background: diet.bg, borderRadius: 16, padding: "24px 20px", marginBottom: 16, textAlign: "center", border: `1.5px solid ${diet.color}44` }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>{diet.emoji}</div>
                  <h2 style={{ color: diet.color, fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>{diet.label} — {diet.type}</h2>
                  <p style={{ color: "#d1d5db", fontSize: 13, margin: "0 0 16px" }}>{diet.desc}</p>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px", marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700, margin: "0 0 6px" }}>권장 칼로리</p>
                    <p style={{ fontSize: 24, color: diet.color, fontWeight: 900, margin: 0 }}>{diet.kcal} kcal/일</p>
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: "1.5px solid #d1fae5" }}>
                  <p style={{ fontSize: 13, color: "#16a34a", fontWeight: 800, margin: "0 0 10px" }}>✅ 이 체질에 좋은 식품</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {diet.good.map((g, i) => (
                      <span key={i} style={{ background: "#d1fae5", color: "#16a34a", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>{g}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: "1.5px solid #fecaca" }}>
                  <p style={{ fontSize: 13, color: "#dc2626", fontWeight: 800, margin: "0 0 10px" }}>⚠️ 줄이면 좋은 식품</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {diet.avoid.map((a, i) => (
                      <span key={i} style={{ background: "#fef2f2", color: "#dc2626", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>{a}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 20, border: "1.5px solid #fde68a" }}>
                  <p style={{ fontSize: 13, color: "#b45309", fontWeight: 800, margin: "0 0 6px" }}>💡 체질 식습관 팁</p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{diet.tip}</p>
                </div>

                <div style={{ background: "#fff7ed", borderRadius: 14, padding: "14px 18px", marginBottom: 20, border: "1.5px solid #fed7aa", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#92400e", margin: "0 0 4px" }}>🔒 이용권으로 더 받는 것</p>
                  <p style={{ fontSize: 12, color: "#78350f", margin: 0, lineHeight: 1.7 }}>3,000개+ 식품 칼로리 검색 · 매일 식단 기록<br />30일 칼로리 히스토리 · 체중 목표 관리</p>
                </div>
              </>
            )}

            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "2px solid #16a34a", boxShadow: "0 4px 20px rgba(22,163,74,0.2)", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: "#16a34a", margin: "0 0 4px", textAlign: "center" }}>🥗 다이어트 전체 이용하기</p>
              <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", margin: "0 0 14px" }}>3,000개 식품 DB · 매일 칼로리 기록 · 30일</p>
              <button onClick={() => window.open("/diet/pay", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#16a34a,#0d9488)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                🥗 다이어트 30일 이용권 ₩990
              </button>
              <button onClick={() => window.open("/pass", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
                🔥 다이어트+6개앱 풀패스 ₩4,900/30일
              </button>
            </div>

            {alreadyUsed && (
              <button onClick={() => { setStep("form"); setAlreadyUsed(false); setPhone(""); setBirthYear(""); }}
                style={{ width: "100%", background: "transparent", border: "2px solid #e5e7eb", borderRadius: 12, padding: "12px 0", fontSize: 14, color: "#6b7280", cursor: "pointer", marginTop: 8 }}>
                다른 전화번호로 시도하기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
