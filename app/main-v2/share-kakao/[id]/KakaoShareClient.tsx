"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import KakaoShareCouponBanner from "@/app/main-v2/_components/KakaoShareCouponBanner";

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

function Bar({ label, score, color }: { label: string; score: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 300); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{score}점</span>
      </div>
      <div style={{ height: 7, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: G, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
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

export default function KakaoShareClient({ id }: { id: string }) {
  const router = useRouter();
  const [entry, setEntry] = useState<SharedEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [tipModal, setTipModal] = useState<{ text: string; onConfirm?: () => void } | null>(null);
  const [isMob, setIsMob] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);
  const restartingRef = useRef(false);

  useEffect(() => { setIsMob(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)); }, []);
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

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
      utter.onstart = () => { readIdxRef.current = idx; };
      utter.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") {
          if (!restartingRef.current) setSpeaking(false);
          return;
        }
        setSpeaking(false);
        readChunksRef.current = [];
        readIdxRef.current = 0;
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
    if (/KAKAOTALK|kakaoBrowser|KAKAO/i.test(navigator.userAgent)) {
      setTipModal({ text: "카카오톡에서 바로 읽기가 되지 않아요.\n\n화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고\n[다른 브라우저로 열기]를 선택한 다음\n🔊 읽기 버튼을 누르면 읽어주기가 작동해요." });
      return;
    }
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const ttsTipKey = "share_kakao_tts_tip_shown_date";
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

  useEffect(() => {
    fetch(`/api/v2/share?id=${encodeURIComponent(id)}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setEntry(data.entry))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#9ca3af", marginBottom: 16 }}>결과를 찾을 수 없어요.</p>
          <button onClick={() => router.push("/main-v2")} style={{ padding: "12px 28px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>
            🔮 내 운세 보러 가기
          </button>
        </div>
      </main>
    );
  }

  if (!entry) return null;

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      {tipModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setTipModal(null)}>
          <div style={{ background: "white", borderRadius: 20, padding: "28px 24px 20px", maxWidth: 340, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#333", margin: "0 0 16px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{tipModal.text}</p>
            <button onClick={() => { const cb = tipModal.onConfirm; setTipModal(null); if (cb) cb(); }} style={{ width: "100%", padding: "13px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer" }}>확인</button>
          </div>
        </div>
      )}

      {/* 스크롤해도 항상 보이는 고정 읽기 버튼 */}
      <div style={{ position: "fixed", right: 16, bottom: 80, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <button onClick={restartReadAloud} title="처음부터 다시 듣기" style={{ padding: "8px 12px", borderRadius: 50, border: "none", background: "rgba(139,92,246,0.15)", color: "#8b5cf6", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>↺ 처음부터 듣기</button>
        <button onClick={toggleReadAloud} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 50, border: "none", background: speaking ? "linear-gradient(135deg, #ef4444, #f97316)" : G, color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
          {speaking ? "⏹ 멈추기" : "🔊 읽어주기"}
        </button>
      </div>

      <header style={{ minHeight: 52, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)" }}>
        <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 {entry.businessName || "점운"}</span>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={toggleReadAloud} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            {speaking ? "⏸ 멈추기" : "🔊 읽기"}
          </button>
          <button onClick={restartReadAloud} title="처음부터 다시 듣기" style={{ padding: "5px 9px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>↺ 처음부터 듣기</button>
        </div>
      </header>

      {showGuideModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowGuideModal(false)}>
          <div style={{ background: "white", borderRadius: 20, padding: "20px 18px", maxWidth: 360, width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#dc2626", margin: "0 0 14px" }}>📌 결과지 맨 밑에 버튼을 꼭 확인하세요!</p>
            <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#dc2626", margin: "0 0 4px" }}>⚠️ 결과지를 나가면 내용이 모두 사라져요!</p>
              <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.7 }}>반드시 <strong>보관함 저장</strong><br />또는 <strong>공유하기</strong> 버튼을 눌러 저장해두세요.<br /><span style={{ color: "#dc2626", fontWeight: 700 }}>나가서 내용이 사라진 경우 환불은 불가합니다.</span></p>
            </div>
            <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#dc2626", margin: "0 0 4px" }}>⚠️ 전화번호 안 넣으면 결과 사라져요!</p>
              <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.7 }}>결제 시 전화번호 미입력하면<br />브라우저 닫는 순간 결과가 영구 삭제됩니다.<br />바로 <strong>보관함</strong>에 저장하세요.</p>
            </div>
            <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#dc2626", margin: "0 0 4px" }}>⚠️ 보관함은 이 기기·브라우저에서만 보여요!</p>
              <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.7 }}>다른 브라우저나 기기로 접속하면<br />보관함에 저장된 목록이 보이지 않아요.<br />결과는 반드시 <strong>공유하기</strong>로 따로 보관하세요.</p>
            </div>
            <div style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#6d28d9", margin: "0 0 4px" }}>🔊 읽어주기 팁</p>
              <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.8 }}>카카오톡에서는 읽기가 안 돼요.<br />⋮ → 다른 브라우저로 열기 → 🔊 읽기를 눌러요.<br />화면이 꺼지면 끊길 수 있어요.<br />설정 → 화면 자동 꺼짐 시간을 늘리세요.</p>
            </div>
            <button onClick={() => setShowGuideModal(false)} style={{ width: "100%", padding: "12px 0", background: "#dc2626", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>확인</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* 꼭읽어보세요 버튼 */}
        <button onClick={() => setShowGuideModal(true)} style={{ display: "block", width: "100%", padding: "13px 16px", marginBottom: 10, background: "#dc2626", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer", textAlign: "left", boxShadow: "0 2px 10px rgba(220,38,38,0.35)" }}>
          📌 꼭 읽어보세요 · 자세히 보기 →
        </button>

        {/* 쿠폰 배너 1 */}
        {!entry.businessName && <KakaoShareCouponBanner />}

        {/* 쿠폰 배너 2 */}
        {!entry.businessName && (
          <div onClick={() => router.push("/share-coupon")} style={{ marginBottom: 16, borderRadius: 16, overflow: "hidden", cursor: "pointer", border: "1.5px solid #fca5a5" }}>
            <div style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📸</span>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 13 }}>SNS에 글 올리면 990원 쿠폰 10장!</span>
            </div>
            <div style={{ background: "#fef2f2", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: 11, color: "#dc2626", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>소개·추천 글 1,000자 이상 + 사진 3장<br />쿠폰 10장 + 꿈해몽 24시간 무료 🎁</p>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#fff", background: "#dc2626", padding: "5px 12px", borderRadius: 20, whiteSpace: "nowrap", marginLeft: 8 }}>받기 →</span>
            </div>
          </div>
        )}

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
        </div>

        {/* 분야별 점수 막대 */}
        {entry.scores && (
          <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, padding: "18px 18px 8px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>📊 분야별 운세 점수</div>
            {[
              { label: "🌟 오늘의 운세", key: "total",   color: "#f59e0b" },
              { label: "💰 재물운",      key: "wealth",  color: "#f59e0b" },
              { label: "💕 연애운",      key: "love",    color: "#ec4899" },
              { label: "💪 건강운",      key: "health",  color: "#10b981" },
              { label: "🎯 성공운",      key: "success", color: "#8b5cf6" },
              { label: "✨ 총운",        key: "total",   color: "#6366f1" },
            ].filter(b => (entry.scores as any)[b.key] != null).map(b => (
              <Bar key={b.label} label={b.label} score={(entry.scores as any)[b.key]} color={b.color} />
            ))}
          </div>
        )}

        {/* 사주팔자 맛보기 */}
        {entry.birthYear && (() => {
          const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
          const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
          const ohEmoji: Record<string,string> = { "목":"🌳","화":"🔥","토":"⛰️","금":"⚪","수":"💧" };
          const ohHanja: Record<string,string> = { "목":"木","화":"火","토":"土","금":"金","수":"水" };
          const y = Number(entry.birthYear);
          const z = zodiacList[((y - 4) % 12 + 12) % 12];
          const oh = ohArr[((y - 4) % 10 + 10) % 10];
          return (
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ background: G, color: "white", padding: "10px 16px", fontSize: 13, fontWeight: 900 }}>🔮 {entry.name}님의 사주팔자 맛보기</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "14px 16px" }}>
                <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 3 }}>🐉</div>
                  <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>띠</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{z}띠</div>
                </div>
                <div style={{ background: BG, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 3 }}>{ohEmoji[oh]}</div>
                  <div style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>오행</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{oh}({ohHanja[oh]})</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 카테고리별 카드 */}
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

        {/* 나도 무료 사주 받아보기 버튼 */}
        {!entry.businessName && (
          <button onClick={() => window.open("/main-v2", "_blank")}
            style={{ width: "100%", padding: "16px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
            🔮 나도 무료 사주 받아보기
          </button>
        )}

      </div>
    </main>
  );
}
