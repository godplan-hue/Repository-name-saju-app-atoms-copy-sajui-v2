"use client";

import { useState } from "react";
import Link from "next/link";

const FEATURES = [
  { icon: "📅", title: "성장 위기 캘린더", desc: "소아과 전문의와 함께 자녀의 생리·운동·언어 발달 과정(생후 156주)을 미리 알려드립니다.", href: "/momcare/growth-calendar", color: "#dbeafe" },
  { icon: "🍼", title: "일일 트래커", desc: "수면, 수유, 기저귀, 유축, 기분을 시간순으로 기록하고 생활 패턴을 파악하세요.", href: "/momcare/daily-tracker", color: "#fce7f3" },
  { icon: "📏", title: "성장 일기", desc: "키, 몸무게, 머리둘레를 기록하고 WHO 기준 백분위수로 아이의 성장을 추적하세요.", href: "/momcare/growth-diary", color: "#d1fae5" },
  { icon: "📸", title: "소중한 순간 저널", desc: "첫 미소, 첫 이빨, 첫 걸음마 — 아기의 소중한 첫 순간들을 카테고리별로 기록하세요.", href: "/momcare/memory-journal", color: "#fef3c7" },
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
  { q: "무료로 사용할 수 있나요?", a: "네! 기본 기능(월 10건 기록)은 무료로 이용하실 수 있습니다. PRO 플랜으로 업그레이드하시면 무제한 기록, 고급 분석, 우선 지원 등 모든 기능을 이용하실 수 있습니다." },
  { q: "아이가 여러 명이어도 사용할 수 있나요?", a: "네! 아이를 여러 명 등록하여 각각의 성장 기록을 따로 관리하실 수 있습니다. 형제자매 비교 기능도 제공됩니다." },
  { q: "WHO 성장 기준과 어떻게 비교하나요?", a: "세계보건기구(WHO)의 공식 성장 기준 데이터를 기반으로 아이의 키, 몸무게, 머리둘레를 백분위수로 비교해 드립니다. 또래 평균과의 차이를 한눈에 확인할 수 있습니다." },
];

