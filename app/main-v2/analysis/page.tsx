"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const CATS = [
  { value: "🌟 오늘의 운세", icon: "🌟", label: "오늘의 운세", desc: "오늘 하루 기운" },
  { value: "💰 재물운", icon: "💰", label: "재물운", desc: "돈·투자·자산" },
  { value: "💕 연애운", icon: "💕", label: "연애운", desc: "사랑·인연·궁합" },
  { value: "🎯 성공운", icon: "🎯", label: "성공운", desc: "커리어·꿈·성취" },
  { value: "💪 건강운", icon: "💪", label: "건강운", desc: "몸·마음·활력" },
  { value: "✨ 총운", icon: "✨", label: "총운", desc: "올해 전체 운세" },
];

const FU: Record<string, { q: string; opts: string[] }> = {
  "🌟 오늘의 운세": { q: "오늘 어떤 기운이 궁금하세요?", opts: ["오늘 전체적인 운세", "오늘 좋은 시간대", "오늘 주의할 점", "오늘 행운 포인트"] },
  "💰 재물운": { q: "재물에서 지금 가장 고민은?", opts: ["돈을 더 벌고 싶어요", "투자·저축 고민", "부채 해결이 급해요", "새 수입원 찾기"] },
  "💕 연애운": { q: "연애에서 가장 원하는 게 뭔가요?", opts: ["좋은 인연 만나기", "현재 관계 개선", "이별 극복", "결혼·진지한 관계"] },
  "🎯 성공운": { q: "성공을 향해 지금 어떤 상황인가요?", opts: ["새 목표가 생겼어요", "인정받고 싶어요", "용기가 필요해요", "경쟁 중이에요"] },
  "💪 건강운": { q: "건강에서 가장 신경 쓰이는 부분은?", opts: ["전반적 체력 향상", "스트레스 관리", "다이어트·체형", "특정 질환·통증"] },
  "✨ 총운": { q: "올해 가장 기대되는 게 뭔가요?", opts: ["돈이 많이 생기길", "좋은 인연 만나길", "하는 일 잘 되길", "건강하게 지내길"] },
};

const LOAD_MSGS = [
  "사주를 읽고 있습니다...",
  "오행의 기운을 분석합니다...",
  "운세 점수를 계산합니다...",
  "결과를 정리하고 있습니다...",
];

type Phase = "cat" | "fu" | "loading";

