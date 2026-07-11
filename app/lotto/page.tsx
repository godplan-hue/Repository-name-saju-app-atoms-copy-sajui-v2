"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SAMPLE_BALLS = [3, 14, 22, 31, 38, 42];

function Ball({ n, size = 44, delay = 0 }: { n: number; size?: number; delay?: number }) {
  const getColor = (num: number) => {
    if (num <= 10) return { bg: "#fbbf24", text: "#78350f" };
    if (num <= 20) return { bg: "#60a5fa", text: "#1e3a8a" };
    if (num <= 30) return { bg: "#f97316", text: "#7c2d12" };
    if (num <= 40) return { bg: "#9ca3af", text: "#1f2937" };
    return { bg: "#4ade80", text: "#14532d" };
  };
  const { bg, text } = getColor(n);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${bg}ff, ${bg}99)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: size * 0.36, color: text,
      boxShadow: `0 4px 12px ${bg}66, inset 0 -2px 4px rgba(0,0,0,0.15)`,
      animation: `ballPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both`,
      flexShrink: 0,
    }}>
      {n}
    </div>
  );
}

export default function LottoPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    if (!birthYear || birthYear.length < 4) { setError("출생연도를 입력해주세요."); return; }
    if (!birthMonth) { setError("출생월을 입력해주세요."); return; }
    if (!birthDay) { setError("출생일을 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/lotto/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone: cleanPhone, birthYear: Number(birthYear), birthMonth: Number(birthMonth), birthDay: Number(birthDay),
        }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/lotto/result/${data.id}`);
      } else {
        setError("오류가 발생했습니다. 다시 시도해주세요.");
        setLoading(false);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#050010", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    btn: { width: "100%", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "white", border: "none", borderRadius: 22, padding: "17px", fontSize: 17, fontWeight: 900, cursor: "pointer" },
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 52, animation: "spin 1s linear infinite", marginBottom: 20 }}>🎱</div>
        <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 700 }}>행운번호 계산 중...</p>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <style>{`@keyframes ballPop { 0% { transform: scale(0) rotate(-180deg); opacity:0; } 70% { transform: scale(1.15) rotate(10deg); } 100% { transform: scale(1) rotate(0deg); opacity:1; } } @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>

      <div style={{ background: "linear-gradient(180deg,#120030 0%,#050010 100%)" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
          <Link href="/main-v2" style={{ color: "#fbbf24", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 20, textAlign: "left" }}>← 점운 홈</Link>

          <div style={{ fontSize: 56, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🎱</div>
          <h1 style={{ fontSize: 27, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.3 }}>
            사주로 뽑는<br />
            <span style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              나의 행운번호
            </span>
          </h1>
          <p style={{ color: "#fde68a", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>
            생년월일 → 오행 계산 → 행운번호 6개<br />
            사주 에너지가 담긴 나만의 숫자
          </p>

          {/* 샘플 공 */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" as const }}>
            {SAMPLE_BALLS.map((n, i) => <Ball key={n} n={n} size={46} delay={i * 100} />)}
          </div>

          {/* 색깔 범례 */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" as const }}>
            {[["#fbbf24","1~10"],["#60a5fa","11~20"],["#f97316","21~30"],["#9ca3af","31~40"],["#4ade80","41~45"]].map(([c,l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: c as string }} />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px 80px" }}>
        <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 20, padding: "20px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", margin: "0 0 16px" }}>🎯 정보 입력</p>

          <div style={{ marginBottom: 10 }}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 에스더" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>전화번호 (필수)</label>
            <input style={{ ...S.input, border: `1px solid ${error && !phone ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }} placeholder="010-0000-0000" inputMode="tel" value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1.3 }}>
              <label style={S.label}>출생연도 *</label>
              <input style={S.input} placeholder="1990" maxLength={4} inputMode="numeric"
                value={birthYear} onChange={e => setBirthYear(e.target.value.replace(/\D/g,"").slice(0,4))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>월 *</label>
              <input style={S.input} placeholder="3" maxLength={2} inputMode="numeric"
                value={birthMonth} onChange={e => setBirthMonth(e.target.value.replace(/\D/g,"").slice(0,2))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>일 *</label>
              <input style={S.input} placeholder="15" maxLength={2} inputMode="numeric"
                value={birthDay} onChange={e => setBirthDay(e.target.value.replace(/\D/g,"").slice(0,2))} />
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        <button onClick={analyze} style={S.btn}>
          행운번호 뽑기 🎱 →
        </button>
        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 10 }}>완전 무료 · 오행 사주 기반 계산</p>

        <div style={{ marginTop: 28 }}>
          {[
            { icon: "🌿", t: "오행별 행운숫자", s: "사주 오행에 따라 행운 에너지가 집중되는 숫자가 다릅니다" },
            { icon: "🎴", t: "행운 메시지 카드", s: "오늘의 운을 담은 카드를 뽑아보세요" },
            { icon: "📤", t: "결과 공유", s: "친구에게 공유하고 서로의 번호를 비교해보세요" },
          ].map(f => (
            <div key={f.t} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: 14, color: "#fde68a" }}>{f.t}</p>
                <p style={{ color: "#9ca3af", fontSize: 12, margin: 0, lineHeight: 1.5 }}>{f.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
