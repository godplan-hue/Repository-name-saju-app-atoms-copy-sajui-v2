"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isPartnerHost } from "@/lib/isPartnerHost";
import QAChatWidget from "@/components/QAChatWidget";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

/*
  이미지 URL — Unsplash에서 동물명으로 직접 검색된 확실한 사진들
  source.unsplash.com/featured 방식: 키워드로 항상 해당 동물 사진을 반환
*/
const COURSES = [
  {
    id: "free",
    name: "학",
    emoji: "🦢",
    tag: "일부무료",
    tagColor: "#16a34a",
    tagBg: "#f0fdf4",
    priceStr: "무료",
    desc: "오늘의 무료 사주",
    bg: "linear-gradient(145deg, #f0fdf4, #dcfce7)",
    border: "#86efac",
    accentColor: "#16a34a",
    // 두루미(학) — Pexels red-crowned-crane
    urls: [
      "https://images.pexels.com/photos/36606279/pexels-photo-36606279.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/36606276/pexels-photo-36606276.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/36606281/pexels-photo-36606281.jpeg?auto=compress&cs=tinysrgb&w=300",
    ],
    animDelay: "0s",
    packageName: null,
    pages: 0,
  },
  {
    id: "taste",
    name: "호랑이",
    emoji: "🐯",
    tag: "1추르",
    tagColor: "#b45309",
    tagBg: "#fefce8",
    priceStr: "₩9,900",
    desc: "재물·연애운 심층 분석",
    bg: "linear-gradient(145deg, #fefce8, #fef9c3)",
    border: "#fde047",
    accentColor: "#b45309",
    // 호랑이 — Pexels tiger
    urls: [
      "https://images.pexels.com/photos/27834738/pexels-photo-27834738.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/27834731/pexels-photo-27834731.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=300&auto=format&fit=crop&q=80",
    ],
    animDelay: "0.5s",
    packageName: "기본 분석",
    pages: 30,
  },
  {
    id: "popular",
    name: "봉황",
    emoji: "🦚",
    tag: "🔥 인기",
    tagColor: "#be185d",
    tagBg: "#fdf2f8",
    priceStr: "₩19,900",
    desc: "연애·건강·성공 전분야",
    bg: "linear-gradient(145deg, #fdf2f8, #fce7f3)",
    border: "#f9a8d4",
    accentColor: "#be185d",
    // 공작새(봉황) — Pexels peacock
    urls: [
      "https://images.pexels.com/photos/36606292/pexels-photo-36606292.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/4618412/pexels-photo-4618412.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=300&auto=format&fit=crop&q=80",
    ],
    animDelay: "1s",
    packageName: "베이직",
    pages: 75,
  },
  {
    id: "vip",
    name: "용",
    emoji: "🐲",
    tag: "👑 최고",
    tagColor: "#6d28d9",
    tagBg: "#f5f3ff",
    priceStr: "₩9,990",
    desc: "무제한 전체 운세",
    bg: "linear-gradient(145deg, #f5f3ff, #ede9fe)",
    border: "#c4b5fd",
    accentColor: "#6d28d9",
    // 용(드래곤 조각상) — Pexels dragon
    urls: [
      "https://images.pexels.com/photos/37535284/pexels-photo-37535284.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/7700740/pexels-photo-7700740.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/17063841/pexels-photo-17063841.jpeg?auto=compress&cs=tinysrgb&w=300",
    ],
    animDelay: "1.5s",
    packageName: "프리미엄",
    pages: 100,
  },
  {
    id: "couple",
    name: "거북",
    emoji: "🐢",
    tag: "💑 커플",
    tagColor: "#0e7490",
    tagBg: "#ecfeff",
    priceStr: "₩9,900",
    desc: "커플 궁합·인연 분석",
    bg: "linear-gradient(145deg, #ecfeff, #cffafe)",
    border: "#67e8f9",
    accentColor: "#0e7490",
    // 바다거북 — Pexels sea turtle
    urls: [
      "https://images.pexels.com/photos/36132584/pexels-photo-36132584.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/4767913/pexels-photo-4767913.jpeg?auto=compress&cs=tinysrgb&w=300",
      "https://images.pexels.com/photos/20443161/pexels-photo-20443161.jpeg?auto=compress&cs=tinysrgb&w=300",
    ],
    animDelay: "2s",
    packageName: "VIP",
    pages: 100,
  },
];

