"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ZODIACS = [
  { name: "양자리", symbol: "♈", period: "3/21~4/19", emoji: "🐏" },
  { name: "황소자리", symbol: "♉", period: "4/20~5/20", emoji: "🐂" },
  { name: "쌍둥이자리", symbol: "♊", period: "5/21~6/21", emoji: "👯" },
  { name: "게자리", symbol: "♋", period: "6/22~7/22", emoji: "🦀" },
  { name: "사자자리", symbol: "♌", period: "7/23~8/22", emoji: "🦁" },
  { name: "처녀자리", symbol: "♍", period: "8/23~9/22", emoji: "🌾" },
  { name: "천칭자리", symbol: "♎", period: "9/23~10/22", emoji: "⚖️" },
  { name: "전갈자리", symbol: "♏", period: "10/23~11/22", emoji: "🦂" },
  { name: "사수자리", symbol: "♐", period: "11/23~12/21", emoji: "🏹" },
  { name: "염소자리", symbol: "♑", period: "12/22~1/19", emoji: "🐐" },
  { name: "물병자리", symbol: "♒", period: "1/20~2/18", emoji: "🏺" },
  { name: "물고기자리", symbol: "♓", period: "2/19~3/20", emoji: "🐟" },
];

function getBirthZodiac(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "양자리";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "황소자리";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "쌍둥이자리";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "게자리";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "사자자리";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "처녀자리";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "천칭자리";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 22)) return "전갈자리";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "사수자리";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "염소자리";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "물병자리";
  return "물고기자리";
}

