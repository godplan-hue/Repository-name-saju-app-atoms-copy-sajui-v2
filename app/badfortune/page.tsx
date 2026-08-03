'use client'
import { useState } from 'react'

const BAD_FORTUNES = [
  { title: "지갑 여행의 날", body: "오늘 당신의 지갑은 혼자만의 여행을 떠날 예정입니다. 나가기 전 지갑 위치를 세 번 확인하세요.", warn: "신용카드 한도 확인 필수" },
  { title: "신호등 저주", body: "오늘 모든 신호등이 당신을 인식하면 빨간불로 바뀝니다. 5분 일찍 나가도 소용없습니다.", warn: "약속 시간 10분 전 출발 필수" },
  { title: "카톡 씹힘 운", body: "오늘 보낸 카카오톡 3개 중 2개는 읽씹 당합니다. 중요한 연락은 전화를 권장합니다.", warn: "고백 카톡은 오늘 절대 금지" },
  { title: "우산 역설의 날", body: "오늘은 우산을 들고 나가면 해가 쨍쨍하고, 안 들고 나가면 폭우가 쏟아집니다.", warn: "폰 방수케이스 착용 권장" },
  { title: "기름 튀김 운세", body: "오늘 삼겹살을 먹으면 흰 옷에 기름이 튑니다. 검은 옷이 없으면 집에서 드세요.", warn: "외식 시 앞치마 착용 강력 권장" },
  { title: "충전기 실종의 날", body: "충전기가 눈앞에 있어도 오늘은 배터리가 계속 줄어듭니다. 보조배터리를 챙기세요.", warn: "중요한 통화는 오전 중 완료" },
  { title: "배달 지연 저주", body: "오늘 주문한 배달음식은 예상 시간보다 정확히 28분 늦게 도착합니다.", warn: "배고플 때 주문하면 더 배고파짐" },
  { title: "노력 무효의 날", body: "오늘 열심히 해도 아무도 알아차리지 못합니다. 쉬는 날로 쓰는 것을 권장합니다.", warn: "어필 시도는 내일로 미루세요" },
  { title: "품절 저주", body: "오늘 사려고 점찍어둔 물건은 바로 전 사람이 마지막 걸 가져갑니다.", warn: "온라인 재고 알림 설정 필수" },
  { title: "2시간 증발 현상", body: "오늘은 잠깐 눈을 감으면 2시간이 사라집니다. 중요한 일은 알람을 세 개 맞추세요.", warn: "회의 전날 밤 숙면 금물" },
  { title: "단톡방 폭탄의 날", body: "잠든 사이 단톡방에서 중요한 결정이 이미 끝납니다. 당신 의견은 무시됩니다.", warn: "자기 전 단톡방 알림 끄기 금지" },
  { title: "엘레베이터 역설", body: "오늘 버튼을 누르면 엘레베이터가 반대 방향으로 갑니다. 계단 사용을 권장합니다.", warn: "급한 날일수록 엘베 더 안 옴" },
]

function getTodayFortune() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return BAD_FORTUNES[seed % BAD_FORTUNES.length]
}

function getTodayCount() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  return 1923 + (seed % 3847)
}

function getLevel() {
  const d = new Date()
  const seed = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) % 3
  const levels = ['나쁨 😈', '매우 나쁨 💀', '재앙 수준 ☠️']
  return levels[seed]
}

