"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

const HEALING_CARDS: Record<string, { emoji: string; title: string; msg: string }[]> = {
  화: [
    { emoji: "🔥", title: "지금 이 에너지를 퍼뜨리세요", msg: "당신의 기쁨은 전염됩니다. 오늘 가장 소중한 사람에게 '고마워'라고 말해보세요. 한 마디가 하루를 바꿉니다." },
    { emoji: "✨", title: "지금이 도전하기 가장 좋은 때", msg: "화(火)의 에너지가 최고조일 때는 새로운 시도가 잘 됩니다. 오늘 미뤄온 그 일, 딱 10분만 시작해보세요." },
    { emoji: "💝", title: "감사를 기록하세요", msg: "오늘의 좋은 감정을 일기에 써두세요. 나중에 힘든 날, 지금 이 글을 읽으면 다시 불꽃이 살아납니다." },
    { emoji: "🌅", title: "이 순간을 누리세요", msg: "행복한 순간은 그냥 지나가기 쉬워요. 지금 창밖을 한 번 보고, 오늘 기분 좋은 이유를 마음속으로 말해보세요." },
    { emoji: "🎯", title: "에너지를 한 곳에 집중하세요", msg: "불꽃이 너무 넓으면 아무것도 태우지 못해요. 오늘 딱 한 가지 가장 중요한 목표에만 이 에너지를 쏟아보세요." },
    { emoji: "💃", title: "몸으로 표현하세요", msg: "화(火)의 에너지는 몸을 통해 가장 잘 나옵니다. 좋아하는 노래 틀고 5분만 춤춰보세요. 기분이 배가 됩니다." },
    { emoji: "🌟", title: "주변을 밝혀주는 당신", msg: "오늘 당신의 밝은 에너지가 누군가에게 큰 힘이 될 수 있어요. 의식하지 않아도 당신은 빛을 나누고 있어요." },
    { emoji: "🎁", title: "스스로에게 선물하세요", msg: "이렇게 좋은 날에는 자신에게 작은 선물을 줘도 좋아요. 좋아하는 것을 먹거나, 원하던 것을 사도 괜찮은 날입니다." },
  ],
  목: [
    { emoji: "🌱", title: "지금 씨앗을 심으세요", msg: "목(木)의 성장 에너지가 있는 날, 작게라도 시작한 것이 나중에 크게 자랍니다. 오늘의 한 걸음이 미래를 만들어요." },
    { emoji: "🌿", title: "가벼운 몸 움직이기", msg: "목 기운이 막히면 몸도 뻣뻣해져요. 스트레칭 5분, 바깥 산책 10분으로 기(氣)의 흐름을 열어주세요." },
    { emoji: "📔", title: "오늘 하고 싶은 것을 적으세요", msg: "목(木)의 창의성이 살아있는 날이에요. 메모장을 열고 머릿속에 있는 아이디어를 다 꺼내 보세요. 정리하지 않아도 됩니다." },
    { emoji: "🌳", title: "뿌리를 내리는 시간", msg: "빠르게 자라는 나무는 뿌리가 깊어야 해요. 오늘 한 가지 중요한 것에 집중하고 나머지는 내려놓아 보세요." },
    { emoji: "🎯", title: "계획을 세우기 딱 좋은 날", msg: "이 흐름이 좋을 때 다음 달, 다음 분기 목표를 종이에 써보세요. 목(木)의 날에 세운 계획은 실현 가능성이 높습니다." },
    { emoji: "🌈", title: "새로운 것을 배워보세요", msg: "목(木) 에너지는 배움을 좋아해요. 유튜브에서 관심 있던 것 하나, 책 한 챕터, 새로운 레시피 — 무엇이든 좋아요." },
    { emoji: "🤝", title: "도움을 주거나 받으세요", msg: "목(木)은 연결과 성장을 상징해요. 오늘 누군가에게 먼저 연락하거나, 필요한 도움을 요청해보세요." },
    { emoji: "💚", title: "자연을 가까이 하세요", msg: "목(木)의 날에는 자연이 가장 큰 치유제예요. 화분 물 주기, 공원 잠깐 걷기, 창문 열기 — 자연과 연결해보세요." },
  ],
  토: [
    { emoji: "🌍", title: "지금 이 순간에 머무세요", msg: "걱정은 아직 오지 않은 미래를 사는 것이에요. 지금 발이 바닥에 닿는 느낌에 집중해보세요. 지금 여기가 안전합니다." },
    { emoji: "☕", title: "따뜻한 것을 마시세요", msg: "토(土)의 날에는 위장이 예민해요. 따뜻한 생강차, 꿀물, 국물 한 그릇이 몸과 마음을 동시에 달래줍니다." },
    { emoji: "🧹", title: "작은 공간을 정리하세요", msg: "책상 위 하나만, 서랍 하나만 정리해보세요. 주변이 정돈되면 마음도 따라서 가벼워지는 게 토(土)의 힘입니다." },
    { emoji: "📝", title: "걱정 목록을 종이에 써보세요", msg: "머릿속 걱정을 종이에 써서 꺼내놓으세요. 적고 나면 실제로 해결해야 할 것은 생각보다 훨씬 적어요." },
    { emoji: "🌻", title: "지금 잘하고 있습니다", msg: "많은 것을 책임지려는 당신, 지금 충분히 잘하고 있어요. 완벽하지 않아도 됩니다. 오늘 하루를 통과한 것만으로도 충분합니다." },
    { emoji: "🤗", title: "나에게 친절하게 대하세요", msg: "친한 친구가 오늘처럼 힘들다고 하면 뭐라고 말해줄 건가요? 그 말을 지금 자신에게 해주세요." },
    { emoji: "💤", title: "충분히 쉬어도 됩니다", msg: "모든 걸 지금 해결하지 않아도 돼요. 오늘 일찍 자고, 내일 맑은 머리로 다시 시작하는 것도 훌륭한 선택입니다." },
    { emoji: "🌿", title: "감사 3가지를 찾아보세요", msg: "걱정이 클 때일수록 작은 감사를 찾는 게 중요해요. 지금 이 순간 감사한 것 3가지를 떠올려보세요. 반드시 있어요." },
  ],
  수: [
    { emoji: "💧", title: "흘려보내도 됩니다", msg: "지금 느끼는 무거운 감정, 억지로 바꾸려 하지 마세요. 물처럼 그냥 흐르도록 두면 어느 순간 가벼워져 있을 거예요." },
    { emoji: "🌊", title: "오늘은 쉬는 날입니다", msg: "수(水)의 에너지가 낮은 날은 회복하는 날이에요. 아무것도 안 해도 됩니다. 쉬는 것 자체가 내일을 위한 준비예요." },
    { emoji: "🫁", title: "깊게 숨 쉬세요", msg: "코로 4초 들이쉬고, 7초 멈추고, 8초 내쉬세요. 이 호흡을 3번만 반복해도 신경계가 안정됩니다." },
    { emoji: "🛁", title: "몸을 따뜻하게 하세요", msg: "수(水) 기운이 낮을 때는 체온이 내려가요. 따뜻한 물로 샤워하거나, 손발을 따뜻하게 하는 것만으로도 많이 달라져요." },
    { emoji: "🎵", title: "음악으로 감정을 흘려보내세요", msg: "지금 기분에 맞는 음악을 틀어두세요. 억지로 밝은 노래를 들을 필요 없어요. 지금 감정과 맞는 노래가 오히려 치유가 됩니다." },
    { emoji: "🌙", title: "내일은 달라질 수 있어요", msg: "오늘이 힘들다고 내일도 이럴 거라는 보장은 없어요. 수(水)는 흐릅니다. 지금 이 상태도 반드시 지나가요." },
    { emoji: "📖", title: "혼자만의 시간을 가지세요", msg: "수(水)의 날에는 혼자 조용히 있는 것이 가장 효율적인 충전이에요. 외로움이 아니라 회복입니다." },
    { emoji: "💙", title: "두려움은 소중한 것이 있다는 신호", msg: "두렵다는 건 잃고 싶지 않은 것이 있다는 뜻이에요. 그만큼 당신에게 중요한 것이 있습니다. 그게 무엇인지 생각해보세요." },
  ],
  금: [
    { emoji: "⚡", title: "지금 버티는 것이 용기입니다", msg: "무너지지 않으려는 그 자체가 대단한 용기예요. 지금 이 순간을 통과하는 것만으로도 충분히 잘하고 있습니다." },
    { emoji: "🧘", title: "10번 심호흡하세요", msg: "지금 하던 것을 멈추고, 눈을 감고, 천천히 10번 숨쉬세요. 몸이 안정되면 마음도 따라 진정됩니다." },
    { emoji: "🎵", title: "좋아하는 음악 한 곡", msg: "슬플 때 억지로 밝은 노래를 듣지 않아도 됩니다. 지금 기분에 맞는 노래를 크게 틀고 그냥 느껴보세요." },
    { emoji: "✍️", title: "감정을 글로 꺼내세요", msg: "종이에 지금 마음을 써보세요. 잘 써야 한다는 부담 없이. 낙서도 좋고, 단어 하나도 좋아요. 꺼내놓으면 가벼워져요." },
    { emoji: "🌟", title: "이 고통이 단련입니다", msg: "금(金)은 불에 녹여서 단련됩니다. 지금의 힘든 시간이 당신을 더 강하게 만들고 있는 과정일 수 있어요." },
    { emoji: "🤝", title: "누군가에게 털어놓으세요", msg: "혼자 다 짊어지지 않아도 됩니다. 믿을 수 있는 사람에게 말하는 것만으로도 절반은 가벼워져요." },
    { emoji: "🛁", title: "몸을 돌봐주세요", msg: "슬프거나 힘들 때 몸을 먼저 챙기세요. 따뜻한 목욕, 좋은 음식 한 끼, 충분한 수면이 지금 할 수 있는 최선입니다." },
    { emoji: "🌸", title: "지나갑니다, 반드시", msg: "금(金)의 계절 가을이 지나면 반드시 봄이 옵니다. 지금 이 감정도 영원하지 않아요. 오늘 하루만 잘 마무리하면 됩니다." },
  ],
};

