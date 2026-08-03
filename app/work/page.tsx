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
]

const BOSS_MIND: Record<string, string> = {
  fire: '"나도 사실 사람이야. 다 잘 되길 바라는 거라고..."',
  cold: '"말 안 해도 다 알아. 근데 말하기가 어려워."',
  micro: '"완벽하게 하고 싶어서 그래. 나를 위해서가 아니라 팀을 위해서야."',
  fake: '"나도 살아남으려고 이러는 거야. 이해해줘."',
  ghost: '"내가 없는 게 최고의 복지 아닌가? 하하."',
}

const BOSS_VENT: Record<string, string[]> = {
  fire: ['"오늘은 몇 번 봉변을 당했는가" 세다 보면 하루가 끝남', '상사 눈치 보다가 거울도 못 봤음', '"왜 나만 이러나" 화장실에서 20분 눈물 참은 일 있죠?'],
  cold: ['묵묵히 일 하다가 내가 해고됐는지도 모를 판', '"잘 하고 있어?"라는 말 한 번이 이리도 어렵냐', '속 마음 한 번만 말해줬으면... 나는 감사받고 싶어'],
  micro: ['"이것도 확인해요?" 10번째 물음에 내 자존감 10등분', '내 보고서 보고서 위에 또 보고서', '퇴근 전 "한 가지만요~" 들으면 이미 한 시간 추가'],
  fake: ['뒤에서 어떤 말이 돌고 있는지 눈치게임 풀가동', '"우리 팀 화이팅!"을 믿어야 할지 말아야 할지', '퇴근하면서 "진짜 뭔 생각인지" 셋 세다 잠드는 하루'],
  ghost: ['없어서 좋은데 갑자기 나타나면 더 무서움', '지시 없이 내가 알아서 다 해야 하는 오늘', '"오늘도 잘 했겠지?" 자가 위로로 마무리'],
}

const RECOVERY_TIPS: Record<string, string[]> = {
  fire: ['퇴근하면 잠시 핸드폰 내려놓기 — 오늘 일 마음에서도 퇴근', '좋아하는 음식 시켜먹기 (이 정도는 당연한 보상)', '내일 나한테 잘해줄 한 가지 결심하기'],
  cold: ['조용한 카페에서 30분 혼자 앉아있기', '오늘 내가 잘 한 일 3가지 적어보기', '나는 내 편이라는 거 잊지 말기'],
  micro: ['퇴근 후 나만의 시간 1시간은 꼭 갖기', '완벽하지 않아도 괜찮다는 거 스스로 말해주기', '"다 했다" 체크리스트 완성 — 그것만으로 충분'],
  fake: ['오늘 나한테 솔직했나 돌아보기 (그게 제일 중요)', '친한 동료나 친구한테 털어놓기', '내 가치는 남이 아닌 내가 아는 것'],
  ghost: ['오늘 내가 스스로 결정한 것들 뿌듯해하기', '혼자 잘 해냈다는 거 인정하기', '나를 알아봐 주는 사람 한 명만 있어도 충분'],
}

function calcScore(bossKey: string, quizAns: boolean[]): number {
  const boss = BOSS_TYPES.find(b => b.key === bossKey)!
  let s = 60 + boss.penalty
  s += quizAns[0] ? QUIZ_LIST[0].yes : QUIZ_LIST[0].no
  s += quizAns[1] ? QUIZ_LIST[1].yes : QUIZ_LIST[1].no
  s += quizAns[2] ? QUIZ_LIST[2].yes : QUIZ_LIST[2].no
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
  if (s >= 85) return '오늘 정말 잘 하셨어요! 이 에너지로 내일도 화이팅!'
  if (s >= 70) return '충분히 잘 버텼어요. 오늘 퇴근한 것만으로도 대단해요.'
  if (s >= 55) return '간신히 살아남았지만, 살아남은 거잖아요. 수고했어요.'
  if (s >= 40) return '많이 힘드셨죠... 오늘은 그냥 쉬어요. 내일은 다를 거예요.'
  return '오늘은 진짜 최악이었군요. 그래도 끝까지 버텼잖아요. 대단해요.'
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
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
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
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      setError('전화번호를 정확히 입력해주세요.')
      return
    }
    setSaving(true)
    const boss = BOSS_TYPES.find(b => b.key === bossKey)
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: 'work', name, phone, email, result: `${boss?.label} / ${score}점` }),
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
            <span style={{ background: '#dbeafe', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#2563eb', fontWeight: 700 }}>🔮 990원·24h</span>
          </div>
        </div>

        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(37,99,235,0.1)' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🏢</div>
              <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                상사 유형 선택 + 3가지 질문으로<br />오늘의 직장 생존 점수가 나와요
              </p>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 10 }}>오늘 <strong>{count}명</strong>이 생존 점수를 확인했어요</p>
            </div>
            <button onClick={() => setStep('boss')}
              style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, cursor: 'pointer', color: 'white', fontWeight: 800 }}>
              💪 오늘 생존 점수 확인하기
            </button>

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
            <div style={{ fontSize: 12, color: '#2563eb', textAlign: 'right', marginBottom: 20 }}>{quizIdx + 1}/3</div>

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
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이메일 (선택)</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" type="email"
                style={{ width: '100%', border: '1.5px solid #bfdbfe', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {error && <p style={{ color: '#2563eb', fontSize: 13, marginBottom: 10 }}>{error}</p>}
            <button onClick={submit} disabled={saving}
              style={{ width: '100%', background: 'linear-gradient(135deg,#2563eb,#3b82f6)', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, color: 'white', fontWeight: 800, cursor: 'pointer' }}>
              {saving ? '저장 중...' : '💪 생존 결과 보기'}
            </button>
            <p style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', marginTop: 10 }}>수집: 이름(선택), 전화번호, 이메일(선택) / 보관: 3년 후 파기</p>
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
                🔮 사주 직업운 보기 → 990원·24h
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
      </div>
    </div>
  )
}
