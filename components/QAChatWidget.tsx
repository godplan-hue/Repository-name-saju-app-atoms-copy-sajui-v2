"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QA_CATEGORIES, getOhaeng, fillTemplate } from "@/lib/qa/index";
import type { Ohaeng } from "@/lib/qa/index";

function QAYellowLine() {
  const shineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let pos = -80;
    const id = setInterval(() => {
      pos += 1.5;
      if (pos > 120) pos = -80;
      if (shineRef.current) shineRef.current.style.transform = `translateX(${pos}%)`;
    }, 12);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ height: 5, background: "linear-gradient(90deg,#facc15,#f97316,#facc15)", position: "relative", overflow: "hidden", boxShadow: "0 0 10px rgba(250,204,21,0.8)" }}>
      <div ref={shineRef} style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)", transform: "translateX(-80%)" }} />
    </div>
  );
}

const FREE_QUESTIONS = 3;
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  wealth:   ["돈","재물","금전","수입","월급","투자","부업","대출","저축","재테크","빚","수익","벌","사업비","집","마련","부동산","아파트","전세","월세","절약","재정"],
  love:     ["연애","사랑","남자","여자","남친","여친","썸","고백","헤어","좋아하는","만남","소개팅","짝사랑","이별","데이트","궁합","연인","사귀","상대방","좋아해"],
  marriage: ["결혼","배우자","남편","아내","혼인","혼수","시댁","처가","신혼","프러포즈","동거","생활비","이혼","시월드"],
  business: ["사업","창업","장사","비즈니스","가게","직원","매출","거래","법인","마케팅","홍보","단골","확장"],
  career:   ["취업","직장","회사","이직","면접","커리어","승진","직업","일자리","자격증","시험","공부","재취업","계약직","정규직","야근"],
  success:  ["성공","목표","꿈","인생","운","기회","도전","변화","성과","막막","무기력","시작","강점","자기계발"],
  health:   ["건강","병","몸","아프","수술","병원","체력","스트레스","피로","다이어트","두통","체중","허리","눈","면역","수면","운동","식단","만성"],
  children: ["자녀","아이","아기","임신","출산","육아","자식","손주","형제","자매","독립","교육"],
  general:  ["평안","마음","기분","요즘","어떻게","전반적","내년","인간관계","이사","우울","인복","사주","운세"],
};

const STOPWORDS = new Set(["있을까","있어","될까","돼","해도","해야","할까","하는","하면","이야","거야","게","나한테","있는지","있는데","있는","있어야","있을","있을까요"]);
const TIME_TRIGGERS = ["언제","쯤","몇월","몇살","올해","이번","시기","때"];
const TIME_SIGNALS  = ["언제","시기","때","올해","올"];

function detectCategory(q: string): string {
  const scores: Record<string,number> = {};
  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[catId] = keywords.filter(kw => q.includes(kw)).length;
  }
  const best = Object.entries(scores).sort((a,b) => b[1]-a[1])[0];
  return (best && best[1]>0) ? best[0] : "general";
}

function findAnswer(question: string, ohaeng: Ohaeng, name: string): string {
  const catId = detectCategory(question);
  const cat = QA_CATEGORIES.find(c => c.id === catId) ?? QA_CATEGORIES[QA_CATEGORIES.length-1];
  const userHasTime = TIME_TRIGGERS.some(t => question.includes(t));
  let bestItem = cat.items[0];
  let bestScore = -1;
  for (const item of cat.items) {
    let score = 0;
    const tmplWords = item.question.replace(/[?!？！]/g,"").split(/\s+/).filter(w => w.length>1 && !STOPWORDS.has(w));
    for (const w of tmplWords) { if (question.includes(w)) score += w.length; }
    const userWords = question.replace(/[?!？！]/g,"").split(/\s+/).filter(w => w.length>1 && !STOPWORDS.has(w));
    for (const w of userWords) { if (item.question.includes(w)) score += w.length; }
    if (userHasTime && TIME_SIGNALS.some(s => item.question.includes(s))) score += 6;
    if (score > bestScore) { bestScore = score; bestItem = item; }
  }
  return fillTemplate((bestScore>0 ? bestItem : cat.items[0]).answers[ohaeng], name);
}

const PKGS = [
  { id: "basic",    label: "기본 분석",  price: "₩9,900",  desc: "재물운 + 연애운" },
  { id: "standard", label: "베이직",    price: "₩19,900", desc: "올해 + 재물 + 연애 + 월별" },
  { id: "premium",  label: "프리미엄",  price: "₩24,900", desc: "올해 + 재물 + 연애 + 월별 + 건강" },
  { id: "vip",      label: "VIP 커플팩", price: "₩29,900", desc: "8개 전부 + 궁합" },
];

