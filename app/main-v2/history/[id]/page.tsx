"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const SELECT_CATS = [
  { key: "💰 재물운", scoreKey: "wealth",  color: "#f59e0b", icon: "💰" },
  { key: "💕 연애운", scoreKey: "love",    color: "#ec4899", icon: "💕" },
  { key: "💪 건강운", scoreKey: "health",  color: "#10b981", icon: "💪" },
  { key: "🎯 성공운", scoreKey: "success", color: "#8b5cf6", icon: "🎯" },
  { key: "✨ 총운",   scoreKey: "total",   color: "#6366f1", icon: "✨" },
];

// 헤더를 전부 똑같은 핑크색 대신, 그 사주가 어떤 운세인지에 맞는 색으로 보여주기
// 위한 색상표(패키지 카테고리까지 포함해서 더 넓게 둠)
const CAT_COLOR: Record<string, string> = {
  "💰 재물운": "#f59e0b", "💕 연애운": "#ec4899", "💪 건강운": "#10b981",
  "🎯 성공운": "#8b5cf6", "✨ 총운": "#6366f1", "☀️ 올해 운세": "#f59e0b",
  "📅 월별운세": "#0ea5e9", "💍 결혼·궁합운": "#f43f5e", "📝 이름분석": "#6366f1",
  "💼 전체 사주분석": "#8b5cf6", "🌟 오늘의 운세": "#f59e0b",
};
function catGradient(category?: string): string {
  const c = category && CAT_COLOR[category];
  return c ? `linear-gradient(135deg, ${c}, ${c}cc)` : G;
}

