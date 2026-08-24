'use client'
import { useState } from 'react'

const BOSS_TYPES = [
  { key: 'fire', emoji: '🔥', label: '불같은 상사', desc: '화를 잘 내고 눈치를 자주 봐야 해요', penalty: -15 },
  { key: 'cold', emoji: '🗿', label: '묵묵부답 상사', desc: '뭘 생각하는지 알 수 없어요', penalty: -5 },
  { key: 'micro', emoji: '🔍', label: '현미경 상사', desc: '모든 걸 체크하고 지적해요', penalty: -10 },
  { key: 'fake', emoji: '😊', label: '친한 척 상사', desc: '겉으론 좋은데 뒤에서 뭔가 달라요', penalty: -8 },
  { key: 'ghost', emoji: '👻', label: '투명인간 상사', desc: '없는 것 같아서 오히려 편해요', penalty: 0 },
]

const QUIZ_LIST = [
  { q: '오늘 상사한테 혼났나요?', yes: -15, no: 10 },
  { q: '점심은 제대로 먹었나요?', yes: 5, no: -5 },
  { q: '퇴근 후 업무 연락이 왔나요?', yes: -10, no: 5 },
  { q: '오늘 칼퇴(정시 퇴근)했나요?', yes: 10, no: -8 },
  { q: '오늘 화나는 일이 있었나요?', yes: -10, no: 8 },
  { q: '내일도 출근할 수 있을 것 같나요?', yes: 8, no: -5 },
]

const BOSS_MIND: Record<string, string> = {
  fire: '"나도 사실 사람이야. 다 잘 되길 바라는 거라고..."',
  cold: '"말 안 해도 다 알아. 근데 말하기가 어려워."',
  micro: '"완벽하게 하고 싶어서 그래. 나를 위해서가 아니라 팀을 위해서야."',
  fake: '"나도 살아남으려고 이러는 거야. 이해해줘."',
  ghost: '"내가 없는 게 최고의 복지 아닌가? 하하."',
}

const BOSS_VENT: Record<string, string[]> = {
  fire: [
    '기상청도 못 맞추는 기분을 어떻게 맞추란 말인지요... 롤러코스터도 아닌데.',
    '아침엔 완벽하더니 점심엔 다시 처음부터. 오늘도 탑승 완료입니다.',
    '이분 기분 앱을 만들면 실시간 알림 필수일 것 같아요.',
    '화산처럼 예고 없이 터지셔서 이제는 사무실 기압부터 체크하는 습관이 생겼어요.',
    '화내고 나서 미안하다는 말 대신 커피 한 잔 주시는 스타일, 그래도 저는 사과가 더 듣고 싶습니다.',
    '오늘도 무사히 하루가 지나갔다는 것 자체가 이미 승리 아닐까요.',
  ],
  cold: [
    '돌멩이도 간혹 웃는다는데... 표정이 이렇게 무표정하면 심리전 아닌가요?',
    '칭찬도 질책도 없음. 이게 더 무섭다는 걸 알고 계신 건지.',
    '반응 없음 = 잘한 것? 아님 최악? 알 수가 없습니다.',
    '안부를 물어도 대답은 한 단어. 대화의 밀도가 너무 낮습니다.',
    '회식 자리에서도 표정 변화 없음. 프로 무표정러이십니다.',
    '그래도 뒤에서 험담은 안 하시는 분이라는 것만으로도 다행이라 여기기로 했습니다.',
  ],
  micro: [
    '모든 이메일에 빨간 펜 15가지. 내일은 원고지에 써가면 만족하실까요?',
    '띄어쓰기 하나에 10분 회의. 오늘도 생산적인 하루였습니다.',
    '마이크로매니지먼트의 교과서 같은 분을 곁에서 배우고 있습니다. (눈물)',
    '보고서 여백까지 체크하시는 걸 보면 이 회사 UI 디자이너로 스카웃해야 할 것 같습니다.',
    '제 폰트 크기까지 지적받은 날, 그날은 정말 웃펐습니다.',
    '디테일은 확실히 배우고 있습니다. 다만 마음의 여유는 조금씩 잃어가고 있어요.',
  ],
  fake: [
    '커피 한잔 하며 근황 물어봤는데 다음날 팀장님이 알고 있다면... 이건 뭔가요?',
    '친한 척하는 분위기에 속아서 솔직하게 말했다가 큰일 날 뻔했어요.',
    '"우리 사이에"로 시작하는 말은 절대 믿지 않기로 했습니다.',
    '칭찬인 줄 알았던 말이 알고 보니 돌려까기였다는 걸 3일 뒤에 깨달았습니다.',
    '"편하게 말해"라고 해서 편하게 말했다가 다음날 회의 주제가 됐습니다.',
    '친절함의 유통기한이 딱 회식 자리까지인 것 같습니다.',
  ],
  ghost: [
    '일주일째 제 얼굴을 못 봤는데도 피드백은 오고 있어요. 투명인간이지만 전지전능.',
    '존재감은 없지만 결재는 하심. 미스터리 그 자체.',
    '계신 건지 안 계신 건지 모르는 분위기 덕분에 눈치 게임 레벨업 중입니다.',
    '슬랙 메시지는 새벽 3시에 오는데 낮엔 그림자도 안 보이십니다.',
    '결재는 하루 만에 나는데 인사는 한 달째 안 하고 계십니다.',
    '이 정도면 재택근무가 아니라 잠적근무 아닐까요.',
  ],
}

