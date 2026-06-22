"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const SELECT_CATS = [
  { key: "💰 재물운", scoreKey: "wealth",  color: "#f59e0b", icon: "💰" },
  { key: "💕 연애운", scoreKey: "love",    color: "#ec4899", icon: "💕" },
  { key: "💪 건강운", scoreKey: "health",  color: "#10b981", icon: "💪" },
  { key: "🎯 성공운", scoreKey: "success", color: "#8b5cf6", icon: "🎯" },
  { key: "✨ 총운",   scoreKey: "total",   color: "#6366f1", icon: "✨" },
];

interface Item {
  id: string; date: string; name: string; category: string;
  scores: { total: number; wealth: number; love: number; health: number; success: number };
  analysis: string;
  isPaid?: boolean;
  planType?: string;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const sc = (s: number) => s >= 80 ? "#10b981" : s >= 65 ? "#f59e0b" : "#ec4899";

// ── 선택 모달 컴포넌트 ──
function SelectModal({ onClose, onPay, paying }: {
  onClose: () => void;
  onPay: (cats: string[]) => void;
  paying: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(SELECT_CATS.map(c => c.key));
  const price = selected.length * 990;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: "100%", maxWidth: 480, background: "white", borderRadius: "28px 28px 0 0", padding: "28px 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 20px" }} />

