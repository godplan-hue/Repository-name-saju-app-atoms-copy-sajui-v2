"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CRISIS_WEEKS = [
  { week: 5,  name: "1차 성장 급증", color: "#fed7aa", symptoms: ["더 많이 먹으려 함", "보채고 울음이 늘어남", "수면 패턴 변화"], skills: ["시각이 발달해 얼굴을 더 잘 따라봄", "소리에 반응이 좋아짐"], tips: "충분히 안아주고 수유 횟수를 늘려도 됩니다." },
  { week: 8,  name: "2차 성장 위기", color: "#fca5a5", symptoms: ["밤에 자주 깸", "보채고 매달림", "수유 간격 짧아짐"], skills: ["팔다리를 더 활발히 움직임", "소리 내기 시작(쿠잉)"], tips: "스킨십을 자주 해주세요. 이 시기는 2~3주 지나면 안정됩니다." },
  { week: 12, name: "3차 성장 위기", color: "#fca5a5", symptoms: ["갑자기 보채기 시작", "수면 퇴행", "분리 불안 시작"], skills: ["물체를 손으로 잡으려 함", "목을 가누기 시작"], tips: "규칙적인 루틴이 중요합니다. 같은 시간에 재우는 연습을 해보세요." },
  { week: 19, name: "4차 성장 위기", color: "#fca5a5", symptoms: ["낯가림 심해짐", "모든 것에 관심 보임", "밤중 수유 증가"], skills: ["뒤집기 시작", "다양한 소리 구별", "손과 발을 스스로 탐색"], tips: "새로운 환경과 경험을 많이 제공해주세요." },
  { week: 26, name: "5차 성장 위기", color: "#fca5a5", symptoms: ["낯선 사람 무서워함", "항상 곁에 있으려 함", "수면 문제"], skills: ["이유식 시작 가능", "물건 잡아서 입에 넣기", "기어다니기 준비"], tips: "분리 연습을 짧게 시작해보세요. 까꿍놀이가 효과적입니다." },
  { week: 37, name: "6차 성장 위기", color: "#fca5a5", symptoms: ["매우 칭얼거림", "먹기 거부", "수면 퇴행"], skills: ["기어다니기", "혼자 앉기", "물건의 영속성 이해 시작"], tips: "이 시기에 많이 이야기해주고 책을 읽어주세요." },
  { week: 46, name: "7차 성장 위기", color: "#fca5a5", symptoms: ["걸어다니려 함", "뭐든 혼자 하려 함", "짜증이 많아짐"], skills: ["첫 발걸음 (돌 전후)", "손가락으로 집기", "첫 단어 말하기"], tips: "아이의 독립심을 존중해주세요. 안전한 환경을 만들어 주세요." },
  { week: 55, name: "8차 성장 위기", color: "#fca5a5", symptoms: ["고집이 세짐", "원하는 것 표현 강해짐"], skills: ["두 단어 연결", "계단 오르기 시도", "흉내내기 놀이"], tips: "명확하고 일관된 규칙을 정해주세요." },
  { week: 64, name: "9차 성장 위기", color: "#fca5a5", symptoms: ["고집 더 강해짐", "감정 폭발(떼쓰기)"], skills: ["간단한 지시 따르기", "스스로 숟가락 사용 시도", "신발 벗기 시도"], tips: "감정을 언어로 표현하도록 도와주세요. '화났구나', '슬프구나'." },
  { week: 75, name: "10차 성장 위기", color: "#fca5a5", symptoms: ["매우 매달림", "퇴행 행동(손가락 빨기 등)"], skills: ["두 단어 문장", "혼자 뛰기", "상상 놀이 시작"], tips: "충분한 스킨십과 격려로 자존감을 키워주세요." },
  { week: 84, name: "11차 성장 위기", color: "#fca5a5", symptoms: ["경계 시험하기", "고집 매우 강함"], skills: ["세 단어 이상 문장", "또래와 놀이 시작", "간단한 규칙 이해"], tips: "일관성 있는 규칙을 유지하되, 선택권을 줘보세요." },
];

const ALL_WEEKS: Array<{ week: number; name: string; milestone: string; isCrisis: boolean }> = [];
for (let w = 1; w <= 52; w++) {
  const crisis = CRISIS_WEEKS.find(c => c.week === w);
  ALL_WEEKS.push({ week: w, name: crisis ? crisis.name : `${w}주차`, milestone: crisis ? "성장 위기" : "일반 성장 주차", isCrisis: !!crisis });
}

