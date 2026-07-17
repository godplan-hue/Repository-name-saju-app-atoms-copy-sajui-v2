"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import KakaoShareCouponBanner from "../../_components/KakaoShareCouponBanner";
import QAChatWidget from "../../../../components/QAChatWidget";
import { nav } from "../../../../lib/navigate";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

interface SharedCategory {
  icon: string;
  label: string;
  color: string;
  text: string;
  badge?: string;
  isHeader?: boolean;
}

interface SharedEntry {
  name: string;
  scores?: { total?: number; wealth?: number; love?: number; health?: number; success?: number };
  luckyColor?: string;
  luckyNumber?: number;
  luckyDirection?: string;
  categories: SharedCategory[];
  businessName?: string;
  tier?: string;
  birthYear?: string;
  subtitle?: string;
}

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

const SPECIAL_LABELS: Record<string, string> = {
  sinyeon: "신년운세", love_detail: "연애사주", findmatch: "내 사람 찾기", marriage_detail: "결혼사주", divorce: "이혼운세",
};

export default function ShareClient({ id }: { id: string }) {
  const [entry, setEntry] = useState<SharedEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [tipModal, setTipModal] = useState<{ text: string; onConfirm?: () => void } | null>(null);
  const [saving, setSaving] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const [isMob, setIsMob] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => { setIsMob(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)); }, []);
  useEffect(() => {
    if (sessionStorage.getItem("share_just_paid") === "1") {
      sessionStorage.removeItem("share_just_paid");
      try { localStorage.setItem(`share_owner_${id}`, "1"); } catch {}
      setIsOwner(true);
    } else {
      try { if (localStorage.getItem(`share_owner_${id}`) === "1") setIsOwner(true); } catch {}
    }
  }, [id]);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showMobGuideModal, setShowMobGuideModal] = useState(false);
  const [namingQueue, setNamingQueue] = useState<string[]>([]);

  useEffect(() => {
    try {
      const q = JSON.parse(sessionStorage.getItem("v2_naming_queue") || "[]");
      if (Array.isArray(q) && q.length > 0) setNamingQueue(q);
    } catch {}
  }, []);
  const [bannerIdx, setBannerIdx] = useState(0);
  const BANNER_MSGS = ["오늘 재물운이 어떨까?", "취업 될 것 같아?", "연애운 알려줘!", "이직 타이밍 맞아?", "올해 대박 나는 달 언제야?", "내 강점이 뭐야?"];
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNER_MSGS.length), 700);
    return () => clearInterval(t);
  }, []);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);
  const restartingRef = useRef(false);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleKakaoShare = () => {
    if (!entry) return;
    const url = `${window.location.origin}/main-v2/share-kakao/${id}`;
    const kakao = (window as any).Kakao;
    if (kakao && !kakao.isInitialized()) { try { kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); } catch {} }
    const kakaoReady = kakao && kakao.isInitialized() && kakao.Share;
    if (kakaoReady && url) {
      try {
        kakao.Share.sendDefault({ objectType: "feed", content: { title: `🔮 ${entry.name}님의 ${entry.categories[0]?.label ?? "사주"} 분석 결과`, description: `총운 ${entry.scores?.total ?? "?"}점! 🔮 AI 사주 점운 jeomun.com`, imageUrl: "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg", link: { mobileWebUrl: url, webUrl: url } }, buttons: [{ title: "내 사주 결과 보기", link: { mobileWebUrl: url, webUrl: url } }, { title: "나도 무료로 사주 보기", link: { mobileWebUrl: "https://jeomun.com/main-v2", webUrl: "https://jeomun.com/main-v2" } }] });
      } catch {
        navigator.clipboard.writeText(url).catch(() => {});
      }
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  const saveToHistory = () => {
    if (!entry || historySaved) return;
    if (entry.tier === "free") return;
    try {
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      const histId = `share-${id}`;
      if (hist.some((h: any) => h.id === histId)) { setHistorySaved(true); return; }
      hist.unshift({
        id: histId, date: new Date().toISOString(), name: entry.name,
        category: entry.categories[0]?.label ?? "분석결과",
        scores: entry.scores ?? {}, isPaid: true, planType: "special",
        analysis: entry.categories.map(c => `${c.label}\n${c.text}`).join("\n\n"),
        categories: entry.categories,
        birthYear: entry.birthYear ?? "", luckyColor: entry.luckyColor ?? "",
        luckyNumber: entry.luckyNumber ?? "", luckyDirection: entry.luckyDirection ?? "",
        shareId: id,
      });
      localStorage.setItem("v2_history", JSON.stringify(hist.slice(0, 50)));
      setHistorySaved(true);
    } catch {}
  };

  const saveImage = async () => {
    if (!contentRef.current || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(contentRef.current, { backgroundColor: "#fdf2f8", scale: 1.5, useCORS: true });
      canvas.toBlob(blob => {
        if (!blob) { setSaving(false); return; }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${entry?.name ?? "사주"}_분석결과.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setSaving(false);
      }, "image/png");
    } catch { setSaving(false); }
  };

  useEffect(() => {
    fetch(`/api/v2/share?id=${encodeURIComponent(id)}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setEntry(data.entry);
        // 내 프로필(이름+생년)이 share 데이터와 일치하면 오너로 처리 (기존 링크 복구)
        try {
          const sp = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
          if (data.entry && sp.name && sp.birthYear &&
              data.entry.name === sp.name &&
              String(data.entry.birthYear) === String(sp.birthYear)) {
            setIsOwner(true);
            localStorage.setItem(`share_owner_${id}`, "1");
          }
        } catch {}
      })
      .catch(() => setNotFound(true));
  }, [id]);

  // 이 화면을 벗어나면 읽어주기가 계속 돌아가지 않도록 강제로 멈춤
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  // 일부 기기(특히 안드로이드)는 음성 목록이 비동기로 늦게 로드되어, 그 전에
  // speak()를 호출하면 에러도 없이 그냥 소리가 안 나는 경우가 있음 — 목록이
  // 채워지길 잠깐 기다렸다가(최대 1초) 한국어 음성을 찾아서 명시적으로 지정함
  const getKoreanVoice = (): Promise<SpeechSynthesisVoice | null> => {
    return new Promise(resolve => {
      const pick = (list: SpeechSynthesisVoice[]) => list.find(v => v.lang?.toLowerCase().startsWith("ko")) || null;
      const existing = window.speechSynthesis.getVoices();
      if (existing.length > 0) { resolve(pick(existing)); return; }
      const timer = setTimeout(() => resolve(pick(window.speechSynthesis.getVoices())), 1000);
      window.speechSynthesis.onvoiceschanged = () => {
        clearTimeout(timer);
        resolve(pick(window.speechSynthesis.getVoices()));
      };
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
      utter.onstart = () => { readIdxRef.current = idx; };
      utter.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") {
          if (!restartingRef.current) setSpeaking(false);
          return;
        }
        setSpeaking(false);
        readChunksRef.current = [];
        readIdxRef.current = 0;
        // 진짜 실패일 때는 이미 대기열에 들어가 있는 나머지 문장들도 전부
        // 멈춰야 함 — 안 그러면 "멈추기"를 눌러도 계속 읽히는 것처럼 보임
        window.speechSynthesis.cancel();
        setTipModal({ text: "읽어주기가 끊겼어요. 화면이 자동으로 꺼지면서 끊기는 경우가 많아요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요." });
      };
      if (idx === chunks.length - 1) {
        utter.onend = () => { setSpeaking(false); readIdxRef.current = 0; readChunksRef.current = []; };
      }
      window.speechSynthesis.speak(utter);
    });
  };

  const toggleReadAloud = () => {
    if (typeof window === "undefined") return;
    const _ua = navigator.userAgent;
    const _isKakao = /KAKAOTALK/i.test(_ua);
    if (_isKakao) {
      setTipModal({ text: "카카오톡 등 앱 안에서는 화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고 [다른 브라우저로 열기]를 선택한 다음 읽기를 누르면 읽어주기 기능이 작동합니다.\n\n그래도 안 되면, 점 세 개(⋮) 버튼을 누르고 [다른 앱으로 공유] → [Chrome]을 선택해서 들어간 다음 읽기를 눌러보세요.\n\n💡 읽는 중간에 화면이 꺼지면 끊길 수 있어요. 휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요." });
      return;
    }
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const ttsTipKey = "share_tts_tip_shown_date";
    if (isMobileDevice && localStorage.getItem(ttsTipKey) !== new Date().toDateString()) {
      localStorage.setItem(ttsTipKey, new Date().toDateString());
      setTipModal({
        text: "💡 읽는 중간에 화면이 꺼지면 끊길 수 있어요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.\n\n확인을 누르면 바로 읽기 시작해요.",
        onConfirm: () => {
          if (readChunksRef.current.length === 0) {
            const fullText = (entry?.categories ?? []).map(c => c.text).filter(Boolean).join("\n").replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "");
            if (!fullText.trim()) return;
            readChunksRef.current = fullText.split(/(?<=[.!?。\n])\s*/).map(s => s.trim()).filter(Boolean);
            readIdxRef.current = 0;
          }
          window.speechSynthesis.cancel();
          speakFrom(readChunksRef.current, readIdxRef.current);
          setSpeaking(true);
        },
      });
      return;
    }
    if (readChunksRef.current.length === 0) {
      const fullText = (entry?.categories ?? []).map(c => c.text).filter(Boolean).join("\n")
        .replace(/(\d+)\s*~\s*(\d+)\s*(시|월|일|년|분|초|회|번|개|세)/g, "$1$3에서 $2$3")
        .replace(/(\d+[가-힣]{0,2})\s*~\s*(?=\d)/g, "$1에서 ")
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}\u{FE0F}]/gu, "")
        .replace(/[（(][一-鿿]+[）)]/g, "")
        .replace(/[一-鿿]+[（(]([가-힣]+)[）)]/g, "$1")
        .replace(/×/g, " 와 ");
      if (!fullText.trim()) return;
      readChunksRef.current = fullText.split(/(?<=[.!?。\n])\s*/).map(s => s.trim()).filter(Boolean);
      readIdxRef.current = 0;
    }
    window.speechSynthesis.cancel();
    speakFrom(readChunksRef.current, readIdxRef.current);
    setSpeaking(true);
  };

  const restartReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    restartingRef.current = true;
    window.speechSynthesis.cancel();
    const fullText = (entry?.categories ?? []).map(c => c.text).filter(Boolean).join("\n")
      .replace(/(\d+)\s*~\s*(\d+)\s*(시|월|일|년|분|초|회|번|개|세)/g, "$1$3에서 $2$3")
      .replace(/(\d+[가-힣]{0,2})\s*~\s*(?=\d)/g, "$1에서 ")
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}\u{FE0F}]/gu, "")
      .replace(/[（(][一-鿿]+[）)]/g, "")
      .replace(/[一-鿿]+[（(]([가-힣]+)[）)]/g, "$1")
      .replace(/×/g, " 와 ");
    if (!fullText.trim()) return;
    readChunksRef.current = fullText.split(/(?<=[.!?。\n])\s*/).map(s => s.trim()).filter(Boolean);
    readIdxRef.current = 0;
    speakFrom(readChunksRef.current, 0);
    setSpeaking(true);
    setTimeout(() => { restartingRef.current = false; }, 300);
  };

  if (notFound) {
    return (
      <main style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", marginBottom: 16 }}>결과를 찾을 수 없어요.</p>
          <button onClick={() => nav("/main-v2")} style={{ padding: "12px 28px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>
            🔮 내 운세 보러 가기
          </button>
        </div>
      </main>
    );
  }

  if (!entry) return null;

  return (
    <>
    {tipModal && (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setTipModal(null)}>
        <div style={{ background: "white", borderRadius: 20, padding: "28px 24px 20px", maxWidth: 340, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: 15, fontWeight: 900, color: "#333", margin: "0 0 16px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{tipModal.text}</p>
          <button onClick={() => { const cb = tipModal.onConfirm; setTipModal(null); if (cb) cb(); }} style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer" }}>확인</button>
        </div>
      </div>
    )}
    <main ref={pageRef} style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      {/* 어디로 스크롤하든 항상 누를 수 있게 고정된 읽기 버튼 */}
      <div style={{ position: "fixed", right: 16, bottom: 80, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <button onClick={restartReadAloud} title="처음부터 다시 듣기" style={{ padding: "8px 12px", borderRadius: 50, border: "none", background: "rgba(139,92,246,0.15)", color: "#8b5cf6", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>↺ 처음부터 듣기</button>
        <button onClick={toggleReadAloud}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 50, border: "none", background: speaking ? "linear-gradient(135deg, #ef4444, #f97316)" : G, color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
          {speaking ? "⏹ 멈추기" : "🔊 읽어주기"}
        </button>
      </div>

      <header style={{ minHeight: 52, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", rowGap: 6, columnGap: 6, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)" }}>
        <span onClick={() => nav("/main-v2")} style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap", cursor: "pointer" }}>{entry.businessName ? `🔮 ${entry.businessName}` : "🐱 점운"}</span>
        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
          <button onClick={toggleReadAloud} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            {speaking ? "⏸ 멈추기" : "🔊 읽기"}
          </button>
          <button onClick={restartReadAloud} title="처음부터 다시 듣기" style={{ padding: "5px 9px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>↺ 처음부터 듣기</button>
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* 이용 안내 버튼 */}
        {isOwner && (
          <button
            onClick={() => isMob ? setShowMobGuideModal(true) : setShowGuideModal(true)}
            style={{ display: "block", width: "100%", padding: "13px 16px", marginBottom: 14, background: "#dc2626", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer", textAlign: "left", boxShadow: "0 2px 10px rgba(220,38,38,0.35)" }}
          >
            🔊 읽기 이용 안내
          </button>
        )}
        {isOwner && !entry.businessName && <KakaoShareCouponBanner />}
        {isOwner && !entry.businessName && (
          <div onClick={() => nav("/share-coupon")} style={{ margin: "0 0 8px", borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 14px rgba(220,38,38,0.15)", border: "1.5px solid #fca5a5" }}>
            <div style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>📸</span>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>소개·추천 글 올리면 쿠폰 10장 + 꿈해몽 무료!</span>
            </div>
            <div style={{ background: "#fef2f2", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 12, color: "#dc2626", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>1,000자 이상 + 사진 3장 올리면<br /><strong>쿠폰 10장</strong> + 꿈해몽 24시간 무료 🎁</p>
              <span style={{ fontSize: 13, fontWeight: 900, color: "#fff", background: "#dc2626", padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap", marginLeft: 10 }}>받기 →</span>
            </div>
          </div>
        )}
        {isOwner && entry.name && entry.birthYear && (
          <button onClick={() => nav("/main-v2/qa-list")} style={{ width: "100%", padding: "14px 20px", marginBottom: 16, background: "linear-gradient(135deg, #1a0635, #3b0764)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(139,92,246,0.4)" }}>
            💬 사주 Q&A — 무엇이든 물어보세요
          </button>
        )}

        {/* 분석 내용 캡처 영역 — 이미지 저장 시 이 범위만 캡처 */}
        <div ref={contentRef}>

        {/* 점수 요약 카드 */}
        <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
          <div style={{ background: entry.tier === "package" ? "#eab308" : G, color: entry.tier === "package" ? "#3a2a00" : "white", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
            <p style={{ fontSize: 15, fontWeight: 900, margin: 0, padding: "14px 20px 0", letterSpacing: "-0.3px" }}>🔮 {entry.businessName || "점운"} · AI 사주 분석</p>
            <div style={{ padding: "14px 20px 24px" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🔮</div>
              <h1 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px", opacity: 0.9 }}>{entry.name}님의 운세 분석</h1>
              <ScoreCircle score={entry.scores?.total ?? 0} size={130} />
              <p style={{ fontSize: 12, opacity: 0.75, margin: "8px 0 0", fontWeight: 600 }}>총운 점수</p>
            </div>
          </div>
          {(entry.luckyColor || entry.luckyNumber || entry.luckyDirection) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "16px 18px" }}>
              <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>행운 색</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{entry.luckyColor}</div>
              </div>
              <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>행운 숫자</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{entry.luckyNumber}</div>
              </div>
              <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>행운 방향</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{entry.luckyDirection}</div>
              </div>
            </div>
          )}
          {entry.scores && (
            <div style={{ padding: "4px 18px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>📊 분야별 운세 점수</div>
              {[
                { label: "🌟 오늘의 운세", key: "total",   color: "#f59e0b" },
                { label: "💰 재물운",      key: "wealth",  color: "#f59e0b" },
                { label: "💕 연애운",      key: "love",    color: "#ec4899" },
                { label: "💪 건강운",      key: "health",  color: "#10b981" },
                { label: "🎯 성공운",      key: "success", color: "#8b5cf6" },
                { label: "✨ 총운",        key: "total",   color: "#6366f1" },
              ].map((b, i) => (
                <ScoreBar key={i} label={b.label} score={entry.scores?.[b.key as keyof typeof entry.scores] ?? 0} color={b.color} />
              ))}
            </div>
          )}
        </div>

        {/* 무료/990원/special: 사주팔자 맛보기 (띠+오행만) */}
        {(entry.tier === "free" || entry.tier === "select" || entry.tier === "special") && entry.birthYear && (() => {
          const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
          const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
          const ohEmoji: Record<string, string> = { "목": "🌳", "화": "🔥", "토": "⛰️", "금": "⚪", "수": "💧" };
          const y = Number(entry.birthYear);
          const z = zodiacList[((y - 4) % 12 + 12) % 12];
          const oh = ohArr[((y - 4) % 10 + 10) % 10];
          return (
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ background: G, color: "white", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🔮 {entry.name}님의 사주팔자 맛보기</div>
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
            </div>
          );
        })()}

        {/* 패키지: 사주팔자 한눈에 보기 + 오늘/내일의 한마디 — 원래 결과지와 동일 */}
        {entry.tier === "package" && entry.birthYear && (() => {
          const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
          const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
          const ganList = ["갑","을","병","정","무","기","경","신","임","계"];
          const ohEmoji: Record<string, string> = { "목": "🌳", "화": "🔥", "토": "⛰️", "금": "⚪", "수": "💧" };
          const y = Number(entry.birthYear);
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
            <div style={{ background: "#fdf6e3", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
              <div style={{ background: "linear-gradient(135deg, #c026d3, #9333ea)", color: "white", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🪬 {entry.name}님의 사주팔자 한눈에 보기</div>
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

        {/* 카테고리별 카드 — 결과 페이지와 똑같이 아이콘/색으로 구분 */}
        {entry.categories.map((cat, i) => {
          if (cat.isHeader) {
            return (
              <div key={i} style={{ background: cat.color || "#ec4899", borderRadius: 18, padding: "18px 20px", marginBottom: 6, marginTop: i > 0 ? 24 : 0, boxShadow: `0 4px 18px ${cat.color || "#ec4899"}55` }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 5px" }}>{cat.label}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600, margin: 0 }}>{cat.text}</p>
              </div>
            );
          }
          const isPackageBadge = cat.badge === "📦 패키지";
          return (
          <div key={i} style={isPackageBadge
            ? { background: "#fdf6e3", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }
            : { background: "white", borderRadius: 24, border: `1.5px solid ${cat.color}44`, marginBottom: 12 }}>
            <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: isPackageBadge ? "1px solid rgba(217,180,80,0.18)" : "1px solid rgba(236,72,153,0.07)", background: isPackageBadge ? "linear-gradient(90deg, rgba(217,180,80,0.10), transparent)" : "transparent" }}>
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{cat.label}</span>
              {cat.badge && (
                <span style={{ fontSize: 10, background: isPackageBadge ? "linear-gradient(135deg, #c026d3, #9333ea)" : G, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>{cat.badge}</span>
              )}
            </div>
            <div style={{ padding: "14px 18px 20px" }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                {cat.text}
              </p>
            </div>
          </div>
          );
        })}

        </div>{/* /contentRef */}

        {/* 결제 후 오너 전용 버튼 — 하단 */}
        {isOwner && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <button onClick={handleKakaoShare} style={{ padding: "12px 4px", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.18)" }}>
              📤 공유하기
            </button>
            <button onClick={() => nav("/main-v2/payment")} style={{ padding: "12px 4px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
              💳 유료 운세
            </button>
            <button onClick={() => nav("/main-v2/history")} style={{ padding: "11px 4px", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1.5px solid rgba(139,92,246,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.15)" }}>
              📂 보관함 가기
            </button>
            <button onClick={() => { saveToHistory(); setHistorySaved(true); }} style={{ padding: "11px 4px", background: historySaved ? "#dcfce7" : "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: historySaved ? "#15803d" : "#4338ca", border: `1.5px solid ${historySaved ? "#22c55e" : "rgba(99,102,241,0.35)"}`, borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 10px rgba(99,102,241,0.18)" }}>
              {historySaved ? "✅ 저장됨!" : "📥 보관함 저장"}
            </button>
          </div>
        )}

        {/* 오너 전용 하단 배너 */}
        {isOwner && !entry.businessName && (
          <>
            <div style={{ margin: "16px 0 8px", borderRadius: 16, background: "linear-gradient(135deg, #ec4899, #8b5cf6)", padding: "16px 20px", textAlign: "center", cursor: "pointer" }} onClick={() => nav("/main-v2")}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: "white" }}>🔮 AI 사주 990원부터 시작</p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>지금 바로 내 운세 확인하기 →</p>
            </div>
            <button onClick={() => nav("/main-v2")} style={{ width: "100%", marginTop: 10, padding: "11px 0", background: "transparent", color: "#9ca3af", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>🏠 홈으로</button>
            <div style={{ display: "flex", gap: 10, margin: "10px 0" }}>
              <div onClick={() => nav("/haemong")} style={{ flex: 1, borderRadius: 14, cursor: "pointer", background: "#fff", border: "2px solid #dc2626", overflow: "hidden", boxShadow: "0 3px 12px rgba(220,38,38,0.15)" }}>
                <div style={{ background: "#dc2626", padding: "7px 10px", textAlign: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 11 }}>🎁 사주 결제 혜택</span>
                </div>
                <div style={{ padding: "10px" }}>
                  <p style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px" }}>🌙 꿈해몽 <span style={{ background: "#dc2626", color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>무료</span></p>
                  <p style={{ fontSize: 10, color: "#6b7280", margin: "0 0 8px", lineHeight: 1.5 }}>사주 결제하면<br />꿈해몽 전체 무료</p>
                  <div style={{ background: "#dc2626", color: "#fff", textAlign: "center", padding: "7px 0", borderRadius: 8, fontWeight: 800, fontSize: 11 }}>꿈해몽 보기 →</div>
                </div>
              </div>
              <div onClick={() => nav("/pass")} style={{ flex: 1, borderRadius: 14, cursor: "pointer", background: "#fff", border: "2px solid #ef4444", overflow: "hidden", boxShadow: "0 3px 12px rgba(239,68,68,0.2)" }}>
                <div style={{ background: "linear-gradient(135deg,#7f1d1d,#dc2626)", padding: "7px 10px", textAlign: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 11 }}>🔥 7개앱 풀패스</span>
                </div>
                <div style={{ padding: "10px" }}>
                  <p style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px" }}>₩4,900<span style={{ fontSize: 10, color: "#6b7280", fontWeight: 400 }}>/30일</span></p>
                  <p style={{ fontSize: 10, color: "#6b7280", margin: "0 0 8px", lineHeight: 1.5 }}>꿈해몽·타로·펫운<br />감정일기 등 7개앱</p>
                  <div style={{ background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", textAlign: "center", padding: "7px 0", borderRadius: 8, fontWeight: 800, fontSize: 11 }}>풀패스 구매 →</div>
                </div>
              </div>
            </div>
            {entry.name && entry.birthYear && (
              <>
                <div onClick={() => nav("/main-v2/qa-list")} style={{ marginTop: 8, marginBottom: 14, borderRadius: 20, overflow: "hidden", cursor: "pointer", background: "linear-gradient(135deg, #1a0635 0%, #3b0764 50%, #1e0a3c 100%)", boxShadow: "0 10px 36px rgba(139,92,246,0.45)", position: "relative", minHeight: 140 }}>
                  <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(236,72,153,0.18)", filter: "blur(30px)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: -20, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(139,92,246,0.2)", filter: "blur(25px)", pointerEvents: "none" }} />
                  <div style={{ padding: "22px 20px 20px", position: "relative", zIndex: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: "#fbbf24", background: "rgba(251,191,36,0.18)", border: "1px solid rgba(251,191,36,0.4)", padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5 }}>AI 사주 상담</span>
                    <p style={{ fontSize: 30, fontWeight: 900, color: "#ffffff", margin: "8px 0 2px", lineHeight: 1.15, letterSpacing: -1 }}>무엇이든<br />물어보세요</p>
                    <p style={{ fontSize: 13, color: "#fbbf24", fontWeight: 800, margin: "0 0 12px", minHeight: 20 }}>💬 &ldquo;{BANNER_MSGS[bannerIdx]}&rdquo;</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 13, boxShadow: "0 4px 14px rgba(236,72,153,0.5)" }}>사주 상담 →</span>
                      <span style={{ fontSize: 11, color: "white", fontWeight: 900 }}>매일 무료 3회</span>
                    </div>
                  </div>
                  <div style={{ position: "absolute", right: 10, bottom: 0, zIndex: 2, userSelect: "none", textAlign: "center" }}>
                    <div style={{ fontSize: 13, marginBottom: 2, animation: "sparkle 1.5s infinite alternate", opacity: 0.9 }}>✨ ⭐ ✨</div>
                    <div style={{ fontSize: 72, lineHeight: 1 }}>🐱</div>
                  </div>
                  <style>{`@keyframes sparkle { from { opacity: 0.5; transform: scale(0.95); } to { opacity: 1; transform: scale(1.05); } }`}</style>
                </div>
                <QAChatWidget name={entry.name} birthYear={Number(entry.birthYear)} unlocked={true} storagePrefix="share_qa" />
              </>
            )}
            <div style={{ margin: "14px 0 0", display: "flex", gap: 8 }}>
              <div onClick={() => nav("/main-v2/daewoon")} style={{ flex: 1, borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 14px rgba(139,92,246,0.15)", border: "1.5px solid #c4b5fd" }}>
                <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", padding: "8px 12px", textAlign: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>🌌 대운(大運)</span>
                </div>
                <div style={{ background: "#f5f3ff", padding: "10px 12px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#5b21b6", margin: "0 0 6px", lineHeight: 1.5, fontWeight: 600 }}>10년 단위<br />운명의 큰 흐름 분석</p>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: "#7c3aed", padding: "4px 12px", borderRadius: 20 }}>₩2,900 →</span>
                </div>
              </div>
              <div onClick={() => nav("/main-v2/taegil")} style={{ flex: 1, borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 14px rgba(34,197,94,0.15)", border: "1.5px solid #86efac" }}>
                <div style={{ background: "linear-gradient(135deg,#22c55e,#15803d)", padding: "8px 12px", textAlign: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>📅 택일(擇日)</span>
                </div>
                <div style={{ background: "#f0fdf4", padding: "10px 12px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#15803d", margin: "0 0 6px", lineHeight: 1.5, fontWeight: 600 }}>내 사주에 맞는<br />좋은 날 찾기</p>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: "#22c55e", padding: "4px 12px", borderRadius: 20 }}>₩2,900 →</span>
                </div>
              </div>
            </div>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", marginTop: 14, padding: "13px 16px", background: "#FEE500", color: "#1a1a1a", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer", textDecoration: "none" }}>
              <span style={{ fontSize: 18 }}>💬</span> 궁금한 점 카카오톡으로 문의하기
            </a>
          </>
        )}

        {/* 비오너: 나도 무료 사주 받아보기 */}
        {!isOwner && !entry.businessName && (
          <div style={{ marginBottom: 10 }}>
            <button onClick={() => { nav(entry.tier === "taegil" ? "/main-v2/taegil" : "/main-v2"); }} style={{ width: "100%", padding: "16px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
              {entry.tier === "taegil" ? "📅 나도 택일 받기" : "🔮 나도 무료 사주 받아보기"}
            </button>
          </div>
        )}

      </div>
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" strategy="afterInteractive" onLoad={() => { const k = (window as any).Kakao; if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); }} />
    </main>

    {/* ── 모바일 읽기 안내 모달 ── */}
    {showMobGuideModal && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowMobGuideModal(false)}>
        <div style={{ background: "white", borderRadius: 20, padding: "20px 18px", maxWidth: 360, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: 15, fontWeight: 900, color: "#6d28d9", margin: "0 0 14px" }}>🔊 읽기 이용 안내</p>
          <div style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: "#6d28d9", margin: "0 0 4px" }}>🔊 읽어주기 팁</p>
            <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.8 }}>카카오톡 안에서는 읽기 기능이 작동 안 해요.<br />오른쪽 맨밑에 점 세 개(⋮) 누르고<br />→ 다른 브라우저로 열기 누른 후 읽기 다시 누르세요.<br />화면이 꺼지면 끊길 수 있어요.<br />설정 → 화면 자동 꺼짐 시간을 늘리세요.</p>
          </div>
          <button onClick={() => setShowMobGuideModal(false)} style={{ width: "100%", padding: "12px 0", background: "#6d28d9", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>확인</button>
        </div>
      </div>
    )}

    {/* ── PC 읽기 안내 모달 ── */}
    {showGuideModal && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowGuideModal(false)}>
        <div style={{ background: "white", borderRadius: 20, padding: "24px 22px", maxWidth: 360, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
          <p style={{ fontSize: 15, fontWeight: 900, color: "#6d28d9", margin: "0 0 14px" }}>🔊 읽기 이용 안내</p>
          <div style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: "#6d28d9", margin: "0 0 4px" }}>🔊 읽어주기 팁</p>
            <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.8 }}>카카오톡 안에서는 읽기 기능이 작동 안 해요.<br />오른쪽 맨밑에 점 세 개(⋮) 누르고<br />→ 다른 브라우저로 열기 누른 후 읽기 다시 누르세요.<br />화면이 꺼지면 끊길 수 있어요.<br />설정 → 화면 자동 꺼짐 시간을 늘리세요.</p>
          </div>
          <button onClick={() => setShowGuideModal(false)} style={{ width: "100%", padding: "12px 0", background: "#6d28d9", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>확인</button>
        </div>
      </div>
    )}

    </>
  );
}
