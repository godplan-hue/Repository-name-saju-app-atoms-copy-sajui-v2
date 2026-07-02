"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { QA_CATEGORIES, getOhaeng, fillTemplate } from "@/lib/qa/index";
import type { Ohaeng, QACategory } from "@/lib/qa/index";

const QA_SPECIAL_990 = [
  { id: "sinyeon",         emoji: "🎍", label: "신년운세",     price: 990,  red: false },
  { id: "love_detail",     emoji: "💝", label: "연애사주",     price: 990,  red: false },
  { id: "findmatch",       emoji: "🔮", label: "내 사람 찾기", price: 990,  red: false },
  { id: "marriage_detail", emoji: "💍", label: "결혼사주",     price: 990,  red: false },
  { id: "divorce",         emoji: "🌱", label: "이혼운세",     price: 990,  red: false },
  { id: "sinyeon_premium", emoji: "📅", label: "신년+월별12달", price: 4900, red: true  },
];
const QA_SPECIAL_2900 = [
  { id: "daeun",      emoji: "🌌", label: "대운(大運)",   daeun: true },
  { id: "reunion",    emoji: "💔", label: "재회운" },
  { id: "taegil",     emoji: "📅", label: "택일(擇日)" },
  { id: "pet_compat", emoji: "🐾", label: "반려동물 궁합" },
];
const QA_OLD_SINGLES = [
  { id: "재물운", label: "재물운" },
  { id: "연애운", label: "연애운" },
  { id: "건강운", label: "건강운" },
  { id: "성공운", label: "성공운" },
  { id: "총운",   label: "총운" },
];
const QA_PKGS = [
  { id: "basic",    label: "기본 분석", price: "₩9,900",  paid: 9900,  pages: 30,  desc: "재물운 + 연애운" },
  { id: "standard", label: "베이직",    price: "₩19,900", paid: 19900, pages: 75,  desc: "올해 + 재물 + 연애 + 월별" },
  { id: "premium",  label: "프리미엄",  price: "₩24,900", paid: 24900, pages: 100, desc: "올해 + 재물 + 연애 + 월별 + 건강" },
  { id: "vip",      label: "VIP 커플팩", price: "₩29,900", paid: 29900, pages: 150, desc: "본인 분석(8개) +<br/>이름+전체사주+궁합포함<br/>(상대방 정보 입력)" },
];

const FREE_COUNT = 3;

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

interface Props {
  name: string;
  birthYear: number;
  unlocked?: boolean;
  onBuyClick?: () => void;
}

