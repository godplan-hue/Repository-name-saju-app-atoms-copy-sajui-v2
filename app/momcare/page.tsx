"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "성장 위기란 무엇인가요?",
    a: "출생부터 3세까지 아이는 여러 번의 성장 및 발달 위기를 겪습니다. 이는 신경계와 뇌가 발달하고 아이가 새로운 능력을 보이기 시작하는 자연스러운 과정입니다. 이 시기에 아이는 보채거나 잠을 잘 못 잘 수도 있어요. 맘케어가 이 시기를 미리 알려드립니다.",
  },
  {
    q: "앱 정보를 신뢰할 수 있는 이유는 무엇인가요?",
    a: "앱에 있는 모든 글, 설명, 발달 운동은 현직 소아과 의사들과 협력하여 제작되었습니다. AI가 근거 기반 의학 데이터를 바탕으로 아이의 성장을 분석합니다.",
  },
  {
    q: "어떤 구독 옵션이 있나요?",
    a: "무료 버전도 있지만 기능이 제한적입니다. 유료 버전은 모든 기능을 제공하며 월간 또는 연간 구독을 선택하실 수 있어요. 처음 7일은 무료로 모든 기능을 체험하실 수 있습니다.",
  },
  {
    q: "아이가 여러 명이어도 사용할 수 있나요?",
    a: "네! 아이를 여러 명 등록하여 각각의 성장 기록을 따로 관리하실 수 있습니다. 형제자매 비교 기능도 제공됩니다.",
  },
  {
    q: "WHO 성장 기준과 어떻게 비교하나요?",
    a: "세계보건기구(WHO)의 공식 성장 기준 데이터를 기반으로 아이의 키, 몸무게, 머리둘레를 백분위수로 비교해 드립니다. 또래 평균과의 차이를 그래프로 한눈에 확인할 수 있습니다.",
  },
];

const FEATURES = [
  {
    icon: "📏",
    title: "측정 일기: 키, 몸무게, 둘레",
    desc: "아이의 주요 성장 지표를 정확하게 파악하고 변화를 추적하세요. 세계보건기구(WHO)의 기준과 비교하여 확인하실 수 있습니다.",
    side: "left",
  },
  {
    icon: "🍼",
    title: "수면, 수유, 기저귀 교체, 유축, 아이의 기분을 추적하는 앱",
    desc: "자녀의 일상 스케줄과 생활 습관에 대한 모든 중요한 정보를 하나의 앱에 기록하세요.",
    side: "right",
  },
  {
    icon: "📅",
    title: "성장 위기 일정",
    desc: "저희는 소아과 전문의와 함께 자녀의 생리, 운동 능력, 언어 발달 과정(생후 156주까지)에 대해 설명해 드립니다.",
    side: "left",
  },
  {
    icon: "📸",
    title: "소중한 순간들을 기록하는 일기",
    desc: "첫 미소, 첫 이빨, 첫 걸음마 – 아기의 첫 순간들을 앱에 기록하세요. 귀여운 영상을 만들어 소셜 미디어와 메신저를 통해 가족, 친구들과 공유하세요.",
    side: "right",
  },
];

const EXERCISES = [
  { title: "욕조에서 목욕하기", desc: "목욕 시간은 중요한 의식입니다. 아이에게 새로운 정서적 경험을 선사하는 시간입니다.", emoji: "🛁" },
  { title: '발에 있는 "숫자 8" 모양', desc: "아기의 발에 엄지손가락으로 숫자 8 모양을 그려 부드럽게 눌러주세요. 4~6회 반복합니다.", emoji: "👣" },
  { title: "무릎을 배에 대고", desc: "아기를 눕힌 자세에서 구부린 다리를 잡고 무릎을 배 쪽으로 당겼다가 원래 위치로 되돌립니다. 수유 전 4~6회 실시하세요.", emoji: "🤸" },
];

const REVIEWS = [
  { text: "아기의 생후 몇 주차별 기록을 자세히 보여주는 앱을 아직 못 찾았어요. 알려주시면 정말 감사하겠습니다!", stars: 5, date: "2026년 1월 25일" },
  { text: "정말 감사합니다! 이 앱은 저에게 가장 중요한 육아 앱이에요.", stars: 5, date: "2026년 2월 10일" },
  { text: "우리 아기의 성장 발달 단계가 모두 완벽하게 일치해요. 다음 주에 어떤 변화가 있을지, 어떻게 대처해야 할지 알 수 있어서 정말 좋아요.", stars: 5, date: "2026년 2월 15일" },
];

