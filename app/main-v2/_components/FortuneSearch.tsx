"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type KW = { words: string[]; catKey: string; label: string; emoji: string; payAmount?: number; directPath?: string };

const KEYWORDS: KW[] = [
  { words: ["돈","재물","투자","주식","월급","수입","빚","대출","부자","사업수익","장사","매출"], catKey: "💰 재물운", label: "재물운", emoji: "💰", payAmount: 3900 },
  { words: ["연애","사랑","남자친구","여자친구","짝사랑","이성","고백","데이트","썸","남친","여친","좋아하는"], catKey: "💕 연애운", label: "연애운", emoji: "💕", payAmount: 3900 },
  { words: ["건강","병","아파","피로","다이어트","수술","통증","체력","병원","몸"], catKey: "💪 건강운", label: "건강운", emoji: "💪", payAmount: 3900 },
  { words: ["취직","취업","직장","이직","승진","커리어","면접","자소서","진급","회사","직업"], catKey: "🎯 성공운", label: "성공운", emoji: "🎯", payAmount: 3900 },
  { words: ["결혼","궁합","배우자","프러포즈","혼인","신혼","시댁","장인"], catKey: "💍 결혼·궁합운", label: "결혼궁합", emoji: "💍", payAmount: 990 },
  { words: ["재회","헤어진","전남친","전여친","전남자","전여자","다시만나","다시연락"], catKey: "💔 재회운", label: "재회운", emoji: "💔", payAmount: 2900 },
  { words: ["이혼","이별","별거","파경","갈라서"], catKey: "🌱 이혼운세", label: "이혼운세", emoji: "🌱", payAmount: 990 },
  { words: ["올해","2026","신년","운세","총운","전체"], catKey: "☀️ 올해 운세", label: "올해운세", emoji: "☀️", payAmount: 3900 },
  { words: ["반려동물","강아지","고양이","펫","애완"], catKey: "🐾 반려동물 궁합", label: "반려동물궁합", emoji: "🐾", payAmount: 2900 },
  { words: ["이사","날짜","택일","좋은날","길일"], catKey: "📅 택일", label: "택일", emoji: "📅", directPath: "/main-v2/taegil" },
  { words: ["사업","창업","동업","직원","거래처","가게","매장"], catKey: "💼 사업운", label: "사업운", emoji: "💼", payAmount: 3900 },
  { words: ["대운","10년","십년","큰운"], catKey: "🌌 대운", label: "대운(大運)", emoji: "🌌", directPath: "/main-v2/daewoon/pay" },
];

function match(query: string): KW | null {
  const q = query.toLowerCase().replace(/\s/g, "");
  for (const k of KEYWORDS) {
    if (k.words.some(w => q.includes(w))) return k;
  }
  return null;
}

export default function FortuneSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState<KW | null>(null);

  const handleChange = (v: string) => {
    setQuery(v);
    setSuggestion(v.trim().length >= 2 ? match(v) : null);
  };

  const navigate = (m: KW) => {
    sessionStorage.setItem("v2_search_cat", m.catKey);
    if (m.directPath) {
      router.push(m.directPath);
    } else if (m.payAmount) {
      sessionStorage.setItem("v2_paid_cats", JSON.stringify([m.catKey]));
      router.push(`/main-v2/pay?amount=${m.payAmount}&next=${encodeURIComponent(`/payment-complete?package=${encodeURIComponent(m.label)}&pages=30&paid=${m.payAmount}`)}`);
    } else {
      router.push("/main-v2/payment");
    }
  };

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    const m = match(q);
    if (m) navigate(m);
    else router.push("/main-v2/payment");
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px 8px" }}>
      <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "14px 16px", boxShadow: "0 4px 20px rgba(236,72,153,0.15)", border: "1.5px solid rgba(236,72,153,0.2)" }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: "#ec4899", margin: "0 0 8px", textAlign: "center" }}>🔍 고민 검색</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="고민을 입력해보세요. 예) 올해 취직 될까요?"
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(236,72,153,0.3)", fontSize: 13, outline: "none", fontFamily: "inherit", background: "white", color: "#1f2937" }}
          />
          <button
            onClick={handleSearch}
            style={{ padding: "10px 18px", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}
          >검색</button>
        </div>
        {suggestion && (
          <button
            onClick={() => navigate(suggestion)}
            style={{ marginTop: 8, width: "100%", padding: "8px 12px", background: "linear-gradient(135deg,rgba(236,72,153,0.08),rgba(139,92,246,0.08))", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 10, cursor: "pointer", textAlign: "left", fontSize: 12, color: "#7c3aed", fontWeight: 700 }}
          >
            {suggestion.emoji} {suggestion.label} 보러가기 →
          </button>
        )}
        <p style={{ fontSize: 10, color: "#9ca3af", margin: "8px 0 0", textAlign: "center" }}>
          돈 · 연애 · 건강 · 직장 · 결혼 · 재회 · 대운 · 택일
        </p>
      </div>
    </div>
  );
}