const RECOVERY_TIPS: Record<string, string[]> = {
  fire: ['집 도착하자마자 편한 옷으로 갈아입기', '유튜브 고양이 영상 10분 보기', '따뜻한 차 한 잔 마시며 오늘 있었던 일 잠깐 떠올려보기', '"나는 오늘 잘 버텼다" 소리 내어 말해보기', '내일 아침엔 오늘 일은 다 잊고 새로 시작하기'],
  cold: ['이어폰 꽂고 좋아하는 음악 크게 틀기', '편의점 디저트 하나 나에게 선물하기', '오늘 하루 일기 한 줄 쓰기: "살아남았다"', '친한 사람과 짧게라도 대화 나누기', '잠들기 전 오늘의 감정을 스스로 인정해주기'],
  micro: ['따뜻한 물로 10분 이상 샤워하기', '핸드폰 업무 알림 잠시 꺼두기', '오늘 잘한 일 딱 한 가지만 떠올려보기', '내일의 나에게 "오늘도 수고했어" 말해주기', '완벽하지 않아도 괜찮다고 스스로에게 말해주기'],
  fake: ['진짜 믿을 수 있는 친구에게 전화 한 통 걸기', '게임이나 드라마로 완전한 현실 도피 30분 즐기기', '오늘 있었던 일을 있는 그대로 털어놓기', '나에게 진심인 사람들의 얼굴 떠올려보기', '회사 인간관계와 내 자존감은 별개라는 걸 기억하기'],
  ghost: ['배달음식 시키기 (오늘은 내가 주인공)', '좋아하는 드라마나 예능 한 편 보기', '내일 뭐 먹을지 행복한 고민하기', '오늘 하루 스스로 판단하고 처리한 일들 칭찬해주기', '눈치 보지 않아도 되는 나만의 공간에서 푹 쉬기'],
}

const SMART_RESPONSE: Record<string, string> = {
  fire: '"팀장님, 중요한 내용 같은데 메모하면서 들을게요. 잠시만요."\n감정이 격할 때는 이렇게 한 박자 늦추는 말을 건네면 상황이 누그러지는 경우가 많아요. 화내는 이유를 캐묻기보다 내용부터 정리하겠다는 태도가 훨씬 효과적이에요.',
  cold: '"제가 진행한 부분 어떠셨는지 짧게라도 말씀 주시면 다음에 더 잘 반영하겠습니다."\n무반응인 상사에게는 구체적인 질문으로 반응을 유도하는 게 좋아요. 예/아니오로 답할 수 있는 질문일수록 대답을 받아내기 쉬워요.',
  micro: '"혹시 원하시는 방향이 있으면 미리 말씀해주시면 처음부터 그렇게 진행하겠습니다."\n사후 지적보다 사전 확인을 요청하면 잔소리 횟수 자체를 줄일 수 있어요. 상사의 기준을 먼저 파악하는 게 핵심이에요.',
  fake: '"말씀 감사해요! 근데 이 부분은 아직 확정된 게 아니라서, 나중에 다시 말씀드릴게요."\n선을 넘는 친절엔 적당히 예의 있게 거리를 두는 답변이 안전해요. 사적인 이야기는 최소한으로만 공유하는 게 좋아요.',
  ghost: '"제가 이렇게 진행했는데, 방향 맞는지 한 번만 확인 부탁드립니다."\n존재감이 없는 상사에게는 먼저 다가가 확인을 요청하는 게 오히려 마음 편해요. 스스로 판단해서 진행하되, 중요한 갈림길만큼은 꼭 짚고 넘어가세요.',
}

