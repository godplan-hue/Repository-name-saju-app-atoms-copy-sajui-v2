"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BG_IMG = "https://i.pinimg.com/1200x/6d/df/69/6ddf69eba555283a55f2007a0d43699f.jpg";

const UNSEONG_EMOJI: Record<string, string> = {
  "장생": "🌱", "목욕": "💧", "관대": "👑", "건록": "⚡", "제왕": "🔥",
  "쇠": "🍂", "병": "🌫️", "사": "💀", "묘": "🌙", "절": "❄️", "태": "🥚", "양": "🌿",
};

interface DaeunBlock {
  gan: string; ji: string; ganHanja: string; jiHanja: string;
  startAge: number; endAge: number; unseong: string; chapter: string;
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
  const [loading, setLoading] = useState(true);
  const [currentAge, setCurrentAge] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) { router.push("/main-v2"); return; }
    const p = JSON.parse(saved);
    setProfile(p);

    const age = new Date().getFullYear() - parseInt(p.birthYear) + 1;
    setCurrentAge(age);

    const isPaid = sessionStorage.getItem("daeunPaid") === "1";
    setPaid(isPaid);

    const birth = `${p.birthYear}-${String(p.birthMonth).padStart(2, "0")}-${String(p.birthDay).padStart(2, "0")}`;
    fetchDaeun(p.name, birth, p.gender || "여", p.birthHour || "unknown", isPaid);
  }, []);

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
    router.push("/payment-complete?daeun=1&paid=3900");
  };

  const currentBlock = daeunList.find(b => currentAge >= b.startAge && currentAge <= b.endAge);

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)",
      backgroundImage: `url('${BG_IMG}')`,
      backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll",
      color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative",
    }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.62)", zIndex: 1, pointerEvents: "none" }} />

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
                  현재 {currentAge}세 · {currentBlock ? `${currentBlock.startAge}~${currentBlock.endAge}세 ${currentBlock.gan}${currentBlock.ji} 대운` : "대운 계산 중"}
                </p>
              </div>
            )}

            {/* 현재 대운 — 무료 미리보기 */}
            {currentBlock && (
              <div style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))",
                border: "2px solid rgba(251,191,36,0.6)", borderRadius: 16, padding: "20px", marginBottom: 20,
                boxShadow: "0 4px 24px rgba(251,191,36,0.15)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ background: "#fbbf24", color: "#1a0f2e", fontSize: 11, fontWeight: 900, padding: "3px 8px", borderRadius: 20 }}>🌕 지금 내 대운</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{currentBlock.startAge}~{currentBlock.endAge}세</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#fbbf24" }}>{currentBlock.ganHanja}{currentBlock.jiHanja}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>({currentBlock.gan}{currentBlock.ji})</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{UNSEONG_EMOJI[currentBlock.unseong]} {currentBlock.unseong}</span>
                </div>
                <p style={{ color: "#fbbf24", fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>「{currentBlock.chapter}」</p>

                {paid && currentBlock.mental ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "🧠 멘탈", text: currentBlock.mental },
                      { label: "🤝 인간관계", text: currentBlock.relationship },
                      { label: "💼 현실", text: currentBlock.reality },
                      { label: "🧭 대처법", text: currentBlock.action },
                    ].map(s => (
                      <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 12px" }}>
                        <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, margin: "0 0 4px" }}>{s.label}</p>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{s.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{teaserText}</p>
                )}
              </div>
            )}

            {/* 전체 8개 대운 타임라인 */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.7)", margin: "0 0 12px", letterSpacing: 0.5 }}>
                📅 전체 대운 타임라인
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {daeunList.map((b, i) => {
                  const isCurrent = currentAge >= b.startAge && currentAge <= b.endAge;
                  const isPast = currentAge > b.endAge;
                  const isLocked = !paid && !isCurrent;
                  return (
                    <div key={i} style={{
                      background: isCurrent
                        ? "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.06))"
                        : isPast ? "rgba(255,255,255,0.04)" : "rgba(139,92,246,0.08)",
                      border: isCurrent ? "1.5px solid rgba(251,191,36,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12, padding: "12px 14px", position: "relative", overflow: "hidden",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16, minWidth: 20, textAlign: "center" }}>
                          {isCurrent ? "🌕" : isPast ? "🌑" : "🔒"}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                            <span style={{ fontSize: 16, fontWeight: 900, color: isCurrent ? "#fbbf24" : "rgba(255,255,255,0.6)" }}>
                              {b.ganHanja}{b.jiHanja}
                            </span>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{b.startAge}~{b.endAge}세</span>
                            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{UNSEONG_EMOJI[b.unseong]} {b.unseong}</span>
                          </div>
                          {isLocked ? (
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "2px 0 0", filter: "blur(3px)" }}>
                              {b.chapter}
                            </p>
                          ) : (
                            <p style={{ fontSize: 12, color: isCurrent ? "rgba(251,191,36,0.8)" : "rgba(255,255,255,0.45)", margin: "2px 0 0" }}>
                              {b.chapter}
                            </p>
                          )}
                        </div>
                        {isLocked && (
                          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.2)" }}>🔒</span>
                        )}
                      </div>

                      {/* 잠긴 대운의 내용 블러 */}
                      {paid && !isCurrent && b.mental && (
                        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                          {[
                            { label: "🧠 멘탈", text: b.mental },
                            { label: "🤝 인간관계", text: b.relationship },
                            { label: "💼 현실", text: b.reality },
                            { label: "🧭 대처법", text: b.action },
                          ].map(s => (
                            <div key={s.label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px 10px" }}>
                              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, margin: "0 0 3px" }}>{s.label}</p>
                              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{s.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 결제 섹션 */}
            {!paid && (
              <div style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(109,40,217,0.15))",
                border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 18, padding: "24px 20px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🔓</div>
                <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 8px" }}>전체 대운 해설 보기</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7, margin: "0 0 16px" }}>
                  {daeunList.length}개 대운 × 4개 섹션<br />
                  멘탈 · 인간관계 · 현실 · 대처법 전체 공개
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                  {["🧠 멘탈 흐름", "🤝 인간관계", "💼 현실 전망", "🧭 대처법"].map(t => (
                    <span key={t} style={{ background: "rgba(139,92,246,0.3)", border: "1px solid rgba(139,92,246,0.5)", color: "rgba(255,255,255,0.8)", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
                <div style={{ color: "#fbbf24", fontSize: 28, fontWeight: 900, marginBottom: 4 }}>₩3,900</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 16px", textDecoration: "line-through" }}>₩29,900</p>
                <button
                  onClick={handlePay}
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a0f2e",
                    border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 900,
                    cursor: "pointer", width: "100%", boxShadow: "0 4px 20px rgba(251,191,36,0.35)",
                  }}
                >
                  🌌 전체 대운 해설 보기
                </button>
              </div>
            )}

            {paid && (
              <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                ✨ 전체 대운이 해금되었습니다
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
