"use client";
import { useState } from "react";

const TIPS = [
  { emoji: "💰", title: "재물운 팁", msg: "오늘 지출을 기록하는 것만으로도 재물운이 올라갑니다. 돈이 어디서 새는지 알아야 막을 수 있어요." },
  { emoji: "📊", title: "가계부 원칙", msg: "50:30:20 법칙 — 수입의 50%는 고정지출, 30%는 변동지출, 20%는 저축. 오늘 내 소비는 어디에 해당하나요?" },
  { emoji: "🎯", title: "사주 재물운", msg: "사주에서 재물운은 '재성(財星)'이 관장해요. 꼼꼼히 기록하는 습관이 당신의 재성을 강하게 만들어줍니다." },
  { emoji: "🏦", title: "저축 첫걸음", msg: "매일 1,000원씩만 기록해도 1년이면 36만원. 작은 기록이 큰 재산을 만들어요." },
  { emoji: "🌟", title: "재물운 상승", msg: "지출을 기록하면 불필요한 소비가 30% 줄어든다는 연구 결과가 있어요. 오늘 첫 번째 기록을 시작해보세요." },
];

const CATS = ["식비", "카페", "교통", "쇼핑", "배달", "구독", "기타"];

type Step = "form" | "loading" | "result";

export default function FreeBudgetPage() {
  const [step, setStep] = useState<Step>("form");
  const [phone, setPhone] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("식비");
  const [memo, setMemo] = useState("");

  async function handleSubmit() {
    const ph = phone.replace(/\D/g, "");
    if (ph.length < 10) { alert("전화번호를 정확히 입력해주세요."); return; }
    setStep("loading");
    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, app: "budget" }),
      });
      const data = await res.json();
      setAlreadyUsed(!!data.alreadyUsed);
      setTipIdx(Math.floor(Math.random() * TIPS.length));
      setStep("result");
    } catch {
      alert("오류가 발생했어요. 다시 시도해주세요.");
      setStep("form");
    }
  }

  const tip = TIPS[tipIdx];
  const today = new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f9ff 0%,#fff7ed 100%)", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,#0369a1,#b45309)", padding: "20px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>💳</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>점운 가계부</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>사주 재물운 가계부 · 1회 무료 체험</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {step === "form" && (
          <>
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "2px solid #0369a1", boxShadow: "0 4px 20px rgba(3,105,161,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ background: "#0369a1", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800 }}>🎁 무료</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>오늘 지출 기록 1회 무료 체험</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                전화번호 인증 후 오늘 지출 1건을 기록하고<br />
                사주 재물운 팁을 무료로 받아보세요.
              </p>
            </div>

            <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>오늘 지출 1건 입력 (선택)</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  style={{ background: cat === c ? "#0369a1" : "#f0f9ff", color: cat === c ? "#fff" : "#0369a1", border: cat === c ? "none" : "1.5px solid #bae6fd", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))}
                placeholder="금액 (원)" inputMode="numeric"
                style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none" }} />
              <input value={memo} onChange={e => setMemo(e.target.value)}
                placeholder="메모 (선택)"
                style={{ flex: 1.5, padding: "12px 14px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none" }} />
            </div>

            <div style={{ marginBottom: 24, marginTop: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#0369a1" }}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="01012345678" inputMode="tel"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0" }}>전화번호 1개당 앱 1회 무료 체험 가능</p>
            </div>

            <button onClick={handleSubmit}
              style={{ width: "100%", background: "linear-gradient(135deg,#0369a1,#b45309)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(3,105,161,0.4)" }}>
              💳 재물운 팁 받기
            </button>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#0369a1" }}>재물운을 분석하고 있어요...</p>
          </div>
        )}

        {step === "result" && (
          <>
            {alreadyUsed ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", border: "2px solid #fde047" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>이미 무료 체험을 사용하셨어요</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>해당 전화번호로 가계부 무료 체험이 완료됐어요.</p>
                <button onClick={() => window.open("/budget/pay", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#0369a1,#b45309)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                  💳 가계부 30일 이용권 ₩990
                </button>
                <button onClick={() => window.open("/pass", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
                  🔥 4개앱 30일 풀패스 ₩5,900
                </button>
              </div>
            ) : (
              <>
                {/* 기록 카드 */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: "1.5px solid #bae6fd" }}>
                  <p style={{ fontSize: 12, color: "#0369a1", fontWeight: 800, margin: "0 0 10px" }}>✅ {today} 기록 완료</p>
                  {amount ? (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>{cat} {memo && `· ${memo}`}</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: "#dc2626" }}>-{Number(amount).toLocaleString()}원</span>
                    </div>
                  ) : (
                    <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>지출 기록 없음 (이용권 구매 후 직접 입력하세요)</p>
                  )}
                </div>

                {/* 재물운 팁 */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 20, border: "1.5px solid #fde68a" }}>
                  <p style={{ fontSize: 13, color: "#b45309", fontWeight: 800, margin: "0 0 8px" }}>{tip.emoji} {tip.title}</p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>{tip.msg}</p>
                </div>

                <div style={{ background: "#fff7ed", borderRadius: 14, padding: "14px 18px", marginBottom: 20, border: "1.5px solid #fed7aa", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#92400e", margin: "0 0 4px" }}>🔒 이용권으로 더 받는 것</p>
                  <p style={{ fontSize: 12, color: "#78350f", margin: 0, lineHeight: 1.7 }}>30일 지출 기록 · 카테고리별 분석<br />월별 통계 · 사주 재물운 연동 · 목표 저축</p>
                </div>
              </>
            )}

            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "2px solid #0369a1", boxShadow: "0 4px 20px rgba(3,105,161,0.15)", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: "#0369a1", margin: "0 0 4px", textAlign: "center" }}>💳 가계부 전체 이용하기</p>
              <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", margin: "0 0 14px" }}>30일 기록 · 통계 · 사주 재물운 연동</p>
              <button onClick={() => window.open("/budget/pay", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#0369a1,#b45309)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                💳 가계부 30일 이용권 ₩990
              </button>
              <button onClick={() => window.open("/pass", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
                🔥 4개앱 30일 풀패스 ₩5,900
              </button>
            </div>

            {alreadyUsed && (
              <button onClick={() => { setStep("form"); setAlreadyUsed(false); setPhone(""); setAmount(""); setMemo(""); }}
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
