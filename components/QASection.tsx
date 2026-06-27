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

  // 검색 시 열람 가능한 항목(FREE_COUNT 이내 or unlocked)만 추출
  const searchResults = isSearching
    ? QA_CATEGORIES.flatMap(c =>
        c.items
          .map((item, idx) => ({ item, idx, cat: c }))
          .filter(({ item, idx }) =>
            item.question.includes(searchQuery.trim()) &&
            (unlocked || idx < FREE_COUNT)
          )
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
          border: `2px solid ${isOpen ? "#ec4899" : "#f0e6ff"}`,
          overflow: "hidden",
          boxShadow: isOpen ? "0 4px 20px rgba(236,72,153,0.15)" : "0 2px 8px rgba(139,92,246,0.06)",
          transition: "all 0.2s",
        }}
      >
        <button
          onClick={() => setOpenIdx(isOpen ? null : key)}
          style={{
            width: "100%",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            background: isOpen ? "linear-gradient(135deg, #fff0f9, #f5f0ff)" : "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 900,
              color: "white",
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              padding: "3px 9px",
              borderRadius: 20,
              flexShrink: 0,
              letterSpacing: -0.3,
            }}>
              Q{idx + 1}
            </span>
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1a1a2e",
              lineHeight: 1.4,
            }}>
              {item.question}
            </span>
          </div>
          <span style={{ fontSize: 14, flexShrink: 0, color: "#ec4899", fontWeight: 900 }}>
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div style={{ padding: "0 16px 16px", borderTop: "1.5px solid #fce7f3" }}>
            <div style={{
              background: "linear-gradient(135deg, #fff0f9, #ede9fe)",
              borderRadius: 12,
              padding: "14px 16px",
              marginTop: 12,
              borderLeft: "3px solid #ec4899",
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", lineHeight: 1.8, margin: 0 }}>
                {answer}
              </p>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  fontSize: 10, color: "white", fontWeight: 800,
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  padding: "2px 10px", borderRadius: 20,
                }}>
                  {ohaeng}오행 · {name}님 맞춤 답변
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: 32, padding: "0 4px" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px", textShadow: "0 1px 8px rgba(255,255,255,0.9)" }}>
          🔮 사주 Q&amp;A
        </h2>
        <p style={{ fontSize: 12, color: "#4b3fa0", fontWeight: 800, margin: 0, textShadow: "0 1px 6px rgba(255,255,255,0.95)" }}>
          {unlocked
            ? `${name}님 오행(${ohaeng}) 기준 — 전체 질문 열람 가능`
            : `궁금한 걸 눌러봐 — ${name}님 오행(${ohaeng}) 기준으로 답해줄게`}
        </p>
      </div>

      {/* 구매 유도 배너 — 무료일 때 맨 위에 */}
      {!unlocked && (
        <div style={{
          marginBottom: 14,
          padding: "12px 16px",
          background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          color: "white",
          boxShadow: "0 6px 20px rgba(236,72,153,0.3)",
        }}>
          <div>
            <p style={{ fontSize: 13, margin: "0 0 1px", fontWeight: 900 }}>🔓 전체 Q&amp;A 열어볼래?</p>
            <p style={{ fontSize: 10, fontWeight: 700, margin: 0, opacity: 0.9 }}>
              9카테고리 × 40문항 · {name}님 맞춤 답변
            </p>
          </div>
          <button
            onClick={() => onBuyClick ? onBuyClick() : window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              padding: "8px 16px",
              background: "white",
              color: "#ec4899",
              border: "none",
              borderRadius: 50,
              fontWeight: 900,
              fontSize: 12,
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            💎 전체 보기
          </button>
        </div>
      )}

      {/* 검색창 */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setOpenIdx(null); }}
          placeholder="🔍 궁금한 거 검색해봐 (예: 돈, 연애, 취업)"
          style={{
            width: "100%",
            padding: "12px 42px 12px 16px",
            borderRadius: 50,
            border: "2px solid #e9d5ff",
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
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#e9d5ff",
              border: "none",
              cursor: "pointer",
              color: "#8b5cf6",
              fontSize: 14,
              lineHeight: 1,
              borderRadius: "50%",
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
            }}
          >×</button>
        )}
      </div>

      {/* 검색 결과 */}
      {isSearching ? (
        <div>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
              "{searchQuery}" 관련 질문이 없어
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 800, margin: "0 0 8px 4px" }}>
                <span style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  검색 결과 {searchResults.length}개
                </span>
              </p>
              {searchResults.map(({ item, idx, cat: c }) => (
                <div key={`${c.id}-${idx}`}>
                  <p style={{
                    fontSize: 10, fontWeight: 800, margin: "0 0 4px 4px",
                    color: "white",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 20,
                  }}>
                    {c.emoji} {c.label}
                  </p>
                  {renderQAItem(item, idx, c.id, true)}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 카테고리 탭 — 3열 그리드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 16 }}>
            {QA_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => { setActiveCatId(c.id); setOpenIdx(null); }}
                style={{
                  padding: "8px 4px",
                  background: activeCatId === c.id
                    ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
                    : "white",
                  color: activeCatId === c.id ? "white" : "#6b7280",
                  border: activeCatId === c.id ? "none" : "1.5px solid #e5e7eb",
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: "pointer",
                  textAlign: "center",
                  boxShadow: activeCatId === c.id ? "0 4px 12px rgba(236,72,153,0.3)" : "none",
                }}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Q&A 목록 — 열람 가능(Q1~Q5) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
            {cat.items.slice(0, unlocked ? cat.items.length : FREE_COUNT).map((item, idx) =>
              renderQAItem(item, idx, cat.id, true)
            )}
          </div>

          {/* 잠긴 항목 — 3열 미니 카드 */}
          {!unlocked && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {cat.items.slice(FREE_COUNT).map((_, idx) => (
                <div key={`locked-${idx}`}
                  style={{
                    background: "#f0e8ff",
                    borderRadius: 10,
                    border: "1px dashed #c4b5fd",
                    padding: "10px 8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ fontSize: 13 }}>🔒</span>
                  <div style={{ height: 7, borderRadius: 4, background: "#c4b5fd", width: "80%" }} />
                  <div style={{ height: 6, borderRadius: 4, background: "#ddd6fe", width: "55%" }} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