const CHIP_COLORS = [
  "linear-gradient(135deg,#ec4899,#f97316)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#14b8a6,#10b981)",
  "linear-gradient(135deg,#f97316,#eab308)",
  "linear-gradient(135deg,#e11d48,#8b5cf6)",
];

interface Msg { from: "cat"|"user"; text: string; }
interface Props { name: string; birthYear: number; unlocked?: boolean; }

export default function QAChatWidget({ name, birthYear, unlocked=false }: Props) {
  const router = useRouter();
  const ohaeng: Ohaeng = getOhaeng(birthYear);
  const [messages, setMessages] = useState<Msg[]>([
    { from: "cat", text: `안녕하세요, ${name}님!\n복냥이가 사주를 보고 있어요.\n아래 질문을 눌러봐도 되고,\n직접 물어봐도 돼요!` }
  ]);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(FREE_QUESTIONS);
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showQList, setShowQList] = useState(false);
  const [qListCat, setQListCat] = useState("wealth");
  const msgAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const used = Number(localStorage.getItem(`v2_qa_${name}_${birthYear}_${todayKey()}`) ?? 0);
    setRemaining(unlocked ? 999 : Math.max(0, FREE_QUESTIONS - used));
    setSuggestions(QA_CATEGORIES.map(cat => {
      const pick = cat.items[Math.floor(Math.random() * cat.items.length)];
      return pick.question;
    }));
  }, [name, birthYear, unlocked]);

  useEffect(() => {
    if (msgAreaRef.current) {
      msgAreaRef.current.scrollTop = msgAreaRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMsg = (overrideQ?: string) => {
    const q = (overrideQ ?? input).trim();
    if (!q || typing) return;
    if (remaining <= 0 && !unlocked) { setShowBuyModal(true); return; }
    setMessages(prev => [...prev, { from: "user", text: q }]);
    if (!overrideQ) setInput("");
    if (!unlocked) {
      const newR = remaining - 1;
      setRemaining(newR);
      const lsKey = `v2_qa_${name}_${birthYear}_${todayKey()}`;
      localStorage.setItem(lsKey, String((Number(localStorage.getItem(lsKey) ?? 0)) + 1));
      if (newR === 0) {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: "cat", text: `${name}님, 오늘 무료 질문을 다 썼어요 😿\n운세를 구매하면 계속 물어볼 수 있어!` }]);
          setTimeout(() => setShowBuyModal(true), 800);
        }, 1200);
      }
    }
    setTyping(true);
    setTimeout(() => {
      const answer = findAnswer(q, ohaeng, name);
      setMessages(prev => [...prev, { from: "cat", text: answer }]);
      setTyping(false);
      setSuggestions(QA_CATEGORIES.map(cat => {
        const pick = cat.items[Math.floor(Math.random() * cat.items.length)];
        return pick.question;
      }));
    }, 900);
  };

  return (
    <>
      <div style={{ marginTop: 20, borderRadius: 20, overflow: "hidden", boxShadow: "0 10px 36px rgba(139,92,246,0.2)", border: "1.5px solid #e9d5ff", background: "#f9f5ff", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>

        {/* 헤더 */}
        <div style={{ background: "white", borderBottom: "1px solid #f3e8ff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🐱</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 900, background: "linear-gradient(135deg, #ec4899, #8b5cf6, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "qaSparkle 1.8s ease-in-out infinite" }}>복냥이 사주 상담</p>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: remaining > 0 || unlocked ? "#8b5cf6" : "#ef4444" }}>
              {unlocked ? "무제한 질문 가능" : `오늘 남은 질문 ${remaining}회`}
            </p>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div ref={msgAreaRef} style={{ height: 190, overflowY: "auto", padding: "12px 14px 8px", display: "flex", flexDirection: "column", gap: 10, background: "#f9f5ff" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", gap: 6, alignItems: "flex-end" }}>
              {msg.from === "cat" && (
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🐱</div>
              )}
              <div style={{
                maxWidth: "75%", padding: "10px 13px",
                borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                background: msg.from === "user" ? "linear-gradient(135deg,#ec4899,#8b5cf6)" : "white",
                color: msg.from === "user" ? "white" : "#1a1a2e",
                fontSize: 12, fontWeight: 600, lineHeight: 1.7,
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)", whiteSpace: "pre-line",
              }}>{msg.text}</div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🐱</div>
              <div style={{ background: "white", borderRadius: "4px 16px 16px 16px", padding: "10px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", display: "flex", gap: 4, alignItems: "center" }}>
                {[0,1,2].map(n => <div key={n} style={{ width: 6, height: 6, borderRadius: "50%", background: "#c4b5fd", animation: `qaWidgetBounce 0.9s ${n*0.15}s infinite` }} />)}
              </div>
            </div>
          )}
        </div>

        {/* 추천 질문 칩 */}
        {suggestions.length > 0 && !typing && (
          <div style={{ background: "white", borderTop: "1px solid #f3e8ff", padding: "6px 10px", display: "flex", gap: 6, overflowX: "auto" }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMsg(s)} style={{
                flexShrink: 0, padding: "6px 12px",
                background: CHIP_COLORS[i % CHIP_COLORS.length],
                border: "none", borderRadius: 50,
                fontSize: 10, fontWeight: 800, color: "white",
                cursor: "pointer", whiteSpace: "nowrap",
              }}>
                {s.length > 16 ? s.slice(0,15)+"…" : s}
              </button>
            ))}
          </div>
        )}

        {/* 노란 구분선 — 혜성이 달리는 애니메이션 */}
        <QAYellowLine />

        {/* 360개 질문 목록 버튼 */}
        <div style={{ background: "white", padding: "8px 10px 0" }}>
          <button onClick={() => setShowQList(true)} style={{
            width: "100%", padding: "10px 0",
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            border: "none", borderRadius: 12,
            fontSize: 13, fontWeight: 900, color: "white",
            cursor: "pointer", letterSpacing: "-0.3px",
            boxShadow: "0 4px 14px rgba(139,92,246,0.35)",
          }}>📋 360개 질문 목록 보기 (탭하면 바로 답변!)</button>
        </div>

        {/* 입력창 */}
        <div style={{ background: "white", padding: "8px 10px", display: "flex", gap: 6 }}>
          <input
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") sendMsg(); }}
            placeholder="직접 질문하거나 위 버튼 눌러봐..."
            style={{ flex: 1, padding: "10px 14px", borderRadius: 50, border: "1.5px solid #e9d5ff", fontSize: 12, fontWeight: 600, color: "#374151", background: "#fdf4ff", outline: "none" }}
          />
          <button onClick={() => sendMsg()} style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "white", border: "none", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>↑</button>
        </div>
      </div>

      {/* 질문 목록 바텀시트 */}
      {showQList && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300 }} onClick={() => setShowQList(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 16px 10px" }}>
              <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 14px" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 900, color: "#1a1a2e" }}>📋 질문 목록</h3>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#8b5cf6" }}>카테고리마다 40개 질문 · 원하는 질문 탭하면 바로 답변!</p>
                </div>
                <button onClick={() => setShowQList(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9ca3af" }}>✕</button>
              </div>
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
            <div style={{ overflowY: "auto", padding: "4px 16px 32px", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {(QA_CATEGORIES.find(c => c.id === qListCat)?.items ?? []).map((item, idx) => (
                  <button key={idx} onClick={() => { setShowQList(false); sendMsg(item.question); }} style={{
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

      {/* 구매 유도 바텀시트 */}
      {showBuyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 300 }} onClick={() => setShowBuyModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, padding: "20px 16px 32px" }}>
            <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 14px" }} />
            <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1a1a2e", margin: "0 0 3px", textAlign: "center" }}>운세를 구매하고 더 알아봐! 🔮</h3>
            <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, margin: "0 0 14px", textAlign: "center" }}>구매하면 Q&A 전체 열람 + 무제한 질문 가능</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
              {PKGS.map(p => (
                <button key={p.id}
                  onClick={() => { setShowBuyModal(false); router.push(`/main-v2/payment?preselect=${p.id}&scrollTo=packages`); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "#fdf4ff", border: "1.5px solid #e9d5ff", borderRadius: 12, cursor: "pointer" }}
                >
                  <div style={{ textAlign: "left" }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>📦 {p.label}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "#6b7280", fontWeight: 700 }}>{p.desc}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#ec4899", flexShrink: 0 }}>{p.price}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowBuyModal(false)} style={{ width: "100%", padding: 12, background: "none", border: "none", fontWeight: 800, fontSize: 14, color: "#374151", cursor: "pointer" }}>나중에 할게</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes qaWidgetBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes qaSparkle { 0%,100%{filter:brightness(1) drop-shadow(0 0 0 transparent)} 50%{filter:brightness(1.5) drop-shadow(0 0 8px rgba(236,72,153,0.9))} }
      `}</style>
    </>
  );
}
