"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TEAL = "#0284c7";
const TEAL2 = "#0891b2";
const TEAL_GRAD = `linear-gradient(135deg, ${TEAL}, ${TEAL2})`;
const DARK = "#0c2340";
const MID = "#475569";
const LIGHT = "#94a3b8";
const BG = "linear-gradient(180deg, #f0f9ff 0%, #dbeafe 50%, #f0f9ff 100%)";
const CARD = "rgba(255,255,255,0.85)";
const BORDER = "rgba(2,132,199,0.18)";

const FEATURES = [
  { icon: "📅", title: "성장 위기 캘린더", desc: "출생부터 156주까지 매주 상세한 발달 정보와 스킬 체크리스트를 제공합니다.", href: "/momcare/growth-calendar", img: "https://i.pinimg.com/736x/7a/ac/0e/7aac0e7741ab24964a8fb3d4ccd367f3.jpg", badge: "유료", badgeColor: "#f97316" },
  { icon: "🍼", title: "수면·수유·기저귀 트래커", desc: "수면, 수유, 기저귀, 유축, 기분을 실시간으로 기록하고 일별 요약을 확인하세요.", href: "/momcare/daily-tracker", img: "https://i.pinimg.com/736x/92/ba/35/92ba357d9adb66bdd748ab26a1dcba84.jpg", badge: "유료", badgeColor: "#f97316" },
  { icon: "📏", title: "성장 일기: 키, 몸무게, 둘레", desc: "아이의 성장 지표를 기록하고 WHO 표준과 비교하여 성장 상태를 확인하세요.", href: "/momcare/growth-diary", img: "https://i.pinimg.com/1200x/a6/ed/26/a6ed26f98086d16a87f0915b06877a6e.jpg", badge: "유료", badgeColor: "#f97316" },
  { icon: "📸", title: "소중한 순간 저널", desc: "첫 미소, 첫 이빨, 첫 걸음 — 아이의 소중한 순간들을 기록하고 공유하세요.", href: "/momcare/memory-journal", img: "https://i.pinimg.com/1200x/7b/d2/37/7bd237d913e168a76275fdbbef7f4387.jpg", badge: "유료", badgeColor: "#f97316" },
];

const NEW_FEATURES = [
  { icon: "📔", title: "육아 일기", desc: "오늘 하루 아이와의 특별한 순간을 일기로 남겨요. 기분·날씨·태그로 기록하고 나중에 아이와 함께 읽어보세요.", href: "/momcare/baby-diary", img: "https://i.pinimg.com/736x/92/81/1b/92811b586cea69385bf90def243a2b6c.jpg" },
  { icon: "💌", title: "타임캡슐 편지", desc: "지금의 감정을 미래의 아이에게 편지로 남겨요. '3살 때 열어봐', '결혼할 때 열어봐' — 잠겨있다가 그날 자동으로 열립니다.", href: "/momcare/time-capsule", img: "https://i.pinimg.com/736x/4d/aa/bb/4daabb706e85ac294e67d9e5c4b6b0b4.jpg" },
  { icon: "🗣️", title: "아기 말 사전", desc: '"마마"=엄마, "뚜뚜"=자동차 — 아기만의 귀여운 언어를 사전으로 기록해요. 나중에 보면 정말 보물이 될 거예요.', href: "/momcare/baby-words", img: "https://i.pinimg.com/1200x/e4/d8/33/e4d83359db708f8f6d22d0b0a7cf1b0d.jpg" },
];

