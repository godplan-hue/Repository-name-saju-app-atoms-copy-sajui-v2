"use client";

import { useState } from "react";
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
  { icon: "📅", title: "성장 위기 캘린더", desc: "소아과 전문의와 함께 자녀의 생리·운동·언어 발달 과정(생후 156주)을 미리 알려드립니다.", href: "/momcare/growth-calendar", img: "https://i.pinimg.com/1200x/cf/52/39/cf52396e452e1736fefb71afa511701d.jpg" },
  { icon: "🍼", title: "일일 트래커", desc: "수면, 수유, 기저귀, 유축, 기분을 시간순으로 기록하고 생활 패턴을 파악하세요.", href: "/momcare/daily-tracker", img: "" },
  { icon: "📏", title: "성장 일기", desc: "키, 몸무게, 머리둘레를 기록하고 WHO 기준 백분위수로 아이의 성장을 추적하세요.", href: "/momcare/growth-diary", img: "" },
  { icon: "📸", title: "소중한 순간 저널", desc: "첫 미소, 첫 이빨, 첫 걸음마 — 아기의 소중한 첫 순간들을 카테고리별로 기록하세요.", href: "/momcare/memory-journal", img: "" },
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
  { text: "아기의 생후 몇 주차별 기록을 자세히 보여주는 앱을 아직 못 찾았어요. 알려주시면 정말 감사하겠습니다!", stars: 5, date: "2026년 1월 25일" },
  { text: "정말 감사합니다! 이 앱은 저에게 가장 중요한 육아 앱이에요.", stars: 5, date: "2026년 2월 10일" },
  { text: "우리 아기의 성장 발달 단계가 모두 완벽하게 일치해요. 다음 주에 어떤 변화가 있을지 알 수 있어서 정말 좋아요.", stars: 5, date: "2026년 2월 15일" },
];

const FAQ_ITEMS = [
  { q: "성장 위기란 무엇인가요?", a: "출생부터 3세까지 아이는 여러 번의 성장 및 발달 위기를 겪습니다. 이는 신경계와 뇌가 발달하고 아이가 새로운 능력을 보이기 시작하는 자연스러운 과정입니다. 이 시기에 아이는 보채거나 잠을 잘 못 잘 수도 있어요. 맘케어가 이 시기를 미리 알려드립니다." },
  { q: "앱 정보를 신뢰할 수 있는 이유는 무엇인가요?", a: "앱에 있는 모든 글, 설명, 발달 운동은 현직 소아과 의사들과 협력하여 제작되었습니다. AI가 근거 기반 의학 데이터를 바탕으로 아이의 성장을 분석합니다." },
  { q: "무료로 사용할 수 있나요?", a: "네! 기본 기능은 무료로 이용하실 수 있습니다. PRO 플랜으로 업그레이드하시면 고급 분석, 우선 지원 등 모든 기능을 이용하실 수 있습니다." },
  { q: "아이가 여러 명이어도 사용할 수 있나요?", a: "네! 아이를 여러 명 등록하여 각각의 성장 기록을 따로 관리하실 수 있습니다. 형제자매 비교 기능도 제공됩니다." },
  { q: "WHO 성장 기준과 어떻게 비교하나요?", a: "세계보건기구(WHO)의 공식 성장 기준 데이터를 기반으로 아이의 키, 몸무게, 머리둘레를 백분위수로 비교해 드립니다. 또래 평균과의 차이를 한눈에 확인할 수 있습니다." },
];

