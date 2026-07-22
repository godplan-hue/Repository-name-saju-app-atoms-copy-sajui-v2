"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Script from "next/script";

interface MbtiData {
  type: string;
  name: string;
  oh: string;
  desc: string;
  strength: string[];
  weakness: string[];
  love: string;
  career: string;
  celeb: string[];
  ohDesc: string;
  eiScore: number;
  snScore: number;
  tfScore: number;
  jpScore: number;
  eiPct: number;
  snPct: number;
  tfPct: number;
  jpPct: number;
  userName: string;
}

const OH_COLOR: Record<string, string> = {
  목: "#22c55e", 화: "#ef4444", 토: "#f59e0b", 금: "#a3a3a3", 수: "#60a5fa",
};

const MBTI_CARDS = [
  { emoji: "✨", title: "진정한 나", msg: "오늘은 자신만의 색을 마음껏 발휘할 날입니다" },
  { emoji: "🔮", title: "직관의 빛", msg: "내면의 목소리가 옳습니다. 믿고 나아가세요" },
  { emoji: "💎", title: "강점 발휘", msg: "당신의 강점이 오늘 빛날 준비가 되어 있습니다" },
  { emoji: "🌱", title: "성장의 씨앗", msg: "불편함 속에서 가장 큰 성장이 일어납니다" },
  { emoji: "🦋", title: "변화의 순간", msg: "이 변화는 더 나은 당신을 위한 것입니다" },
  { emoji: "⚡", title: "에너지 충전", msg: "당신 안의 에너지가 넘칩니다. 지금 행동할 때입니다" },
  { emoji: "🎯", title: "집중", msg: "한 가지에 집중하면 놀라운 결과가 나옵니다" },
  { emoji: "🌊", title: "흐름을 타라", msg: "억지로 밀지 말고 흐름에 몸을 맡겨보세요" },
  { emoji: "🔥", title: "열정", msg: "식지 않는 열정이 오늘을 특별하게 만듭니다" },
  { emoji: "🧭", title: "방향", msg: "한 걸음만 내딛으면 길이 보입니다" },
  { emoji: "💫", title: "인연", msg: "오늘 만나는 사람이 중요한 인연일 수 있습니다" },
  { emoji: "🛡️", title: "자기 보호", msg: "당신의 경계를 지키는 것도 용기입니다" },
];

