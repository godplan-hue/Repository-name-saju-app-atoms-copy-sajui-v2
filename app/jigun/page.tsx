"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const QS = [
  {
    q: "하루에 부업에 쓸 수 있는 시간은?",
    emoji: "⏰",
    opts: [
      { label: "30분 이내", sub: "짬짬이만 가능", val: "A" },
      { label: "1~2시간", sub: "퇴근 후 저녁에 가능", val: "B" },
      { label: "3시간 이상", sub: "충분히 집중 가능", val: "C" },
      { label: "전업으로 하고 싶다", sub: "이직·창업 준비 중", val: "D" },
    ],
  },
  {
    q: "시작 자금으로 쓸 수 있는 돈은?",
    emoji: "💰",
    opts: [
      { label: "0원", sub: "돈 없이 시작해야 함", val: "A" },
      { label: "10~50만원", sub: "소액 투자 가능", val: "B" },
      { label: "100만원 이상", sub: "여유 있음", val: "C" },
    ],
  },
  {
    q: "나의 가장 큰 강점은?",
    emoji: "💪",
    opts: [
      { label: "말하기·설득·강의", sub: "사람을 끌어당기는 힘", val: "A" },
      { label: "만들기·영상·디자인", sub: "뭔가 만드는 게 즐겁다", val: "B" },
      { label: "분석·계획·IT", sub: "데이터와 논리로 생각", val: "C" },
      { label: "글쓰기·번역·언어", sub: "언어 능력이 강하다", val: "D" },
    ],
  },
  {
    q: "일할 때 나는?",
    emoji: "🤝",
    opts: [
      { label: "사람들과 함께할 때 에너지가 난다", sub: "사람이 많을수록 신남", val: "A" },
      { label: "혼자 조용히 집중하는 게 편하다", sub: "나만의 공간·시간이 필요", val: "B" },
    ],
  },
  {
    q: "지금 나의 상황은?",
    emoji: "📍",
    opts: [
      { label: "직장 있음 · 부업 원함", sub: "본업 유지하며 추가 수입", val: "A" },
      { label: "이직·사업 전환 준비", sub: "다음 스텝을 고민 중", val: "B" },
      { label: "지금 수입이 없음", sub: "빨리 시작해야 한다", val: "C" },
    ],
  },
  {
    q: "SNS·온라인 활동은?",
    emoji: "📱",
    opts: [
      { label: "인스타·유튜브 자주 씀", sub: "SNS가 익숙하다", val: "A" },
      { label: "배울 의향은 있다", sub: "잘 모르지만 해볼 수 있다", val: "B" },
      { label: "온라인은 잘 모르겠다", sub: "오프라인이 편하다", val: "C" },
    ],
  },
  {
    q: "원하는 수익 방식은?",
    emoji: "📈",
    opts: [
      { label: "당장 이번 달부터 현금", sub: "빨리 돈이 필요하다", val: "A" },
      { label: "3~6개월 준비, 나중에 크게", sub: "기반 쌓아 크게 터진다", val: "B" },
    ],
  },
  {
    q: "가장 끌리는 분야는?",
    emoji: "🎯",
    opts: [
      { label: "디지털·IT·AI", sub: "기술로 돈 버는 것", val: "A" },
      { label: "영상·콘텐츠·SNS", sub: "나를 보여주는 것", val: "B" },
      { label: "강의·코칭·멘토링", sub: "내 경험을 나누는 것", val: "C" },
      { label: "판매·사입·유통", sub: "사고파는 게 재미있다", val: "D" },
      { label: "글쓰기·번역·전문기술", sub: "내 전문성을 파는 것", val: "E" },
    ],
  },
];

