"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const ALL_SCORE_CATS = [
  { key: "🌟 오늘의 운세", scoreKey: "total",  color: "#f59e0b", icon: "🌟" },
  { key: "💰 재물운",      scoreKey: "wealth", color: "#f59e0b", icon: "💰" },
  { key: "💕 연애운",      scoreKey: "love",   color: "#ec4899", icon: "💕" },
  { key: "💪 건강운",      scoreKey: "health", color: "#10b981", icon: "💪" },
  { key: "🎯 성공운",      scoreKey: "success",color: "#8b5cf6", icon: "🎯" },
  { key: "✨ 총운",        scoreKey: "total",  color: "#6366f1", icon: "✨" },
];

const FREE_CAT = "🌟 오늘의 운세";
const SELECT_CATS = ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT);

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

function saveToHistory(r: any, isPaid: boolean, analyses: Record<string, string>) {
  if (!r?.histId || !isPaid) return;
  try {
    const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
    const idx = hist.findIndex((h: any) => h.id === r.histId);
    const entry = {
      id: r.histId,
      date: r.savedAt ?? new Date().toISOString(),
      name: r.profile?.name ?? "",
      category: r.category ?? "🌟 오늘의 운세",
      scores: r.scores ?? {},
      analysis: r.analysis ?? "",
      isPaid,
      allAnalyses: isPaid ? analyses : undefined,
    };
    if (idx >= 0) hist[idx] = entry;
    else hist.unshift(entry);
    localStorage.setItem("v2_history", JSON.stringify(hist.slice(0, 50)));
  } catch {}
}

