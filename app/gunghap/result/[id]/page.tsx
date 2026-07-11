"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Result = {
  name1: string; name2: string;
  birthYear1: string; birthYear2: string;
  oh1: string; oh2: string;
  score: number; grade: string;
  mbti1: string; mbti2: string;
  summary: string; personality: string; love: string;
  conflict: string; strength: string; advice: string; marriage: string;
};

const TAROT = [
  { name: "🌟 별(The Star)", meaning: "두 사람 사이에 희망의 빛이 흐릅니다. 서로의 꿈을 응원하면 빛나는 인연이 될 거예요." },
  { name: "☀️ 태양(The Sun)", meaning: "활기차고 따뜻한 에너지! 함께 있을수록 서로가 빛나는 관계예요." },
  { name: "🌙 달(The Moon)", meaning: "감정이 풍부하고 직관적인 연결. 말하지 않아도 통하는 부분이 많아요." },
  { name: "💫 세계(The World)", meaning: "완성된 사랑의 에너지. 함께라면 어떤 목표도 이룰 수 있어요." },
  { name: "🏆 힘(Strength)", meaning: "서로에게 강한 힘이 되어주는 관계. 어려울 때 함께 이겨낼 수 있어요." },
  { name: "⚖️ 정의(Justice)", meaning: "균형 잡힌 관계. 서로에게 공정하고 솔직할 때 더 깊어져요." },
  { name: "🌈 절제(Temperance)", meaning: "조화와 균형의 에너지. 서로를 이해하고 배려하면 최고의 궁합이 돼요." },
  { name: "🔮 마법사(The Magician)", meaning: "두 사람이 함께하면 뭐든 이룰 수 있는 강력한 에너지가 생겨요." },
  { name: "💎 황제(The Emperor)", meaning: "안정적이고 믿음직한 에너지. 서로에게 든든한 기반이 되어줄 수 있어요." },
  { name: "🌿 여황제(The Empress)", meaning: "풍요롭고 따뜻한 사랑의 에너지. 서로를 포용하는 아름다운 관계예요." },
  { name: "🕊️ 연인(The Lovers)", meaning: "운명적인 선택의 순간. 서로에게 진심을 다하면 깊은 인연이 될 거예요." },
  { name: "🦁 전차(The Chariot)", meaning: "강한 의지와 추진력! 함께 목표를 향해 달려가는 최고의 파트너예요." },
];

function getOhEmoji(oh: string) {
  return ({ 목: "🌳", 화: "🔥", 토: "🪨", 금: "⚡", 수: "🌊" })[oh] || "✨";
}
function getOhColor(oh: string) {
  return ({ 목: "#4ade80", 화: "#f87171", 토: "#fbbf24", 금: "#94a3b8", 수: "#60a5fa" })[oh] || "#a78bfa";
}
function getScoreColor(score: number) {
  if (score >= 88) return "#ec4899";
  if (score >= 78) return "#a78bfa";
  if (score >= 65) return "#34d399";
  return "#94a3b8";
}