export default function MomcarePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#eef4fb", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1a1a2e" }}>

      {/* 네비게이션 */}
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#f97316" }}>맘케어</span>
        <button
          onClick={() => alert("앱 다운로드 준비 중입니다!")}
          style={{ background: "#f97316", color: "white", border: "none", borderRadius: 20, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          다운로드
        </button>
      </nav>

      {/* 히어로 */}
      <div style={{ background: "linear-gradient(135deg, #fde8d8, #fdf0e8)", padding: "60px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#f97316", color: "white", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
          출생부터 3세까지 AI 육아 동반자
        </div>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 900, lineHeight: 1.25, marginBottom: 16, color: "#1a1a2e" }}>
          부모가 만든,<br />소아과 전문의가 함께하는<br />AI 육아 앱
        </h1>
        <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 32px" }}>
          아이의 성장, 수면, 수유, 발달 운동까지<br />하나의 앱에서 모두 관리하세요
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          <div style={{ textAlign: "left", background: "white", borderRadius: 14, padding: "14px 18px", minWidth: 200, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 6px", color: "#1a1a2e" }}>📊 성장, 몸무게, 둘레 일기</p>
            <p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 6px", color: "#1a1a2e" }}>🍼 수면, 수유, 기저귀, 유축 추적</p>
            <p style={{ fontWeight: 800, fontSize: 14, margin: 0, color: "#1a1a2e" }}>📅 성장 위기 캘린더</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 14, padding: "20px 24px", color: "white", textAlign: "center" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px" }}>출생부터</p>
              <p style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>3세</p>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>까지</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ background: "white", borderRadius: 12, padding: "10px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>앱스토어 <strong style={{ color: "#1a1a2e" }}>4.9점</strong></p>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: "10px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>구글플레이 <strong style={{ color: "#1a1a2e" }}>4.8점</strong></p>
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: "10px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}><strong style={{ color: "#f97316" }}>200만+</strong> 가족 사용</p>
          </div>
        </div>
      </div>

      {/* 기능 소개 */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ background: "#dbeafe", borderRadius: 20, padding: "32px 28px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ fontSize: 48, flexShrink: 0 }}>{f.icon}</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px", lineHeight: 1.4 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 발달 운동 250가지 */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ background: "#fce7f3", borderRadius: 20, padding: "40px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>
            250가지가 넘는 발달 운동
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 28px" }}>하루에 20분도 채 걸리지 않습니다</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {EXERCISES.map((ex, i) => (
              <div key={i} style={{ background: "white", borderRadius: 16, padding: "24px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{ex.emoji}</div>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>{ex.title}</h4>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{ex.desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => alert("앱에서 250가지 운동을 모두 확인하세요!")}
            style={{ marginTop: 24, background: "#f97316", color: "white", border: "none", borderRadius: 24, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            앱에서 더 많은 운동 확인하세요
          </button>
        </div>
      </div>

      {/* 200만 가족 */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ background: "#fde8d8", borderRadius: 20, padding: "40px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", margin: "0 0 16px" }}>
            200만 가족이 저희와 함께<br />아기의 발달 과정을 추적하고 있습니다.
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 2px" }}>앱스토어 평점</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#f97316", margin: 0 }}>4.9점</p>
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 2px" }}>구글플레이</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#f97316", margin: 0 }}>4.8점</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: "white", borderRadius: 14, padding: "18px 16px", textAlign: "left" }}>
                <p style={{ fontSize: 13, color: "#374151", margin: "0 0 10px", lineHeight: 1.6 }}>{r.text}</p>
                <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                  {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: "#f59e0b", fontSize: 12 }}>{s}</span>)}
                </div>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{r.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, textAlign: "center", marginBottom: 20 }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <button
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                style={{ width: "100%", padding: "16px 20px", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}
              >
                <span>{item.q}</span>
                <span style={{ color: "#f97316", fontSize: 20, flexShrink: 0 }}>{openFAQ === idx ? "−" : "+"}</span>
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

      {/* CTA / 다운로드 */}
      <div style={{ maxWidth: 720, margin: "48px auto 0", padding: "0 24px" }}>
        <div style={{ background: "#dbeafe", borderRadius: 20, padding: "40px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 6px" }}>QR 코드를 스캔하여 지금 바로 앱을 사용해 보세요.</p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 24px" }}>무료이고 안전합니다.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => alert("앱스토어 출시 준비 중입니다!")}
              style={{ background: "#000", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              App Store 다운로드
            </button>
            <button
              onClick={() => alert("구글플레이 출시 준비 중입니다!")}
              style={{ background: "#333", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              Google Play 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div style={{ background: "#dbeafe", margin: "48px 0 0", padding: "32px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, color: "#f97316", margin: "0 0 4px" }}>맘케어</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>함께 성장해 나가요. 모든 성장 과정과 함께.</p>
          </div>
          <div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px" }}>앱에 대한 질문이 있으신가요?</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#f97316", margin: 0 }}>Powered by 점운</p>
          </div>
        </div>
        <div style={{ maxWidth: 720, margin: "20px auto 0", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 16, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>© 2026 맘케어 | 개인정보 보정책 · 서비스 약관</p>
        </div>
      </div>

    </div>
  );
}
