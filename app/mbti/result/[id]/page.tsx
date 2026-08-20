"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  phone?: string;
  compat?: { best: string; worst: string };
  loveDetail?: string;
  careerDetail?: string;
  stressTip?: string;
  relationTip?: string;
  growthMsg?: string;
  worstMatchIntro?: string;
  worstMatchTop3?: { type: string; reason: string }[];
  celebTwin?: { name: string; reason: string };
  tetoEgen?: { label: string; desc: string };
}

const CRUSH_LENS: Record<string, string> = {
  INTJ: "INTJ는 상대의 감정 신호보다 논리적 근거를 먼저 찾으려는 경향이 있어, 눈앞에 있는 호감 신호를 이론적으로 분석하다가 정작 타이밍을 놓치는 경우가 많습니다.",
  INTP: "INTP는 대화의 내용 자체에 몰입하는 편이라, 상대가 보내는 감정적 신호는 한참 지나서야 뒤늦게 알아차리는 경우가 많습니다.",
  ENTJ: "ENTJ는 목표와 일정에 집중하는 편이라, 상대방이 은근히 보내는 감정적 신호를 사소한 것으로 넘겨버리는 경우가 많습니다.",
  ENTP: "ENTP는 대화의 재미에 몰입하다 보니, 상대가 진짜 마음을 열었는지 그냥 대화가 즐거운 건지 구분하기 어려워할 때가 많습니다.",
  INFJ: "INFJ는 타인의 감정을 예민하게 읽어내는 편이지만, 자기 확신이 없을 땐 오히려 상대의 신호를 과하게 의심하고 지나치게 조심하는 경향이 있습니다.",
  INFP: "INFP는 머릿속에서 관계를 미리 그려보는 편이라, 현실에서 오는 진짜 신호와 자신의 기대를 혼동하기 쉽습니다.",
  ENFJ: "ENFJ는 원래 사람들에게 다정한 편이라, 상대의 호감이 특별한 감정인지 원래 성격인지 스스로도 헷갈릴 때가 많습니다.",
  ENFP: "ENFP는 감정 기복이 크고 표현이 풍부한 편이라, 오히려 상대의 조용하고 잔잔한 호감 신호는 놓치기 쉽습니다.",
  ISTJ: "ISTJ는 확실한 근거 없이는 상대의 마음을 함부로 판단하지 않는 편이라, 명확한 신호가 없으면 그냥 관심이 없다고 성급하게 단정 짓는 경향이 있습니다.",
  ISFJ: "ISFJ는 배려가 몸에 배어 있어서, 상대의 호감 표현과 그냥 하는 친절을 구분하는 데 유독 서툰 편입니다.",
  ESTJ: "ESTJ는 감정보다 결과와 행동을 먼저 보는 편이라, 상대의 은근한 눈빛이나 미묘한 뉘앙스 같은 신호는 그냥 지나치기 쉽습니다.",
  ESFJ: "ESFJ는 사람 마음을 읽는 촉이 좋은 편이지만, 워낙 많은 사람을 두루 챙기다 보니 정작 중요한 한 사람의 신호는 놓칠 때가 있습니다.",
  ISTP: "ISTP는 감정 표현 자체가 적은 편이라, 상대의 호감 표현도 무심하게 넘기고 한참 지나서야 알아차리는 경우가 많습니다.",
  ISFP: "ISFP는 순간의 감정을 섬세하게 느끼지만, 확신이 서기 전까지는 스스로도 마음을 잘 드러내지 않아 신호를 주고받는 데 서툰 편입니다.",
  ESTP: "ESTP는 직감과 행동이 빠른 편이라, 상대의 마음을 깊이 살피기보다 빠르게 판단하고 넘어가버리는 경우가 많습니다.",
  ESFP: "ESFP는 사람들과 함께하는 순간을 즐기는 데 능숙한 편이라, 상대의 진지한 호감과 그 순간의 즐거움을 구분하기 어려울 때가 있습니다.",
};