export default function MomcarePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1a1a2e" }}>

      {/* 네비게이션 */}
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/momcare/growth-calendar" style={{ fontSize: 12, color: "#6b7280", textDecoration: "none", padding: "6px 10px" }}>캘린더</Link>
          <Link href="/momcare/daily-tracker" style={{ fontSize: 12, color: "#6b7280", textDecoration: "none", padding: "6px 10px" }}>트래커</Link>
          <Link href="/momcare/growth-diary" style={{ fontSize: 12, color: "#6b7280", textDecoration: "none", padding: "6px 10px" }}>성장일기</Link>
          <Link href="/momcare/memory-journal" style={{ fontSize: 12, color: "#6b7280", textDecoration: "none", padding: "6px 10px" }}>추억저널</Link>
        </div>
      </nav>

      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, #fde8d8 0%, #fdf0e8 50%, #dbeafe 100%)", padding: "60px 24px 52px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#f97316", color: "white", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
          출생부터 3세까지 AI 육아 동반자
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 16, color: "#1a1a2e" }}>
          부모가 만든,<br />
          <span style={{ color: "#f97316" }}>소아과 전문의</span>가 함께하는<br />
          AI 육아 앱
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 32px" }}>
          성장일기, 수유·수면 기록부터 발달 단계까지,<br />우리 아이의 모든 순간을 기록하세요
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          <Link href="/momcare/daily-tracker" style={{ background: "#f97316", color: "white", borderRadius: 28, padding: "14px 28px", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(249,115,22,0.3)" }}>
            무료로 시작하기
          </Link>
          <Link href="/momcare/growth-calendar" style={{ background: "white", color: "#f97316", border: "2px solid #f97316", borderRadius: 28, padding: "12px 24px", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            성장 캘린더 보기
          </Link>
        </div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {[{ label: "앱스토어", score: "4.9" }, { label: "구글플레이", score: "4.8" }, { label: "가족", score: "200만+" }].map(b => (
            <div key={b.label} style={{ background: "white", borderRadius: 12, padding: "8px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", fontSize: 13 }}>
              <span style={{ color: "#6b7280" }}>{b.label} </span>
              <strong style={{ color: "#f97316" }}>{b.score}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 4가지 핵심 기능 */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 0" }}>
        <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 900, marginBottom: 8 }}>함께 성장해요. <span style={{ color: "#f97316" }}>매 순간마다.</span></h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280", marginBottom: 28 }}>클릭하면 실제로 사용할 수 있는 4가지 핵심 기능</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ background: f.color, borderRadius: 20, padding: "28px 24px", textDecoration: "none", color: "inherit", display: "block", transition: "transform 0.2s", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "#4b5563", margin: "0 0 16px", lineHeight: 1.6 }}>{f.desc}</p>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f97316" }}>지금 사용하기 →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 발달 운동 */}
      <div style={{ maxWidth: 800, margin: "56px auto 0", padding: "0 24px" }}>
        <div style={{ background: "#fce7f3", borderRadius: 20, padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ display: "inline-block", background: "#ec4899", color: "white", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>250가지 이상의 발달 운동</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 6px" }}>경이로운 발달 운동</h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>이들의 처방은 하루에 20분도 채 걸리지 않습니다</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {EXERCISES.map((ex) => (
              <div key={ex.title} style={{ background: "white", borderRadius: 14, padding: "20px 16px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{ex.emoji}</div>
                <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 6 }}>{ex.age}</div>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px" }}>{ex.title}</h4>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{ex.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link href="/momcare/growth-calendar" style={{ background: "#f97316", color: "white", border: "none", borderRadius: 24, padding: "12px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
              앱에서 더 많은 운동 확인하세요
            </Link>
          </div>
        </div>
      </div>

      {/* 200만 가족 + 리뷰 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ background: "#fde8d8", borderRadius: 20, padding: "40px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 16px" }}>
            200만 가족이 함께하는
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 24 }}>
            <div><p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 2px" }}>앱스토어 평점</p><p style={{ fontSize: 24, fontWeight: 900, color: "#f97316", margin: 0 }}>4.9★</p></div>
            <div><p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 2px" }}>구글플레이</p><p style={{ fontSize: 24, fontWeight: 900, color: "#f97316", margin: 0 }}>4.8★</p></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: "white", borderRadius: 14, padding: "16px", textAlign: "left" }}>
                <div style={{ display: "flex", gap: 1, marginBottom: 8 }}>{"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#f59e0b", fontSize: 12 }}>{s}</span>)}</div>
                <p style={{ fontSize: 12, color: "#374151", margin: "0 0 8px", lineHeight: 1.6 }}>{r.text}</p>
                <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 요금제 */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>요금제</h2>
        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginBottom: 20 }}>처음 7일은 모든 기능 무료 체험</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 16, padding: "24px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
            <p style={{ fontWeight: 900, fontSize: 18, color: "#1a1a2e", margin: "0 0 6px" }}>무료</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "#6b7280", margin: "0 0 12px" }}>₩0</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", fontSize: 13, color: "#4b5563", lineHeight: 2 }}>
              <li>✅ 월 10건 기록 제한</li>
              <li>✅ 기본 기능 제공</li>
              <li>✅ 성장 캘린더 보기</li>
            </ul>
            <Link href="/momcare/daily-tracker" style={{ display: "block", background: "#f3f4f6", color: "#6b7280", textAlign: "center", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>무료 시작</Link>
          </div>
          <div style={{ background: "#f97316", borderRadius: 16, padding: "24px 20px", boxShadow: "0 4px 20px rgba(249,115,22,0.3)" }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.3)", color: "white", borderRadius: 10, padding: "2px 10px", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>추천</div>
            <p style={{ fontWeight: 900, fontSize: 18, color: "white", margin: "0 0 6px" }}>PRO</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: "white", margin: "0 0 4px" }}>₩9,900<span style={{ fontSize: 13, fontWeight: 400 }}>/월</span></p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: "0 0 12px" }}>연간 결제 시 30% 할인 (₩83,160/년)</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 2 }}>
              <li>✅ 무제한 기록</li>
              <li>✅ 고급 분석 & 차트</li>
              <li>✅ WHO 백분위수 비교</li>
              <li>✅ 무제한 발달 운동</li>
              <li>✅ 우선 지원</li>
            </ul>
            <button onClick={() => alert("결제 시스템 준비 중입니다! 곧 오픈됩니다.")} style={{ display: "block", width: "100%", background: "white", color: "#f97316", border: "none", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>PRO 시작하기</button>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-block", color: "#f97316", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>자주 묻는 질문</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>궁금한 점이 있으신가요?</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
              <button onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)} style={{ width: "100%", padding: "16px 20px", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
                <span>{item.q}</span>
                <span style={{ color: "#f97316", fontSize: 20 }}>{openFAQ === idx ? "−" : "+"}</span>
              </button>
              {openFAQ === idx && (
                <div style={{ padding: "0 20px 16px", borderTop: "1px solid #f3f4f6" }}>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: "12px 0 0", lineHeight: 1.7 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ background: "#1a1a2e", borderRadius: 20, padding: "40px 24px", textAlign: "center", color: "white" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>지금 바로 맘케어를 시작하세요</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 24px" }}>무료로 시작하세요. 안전합니다.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => alert("앱스토어 출시 준비 중입니다!")} style={{ background: "white", color: "#1a1a2e", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>App Store 다운로드</button>
            <button onClick={() => alert("구글플레이 출시 준비 중입니다!")} style={{ background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Google Play 다운로드</button>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div style={{ background: "#1a1a2e", margin: "40px 0 0", padding: "32px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, color: "#f97316", margin: "0 0 4px" }}>맘케어</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>함께 성장해 나가요. 모든 성장 과정과 함께.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>momcare@gmail.com</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <Link href="/momcare/privacy" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>개인정보처리방침</Link>
              <Link href="/momcare/terms" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>이용약관</Link>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 800, margin: "20px auto 0", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>© 2026 MomCare. All rights reserved. | Powered by 점운</p>
        </div>
      </div>

    </div>
  );
}
