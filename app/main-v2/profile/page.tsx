"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const RELS = [
  { value: "나", icon: "🙋", label: "나" },
  { value: "배우자", icon: "💑", label: "배우자" },
  { value: "자녀", icon: "👧", label: "자녀" },
  { value: "부모", icon: "👨‍👩‍👧", label: "부모" },
  { value: "친구", icon: "🤝", label: "친구" },
  { value: "연인", icon: "💕", label: "연인" },
];

const HOURS = [
  { label: "자시(子時)", value: "00", time: "23~01시" },
  { label: "축시(丑時)", value: "01", time: "01~03시" },
  { label: "인시(寅時)", value: "02", time: "03~05시" },
  { label: "묘시(卯時)", value: "03", time: "05~07시" },
  { label: "진시(辰時)", value: "04", time: "07~09시" },
  { label: "사시(巳時)", value: "05", time: "09~11시" },
  { label: "오시(午時)", value: "06", time: "11~13시" },
  { label: "미시(未時)", value: "07", time: "13~15시" },
  { label: "신시(申時)", value: "08", time: "15~17시" },
  { label: "유시(酉時)", value: "09", time: "17~19시" },
  { label: "술시(戌時)", value: "10", time: "19~21시" },
  { label: "해시(亥時)", value: "11", time: "21~23시" },
  { label: "모름", value: "unknown", time: "모르는 경우" },
];

const inp: React.CSSProperties = {
  width: "100%", padding: "13px 14px", borderRadius: 12,
  border: "1.5px solid rgba(236,72,153,0.25)", fontSize: 15,
  boxSizing: "border-box", outline: "none",
  fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  color: "#1a1a2e", background: "white",
};

const STEPS = [
  { icon: "🙋", title: "누구의 운세를 볼까요?", hint: "" },
  { icon: "📝", title: "이름을 알려주세요", hint: "" },
  { icon: "🎂", title: "생년월일을 입력해주세요", hint: "" },
  { icon: "👤", title: "성별을 선택해주세요", hint: "" },
  { icon: "🕐", title: "태어난 시를 선택해주세요", hint: "모르시면 '모름'을 선택해도 됩니다" },
  { icon: "📱", title: "연락처를 입력해주세요", hint: "" },
];

export default function V2Profile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", relationship: "나",
    birthYear: "", birthMonth: "", birthDay: "",
    gender: "", birthHour: "",
    phone: "", email: "",
  });

  useEffect(() => {
    const n = localStorage.getItem("v2_user_name") ?? "";
    if (n && !["카카오 사용자", "네이버 사용자", "Google 사용자"].includes(n))
      setForm(p => ({ ...p, name: n }));
  }, []);

  const TOTAL = 6;
  const progress = (step / TOTAL) * 100;
  const cur = STEPS[step - 1];

  const finish = () => {
    sessionStorage.setItem("v2_profile", JSON.stringify(form));
    router.push("/main-v2/analysis");
  };

  const next = () => {
    const ok: Record<number, boolean> = {
      1: !!form.relationship,
      2: !!form.name.trim(),
      3: !!(form.birthYear && form.birthMonth && form.birthDay),
      4: !!form.gender,
      5: !!form.birthHour,
      6: true, // 선택 입력
    };
    if (!ok[step]) { alert("정보를 입력해주세요"); return; }
    if (step < TOTAL) { setStep(s => s + 1); return; }
    finish();
  };

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => step > 1 ? setStep(s => s - 1) : router.push("/main-v2")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
        </button>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6" }}>{step} / {TOTAL}</span>
      </header>

      {/* 진행 바 */}
      <div style={{ height: 4, background: "rgba(236,72,153,0.1)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: G, transition: "width 0.4s ease", borderRadius: "0 4px 4px 0" }} />
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px 60px" }}>

        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 10, display: "inline-block", animation: "bounce 2s ease-in-out infinite" }}>{cur.icon}</div>
          <h1 style={{ fontSize: 19, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px" }}>{cur.title}</h1>
          {cur.hint && <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{cur.hint}</p>}
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: "22px 16px", boxShadow: "0 6px 32px rgba(236,72,153,0.08)", border: "1.5px solid rgba(236,72,153,0.1)" }}>

          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
              {RELS.map(r => (
                <button key={r.value} onClick={() => setForm(p => ({ ...p, relationship: r.value }))}
                  style={{ padding: "15px 8px", borderRadius: 14, border: form.relationship === r.value ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.15)", background: form.relationship === r.value ? "#fdf2f8" : "white", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: form.relationship === r.value ? "#ec4899" : "#374151" }}>{r.label}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <input autoFocus type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && next()}
              placeholder="홍길동" style={inp}
              onFocus={e => (e.currentTarget.style.borderColor = "#ec4899")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.25)")} />
          )}

          {step === 3 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
                <input type="number" value={form.birthYear} onChange={e => setForm(p => ({ ...p, birthYear: e.target.value }))}
                  placeholder="1990" min="1900" max="2024" style={{ ...inp, textAlign: "center" }} />
                <select value={form.birthMonth} onChange={e => setForm(p => ({ ...p, birthMonth: e.target.value }))} style={{ ...inp, textAlign: "center" }}>
                  <option value="">월</option>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}월</option>)}
                </select>
                <select value={form.birthDay} onChange={e => setForm(p => ({ ...p, birthDay: e.target.value }))} style={{ ...inp, textAlign: "center" }}>
                  <option value="">일</option>
                  {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}일</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ v: "남", label: "🧑 남성" }, { v: "여", label: "👩 여성" }].map(g => (
                <button key={g.v} onClick={() => setForm(p => ({ ...p, gender: g.v }))}
                  style={{ padding: "20px 0", borderRadius: 16, border: form.gender === g.v ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.15)", background: form.gender === g.v ? "#fdf2f8" : "white", color: form.gender === g.v ? "#ec4899" : "#374151", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
                  {g.label}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, maxHeight: 330, overflowY: "auto" }}>
              {HOURS.map(h => (
                <button key={h.value} onClick={() => setForm(p => ({ ...p, birthHour: h.value }))}
                  style={{ padding: "10px 6px", borderRadius: 12, border: form.birthHour === h.value ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.12)", background: form.birthHour === h.value ? "#fdf2f8" : "white", color: form.birthHour === h.value ? "#ec4899" : "#374151", fontWeight: 800, fontSize: 11, cursor: "pointer", textAlign: "center" }}>
                  <div>{h.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{h.time}</div>
                </button>
              ))}
            </div>
          )}

          {step === 6 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                autoFocus type="tel" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); (e.currentTarget.nextElementSibling as HTMLInputElement)?.focus(); } }}
                placeholder="010-0000-0000" style={inp}
                onFocus={e => (e.currentTarget.style.borderColor = "#ec4899")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.25)")}
              />
              <input
                type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") finish(); }}
                placeholder="example@email.com" style={inp}
                onFocus={e => (e.currentTarget.style.borderColor = "#ec4899")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.25)")}
              />
              <button onClick={finish}
                style={{ padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.3)", marginTop: 4 }}>
                🔮 분석 시작
              </button>
            </div>
          )}

          {step < 6 && (
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: step > 1 ? "1fr 2fr" : "1fr", gap: 10 }}>
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} style={{ padding: "14px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>← 이전</button>
              )}
              <button onClick={next} style={{ padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.3)" }}>
                다음 →
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 14 }}>🔒 입력 정보는 암호화 보호됩니다</p>
      </div>

      <style jsx>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </main>
  );
}
