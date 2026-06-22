"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const SELECT_CATS = [
  { key: "💰 재물운", scoreKey: "wealth",  color: "#f59e0b", icon: "💰" },
  { key: "💕 연애운", scoreKey: "love",    color: "#ec4899", icon: "💕" },
  { key: "💪 건강운", scoreKey: "health",  color: "#10b981", icon: "💪" },
  { key: "🎯 성공운", scoreKey: "success", color: "#8b5cf6", icon: "🎯" },
  { key: "✨ 총운",   scoreKey: "total",   color: "#6366f1", icon: "✨" },
];

function SelectModal({ onClose, onPay, paying }: {
  onClose: () => void;
  onPay: (cats: string[]) => void;
  paying: boolean;
}) {
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
        <button
          onClick={() => setSelected(selected.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
          style={{ width: "100%", padding: "10px 16px", marginBottom: 12, background: selected.length === SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selected.length === SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 14, fontWeight: 800, fontSize: 13, color: selected.length === SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <span>✨ 전체 선택</span>
          <span style={{ fontSize: 16 }}>{selected.length === SELECT_CATS.length ? "☑️" : "⬜"}</span>
        </button>
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
          {paying ? "⏳ 분석 중..." : selected.length > 0 ? `💎 ${selected.length}개 운세 보기 · ₩${price.toLocaleString()}` : "운세를 선택하세요"}
        </button>
        <button onClick={onClose}
          style={{ width: "100%", marginTop: 10, padding: "12px 0", background: "transparent", color: "#9ca3af", border: "none", fontSize: 13, cursor: "pointer" }}>
          취소
        </button>
      </div>
    </div>
  );
}

function Bar({ label, score, color }: { label: string; score: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 300); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{score}점</span>
      </div>
      <div style={{ height: 7, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: G, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryDetail() {
  const router = useRouter();
  const params = useParams();
  const cardRef = useRef<HTMLDivElement>(null);
  const [item, setItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const hist: any[] = JSON.parse(localStorage.getItem("v2_history") || "[]");
    const found = hist.find(h => String(h.id) === String(params.id));
    if (!found) { router.replace("/main-v2/history"); return; }
    setItem(found);
  }, [params.id]);

  const saveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#fdf2f8",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `점운_${item?.name ?? "운세"}_${item?.category?.replace(/\S+\s/, "") ?? ""}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handlePay = async (cats: string[]) => {
    setPaying(true);
    try {
      const profile = sessionStorage.getItem("v2_profile");
      if (!profile) {
        sessionStorage.setItem("v2_paid", "1");
        router.push("/main-v2/profile");
        return;
      }
      const p = JSON.parse(profile);
      const category = cats[0] ?? "💰 재물운";
      const res = await fetch("/api/v2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: p.name,
          birth: `${p.birthYear}-${p.birthMonth}-${p.birthDay}`,
          birthHour: p.birthHour,
          gender: p.gender,
          relationship: p.relationship,
          category,
          planType: "paid",
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const result = {
        ...data,
        category,
        profile: p,
        histId: Date.now(),
        savedAt: new Date().toISOString(),
      };
      sessionStorage.setItem("v2_result", JSON.stringify(result));
      sessionStorage.setItem("v2_paid", "1");
      sessionStorage.setItem("v2_plan", "select");
      sessionStorage.setItem("v2_paid_cats", JSON.stringify(cats));
      router.push("/main-v2/result");
    } catch {
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setPaying(false);
      setShowSelect(false);
    }
  };

  const share = () => {
    if (!item) return;
    const url = window.location.origin + "/main-v2";
    const text = `${item.name}님의 ${item.category} 분석 🔮\n총운 ${item.scores?.total}점\n\n📱 나도 무료로!\n${url}`;
    if (navigator.share) navigator.share({ title: "점운 운세 결과", text, url }).catch(() => {});
    else navigator.clipboard.writeText(text).then(() => alert("✅ 링크 복사됨!"));
  };

  if (!item) return null;

  const bars = [
    { label: "🌟 오늘의 운세", key: "total",   color: "#f59e0b" },
    { label: "💰 재물운",      key: "wealth",  color: "#f59e0b" },
    { label: "💕 연애운",      key: "love",    color: "#ec4899" },
    { label: "💪 건강운",      key: "health",  color: "#10b981" },
    { label: "🎯 성공운",      key: "success", color: "#8b5cf6" },
    { label: "✨ 총운",        key: "total",   color: "#6366f1" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2/history")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>보관함</span>
        </button>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={share} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>📱 공유</button>
          {item.isPaid && (
            <button onClick={saveImage} disabled={saving} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "⏳..." : "🖼️ 저장"}
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 72px" }}>

        {/* 이미지 저장 대상 카드 */}
        <div ref={cardRef} style={{ background: "white", borderRadius: 24, overflow: "hidden", border: "1.5px solid rgba(236,72,153,0.1)" }}>

          {/* 헤더 그래디언트 */}
          <div style={{ background: G, color: "white", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "10px 20px 0" }}>
              <span style={{ fontSize: 13 }}>🐱</span>
              <span style={{ fontSize: 13, fontWeight: 900 }}>점운 · AI 사주 분석</span>
            </div>
            <div style={{ padding: "14px 20px 24px" }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{item.category?.split(" ")[0] ?? "✨"}</div>
              <h1 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 4px" }}>{item.name}님의 {item.category?.replace(/\S+\s/, "")}</h1>
              <div style={{ fontSize: 12, opacity: 0.75 }}>{fmtDate(item.date)}</div>
              <div style={{ fontSize: 36, fontWeight: 900, margin: "12px 0 2px" }}>{item.scores?.total ?? "—"}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>총운 점수</div>
            </div>
          </div>

          {/* 분야별 점수 */}
          <div style={{ padding: "20px 18px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>📊 분야별 운세 점수</div>
            {bars.map(b => (
              <Bar key={b.key} label={b.label}
                score={item.scores?.[b.key] ?? 0} color={b.color} />
            ))}
          </div>

          {/* 럭키 정보 (있을 경우) */}
          {(item.luckyColor || item.luckyNumber || item.luckyDirection) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 18px 18px" }}>
              {[
                { label: "행운 색", value: item.luckyColor, icon: "🎨" },
                { label: "행운 숫자", value: item.luckyNumber, icon: "🔢" },
                { label: "행운 방향", value: item.luckyDirection, icon: "🧭" },
              ].map(i => i.value && (
                <div key={i.label} style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{i.icon}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{i.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e" }}>{i.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* 분석 전체 텍스트 — 잘림 없음 */}
          <div style={{ padding: "0 18px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 10 }}>🔮 {item.category} 상세 분석</div>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
              {item.fullAnalysis ?? item.analysis}
            </p>
          </div>

        </div>

        {/* 하단 버튼 */}
        <div style={{ display: "grid", gridTemplateColumns: item.planType === "package" ? "1fr 1fr" : "1fr", gap: 10, marginTop: 14 }}>
          {item.planType === "package" && (
            <button onClick={saveImage} disabled={saving}
              style={{ padding: "13px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.3)" }}>
              {saving ? "저장 중..." : "🖼️ 이미지 저장"}
            </button>
          )}
        </div>
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
