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
}

interface SharedEntry {
  name: string;
  scores?: { total?: number; wealth?: number; love?: number; health?: number; success?: number };
  luckyColor?: string;
  luckyNumber?: number;
  luckyDirection?: string;
  categories: SharedCategory[];
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

  const speakFrom = (chunks: string[], startIdx: number) => {
    chunks.slice(startIdx).forEach((chunk, i) => {
      const idx = startIdx + i;
      const utter = new SpeechSynthesisUtterance(chunk);
      utter.lang = "ko-KR";
      utter.rate = 1;
      utter.onstart = () => { readIdxRef.current = idx; };
      if (idx === chunks.length - 1) {
        utter.onend = () => { setSpeaking(false); readIdxRef.current = 0; readChunksRef.current = []; };
      }
      window.speechSynthesis.speak(utter);
    });
  };

  const toggleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("이 브라우저는 읽어주기 기능을 지원하지 않습니다.\n\n카카오톡 등 앱 안에서 들어오셨다면, 화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고 [다른 브라우저로 열기]를 선택한 다음 다시 시도해보세요.\n\n또는 사파리/크롬 앱을 직접 열어서 주소를 입력해 들어가셔도 됩니다.");
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
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE0F}]/gu, "")
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
        <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
        <button onClick={toggleReadAloud} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
          {speaking ? "⏸ 멈추기" : "🔊 읽기"}
        </button>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>
        {/* 점수 요약 카드 */}
        <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
          <div style={{ background: "#eab308", color: "#3a2a00", textAlign: "center", padding: "18px 20px" }}>
            <p style={{ fontSize: 14, fontWeight: 900, margin: "0 0 6px", opacity: 0.9 }}>🔮 점운 · AI 사주 분석</p>
            <h1 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 10px" }}>{entry.name}님의 운세 분석</h1>
            {typeof entry.scores?.total === "number" && (
              <p style={{ fontSize: 30, fontWeight: 900, margin: 0 }}>{entry.scores.total}<span style={{ fontSize: 13, opacity: 0.8 }}>점</span></p>
            )}
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

        {/* 카테고리별 카드 — 결과 페이지와 똑같이 아이콘/색으로 구분 */}
        {entry.categories.map((cat, i) => (
          <div key={i} style={{ background: "white", borderRadius: 24, border: `1.5px solid ${cat.color}44`, marginBottom: 12 }}>
            <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(236,72,153,0.07)" }}>
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{cat.label}</span>
            </div>
            <div style={{ padding: "14px 18px 20px" }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                {cat.text}
              </p>
            </div>
          </div>
        ))}

        <button onClick={() => router.push("/main-v2")} style={{ width: "100%", padding: "16px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)", marginTop: 8 }}>
          📱 나도 무료로 사주 보기
        </button>
      </div>
    </main>
  );
}