export default function MomcarePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: DARK }}>

      {/* 네비게이션 */}
      <nav style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: TEAL, textDecoration: "none" }}>맘케어</Link>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Link href="/momcare/growth-calendar" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>캘린더</Link>
          <Link href="/momcare/daily-tracker" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>트래커</Link>
          <Link href="/momcare/growth-diary" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>성장일기</Link>
          <Link href="/momcare/baby-diary" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>육아일기</Link>
          <Link href="/momcare/time-capsule" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>타임캡슐</Link>
          <Link href="/momcare/baby-words" style={{ fontSize: 11, color: MID, textDecoration: "none", padding: "5px 7px" }}>말사전</Link>
        </div>
      </nav>

      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, rgba(2,132,199,0.08) 0%, rgba(8,145,178,0.06) 50%, rgba(240,249,255,0) 100%)", padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          {/* 텍스트 */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: "inline-block", background: TEAL_GRAD, color: "white", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
              출생부터 3세까지 AI 육아 동반자
            </div>
            <p style={{ fontSize: 11, color: LIGHT, marginBottom: 14, letterSpacing: "0.02em" }}>
              탈잉 2년 연속 1위 강사 제작 · 크몽 상위 2% 프라임 전문가 검증
            </p>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 14, color: DARK, wordBreak: "keep-all" }}>
              부모가 만든,<br />
              <span style={{ color: TEAL }}>소아과 전문의</span>가 함께하는<br />
              AI 육아 앱
            </h1>
            <p style={{ fontSize: 14, color: MID, lineHeight: 1.7, marginBottom: 24, wordBreak: "keep-all" }}>
              성장일기, 수유·수면 기록부터 발달 단계까지,<br />우리 아이의 모든 순간을 기록하세요
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <Link href="/momcare/daily-tracker" style={{ background: TEAL_GRAD, color: "white", borderRadius: 28, padding: "13px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(2,132,199,0.35)" }}>
                무료로 시작하기
              </Link>
              <Link href="/momcare/growth-calendar" style={{ background: "white", color: TEAL, border: `1.5px solid ${BORDER}`, borderRadius: 28, padding: "11px 20px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                성장 캘린더 보기
              </Link>
            </div>
            <button
              onClick={() => {
                const url = "https://jeomun.com/momcare";
                if (navigator.share) navigator.share({ title: "👶 점운 맘케어 — AI 육아 앱", text: "아이 성장 기록부터 타임캡슐 편지까지! 육아 앱 써봤는데 진짜 좋아요", url });
                else navigator.clipboard?.writeText(url).then(() => alert("링크가 복사됐어요! 친구 엄마에게 공유해보세요 😊"));
              }}
              style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#1a1a00", border: "none", borderRadius: 28, padding: "12px 28px", fontSize: 13, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(251,191,36,0.45)" }}
            >
              📤 친구에게 공유하기
            </button>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
              {[{ label: "앱스토어", score: "4.9" }, { label: "구글플레이", score: "4.8" }, { label: "가족", score: "200만+" }].map(b => (
                <div key={b.label} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "6px 14px", fontSize: 12 }}>
                  <span style={{ color: LIGHT }}>{b.label} </span>
                  <strong style={{ color: TEAL }}>{b.score}</strong>
                </div>
              ))}
            </div>
          </div>
          {/* 히어로 이미지 */}
          <div style={{ flexShrink: 0 }}>
            <img
              src="https://i.pinimg.com/vwebp/1200x/50/73/a5/5073a503cb18b1cd3459fba8e402c389.webp"
              alt="맘케어 육아 앱"
              style={{ width: 300, height: 360, objectFit: "cover", borderRadius: 24, boxShadow: "0 12px 40px rgba(2,132,199,0.2)", display: "block" }}
            />
          </div>
        </div>
      </div>

      {/* 4가지 핵심 기능 */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 0" }}>
        <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 900, marginBottom: 8, color: DARK }}>함께 성장해요. <span style={{ color: TEAL }}>매 순간마다.</span></h2>
        <p style={{ textAlign: "center", fontSize: 14, color: LIGHT, marginBottom: 28 }}>클릭하면 실제로 사용할 수 있는 4가지 핵심 기능</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, overflow: "hidden", textDecoration: "none", color: DARK, display: "block", boxShadow: "0 4px 20px rgba(2,132,199,0.1)" }}>
              {f.img ? <img src={f.img} alt={f.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} /> : null}
              <div style={{ padding: f.img ? "20px 24px 24px" : "28px 24px" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: DARK, margin: "0 0 8px", wordBreak: "keep-all" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: MID, margin: "0 0 16px", lineHeight: 1.6, wordBreak: "keep-all" }}>{f.desc}</p>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>지금 사용하기 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 신규 바이럴 기능 3종 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: TEAL_GRAD, color: "white", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>NEW</span>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: DARK }}>기억이 되는 육아 <span style={{ color: TEAL }}>바이럴 기능</span></h2>
        </div>
        <p style={{ fontSize: 13, color: LIGHT, marginBottom: 20 }}>지금 SNS에서 가장 많이 공유되는 육아 기록 기능들이에요</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {NEW_FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, overflow: "hidden", textDecoration: "none", color: DARK, display: "block", boxShadow: "0 4px 20px rgba(2,132,199,0.08)" }}>
              <img src={f.img} alt={f.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "18px 20px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: DARK, margin: "0 0 6px", wordBreak: "keep-all" }}>{f.title}</h3>
                <p style={{ fontSize: 12, color: MID, margin: "0 0 12px", lineHeight: 1.6, wordBreak: "keep-all" }}>{f.desc}</p>
                <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>지금 기록하기 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 점운 앱 연결 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ background: "linear-gradient(135deg, #0c2340 0%, #0d3b6e 100%)", borderRadius: 24, padding: "40px 28px", color: "white" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700 }}>점운 × 맘케어 연결</span>
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
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: "0 0 12px", lineHeight: 1.5, flex: 1, wordBreak: "keep-all" }}>생년월일로 재능·건강운 무료 분석</p>
              <Link href="/main-v2" style={{ display: "block", textAlign: "center", background: TEAL_GRAD, color: "white", borderRadius: 16, padding: "7px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>무료로 보기 →</Link>
            </div>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.12)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🌸</div>
              <h3 style={{ fontSize: 12, fontWeight: 800, margin: "0 0 6px", wordBreak: "keep-all" }}>엄마 운세 점검</h3>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: "0 0 12px", lineHeight: 1.5, flex: 1, wordBreak: "keep-all" }}>올해 재물·연애·건강운 확인</p>
              <Link href="/main-v2" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.12)", color: "white", borderRadius: 16, padding: "7px 8px", fontSize: 11, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>내 사주 보기 →</Link>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
            점운(jeomun.com) — 대한민국 AI 사주 플랫폼 × 맘케어 공식 연계 서비스
          </div>
        </div>
      </div>

      {/* 발달 운동 */}
      <div style={{ maxWidth: 800, margin: "56px auto 0", padding: "0 24px" }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "40px 24px", boxShadow: "0 4px 24px rgba(2,132,199,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-block", background: TEAL_GRAD, color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>250가지 이상의 발달 운동</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: DARK, margin: "0 0 6px" }}>경이로운 발달 운동</h2>
            <p style={{ fontSize: 13, color: LIGHT, margin: 0 }}>이들의 처방은 하루에 20분도 채 걸리지 않습니다</p>
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
                <p style={{ fontSize: 12, color: MID, margin: "0 0 8px", lineHeight: 1.6, wordBreak: "keep-all" }}>{r.text}</p>
                <p style={{ fontSize: 10, color: LIGHT, margin: 0 }}>{r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 요금제 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 900, marginBottom: 6, color: DARK }}>요금제</h2>
        <p style={{ textAlign: "center", fontSize: 13, color: LIGHT, marginBottom: 20 }}>처음 7일은 모든 기능 무료 체험</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "24px 20px" }}>
            <p style={{ fontWeight: 900, fontSize: 18, color: DARK, margin: "0 0 6px" }}>무료</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: LIGHT, margin: "0 0 12px" }}>₩0</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", fontSize: 13, color: MID, lineHeight: 2 }}>
              <li>✅ 기본 기록 기능</li>
              <li>✅ 성장 캘린더 보기</li>
              <li>✅ 발달 운동 일부</li>
            </ul>
            <Link href="/momcare/daily-tracker" style={{ display: "block", background: "#f0f9ff", color: TEAL, textAlign: "center", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", border: `1px solid ${BORDER}` }}>무료 시작</Link>
          </div>
          <div style={{ background: TEAL_GRAD, borderRadius: 16, padding: "24px 20px", boxShadow: "0 4px 24px rgba(2,132,199,0.35)" }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.25)", color: "white", borderRadius: 10, padding: "2px 10px", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>추천</div>
            <p style={{ fontWeight: 900, fontSize: 18, color: "white", margin: "0 0 6px" }}>PRO</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "white", margin: "0 0 4px" }}>₩9,900<span style={{ fontSize: 13, fontWeight: 400 }}>/월</span></p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: "0 0 12px" }}>연간 결제 시 30% 할인</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 2 }}>
              <li>✅ 모든 기록 기능</li>
              <li>✅ 고급 분석 & 차트</li>
              <li>✅ WHO 백분위수 비교</li>
              <li>✅ 전체 발달 운동</li>
              <li>✅ 우선 지원</li>
            </ul>
            <button onClick={() => alert("결제 시스템 준비 중입니다! 곧 오픈됩니다.")} style={{ display: "block", width: "100%", background: "white", color: TEAL, border: "none", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>PRO 시작하기</button>
          </div>
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
                  <p style={{ fontSize: 13, color: MID, margin: "12px 0 0", lineHeight: 1.7, wordBreak: "keep-all" }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ background: TEAL_GRAD, borderRadius: 20, padding: "40px 24px", textAlign: "center", boxShadow: "0 8px 32px rgba(2,132,199,0.3)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px", color: "white" }}>지금 바로 맘케어를 시작하세요</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "0 0 24px" }}>무료로 시작하세요. 안전합니다.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => alert("앱스토어 출시 준비 중입니다!")} style={{ background: "white", color: TEAL, border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>App Store 다운로드</button>
            <button onClick={() => alert("구글플레이 출시 준비 중입니다!")} style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Google Play 다운로드</button>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div style={{ background: "#f0f9ff", borderTop: `1px solid ${BORDER}`, margin: "40px 0 0", padding: "32px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, color: TEAL, margin: "0 0 4px" }}>맘케어</p>
            <p style={{ fontSize: 13, color: LIGHT, margin: 0 }}>함께 성장해 나가요. 모든 성장 과정과 함께.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, color: LIGHT, margin: "0 0 4px" }}>momcare@gmail.com</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <Link href="/momcare/privacy" style={{ fontSize: 12, color: LIGHT, textDecoration: "none" }}>개인정보처리방침</Link>
              <Link href="/momcare/terms" style={{ fontSize: 12, color: LIGHT, textDecoration: "none" }}>이용약관</Link>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 800, margin: "20px auto 0", borderTop: `1px solid ${BORDER}`, paddingTop: 16, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: LIGHT, margin: 0 }}>© 2026 MomCare. All rights reserved. | Powered by 점운</p>
        </div>
      </div>

    </div>
  );
}
