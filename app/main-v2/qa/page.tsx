"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { QA_CATEGORIES, getOhaeng, fillTemplate } from "@/lib/qa/index";
import type { Ohaeng } from "@/lib/qa/index";

const FREE_QUESTIONS = 3;

// 키워드로 카테고리 추측
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  wealth:   ["돈", "재물", "금전", "수입", "월급", "투자", "부업", "대출", "저축", "재테크", "빚", "수익", "벌", "사업비", "하반기 금전", "흐름"],
  love:     ["연애", "사랑", "남자", "여자", "남친", "여친", "썸", "고백", "헤어", "좋아하는", "만남"],
  marriage: ["결혼", "배우자", "남편", "아내", "혼인", "혼수", "시댁", "처가", "신혼"],
  business: ["사업", "창업", "장사", "비즈니스", "가게", "직원", "매출", "거래"],
  career:   ["취업", "직장", "회사", "이직", "면접", "커리어", "승진", "직업", "일자리", "새로운 일"],
  success:  ["성공", "목표", "꿈", "인생", "운", "기회", "도전", "변화", "성과"],
  health:   ["건강", "병", "몸", "아프", "수술", "병원", "체력", "스트레스"],
  children: ["자녀", "아이", "아기", "임신", "출산", "육아", "자식"],
  general:  ["평안", "마음", "기분", "요즘", "어떻게", "전반적", "올해", "내년"],
};

// 매칭에서 제외할 일반 어미/조사 (너무 흔해서 오히려 방해됨)
const STOPWORDS = new Set(["있을까", "있어", "될까", "돼", "해도", "해야", "할까", "하는", "하면", "이야", "거야", "게", "나한테", "있는지", "있는데", "있는", "있어야", "있을", "있을까요"]);

// 시간 관련 단어가 있으면 시기 관련 템플릿 우선
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

