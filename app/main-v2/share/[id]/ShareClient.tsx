"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

interface SharedCategory {
  icon: string;
  label: string;
  color: string;
  text: string;
  badge?: string;
}

interface SharedEntry {
  name: string;
  scores?: { total?: number; wealth?: number; love?: number; health?: number; success?: number };
  luckyColor?: string;
  luckyNumber?: number;
  luckyDirection?: string;
  categories: SharedCategory[];
  businessName?: string;
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

export default function ShareClient({ id }: { id: string }) {
  const router = useRouter();
  const [entry, setEntry] = useState<SharedEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);

  useEffect(() => {
    fetch(`/api/v2/share?id=${encodeURIComponent(id)}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setEntry(data.entry))
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
      utter.onerror = () => {
        setSpeaking(false);
        alert("이 기기에서는 읽어주기가 원활하지 않아요.\n휴대폰 설정에서 음성 합성(텍스트 읽어주기) 기능과 한국어 음성이 설치되어 있는지 확인해주세요.");
      };
      if (idx === chunks.length - 1) {
        utter.onend = () => { setSpeaking(false); readIdxRef.current = 0; readChunksRef.current = []; };
      }
      window.speechSynthesis.speak(utter);
    });
  };

  const toggleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("카카오톡 등 앱 안에서는 화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고 [다른 브라우저로 열기]를 선택한 다음 읽기를 누르면 읽어주기 기능이 작동합니다.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
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
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)" }}>
        <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{entry.businessName ? `🔮 ${entry.businessName}` : "🐱 점운"}</span>
        <button onClick={toggleReadAloud} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
          {speaking ? "⏸ 멈추기" : "🔊 읽기"}
        </button>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>
        {/* 점수 요약 카드 */}
        <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
          <div style={{ background: "#eab308", color: "#3a2a00", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
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

        {/* 카테고리별 카드 — 결과 페이지와 똑같이 아이콘/색으로 구분 */}
        {entry.categories.map((cat, i) => (
          <div key={i} style={cat.badge
            ? { background: "#fdf6e3", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }
            : { background: "white", borderRadius: 24, border: `1.5px solid ${cat.color}44`, marginBottom: 12 }}>
            <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: cat.badge ? "1px solid rgba(217,180,80,0.18)" : "1px solid rgba(236,72,153,0.07)", background: cat.badge ? "linear-gradient(90deg, rgba(217,180,80,0.10), transparent)" : "transparent" }}>
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{cat.label}</span>
              {cat.badge && (
                <span style={{ fontSize: 10, background: "linear-gradient(135deg, #c026d3, #9333ea)", color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>{cat.badge}</span>
              )}
            </div>
            <div style={{ padding: "14px 18px 20px" }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                {cat.text}
              </p>
            </div>
          </div>
        ))}

        <button onClick={toggleReadAloud} style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", marginBottom: 10 }}>
          {speaking ? "⏸ 멈추기" : "🔊 읽기"}
        </button>

        <button onClick={() => router.push("/main-v2")} style={{ width: "100%", padding: "16px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
          📱 나도 무료로 사주 보기
        </button>
      </div>
    </main>
  );
}
