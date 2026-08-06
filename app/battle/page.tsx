'use client'
import { useState } from 'react'

const BATTLES = [
  { q: "데이트 빈도는?", a: "매일 보고 싶어", b: "가끔 봐야 더 설레", aT: 1, bT: 0, aS: 1, bS: 1 },
  { q: "연락 스타일은?", a: "내가 먼저 연락", b: "기다리는 게 좋아", aT: 1, bT: 0, aS: 1, bS: 0 },
  { q: "데이트 장소는?", a: "카페·레스토랑", b: "집에서 함께 요리", aT: 0, bT: 1, aS: 1, bS: 0 },
  { q: "고백 타이밍은?", a: "처음 만나자마자", b: "오래 알고 지낸 후", aT: 0, bT: 1, aS: 1, bS: 0 },
  { q: "여행 스타일은?", a: "무조건 같이 떠나", b: "여행은 각자도 OK", aT: 1, bT: 0, aS: 0, bS: 1 },
  { q: "일상 연락은?", a: "아침저녁 안부 문자", b: "믿으니까 연락 없어도", aT: 1, bT: 0, aS: 1, bS: 0 },
  { q: "스킨십 스타일은?", a: "손잡고 팔짱 자주", b: "눈빛으로 통하는 사이", aT: 1, bT: 0, aS: 1, bS: 0 },
  { q: "선물은?", a: "이유 없이 자주", b: "기념일에 특별하게", aT: 1, bT: 0, aS: 1, bS: 0 },
]

type ResultKey = '열정형' | '헌신형' | '자유형' | '독립형'

const RESULTS: Record<ResultKey, { emoji: string; sub: string; desc: string; mind: string; dateIdea: string; message: string; color: string }> = {
  열정형: {
    emoji: '🔥', sub: '함께할수록 더 설레는 사람',
    desc: '당신의 이상형은 같이 보내는 시간을 최대한 늘리면서도 매 순간 설레는 감정을 놓치지 않는 사람이에요. 함께이기 때문에 사랑이 더 빛난다고 믿어요.',
    mind: '"오늘 하루 어땠어? 다 말해줘, 나 다 들을게. 우리 있을 때 제일 행복해."',
    dateIdea: '야경 레스토랑 → 한강 산책 → 편의점 야식',
    message: '"오늘 저녁 시간 있어? 보고 싶은데 잠깐 나올 수 있어?"\n"방금 네 생각 났어. 같이 가보고 싶은 데 있어."\n"오늘 하루 어땠어? 다 말해줘."',
    color: '#e11d48',
  },
  헌신형: {
    emoji: '💎', sub: '깊고 오래, 곁에 있어주는 사람',
    desc: '당신의 이상형은 함께하는 시간을 소중히 하면서도 깊고 안정적인 신뢰를 쌓아가는 사람이에요. 오래된 관계일수록 더 깊어지는 사랑을 원해요.',
    mind: '"바빠도 너 생각은 늘 해. 우리 내일 같이 밥 먹자. 오래오래 곁에 있을게."',
    dateIdea: '집에서 함께 요리 → 소파 영화 → 편의점 빙수',
    message: '"밥은 먹었어? 요즘 힘들다고 했잖아, 연락해."\n"오늘 일찍 퇴근했어. 너 보고 싶어서."\n"별거 없어도 자주 연락해도 돼."',
    color: '#db2777',
  },
  자유형: {
    emoji: '🌸', sub: '각자 충만하게, 만나면 더 설레는 사람',
    desc: '당신의 이상형은 서로의 공간을 존중하면서도 만날 때마다 설레는 감정을 주는 사람이에요. 자유롭기 때문에 더 애틋한 관계예요.',
    mind: '"너도 네 시간이 있어야 해. 근데 보고 싶을 때 연락해. 만나면 무조건 좋아."',
    dateIdea: '각자 카페 추천 교환 → 함께 방문 → 짧고 진한 데이트',
    message: '"보고 싶으면 연락해. 나도 기다릴게."\n"오늘 어떤 하루였어? 궁금해서."\n"주말에 시간 되면 잠깐 볼까?"',
    color: '#be185d',
  },
  독립형: {
    emoji: '🌙', sub: '믿음 하나로 연결된, 성숙한 사랑',
    desc: '당신의 이상형은 각자의 삶을 중요시하면서도 깊은 신뢰로 연결된 사람이에요. 말하지 않아도 알고, 존재만으로 든든한 관계를 원해요.',
    mind: '"연락 안 해도 믿어. 그냥 네가 있다는 게 든든해. 내 삶에 있어줘서 고마워."',
    dateIdea: '각자 취미 즐기기 → 저녁 통화 → 주말 조용한 카페',
    message: '"잘 지내고 있지? 그냥 생각나서."\n"바빠도 괜찮아. 있다는 거 알고 있어."\n"주말에 조용히 커피 한 잔 할까?"',
    color: '#9d174d',
  },
}

