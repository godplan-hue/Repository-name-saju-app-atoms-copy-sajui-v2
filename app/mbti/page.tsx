"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Dim = "EI" | "SN" | "TF" | "JP";

const QUESTIONS: Array<{ text: string; dim: Dim; sub: string }> = [
  // E/I
  { text: "새로운 사람을 만나면 에너지가 생긴다", dim: "EI", sub: "사회적 에너지" },
  { text: "혼자만의 시간이 있어야 충전이 된다", dim: "EI", sub: "사회적 에너지" },
  { text: "생각은 말하면서 정리되는 편이다", dim: "EI", sub: "표현 방식" },
  { text: "조용한 1대1 대화가 단체 모임보다 편하다", dim: "EI", sub: "표현 방식" },
  // S/N
  { text: "현재보다 미래의 가능성에 더 설레는 편이다", dim: "SN", sub: "정보 처리" },
  { text: "직감이나 영감을 중요하게 여긴다", dim: "SN", sub: "정보 처리" },
  { text: "상상보다 실제 경험과 증거를 더 믿는다", dim: "SN", sub: "사실 vs 가능성" },
  { text: "세부사항보다 전체적인 그림을 먼저 본다", dim: "SN", sub: "사실 vs 가능성" },
  // T/F
  { text: "결정할 때 논리와 원칙을 먼저 따진다", dim: "TF", sub: "의사결정" },
  { text: "갈등 상황에서 감정보다 사실관계가 먼저다", dim: "TF", sub: "의사결정" },
  { text: "상대 감정이 상할까봐 직설적으로 말하기 어렵다", dim: "TF", sub: "관계 방식" },
  { text: "누군가 슬퍼하면 이유 불문 먼저 위로하고 싶다", dim: "TF", sub: "관계 방식" },
  // J/P
  { text: "할 일은 미리 계획하고 순서대로 처리한다", dim: "JP", sub: "생활 방식" },
  { text: "마감 전날보다 여유롭게 미리 끝내는 게 좋다", dim: "JP", sub: "생활 방식" },
  { text: "즉흥적인 변화나 새로운 계획이 오히려 신난다", dim: "JP", sub: "유연성" },
  { text: "여러 선택지를 열어두는 것이 편하다", dim: "JP", sub: "유연성" },
];

const DIRS: Array<1 | -1> = [1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, -1];

const ANSWERS = [
  { label: "매우 그렇다", val: 2 },
  { label: "그렇다", val: 1 },
  { label: "보통", val: 0 },
  { label: "그렇지 않다", val: -1 },
  { label: "매우 그렇지 않다", val: -2 },
];

const SAMPLE_TYPES = [
  { type: "INFJ", name: "옹호자", oh: "목", color: "#22c55e", desc: "깊은 통찰력과 공감력" },
  { type: "ENTJ", name: "통솔자", oh: "금", color: "#94a3b8", desc: "타고난 리더십" },
  { type: "ENFP", name: "활동가", oh: "목", color: "#22c55e", desc: "열정적인 자유 영혼" },
  { type: "ISTJ", name: "현실주의자", oh: "토", color: "#f59e0b", desc: "신뢰와 책임감의 상징" },
];