const CRUSH_SIGNS: [string, string][] = [
  ["대화가 끝난 후에도 먼저 안부를 묻는지 확인해보세요.", "당신이 무심코 한 말을 나중에 다시 언급한 적이 있다면 확실한 신호입니다."],
  ["연락 텀이 점점 짧아지고 있다면 마음이 움직이고 있다는 뜻입니다.", "다른 사람과 있을 때보다 당신 앞에서 유독 말이 많아진다면 주목하세요."],
  ["당신의 SNS나 소소한 일상에 반응 속도가 빨라졌는지 살펴보세요.", "약속을 잡을 때 먼저 날짜를 제안한 적이 있다면 꽤 확실한 신호입니다."],
  ["당신 이야기가 나올 때 유독 리액션이 커진다면 무심하지 않다는 뜻입니다.", "우연을 가장한 만남이 반복된다면 그건 우연이 아닐 확률이 높습니다."],
  ["당신의 취향이나 좋아하는 걸 은근히 기억하고 있는지 확인해보세요.", "여러 사람이 모인 자리에서도 유독 당신 쪽으로 시선이 자주 향하는지 살펴보세요."],
  ["당신이 힘들어할 때 먼저 챙기려는 모습을 보인 적이 있다면 신호입니다.", "다른 이성 이야기를 꺼냈을 때 반응이 미묘하게 달라진 적이 있는지 떠올려보세요."],
  ["별거 아닌 일에도 먼저 연락할 핑계를 만드는지 지켜보세요.", "당신과의 약속만큼은 웬만하면 미루지 않으려 하는지 확인해보세요."],
  ["당신 앞에서 평소보다 긴장하거나 말이 많아진다면 무심코 지나치지 마세요.", "당신의 하루 일정을 은근히 궁금해한 적이 있다면 꽤 진지한 신호입니다."],
];

