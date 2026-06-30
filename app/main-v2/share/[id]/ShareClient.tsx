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
  tier?: string;
  birthYear?: string;
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
  const [saving, setSaving] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);
  const restartingRef = useRef(false);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const saveToHistory = () => {
    if (!entry || historySaved) return;
    try {
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      const histId = `share-${id}`;
      if (hist.some((h: any) => h.id === histId)) { setHistorySaved(true); return; }
      hist.unshift({
        id: histId, date: new Date().toISOString(), name: entry.name,
        category: entry.categories[0]?.label ?? "분석결과",
        scores: entry.scores ?? {}, isPaid: true, planType: "special",
        analysis: entry.categories.map(c => `${c.label}\n${c.text}`).join("\n\n"),
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
        alert("읽어주기가 끊겼어요. 화면이 자동으로 꺼지면서 끊기는 경우가 많아요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      };
      if (idx === chunks.length - 1) {
        utter.onend = () => { setSpeaking(false); readIdxRef.current = 0; readChunksRef.current = []; };
      }
      window.speechSynthesis.speak(utter);
    });
  };

  const toggleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("카카오톡 등 앱 안에서는 화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고 [다른 브라우저로 열기]를 선택한 다음 읽기를 누르면 읽어주기 기능이 작동합니다.\n\n그래도 안 되면, 점 세 개(⋮) 버튼을 누르고 [다른 앱으로 공유] → [Chrome]을 선택해서 들어간 다음 읽기를 눌러보세요.\n\n💡 읽는 중간에 화면이 꺼지면 끊길 수 있어요. 휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    // 읽기를 시작하기 전에, 화면이 자동으로 꺼지면 끊길 수 있다는 걸 미리 한 번
    // 안내함(끊긴 뒤에 알려주는 것보다 미리 설정해두게 하는 게 나음). 하루 한 번만
    // 화면 자동꺼짐 안내는 모바일에서만 의미가 있으므로 PC에서는 띄우지 않음
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const ttsTipKey = "share_tts_tip_shown_date";
    if (isMobileDevice && localStorage.getItem(ttsTipKey) !== new Date().toDateString()) {
      alert("💡 읽는 중간에 화면이 꺼지면 끊길 수 있어요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      localStorage.setItem(ttsTipKey, new Date().toDateString());
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
          <button onClick={() => router.push("/main-v2")} style={{ padding: "12px 28px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>
            🔮 내 운세 보러 가기
          </button>
        </div>
      </main>
    );
  }

  if (!entry) return null;

  return (
    <main ref={pageRef} style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      {/* 어디로 스크롤하든 항상 누를 수 있게 고정된 읽기 버튼 */}
      <div style={{ position: "fixed", right: 16, bottom: 24, zIndex: 200, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <button onClick={restartReadAloud} title="처음부터 다시 듣기" style={{ padding: "8px 12px", borderRadius: 50, border: "none", background: "rgba(139,92,246,0.15)", color: "#8b5cf6", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>↺ 처음부터 듣기</button>
        <button onClick={toggleReadAloud}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 50, border: "none", background: speaking ? "linear-gradient(135deg, #ef4444, #f97316)" : G, color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
          {speaking ? "⏹ 멈추기" : "🔊 읽어주기"}
        </button>
      </div>

      <header style={{ minHeight: 52, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", rowGap: 6, columnGap: 6, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)" }}>
        <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>{entry.businessName ? `🔮 ${entry.businessName}` : "🐱 점운"}</span>
        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
          <button onClick={toggleReadAloud} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            {speaking ? "⏸ 멈추기" : "🔊 읽기"}
          </button>
          <button onClick={restartReadAloud} title="처음부터 다시 듣기" style={{ padding: "5px 9px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>↺ 처음부터 듣기</button>
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* Q&A 버튼 */}
        {!entry.businessName && (
          <button onClick={() => {
            if (entry.name && entry.birthYear) {
              sessionStorage.setItem("v2_result", JSON.stringify({ profile: { name: entry.name, birthYear: Number(entry.birthYear) } }));
              sessionStorage.setItem("v2_plan", "select");
            }
            router.push("/main-v2/qa");
          }} style={{ width: "100%", marginBottom: 14, padding: "13px 0", background: "linear-gradient(135deg, #1a0635, #3b0764)", color: "white", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>
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
              <div style={{ padding: "0 18px 16px" }}>
                <div style={{ background: "#fdf2f8", borderRadius: 14, padding: "12px 14px", textAlign: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#ec4899", fontWeight: 700, lineHeight: 1.6 }}>🪬 내 성격과 재물 흐름, 더 자세히 알고 싶다면?</div>
                </div>
                <button onClick={() => router.push("/main-v2")} style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>
                  💎 9,900원 패키지로 전체 확인하기
                </button>
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

        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={toggleReadAloud} style={{ flex: 1, padding: "13px 0", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            {speaking ? "⏸ 멈추기" : "🔊 읽기"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={saveToHistory} disabled={historySaved} style={{ flex: 1, padding: "13px 0", background: historySaved ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" : "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: historySaved ? "#065f46" : "#4338ca", border: `1.5px solid ${historySaved ? "rgba(16,185,129,0.35)" : "rgba(99,102,241,0.35)"}`, borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: historySaved ? "default" : "pointer" }}>
            {historySaved ? "✅ 저장됨" : "📥 보관함 저장"}
          </button>
          <button onClick={() => router.push("/main-v2/history")} style={{ flex: 1, padding: "13px 0", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            📂 보관함 보기
          </button>
        </div>

        <div style={{ marginBottom: 10 }}>
          <button onClick={saveImage} disabled={saving} style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.3)", opacity: saving ? 0.7 : 1 }}>
            {saving ? "⏳ 저장 중..." : "🖼️ 이미지 저장"}
          </button>
        </div>

        {!entry.businessName && (
          <button onClick={() => router.push("/main-v2")} style={{ width: "100%", padding: "16px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
            📱 나도 무료로 사주 보기
          </button>
        )}

        <button onClick={() => router.push("/main-v2")} style={{ width: "100%", marginTop: 10, padding: "11px 0", background: "transparent", color: "#9ca3af", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
          🏠 홈으로
        </button>
      </div>
    </main>
  );
}
