'use client'
import { useState } from 'react'

const SITUATIONS = [
  { id: 'late',       label: '지각',           icon: '⏰' },
  { id: 'absent',     label: '결근 / 결석',    icon: '🏠' },
  { id: 'cancel',     label: '약속 취소',       icon: '📵' },
  { id: 'homework',   label: '과제 / 보고서 못 함', icon: '📝' },
  { id: 'phone',      label: '전화 못 받음',    icon: '📞' },
  { id: 'late_meet',  label: '약속에 늦음',     icon: '🚌' },
  { id: 'forgot',     label: '깜빡함',          icon: '🤔' },
]

const TARGETS = [
  { id: 'boss',    label: '상사 / 선생님', icon: '👔' },
  { id: 'friend',  label: '친구',         icon: '🤝' },
  { id: 'parent',  label: '부모님',       icon: '👨‍👩‍👧' },
  { id: 'prof',    label: '교수님',       icon: '🎓' },
  { id: 'partner', label: '연인',         icon: '💕' },
]

const EXCUSES: Record<string, Record<string, string[]>> = {
  late: {
    boss: [
      "지하철이 선행 열차 지연으로 운행 중단됐습니다. 정말 어쩔 수 없었어요.",
      "어머니가 갑자기 어지럼증을 호소하셔서 확인하고 오는 길이에요.",
      "오늘 아침부터 속이 좋지 않았는데 참고 왔어요. 늦어서 정말 죄송합니다.",
    ],
    friend: [
      "진짜로 배달이 늦게 와서... 받고 바로 출발했어!",
      "핸드폰 보다가 알람이 울린 줄 알았는데 아니었어 ㅠㅠ",
      "버스가 갑자기 고장났잖아. 다음 버스 기다렸어.",
    ],
    parent: [
      "오늘 회사에서 급하게 처리할 일이 생겨서 조금 늦었어요.",
      "교통이 너무 막혀서요. 빨리 오려고 했는데.",
      "지하철에 사람이 너무 많아서 못 탔어요.",
    ],
    prof: [
      "아침에 갑자기 몸이 좋지 않았는데 수업이 중요해서 참고 왔습니다.",
      "지하철 선행 열차 지연 안내를 보지 못하고 탔다가 늦었습니다.",
      "오늘 아침에 이상하게 모든 게 어긋났어요. 죄송합니다 교수님.",
    ],
    partner: [
      "진짜야~ 나오려는데 엄마가 잠깐 얘기 좀 하자고 해서...",
      "버스 앱이 잘못됐어! 5분 후 온다고 했는데 안 왔어.",
      "오다가 쓰러진 할머니 도와드렸어. 나 착하지?",
    ],
  },
  absent: {
    boss: [
      "어젯밤부터 고열이 나서 병원을 다녀와야 할 것 같습니다. 정말 죄송합니다.",
      "가족 중에 갑작스러운 응급상황이 생겨서 오늘은 어렵게 됐습니다.",
      "식중독 증세가 있어서 도저히 이동이 어렵습니다. 재택으로 처리하겠습니다.",
    ],
    friend: [
      "야 진짜 오늘 몸이 완전 박살났어 ㅠ 다음에 꼭 볼게",
      "집에 갑자기 물이 터졌어... 수리 기사 기다려야 해",
      "엄마가 아프셔서 오늘은 옆에 있어야 할 것 같아",
    ],
    parent: [
      "몸이 많이 안 좋아서 쉬어야 할 것 같아요. 걱정 마세요.",
      "오늘 빠져도 되는 날이에요. 대체 수업 들을게요.",
      "친구 중에 많이 힘든 일 있어서 오늘은 함께 있어줘야 해요.",
    ],
    prof: [
      "아침부터 고열로 병원 진료를 받아야 해서 결석합니다. 진단서 첨부하겠습니다.",
      "가족 응급 상황으로 불가피하게 결석하게 됐습니다. 죄송합니다.",
      "몸이 좋지 않아 수업 참석이 어렵습니다. 자료 공유해 주시면 감사합니다.",
    ],
    partner: [
      "자기야 진짜 미안한데 오늘 완전 몸이 쓸려가는 것 같아ㅠ",
      "집에 갑자기 문제가 생겨서... 다음에 2배로 보상할게",
      "팀플 마감이 당겨졌어. 진짜 어쩔 수 없어ㅠ",
    ],
  },
  cancel: {
    boss: [
      "갑자기 팀 프로젝트 마감이 앞당겨져서 오늘 저녁이 어렵게 됐습니다.",
      "부모님이 갑작스럽게 방문하셔서 도저히 시간이 안 되겠습니다.",
      "몸이 갑자기 좋지 않아서 오늘은 일찍 쉬어야 할 것 같습니다.",
    ],
    friend: [
      "야 진짜 미안한데 오늘 몸이 너무 안 좋아ㅠ",
      "엄마가 갑자기 오신다고 해서... 다음에 꼭 보자!",
      "회사에서 야근이 갑자기 생겼어. 진짜 미안해ㅠ",
    ],
    parent: [
      "오늘 갑자기 약속이 생겨서요. 다음에 꼭 갈게요.",
      "일이 생겨서요. 이해해 주세요 엄마아빠.",
      "친구가 힘든 일이 있어서 오늘은 함께 있어줘야 해요.",
    ],
    prof: [
      "갑자기 몸이 좋지 않아 병원을 다녀와야 할 것 같습니다.",
      "가족 중에 응급상황이 생겨서 오늘 참석이 어렵게 됐습니다.",
      "교통 문제로 이동이 어렵습니다. 진심으로 죄송합니다.",
    ],
    partner: [
      "자기야 진짜 미안한데... 오늘 갑자기 엄마가 많이 아프셔.",
      "팀플 마감이 오늘로 당겨졌어ㅠ 다음에 2배로 보상할게.",
      "진짜 너무 몸이 안 좋아... 억지로 가면 너한테 더 미안할 것 같아.",
    ],
  },
  homework: {
    boss: [
      "어제 밤새 작업했는데 파일이 날아갔습니다. 오전 중으로 다시 완성하겠습니다.",
      "검토하다 보니 수정이 필요한 부분이 있어서 완성도 높이려고 시간이 더 필요합니다.",
      "공유받은 자료에 오류가 있어서 확인 중입니다. 조금만 더 주시면 됩니다.",
    ],
    friend: [
      "야 진짜 깜빡했어ㅠ 오늘 밤에 꼭 할게",
      "어제 컴퓨터가 고장났잖아... 수리 맡겼어",
      "다른 급한 게 생겨서... 미안해 오늘 안으로 할게",
    ],
    parent: [
      "몸이 안 좋아서 못 했어요. 내일까지는 꼭 할게요.",
      "오늘 학교에서 갑자기 다른 게 생겨서요.",
      "시험 공부 먼저 하다 보니 시간이 모자랐어요.",
    ],
    prof: [
      "갑자기 몸이 안 좋아서 완성을 못 했습니다. 내일 제출 가능할까요?",
      "자료 수집 중 예상치 못한 문제가 생겨 시간이 더 필요합니다.",
      "팀원 중 한 명이 갑작스러운 사정이 생겨 일정이 밀렸습니다.",
    ],
    partner: [
      "어제 너무 피곤해서 쓰러졌어ㅠ 오늘 할게",
      "야 근데 이거 내일까지인 거 맞지? 오늘인 줄 몰랐어",
      "컴퓨터가 말을 안 들어서... 지금 수리 맡겼어",
    ],
  },
  phone: {
    boss: [
      "회의 중이라 진동도 못 느꼈어요. 바로 드리겠습니다.",
      "핸드폰이 배터리가 나가있었어요. 방금 확인했습니다.",
      "지하에 있었는데 신호가 안 잡혔어요. 죄송합니다.",
    ],
    friend: [
      "야 폰 소리 꺼놨어ㅠ 방금 봤어",
      "자고 있었어... 미안",
      "욕실에 두고 나왔어! 완전 못 봤어",
    ],
    parent: [
      "수업 중이었어요. 방금 끝나서 확인했어요.",
      "지하철 안에 있어서 못 봤어요.",
      "핸드폰 가방에 넣어뒀는데 진동을 못 느꼈어요.",
    ],
    prof: [
      "수업 중이라 무음으로 해놨다가 방금 확인했습니다.",
      "개인 사정으로 잠시 폰을 볼 수 없었습니다. 죄송합니다.",
      "배터리가 방전됐다가 방금 충전 후 확인했습니다.",
    ],
    partner: [
      "진짜 화장실에 폰 두고 나왔어... 미안해",
      "자고 있었어ㅠ 알람도 못 들었어",
      "소리 꺼놓은 걸 깜빡했어! 방금 봤어",
    ],
  },
  late_meet: {
    boss: [
      "지하철 지연으로 예상보다 늦어지고 있습니다. 10분 후 도착 예정입니다.",
      "택시를 타고 오고 있는데 교통이 예상보다 막히네요. 죄송합니다.",
      "나오는 길에 갑자기 배가 좋지 않아서요. 곧 도착하겠습니다.",
    ],
    friend: [
      "야 미안 ㅠ 지금 버스 탔어. 10분만 기다려줘",
      "출발했어! 길이 좀 막히네... 곧 갈게",
      "진짜 미안한데 5분만ㅠ 나왔어",
    ],
    parent: [
      "차가 좀 막혀서요. 거의 다 왔어요.",
      "지하철 갈아타다 잘못 탔어요ㅠ 금방 갈게요.",
      "오다가 편의점 들렀어요. 금방 도착해요.",
    ],
    prof: [
      "이동 중인데 교통 상황이 좋지 않습니다. 최대한 빨리 가겠습니다.",
      "지하철 지연이 있어서 조금 늦을 것 같습니다. 정말 죄송합니다.",
      "바로 출발했는데 생각보다 거리가 멀어서요. 금방 도착합니다.",
    ],
    partner: [
      "자기야 미안 ㅠ 나왔어! 10분만 기다려줘",
      "오다가 길을 잘못 들었어... 거의 다 왔어!",
      "지금 택시 탔어~ 5분 안에 갈게",
    ],
  },
  forgot: {
    boss: [
      "제가 일정이 겹쳐서 잠깐 놓쳤습니다. 지금 바로 처리하겠습니다.",
      "다른 업무에 집중하다 보니 놓쳤네요. 정말 죄송합니다.",
      "메모를 해뒀는데 확인을 못 했어요. 바로 하겠습니다.",
    ],
    friend: [
      "야 진짜 미안... 완전 까먹었어ㅠ",
      "어제 일이 많아서 머릿속에서 지워졌어. 미안",
      "진짜 기억이 없어... 다음에 내가 쏠게 미안해",
    ],
    parent: [
      "깜빡했어요ㅠ 지금 바로 할게요.",
      "다른 일 하다 보니 잊어버렸어요. 죄송해요.",
      "메모 해뒀는데 못 봤어요. 바로 할게요.",
    ],
    prof: [
      "제가 일정 관리를 잘못해서 잊어버렸습니다. 바로 처리하겠습니다.",
      "다른 과목 일정과 겹쳐 혼선이 생겼습니다. 죄송합니다.",
      "메모는 해뒀는데 확인을 못 했습니다. 바로 처리하겠습니다.",
    ],
    partner: [
      "진짜 미안해... 완전 잊어버렸어ㅠ 보상할게",
      "어제 피곤해서 다 날아갔어. 다음엔 꼭 기억할게",
      "야 근데 그게 오늘이었어? 나 며칠인 줄 알았어...",
    ],
  },
}

