'use client'
import { useState } from 'react'

const QUIZ = [
  { q: '색상 선택은?', a: '컬러풀하고 화려하게', b: '무채색 톤으로 심플하게', aB: 1, bB: 0, aT: 1, bT: 0 },
  { q: '소재 선호는?', a: '메탈릭·시퀸·반짝이는', b: '면·리넨 같은 자연 소재', aB: 0, bB: 1, aT: 1, bT: 0 },
  { q: '스타일 방향은?', a: '눈에 띄고 트렌디하게', b: '시간이 지나도 질리지 않게', aB: 1, bB: 0, aT: 1, bT: 0 },
  { q: '아이템 선택은?', a: '미니스커트·크롭탑 등 짧고 과감하게', b: '롱코트·와이드 팬츠 등 여유있게', aB: 1, bB: 0, aT: 0, bT: 1 },
  { q: '패턴은?', a: '체크·스트라이프·프린트 등 있는 게 좋아', b: '단색이 편하고 깔끔해', aB: 1, bB: 0, aT: 1, bT: 0 },
  { q: '인스타 피드 스타일은?', a: '밝고 화사한 분위기', b: '어둡고 신비로운 무드', aB: 1, bB: 0, aT: 0, bT: 1 },
  { q: '신발 선택은?', a: '플랫폼·힐·부츠 등 개성 있게', b: '운동화·로퍼·단화 등 편하게', aB: 0, bB: 1, aT: 1, bT: 0 },
  { q: '악세서리는?', a: '레이어드·과감한 주얼리', b: '아무것도 안 해도 OK', aB: 1, bB: 0, aT: 1, bT: 0 },
]

type StyleKey = 'Y2K코어' | '로맨틱코어' | '다크코어' | '미니멀코어'

const STYLES: Record<StyleKey, { emoji: string; aura: string; desc: string; style: string; personal: string; beauty: string; color: string }> = {
  'Y2K코어': {
    emoji: '✨', aura: '반짝이는 Y2K 에너지',
    desc: '밝고 컬러풀한 에너지로 2000년대 팝스타 감성을 폭발시켜요. 트렌드에 민감하고 대담한 패션으로 어디서든 시선을 사로잡아요.',
    style: '메탈릭·글리터 소재 / 컬러풀 레이어링 / 미니스커트+부츠 / 배기 팬츠',
    personal: '봄웜 계열 컬러가 잘 어울려요 — 코럴, 피치, 라임 그린',
    beauty: '립: 코럴·베이비핑크 / 글리터 아이섀도 / Y2K 블러셔',
    color: '#7c3aed',
  },
  '로맨틱코어': {
    emoji: '🌸', aura: '사랑스러운 로맨틱 에너지',
    desc: '밝고 여성스러운 에너지가 넘쳐흘러요. 레이스·플리츠·파스텔로 사랑스러운 분위기를 자연스럽게 만들어내요.',
    style: '레이스·플리츠 스커트 / 파스텔 니트 / 리본 디테일 / 플로럴 패턴',
    personal: '여름쿨 또는 봄웜 계열 — 베이비 핑크, 라벤더, 민트',
    beauty: '핑크 계열 메이크업 / 자연스러운 블러셔 / 글로시 립',
    color: '#db2777',
  },
  '다크코어': {
    emoji: '🌑', aura: '신비롭고 엣지 있는 에너지',
    desc: '어둡고 신비로운 에너지가 카리스마를 만들어요. 블랙·딥 버건디·포레스트 그린으로 독보적인 무드를 연출해요.',
    style: '올블랙 레이어링 / 레더 재킷 / 버클·체인 디테일 / 오버사이즈',
    personal: '겨울쿨 계열 — 블랙, 딥 버건디, 차콜, 포레스트 그린',
    beauty: '스모키 아이 / 다크 립 / 매트 피니시',
    color: '#5b21b6',
  },
  '미니멀코어': {
    emoji: '🤍', aura: '절제된 세련함의 에너지',
    desc: '차분하고 절제된 에너지로 고급스러움을 자아내요. 무채색 세트업과 클린 실루엣으로 시간이 지나도 세련된 스타일이에요.',
    style: '무채색 미니멀 세트업 / 클린 실루엣 / 단색 코트 / 베이직 아이템',
    personal: '가을웜 또는 겨울쿨 — 아이보리, 베이지, 그레이, 블랙',
    beauty: '내추럴 메이크업 / 누드 립 / 클린스킨 강조',
    color: '#374151',
  },
}

