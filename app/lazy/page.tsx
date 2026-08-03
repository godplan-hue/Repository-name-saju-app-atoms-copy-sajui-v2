'use client'
import { useState, useEffect } from 'react'

const QUESTIONS = [
  {
    q: "오늘 알람을 몇 번 껐나요?",
    opts: [
      { label: "0번 (칼기상)", score: 0 },
      { label: "1~2번", score: 15 },
      { label: "3~5번", score: 25 },
      { label: "6번 이상 (전설)", score: 35 },
    ],
  },
  {
    q: "지금 당장 물 가져오기가 귀찮은가요?",
    opts: [
      { label: "아니요, 바로 가요", score: 0 },
      { label: "조금요", score: 10 },
      { label: "많이 귀찮아요", score: 20 },
      { label: "목말라도 안 가요", score: 30 },
    ],
  },
  {
    q: "오늘 씻기 귀찮다고 생각했나요?",
    opts: [
      { label: "전혀요", score: 0 },
      { label: "잠깐 생각했어요", score: 10 },
      { label: "많이 생각했어요", score: 20 },
      { label: "안 씻었어요", score: 30 },
    ],
  },
  {
    q: "밥 먹기 귀찮아서 그냥 누운 적 있나요?",
    opts: [
      { label: "없어요", score: 0 },
      { label: "가끔요", score: 10 },
      { label: "자주요", score: 18 },
      { label: "지금 그 상태예요", score: 25 },
    ],
  },
  {
    q: "이 테스트 하기도 귀찮았나요?",
    opts: [
      { label: "그냥 심심해서요", score: 0 },
      { label: "좀 귀찮았어요", score: 5 },
      { label: "귀찮지만 했어요", score: 8 },
      { label: "엄청 귀찮았어요", score: 10 },
    ],
  },
]

type Result = { title: string; emoji: string; desc: string; advice: string }

function getResult(score: number): Result {
  if (score >= 90) return { title: "귀찮음의 신", emoji: "🐨", desc: "당신은 귀찮음의 경지를 초월했습니다. 귀찮음이 생활 방식이 된 진정한 마스터입니다.", advice: "오늘 딱 한 가지만 해도 대성공입니다." }
  if (score >= 70) return { title: "귀찮음 전문가", emoji: "😴", desc: "귀찮음에 관한 한 당신은 전문가 수준입니다. 에너지 보존에 특화된 체질이에요.", advice: "유튜브 자동재생 켜두고 쉬세요." }
  if (score >= 50) return { title: "귀찮음 중급자", emoji: "🦥", desc: "귀찮음과 부지런함 사이 어딘가에 있습니다. 오늘은 귀찮음이 우세한 날이에요.", advice: "할 일 목록 반만 하면 성공이에요." }
  if (score >= 30) return { title: "가끔 귀찮음", emoji: "🐢", desc: "대체로 부지런하지만 오늘은 쉬고 싶은 마음이 있군요. 당연한 거예요!", advice: "오늘 하루쯤은 좀 게을러도 됩니다." }
  return { title: "귀찮음 없음", emoji: "⚡", desc: "귀찮음을 모르는 에너자이저입니다. 오늘도 활기차게 달리고 계시는군요!", advice: "그 에너지가 부럽습니다. 오늘도 파이팅!" }
}

function getTodayCount() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return 3124 + (seed % 2891)
}

