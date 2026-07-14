"use client";
import { useState } from "react";

const TOPICS = [
  { key: "today", label: "🌅 오늘 운세", desc: "오늘 하루 흐름" },
  { key: "love",  label: "💞 연애·인연", desc: "사랑과 인연" },
  { key: "work",  label: "💼 직업·돈",   desc: "일과 재물" },
  { key: "choice",label: "🤔 선택·결정", desc: "갈림길에서" },
  { key: "heal",  label: "🌿 마음 치유", desc: "위로가 필요할 때" },
];

const CARDS: Record<string, { emoji: string; name: string; keyword: string; good: string; advice: string; color: string }> = {
  today: { emoji: "☀️", name: "태양", keyword: "활력·성공·자신감", good: "오늘은 에너지가 충만한 하루입니다. 밝은 기운이 감돌며 하는 일마다 순조롭게 풀릴 가능성이 높습니다. 주변 사람들이 당신의 긍정적인 에너지를 알아챌 것입니다.", advice: "자신을 믿고 당당하게 나아가세요. 오늘의 결정은 좋은 방향으로 흘러갑니다.", color: "#f97316" },
  love:  { emoji: "💞", name: "연인", keyword: "설렘·조화·인연", good: "사랑의 기운이 강하게 감돌고 있습니다. 솔로라면 새로운 인연이 가까이 있을 수 있고, 연인이 있다면 관계가 한층 깊어지는 시기입니다. 감정을 솔직하게 표현해보세요.", advice: "먼저 다가가는 용기가 지금 가장 필요한 것입니다.", color: "#ec4899" },
  work:  { emoji: "⭐", name: "별", keyword: "희망·풍요·성취", good: "재물과 성공의 별이 떴습니다. 지금까지 노력해온 것들이 서서히 결실을 맺기 시작합니다. 새로운 기회나 제안이 들어올 수 있으니 눈을 크게 뜨고 계세요.", advice: "작은 기회도 놓치지 마세요. 별은 준비된 사람에게 빛납니다.", color: "#eab308" },
  choice:{ emoji: "🌍", name: "세계", keyword: "완성·선택·전환점", good: "두 갈래 길에서 하나를 선택해야 할 때입니다. 세계 카드는 어떤 선택을 해도 완성으로 이어진다는 메시지를 줍니다. 당신의 직감을 믿으세요.", advice: "더 망설이지 마세요. 지금의 선택이 맞습니다.", color: "#22c55e" },
  heal:  { emoji: "🌙", name: "달", keyword: "치유·휴식·내면", good: "지금 마음이 많이 지쳐있군요. 달 카드는 내면의 감정을 들여다보라는 신호입니다. 무리하지 말고 자신을 충분히 쉬게 해주세요. 지나갑니다.", advice: "완벽하지 않아도 괜찮습니다. 오늘은 그냥 쉬어도 됩니다.", color: "#8b5cf6" },
};

type Step = "form" | "loading" | "result";

