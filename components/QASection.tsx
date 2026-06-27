"use client";

import { useState } from "react";
import { QA_CATEGORIES, getOhaeng, fillTemplate } from "@/lib/qa/index";
import type { Ohaeng, QACategory } from "@/lib/qa/index";

const FREE_COUNT = 5;

interface Props {
  name: string;
  birthYear: number;
  unlocked?: boolean;
  onBuyClick?: () => void;
}

export default function QASection({ name, birthYear, unlocked = false, onBuyClick }: Props) {
  const ohaeng: Ohaeng = getOhaeng(birthYear);
  const [activeCatId, setActiveCatId] = useState(QA_CATEGORIES[0].id);
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const cat: QACategory = QA_CATEGORIES.find(c => c.id === activeCatId) ?? QA_CATEGORIES[0];

  const isSearching = searchQuery.trim().length > 0;

  // 검색 시 전체 카테고리에서 매칭되는 질문 추출
  const searchResults = isSearching
    ? QA_CATEGORIES.flatMap(c =>
        c.items
          .map((item, idx) => ({ item, idx, cat: c }))
          .filter(({ item }) => item.question.includes(searchQuery.trim()))
      )
    : [];

  const renderQAItem = (
    item: { question: string; answers: Record<Ohaeng, string> },
    idx: number,
    catId: string,
    isFreeItem: boolean
  ) => {
    const key = `${catId}-${idx}`;
    const isOpen = openIdx === key;
    const answer = fillTemplate(item.answers[ohaeng], name);

    return (
      <div key={key}
        style={{
          background: "white",
          borderRadius: 14,
          border: `1.5px solid ${isOpen ? "#ec4899" : "#f3e8ff"}`,
          overflow: "hidden",
          boxShadow: isOpen ? "0 4px 16px rgba(236,72,153,0.1)" : "none",
        }}
      >
        <button
          onClick={() => {
            if (!isFreeItem) return;
            setOpenIdx(isOpen ? null : key);
          }}
          style={{
            width: "100%",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            background: "transparent",
            border: "none",
            cursor: isFreeItem ? "pointer" : "default",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              color: isFreeItem ? "#8b5cf6" : "#d1d5db",
              background: isFreeItem ? "#f3e8ff" : "#f9fafb",
              padding: "2px 7px",
              borderRadius: 20,
              flexShrink: 0,
            }}>
              {isFreeItem ? `Q${idx + 1}` : "🔒"}
            </span>
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: isFreeItem ? "#1a1a2e" : "#9ca3af",
              lineHeight: 1.4,
            }}>
              {item.question}
            </span>
          </div>
          {isFreeItem && (
            <span style={{ fontSize: 16, flexShrink: 0, color: "#ec4899" }}>
              {isOpen ? "▲" : "▼"}
            </span>
          )}
        </button>

        {isFreeItem && isOpen && (
          <div style={{ padding: "0 16px 16px", borderTop: "1px solid #fde8f6" }}>
            <div style={{
              background: "linear-gradient(135deg, #fdf2f8, #ede9fe)",
              borderRadius: 10,
              padding: "12px 14px",
              marginTop: 10,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                {answer}
              </p>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 10, color: "#8b5cf6", fontWeight: 700, background: "#f3e8ff", padding: "2px 8px", borderRadius: 20 }}>
                  {ohaeng}오행 답변
                </span>
              </div>
            </div>
          </div>
        )}

        {!isFreeItem && (
          <div style={{ padding: "0 16px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#d1d5db", fontWeight: 600 }}>
              사주 구매 후 전체 Q&amp;A가 열려요
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: 32, padding: "0 4px" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>
          🔮 사주 Q&amp;A
        </h2>
        <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, margin: 0 }}>
          {unlocked
            ? `${name}님 오행(${ohaeng}) 기준 — 전체 질문 열람 가능해`
            : `궁금한 걸 눌러봐 — ${name}님 오행(${ohaeng}) 기준으로 답해줘`}
        </p>
      </div>

      {/* 검색창 */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setOpenIdx(null); }}
          placeholder="🔍 궁금한 거 검색해봐 (예: 돈, 연애, 취업)"
          style={{
            width: "100%",
            padding: "11px 40px 11px 14px",
            borderRadius: 50,
            border: "1.5px solid #e9d5ff",
            fontSize: 13,
            fontWeight: 600,
            color: "#374151",
            background: "#fdf4ff",
            boxSizing: "border-box",
            outline: "none",
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
              fontSize: 16,
              lineHeight: 1,
            }}
          >×</button>
        )}
      </div>

      {/* 검색 결과 */}
      {isSearching ? (
        <div>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
              "{searchQuery}" 관련 질문이 없어요
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, margin: "0 0 8px 4px" }}>
                검색 결과 {searchResults.length}개
              </p>
              {searchResults.map(({ item, idx, cat: c }) => {
                const isFreeItem = unlocked || idx < FREE_COUNT;
                return (
                  <div key={`${c.id}-${idx}`}>
                    <p style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, margin: "0 0 4px 4px" }}>
                      {c.emoji} {c.label}
                    </p>
                    {renderQAItem(item, idx, c.id, isFreeItem)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 카테고리 탭 */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 16, scrollbarWidth: "none" }}>
            {QA_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => { setActiveCatId(c.id); setOpenIdx(null); }}
                style={{
                  flexShrink: 0,
                  padding: "7px 14px",
                  background: activeCatId === c.id
                    ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
                    : "#f3f4f6",
                  color: activeCatId === c.id ? "white" : "#374151",
                  border: "none",
                  borderRadius: 50,
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Q&A 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cat.items.map((item, idx) => {
              const isFreeItem = unlocked || idx < FREE_COUNT;
              return renderQAItem(item, idx, cat.id, isFreeItem);
            })}
          </div>
        </>
      )}

      {/* 잠금 해제 배너 — 무료일 때만 */}
      {!unlocked && !isSearching && (
        <div style={{
          marginTop: 20,
          padding: "16px",
          background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
          borderRadius: 16,
          textAlign: "center",
          color: "white",
        }}>
          <p style={{ fontSize: 13, fontWeight: 900, margin: "0 0 4px" }}>
            🔓 {name}님 사주에 맞는 Q&amp;A 전체 열기
          </p>
          <p style={{ fontSize: 11, fontWeight: 600, margin: "0 0 12px", opacity: 0.85 }}>
            9개 카테고리 × 40개 질문 = 360개 전체 공개
          </p>
          <button
            onClick={() => onBuyClick ? onBuyClick() : window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              padding: "10px 24px",
              background: "white",
              color: "#ec4899",
              border: "none",
              borderRadius: 50,
              fontWeight: 900,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            💎 운세 구매하고 전체 보기
          </button>
        </div>
      )}
    </div>
  );
}
