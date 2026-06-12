"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const RELATIONSHIPS = [
  { value: "나", label: "나", icon: "🙋" },
  { value: "배우자", label: "배우자", icon: "💑" },
  { value: "자녀", label: "자녀", icon: "👧" },
  { value: "부모", label: "부모", icon: "👨‍👩‍👧" },
  { value: "친구", label: "친구", icon: "🤝" },
  { value: "연인", label: "연인", icon: "💕" },
];

const BIRTH_HOURS = [
  { label: "자시(子時)", value: "00", time: "23:00~01:00" },
  { label: "축시(丑時)", value: "01", time: "01:00~03:00" },
  { label: "인시(寅時)", value: "02", time: "03:00~05:00" },
  { label: "묘시(卯時)", value: "03", time: "05:00~07:00" },
  { label: "진시(辰時)", value: "04", time: "07:00~09:00" },
  { label: "사시(巳時)", value: "05", time: "09:00~11:00" },
  { label: "오시(午時)", value: "06", time: "11:00~13:00" },
  { label: "미시(未時)", value: "07", time: "13:00~15:00" },
  { label: "신시(申時)", value: "08", time: "15:00~17:00" },
  { label: "유시(酉時)", value: "09", time: "17:00~19:00" },
  { label: "술시(戌時)", value: "10", time: "19:00~21:00" },
  { label: "해시(亥時)", value: "11", time: "21:00~23:00" },
  { label: "모름", value: "unknown", time: "모르는 경우" },
];

export default function V2Profile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const TOTAL = 5;
  const [form, setForm] = useState({
    name: "",
    relationship: "나",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    birthHour: "",
  });

  useEffect(() => {
    const savedName = localStorage.getItem("v2_user_name") || "";
    if (savedName && savedName !== "카카오 사용자" && savedName !== "Google 사용자") {
      setForm(prev => ({ ...prev, name: savedName }));
    }
  }, []);

  const next = () => {
    const validators: Record<number, boolean> = {
      1: !!form.relationship,
      2: !!form.name.trim(),
      3: !!(form.birthYear && form.birthMonth && form.birthDay),
      4: !!form.gender,
      5: !!form.birthHour,
    };
    if (!validators[step]) { alert("정보를 입력해주세요"); return; }
    if (step < TOTAL) { setStep(step + 1); return; }

    // 저장 후 분석으로
    sessionStorage.setItem("v2_profile", JSON.stringify(form));
    router.push("/main-v2/analysis");
  };

  const prev = () => { if (step > 1) setStep(step - 1); };
  const progress = (step / TOTAL) * 100;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: "1.5px solid rgba(236,72,153,0.3)", fontSize: 15,
    boxSizing: "border-box", outline: "none",
    fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1a1a2e",
  };

  const catPerStep = ["🙋", "📝", "🎂", "🙋‍♀️", "🕐"];

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>🐱</span>
          <span style={{ fontWeight: 900, fontSize: 15, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운 v2</span>
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#8b5cf6" }}>{step} / {TOTAL}</span>
      </header>

      {/* 진행 바 */}
      <div style={{ height: 4, background: "rgba(236,72,153,0.1)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: G, transition: "width 0.4s ease", borderRadius: "0 4px 4px 0" }} />
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "36px 20px 60px" }}>

        {/* 고양이 + 제목 */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 68, marginBottom: 12, display: "inline-block", animation: "catBounce 2s ease-in-out infinite" }}>{catPerStep[step - 1]}</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: 0 }}>
            {step === 1 && "누구의 운세를 볼까요?"}
            {step === 2 && "이름을 알려주세요"}
            {step === 3 && "생년월일을 입력해주세요"}
            {step === 4 && "성별을 선택해주세요"}
            {step === 5 && "태어난 시간을 선택해주세요"}
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "6px 0 0", fontWeight: 500 }}>
            {step === 5 && "모르시면 '모름'을 선택하셔도 됩니다"}
          </p>
        </div>

        {/* 카드 */}
        <div style={{ background: "white", borderRadius: 24, padding: "28px 20px", boxShadow: "0 8px 40px rgba(236,72,153,0.08)", border: "1.5px solid rgba(236,72,153,0.12)" }}>

          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {RELATIONSHIPS.map(r => (
                <button key={r.value} onClick={() => setForm(prev => ({ ...prev, relationship: r.value }))}
                  style={{ padding: "16px 8px", borderRadius: 14, border: form.relationship === r.value ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.15)", background: form.relationship === r.value ? "#fdf2f8" : "white", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: form.relationship === r.value ? "#ec4899" : "#374151" }}>{r.label}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="홍길동" style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = "#ec4899"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(236,72,153,0.3)"} />
          )}

          {step === 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <input type="number" value={form.birthYear} onChange={e => setForm(p => ({ ...p, birthYear: e.target.value }))}
                placeholder="1990" min="1900" max="2024" style={{ ...inputStyle, textAlign: "center" }} />
              <select value={form.birthMonth} onChange={e => setForm(p => ({ ...p, birthMonth: e.target.value }))} style={{ ...inputStyle, textAlign: "center" }}>
                <option value="">월</option>
                {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}월</option>)}
              </select>
              <select value={form.birthDay} onChange={e => setForm(p => ({ ...p, birthDay: e.target.value }))} style={{ ...inputStyle, textAlign: "center" }}>
                <option value="">일</option>
                {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}일</option>)}
              </select>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["남", "여"].map(g => (
                <button key={g} onClick={() => setForm(p => ({ ...p, gender: g }))}
                  style={{ padding: "22px 0", borderRadius: 16, border: form.gender === g ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.15)", background: form.gender === g ? "#fdf2f8" : "white", color: form.gender === g ? "#ec4899" : "#374151", fontWeight: 900, fontSize: 17, cursor: "pointer", transition: "all 0.15s" }}>
                  {g === "남" ? "🧑 남성" : "👩 여성"}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxHeight: 360, overflowY: "auto" }}>
              {BIRTH_HOURS.map(h => (
                <button key={h.value} onClick={() => setForm(p => ({ ...p, birthHour: h.value }))}
                  style={{ padding: "12px 8px", borderRadius: 12, border: form.birthHour === h.value ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.12)", background: form.birthHour === h.value ? "#fdf2f8" : "white", color: form.birthHour === h.value ? "#ec4899" : "#374151", fontWeight: 800, fontSize: 12, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                  <div>{h.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.65, marginTop: 2 }}>{h.time}</div>
                </button>
              ))}
            </div>
          )}

          {/* 버튼 */}
          <div style={{ display: "grid", gridTemplateColumns: step > 1 ? "1fr 2fr" : "1fr", gap: 10, marginTop: 24 }}>
            {step > 1 && (
              <button onClick={prev} style={{ padding: "14px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 50, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>← 이전</button>
            )}
            <button onClick={next} style={{ padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
              {step === TOTAL ? "🔮 분석 시작" : "다음 →"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: "16px 0 0", fontWeight: 500 }}>
          🔒 입력 정보는 암호화되어 안전하게 보호됩니다
        </p>
      </div>

      <style jsx>{`
        @keyframes catBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}