export default function V2Result() {
  const router = useRouter();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [result, setResult] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [allAnalyses, setAllAnalyses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(SELECT_CATS.map(c => c.key));
  const [paidCats, setPaidCats] = useState<string[]>([]);
  const [selPlan, setSelPlan] = useState("taste");
  const [payBusy, setPayBusy] = useState(false);

  const INLINE_PLANS = [
    { id: "taste",   icon: "🦢", name: "학 코스",    badge: null,      desc: "₩990",   price: 990,  priceStr: "₩990",   per: "1회",   features: ["AI 심층 분석"] },
    { id: "basic",   icon: "🐯", name: "호랑이 코스", badge: null,      desc: "₩2,970", price: 2970, priceStr: "₩2,970", per: "3회",   features: ["AI 심층 분석", "재물운+성공운 상세"] },
    { id: "popular", icon: "🦚", name: "봉황 코스",   badge: "🔥 인기", desc: "₩4,950", price: 4950, priceStr: "₩4,950", per: "5회",   features: ["AI 심층 분석", "연애운+건강운 상세", "월별+오늘 운세 포함"] },
    { id: "vip",     icon: "🐲", name: "용 코스",     badge: "👑 최고", desc: "₩9,990", price: 9990, priceStr: "₩9,990", per: "무제한", features: ["AI 심층 분석", "전 분야 사주 분석 + 사업운+총운", "월별+오늘 운세", "결혼운+궁합 분석 포함"] },
  ];

  const INLINE_SELECT_CATS = [
    { key: "💰 재물운", icon: "💰", color: "#f59e0b" },
    { key: "💕 연애운", icon: "💕", color: "#ec4899" },
    { key: "💪 건강운", icon: "💪", color: "#10b981" },
    { key: "🎯 성공운", icon: "🎯", color: "#8b5cf6" },
    { key: "✨ 총운",   icon: "✨", color: "#6366f1" },
  ];

  useEffect(() => {
    const raw = sessionStorage.getItem("v2_result");
    if (!raw) { router.replace("/main-v2/analysis"); return; }
    const r = JSON.parse(raw);
    if (!r.histId) {
      r.histId = Date.now();
      r.savedAt = new Date().toISOString();
      sessionStorage.setItem("v2_result", JSON.stringify(r));
    }
    setResult(r);
    const isPaid = sessionStorage.getItem("v2_paid") === "1";
    setPaid(isPaid);
    const analyses = isPaid ? (r.allAnalyses ?? {}) : {};
    setAllAnalyses(analyses);
    if (isPaid) {
      const saved = sessionStorage.getItem("v2_paid_cats");
      setPaidCats(saved ? JSON.parse(saved) : SELECT_CATS.map(c => c.key));
    }
    if (isPaid) saveToHistory(r, isPaid, analyses);
  }, []);

  const goToPay = () => {
    if (selectedCats.length === 0) return;
    sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
    setShowSelect(false);
    router.push("/main-v2/payment");
  };

  const payInline = async () => {
    if (payBusy) return;
    setPayBusy(true);
    try {
      const profile = result?.profile;
      if (profile) {
        const category = result?.category ?? "✨ 총운";
        const res = await fetch("/api/v2/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            birth: `${profile.birthYear}-${profile.birthMonth}-${profile.birthDay}`,
            birthHour: profile.birthHour,
            gender: profile.gender,
            relationship: profile.relationship,
            category,
            planType: "paid",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const newResult = { ...data, category, profile };
          sessionStorage.setItem("v2_result", JSON.stringify(newResult));
        }
      }
      sessionStorage.setItem("v2_paid", "1");
      sessionStorage.setItem("v2_plan", selPlan);
      sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
      await new Promise(r => setTimeout(r, 1200));
      window.location.reload();
    } catch {
      setPayBusy(false);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const saveImage = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const elements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (elements.length === 0) { alert("저장할 내용이 없습니다."); return; }
      const canvases: HTMLCanvasElement[] = [];
      for (const el of elements) {
        const prevOv = el.style.overflow;
        const prevMH = el.style.maxHeight;
        el.style.overflow = "visible";
        el.style.maxHeight = "none";
        const c = await html2canvas(el, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          logging: false,
          height: el.scrollHeight,
          windowWidth: 480,
          windowHeight: el.scrollHeight,
        });
        el.style.overflow = prevOv;
        el.style.maxHeight = prevMH;
        canvases.push(c);
      }
      const totalH = canvases.reduce((s, c) => s + c.height, 0) + (canvases.length - 1) * 16;
      const merged = document.createElement("canvas");
      merged.width = canvases[0].width;
      merged.height = totalH;
      const ctx = merged.getContext("2d")!;
      ctx.fillStyle = "#fdf2f8";
      ctx.fillRect(0, 0, merged.width, merged.height);
      let y = 0;
      for (let i = 0; i < canvases.length; i++) {
        ctx.drawImage(canvases[i], 0, y);
        y += canvases[i].height + 16;
      }
      const link = document.createElement("a");
      link.download = `점운_${result?.profile?.name ?? "운세"}_${new Date().toLocaleDateString("ko")}.png`;
      link.href = merged.toDataURL("image/png");
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const share = () => {
    if (!result) return;
    const url = window.location.origin + "/main-v2";
    const text = `${result.profile?.name}님의 운세 분석 🔮\n총운 ${result.scores?.total}점\n\n📱 나도 무료로!\n${url}`;
    if (navigator.share) navigator.share({ title: "점운 운세 결과", text, url }).catch(() => {});
    else navigator.clipboard.writeText(text).then(() => alert("✅ 링크 복사됨!"));
  };

  if (!result) return null;

  const { scores, luckyColor, luckyNumber, luckyDirection, profile } = result;
  const freeAnalysis: string = result.analysis ?? "";

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
        </button>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={share} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
            📱 공유
          </button>
          {paid && (
            <button onClick={saveImage} disabled={saving} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "⏳..." : "🖼️ 저장"}
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* ── 점수 요약 카드 ── */}
        <div
          ref={el => { cardRefs.current[0] = el; }}
          style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12 }}
        >
          <div style={{ background: G, padding: "24px 20px", color: "white", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
            <p style={{ fontSize: 15, fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.3px" }}>🐱 점운 · AI 사주 분석</p>
            <div style={{ fontSize: 28, marginBottom: 4 }}>🔮</div>
            <h1 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px", opacity: 0.9 }}>{profile?.name}님의 운세 분석</h1>
            <ScoreCircle score={scores?.total ?? 0} size={130} />
            <p style={{ fontSize: 12, opacity: 0.75, margin: "8px 0 0", fontWeight: 600 }}>총운 점수</p>
          </div>
          {/* 럭키 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 18px 18px" }}>
            {[{ label: "행운 색", value: luckyColor, icon: "🎨" }, { label: "행운 숫자", value: luckyNumber, icon: "🔢" }, { label: "행운 방향", value: luckyDirection, icon: "🧭" }].map(item => (
              <div key={item.label} style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 오늘의 운세 무료 카드 ── */}
        <div
          ref={el => { cardRefs.current[1] = el; }}
          style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(34,197,94,0.25)", marginBottom: 12 }}
        >
          <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(236,72,153,0.07)" }}>
            <span style={{ fontSize: 22 }}>🌟</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>오늘의 운세</span>
            <span style={{ fontSize: 10, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>FREE</span>
          </div>
          <div style={{ padding: "14px 18px 20px" }}>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {freeAnalysis}
            </p>
          </div>
        </div>

        {/* ── 유료: 선택한 운세만 표시 ── */}
        {paid && Object.keys(allAnalyses).length > 0 && (
          ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key)).map((c, i) => (
            <div
              key={c.key}
              ref={el => { cardRefs.current[2 + i] = el; }}
              style={{ background: "white", borderRadius: 24, border: `1.5px solid ${c.color}44`, marginBottom: 12 }}
            >
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(236,72,153,0.07)" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{c.key.replace(/\S+\s/, "")}</span>
                <span style={{ fontSize: 10, background: G, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>💎 심층</span>
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {allAnalyses[c.key] ?? ""}
                </p>
              </div>
            </div>
          ))
        )}

        {/* ── 미결제: 2열 그리드 카드 ── */}
        {!paid && (() => {
          const gridItems = [
            { key: FREE_CAT, icon: "🌟", label: "오늘의 운세", desc: "오늘 하루 기운", scoreKey: "total", isFree: true },
            { key: "💰 재물운", icon: "💰", label: "재물운", desc: "돈·투자·자산", scoreKey: "wealth", isFree: false },
            { key: "💕 연애운", icon: "💕", label: "연애운", desc: "사랑·인연·궁합", scoreKey: "love", isFree: false },
            { key: "🎯 성공운", icon: "🎯", label: "성공운", desc: "커리어·꿈·성취", scoreKey: "success", isFree: false },
            { key: "💪 건강운", icon: "💪", label: "건강운", desc: "몸·마음·활력", scoreKey: "health", isFree: false },
            { key: "✨ 총운",   icon: "✨", label: "총운",   desc: "올해 전체 운세", scoreKey: "total", isFree: false },
          ];
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {gridItems.map(c => (
                <div key={c.key} style={{ background: "white", borderRadius: 20, border: c.isFree ? "2px solid rgba(34,197,94,0.4)" : "1.5px solid #e5e7eb", overflow: "hidden", position: "relative", opacity: 1 }}>
                  <div style={{ padding: "14px 12px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>{c.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 3 }}>{c.label}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 8 }}>{c.desc}</div>
                    {c.isFree
                      ? <span style={{ fontSize: 9, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 20, fontWeight: 800 }}>FREE</span>
                      : <span style={{ fontSize: 9, background: "#fff0f0", color: "#e11d48", padding: "2px 8px", borderRadius: 20, fontWeight: 800 }}>₩990</span>
                    }
                  </div>
                  {!c.isFree && (
                    <div style={{ position: "absolute", top: 8, right: 8 }}>
                      <span style={{ fontSize: 14 }}>🔒</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── 미결제: 인라인 결제 UI (payment 페이지 전체 내용) ── */}
        {!paid && (
          <>
            {/* 배너 */}
            <div style={{ background: G, borderRadius: 20, padding: "22px 18px", textAlign: "center", marginBottom: 20, color: "white" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔓</div>
              <h1 style={{ fontSize: 17, fontWeight: 900, margin: "0 0 6px" }}>【전체 AI 심층 분석】</h1>
              <p style={{ fontSize: 12, opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
                운세를 완전히 해석해드립니다<br />
                ₩990부터 시작 · 이미지 저장&보관함 포함
              </p>
            </div>

            {/* 운세 선택 섹션 */}
            <div style={{ background: "white", borderRadius: 20, padding: "20px 16px", marginBottom: 18, border: "1.5px solid rgba(236,72,153,0.12)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>어떤 운세를 확인할까요?</h2>
              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "0 0 16px" }}>
                {selectedCats.length > 0
                  ? <><span style={{ color: "#ec4899", fontWeight: 800 }}>{selectedCats.length}개</span> 선택 · <span style={{ color: "#8b5cf6", fontWeight: 800 }}>₩{(selectedCats.length * 990).toLocaleString()}</span></>
                  : "운세를 선택하세요"}
              </p>

              {/* 전체 선택 */}
              <button
                onClick={() => setSelectedCats(selectedCats.length === INLINE_SELECT_CATS.length ? [] : INLINE_SELECT_CATS.map(c => c.key))}
                style={{ width: "100%", padding: "10px 16px", marginBottom: 12, background: selectedCats.length === INLINE_SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selectedCats.length === INLINE_SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 14, fontWeight: 800, fontSize: 13, color: selectedCats.length === INLINE_SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <span>✨ 전체 선택</span>
                <span style={{ fontSize: 16 }}>{selectedCats.length === INLINE_SELECT_CATS.length ? "☑️" : "⬜"}</span>
              </button>

              {/* 개별 운세 카드 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {INLINE_SELECT_CATS.map(c => {
                  const on = selectedCats.includes(c.key);
                  return (
                    <button key={c.key}
                      onClick={() => setSelectedCats(on ? selectedCats.filter(k => k !== c.key) : [...selectedCats, c.key])}
                      style={{ padding: "14px 16px", border: `1.5px solid ${on ? c.color : "#e5e7eb"}`, borderRadius: 16, background: on ? `${c.color}10` : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{c.icon}</span>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: on ? c.color : "#374151" }}>{c.key.replace(/\S+\s/, "")}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>약 3,500자 심층 분석</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 18 }}>{on ? "✅" : "⬜"}</span>
                    </button>
                  );
                })}
              </div>

              {/* 운세 선택 결제 버튼 */}
              <button
                onClick={() => {
                  if (selectedCats.length === 0 || payBusy) return;
                  payInline();
                }}
                disabled={selectedCats.length === 0 || payBusy}
                style={{ width: "100%", padding: "16px 0", background: selectedCats.length > 0 && !payBusy ? G : "#e5e7eb", color: selectedCats.length > 0 && !payBusy ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: selectedCats.length > 0 && !payBusy ? "pointer" : "not-allowed", boxShadow: selectedCats.length > 0 && !payBusy ? "0 6px 20px rgba(236,72,153,0.35)" : "none" }}
              >
                {payBusy ? "⏳ 결제 처리 중..." : selectedCats.length > 0 ? `💎 ${selectedCats.length}개 운세 보기 · ₩${(selectedCats.length * 990).toLocaleString()}` : "운세를 선택하세요"}
              </button>
            </div>

            {/* 코스 목록 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {INLINE_PLANS.map(p => (
                <div key={p.id} onClick={() => setSelPlan(p.id)}
                  style={{ background: "white", borderRadius: 20, padding: "16px 14px", border: selPlan === p.id ? "2px solid #ec4899" : "1.5px solid rgba(236,72,153,0.12)", cursor: "pointer", position: "relative", boxShadow: selPlan === p.id ? "0 6px 24px rgba(236,72,153,0.14)" : "0 2px 8px rgba(139,92,246,0.05)", transition: "all 0.15s" }}>

                  {p.badge && (
                    <div style={{ position: "absolute", top: -9, right: 14, background: G, color: "white", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 20 }}>{p.badge}</div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: selPlan === p.id ? "6px solid #ec4899" : "2px solid #d1d5db", flexShrink: 0, transition: "all 0.15s" }} />
                      <span style={{ fontSize: 24 }}>{p.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: selPlan === p.id ? "#ec4899" : "#1a1a2e" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{p.desc}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 17, fontWeight: 900, color: selPlan === p.id ? "#ec4899" : "#1a1a2e" }}>{p.priceStr}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{p.per}</div>
                    </div>
                  </div>

                  {selPlan === p.id && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
                      {p.features.map(f => (
                        <span key={f} style={{ fontSize: 10, color: "#8b5cf6", background: "#ede9fe", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>✓ {f}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 결제 버튼 영역 */}
            {(() => {
              const plan = INLINE_PLANS.find(p => p.id === selPlan)!;
              return (
                <div style={{ background: "white", borderRadius: 20, padding: "16px 14px", border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{plan.icon} {plan.name}</span>
                    <span style={{ fontSize: 17, fontWeight: 900, color: "#ec4899" }}>{plan.priceStr}</span>
                  </div>

                  <button onClick={payInline} disabled={payBusy}
                    style={{ width: "100%", padding: "15px 0", background: payBusy ? "#e5e7eb" : G, color: payBusy ? "#9ca3af" : "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: payBusy ? "not-allowed" : "pointer", boxShadow: payBusy ? "none" : "0 6px 20px rgba(236,72,153,0.3)", transition: "all 0.2s" }}>
                    {payBusy ? "⏳ 결제 처리 중..." : `💳 ${plan.priceStr} 결제하기`}
                  </button>
                </div>
              );
            })()}

            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>🔒</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>토스페이먼츠로 안전하게 결제</span>
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "#d1d5db", margin: "0 0 14px", lineHeight: 1.6 }}>
              결제 즉시 전체 분석 해제 · 이미지 저장 가능
            </p>
          </>
        )}

        {/* ── 유료: 이미지 저장 버튼 ── */}
        {paid && (
          <div style={{ marginBottom: 12 }}>
            <button onClick={saveImage} disabled={saving}
              style={{ width: "100%", padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.3)", opacity: saving ? 0.7 : 1 }}>
              {saving ? "⏳ 저장 중..." : "🖼️ 이미지 저장"}
            </button>
          </div>
        )}

        {/* ── 공유 버튼 ── */}
        <div style={{ marginBottom: 10 }}>
          <button onClick={share}
            style={{ width: "100%", padding: "13px 0", background: "white", color: "#ec4899", border: "1.5px solid rgba(236,72,153,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.1)" }}>
            📤 공유하기
          </button>
        </div>

        {/* ── 하단 버튼 ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button
            onClick={() => {
              if (!paid) { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }
              else { sessionStorage.removeItem("v2_paid"); sessionStorage.removeItem("v2_paid_cats"); router.push("/main-v2/analysis"); }
            }}
            style={{ padding: "12px 0", background: paid ? "white" : BG, color: paid ? "#8b5cf6" : "#ec4899", border: paid ? "1.5px solid #8b5cf6" : "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
            {paid ? "🔮 다시 분석" : "💎 ₩990 선택보기"}
          </button>
          <button onClick={() => router.push("/main-v2/history")}
            style={{ padding: "12px 0", background: "white", color: "#8b5cf6", border: "1.5px solid rgba(139,92,246,0.3)", borderRadius: 50, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            📂 보관함
          </button>
        </div>
        <button onClick={() => router.push("/main-v2")}
          style={{ width: "100%", marginTop: 10, padding: "11px 0", background: "transparent", color: "#9ca3af", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
          🏠 홈으로
        </button>
      </div>

      {/* ── 운세 선택 모달 ── */}
      {showSelect && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) setShowSelect(false); }}
        >
          <div style={{ width: "100%", maxWidth: 480, background: "white", borderRadius: "28px 28px 0 0", padding: "28px 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 20px" }} />

            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>어떤 운세를 확인할까요?</h2>
            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "0 0 20px" }}>
              {selectedCats.length > 0
                ? <><span style={{ color: "#ec4899", fontWeight: 800 }}>{selectedCats.length}개</span> 선택 · <span style={{ color: "#8b5cf6", fontWeight: 800 }}>₩{(selectedCats.length * 990).toLocaleString()}</span></>
                : "운세를 선택하세요"}
            </p>

            {/* 전체 선택 */}
            <button
              onClick={() => setSelectedCats(selectedCats.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
              style={{ width: "100%", padding: "10px 16px", marginBottom: 12, background: selectedCats.length === SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 14, fontWeight: 800, fontSize: 13, color: selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span>✨ 전체 선택</span>
              <span style={{ fontSize: 16 }}>{selectedCats.length === SELECT_CATS.length ? "☑️" : "⬜"}</span>
            </button>

            {/* 개별 운세 카드 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
              {SELECT_CATS.map(c => {
                const on = selectedCats.includes(c.key);
                return (
                  <button key={c.key}
                    onClick={() => setSelectedCats(on ? selectedCats.filter(k => k !== c.key) : [...selectedCats, c.key])}
                    style={{ padding: "14px 16px", border: `1.5px solid ${on ? c.color : "#e5e7eb"}`, borderRadius: 16, background: on ? `${c.color}10` : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{c.icon}</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: on ? c.color : "#374151" }}>{c.key.replace(/\S+\s/, "")}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>약 3,500자 심층 분석</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 18 }}>{on ? "✅" : "⬜"}</span>
                  </button>
                );
              })}
            </div>

            {/* 결제 버튼 */}
            <button
              onClick={goToPay}
              disabled={selectedCats.length === 0}
              style={{ width: "100%", padding: "16px 0", background: selectedCats.length > 0 ? G : "#e5e7eb", color: selectedCats.length > 0 ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: selectedCats.length > 0 ? "pointer" : "not-allowed", boxShadow: selectedCats.length > 0 ? "0 6px 20px rgba(236,72,153,0.35)" : "none" }}
            >
              {selectedCats.length > 0
                ? `💎 ${selectedCats.length}개 운세 보기 · ₩${(selectedCats.length * 990).toLocaleString()}`
                : "운세를 선택하세요"}
            </button>
            <button onClick={() => setShowSelect(false)}
              style={{ width: "100%", marginTop: 10, padding: "12px 0", background: "transparent", color: "#9ca3af", border: "none", fontSize: 13, cursor: "pointer" }}>
              취소
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
