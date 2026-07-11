"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface LottoResult {
  id: string;
  name?: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  oh: string;
  ohDesc: string;
  ohTip: string;
  main: number[];
  bonus: number;
}

const LUCKY_CARDS = [
  { emoji: "🌟", title: "대운의 별", msg: "지금 당신 주변에 행운의 기운이 흐르고 있습니다. 망설이지 말고 한 발 내딛으세요." },
  { emoji: "🌊", title: "흐름을 타라", msg: "물처럼 자연스럽게 흐르세요. 억지로 잡으려 하지 않을수록 원하는 것이 찾아옵니다." },
  { emoji: "🌱", title: "씨앗을 심는 시간", msg: "지금 심은 작은 씨앗이 큰 나무가 됩니다. 꾸준히, 지금 이 순간을 믿으세요." },
  { emoji: "🔥", title: "불꽃의 기운", msg: "열정이 당신을 이끌고 있습니다. 주저하지 말고 원하는 방향으로 나아가세요." },
  { emoji: "💎", title: "다이아몬드 운", msg: "압력 속에서 다이아몬드가 빛나듯, 지금의 노력이 빛나는 결실로 돌아옵니다." },
  { emoji: "🌙", title: "달빛 직감", msg: "오늘은 직감을 믿으세요. 논리보다 마음의 소리가 정확한 날입니다." },
  { emoji: "🦋", title: "변화의 나비", msg: "변화가 시작됩니다. 두려워하지 마세요. 이 변화가 당신을 더 높이 날아오르게 합니다." },
  { emoji: "⚡", title: "전광석화 기운", msg: "빠르게 결정하세요. 타이밍이 전부인 순간이 왔습니다." },
  { emoji: "🌸", title: "봄날의 기운", msg: "따뜻한 봄처럼 새로운 시작이 당신을 기다리고 있습니다. 마음을 열어두세요." },
  { emoji: "🎯", title: "집중의 화살", msg: "지금 이 순간, 당신의 에너지를 한 곳에 집중하세요. 반드시 과녁에 닿습니다." },
  { emoji: "🪄", title: "마법의 순간", msg: "믿음이 현실을 만듭니다. 당신이 상상하는 것이 이미 오고 있습니다." },
  { emoji: "🏆", title: "승리의 에너지", msg: "당신 안에 이기는 힘이 있습니다. 포기하지 마세요. 마지막에 웃는 사람이 됩니다." },
];

const OH_COLOR: Record<string, { bg: string; text: string; emoji: string }> = {
  목: { bg: "#22c55e", text: "#14532d", emoji: "🌿" },
  화: { bg: "#ef4444", text: "#7f1d1d", emoji: "🔥" },
  토: { bg: "#f59e0b", text: "#78350f", emoji: "🌍" },
  금: { bg: "#a3a3a3", text: "#1c1917", emoji: "⚡" },
  수: { bg: "#60a5fa", text: "#1e3a8a", emoji: "💧" },
};

