"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { QA_CATEGORIES, getOhaeng, fillTemplate } from "@/lib/qa/index";
import type { Ohaeng } from "@/lib/qa/index";

const FREE_QUESTIONS = 3;
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

// 패키지 이름 직접 타이핑 → 구매 모달
const PRODUCT_NAME_TRIGGERS: Array<{ keywords: string[]; pkg: string }> = [
  { keywords: ["vip", "VIP", "커플팩"],           pkg: "vip" },
  { keywords: ["프리미엄"],                         pkg: "premium" },
  { keywords: ["베이직", "베이식"],                 pkg: "standard" },
  { keywords: ["기본분석", "기본 분석", "기본팩"],  pkg: "basic" },
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  wealth:   ["돈", "재물", "금전", "수입", "월급", "투자", "부업", "대출", "저축", "재테크", "빚", "수익", "벌", "사업비", "집", "마련", "부동산", "아파트", "전세", "월세", "절약", "재정"],
  love:     ["연애", "사랑", "남자", "여자", "남친", "여친", "썸", "고백", "헤어", "좋아하는", "만남", "소개팅", "짝사랑", "이별", "데이트", "궁합", "연인", "사귀", "상대방", "좋아해", "고백"],
  marriage: ["결혼", "배우자", "남편", "아내", "혼인", "혼수", "시댁", "처가", "신혼", "프러포즈", "동거", "생활비", "이혼", "시월드"],
  business: ["사업", "창업", "장사", "비즈니스", "가게", "직원", "매출", "거래", "법인", "마케팅", "홍보", "단골", "확장"],
  career:   ["취업", "직장", "회사", "이직", "면접", "커리어", "승진", "직업", "일자리", "자격증", "시험", "공부", "재취업", "계약직", "정규직", "야근"],
  success:  ["성공", "목표", "꿈", "인생", "운", "기회", "도전", "변화", "성과", "막막", "무기력", "시작", "강점", "자기계발"],
  health:   ["건강", "병", "몸", "아프", "수술", "병원", "체력", "스트레스", "피로", "다이어트", "두통", "체중", "허리", "눈", "면역", "수면", "운동", "식단", "만성"],
  children: ["자녀", "아이", "아기", "임신", "출산", "육아", "자식", "손주", "형제", "자매", "독립", "교육"],
  general:  ["평안", "마음", "기분", "요즘", "어떻게", "전반적", "내년", "인간관계", "이사", "우울", "인복", "사주", "운세"],
};

const STOPWORDS = new Set(["있을까", "있어", "될까", "돼", "해도", "해야", "할까", "하는", "하면", "이야", "거야", "게", "나한테", "있는지", "있는데", "있는", "있어야", "있을", "있을까요"]);
const TIME_TRIGGERS = ["언제", "쯤", "몇월", "몇살", "올해", "이번", "시기", "때"];
const TIME_SIGNALS  = ["언제", "시기", "때", "올해", "올"];

function detectCategory(question: string): string {
  const scores: Record<string, number> = {};
  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[catId] = keywords.filter(kw => question.includes(kw)).length;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return (best && best[1] > 0) ? best[0] : "general";
}

function findAnswer(question: string, ohaeng: Ohaeng, name: string, forceCatId?: string): { answer: string; catId: string } {
  const catId = forceCatId ?? detectCategory(question);
  const cat = QA_CATEGORIES.find(c => c.id === catId) ?? QA_CATEGORIES[QA_CATEGORIES.length - 1];
  const userHasTime = TIME_TRIGGERS.some(t => question.includes(t));

  let bestItem = cat.items[0];
  let bestScore = -1;
  for (const item of cat.items) {
    let score = 0;
    const tmplWords = item.question.replace(/[?!？！]/g, "").split(/\s+/).filter(w => w.length > 1 && !STOPWORDS.has(w));
    for (const w of tmplWords) { if (question.includes(w)) score += w.length; }
    const userWords = question.replace(/[?!？！]/g, "").split(/\s+/).filter(w => w.length > 1 && !STOPWORDS.has(w));
    for (const w of userWords) { if (item.question.includes(w)) score += w.length; }
    if (userHasTime && TIME_SIGNALS.some(s => item.question.includes(s))) score += 6;
    if (score > bestScore) { bestScore = score; bestItem = item; }
  }

  // 매칭 실패 시 랜덤 대신 항상 첫 번째 (가장 일반적인) 질문
  const item = bestScore > 0 ? bestItem : cat.items[0];
  return { answer: fillTemplate(item.answers[ohaeng], name), catId };
}

