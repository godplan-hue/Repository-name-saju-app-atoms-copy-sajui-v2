"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  { week: 96, name: "12차 언어 폭발기", color: "#c4b5fd", symptoms: ["말이 폭발적으로 늘어남", "질문을 끊임없이 함", "수면 불안정"], skills: ["두 단어 이상 문장 구사", "노래 따라 부르기", "색깔·모양 인식"], tips: "'왜?'질문에 성실히 답해주세요. 언어 발달의 황금기입니다." },
  { week: 108, name: "13차 자아 확립기", color: "#fca5a5", symptoms: ["'내가 할 거야' 고집", "떼쓰기 절정", "감정 기복 심함"], skills: ["간단한 옷 스스로 입기", "젓가락·포크 사용 시도", "친구 개념 이해"], tips: "선택권을 주되 범위를 정해주세요. '이거 할래, 저거 할래?' 방식이 효과적입니다." },
  { week: 120, name: "14차 상상력 발달기", color: "#86efac", symptoms: ["상상의 친구 생김", "무서움·악몽 증가", "복잡한 감정 표현"], skills: ["역할 놀이 즐기기", "숫자 1~10 세기", "간단한 동화 이해"], tips: "상상력을 존중해주세요. 무서운 꿈은 함께 이야기하며 안심시켜 주세요." },
  { week: 132, name: "15차 사회성 발달기", color: "#fca5a5", symptoms: ["친구와 갈등 증가", "규칙에 집착함", "부모와 분리 불안 재등장"], skills: ["협동 놀이", "감정 조절 시작", "간단한 게임 규칙 이해"], tips: "또래 놀이 시간을 충분히 주세요. 갈등 해결 방법을 함께 연습하세요." },
  { week: 144, name: "16차 독립심 강화기", color: "#c4b5fd", symptoms: ["'혼자 할 수 있어' 고집", "부모 말 안 듣는 빈도 증가", "수면 거부"], skills: ["혼자 이 닦기 시도", "간단한 심부름 수행", "과거·미래 개념 이해"], tips: "스스로 할 수 있는 일을 점점 늘려주세요. 성공 경험이 자존감을 키웁니다." },
  { week: 156, name: "17차 학습 준비기 (3세)", color: "#fde68a", symptoms: ["집중력 짧아짐", "새로운 것에 강한 호기심", "또래 비교 시작"], skills: ["간단한 글자·숫자 관심", "가위질 시도", "3~4개 문장 대화"], tips: "억지로 가르치려 하지 말고 놀이 속에서 자연스럽게 배우게 해주세요. 36개월 발달 검진을 받아보세요." },
];

