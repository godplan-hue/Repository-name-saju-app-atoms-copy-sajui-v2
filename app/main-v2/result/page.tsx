"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const G_PREMIUM = "linear-gradient(135deg, #6d28d9, #4c1d95)";
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

type PkgCat = { apiKey: string; icon: string; label: string; color: string };
const PKG_CAT_MAP: Record<string, PkgCat[]> = {
  "기본 분석": [
    { apiKey: "☀️ 올해 운세", icon: "☀️", label: "올해 운세", color: "#f59e0b" },
    { apiKey: "📅 월별운세",  icon: "🌙", label: "월별 운세", color: "#0ea5e9" },
  ],
  "베이직": [
    { apiKey: "☀️ 올해 운세", icon: "☀️", label: "올해 운세", color: "#f59e0b" },
    { apiKey: "📅 월별운세",  icon: "🌙", label: "월별 운세", color: "#0ea5e9" },
    { apiKey: "💰 재물운",    icon: "💎", label: "재물운",    color: "#f59e0b" },
    { apiKey: "💕 연애운",    icon: "💕", label: "연애운",    color: "#ec4899" },
  ],
  "프리미엄": [
    { apiKey: "☀️ 올해 운세", icon: "☀️", label: "올해 운세", color: "#f59e0b" },
    { apiKey: "📅 월별운세",  icon: "🌙", label: "월별 운세", color: "#0ea5e9" },
    { apiKey: "💰 재물운",    icon: "💎", label: "재물운",    color: "#f59e0b" },
    { apiKey: "💕 연애운",    icon: "💕", label: "연애운",    color: "#ec4899" },
    { apiKey: "💪 건강운",    icon: "🌿", label: "건강운",    color: "#10b981" },
  ],
  "VIP 커플팩": [
    { apiKey: "☀️ 올해 운세",   icon: "☀️", label: "올해 운세",    color: "#f59e0b" },
    { apiKey: "📅 월별운세",    icon: "🌙", label: "월별 운세",    color: "#0ea5e9" },
    { apiKey: "💰 재물운",      icon: "💎", label: "재물운",       color: "#f59e0b" },
    { apiKey: "💕 연애운",      icon: "💕", label: "연애운",       color: "#ec4899" },
    { apiKey: "💪 건강운",      icon: "🌿", label: "건강운",       color: "#10b981" },
    { apiKey: "📝 이름분석",     icon: "📝", label: "이름분석",     color: "#6366f1" },
    { apiKey: "💼 전체 사주분석", icon: "✨", label: "전체 사주분석", color: "#8b5cf6" },
    { apiKey: "💍 결혼·궁합운", icon: "👫", label: "궁합분석",     color: "#f43f5e" },
  ],
};

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

function saveToHistory(r: any, isPaid: boolean, analyses: Record<string, string>, paidCats: string[], planType: string) {
  if (!r?.histId || !isPaid) return;
  try {
    const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
    const date = r.savedAt ?? new Date().toISOString();
    const cats = paidCats.length > 0 ? paidCats : Object.keys(analyses);
    cats.forEach((cat, i) => {
      const id = r.histId + i;
      const entry = {
        id,
        date,
        name: r.profile?.name ?? "",
        category: cat,
        scores: r.scores ?? {},
        analysis: analyses[cat] ?? "",
        isPaid: true,
        planType,
      };
      const idx = hist.findIndex((h: any) => h.id === id);
      if (idx >= 0) hist[idx] = entry;
      else hist.unshift(entry);
    });
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
  const [selPlan, setSelPlan] = useState("vip");
  const [payBusy, setPayBusy] = useState(false);
  const [planType, setPlanType] = useState("");
  const [tier, setTier] = useState<"free" | "select" | "package">("free");
  const [pkgName, setPkgName] = useState("");

  const INLINE_PLANS = [
    { id: "vip", icon: "🐲", name: "용 코스", badge: "👑 최고", desc: "₩9,990", price: 9990, priceStr: "₩9,990", per: "무제한", features: ["AI 심층 분석", "전 분야 사주 분석 + 사업운+총운", "월별+오늘 운세", "결혼운+궁합 분석 포함"] },
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

    const price = sessionStorage.getItem("price") ?? "";
    const PKG_PRICES_SET = ["9900", "19900", "24900", "29900"];
    const isPackage = PKG_PRICES_SET.includes(price);
    const isSelect = price === "990";
    const v2Paid = sessionStorage.getItem("v2_paid") === "1";
    const isPaid = isPackage || isSelect || v2Paid;
    const rawPlan = sessionStorage.getItem("v2_plan") ?? "";
    const plan = isPackage ? "package" : isSelect ? "select" : (v2Paid ? rawPlan : "");
    const detectedTier: "free" | "select" | "package" = isPackage ? "package" : isSelect ? "select" : "free";

    setTier(detectedTier);
    if (isPackage) setPkgName(sessionStorage.getItem("selectedPackage") ?? "");
    setPaid(isPaid);
    setPlanType(plan);
    const analyses = isPaid ? (r.allAnalyses ?? {}) : {};
    setAllAnalyses(analyses);
    const cats = (() => {
      if (!isPaid) return [];
      if (isPackage) {
        const pkg = sessionStorage.getItem("selectedPackage") ?? "";
        return (PKG_CAT_MAP[pkg] ?? PKG_CAT_MAP["기본 분석"]).map(c => c.apiKey);
      }
      const saved = sessionStorage.getItem("v2_paid_cats");
      return saved ? JSON.parse(saved) : SELECT_CATS.map(c => c.key);
    })();
    if (isPaid) setPaidCats(cats);
    if (isPaid && Object.keys(analyses).length > 0) {
      if (isPackage) {
        const pkg = sessionStorage.getItem("selectedPackage") ?? "";
        const pkgCats = PKG_CAT_MAP[pkg] ?? PKG_CAT_MAP["기본 분석"];
        const labelAnalyses: Record<string, string> = {};
        pkgCats.forEach(c => { labelAnalyses[`${c.icon} ${c.label}`] = analyses[c.apiKey] ?? ""; });
        saveToHistory(r, isPaid, labelAnalyses, pkgCats.map(c => `${c.icon} ${c.label}`), plan);
      } else {
        saveToHistory(r, isPaid, analyses, cats, plan);
      }
    }
  }, []);

  const goToPay = () => {
    if (selectedCats.length === 0) return;
    sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
    sessionStorage.setItem("v2_plan", "select");
    setShowSelect(false);
    router.push("/main-v2/payment");
  };

  const payInline = async () => {
    if (payBusy) return;
    setPayBusy(true);
    try {
      const profile = result?.profile;
      if (profile) {
        const category = selectedCats.length > 0 ? selectedCats[0] : "💰 재물운";
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
          const histId = result?.histId ?? Date.now();
          const savedAt = result?.savedAt ?? new Date().toISOString();
          const newResult = { ...data, category, profile, histId, savedAt };
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
        // 글자 수가 길어진 카드일수록 캔버스 최대 크기(보통 약 16,384px 또는
        // 268,435,456 픽셀)를 넘기기 쉬워 scale을 내용 길이에 맞춰 동적으로 낮춤
        const estScale = el.scrollHeight > 6000 ? 1 : el.scrollHeight > 3000 ? 1.5 : 2;
        const c = await html2canvas(el, {
          backgroundColor: "#ffffff",
          scale: estScale,
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
      const MAX_CANVAS_HEIGHT = 14000; // 브라우저 캔버스 한계보다 여유 있게 안전선을 둠
      const totalH = canvases.reduce((s, c) => s + c.height, 0) + (canvases.length - 1) * 16;

      const downloadCanvas = (canvas: HTMLCanvasElement, idx: number, total: number, label?: string) => {
        const link = document.createElement("a");
        const suffix = label ? `_${label}` : (total > 1 ? `_${idx + 1}of${total}` : "");
        link.download = `점운_${result?.profile?.name ?? "운세"}_${new Date().toLocaleDateString("ko")}${suffix}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };

      // 9900원 이상 패키지(카테고리 여러 개)는 합쳐서 하나의 거대한 캔버스를 만들지 않고,
      // 카테고리별로 각각 따로 저장 — 캔버스 크기 한계로 인한 저장 실패를 원천적으로 줄임
      if (tier === "package" && canvases.length > 1) {
        const pkgCats = (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["기본 분석"]).filter(c => allAnalyses[c.apiKey]);
        canvases.forEach((c, i) => {
          const label = i === 0 ? "총운요약" : (pkgCats[i - 1]?.label ?? `사주${i}`);
          downloadCanvas(c, i, canvases.length, label);
        });
        return;
      }

      if (totalH <= MAX_CANVAS_HEIGHT) {
        const merged = document.createElement("canvas");
        merged.width = canvases[0].width;
        merged.height = totalH;
        const ctx = merged.getContext("2d")!;
        ctx.fillStyle = tier === "package" ? "#f5f3ff" : "#fdf2f8";
        ctx.fillRect(0, 0, merged.width, merged.height);
        let y = 0;
        for (let i = 0; i < canvases.length; i++) {
          ctx.drawImage(canvases[i], 0, y);
          y += canvases[i].height + 16;
        }
        downloadCanvas(merged, 0, 1);
      } else {
        // 내용이 길어 한 장에 다 못 담으면, 안전한 크기로 나눠서 여러 장으로 저장
        const groups: HTMLCanvasElement[][] = [];
        let cur: HTMLCanvasElement[] = [];
        let curH = 0;
        for (const c of canvases) {
          if (curH + c.height > MAX_CANVAS_HEIGHT && cur.length > 0) {
            groups.push(cur);
            cur = [];
            curH = 0;
          }
          cur.push(c);
          curH += c.height + 16;
        }
        if (cur.length > 0) groups.push(cur);

        groups.forEach((group, gi) => {
          // 첫 장은 이미 브랜드 카드(🐱 점운)가 맨 위에 있으므로, 2번째 장부터는
          // 어느 카테고리든 잘리지 않고 시작하는 것과 별개로 상단에 브랜드 헤더를 직접 그려 넣음
          const needsHeader = gi > 0;
          const headerH = needsHeader ? 80 * window.devicePixelRatio : 0;
          const gH = group.reduce((s, c) => s + c.height, 0) + (group.length - 1) * 16 + headerH;
          const merged = document.createElement("canvas");
          merged.width = group[0].width;
          merged.height = gH;
          const ctx = merged.getContext("2d")!;
          ctx.fillStyle = tier === "package" ? "#f5f3ff" : "#fdf2f8";
          ctx.fillRect(0, 0, merged.width, merged.height);
          let y = 0;
          if (needsHeader) {
            const dpr = window.devicePixelRatio;
            ctx.fillStyle = tier === "package" ? "#4c1d95" : "#ec4899";
            ctx.fillRect(0, 0, merged.width, headerH);
            ctx.fillStyle = "#ffffff";
            ctx.font = `900 ${22 * dpr}px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`🐱 점운 · AI 사주 분析 (${gi + 1}/${groups.length})`, merged.width / 2, headerH / 2);
            y = headerH;
          }
          for (const c of group) {
            ctx.drawImage(c, 0, y);
            y += c.height + 16;
          }
          downloadCanvas(merged, gi, groups.length);
        });
      }
    } catch (e) {
      console.error("이미지 저장 실패:", e);
      alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const share = () => {
    if (!result) return;
    const url = window.location.origin + "/main-v2";
    let extra = "";
    if (tier === "package" && result.profile?.birthYear) {
      const ganList = ["갑","을","병","정","무","기","경","신","임","계"];
      const y = Number(result.profile.birthYear);
      const gan = ganList[((y - 4) % 10 + 10) % 10];
      extra = `\n${gan} 천간을 타고난 사주 심층 분析 결과예요 🪬`;
    }
    const text = `${result.profile?.name}님의 운세 분석 🔮\n총운 ${result.scores?.total}점${extra}\n\n📱 나도 무료로!\n${url}`;
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
          {(!paid || planType !== "select") && (
            <button onClick={share} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
              📱 공유
            </button>
          )}
          {paid && planType !== "select" && (
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
          <div style={{ background: tier === "package" ? G_PREMIUM : G, color: "white", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
            <p style={{ fontSize: 15, fontWeight: 900, margin: 0, padding: "10px 20px 0", letterSpacing: "-0.3px" }}>🐱 점운 · AI 사주 분석</p>
            <div style={{ padding: "14px 20px 24px" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🔮</div>
              <h1 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px", opacity: 0.9 }}>{profile?.name}님의 운세 분석</h1>
              <ScoreCircle score={scores?.total ?? 0} size={130} />
              <p style={{ fontSize: 12, opacity: 0.75, margin: "8px 0 0", fontWeight: 600 }}>총운 점수</p>
            </div>
          </div>
          {/* 럭키 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 18px 12px" }}>
            {[{ label: "행운 색", value: luckyColor, icon: "🎨" }, { label: "행운 숫자", value: luckyNumber, icon: "🔢" }, { label: "행운 방향", value: luckyDirection, icon: "🧭" }].map(item => (
              <div key={item.label} style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{item.value}</div>
              </div>
            ))}
          </div>
          {/* 6개 운세 점수 바 */}
          <div style={{ padding: "4px 18px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>📊 분야별 운세 점수</div>
            {[
              { label: "🌟 오늘의 운세", key: "total",   color: "#f59e0b" },
              { label: "💰 재물운",      key: "wealth",  color: "#f59e0b" },
              { label: "💕 연애운",      key: "love",    color: "#ec4899" },
              { label: "💪 건강운",      key: "health",  color: "#10b981" },
              { label: "🎯 성공운",      key: "success", color: "#8b5cf6" },
              { label: "✨ 총운",        key: "total",   color: "#6366f1" },
            ].map(b => (
              <ScoreBar key={b.label} label={b.label} score={scores?.[b.key as keyof typeof scores] ?? 0} color={b.color} />
            ))}
          </div>
        </div>

        {/* ── 무료 전용: 사주팔자 맛보기 (띠+오행만, 천간은 패키지에서만 공개) ── */}
        {tier === "free" && profile?.birthYear && (() => {
          const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
          const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
          const ohEmoji: Record<string,string> = { "목":"🌳","화":"🔥","토":"⛰️","금":"⚪","수":"💧" };
          const y = Number(profile.birthYear);
          const z = zodiacList[((y - 4) % 12 + 12) % 12];
          const oh = ohArr[((y - 4) % 10 + 10) % 10];
          return (
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ background: G, color: "white", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🔮 {profile?.name}님의 사주팔자 맛보기</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "16px 18px" }}>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🐉</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>띠</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{z}띠</div>
                </div>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{ohEmoji[oh]}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>오행</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{oh}({oh === "목" ? "木" : oh === "화" ? "火" : oh === "토" ? "土" : oh === "금" ? "金" : "水"})</div>
                </div>
              </div>
              <div style={{ padding: "0 18px 16px" }}>
                <div style={{ background: "#fdf2f8", borderRadius: 14, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#ec4899", fontWeight: 700 }}>🪬 천간(年柱)까지 보면 성격·재물 흐름이 더 자세히 나와요 — 패키지에서 확인하세요</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── 패키지 전용: 사주팔자 한눈에 보기 + 오늘/내일의 한마디 ── */}
        {tier === "package" && profile?.birthYear && (() => {
          const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
          const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
          const ganList = ["갑","을","병","정","무","기","경","신","임","계"];
          const ohEmoji: Record<string,string> = { "목":"🌳","화":"🔥","토":"⛰️","금":"⚪","수":"💧" };
          const y = Number(profile.birthYear);
          const z = zodiacList[((y - 4) % 12 + 12) % 12];
          const oh = ohArr[((y - 4) % 10 + 10) % 10];
          const gan = ganList[((y - 4) % 10 + 10) % 10];
          const dayMsgs = [
            "오늘은 그동안 미뤄온 결정을 내리기 좋은 날입니다.",
            "오늘은 사람과의 인연이 평소보다 강하게 작동하는 날입니다.",
            "오늘은 돈과 관련된 작은 선택이 길게 영향을 미치는 날입니다.",
            "오늘은 몸의 신호에 조금 더 귀 기울여야 하는 날입니다.",
            "오늘은 새로운 시도를 해볼 만한 기운이 흐르는 날입니다.",
            "오늘은 차분히 정리하고 돌아보기 좋은 날입니다.",
            "오늘은 평소보다 직관을 믿어도 좋은 날입니다.",
          ];
          const dIdx = new Date().getDay();
          const tomorrowMsgs = [
            "내일은 가까운 사람과의 대화에서 좋은 기운이 들어옵니다.",
            "내일은 작은 기회가 평소보다 눈에 잘 들어오는 흐름입니다.",
            "내일은 재물과 관련된 신호를 눈여겨봐야 하는 흐름입니다.",
            "내일은 몸과 마음을 챙기는 것이 우선인 흐름입니다.",
            "내일은 새로운 인연이나 제안이 들어올 수 있는 흐름입니다.",
            "내일은 오늘 한 결정의 결과가 서서히 드러나는 흐름입니다.",
            "내일은 한 주를 준비하는 마음가짐이 중요한 흐름입니다.",
          ];
          return (
            <div style={{ background: "linear-gradient(180deg, #fdf9ef 0%, #ffffff 14%)", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
              <div style={{ background: G_PREMIUM, color: "white", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🪬 {profile?.name}님의 사주팔자 한눈에 보기</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "16px 18px" }}>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🐉</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>띠</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{z}띠</div>
                </div>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{ohEmoji[oh]}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>오행</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{oh}({oh === "목" ? "木" : oh === "화" ? "火" : oh === "토" ? "土" : oh === "금" ? "金" : "水"})</div>
                </div>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🌳</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>천간</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{gan}({gan === "갑" ? "甲" : gan === "을" ? "乙" : gan === "병" ? "丙" : gan === "정" ? "丁" : gan === "무" ? "戊" : gan === "기" ? "己" : gan === "경" ? "庚" : gan === "신" ? "辛" : gan === "임" ? "壬" : "癸"})</div>
                </div>
              </div>
              <div style={{ padding: "0 18px 16px" }}>
                <div style={{ background: "#f5f3ff", borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "#6d28d9", fontWeight: 800, marginBottom: 4 }}>🔮 오늘의 한마디</div>
                  <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{dayMsgs[dIdx]}</div>
                </div>
                <div style={{ background: "#f5f3ff", borderRadius: 14, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#6d28d9", fontWeight: 800, marginBottom: 4 }}>🌙 내일의 예고</div>
                  <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{tomorrowMsgs[(dIdx + 1) % 7]}</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── 무료: 오늘의 운세 카드 ── */}
        {tier === "free" && (
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
        )}

        {/* ── 990원: 선택한 5개 운세 ── */}
        {tier === "select" && Object.keys(allAnalyses).length > 0 && (
          ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key)).map((c, i) => (
            <div key={c.key} ref={el => { cardRefs.current[2 + i] = el; }}
              style={{ background: "white", borderRadius: 24, border: `1.5px solid ${c.color}44`, marginBottom: 12 }}>
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

        {/* ── 패키지(9900~29900): 패키지별 운세 ── */}
        {tier === "package" && Object.keys(allAnalyses).length > 0 && (
          (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["기본 분석"]).filter(c => allAnalyses[c.apiKey]).map((c, i) => (
            <div key={c.apiKey} ref={el => { cardRefs.current[2 + i] = el; }}
              style={{ background: "linear-gradient(180deg, #fdf9ef 0%, #ffffff 14%)", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(217,180,80,0.18)", background: "linear-gradient(90deg, rgba(217,180,80,0.10), transparent)" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{c.label}</span>
                <span style={{ fontSize: 10, background: G_PREMIUM, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>📦 패키지</span>
                {c.apiKey === "💍 결혼·궁합운" && (
                  <span style={{ fontSize: 10, background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>💞 궁합 {scores?.total ?? 0}%</span>
                )}
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {allAnalyses[c.apiKey]}
                </p>
              </div>
            </div>
          ))
        )}


        {/* ── 무료: 공유하기 + 유료 결제하기 ── */}
        {tier === "free" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={share}
                style={{ width: "100%", padding: "13px 0", background: "white", color: "#ec4899", border: "1.5px solid rgba(236,72,153,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.1)" }}>
                📤 공유하기
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                💳 유료 운세 결제하기
              </button>
            </div>
          </>
        )}

        {/* ── 990원: 유료 결제하기 + 다시 분석 + 보관함 저장 ── */}
        {tier === "select" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                💳 유료 운세 결제하기
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => { sessionStorage.removeItem("v2_paid"); sessionStorage.removeItem("v2_paid_cats"); sessionStorage.removeItem("price"); router.push("/main-v2/payment"); }}
                style={{ width: "100%", padding: "12px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                🔮 다시 분석
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/history")}
                style={{ width: "100%", padding: "13px 0", background: "white", color: "#8b5cf6", border: "1.5px solid rgba(139,92,246,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.1)" }}>
                📥 보관함 저장
              </button>
            </div>
          </>
        )}

        {/* ── 패키지(9900~29900): 공유하기 + 유료 결제하기 + 다시 분석 + 보관함 저장 + 이미지 저장 ── */}
        {tier === "package" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={share}
                style={{ width: "100%", padding: "13px 0", background: "white", color: "#ec4899", border: "1.5px solid rgba(236,72,153,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.1)" }}>
                📤 공유하기
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                💳 유료 운세 결제하기
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => { sessionStorage.removeItem("v2_paid"); sessionStorage.removeItem("v2_paid_cats"); sessionStorage.removeItem("price"); router.push("/main-v2/payment"); }}
                style={{ width: "100%", padding: "12px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                🔮 다시 분석
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/history")}
                style={{ width: "100%", padding: "13px 0", background: "white", color: "#8b5cf6", border: "1.5px solid rgba(139,92,246,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.1)" }}>
                📥 보관함 저장
              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <button onClick={saveImage} disabled={saving}
                style={{ width: "100%", padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.3)", opacity: saving ? 0.7 : 1 }}>
                {saving ? "⏳ 저장 중..." : "🖼️ 이미지 저장"}
              </button>
            </div>
          </>
        )}
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