const OH_CARE: Record<string, { music: string; food: string; action: string }> = {
  화: { music: "신나는 K-POP 또는 라틴 리듬", food: "딸기, 수박, 토마토 (붉은 색 과일)", action: "춤추기 or 소중한 사람에게 연락" },
  목: { music: "어쿠스틱 기타 or 재즈", food: "녹황색 채소, 나물, 부추", action: "산책 15분 or 스트레칭" },
  토: { music: "차분한 클래식 or 로파이(Lo-fi)", food: "죽, 따뜻한 국물, 단호박", action: "방 정리 or 감사일기 3줄" },
  수: { music: "빗소리 ASMR or 잔잔한 피아노", food: "검은콩, 흑미, 미역국", action: "따뜻한 샤워 or 낮잠" },
  금: { music: "감성적인 발라드 or 클래식", food: "배, 무, 흰 살 생선", action: "일기 쓰기 or 심호흡 10번" },
};

interface GResult {
  name: string;
  moodScore: number;
  moodLabel: string;
  moodEmoji: string;
  activities: string[];
  memo: string;
  oh: string;
  ohEmoji: string;
  ohKeyword: string;
  ohBg: string;
  ohMessages: string[];
  ohTips: string[];
  createdAt: number;
}

const ACT_MAP: Record<string, { label: string; emoji: string }> = {
  sleep:    { label: "수면",        emoji: "💤" },
  exercise: { label: "운동",        emoji: "🏃" },
  food:     { label: "맛있는 음식", emoji: "🍽️" },
  reading:  { label: "독서",        emoji: "📚" },
  friends:  { label: "친구",        emoji: "👫" },
  family:   { label: "가족",        emoji: "👨‍👩‍👧" },
  date:     { label: "데이트",      emoji: "💑" },
  alone:    { label: "혼자 시간",   emoji: "🧘" },
  work:     { label: "일·업무",     emoji: "💼" },
  study:    { label: "공부",        emoji: "📖" },
  creative: { label: "창작·취미",   emoji: "🎨" },
  shopping: { label: "쇼핑",        emoji: "🛍️" },
  travel:   { label: "나들이",      emoji: "🚶" },
  movie:    { label: "영화·TV",     emoji: "📺" },
  music:    { label: "음악",        emoji: "🎵" },
};

