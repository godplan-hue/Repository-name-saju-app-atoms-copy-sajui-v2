"use client";
import { useState } from "react";

const SPECIES = ["🐶 강아지", "🐱 고양이", "🐰 토끼", "🐹 햄스터", "🐦 기타"];

const FORTUNE_CARDS: Record<string, { emoji: string; title: string; msg: string; advice: string; color: string }[]> = {
  "🐶 강아지": [
    { emoji: "🌟", title: "오늘의 별운", msg: "오늘 강아지는 활기차고 생기 넘치는 하루를 보낼 거예요. 산책을 한 번 더 해주면 기분이 최고조에 달할 것입니다.", advice: "오늘은 함께 밖에 나가보세요. 강아지가 특히 좋아하는 날이에요.", color: "#fbbf24" },
    { emoji: "💤", title: "꿀잠의 날", msg: "오늘 강아지는 유독 피곤해할 수 있어요. 푹 쉬게 해주고 조용한 환경을 만들어 주세요.", advice: "혼자만의 시간을 충분히 주세요. 오늘은 쉬는 날이에요.", color: "#93c5fd" },
    { emoji: "❤️", title: "사랑의 날", msg: "오늘 강아지는 보호자를 유독 찾고 붙어있으려 할 거예요. 스킨십을 많이 해주면 하루가 행복할 거예요.", advice: "오늘만큼은 옆에 꼭 붙어있어 주세요.", color: "#f87171" },
    { emoji: "🎮", title: "놀이의 날", msg: "오늘 강아지의 장난기가 최고조입니다. 장난감이나 공놀이를 해주면 최고의 하루가 될 거예요.", advice: "10분만이라도 함께 놀아주세요. 행복 지수가 올라가요.", color: "#4ade80" },
    { emoji: "🍗", title: "미식의 날", msg: "오늘은 강아지가 평소보다 간식에 눈이 반짝일 거예요. 건강한 간식 하나를 주면 완벽한 하루가 됩니다.", advice: "건강 간식으로 오늘을 특별하게 만들어 주세요.", color: "#f97316" },
  ],
  "🐱 고양이": [
    { emoji: "🌙", title: "고독의 날", msg: "오늘 고양이는 혼자만의 시간을 원할 거예요. 너무 붙잡지 말고 고양이가 원할 때 다가올 수 있게 기다려 주세요.", advice: "오늘은 고양이 페이스를 존중해 주세요.", color: "#8b5cf6" },
    { emoji: "⚡", title: "에너지 폭발", msg: "한밤중 고양이가 갑자기 미친 듯이 뛰어다닐 수 있어요. 방해 금지! 운동 에너지를 발산하는 중입니다.", advice: "오늘은 고양이가 뛸 수 있는 공간을 열어두세요.", color: "#fbbf24" },
    { emoji: "😸", title: "애교의 날", msg: "오늘 고양이가 유독 애교를 부릴 거예요. 그루밍을 해주거나 좋아하는 부위를 긁어주면 최고의 하루가 됩니다.", advice: "오늘 고양이의 그루밍에 응해주세요.", color: "#f87171" },
    { emoji: "🎯", title: "사냥 본능", msg: "오늘 고양이의 사냥 본능이 강하게 올라와요. 낚싯대 장난감으로 함께 놀아주면 스트레스가 해소됩니다.", advice: "5분 낚싯대 놀이로 오늘을 채워주세요.", color: "#4ade80" },
    { emoji: "😴", title: "낮잠의 날", msg: "오늘은 고양이가 18시간 이상 잘 수도 있어요. 정상이에요! 따뜻하고 포근한 잠자리를 만들어 주세요.", advice: "오늘은 방해하지 말고 실컷 자게 해주세요.", color: "#93c5fd" },
  ],
  "🐰 토끼": [
    { emoji: "🥕", title: "식욕의 날", msg: "오늘 토끼의 식욕이 왕성해요. 좋아하는 채소를 조금 더 주면 하루가 행복할 거예요.", advice: "신선한 채소를 조금 더 챙겨주세요.", color: "#f97316" },
    { emoji: "🌿", title: "활동의 날", msg: "오늘 토끼가 유독 활발하게 뛰어다닐 거예요. 케이지 밖 자유 시간을 조금 더 늘려주면 좋아요.", advice: "오늘은 밖에서 뛸 시간을 더 줘보세요.", color: "#4ade80" },
    { emoji: "❤️", title: "甘(감)의 날", msg: "오늘 토끼가 보호자 냄새를 맡으러 다가올 거예요. 천천히 손을 내밀고 기다려 보세요.", advice: "강요하지 말고 기다리면 먼저 와요.", color: "#f87171" },
  ],
  "🐹 햄스터": [
    { emoji: "🌙", title: "야행의 날", msg: "오늘 밤 햄스터가 특히 활발하게 쳇바퀴를 돌릴 거예요. 운동 욕구가 강한 날이에요.", advice: "오늘 밤엔 쳇바퀴 소리가 더 클 거예요. 이해해 주세요.", color: "#8b5cf6" },
    { emoji: "🥜", title: "먹보의 날", msg: "오늘 햄스터가 볼 주머니에 음식을 잔뜩 저장하려 할 거예요. 충분한 먹이를 준비해 주세요.", advice: "오늘은 먹이를 조금 더 넣어주세요.", color: "#fbbf24" },
    { emoji: "😴", title: "낮잠의 날", msg: "오늘은 햄스터가 낮에 더 오래 자려고 할 거예요. 낮에는 방해하지 마세요.", advice: "낮 시간엔 조용하게 해주세요.", color: "#93c5fd" },
  ],
  "🐦 기타": [
    { emoji: "🌟", title: "좋은 날", msg: "오늘 반려동물이 유독 활기차고 건강해 보일 거예요. 지금 이 순간을 함께 즐기세요.", advice: "오늘 사진 한 장 찍어두세요. 소중한 기억이 됩니다.", color: "#fbbf24" },
    { emoji: "❤️", title: "교감의 날", msg: "오늘 반려동물이 보호자와 더 많이 교감하고 싶어 할 거예요. 충분한 시간을 내어 주세요.", advice: "오늘만큼은 핸드폰 내려두고 함께해 주세요.", color: "#f87171" },
    { emoji: "💤", title: "휴식의 날", msg: "오늘은 반려동물이 특히 많이 쉬려 할 거예요. 조용하고 편안한 환경을 만들어 주세요.", advice: "오늘은 충분히 쉬게 해주세요.", color: "#93c5fd" },
  ],
};