function calcScore(bossKey: string, quizAns: boolean[]): number {
  const boss = BOSS_TYPES.find(b => b.key === bossKey)!
  let s = 60 + boss.penalty
  QUIZ_LIST.forEach((q, i) => { s += quizAns[i] ? q.yes : q.no })
  return Math.max(0, Math.min(100, s))
}

function getScoreLabel(s: number): string {
  if (s >= 85) return '🏆 오늘의 MVP'
  if (s >= 70) return '💪 잘 버텼어요'
  if (s >= 55) return '😅 간신히 생존'
  if (s >= 40) return '🤕 꽤 힘든 하루'
  return '🆘 오늘 최악'
}

function getScoreColor(s: number): string {
  if (s >= 85) return '#059669'
  if (s >= 70) return '#2563eb'
  if (s >= 55) return '#d97706'
  if (s >= 40) return '#dc2626'
  return '#7c3aed'
}

function getComfort(s: number): string {
  if (s >= 85) return '오늘 당신은 진짜 프로입니다 🏆 힘든 상황 속에서도 웃음을 잃지 않고 끝까지 해냈어요. 내일도 오늘 이 에너지 그대로 가져가면 됩니다. 당신은 이미 충분히 잘하고 있어요.'
  if (s >= 70) return '오늘도 잘 버텼어요. 그게 이미 대단한 거예요 ✨ 매일 이렇게 하루하루를 견뎌내는 것만으로도 박수받을 자격이 충분합니다. 오늘 하루도 정말 수고 많으셨어요.'
  if (s >= 55) return '아슬아슬했지만 결국 살아남았어요. 퇴근 후엔 온전히 당신만의 시간이에요 🌙 오늘 있었던 힘든 일들은 여기 두고 가세요. 내일은 조금 더 나은 하루가 될 거예요.'
  if (s >= 40) return '오늘 정말 힘들었죠. 그래도 끝까지 자리를 지켰잖아요 💙 힘든 날엔 힘든 티를 내도 괜찮아요. 혼자 참지 말고 오늘만큼은 나를 위한 시간을 꼭 가지세요.'
  return '오늘은 진짜 레전드급 하루였네요. 퇴사 생각 잠깐 했어도 전혀 이상한 게 아니에요 🫂 이런 날도 있고 저런 날도 있는 거예요. 오늘 하루 버텨낸 당신, 정말 대단합니다.'
}

function getTodayCount() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  const lcg = Math.abs((seed * 1664525 + 1013904223) & 0x7fffffff)
  const base = 5200 + (lcg % 600)
  const block = Math.floor(d.getHours() / 8)
  return (base + (block >= 1 ? 480 + (lcg % 220) : 0) + (block >= 2 ? 550 + ((lcg >> 4) % 300) : 0)).toLocaleString()
}

