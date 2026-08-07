'use client'
import { useState } from 'react'

const SITUATIONS = [
  { text: '아침에 일어났을 때 기분이 좋았다', pos: 3, neg: -2 },
  { text: '오늘 누군가가 친절하게 대해줬다', pos: 4, neg: -1 },
  { text: '맛있는 걸 먹었다', pos: 3, neg: -1 },
  { text: '하고 싶은 걸 했다 (취미·산책·쇼핑 등)', pos: 3, neg: 0 },
  { text: '예상치 못한 좋은 일이 생겼다', pos: 5, neg: -1 },
  { text: '오늘 일이나 공부가 잘 풀렸다', pos: 4, neg: -3 },
  { text: '힘든 상황에서 잘 버텼다', pos: 2, neg: 1 },
  { text: '중요한 약속이나 계획이 있었다', pos: 2, neg: -1 },
  { text: '쉬고 싶었는데 억지로 뭔가를 해야 했다', pos: -2, neg: 3 },
  { text: '누군가에게 상처받거나 지쳤다', pos: -3, neg: 5 },
]

type GenreKey = '로코' | '힐링' | '직장코미디' | '역경'

const GENRES: Record<GenreKey, { emoji: string; title: string; tagline: string; comfort: string; color: string; ost: string }> = {
  로코: {
    emoji: '🌟', title: '오늘도 예쁘게 살았습니다', tagline: '로맨틱 코미디',
    comfort: '오늘 하루가 이렇게 좋았다면, 당신 주변에 분명 좋은 에너지가 있는 거예요. 그 흐름 그대로 내일도 이어가요.',
    color: '#d97706',
    ost: 'IU - 좋은 날\nAKMU - 사랑이 참\nNewJeans - Hype Boy',
  },
  힐링: {
    emoji: '🌿', title: '평범한 하루의 기적', tagline: '힐링 드라마',
    comfort: '평범한 것 같지만 사실 많이 잘 하고 있어요. 오늘 같은 날이 쌓여서 나중에 좋은 기억이 돼요.',
    color: '#059669',
    ost: '아이유 - 밤편지\n10cm - 아메리카노\n자이언티 - 양화대교',
  },
  직장코미디: {
    emoji: '😅', title: '살아남은 자의 슬픔', tagline: '직장 코미디',
    comfort: '오늘 하루도 이 정도면 충분히 잘 버텼어요. 다 웃지 않아도 돼요. 퇴근했다는 사실만으로 충분해요.',
    color: '#2563eb',
    ost: '백예린 - Square\n잔나비 - 주저하는 연인들을 위해\n10cm - 서커스',
  },
  역경: {
    emoji: '💪', title: '다 되는 척이라도 했잖아', tagline: '역경 극복 드라마',
    comfort: '힘든 하루를 끝까지 버텼다는 것만으로도 대단해요. 내일은 조금 더 나아질 거예요. 오늘 수고했어요.',
    color: '#dc2626',
    ost: '폴킴 - 모든 날 모든 순간\n빅뱅 - 우리 사랑하지 말아요\n에픽하이 - 우산',
  },
}

function getGenre(score: number): GenreKey {
  if (score >= 15) return '로코'
  if (score >= 3) return '힐링'
  if (score >= -8) return '직장코미디'
  return '역경'
}

function getTodayCount() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  const lcg = Math.abs((seed * 1664525 + 1013904223) & 0x7fffffff)
  const base = 3800 + (lcg % 600)
  const block = Math.floor(d.getHours() / 8)
  return (base + (block >= 1 ? 350 + (lcg % 150) : 0) + (block >= 2 ? 420 + ((lcg >> 4) % 250) : 0)).toLocaleString()
}