export default function MbtiPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "quiz">("intro");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(16).fill(99));
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnswer = (val: number) => {
    if (selected !== null) return;
    setSelected(val);
    const newAnswers = [...answers];
    newAnswers[current] = val;
    setTimeout(() => {
      setAnswers(newAnswers);
      setSelected(null);
      if (current < 15) {
        setCurrent(current + 1);
      } else {
        submit(newAnswers);
      }
    }, 280);
  };

  const submit = async (finalAnswers: number[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/mbti/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers, userName, phone: phone.replace(/\D/g, ""), email }),
      });
      const data = await res.json();
      if (data.id) {
        window.location.href = `/mbti/result/${data.id}`;
      } else {
        setError("분석 중 오류가 발생했습니다.");
        setLoading(false);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#07000f", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    btn: { width: "100%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer" },
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 20, animation: "spin 1.5s linear infinite" }}>🔮</div>
        <p style={{ fontSize: 16, color: "#c4b5fd" }}>사주와 MBTI를 연결하는 중...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (step === "quiz") {
    const q = QUESTIONS[current];
    const progress = ((current) / 16) * 100;

    return (
      <div style={S.wrap}>
        {/* 상단 프로그레스 */}
        <div style={{ position: "sticky", top: 0, background: "#07000f", borderBottom: "1px solid rgba(255,255,255,0.05)", zIndex: 10 }}>
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <button onClick={() => { if (current > 0) setCurrent(current - 1); else setStep("intro"); }}
                style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer", padding: 0 }}>
                ← 이전
              </button>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{current + 1} / 16</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>
              <div style={{ height: 4, background: "linear-gradient(90deg,#7c3aed,#a855f7)", borderRadius: 4, width: `${progress}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px 80px" }}>
          {/* 카테고리 뱃지 */}
          <p style={{ fontSize: 11, color: "#7c3aed", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 20, fontWeight: 700 }}>
            {q.sub}
          </p>

          {/* 질문 */}
          <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.4, marginBottom: 36, color: "#f3e8ff" }}>
            {q.text}
          </h2>

          {/* 답변 버튼 */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {ANSWERS.map((a) => {
              const isSelected = selected === a.val;
              return (
                <button
                  key={a.val}
                  onClick={() => handleAnswer(a.val)}
                  disabled={selected !== null}
                  style={{
                    padding: "15px 20px",
                    borderRadius: 14,
                    border: `2px solid ${isSelected ? "#a855f7" : "rgba(255,255,255,0.1)"}`,
                    background: isSelected ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.04)",
                    color: isSelected ? "#f3e8ff" : "#d1d5db",
                    fontSize: 15,
                    fontWeight: isSelected ? 700 : 400,
                    cursor: selected !== null ? "default" : "pointer",
                    textAlign: "left" as const,
                    transition: "all 0.15s",
                  }}
                >
                  {a.label}
                </button>
              );
            })}
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 13, marginTop: 16 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      {/* 히어로 */}
      <div style={{ background: "linear-gradient(180deg,#12003a 0%,#07000f 100%)", paddingBottom: 40 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
          <Link href="/main-v2" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 24, textAlign: "left" }}>← 점운 홈</Link>

          <div style={{ fontSize: 60, marginBottom: 16 }}>🔮</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.3 }}>
            사주로 보는 나의 진짜<br />
            <span style={{ background: "linear-gradient(135deg,#a855f7,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              MBTI 성격 유형
            </span>
          </h1>
          <p style={{ color: "#c4b5fd", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
            16문항 · 2분 완료 · 완전 무료<br />
            사주 오행 기질과 MBTI를 함께 분석해드립니다
          </p>

          {/* 샘플 유형 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
            {SAMPLE_TYPES.map(t => (
              <div key={t.type} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${t.color}33`, borderRadius: 14, padding: "12px", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: t.color }}>{t.type}</span>
                  <span style={{ fontSize: 10, color: "#6b7280", background: `${t.color}22`, padding: "1px 6px", borderRadius: 8 }}>오행 {t.oh}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 2px", color: "#f3f4f6" }}>{t.name}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>

          {/* 3단계 설명 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[
              { n: "1", t: "16문항 답변", s: "나에게 솔직하게" },
              { n: "2", t: "유형 분석", s: "MBTI + 오행" },
              { n: "3", t: "사주 연결", s: "더 깊은 분석" },
            ].map(st => (
              <div key={st.n} style={{ flex: 1, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#a855f7", margin: "0 0 2px" }}>{st.n}단계</p>
                <p style={{ fontSize: 12, fontWeight: 700, margin: "0 0 2px", color: "#e9d5ff" }}>{st.t}</p>
                <p style={{ fontSize: 10, color: "#7c3aed", margin: 0 }}>{st.s}</p>
              </div>
            ))}
          </div>

          {/* 이름·전번 입력 */}
          <div style={{ marginBottom: 10 }}>
            <input
              style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const }}
              placeholder="이름 또는 별명 (선택)"
              value={userName}
              onChange={e => setUserName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: `1px solid ${error ? "rgba(248,113,113,0.6)" : "rgba(168,85,247,0.3)"}`, borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const }}
              placeholder="전화번호 (필수) — 010-0000-0000"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(""); }}
              inputMode="tel"
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <input
              style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const }}
              placeholder="이메일 (선택) — example@email.com"
              inputMode="email" type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }}
                style={{ marginTop: 3, accentColor: "#a855f7", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>
                <strong style={{ color: "#e5e7eb" }}>[필수] 개인정보 수집·이용 및 마케팅 수신 동의</strong><br />
                점운(jeomun.com)이 전화번호·이메일을 수집하여 운세 정보 및 혜택 안내에 활용하며, 3년간 보유 후 파기합니다.<br />언제든지 수신거부 가능합니다.
              </span>
            </label>
          </div>
          {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 10 }}>{error}</p>}

          <button onClick={() => {
            const clean = phone.replace(/\D/g, "");
            if (clean.length < 10) { setError("전화번호를 입력해주세요."); return; }
            if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
            setStep("quiz");
          }} style={S.btn}>
            테스트 시작하기 (2분) →
          </button>
          <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>완전 무료 · 회원가입 불필요</p>
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(168,85,247,0.55)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.02em" }}>
            🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
          </p>
        </div>
      </div>

      {/* 특징 설명 */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 24px 60px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 900, marginBottom: 20, color: "#e9d5ff" }}>점운 MBTI만의 차별점</h2>
        {[
          { icon: "⚡", t: "16문항으로 2분 완성", s: "60문항 필요 없어요 — 핵심만 담았습니다" },
          { icon: "🌿", t: "사주 오행 기질 연결", s: "MBTI와 오행의 교차점으로 나를 더 깊이 이해해요" },
          { icon: "🎴", t: "오늘의 에너지 카드 뽑기", s: "나의 유형에 맞는 오늘의 메시지를 뽑아보세요" },
          { icon: "📤", t: "결과 공유", s: "카카오톡으로 친구에게 공유하고 비교해보세요" },
        ].map(f => (
          <div key={f.t} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <p style={{ fontWeight: 700, margin: "0 0 3px", fontSize: 14, color: "#f3e8ff" }}>{f.t}</p>
              <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{f.s}</p>
            </div>
          </div>
        ))}

        <button onClick={() => setStep("quiz")} style={{ ...S.btn, marginTop: 16 }}>
          나의 MBTI 알아보기 →
        </button>

      {/* 회사정보 */}
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
  );
}