export default function ZodiacPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "select" | "form">("intro");
  const [mode, setMode] = useState<"birthday" | "direct">("birthday");
  const [selectedZodiac, setSelectedZodiac] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBirthdayNext = () => {
    const m = Number(birthMonth), d = Number(birthDay);
    if (!m || !d) { setError("생월과 생일을 입력해주세요."); return; }
    const z = getBirthZodiac(m, d);
    setSelectedZodiac(z);
    setError("");
    setStep("form");
  };

  const handleDirectSelect = (zodiac: string) => {
    setSelectedZodiac(zodiac);
    setStep("form");
  };

  const analyze = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    setLoading(true); setError("");
    try {
      const body: Record<string, string | number> = {
        name, phone: cleanPhone, email,
        birthMonth: birthMonth || "0", birthDay: birthDay || "0", birthYear: birthYear || "0",
        zodiacDirect: selectedZodiac,
      };
      const res = await fetch("/api/zodiac/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/zodiac/result/${data.id}`);
      } else {
        setError("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#050d1a", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    btn: { width: "100%", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.35)" } as const,
  };

  // 인트로
  if (step === "intro") {
    return (
      <div style={S.wrap}>
        <style>{`
          @keyframes twinkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
          @keyframes floatStar{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        `}</style>
        <div style={{ background: "linear-gradient(180deg,#0a1628 0%,#050d1a 100%)", paddingBottom: 40 }}>
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
            <Link href="/main-v2" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 24, textAlign: "left" }}>← 점운 홈</Link>
            <div style={{ fontSize: 72, marginBottom: 12, display: "inline-block", animation: "floatStar 3s ease-in-out infinite" }}>⭐</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.3 }}>
              오늘 내 별자리는?
              <br />
              <span style={{ background: "linear-gradient(135deg,#93c5fd,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운 별자리</span>
            </h1>
            <p style={{ color: "#93c5fd", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px" }}>
              12별자리 오늘 운세 · 사랑·직업·건강 점수<br />
              오행 교차분석으로 더 깊게 알아보세요
            </p>
            {/* 12별자리 미니 그리드 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, marginBottom: 28 }}>
              {ZODIACS.map(z => (
                <div key={z.name} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 0", display: "flex", flexDirection: "column" as const, alignItems: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize: 18 }}>{z.emoji}</span>
                  <span style={{ fontSize: 9, color: "#93c5fd", marginTop: 4, fontWeight: 700 }}>{z.name.replace("자리","")}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep("select")} style={S.btn}>내 별자리 운세 보기 ⭐ →</button>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>완전 무료 · 전화번호만 있으면 OK</p>
          </div>
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px" }}>
          {[
            { icon: "💗", title: "사랑·직업·건강 점수", desc: "오늘 내 세 가지 에너지를 % 점수로 한눈에 확인해요." },
            { icon: "🌿", title: "오행 × 별자리 교차분석", desc: "생년 오행과 별자리를 결합한 점운만의 분석이에요." },
            { icon: "🍀", title: "행운 색상·숫자·방향", desc: "오늘 나에게 유리한 행운 아이템을 알려드려요." },
            { icon: "📅", title: "오늘·이번주·이번달 운세", desc: "단기와 중기 흐름을 함께 확인할 수 있어요." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: 15 }}>{f.title}</p>
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px 40px" }}>
          <button onClick={() => setStep("select")} style={S.btn}>별자리 운세 시작하기 →</button>
        </div>
      </div>
    );
  }

  // 별자리 선택 단계
  if (step === "select") {
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ paddingTop: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: "#93c5fd", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
            <span style={{ fontSize: 13, color: "#6b7280" }}>별자리 선택</span>
          </div>

          {/* 탭: 생일 입력 / 직접 선택 */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {[{ key: "birthday", label: "🎂 생일로 찾기" }, { key: "direct", label: "⭐ 직접 선택" }].map(t => (
              <button key={t.key} onClick={() => { setMode(t.key as "birthday"|"direct"); setError(""); }}
                style={{ flex: 1, padding: "10px", background: mode === t.key ? "linear-gradient(135deg,#1d4ed8,#7c3aed)" : "transparent", color: mode === t.key ? "white" : "#9ca3af", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {t.label}
              </button>
            ))}
          </div>

          {mode === "birthday" ? (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 6px" }}>생일을 알려주세요</h2>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>별자리를 자동으로 찾아드려요</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={S.label}>생월</label>
                  <input style={{ ...S.input, border: `1px solid ${error ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }}
                    placeholder="7" maxLength={2} inputMode="numeric" value={birthMonth}
                    onChange={e => { setBirthMonth(e.target.value.replace(/\D/g,"").slice(0,2)); setError(""); }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={S.label}>생일</label>
                  <input style={{ ...S.input, border: `1px solid ${error ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }}
                    placeholder="11" maxLength={2} inputMode="numeric" value={birthDay}
                    onChange={e => { setBirthDay(e.target.value.replace(/\D/g,"").slice(0,2)); setError(""); }} />
                </div>
                <div style={{ flex: 1.5 }}>
                  <label style={S.label}>출생연도 (선택)</label>
                  <input style={S.input} placeholder="1995" maxLength={4} inputMode="numeric" value={birthYear}
                    onChange={e => setBirthYear(e.target.value.replace(/\D/g,"").slice(0,4))} />
                </div>
              </div>
              {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button onClick={handleBirthdayNext} style={S.btn}>내 별자리 찾기 →</button>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 6px" }}>별자리를 선택하세요</h2>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>12별자리 중 내 별자리를 골라요</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {ZODIACS.map(z => (
                  <button key={z.name} onClick={() => handleDirectSelect(z.name)}
                    style={{ padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" as const }}>
                    <span style={{ fontSize: 26 }}>{z.emoji}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "white" }}>{z.name}</p>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{z.period}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 정보 입력 단계
  const zInfo = ZODIACS.find(z => z.name === selectedZodiac);
  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ paddingTop: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setStep("select")} style={{ background: "none", border: "none", color: "#93c5fd", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>전화번호 입력</span>
        </div>

        {/* 선택된 별자리 표시 */}
        <div style={{ background: "linear-gradient(135deg,rgba(29,78,216,0.2),rgba(124,58,237,0.15))", border: "1px solid rgba(147,197,253,0.2)", borderRadius: 20, padding: "20px", marginBottom: 24, textAlign: "center" }}>
          <span style={{ fontSize: 52 }}>{zInfo?.emoji}</span>
          <p style={{ fontWeight: 900, fontSize: 20, margin: "8px 0 2px" }}>{selectedZodiac}</p>
          <p style={{ fontSize: 12, color: "#93c5fd", margin: 0 }}>{zInfo?.period}</p>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 4px" }}>거의 다 됐어요!</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>전화번호만 입력하면 운세가 바로 나와요</p>

        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>전화번호 (필수)</label>
          <input style={{ ...S.input, border: `1px solid ${error.includes("전화") ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }}
            placeholder="010-0000-0000" inputMode="tel" value={phone}
            onChange={e => { setPhone(e.target.value); setError(""); }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>이름 또는 별명 (선택)</label>
          <input style={S.input} placeholder="예) 지은, 별이" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={S.label}>이메일 (선택)</label>
          <input style={S.input} placeholder="example@email.com" inputMode="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}
        <button onClick={analyze} disabled={loading}
          style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "별자리 운세 불러오는 중... ⭐" : `${selectedZodiac} 운세 보기 →`}
        </button>
        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 10 }}>완전 무료 · 광고 없음</p>
      </div>
    </div>
  );
}
