"use client";
import { useState } from "react";

const AGE_GROUPS = [
  { key: "newborn", label: "신생아 (0~3개월)", emoji: "👶" },
  { key: "infant",  label: "영아 (4~12개월)",  emoji: "🍼" },
  { key: "toddler", label: "유아 (1~3세)",    emoji: "🧒" },
  { key: "child",   label: "아동 (4~7세)",    emoji: "🧒" },
  { key: "preg",    label: "임신 중",          emoji: "🤰" },
];

const TIPS: Record<string, { emoji: string; title: string; content: string; tagemon: string; advice: string }[]> = {
  newborn: [
    { emoji: "🌙", title: "수면 리듬 만들기", content: "신생아는 하루 16~18시간 잡니다. 밤과 낮의 구분이 아직 없어요. 낮에는 커튼을 걷어 밝게, 밤에는 어둡고 조용하게 해주면 점차 밤잠이 길어져요.", tagemon: "태몽에 물이 많이 나왔다면 감수성이 풍부한 아이로 자랄 거예요. 오늘도 맑은 물처럼 흘러가는 하루 보내세요.", advice: "지금 이 순간, 아기 얼굴을 5초만 바라보세요. 세상 어느 것도 이것보다 소중하지 않아요." },
    { emoji: "🤱", title: "수유 텀 알기", content: "신생아는 2~3시간마다 수유가 필요해요. 배고파서 우는 신호: 입 주변 자극에 반응, 손 빨기, 고개 돌리기. 울음은 배고픔의 마지막 신호예요.", tagemon: "태몽에 햇살이 가득했다면 밝고 활기찬 성격의 아이예요. 오늘 아기 웃는 모습을 사진으로 남겨보세요.", advice: "수유 중에는 아기 눈을 바라보며 이야기해 주세요. 뇌 발달에 최고의 자극이에요." },
  ],
  infant: [
    { emoji: "🧩", title: "감각 자극 놀이", content: "4~6개월엔 감각 놀이가 중요해요. 다양한 질감의 물건을 만지게 해주고, 딸랑이 소리, 색깔 대비 그림책을 보여주세요. 뇌 신경망이 폭발적으로 발달하는 시기예요.", tagemon: "태몽에 별이 쏟아졌다면 호기심이 왕성한 아이로 자랄 거예요. 오늘도 탐구심을 응원해 주세요.", advice: "배밀이를 시작했다면 바닥 정리를 해주세요. 곧 기어다닐 준비가 됐어요." },
    { emoji: "😊", title: "분리불안 이해하기", content: "8~9개월쯤 엄마가 사라지면 극도로 불안해하는 분리불안이 시작돼요. 정상 발달이에요! 잠시 자리를 비울 땐 '엄마 금방 와' 라고 말하고, 꼭 돌아오는 것을 반복해 주세요.", tagemon: "태몽에 호랑이가 나왔다면 강인하고 리더십 있는 아이예요. 지금 불안해 보여도 곧 씩씩해질 거예요.", advice: "이 시기 눈 맞춤과 미소 반응이 가장 중요한 자극이에요. 오늘 10번 웃어주세요." },
  ],
  toddler: [
    { emoji: "🗣️", title: "언어 폭발기", content: "18~24개월은 언어 폭발기예요. 갑자기 새로운 단어가 매일 늘어납니다. 아이가 가리키는 모든 것에 이름을 붙여 말해주세요. TV보다 부모의 목소리가 훨씬 효과적이에요.", tagemon: "태몽에 용이 승천했다면 말을 잘하고 표현력이 풍부한 아이가 될 거예요.", advice: "오늘 책 1권을 함께 읽어주세요. 언어 발달에 최고의 선물이에요." },
    { emoji: "😤", title: "떼쓰기 대처법", content: "2~3세 떼쓰기는 정상이에요. 자아가 생겨 '내 의지'를 주장하는 시기예요. 무시하거나 크게 혼내는 것보다 '화났구나, 이해해' 라고 감정을 인정해 주세요.", tagemon: "태몽에 강이 세차게 흘렀다면 의지가 강하고 자기 주장이 있는 아이예요. 지금 떼쓰는 것도 그 힘이에요.", advice: "오늘 한 번만 '아니야' 대신 '잠깐만, 금방 해줄게'로 바꿔보세요." },
  ],
  child: [
    { emoji: "📚", title: "학습 준비 시기", content: "4~7세는 읽기·쓰기·수 개념의 기초를 만드는 시기예요. 억지로 학습지를 시키기보다 놀이 속에서 배우게 해주세요. 블록, 퍼즐, 그림 그리기가 모두 학습이에요.", tagemon: "태몽에 책이 많이 나왔다면 지혜롭고 학구적인 아이로 자랄 거예요.", advice: "오늘 아이와 함께 그림 1장 그려보세요. 창의력 발달의 가장 좋은 방법이에요." },
    { emoji: "👫", title: "또래 관계 시작", content: "이 시기 친구 관계가 발달해요. 다툼도 많지만 갈등 해결 능력을 키우는 훈련이에요. 부모가 즉각 개입하기보다 스스로 해결할 기회를 먼저 주세요.", tagemon: "태몽에 꽃밭이 나왔다면 사교성이 좋고 친구가 많은 아이로 자랄 거예요.", advice: "오늘 '학교에서 가장 재밌었던 것'을 물어보세요. 대화가 시작돼요." },
  ],
  preg: [
    { emoji: "🤰", title: "태교 음악의 힘", content: "임신 20주부터 태아가 소리를 들을 수 있어요. 좋아하는 음악을 배에 대고 들려주세요. 특히 엄마 목소리는 태아에게 가장 좋은 태교예요.", tagemon: "돼지꿈을 꾸셨다면 건강하고 복 많은 아이가 올 거예요. 태몽은 아이가 보내는 첫 번째 메시지예요.", advice: "오늘 배에 손을 얹고 아이에게 한 마디 해주세요. 엄마의 목소리를 듣고 있어요." },
    { emoji: "🌿", title: "임신 중 영양", content: "엽산(임신 초기), 철분(임신 중기), 칼슘(임신 후기)이 핵심이에요. 과일·채소·단백질을 골고루 섭취하고, 카페인과 생선회·훈제 음식은 피하세요.", tagemon: "용꿈을 꾸셨다면 강하고 리더십 있는 아이가 올 거예요. 꿈에서 느낀 기운이 태아에게도 전달돼요.", advice: "오늘 30분 가벼운 산책을 해보세요. 임신 중 최고의 운동이에요." },
  ],
};

