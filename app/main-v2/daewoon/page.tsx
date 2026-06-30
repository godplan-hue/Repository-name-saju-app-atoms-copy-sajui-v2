"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const UNSEONG_EMOJI: Record<string, string> = {
  "장생": "🌱", "목욕": "💧", "관대": "👑", "건록": "⚡", "제왕": "🔥",
  "쇠": "🍂", "병": "🌫️", "사": "💀", "묘": "🌙", "절": "❄️", "태": "🥚", "양": "🌿",
};

interface DaeunBlock {
  gan: string; ji: string; ganHanja: string; jiHanja: string;
  startAge: number; endAge: number; unseong: string; chapter: string;
  cheonganTitle?: string;
  cheonganEnergy?: string; cheonganWealth?: string; cheonganCareer?: string;
  cheonganRelationship?: string; cheonganAdvice?: string;
  mental?: string; relationship?: string; reality?: string; action?: string;
}

export default function DaewoonPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [daeunList, setDaeunList] = useState<DaeunBlock[]>([]);
  const [daeunSu, setDaeunSu] = useState(0);
  const [isForward, setIsForward] = useState(true);
  const [teaserText, setTeaserText] = useState("");
  const [paid, setPaid] = useState(false);
  const [paidCount, setPaidCount] = useState(0);
  const [selectCount, setSelectCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentAge, setCurrentAge] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) { router.push("/main-v2"); return; }
    const p = JSON.parse(saved);
    setProfile(p);

    const age = new Date().getFullYear() - parseInt(p.birthYear) + 1;
    setCurrentAge(age);

    const isPaid = sessionStorage.getItem("daeunPaid") === "1";
    const storedCount = parseInt(sessionStorage.getItem("daeunPaidCount") || "1");
    setPaid(isPaid);
    setPaidCount(isPaid ? storedCount : 0);

    const birth = `${p.birthYear}-${String(p.birthMonth).padStart(2, "0")}-${String(p.birthDay).padStart(2, "0")}`;
    fetchDaeun(p.name, birth, p.gender || "여", p.birthHour || "unknown", isPaid);
  }, []);

  useEffect(() => {
    if (daeunList.length > 0 && selectedIdx === -1) {
      const idx = daeunList.findIndex(b => currentAge >= b.startAge && currentAge <= b.endAge);
      setSelectedIdx(idx >= 0 ? idx : 0);
    }
  }, [daeunList, currentAge, selectedIdx]);

  const fetchDaeun = async (name: string, birth: string, gender: string, birthHour: string, isPaid: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/v2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth, birthHour, gender, category: "대운", planType: "daeun", daeunPaid: isPaid }),
      });
      const data = await res.json();
      setDaeunList(data.daeunList ?? []);
      setDaeunSu(data.daeunSu ?? 0);
      setIsForward(data.isForward ?? true);
      setTeaserText(data.analysis ?? "");
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const handlePay = () => {
    const price = 3900 + (selectCount - 1) * 1000;
    router.push(`/payment-complete?daeun=1&paid=${price}&daeunCount=${selectCount}`);
  };

  const currentIndex = daeunList.findIndex(b => currentAge >= b.startAge && currentAge <= b.endAge);

  const isBlockLocked = (i: number) => {
    const relIdx = i - currentIndex;
    return !paid || (relIdx > 0 && relIdx >= paidCount);
  };

  const selectedBlock = selectedIdx >= 0 ? daeunList[selectedIdx] : null;
  const selectedLocked = selectedIdx >= 0 ? isBlockLocked(selectedIdx) : true;
  const isSelectedCurrent = selectedIdx === currentIndex;

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f0620 0%, #1a0535 40%, #0a0420 100%)",
      color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative",
    }}>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 520, margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => router.push("/main-v2")} style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.6)", color: "#fbbf24", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>🌌</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fbbf24", margin: "0 0 6px" }}>대운(大運)</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>10년마다 바뀌는 나의 인생 큰 챕터</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.6)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌙</div>
            <p>대운을 계산하는 중...</p>
          </div>
        ) : (
          <>
            {/* 내 대운 기본 정보 */}
            {profile && (
              <div style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 14, padding: "16px", marginBottom: 20, textAlign: "center" }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "0 0 4px" }}>
                  {profile.name}님의 대운 · {isForward ? "순행(順行)" : "역행(逆行)"} · 첫 대운 {daeunSu}세
                </p>
                <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, margin: 0 }}>
                  현재 {currentAge}세 · {daeunList[currentIndex]
                    ? `${daeunList[currentIndex].startAge}~${daeunList[currentIndex].endAge}세 ${daeunList[currentIndex].gan}${daeunList[currentIndex].ji} 대운`
                    : "대운 계산 중"}
                </p>
              </div>
            )}

            {/* 대운 타임라인 — 탭해서 선택 */}
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", margin: "0 0 10px", letterSpacing: 0.5 }}>
                📅 보고싶은 대운을 탭해서 선택하세요
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {daeunList.map((b, i) => {
                  const isCurrent = currentAge >= b.startAge && currentAge <= b.endAge;
                  const isPast = currentAge > b.endAge;
                  const locked = isBlockLocked(i);
                  const isSelected = selectedIdx === i;

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedIdx(i)}
                      style={{
                        background: isSelected
                          ? (isCurrent ? "linear-gradient(135deg, rgba(251,191,36,0.28), rgba(245,158,11,0.18))" : "rgba(139,92,246,0.28)")
                          : (isCurrent ? "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))" : isPast ? "rgba(255,255,255,0.04)" : "rgba(139,92,246,0.06)"),
                        border: isSelected
                          ? (isCurrent ? "2px solid rgba(251,191,36,0.95)" : "2px solid rgba(139,92,246,0.85)")
                          : (isCurrent ? "1.5px solid rgba(251,191,36,0.4)" : "1px solid rgba(255,255,255,0.08)"),
                        borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16, minWidth: 20, textAlign: "center" }}>
                          {isCurrent ? "🌕" : isPast ? "🌑" : locked ? "🔒" : "🌙"}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                            <span style={{ fontSize: 16, fontWeight: 900, color: isCurrent ? "#fbbf24" : locked ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.75)" }}>
                              {b.ganHanja}{b.jiHanja}
                            </span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{b.startAge}~{b.endAge}세</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{UNSEONG_EMOJI[b.unseong]} {b.unseong}</span>
                          </div>
                          <p style={{
                            fontSize: 12,
                            color: locked ? "rgba(255,255,255,0.2)" : (isCurrent ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.45)"),
                            margin: "2px 0 0",
                            filter: locked ? "blur(4px)" : "none",
                          }}>
                            {b.chapter}
                          </p>
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: isSelected ? (isCurrent ? "#fbbf24" : "#a78bfa") : "rgba(255,255,255,0.25)",
                          minWidth: 40, textAlign: "right",
                        }}>
                          {isSelected ? "▶ 선택됨" : "탭 →"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 선택된 대운 상세 */}
            {selectedBlock && (
              <div style={{ marginBottom: 24 }}>
                {selectedLocked ? (
                  /* 잠긴 대운 선택 시 — 결제 유도 */
                  <div style={{
                    background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.15))",
                    border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 18, padding: "24px 20px",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>🔓</div>
                    <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 6px" }}>대운 해설 보기</h3>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "0 0 4px" }}>
                      {selectedBlock.ganHanja}{selectedBlock.jiHanja} · {selectedBlock.startAge}~{selectedBlock.endAge}세
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.6, margin: "0 0 20px" }}>
                      {paid ? "이 대운은 구매 범위에 포함되지 않아요" : "현재 대운 기본 ₩3,900 · 추가 10년마다 +₩1,000"}
                    </p>

                    {/* 개수 선택 */}
                    <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: "0 0 10px" }}>몇 개 대운을 열람할까요?</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                        <button onClick={() => setSelectCount(c => Math.max(1, c - 1))} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(139,92,246,0.4)", border: "1px solid rgba(139,92,246,0.7)", color: "white", fontSize: 18, fontWeight: 900, cursor: "pointer", lineHeight: 1 }}>−</button>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ color: "#fbbf24", fontSize: 24, fontWeight: 900 }}>{selectCount}개</div>
                          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                            {selectCount === 1 ? "현재 대운만" : `현재 + 미래 ${selectCount - 1}개`}
                          </div>
                        </div>
                        <button onClick={() => setSelectCount(c => Math.min(daeunList.length, c + 1))} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(139,92,246,0.4)", border: "1px solid rgba(139,92,246,0.7)", color: "white", fontSize: 18, fontWeight: 900, cursor: "pointer", lineHeight: 1 }}>+</button>
                      </div>
                    </div>

                    <div style={{ color: "#fbbf24", fontSize: 30, fontWeight: 900, marginBottom: 4 }}>
                      ₩{(3900 + (selectCount - 1) * 1000).toLocaleString()}
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: "0 0 16px" }}>
                      기본 ₩3,900{selectCount > 1 ? ` + 추가 ${selectCount - 1}개 × ₩1,000` : ""}
                    </p>
                    <button
                      onClick={handlePay}
                      style={{
                        background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a0f2e",
                        border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 900,
                        cursor: "pointer", width: "100%", boxShadow: "0 4px 20px rgba(251,191,36,0.35)",
                      }}
                    >
                      🌌 대운 {selectCount}개 해설 보기
                    </button>
                  </div>
                ) : (
                  /* 열린 대운 — 상세 내용 */
                  <div style={{
                    background: isSelectedCurrent
                      ? "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))"
                      : "rgba(139,92,246,0.12)",
                    border: isSelectedCurrent
                      ? "2px solid rgba(251,191,36,0.65)" : "1.5px solid rgba(139,92,246,0.45)",
                    borderRadius: 16, padding: "20px",
                    boxShadow: isSelectedCurrent ? "0 4px 24px rgba(251,191,36,0.15)" : "0 4px 16px rgba(139,92,246,0.15)",
                  }}>
                    {/* 블록 헤더 */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        {isSelectedCurrent && (
                          <span style={{ background: "#fbbf24", color: "#1a0f2e", fontSize: 11, fontWeight: 900, padding: "3px 8px", borderRadius: 20 }}>🌕 지금 내 대운</span>
                        )}
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{selectedBlock.startAge}~{selectedBlock.endAge}세</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: isSelectedCurrent ? "#fbbf24" : "rgba(255,255,255,0.92)" }}>
                          {selectedBlock.ganHanja}{selectedBlock.jiHanja}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>({selectedBlock.gan}{selectedBlock.ji})</span>
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{UNSEONG_EMOJI[selectedBlock.unseong]} {selectedBlock.unseong}</span>
                      </div>
                      <p style={{ color: isSelectedCurrent ? "#fbbf24" : "rgba(255,255,255,0.75)", fontSize: 15, fontWeight: 700, margin: 0 }}>
                        「{selectedBlock.chapter}」
                      </p>
                    </div>

                    {/* 내용 */}
                    {selectedBlock.mental ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {selectedBlock.cheonganEnergy && (
                          <div style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "12px 14px" }}>
                            <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, margin: "0 0 6px" }}>✨ {selectedBlock.cheonganTitle}</p>
                            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>{selectedBlock.cheonganEnergy}</p>
                          </div>
                        )}
                        {[
                          { label: "🧠 멘탈", text: selectedBlock.mental },
                          { label: "💰 재물·돈의 흐름", text: selectedBlock.cheonganWealth },
                          { label: "💼 직업·커리어", text: selectedBlock.cheonganCareer },
                          { label: "🤝 인간관계", text: (selectedBlock.relationship ?? "") + (selectedBlock.cheonganRelationship ? "\n" + selectedBlock.cheonganRelationship : "") },
                          { label: "⚖️ 현실", text: selectedBlock.reality },
                          { label: "🧭 이 10년을 내 편으로", text: (selectedBlock.action ?? "") + (selectedBlock.cheonganAdvice ? "\n" + selectedBlock.cheonganAdvice : "") },
                        ].filter(s => s.text).map(s => (
                          <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 12px" }}>
                            <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>{s.label}</p>
                            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{s.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }}>{teaserText}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {paid && (
              <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                ✨ 구매한 대운이 해금되었습니다
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