// 오행 상생/상극 관계 분석
function getOhRelation(oh1: string, oh2: string): { type: string; desc: string; detail: string; color: string } {
  const rel: Record<string, { type: string; desc: string; detail: string; color: string }> = {
    "목-화": { type: "상생(相生) ✨", desc: "목이 화를 키우는 최고의 에너지 흐름", detail: "나무(목)가 불(화)을 태우듯, 한 사람이 상대방에게 에너지를 공급하는 이상적인 관계예요. 함께 있으면 자연스럽게 활력이 생기고, 서로가 서로를 성장시켜요.", color: "#ec4899" },
    "화-목": { type: "상생(相生) ✨", desc: "목이 화를 키우는 에너지 흐름", detail: "나무(목)가 불(화)을 태우듯 상대방이 당신에게 활력을 불어넣어요. 상대방 곁에 있으면 자연스럽게 에너지가 살아나는 좋은 관계예요.", color: "#ec4899" },
    "화-토": { type: "상생(相生) ✨", desc: "화가 토를 만드는 완벽한 상생", detail: "불(화)이 타고 나면 흙(토)이 되듯, 열정적인 에너지가 안정적인 토대를 만들어요. 두 사람의 에너지가 자연스럽게 하나로 흘러가는 이상적인 궁합이에요.", color: "#ec4899" },
    "토-화": { type: "상생(相生) ✨", desc: "화가 토를 만드는 에너지 흐름", detail: "상대방의 열정적인 에너지가 당신에게 안정적인 토대를 만들어줘요. 두 사람이 함께 할수록 더 깊어지는 좋은 궁합이에요.", color: "#ec4899" },
    "토-금": { type: "상생(相生) ✨", desc: "토가 금을 만드는 완벽한 상생", detail: "땅(토) 속에서 금속(금)이 나오듯 안정적인 기반이 빛나는 가치를 만들어요. 서로의 강점이 자연스럽게 시너지를 발휘하는 관계예요.", color: "#ec4899" },
    "금-토": { type: "상생(相生) ✨", desc: "토가 금을 만드는 에너지 흐름", detail: "상대방의 안정적인 기반이 당신의 빛나는 능력을 키워줘요. 함께 할수록 서로의 강점이 더욱 빛나는 이상적인 궁합이에요.", color: "#ec4899" },
    "금-수": { type: "상생(相生) ✨", desc: "금이 수를 만드는 완벽한 상생", detail: "금속(금)에서 물(수)이 나오듯 날카로운 판단력이 깊은 지혜를 만들어요. 두 사람이 함께하면 깊고 지적인 연결이 이루어져요.", color: "#ec4899" },
    "수-금": { type: "상생(相生) ✨", desc: "금이 수를 만드는 에너지 흐름", detail: "상대방의 날카로운 판단력이 당신의 지혜를 더 깊게 만들어줘요. 지적으로 통하는 최고의 궁합이에요.", color: "#ec4899" },
    "수-목": { type: "상생(相生) ✨", desc: "수가 목을 키우는 완벽한 상생", detail: "물(수)이 나무(목)를 자라게 하듯 당신의 깊은 에너지가 상대방의 성장을 돕는 이상적인 관계예요.", color: "#ec4899" },
    "목-수": { type: "상생(相生) ✨", desc: "수가 목을 키우는 에너지 흐름", detail: "상대방의 깊은 지혜가 당신의 성장을 돕는 좋은 관계예요. 함께할수록 당신이 더 크게 성장할 수 있어요.", color: "#ec4899" },
    "목-토": { type: "상극(相剋) ⚡", desc: "목이 토를 극하는 에너지 충돌", detail: "나무(목)가 땅(토)을 뚫고 자라듯 에너지 방향이 다를 수 있어요. 변화와 안정이라는 서로 다른 가치가 충돌할 수 있지만, 이 긴장이 오히려 서로를 성장시키기도 해요.", color: "#f59e0b" },
    "토-목": { type: "상극(相剋) ⚡", desc: "목이 토를 극하는 에너지 충돌", detail: "상대방의 변화 추구 에너지가 당신의 안정 추구 기질과 충돌할 수 있어요. 서로의 다름을 보완점으로 바라보는 노력이 필요해요.", color: "#f59e0b" },
    "목-금": { type: "상극(相剋) ⚡", desc: "금이 목을 극하는 에너지 충돌", detail: "도끼(금)가 나무(목)를 자르듯 에너지가 충돌해요. 금 기질의 날카로운 비판이 목 기질에게 상처가 될 수 있지만, 서로를 단단하게 만드는 힘이 되기도 해요.", color: "#f59e0b" },
    "금-목": { type: "상극(相剋) ⚡", desc: "금이 목을 극하는 에너지 충돌", detail: "당신의 날카로운 판단력이 상대방에게 상처를 줄 수 있어요. 비판보다 격려로 접근하는 연습이 관계에 큰 도움이 돼요.", color: "#f59e0b" },
    "화-금": { type: "상극(相剋) ⚡", desc: "화가 금을 극하는 에너지 충돌", detail: "불(화)이 쇠(금)를 녹이듯 감성과 논리가 충돌해요. 화 기질의 감정 표현이 금 기질의 원칙주의와 부딪힐 수 있지만, 균형을 찾으면 강력한 시너지가 나와요.", color: "#f59e0b" },
    "금-화": { type: "상극(相剋) ⚡", desc: "화가 금을 극하는 에너지 충돌", detail: "상대방의 감성적 에너지가 당신의 원칙주의와 충돌할 수 있어요. 논리보다 감정에 먼저 반응해주면 관계가 훨씬 편해져요.", color: "#f59e0b" },
    "수-화": { type: "상극(相剋) ⚡", desc: "수가 화를 극하는 에너지 충돌", detail: "물(수)이 불(화)을 끄듯 차가운 이성과 뜨거운 감성이 충돌해요. 수 기질의 냉정한 반응이 화 기질의 열정을 꺼뜨릴 수 있어요. 서로의 차이를 존중하는 노력이 필요해요.", color: "#f59e0b" },
    "화-수": { type: "상극(相剋) ⚡", desc: "수가 화를 극하는 에너지 충돌", detail: "상대방의 차가운 이성이 당신의 뜨거운 감성을 가라앉힐 수 있어요. 하지만 이 균형이 오히려 더 나은 결정을 만들기도 해요.", color: "#f59e0b" },
    "토-수": { type: "상극(相剋) ⚡", desc: "토가 수를 극하는 에너지 충돌", detail: "흙(토)이 물(수)을 막듯 현실주의와 이상주의가 충돌해요. 토 기질의 현실적 관점이 수 기질의 이상적 생각과 맞지 않을 수 있어요.", color: "#f59e0b" },
    "수-토": { type: "상극(相剋) ⚡", desc: "토가 수를 극하는 에너지 충돌", detail: "상대방의 현실적인 시각이 당신의 이상주의를 막을 수 있어요. 서로의 강점이 균형을 이루면 꿈과 현실을 함께 이룰 수 있어요.", color: "#f59e0b" },
  };
  const key = `${oh1}-${oh2}`;
  if (rel[key]) return rel[key];
  // 비화 (같은 오행)
  const sameMap: Record<string, string> = { 목: "🌳 나무끼리의 공명", 화: "🔥 불꽃끼리의 공명", 토: "🪨 땅끼리의 안정", 금: "⚡ 금속끼리의 공명", 수: "🌊 물끼리의 깊이" };
  return { type: `비화(比和) ${getOhEmoji(oh1)}`, desc: sameMap[oh1] || "같은 기운의 공명", detail: `같은 ${oh1} 기운을 가진 두 사람. 서로를 깊이 이해하지만 같은 성향 때문에 부딪히기도 해요. 서로의 공통점에서 힘을 얻되 역할 분담을 명확히 하면 최고의 파트너가 될 수 있어요.`, color: "#a78bfa" };
}