function getStyle(bright: number, trendy: number): StyleKey {
  if (bright >= 5 && trendy >= 5) return 'Y2K코어'
  if (bright >= 5) return '로맨틱코어'
  if (trendy >= 5) return '다크코어'
  return '미니멀코어'
}

function getTodayCount() {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  const lcg = Math.abs((seed * 1664525 + 1013904223) & 0x7fffffff)
  const base = 4200 + (lcg % 450)
  const block = Math.floor(d.getHours() / 8)
  return (base + (block >= 1 ? 380 + (lcg % 180) : 0) + (block >= 2 ? 460 + ((lcg >> 4) % 270) : 0)).toLocaleString()
}

export default function StylePage() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'contact' | 'result'>('intro')
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState({ B: 0, T: 0 })
  const [styleKey, setStyleKey] = useState<StyleKey>('미니멀코어')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const count = getTodayCount()

  function pick(a: boolean) {
    const q = QUIZ[round]
    const newB = scores.B + (a ? q.aB : q.bB)
    const newT = scores.T + (a ? q.aT : q.bT)
    const newScores = { B: newB, T: newT }
    setScores(newScores)
    if (round + 1 >= QUIZ.length) {
      setStyleKey(getStyle(newB, newT))
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
        body: JSON.stringify({ app: 'style', name, phone, email, result: styleKey, marketing }),
      })
    } catch {}
    setSaving(false)
    setStep('result')
  }

  const st = STYLES[styleKey]
  const progress = (round / QUIZ.length) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#faf5ff,#ede9fe,#ddd6fe)', fontFamily: '"Apple SD Gothic Neo",system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>✨</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#7c3aed', margin: 0 }}>점운 추구미</h1>
          <p style={{ color: '#6d28d9', fontSize: 14, margin: '6px 0 0' }}>8문항으로 나의 패션 코어를 찾아드려요</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 10 }}>
            <span style={{ background: '#ede9fe', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>🆓 무료</span>
          </div>
        </div>

        {step === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(124,58,237,0.1)' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>💅</div>
              <p style={{ color: '#374151', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                두 가지 중 더 나다운 걸 고르면<br />나의 패션 코어가 나와요
              </p>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {(['✨ Y2K코어', '🌸 로맨틱코어', '🌑 다크코어', '🤍 미니멀코어'] as const).map(g => (
                  <span key={g} style={{ background: '#faf5ff', borderRadius: 99, padding: '4px 10px', fontSize: 12, color: '#7c3aed' }}>{g}</span>
                ))}
              </div>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 10 }}>오늘 <strong>{count}명</strong>이 추구미를 찾았어요</p>
            </div>
            <button onClick={() => setStep('quiz')}
              style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, cursor: 'pointer', color: 'white', fontWeight: 800 }}>
              ✨ 추구미 찾기
            </button>

            <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 12, lineHeight: 1.6 }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>

            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { href: '/battle', icon: '❤️', label: '이상형월드컵', badge: '무료' },
                { href: '/mbti', icon: '🧠', label: 'MBTI', badge: '990원' },
                { href: '/gunghap', icon: '💑', label: '궁합', badge: '990원' },
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

        {step === 'quiz' && (
          <div>
            <div style={{ background: '#ddd6fe', borderRadius: 99, height: 8, marginBottom: 8, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', height: '100%', width: `${progress}%`, borderRadius: 99, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: 12, color: '#7c3aed', textAlign: 'right', marginBottom: 20 }}>{round + 1}/8</div>

            <div style={{ background: 'white', borderRadius: 20, padding: '24px', marginBottom: 16, boxShadow: '0 4px 20px rgba(124,58,237,0.1)', textAlign: 'center' }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>{QUIZ[round].q}</p>
            </div>

            <button onClick={() => pick(true)}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #ddd6fe', borderRadius: 14, padding: '18px', marginBottom: 12, fontSize: 14, cursor: 'pointer', fontWeight: 700, color: '#374151' }}>
              {QUIZ[round].a}
            </button>
            <button onClick={() => pick(false)}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #ddd6fe', borderRadius: 14, padding: '18px', fontSize: 14, cursor: 'pointer', fontWeight: 700, color: '#374151' }}>
              {QUIZ[round].b}
            </button>
          </div>
        )}

        {step === 'contact' && (
          <div style={{ background: 'white', borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 20px rgba(124,58,237,0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>{STYLES[styleKey].emoji}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#7c3aed', marginTop: 8 }}>{styleKey} 스타일!</div>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>결과를 저장하고 무료로 확인해요</p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이름 또는 별명 (선택)</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="이름 입력"
                style={{ width: '100%', border: '1.5px solid #ddd6fe', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: '#7c3aed', fontWeight: 700, display: 'block', marginBottom: 6 }}>전화번호 ★ 필수</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" type="tel"
                style={{ width: '100%', border: '1.5px solid #ddd6fe', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: '#374151', fontWeight: 700, display: 'block', marginBottom: 6 }}>이메일 (선택)</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" type="email"
                style={{ width: '100%', border: '1.5px solid #ddd6fe', borderRadius: 12, padding: '12px 14px', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>[필수] 개인정보 수집·이용 동의 — 서비스 제공 목적으로 전화번호를 수집합니다</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
              <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>[선택] 마케팅 정보 수신 동의</span>
            </div>
            {error && <p style={{ color: '#7c3aed', fontSize: 13, marginBottom: 10 }}>{error}</p>}
            <button onClick={submit} disabled={saving}
              style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, color: 'white', fontWeight: 800, cursor: 'pointer' }}>
              {saving ? '저장 중...' : '✨ 결과 보기'}
            </button>
          </div>
        )}

        {step === 'result' && (
          <div>
            <div style={{ background: `linear-gradient(135deg,${st.color},#7c3aed)`, borderRadius: 24, padding: '32px 24px', marginBottom: 14, color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>{st.emoji}</div>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>나의 패션 코어</div>
              <div style={{ fontSize: 30, fontWeight: 900 }}>{styleKey}</div>
              <div style={{ fontSize: 15, opacity: 0.9, marginTop: 6 }}>{st.aura}</div>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(124,58,237,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', marginBottom: 8 }}>💫 나의 스타일 에너지</div>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: 0 }}>{st.desc}</p>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(124,58,237,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', marginBottom: 8 }}>👗 추천 스타일링</div>
              <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{st.style}</p>
            </div>

            <div style={{ background: 'white', borderRadius: 18, padding: '20px', marginBottom: 12, boxShadow: '0 4px 16px rgba(124,58,237,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', marginBottom: 8 }}>🎨 퍼스널 컬러 팁</div>
              <p style={{ fontSize: 14, color: '#374151', margin: 0, marginBottom: 8 }}>{st.personal}</p>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', marginBottom: 6 }}>💄 메이크업 스타일</div>
              <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>{st.beauty}</p>
            </div>

            <div style={{ background: '#faf5ff', borderRadius: 14, padding: '12px 16px', marginBottom: 16, textAlign: 'center', fontSize: 13, color: '#6d28d9', border: '1.5px solid #ddd6fe' }}>
              오늘 추구미 찾은 사람 <strong>{count}명</strong> ✨
            </div>

            <button onClick={() => { setStep('intro'); setRound(0); setScores({ B: 0, T: 0 }); setName(''); setPhone(''); setEmail(''); }}
              style={{ display: 'block', width: '100%', background: 'white', border: '2px solid #7c3aed', borderRadius: 14, padding: '14px', fontSize: 15, cursor: 'pointer', color: '#7c3aed', fontWeight: 700, marginBottom: 10 }}>
              🔄 다시 해보기
            </button>

            <div style={{ background: '#faf5ff', borderRadius: 18, padding: '20px', marginBottom: 10, border: '1.5px dashed #ddd6fe', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔮</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#7c3aed', marginBottom: 6 }}>사주로 보는 오행 기질 · 성공운</div>
              <div style={{ fontSize: 12, color: '#6d28d9', marginBottom: 14 }}>나의 오행 타입 + 올해 운세 흐름</div>
              <a href="/main-v2" style={{ display: 'block', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: 12, padding: '13px', fontSize: 14, color: 'white', fontWeight: 700, textDecoration: 'none' }}>
                🔮 사주 오행 기질 보기 →
              </a>
            </div>

            <div style={{ textAlign: 'center', fontSize: 11, color: '#a78bfa', marginTop: 8 }}>
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