// 이미지 로드 실패 시 다음 URL 시도, 모두 실패 시 이모지 표시
function AnimalImg({
  urls, emoji, bg, alt, style,
}: {
  urls: string[]; emoji: string; bg: string; alt: string; style?: React.CSSProperties;
}) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed || idx >= urls.length) {
    return (
      <div style={{ width: "100%", height: "100%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
        {emoji}
      </div>
    );
  }
  return (
    <img
      key={idx}
      src={urls[idx]}
      alt={alt}
      style={style}
      loading="lazy"
      onError={() => {
        if (idx + 1 < urls.length) setIdx(idx + 1);
        else setFailed(true);
      }}
    />
  );
}

const BANNERS = [
  {
    img: "https://i.pinimg.com/736x/43/62/22/436222b26a1aeebae92aaa7eaa2f5ea3.jpg",
    badge: "🐱 점운",
    badgeBg: G,
    lines: ["점운에 오신 걸 환영합니다", "특별이벤트", "사주 990원"],
    lineSizes: [17, 20, 24],
    lineColors: ["#fff700", "#ffffff", "#ff3b3b"],
    overlay: "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(139,92,246,0.55) 100%)",
    fit: "contain" as const,
    route: "free" as const,
    modalId: "naming",
  },
  {
    img: "https://i.pinimg.com/736x/2f/b6/d4/2fb6d40a9b80a685052a1174960ec782.jpg",
    badge: "✨ 무료",
    badgeBg: "#16a34a",
    lines: ["무료인데 이렇게 상세할수가?", "인생을 바꿀 인생 역전 포인트까지", "지금 무료로 시작하기"],
    lineSizes: [15, 16, 20],
    lineColors: ["#ffffff", "#fff700", "#7df9c2"],
    overlay: "linear-gradient(135deg, rgba(22,163,74,0.52) 0%, rgba(16,185,129,0.45) 100%)",
    fit: "contain" as const,
    route: "free" as const,
  },
  {
    img: "https://i.pinimg.com/736x/2d/a5/2b/2da52b98d2ad341ad3b3f33d35dfd98f.jpg",
    badge: "💰 재물운",
    badgeBg: "#b45309",
    lines: ["돈 들어올 때", "노젓는 비법", "돈복 터지는 시기 확인하기"],
    lineSizes: [18, 12, 16],
    lineColors: ["#f9a8d4", "#fff700", "#7df9c2"],
    overlay: "linear-gradient(135deg, rgba(180,83,9,0.4) 0%, rgba(245,158,11,0.35) 100%)",
    fit: "contain" as const,
    route: "package" as const,
    modalId: "yearly",
  },
  {
    img: "https://i.pinimg.com/736x/8b/bc/25/8bbc258261ea953d149de68672016367.jpg",
    badge: "연애운",
    badgeBg: "#ec4899",
    lines: ["사랑이 찾아오는 시기", "연애운 심층 분석", "내 인연의 흐름을 확인해보세요"],
    lineSizes: [20, 16, 15],
    overlay: "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(239,68,68,0.45) 100%)",
    fit: "contain" as const,
    route: "package" as const,
    modalId: "yearly",
  },
  {
    // 사진이 아니라 글자+도형으로 직접 그리는 배너 — 990원 가격을 큰 숫자
    // 뱃지로 강조해서 한 번 더 눈에 띄게 보여줌
    graphic: true,
    route: "free" as const,
  },
  {
    chatBanner: true,
    route: "free" as const,
  },
];

const FORTUNE_CATEGORIES = [
  { id: "free",          title: "오늘의 무료운세", sub: "무료 체험",          emoji: "🌟", img: "https://i.pinimg.com/1200x/2f/1b/4e/2f1b4e0713ac39d9090ae3a3e5862db9.jpg", bg: "linear-gradient(145deg, #dcfce7, #bbf7d0)", accent: "#16a34a", price: "무료",        priceBg: "#15803d" },
  { id: "sinyeon_premium", title: "프리미엄 신년운세", sub: "신년+월별 12달", emoji: "⭐", img: "https://i.pinimg.com/736x/05/53/27/055327e74b7436d04c938d038ba0d900.jpg", bg: "linear-gradient(145deg, #ede9fe, #ddd6fe)", accent: "#7c3aed", price: "₩4,900", priceBg: "#7c3aed" },
  { id: "yearly",        title: "기본 분석",         sub: "재물운+연애운",       emoji: "🎍", img: "https://i.pinimg.com/1200x/24/32/ee/2432eed06907654905c7949ce4ea350d.jpg", bg: "linear-gradient(145deg, #fce7f3, #fbcfe8)", accent: "#db2777", price: "₩9,900",     priceBg: "#2563eb", badgeSide: "right" },
  { id: "wealth",        title: "재물운",           sub: "돈이 들어오는 시기", emoji: "💰", img: "https://i.pinimg.com/736x/b4/b0/5b/b4b05b2365cd1eb0f1426eacd8529c96.jpg", bg: "linear-gradient(145deg, #fef3c7, #fde68a)", accent: "#b45309", price: "₩990",      priceBg: "#ff0000" },
  { id: "love",          title: "연애운",           sub: "연애 타이밍과 인연", emoji: "💕", img: "https://i.pinimg.com/736x/8b/bc/25/8bbc258261ea953d149de68672016367.jpg", bg: "linear-gradient(145deg, #fdf2f8, #fbcfe8)", accent: "#be185d", price: "₩990",      priceBg: "#ff0000" },
  { id: "health",        title: "건강운",           sub: "건강운", emoji: "🍀", img: "https://i.pinimg.com/736x/66/b6/67/66b66708f6e337996b4fa81e95613c64.jpg", bg: "linear-gradient(145deg, #dcfce7, #bbf7d0)", accent: "#16a34a", price: "프리미엄", priceBg: "#15803d", badgeSide: "right" },
  { id: "compatibility", title: "궁합분석",          sub: "이름+궁합+전체사주", emoji: "💑", img: "https://i.pinimg.com/736x/56/27/4b/56274ba01259316125b29015d9b9a4fe.jpg", bg: "linear-gradient(145deg, #dbeafe, #bfdbfe)", accent: "#1d4ed8", price: "👑 VIP 전용", priceBg: "#6d28d9" },
  { id: "naming",        title: "이름분석",          sub: "5개 운세 묶음",      emoji: "✍️", img: "https://i.pinimg.com/1200x/23/01/49/2301499ea90a65609becd809e3554796.jpg", bg: "linear-gradient(145deg, #ecfeff, #cffafe)", accent: "#0e7490", price: "₩990",       priceBg: "#ff0000" },
  { id: "full",          title: "베이직",            sub: "올해+월별 운세", emoji: "🎯", img: "https://i.pinimg.com/1200x/5a/27/e1/5a27e1d0bf4ea71ee0dfc035f4724e5e.jpg", bg: "linear-gradient(145deg, #fce7f3, #f9a8d4)", accent: "#9d174d", price: "베이직",     priceBg: "#2563eb", badgeSide: "right" },
];

function FortuneGrid({ onPick, isPartner }: { onPick: (id: string) => void; isPartner: boolean }) {
  return (
    <div style={{ padding: "0 14px 28px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          {[0,1,2,3,4].map(i => (
            <span key={i} style={{ display: "inline-block", color: "#facc15", fontSize: 16, margin: "0 2px", animation: "starTwinkle 1.6s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}>★</span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {FORTUNE_CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => onPick(cat.id)}
              style={{
                aspectRatio: "1 / 1",
                background: (cat as any).img ? undefined : cat.bg, borderRadius: 16, cursor: "pointer",
                position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                boxShadow: `0 3px 14px ${cat.accent}1f`,
              }}
            >
              {(cat as any).img ? (
                <>
                  <img src={(cat as any).img} alt={cat.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 70%)" }} />
                  {(cat as any).price && (
                    <span style={{ position: "absolute", top: 6, ...((cat as any).badgeSide === "right" ? { right: 6 } : { left: 6 }), background: (cat as any).priceBg, color: (cat as any).priceColor ?? "#fff", fontSize: 10, fontWeight: 900, padding: "3px 9px", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.3)", minWidth: 44, textAlign: "center", display: "inline-block" }}>
                      {isPartner && (cat.id === "wealth" || cat.id === "love") ? "9,900원~" : (cat as any).price}
                    </span>
                  )}
                  {(cat as any).sub && (
                    <div style={{ position: "absolute", bottom: 7, left: 0, right: 0, textAlign: "center", fontSize: 10, fontWeight: 900, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.9)", padding: "0 4px", whiteSpace: "nowrap", overflow: "hidden" }}>{(cat as any).sub}</div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 900, color: cat.accent, textAlign: "center", lineHeight: 1.2, padding: "0 2px" }}>{cat.title}</div>
                </>
              )}
            </div>
          ))}
        </div>
    </div>
  );
}

const EXTRA_ITEMS = [
  { id: "sinyeon",    label: "신년운세",   sub: "올해 내 사주 완전분석", emoji: "🎍", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/1200x/a6/30/a7/a630a728391bc4784a814211184b42bb.jpg", accent: "#16a34a" },
  { id: "daewoon",   label: "대운(大運)", sub: "10년 단위 운명 흐름",     emoji: "🌌", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/736x/8c/d5/cb/8cd5cb716cc5ad25ada38aa88306c52d.jpg", accent: "#7c3aed" },
  { id: "love_detail",      label: "연애사주",         sub: "나의 연애 DNA",           emoji: "💗", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/1200x/f1/66/b5/f166b50a65fc824659d395a75037937b.jpg", accent: "#be185d" },
  { id: "reunion",          label: "재회운",           sub: "그 사람 다시 만날까",     emoji: "💔", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/736x/a2/e3/2a/a2e32abeae3320baec01b62d54e44751.jpg", accent: "#e11d48" },
  { id: "findmatch",        label: "내 사람 찾기",     sub: "나에게 맞는 사람",        emoji: "🔍", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/736x/2f/b6/d4/2fb6d40a9b80a685052a1174960ec782.jpg", accent: "#9333ea" },
  { id: "marriage_detail",  label: "결혼사주",         sub: "배우자 복·결혼 타이밍",   emoji: "💍", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/1200x/4c/01/00/4c01008435276aec3d662fff9236c87b.jpg", accent: "#ea580c" },
  { id: "divorce",          label: "이혼운세",         sub: "관계의 끝·새 출발",       emoji: "🌧", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/736x/cb/9c/bc/cb9cbc190726bace6f4575ff8648ab5d.jpg", accent: "#64748b" },
  { id: "taegil",           label: "택일(擇日)",       sub: "내 사주에 맞는 좋은 날",  emoji: "📅", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/1200x/b7/c3/ca/b7c3ca787665a1ec29ea1d2643ddc55a.jpg", accent: "#0284c7" },
  { id: "pet_compat",       label: "반려동물 궁합",    sub: "나와 우리 아이 궁합",     emoji: "🐾", price: "₩2,900", priceNum: 2900, premium: false, img: "https://i.pinimg.com/736x/4f/02/13/4f0213abf6635336a4b3719554766624.jpg", accent: "#f97316" },
];

const EXTRA_MCFG: Record<string, { emoji: string; title: string; desc: string; price: string; priceNum: number; features: string[] }> = {
  taegil:          { emoji: "📅", title: "택일(擇日)", desc: "결혼·이사·개업·계약 — 내 사주에 맞는 좋은 날 찾기", price: "₩2,900", priceNum: 2900, features: ["💒 결혼·예식 길일", "🏠 이사·입주 길일", "🏢 개업·창업 길일", "📝 계약·서류 길일", "📅 피해야 할 날짜"] },
  sinyeon:         { emoji: "🎍", title: "신년운세", desc: "올해 기운이 내 사주에 미치는 영향 전체 분석", price: "₩2,900", priceNum: 2900, features: ["🌊 올해 전체 흐름", "💰 재물·돈 흐름", "💕 연애·인연", "💼 직업·커리어", "🌿 건강 포인트", "🧭 올해 핵심 조언"] },
  sinyeon_premium: { emoji: "⭐", title: "프리미엄 신년운세", desc: "신년 6개 섹션 + 1월~12월 월별 흐름까지 완전판", price: "₩4,900", priceNum: 4900, features: ["🌊 올해 전체 흐름", "💰 재물·돈 흐름", "💕 연애·인연", "💼 직업·커리어", "🌿 건강", "📅 1~12월 월별 흐름"] },
  love_detail:     { emoji: "💗", title: "연애사주", desc: "나의 연애 DNA — 스타일·강점·패턴·지금 흐름까지", price: "₩2,900", priceNum: 2900, features: ["💗 나의 연애 스타일", "✨ 연애할 때 강한 점", "⚠️ 반복되는 패턴", "🌊 지금 연애 흐름", "👑 나에게 맞는 이상형"] },
  reunion:         { emoji: "💔", title: "재회운", desc: "그 사람과 다시 이어질 수 있는지 사주로 풀어드립니다", price: "₩2,900", priceNum: 2900, features: ["💔 이별 후 감정 흐름", "🔮 재회 가능성", "⏰ 재회 타이밍", "⚠️ 재회 시 주의점", "🌱 새로운 방향"] },
  findmatch:       { emoji: "🔍", title: "내 사람 찾기", desc: "나와 진짜 맞는 사람의 특성과 만남의 흐름", price: "₩2,900", priceNum: 2900, features: ["✨ 나와 맞는 사람 특성", "⏰ 인연 오는 시기", "📍 인연 오는 방식", "💗 관계 발전 패턴", "🌱 놓치지 않으려면"] },
  marriage_detail: { emoji: "💍", title: "결혼사주", desc: "배우자 복·만나는 시기·결혼 후 흐름 완전 분석", price: "₩2,900", priceNum: 2900, features: ["💑 타고난 배우자 스타일", "📍 만나는 시기·방식", "👤 배우자 특성", "🏠 결혼 후 흐름", "⚠️ 결혼에서 조심할 점"] },
  divorce:         { emoji: "🌧", title: "이혼운세", desc: "현재 관계 에너지·분리 흐름·새 출발 타이밍", price: "₩2,900", priceNum: 2900, features: ["🌊 지금 관계 에너지", "📋 분리 과정 흐름", "💰 재산·현실 측면", "🌅 이후 새 출발", "💪 앞으로를 위한 조언"] },
  pet_compat:      { emoji: "🐾", title: "반려동물 궁합", desc: "내 사주와 우리 아이의 기운 — 궁합과 함께하는 법", price: "₩2,900", priceNum: 2900, features: ["🐾 나와 반려동물의 기운 궁합", "💗 교감하는 방법", "🌟 반려동물이 주는 에너지", "⚠️ 함께할 때 조심할 점", "🌱 더 깊은 유대를 위해"] },
};

function ExtraFortuneSection({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div style={{ padding: "0 14px 20px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }} />
        <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4c1d95)", padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(124,58,237,0.4)" }}>✨ 더 많은 운세 · ₩2,900부터</span>
        <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {EXTRA_ITEMS.map(item => (
          <div key={item.id} onClick={() => onPick(item.id)} style={{ aspectRatio: "1 / 1", borderRadius: 14, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: `0 3px 12px ${item.accent}28` }}>
            <img src={item.img} alt={item.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 75%)" }} />
            {item.premium && (
              <span style={{ position: "absolute", top: 5, right: 5, background: "#7c3aed", color: "#fff", fontSize: 9, fontWeight: 900, padding: "2px 6px", borderRadius: 20 }}>₩5,900</span>
            )}
            <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center", padding: "0 4px" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,1)", lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden" }}>{item.label}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.72)", textShadow: "0 1px 4px rgba(0,0,0,0.9)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden" }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannerSlider({ onStart, onModal, isPartner, chatProfile }: { onStart: (route: "free" | "package") => void; onModal?: (id: string) => void; isPartner: boolean; chatProfile?: { name: string; birthYear: number } | null }) {
  const [cur, setCur] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startXRef = useRef<number | null>(null);

  const resetTimer = (next: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCur(c => {
      return (c + 1) % BANNERS.length;
    }), 4500);
    setCur(next);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCur(c => {
      return (c + 1) % BANNERS.length;
    }), 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const b = BANNERS[cur];

  const lineColors = ["#fff700", "#ffffff", "#ffd6f0"];

  return (
    <div style={{ padding: "16px 14px 0", maxWidth: 480, margin: "0 auto" }}>
      <div
        style={{ height: 320, borderRadius: 20, position: "relative", overflow: "hidden", cursor: "pointer", boxShadow: "0 6px 28px rgba(139,92,246,0.18)", background: "#f9f0ff" }}
        onClick={() => {
          if ((b as any).chatBanner) {
            document.getElementById("chat-widget")?.scrollIntoView({ behavior: "smooth" });
            return;
          }
          if ((b as any).modalId && onModal) { onModal((b as any).modalId); return; }
          onStart(b.route);
        }}
        onTouchStart={e => { startXRef.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (startXRef.current === null) return;
          const dx = e.changedTouches[0].clientX - startXRef.current;
          if (Math.abs(dx) > 40) resetTimer(dx < 0 ? (cur + 1) % BANNERS.length : (cur - 1 + BANNERS.length) % BANNERS.length);
          startXRef.current = null;
        }}
      >
        {(b as any).chatBanner ? (
          /* 반짝이는 배경 + 무엇이든 물어보세요 텍스트 */
          <div style={{ position: "absolute", inset: 0 }}>
            <img src="https://i.pinimg.com/736x/81/09/ff/8109fff1db1ee44dbdeab87d9cfe276b.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.22)" }} />
            <span style={{ position: "absolute", top: 16, left: 16, background: "#ec4899", color: "white", fontSize: 12, fontWeight: 900, padding: "5px 13px", borderRadius: 20, zIndex: 2 }}>AI 사주 상담</span>
            <div style={{ position: "absolute", bottom: 20, left: 18, zIndex: 3 }}>
              <p style={{ margin: "0 0 14px", fontSize: 17, fontWeight: 900, lineHeight: 1.35, letterSpacing: "-0.3px" }}>
                <span style={{ color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>복냥이에게 당신의 운명을{"\n"}</span><br/>
                <span style={{ color: "white", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>무엇이든 직접 물어봐요!</span>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "inline-flex", alignItems: "center", padding: "8px 16px", background: "#ec4899", borderRadius: 50, boxShadow: "0 3px 12px rgba(236,72,153,0.5)" }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "white" }}>인생 역전 →</span>
                </div>
                <span style={{ background: "white", color: "#ef4444", fontSize: 11, fontWeight: 900, padding: "5px 12px", borderRadius: 50, animation: "freeBadgePulse 1.2s ease-in-out infinite" }}>매일 무료 3회</span>
              </div>
            </div>
          </div>
        ) : (b as any).chatPromo ? (
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url('https://i.pinimg.com/736x/81/09/ff/8109fff1db1ee44dbdeab87d9cfe276b.jpg')`, backgroundSize: "cover", backgroundPosition: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.55)" }} />
            <div style={{ position: "relative", textAlign: "center", width: "100%" }}>
              <h1 style={{ fontSize: 25, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.3, letterSpacing: "-0.3px", color: "#9f1239", textShadow: "1.5px 0 0 #fff, -1.5px 0 0 #fff, 0 1.5px 0 #fff, 0 -1.5px 0 #fff, 1.5px 1.5px 0 #fff, -1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 0 0 2px #fff", animation: "sparklePulse 1.8s ease-in-out infinite" }}>
                복냥이가 읽는 나의 운명
              </h1>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2px", margin: "0 0 14px", color: "#b76e79", textShadow: "1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff", animation: "sparklePulse 1.8s ease-in-out infinite" }}>당신의 운명을 AI가 풀어드립니다</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
                {[
                  { text: "⚡ AI 정밀분석", bg: "linear-gradient(135deg, #6d28d9, #8b5cf6)" },
                  { text: "🔒 개인정보 즉시삭제", bg: "linear-gradient(135deg, #15803d, #16a34a)" },
                  { text: "⏱ 3초 완성", bg: "linear-gradient(135deg, #b45309, #d97706)" },
                ].map(chip => (
                  <span key={chip.text} style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: chip.bg, borderRadius: 20, padding: "6px 12px", boxShadow: "0 3px 8px rgba(0,0,0,0.15)" }}>{chip.text}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (b as any).graphic ? (
          /* 사진 없이 직접 그리는 990원 강조 배너 */
          <div style={{ position: "absolute", inset: 0 }}>
            <img src="https://i.pinimg.com/736x/b2/90/0f/b2900f52b17624d4286a216eed2ddc0a.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{ position: "absolute", top: 14, left: 16, display: "inline-block", background: "#facc15", color: "white", fontSize: 12, fontWeight: 900, padding: "5px 13px", borderRadius: 20, zIndex: 2, textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}>무료 사주</span>
            <div style={{ position: "absolute", top: 18, right: 18, width: 200, height: 135, borderRadius: "50%", border: "5px solid #fbbf24", background: "linear-gradient(160deg, #ffffff, #f3e8ff)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(109,40,217,0.35), inset 0 0 0 2px rgba(255,255,255,0.6)" }}>
              {!isPartner && <span style={{ fontSize: 46, fontWeight: 900, color: "#6d28d9", lineHeight: 1, animation: "textGlow 1.8s ease-in-out infinite" }}>₩990</span>}
              <span style={{ fontSize: isPartner ? 20 : 12, fontWeight: 900, marginTop: 5 }}>
                <span style={{ color: "#15803d" }}>오늘의 운세</span>{" "}
                <span style={{ color: "#be185d" }}>매일 무료</span>
              </span>
            </div>
          </div>
        ) : (
          <>
            <img src={b.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "opacity 0.4s" }} />
            {/* 하단 텍스트 그라데이션 */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)", pointerEvents: "none" }} />
            {/* 배지 */}
            <span style={{ position: "absolute", top: 14, left: 16, display: "inline-block", background: b.badgeBg, color: "white", fontSize: 12, fontWeight: 900, padding: "5px 13px", borderRadius: 20, zIndex: 2, textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}>{b.badge}</span>
            <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, zIndex: 2 }}>
              {b.lines!.map((line, i) => {
                const isKeyLine = i === b.lines!.length - 1;
                // 첫 배너의 "사주 990원" 줄 — 파트너 화면에서는 990원 단품을 안 팔기로
                // 했으므로 숫자 없이 일반적인 환영 문구로 바꿔서 보여줌
                const displayLine = isPartner && line === "사주 990원" ? "지금 바로 시작하기" : line;
                return (
                  <p key={i} style={{ fontSize: (b as any).lineSizes?.[i] ?? (i === 0 ? 17 : 12), fontWeight: i === 0 ? 900 : 700, color: (b as any).lineColors?.[i] ?? lineColors[i] ?? "white", margin: "0 0 2px", lineHeight: 1.35, textShadow: "0 1px 8px rgba(0,0,0,0.7)", animation: isKeyLine ? "bannerKeyGlow 1.8s ease-in-out infinite" : undefined }}>{displayLine}</p>
                );
              })}
            </div>
          </>
        )}
        {/* 이전 화살표 */}
        <button
          onClick={e => { e.stopPropagation(); resetTimer((cur - 1 + BANNERS.length) % BANNERS.length); }}
          aria-label="이전 배너"
          style={{ position: "absolute", top: "50%", left: 10, transform: "translateY(-50%)", zIndex: 3, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.35)", color: "white", fontSize: 18, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          ‹
        </button>
        {/* 다음 화살표 */}
        <button
          onClick={e => { e.stopPropagation(); resetTimer((cur + 1) % BANNERS.length); }}
          aria-label="다음 배너"
          style={{ position: "absolute", top: "50%", right: 10, transform: "translateY(-50%)", zIndex: 3, width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.35)", color: "white", fontSize: 18, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          ›
        </button>
        {/* 노란 진행선 — chatBanner 제외 */}
        {!(b as any).chatBanner && (
          <div key={`prog-${cur}`} style={{ position: "absolute", bottom: 0, left: 0, height: 4, background: "linear-gradient(90deg,#facc15,#f97316)", animation: "bannerProgress 4500ms linear forwards", zIndex: 4, boxShadow: "0 0 8px rgba(250,204,21,0.7)" }} />
        )}
        {/* 인디케이터 — 노란색 */}
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", zIndex: 3 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={e => { e.stopPropagation(); resetTimer(i); }}
                style={{ width: cur === i ? 22 : 7, height: 7, borderRadius: 99, background: cur === i ? "#facc15" : "rgba(250,204,21,0.4)", transition: "all 0.3s ease", cursor: "pointer", boxShadow: cur === i ? "0 0 6px rgba(250,204,21,0.8)" : "none" }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 32 }} />
    </div>
  );
}

function ModalParamReader({ setShowModal, setModalSelectedCats }: { setShowModal: (v: string) => void; setModalSelectedCats: (v: string[]) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const modal = searchParams.get("modal");
    if (modal === "naming") {
      setModalSelectedCats(["💰 재물운", "💕 연애운", "💪 건강운", "🎯 성공운", "✨ 총운"]);
      setShowModal("naming");
    }
    const ref = searchParams.get("ref");
    if (ref) localStorage.setItem("v2_ref", ref);
  }, [searchParams]);
  return null;
}

export default function MainV2() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [savedProfile, setSavedProfile] = useState<{ name: string; birthYear: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  // 다이아 등급 파트너의 서브도메인(예: kim.jeomun.com)으로 들어온 경우,
  // "점운" 대신 그 파트너가 등록한 상호명·로고로 헤더를 바꿔서 보여줌
  const [brand, setBrand] = useState<{ businessName: string; logoUrl: string; customPriceBasic?: string; customPriceStandard?: string; customPricePremium?: string; customPriceVip?: string } | null>(null);
  useEffect(() => {
    const hostname = window.location.hostname;
    const partner = isPartnerHost(hostname);
    setIsPartner(partner);
    if (partner) {
      const slug = hostname.split(".")[0];
      fetch(`/api/partner/brand?subdomain=${encodeURIComponent(slug)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setBrand(data); })
        .catch(() => {});
    }
  }, []);
  // 배경음악 — 브라우저가 사용자 터치 전 자동재생을 막아서, "완전 자동"은 안 되고
  // 이 버튼을 한 번 눌러야 재생이 시작됨(그 한 번의 클릭이 "사용자 동작"이 되어줌).
  // /public/bgm.mp3 파일이 있어야 실제로 소리가 남(파일은 직접 넣어야 함)
  const [musicOn, setMusicOn] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [modalSelectedCats, setModalSelectedCats] = useState<string[]>(["💰 재물운", "💕 연애운", "💪 건강운", "🎯 성공운", "✨ 총운"]);
  const [extraOtherInput, setExtraOtherInput] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      audio.volume = 0.35;
      audio.play().then(() => setMusicOn(true)).catch(() => alert("음악 파일을 찾을 수 없습니다(public/bgm.mp3을 추가해주세요)."));
    }
  };

  // 입장 환영 음성 — 배경음악과 같은 이유로 페이지가 열리자마자 저절로
  // 말하게는 못 하고, 화면에 처음 손을 댄 그 순간(클릭/터치)에 들려줌.
  // 하루에 한 번만 들리게 하고, 이 useEffect는 main-v2 화면에 있을 때만
  // 살아있어서(다른 페이지로 넘어가면 정리됨) 다른 페이지에서는 절대 안 들림
  useEffect(() => {
    // 파트너 서브도메인에서는 990원 단품을 안 팔기로 했으므로, 이 인사말도
    // "점운"·"990원" 언급 없이 들려야 함(아예 다른 멘트로 분기)
    if (isPartner) return;
    const todayKey = new Date().toDateString();
    if (localStorage.getItem("v2_greeting_shown_date") === todayKey) return;

    const speakGreeting = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utter = new SpeechSynthesisUtterance("안녕하세요, 점운입니다. 990원부터 시작하는 정확한 사주 분석, 지금 만나보세요.");
        utter.lang = "ko-KR";
        window.speechSynthesis.speak(utter);
        localStorage.setItem("v2_greeting_shown_date", todayKey);
      }
      window.removeEventListener("click", speakGreeting);
      window.removeEventListener("touchstart", speakGreeting);
    };
    window.addEventListener("click", speakGreeting);
    window.addEventListener("touchstart", speakGreeting);
    return () => {
      window.removeEventListener("click", speakGreeting);
      window.removeEventListener("touchstart", speakGreeting);
    };
  }, [isPartner]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("v2_user_name");
    if (saved) setUser(saved);
    try {
      const raw = localStorage.getItem("v2_saved_profile");
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.name && p?.birthYear) setSavedProfile({ name: p.name, birthYear: Number(p.birthYear) });
      }
    } catch {}
    // 프로필 입력 후 돌아왔을 때 대기 중이던 특별 사주 모달 자동 오픈
    const pendingModal = sessionStorage.getItem("v2_after_profile_modal");
    if (pendingModal) {
      sessionStorage.removeItem("v2_after_profile_modal");
      setShowModal(pendingModal);
    }
  }, []);

  const handleCourse = (c: typeof COURSES[0]) => {
    if (c.id === "free") {
      router.push(user ? "/main-v2/profile" : "/main-v2/login");
    } else {
      sessionStorage.setItem("selectedPackage", c.packageName ?? "");
      router.push(`/payment-complete?package=${encodeURIComponent(c.packageName ?? "")}&pages=${c.pages}`);
    }
  };

  if (!mounted) return null;

  return (
    <main style={{ minHeight: "100vh", background: BG, backgroundImage: `url('https://i.pinimg.com/736x/81/09/ff/8109fff1db1ee44dbdeab87d9cfe276b.jpg')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", overflowX: "hidden" }}>
      <Suspense fallback={null}><ModalParamReader setShowModal={(v) => setShowModal(v)} setModalSelectedCats={setModalSelectedCats} /></Suspense>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="none" />

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.12)", position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={toggleMusic} aria-label="배경음악 켜기/끄기" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, marginRight: 2 }}>
            {musicOn ? "🔊" : "🔇"}
          </button>
          {brand?.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.businessName} style={{ width: 20, height: 20, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 20 }}>🐱</span>
          )}
          <span style={{ fontWeight: 900, fontSize: 16, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{brand?.businessName || "점운"}</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {user
            ? (
              <>
                <span style={{ fontSize: 12, color: "#6d28d9", fontWeight: 700 }}>{user}님 👋</span>
                <button
                  onClick={() => {
                    if (!confirm("로그아웃하시겠어요? 다른 분 정보로 새로 시작할 수 있어요.")) return;
                    localStorage.removeItem("v2_user_name");
                    // v2_saved_profile, v2_privacy_agreed는 일부러 안 지움 — 같은
                    // 사람이 로그아웃 후 다시 로그인했을 때 생년월일 등을 또
                    // 입력하거나 개인정보 동의를 다시 체크하지 않아도 되게 함.
                    // (main-v2/profile에서 로그인한 이름과 저장된 이름이 다르면 그
                    // 저장된 정보를 안 쓰도록 이미 따로 체크하고 있어서, "다른 분
                    // 정보로 새로 시작"도 그쪼에서 정상적으로 처리됨)
                    localStorage.removeItem("v2_login_session_id");
                    localStorage.removeItem("v2_profile_shown_session");
                    sessionStorage.removeItem("v2_profile");
                    sessionStorage.removeItem("v2_result");
                    setUser(null);
                  }}
                  style={{ padding: "6px 12px", background: "#f3e8ff", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                  로그아웃
                </button>
              </>
            )
            : <button onClick={() => router.push("/main-v2/login")} style={{ padding: "6px 14px", background: G, color: "white", border: "none", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>로그인</button>
          }
          {!isPartner && <button onClick={() => router.push("/main-v2/payment")} style={{ padding: "6px 13px", background: G, color: "white", border: "none", borderRadius: 20, fontWeight: 900, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 8px rgba(236,72,153,0.3)" }}>💳 전체운세</button>}
          <button onClick={() => router.push("/main-v2/history")} style={{ padding: "6px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📂 보관함</button>
          <button onClick={() => router.push("/saju-info")} style={{ padding: "6px 12px", background: "#f3e8ff", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 20, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📖 사주정보</button>
        </div>
      </header>

      {/* 헤드라인 */}
      <section style={{ padding: "20px 16px 4px", textAlign: "center" }}>
        <h1 style={{ fontSize: 25, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.3, letterSpacing: "-0.3px", color: "#9f1239", textShadow: "1.5px 0 0 #fff, -1.5px 0 0 #fff, 0 1.5px 0 #fff, 0 -1.5px 0 #fff, 1.5px 1.5px 0 #fff, -1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 0 0 2px #fff", animation: "sparklePulse 1.8s ease-in-out infinite" }}>
          복냥이가 읽는 나의 운명
        </h1>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2px", margin: "0 0 12px", color: "#b76e79", textShadow: "1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 0 1.5px #fff", animation: "sparklePulse 1.8s ease-in-out infinite" }}>당신의 운명을 AI가 풀어드립니다</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          {[
            { text: "⚡ AI 정밀분석", bg: "linear-gradient(135deg, #6d28d9, #8b5cf6)" },
            { text: "🔒 개인정보 즉시삭제", bg: "linear-gradient(135deg, #15803d, #16a34a)" },
            { text: "⏱ 3초 완성", bg: "linear-gradient(135deg, #b45309, #d97706)" },
          ].map(b => (
            <span key={b.text} style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: b.bg, borderRadius: 20, padding: "6px 12px", boxShadow: "0 3px 8px rgba(0,0,0,0.15)" }}>{b.text}</span>
          ))}
        </div>
      </section>

      {/* 슬라이드 배너 */}
      <BannerSlider isPartner={isPartner} chatProfile={savedProfile} onStart={route => router.push(route === "package" ? "/main-v2/payment?highlight=wealthlove" : (user ? "/main-v2/profile" : "/main-v2/login"))} onModal={id => setShowModal(id)} />

      {/* 전체 운세 바로가기 */}
      {!isPartner && (
        <div style={{ padding: "0 14px 10px", maxWidth: 480, margin: "0 auto" }}>
          <button
            onClick={() => router.push("/main-v2/payment")}
            style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.35)", letterSpacing: "-0.1px" }}>
            💳 전체 운세 패키지 보기
          </button>
        </div>
      )}

      {/* 운세 선택 — 9개 박스 그리드(맨 앞 1개는 무료체험, 나머지 8개는 VIP 패키지의
          8개 항목을 그대로 미리보기 — 그래서 이름/내용을 다른 걸로 바꾸지 않음).
          재물운/연애운은 990원 단품 결제로, 나머지는 패키지(9,900원~) 결제로 보냄.
          무료체험은 별도의 진짜 무료 분석 플로우로 보냄(여기서 결제 없음). */}
      <FortuneGrid isPartner={isPartner} onPick={id => {
        sessionStorage.setItem("selectedFortune", id);
        // 파트너 서브도메인에서는 990원 단품 결제를 팔지 않기로 했으므로, 재물운/연애운도
        // 다른 항목들처럼 패키지(9,900원~) 화면으로 보냄
        const SELECT_ROUTE_IDS = isPartner ? new Set<string>() : new Set(["wealth", "love"]);
        // 박스에 표시된 가격 배지(9,900~/프리미엄전용/VIP전용)에 맞는 패키지가
        // 실제로 미리 선택된 채로 들어가게 — 안 그러면 늘 기본값(기본분석 9,900원)
        // 이 선택된 걸로 보여서 "프리미엄 전용"이라고 눌렀는데 다른 게 선택된
        // 것처럼 보이는 문제가 생김
        const PRESELECT: Record<string, string> = {
          yearly: "basic", monthly: "basic",
          health: "premium",
          compatibility: "vip", naming: "vip", full: "vip",
        };
        if (id === "free") router.push(user ? "/main-v2/profile" : "/main-v2/login");
        else if (id === "sinyeon_premium") {
          sessionStorage.setItem("v2_after_profile_modal", id);
          router.push(user ? "/main-v2/profile" : "/main-v2/login");
        }
        else { if (id === "naming") setModalSelectedCats(["💰 재물운", "💕 연애운", "💪 건강운", "🎯 성공운", "✨ 총운"]); setShowModal(id); }
      }} />

      {/* 가격 신뢰 후킹 문구 */}
      <div style={{ padding: "0 14px 20px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ position: "relative", overflow: "hidden", background: "linear-gradient(135deg, rgba(45,16,62,0.95), rgba(74,26,84,0.92))", border: "2px solid rgba(251,191,36,0.75)", borderRadius: 14, padding: "16px 18px", textAlign: "center", boxShadow: "0 4px 18px rgba(74,26,84,0.35)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "200%", background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)", animation: "shimmerSweep 3.2s ease-in-out infinite", pointerEvents: "none" }} />
          <p style={{ position: "relative", fontSize: 13, fontWeight: 800, color: "#f9a8d4", margin: "0 0 5px" }}>혹시 소문 듣고 오셨나요?</p>
          <p style={{ position: "relative", fontSize: 12, fontWeight: 800, margin: 0, lineHeight: 1.5, color: "#ffffff", animation: "textGlow 1.8s ease-in-out infinite" }}>20만원씩 내고 봤던 사주보다<br/>더 자세하고 정확하대요</p>
        </div>
      </div>

      {/* 히어로 */}
      <section style={{ padding: "24px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 6 }}>
            {[0,1,2,3,4].map(i => (
              <span key={i} style={{ display: "inline-block", color: "#dc2626", fontSize: 16, margin: "0 2px", animation: "starTwinkle 1.6s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}>✨</span>
            ))}
          </div>
          <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.1, marginBottom: 12, color: "#8b2f8f", textShadow: "0 0 8px #fff, 0 0 8px #fff, 0 2px 5px #fff", animation: "bigGlow 2.4s ease-in-out infinite" }}>
            <span style={{ display: "inline-block", transform: "rotate(-8deg) translateX(-4px)" }}>점</span>
            <br/>
            <span style={{ display: "inline-block", transform: "rotate(6deg) translateX(8px)" }}>운</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(255,255,255,0.9)", borderRadius: 20 }}>
            <span style={{ fontSize: 12 }}>🌸</span>
            <span style={{ fontSize: 12, color: "#ec4899", fontWeight: 700 }}>오늘의 무료사주</span>
          </div>
        </div>
        {/* 마법사 고양이 이미지 */}
        <div style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
          <img
            src="https://i.pinimg.com/736x/ac/41/34/ac4134d338bc8fab68537a589fecb08b.jpg"
            alt="사주 마법사 고양이"
            style={{
              width: 220, height: 220, objectFit: "cover", objectPosition: "center top",
              borderRadius: 32,
              boxShadow: "0 12px 40px rgba(139,92,246,0.3)",
              animation: "catFloat 3s ease-in-out infinite",
            }}
          />
          <div style={{
            position: "absolute", bottom: -8, right: -8,
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            color: "white", fontSize: 10, fontWeight: 900,
            padding: "4px 10px", borderRadius: 20,
            boxShadow: "0 3px 12px rgba(139,92,246,0.4)",
          }}>✨ AI 사주 점운</div>
        </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <div style={{ padding: "0 14px 40px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "32px 20px", borderRadius: 20, background: `linear-gradient(135deg, rgba(236,72,153,0.76), rgba(139,92,246,0.76)), url(https://i.pinimg.com/736x/4d/19/ba/4d19bac9e87e2f3d28505b6e59992c02.jpg)`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 8px 24px rgba(139,92,246,0.25)" }}>
          <div style={{ fontSize: 56, marginBottom: 10, display: "inline-block", animation: "animalFloat 3s ease-in-out infinite" }}>😺</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 8px" }}>지금 운명을 확인하세요</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: "0 0 18px" }}>복냥이가 당신의 길을 안내합니다 🐾</p>
          <a href="/main-v2/qa-list"
            style={{ display: "block", width: "100%", maxWidth: 300, margin: "0 auto", padding: "14px 0", background: "white", color: "#ec4899", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 18px rgba(0,0,0,0.15)", textDecoration: "none", textAlign: "center" }}>
            💬 사주 Q&amp;A 바로 확인하기
          </a>
        </div>
      </div>

      {/* ── 추가 운세 상품 섹션 ── */}
      {!isPartner && (
        <ExtraFortuneSection onPick={(id) => {
          // 결제/진입 전에 항상 프로필 입력 화면 거치게 함 (대운 포함 전체)
          sessionStorage.setItem("v2_after_profile_modal", id);
          router.push(user ? "/main-v2/profile" : "/main-v2/login");
        }} />
      )}

      {/* 복냥이 상담창 — 내정보(푸터) 바로 위 */}
      {!isPartner && savedProfile && (
        <div id="chat-widget" style={{ padding: "0 14px 20px", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <QAChatWidget name={savedProfile.name} birthYear={savedProfile.birthYear} />
        </div>
      )}

      {/* 푸터 */}
      <footer style={{ padding: "0 30px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 320, margin: "0 auto", padding: "18px 16px", borderRadius: 20, background: "#fff5f8" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 5 }}>
          <span>🐱</span>
          <span style={{ fontSize: 13, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운</span>
        </div>
        <p style={{ color: "#6d28d9", fontSize: 11, fontWeight: 700, margin: "0 0 8px" }}>© 2026 점운 · AI 동양 사주 분석</p>
        <div style={{ color: "#581c87", fontSize: 10.5, fontWeight: 700, lineHeight: 1.8, marginBottom: 12, letterSpacing: "0.1px" }}>
          <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
          <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
          <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
          <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38, 7층 7017호(대치동)</p>
        </div>
        <div style={{ marginBottom: 10 }}>
          <p style={{ color: "#831843", fontSize: 11, fontWeight: 800, margin: "0 0 3px" }}>📧 info@jeomun.com · 📞 010-4714-2689</p>
          <p style={{ color: "#a78bfa", fontSize: 10.5, fontWeight: 700, margin: "0 0 8px" }}>전화 상담은 제공하지 않습니다. 문의하기를 이용해주세요.</p>
          <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "6px 16px", border: "1.5px solid #ec4899", borderRadius: 20, color: "#ec4899", textDecoration: "none", fontWeight: 800, fontSize: 11 }}>문의하기</a>
        </div>
        <div style={{ fontSize: 11, marginBottom: 8 }}>
          <a href="/terms" style={{ color: "#6d28d9", textDecoration: "none", fontWeight: 600 }}>이용약관</a>
          <span style={{ color: "#e5e7eb", margin: "0 8px" }}>|</span>
          <a href="/privacy" style={{ color: "#6d28d9", textDecoration: "none", fontWeight: 600 }}>개인정보처리방침</a>
          <span style={{ color: "#e5e7eb", margin: "0 8px" }}>|</span>
          <a href="/refund" style={{ color: "#6d28d9", textDecoration: "none", fontWeight: 600 }}>환불정책</a>
        </div>
        <a href="/partner" style={{ color: "#dc2626", textDecoration: "none", fontSize: 11, fontWeight: 700 }}>사주 사업을 하고 계신가요? 파트너 모집 안내 →</a>
        </div>
      </footer>

      <style jsx>{`
        @keyframes animalFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-9px); }
        }
        @keyframes catFloat {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-150%) skewX(-15deg); }
          50%  { transform: translateX(350%) skewX(-15deg); }
          100% { transform: translateX(350%) skewX(-15deg); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 3px rgba(251,191,36,0.3); }
          50%      { text-shadow: 0 0 12px rgba(251,191,36,0.95), 0 0 4px rgba(255,255,255,0.7); }
        }
        @keyframes bannerProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes freeBadgePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(239,68,68,0); }
          50%      { transform: scale(1.12); box-shadow: 0 0 10px rgba(239,68,68,0.6); }
        }
        @keyframes bannerKeyGlow {
          0%, 100% { text-shadow: 0 1px 8px rgba(0,0,0,0.7); }
          50%      { text-shadow: 0 1px 8px rgba(0,0,0,0.7), 0 0 14px currentColor, 0 0 4px rgba(255,255,255,0.8); }
        }
        @keyframes waveGlow {
          0%, 100% { text-shadow: 0 0 2px rgba(236,72,153,0.2); color: #8b2f8f; }
          50%      { text-shadow: 0 0 10px rgba(236,72,153,0.9), 0 0 4px rgba(255,255,255,0.7); color: #ec4899; }
        }
        @keyframes sparklePulse {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0 rgba(255,255,255,0)); }
          50%      { filter: brightness(1.4) drop-shadow(0 0 6px rgba(255,255,255,0.9)); }
        }
        @keyframes bigGlow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(236,72,153,0.3)); }
          50%      { filter: drop-shadow(0 0 16px rgba(236,72,153,0.85)) drop-shadow(0 0 5px rgba(255,255,255,0.6)); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.5; transform: scale(0.85); }
          50%      { opacity: 1; transform: scale(1.15); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── 운세 바로결제 모달 (통합) ── */}
      {(() => {
        const MCFG: Record<string, { emoji: string; title: string; desc: string; price: string; features?: string[]; catKey?: string; catKeys?: string[]; priceNum?: number; preselect?: string }> = {
          wealth:        { emoji: "💰", title: "재물운",              desc: "나의 돈 흐름 · 재물이 들어오는 시기",     price: "₩990",    catKey: "💰 재물운", priceNum: 990 },
          love:          { emoji: "💕", title: "연애운",              desc: "사랑과 인연 · 연애 타이밍과 궁합",       price: "₩990",    catKey: "💕 연애운", priceNum: 990 },
          yearly:        { emoji: "🎍", title: "기본 분석",             desc: "재물운 + 연애운 심층 분석",               price: "₩9,900",  features: ["💰 재물운", "💕 연애운", "📄 심층 상세 분석"], preselect: "basic", priceNum: 9900 },
          health:        { emoji: "🍀", title: "프리미엄",            desc: "올해 운세부터 건강운까지 5개 분야",     price: "₩24,900", features: ["📅 올해 운세", "💰 재물운", "💕 연애운", "🍀 건강운", "🗓 월별 운세", "📄 심층 상세 분석"], preselect: "premium", priceNum: 24900 },
          compatibility: { emoji: "💑", title: "VIP 커플팩",          desc: "본인 분석(8개) + 상대방 정보 입력 + 궁합분석 포함", price: "₩29,900", features: ["✍️ 이름분석", "📅 올해 운세", "💰 재물운", "💕 연애운", "🍀 건강운", "🗓 월별 운세", "💑 궁합 분석", "✨ 전체 사주분석"], preselect: "vip", priceNum: 29900 },
          naming:        { emoji: "🌟", title: "5개 운세 묶음",       desc: "원하는 운세 골라 담기 · 개당 ₩990",     price: "₩990/개",  features: ["💰 재물운", "💕 연애운", "💪 건강운", "🎯 성공운", "✨ 총운"] },
          full:          { emoji: "🎯", title: "베이직",               desc: "올해 운세 + 재물운 + 연애운 + 월별 운세", price: "₩19,900", features: ["📅 올해 운세", "💰 재물운", "💕 연애운", "🗓 월별 운세", "📄 심층 상세 분석"], preselect: "standard", priceNum: 19900 },
        };
        // 추가 상품 모달 처리
        if (showModal && EXTRA_MCFG[showModal]) {
          const ec = EXTRA_MCFG[showModal];
          return (
            <div onClick={() => setShowModal(null)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div onClick={e => e.stopPropagation()} style={{ background: "#16103a", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "16px 16px 0 0", padding: "20px 20px 32px", width: "100%", maxWidth: 420 }}>
                <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 18px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 34 }}>{ec.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#ddd6fe", fontSize: 16, fontWeight: 900 }}>{ec.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>{ec.desc}</div>
                  </div>
                  <div style={{ color: "#ef4444", fontSize: 16, fontWeight: 900, border: "2px solid #ef4444", borderRadius: 8, padding: "3px 10px" }}>{ec.price}</div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                  {ec.features.map((f, i) => <div key={i} style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, lineHeight: 1.9 }}>✓ {f}</div>)}
                </div>
                {(showModal === "reunion" || showModal === "pet_compat") && (
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ color: "#ddd6fe", fontSize: 12, fontWeight: 800, margin: "0 0 8px" }}>
                      {showModal === "reunion" ? "💔 상대방 이름을 입력해주세요" : "🐾 반려동물 이름을 입력해주세요"}
                    </p>
                    <input
                      type="text"
                      value={extraOtherInput}
                      onChange={e => setExtraOtherInput(e.target.value)}
                      placeholder={showModal === "reunion" ? "예: 홍길동" : "예: 멍멍이, 냥냥이"}
                      style={{ width: "100%", padding: "12px 14px", fontSize: 14, fontWeight: 700, border: "1.5px solid rgba(167,139,250,0.5)", borderRadius: 10, outline: "none", background: "rgba(255,255,255,0.08)", color: "white", boxSizing: "border-box" }}
                    />
                  </div>
                )}
                <button onClick={() => {
                  if ((showModal === "reunion" || showModal === "pet_compat") && !extraOtherInput.trim()) return;
                  if (showModal === "reunion" || showModal === "pet_compat") {
                    sessionStorage.setItem("specialOtherName", extraOtherInput.trim());
                  }
                  setExtraOtherInput("");
                  setShowModal(null);
                  router.push(`/payment-complete?special=${showModal}&paid=${ec.priceNum}`);
                }} style={{ width: "100%", padding: "14px 0", background: (showModal === "reunion" || showModal === "pet_compat") && !extraOtherInput.trim() ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: (showModal === "reunion" || showModal === "pet_compat") && !extraOtherInput.trim() ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.4)", marginBottom: 10 }}>
                  결제하기
                </button>
                <button onClick={() => setShowModal(null)} style={{ width: "100%", padding: "10px 0", background: "transparent", color: "rgba(255,255,255,0.3)", border: "none", fontSize: 13, cursor: "pointer" }}>닫기</button>
              </div>
            </div>
          );
        }

        const cfg = showModal ? MCFG[showModal] : null;
        if (!cfg) return null;
        return (
          <div onClick={() => setShowModal(null)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#16103a", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "16px 16px 0 0", padding: "20px 20px 32px", width: "100%", maxWidth: 420 }}>
              <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 18px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: cfg.features ? 12 : 18 }}>
                <span style={{ fontSize: 34 }}>{cfg.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#ddd6fe", fontSize: 16, fontWeight: 900 }}>{cfg.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>{cfg.desc}</div>
                </div>
                <div style={{ color: "#ef4444", fontSize: 16, fontWeight: 900, border: "2px solid #ef4444", borderRadius: 8, padding: "3px 10px" }}>{showModal === "naming" ? (modalSelectedCats.length > 0 ? `₩${(modalSelectedCats.length * 990).toLocaleString()}` : "₩990/개") : isPartner && cfg.catKey ? (brand?.customPriceBasic || "₩9,900") : cfg.price}</div>
              </div>
              {cfg.features && (
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                  {cfg.features.map((f, i) => (
                    showModal === "naming" ? (
                      <div key={i} onClick={() => setModalSelectedCats(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])} style={{ display: "flex", alignItems: "center", gap: 10, color: modalSelectedCats.includes(f) ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, lineHeight: 2.2, cursor: "pointer" }}>
                        <span style={{ width: 20, height: 20, border: `2px solid ${modalSelectedCats.includes(f) ? "#a78bfa" : "rgba(255,255,255,0.25)"}`, borderRadius: 5, display: "inline-flex", alignItems: "center", justifyContent: "center", background: modalSelectedCats.includes(f) ? "#7c3aed" : "transparent", flexShrink: 0, fontSize: 12 }}>{modalSelectedCats.includes(f) ? "✓" : ""}</span>
                        {f}
                      </div>
                    ) : (
                      <div key={i} style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, lineHeight: 1.9 }}>✓ {f}</div>
                    )
                  ))}
                </div>
              )}
              <button
                onClick={() => {
                  setShowModal(null);
                  const defaultPrices: Record<string, number> = { basic: 9900, standard: 19900, premium: 24900, vip: 29900 };
                  const resolvedPrice = (() => {
                    if (!isPartner || !cfg.preselect) return cfg.priceNum ?? 990;
                    const customMap: Record<string, string | undefined> = { basic: brand?.customPriceBasic, standard: brand?.customPriceStandard, premium: brand?.customPricePremium, vip: brand?.customPriceVip };
                    const raw = customMap[cfg.preselect];
                    return parseInt((raw || "").replace(/[^0-9]/g, "")) || defaultPrices[cfg.preselect] || (cfg.priceNum ?? 990);
                  })();
                  if (showModal === "naming") {
                    if (modalSelectedCats.length === 0) return;
                    sessionStorage.setItem("v2_paid_cats", JSON.stringify(modalSelectedCats));
                    const namingLabel = modalSelectedCats.length === 1 ? modalSelectedCats[0].split(" ").slice(1).join(" ") : `${modalSelectedCats.length}개 운세 묶음`;
                    router.push(`/payment-complete?package=${encodeURIComponent(namingLabel)}&pages=${modalSelectedCats.length * 30}&paid=${modalSelectedCats.length * 990}`);
                  } else if (cfg.catKeys) {
                    sessionStorage.setItem("v2_paid_cats", JSON.stringify(cfg.catKeys));
                    router.push(`/payment-complete?package=${encodeURIComponent(cfg.title)}&pages=${cfg.catKeys.length * 30}&paid=${resolvedPrice}`);
                  } else if (cfg.catKey) {
                    sessionStorage.setItem("v2_paid_cats", JSON.stringify([cfg.catKey]));
                    router.push(`/payment-complete?package=${encodeURIComponent(cfg.title)}&pages=30&paid=${resolvedPrice}`);
                  } else if (cfg.priceNum) {
                    sessionStorage.setItem("selectedPackage", cfg.preselect ?? "basic");
                    router.push(`/payment-complete?package=${encodeURIComponent(cfg.title)}&pages=${(cfg.features?.length ?? 3) * 30}&paid=${resolvedPrice}`);
                  }
                }}
                style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 14px rgba(124,58,237,0.4)", marginBottom: 10 }}>
                결제하기
              </button>
              <button onClick={() => setShowModal(null)} style={{ width: "100%", padding: "10px 0", background: "transparent", color: "rgba(255,255,255,0.3)", border: "none", fontSize: 13, cursor: "pointer" }}>
                닫기
              </button>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