function getYearStem(year: number): string {
  const stems = ["경","신","임","계","갑","을","병","정","무","기"];
  return stems[year % 10] || "";
}
function getStemDesc(stem: string): string {
  const m: Record<string,string> = {
    갑: "갑(甲) — 큰 나무 에너지. 리더십과 성장의 기운.", 을: "을(乙) — 작은 나무 에너지. 유연하고 섬세한 기운.",
    병: "병(丙) — 태양 에너지. 밝고 활기찬 기운.", 정: "정(丁) — 촛불 에너지. 따뜻하고 섬세한 감성.",
    무: "무(戊) — 대지 에너지. 안정적이고 포용하는 기운.", 기: "기(己) — 들판 에너지. 부드럽고 실용적인 기운.",
    경: "경(庚) — 큰 쇠 에너지. 강하고 결단력 있는 기운.", 신: "신(辛) — 작은 쇠 에너지. 예리하고 정교한 기운.",
    임: "임(壬) — 큰 물 에너지. 깊고 지혜로운 기운.", 계: "계(癸) — 작은 물 에너지. 섬세하고 직관적인 기운.",
  };
  return m[stem] || "";
}

export default function GunghapResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [tarotCard, setTarotCard] = useState<typeof TAROT[0] | null>(null);
  const [tarotFlipped, setTarotFlipped] = useState(false);
  const [tarotUsed, setTarotUsed] = useState(false);

  useEffect(() => {
    const unlock = localStorage.getItem("gunghap_unlock_until");
    if (unlock && Number(unlock) > Date.now()) setPaid(true);
    if (!id) return;
    fetch(`/api/gunghap/analyze?id=${id}`)
      .then(r => r.json())
      .then(data => { if (data.result) setResult(data.result); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const drawTarot = () => {
    if (tarotUsed) return;
    const card = TAROT[Math.floor(Math.random() * TAROT.length)];
    setTarotCard(card);
    setTimeout(() => setTarotFlipped(true), 50);
    setTarotUsed(true);
  };

  const share = () => {
    if (!result) return;
    const url = `https://jeomun.com/gunghap/result/${id}`;
    const text = `${result.name1}♥${result.name2} 궁합 점수 ${result.score}점 ${result.grade}\n오행 ${result.oh1}×${result.oh2} | 점운에서 무료로 확인하세요!`;
    if (navigator.share) navigator.share({ title: "점운 궁합", text, url }).catch(() => {});
    else navigator.clipboard.writeText(url).then(() => alert("링크가 복사됐어요! 💞")).catch(() => {});
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#0a0015", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "20px 18px", marginBottom: 16 },
    secTitle: { fontSize: 12, fontWeight: 900, color: "#a78bfa", margin: "0 0 10px", textTransform: "uppercase" as const, letterSpacing: "0.08em" },
    body: { fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: 0 },
    lockCard: { background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(124,58,237,0.3)", borderRadius: 20, padding: "24px 18px", marginBottom: 16, textAlign: "center" as const },
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💞</div>
          <p style={{ color: "#a78bfa" }}>오행 에너지 분석 중...</p>
        </div>
      </div>
    );
  }
  if (!result) {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ color: "#9ca3af", marginBottom: 16 }}>결과를 찾을 수 없어요</p>
          <Link href="/gunghap" style={{ color: "#a78bfa" }}>새로 분석하기</Link>
        </div>
      </div>
    );
  }

  const scoreColor = getScoreColor(result.score);
  const ohRel = getOhRelation(result.oh1, result.oh2);
  const stem1 = getYearStem(Number(result.birthYear1));
  const stem2 = getYearStem(Number(result.birthYear2));
  const stemDesc1 = getStemDesc(stem1);
  const stemDesc2 = getStemDesc(stem2);

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        {/* 헤더 */}
        <div style={{ paddingTop: 32, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/gunghap" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>← 다시 분석하기</Link>
          <button onClick={share} style={{ background: "rgba(236,72,153,0.2)", border: "1px solid rgba(236,72,153,0.5)", borderRadius: 20, padding: "6px 14px", color: "#f9a8d4", fontSize: 12, cursor: "pointer" }}>
            공유하기 📤
          </button>
        </div>

        {/* 메인 점수 카드 */}
        <div style={{ background: "linear-gradient(135deg,#1a0030,#2d0a4e)", border: `2px solid ${scoreColor}55`, borderRadius: 24, padding: "24px 18px", marginBottom: 16, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 16px", letterSpacing: "0.1em" }}>✨ 사주 오행 궁합 분석</p>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 20 }}>
            {/* 나 */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${getOhColor(result.oh1)}22`, border: `2px solid ${getOhColor(result.oh1)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 8px" }}>
                {getOhEmoji(result.oh1)}
              </div>
              <p style={{ fontSize: 14, fontWeight: 900, color: getOhColor(result.oh1), margin: "0 0 2px" }}>{result.name1}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 1px" }}>{result.oh1}오행</p>
              <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>{stem1}({result.birthYear1})</p>
            </div>

            {/* 점수 */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>궁합</div>
              <div style={{ fontSize: 60, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{result.score}</div>
              <div style={{ fontSize: 11, color: scoreColor, fontWeight: 700, margin: "4px 0 2px" }}>점</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>/ 100</div>
            </div>

            {/* 상대 */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${getOhColor(result.oh2)}22`, border: `2px solid ${getOhColor(result.oh2)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 8px" }}>
                {getOhEmoji(result.oh2)}
              </div>
              <p style={{ fontSize: 14, fontWeight: 900, color: getOhColor(result.oh2), margin: "0 0 2px" }}>{result.name2}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 1px" }}>{result.oh2}오행</p>
              <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>{stem2}({result.birthYear2})</p>
            </div>
          </div>

          {/* 점수 바 */}
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ width: `${result.score}%`, height: "100%", background: `linear-gradient(90deg,#7c3aed,${scoreColor})`, borderRadius: 99 }} />
          </div>

          <div style={{ display: "inline-block", background: `${scoreColor}22`, border: `1px solid ${scoreColor}55`, borderRadius: 20, padding: "6px 18px", marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: scoreColor }}>{result.grade}</span>
          </div>

          <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, margin: 0 }}>{result.summary}</p>
        </div>

        {/* 공유 버튼 */}
        <button onClick={share} style={{ width: "100%", background: "rgba(236,72,153,0.15)", border: "2px solid rgba(236,72,153,0.4)", borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 700, color: "#f9a8d4", cursor: "pointer", marginBottom: 16 }}>
          💞 우리 궁합 {result.score}점 — 친구에게 공유하기
        </button>

        {/* 오행 관계 분석 (무료) */}
        <div style={{ background: `${ohRel.color}11`, border: `1px solid ${ohRel.color}33`, borderRadius: 20, padding: "18px 16px", marginBottom: 16 }}>
          <p style={S.secTitle}>🔮 사주 오행 에너지 관계</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{getOhEmoji(result.oh1)}</span>
            <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg,${getOhColor(result.oh1)},${getOhColor(result.oh2)})`, borderRadius: 99 }} />
            <span style={{ fontSize: 22 }}>{getOhEmoji(result.oh2)}</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: ohRel.color, margin: "0 0 8px" }}>{ohRel.type}</p>
          <p style={{ fontSize: 12, color: "#c4b5fd", margin: "0 0 8px" }}>{ohRel.desc}</p>
          <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.7, margin: 0 }}>{ohRel.detail}</p>
        </div>

        {/* 천간(天干) 에너지 (무료) */}
        <div style={S.card}>
          <p style={S.secTitle}>📅 태어난 해의 천간 에너지</p>
          {stemDesc1 && (
            <div style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700 }}>{result.name1} ({result.birthYear1}년생)</span>
              <p style={{ fontSize: 13, color: "#d1d5db", margin: "4px 0 0", lineHeight: 1.6 }}>{stemDesc1}</p>
            </div>
          )}
          {stemDesc2 && (
            <div>
              <span style={{ fontSize: 11, color: "#f472b6", fontWeight: 700 }}>{result.name2} ({result.birthYear2}년생)</span>
              <p style={{ fontSize: 13, color: "#d1d5db", margin: "4px 0 0", lineHeight: 1.6 }}>{stemDesc2}</p>
            </div>
          )}
        </div>

        {/* MBTI 오행 공명 (무료) */}
        <div style={S.card}>
          <p style={S.secTitle}>🧬 오행 × MBTI 기질 공명</p>
          <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 12px" }}>사주로 MBTI를 알 수는 없지만, 오행 기질과 닮은 MBTI 유형이 있어요</p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: `${getOhColor(result.oh1)}11`, border: `1px solid ${getOhColor(result.oh1)}33`, borderRadius: 12, padding: "12px 10px" }}>
              <p style={{ fontSize: 11, color: getOhColor(result.oh1), fontWeight: 700, margin: "0 0 4px" }}>{result.name1} · {result.oh1}오행</p>
              <p style={{ fontSize: 12, color: "#d1d5db", margin: 0, lineHeight: 1.5 }}>{result.mbti1}</p>
            </div>
            <div style={{ flex: 1, background: `${getOhColor(result.oh2)}11`, border: `1px solid ${getOhColor(result.oh2)}33`, borderRadius: 12, padding: "12px 10px" }}>
              <p style={{ fontSize: 11, color: getOhColor(result.oh2), fontWeight: 700, margin: "0 0 4px" }}>{result.name2} · {result.oh2}오행</p>
              <p style={{ fontSize: 12, color: "#d1d5db", margin: 0, lineHeight: 1.5 }}>{result.mbti2}</p>
            </div>
          </div>
        </div>

        {/* 성격 미리보기 (무료) */}
        <div style={S.card}>
          <p style={S.secTitle}>💬 성격 & 기질 미리보기</p>
          <p style={S.body}>{result.personality.split(". ").slice(0, 2).join(". ")}.</p>
          {!paid && (
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 10 }}>💜 상세 분석에서 성격, 연애, 갈등, 결혼 궁합 전체 확인 가능</p>
          )}
        </div>

        {/* 타로 게임 (무료) */}
        <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1))", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 20, padding: "20px 18px", marginBottom: 16 }}>
          <p style={S.secTitle}>🃏 인연 타로 카드 뽑기</p>
          <p style={{ fontSize: 13, color: "#c4b5fd", margin: "0 0 16px", lineHeight: 1.6 }}>
            지금 두 사람의 인연 에너지를 타로로 확인해보세요
          </p>
          {!tarotUsed ? (
            <button onClick={drawTarot}
              style={{ width: "100%", background: "linear-gradient(135deg,#4c1d95,#831843)", border: "2px solid rgba(167,139,250,0.5)", borderRadius: 16, padding: "20px", cursor: "pointer", color: "white" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🃏</div>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>카드 한 장 뽑기</p>
              <p style={{ fontSize: 11, color: "#c4b5fd", margin: 0 }}>탭해서 인연 카드 확인하기</p>
            </button>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ background: "linear-gradient(135deg,#2d1b69,#4c1d95)", border: "2px solid #a78bfa", borderRadius: 16, padding: "24px 20px", opacity: tarotFlipped ? 1 : 0, transform: tarotFlipped ? "scale(1)" : "scale(0.9)", transition: "all 0.4s ease" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✨</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#c4b5fd", margin: "0 0 12px" }}>{tarotCard?.name}</p>
                <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.7, margin: 0 }}>{tarotCard?.meaning}</p>
              </div>
              <button onClick={() => { setTarotFlipped(false); setTimeout(() => { setTarotCard(null); setTarotUsed(false); }, 300); }}
                style={{ marginTop: 12, background: "none", border: "1px solid rgba(167,139,250,0.4)", borderRadius: 12, padding: "8px 20px", color: "#a78bfa", fontSize: 12, cursor: "pointer" }}>
                ↺ 다시 뽑기
              </button>
            </div>
          )}
        </div>

        {/* 잠금 / 상세 분석 */}
        {!paid ? (
          <div style={S.lockCard}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>🔒</div>
            <p style={{ fontSize: 17, fontWeight: 900, margin: "0 0 8px" }}>상세 분석 전체 보기</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 18px", lineHeight: 1.7 }}>
              연애 패턴 · 갈등 원인 분석<br />
              시너지 강점 · 연애 조언 · 결혼 궁합<br />
              사주 오행 기반 심층 해석까지
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {["💕 연애 패턴 전체", "⚡ 갈등 원인 분석", "✨ 시너지 강점", "🌿 연애 조언", "💍 결혼 궁합", "🔮 심층 오행 해석"].map(item => (
                <div key={item} style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 10, padding: "10px 8px", fontSize: 12, color: "#c4b5fd", textAlign: "center" }}>
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => router.push(`/gunghap/pay?id=${id}`)}
              style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 18, padding: "15px", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
              ₩990 · 지금 바로 전체 보기 →
            </button>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>24시간 이용 가능</p>
          </div>
        ) : (
          <>
            <div style={S.card}>
              <p style={S.secTitle}>💕 연애 패턴</p>
              <p style={S.body}>{result.love}</p>
            </div>
            <div style={S.card}>
              <p style={S.secTitle}>⚡ 갈등 원인</p>
              <p style={S.body}>{result.conflict}</p>
            </div>
            <div style={S.card}>
              <p style={S.secTitle}>✨ 시너지 강점</p>
              <p style={S.body}>{result.strength}</p>
            </div>
            <div style={S.card}>
              <p style={S.secTitle}>🌿 연애 조언</p>
              <p style={S.body}>{result.advice}</p>
            </div>
            <div style={S.card}>
              <p style={S.secTitle}>💍 결혼 궁합</p>
              <p style={S.body}>{result.marriage}</p>
            </div>
          </>
        )}

        {/* 사주 연결 CTA */}
        <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>🔮 더 깊은 운세가 궁금하다면</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 14px", lineHeight: 1.5 }}>사주 원국으로 보는 연애운 · 결혼운 · 배우자운 상세 분석</p>
          <Link href="/main-v2" style={{ display: "block", textAlign: "center", background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.5)", borderRadius: 12, padding: "12px", color: "#c4b5fd", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            점운 사주 무료로 시작하기 →
          </Link>
        </div>

        <button onClick={share}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "13px", color: "#c4b5fd", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          📤 결과 공유하기
        </button>
      </div>
    </div>
  );
}