function DimBar({ posLabel, negLabel, score, pct, color }: {
  posLabel: string; negLabel: string; score: number; pct: number; color: string;
}) {
  const isPos = score > 0;
  const winning = isPos ? posLabel : negLabel;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: isPos ? color : "#6b7280" }}>{posLabel}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#f3f4f6" }}>{pct}% {winning}</span>
        <span style={{ fontSize: 12, color: !isPos ? color : "#6b7280" }}>{negLabel}</span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 8, position: "relative" as const }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}77, ${color})`,
          borderRadius: 8,
          marginLeft: isPos ? 0 : `${100 - pct}%`,
        }} />
      </div>
    </div>
  );
}

export default function TossMbtiResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<MbtiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<{ emoji: string; title: string; msg: string } | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    fetch(`/api/mbti/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const drawCard = () => {
    if (cardFlipped) {
      setCardFlipped(false);
      setCard(null);
      setTimeout(() => {
        const c = MBTI_CARDS[Math.floor(Math.random() * MBTI_CARDS.length)];
        setCard(c);
        setCardFlipped(true);
      }, 300);
      return;
    }
    const c = MBTI_CARDS[Math.floor(Math.random() * MBTI_CARDS.length)];
    setTimeout(() => { setCard(c); setCardFlipped(true); }, 50);
  };

  const handleShare = () => {
    if (!data) return;
    const url = `https://jeomun.com/toss-mbti/result/${id}`;
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `나의 MBTI는 ${data.type} ${data.name}! 🧠`,
            description: `사주 오행 ${data.oh}오행 기질 — 점운에서 무료로 테스트해봐!`,
            imageUrl: "https://i.pinimg.com/1200x/aa/7a/e3/aa7ae3b66dc315f01fedf552b101f033.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "결과 보러가기", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 해보기 →", link: { mobileWebUrl: "https://jeomun.com/toss-mbti", webUrl: "https://jeomun.com/toss-mbti" } },
          ],
        });
        return;
      } catch {}
    }
    const text = `나의 MBTI는 ${data.type} ${data.name}!\n사주 오행: ${data.oh}오행 기질\n\n점운에서 무료 테스트 → jeomun.com/toss-mbti`;
    navigator.clipboard?.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07000f", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔮</div>
        <p style={{ color: "#c4b5fd", fontSize: 15 }}>분석 중...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "#07000f", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f87171", marginBottom: 12 }}>결과를 찾을 수 없습니다.</p>
        <button onClick={() => window.location.href = "/toss-mbti"} style={{ color: "#a78bfa", fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>← 다시 테스트하기</button>
      </div>
    );
  }

  const ohColor = OH_COLOR[data.oh] || "#a855f7";
  const userName = data.userName ? data.userName + "님의 " : "";

  return (
    <div style={{ minHeight: "100vh", background: "#07000f", color: "#f3f4f6", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>

      <div style={{ background: `linear-gradient(180deg, ${ohColor}1a 0%, #07000f 100%)`, borderBottom: `1px solid ${ohColor}2a` }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px 28px" }}>
          <button onClick={() => window.location.href = "/toss-mbti"} style={{ color: ohColor, fontSize: 13, background: "none", border: "none", cursor: "pointer", marginBottom: 20, padding: 0 }}>← 다시 테스트하기</button>

          <div style={{ textAlign: "center" as const }}>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 6 }}>{userName}성격 유형</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${ohColor}18`, border: `2px solid ${ohColor}55`, borderRadius: 16, padding: "6px 18px", marginBottom: 12 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: ohColor, letterSpacing: 2 }}>{data.type}</span>
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 10px", color: "#f9f0ff" }}>{data.name}</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" as const }}>
              <span style={{ fontSize: 12, background: `${ohColor}18`, color: ohColor, padding: "3px 12px", borderRadius: 10, fontWeight: 700 }}>오행 {data.oh}</span>
            </div>
            <p style={{ fontSize: 14, color: "#c4b5fd", lineHeight: 1.8, margin: 0 }}>{data.desc}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: ohColor, margin: "0 0 18px" }}>📊 성격 성향 분석</p>
          <DimBar posLabel="외향형" negLabel="내향형" score={data.eiScore} pct={data.eiPct} color={ohColor} />
          <DimBar posLabel="감각형" negLabel="직관형" score={data.snScore} pct={data.snPct} color={ohColor} />
          <DimBar posLabel="사고형" negLabel="감정형" score={data.tfScore} pct={data.tfPct} color={ohColor} />
          <DimBar posLabel="계획형" negLabel="인식형" score={data.jpScore} pct={data.jpPct} color={ohColor} />
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#22c55e", margin: "0 0 14px" }}>💪 강점</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {data.strength.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                <span style={{ color: "#22c55e", fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.4 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", margin: "0 0 14px" }}>⚠️ 주의할 점</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {data.weakness.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                <span style={{ color: "#f59e0b", fontSize: 12, flexShrink: 0, marginTop: 2 }}>!</span>
                <span style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.4 }}>{w}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#ec4899", margin: "0 0 10px" }}>💕 연애 스타일</p>
          <p style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: 0 }}>{data.love}</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", margin: "0 0 10px" }}>💼 잘 맞는 직업</p>
          <p style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.7, margin: "0 0 16px" }}>{data.career}</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px" }}>같은 유형의 유명인</p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
            {data.celeb.map((c, i) => (
              <span key={i} style={{ fontSize: 12, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", color: "#93c5fd", padding: "4px 10px", borderRadius: 10 }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${ohColor}15, ${ohColor}07)`, border: `2px solid ${ohColor}40`, borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: `${ohColor}20`, border: `1px solid ${ohColor}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
              🌿
            </div>
            <div>
              <p style={{ fontSize: 11, color: ohColor, fontWeight: 700, margin: "0 0 3px", letterSpacing: 1 }}>점운 사주 오행 기질 연결</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#f9f0ff", margin: "0 0 6px" }}>{data.type} × {data.oh}오행</p>
              <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.7, margin: 0 }}>{data.ohDesc}</p>
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "20px 18px", marginBottom: 14, textAlign: "center" as const }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#f3f4f6", margin: "0 0 4px" }}>🎴 오늘의 에너지 카드</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>{data.type} 유형을 위한 오늘의 메시지</p>
          {!cardFlipped ? (
            <button onClick={drawCard} style={{ background: `linear-gradient(135deg, ${ohColor}cc, ${ohColor})`, border: "none", borderRadius: 20, padding: "13px 32px", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              카드 뽑기 🎴
            </button>
          ) : (
            <div>
              <div style={{ background: `${ohColor}18`, border: `2px solid ${ohColor}44`, borderRadius: 16, padding: "24px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 42, marginBottom: 8 }}>{card?.emoji}</div>
                <p style={{ fontSize: 17, fontWeight: 900, color: ohColor, margin: "0 0 8px" }}>{card?.title}</p>
                <p style={{ fontSize: 14, color: "#d1d5db", margin: 0, lineHeight: 1.7 }}>{card?.msg}</p>
              </div>
              <button onClick={drawCard} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "9px 20px", color: "#9ca3af", fontSize: 13, cursor: "pointer" }}>
                ↺ 다시 뽑기
              </button>
            </div>
          )}
        </div>

        <button onClick={handleShare} style={{ width: "100%", background: shared ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg,#a78bfa,#7c3aed)", border: shared ? "1.5px solid #22c55e" : "none", borderRadius: 22, padding: "16px", color: "white", fontSize: 16, fontWeight: 900, cursor: "pointer", marginBottom: 12, boxShadow: shared ? "none" : "0 4px 20px rgba(124,58,237,0.4)" }}>
          {shared ? "✅ 복사됐어요!" : "📤 친구에게 공유하기"}
        </button>

        <button onClick={() => window.location.href = "/toss-mbti"} style={{ width: "100%", textAlign: "center" as const, background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.35)", borderRadius: 16, padding: "14px", color: "#a78bfa", fontSize: 14, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>
          나도 MBTI 해보기 (무료) →
        </button>

        <p style={{ textAlign: "center" as const, fontSize: 11, color: "#374151", marginTop: 20 }}>© 점운 jeomun.com</p>
      </div>
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" strategy="afterInteractive"
        onLoad={() => { const k = (window as any).Kakao; if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); }} />
    </div>
  );
}