function Ball({ n, size = 52, delay = 0, isBonus = false }: { n: number; size?: number; delay?: number; isBonus?: boolean }) {
  const getColor = (num: number) => {
    if (num <= 10) return { bg: "#fbbf24", text: "#78350f" };
    if (num <= 20) return { bg: "#60a5fa", text: "#1e3a8a" };
    if (num <= 30) return { bg: "#f97316", text: "#7c2d12" };
    if (num <= 40) return { bg: "#9ca3af", text: "#1f2937" };
    return { bg: "#4ade80", text: "#14532d" };
  };
  const { bg, text } = getColor(n);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: isBonus
        ? `radial-gradient(circle at 35% 35%, #c084fc, #7c3aed)`
        : `radial-gradient(circle at 35% 35%, ${bg}ff, ${bg}99)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: size * 0.32, color: isBonus ? "white" : text,
      boxShadow: isBonus ? "0 4px 16px #7c3aed66, inset 0 -2px 4px rgba(0,0,0,0.2)" : `0 4px 12px ${bg}66, inset 0 -2px 4px rgba(0,0,0,0.15)`,
      animation: `ballPop 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both`,
      flexShrink: 0,
      border: isBonus ? "2px solid #c084fc" : "none",
    }}>
      {n}
    </div>
  );
}

export default function LottoResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<LottoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<typeof LUCKY_CARDS[0] | null>(null);
  const [cardDrawing, setCardDrawing] = useState(false);
  const [shared, setShared] = useState(false);
  const [showBalls, setShowBalls] = useState(false);

  useEffect(() => {
    fetch(`/api/lotto/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); setTimeout(() => setShowBalls(true), 100); })
      .catch(() => setLoading(false));
  }, [id]);

  const drawCard = () => {
    if (cardDrawing) return;
    setCardDrawing(true);
    setCard(null);
    setTimeout(() => {
      setCard(LUCKY_CARDS[Math.floor(Math.random() * LUCKY_CARDS.length)]);
      setCardDrawing(false);
    }, 600);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = data ? `🎱 내 오행 행운번호 — ${data.main.join(", ")} + 보너스 ${data.bonus}\n사주 오행(${data.oh})이 이끄는 나만의 숫자!\n점운에서 확인 👉 ${url}` : "";
    if (navigator.share) {
      try { await navigator.share({ title: "내 오행 행운번호", text, url }); return; } catch {}
    }
    await navigator.clipboard.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#050010", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    section: { maxWidth: 440, margin: "0 auto", padding: "0 20px" },
    card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "20px 18px", marginBottom: 16 },
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 52, animation: "spin 1s linear infinite", marginBottom: 20 }}>🎱</div>
        <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 700 }}>행운번호 불러오는 중...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#f87171" }}>결과를 불러올 수 없습니다.</p>
        <Link href="/lotto" style={{ color: "#fbbf24", marginTop: 12 }}>다시 뽑기</Link>
      </div>
    );
  }

  const ohStyle = OH_COLOR[data.oh] || OH_COLOR["토"];

  return (
    <div style={S.wrap}>
      <style>{`
        @keyframes ballPop { 0% { transform: scale(0) rotate(-180deg); opacity:0; } 70% { transform: scale(1.2) rotate(10deg); } 100% { transform: scale(1) rotate(0deg); opacity:1; } }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px #fbbf2444;} 50%{box-shadow:0 0 40px #fbbf2488;} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes cardFlip { 0%{transform:rotateY(90deg);opacity:0;} 100%{transform:rotateY(0deg);opacity:1;} }
      `}</style>

      {/* 헤더 */}
      <div style={{ background: "linear-gradient(180deg,#120030 0%,#050010 100%)", paddingBottom: 28 }}>
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "28px 20px 0" }}>
          <Link href="/lotto" style={{ color: "#fbbf24", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 20 }}>← 다시 뽑기</Link>

          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block", background: `${ohStyle.bg}22`, border: `1.5px solid ${ohStyle.bg}66`, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, color: ohStyle.bg, marginBottom: 12 }}>
              {ohStyle.emoji} {data.name ? `${data.name}님의 ` : ""}{data.oh}오행 행운번호
            </div>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 24px" }}>
              {data.birthYear}년 {data.birthMonth}월 {data.birthDay}일 기준
            </p>

            {/* 메인 번호 공들 */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 16 }}>
              {showBalls && data.main.map((n, i) => <Ball key={n} n={n} size={54} delay={i * 120} />)}
            </div>

            {/* 보너스 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>보너스</span>
              {showBalls && <Ball n={data.bonus} size={46} delay={data.main.length * 120} isBonus />}
            </div>

            {/* 숫자 텍스트 */}
            <p style={{ color: "#fde68a", fontSize: 14, fontWeight: 700, marginTop: 12 }}>
              {data.main.join(" · ")} · <span style={{ color: "#c084fc" }}>{data.bonus}</span>
            </p>
          </div>
        </div>
      </div>

      <div style={S.section}>
        {/* 오행 설명 */}
        <div style={{ ...S.card, borderColor: `${ohStyle.bg}44`, background: `${ohStyle.bg}11`, marginTop: 20 }}>
          <p style={{ fontWeight: 700, color: ohStyle.bg, margin: "0 0 8px", fontSize: 15 }}>
            {ohStyle.emoji} {data.oh}오행 행운 에너지
          </p>
          <p style={{ color: "#e5e7eb", fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>{data.ohDesc}</p>
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 12px" }}>
            <p style={{ fontSize: 12, color: "#fde68a", margin: 0 }}>💡 구매 TIP: {data.ohTip}</p>
          </div>
        </div>

        {/* 색깔 범례 */}
        <div style={{ ...S.card }}>
          <p style={{ fontWeight: 700, color: "#fbbf24", margin: "0 0 12px", fontSize: 13 }}>🎱 공 색깔 의미</p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
            {[
              { bg: "#fbbf24", label: "1~10", name: "노란공" },
              { bg: "#60a5fa", label: "11~20", name: "파란공" },
              { bg: "#f97316", label: "21~30", name: "주황공" },
              { bg: "#9ca3af", label: "31~40", name: "회색공" },
              { bg: "#4ade80", label: "41~45", name: "초록공" },
              { bg: "#c084fc", label: "보너스", name: "보너스" },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 6, width: "calc(50% - 4px)" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: c.bg, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#d1d5db" }}>{c.label} <span style={{ color: "#6b7280" }}>({c.name})</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* 행운 카드 뽑기 */}
        <div style={{ ...S.card, textAlign: "center" as const }}>
          <p style={{ fontWeight: 700, color: "#fbbf24", margin: "0 0 6px", fontSize: 15 }}>🎴 오늘의 행운 카드</p>
          <p style={{ color: "#9ca3af", fontSize: 12, margin: "0 0 16px" }}>복권과 함께 오늘의 메시지를 받아보세요</p>

          {card ? (
            <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 16, padding: "20px", marginBottom: 16, animation: "cardFlip 0.4s ease" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>{card.emoji}</div>
              <p style={{ fontWeight: 900, fontSize: 17, color: "#fde68a", margin: "0 0 10px" }}>{card.title}</p>
              <p style={{ fontSize: 14, color: "#c7d2fe", lineHeight: 1.7, margin: 0 }}>{card.msg}</p>
            </div>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "28px", marginBottom: 16, border: "2px dashed rgba(251,191,36,0.3)" }}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>🃏</p>
              <p style={{ color: "#6b7280", fontSize: 13 }}>아래 버튼을 눌러 카드를 뽑아보세요</p>
            </div>
          )}

          <button onClick={drawCard} disabled={cardDrawing} style={{
            background: cardDrawing ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#7c3aed,#4f46e5)",
            color: "white", border: "none", borderRadius: 16, padding: "14px 28px",
            fontSize: 15, fontWeight: 700, cursor: cardDrawing ? "default" : "pointer",
          }}>
            {cardDrawing ? "🎴 뽑는 중..." : card ? "🎴 다시 뽑기" : "🎴 카드 뽑기"}
          </button>
        </div>

        {/* 공유 */}
        <button onClick={handleShare} style={{
          width: "100%", background: "rgba(251,191,36,0.12)", border: "1.5px solid rgba(251,191,36,0.4)",
          color: "#fbbf24", borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer",
          marginBottom: 16,
        }}>
          {shared ? "✅ 복사됐어요!" : "📤 번호 공유하기"}
        </button>

        {/* 사주 CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(59,130,246,0.15))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, padding: "20px", textAlign: "center" as const, marginBottom: 40 }}>
          <p style={{ fontSize: 18, margin: "0 0 6px" }}>🔮</p>
          <p style={{ fontWeight: 700, fontSize: 15, color: "#e9d5ff", margin: "0 0 8px" }}>
            행운번호로 부족하다면?
          </p>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, margin: "0 0 16px" }}>
            사주 원국을 분석하면 더 정확한<br />재물운·성공운을 알 수 있어요
          </p>
          <Link href="/main-v2" style={{
            display: "block", background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            color: "white", textDecoration: "none", borderRadius: 16, padding: "14px",
            fontSize: 15, fontWeight: 700,
          }}>
            무료 사주 분석 받기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
