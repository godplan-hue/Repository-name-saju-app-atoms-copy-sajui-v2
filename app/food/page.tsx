'use client'
import { useState, useEffect } from 'react'

const MOODS = [
  { id: 'happy',  label: '기분 좋음', icon: '😊' },
  { id: 'tired',  label: '피곤함',    icon: '😴' },
  { id: 'sad',    label: '우울함',    icon: '😔' },
  { id: 'angry',  label: '짜증남',    icon: '😤' },
  { id: 'hungry', label: '그냥 배고픔', icon: '🤤' },
]

const WEATHERS = [
  { id: 'sunny', label: '맑음',   icon: '☀️' },
  { id: 'cloudy', label: '흐림',  icon: '☁️' },
  { id: 'rainy',  label: '비',    icon: '🌧️' },
  { id: 'cold',   label: '눈/추움', icon: '❄️' },
]

type FoodResult = { name: string; emoji: string; reason: string; ohang: string; ohangColor: string; bonus: string }

const FOOD_MAP: Record<string, Record<string, FoodResult>> = {
  happy: {
    sunny:  { name: "냉면", emoji: "🍜", reason: "상쾌한 기분에 시원한 냉면 한 그릇!", ohang: "수(水) 기운", ohangColor: "#3b82f6", bonus: "함께 먹으면 좋은 것: 왕만두" },
    cloudy: { name: "삼겹살", emoji: "🥩", reason: "흐린 날엔 친구들과 삼겹살이 최고", ohang: "화(火) 기운", ohangColor: "#ef4444", bonus: "함께 먹으면 좋은 것: 소주 한 잔" },
    rainy:  { name: "파전", emoji: "🥞", reason: "비 오는 날엔 파전에 막걸리가 진리", ohang: "목(木) 기운", ohangColor: "#22c55e", bonus: "함께 먹으면 좋은 것: 막걸리" },
    cold:   { name: "부대찌개", emoji: "🍲", reason: "추운 날 뜨끈한 부대찌개로 몸 녹이기", ohang: "토(土) 기운", ohangColor: "#f59e0b", bonus: "함께 먹으면 좋은 것: 라면 사리" },
  },
  tired: {
    sunny:  { name: "국밥", emoji: "🍜", reason: "피곤할 때 뜨끈한 국밥으로 체력 보충", ohang: "토(土) 기운", ohangColor: "#f59e0b", bonus: "함께 먹으면 좋은 것: 깍두기" },
    cloudy: { name: "삼계탕", emoji: "🍗", reason: "흐린 날 피로엔 삼계탕이 보약", ohang: "화(火) 기운", ohangColor: "#ef4444", bonus: "함께 먹으면 좋은 것: 인삼주" },
    rainy:  { name: "라면", emoji: "🍜", reason: "비 오는 날 피곤할 땐 라면 한 그릇", ohang: "수(水) 기운", ohangColor: "#3b82f6", bonus: "함께 먹으면 좋은 것: 계란" },
    cold:   { name: "된장찌개", emoji: "🍲", reason: "추위에 지친 몸엔 된장찌개가 최고", ohang: "토(土) 기운", ohangColor: "#f59e0b", bonus: "함께 먹으면 좋은 것: 밥 두 그릇" },
  },
  sad: {
    sunny:  { name: "치킨", emoji: "🍗", reason: "우울할 땐 치킨이 최고의 위로", ohang: "금(金) 기운", ohangColor: "#a78bfa", bonus: "함께 먹으면 좋은 것: 맥주" },
    cloudy: { name: "치킨+맥주", emoji: "🍺", reason: "흐린 날 우울함엔 치맥으로 기분 전환", ohang: "금(金) 기운", ohangColor: "#a78bfa", bonus: "함께 먹으면 좋은 것: 피클" },
    rainy:  { name: "치킨 (또 치킨)", emoji: "🍗", reason: "비 오는 날 우울할 때도 결국은 치킨", ohang: "금(金) 기운", ohangColor: "#a78bfa", bonus: "함께 먹으면 좋은 것: 또 치킨" },
    cold:   { name: "떡볶이+순대", emoji: "🌶️", reason: "추운 날 우울함엔 떡볶이로 매콤하게", ohang: "화(火) 기운", ohangColor: "#ef4444", bonus: "함께 먹으면 좋은 것: 어묵" },
  },
  angry: {
    sunny:  { name: "마라탕", emoji: "🍲", reason: "짜증날 때 매운 마라탕으로 화 풀기", ohang: "화(火) 기운", ohangColor: "#ef4444", bonus: "함께 먹으면 좋은 것: 탕후루" },
    cloudy: { name: "불닭볶음면", emoji: "🌶️", reason: "흐린 날 짜증은 불닭볶음면으로 해소", ohang: "화(火) 기운", ohangColor: "#ef4444", bonus: "함께 먹으면 좋은 것: 치즈" },
    rainy:  { name: "매운 갈비찜", emoji: "🥩", reason: "비 오는 날 짜증엔 갈비찜으로 한 방", ohang: "화(火) 기운", ohangColor: "#ef4444", bonus: "함께 먹으면 좋은 것: 공기밥" },
    cold:   { name: "전골 핫팟", emoji: "🍲", reason: "추위+짜증 동시에 뜨끈한 전골로 해결", ohang: "토(土) 기운", ohangColor: "#f59e0b", bonus: "함께 먹으면 좋은 것: 공기밥 두 그릇" },
  },
  hungry: {
    sunny:  { name: "고기 뷔페", emoji: "🥩", reason: "배고플 땐 뷔페가 정답", ohang: "토(土) 기운", ohangColor: "#f59e0b", bonus: "함께 먹으면 좋은 것: 음료 리필" },
    cloudy: { name: "곱창전골", emoji: "🍲", reason: "흐린 날 배고픔엔 곱창전골로 배 채우기", ohang: "목(木) 기운", ohangColor: "#22c55e", bonus: "함께 먹으면 좋은 것: 볶음밥" },
    rainy:  { name: "삼겹살+보쌈", emoji: "🥩", reason: "비 오는 날 배고픔엔 고기 탐방", ohang: "화(火) 기운", ohangColor: "#ef4444", bonus: "함께 먹으면 좋은 것: 쌈채소" },
    cold:   { name: "통닭+족발", emoji: "🍗", reason: "추운 날 배고픔엔 최대 칼로리 충전", ohang: "금(金) 기운", ohangColor: "#a78bfa", bonus: "함께 먹으면 좋은 것: 냉육수" },
  },
}