export default function LazyPage() {
  const [step, setStep] = useState(0) // 0=intro, 1-5=questions, 6=loading, 7=result
  const [scores, setScores] = useState<number[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const count = getTodayCount()

  useEffect(() => {
    if (step === 6) {
      const total = scores.reduce((a, b) => a + b, 0)
      const capped = Math.min(100, total)
      setTotalScore(capped)
      setResult(getResult(capped))

      let p = 0
      const iv = setInterval(() => {
        p += Math.random() * 2 + 0.3 // intentionally slow
        if (p >= 100) {
          p = 100
          clearInterval(iv)
          setTimeout(() => setStep(7), 400)
        }
        setLoadProgress(Math.floor(p))
      }, 120)
      return () => clearInterval(iv)
    }
  }, [step])

  function answer(score: number) {
    const newScores = [...scores, score]
    setScores(newScores)
    if (newScores.length === QUESTIONS.length) {
      setStep(6) // loading
    } else {
      setStep(newScores.length + 1)
    }
  }

  const qIndex = step - 1
  const progress = step <= 5 ? ((step - 1) / QUESTIONS.length) * 100 : 100

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f5f3ff,#ede9fe,#ddd6fe)', fontFamily: '"Apple SD Gothic Neo",system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>😴</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#7c3aed', margin: 0, letterSpacing: '-0.5px' }}>점운 귀찮음지수</h1>
          <p style={{ color: '#6d28d9', fontSize: 14, margin: '6px 0 0' }}>오늘 나의 귀찮음 수준을 측정해드려요</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 10 }}>
            <span style={{ background: '#ede9fe', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>🆓 무료</span>
            <span style={{ background: '#ede9fe', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>🔮 990원·24h</span>
          </div>
        </div>

        {/* Intro */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(124,58,237,0.1)' }}>
              <div style={{ fontSize: 60, marginBottom: 12 }}>🐨</div>
              <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                5가지 질문으로 오늘 귀찮음 수준을<br />정밀 측정해드려요.
              </p>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>오늘 <strong>{count.toLocaleString()}명</strong>이 측정했어요</p>
            </div>
            <button onClick={() => setStep(1)}
              style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, cursor: 'pointer', color: 'white', fontWeight: 800 }}>
              😴 귀찮음 측정 시작
            </button>
          </div>
        )}

        {/* Questions */}
        {step >= 1 && step <= 5 && (
          <div>
            {/* Progress bar */}
            <div style={{ background: '#ede9fe', borderRadius: 99, height: 8, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)', height: '100%', borderRadius: 99, width: `${progress}%`, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: 12, color: '#7c3aed', textAlign: 'right', marginTop: -14, marginBottom: 16 }}>{step}/5</div>

            <div style={{ background: 'white', borderRadius: 20, padding: '24px', marginBottom: 16, boxShadow: '0 4px 20px rgba(124,58,237,0.1)' }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.6 }}>{QUESTIONS[qIndex].q}</p>
            </div>

            {QUESTIONS[qIndex].opts.map((opt, i) => (
              <button key={i} onClick={() => answer(opt.score)}
                style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #ddd6fe', borderRadius: 14, padding: '14px 18px', marginBottom: 10, fontSize: 15, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Loading (intentionally slow) */}
        {step === 6 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🐨</div>
            <p style={{ color: '#7c3aed', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>귀찮음 지수 측정 중...</p>
            <div style={{ background: '#ede9fe', borderRadius: 99, height: 12, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ background: 'linear-gradient(90deg,#7c3aed,#a855f7)', height: '100%', borderRadius: 99, width: `${loadProgress}%`, transition: 'width 0.1s' }} />
            </div>
            <p style={{ color: '#a78bfa', fontSize: 13 }}>{loadProgress}% 완료... (귀찮아서 천천히 재는 중)</p>
          </div>
        )}

        {/* Result */}
        {step === 7 && result && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 24, padding: '32px 24px', marginBottom: 16, color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>{result.emoji}</div>
              <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 6 }}>오늘 귀찮음 지수</div>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>{totalScore}점</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>{result.title}</div>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 14, boxShadow: '0 4px 16px rgba(124,58,237,0.1)' }}>
              <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: '0 0 12px' }}>{result.desc}</p>
              <div style={{ background: '#f5f3ff', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#7c3aed', fontWeight: 600 }}>
                💡 {result.advice}
              </div>
            </div>

            <div style={{ background: '#fff7ed', borderRadius: 14, padding: '12px 16px', marginBottom: 20, textAlign: 'center', fontSize: 13, color: '#92400e', border: '1.5px solid #fed7aa' }}>
              오늘 귀찮음 측정한 사람 <strong>{count.toLocaleString()}명</strong>
            </div>

            <button onClick={() => { setStep(0); setScores([]); setLoadProgress(0); setResult(null) }}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #7c3aed', borderRadius: 14, padding: '14px', fontSize: 15, cursor: 'pointer', color: '#7c3aed', fontWeight: 700, marginBottom: 10 }}>
              🔄 다시 측정하기
            </button>

            {/* 990원 locked section */}
            <div style={{ background: '#f5f3ff', borderRadius: 18, padding: '20px', marginBottom: 10, border: '1.5px dashed #ddd6fe', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#7c3aed', marginBottom: 6 }}>사주로 보는 귀찮음의 진짜 원인</div>
              <div style={{ fontSize: 12, color: '#6d28d9', marginBottom: 14 }}>오행 체질 + 에너지 사이클 + 활력 회복법</div>
              <a href="/main-v2" style={{ display: 'block', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                🔮 사주로 에너지 분석하기 → 990원·24h
              </a>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#c4b5fd', marginTop: 8 }}>
              점운 — 사주·꿈해몽·직업·합격·궁합까지
            </div>
          </div>
        )}

        {/* Cross-promo */}
        {step === 0 && (
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { href: '/main-v2', icon: '☯️', label: '사주 운세', badge: '990원~' },
              { href: '/haemong', icon: '🌙', label: '꿈해몽', badge: '무료/990원' },
              { href: '/mbti', icon: '🧠', label: 'MBTI', badge: '무료/990원' },
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