function calcCrushPeek(myType: string, partnerBirth: string) {
  const digits = partnerBirth.replace(/\D/g, "").split("").map(Number);
  const digitSum = digits.reduce((a, b) => a + b, 0);
  const typeSum = myType.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const raw = (digitSum * 7 + typeSum * 3) % 40;
  const score = Math.min(97, Math.max(58, 58 + raw));
  const variantIdx = (digitSum + typeSum) % 3;
  const signsIdx = (digitSum * 3 + typeSum) % CRUSH_SIGNS.length;
  let tier: "hi" | "mid" | "lo";
  if (score >= 85) tier = "hi";
  else if (score >= 70) tier = "mid";
  else tier = "lo";

  const HEADLINE: Record<"hi" | "mid" | "lo", string[]> = {
    hi: ["솔직히 말하면, 이미 넘어온 것 같은데요?", "지금 이 타이밍, 놓치면 진짜 아깝습니다.", "상대방 마음은 이미 거의 결정 났을 가능성이 큽니다."],
    mid: ["애매한 줄다리기, 사실 지금이 승부처입니다.", "50 대 50이 아니라 살짝 당신 쪽으로 기울어 있습니다.", "지금 필요한 건 확신이 아니라 딱 한 번의 용기입니다."],
    lo: ["아직은 때가 아니라는 신호가 조금 더 많습니다.", "지금 들이대면 오히려 역효과가 날 수 있는 흐름입니다.", "마음보다는 타이밍이 문제인 상황으로 보입니다."],
  };
  const VERDICT: Record<"hi" | "mid" | "lo", string[]> = {
    hi: [
      "상대방도 지금 당신을 자주 떠올리고 있을 가능성이 높습니다. 대화가 끝난 뒤에 먼저 연락을 이어가거나, 당신이 지나가듯 한 말을 나중에 다시 꺼낸 적이 있다면 이미 마음이 기운 상태입니다. 지금은 상대가 당신의 다음 행동을 기다리고 있는 타이밍입니다.",
      "생각보다 마음이 많이 열려 있는 상태로 보입니다. 상대가 당신의 일정이나 근황을 은근히 물어본 적이 있다면 그건 단순한 호기심이 아닙니다. 지금 다가가면 거절당할 확률보다 받아들여질 확률이 훨씬 높은 흐름입니다.",
      "상대방 쪽에서 이미 여러 번 호감의 신호를 보냈을 가능성이 큽니다. 먼저 연락하거나, 당신 앞에서 유독 웃음이 많아지거나, 사소한 걸 챙겨준 적이 있었다면 그게 전부 신호였을 확률이 높습니다. 이제 당신이 한 걸음만 더 다가가면 됩니다.",
    ],
    mid: [
      "관심은 분명히 있지만 아직 확신이 없는 상태로 보입니다. 상대는 호감이 있으면서도 거절당할까 봐 먼저 움직이지 못하고 있을 가능성이 큽니다. 한 번 더 자연스럽게 다가가면 마음이 확실히 기울 수 있는 타이밍입니다.",
      "당신을 나쁘지 않게, 오히려 꽤 괜찮게 보고 있지만 스스로도 아직 마음을 정리하지 못한 상태일 수 있습니다. 먼저 움직일 용기가 없을 뿐, 작은 계기 하나면 관계가 달라질 여지는 충분합니다.",
      "호감과 망설임이 반반 섞여 있는 상태입니다. 지금처럼 편하게, 부담 없이 대하는 태도가 오히려 상대의 마음을 서서히 열게 만들고 있습니다. 조급해하지 않는 것이 지금은 최선의 전략입니다.",
    ],
    lo: [
      "아직 당신을 이성으로 의식하지 않고 있을 가능성이 큽니다. 지금 서두르면 오히려 부담스러운 상대로 인식될 수 있으니, 존재감을 자연스럽게 쌓는 시간이 먼저 필요합니다.",
      "지금은 마음의 문이 크게 열려 있지 않은 시기로 보입니다. 다른 일이나 감정에 더 신경이 쏠려 있을 가능성이 있어, 무리하게 다가가기보다 시간을 두고 지켜보는 편이 훨씬 유리합니다.",
      "상대방이 지금 다른 것에 신경 쓸 여유가 별로 없는 상태로 보입니다. 지금은 관계를 서두르기보다 편안한 존재로 각인시키는 것만으로도 충분한 시기입니다.",
    ],
  };
  const TIP: Record<"hi" | "mid" | "lo", string[]> = {
    hi: ["오늘 안에 먼저 연락해보세요 — 지금이 가장 자연스러운 타이밍입니다.", "약속을 먼저 제안해보세요. 상대는 이미 마음의 준비가 되어 있습니다.", "직접적인 마음 표현도 지금은 리스크가 크지 않습니다."],
    mid: ["가벼운 질문 하나로 반응을 먼저 살펴보세요.", "단둘이 만날 핑계를 하나 만들어보는 게 좋은 시작이 됩니다.", "너무 티내지 않으면서 접점을 조금씩 늘려보세요."],
    lo: ["지금은 무리한 액션보다 자연스러운 노출을 늘리는 데 집중하세요.", "직접적인 고백보다 편한 사람으로 자리 잡는 게 먼저입니다.", "타이밍을 조금 더 두고, 상대의 여유가 생길 때를 기다리세요."],
  };

  return {
    score,
    headline: HEADLINE[tier][variantIdx],
    lens: CRUSH_LENS[myType] || "",
    signs: CRUSH_SIGNS[signsIdx],
    verdict: VERDICT[tier][variantIdx],
    tip: TIP[tier][variantIdx],
  };
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

export default function MbtiResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<MbtiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<{ emoji: string; title: string; msg: string } | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [shared, setShared] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [unlockRemain, setUnlockRemain] = useState("");
  const [crushBirth, setCrushBirth] = useState("");
  const [crushResult, setCrushResult] = useState<{ score: number; headline: string; lens: string; signs: [string, string]; verdict: string; tip: string } | null>(null);

  useEffect(() => {
    fetch(`/api/mbti/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const checkUnlock = () => {
      const u = localStorage.getItem("mbti_unlock_until");
      if (!u || Number(u) <= Date.now()) { setUnlocked(false); return; }
      const _up = localStorage.getItem("mbti_unlock_phone") || ""; const _rp = (data?.phone || "").replace(/\D/g, "");
      setUnlocked(!!_up && !!_rp && _up === _rp);
    };
    checkUnlock();
    let timerId: ReturnType<typeof setInterval>;
    const updateCountdown = () => {
      const u = localStorage.getItem("mbti_unlock_until");
      if (!u) { setUnlocked(false); setUnlockRemain(""); clearInterval(timerId); return; }
      const ms = Number(u) - Date.now();
      if (ms <= 0) {
        localStorage.removeItem("mbti_unlock_until");
        setUnlocked(false); setUnlockRemain(""); clearInterval(timerId); return;
      }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setUnlockRemain(h > 0 ? `${h}시간 ${m}분 남음` : `${m}분 ${s}초 남음`);
    };
    timerId = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timerId);
  }, [data]);

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
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://jeomun.com/mbti";
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `나의 MBTI는 ${data.type} ${data.name}! 🧠`,
            description: `사주 오행 ${data.oh}오행 기질 — 점운에서 테스트해봐!`,
            imageUrl: "https://i.pinimg.com/1200x/aa/7a/e3/aa7ae3b66dc315f01fedf552b101f033.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "결과 보러가기", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 해보기 →", link: { mobileWebUrl: "https://jeomun.com/mbti", webUrl: "https://jeomun.com/mbti" } },
          ],
        });
        return;
      } catch {}
    }
    const text = `나의 MBTI는 ${data.type} ${data.name}!\n사주 오행: ${data.oh}오행 기질\n\n점운에서 테스트 → jeomun.com/mbti`;
    navigator.clipboard?.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#07000f", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔮</div>
        <p style={{ color: "#c4b5fd", fontSize: 15 }}>사주와 연결 중...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "#07000f", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f87171", marginBottom: 12 }}>결과를 찾을 수 없습니다.</p>
        <Link href="/mbti" style={{ color: "#a78bfa", fontSize: 14 }}>← 다시 테스트하기</Link>
      </div>
    );
  }

  const ohColor = OH_COLOR[data.oh] || "#a855f7";
  const userName = data.userName ? data.userName + "님의 " : "";

  return (
    <div style={{ minHeight: "100vh", background: "#07000f", color: "#f3f4f6", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>

      {/* 헤더 */}
      <div style={{ background: `linear-gradient(180deg, ${ohColor}1a 0%, #07000f 100%)`, borderBottom: `1px solid ${ohColor}2a` }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px 28px" }}>
          <Link href="/mbti" style={{ color: ohColor, fontSize: 13, textDecoration: "none", display: "block", marginBottom: 20 }}>← 다시 테스트하기</Link>

          <div style={{ textAlign: "center" as const }}>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 6 }}>{userName}성격 유형</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${ohColor}18`, border: `2px solid ${ohColor}55`, borderRadius: 16, padding: "6px 18px", marginBottom: 12 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: ohColor, letterSpacing: 2 }}>{data.type}</span>
            </div>
            <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 10px", color: "#f9f0ff" }}>{data.name}</h1>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" as const }}>
              <span style={{ fontSize: 12, background: `${ohColor}18`, color: ohColor, padding: "3px 12px", borderRadius: 10, fontWeight: 700 }}>
                오행 {data.oh}
              </span>
              <span style={{ fontSize: 12, background: "rgba(255,255,255,0.06)", color: "#9ca3af", padding: "3px 12px", borderRadius: 10 }}>
                사주 연결형
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#c4b5fd", lineHeight: 1.8, margin: 0 }}>{data.desc}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 80px" }}>

        {unlocked && (
        <>
        {/* 성향 분석 바 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: ohColor, margin: "0 0 18px" }}>📊 성격 성향 분석</p>
          <DimBar posLabel="외향형" negLabel="내향형" score={data.eiScore} pct={data.eiPct} color={ohColor} />
          <DimBar posLabel="감각형" negLabel="직관형" score={data.snScore} pct={data.snPct} color={ohColor} />
          <DimBar posLabel="사고형" negLabel="감정형" score={data.tfScore} pct={data.tfPct} color={ohColor} />
          <DimBar posLabel="계획형" negLabel="인식형" score={data.jpScore} pct={data.jpPct} color={ohColor} />
        </div>

        {/* 강점 */}
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

        {/* 약점 */}
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

        {/* 연애 스타일 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#ec4899", margin: "0 0 10px" }}>💕 연애 스타일</p>
          <p style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: 0 }}>{data.love}</p>
        </div>

        {/* 궁합 잘 맞는/안 맞는 유형 — 무료 */}
        {data.compat && (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#f9a8d4", margin: "0 0 14px" }}>💞 궁합 유형</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 12, padding: "12px 14px" }}>
                <p style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, margin: "0 0 4px" }}>✅ 잘 맞는 유형</p>
                <p style={{ fontSize: 14, color: "#d1d5db", margin: 0, lineHeight: 1.7 }}>{data.compat.best}</p>
              </div>
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12, padding: "12px 14px" }}>
                <p style={{ fontSize: 12, color: "#f87171", fontWeight: 700, margin: "0 0 4px" }}>⚠️ 주의할 유형</p>
                <p style={{ fontSize: 14, color: "#d1d5db", margin: 0, lineHeight: 1.7 }}>{data.compat.worst}</p>
              </div>
            </div>
          </div>
        )}

        {/* 커리어 + 유명인 */}
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

        {/* 사주 오행 연결 (점운 차별화!) */}
        <div style={{ background: `linear-gradient(135deg, ${ohColor}15, ${ohColor}07)`, border: `2px solid ${ohColor}40`, borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: `${ohColor}20`, border: `1px solid ${ohColor}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
              🌿
            </div>
            <div>
              <p style={{ fontSize: 11, color: ohColor, fontWeight: 700, margin: "0 0 3px", letterSpacing: 1 }}>점운 사주 오행 기질 연결</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#f9f0ff", margin: "0 0 6px" }}>{data.type} × {data.oh}오행</p>
              <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.7, margin: 0 }}>{data.ohDesc}</p>
            </div>
          </div>
          <Link href="/main-v2" style={{ display: "block", background: `${ohColor}20`, border: `1px solid ${ohColor}40`, borderRadius: 12, padding: "13px", textDecoration: "none", textAlign: "center" as const }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: ohColor }}>사주로 더 깊이 분석하기 →</span>
            <br /><span style={{ fontSize: 11, color: "#9ca3af" }}>오행 에너지 × 사주 원국 결합 분석</span>
          </Link>
        </div>
        </>
        )}

        {/* 심층 분석 — 유료 잠금 */}
        {!unlocked ? (
          <div style={{ background: "linear-gradient(135deg,#1a0a2e,#2d1269)", border: "2px solid rgba(167,139,250,0.5)", borderRadius: 20, padding: "28px 22px", marginBottom: 14, textAlign: "center" as const }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <p style={{ fontSize: 18, fontWeight: 900, color: "white", margin: "0 0 14px" }}>MBTI × 사주 전체 분석 14가지</p>
            <div style={{ textAlign: "left" as const, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 16px", marginBottom: 16 }}>
              {[
                "🧠 성격 성향 완전 분석 — 외향/내향, 감각/직관, 사고/감정, 계획/인식 4가지 축 상세 리포트",
                "💪 강점 & ⚠️ 주의할 점 — 나만의 강점과 조심해야 할 부분 전부",
                "💕 연애 스타일 + 연애 심층 분석 — 연애할 때 진짜 모습과 밀당 스타일",
                "💞 궁합 유형 — 잘 맞는 유형 / 주의할 유형",
                "💼 잘 맞는 직업 + 같은 유형 유명인",
                "🌿 사주 오행 기질 연결 분석",
                "💼 커리어 심층 분석 — 어떤 일을 할 때 성과가 나는지, 나와 안 맞는 상사·조직 유형",
                "⚡ 스트레스 & 회복법 — 지칠 때 나타나는 신호와 나에게 맞는 회복 방법",
                "🤝 인간관계 팁 — 갈등이 생겼을 때 대처법, 거리를 둘지 다가갈지 판단하는 기준",
                "🌱 성장 메시지 — 지금 당신에게 꼭 필요한 한마디",
                "💔 최악궁합 TOP3 — 유독 부딪히는 유형 3가지와 그 이유까지 전부",
                "🌟 나와 완전히 똑같은 유명인 매칭 — 성격이 판박이인 유명인은 누구일까",
                "🔄 테토-에겐 반대기운 매칭 — 나를 가장 편안하게 해주는 반대 에너지 유형",
                "👀 썸·짝사랑 상대 마음 몰래 훔쳐보기 — 상대방 생년월일만 입력하면 지금 마음 상태 확인",
              ].map((t, i) => (
                <p key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: i === 0 ? "0 0 8px" : "0 0 8px" }}>{t}</p>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#a78bfa", margin: "0 0 20px" }}>결제 후 24시간 열람 가능합니다</p>
            <Link href={`/mbti/pay?id=${id}`} style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white", borderRadius: 24, padding: "14px 32px", fontSize: 15, fontWeight: 900, textDecoration: "none", boxShadow: "0 4px 20px rgba(124,58,237,0.5)" }}>
              ₩990으로 전체 분석 열기 →
            </Link>
          </div>
        ) : (
          <>
            {unlockRemain && (
              <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 10, padding: "8px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>⏱️</span>
                <span style={{ fontSize: 12, color: "#4ade80" }}>이용 가능: <b>{unlockRemain}</b></span>
              </div>
            )}
            {/* 연애 심층 분석 */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: "#ec4899", margin: "0 0 14px" }}>💕 연애 심층 분석</p>
              <p style={{ fontSize: 15, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{data.loveDetail}</p>
            </div>
            {/* 커리어 심층 분석 */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,250,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: "#60a5fa", margin: "0 0 14px" }}>💼 커리어 심층 분석</p>
              <p style={{ fontSize: 15, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{data.careerDetail}</p>
            </div>
            {/* 스트레스 & 회복 */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: "#fbbf24", margin: "0 0 14px" }}>⚡ 스트레스 & 회복법</p>
              <p style={{ fontSize: 15, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{data.stressTip}</p>
            </div>
            {/* 인간관계 팁 */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: "#34d399", margin: "0 0 14px" }}>🤝 인간관계 팁</p>
              <p style={{ fontSize: 15, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{data.relationTip}</p>
            </div>
            {/* 성장 메시지 */}
            <div style={{ background: `linear-gradient(135deg,${ohColor}15,${ohColor}07)`, border: `2px solid ${ohColor}40`, borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: ohColor, margin: "0 0 14px" }}>🌱 성장 메시지</p>
              <p style={{ fontSize: 16, color: "#e9d5ff", lineHeight: 1.9, fontStyle: "italic" as const, margin: 0 }}>{data.growthMsg}</p>
            </div>

            {/* 최악궁합 TOP3 */}
            {data.worstMatchTop3 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, color: "#f87171", margin: "0 0 14px" }}>💔 최악궁합 TOP3</p>
                {data.worstMatchIntro && (
                  <p style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: "0 0 14px" }}>{data.worstMatchIntro}</p>
                )}
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                  {data.worstMatchTop3.map((m, i) => (
                    <div key={i} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 14px" }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#f87171", margin: "0 0 4px" }}>{i + 1}위 · {m.type}</p>
                      <p style={{ fontSize: 14, color: "#d1d5db", margin: 0, lineHeight: 1.7 }}>{m.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 유명인 쌍둥이 */}
            {data.celebTwin && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, color: "#fbbf24", margin: "0 0 10px" }}>🌟 나와 완전히 똑같은 유명인</p>
                <p style={{ fontSize: 17, fontWeight: 900, color: "#fde68a", margin: "0 0 10px" }}>{data.celebTwin.name}</p>
                <p style={{ fontSize: 15, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{data.celebTwin.reason}</p>
              </div>
            )}

            {/* 테토-에겐 */}
            {data.tetoEgen && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 900, color: "#a78bfa", margin: "0 0 10px" }}>🔄 테토-에겐 반대기운 매칭</p>
                <p style={{ fontSize: 13, background: "rgba(167,139,250,0.15)", color: "#c4b5fd", display: "inline-block", padding: "3px 12px", borderRadius: 10, fontWeight: 800, margin: "0 0 10px" }}>
                  당신은 {data.tetoEgen.label} 에너지
                </p>
                <p style={{ fontSize: 15, color: "#d1d5db", lineHeight: 1.9, margin: 0 }}>{data.tetoEgen.desc}</p>
              </div>
            )}

            {/* 썸·짝사랑 훔쳐보기 */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 18, padding: "24px 20px", marginBottom: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: "#f9a8d4", margin: "0 0 8px" }}>👀 썸·짝사랑 상대 마음 몰래 훔쳐보기</p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 14px", lineHeight: 1.7 }}>궁금한 그 사람의 생년월일만 입력하면, 지금 그 사람 마음이 어느 쪽으로 기울어 있는지 알려드려요.</p>
              <div style={{ display: "flex", gap: 8, marginBottom: crushResult ? 14 : 0 }}>
                <input
                  type="date"
                  value={crushBirth}
                  onChange={e => setCrushBirth(e.target.value)}
                  style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", color: "#f3f4f6", fontSize: 14 }}
                />
                <button
                  onClick={() => { if (crushBirth) setCrushResult(calcCrushPeek(data.type, crushBirth)); }}
                  disabled={!crushBirth}
                  style={{ background: crushBirth ? "linear-gradient(135deg,#ec4899,#db2777)" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "10px 18px", color: "white", fontSize: 13, fontWeight: 800, cursor: crushBirth ? "pointer" : "default", whiteSpace: "nowrap" as const }}
                >
                  훔쳐보기
                </button>
              </div>
              {crushResult && (
                <div style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 12, padding: "18px 16px" }}>
                  <p style={{ fontSize: 13, color: "#f9a8d4", fontWeight: 800, margin: "0 0 4px" }}>마음 온도 {crushResult.score}°</p>
                  <p style={{ fontSize: 16, color: "#fce7f3", fontWeight: 900, lineHeight: 1.6, margin: "0 0 12px" }}>{crushResult.headline}</p>
                  <p style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: "0 0 10px" }}>{crushResult.lens}</p>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#f9a8d4", margin: "0 0 6px" }}>👀 이런 신호를 눈여겨보세요</p>
                  <p style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: "0 0 4px" }}>· {crushResult.signs[0]}</p>
                  <p style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: "0 0 12px" }}>· {crushResult.signs[1]}</p>
                  <p style={{ fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: "0 0 12px" }}>{crushResult.verdict}</p>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#fbcfe8", background: "rgba(236,72,153,0.15)", borderRadius: 10, padding: "10px 12px", margin: 0, lineHeight: 1.7 }}>💡 {crushResult.tip}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* 카드 뽑기 */}
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

        {/* 공유 버튼 */}
        <button onClick={handleShare} style={{ width: "100%", background: shared ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg,#a78bfa,#7c3aed)", border: shared ? "1.5px solid #22c55e" : "none", borderRadius: 22, padding: "16px", color: "white", fontSize: 16, fontWeight: 900, cursor: "pointer", marginBottom: 12, boxShadow: shared ? "none" : "0 4px 20px rgba(124,58,237,0.4)" }}>
          {shared ? "✅ 복사됐어요!" : "📤 친구에게 공유하기"}
        </button>

        {/* 나도 해보기 */}
        <Link href="/mbti" style={{ display: "block", textAlign: "center" as const, background: "rgba(124,58,237,0.08)", border: "1.5px solid rgba(124,58,237,0.35)", borderRadius: 16, padding: "14px", color: "#a78bfa", textDecoration: "none", fontSize: 14, fontWeight: 900, marginBottom: 12 }}>
          나도 MBTI 해보기 →
        </Link>

        {/* 사주 CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(91,33,182,0.15))", border: "1px solid rgba(196,181,253,0.35)", borderRadius: 18, padding: "22px 20px", textAlign: "center" as const }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#e9d5ff", margin: "0 0 4px" }}>🔮 MBTI보다 사주가 더 정확해요</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px", lineHeight: 1.6 }}>
            MBTI는 성격만 봐요. 사주는 운명까지 봐요.<br />
            재물운·연애운·직업운이 왜 이런지 답이 나와요.
          </p>
          <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: 16, padding: "14px", color: "white", textDecoration: "none", fontSize: 15, fontWeight: 900, boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
            사주로 더 정확하게 알아보기 →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(196,181,253,0.5)", margin: "8px 0 0" }}>990원 · 단 1회 결제 · 반복청구 없음</p>
        </div>

        <div style={{ textAlign: "center" as const, fontSize: 11, color: "#6b7280", marginTop: 20, marginBottom: 8, lineHeight: 2 }}>
          <p style={{ margin: "0 0 4px", fontSize: 15 }}>🐱 점운</p>
          <p style={{ margin: 0 }}>© 2026 점운 · 기획의신 에스더가 만든 앱</p>
          <p style={{ margin: 0 }}>대표: 장문정 · 상호: 기획의신</p>
          <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
          <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
          <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38, 7층 7017호(대치동)</p>
        </div>
      </div>
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" strategy="afterInteractive"
        onLoad={() => { const k = (window as any).Kakao; if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY); }} />
    </div>
  );
}