const MOOD_COLORS: Record<number, string> = {
  5: "#fbbf24", 4: "#4ade80", 3: "#93c5fd", 2: "#a78bfa", 1: "#f87171",
};

export default function GamjungResultPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [result, setResult] = useState<GResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<{ emoji: string; title: string; msg: string } | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    if (!id) return;
    // sessionStorage에 캐시된 결과 먼저 확인 (폼에서 방금 넘어온 경우)
    try {
      const cached = sessionStorage.getItem(`gamjung_result_${id}`);
      if (cached) {
        setResult(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch {}
    // 캐시 없으면 API 조회 (직접 URL 접근 등)
    fetch(`/api/gamjung/analyze?id=${id}`)
      .then(r => r.json())
      .then(data => { if (data.result) setResult(data.result); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // result 로드 완료 시 기록 저장 — early return 전에 위치해야 Rules of Hooks 준수
  useEffect(() => {
    if (!result || !id) return;
    try {
      const h = JSON.parse(localStorage.getItem("gamjung_history") || "[]");
      if (!h.some((e: {id: string}) => e.id === id)) {
        h.unshift({ id, moodLabel: result.moodLabel, moodEmoji: result.moodEmoji, createdAt: result.createdAt });
        localStorage.setItem("gamjung_history", JSON.stringify(h.slice(0, 50)));
      }
    } catch {}
  }, [result, id]);

  const share = useCallback(() => {
    if (!result) return;
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "https://jeomun.com/gamjung";
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `오늘 기분: ${result.moodLabel} ${result.moodEmoji} — ${result.oh}오행 에너지`,
            description: `${result.ohMessages[0].slice(0, 60)}... 점운 감정일기에서 내 감정을 분석해봐!`,
            imageUrl: "https://i.pinimg.com/1200x/a6/ed/26/a6ed26f97fc86e6cf74de5e3e3e64c11.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "결과 보러가기 😊", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 기록하기 →", link: { mobileWebUrl: "https://jeomun.com/gamjung", webUrl: "https://jeomun.com/gamjung" } },
          ],
        });
        return;
      } catch {}
    }
    const text = `오늘 기분: ${result.moodLabel} ${result.moodEmoji}\n오행 에너지: ${result.oh}(${result.ohEmoji}) — ${result.ohKeyword}\n\n${result.ohMessages[0]}\n\n✨ 점운 감정일기 — jeomun.com/gamjung`;
    navigator.clipboard?.writeText(text);
    alert("클립보드에 복사됐어요 😊");
  }, [result]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0f1a14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#4ade80", fontSize: 16 }}>감정 분석 중... 🌿</p>
    </div>
  );

  if (!result) return (
    <div style={{ minHeight: "100vh", background: "#0f1a14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#f87171" }}>결과를 불러올 수 없어요.</p>
    </div>
  );

  const moodColor = MOOD_COLORS[result.moodScore] || "#4ade80";

  return (
    <div style={{ minHeight: "100vh", background: "#0f1a14", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ paddingTop: 32, marginBottom: 24 }}>
          <Link href="/gamjung" style={{ color: "#4ade80", fontSize: 13, textDecoration: "none" }}>← 다시 기록하기</Link>
        </div>

        {/* 오늘 기분 */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 80, marginBottom: 8 }}>{result.moodEmoji}</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", color: moodColor }}>
            오늘 기분: {result.moodLabel}
          </h2>
          {result.name && <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>{result.name}님의 감정일기</p>}
          <p style={{ fontSize: 12, color: "#4b5563", margin: "8px 0 0" }}>
            {new Date(result.createdAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}
          </p>
        </div>

        {/* 오행 에너지 카드 */}
        <div style={{ background: result.ohBg, borderRadius: 20, padding: "24px 20px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "0 0 6px" }}>오늘의 오행 에너지</p>
          <div style={{ fontSize: 48, marginBottom: 6 }}>{result.ohEmoji}</div>
          <h3 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 4px" }}>{result.oh}(五行)</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0 }}>{result.ohKeyword}</p>
        </div>

        {/* 활동 태그 */}
        {result.activities?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 10 }}>오늘 한 활동</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {result.activities.map(key => {
                const act = ACT_MAP[key];
                return act ? (
                  <span key={key} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 20, padding: "6px 12px", fontSize: 13, color: "#86efac" }}>
                    {act.emoji} {act.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* 오행 분석 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "20px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#4ade80", margin: "0 0 12px" }}>🌿 오행 감정 분석</p>
          {result.ohMessages.map((msg, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.7, color: "#e5e7eb", margin: i < result.ohMessages.length - 1 ? "0 0 10px" : 0 }}>{msg}</p>
          ))}
        </div>

        {/* 오늘 추천 */}
        <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 18, padding: "20px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#4ade80", margin: "0 0 14px" }}>💡 오늘 해보세요</p>
          {result.ohTips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < result.ohTips.length - 1 ? 12 : 0 }}>
              <span style={{ fontSize: 14, flexShrink: 0, color: "#4ade80", marginTop: 1 }}>→</span>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: "#e5e7eb", margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>

        {/* 메모 */}
        {result.memo && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 6px" }}>📝 오늘의 한마디</p>
            <p style={{ fontSize: 14, color: "#d1d5db", margin: 0, fontStyle: "italic", lineHeight: 1.6 }}>"{result.memo}"</p>
          </div>
        )}

        {/* 감정 치유 카드 뽑기 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "20px 18px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: "#f3f4f6" }}>🎴 감정 치유 카드</p>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>지금 내 마음에 필요한 메시지</p>
          {!cardFlipped ? (
            <button onClick={() => {
              const pool = HEALING_CARDS[result.oh] || HEALING_CARDS["토"];
              const picked = pool[Math.floor(Math.random() * pool.length)];
              setCard(picked);
              setCardFlipped(true);
            }} style={{ background: "linear-gradient(135deg,#065f46,#4ade80)", border: "none", borderRadius: 20, padding: "13px 32px", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              카드 뽑기 🎴
            </button>
          ) : (
            <div>
              <div style={{ background: "rgba(74,222,128,0.1)", border: "2px solid rgba(74,222,128,0.35)", borderRadius: 16, padding: "24px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 42, marginBottom: 8 }}>{card?.emoji}</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#4ade80", margin: "0 0 10px" }}>{card?.title}</p>
                <p style={{ fontSize: 14, color: "#d1d5db", margin: 0, lineHeight: 1.7 }}>{card?.msg}</p>
              </div>
              <button onClick={() => {
                const pool = HEALING_CARDS[result.oh] || HEALING_CARDS["토"];
                const picked = pool[Math.floor(Math.random() * pool.length)];
                setCard(picked);
              }} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "9px 20px", color: "#9ca3af", fontSize: 13, cursor: "pointer" }}>↺ 다시 뽑기</button>
            </div>
          )}
        </div>

        {/* 오행 5분 셀프케어 */}
        {OH_CARE[result.oh] && (
          <div style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 18, padding: "20px 18px", marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: "#4ade80", margin: "0 0 14px" }}>💆 오늘의 {result.oh}오행 5분 셀프케어</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              {[
                { label: "🎵 지금 틀기 좋은 음악", value: OH_CARE[result.oh].music },
                { label: "🍵 몸에 좋은 음식·음료", value: OH_CARE[result.oh].food },
                { label: "✨ 지금 당장 할 것", value: OH_CARE[result.oh].action },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 13, color: "#4ade80", flexShrink: 0, minWidth: 120, fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.5 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 공유 + 다시 기록 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <button onClick={share} style={{ flex: 1, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 14, padding: "13px", color: "#4ade80", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            공유하기 📤
          </button>
          <button onClick={() => router.push("/gamjung")} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "13px", color: "#9ca3af", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            다시 기록하기 🔄
          </button>
        </div>

        {/* 사주 CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(192,132,252,0.1))", border: "1px solid rgba(192,132,252,0.3)", borderRadius: 20, padding: "22px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#c084fc", fontWeight: 700, margin: "0 0 6px" }}>🔮 감정 뒤에 숨겨진 사주 흐름</p>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5, margin: "0 0 8px" }}>
            오늘 기분이 유독 좋거나 나쁜 이유가 있을 수도 있어요.<br />
            사주로 지금 내 운의 흐름을 확인해보세요.
          </p>

          <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "white", textDecoration: "none", borderRadius: 16, padding: "13px 20px", fontWeight: 900, fontSize: 15, boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
            오늘 운세 사주로 확인하기 →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(192,132,252,0.5)", margin: "8px 0 0" }}>990원 · 단 1회 결제 · 반복청구 없음</p>
        </div>

        {/* 나도 해보기 CTA */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Link href="/gamjung" style={{ display: "inline-block", background: "linear-gradient(135deg,#065f46,#4ade80)", color: "white", textDecoration: "none", borderRadius: 22, padding: "14px 32px", fontWeight: 900, fontSize: 15 }}>
            나도 감정일기 해보기 (무료) →
          </Link>
          <p style={{ fontSize: 11, color: "#4b5563", marginTop: 8 }}>오행 감정 분석 · 치유 카드 · 셀프케어 루틴</p>
        </div>
      </div>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const k = (window as any).Kakao;
          if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }}
      />
    </div>
  );
}