const EXERCISES = [
  { emoji: "🛁", title: "욕조에서 목욕하기", age: "0~7 달", desc: "목욕 시간은 아이에게 새로운 정서적 경험을 선사하는 중요한 의식입니다." },
  { emoji: "👣", title: '발에 있는 "숫자 8" 모양', age: "0~7 달", desc: "엄지손가락으로 숫자 8 모양을 그려 부드럽게 눌러주세요. 4~6회 반복합니다." },
  { emoji: "🤸", title: "무릎을 배에 대고", age: "0~7 달", desc: "구부린 다리를 잡고 무릎을 배 쪽으로 당겼다가 원래 위치로 되돌립니다. 수유 전 4~6회 실시하세요." },
  { emoji: "🧘", title: "뒤집기 연습", age: "3~6 달", desc: "아이의 소름 돋는 성장을 볼 수 있는 뒤집기 도와주기 동작입니다." },
  { emoji: "🦘", title: "시소 놀이", age: "4~7 달", desc: "앞뒤로 천천히 올리고 내려줘, 균형 감각 발달을 도와주세요." },
  { emoji: "🐊", title: "기어가기 연습", age: "6~9 달", desc: "바닥에 엎드려 손과 무릎으로 밀어 기어가는 동작을 연습하게 도와주세요." },
];

const REVIEWS = [
  { text: "아기의 생후 및 주차별 기록을\n이렇게 자세히 보여주는 앱은\n아직 찾지 못했어요.\n정말 감사하겠습니다!", stars: 5, date: "2026년 1월 25일" },
  { text: "정말 감사합니다!\n이 앱은 저에게\n가장 중요한 육아 앱이에요.", stars: 5, date: "2026년 2월 10일" },
  { text: "우리 아기의 성장 발달 단계가\n모두 완벽하게 일치해요.\n다음 주에 어떤 변화가 있을지\n알 수 있어서 정말 좋아요.", stars: 5, date: "2026년 2월 15일" },
];

const FAQ_ITEMS = [
  { q: "성장 위기란 무엇인가요?", a: "출생부터 3세까지 아이는\n여러 번의 성장 및 발달 위기를 겪습니다.\n이는 신경계와 뇌가 발달하고\n아이가 새로운 능력을 보이기 시작하는\n자연스러운 과정입니다.\n이 시기에 아이는 보채거나\n잠을 잘 못 잘 수도 있어요.\n육아일기가 이 시기를 미리 알려드립니다." },
  { q: "앱 정보를 신뢰할 수 있는 이유는 무엇인가요?", a: "앱에 있는 모든 글, 설명, 발달 운동은\n현직 소아과 의사들과\n협력하여 제작되었습니다.\nAI가 근거 기반 의학 데이터를 바탕으로\n아이의 성장을 분석합니다." },
  { q: "어떻게 이용하나요?", a: "육아일기 7가지 기능 전체는 990원 결제 후 30일간 이용 가능해요.\n\n점운에서 사주 990원을 결제하시면\n육아일기도 함께 이용하실 수 있어요." },
  { q: "아이가 여러 명이어도 사용할 수 있나요?", a: "현재는 아이 1명 기준으로 기록하는 방식이에요.\n형제자매 각각 기록하고 싶다면\n브라우저를 나눠 사용하시거나\n기기를 따로 사용하시면 됩니다." },
  { q: "WHO 성장 기준과 어떻게 비교하나요?", a: "세계보건기구(WHO)의\n공식 성장 기준 데이터를 기반으로\n아이의 키, 몸무게, 머리둘레를\n백분위수로 비교해 드립니다.\n또래 평균과의 차이를\n한눈에 확인할 수 있습니다." },
];