export default function WorkPage() {
  const [step, setStep] = useState<'intro' | 'boss' | 'quiz' | 'contact' | 'result'>('intro')
  const [bossKey, setBossKey] = useState('')
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizAns, setQuizAns] = useState<boolean[]>([])
  const [score, setScore] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [hpField, setHpField] = useState('')
  const count = getTodayCount()

  function selectBoss(key: string) {
    setBossKey(key)
    setStep('quiz')
  }

  function answerQuiz(yes: boolean) {
    const newAns = [...quizAns, yes]
    setQuizAns(newAns)
    if (quizIdx + 1 >= QUIZ_LIST.length) {
      setScore(calcScore(bossKey, newAns))
      setStep('contact')
    } else {
      setQuizIdx(quizIdx + 1)
    }
  }

  async function submit() {
    if (hpField) return
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setError('전화번호를 정확히 입력해주세요.')
      return
    }
    if (!agreed) {
      setError('개인정보 수집·이용에 동의해주세요.')
      return
    }
    setSaving(true)
    const boss = BOSS_TYPES.find(b => b.key === bossKey)
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: 'work', name, phone, email, result: `${boss?.label} / ${score}점`, marketing }),
      })
    } catch {}
    setSaving(false)
    setStep('result')
  }

  const boss = BOSS_TYPES.find(b => b.key === bossKey)
  const scoreLabel = getScoreLabel(score)
  const scoreColor = getScoreColor(score)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#eff6ff,#dbeafe,#bfdbfe)', fontFamily: '"Apple SD Gothic Neo",system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>💼</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1e40af', margin: 0 }}>점운 직장버티기</h1>
          <p style={{ color: '#1e3a8a', fontSize: 14, margin: '6px 0 0' }}>오늘 직장 생존 점수를 계산해드려요</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 10 }}>
            <span style={{ background: '#dbeafe', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#2563eb', fontWeight: 700 }}>🆓 무료</span>
          </div>
        </div>

        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(37,99,235,0.1)' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🏢</div>
              <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                상사 유형 선택 + 6가지 질문으로<br />오늘의 직장 생존 점수가 나와요
              </p>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 10 }}>오늘 <strong>{count}명</strong>이 생존 점수를 확인했어요</p>
            </div>
            <button onClick={() => setStep('boss')}
              style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, cursor: 'pointer', color: 'white', fontWeight: 800 }}>
              💪 오늘 생존 점수 확인하기
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 12, lineHeight: 1.6 }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>

            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { href: '/movie', icon: '🎬', label: '인생이영화라면', badge: '무료' },
                { href: '/battle', icon: '❤️', label: '이상형월드컵', badge: '무료' },
                { href: '/jigun', icon: '💼', label: '직운', badge: '무료/990원' },
                { href: '/main-v2', icon: '☯️', label: '사주 운세', badge: '990원~' },
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
          </div>
        )}

        {step === 'boss' && (
          <div>
            <div style={{ background: 'white', borderRadius: 20, padding: '20px', marginBottom: 16, textAlign: 'center', boxShadow: '0 4px 20px rgba(37,99,235,0.1)' }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>오늘 나의 상사 유형은?</p>
            </div>
            {BOSS_TYPES.map(b => (
              <button key={b.key} onClick={() => selectBoss(b.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: 'white', border: '2px solid #bfdbfe', borderRadius: 14, padding: '16px 18px', marginBottom: 10, cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 28 }}>{b.emoji}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1e40af' }}>{b.label}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{b.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'quiz' && (
          <div>
            <div style={{ background: '#bfdbfe', borderRadius: 99, height: 8, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg,#2563eb,#3b82f6)', height: '100%', width: `${(quizIdx / QUIZ_LIST.length) * 100}%`, borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: 12, color: '#2563eb', textAlign: 'right', marginBottom: 20 }}>{quizIdx + 1}/{QUIZ_LIST.length}</div>

            <div style={{ background: 'white', borderRadius: 20, padding: '28px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(37,99,235,0.1)', textAlign: 'center' }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>{QUIZ_LIST[quizIdx].q}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button onClick={() => answerQuiz(true)}
                style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6)', border: 'none', borderRadius: 14, padding: '20px', fontSize: 20, cursor: 'pointer', color: 'white', fontWeight: 800 }}>
                ✓ 네
              </button>
              <button onClick={() => answerQuiz(false)}
                style={{ background: 'white', border: '2px solid #bfdbfe', borderRadius: 14, padding: '20px', fontSize: 20, cursor: 'pointer', fontWeight: 800, color: '#6b7280' }}>
                ✗ 아니요
              </button>
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(37,99,235,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>{boss?.emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: scoreColor, marginTop: 8 }}>{scoreLabel}</div>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>결과를 저장하고 생존 분석을 받아보세요</p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이름 또는 별명 (선택)</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="이름 입력"
                style={{ width: '100%', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#2563eb', fontWeight: 700, display: 'block', marginBottom: 6 }}>전화번호 ★ 필수</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" type="tel"
                style={{ width: '100%', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              <input type="text" name="website" value={hpField} onChange={e => setHpField(e.target.value)}
                autoComplete="off" tabIndex={-1} aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이메일 (선택)</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" type="email"
                style={{ width: '100%', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>[필수] 개인정보 수집·이용 동의 — 서비스 제공 목적으로 전화번호·이메일을 수집하며, 3년간 보유 후 파기합니다</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
              <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>[선택] 마케팅 정보 수신 동의</span>
            </div>
            {error && <p style={{ color: '#2563eb', fontSize: 13, marginBottom: 10 }}>{error}</p>}
            <button onClick={submit} disabled={saving}
              style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, color: 'white', fontWeight: 800, cursor: 'pointer' }}>
              {saving ? '저장 중...' : '💪 생존 결과 보기'}
            </button>
          </div>
        )}

        {step === 'result' && boss && (
          <div>
            {/* Score card */}
            <div style={{ background: `linear-gradient(135deg,${scoreColor},#2563eb)`, borderRadius: 24, padding: '32px 24px', marginBottom: 14, color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 16, opacity: 0.85, marginBottom: 8 }}>오늘의 직장 생존 점수</div>
              <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>/ 100점</div>
              <div style={{ fontSize: 20, fontWeight: 800, background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '8px 20px', display: 'inline-block' }}>{scoreLabel}</div>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>{boss.emoji} 오늘 상사: {boss.label}</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{getComfort(score)}</p>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>🧠 상사의 속마음</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{BOSS_MIND[bossKey]}</p>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', marginBottom: 10 }}>😤 공감 가는 순간 TOP 3</div>
              {BOSS_VENT[bossKey].map((v, i) => (
                <div key={i} style={{ fontSize: 13, color: '#374151', padding: '8px 0', borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
                  {i + 1}. {v}
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', marginBottom: 10 }}>💊 오늘의 회복 루틴</div>
              {RECOVERY_TIPS[bossKey].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0' }}>
                  <span style={{ fontSize: 13, color: '#2563eb', fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                  <span style={{ fontSize: 13, color: '#374151' }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(37,99,235,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>💬 이럴 땐 이렇게 말해보세요</div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>{SMART_RESPONSE[bossKey]}</p>
            </div>

            <div style={{ background: '#eff6ff', borderRadius: 14, padding: '12px 16px', marginBottom: 16, textAlign: 'center', fontSize: 13, color: '#1e40af', border: '1.5px solid #bfdbfe' }}>
              오늘 생존 점수 확인한 직장인 <strong>{count}명</strong> 💼
            </div>

            <button onClick={() => { setStep('intro'); setQuizIdx(0); setQuizAns([]); setBossKey(''); setName(''); setPhone(''); setEmail(''); }}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #2563eb', borderRadius: 14, padding: '14px', fontSize: 15, cursor: 'pointer', color: '#2563eb', fontWeight: 700, marginBottom: 10 }}>
              🔄 내일 또 확인하기
            </button>

            <div style={{ background: '#eff6ff', borderRadius: 18, padding: '20px', marginBottom: 10, border: '1.5px dashed #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔮</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e40af', marginBottom: 6 }}>사주로 보는 직업운 · 성공운</div>
              <div style={{ fontSize: 12, color: '#1e3a8a', marginBottom: 14 }}>오행으로 보는 나에게 맞는 직업 + 올해 직장운</div>
              <a href="/main-v2" style={{ display: 'block', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                🔮 사주 직업운 보기 →
              </a>
            </div>

            <div style={{ background: '#eff6ff', borderRadius: 18, padding: '20px', border: '1.5px dashed #bfdbfe', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e40af', marginBottom: 6 }}>💼 부업·직업 추천도 받아보세요</div>
              <div style={{ fontSize: 12, color: '#1e3a8a', marginBottom: 12 }}>8문항으로 나에게 맞는 부업 TOP3 찾기</div>
              <a href="/jigun" style={{ display: 'block', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                💼 직운 부업 추천 보기 → 무료
              </a>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#93c5fd', marginTop: 12 }}>
              점운 — 사주·꿈해몽·직업·합격·궁합까지
            </div>
          </div>
        )}
      <footer style={{ padding: "32px 20px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 380, margin: "0 auto", padding: "20px 18px", borderRadius: 20, background: "#0a0020", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, margin: "0 0 10px" }}>© 2026 점운 · Powered by 점운</p>
          <div style={{ color: "#94a3b8", fontSize: 10.5, lineHeight: 1.9, marginBottom: 14 }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
            <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
            <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다.<br />카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 12 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "7px 18px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 900, fontSize: 12 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "7px 18px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, color: "#e2e8f0", textDecoration: "none", fontWeight: 700, fontSize: 12 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 11, display: "flex", justifyContent: "center", gap: 12 }}>
            <a href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>이용약관</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>개인정보처리방침</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href="/refund" style={{ color: "#94a3b8", textDecoration: "none" }}>환불정책</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