function findAnswer(question: string, ohaeng: Ohaeng, name: string): { answer: string; catId: string } {
  const catId = detectCategory(question);
  const cat = QA_CATEGORIES.find(c => c.id === catId) ?? QA_CATEGORIES[QA_CATEGORIES.length - 1];

  const userHasTime = TIME_TRIGGERS.some(t => question.includes(t));

  let bestItem = cat.items[0];
  let bestScore = -1;
  for (const item of cat.items) {
    let score = 0;

    // 템플릿 단어 → 유저 질문에 있으면 가점 (길이 가중치, 불용어 제외)
    const tmplWords = item.question.replace(/[?!？！]/g, "").split(/\s+/)
      .filter(w => w.length > 1 && !STOPWORDS.has(w));
    for (const w of tmplWords) {
      if (question.includes(w)) score += w.length;
    }

    // 유저 단어 → 템플릿에 있으면 가점 (쌍방향 매칭)
    const userWords = question.replace(/[?!？！]/g, "").split(/\s+/)
      .filter(w => w.length > 1 && !STOPWORDS.has(w));
    for (const w of userWords) {
      if (item.question.includes(w)) score += w.length;
    }

    // 시간 질문인데 템플릿에 시기 단어 있으면 큰 가점
    if (userHasTime && TIME_SIGNALS.some(s => item.question.includes(s))) score += 6;

    if (score > bestScore) { bestScore = score; bestItem = item; }
  }

  const item = bestScore > 0 ? bestItem : cat.items[Math.floor(Math.random() * Math.min(10, cat.items.length))];
  return { answer: fillTemplate(item.answers[ohaeng], name), catId };
}

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
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    const used = Number(localStorage.getItem(`v2_qa_${n}_${y}`) ?? 0);
    setRemaining(paid ? 999 : Math.max(0, FREE_QUESTIONS - used));
    setMessages([{ from: "cat", text: `안녕하세요, ${n}님! 🐱\n복냥이가 ${n}님의 사주를 보고 있어요.\n궁금한 게 있으면 뭐든 물어봐!` }]);
    setReady(true);
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const q = input.trim();
    if (!q || typing) return;
    const detectedCat = detectCategory(q);
    if (remaining <= 0) { setPendingQ(q); setPendingCatId(detectedCat); setShowModal(true); return; }
    setMessages(prev => [...prev, { from: "user", text: q }]);
    setInput("");
    const newRemaining = unlocked ? 999 : remaining - 1;
    setRemaining(newRemaining);
    if (!unlocked) {
      const used = Number(localStorage.getItem(`v2_qa_${name}_${birthYear}`) ?? 0);
      localStorage.setItem(`v2_qa_${name}_${birthYear}`, String(used + 1));
    }
    setTyping(true);
    setTimeout(() => {
      const { answer, catId } = findAnswer(q, ohaeng, name);
      // 유료 카테고리 질문이고 미구매 시 → 답변 후 구매 버튼 표시
      const showBuy = !unlocked && catId !== "general";
      setMessages(prev => [...prev, { from: "cat", text: answer, buyCatId: showBuy ? catId : undefined }]);
      setTyping(false);
      if (newRemaining === 0) {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "cat", text: `${name}님, 무료 질문을 다 썼어요 😿\n운세를 구매하면 더 자세히 알 수 있어!` }]);
        }, 800);
      }
    }, 900);
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
            {unlocked ? "무제한 질문 가능" : `남은 질문 ${remaining}회`}
          </p>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => {
          const BUY_INFO: Record<string, { icon: string; label: string; cat: string }> = {
            wealth:   { icon: "💰", label: "재물운", cat: "wealthLuck" },
            love:     { icon: "💕", label: "연애운", cat: "loveLuck" },
            marriage: { icon: "💍", label: "결혼운", cat: "loveLuck" },
            business: { icon: "🚀", label: "사업운", cat: "wealthLuck" },
            career:   { icon: "💼", label: "직업운", cat: "wealthLuck" },
            success:  { icon: "🏆", label: "성공운", cat: "wealthLuck" },
            health:   { icon: "🍀", label: "건강운", cat: "healthLuck" },
            children: { icon: "👶", label: "자녀운", cat: "basic" },
          };
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
                  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                  whiteSpace: "pre-line",
                }}>{msg.text}</div>
              </div>
              {/* 답변 후 구매 유도 버튼 */}
              {buyInfo && (
                <div style={{ marginLeft: 38, marginTop: 6 }}>
                  <button
                    onClick={() => { sessionStorage.setItem("preselect_cat", buyInfo.cat); router.push("/main-v2/payment"); }}
                    style={{
                      padding: "8px 14px", background: "linear-gradient(135deg, #fdf4ff, #fce7f3)",
                      border: "1.5px solid #e9d5ff", borderRadius: 50,
                      fontSize: 12, fontWeight: 800, color: "#ec4899", cursor: "pointer",
                    }}
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

      {/* 입력창 */}
      <div style={{ background: "white", borderTop: "1px solid #f3e8ff", padding: "12px 16px", display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          type="text" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(); }}
          placeholder="궁금한 거 뭐든 물어봐..."
          style={{ flex: 1, padding: "12px 16px", borderRadius: 50, border: "1.5px solid #e9d5ff", fontSize: 13, fontWeight: 600, color: "#374151", background: "#fdf4ff", outline: "none", boxSizing: "border-box" }}
        />
        <button onClick={send} style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", fontSize: 18, cursor: "pointer", flexShrink: 0 }}>↑</button>
      </div>

      {/* 운세 구매 유도 모달 */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: "20px 20px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 480 }}>
            <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 20px" }} />
            <h3 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px", textAlign: "center" }}>더 궁금하면 운세를 구매해봐! 🔮</h3>
            <p style={{ fontSize: 12, color: "#374151", fontWeight: 700, margin: "0 0 18px", textAlign: "center" }}>
              운세 구매하면 관련 Q&amp;A 전체 열람 가능해
            </p>
            {/* 물어봤던 질문 */}
            <div style={{ background: "#f9f5ff", borderRadius: 12, padding: "11px 14px", marginBottom: 18, fontSize: 12, fontWeight: 800, color: "#374151", lineHeight: 1.6, borderLeft: "3px solid #c4b5fd" }}>
              미처 못 한 질문: {pendingQ}
            </div>
            {/* 단품 선택 — 감지된 카테고리 우선 표시 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                { icon: "💰", label: "재물운", price: "₩9,900", cat: "wealthLuck", desc: "돈·투자·수입 관련 Q&A 전체 열람", catIds: ["wealth","business","career","success"] },
                { icon: "💕", label: "연애운", price: "₩9,900", cat: "loveLuck",   desc: "연애·결혼 관련 Q&A 전체 열람",  catIds: ["love","marriage"] },
                { icon: "🍀", label: "건강운", price: "₩9,900", cat: "healthLuck", desc: "건강·체력·스트레스 관련 Q&A 전체", catIds: ["health"] },
                { icon: "📦", label: "기본 패키지", price: "₩9,900", cat: "basic", desc: "재물운+연애운 패키지 · Q&A 전체", catIds: [] },
              ].sort((a, b) => (b.catIds.includes(pendingCatId) ? 1 : 0) - (a.catIds.includes(pendingCatId) ? 1 : 0))
              .map(item => {
                const isHighlight = item.catIds.includes(pendingCatId);
                return (
                <button key={item.cat}
                  onClick={() => {
                    sessionStorage.setItem("preselect_cat", item.cat);
                    router.push("/main-v2/payment");
                  }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 16px",
                    background: isHighlight ? "linear-gradient(135deg, #fdf4ff, #fce7f3)" : "#fdf4ff",
                    border: isHighlight ? "2px solid #ec4899" : "1.5px solid #e9d5ff",
                    borderRadius: 14, cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{item.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>
                        {item.label} {isHighlight && <span style={{ fontSize: 10, background: "#ec4899", color: "white", padding: "2px 6px", borderRadius: 10, fontWeight: 800 }}>추천</span>}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#8b5cf6", fontWeight: 600 }}>{item.desc}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#ec4899" }}>{item.price}</span>
                </button>
              );
              })}
            </div>
            <button onClick={() => setShowModal(false)} style={{ width: "100%", padding: 13, background: "none", border: "none", fontWeight: 800, fontSize: 14, color: "#374151", cursor: "pointer" }}>
              나중에 할게
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </main>
  );
}
