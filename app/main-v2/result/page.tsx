"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(t);
  }, [score]);

  const dash = (animated / 100) * circ;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f3e8ff" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke="url(#cg)" strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray 1.2s ease" }}
      />
      <text x="50" y="46" textAnchor="middle" fill="#1a1a2e" fontSize="18" fontWeight="900">{animated}</text>
      <text x="50" y="60" textAnchor="middle" fill="#9ca3af" fontSize="9" fontWeight="700">/ 100</text>
    </svg>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 400);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 900, color }}>{score}점</span>
      </div>
      <div style={{ height: 8, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: G, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function V2Result() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const r = sessionStorage.getItem("v2_result");
    if (!r) { router.replace("/main-v2/analysis"); return; }
    setResult(JSON.parse(r));
  }, []);

  const handleShare = () => {
    if (!result) return;
    const url = window.location.origin + "/main-v2";
    const text = `${result.profile?.name}님의 ${result.category} 분석 결과 🔮\n총운: ${result.scores?.total}점\n\n📱 나도 무료로 확인하기!\n${url}`;
    if (navigator.share) {
      navigator.share({ title: "점운 운세 결과", text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => alert("✅ 링크가 복사되었습니다!")).catch(() => alert(text));
    }
  };

  if (!result) return null;

  const { scores, analysis, luckyColor, luckyNumber, luckyDirection, category, profile } = result;
  const scoreItems = [
    { label: "💰 재물운", key: "wealth", color: "#f59e0b" },
    { label: "💕 연애운", key: "love", color: "#ec4899" },
    { label: "💪 건강운", key: "health", color: "#10b981" },
    { label: "🎯 성공운", key: "success", color: "#8b5cf6" },
  ];

  const analysisFull = analysis || "";
  const analysisPreview = analysisFull.slice(0, 120);
  const hasMore = analysisFull.length > 120;

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>🐱</span>
          <span style={{ fontWeight: 900, fontSize: 15, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운 v2</span>
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleShare} style={{ padding: "6px 14px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📱 공유</button>
          <button onClick={() => router.push("/main-v2/history")} style={{ padding: "6px 14px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📂 보관함</button>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* 총운 카드 */}
        <div style={{ background: G, borderRadius: 24, padding: "32px 24px", textAlign: "center", marginBottom: 20, color: "white", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ fontSize: 36, marginBottom: 8 }}>{category.split(" ")[0]}</div>
          <h1 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 20px", opacity: 0.9 }}>{profile?.name}님의 {category.replace(/\S+\s/, "")}</h1>
          <ScoreCircle score={scores?.total ?? 0} size={130} />
          <p style={{ fontSize: 13, opacity: 0.8, margin: "12px 0 0", fontWeight: 600 }}>총운 점수</p>
        </div>

        {/* 운세 점수 바 */}
        <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", marginBottom: 16, border: "1.5px solid rgba(236,72,153,0.12)", boxShadow: "0 4px 20px rgba(139,92,246,0.06)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, color: "#1a1a2e", margin: "0 0 20px" }}>📊 분야별 운세 점수</h2>
          {scoreItems.map(item => (
            <ScoreBar key={item.key} label={item.label} score={scores?.[item.key] ?? 0} color={item.color} />
          ))}
        </div>

        {/* 럭키 정보 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { label: "행운 색", value: luckyColor, icon: "🎨" },
            { label: "행운 숫자", value: luckyNumber, icon: "🔢" },
            { label: "행운 방향", value: luckyDirection, icon: "🧭" },
          ].map(item => (
            <div key={item.label} style={{ background: "white", borderRadius: 16, padding: "16px 12px", textAlign: "center", border: "1.5px solid rgba(236,72,153,0.12)" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1a1a2e" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* 분석 텍스트 카드 */}
        <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", marginBottom: 16, border: "1.5px solid rgba(236,72,153,0.12)", boxShadow: "0 4px 20px rgba(139,92,246,0.06)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 900, color: "#1a1a2e", margin: "0 0 14px" }}>🔮 {category} 상세 분석</h2>

          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {showFull ? analysisFull : analysisPreview}
            {hasMore && !showFull && "..."}
          </p>

          {hasMore && !showFull && (
            <div style={{ position: "relative", marginTop: -40 }}>
              <div style={{ height: 60, background: "linear-gradient(transparent, white)", pointerEvents: "none" }} />
              <button
                onClick={() => setShowFull(true)}
                style={{ width: "100%", padding: "12px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: "pointer" }}
              >
                전체 분석 보기 ↓
              </button>
            </div>
          )}
        </div>

        {/* 유료 CTA */}
        <div style={{ background: G, borderRadius: 20, padding: "24px 20px", marginBottom: 16, color: "white", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💎</div>
          <h3 style={{ fontSize: 17, fontWeight: 900, margin: "0 0 8px" }}>더 자세한 분석이 필요하신가요?</h3>
          <p style={{ fontSize: 13, opacity: 0.85, margin: "0 0 20px", lineHeight: 1.6 }}>
            포인트 충전으로 AI 심층 분석, 전월 운세,<br />
            궁합 분석, PDF 저장까지 이용하세요
          </p>
          <button
            onClick={() => router.push("/main-v2/payment")}
            style={{ padding: "14px 36px", background: "white", color: "#8b5cf6", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
          >
            💎 포인트 충전하기
          </button>
          <p style={{ fontSize: 12, opacity: 0.7, margin: "10px 0 0" }}>990원부터 시작</p>
        </div>

        {/* 다시 분석 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button
            onClick={() => router.push("/main-v2/analysis")}
            style={{ padding: "14px 0", background: "white", color: "#ec4899", border: "1.5px solid #ec4899", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer" }}
          >
            🔄 다시 분석
          </button>
          <button
            onClick={() => router.push("/main-v2")}
            style={{ padding: "14px 0", background: "white", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            🏠 홈으로
          </button>
        </div>
      </div>
    </main>
  );
}
