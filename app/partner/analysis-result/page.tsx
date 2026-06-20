"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

const G_PREMIUM = "linear-gradient(135deg, #c026d3, #9333ea)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

function ScoreCircle({ score, size = 130 }: { score: number; size?: number }) {
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
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray 1.2s ease" }} />
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{animated}</text>
      <text x="50" y="60" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="700">/ 100</text>
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
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{score}점</span>
      </div>
      <div style={{ height: 7, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

// 패키지마다 실제로 만들어지는 항목이 다름(/api/analyze의 PACKAGE_FIELDS와 동일하게 맞춤)
const PACKAGE_CATS: Record<string, { key: string; icon: string; label: string }[]> = {
  "기본 분석": [
    { key: "yearlyLuck", icon: "☀️", label: "올해 운세" },
    { key: "monthlyLuck", icon: "🌙", label: "월별 운세" },
  ],
  "베이직": [
    { key: "yearlyLuck", icon: "☀️", label: "올해 운세" },
    { key: "monthlyLuck", icon: "🌙", label: "월별 운세" },
    { key: "wealthLuck", icon: "💰", label: "재물운" },
    { key: "loveLuck", icon: "💕", label: "연애운" },
  ],
  "프리미엄": [
    { key: "yearlyLuck", icon: "☀️", label: "올해 운세" },
    { key: "monthlyLuck", icon: "🌙", label: "월별 운세" },
    { key: "wealthLuck", icon: "💰", label: "재물운" },
    { key: "loveLuck", icon: "💕", label: "연애운" },
    { key: "healthLuck", icon: "🌿", label: "건강운" },
  ],
  "VIP 커플팩": [
    { key: "yearlyLuck", icon: "☀️", label: "올해 운세" },
    { key: "monthlyLuck", icon: "🌙", label: "월별 운세" },
    { key: "name", icon: "📝", label: "이름분석" },
    { key: "wealthLuck", icon: "💰", label: "재물운" },
    { key: "loveLuck", icon: "💕", label: "연애운" },
    { key: "healthLuck", icon: "🌿", label: "건강운" },
    { key: "couple", icon: "💍", label: "궁합분석" },
    { key: "fullAnalysis", icon: "✨", label: "전체 사주분석" },
  ],
};

export default function PartnerAnalysisResult() {
  const router = useRouter();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [packageType, setPackageType] = useState("");
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const result = sessionStorage.getItem("analysisResult");
    const name = sessionStorage.getItem("analysisName");
    const pkg = sessionStorage.getItem("selectedPackage");

    if (!result) {
      router.push("/partner/create-analysis");
      return;
    }

    setAnalysisResults(JSON.parse(result));
    setCustomerName(name || "고객");
    setPackageType(pkg || "기본 분석");
    // 결과지에 점운 대신 표시할 파트너 상호명
    setBusinessName(localStorage.getItem("partnerBusinessName") || "");
  }, [router]);

  const handleSaveImage = async () => {
    if (!analysisResults) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const elements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (elements.length === 0) return;
      const canvases: HTMLCanvasElement[] = [];
      for (const el of elements) {
        canvases.push(await html2canvas(el, { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" }));
      }
      const totalHeight = canvases.reduce((sum, c) => sum + c.height, 0);
      const width = Math.max(...canvases.map(c => c.width));
      const merged = document.createElement("canvas");
      merged.width = width;
      merged.height = totalHeight;
      const ctx = merged.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, totalHeight);
      let y = 0;
      for (const c of canvases) {
        ctx.drawImage(c, 0, y);
        y += c.height;
      }
      const link = document.createElement("a");
      link.download = `사주_${customerName}_${packageType}.png`;
      link.href = merged.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("이미지 생성 오류:", error);
      alert("이미지 생성 중 오류가 발생했습니다");
    } finally {
      setSaving(false);
    }
  };

  if (!analysisResults) return null;

  const { scores, luckyColor, luckyNumber, luckyDirection } = analysisResults;
  const cats = (PACKAGE_CATS[packageType] ?? PACKAGE_CATS["기본 분석"]).filter(c => analysisResults[c.key]);

  return (
    <>
      <Head><title>분석 결과 - {businessName || "점운"}</title></Head>
      <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
          <button onClick={() => router.push("/partner/create-analysis")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 18 }}>←</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#9333ea" }}>🔮 {businessName || "점운"}</span>
          </button>
          <button onClick={handleSaveImage} disabled={saving} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "⏳..." : "🖼️ 이미지 저장"}
          </button>
        </header>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>
          {/* 점수 요약 카드 */}
          <div ref={el => { cardRefs.current[0] = el; }} style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
            <div style={{ background: "#eab308", color: "#3a2a00", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
              <p style={{ fontSize: 15, fontWeight: 900, margin: 0, padding: "10px 20px 0", letterSpacing: "-0.3px" }}>🔮 {businessName || "점운"} · AI 사주 분석</p>
              <div style={{ padding: "14px 20px 24px" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>🔮</div>
                <h1 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px", opacity: 0.9 }}>{customerName}님의 운세 분석</h1>
                <ScoreCircle score={scores?.total ?? 0} size={130} />
                <p style={{ fontSize: 12, opacity: 0.75, margin: "8px 0 0", fontWeight: 600 }}>총운 점수</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 18px 12px" }}>
              {[{ label: "행운 색", value: luckyColor, icon: "🎨" }, { label: "행운 숫자", value: luckyNumber, icon: "🔢" }, { label: "행운 방향", value: luckyDirection, icon: "🧭" }].map(item => (
                <div key={item.label} style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "4px 18px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>📊 분야별 운세 점수</div>
              {[
                { label: "🌟 오늘의 운세", key: "total", color: "#f59e0b" },
                { label: "💰 재물운", key: "wealth", color: "#f59e0b" },
                { label: "💕 연애운", key: "love", color: "#ec4899" },
                { label: "💪 건강운", key: "health", color: "#10b981" },
                { label: "🎯 성공운", key: "success", color: "#8b5cf6" },
              ].map(b => (
                <ScoreBar key={b.label} label={b.label} score={scores?.[b.key] ?? 0} color={b.color} />
              ))}
            </div>
          </div>

          {/* 패키지별 운세 카드 */}
          {cats.map((c, i) => (
            <div key={c.key} ref={el => { cardRefs.current[1 + i] = el; }}
              style={{ background: "#fdf6e3", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(217,180,80,0.18)", background: "linear-gradient(90deg, rgba(217,180,80,0.10), transparent)" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{c.label}</span>
                <span style={{ fontSize: 10, background: G_PREMIUM, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>📦 패키지</span>
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                  {analysisResults[c.key]}
                </p>
              </div>
            </div>
          ))}

          <button onClick={() => router.push("/partner/create-analysis")} style={{ width: "100%", padding: "13px 0", background: "white", color: "#9333ea", border: "1.5px solid rgba(147,51,234,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(147,51,234,0.1)" }}>
            🔄 새로 분석
          </button>
        </div>
      </main>
    </>
  );
}