function calcRecommended(ans: string[]): string[] {
  const s: Record<string, number> = {
    content: 0, lecture: 0, shop: 0, translate: 0,
    writing: 0, consulting: 0, design: 0, ai: 0, food: 0, realestate: 0,
  };

  const t = ans[0];
  if (t === "A") { s.writing += 2; s.translate += 2; s.shop += 1; }
  if (t === "B") { s.content += 2; s.design += 2; s.writing += 1; s.translate += 1; }
  if (t === "C") { s.lecture += 2; s.consulting += 2; s.ai += 2; }
  if (t === "D") { s.lecture += 3; s.consulting += 3; s.realestate += 2; s.ai += 2; }

  const m = ans[1];
  if (m === "A") { s.content += 2; s.writing += 2; s.translate += 2; s.consulting += 2; s.ai += 2; }
  if (m === "B") { s.design += 2; s.lecture += 2; s.shop += 2; s.food += 1; }
  if (m === "C") { s.realestate += 3; s.food += 2; s.shop += 2; }

  const sk = ans[2];
  if (sk === "A") { s.lecture += 3; s.consulting += 3; s.content += 2; }
  if (sk === "B") { s.content += 3; s.design += 3; s.food += 1; }
  if (sk === "C") { s.ai += 3; s.realestate += 2; s.consulting += 2; }
  if (sk === "D") { s.writing += 3; s.translate += 3; }

  const so = ans[3];
  if (so === "A") { s.consulting += 2; s.lecture += 2; s.food += 2; s.content += 1; }
  if (so === "B") { s.writing += 2; s.ai += 2; s.translate += 2; s.design += 1; s.shop += 1; }

  const sit = ans[4];
  if (sit === "A") { s.content += 2; s.translate += 2; s.writing += 2; s.design += 1; }
  if (sit === "B") { s.consulting += 2; s.lecture += 2; s.ai += 2; s.realestate += 1; }
  if (sit === "C") { s.food += 3; s.shop += 2; s.content += 1; s.writing += 1; }

  const on = ans[5];
  if (on === "A") { s.content += 3; s.design += 2; s.shop += 2; }
  if (on === "B") { s.content += 1; s.design += 1; s.ai += 1; s.shop += 1; }
  if (on === "C") { s.consulting += 2; s.food += 2; s.realestate += 2; }

  const inc = ans[6];
  if (inc === "A") { s.food += 3; s.consulting += 2; s.translate += 2; s.design += 1; }
  if (inc === "B") { s.content += 3; s.lecture += 2; s.ai += 2; s.realestate += 2; s.shop += 1; }

  const f = ans[7];
  if (f === "A") { s.ai += 4; s.design += 2; }
  if (f === "B") { s.content += 4; s.design += 2; }
  if (f === "C") { s.lecture += 4; s.consulting += 2; }
  if (f === "D") { s.shop += 4; s.food += 2; s.realestate += 1; }
  if (f === "E") { s.writing += 4; s.translate += 3; }

  return Object.entries(s).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
}

