"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  return (
    <Suspense fallback={null}>
      <PartnerAnalysisResultInner />
    </Suspense>
  );
}

function PartnerAnalysisResultInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [packageType, setPackageType] = useState("");
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [partnerTier, setPartnerTier] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);
  // 화면이 꺼졌다 켜질 때 음성 재생만 조용히 끊기는 경우를 위한 자동 이어읽기용
  const resumeAfterHideRef = useRef<() => void>(() => {});
  // 가만히 듣기만 하면 화면이 자동으로 꺼지면서 읽기가 끊기는 경우가 많았음 —
  // 읽는 동안에는 화면이 저절로 꺼지지 않게 잠가둠(지원 안 하면 조용히 무시됨)
  const wakeLockRef = useRef<any>(null);
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
    } catch {}
  };
  const releaseWakeLock = () => {
    try { wakeLockRef.current?.release(); } catch {}
    wakeLockRef.current = null;
  };

  useEffect(() => {
    const result = sessionStorage.getItem("analysisResult");
    const name = sessionStorage.getItem("analysisName");
    const pkg = sessionStorage.getItem("selectedPackage");

    if (!result) {
      // 다른 휴대폰/브라우저라서 임시 저장소가 비어있는 경우 — 파트너 전용
      // 화면(로그인 필요)으로 돌려보내면 고객이 그 화면을 보게 될 수 있어서,
      // 공유 id(sid)가 같이 와있다면 누구나 볼 수 있는 공개 결과 페이지로 대신 보냄
      const sid = searchParams.get("sid");
      if (sid) { router.replace(`/main-v2/share/${sid}`); return; }
      router.push("/partner/create-analysis");
      return;
    }

    const parsed = JSON.parse(result);
    setAnalysisResults(parsed);
    setCustomerName(name || "고객");
    setPackageType(pkg || "기본 분석");
    setBirthYear(sessionStorage.getItem("analysisBirthYear") || "");
    // 결과지에 점운 대신 표시할 파트너 상호명
    const biz = localStorage.getItem("partnerBusinessName") || "";
    setBusinessName(biz);
    // 무료 등급은 이미지를 직접 다운로드해서 전달하고, 실버 등급 이상부터
    // 공유 링크(자동 발송 대체 편의 기능)를 쓸 수 있게 등급 차이를 유지함
    setPartnerTier(localStorage.getItem("partnerTier") || "free");

    // 결과를 보는 즉시 서버에도 자동 저장 — 파트너가 다른 휴대폰/브라우저로
    // 열어도(예: 카카오톡 다른 브라우저로 열기) 다시 분석하지 않고 그대로
    // 이어서 보고 읽을 수 있게 함. 실패해도 화면은 그대로 보이므로 조용히 무시.
    // 무료 등급은 건너뜀 — 이 링크가 주소창(sid 파라미터)에 그대로 남아서,
    // 공유 버튼이 막혀있어도 주소창을 복사해 보내면 똑같이 공유가 되는
    // 빠져나갈 구멍이 있었음(공유 버튼을 막아둔 의도와 어긋남)
    if ((localStorage.getItem("partnerTier") || "free") === "free") return;
    (async () => {
      try {
        const shareCats = (PACKAGE_CATS[pkg || "기본 분석"] ?? PACKAGE_CATS["기본 분석"]).filter(c => parsed[c.key]);
        const categories = shareCats.map(c => ({ icon: c.icon, label: c.label, color: "#9333ea", text: parsed[c.key], badge: "📦 패키지" }));
        if (categories.length === 0) return;
        const res = await fetch("/api/v2/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name || "고객", scores: parsed.scores, luckyColor: parsed.luckyColor, luckyNumber: parsed.luckyNumber, luckyDirection: parsed.luckyDirection, categories, businessName: biz, tier: "package", birthYear: sessionStorage.getItem("analysisBirthYear") || "" }),
        });
        if (res.ok) {
          const data = await res.json();
          const sp = new URLSearchParams(window.location.search);
          sp.set("sid", data.id);
          router.replace(`${window.location.pathname}?${sp.toString()}`, { scroll: false });
        }
      } catch {}
    })();
  }, [router]);

  // 이 화면을 벗어나면 읽어주기가 계속 돌아가지 않도록 강제로 멈춤
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
      releaseWakeLock();
    };
  }, []);

  // 화면이 꺼졌다가 다시 켜지면 자동으로 이어 읽기를 시도함
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") resumeAfterHideRef.current();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 메인 사이트와 동일한 이유로 카테고리별로 따로 저장함 — 전부 하나의
  // 거대한 캔버스로 합치면 내용이 길 때 브라우저 캔버스 크기 한계를 넘어
  // 조용히 실패(이미지가 비거나 다운로드가 안 됨)할 수 있음
  const MAX_CANVAS_HEIGHT = 14000;

  const handleSaveImage = async () => {
    if (!analysisResults) return;
    setSaving(true);
    if (window.innerWidth < 768) {
      alert(cats.length > 1
        ? `📥 운세 ${cats.length}개를 각각 따로 다운로드해야 해요!\n\n확인창이 뜨면 [다운로드]를 누르고, "다운로드 완료"가 뜬 후 다시 [다운로드]를 눌러주세요.\n\n한 번에 여러 번 누르지 말고 하나씩 순서대로 눌러주세요. 총 ${cats.length}번 누르시면 끝나요.\n\n화면에 다운로드 알림이 고정되어 떠 있어요. 다운로드 안 하려면 [취소] 버튼을 누르면 돼요.`
        : "📥 잠시 후 '다운로드' 확인창이 뜨면 [다운로드]를 눌러주세요!");
    }
    try {
      const html2canvas = (await import("html2canvas")).default;
      const elements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (elements.length === 0) return;
      const canvases: HTMLCanvasElement[] = [];
      for (const el of elements) {
        canvases.push(await html2canvas(el, { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" }));
      }
      const summary = canvases[0];
      const failedLabels: string[] = [];
      canvases.slice(1).forEach((c, i) => {
        const label = cats[i]?.label ?? `사주${i + 1}`;
        try {
          const rawHeight = summary.height + 16 + c.height;
          const scale = rawHeight > MAX_CANVAS_HEIGHT ? MAX_CANVAS_HEIGHT / rawHeight : 1;
          const merged = document.createElement("canvas");
          merged.width = Math.round(Math.max(summary.width, c.width) * scale);
          merged.height = Math.round(rawHeight * scale);
          const ctx = merged.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, merged.width, merged.height);
          ctx.drawImage(summary, 0, 0, summary.width * scale, summary.height * scale);
          ctx.drawImage(c, 0, (summary.height + 16) * scale, c.width * scale, c.height * scale);
          const link = document.createElement("a");
          link.download = `사주_${customerName}_${packageType}_${label}.png`;
          link.href = merged.toDataURL("image/png");
          link.click();
        } catch (e) {
          console.error(`이미지 저장 실패(${label}):`, e);
          failedLabels.push(label);
        }
      });
      if (failedLabels.length > 0) alert(`다음 항목은 이미지 저장에 실패했습니다: ${failedLabels.join(", ")}`);
      else setTimeout(() => alert(`✅ ${window.innerWidth < 768 ? "사진 앱(갤러리)" : "다운로드 폴더"}에 저장됐어요!`), 0);
    } catch (error) {
      console.error("이미지 생성 오류:", error);
      alert("이미지 생성 중 오류가 발생했습니다");
    } finally {
      setSaving(false);
    }
  };

  // 파트너가 카테고리마다 일일이 이미지 저장+전달하지 않아도, 링크 하나로
  // 고객이 8개(또는 패키지 개수만큼)를 한 번에 볼 수 있게 공유 기능 추가
  const handleShare = async () => {
    if (!analysisResults) return;
    setSharing(true);
    try {
      const shareCats = (PACKAGE_CATS[packageType] ?? PACKAGE_CATS["기본 분석"]).filter(c => analysisResults[c.key]);
      const categories = shareCats.map(c => ({ icon: c.icon, label: c.label, color: "#9333ea", text: analysisResults[c.key], badge: "📦 패키지" }));
      const res = await fetch("/api/v2/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customerName, scores: analysisResults.scores, luckyColor: analysisResults.luckyColor, luckyNumber: analysisResults.luckyNumber, luckyDirection: analysisResults.luckyDirection, categories, businessName: businessName || "", tier: "package", birthYear }),
      });
      if (!res.ok) throw new Error("공유 저장 실패");
      const data = await res.json();
      const url = `${window.location.origin}/main-v2/share/${data.id}`;
      const text = `${customerName}님의 운세 분석 🔮\n총운 ${analysisResults.scores?.total}점\n\n${businessName || "점운"}에서 보내드려요`;
      if (navigator.share) await navigator.share({ title: "사주 분석 결과", text, url }).catch(() => {});
      else { await navigator.clipboard.writeText(`${text}\n${url}`); alert("✅ 링크 복사됨! 고객님께 보내주세요."); }
    } catch {
      alert("공유 링크 생성에 실패했습니다.");
    } finally {
      setSharing(false);
    }
  };

  if (!analysisResults) return null;

  const { scores, luckyColor, luckyNumber, luckyDirection } = analysisResults;
  const cats = (PACKAGE_CATS[packageType] ?? PACKAGE_CATS["기본 분석"]).filter(c => analysisResults[c.key]);

  // 화면이 꺼지거나 연결 에러로 다시 들어와도 처음부터가 아니라 멈췄던 위치부터
  // 이어서 읽을 수 있도록 멈춘 위치를 localStorage에 저장해둠
  // 고객명·생년월일 등을 조합해서 키를 만들면 그 값들이 로딩 시점에 따라 살짝
  // 달라질 수 있어서 저장한 키와 찾는 키가 어긋나는 문제가 있었음 — 이 화면은
  // 한 번에 결과 하나만 보여주므로, 굳이 조합하지 않고 고정된 키 하나만 씀
  const ttsProgressKey = "partner_tts_progress";
  const saveTtsProgress = (chunks: string[], idx: number) => {
    try { localStorage.setItem(ttsProgressKey, JSON.stringify({ chunks, idx })); } catch {}
  };
  const clearTtsProgress = () => {
    try { localStorage.removeItem(ttsProgressKey); } catch {}
  };

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
      utter.onstart = () => { readIdxRef.current = idx; saveTtsProgress(chunks, idx); };
      utter.onerror = (e) => {
        setSpeaking(false);
        // 사용자가 멈추기를 눌러서 취소된 경우에도 onerror가 호출되는데, 이건
        // 실패가 아니라 정상적인 중단이라 — 안내문도 띄우면 안 되고, 어디까지
        // 읽었는지(readIdxRef)도 지우면 안 됨(지우면 다시 누를 때 처음부터 읽힘)
        if (e.error === "canceled" || e.error === "interrupted") return;
        readChunksRef.current = [];
        readIdxRef.current = 0;
        // 진짜 실패일 때는 이미 대기열에 들어가 있는 나머지 문장들도 전부
        // 멈춰야 함 — 안 그러면 "멈추기"를 눌러도 계속 읽히는 것처럼 보임
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

  // 화면이 꺼졌다 켜질 때 speaking 상태는 true인데 실제 음성은 멈춰있는 경우를 위한
  // 자동 이어읽기 — window.speechSynthesis.speaking은 이런 경우 신뢰할 수 없어서 보지 않음
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
    // speaking 상태가 true인데도 실제로는 음성이 멈춰있는 경우(화면 꺼짐 등)
    // 이 버튼을 누르면 "정지"가 아니라 "이어 읽기"로 동작해야 함
    if (speaking && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      releaseWakeLock();
      return;
    }
    // 읽기를 시작하기 전에, 화면이 자동으로 꺼지면 끊길 수 있다는 걸 미리 한 번
    // 안내함(끊긴 뒤에 알려주는 것보다 미리 설정해두게 하는 게 나음). 하루 한 번만
    const ttsTipKey = "partner_tts_tip_shown_date";
    if (localStorage.getItem(ttsTipKey) !== new Date().toDateString()) {
      alert("💡 읽는 중간에 화면이 꺼지면 끊길 수 있어요.\n휴대폰 설정 > 디스플레이 > 화면 자동 꺼짐 시간을 늘리거나, '보고 있는 동안 화면 켜짐' 기능을 켜두면 끊기지 않아요.");
      localStorage.setItem(ttsTipKey, new Date().toDateString());
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
      const fullText = cats.map(c => analysisResults[c.key]).filter(Boolean).join("\n")
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
    requestWakeLock();
    speakFrom(readChunksRef.current, readIdxRef.current);
    setSpeaking(true);
  };

  return (
    <>
      <Head><title>분석 결과 - {businessName || "점운"}</title></Head>
      <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <header style={{ minHeight: 52, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", rowGap: 6, columnGap: 6, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
          <button onClick={() => router.push("/partner/create-analysis")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", flexShrink: 0 }}>
            <span style={{ fontSize: 18 }}>←</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: "#9333ea", whiteSpace: "nowrap" }}>🔮 {businessName || "점운"}</span>
          </button>
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            {partnerTier !== "free" && (
              <button onClick={toggleReadAloud} style={{ padding: "7px 11px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 800, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                {speaking ? "⏸ 멈추기" : "🔊 읽기"}
              </button>
            )}
            {partnerTier !== "free" && (
              <button onClick={handleShare} disabled={sharing} style={{ padding: "7px 11px", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: sharing ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                {sharing ? "⏳..." : "📤 공유"}
              </button>
            )}
            <button onClick={handleSaveImage} disabled={saving} style={{ padding: "7px 11px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: saving ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
              {saving ? "⏳..." : "🖼️ 이미지저장"}
            </button>
          </div>
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

          {/* 사주팔자 한눈에 보기 + 오늘/내일의 한마디 — 일반 결과 페이지와 동일 */}
          {birthYear && (() => {
            const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
            const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
            const ganList = ["갑","을","병","정","무","기","경","신","임","계"];
            const ohEmoji: Record<string, string> = { "목": "🌳", "화": "🔥", "토": "⛰️", "금": "⚪", "수": "💧" };
            const y = Number(birthYear);
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
                <div style={{ background: G_PREMIUM, color: "white", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🪬 {customerName}님의 사주팔자 한눈에 보기</div>
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

          {partnerTier !== "free" && (
            <button onClick={toggleReadAloud} style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", marginBottom: 10 }}>
              {speaking ? "⏸ 멈추기" : "🔊 읽기"}
            </button>
          )}

          <button onClick={() => router.push("/partner/create-analysis")} style={{ width: "100%", padding: "13px 0", background: "white", color: "#9333ea", border: "1.5px solid rgba(147,51,234,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(147,51,234,0.1)" }}>
            🔄 새로 분석
          </button>
        </div>
      </main>
    </>
  );
}
