"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

const UNSEONG_EMOJI: Record<string, string> = {
  "장생": "🌱", "목욕": "💧", "관대": "👑", "건록": "⚡", "제왕": "🔥",
  "쇠": "🍂", "병": "🌫️", "사": "💀", "묘": "🌙", "절": "❄️", "태": "🥚", "양": "🌿",
};

interface DaeunBlock {
  gan: string; ji: string; ganHanja: string; jiHanja: string;
  startAge: number; endAge: number; unseong: string; chapter: string;
  cheonganTitle?: string;
  cheonganEnergy?: string; cheonganWealth?: string; cheonganCareer?: string;
  cheonganRelationship?: string; cheonganAdvice?: string;
  mental?: string; relationship?: string; reality?: string; action?: string;
}

export default function DaewoonPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [daeunList, setDaeunList] = useState<DaeunBlock[]>([]);
  const [daeunSu, setDaeunSu] = useState(0);
  const [isForward, setIsForward] = useState(true);
  const [teaserText, setTeaserText] = useState("");
  const [paid, setPaid] = useState(false);
  const [paidCount, setPaidCount] = useState(0);
  const [selectCount, setSelectCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentAge, setCurrentAge] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);
  const restartingRef = useRef(false);
  const resumeAfterHideRef = useRef<() => void>(() => {});
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = async () => {
    try { if ("wakeLock" in navigator) wakeLockRef.current = await (navigator as any).wakeLock.request("screen"); } catch {}
  };
  const releaseWakeLock = () => {
    try { wakeLockRef.current?.release(); } catch {}
    wakeLockRef.current = null;
  };

  // 페이지 벗어날 때 TTS 정지
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      releaseWakeLock();
    };
  }, []);

  // 화면 꺼졌다 켜질 때 이어읽기
  useEffect(() => {
    const handleVisibility = () => { if (document.visibilityState === "visible") resumeAfterHideRef.current(); };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) { router.push("/main-v2"); return; }
    const p = JSON.parse(saved);
    setProfile(p);
    const age = new Date().getFullYear() - parseInt(p.birthYear) + 1;
    setCurrentAge(age);
    const isPaid = sessionStorage.getItem("daeunPaid") === "1";
    const storedCount = parseInt(sessionStorage.getItem("daeunPaidCount") || "1");
    setPaid(isPaid);
    setPaidCount(isPaid ? storedCount : 0);
    const birth = `${p.birthYear}-${String(p.birthMonth).padStart(2, "0")}-${String(p.birthDay).padStart(2, "0")}`;
    fetchDaeun(p.name, birth, p.gender || "여", p.birthHour || "unknown", isPaid);
  }, []);

  useEffect(() => {
    if (daeunList.length > 0 && selectedIdx === -1) {
      const idx = daeunList.findIndex(b => currentAge >= b.startAge && currentAge <= b.endAge);
      setSelectedIdx(idx >= 0 ? idx : 0);
    }
  }, [daeunList, currentAge, selectedIdx]);

  // 대운 블록 바뀌면 TTS 초기화
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
    readChunksRef.current = [];
    readIdxRef.current = 0;
  }, [selectedIdx]);

  const fetchDaeun = async (name: string, birth: string, gender: string, birthHour: string, isPaid: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth, birthHour, gender, category: "대운", planType: "daeun", daeunPaid: isPaid }),
      });
      const data = await res.json();
      setDaeunList(data.daeunList ?? []);
      setDaeunSu(data.daeunSu ?? 0);
      setIsForward(data.isForward ?? true);
      setTeaserText(data.analysis ?? "");
    } catch { } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    const price = 3900 + (selectCount - 1) * 1000;
    router.push(`/payment-complete?daeun=1&paid=${price}&daeunCount=${selectCount}`);
  };

  const buildCategories = (b: DaeunBlock) => [
    b.cheonganTitle && b.cheonganEnergy ? { icon: "✨", label: b.cheonganTitle, color: "#fbbf24", text: b.cheonganEnergy, badge: "🌌 대운" } : null,
    b.mental ? { icon: "🧠", label: "멘탈", color: "#8b5cf6", text: b.mental, badge: "🌌 대운" } : null,
    b.cheonganWealth ? { icon: "💰", label: "재물·돈의 흐름", color: "#f59e0b", text: b.cheonganWealth, badge: "🌌 대운" } : null,
    b.cheonganCareer ? { icon: "💼", label: "직업·커리어", color: "#6366f1", text: b.cheonganCareer, badge: "🌌 대운" } : null,
    (b.relationship || b.cheonganRelationship) ? { icon: "🤝", label: "인간관계", color: "#ec4899", text: [b.relationship, b.cheonganRelationship].filter(Boolean).join("\n"), badge: "🌌 대운" } : null,
    b.reality ? { icon: "⚖️", label: "현실", color: "#10b981", text: b.reality, badge: "🌌 대운" } : null,
    (b.action || b.cheonganAdvice) ? { icon: "🧭", label: "이 10년을 내 편으로", color: "#f59e0b", text: [b.action, b.cheonganAdvice].filter(Boolean).join("\n"), badge: "🌌 대운" } : null,
  ].filter(Boolean) as { icon: string; label: string; color: string; text: string; badge?: string }[];

  // ── TTS ──
  const getKoreanVoice = (): Promise<SpeechSynthesisVoice | null> =>
    new Promise(resolve => {
      const pick = (list: SpeechSynthesisVoice[]) => list.find(v => v.lang?.toLowerCase().startsWith("ko")) || null;
      const existing = window.speechSynthesis.getVoices();
      if (existing.length > 0) { resolve(pick(existing)); return; }
      const timer = setTimeout(() => resolve(pick(window.speechSynthesis.getVoices())), 1000);
      window.speechSynthesis.onvoiceschanged = () => { clearTimeout(timer); resolve(pick(window.speechSynthesis.getVoices())); };
    });

  const ttsKey = (b: DaeunBlock | null) => `v2_tts_daeun_${profile?.name ?? ""}_${b?.startAge ?? ""}_${b?.endAge ?? ""}`;

  const speakFrom = async (chunks: string[], startIdx: number, key: string) => {
    const voice = await getKoreanVoice();
    chunks.slice(startIdx).forEach((chunk, i) => {
      const idx = startIdx + i;
      const utter = new SpeechSynthesisUtterance(chunk);
      utter.lang = "ko-KR";
      if (voice) utter.voice = voice;
      utter.rate = 1;
      utter.onstart = () => {
        readIdxRef.current = idx;
        try { localStorage.setItem(key, JSON.stringify({ chunks, idx })); } catch {}
      };
      utter.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") {
          if (!restartingRef.current) setSpeaking(false);
          return;
        }
        setSpeaking(false);
        readChunksRef.current = [];
        readIdxRef.current = 0;
        window.speechSynthesis.cancel();
        releaseWakeLock();
        alert("읽어주기가 끊겼어요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      };
      if (idx === chunks.length - 1) {
        utter.onend = () => {
          setSpeaking(false);
          readIdxRef.current = 0;
          readChunksRef.current = [];
          try { localStorage.removeItem(key); } catch {}
          releaseWakeLock();
        };
      }
      window.speechSynthesis.speak(utter);
    });
  };

  resumeAfterHideRef.current = () => {
    if (speaking && readChunksRef.current.length > 0 && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      requestWakeLock();
      const b = daeunList[selectedIdx] ?? null;
      speakFrom(readChunksRef.current, readIdxRef.current, ttsKey(b));
    }
  };

  const buildReadText = (b: DaeunBlock) => {
    const parts = [
      b.cheonganTitle && b.cheonganEnergy ? `${b.cheonganTitle}. ${b.cheonganEnergy}` : "",
      b.mental ? `멘탈. ${b.mental}` : "",
      b.cheonganWealth ? `재물과 돈의 흐름. ${b.cheonganWealth}` : "",
      b.cheonganCareer ? `직업과 커리어. ${b.cheonganCareer}` : "",
      b.relationship ? `인간관계. ${b.relationship}` : "",
      b.cheonganRelationship || "",
      b.reality ? `현실. ${b.reality}` : "",
      b.action ? `이 10년을 내 편으로. ${b.action}` : "",
      b.cheonganAdvice || "",
    ].filter(Boolean).join("\n");
    return parts
      .replace(/(\d+)\s*~\s*(\d+)\s*(시|월|일|년|세)/g, "$1$3에서 $2$3")
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, "")
      .replace(/[（(][一-鿿]+[）)]/g, "")
      .replace(/[一-鿿]+[（(]([가-힣]+)[）)]/g, "$1");
  };

  const toggleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("카카오톡 등 앱 안에서는 오른쪽 아래 점 세 개(⋮) → [다른 브라우저로 열기]를 선택한 다음 읽기를 눌러주세요.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      releaseWakeLock();
      return;
    }
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const ttsTipKey = "v2_tts_tip_shown_date";
    if (isMobile && localStorage.getItem(ttsTipKey) !== new Date().toDateString()) {
      alert("💡 읽는 중간에 화면이 꺼지면 끊길 수 있어요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      localStorage.setItem(ttsTipKey, new Date().toDateString());
    }
    const b = daeunList[selectedIdx];
    if (!b) return;
    const key = ttsKey(b);
    if (readChunksRef.current.length === 0) {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const { chunks, idx } = JSON.parse(saved);
          if (Array.isArray(chunks) && chunks.length > 0) {
            readChunksRef.current = chunks;
            readIdxRef.current = idx;
          }
        }
      } catch {}
    }
    if (readChunksRef.current.length === 0) {
      const fullText = buildReadText(b);
      if (!fullText.trim()) return;
      readChunksRef.current = fullText.split(/(?<=[.!?。\n])\s*/).map(s => s.trim()).filter(Boolean);
      readIdxRef.current = 0;
    }
    window.speechSynthesis.cancel();
    requestWakeLock();
    speakFrom(readChunksRef.current, readIdxRef.current, key);
    setSpeaking(true);
  };

  const restartReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const b = daeunList[selectedIdx];
    if (!b) return;
    const key = ttsKey(b);
    restartingRef.current = true;
    window.speechSynthesis.cancel();
    try { localStorage.removeItem(key); } catch {}
    const fullText = buildReadText(b);
    if (!fullText.trim()) return;
    readChunksRef.current = fullText.split(/(?<=[.!?。\n])\s*/).map(s => s.trim()).filter(Boolean);
    readIdxRef.current = 0;
    requestWakeLock();
    speakFrom(readChunksRef.current, 0, key);
    setSpeaking(true);
    setTimeout(() => { restartingRef.current = false; }, 300);
  };

  // ── 이미지 저장 ──
  const saveImage = async () => {
    if (saving || !cardRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = cardRef.current;
      const prevOv = el.style.overflow;
      el.style.overflow = "visible";
      el.style.maxHeight = "none";
      await document.fonts.ready;
      const isMobile = window.innerWidth < 768;
      const canvas = await html2canvas(el, {
        backgroundColor: "#0f0620", scale: isMobile ? 2 : 2.5,
        useCORS: true, allowTaint: true, logging: false,
        height: el.scrollHeight, windowWidth: isMobile ? window.innerWidth : 480, windowHeight: el.scrollHeight,
      });
      el.style.overflow = prevOv;
      const b = daeunList[selectedIdx];
      const link = document.createElement("a");
      link.download = `점운_${profile?.name ?? "운세"}_대운_${b ? `${b.ganHanja}${b.jiHanja}` : ""}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
    } finally {
      setSaving(false);
    }
  };

  // ── 공유 ──
  const shareResult = async () => {
    if (sharing || !selectedBlock) return;
    setSharing(true);
    let url = window.location.origin + "/main-v2";
    try {
      const categories = buildCategories(selectedBlock);
      if (categories.length > 0) {
        const res = await fetch("/api/v2/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: profile?.name, categories, tier: "daeun", birthYear: profile?.birthYear }),
        });
        if (res.ok) { const data = await res.json(); url = `${window.location.origin}/main-v2/share/${data.id}`; }
      }
    } catch { }
    const b = selectedBlock;
    const title = `🌌 ${profile?.name}님의 대운 해설`;
    const desc = `${b.ganHanja}${b.jiHanja} (${b.startAge}~${b.endAge}세) · ${b.chapter}`;
    const kakao = (window as any).Kakao;
    if (kakao && kakao.isInitialized()) {
      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title, description: `${desc} | 점운 AI사주`,
          imageUrl: "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg",
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          { title: "내 대운 결과 보기", link: { mobileWebUrl: url, webUrl: url } },
          { title: "나도 대운 보기", link: { mobileWebUrl: "https://jeomun.com/main-v2", webUrl: "https://jeomun.com/main-v2" } },
        ],
      });
    } else {
      const text = `${title}\n${desc}\n\n📱 나도 무료로! jeomun.com`;
      if (navigator.share) navigator.share({ title: "점운 대운 해설", text, url }).catch(() => {});
      else navigator.clipboard.writeText(`${text}\n${url}`).then(() => alert("✅ 링크 복사됨!"));
    }
    setSharing(false);
  };

  // ── 보관함 ──
  const saveToHistory = () => {
    if (!profile || !selectedBlock) return;
    try {
      const b = selectedBlock;
      const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
      const id = `daeun-${profile.name}-${b.startAge}-${b.endAge}`;
      if (!hist.some((h: any) => h.id === id)) {
        hist.unshift({
          id, date: new Date().toISOString(),
          name: profile.name,
          category: `🌌 대운 ${b.ganHanja}${b.jiHanja} (${b.startAge}~${b.endAge}세)`,
          analysis: buildCategories(b).map(c => `${c.icon} ${c.label}\n${c.text}`).join("\n\n"),
          isPaid: true, planType: "daeun", birthYear: profile.birthYear ?? "",
        });
        localStorage.setItem("v2_history", JSON.stringify(hist.slice(0, 50)));
      }
      setHistorySaved(true);
    } catch { }
  };

  const currentIndex = daeunList.findIndex(b => currentAge >= b.startAge && currentAge <= b.endAge);
  const isBlockLocked = (i: number) => { const r = i - currentIndex; return !paid || (r > 0 && r >= paidCount); };
  const selectedBlock = selectedIdx >= 0 ? daeunList[selectedIdx] : null;
  const selectedLocked = selectedIdx >= 0 ? isBlockLocked(selectedIdx) : true;
  const isSelectedCurrent = selectedIdx === currentIndex;

  return (
    <>
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" strategy="lazyOnload"
        onLoad={() => { const k = (window as any).Kakao; if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); }} />

      <main style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0f0620 0%,#1a0535 40%,#0a0420 100%)", color: "white", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 16px 60px" }}>

          {/* 헤더 */}
          <div style={{ marginBottom: 24 }}>
            <button onClick={() => router.push("/main-v2")} style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.6)", color: "#fbbf24", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>🌌</div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fbbf24", margin: "0 0 6px" }}>대운(大運)</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>10년마다 바뀌는 나의 인생 큰 챕터</p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.6)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🌙</div>
              <p>대운을 계산하는 중...</p>
            </div>
          ) : (
            <>
              {/* 기본 정보 */}
              {profile && (
                <div style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 14, padding: "16px", marginBottom: 20, textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "0 0 4px" }}>
                    {profile.name}님의 대운 · {isForward ? "순행(順行)" : "역행(逆行)"} · 첫 대운 {daeunSu}세
                  </p>
                  <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, margin: 0 }}>
                    현재 {currentAge}세 · {daeunList[currentIndex]
                      ? `${daeunList[currentIndex].startAge}~${daeunList[currentIndex].endAge}세 ${daeunList[currentIndex].gan}${daeunList[currentIndex].ji} 대운`
                      : "대운 계산 중"}
                  </p>
                </div>
              )}

              {/* 타임라인 */}
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", margin: "0 0 10px" }}>
                  📅 보고싶은 대운을 탭해서 선택하세요
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {daeunList.map((b, i) => {
                    const isCurrent = currentAge >= b.startAge && currentAge <= b.endAge;
                    const isPast = currentAge > b.endAge;
                    const locked = isBlockLocked(i);
                    const isSelected = selectedIdx === i;
                    return (
                      <div key={i} onClick={() => { setSelectedIdx(i); setHistorySaved(false); }}
                        style={{
                          background: isSelected
                            ? (isCurrent ? "linear-gradient(135deg,rgba(251,191,36,0.28),rgba(245,158,11,0.18))" : "rgba(139,92,246,0.28)")
                            : (isCurrent ? "linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.05))" : isPast ? "rgba(255,255,255,0.04)" : "rgba(139,92,246,0.06)"),
                          border: isSelected
                            ? (isCurrent ? "2px solid rgba(251,191,36,0.95)" : "2px solid rgba(139,92,246,0.85)")
                            : (isCurrent ? "1.5px solid rgba(251,191,36,0.4)" : "1px solid rgba(255,255,255,0.08)"),
                          borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s ease",
                        }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16, minWidth: 20, textAlign: "center" }}>
                            {isCurrent ? "🌕" : isPast ? "🌑" : locked ? "🔒" : "🌙"}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                              <span style={{ fontSize: 16, fontWeight: 900, color: isCurrent ? "#fbbf24" : locked ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.75)" }}>
                                {b.ganHanja}{b.jiHanja}
                              </span>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{b.startAge}~{b.endAge}세</span>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{UNSEONG_EMOJI[b.unseong]} {b.unseong}</span>
                            </div>
                            <p style={{ fontSize: 12, color: locked ? "rgba(255,255,255,0.2)" : (isCurrent ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.45)"), margin: "2px 0 0", filter: locked ? "blur(4px)" : "none" }}>
                              {b.chapter}
                            </p>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? (isCurrent ? "#fbbf24" : "#a78bfa") : "rgba(255,255,255,0.25)", minWidth: 40, textAlign: "right" }}>
                            {isSelected ? "▶ 선택됨" : "탭 →"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 선택된 대운 상세 */}
              {selectedBlock && (
                <div style={{ marginBottom: 24 }}>
                  {selectedLocked ? (
                    /* 결제 유도 */
                    <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(109,40,217,0.15))", border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 18, padding: "24px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>🔓</div>
                      <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 6px" }}>대운 해설 보기</h3>
                      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "0 0 4px" }}>
                        {selectedBlock.ganHanja}{selectedBlock.jiHanja} · {selectedBlock.startAge}~{selectedBlock.endAge}세
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.6, margin: "0 0 20px" }}>
                        {paid ? "이 대운은 구매 범위에 포함되지 않아요" : "현재 대운 기본 ₩3,900 · 추가 10년마다 +₩1,000"}
                      </p>
                      <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "0 0 10px" }}>몇 개 대운을 열람할까요?</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                          <button onClick={() => setSelectCount(c => Math.max(1, c - 1))} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(139,92,246,0.4)", border: "1px solid rgba(139,92,246,0.7)", color: "white", fontSize: 18, fontWeight: 900, cursor: "pointer", lineHeight: 1 }}>−</button>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ color: "#fbbf24", fontSize: 24, fontWeight: 900 }}>{selectCount}개</div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{selectCount === 1 ? "현재 대운만" : `현재 + 미래 ${selectCount - 1}개`}</div>
                          </div>
                          <button onClick={() => setSelectCount(c => Math.min(daeunList.length, c + 1))} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(139,92,246,0.4)", border: "1px solid rgba(139,92,246,0.7)", color: "white", fontSize: 18, fontWeight: 900, cursor: "pointer", lineHeight: 1 }}>+</button>
                        </div>
                      </div>
                      <div style={{ color: "#fbbf24", fontSize: 30, fontWeight: 900, marginBottom: 4 }}>₩{(3900 + (selectCount - 1) * 1000).toLocaleString()}</div>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "0 0 16px" }}>기본 ₩3,900{selectCount > 1 ? ` + 추가 ${selectCount - 1}개 × ₩1,000` : ""}</p>
                      <button onClick={handlePay} style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#1a0f2e", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 900, cursor: "pointer", width: "100%", boxShadow: "0 4px 20px rgba(251,191,36,0.35)" }}>
                        🌌 대운 {selectCount}개 해설 보기
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* TTS 버튼 (상단) */}
                      {selectedBlock.mental && (
                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                          <button onClick={restartReadAloud}
                            style={{ padding: "8px 14px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "rgba(255,255,255,0.7)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                            ↺ 처음부터
                          </button>
                          <button onClick={toggleReadAloud}
                            style={{ flex: 1, padding: "8px 0", background: speaking ? "rgba(239,68,68,0.2)" : "rgba(139,92,246,0.2)", border: speaking ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(139,92,246,0.4)", color: speaking ? "#f87171" : "rgba(255,255,255,0.8)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                            {speaking ? "⏹️ 멈추기" : "🔊 읽기 / 이어듣기"}
                          </button>
                        </div>
                      )}

                      {/* 결과 카드 */}
                      <div ref={cardRef} style={{
                        background: isSelectedCurrent ? "linear-gradient(135deg,rgba(251,191,36,0.15),rgba(245,158,11,0.08))" : "rgba(139,92,246,0.12)",
                        border: isSelectedCurrent ? "2px solid rgba(251,191,36,0.65)" : "1.5px solid rgba(139,92,246,0.45)",
                        borderRadius: 16, padding: "20px",
                        boxShadow: isSelectedCurrent ? "0 4px 24px rgba(251,191,36,0.15)" : "0 4px 16px rgba(139,92,246,0.15)",
                      }}>
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            {isSelectedCurrent && <span style={{ background: "#fbbf24", color: "#1a0f2e", fontSize: 11, fontWeight: 900, padding: "3px 8px", borderRadius: 20 }}>🌕 지금 내 대운</span>}
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{selectedBlock.startAge}~{selectedBlock.endAge}세</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 28, fontWeight: 900, color: isSelectedCurrent ? "#fbbf24" : "rgba(255,255,255,0.92)" }}>{selectedBlock.ganHanja}{selectedBlock.jiHanja}</span>
                            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>({selectedBlock.gan}{selectedBlock.ji})</span>
                            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{UNSEONG_EMOJI[selectedBlock.unseong]} {selectedBlock.unseong}</span>
                          </div>
                          <p style={{ color: isSelectedCurrent ? "#fbbf24" : "rgba(255,255,255,0.75)", fontSize: 15, fontWeight: 700, margin: 0 }}>「{selectedBlock.chapter}」</p>
                        </div>

                        {selectedBlock.mental ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {selectedBlock.cheonganEnergy && (
                              <div style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "12px 14px" }}>
                                <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, margin: "0 0 6px" }}>✨ {selectedBlock.cheonganTitle}</p>
                                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>{selectedBlock.cheonganEnergy}</p>
                              </div>
                            )}
                            {[
                              { label: "🧠 멘탈", text: selectedBlock.mental },
                              { label: "💰 재물·돈의 흐름", text: selectedBlock.cheonganWealth },
                              { label: "💼 직업·커리어", text: selectedBlock.cheonganCareer },
                              { label: "🤝 인간관계", text: [selectedBlock.relationship, selectedBlock.cheonganRelationship].filter(Boolean).join("\n") },
                              { label: "⚖️ 현실", text: selectedBlock.reality },
                              { label: "🧭 이 10년을 내 편으로", text: [selectedBlock.action, selectedBlock.cheonganAdvice].filter(Boolean).join("\n") },
                            ].filter(s => s.text).map(s => (
                              <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 12px" }}>
                                <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>{s.label}</p>
                                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{s.text}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }}>{teaserText}</p>
                        )}
                      </div>

                      {/* 액션 버튼 3개 */}
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button onClick={shareResult} disabled={sharing}
                          style={{ flex: 1, padding: "12px 0", background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#1a0f2e", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: sharing ? "not-allowed" : "pointer" }}>
                          {sharing ? "⏳..." : "📤 공유하기"}
                        </button>
                        <button onClick={saveImage} disabled={saving}
                          style={{ flex: 1, padding: "12px 0", background: "rgba(139,92,246,0.3)", border: "1px solid rgba(139,92,246,0.5)", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer" }}>
                          {saving ? "⏳..." : "🖼️ 이미지 저장"}
                        </button>
                        <button onClick={() => { saveToHistory(); router.push("/main-v2/history"); }}
                          style={{ flex: 1, padding: "12px 0", background: historySaved ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.07)", border: historySaved ? "1px solid rgba(251,191,36,0.4)" : "1px solid rgba(255,255,255,0.12)", color: historySaved ? "#fbbf24" : "rgba(255,255,255,0.6)", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          📚 보관함
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {paid && (
                <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                  ✨ 구매한 대운이 해금되었습니다
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