// 단품 5개 (실제 결제 페이지 SELECT_CATS 기준)
const SINGLES = [
  { icon: "💰", label: "재물운", catIds: ["wealth","business","career","success"] },
  { icon: "💕", label: "연애운", catIds: ["love","marriage"] },
  { icon: "💪", label: "건강운", catIds: ["health"] },
  { icon: "🎯", label: "성공운", catIds: ["success","career"] },
  { icon: "✨", label: "총운",   catIds: ["general","children"] },
];
const PKGS = [
  { id: "basic",    label: "기본 분석",  price: "₩9,900",  desc: "재물운 + 연애운" },
  { id: "standard", label: "베이직",    price: "₩19,900", desc: "올해 + 재물 + 연애 + 월별" },
  { id: "premium",  label: "프리미엄",  price: "₩24,900", desc: "올해 + 재물 + 연애 + 월별 + 건강" },
  { id: "vip",      label: "VIP 커플팩", price: "₩29,900", desc: "8개 전부 + 궁합분석" },
];

interface Msg { from: "cat" | "user"; text: string; buyCatId?: string; }

export default function QAPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState(0);
  const [ohaeng, setOhaeng] = useState<Ohaeng>("목");
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(FREE_QUESTIONS);
  const [showModal, setShowModal] = useState(false);
  const [pendingQ, setPendingQ] = useState("");
  const [pendingCatId, setPendingCatId] = useState("general");
  const [pendingPkg, setPendingPkg] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{q: string; catId: string}>>([]);
  const [showQList, setShowQList] = useState(false);
  const [qListCat, setQListCat] = useState("wealth");
  const [chipKey, setChipKey] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const qaModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setSuggestions(QA_CATEGORIES.map(cat => {
        const pick = cat.items[Math.floor(Math.random() * cat.items.length)];
        return { q: pick.question, catId: cat.id };
      }));
      setChipKey(k => k + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("v2_result");
    if (!raw) { router.replace("/main-v2"); return; }
    const r = JSON.parse(raw);
    const n = r?.profile?.name ?? "";
    const y = Number(r?.profile?.birthYear ?? 0);
    if (!n || !y) { router.replace("/main-v2"); return; }
    setName(n);
    setBirthYear(y);
    const oh = getOhaeng(y);
    setOhaeng(oh);
    const plan = sessionStorage.getItem("v2_plan") ?? "";
    const paid = plan === "select" || plan === "package";
    setUnlocked(paid);
    const used = Number(localStorage.getItem(`v2_qa_${n}_${y}_${todayKey()}`) ?? 0);
    setRemaining(paid ? 999 : Math.max(0, FREE_QUESTIONS - used));
    setMessages([{ from: "cat", text: `안녕하세요, ${n}님!\n복냥이가 사주를 보고 있어요.\n아래 질문을 눌러봐도 되고,\n직접 물어봐도 돼요!` }]);
    // 9개 카테고리 각각 랜덤 1개
    setSuggestions(QA_CATEGORIES.map(cat => {
      const pick = cat.items[Math.floor(Math.random() * cat.items.length)];
      return { q: pick.question, catId: cat.id };
    }));
    setReady(true);
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!showModal) return;
    const prevent = (e: TouchEvent) => {
      if (!qaModalRef.current?.contains(e.target as Node)) e.preventDefault();
    };
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => document.removeEventListener("touchmove", prevent);
  }, [showModal]);

  // iOS Safari URL바 변동 시 패널 위치 고정
  useEffect(() => {
    if (!showModal) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const panel = qaModalRef.current;
      if (!panel) return;
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      panel.style.bottom = `${Math.max(0, offset)}px`;
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [showModal]);

  const sendMsg = (overrideQ?: string, overrideCatId?: string) => {
    const q = (overrideQ ?? input).trim();
    if (!q || typing) return;

    // 패키지 이름 직접 타이핑 → 즉시 모달
    for (const trigger of PRODUCT_NAME_TRIGGERS) {
      if (trigger.keywords.some(kw => q.toLowerCase().includes(kw.toLowerCase()))) {
        setMessages(prev => [...prev, { from: "user", text: q }]);
        if (!overrideQ) setInput("");
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "cat", text: "👇 아래에서 바로 구매할 수 있어!" }]);
          setPendingQ(q); setPendingCatId("general"); setPendingPkg(trigger.pkg); setShowModal(true);
        }, 400);
        return;
      }
    }

    const detectedCat = overrideCatId ?? detectCategory(q);
    if (remaining <= 0) {
      setMessages(prev => [...prev, { from: "user", text: q }, { from: "cat", text: `${name}님, 오늘 무료 질문을 다 썼어요 😿\n운세를 구매하면 계속 물어볼 수 있어!` }]);
      setInput("");
      setPendingQ(q); setPendingCatId(detectedCat); setPendingPkg(null);
      setTimeout(() => { (document.activeElement as HTMLElement)?.blur(); setTimeout(() => setShowModal(true), 500); }, 9000);
      return;
    }
    setMessages(prev => [...prev, { from: "user", text: q }]);
    if (!overrideQ) setInput("");
    const newRemaining = unlocked ? 999 : remaining - 1;
    setRemaining(newRemaining);
    if (!unlocked) {
      const lsKey = `v2_qa_${name}_${birthYear}_${todayKey()}`;
      localStorage.setItem(lsKey, String((Number(localStorage.getItem(lsKey) ?? 0)) + 1));
    }
    setTyping(true);
    setTimeout(() => {
      const { answer, catId } = findAnswer(q, ohaeng, name, overrideCatId);
      const showBuy = !unlocked && catId !== "general";
      setMessages(prev => [...prev, { from: "cat", text: answer, buyCatId: showBuy ? catId : undefined }]);
      setTyping(false);
      // 9개 카테고리 각각 새 랜덤 질문으로 갱신
      setSuggestions(QA_CATEGORIES.map(c => {
        const pick = c.items[Math.floor(Math.random() * c.items.length)];
        return { q: pick.question, catId: c.id };
      }));
      if (newRemaining === 0) {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "cat", text: `${name}님, 오늘 무료 질문을 다 썼어요 😿\n운세를 구매하면 계속 물어볼 수 있어!` }]);
          setTimeout(() => { (document.activeElement as HTMLElement)?.blur(); setPendingQ(""); setPendingCatId(catId); setPendingPkg(null); setTimeout(() => setShowModal(true), 500); }, 9000);
        }, 800);
      }
    }, 900);
  };

  const send = () => sendMsg();

  const BUY_INFO: Record<string, { icon: string; label: string }> = {
    wealth: { icon: "💰", label: "재물운" }, love: { icon: "💕", label: "연애운" },
    marriage: { icon: "💕", label: "연애운" }, business: { icon: "🎯", label: "성공운" },
    career: { icon: "🎯", label: "성공운" }, success: { icon: "🎯", label: "성공운" },
    health: { icon: "💪", label: "건강운" }, children: { icon: "✨", label: "총운" },
  };

  if (!ready) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf4ff" }}>
      <p style={{ color: "#8b5cf6", fontWeight: 700 }}>불러오는 중...</p>
    </div>
  );

  return (
    <main style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#f9f5ff", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>

      {/* 헤더 */}
      <div style={{ background: "white", borderBottom: "1px solid #f3e8ff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#8b5cf6", padding: "0 4px" }}>←</button>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🐱</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>복냥이 사주 상담</p>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: remaining > 0 ? "#8b5cf6" : "#ef4444" }}>
            {unlocked ? "무제한 질문 가능" : `오늘 남은 질문 ${remaining}회`}
          </p>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => {
          const buyInfo = msg.buyCatId ? BUY_INFO[msg.buyCatId] : null;
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                {msg.from === "cat" && (
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, marginBottom: 2 }}>🐱</div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "12px 15px",
                  borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  background: msg.from === "user" ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "white",
                  color: msg.from === "user" ? "white" : "#1a1a2e",
                  fontSize: 13, fontWeight: 600, lineHeight: 1.7,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.07)", whiteSpace: "pre-line",
                }}>{msg.text}</div>
              </div>
              {buyInfo && (
                <div style={{ marginLeft: 38, marginTop: 6 }}>
                  <button
                    onClick={() => { setPendingCatId(msg.buyCatId ?? "general"); setPendingQ(""); setPendingPkg(null); setShowModal(true); }}
                    style={{ padding: "8px 14px", background: "linear-gradient(135deg, #fdf4ff, #fce7f3)", border: "1.5px solid #e9d5ff", borderRadius: 50, fontSize: 12, fontWeight: 800, color: "#ec4899", cursor: "pointer" }}
                  >{buyInfo.icon} {buyInfo.label} 구매하면 더 자세히 알 수 있어 →</button>
                </div>
              )}
            </div>
          );
        })}
        {typing && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🐱</div>
            <div style={{ background: "white", borderRadius: "4px 18px 18px 18px", padding: "12px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(n => (
                <div key={n} style={{ width: 7, height: 7, borderRadius: "50%", background: "#c4b5fd", animation: `bounce 0.9s ${n * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 추천 질문 칩 */}
      {suggestions.length > 0 && !typing && (() => {
        const CHIP_COLORS = [
          "linear-gradient(135deg, #ec4899, #f97316)",
          "linear-gradient(135deg, #8b5cf6, #ec4899)",
          "linear-gradient(135deg, #06b6d4, #3b82f6)",
          "linear-gradient(135deg, #10b981, #06b6d4)",
          "linear-gradient(135deg, #f59e0b, #ef4444)",
          "linear-gradient(135deg, #6366f1, #8b5cf6)",
          "linear-gradient(135deg, #14b8a6, #10b981)",
          "linear-gradient(135deg, #f97316, #eab308)",
          "linear-gradient(135deg, #e11d48, #8b5cf6)",
        ];
        return (
          <div key={chipKey} className="qa-chips-row-p" style={{ background: "white", borderTop: "1px solid #f3e8ff", padding: "8px 12px", display: "flex", gap: 7, overflowX: "auto", flexShrink: 0, animation: "qaChipSlide 0.4s ease" }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMsg(s.q, s.catId)} style={{
                flexShrink: 0, padding: "7px 14px",
                background: CHIP_COLORS[i % CHIP_COLORS.length],
                border: "none", borderRadius: 50,
                fontSize: 11, fontWeight: 800, color: "white",
                cursor: "pointer", whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}>
                {s.q.length > 20 ? s.q.slice(0, 19) + "…" : s.q}
              </button>
            ))}
          </div>
        );
      })()}

      {/* 질문 목록 버튼 — 입력창 바로 위 */}
      <div style={{ background: "white", borderTop: "1px solid #f3e8ff", padding: "10px 14px 0", flexShrink: 0 }}>
        <button onClick={() => setShowQList(true)} style={{
          width: "100%", padding: "11px 0",
          background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
          border: "none", borderRadius: 12,
          fontSize: 14, fontWeight: 900, color: "white",
          cursor: "pointer", letterSpacing: "-0.3px",
          boxShadow: "0 4px 14px rgba(139,92,246,0.35)",
        }}>📋 360개 질문 목록 보기 (탭하면 바로 답변!)</button>
      </div>

      {/* 입력창 */}
      <div style={{ background: "white", padding: "10px 12px", display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(); }}
          placeholder="직접 질문하거나 위 버튼 눌러봐..."
          style={{ flex: 1, padding: "11px 16px", borderRadius: 50, border: "1.5px solid #e9d5ff", fontSize: 13, fontWeight: 600, color: "#374151", background: "#fdf4ff", outline: "none", boxSizing: "border-box" }}
        />
        <button onClick={send} style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", fontSize: 18, cursor: "pointer", flexShrink: 0 }}>↑</button>
      </div>

      {/* ===== 질문 목록 바텀시트 ===== */}
      {showQList && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} onClick={() => setShowQList(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", display: "flex", flexDirection: "column" }}
          >
            <div style={{ padding: "16px 16px 10px" }}>
              <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 14px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 900, color: "#1a1a2e" }}>📋 질문 목록</h3>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#8b5cf6" }}>카테고리마다 40개 질문 · 원하는 질문 탭하면 바로 답변!</p>
                </div>
                <button onClick={() => setShowQList(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9ca3af" }}>✕</button>
              </div>
              {/* 카테고리 탭 3×3 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
                {QA_CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setQListCat(c.id)} style={{
                    padding: "8px 4px",
                    background: qListCat === c.id ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "#f5f3ff",
                    color: qListCat === c.id ? "white" : "#1a1a2e",
                    border: qListCat === c.id ? "none" : "2px solid #c4b5fd",
                    borderRadius: 9, fontWeight: 900, fontSize: 12, cursor: "pointer",
                    boxShadow: qListCat === c.id ? "0 3px 10px rgba(236,72,153,0.3)" : "none",
                  }}>{c.emoji} {c.label}</button>
                ))}
              </div>
            </div>
            {/* 질문 목록 스크롤 — 3단 그리드 */}
            <div style={{ overflowY: "auto", padding: "4px 16px 32px", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {(QA_CATEGORIES.find(c => c.id === qListCat)?.items ?? []).map((item, idx) => (
                  <button key={idx} onClick={() => { setShowQList(false); sendMsg(item.question, qListCat); }} style={{
                    padding: "10px 10px", background: "#fdf4ff",
                    border: "1.5px solid #e9d5ff", borderRadius: 12,
                    textAlign: "left", cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: 5,
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: "white", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", padding: "2px 8px", borderRadius: 20, alignSelf: "flex-start" }}>Q{idx + 1}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.4 }}>{item.question}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 구매 유도 모달 ===== */}
      {showModal && (() => {
        const isHighlightSingle = (s: typeof SINGLES[0]) => !pendingPkg && s.catIds.includes(pendingCatId);
        const isHighlightPkg = (p: typeof PKGS[0]) => pendingPkg === p.id;
        return (
          <>
            {/* backdrop — 독립 fixed, 사이즈 변동 있어도 패널에 영향 없음 */}
            <div onClick={() => { setShowModal(false); setPendingPkg(null); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100 }} />
            {/* 패널 — bottom:0 고정, viewport 크기 변해도 위치 안 바뀜 */}
            <div ref={qaModalRef} style={{ position: "fixed", bottom: 0, left: 0, right: 0, margin: "0 auto", maxWidth: 480, background: "white", borderRadius: "20px 20px 0 0", height: 280, display: "flex", flexDirection: "column", zIndex: 101, willChange: "transform", transform: "translateZ(0)" }}>
              {/* 스크롤 영역 */}
              <div style={{ overflowY: "auto", overscrollBehavior: "contain", padding: "12px 14px 6px", flex: 1 }}>
                <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 10px" }} />
                <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 2px", textAlign: "center" }}>운세를 구매하고 더 알아봐! 🔮</h3>
                <p style={{ fontSize: 11, color: "#374151", fontWeight: 700, margin: "0 0 8px", textAlign: "center" }}>구매하면 관련 Q&amp;A 전체 열람 가능해</p>
                {pendingQ && (
                  <div style={{ background: "#f9f5ff", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 11, fontWeight: 800, color: "#374151", borderLeft: "3px solid #c4b5fd" }}>
                    미처 못 한 질문: {pendingQ}
                  </div>
                )}
                {/* 단품 5개 ₩990 */}
                <p style={{ fontSize: 11, fontWeight: 900, color: "#8b5cf6", margin: "0 0 7px 2px" }}>✨ 단품 구매 · 1개 ₩990</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 12 }}>
                  {SINGLES.map(s => {
                    const hi = isHighlightSingle(s);
                    return (
                      <button key={s.label} onClick={() => router.push(`/main-v2/payment?single=${encodeURIComponent(s.label)}&scrollTo=packages`)}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 11px", background: hi ? "linear-gradient(135deg, #fdf4ff, #fce7f3)" : "#fdf4ff", border: hi ? "2px solid #ec4899" : "1.5px solid #e9d5ff", borderRadius: 11, cursor: "pointer" }}
                      >
                        <span style={{ fontSize: 16 }}>{s.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>
                            {s.label}
                            {hi && <span style={{ marginLeft: 3, fontSize: 9, background: "#ec4899", color: "white", padding: "1px 5px", borderRadius: 8, fontWeight: 800 }}>추천</span>}
                          </p>
                          <p style={{ margin: 0, fontSize: 10, color: "#ec4899", fontWeight: 800 }}>₩990</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {/* 패키지 4개 */}
                <p style={{ fontSize: 11, fontWeight: 900, color: "#8b5cf6", margin: "0 0 7px 2px" }}>📦 패키지 (더 저렴해!)</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {PKGS.map(p => {
                    const hi = isHighlightPkg(p);
                    return (
                      <button key={p.id} onClick={() => router.push(`/main-v2/payment?preselect=${p.id}&scrollTo=packages`)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", background: hi ? "linear-gradient(135deg, #fdf4ff, #fce7f3)" : "#fdf4ff", border: hi ? "2px solid #ec4899" : "1.5px solid #e9d5ff", borderRadius: 11, cursor: "pointer" }}
                      >
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>
                            📦 {p.label}
                            {hi && <span style={{ marginLeft: 5, fontSize: 9, background: "#ec4899", color: "white", padding: "1px 5px", borderRadius: 8, fontWeight: 800 }}>추천</span>}
                          </p>
                          <p style={{ margin: 0, fontSize: 10, color: "#6b7280", fontWeight: 700 }}>{p.desc}</p>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 900, color: "#ec4899", flexShrink: 0 }}>{p.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* 나중에 할게 — 항상 보이는 고정 영역 */}
              <div style={{ padding: "8px 16px 24px", borderTop: "1px solid #f3e8ff", background: "white", flexShrink: 0 }}>
                <button onClick={() => { setShowModal(false); setPendingPkg(null); }} style={{ width: "100%", padding: 10, background: "none", border: "none", fontWeight: 800, fontSize: 14, color: "#374151", cursor: "pointer" }}>
                  나중에 할게
                </button>
              </div>
            </div>
          </>
        );
      })()}

      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} } @keyframes qaChipSlide { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} } .qa-chips-row-p::-webkit-scrollbar{display:none} .qa-chips-row-p{scrollbar-width:none;-ms-overflow-style:none}`}</style>
    </main>
  );
}