type Step = "form" | "loading" | "result";

export default function FreePetunPage() {
  const [step, setStep] = useState<Step>("form");
  const [species, setSpecies] = useState("🐶 강아지");
  const [phone, setPhone] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);

  async function handleSubmit() {
    const ph = phone.replace(/\D/g, "");
    if (ph.length < 10) { alert("전화번호를 정확히 입력해주세요."); return; }
    setStep("loading");
    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, app: "petun" }),
      });
      const data = await res.json();
      setAlreadyUsed(!!data.alreadyUsed);
      const cards = FORTUNE_CARDS[species] || FORTUNE_CARDS["🐦 기타"];
      setCardIdx(Math.floor(Math.random() * cards.length));
      setStep("result");
    } catch {
      alert("오류가 발생했어요. 다시 시도해주세요.");
      setStep("form");
    }
  }

  const cards = FORTUNE_CARDS[species] || FORTUNE_CARDS["🐦 기타"];
  const card = cards[cardIdx];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fff7ed 0%,#fdf2f8 100%)", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,#f97316,#ec4899)", padding: "20px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>🐾</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>점운 펫운</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>반려동물 오늘 운세 · 1회 무료 체험</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {step === "form" && (
          <>
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "2px solid #f97316", boxShadow: "0 4px 20px rgba(249,115,22,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ background: "#f97316", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800 }}>🎁 무료</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>반려동물 오늘 운세 카드 1회 무료</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>반려동물 종류를 선택하고 전화번호를 입력하면<br />오늘 운세 카드를 무료로 뽑아드려요.</p>
            </div>

            <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>반려동물 종류 <span style={{ color: "#f97316" }}>*</span></p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {SPECIES.map(s => (
                <button key={s} onClick={() => setSpecies(s)}
                  style={{ background: species === s ? "#f97316" : "#fff7ed", color: species === s ? "#fff" : "#ea580c", border: species === s ? "none" : "1.5px solid #fed7aa", borderRadius: 20, padding: "8px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#f97316" }}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="01012345678" inputMode="tel"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0" }}>전화번호 1개당 앱 1회 무료 체험 가능</p>
            </div>

            <button onClick={handleSubmit}
              style={{ width: "100%", background: "linear-gradient(135deg,#f97316,#ec4899)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,0.4)" }}>
              🐾 오늘 운세 카드 뽑기
            </button>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#f97316" }}>카드를 뽑고 있어요...</p>
          </div>
        )}

        {step === "result" && (
          <>
            {alreadyUsed ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", border: "2px solid #fde047" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>이미 무료 체험을 사용하셨어요</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>해당 전화번호로 펫운 무료 체험이 완료됐어요.</p>
                <button onClick={() => window.open("/petun/pay", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#f97316,#ec4899)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
                  🐾 펫운 30일 이용권 ₩990
                </button>
              </div>
            ) : (
              <>
                <div style={{ background: `linear-gradient(135deg, ${card.color}22, #fff7ed)`, borderRadius: 20, padding: "28px 20px", marginBottom: 16, textAlign: "center", border: `2px solid ${card.color}44` }}>
                  <div style={{ fontSize: 56, marginBottom: 10 }}>{card.emoji}</div>
                  <p style={{ color: card.color, fontSize: 11, fontWeight: 800, margin: "0 0 4px", letterSpacing: 2 }}>오늘 {species} 운세</p>
                  <h2 style={{ color: "#1a1a2e", fontSize: 24, fontWeight: 900, margin: "0 0 16px" }}>{card.title}</h2>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, textAlign: "left" }}>{card.msg}</p>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 20, border: "1.5px solid #fed7aa" }}>
                  <p style={{ fontSize: 13, color: "#f97316", fontWeight: 800, margin: "0 0 6px" }}>💡 보호자에게 드리는 조언</p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{card.advice}</p>
                </div>

                <div style={{ background: "#fff7ed", borderRadius: 14, padding: "14px 18px", marginBottom: 20, border: "1.5px solid #fed7aa", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#92400e", margin: "0 0 4px" }}>🔒 이용권으로 더 받는 것</p>
                  <p style={{ fontSize: 12, color: "#78350f", margin: 0, lineHeight: 1.7 }}>30일 매일 운세 · 성격 분석 · 보호자-반려동물 궁합<br />건강 체크 · 오행 추천 음식 · 음식 안전도 체커</p>
                </div>
              </>
            )}

            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "2px solid #f97316", boxShadow: "0 4px 20px rgba(249,115,22,0.2)", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: "#ea580c", margin: "0 0 4px", textAlign: "center" }}>🐾 펫운 전체 이용하기</p>
              <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", margin: "0 0 14px" }}>매일 운세 · 궁합 · 건강 · 30일 무제한</p>
              <button onClick={() => window.open("/petun/pay", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#f97316,#ec4899)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
                🐾 펫운 30일 이용권 ₩990
              </button>
            </div>

            {alreadyUsed && (
              <button onClick={() => { setStep("form"); setAlreadyUsed(false); setPhone(""); }}
                style={{ width: "100%", background: "transparent", border: "2px solid #e5e7eb", borderRadius: 12, padding: "12px 0", fontSize: 14, color: "#6b7280", cursor: "pointer", marginTop: 8 }}>
                다른 전화번호로 시도하기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