const ALL_WEEKS: Array<{ week: number; name: string; milestone: string; isCrisis: boolean }> = [];
for (let w = 1; w <= 156; w++) {
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
  const [mcUserId, setMcUserId] = useState("");
  const [unlocked, setUnlocked] = useState(true);
  const router = useRouter();

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

    let uid = "";
    try {
      const ph = (JSON.parse(localStorage.getItem("v2_saved_profile") || "{}").phone || localStorage.getItem("v2_saved_phone") || "").replace(/\D/g, "");
      if (ph.length >= 10) uid = `phone_${ph}`;
    } catch {}
    if (!uid) { router.replace("/momcare"); return; }
    setMcUserId(uid);

    fetch(`/api/momcare/save?userId=${uid}&type=baby_profile`)
      .then(r => r.json())
      .then(d => {
        if (d.data && d.data.birthDate) {
          setBirthDate(d.data.birthDate);
          setBabyName(d.data.name || "");
          localStorage.setItem("momcare_baby", JSON.stringify(d.data));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (birthDate) {
      const w = calcWeeks(birthDate);
      setCurrentWeek(w);
      const saved = localStorage.getItem("momcare_baby");
      const d = saved ? JSON.parse(saved) : {};
      const newData = { ...d, birthDate, name: babyName };
      localStorage.setItem("momcare_baby", JSON.stringify(newData));
      if (mcUserId) {
        fetch("/api/momcare/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: mcUserId, type: "baby_profile", data: newData }),
        }).catch(() => {});
      }
    }
  }, [birthDate, babyName, mcUserId]);

  const nextCrisis = CRISIS_WEEKS.find(c => c.week > currentWeek);
  const currentCrisis = CRISIS_WEEKS.find(c => c.week === currentWeek);

  if (!unlocked) return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "32px 24px", textAlign: "center", maxWidth: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <Link href="/momcare" style={{ display: "block", fontSize: 13, color: "#f97316", textDecoration: "none", marginBottom: 16, textAlign: "left" }}>← 육아일기 홈으로</Link>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", margin: "0 0 16px" }}>결제 후 30일 이용 가능</h2>
        <Link href="/momcare/pay" style={{ display: "block", background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "white", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 12, textAlign: "center" }}>💳 육아일기 결제하기 (990원·5,900원) →</Link>
        <Link href="/momcare/pay" style={{ display: "block", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontSize: 13, color: "#c2410c", fontWeight: 700, lineHeight: 1.5, textDecoration: "none" }}>
          💡 990원 결제 시<br />육아일기 7가지 기능 30일 이용!
        </Link>
        <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 900, textDecoration: "none", marginBottom: 12 }}>사주 990원 결제하기 →</Link>
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 14px", fontSize: 12, color: "#166534", fontWeight: 700, lineHeight: 1.8 }}>
          🎁 덤으로 24시간 추가 혜택!<br />🌙 꿈해몽 · 🐱 복냥이상담 · ❓ 360개 질문
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/momcare" style={{ fontSize: 20, fontWeight: 900, color: "#f97316", textDecoration: "none" }}>육아일기</Link>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>📅 성장 위기 캘린더</span>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>

        {/* 아기 정보 */}
        <div style={{ background: "white", borderRadius: 18, padding: "24px 20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: "#111" }}>아기 정보 입력</h2>
            {(birthDate || babyName) && <button onClick={() => { setBirthDate(""); setBabyName(""); setCurrentWeek(0); localStorage.removeItem("momcare_baby"); if (mcUserId) { fetch("/api/momcare/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: mcUserId, type: "baby_profile", data: {} }) }).catch(() => {}); } }} style={{ fontSize: 11, color: "#fca5a5", background: "none", border: "none", cursor: "pointer" }}>초기화</button>}
          </div>
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
          <div style={{ background: "#fff7e6", borderRadius: 18, padding: "20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", border: "2px solid #f97316" }}>
            {(() => {
              const c = selectedCrisis || currentCrisis!;
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: "#111111" }}>{c.week}주차 — {c.name}</h3>
                    {selectedCrisis && <button onClick={() => setSelectedCrisis(null)} style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#6b7280" }}>×</button>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 900, color: "#111111", margin: "0 0 6px" }}>이 시기 증상</p>
                      {c.symptoms.map(s => <p key={s} style={{ fontSize: 12, color: "#111111", margin: "0 0 4px", fontWeight: 600 }}>• {s}</p>)}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 900, color: "#111111", margin: "0 0 6px" }}>발달하는 능력</p>
                      {c.skills.map(s => <p key={s} style={{ fontSize: 12, color: "#111111", margin: "0 0 4px", fontWeight: 600 }}>✓ {s}</p>)}
                    </div>
                  </div>
                  <div style={{ background: "white", borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ fontSize: 13, fontWeight: 900, color: "#111111", margin: "0 0 4px" }}>부모 팁</p>
                    <p style={{ fontSize: 13, color: "#111111", margin: 0, fontWeight: 600, lineHeight: 1.6 }}>{c.tips}</p>
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
              <button key={c.week} onClick={() => setSelectedCrisis(c === selectedCrisis ? null : c)} style={{ background: c.week === currentWeek ? "#fde8d8" : "white", border: c.week === currentWeek ? "2px solid #f97316" : `2px solid ${c.color}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `5px solid ${c.color}` }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#111111" }}>{c.week}주차 — {c.name}</span>
                  {c.week === currentWeek && <span style={{ marginLeft: 8, background: "#f97316", color: "white", borderRadius: 8, padding: "2px 8px", fontSize: 11 }}>현재</span>}
                  {nextCrisis?.week === c.week && currentWeek > 0 && c.week !== currentWeek && <span style={{ marginLeft: 8, background: "#fbbf24", color: "#111", borderRadius: 8, padding: "2px 8px", fontSize: 11 }}>다음</span>}
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#374151", fontWeight: 600 }}>{c.symptoms[0]}</p>
                </div>
                <span style={{ color: "#9ca3af", fontSize: 18, fontWeight: 700 }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