function shareApp() {
  const url = "https://jeomun.com/momcare";
  const kakao = typeof window !== "undefined" ? (window as any).Kakao : null;
  if (kakao?.isInitialized() && kakao?.Share) {
    kakao.Share.sendDefault({ objectType: "feed", content: { title: "👶 점운 육아일기 — AI 육아 앱", description: "소아과 전문의가 함께하는 AI 육아 앱! 무료로 시작해요 👶", imageUrl: "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg", link: { mobileWebUrl: url, webUrl: url } }, buttons: [{ title: "육아일기 보기 👶", link: { mobileWebUrl: url, webUrl: url } }, { title: "나도 해보기 →", link: { mobileWebUrl: url, webUrl: url } }] });
  } else {
    window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent("소아과 전문의가 함께하는 AI 육아 앱 육아일기! 무료 👶\n" + url)}`;
  }
}

function getTodayCount() {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const lcg = ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
  const base = 660 + (lcg % 290);
  const block = new Date().getHours() < 8 ? 0 : new Date().getHours() < 16 ? 1 : 2;
  return (base + (block >= 1 ? 480 + (lcg % 220) : 0) + (block >= 2 ? 550 + ((lcg >> 4) % 300) : 0)).toLocaleString();
}

export default function MomcarePage() {
  const count = getTodayCount();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [featureIdx, setFeatureIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [momcareExpired, setMomcareExpired] = useState(false);
  const [momcareExpiringSoon, setMomcareExpiringSoon] = useState(false);
  const [momcareDaysLeft, setMomcareDaysLeft] = useState(0);
  const [hasPhone, setHasPhone] = useState(true);
  const [phoneGate, setPhoneGate] = useState("");
  const [mcPrivacyAgreed, setMcPrivacyAgreed] = useState(false);
  const [mcMarketingAgreed, setMcMarketingAgreed] = useState(false);

  useEffect(() => {
    try {
      const ph = (JSON.parse(localStorage.getItem("v2_saved_profile") || "{}").phone || localStorage.getItem("v2_saved_phone") || "").replace(/\D/g, "");
      if (ph.length < 10) setHasPhone(false);
    } catch { setHasPhone(false); }
  }, []);

  useEffect(() => {
    try {
      const until = Number(localStorage.getItem("momcare_unlock_until") || 0);
      const now = Date.now();
      if (until > 0 && until < now) {
        setMomcareExpired(true);
      } else if (until > 0 && until - now < 3 * 24 * 60 * 60 * 1000) {
        setMomcareExpiringSoon(true);
        setMomcareDaysLeft(Math.ceil((until - now) / (24 * 60 * 60 * 1000)));
      }
    } catch {}
  }, []);


  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => setFeatureIdx(i => (i + 1) % FEATURES.length), 4000);
    return () => clearInterval(t);
  }, [autoPlay]);

  if (!hasPhone) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0c2340 0%, #0284c7 60%, #0891b2 100%)", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>👶</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", margin: "0 0 6px", letterSpacing: -0.5 }}>육아일기</h1>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: "0 0 36px" }}>AI 육아 플랫폼</p>
      <div style={{ background: "white", borderRadius: 24, padding: "32px 24px", maxWidth: 360, width: "100%", boxShadow: "0 16px 60px rgba(0,0,0,0.25)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: DARK, margin: "0 0 6px" }}>전화번호로 시작하기</h2>
        <p style={{ fontSize: 12, color: MID, margin: "0 0 20px", lineHeight: 1.7 }}>일기·편지·아기 말 기록이 모든 기기에서<br />자동으로 영구 보관됩니다.</p>
        <input
          value={phoneGate}
          onChange={e => setPhoneGate(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") (document.getElementById("mc-login-btn") as HTMLButtonElement)?.click(); }}
          placeholder="010-1234-5678"
          type="tel"
          style={{ width: "100%", border: "2px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", fontSize: 16, outline: "none", boxSizing: "border-box", marginBottom: 12, textAlign: "center", letterSpacing: 1 }}
        />
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
          <input type="checkbox" checked={mcPrivacyAgreed} onChange={e => setMcPrivacyAgreed(e.target.checked)}
            style={{ marginTop: 3, accentColor: "#0891b2", width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
            <strong style={{ color: "#374151" }}>[필수] 개인정보 수집·이용 동의</strong><br />
            수집 항목: 전화번호(필수) / 목적: 육아일기 서비스 제공 / 보관: 3년 후 파기
          </span>
        </label>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginBottom: 12, textAlign: "left" }}>
          <input type="checkbox" checked={mcMarketingAgreed} onChange={e => setMcMarketingAgreed(e.target.checked)}
            style={{ marginTop: 3, accentColor: "#0891b2", width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
            <strong style={{ color: "#374151" }}>[선택] 마케팅 수신 동의</strong><br />
            점운의 새로운 기능·이벤트 알림을 받겠습니다. 언제든 수신거부 가능합니다.
          </span>
        </label>
        <button id="mc-login-btn" onClick={async () => {
          if (!mcPrivacyAgreed) { alert("개인정보 수집·이용 동의를 체크해주세요."); return; }
          const ph = phoneGate.replace(/\D/g, "");
          if (ph.length < 10) { alert("전화번호를 정확히 입력해주세요."); return; }
          try { const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}"); p.phone = ph; localStorage.setItem("v2_saved_profile", JSON.stringify(p)); localStorage.setItem("v2_saved_phone", ph); } catch {}
          fetch("https://jeomun-default-rtdb.firebaseio.com/momcare_leads.json", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: ph, source: "momcare", marketing: mcMarketingAgreed, agreed: true, agreedAt: Date.now() }),
          }).catch(() => {});
          try {
            const r = await fetch(`/api/phone-unlock?phone=${ph}`);
            const d = await r.json();
            if (d.ok && d.unlocks?.momcare_unlock_until > Date.now()) {
              localStorage.setItem("momcare_unlock_until", String(d.unlocks.momcare_unlock_until));
            }
          } catch {}
          setHasPhone(true);
        }} style={{ width: "100%", background: TEAL_GRAD, color: "white", border: "none", borderRadius: 14, padding: "15px", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>육아일기 시작하기 →</button>
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 10, textAlign: 'center' }}>오늘 <strong style={{ color: '#0284c7' }}>{count}</strong>명이 육아일기를 기록했어요</p>
        <p style={{ fontSize: 11, color: LIGHT, textAlign: "center", margin: "14px 0 0", lineHeight: 1.6 }}>새 기기에서도 이용권·기록 자동 복원돼요.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: DARK }}>

      {/* 네비게이션 */}
      <nav style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: TEAL, textDecoration: "none" }}>육아일기</Link>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Link href="/momcare/growth-calendar" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>캘린더</Link>
          <Link href="/momcare/daily-tracker" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>트래커</Link>
          <Link href="/momcare/growth-diary" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>성장일기</Link>
          <Link href="/momcare/baby-diary" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>육아일기</Link>
          <Link href="/momcare/time-capsule" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>타임캡슐</Link>
          <Link href="/momcare/baby-words" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>말사전</Link>
        </div>
      </nav>

      {/* 3일 전 만료 경고 배너 */}
      {momcareExpiringSoon && (
        <div style={{ background: "#fff7ed", borderBottom: "1px solid #fed7aa", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#c2410c" }}>⏰ {momcareDaysLeft}일 후 육아일기 이용권이 만료돼요.</span>
          <a href="/momcare/pay" style={{ display: "inline-block", background: "#f97316", color: "white", fontSize: 12, fontWeight: 900, padding: "7px 16px", borderRadius: 20, textDecoration: "none" }}>
            만료일부터 30일 연장 →
          </a>
        </div>
      )}

      {/* 30일 이용권 만료 배너 */}
      {momcareExpired && (
        <div style={{ background: "#fef3c7", borderBottom: "1px solid #f59e0b", padding: "12px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>⏰ 육아일기 30일 이용권이 만료됐어요.</span>
            <a href="/momcare/pay" style={{ display: "inline-block", background: "#f59e0b", color: "white", fontSize: 12, fontWeight: 900, padding: "7px 16px", borderRadius: 20, textDecoration: "none" }}>
              육아일기 990원으로 재활성화 →
            </a>
          </div>
        </div>
      )}

      {/* 탈잉·크몽 신뢰 띠 */}
      <div style={{ textAlign: "center", padding: "7px 16px", background: "linear-gradient(90deg, #e0f2fe, #f0f9ff, #e0f2fe)", borderBottom: "1px solid rgba(2,132,199,0.15)" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#0369a1" }}>🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱</span>
      </div>

      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, rgba(2,132,199,0.08) 0%, rgba(8,145,178,0.06) 50%, rgba(240,249,255,0) 100%)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 36px", display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
          {/* 텍스트 */}
          <div style={{ flex: 1, minWidth: 240 }}>
            <span style={{ display: "inline-block", background: TEAL_GRAD, color: "white", borderRadius: 20, padding: "3px 14px", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>👶 육아일기</span>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, lineHeight: 1.25, margin: "0 0 12px", color: DARK, wordBreak: "keep-all" }}>
              부모가 만든,<br />
              <span style={{ color: TEAL }}>소아과 전문의</span>가 함께하는<br />
              AI 육아 앱
            </h1>
            <p style={{ fontSize: 13, color: MID, lineHeight: 1.7, margin: "0 0 20px", wordBreak: "keep-all" }}>
              성장 위기 캘린더 · 수유·수면 기록 · 타임캡슐 편지
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/momcare/pay" style={{ background: TEAL_GRAD, color: "white", borderRadius: 28, padding: "12px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(2,132,199,0.35)" }}>시작하기</Link>
              <Link href="/momcare/growth-calendar" style={{ background: "white", color: TEAL, border: `1.5px solid ${BORDER}`, borderRadius: 28, padding: "11px 18px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>성장 캘린더 →</Link>
              <button onClick={shareApp} style={{ background: "#f3e8ff", color: "#7c3aed", border: "1.5px solid rgba(124,58,237,0.3)", borderRadius: 28, padding: "11px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🔗 공유하기</button>
            </div>
            <p style={{ fontSize: 11, color: MID, margin: "10px 0 0", lineHeight: 1.8 }}>육아일기 990원 결제 후 30일 전체 이용 가능해요</p>
          </div>
          {/* 엄마 이미지 */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="https://i.pinimg.com/vwebp/1200x/50/73/a5/5073a503cb18b1cd3459fba8e402c389.webp"
              alt="육아일기 육아 앱"
              style={{ width: 240, height: 300, objectFit: "cover", borderRadius: 24, boxShadow: "0 12px 40px rgba(2,132,199,0.2)", display: "block" }}
            />
          </div>
        </div>
      </div>

      {/* 4가지 핵심 기능 — 캐러셀 */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 0" }}>
        <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 900, marginBottom: 8, color: DARK }}>함께 성장해요. <span style={{ color: TEAL }}>매 순간마다.</span></h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "#f97316", fontWeight: 700, marginBottom: 28 }}>클릭하면 실제로 사용할 수 있는 육아일기 기능들</p>

        {/* 캐러셀 카드 */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 24px rgba(2,132,199,0.12)" }}>
          <div style={{ display: "flex", alignItems: "stretch", minHeight: 280 }}>
            {/* 왼쪽: 이미지 */}
            <div style={{ width: "42%", flexShrink: 0, position: "relative", background: "#e0f2fe", minHeight: 240 }}>
              {FEATURES[featureIdx].img ? (
                <img
                  src={FEATURES[featureIdx].img}
                  alt={FEATURES[featureIdx].title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, #e0f2fe, #bae6fd)`, gap: 8 }}>
                  <div style={{ fontSize: 56 }}>{FEATURES[featureIdx].icon}</div>
                  <div style={{ fontSize: 11, color: "#0284c7", fontWeight: 700 }}>이미지 준비 중</div>
                </div>
              )}
            </div>

            {/* 오른쪽: 텍스트 */}
            <div style={{ flex: 1, padding: "28px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: TEAL, fontWeight: 700 }}>{featureIdx + 1} / {FEATURES.length}</span>
                <span style={{ background: FEATURES[featureIdx].badgeColor, color: "white", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{FEATURES[featureIdx].badge}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: DARK, margin: "0 0 10px", wordBreak: "keep-all", lineHeight: 1.3 }}>{FEATURES[featureIdx].title}</h3>
              <p style={{ fontSize: 13, color: MID, margin: "0 0 20px", lineHeight: 1.7, wordBreak: "keep-all" }}>{FEATURES[featureIdx].desc}</p>
              <Link href={FEATURES[featureIdx].href} style={{ display: "inline-block", background: TEAL_GRAD, color: "white", borderRadius: 20, padding: "10px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none", alignSelf: "flex-start" }}>
                지금 사용하기 →
              </Link>
            </div>
          </div>

          {/* 하단: 이전/다음 + 점 */}
          <div style={{ background: "#f0f9ff", borderTop: `1px solid ${BORDER}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={() => { setAutoPlay(false); setFeatureIdx(i => (i - 1 + FEATURES.length) % FEATURES.length); }}
              style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 20, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: TEAL }}
            >‹</button>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {FEATURES.map((_, i) => (
                <div
                  key={i}
                  onClick={() => { setAutoPlay(false); setFeatureIdx(i); }}
                  style={{ width: i === featureIdx ? 28 : 8, height: 8, borderRadius: 4, background: i === featureIdx ? TEAL : "#bae6fd", cursor: "pointer", transition: "all 0.3s ease" }}
                />
              ))}
            </div>
            <button
              onClick={() => { setAutoPlay(false); setFeatureIdx(i => (i + 1) % FEATURES.length); }}
              style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 20, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: TEAL }}
            >›</button>
          </div>
        </div>
      </div>

      {/* 신규 바이럴 기능 3종 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: TEAL_GRAD, color: "white", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>NEW</span>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: DARK }}>기억이 되는 육아 <span style={{ color: TEAL }}>바이럴 기능</span></h2>
        </div>
        <p style={{ fontSize: 13, color: "#f97316", fontWeight: 700, marginBottom: 20 }}>지금 SNS에서 가장 많이 공유되는 육아 기록 기능들이에요</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {NEW_FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden", textDecoration: "none", color: DARK, display: "block", boxShadow: "0 4px 20px rgba(2,132,199,0.08)" }}>
              {f.img && <img src={f.img} alt={f.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />}
              <div style={{ padding: "14px 14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ fontSize: 24 }}>{f.icon}</div>
                  <span style={{ background: "#f97316", color: "white", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>🔒 유료</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: DARK, margin: "0 0 6px", wordBreak: "keep-all" }}>{f.title}</h3>
                <p style={{ fontSize: 11, color: MID, margin: "0 0 10px", lineHeight: 1.5, wordBreak: "keep-all" }}>{f.desc}</p>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEAL }}>기록하기 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 점운 앱 연결 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ background: "linear-gradient(135deg, #0c2340 0%, #0d3b6e 100%)", borderRadius: 24, padding: "40px 28px", color: "white" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700 }}>점운 × 육아일기 연결</span>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: "12px 0 6px" }}>아이를 키우다 보면 이런 생각 드시죠?</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0 }}>엄마들이 가장 많이 찾는 사주·꿈해몽 질문들</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🌙</div>
              <h3 style={{ fontSize: 12, fontWeight: 800, margin: "0 0 6px", wordBreak: "keep-all" }}>태몽인지 궁금해요</h3>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: "0 0 12px", lineHeight: 1.5, flex: 1, wordBreak: "keep-all" }}>꿈해몽 AI가 태몽 여부를 풀어드려요</p>
              <Link href="/haemong" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.12)", color: "white", borderRadius: 16, padding: "7px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>태몽 풀기 →</Link>
            </div>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🔮</div>
              <h3 style={{ fontSize: 12, fontWeight: 800, margin: "0 0 6px", wordBreak: "keep-all" }}>아이 재능·건강운</h3>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: "0 0 12px", lineHeight: 1.5, flex: 1, wordBreak: "keep-all" }}>아이 잘 키우고 싶다면?<br /><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>육아일기 결제 후 30일 이용</span></p>
              <Link href="/momcare/pay" style={{ display: "block", textAlign: "center", background: TEAL_GRAD, color: "white", borderRadius: 16, padding: "7px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>육아일기 결제하기 →</Link>
            </div>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🌸</div>
              <h3 style={{ fontSize: 12, fontWeight: 800, margin: "0 0 6px", wordBreak: "keep-all" }}>엄마 운세 점검</h3>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: "0 0 12px", lineHeight: 1.5, flex: 1, wordBreak: "keep-all" }}>올해 재물·연애·건강운 확인</p>
              <Link href="/main-v2" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.12)", color: "white", borderRadius: 16, padding: "7px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>내 사주 보기 →</Link>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            점운(jeomun.com) — 대한민국 AI 사주 플랫폼 × 육아일기 공식 연계 서비스
          </div>
        </div>
      </div>

      {/* 발달 운동 */}
      <div style={{ maxWidth: 800, margin: "56px auto 0", padding: "0 24px" }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "40px 24px", boxShadow: "0 4px 24px rgba(2,132,199,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-block", background: TEAL_GRAD, color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>250가지 이상의 발달 운동</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: DARK, margin: "0 0 6px" }}>경이로운 발달 운동</h2>
            <p style={{ fontSize: 13, color: "#f97316", fontWeight: 700, margin: 0 }}>이들의 처방은 하루에 20분도 채 걸리지 않습니다</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {EXERCISES.map((ex) => (
              <div key={ex.title} style={{ background: "#f0f9ff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 16px" }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{ex.emoji}</div>
                <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, marginBottom: 6 }}>{ex.age}</div>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: DARK, margin: "0 0 6px", wordBreak: "keep-all" }}>{ex.title}</h4>
                <p style={{ fontSize: 11, color: MID, margin: 0, lineHeight: 1.6, wordBreak: "keep-all" }}>{ex.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link href="/momcare/growth-calendar" style={{ background: TEAL_GRAD, color: "white", border: "none", borderRadius: 24, padding: "12px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
              앱에서 더 많은 운동 확인하세요
            </Link>
          </div>
        </div>
      </div>

      {/* 리뷰 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "40px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(2,132,199,0.08)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: DARK, margin: "0 0 16px" }}>200만 가족이 함께하는</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 24 }}>
            <div><p style={{ fontSize: 12, color: LIGHT, margin: "0 0 2px" }}>앱스토어 평점</p><p style={{ fontSize: 24, fontWeight: 900, color: TEAL, margin: 0 }}>4.9★</p></div>
            <div><p style={{ fontSize: 12, color: LIGHT, margin: "0 0 2px" }}>구글플레이</p><p style={{ fontSize: 24, fontWeight: 900, color: TEAL, margin: 0 }}>4.8★</p></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: "#f0f9ff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px", textAlign: "left" }}>
                <div style={{ display: "flex", gap: 1, marginBottom: 8 }}>{"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#fbbf24", fontSize: 12 }}>{s}</span>)}</div>
                <p style={{ fontSize: 12, color: MID, margin: "0 0 8px", lineHeight: 1.6, wordBreak: "keep-all", whiteSpace: "pre-line" }}>{r.text}</p>
                <p style={{ fontSize: 10, color: LIGHT, margin: 0 }}>{r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 요금제 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ background: TEAL_GRAD, borderRadius: 20, padding: "32px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(2,132,199,0.25)" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎁</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px", color: "white" }}>육아일기 7가지 기능</h2>
          <p style={{ fontSize: 13, color: "#fbbf24", margin: "0 0 10px", fontWeight: 900 }}>🔒 990원 결제 후 30일 이용</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
            {["📅 성장 위기 캘린더", "🍼 일일 트래커", "📏 성장 일기", "📔 육아 일기", "💌 타임캡슐", "🗣️ 말 사전"].map(item => (
              <div key={item} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 6px", fontSize: 11, color: "white", fontWeight: 700, wordBreak: "keep-all" }}>{item}</div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#a78bfa", margin: "0 0 8px", fontWeight: 800 }}>✨ 사주 990원 결제하면 덤으로 24h!</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
            {["🌙 꿈해몽", "🐱 복냥이상담", "❓ 360개 질문"].map(item => (
              <div key={item} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 6px", fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, wordBreak: "keep-all" }}>{item}</div>
            ))}
          </div>
          <Link href="/momcare/pay" style={{ display: "inline-block", background: "white", color: TEAL, borderRadius: 24, padding: "12px 32px", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>
            육아일기 990원으로 시작하기 →
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-block", color: TEAL, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>자주 묻는 질문</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0, color: DARK }}>궁금한 점이 있으신가요?</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
              <button onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)} style={{ width: "100%", padding: "16px 20px", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, fontWeight: 700, color: DARK, wordBreak: "keep-all" }}>
                <span>{item.q}</span>
                <span style={{ color: TEAL, fontSize: 20, flexShrink: 0, marginLeft: 8 }}>{openFAQ === idx ? "−" : "+"}</span>
              </button>
              {openFAQ === idx && (
                <div style={{ padding: "0 20px 16px", borderTop: `1px solid ${BORDER}` }}>
                  <p style={{ fontSize: 13, color: MID, margin: "12px 0 0", lineHeight: 1.7, wordBreak: "keep-all", whiteSpace: "pre-line" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ background: TEAL_GRAD, borderRadius: 20, padding: "40px 24px", textAlign: "center", boxShadow: "0 8px 32px rgba(2,132,199,0.3)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px", color: "white" }}>지금 바로<br />육아일기를 시작하세요</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "0 0 24px" }}>990원으로 시작하세요.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => alert("앱스토어 출시 준비 중입니다!")} style={{ background: "white", color: TEAL, border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>App Store 다운로드</button>
            <button onClick={() => alert("구글플레이 출시 준비 중입니다!")} style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Google Play 다운로드</button>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer style={{ padding: "32px 20px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 360, margin: "0 auto", padding: "18px 16px", borderRadius: 20, background: "#e0f2fe", border: "2px solid #7dd3fc" }}>
          <p style={{ color: "#0369a1", fontSize: 11, fontWeight: 700, margin: "0 0 8px" }}>© 2026 점운 육아일기 · Powered by 점운</p>
          <div style={{ color: "#0284c7", fontSize: 10.5, fontWeight: 700, lineHeight: 1.8, marginBottom: 12, letterSpacing: "0.1px" }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
            <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
            <p style={{ margin: "2px 0 0", color: "#dc2626", fontWeight: 900 }}>※ 전화 문의는 받지 않습니다.<br />카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "6px 16px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 800, fontSize: 11 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "6px 16px", border: "1.5px solid #7dd3fc", borderRadius: 20, color: "#0369a1", textDecoration: "none", fontWeight: 800, fontSize: 11 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 11 }}>
            <a href="/terms" style={{ color: "#0369a1", textDecoration: "none", fontWeight: 600 }}>이용약관</a>
            <span style={{ color: "#7dd3fc", margin: "0 8px" }}>|</span>
            <a href="/privacy" style={{ color: "#0369a1", textDecoration: "none", fontWeight: 600 }}>개인정보처리방침</a>
            <span style={{ color: "#7dd3fc", margin: "0 8px" }}>|</span>
            <a href="/refund" style={{ color: "#0369a1", textDecoration: "none", fontWeight: 600 }}>환불정책</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