function getScore() {
  return Math.floor(Math.random() * 26) + 70
}

function getTodayCount() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return 2847 + (seed % 4212)
}

export default function ExcusePage() {
  const [step, setStep] = useState<'sit' | 'target' | 'generating' | 'result'>('sit')
  const [sit, setSit] = useState('')
  const [target, setTarget] = useState('')
  const [excuse, setExcuse] = useState('')
  const [score, setScore] = useState(0)

  function handleTarget(targetId: string) {
    setTarget(targetId)
    setStep('generating')
    const pool = EXCUSES[sit]?.[targetId] || EXCUSES.late.boss
    const picked = pool[Math.floor(Math.random() * pool.length)]
    setTimeout(() => {
      setExcuse(picked)
      setScore(getScore())
      setStep('result')
    }, 1500)
  }

  function reset() {
    setSit('')
    setTarget('')
    setExcuse('')
    setScore(0)
    setStep('sit')
  }

  const count = getTodayCount()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#fff5f5,#ffe4e6)', fontFamily: '"Apple SD Gothic Neo",system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🙈</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#dc2626', margin: 0, letterSpacing: '-0.5px' }}>점운 핑계생성기</h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '6px 0 0', lineHeight: 1.5 }}>AI가 상황별 설득력 있는 핑계를 만들어드려요</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 10 }}>
            <span style={{ background: '#fee2e2', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#dc2626', fontWeight: 700 }}>🆓 무료</span>
            <span style={{ background: '#fee2e2', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#dc2626', fontWeight: 700 }}>🔮 990원·24h</span>
          </div>
        </div>

        {/* Step 1: Situation */}
        {step === 'sit' && (
          <div>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: 14, textAlign: 'center', fontSize: 16 }}>어떤 상황인가요?</p>
            {SITUATIONS.map(s => (
              <button key={s.id}
                onClick={() => { setSit(s.id); setStep('target') }}
                style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #fecaca', borderRadius: 14, padding: '14px 18px', marginBottom: 10, fontSize: 15, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#374151', transition: 'all 0.15s' }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Target */}
        {step === 'target' && (
          <div>
            <button onClick={() => setStep('sit')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 14, marginBottom: 16, padding: 0 }}>← 다시 선택</button>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: 14, textAlign: 'center', fontSize: 16 }}>누구에게 쓸 핑계인가요?</p>
            {TARGETS.map(t => (
              <button key={t.id}
                onClick={() => handleTarget(t.id)}
                style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #fecaca', borderRadius: 14, padding: '14px 18px', marginBottom: 10, fontSize: 15, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 44, marginBottom: 16, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</div>
            <p style={{ color: '#6b7280', fontSize: 15, fontWeight: 600 }}>설득력 있는 핑계 생성 중...</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Result */}
        {step === 'result' && (
          <div>
            <div style={{ background: 'white', borderRadius: 20, padding: 24, marginBottom: 14, boxShadow: '0 4px 24px rgba(220,38,38,0.12)', border: '2px solid #fecaca' }}>
              <div style={{ fontSize: 12, color: '#dc2626', fontWeight: 700, marginBottom: 10, letterSpacing: '0.5px' }}>💬 오늘의 핑계</div>
              <p style={{ fontSize: 16, color: '#111827', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>"{excuse}"</p>
            </div>

            <div style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)', borderRadius: 18, padding: '20px 24px', marginBottom: 14, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>설득력 점수</div>
                <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.1 }}>{score}점</div>
              </div>
              <div style={{ fontSize: 36 }}>{score >= 85 ? '🔥' : score >= 75 ? '✨' : '👍'}</div>
            </div>

            <div style={{ background: '#fff7ed', borderRadius: 14, padding: '12px 16px', marginBottom: 20, textAlign: 'center', fontSize: 13, color: '#92400e', border: '1.5px solid #fed7aa' }}>
              오늘 이 핑계로 살아남은 사람 <strong>{count.toLocaleString()}명</strong> 🎉
            </div>

            <button onClick={reset}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #dc2626', borderRadius: 14, padding: '14px', fontSize: 15, cursor: 'pointer', color: '#dc2626', fontWeight: 700, marginBottom: 10 }}>
              🔄 다른 핑계 만들기
            </button>

            <a href="/main-v2"
              style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', borderRadius: 14, padding: '15px', fontSize: 15, color: 'white', fontWeight: 700, textDecoration: 'none', marginBottom: 10 }}>
              🔮 내 사주로 오늘 진짜 운세 보기 →
            </a>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#d1d5db', marginTop: 8 }}>
              점운 — 사주·꿈해몽·직업·합격·궁합까지
            </div>
          </div>
        )}

        {/* Bottom links */}
        {step !== 'result' && (
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { href: '/main-v2', icon: '☯️', label: '사주 운세', badge: '990원~' },
              { href: '/haemong', icon: '🌙', label: '꿈해몽', badge: '무료' },
              { href: '/mbti', icon: '🧠', label: 'MBTI', badge: '무료' },
              { href: '/gunghap', icon: '💕', label: '궁합', badge: '무료' },
            ].map(a => (
              <a key={a.href} href={a.href} style={{ background: 'white', borderRadius: 12, padding: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid #f3f4f6' }}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{a.badge}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
