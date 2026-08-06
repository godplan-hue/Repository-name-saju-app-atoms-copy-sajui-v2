"use client";
import { useState } from "react";

const MOODS = [
  { score: 5, label: "최고!", emoji: "😄", color: "#fbbf24", insight: "오늘 기분이 최고군요! 이런 날은 에너지가 넘쳐서 평소에 망설이던 것들을 시도하기에 딱 좋아요. 좋은 기운을 주변과 나눠보세요. 당신의 밝음이 오늘 누군가의 하루를 바꿀 수 있어요.", advice: "이 에너지를 기록해두세요. 힘든 날 꺼내볼 소중한 기억이 됩니다." },
  { score: 4, label: "좋음",  emoji: "🙂", color: "#4ade80", insight: "안정적이고 여유로운 하루입니다. 무리하지 않아도 잘 흘러가는 날이에요. 작은 것에서 기쁨을 찾아보세요. 오늘의 평온함이 내일의 힘이 됩니다.", advice: "감사한 것 3가지를 적어보세요. 작은 것도 좋아요." },
  { score: 3, label: "보통",  emoji: "😐", color: "#93c5fd", insight: "그냥 그런 하루인가요? 보통인 날도 소중한 하루예요. 너무 애쓰지 않아도 괜찮아요. 오늘은 그냥 흘러가도 되는 날입니다.", advice: "좋아하는 음악 1곡 들어보세요. 작은 위로가 될 거예요." },
  { score: 2, label: "나쁨",  emoji: "😔", color: "#a78bfa", insight: "오늘 많이 힘드셨겠어요. 괜찮아요, 힘든 날도 있습니다. 지금 느끼는 감정을 부정하지 마세요. 감정은 처리되어야 흘러갑니다. 오늘 하루 수고했어요.", advice: "따뜻한 차 한 잔과 함께 5분만 아무것도 안 해보세요." },
  { score: 1, label: "끔찍함",emoji: "😢", color: "#f87171", insight: "정말 힘든 하루를 보내셨군요. 그 감정 그대로 느껴도 됩니다. 강한 사람도 힘든 날이 있어요. 지금 이 순간을 버텨내는 것만으로도 충분합니다.", advice: "오늘은 아무것도 안 해도 됩니다. 그냥 쉬세요." },
];

type Step = "form" | "loading" | "result";

export default function FreeGamjungPage() {
  const [step, setStep] = useState<Step>("form");
  const [mood, setMood] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);

  async function handleSubmit() {
    if (mood === null) { alert("오늘 기분을 선택해주세요."); return; }
    const ph = phone.replace(/\D/g, "");
    if (ph.length < 10) { alert("전화번호를 정확히 입력해주세요."); return; }
    setStep("loading");
    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, app: "gamjung" }),
      });
      const data = await res.json();
      setAlreadyUsed(!!data.alreadyUsed);
      setStep("result");
    } catch {
      alert("오류가 발생했어요. 다시 시도해주세요.");
      setStep("form");
    }
  }

  const selected = MOODS.find(m => m.score === mood);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#faf5ff 0%,#f0f9ff 100%)", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", padding: "20px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>💜</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>점운 감정일기</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>오늘 감정 기록 · 1회 무료 체험</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {step === "form" && (
          <>
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "2px solid #8b5cf6", boxShadow: "0 4px 20px rgba(139,92,246,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ background: "#8b5cf6", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800 }}>🎁 무료</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>오늘 감정 분석 1회 무료</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>오늘 기분을 선택하고 전화번호를 입력하면<br />맞춤 감정 인사이트를 무료로 드려요.</p>
            </div>

            <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>오늘 기분은 어때요? <span style={{ color: "#8b5cf6" }}>*</span></p>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "space-between" }}>
              {MOODS.map(m => (
                <button key={m.score} onClick={() => setMood(m.score)}
                  style={{ flex: 1, background: mood === m.score ? m.color : "#f3f4f6", border: mood === m.score ? "none" : "2px solid #e5e7eb", borderRadius: 14, padding: "14px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: mood !== null && mood !== m.score ? 0.5 : 1 }}>
                  <span style={{ fontSize: 24 }}>{m.emoji}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: mood === m.score ? "#fff" : "#374151" }}>{m.label}</span>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#8b5cf6" }}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="01012345678" inputMode="tel"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0" }}>전화번호 1개당 앱 1회 무료 체험 가능</p>
            </div>

            <button onClick={handleSubmit}
              style={{ width: "100%", background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}>
              💜 감정 분석 받기
            </button>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💜</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#8b5cf6" }}>감정을 분석하고 있어요...</p>
          </div>
        )}

        {step === "result" && (
          <>
            {alreadyUsed ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", border: "2px solid #fde047" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>이미 무료 체험을 사용하셨어요</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>해당 전화번호로 감정일기 무료 체험이 완료됐어요.</p>
                <button onClick={() => window.open("/gamjung/pay", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                  💜 감정일기 30일 이용권 ₩990
                </button>
                <button onClick={() => window.open("/pass", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
                  🔥 4개앱 30일 풀패스 ₩5,900
                </button>
              </div>
            ) : selected && (
              <>
                <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", marginBottom: 16, textAlign: "center", border: `2px solid ${selected.color}` }}>
                  <div style={{ fontSize: 56, marginBottom: 8 }}>{selected.emoji}</div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#374151", margin: "0 0 4px" }}>오늘의 기분</p>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: selected.color, margin: "0 0 16px" }}>{selected.label}</h2>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, textAlign: "left" }}>{selected.insight}</p>
                </div>

                <div style={{ background: "#f0fdf4", borderRadius: 14, padding: "16px 18px", marginBottom: 20, border: "1.5px solid #86efac" }}>
                  <p style={{ fontSize: 13, color: "#16a34a", fontWeight: 800, margin: "0 0 6px" }}>💡 오늘의 조언</p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{selected.advice}</p>
                </div>

                <div style={{ background: "#fff7ed", borderRadius: 14, padding: "14px 18px", marginBottom: 20, border: "1.5px solid #fed7aa", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#92400e", margin: "0 0 4px" }}>🔒 이용권으로 더 받는 것</p>
                  <p style={{ fontSize: 12, color: "#78350f", margin: 0, lineHeight: 1.7 }}>30일 감정 달력 · 감정 통계 분석<br />활동 기록 · 사주 감정 연동 · 명상 가이드</p>
                </div>
              </>
            )}

            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "2px solid #8b5cf6", boxShadow: "0 4px 20px rgba(139,92,246,0.2)", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: "#7c3aed", margin: "0 0 4px", textAlign: "center" }}>💜 감정일기 전체 이용하기</p>
              <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", margin: "0 0 14px" }}>30일 감정 달력 · 통계 · 30일 무제한</p>
              <button onClick={() => window.open("/gamjung/pay", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                💜 감정일기 30일 이용권 ₩990
              </button>
              <button onClick={() => window.open("/pass", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
                🔥 4개앱 30일 풀패스 ₩5,900
              </button>
            </div>

            {alreadyUsed && (
              <button onClick={() => { setStep("form"); setAlreadyUsed(false); setPhone(""); setMood(null); }}
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