function calcWeeks(birthDate: string): number {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now = new Date();
  const diff = now.getTime() - birth.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

export default function GrowthCalendarPage() {
  const [birthDate, setBirthDate] = useState("");
  const [babyName, setBabyName] = useState("");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedCrisis, setSelectedCrisis] = useState<typeof CRISIS_WEEKS[0] | null>(null);
  const [unlocked, setUnlocked] = useState(true);

  useEffect(() => {
    const exp = localStorage.getItem("momcare_unlock_until");
    if (!exp || Number(exp) <= Date.now()) setUnlocked(false);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("momcare_baby");
    if (saved) {
      const d = JSON.parse(saved);
      setBirthDate(d.birthDate || "");
      setBabyName(d.name || "");
    }
  }, []);

  useEffect(() => {
    if (birthDate) {
      const w = calcWeeks(birthDate);
      setCurrentWeek(w);
      const saved = localStorage.getItem("momcare_baby");
      const d = saved ? JSON.parse(saved) : {};
      localStorage.setItem("momcare_baby", JSON.stringify({ ...d, birthDate, name: babyName }));
    }
  }, [birthDate, babyName]);

  const nextCrisis = CRISIS_WEEKS.find(c => c.week > currentWeek);
  const currentCrisis = CRISIS_WEEKS.find(c => c.week === currentWeek);

  if (!unlocked) return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "40px 28px", textAlign: "center", maxWidth: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px" }}>사주 분석 후 30일 무료</h2>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px", lineHeight: 1.6 }}>점운에서 사주를 보면<br />맘케어 전체 기능을 30일 무료로 이용해요</p>
        <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 12 }}>점운 사주 보러 가기 →</Link>
        <Link href="/momcare" style={{ display: "block", fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>← 맘케어 홈으로</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>맘케어</Link>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>📅 성장 위기 캘린더</span>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>

        {/* 아기 정보 */}
        <div style={{ background: "white", borderRadius: 18, padding: "24px 20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 16px", color: "#111" }}>아기 정보 입력</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>아기 이름</label>
              <input value={babyName} onChange={e => setBabyName(e.target.value)} placeholder="예: 다은이" style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>출생일</label>
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          {currentWeek > 0 && (
            <div style={{ marginTop: 16, background: "#fde8d8", borderRadius: 12, padding: "12px 16px" }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#f97316" }}>
                {babyName || "아기"}는 현재 <strong>{currentWeek}주차</strong>입니다
                {currentCrisis && <span style={{ marginLeft: 8, background: "#fca5a5", color: "white", borderRadius: 8, padding: "2px 8px", fontSize: 12 }}>성장 위기 주간</span>}
              </p>
              {nextCrisis && !currentCrisis && (
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>다음 성장 위기: {nextCrisis.week}주차 ({nextCrisis.name}) — {nextCrisis.week - currentWeek}주 후</p>
              )}
            </div>
          )}
        </div>

        {/* 현재 위기 상세 */}
        {(currentCrisis || selectedCrisis) && (
          <div style={{ background: "#fef3c7", borderRadius: 18, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {(() => {
              const c = selectedCrisis || currentCrisis!;
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>{c.week}주차 — {c.name}</h3>
                    {selectedCrisis && <button onClick={() => setSelectedCrisis(null)} style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af" }}>×</button>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div><p style={{ fontSize: 12, fontWeight: 700, color: "#f97316", margin: "0 0 6px" }}>이 시기 증상</p>{c.symptoms.map(s => <p key={s} style={{ fontSize: 12, color: "#374151", margin: "0 0 3px" }}>• {s}</p>)}</div>
                    <div><p style={{ fontSize: 12, fontWeight: 700, color: "#10b981", margin: "0 0 6px" }}>발달하는 능력</p>{c.skills.map(s => <p key={s} style={{ fontSize: 12, color: "#374151", margin: "0 0 3px" }}>✓ {s}</p>)}</div>
                  </div>
                  <div style={{ background: "white", borderRadius: 10, padding: "10px 14px" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", margin: "0 0 4px" }}>부모 팁</p>
                    <p style={{ fontSize: 13, color: "#1a1a2e", margin: 0 }}>{c.tips}</p>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* 성장 위기 목록 */}
        <div style={{ background: "white", borderRadius: 18, padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, margin: "0 0 16px", color: "#111" }}>성장 위기 전체 일정</h3>
          <p style={{ fontSize: 12, color: "#374151", margin: "0 0 14px" }}>소아과 전문의와 함께 생후 156주까지의 발달 과정을 알려드립니다</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CRISIS_WEEKS.map(c => (
              <button key={c.week} onClick={() => setSelectedCrisis(c === selectedCrisis ? null : c)} style={{ background: c.week === currentWeek ? "#fde8d8" : c.color + "55", border: c.week === currentWeek ? "2px solid #f97316" : `1.5px solid ${c.color}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e" }}>{c.week}주차 — {c.name}</span>
                  {c.week === currentWeek && <span style={{ marginLeft: 8, background: "#f97316", color: "white", borderRadius: 8, padding: "2px 8px", fontSize: 11 }}>현재</span>}
                  {nextCrisis?.week === c.week && currentWeek > 0 && c.week !== currentWeek && <span style={{ marginLeft: 8, background: "#fbbf24", color: "white", borderRadius: 8, padding: "2px 8px", fontSize: 11 }}>다음</span>}
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{c.symptoms[0]}</p>
                </div>
                <span style={{ color: "#d1d5db", fontSize: 16 }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
