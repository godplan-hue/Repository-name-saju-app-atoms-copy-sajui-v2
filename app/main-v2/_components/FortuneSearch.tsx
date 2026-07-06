"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type KW = {
  words: string[];
  label: string;
  emoji: string;
  catKey?: string;       // wealth5 모달에 pre-select할 카테고리
  modalId?: string;      // 특수 모달 ID (reunion, pet_compat 등)
  directPath?: string;   // 바로 이동
};

const KEYWORDS: KW[] = [
  { words: ["돈","재물","투자","주식","월급","수입","빚","대출","부자","장사","매출","재테크"], label: "재물운", emoji: "💰", catKey: "💰 재물운" },
  { words: ["연애","사랑","남자친구","여자친구","짝사랑","이성","고백","데이트","썸","남친","여친","좋아"], label: "연애운", emoji: "💕", catKey: "💕 연애운" },
  { words: ["건강","병","아파","피로","다이어트","수술","통증","체력","병원","몸"], label: "건강운", emoji: "💪", catKey: "💪 건강운" },
  { words: ["올해","2026","신년","연간운세"], label: "올해 운세", emoji: "☀️", directPath: "/main-v2/payment" },
  { words: ["성공","목표","도전","커리어","인정","승진"], label: "성공운", emoji: "🎯", catKey: "🎯 성공운" },
  { words: ["사업","창업","동업","매출","가게","매장","장사"], label: "사업운", emoji: "💼", catKey: "🎯 성공운" },
  { words: ["총운","전체운","종합운","전반적","인생운"], label: "총운", emoji: "✨", catKey: "✨ 총운" },
  { words: ["결혼","배우자","궁합","프러포즈","혼인","신혼"], label: "결혼·궁합", emoji: "💍", directPath: "/main-v2/payment" },
  { words: ["재회","헤어진","전남친","전여친","다시만나","복합"], label: "재회운", emoji: "💔", modalId: "reunion" },
  { words: ["이혼","이별","별거","파경","갈라서"], label: "이혼운세", emoji: "🌱", directPath: "/main-v2/payment" },
  { words: ["반려동물","강아지","고양이","펫","애완"], label: "반려동물 궁합", emoji: "🐾", modalId: "pet_compat" },
  { words: ["이사","날짜","택일","좋은날","길일"], label: "택일", emoji: "📅", directPath: "/main-v2/taegil" },
  { words: ["대운","10년","십년","큰운","인생운"], label: "대운(大運)", emoji: "🌌", directPath: "/main-v2/daewoon/pay" },
];

function match(query: string): KW | null {
  const q = query.toLowerCase().replace(/\s/g, "");
  for (const k of KEYWORDS) {
    if (k.words.some(w => q.includes(w))) return k;
  }
  return null;
}

interface Props {
  onOpenModal?: (catKey: string | null, modalId?: string) => void;
}

export default function FortuneSearch({ onOpenModal }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState<KW | null>(null);

  const handleChange = (v: string) => {
    setQuery(v);
    setSuggestion(v.trim().length >= 2 ? match(v) : null);
  };

  const navigate = (m: KW) => {
    if (m.directPath) {
      router.push(m.directPath);
    } else if (m.modalId && onOpenModal) {
      onOpenModal(null, m.modalId);
    } else if (m.catKey && onOpenModal) {
      onOpenModal(m.catKey);
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
        <p style={{ fontSize: 12, fontWeight: 800, color: "#ec4899", margin: "0 0 8px", textAlign: "center" }}>🔍 재물운 · 연애운 · 건강운 · 성공운 · 총운 검색</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="예) 올해 연애운 어때? / 사업 잘 될까?"
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
      </div>
    </div>
  );
}
