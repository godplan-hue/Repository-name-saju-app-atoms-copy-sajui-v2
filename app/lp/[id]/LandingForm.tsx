"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HOURS = [
  "모름", "자시(23~01시)", "축시(01~03시)", "인시(03~05시)", "묘시(05~07시)",
  "진시(07~09시)", "사시(09~11시)", "오시(11~13시)", "미시(13~15시)",
  "신시(15~17시)", "유시(17~19시)", "술시(19~21시)", "해시(21~23시)",
];

export default function LandingForm({ partnerId, ctaText, primary }: { partnerId: string; ctaText: string; primary: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [hour, setHour] = useState("모름");
  const [lunar, setLunar] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) { setErr("이름을 입력해주세요."); return; }
    if (birth.length !== 8 || isNaN(Number(birth))) { setErr("생년월일 8자리를 입력해주세요. 예) 19950315"); return; }
    if (!gender) { setErr("성별을 선택해주세요."); return; }
    setErr("");

    const y = birth.slice(0, 4), m = birth.slice(4, 6), d = birth.slice(6, 8);
    try {
      sessionStorage.setItem("v2_name", name.trim());
      sessionStorage.setItem("v2_year", y);
      sessionStorage.setItem("v2_month", m);
      sessionStorage.setItem("v2_day", d);
      sessionStorage.setItem("v2_gender", gender);
      sessionStorage.setItem("v2_hour", hour === "모름" ? "" : hour.replace(/\(.*\)/, "").trim());
      sessionStorage.setItem("v2_lunar", lunar ? "1" : "0");
      localStorage.setItem("referred_by", partnerId);
    } catch {}

    router.push(`/main-v2?ref=${partnerId}&prefill=1`);
  };

  const inp = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #e5e7eb", background: "white",
    fontSize: 15, outline: "none", boxSizing: "border-box" as const,
    fontFamily: "inherit", color: "#1f2937",
  };
  const label = { fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6, display: "block" as const };

  return (
    <div style={{ background: "white", borderRadius: 20, padding: "28px 22px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", maxWidth: 480, margin: "0 auto" }}>
      <p style={{ textAlign: "center", fontWeight: 900, fontSize: 17, color: "#1f2937", margin: "0 0 24px" }}>📋 정보 입력하기</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={label}>이름</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inp} placeholder="예) 홍길동" maxLength={10} />
        </div>

        <div>
          <label style={label}>생년월일 <span style={{ fontWeight: 400, color: "#9ca3af" }}>(8자리 숫자)</span></label>
          <input
            value={birth}
            onChange={e => setBirth(e.target.value.replace(/\D/g, "").slice(0, 8))}
            style={inp}
            placeholder="예) 19950315"
            inputMode="numeric"
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <button
              onClick={() => setLunar(false)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${!lunar ? primary : "#e5e7eb"}`, background: !lunar ? `${primary}15` : "white", color: !lunar ? primary : "#9ca3af", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >양력</button>
            <button
              onClick={() => setLunar(true)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${lunar ? primary : "#e5e7eb"}`, background: lunar ? `${primary}15` : "white", color: lunar ? primary : "#9ca3af", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >음력</button>
          </div>
        </div>

        <div>
          <label style={label}>성별</label>
          <div style={{ display: "flex", gap: 10 }}>
            {(["male", "female"] as const).map(g => (
              <button key={g} onClick={() => setGender(g)} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: `1.5px solid ${gender === g ? primary : "#e5e7eb"}`, background: gender === g ? `${primary}15` : "white", color: gender === g ? primary : "#9ca3af", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                {g === "male" ? "🙋‍♂️ 남자" : "🙋‍♀️ 여자"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={label}>태어난 시간 <span style={{ fontWeight: 400, color: "#9ca3af" }}>(선택)</span></label>
          <select value={hour} onChange={e => setHour(e.target.value)} style={{ ...inp, appearance: "none" as const, WebkitAppearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {err && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 12, textAlign: "center" }}>{err}</p>}

      <button
        onClick={handleSubmit}
        style={{ width: "100%", marginTop: 22, padding: "15px 0", background: `linear-gradient(135deg, ${primary}, ${primary}cc)`, color: "white", border: "none", borderRadius: 12, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: `0 4px 16px ${primary}40` }}
      >
        🔮 {ctaText}
      </button>
      <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 10 }}>무료 오늘의 운세로 먼저 체험해보세요</p>
    </div>
  );
}
