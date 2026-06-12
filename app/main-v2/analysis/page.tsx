"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const CATEGORIES = [
  { value: "💰 재물운", icon: "💰", label: "재물운", desc: "돈·투자·자산" },
  { value: "💕 연애운", icon: "💕", label: "연애운", desc: "사랑·인연·궁합" },
  { value: "🎯 성공운", icon: "🎯", label: "성공운", desc: "커리어·꿈·성취" },
  { value: "💪 건강운", icon: "💪", label: "건강운", desc: "몸·마음·활력" },
  { value: "✨ 총운", icon: "✨", label: "총운", desc: "올해 전체 운세" },
];

const FOLLOW_UPS: Record<string, { q: string; options: string[] }> = {
  "💰 재물운": {
    q: "재물과 관련해 지금 가장 고민되는 건?",
    options: ["돈을 벌고 싶어요", "투자·저축 고민", "부채 해결이 급해요", "새로운 수입원 찾기"],
  },
  "💕 연애운": {
    q: "연애에서 가장 원하는 게 뭔가요?",
    options: ["좋은 인연 만나기", "현재 관계 개선", "이별 극복", "결혼·진지한 관계"],
  },
  "🎯 성공운": {
    q: "성공을 향해 지금 어떤 상황인가요?",
    options: ["새 목표가 생겼어요", "인정받고 싶어요", "용기가 필요해요", "경쟁 중이에요"],
  },
  "💪 건강운": {
    q: "건강에서 가장 신경 쓰이는 부분은?",
    options: ["전반적 체력 향상", "스트레스 관리", "다이어트·체형", "특정 질환·통증"],
  },
  "✨ 총운": {
    q: "올해 가장 기대되는 게 뭔가요?",
    options: ["돈이 많이 생기길", "좋은 인연 만나길", "하는 일 잘 되길", "건강하게 지내길"],
  },
};

type Phase = "category" | "followup" | "loading";

export default function V2Analysis() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("category");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedOpt, setSelectedOpt] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("사주를 분석하고 있습니다");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const p = sessionStorage.getItem("v2_profile");
    if (!p) { router.replace("/main-v2/profile"); return; }
    setProfile(JSON.parse(p));
  }, []);

  const selectCategory = (cat: string) => {
    setSelectedCat(cat);
    setPhase("followup");
  };

  const startAnalysis = async () => {
    if (!selectedOpt) { alert("옵션을 선택해주세요"); return; }
    setPhase("loading");

    const msgs = [
      "사주를 분석하고 있습니다",
      "오행의 기운을 읽고 있습니다",
      "운세 점수를 계산하고 있습니다",
      "결과를 정리하고 있습니다",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 900);

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
          category: selectedCat,
          followUp: selectedOpt,
          planType: "free",
        }),
      });

      clearInterval(interval);

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      // 결과 저장
      const result = { ...data, category: selectedCat, followUp: selectedOpt, profile };
      sessionStorage.setItem("v2_result", JSON.stringify(result));

      // 히스토리에 추가
      const history = JSON.parse(localStorage.getItem("v2_history") || "[]");
      history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        name: profile.name,
        category: selectedCat,
        scores: data.scores,
        analysis: data.analysis?.slice(0, 80) + "...",
      });
      localStorage.setItem("v2_history", JSON.stringify(history.slice(0, 20)));

      router.push("/main-v2/result");
    } catch {
      clearInterval(interval);
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      setPhase("followup");
    }
  };

  if (!profile) return null;

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => phase === "followup" ? setPhase("category") : router.push("/main-v2/profile")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 600 }}>뒤로</span>
        </button>
        <span style={{ fontWeight: 900, fontSize: 14, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {profile.name}님의 운세
        </span>
        <div style={{ width: 48 }} />
      </header>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* 카테고리 선택 */}
        {phase === "category" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 68, marginBottom: 12, animation: "catBounce 2s ease-in-out infinite", display: "inline-block" }}>🐱</div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>오늘 가장 궁금한 것은?</h1>
              <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>카드를 선택하면 AI가 분석해 드립니다</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.value}
                  onClick={() => selectCategory(cat.value)}
                  style={{
                    padding: "24px 16px",
                    borderRadius: 20,
                    border: "1.5px solid rgba(236,72,153,0.15)",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    gridColumn: i === 4 ? "1 / -1" : undefined,
                    boxShadow: "0 2px 12px rgba(139,92,246,0.06)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(236,72,153,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(139,92,246,0.06)"; }}
                >
                  <div style={{ fontSize: i === 4 ? 44 : 40, marginBottom: 10 }}>{cat.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", marginBottom: 4 }}>{cat.label}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{cat.desc}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 팔로우업 질문 */}
        {phase === "followup" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 52, marginBottom: 10 }}>{CATEGORIES.find(c => c.value === selectedCat)?.icon}</div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>{FOLLOW_UPS[selectedCat]?.q}</h1>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>해당하는 상황을 선택해주세요</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {FOLLOW_UPS[selectedCat]?.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedOpt(opt)}
                  style={{
                    padding: "18px 20px",
                    borderRadius: 16,
                    border: selectedOpt === opt ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.15)",
                    background: selectedOpt === opt ? "#fdf2f8" : "white",
                    color: selectedOpt === opt ? "#ec4899" : "#374151",
                    fontWeight: selectedOpt === opt ? 900 : 700,
                    fontSize: 15,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  {selectedOpt === opt ? "✓ " : "○ "}{opt}
                </button>
              ))}
            </div>

            <button
              onClick={startAnalysis}
              disabled={!selectedOpt}
              style={{ width: "100%", padding: "16px 0", background: selectedOpt ? G : "#e5e7eb", color: selectedOpt ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: selectedOpt ? "pointer" : "not-allowed" }}
            >
              🔮 분석 시작
            </button>
          </>
        )}

        {/* 로딩 */}
        {phase === "loading" && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 90, marginBottom: 24, animation: "catSpin 1.5s ease-in-out infinite", display: "inline-block" }}>🔮</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 12px" }}>{loadingMsg}</h2>
            <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 28px" }}>잠시만 기다려 주세요...</p>

            {/* 로딩 바 */}
            <div style={{ height: 6, background: "rgba(236,72,153,0.12)", borderRadius: 99, overflow: "hidden", maxWidth: 280, margin: "0 auto" }}>
              <div style={{ height: "100%", background: G, borderRadius: 99, animation: "loadBar 2.5s ease-in-out infinite" }} />
            </div>

            <p style={{ marginTop: 32, fontSize: 13, color: "#9ca3af" }}>
              ✨ {profile.name}님의 {selectedCat}을 분석 중입니다
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes catBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes catSpin {
          0%, 100% { transform: scale(1) rotate(-5deg); }
          50% { transform: scale(1.15) rotate(5deg); }
        }
        @keyframes loadBar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 70%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </main>
  );
}