export default function QASection({ name, birthYear, unlocked = false, onBuyClick }: Props) {
  const router = useRouter();
  const ohaeng: Ohaeng = getOhaeng(birthYear);
  const [activeCatId, setActiveCatId] = useState(QA_CATEGORIES[0].id);
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [todayFreeCatId, setTodayFreeCatId] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [awaitOther, setAwaitOther] = useState<{id: string} | null>(null);
  const [otherInput, setOtherInput] = useState("");
  const answerRef = useRef<HTMLDivElement>(null);
  const buyModalRef = useRef<HTMLDivElement>(null);

  const openPayment = () => setShowBuyModal(true);

  useEffect(() => {
    const saved = localStorage.getItem(`v2_qa_free_cat_${name}_${birthYear}_${todayKey()}`);
    setTodayFreeCatId(saved ?? null);
  }, [name, birthYear]);

  useEffect(() => {
    if (openIdx && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [openIdx]);

  useEffect(() => {
    if (!showBuyModal) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const panel = buyModalRef.current;
      if (!panel) return;
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      panel.style.bottom = `${Math.max(0, offset)}px`;
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => { vv.removeEventListener("resize", update); vv.removeEventListener("scroll", update); };
  }, [showBuyModal]);

  const chooseFreeCategory = (catId: string) => {
    localStorage.setItem(`v2_qa_free_cat_${name}_${birthYear}_${todayKey()}`, catId);
    setTodayFreeCatId(catId);
    setActiveCatId(catId);
    setOpenIdx(null);
  };

  const cat: QACategory = QA_CATEGORIES.find(c => c.id === activeCatId) ?? QA_CATEGORIES[0];
  const freeCat = QA_CATEGORIES.find(c => c.id === todayFreeCatId);

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
    <>
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

      {/* 구매 유도 배너 — 항상 표시 (결제 후엔 더 구매 버튼으로) */}
      {unlocked ? (
        <div style={{ marginBottom: 14, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setShowBuyModal(true)} style={{ padding: "7px 16px", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "white", border: "none", borderRadius: 20, fontSize: 11, fontWeight: 900, cursor: "pointer", boxShadow: "0 3px 10px rgba(236,72,153,0.3)" }}>💳 운세 추가 구매</button>
        </div>
      ) : (
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
            <p style={{ fontSize: 13, margin: "0 0 1px", fontWeight: 900 }}>🔓 Q&amp;A 전체 + 복냥이 무제한 같이 열어볼래?</p>
            <p style={{ fontSize: 10, fontWeight: 700, margin: 0, opacity: 0.9 }}>
              결제하면 360개 질문 전체 + 복냥이 채팅 무제한 하루 가능!
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
          {/* 오늘의 무료 카테고리 안내 */}
          {!unlocked && (
            todayFreeCatId === null ? (
              <div style={{ background: "linear-gradient(135deg, #fce7f3, #ede9fe)", borderRadius: 14, padding: "12px 16px", marginBottom: 12, border: "1.5px solid #ec4899", textAlign: "center" }}>
                <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 900, color: "#be185d" }}>👇 오늘 무료로 볼 카테고리 1개를 골라봐!</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#6b7280" }}>선택한 카테고리의 Q1~Q3을 오늘 무료로 볼 수 있어</p>
              </div>
            ) : (
              <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "8px 14px", marginBottom: 10, border: "1.5px solid #86efac", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: "#16a34a" }}>✅ 오늘 무료: {freeCat?.emoji} {freeCat?.label}</span>
                <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>· 내일 다시 선택 가능</span>
              </div>
            )
          )}

          {/* 카테고리 탭 — 3열 그리드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 16 }}>
            {QA_CATEGORIES.map(c => {
              const isActive = activeCatId === c.id;
              const isFree = c.id === todayFreeCatId;
              const isOtherLocked = !unlocked && todayFreeCatId !== null && !isFree;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    if (!unlocked && todayFreeCatId === null) {
                      chooseFreeCategory(c.id);
                      return;
                    }
                    setActiveCatId(c.id);
                    setOpenIdx(null);
                  }}
                  style={{
                    padding: "8px 4px",
                    background: isActive
                      ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
                      : isFree ? "#f0fdf4"
                      : isOtherLocked ? "#f9f5ff"
                      : "white",
                    color: isActive ? "white" : isFree ? "#16a34a" : isOtherLocked ? "#c4b5fd" : "#6b7280",
                    border: isActive ? "none" : isFree ? "1.5px solid #86efac" : "1.5px solid #e5e7eb",
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "center",
                    boxShadow: isActive ? "0 4px 12px rgba(236,72,153,0.3)" : "none",
                    position: "relative",
                  }}
                >
                  {c.emoji} {c.label}
                  {isFree && !isActive && <span style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#16a34a" }}>✅ 무료</span>}
                  {isOtherLocked && <span style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#c4b5fd" }}>🔒</span>}
                </button>
              );
            })}
          </div>

          {/* 선택된 질문 답변 — 카테고리 탭과 질문 그리드 사이 */}
          {openIdx && openIdx.startsWith(cat.id + "-") && (() => {
            const idx = Number(openIdx.split("-")[1]);
            const item = cat.items[idx];
            if (!item) return null;
            const answer = fillTemplate(item.answers[ohaeng], name);
            return (
              <div ref={answerRef} style={{ background: "white", borderRadius: 14, border: "2px solid #ec4899", overflow: "hidden", marginBottom: 12, boxShadow: "0 4px 20px rgba(236,72,153,0.15)" }}>
                <div style={{ padding: "12px 16px 10px", background: "linear-gradient(135deg, #fff0f9, #f5f0ff)", borderBottom: "1px solid #fce7f3" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "white", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", padding: "3px 9px", borderRadius: 20, flexShrink: 0 }}>Q{idx + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{item.question}</span>
                  </div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ background: "linear-gradient(135deg, #fff0f9, #ede9fe)", borderRadius: 12, padding: "14px 16px", borderLeft: "3px solid #ec4899" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", lineHeight: 1.8, margin: 0 }}>{answer}</p>
                    <div style={{ marginTop: 10 }}>
                      <span style={{ fontSize: 10, color: "white", fontWeight: 800, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", padding: "2px 10px", borderRadius: 20 }}>
                        {ohaeng}오행 · {name}님 맞춤 답변
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Q&A 목록 — 4열 그리드, 전체 질문 한눈에 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 10 }}>
            {cat.items.map((item, idx) => {
              const isLocked = !unlocked && (activeCatId !== todayFreeCatId || idx >= FREE_COUNT);
              const key = `${cat.id}-${idx}`;
              const isSelected = openIdx === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (isLocked) { openPayment(); return; }
                    setOpenIdx(isSelected ? null : key);
                  }}
                  style={{
                    padding: "7px 5px",
                    background: isSelected
                      ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
                      : isLocked ? "#f9f5ff" : "white",
                    color: isSelected ? "white" : isLocked ? "#c4b5fd" : "#1a1a2e",
                    border: `1.5px solid ${isSelected ? "transparent" : isLocked ? "#e9d5ff" : "#f0e6ff"}`,
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: 1.4,
                    boxShadow: isSelected ? "0 4px 12px rgba(236,72,153,0.3)" : "none",
                    minHeight: 56,
                  }}
                >
                  <span style={{
                    fontSize: 9, fontWeight: 900, display: "block", marginBottom: 2,
                    color: isSelected ? "rgba(255,255,255,0.85)" : isLocked ? "#c4b5fd" : "#ec4899",
                  }}>
                    Q{idx + 1}{isLocked ? " 🔒" : ""}
                  </span>
                  <span style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontSize: 10,
                  } as React.CSSProperties}>
                    {item.question}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 비결제 시 구매 유도 */}
          {!unlocked && (
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <button
                onClick={openPayment}
                style={{ padding: "9px 22px", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 12, cursor: "pointer" }}
              >💎 구매하고 Q&amp;A 전체 열기</button>
            </div>
          )}
        </>
      )}

    </div>

    {/* 결제 바텀시트 */}
    {showBuyModal && (
      <>
        <div onClick={() => setShowBuyModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300 }} />
        <div ref={buyModalRef} style={{ position: "fixed", bottom: 0, left: 0, right: 0, margin: "0 auto", maxWidth: 480, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "88vh", overflowY: "auto", overscrollBehavior: "contain", padding: "12px 14px 20px", zIndex: 301, willChange: "transform", transform: "translateZ(0)" }}>
          <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: 15, fontWeight: 900, color: "#1a1a2e", margin: "0 0 2px", textAlign: "center" }}>운세를 구매하고 더 알아봐! 🔮</h3>
          <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, margin: "0 0 14px", textAlign: "center" }}>결제하면 Q&amp;A 전체 열람 하루 동안 가능!</p>

          <p style={{ fontSize: 11, fontWeight: 900, color: "#6d28d9", margin: "0 0 6px" }}>⚡ 신규 990원</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5, marginBottom: 10 }}>
            {QA_SPECIAL_990.map(s => (
              <button key={s.id} onClick={() => { setShowBuyModal(false); router.push(`/payment-complete?special=${s.id}&paid=${s.price}`); }}
                style={{ padding: "9px 5px", background: s.red ? "rgba(40,5,5,0.9)" : "#fdf4ff", border: `1.5px solid ${s.red ? "rgba(239,68,68,0.8)" : "#e9d5ff"}`, borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                <p style={{ margin: "0 0 1px", fontSize: 15 }}>{s.emoji}</p>
                <p style={{ margin: "0 0 1px", fontSize: 10, fontWeight: 900, color: s.red ? "#ffffff" : "#1a1a2e", wordBreak: "keep-all", lineHeight: 1.2 }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: s.red ? "#ef4444" : "#ec4899" }}>₩{s.price.toLocaleString()}</p>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 900, color: "#6d28d9", margin: "0 0 6px" }}>💫 특별 2,900원</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 10 }}>
            {QA_SPECIAL_2900.map(s => (
              <button key={s.id} onClick={() => {
                if ((s as any).daeun) { setShowBuyModal(false); router.push(`/main-v2/daewoon/pay`); return; }
                if (s.id === "reunion" || s.id === "pet_compat") { setAwaitOther({ id: s.id }); return; }
                const SPECIAL_TO_CAT: Record<string, string> = { sinyeon: "🎍 신년운세", love_detail: "💗 연애사주", findmatch: "🔍 내 사람 찾기", marriage_detail: "💍 결혼사주", divorce: "🌧 이혼운세" };
                const catLabel = SPECIAL_TO_CAT[s.id];
                setShowBuyModal(false);
                if (catLabel) { sessionStorage.setItem("v2_paid_cats", JSON.stringify([catLabel])); router.push(`/payment-complete?naming=1&queue=${s.id}&paid=2900&package=${encodeURIComponent(s.label)}`); }
                else { router.push(`/payment-complete?special=${s.id}&paid=2900`); }
              }}
                style={{ padding: "9px 5px", background: "#fdf4ff", border: "1.5px solid #e9d5ff", borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                <p style={{ margin: "0 0 1px", fontSize: 15 }}>{s.emoji}</p>
                <p style={{ margin: "0 0 1px", fontSize: 10, fontWeight: 900, color: "#1a1a2e" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: "#7c3aed" }}>₩2,900</p>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 900, color: "#6d28d9", margin: "0 0 6px" }}>✨ 심층 분석 3,900원</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginBottom: 10 }}>
            {QA_OLD_SINGLES.map(s => (
              <button key={s.id} onClick={() => {
                const catKeyMap: Record<string, string> = { "재물운": "💰 재물운", "연애운": "💕 연애운", "건강운": "💪 건강운", "성공운": "🎯 성공운", "총운": "✨ 총운" };
                sessionStorage.setItem("v2_paid_cats", JSON.stringify([catKeyMap[s.id] ?? s.id]));
                setShowBuyModal(false);
                router.push(`/payment-complete?package=${encodeURIComponent(s.label)}&pages=30&paid=3900`);
              }}
                style={{ padding: "8px 3px", background: "#fdf4ff", border: "1.5px solid #e9d5ff", borderRadius: 10, cursor: "pointer", textAlign: "center" }}>
                <p style={{ margin: "0 0 1px", fontSize: 10, fontWeight: 900, color: "#1a1a2e" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: "#6b7280" }}>₩3,900</p>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 900, color: "#6d28d9", margin: "0 0 6px" }}>📦 패키지 (더 저렴해!)</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
            {QA_PKGS.map(p => {
              const pkgEmojis: Record<string, string> = { "기본 분석": "🐱", "베이직": "🌟", "프리미엄": "💎", "VIP 커플팩": "👑" };
              const emoji = pkgEmojis[p.label] ?? "✨";
              return (
                <button key={p.id} onClick={() => { setShowBuyModal(false); router.push(`/payment-complete?package=${encodeURIComponent(p.label)}&pages=${p.pages}&paid=${p.paid}`); }}
                  style={{ padding: "8px 3px", background: "rgba(20,10,40,0.85)", border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 10, cursor: "pointer", textAlign: "center", color: "white" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 18 }}>{emoji}</p>
                  <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 900, wordBreak: "keep-all", lineHeight: 1.3 }}>{p.label}</p>
                  <p style={{ margin: "0 0 3px", fontSize: 7, color: "rgba(255,255,255,0.7)", fontWeight: 600, wordBreak: "keep-all", lineHeight: 1.3 }} dangerouslySetInnerHTML={{ __html: p.desc }} />
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: "#c4b5fd" }}>{p.price}</p>
                </button>
              );
            })}
          </div>
          <button onClick={() => setShowBuyModal(false)} style={{ width: "100%", padding: 12, background: "none", border: "none", fontWeight: 800, fontSize: 14, color: "#374151", cursor: "pointer" }}>나중에 할게</button>
        </div>
      </>
    )}

    {/* 재회운/반려동물 궁합 이름 입력 */}
    {awaitOther && (
      <>
        <div onClick={() => { setAwaitOther(null); setOtherInput(""); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 302 }} />
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, margin: "0 auto", maxWidth: 480, background: "white", borderRadius: "20px 20px 0 0", padding: "20px 18px 32px", zIndex: 303 }}>
          <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 16px" }} />
          <p style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>
            {awaitOther.id === "reunion" ? "💔 상대방 이름을 입력해주세요" : "🐾 반려동물 이름을 입력해주세요"}
          </p>
          <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 700, margin: "0 0 12px" }}>
            {awaitOther.id === "reunion" ? "예: 홍길동" : "예: 멍멍이, 냥냥이"}
          </p>
          <input
            type="text"
            value={otherInput}
            onChange={e => setOtherInput(e.target.value)}
            placeholder={awaitOther.id === "reunion" ? "상대방 이름" : "반려동물 이름"}
            style={{ width: "100%", padding: "12px 14px", fontSize: 14, fontWeight: 700, border: "1.5px solid #e9d5ff", borderRadius: 10, outline: "none", background: "#fdf4ff", color: "#1a1a2e", boxSizing: "border-box", marginBottom: 12 }}
          />
          <button
            onClick={() => {
              if (!otherInput.trim()) return;
              sessionStorage.setItem("specialOtherName", otherInput.trim());
              setAwaitOther(null);
              setOtherInput("");
              setShowBuyModal(false);
              router.push(`/payment-complete?special=${awaitOther.id}&paid=2900`);
            }}
            style={{ width: "100%", padding: "13px 0", background: otherInput.trim() ? "linear-gradient(135deg,#ec4899,#8b5cf6)" : "#e5e7eb", color: otherInput.trim() ? "white" : "#9ca3af", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: otherInput.trim() ? "pointer" : "not-allowed" }}
          >
            💳 결제하기 · ₩2,900
          </button>
        </div>
      </>
    )}
    </>
  );
}