export default function BadFortunePage() {
  const [step, setStep] = useState<'intro' | 'flipping' | 'result'>('intro')
  const [fortune, setFortune] = useState<typeof BAD_FORTUNES[0] | null>(null)
  const [count] = useState(getTodayCount)
  const [level] = useState(getLevel)

  function draw() {
    setStep('flipping')
    setTimeout(() => {
      setFortune(getTodayFortune())
      setStep('result')
    }, 1200)
  }

  function redraw() {
    setStep('flipping')
    const pool = BAD_FORTUNES
    const picked = pool[Math.floor(Math.random() * pool.length)]
    setTimeout(() => {
      setFortune(picked)
      setStep('result')
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4c1d95)', fontFamily: '"Apple SD Gothic Neo",system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>😈</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#c4b5fd', margin: 0, letterSpacing: '-0.5px' }}>점운 나쁜운세</h1>
          <p style={{ color: '#a78bfa', fontSize: 14, margin: '6px 0 0', lineHeight: 1.5 }}>오늘의 나쁜 운세를 솔직하게 알려드려요</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 10 }}>
            <span style={{ background: 'rgba(139,92,246,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#c4b5fd', fontWeight: 700, border: '1px solid rgba(196,181,253,0.3)' }}>🆓 무료</span>
            <span style={{ background: 'rgba(139,92,246,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#c4b5fd', fontWeight: 700, border: '1px solid rgba(196,181,253,0.3)' }}>🔮 990원·24h</span>
          </div>
        </div>

        {/* Intro */}
        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: '32px 24px', marginBottom: 20, border: '1px solid rgba(196,181,253,0.2)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🃏</div>
              <p style={{ color: '#c4b5fd', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                오늘의 나쁜 운세 카드를 뽑아보세요.<br />
                <span style={{ opacity: 0.7, fontSize: 13 }}>사주가 알려주는 오늘의 주의사항</span>
              </p>
            </div>

            <button onClick={draw}
              style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, cursor: 'pointer', color: 'white', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.3px' }}>
              😈 나쁜 운세 카드 뽑기
            </button>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 16px', fontSize: 12, color: '#a78bfa' }}>
              오늘 이미 <strong style={{ color: '#c4b5fd' }}>{count.toLocaleString()}명</strong>이 나쁜 운세를 확인했어요
            </div>
          </div>
        )}

        {/* Flipping */}
        {step === 'flipping' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20, animation: 'flip 0.3s ease-in-out infinite alternate', display: 'inline-block' }}>🃏</div>
            <p style={{ color: '#a78bfa', fontSize: 15 }}>카드 뒤집는 중...</p>
            <style>{`@keyframes flip { from { transform: rotateY(0deg) scale(1); } to { transform: rotateY(180deg) scale(0.8); } }`}</style>
          </div>
        )}

        {/* Result */}
        {step === 'result' && fortune && (
          <div>
            {/* Warning banner */}
            <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, border: '1.5px solid rgba(239,68,68,0.4)', textAlign: 'center' }}>
              <span style={{ color: '#fca5a5', fontSize: 13, fontWeight: 700 }}>⚠️ 경고: 더 나빠질 수 있음</span>
            </div>

            {/* Fortune card */}
            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 24, padding: '28px 24px', marginBottom: 16, border: '1.5px solid rgba(196,181,253,0.25)' }}>
              <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700, marginBottom: 10, letterSpacing: '1px' }}>오늘의 나쁜 운세</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#c4b5fd', marginBottom: 12 }}>{fortune.title}</div>
              <p style={{ fontSize: 15, color: '#ddd6fe', lineHeight: 1.75, margin: 0 }}>{fortune.body}</p>
            </div>

            {/* Warning */}
            <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 14, padding: '14px 18px', marginBottom: 16, border: '1px solid rgba(239,68,68,0.3)' }}>
              <div style={{ fontSize: 12, color: '#fca5a5', fontWeight: 700, marginBottom: 6 }}>🚨 주의사항</div>
              <div style={{ fontSize: 14, color: '#fecaca' }}>{fortune.warn}</div>
            </div>

            {/* Level badge */}
            <div style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 14, padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'white' }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>오늘 나쁜 운세 수준</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{level}</div>
              </div>
              <div style={{ fontSize: 36 }}>📊</div>
            </div>

            <button onClick={redraw}
              style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(196,181,253,0.3)', borderRadius: 14, padding: '14px', fontSize: 15, cursor: 'pointer', color: '#c4b5fd', fontWeight: 700, marginBottom: 10 }}>
              🔄 다시 뽑기
            </button>

            {/* 990원 locked section */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: '20px', marginBottom: 10, border: '1.5px dashed rgba(196,181,253,0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#c4b5fd', marginBottom: 6 }}>사주로 보는 이번 주 나쁜 운 회피법</div>
              <div style={{ fontSize: 12, color: '#a78bfa', marginBottom: 14 }}>일별 주의사항 + 오행별 보호 방법 + 행운 아이템</div>
              <a href="/main-v2" style={{ display: 'block', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                🔮 사주로 보호막 치기 → 990원·24h
              </a>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#6d28d9', marginTop: 8 }}>
              점운 — 사주·꿈해몽·직업·합격·궁합까지
            </div>
          </div>
        )}

        {/* Bottom cross-promo */}
        {step === 'intro' && (
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { href: '/main-v2', icon: '☯️', label: '사주 운세', badge: '990원~' },
              { href: '/haemong', icon: '🌙', label: '꿈해몽', badge: '무료/990원' },
              { href: '/mbti', icon: '🧠', label: 'MBTI', badge: '무료/990원' },
              { href: '/lotto', icon: '🍀', label: '행운번호', badge: '무료' },
            ].map(a => (
              <a key={a.href} href={a.href} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(196,181,253,0.15)' }}>
                <span style={{ fontSize: 22 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#c4b5fd' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: '#a78bfa' }}>{a.badge}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