export default function MoviePage() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'contact' | 'result'>('intro')
  const [selected, setSelected] = useState<boolean[]>(new Array(SITUATIONS.length).fill(null))
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [genreKey, setGenreKey] = useState<GenreKey>('힐링')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const count = getTodayCount()

  function answer(yes: boolean) {
    const s = SITUATIONS[currentQ]
    const add = yes ? s.pos : s.neg
    const newScore = score + add
    const newSel = [...selected]; newSel[currentQ] = yes; setSelected(newSel)
    if (currentQ + 1 >= SITUATIONS.length) {
      setScore(newScore)
      setGenreKey(getGenre(newScore))
      setStep('contact')
    } else {
      setScore(newScore)
      setCurrentQ(currentQ + 1)
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
        body: JSON.stringify({ app: 'movie', name, phone, email, result: genreKey, marketing }),
      })
    } catch {}
    setSaving(false)
    setStep('result')
  }

  const genre = GENRES[genreKey]
  const progress = (currentQ / SITUATIONS.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#fffbeb,#fef3c7,#fde68a)', fontFamily: '"Apple SD Gothic Neo",system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🎬</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#b45309', margin: 0 }}>점운 인생이영화라면</h1>
          <p style={{ color: '#92400e', fontSize: 14, margin: '6px 0 0' }}>오늘 내 하루는 어떤 장르 영화일까요?</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 10 }}>
            <span style={{ background: '#fef3c7', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#b45309', fontWeight: 700 }}>🆓 무료</span>
          </div>
        </div>

        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(180,83,9,0.1)' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎥</div>
              <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                오늘 있었던 일에 Yes / No로 답하면<br />내 하루 영화 장르가 나와요
              </p>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {(['🌟 로코', '🌿 힐링', '😅 직장코미디', '💪 역경'] as const).map(g => (
                  <span key={g} style={{ background: '#fffbeb', borderRadius: 99, padding: '4px 10px', fontSize: 12, color: '#92400e' }}>{g}</span>
                ))}
              </div>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 10 }}>오늘 <strong>{count}명</strong>이 자신의 하루 장르를 찾았어요</p>
            </div>
            <button onClick={() => setStep('quiz')}
              style={{ width: '100%', background: 'linear-gradient(135deg,#d97706,#f59e0b)', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, cursor: 'pointer', color: 'white', fontWeight: 800 }}>
              🎬 오늘 내 장르 찾기
            </button>

            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { href: '/battle', icon: '❤️', label: '이상형월드컵', badge: '무료' },
                { href: '/work', icon: '💪', label: '직장버티기', badge: '무료' },
                { href: '/main-v2', icon: '☯️', label: '사주 운세', badge: '990원~' },
                { href: '/mbti', icon: '🧠', label: 'MBTI', badge: '무료' },
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

        {step === 'quiz' && (
          <div>
            <div style={{ background: '#fde68a', borderRadius: 99, height: 8, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg,#d97706,#f59e0b)', height: '100%', width: `${progress}%`, borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: 12, color: '#b45309', textAlign: 'right', marginBottom: 20 }}>{currentQ + 1}/10</div>

            <div style={{ background: 'white', borderRadius: 20, padding: '28px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(180,83,9,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#b45309', marginBottom: 10 }}>오늘 이런 일이 있었나요?</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.5 }}>{SITUATIONS[currentQ].text}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button onClick={() => answer(true)}
                style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', border: 'none', borderRadius: 14, padding: '20px', fontSize: 22, cursor: 'pointer', color: 'white', fontWeight: 800 }}>
                ✓ 네
              </button>
              <button onClick={() => answer(false)}
                style={{ background: 'white', border: '2px solid #fde68a', borderRadius: 14, padding: '20px', fontSize: 22, cursor: 'pointer', fontWeight: 800, color: '#6b7280' }}>
                ✗ 아니요
              </button>
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(180,83,9,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>{GENRES[genreKey].emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#b45309', marginTop: 8 }}>오늘의 장르: {genreKey}</div>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>결과를 저장하고 무료로 확인해요</p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이름 또는 별명 (선택)</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="이름 입력"
                style={{ width: '100%', border: '1.5px solid #fde68a', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#d97706', fontWeight: 700, display: 'block', marginBottom: 6 }}>전화번호 ★ 필수</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" type="tel"
                style={{ width: '100%', border: '1.5px solid #fde68a', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이메일 (선택)</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" type="email"
                style={{ width: '100%', border: '1.5px solid #fde68a', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>[필수] 개인정보 수집·이용 동의 — 서비스 제공 목적으로 전화번호를 수집합니다</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
              <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>[선택] 마케팅 정보 수신 동의</span>
            </div>
            {error && <p style={{ color: '#d97706', fontSize: 13, marginBottom: 10 }}>{error}</p>}
            <button onClick={submit} disabled={saving}
              style={{ width: '100%', background: 'linear-gradient(135deg,#d97706,#f59e0b)', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, color: 'white', fontWeight: 800, cursor: 'pointer' }}>
              {saving ? '저장 중...' : '🎬 결과 보기'}
            </button>
          </div>
        )}

        {step === 'result' && (
          <div>
            <div style={{ background: `linear-gradient(135deg,${genre.color},#f59e0b)`, borderRadius: 24, padding: '32px 24px', marginBottom: 14, color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>{genre.emoji}</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 4, letterSpacing: 2, textTransform: 'uppercase' }}>{genre.tagline}</div>
              <div style={{ fontSize: 22, fontWeight: 900 }}>{genre.title}</div>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(180,83,9,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#b45309', marginBottom: 8 }}>🎞️ 오늘의 장르: {genreKey}</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{genre.comfort}</p>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(180,83,9,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#b45309', marginBottom: 8 }}>🎵 오늘의 OST 추천</div>
              <pre style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-line' }}>{genre.ost}</pre>
            </div>

            <div style={{ background: '#fffbeb', borderRadius: 14, padding: '12px 16px', marginBottom: 16, textAlign: 'center', fontSize: 13, color: '#92400e', border: '1.5px solid #fde68a' }}>
              오늘 <strong>{count}명</strong>이 자신의 하루 장르를 찾았어요 🎬
            </div>

            <button onClick={() => { setStep('intro'); setCurrentQ(0); setScore(0); setSelected(new Array(SITUATIONS.length).fill(null)); setName(''); setPhone(''); setEmail(''); }}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #d97706', borderRadius: 14, padding: '14px', fontSize: 15, cursor: 'pointer', color: '#d97706', fontWeight: 700, marginBottom: 10 }}>
              🔄 내일 또 해보기
            </button>

            <div style={{ background: '#fffbeb', borderRadius: 18, padding: '20px', marginBottom: 10, border: '1.5px dashed #fde68a', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔮</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#b45309', marginBottom: 6 }}>사주로 보는 올해 운세 · 성공운</div>
              <div style={{ fontSize: 12, color: '#92400e', marginBottom: 14 }}>오행으로 보는 직업운 + 재물운 + 올해 흐름</div>
              <a href="/main-v2" style={{ display: 'block', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                🔮 사주 운세 보기 →
              </a>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#fbbf24', marginTop: 8 }}>
              점운 — 사주·꿈해몽·직업·합격·궁합까지
            </div>
          </div>
        )}
        <div style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', padding: '24px 16px 12px', lineHeight: 1.8 }}>
          <p style={{ margin: '0 0 2px' }}>© 2026 점운 · Powered by 점운</p>
          <p style={{ margin: 0 }}>대표: 장문정 · 사업자등록번호 773-60-00359</p>
        </div>
      </div>
    </div>
  )
}