export default function JigunPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.name) setName(p.name);
      if (p.phone) setPhone(p.phone);
      if (p.email) setEmail(p.email);
    } catch {}
  }, []);

  const qIdx = step - 1;

  function selectOpt(val: string) {
    const next = [...answers, val];
    setAnswers(next);
    if (step < 8) {
      setStep(step + 1);
    } else {
      setStep(9);
    }
  }

  function goBack() {
    setAnswers(answers.slice(0, -1));
    setStep(step - 1);
  }

  async function submit() {
    if (!name.trim()) { setErr("이름을 입력해주세요."); return; }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setErr("전화번호를 입력해주세요. (필수사항)"); return; }
    const recommended = calcRecommended(answers);
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/career/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "",
          phone: phone || "",
          email: email || "",
          birthYear: birthYear ? parseInt(birthYear) : null,
          birthMonth: null,
          birthDay: null,
          timeAvail: ["A", "B", "C", "D"].indexOf(answers[0]),
          skill: ["A", "B", "C", "D"].indexOf(answers[2]),
          speed: answers[6] === "A" ? 0 : 1,
          career: ["A", "B", "C"].indexOf(answers[4]),
          recommended,
        }),
      });
      const data = await res.json();
      if (data.id) {
        window.location.href = `/jigun/result/${data.id}`;
      } else {
        setErr("분석 실패. 다시 시도해주세요.");
      }
    } catch {
      setErr("네트워크 오류. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030014", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "white" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 85% 55% at 50% -8%,rgba(124,58,237,0.16),transparent 55%)" }} />

      <nav style={{ position: "relative", zIndex: 10, borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/main-v2" style={{ fontSize: 17, fontWeight: 900, color: "#a78bfa", textDecoration: "none" }}>점운</Link>
        <span style={{ fontSize: 14, fontWeight: 900, color: "white" }}>💼 직운</span>
        <Link href="/main-v2" style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa", borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 700, textDecoration: "none", border: "1px solid rgba(124,58,237,0.4)" }}>사주 보기</Link>
      </nav>

      <div style={{ position: "relative", zIndex: 5, maxWidth: 520, margin: "0 auto", padding: "28px 20px" }}>

        {/* ── INTRO ── */}
        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>💼</div>
            <div style={{ display: "inline-block", background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
              직운 — 직업 × 운세
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 14, letterSpacing: "0.02em" }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.35, marginBottom: 12 }}>
              나에게 딱 맞는<br /><span style={{ color: "#a78bfa" }}>부업이 따로 있습니다</span>
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, marginBottom: 6 }}>
              이직·부업·사업 고민 중이신가요?<br />
              8가지 질문으로 나에게 맞는 부업 TOP 3를 추천드려요
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 32 }}>생년 입력 시 사주 오행으로 천직까지 분석</p>

            <button
              onClick={() => setStep(1)}
              style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 28, padding: "16px 44px", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 24px rgba(124,58,237,0.4)", marginBottom: 14 }}
            >
              지금 바로 찾아보기 →
            </button>

            <div style={{ marginBottom: 36 }}>
              <button
                onClick={() => {
                  const url = "https://jeomun.com/jigun";
                  if (navigator.share) navigator.share({ title: "💼 나에게 맞는 부업 찾기 — 직운", text: "8가지 질문으로 나에게 딱 맞는 부업 TOP 3를 찾아봤어요!", url });
                  else navigator.clipboard?.writeText(url).then(() => alert("링크가 복사됐어요! 친구에게 공유해보세요 😊"));
                }}
                style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#1a1a00", border: "none", borderRadius: 28, padding: "13px 36px", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(251,191,36,0.45)" }}
              >
                📤 친구에게 공유하기
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 32 }}>
              {[
                { n: "8문항", d: "핵심만 뽑은 질문" },
                { n: "10가지", d: "부업 유형 매칭" },
                { n: "무료", d: "생년 입력 시 천직" },
              ].map(item => (
                <div key={item.n} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#a78bfa", marginBottom: 4 }}>{item.n}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{item.d}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px", textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", margin: "0 0 12px" }}>이런 고민에 딱 맞아요</p>
              {[
                "이직해야 할지 부업을 해야 할지 모르겠다",
                "나한테 맞는 부업이 뭔지 전혀 모르겠다",
                "돈 없이 시작할 수 있는 부업이 있을까?",
                "내 사주로 어떤 직업이 천직인지 알고 싶다",
              ].map(t => (
                <p key={t} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 8px", paddingLeft: 14, borderLeft: "2px solid rgba(124,58,237,0.4)" }}>
                  💭 {t}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {step >= 1 && step <= 8 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button
                onClick={goBack}
                style={{ background: "none", border: "none", color: step > 1 ? "rgba(255,255,255,0.45)" : "transparent", fontSize: 22, cursor: step > 1 ? "pointer" : "default", padding: "0 4px" }}
              >‹</button>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 10, height: 5, margin: "0 10px" }}>
                <div style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)", height: "100%", borderRadius: 10, width: `${(step / 8) * 100}%`, transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{step} / 8</span>
            </div>

            <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 8 }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>{QS[qIdx].emoji}</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.5, margin: 0 }}>{QS[qIdx].q}</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {QS[qIdx].opts.map(opt => (
                <button
                  key={opt.val}
                  onClick={() => selectOpt(opt.val)}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "16px 20px", cursor: "pointer", textAlign: "left", color: "white", transition: "all 0.15s" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.25)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.6)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── BIO FORM ── */}
        {step === 9 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 8 }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>✨</div>
              <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>거의 다 왔어요!</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, margin: 0 }}>
                이름과 출생연도를 입력하면<br />
                <strong style={{ color: "white" }}>사주 오행으로 천직까지</strong> 분석해드려요
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, display: "block", marginBottom: 6 }}>이름 <span style={{ color: "#ec4899" }}>★ 필수</span></label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="홍길동"
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, display: "block", marginBottom: 3 }}>
                  출생연도 <span style={{ color: "#ec4899" }}>★ 사주 천직 분석에 필요</span>
                </label>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "0 0 6px" }}>입력하면 오행으로 천직까지 분석해드려요</p>
                <input
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value)}
                  placeholder="예: 1990"
                  maxLength={4}
                  inputMode="numeric"
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#ec4899" }}>★ 필수사항</span></label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01012345678"
                  inputMode="tel"
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, display: "block", marginBottom: 6 }}>이메일 (선택)</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  inputMode="email"
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {err && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{err}</p>}

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: "#7c3aed", width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                <strong style={{ color: "rgba(255,255,255,0.75)" }}>[필수] 개인정보 수집·이용 동의</strong><br />
                수집 항목: 이름(선택), 출생연도, 전화번호(선택), 이메일(선택) /<br />목적: 부업 추천 서비스 제공 / 보관 기간: 3년 후 파기
              </span>
            </label>

            <button
              onClick={submit}
              disabled={loading || !agreed}
              style={{ width: "100%", background: agreed ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "rgba(255,255,255,0.1)", color: "white", border: "none", borderRadius: 20, padding: "16px", fontSize: 17, fontWeight: 900, cursor: (loading || !agreed) ? "default" : "pointer", opacity: (loading || !agreed) ? 0.5 : 1, marginBottom: 12, transition: "all 0.2s" }}
            >
              {loading ? "분석 중..." : "결과 확인하기 →"}
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              수집된 정보는 서비스 제공 외 목적으로 사용되지 않습니다
            </p>
          </div>
        )}

      </div>

      {/* 푸터 — 인트로 화면에서만 표시 */}
      {step === 0 && <footer style={{ padding: "32px 20px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 360, margin: "0 auto", padding: "18px 16px", borderRadius: 20, background: "rgba(167,139,250,0.18)", border: "1.5px solid rgba(167,139,250,0.4)" }}>
          <p style={{ color: "#c4b5fd", fontSize: 11, fontWeight: 700, margin: "0 0 8px" }}>© 2026 점운 · AI 동양 운세 분석</p>
          <div style={{ color: "#ddd6fe", fontSize: 10.5, fontWeight: 600, lineHeight: 1.8, marginBottom: 12 }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
            <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
            <p style={{ margin: "2px 0 0", color: "#fca5a5", fontWeight: 900 }}>※ 전화 문의는 받지 않습니다.<br />카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "6px 16px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 800, fontSize: 11 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "6px 16px", border: "1.5px solid #c4b5fd", borderRadius: 20, color: "#c4b5fd", textDecoration: "none", fontWeight: 800, fontSize: 11 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 11 }}>
            <a href="/terms" style={{ color: "#c4b5fd", textDecoration: "none", fontWeight: 600 }}>이용약관</a>
            <span style={{ color: "rgba(196,181,253,0.3)", margin: "0 8px" }}>|</span>
            <a href="/privacy" style={{ color: "#c4b5fd", textDecoration: "none", fontWeight: 600 }}>개인정보처리방침</a>
            <span style={{ color: "rgba(196,181,253,0.3)", margin: "0 8px" }}>|</span>
            <a href="/refund" style={{ color: "#c4b5fd", textDecoration: "none", fontWeight: 600 }}>환불정책</a>
          </div>
        </div>
      </footer>}
    </div>
  );
}