        <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>어떤 운세를 확인할까요?</h2>
        <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "0 0 20px" }}>
          {selected.length > 0
            ? <><span style={{ color: "#ec4899", fontWeight: 800 }}>{selected.length}개</span> 선택 · <span style={{ color: "#8b5cf6", fontWeight: 800 }}>₩{price.toLocaleString()}</span></>
            : "운세를 선택하세요"}
        </p>

        {/* 전체 선택 */}
        <button
          onClick={() => setSelected(selected.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
          style={{ width: "100%", padding: "10px 16px", marginBottom: 12, background: selected.length === SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selected.length === SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 14, fontWeight: 800, fontSize: 13, color: selected.length === SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <span>✨ 전체 선택</span>
          <span style={{ fontSize: 16 }}>{selected.length === SELECT_CATS.length ? "☑️" : "⬜"}</span>
        </button>

        {/* 개별 카드 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {SELECT_CATS.map(c => {
            const on = selected.includes(c.key);
            return (
              <button key={c.key}
                onClick={() => setSelected(on ? selected.filter(k => k !== c.key) : [...selected, c.key])}
                style={{ padding: "14px 16px", border: `1.5px solid ${on ? c.color : "#e5e7eb"}`, borderRadius: 16, background: on ? `${c.color}10` : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: on ? c.color : "#374151" }}>{c.key.replace(/\S+\s/, "")}</div>
                  </div>
                </div>
                <span style={{ fontSize: 18 }}>{on ? "✅" : "⬜"}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPay(selected)}
          disabled={paying || selected.length === 0}
          style={{ width: "100%", padding: "16px 0", background: selected.length > 0 ? G : "#e5e7eb", color: selected.length > 0 ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: selected.length > 0 ? "pointer" : "not-allowed", boxShadow: selected.length > 0 ? "0 6px 20px rgba(236,72,153,0.35)" : "none" }}
        >
          {paying
            ? "⏳ 분석 중..."
            : selected.length > 0
              ? `💎 ${selected.length}개 운세 보기 · ₩${price.toLocaleString()}`
              : "운세를 선택하세요"}
        </button>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => router.push("/main-v2/payment")}
            style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
            💳 유료 운세 결제하기
          </button>
        </div>
        <button onClick={onClose}
          style={{ width: "100%", marginTop: 10, padding: "12px 0", background: "transparent", color: "#9ca3af", border: "none", fontSize: 13, cursor: "pointer" }}>
          취소
        </button>
      </div>
    </div>
  );
}

export default function V2History() {
  const router = useRouter();
  const [hist, setHist] = useState<Item[]>([]);
  const [showSelect, setShowSelect] = useState(false);
  const [paying, setPaying] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const shareItem = async (item: Item, e: React.MouseEvent) => {
    e.stopPropagation();
    let url = window.location.origin + "/main-v2";
    try {
      const res = await fetch("/api/v2/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name, category: item.category?.replace(/\S+\s/, ""), scores: item.scores, analysis: item.analysis,
        }),
      });
      if (res.ok) { const data = await res.json(); url = `${window.location.origin}/main-v2/share/${data.id}`; }
    } catch {}
    const text = `${item.name}님의 ${item.category?.replace(/\S+\s/, "")} 분석 🔮\n총운 ${item.scores?.total}점\n\n📱 나도 무료로!`;
    if (navigator.share) navigator.share({ title: "점운 운세 결과", text, url }).catch(() => {});
    else navigator.clipboard.writeText(`${text}\n${url}`).then(() => alert("✅ 링크 복사됨!"));
  };

  useEffect(() => {
    const all: Item[] = JSON.parse(localStorage.getItem("v2_history") || "[]");
    setHist(all.filter(item => item.isPaid === true));
  }, []);

  const clear = () => {
    if (confirm("보관함을 모두 삭제하시겠습니까?")) { localStorage.removeItem("v2_history"); setHist([]); }
  };

  const handlePay = async (cats: string[]) => {
    setPaying(true);
    try {
      // 일반 결제 흐름(메인 990원 선택)과 똑같이 결제완료 확인 화면을 거치게 함
      sessionStorage.setItem("v2_paid_cats", JSON.stringify(cats));
      const pkgName = cats.map(c => c.replace(/\S+\s/, "")).join("+");
      const price = cats.length * 990;
      router.push(`/payment-complete?package=${encodeURIComponent(pkgName)}&pages=${cats.length * 30}&paid=${price}`);
    } finally {
      setPaying(false);
      setShowSelect(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
        </button>
        <button onClick={clear} style={{ padding: "5px 12px", background: "#fff1f2", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>전체 삭제</button>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 60px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px" }}>📂 보관함</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>내 운세 분석 기록</p>

        {hist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 20px" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>😿</div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>분석 기록이 없어요</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>운세를 분석하면 여기에 저장됩니다</p>
            <button onClick={() => router.push("/main-v2/payment")}
              style={{ padding: "13px 32px", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>
              💎 지금 결제하고 분석하기
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {hist.map(item => (
              <div key={item.id}
                onClick={() => router.push(`/main-v2/history/${encodeURIComponent(item.id)}`)}
                style={{ background: "white", borderRadius: 20, padding: "18px 16px", border: "1.5px solid rgba(236,72,153,0.1)", boxShadow: "0 2px 14px rgba(139,92,246,0.06)", cursor: "pointer", transition: "transform 0.12s, box-shadow 0.12s" }}
                onTouchStart={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
                onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(236,72,153,0.14)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 14px rgba(139,92,246,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, background: BG, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      {item.category?.split(" ")[0] ?? "✨"}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{item.name}님 · {item.category?.replace(/\S+\s/, "")}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{fmtDate(item.date)}</div>
                      {item.planType === "select"
                        ? <span style={{ fontSize: 9, background: "#f3e8ff", color: "#8b5cf6", border: "1px solid #e9d5ff", padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>💎 990원</span>
                        : <span style={{ fontSize: 9, background: "#fdf2f8", color: "#ec4899", border: "1px solid #fbcfe8", padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>📦 패키지</span>
                      }
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: sc(item.scores?.total ?? 0) }}>{item.scores?.total ?? "—"}</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>총운</div>
                    </div>
                    {item.planType !== "select" && (
                      <button
                        onClick={e => shareItem(item, e)}
                        style={{ padding: "4px 10px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 10, cursor: "pointer" }}
                      >
                        📤 공유
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  {[{ k: "wealth", l: "재물" }, { k: "love", l: "연애" }, { k: "health", l: "건강" }, { k: "success", l: "성공" }].map(s => (
                    <div key={s.k} style={{ background: BG, borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700, color: "#6b7280" }}>
                      {s.l} <span style={{ color: sc(item.scores?.[s.k as keyof typeof item.scores] ?? 0), fontWeight: 900 }}>{item.scores?.[s.k as keyof typeof item.scores] ?? "—"}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6,
                    display: "-webkit-box", WebkitLineClamp: expanded.has(item.id) ? undefined : 3,
                    WebkitBoxOrient: "vertical", overflow: expanded.has(item.id) ? "visible" : "hidden",
                    whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                    {item.analysis}
                  </p>
                  {item.analysis && item.analysis.length > 120 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setExpanded(prev => {
                          const next = new Set(prev);
                          next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                          return next;
                        });
                      }}
                      style={{ marginTop: 6, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#ec4899", padding: 0 }}>
                      {expanded.has(item.id) ? "▲ 접기" : "▼ 더보기"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button onClick={() => setShowSelect(true)}
              style={{ padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: "pointer", marginTop: 4, boxShadow: "0 6px 20px rgba(236,72,153,0.3)" }}>
              💎 다시 분석하기
            </button>
          </div>
        )}
      </div>

      {showSelect && (
        <SelectModal
          onClose={() => setShowSelect(false)}
          onPay={handlePay}
          paying={paying}
        />
      )}
    </main>
  );
}