const SLOT_FOODS = ['🍜', '🍗', '🥩', '🍲', '🌶️', '🥞', '🍺', '🍱', '🥟', '🍙']

function getTodayCount() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return 2341 + (seed % 3156)
}

export default function FoodPage() {
  const [mood, setMood] = useState('')
  const [weather, setWeather] = useState('')
  const [step, setStep] = useState<'mood' | 'weather' | 'spinning' | 'result'>('mood')
  const [slotEmoji, setSlotEmoji] = useState('🎰')
  const [result, setResult] = useState<FoodResult | null>(null)
  const count = getTodayCount()

  useEffect(() => {
    if (step === 'spinning') {
      let i = 0
      const iv = setInterval(() => {
        setSlotEmoji(SLOT_FOODS[Math.floor(Math.random() * SLOT_FOODS.length)])
        i++
        if (i > 20) {
          clearInterval(iv)
          const r = FOOD_MAP[mood]?.[weather] || FOOD_MAP.happy.sunny
          setResult(r)
          setSlotEmoji(r.emoji)
          setTimeout(() => setStep('result'), 300)
        }
      }, 80)
      return () => clearInterval(iv)
    }
  }, [step, mood, weather])

  function startSpin(w: string) {
    setWeather(w)
    setStep('spinning')
  }

  function reset() {
    setMood('')
    setWeather('')
    setResult(null)
    setStep('mood')
    setSlotEmoji('🎰')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7,#d1fae5)', fontFamily: '"Apple SD Gothic Neo",system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🍜</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#16a34a', margin: 0, letterSpacing: '-0.5px' }}>점운 뭐먹지?</h1>
          <p style={{ color: '#15803d', fontSize: 14, margin: '6px 0 0' }}>기분과 날씨로 오늘 음식을 추천해드려요</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 10 }}>
            <span style={{ background: '#dcfce7', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#16a34a', fontWeight: 700 }}>🆓 무료</span>
            <span style={{ background: '#dcfce7', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#16a34a', fontWeight: 700 }}>🔮 990원·24h</span>
          </div>
        </div>

        {/* Step 1: Mood */}
        {step === 'mood' && (
          <div>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: 14, textAlign: 'center', fontSize: 16 }}>지금 기분이 어떤가요?</p>
            {MOODS.map(m => (
              <button key={m.id}
                onClick={() => { setMood(m.id); setStep('weather') }}
                style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #bbf7d0', borderRadius: 14, padding: '14px 18px', marginBottom: 10, fontSize: 15, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                {m.icon} {m.label}
              </button>
            ))}
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: '#6b7280' }}>
              오늘 <strong>{count.toLocaleString()}명</strong>이 메뉴를 골랐어요 🍽️
            </div>
          </div>
        )}

        {/* Step 2: Weather */}
        {step === 'weather' && (
          <div>
            <button onClick={() => setStep('mood')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 14, marginBottom: 16, padding: 0 }}>← 다시 선택</button>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: 14, textAlign: 'center', fontSize: 16 }}>오늘 날씨는요?</p>
            {WEATHERS.map(w => (
              <button key={w.id}
                onClick={() => startSpin(w.id)}
                style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #bbf7d0', borderRadius: 14, padding: '14px 18px', marginBottom: 10, fontSize: 15, cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                {w.icon} {w.label}
              </button>
            ))}
          </div>
        )}

        {/* Spinning */}
        {step === 'spinning' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '40px', boxShadow: '0 4px 24px rgba(22,163,74,0.15)', marginBottom: 20 }}>
              <div style={{ fontSize: 80, transition: 'all 0.05s' }}>{slotEmoji}</div>
            </div>
            <p style={{ color: '#16a34a', fontSize: 15, fontWeight: 700 }}>오늘의 메뉴 추첨 중...</p>
          </div>
        )}

        {/* Result */}
        {step === 'result' && result && (
          <div>
            {/* Main card */}
            <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', marginBottom: 14, boxShadow: '0 4px 24px rgba(22,163,74,0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: 12 }}>{result.emoji}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#111827', marginBottom: 8 }}>{result.name}</div>
              <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{result.reason}</p>
            </div>

            {/* Ohang badge */}
            <div style={{ background: result.ohangColor, borderRadius: 14, padding: '14px 20px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>오행 에너지</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{result.ohang}</div>
              </div>
              <div style={{ fontSize: 32 }}>⚡</div>
            </div>

            {/* Bonus */}
            <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '14px 18px', marginBottom: 20, border: '1.5px solid #bbf7d0' }}>
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 700, marginBottom: 4 }}>🍽️ 추천 조합</div>
              <div style={{ fontSize: 14, color: '#374151' }}>{result.bonus}</div>
            </div>

            <button onClick={reset}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #16a34a', borderRadius: 14, padding: '14px', fontSize: 15, cursor: 'pointer', color: '#16a34a', fontWeight: 700, marginBottom: 10 }}>
              🔄 다시 뽑기
            </button>

            {/* 990원 locked section */}
            <div style={{ background: '#f0fdf4', borderRadius: 18, padding: '20px', marginBottom: 10, border: '1.5px dashed #86efac', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>사주로 보는 체질별 맞춤 식단</div>
              <div style={{ fontSize: 12, color: '#15803d', marginBottom: 14 }}>오행 체질 + 이번 달 먹으면 좋은 음식 + 피해야 할 음식</div>
              <a href="/main-v2" style={{ display: 'block', background: 'linear-gradient(135deg,#16a34a,#22c55e)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                🔮 사주로 체질 식단 보기 → 990원·24h
              </a>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#86efac', marginTop: 8 }}>
              점운 — 사주·꿈해몽·직업·합격·궁합까지
            </div>
          </div>
        )}

        {/* Cross-promo */}
        {step === 'mood' && (
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