function SelectModal({ onClose, onPay, paying }: {
  onClose: () => void;
  onPay: (cats: string[]) => void;
  paying: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(SELECT_CATS.map(c => c.key));
  const price = selected.length * 990;
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: "100%", maxWidth: 480, background: "white", borderRadius: "28px 28px 0 0", padding: "28px 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 20px" }} />
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>어떤 운세를 확인할까요?</h2>
        <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "0 0 20px" }}>
          {selected.length > 0
            ? <><span style={{ color: "#ec4899", fontWeight: 800 }}>{selected.length}개</span> 선택 · <span style={{ color: "#8b5cf6", fontWeight: 800 }}>₩{price.toLocaleString()}</span></>
            : "운세를 선택하세요"}
        </p>
        <button
          onClick={() => setSelected(selected.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
          style={{ width: "100%", padding: "10px 16px", marginBottom: 12, background: selected.length === SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selected.length === SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 14, fontWeight: 800, fontSize: 13, color: selected.length === SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <span>✨ 전체 선택</span>
          <span style={{ fontSize: 16 }}>{selected.length === SELECT_CATS.length ? "☑️" : "⬜"}</span>
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {SELECT_CATS.map(c => {
            const on = selected.includes(c.key);
            return (
              <button key={c.key}
                onClick={() => setSelected(on ? selected.filter(k => k !== c.key) : [...selected, c.key])}
                style={{ padding: "14px 16px", border: `1.5px solid ${on ? c.color : "#e5e7eb"}`, borderRadius: 16, background: on ? `${c.color}10` : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: on ? c.color : "#374151" }}>{c.key.replace(/\S+\s/, "")}</div>
                  </div>
                </div>
                <span style={{ fontSize: 18 }}>{on ? "✅" : "⬜"}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPay(selected)}
          disabled={paying || selected.length === 0}
          style={{ width: "100%", padding: "16px 0", background: selected.length > 0 ? G : "#e5e7eb", color: selected.length > 0 ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: selected.length > 0 ? "pointer" : "not-allowed", boxShadow: selected.length > 0 ? "0 6px 20px rgba(236,72,153,0.35)" : "none" }}
        >
          {paying ? "⏳ 분석 중..." : selected.length > 0 ? `💎 ${selected.length}개 운세 보기 · ₩${price.toLocaleString()}` : "운세를 선택하세요"}
        </button>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => router.push("/main-v2/payment")}
            style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
            💳 유료 운세 결제하기
          </button>
        </div>
        <button onClick={onClose}
          style={{ width: "100%", marginTop: 10, padding: "12px 0", background: "transparent", color: "#9ca3af", border: "none", fontSize: 13, cursor: "pointer" }}>
          취소
        </button>
      </div>
    </div>
  );
}

function Bar({ label, score, color }: { label: string; score: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 300); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{score}점</span>
      </div>
      <div style={{ height: 7, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: G, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryDetail() {
  const router = useRouter();
  const params = useParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const [item, setItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [paying, setPaying] = useState(false);

  // 읽기(텍스트 음성 읽어주기) — 결과지 화면과 동일한 방식
  const [speaking, setSpeaking] = useState(false);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);
  const resumeAfterHideRef = useRef<() => void>(() => {});
  const wakeLockRef = useRef<any>(null);
  const requestWakeLock = async () => {
    try { if ("wakeLock" in navigator) wakeLockRef.current = await (navigator as any).wakeLock.request("screen"); } catch {}
  };
  const releaseWakeLock = () => {
    try { wakeLockRef.current?.release(); } catch {}
    wakeLockRef.current = null;
  };

  useEffect(() => {
    const hist: any[] = JSON.parse(localStorage.getItem("v2_history") || "[]");
    const found = hist.find(h => String(h.id) === String(params.id));
    if (!found) { router.replace("/main-v2/history"); return; }
    setItem(found);
  }, [params.id]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      releaseWakeLock();
    };
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") resumeAfterHideRef.current();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 저장된 항목(item.id)마다 다른 키를 써야, 다른 글을 보고 읽기를 눌렀을 때
  // 이전 글이 이어 읽히는 문제가 안 생김
  const ttsProgressKey = `v2_hist_tts_progress_${item?.id ?? ""}`;
  const saveTtsProgress = (chunks: string[], idx: number) => {
    try { localStorage.setItem(ttsProgressKey, JSON.stringify({ chunks, idx })); } catch {}
  };
  const clearTtsProgress = () => {
    try { localStorage.removeItem(ttsProgressKey); } catch {}
  };
  const getKoreanVoice = (): Promise<SpeechSynthesisVoice | null> => {
    return new Promise(resolve => {
      const pick = (list: SpeechSynthesisVoice[]) => list.find(v => v.lang?.toLowerCase().startsWith("ko")) || null;
      const existing = window.speechSynthesis.getVoices();
      if (existing.length > 0) { resolve(pick(existing)); return; }
      const timer = setTimeout(() => resolve(pick(window.speechSynthesis.getVoices())), 1000);
      window.speechSynthesis.onvoiceschanged = () => { clearTimeout(timer); resolve(pick(window.speechSynthesis.getVoices())); };
    });
  };
  const speakFrom = async (chunks: string[], startIdx: number) => {
    const voice = await getKoreanVoice();
    chunks.slice(startIdx).forEach((chunk, i) => {
      const idx = startIdx + i;
      const utter = new SpeechSynthesisUtterance(chunk);
      utter.lang = "ko-KR";
      if (voice) utter.voice = voice;
      utter.rate = 1;
      utter.onstart = () => { readIdxRef.current = idx; saveTtsProgress(chunks, idx); };
      utter.onerror = (e) => {
        setSpeaking(false);
        if (e.error === "canceled" || e.error === "interrupted") return;
        readChunksRef.current = [];
        readIdxRef.current = 0;
        window.speechSynthesis.cancel();
        releaseWakeLock();
        alert("읽어주기가 끊겼어요. 화면이 자동으로 꺼지면서 끊기는 경우가 많아요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      };
      if (idx === chunks.length - 1) {
        utter.onend = () => { setSpeaking(false); readIdxRef.current = 0; readChunksRef.current = []; clearTtsProgress(); releaseWakeLock(); };
      }
      window.speechSynthesis.speak(utter);
    });
  };
  resumeAfterHideRef.current = () => {
    if (speaking && readChunksRef.current.length > 0 && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      requestWakeLock();
      speakFrom(readChunksRef.current, readIdxRef.current);
    }
  };
  const toggleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("카카오톡 등 앱 안에서는 화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고 [다른 브라우저로 열기]를 선택한 다음 읽기를 누르면 읽어주기 기능이 작동합니다.\n\n그래도 안 되면, 점 세 개(⋮) 버튼을 누르고 [다른 앱으로 공유] → [Chrome]을 선택해서 들어간 다음 읽기를 눌러보세요.\n\n💡 읽는 중간에 화면이 꺼지면 끊길 수 있어요. 휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      releaseWakeLock();
      return;
    }
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const tipKey = "v2_hist_tts_tip_shown_date";
    if (isMobileDevice && localStorage.getItem(tipKey) !== new Date().toDateString()) {
      alert("💡 읽는 중간에 화면이 꺼지면 끊길 수 있어요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      localStorage.setItem(tipKey, new Date().toDateString());
    }
    if (readChunksRef.current.length === 0) {
      try {
        const saved = localStorage.getItem(ttsProgressKey);
        if (saved) {
          const { chunks, idx } = JSON.parse(saved);
          if (Array.isArray(chunks) && chunks.length > 0 && typeof idx === "number") {
            readChunksRef.current = chunks;
            readIdxRef.current = idx;
          }
        }
      } catch {}
    }
    if (readChunksRef.current.length === 0) {
      const fullText = (item?.analysis ?? "")
        .replace(/(\d+)\s*~\s*(\d+)\s*(시|월|일|년|분|초|회|번|개|세)/g, "$1$3에서 $2$3")
        .replace(/(\d+[가-힣]{0,2})\s*~\s*(?=\d)/g, "$1에서 ")
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}\u{FE0F}]/gu, "")
        .replace(/[（(][一-鿿]+[）)]/g, "")
        .replace(/[一-鿿]+[（(]([가-힣]+)[）)]/g, "$1")
        .replace(/×/g, " 와 ");
      if (!fullText.trim()) return;
      readChunksRef.current = fullText.split(/(?<=[.!?。\n])\s*/).map((s: string) => s.trim()).filter(Boolean);
      readIdxRef.current = 0;
    }
    window.speechSynthesis.cancel();
    requestWakeLock();
    speakFrom(readChunksRef.current, readIdxRef.current);
    setSpeaking(true);
  };

  const saveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    if (window.innerWidth < 768) alert("📥 잠시 후 '다운로드' 확인창이 뜨면 [다운로드]를 눌러주세요!");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#fdf2f8",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `점운_${item?.name ?? "운세"}_${item?.category?.replace(/\S+\s/, "") ?? ""}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setTimeout(() => alert(`✅ ${window.innerWidth < 768 ? "사진 앱(갤러리)" : "다운로드 폴더"}에 저장됐어요!`), 0);
    } catch {
      alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handlePay = async (cats: string[]) => {
    setPaying(true);
    try {
      // 일반 결제 흐름(메인 990원 선택)과 똑같이 결제완료 확인 화면을 거치게 함
      sessionStorage.setItem("v2_paid_cats", JSON.stringify(cats));
      const pkgName = cats.map(c => c.replace(/\S+\s/, "")).join("+");
      const price = cats.length * 990;
      router.push(`/payment-complete?package=${encodeURIComponent(pkgName)}&pages=${cats.length * 30}&paid=${price}`);
    } finally {
      setPaying(false);
      setShowSelect(false);
    }
  };

  const share = async () => {
    if (!item) return;
    let url = window.location.origin + "/main-v2";
    try {
      const matchedCat = SELECT_CATS.find(c => c.key === item.category);
      const res = await fetch("/api/v2/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name, scores: item.scores,
          categories: [{
            icon: matchedCat?.icon ?? "🔮",
            label: item.category?.replace(/\S+\s/, "") ?? "운세",
            color: matchedCat?.color ?? "#8b5cf6",
            text: item.analysis,
          }],
        }),
      });
      if (res.ok) { const data = await res.json(); url = `${window.location.origin}/main-v2/share/${data.id}`; }
    } catch {}
    const text = `${item.name}님의 ${item.category} 분석 🔮\n총운 ${item.scores?.total}점\n\n📱 나도 무료로!`;
    if (navigator.share) navigator.share({ title: "점운 운세 결과", text, url }).catch(() => {});
    else navigator.clipboard.writeText(`${text}\n${url}`).then(() => alert("✅ 링크 복사됨!"));
  };

  if (!item) return null;

  const bars = [
    { label: "🌟 오늘의 운세", key: "total",   color: "#f59e0b" },
    { label: "💰 재물운",      key: "wealth",  color: "#f59e0b" },
    { label: "💕 연애운",      key: "love",    color: "#ec4899" },
    { label: "💪 건강운",      key: "health",  color: "#10b981" },
    { label: "🎯 성공운",      key: "success", color: "#8b5cf6" },
    { label: "✨ 총운",        key: "total",   color: "#6366f1" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2/history")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>보관함</span>
        </button>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={toggleReadAloud} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{speaking ? "⏹ 멈추기" : "🔊 읽기"}</button>
          <button onClick={share} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>📱 공유</button>
          {item.isPaid && (
            <button onClick={saveImage} disabled={saving} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "⏳..." : "🖼️ 저장"}
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 72px" }}>

        {/* 이미지 저장 대상 카드 */}
        <div ref={cardRef} style={{ background: "white", borderRadius: 24, overflow: "hidden", border: "1.5px solid rgba(236,72,153,0.1)" }}>

          {/* 헤더 그래디언트 — 운세 카테고리에 맞는 색으로 표시 */}
          <div style={{ background: catGradient(item.category), color: "white", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px 20px 0" }}>
              <span style={{ fontSize: 13 }}>🐱</span>
              <span style={{ fontSize: 13, fontWeight: 900 }}>점운 · AI 사주 분석</span>
            </div>
            <div style={{ padding: "14px 20px 24px" }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{item.category?.split(" ")[0] ?? "✨"}</div>
              <h1 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 4px" }}>{item.name}님의 {item.category?.replace(/\S+\s/, "")}</h1>
              <div style={{ fontSize: 12, opacity: 0.75 }}>{fmtDate(item.date)}</div>
              <div style={{ fontSize: 36, fontWeight: 900, margin: "12px 0 2px" }}>{item.scores?.total ?? "—"}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>총운 점수</div>
            </div>
          </div>

          {/* 분야별 점수 */}
          <div style={{ padding: "20px 18px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>📊 분야별 운세 점수</div>
            {bars.map(b => (
              <Bar key={b.key} label={b.label}
                score={item.scores?.[b.key] ?? 0} color={b.color} />
            ))}
          </div>

          {/* 럭키 정보 (있을 경우) */}
          {(item.luckyColor || item.luckyNumber || item.luckyDirection) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 18px 18px" }}>
              {[
                { label: "행운 색", value: item.luckyColor, icon: "🎨" },
                { label: "행운 숫자", value: item.luckyNumber, icon: "🔢" },
                { label: "행운 방향", value: item.luckyDirection, icon: "🧭" },
              ].map(i => i.value && (
                <div key={i.label} style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{i.icon}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{i.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{i.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* 분석 전체 텍스트 — 잘림 없음 */}
          <div style={{ padding: "0 18px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 10 }}>🔮 {item.category} 상세 분석</div>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
              {item.fullAnalysis ?? item.analysis}
            </p>
          </div>

        </div>

        {/* 하단 버튼 */}
        <div style={{ display: "grid", gridTemplateColumns: item.planType === "package" ? "1fr 1fr" : "1fr", gap: 10, marginTop: 14 }}>
          {item.planType === "package" && (
            <button onClick={saveImage} disabled={saving}
              style={{ padding: "13px 0", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.3)" }}>
              {saving ? "저장 중..." : "🖼️ 이미지 저장"}
            </button>
          )}
          <button onClick={toggleReadAloud}
            style={{ padding: "13px 0", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>
            {speaking ? "⏹ 멈추기" : "🔊 읽기"}
          </button>
        </div>
      </div>

      {showSelect && (
        <SelectModal
          onClose={() => setShowSelect(false)}
          onPay={handlePay}
          paying={paying}
        />
      )}
    </main>
  );
}