export default function V2Analysis() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("cat");
  const [selCat, setSelCat] = useState("");
  const [selOpt, setSelOpt] = useState("");
  const [loadMsg, setLoadMsg] = useState(LOAD_MSGS[0]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const p = sessionStorage.getItem("v2_profile");
    if (!p) { router.replace("/main-v2/profile"); return; }
    setProfile(JSON.parse(p));
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % LOAD_MSGS.length; setLoadMsg(LOAD_MSGS[i]); }, 900);
    return () => clearInterval(t);
  }, [phase]);

  const startAnalysis = async () => {
    if (!selOpt) { alert("옵션을 선택해주세요"); return; }
    setPhase("loading");
    try {
      const res = await fetch("/api/v2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          birth: `${profile.birthYear}-${profile.birthMonth}-${profile.birthDay}`,
          birthHour: profile.birthHour,
          gender: profile.gender,
          relationship: profile.relationship,
          category: selCat,
          followUp: selOpt,
          planType: "free",
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const result = { ...data, category: selCat, followUp: selOpt, profile };
      sessionStorage.setItem("v2_result", JSON.stringify(result));
      router.push("/main-v2/result");
    } catch {
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      setPhase("fu");
    }
  };

  if (!profile) return null;
  const fuData = FU[selCat];

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => phase === "fu" ? setPhase("cat") : router.push("/main-v2/profile")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
        </button>
        <span style={{ fontSize: 13, fontWeight: 700, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{profile.name}님의 운세</span>
        <div style={{ width: 48 }} />
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px 60px" }}>

        {/* 카테고리 선택 — 재물운 강제 선택 */}
        {phase === "cat" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 72, lineHeight: 1, marginBottom: 12, display: "inline-block", animation: "catBounce 2s ease-in-out infinite" }}>🐱</div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>오늘의 무료 사주</h1>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>오늘의 운세 무료 분석 · 나머지는 ₩990</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {CATS.map((c, i) => {
                const isFree = c.value === "🌟 오늘의 운세";
                return (
                  <button key={c.value}
                    onClick={() => { if (isFree) { setSelCat(c.value); setPhase("fu"); } }}
                    disabled={!isFree}
                    style={{ padding: "22px 14px", borderRadius: 20, border: isFree ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.1)", background: isFree ? "white" : "#f9fafb", cursor: isFree ? "pointer" : "not-allowed", textAlign: "center", gridColumn: i === 4 ? "1 / -1" : undefined, boxShadow: isFree ? "0 4px 20px rgba(236,72,153,0.18)" : "none", opacity: isFree ? 1 : 0.45, transition: "transform 0.15s, box-shadow 0.15s", position: "relative" }}
                    onTouchStart={e => { if (isFree) e.currentTarget.style.transform = "scale(0.96)"; }}
                    onTouchEnd={e => { if (isFree) e.currentTarget.style.transform = "scale(1)"; }}
                    onMouseEnter={e => { if (isFree) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(236,72,153,0.25)"; } }}
                    onMouseLeave={e => { if (isFree) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(236,72,153,0.18)"; } }}
                  >
                    {isFree && (
                      <div style={{ position: "absolute", top: 8, right: 8, background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 20 }}>FREE</div>
                    )}
                    {!isFree && (
                      <div style={{ position: "absolute", top: 8, right: 8, background: "#e5e7eb", color: "#9ca3af", fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 20 }}>🔒</div>
                    )}
                    <div style={{ fontSize: i === 4 ? 44 : 38, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: isFree ? "#1a1a2e" : "#9ca3af", marginBottom: 3 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{c.desc}</div>
                  </button>
                );
              })}
            </div>

            <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 16 }}>
              💎 나머지 4개 운세는 결과 페이지에서 ₩990에 확인하세요
            </p>
          </>
        )}

        {/* 팔로우업 */}
        {phase === "fu" && fuData && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 10 }}>{CATS.find(c => c.value === selCat)?.icon}</div>
              <h1 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px" }}>{fuData.q}</h1>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>해당하는 상황을 선택해주세요</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {fuData.opts.map(opt => (
                <button key={opt} onClick={() => setSelOpt(opt)}
                  style={{ padding: "16px 18px", borderRadius: 16, border: selOpt === opt ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.14)", background: selOpt === opt ? "#fdf2f8" : "white", color: selOpt === opt ? "#ec4899" : "#374151", fontWeight: selOpt === opt ? 900 : 700, fontSize: 14, cursor: "pointer", textAlign: "left" }}>
                  {selOpt === opt ? "✓ " : "○ "}{opt}
                </button>
              ))}
            </div>

            <button onClick={startAnalysis} disabled={!selOpt}
              style={{ width: "100%", padding: "15px 0", background: selOpt ? G : "#e5e7eb", color: selOpt ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: selOpt ? "pointer" : "not-allowed", boxShadow: selOpt ? "0 6px 20px rgba(236,72,153,0.3)" : "none" }}>
              🔮 분석 시작
            </button>
          </>
        )}

        {/* 로딩 */}
        {phase === "loading" && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 88, marginBottom: 24, display: "inline-block", animation: "spin 1.5s ease-in-out infinite" }}>🔮</div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>{loadMsg}</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>잠시만 기다려 주세요...</p>
            <div style={{ height: 6, background: "rgba(236,72,153,0.1)", borderRadius: 99, overflow: "hidden", maxWidth: 260, margin: "0 auto" }}>
              <div style={{ height: "100%", background: G, borderRadius: 99, animation: "bar 2.5s ease-in-out infinite" }} />
            </div>
            <p style={{ marginTop: 28, fontSize: 12, color: "#9ca3af" }}>✨ {profile.name}님의 {selCat}을 분석 중입니다</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes catBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { 0%,100%{transform:scale(1) rotate(-5deg)} 50%{transform:scale(1.15) rotate(5deg)} }
        @keyframes bar { 0%{width:0%;margin-left:0} 50%{width:70%;margin-left:0} 100%{width:0%;margin-left:100%} }
      `}</style>
    </main>
  );
}