type Step = "form" | "loading" | "result";

export default function FreeMomcarePage() {
  const [step, setStep] = useState<Step>("form");
  const [ageGroup, setAgeGroup] = useState("infant");
  const [phone, setPhone] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  async function handleSubmit() {
    const ph = phone.replace(/\D/g, "");
    if (ph.length < 10) { alert("전화번호를 정확히 입력해주세요."); return; }
    setStep("loading");
    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, app: "momcare" }),
      });
      const data = await res.json();
      setAlreadyUsed(!!data.alreadyUsed);
      const tipArr = TIPS[ageGroup] || TIPS["infant"];
      setTipIdx(Math.floor(Math.random() * tipArr.length));
      setStep("result");
    } catch {
      alert("오류가 발생했어요. 다시 시도해주세요.");
      setStep("form");
    }
  }

  const tipArr = TIPS[ageGroup] || TIPS["infant"];
  const tip = tipArr[tipIdx];
  const ag = AGE_GROUPS.find(a => a.key === ageGroup);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#fff7ed 100%)", fontFamily: "sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg,#be185d,#f97316)", padding: "20px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>👶</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>점운 맘케어</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>사주 육아 케어 · 1회 무료 체험</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {step === "form" && (
          <>
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "2px solid #be185d", boxShadow: "0 4px 20px rgba(190,24,93,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ background: "#be185d", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800 }}>🎁 무료</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>오늘의 육아 팁 + 태몽 해석 무료</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                아기 월령을 선택하고 전화번호를 입력하면<br />
                오늘의 육아 팁과 태몽 해석을 무료로 드려요.
              </p>
            </div>

            <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>아기 월령 / 상황 <span style={{ color: "#be185d" }}>*</span></p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {AGE_GROUPS.map(a => (
                <button key={a.key} onClick={() => setAgeGroup(a.key)}
                  style={{ background: ageGroup === a.key ? "linear-gradient(135deg,#be185d,#f97316)" : "#fff", border: ageGroup === a.key ? "none" : "1.5px solid #fce7f3", borderRadius: 12, padding: "13px 16px", color: ageGroup === a.key ? "#fff" : "#374151", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "left" }}>
                  {a.emoji} {a.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#be185d" }}>*</span></label>
              <input value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="01012345678" inputMode="tel"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0" }}>전화번호 1개당 앱 1회 무료 체험 가능</p>
            </div>

            <button onClick={handleSubmit}
              style={{ width: "100%", background: "linear-gradient(135deg,#be185d,#f97316)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(190,24,93,0.4)" }}>
              👶 오늘의 육아 팁 받기
            </button>
          </>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👶</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#be185d" }}>육아 팁을 준비하고 있어요...</p>
          </div>
        )}

        {step === "result" && (
          <>
            {alreadyUsed ? (
              <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", border: "2px solid #fde047" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>이미 무료 체험을 사용하셨어요</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>해당 전화번호로 맘케어 무료 체험이 완료됐어요.</p>
                <button onClick={() => window.open("/momcare/pay", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#be185d,#f97316)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                  👶 맘케어 30일 이용권 ₩990
                </button>
                <button onClick={() => window.open("/pass", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
                  🔥 7개앱 풀패스 ₩4,900/30일
                </button>
              </div>
            ) : tip && (
              <>
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px", marginBottom: 12, border: "2px solid #fce7f3" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 24 }}>{tip.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: "#be185d" }}>{tip.title}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: "0 0 10px" }}>{tip.content}</p>
                  <div style={{ background: "#fdf2f8", borderRadius: 10, padding: "10px 14px", borderLeft: "3px solid #be185d" }}>
                    <p style={{ fontSize: 12, color: "#be185d", fontWeight: 800, margin: "0 0 4px" }}>💡 오늘의 실천 포인트</p>
                    <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{tip.advice}</p>
                  </div>
                </div>

                <div style={{ background: "linear-gradient(135deg,#fff7ed,#fdf2f8)", borderRadius: 14, padding: "16px 18px", marginBottom: 20, border: "1.5px solid #fed7aa" }}>
                  <p style={{ fontSize: 13, color: "#f97316", fontWeight: 800, margin: "0 0 8px" }}>🌟 태몽 해석 (미리보기)</p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>{tip.tagemon}</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: "8px 0 0", fontStyle: "italic" }}>※ 전체 태몽 해석은 이용권 구매 후 꿈해몽 앱에서 확인하세요.</p>
                </div>

                <div style={{ background: "#fff7ed", borderRadius: 14, padding: "14px 18px", marginBottom: 20, border: "1.5px solid #fed7aa", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#92400e", margin: "0 0 4px" }}>🔒 이용권으로 더 받는 것</p>
                  <p style={{ fontSize: 12, color: "#78350f", margin: 0, lineHeight: 1.7 }}>30일 육아일기 · 아기 성장 기록 · 수면·수유 트래커<br />타임캡슐 · 아기말 사전 · 사주 아이 건강운</p>
                </div>
              </>
            )}

            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "2px solid #be185d", boxShadow: "0 4px 20px rgba(190,24,93,0.2)", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: "#be185d", margin: "0 0 4px", textAlign: "center" }}>👶 맘케어 전체 이용하기</p>
              <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", margin: "0 0 14px" }}>육아일기 · 성장기록 · 태몽해석 · 30일 무제한</p>
              <button onClick={() => window.open("/momcare/pay", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#be185d,#f97316)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer", marginBottom: 10 }}>
                👶 맘케어 30일 이용권 ₩990
              </button>
              <button onClick={() => window.open("/pass", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#7f1d1d,#dc2626)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
                🔥 맘케어+6개앱 풀패스 ₩4,900/30일
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