function getResult(T: number, S: number): ResultKey {
  if (T >= 5 && S >= 5) return '열정형'
  if (T >= 5) return '헌신형'
  if (S >= 5) return '자유형'
  return '독립형'
}

function getTodayCount() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  const lcg = Math.abs((seed * 1664525 + 1013904223) & 0x7fffffff)
  const base = 4100 + (lcg % 500)
  const block = Math.floor(d.getHours() / 8)
  return (base + (block >= 1 ? 400 + (lcg % 200) : 0) + (block >= 2 ? 500 + ((lcg >> 4) % 300) : 0)).toLocaleString()
}

export default function BattlePage() {
  const [step, setStep] = useState<'intro' | 'battle' | 'contact' | 'result'>('intro')
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState({ T: 0, S: 0 })
  const [resultKey, setResultKey] = useState<ResultKey>('열정형')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const count = getTodayCount()

  function pick(a: boolean) {
    const b = BATTLES[round]
    const newT = scores.T + (a ? b.aT : b.bT)
    const newS = scores.S + (a ? b.aS : b.bS)
    const newScores = { T: newT, S: newS }
    setScores(newScores)
    if (round + 1 >= BATTLES.length) {
      setResultKey(getResult(newT, newS))
      setStep('contact')
    } else {
      setRound(round + 1)
    }
  }

  async function submit() {
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setError('전화번호를 정확히 입력해주세요.')
      return
    }
    if (!agreed) {
      setError('개인정보 수집·이용에 동의해주세요.')
      return
    }
    setSaving(true)
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: 'battle', name, phone, email, result: resultKey, marketing }),
      })
    } catch {}
    setSaving(false)
    setStep('result')
  }

  const result = RESULTS[resultKey]
  const progress = (round / BATTLES.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#fff1f2,#ffe4e6,#fce7f3)', fontFamily: '"Apple SD Gothic Neo",system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>❤️</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#e11d48', margin: 0 }}>점운 이상형월드컵</h1>
          <p style={{ color: '#9f1239', fontSize: 14, margin: '6px 0 0' }}>8라운드 배틀로 나의 이상형 유형을 찾아드려요</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 10 }}>
            <span style={{ background: '#ffe4e6', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#e11d48', fontWeight: 700 }}>🆓 무료</span>
          </div>
        </div>

        {/* Intro */}
        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(225,29,72,0.1)' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>💘</div>
              <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                두 가지 중 더 끌리는 걸 고르면<br />나의 이상형 유형이 나와요
              </p>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>오늘 <strong>{count}명</strong>이 이상형을 찾았어요</p>
            </div>
            <button onClick={() => setStep('battle')}
              style={{ width: '100%', background: 'linear-gradient(135deg,#e11d48,#f43f5e)', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, cursor: 'pointer', color: 'white', fontWeight: 800 }}>
              ❤️ 배틀 시작하기
            </button>
          </div>
        )}

        {/* Battle */}
        {step === 'battle' && (
          <div>
            <div style={{ background: '#ffe4e6', borderRadius: 99, height: 8, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg,#e11d48,#f43f5e)', height: '100%', width: `${progress}%`, borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: 12, color: '#e11d48', textAlign: 'right', marginBottom: 20 }}>{round + 1}/8</div>

            <div style={{ background: 'white', borderRadius: 20, padding: '24px', marginBottom: 16, boxShadow: '0 4px 20px rgba(225,29,72,0.1)', textAlign: 'center' }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>{BATTLES[round].q}</p>
            </div>

            <button onClick={() => pick(true)}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #fecdd3', borderRadius: 14, padding: '18px', marginBottom: 12, fontSize: 15, cursor: 'pointer', fontWeight: 700, color: '#374151' }}>
              {BATTLES[round].a}
            </button>
            <button onClick={() => pick(false)}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #fecdd3', borderRadius: 14, padding: '18px', fontSize: 15, cursor: 'pointer', fontWeight: 700, color: '#374151' }}>
              {BATTLES[round].b}
            </button>
          </div>
        )}

        {/* Contact */}
        {step === 'contact' && (
          <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(225,29,72,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>{RESULTS[resultKey].emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#e11d48', marginTop: 8 }}>{resultKey} 이상형!</div>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>결과를 저장하고 무료로 확인해요</p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이름 또는 별명 (선택)</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="이름 입력"
                style={{ width: '100%', border: '1.5px solid #fecdd3', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#e11d48', fontWeight: 700, display: 'block', marginBottom: 6 }}>전화번호 ★ 필수</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" type="tel"
                style={{ width: '100%', border: '1.5px solid #fecdd3', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이메일 (선택)</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" type="email"
                style={{ width: '100%', border: '1.5px solid #fecdd3', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>[필수] 개인정보 수집·이용 동의 — 서비스 제공 목적으로 전화번호를 수집합니다</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
              <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>[선택] 마케팅 정보 수신 동의</span>
            </div>
            {error && <p style={{ color: '#e11d48', fontSize: 13, marginBottom: 10 }}>{error}</p>}
            <button onClick={submit} disabled={saving}
              style={{ width: '100%', background: 'linear-gradient(135deg,#e11d48,#f43f5e)', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, color: 'white', fontWeight: 800, cursor: 'pointer' }}>
              {saving ? '저장 중...' : '❤️ 결과 보기'}
            </button>
          </div>
        )}

        {/* Result */}
        {step === 'result' && (
          <div>
            <div style={{ background: `linear-gradient(135deg,${result.color},#f43f5e)`, borderRadius: 24, padding: '32px 24px', marginBottom: 14, color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>{result.emoji}</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>나의 이상형 유형</div>
              <div style={{ fontSize: 30, fontWeight: 900 }}>{resultKey}</div>
              <div style={{ fontSize: 15, opacity: 0.9, marginTop: 6 }}>{result.sub}</div>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(225,29,72,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e11d48', marginBottom: 8 }}>💝 이런 사람이 이상형이에요</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{result.desc}</p>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(225,29,72,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e11d48', marginBottom: 8 }}>💬 이상형이 보낼 메시지</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{result.mind}</p>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(225,29,72,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e11d48', marginBottom: 8 }}>📍 추천 데이트 코스</div>
              <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{result.dateIdea}</p>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(225,29,72,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e11d48', marginBottom: 8 }}>💌 이상형이 자주 쓸 말</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{result.message}</p>
            </div>

            <div style={{ background: '#fff1f2', borderRadius: 14, padding: '12px 16px', marginBottom: 16, textAlign: 'center', fontSize: 13, color: '#9f1239', border: '1.5px solid #fecdd3' }}>
              오늘 이상형 찾은 사람 <strong>{count}명</strong> 💘
            </div>

            <button onClick={() => { setStep('intro'); setRound(0); setScores({ T: 0, S: 0 }); setName(''); setPhone(''); setEmail(''); }}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #e11d48', borderRadius: 14, padding: '14px', fontSize: 15, cursor: 'pointer', color: '#e11d48', fontWeight: 700, marginBottom: 10 }}>
              🔄 다시 테스트하기
            </button>

            <div style={{ background: '#fff1f2', borderRadius: 18, padding: '20px', marginBottom: 10, border: '1.5px dashed #fecdd3', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔮</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e11d48', marginBottom: 6 }}>사주로 보는 연애운 · 배우자운</div>
              <div style={{ fontSize: 12, color: '#9f1239', marginBottom: 14 }}>오행으로 보는 진짜 이상형 + 올해 연애운</div>
              <a href="/main-v2" style={{ display: 'block', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                🔮 사주 연애운 보기 → 990원·24h
              </a>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#fca5a5', marginTop: 8 }}>
              점운 — 사주·꿈해몽·직업·합격·궁합까지
            </div>
          </div>
        )}

        {step === 'intro' && (
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { href: '/gunghap', icon: '💑', label: '궁합', badge: '무료/990원' },
              { href: '/mbti', icon: '🧠', label: 'MBTI', badge: '무료' },
              { href: '/main-v2', icon: '☯️', label: '사주 운세', badge: '990원~' },
              { href: '/lotto', icon: '🍀', label: '행운번호', badge: '무료' },
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