export default function FreeTarotPage() {
  const [step, setStep] = useState<Step>("form");
  const [topic, setTopic] = useState("today");
  const [phone, setPhone] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);

  async function handleSubmit() {
    const ph = phone.replace(/\D/g, "");
    if (ph.length < 10) { alert("전화번호를 정확히 입력해주세요."); return; }
    setStep("loading");
    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, app: "tarot" }),
      });
      const data = await res.json();
      setAlreadyUsed(!!data.alreadyUsed);
      setStep("result");
    } catch {
      alert("오류가 발생했어요. 다시 시도해주세요.");
      setStep("form");
    }
  }

  const card = CARDS[topic];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0320", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(180deg,#1a0533,#0f0320)", padding: "20px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>🃏</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>점운 타로</h1>
        <p style={{ color: "#c4b5fd", fontSize: 13, margin: 0 }}>AI 타로 카드 · 1회 무료 체험</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {step === "form" && (
          <>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "1.5px solid rgba(192,132,252,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ background: "#7c3aed", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800 }}>🎁 무료</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e9d5ff" }}>타로 카드 1장 무료 뽑기</span>
              </div>
              <p style={{ fontSize: 13, color: "#a78bfa", margin: 0, lineHeight: 1.6 }}>고민 주제를 선택하고 전화번호를 입력하면<br />오늘 당신에게 온 카드를 무료로 해석해 드려요.</p>
            </div>

            <p style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, marginBottom: 8 }}>🔮 고민 주제 선택</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {TOPICS.map(t => (
                <button key={t.key} onClick={() => setTopic(t.key)}
                  style={{ background: topic === t.key ? "linear-gradient(135deg,#7c3aed,#c084fc)" : "rgba(255,255,255,0.06)", border: topic === t.key ? "none" : "1.5px solid rgba(192,132,252,0.2)", borderRadius: 12, padding: "13px 16px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                  {t.label} <span style={{ fontSize: 12, opacity: 0.7 }}>— {t.desc}</span>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#c084fc" }}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="01012345678" inputMode="tel"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid rgba(192,132,252,0.3)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#6b7280", margin: "6px 0 0" }}>전화번호 1개당 앱 1회 무료 체험 가능</p>
            </div>

            <button onClick={handleSubmit}
              style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.5)" }}>
              🃏 카드 뽑기
            </button>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#c4b5fd" }}>카드를 뽑고 있어요...</p>
          </div>
        )}

        {step === "result" && (
          <>
            {alreadyUsed ? (
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", border: "1.5px solid rgba(251,191,36,0.4)" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>이미 무료 체험을 사용하셨어요</p>
                <p style={{ fontSize: 13, color: "#a78bfa", margin: "0 0 20px" }}>해당 전화번호로 타로 무료 체험이 완료됐어요.</p>
                <button onClick={() => window.open("/tarot/pay", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                  🃏 타로 30일 이용권 ₩990
                </button>
                <button onClick={() => window.open("/pass", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
                  🔥 7개앱 풀패스 ₩4,900/30일
                </button>
              </div>
            ) : (
              <>
                <div style={{ background: `linear-gradient(135deg, ${card.color}22, #1a0533)`, borderRadius: 20, padding: "28px 20px", marginBottom: 16, textAlign: "center", border: `1.5px solid ${card.color}44` }}>
                  <div style={{ fontSize: 56, marginBottom: 10 }}>{card.emoji}</div>
                  <p style={{ color: card.color, fontSize: 11, fontWeight: 800, margin: "0 0 4px", letterSpacing: 2 }}>오늘의 카드</p>
                  <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>{card.name}</h2>
                  <span style={{ background: card.color, color: "#fff", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 800 }}>{card.keyword}</span>
                </div>

                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: "1.5px solid rgba(192,132,252,0.2)" }}>
                  <p style={{ fontSize: 13, color: "#a78bfa", fontWeight: 800, margin: "0 0 8px" }}>📖 카드 해석</p>
                  <p style={{ fontSize: 14, color: "#e9d5ff", lineHeight: 1.8, margin: 0 }}>{card.good}</p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 18px", marginBottom: 20, border: "1.5px solid rgba(192,132,252,0.2)" }}>
                  <p style={{ fontSize: 13, color: "#a78bfa", fontWeight: 800, margin: "0 0 6px" }}>💡 오늘의 조언</p>
                  <p style={{ fontSize: 14, color: "#e9d5ff", lineHeight: 1.7, margin: 0 }}>{card.advice}</p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 18px", marginBottom: 20, textAlign: "center", border: "1.5px solid rgba(251,191,36,0.2)" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#fbbf24", margin: "0 0 4px" }}>🔒 더 보려면</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.7 }}>5가지 주제 전체 해석 · 사주 연동 종합 타로<br />오행 소울카드 · 30일 타로 일지</p>
                </div>
              </>
            )}

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px", border: "1.5px solid rgba(192,132,252,0.4)", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: "#c4b5fd", margin: "0 0 4px", textAlign: "center" }}>🃏 타로 전체 이용하기</p>
              <p style={{ fontSize: 12, color: "#a78bfa", textAlign: "center", margin: "0 0 14px" }}>5주제 타로 · 사주 연동 소울카드 · 30일 무제한</p>
              <button onClick={() => window.open("/tarot/pay", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                🃏 타로 30일 이용권 ₩990
              </button>
              <button onClick={() => window.open("/pass", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
                🔥 타로+6개앱 풀패스 ₩4,900/30일
              </button>
            </div>

            {alreadyUsed && (
              <button onClick={() => { setStep("form"); setAlreadyUsed(false); setPhone(""); }}
                style={{ width: "100%", background: "transparent", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 0", fontSize: 14, color: "#6b7280", cursor: "pointer", marginTop: 8 }}>
                다른 전화번호로 시도하기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
