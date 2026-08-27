"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getTodayCount() {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const lcg = ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
  const base = 520 + (lcg % 260);
  const block = new Date().getHours() < 8 ? 0 : new Date().getHours() < 16 ? 1 : 2;
  return (base + (block >= 1 ? 340 + (lcg % 180) : 0) + (block >= 2 ? 410 + ((lcg >> 4) % 240) : 0)).toLocaleString();
}

type ChoiceOpt = { value: string; label: string };
type QuizStep =
  | { type: "choice"; key: string; title: string; sub?: string; options: ChoiceOpt[] }
  | { type: "text"; key: string; title: string; sub?: string; placeholder: string }
  | { type: "multi"; key: string; title: string; sub?: string; options: ChoiceOpt[]; max: number };

const QUIZ_STEPS: QuizStep[] = [
  {
    type: "choice", key: "relationType", title: "그 사람과는 어떤 사이인가요?",
    options: [
      { value: "썸", label: "썸 타는 사이" },
      { value: "연인", label: "연인" },
      { value: "전연인", label: "전 연인" },
      { value: "친구", label: "친구" },
      { value: "직장동료", label: "직장 동료" },
      { value: "가족", label: "가족" },
      { value: "기타", label: "기타" },
    ],
  },
  {
    type: "text", key: "targetNickname", title: "그 사람을 뭐라고 부를까요?",
    sub: "실제 이름 대신 별명으로 입력해도 됩니다", placeholder: "예) 그 사람, 민지, ㅅㅎ",
  },
  {
    type: "choice", key: "contactChange", title: "요즘 연락 빈도는 예전과 비교해 어떤가요?",
    options: [
      { value: "많아짐", label: "예전보다 많아졌다" },
      { value: "비슷", label: "예전과 비슷하다" },
      { value: "조금줄음", label: "조금 줄었다" },
      { value: "많이줄음", label: "많이 줄었다" },
      { value: "거의없음", label: "거의 연락이 없다" },
      { value: "모르겠음", label: "잘 모르겠다" },
    ],
  },
  {
    type: "choice", key: "contactInitiative", title: "먼저 연락하는 쪽은 주로 누구인가요?",
    options: [
      { value: "거의상대방", label: "거의 상대방이 먼저" },
      { value: "상대방조금많음", label: "상대방이 조금 더 많이" },
      { value: "비슷", label: "둘이 비슷하다" },
      { value: "내가조금많음", label: "내가 조금 더 많이" },
      { value: "거의나", label: "거의 내가 먼저" },
      { value: "연락자체거의없음", label: "먼저 연락 자체가 거의 없다" },
    ],
  },
  {
    type: "choice", key: "responseChange", title: "답장 속도는 예전과 비교해 어떤가요?",
    options: [
      { value: "빨라짐", label: "예전보다 빨라졌다" },
      { value: "비슷", label: "예전과 비슷하다" },
      { value: "조금느려짐", label: "조금 느려졌다" },
      { value: "많이느려짐", label: "많이 느려졌다" },
      { value: "짧아짐", label: "속도는 비슷한데 내용이 짧아졌다" },
      { value: "모르겠음", label: "잘 모르겠다" },
    ],
  },
  {
    type: "choice", key: "meetingChange", title: "만남(약속)은 요즘 어떤 편인가요?",
    options: [
      { value: "상대방이먼저제안", label: "상대방이 먼저 만나자고 한다" },
      { value: "비슷", label: "예전과 비슷하게 만난다" },
      { value: "내가더제안", label: "내가 더 자주 제안한다" },
      { value: "약속자주미룸", label: "약속이 자주 미뤄진다" },
      { value: "거의안만남", label: "거의 만나지 못하고 있다" },
      { value: "해당없음", label: "만남 자체가 해당 없는 관계다" },
    ],
  },
  {
    type: "choice", key: "relationFeeling", title: "요즘 이 관계, 체감상 어떤 느낌인가요?",
    options: [
      { value: "더가까워진느낌", label: "더 가까워진 느낌" },
      { value: "그대로", label: "예전과 그대로인 느낌" },
      { value: "조금멀어진느낌", label: "조금 멀어진 느낌" },
      { value: "많이멀어진느낌", label: "많이 멀어진 느낌" },
      { value: "나만노력하는느낌", label: "나만 노력하는 느낌" },
      { value: "상대방마음모르겠다", label: "상대방 마음을 모르겠다" },
    ],
  },
  {
    type: "multi", key: "mainQuestions", title: "가장 궁금한 건 무엇인가요?", sub: "최대 2개까지 고를 수 있어요", max: 2,
    options: [
      { value: "관심줄었을까", label: "관심이 줄어든 걸까?" },
      { value: "내가너무먼저다가가나", label: "내가 너무 먼저 다가가는 걸까?" },
      { value: "멀어지고있나", label: "정말 멀어지고 있는 걸까?" },
      { value: "다시가까워질수있나", label: "다시 가까워질 수 있을까?" },
      { value: "먼저연락해도될까", label: "먼저 연락해도 될까?" },
      { value: "유지해야할까", label: "이 관계, 유지해야 할까?" },
    ],
  },
];

const LOADING_TEXTS = [
  "최근 관계 변화를 확인하는 중...",
  "연락 주도권을 분석하는 중...",
  "관계 온도를 계산하는 중...",
  "마지막 신호를 확인하는 중...",
  "분석 완료 ✨",
];

export default function GwangyeoradarPage() {
  const count = getTodayCount();
  const [step, setStep] = useState<"intro" | "quiz" | "contact" | "loading">("intro");
  const [quizIdx, setQuizIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hpField, setHpField] = useState(""); // 허니팟 — 봇 방지용 숨김 필드
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.name) setName(p.name);
      if (p.phone) setPhone(p.phone);
    } catch {}
  }, []);

  const S = {
    wrap: { minHeight: "100vh", background: "#071019", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    row: { marginBottom: 14 },
    btn: { width: "100%", background: "linear-gradient(135deg,#0891b2,#0ea5e9)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer" },
  };

  const shareLanding = () => {
    const url = "https://jeomun.com/gwangyeoradar";
    const text = "요즘 나와 멀어진 사람이 있나요? 내가 놓치고 있던 관계 신호를 무료로 찾아보세요 📡";
    const k = (window as any).Kakao;
    if (k?.isInitialized() && k?.Share) {
      try {
        k.Share.sendDefault({
          objectType: "feed",
          content: { title: "📡 연락통신 — 관계 신호 분석", description: text, link: { mobileWebUrl: url, webUrl: url } },
          buttons: [{ title: "바로 보기", link: { mobileWebUrl: url, webUrl: url } }],
        });
        return;
      } catch {}
    }
    window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(text + "\n" + url)}`;
  };

  const goQuiz = () => { setQuizIdx(0); setAnswers({}); setStep("quiz"); };

  const pickChoice = (key: string, value: string) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setTimeout(() => {
      if (quizIdx + 1 < QUIZ_STEPS.length) setQuizIdx(quizIdx + 1);
      else setStep("contact");
    }, 180);
  };

  const setText = (key: string, value: string) => setAnswers({ ...answers, [key]: value });

  const nextFromText = () => {
    if (quizIdx + 1 < QUIZ_STEPS.length) setQuizIdx(quizIdx + 1);
    else setStep("contact");
  };

  const toggleMulti = (key: string, value: string, max: number) => {
    const cur: string[] = answers[key] || [];
    let next: string[];
    if (cur.includes(value)) next = cur.filter(v => v !== value);
    else if (cur.length >= max) next = [...cur.slice(1), value];
    else next = [...cur, value];
    setAnswers({ ...answers, [key]: next });
  };

  const nextFromMulti = () => {
    if (quizIdx + 1 < QUIZ_STEPS.length) setQuizIdx(quizIdx + 1);
    else setStep("contact");
  };

  const submit = () => {
    if (hpField) return; // 봇 감지 — 조용히 무시
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
    setError("");
    setStep("loading");
    setLoadingTextIdx(0);

    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      if (idx < LOADING_TEXTS.length) setLoadingTextIdx(idx);
    }, 700);

    (async () => {
      let redirectTo = "/gwangyeoradar";
      try {
        const res = await fetch("/api/gwangyeoradar/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            relationType: answers.relationType || "기타",
            targetNickname: answers.targetNickname || "",
            contactChange: answers.contactChange,
            contactInitiative: answers.contactInitiative,
            responseChange: answers.responseChange,
            meetingChange: answers.meetingChange,
            relationFeeling: answers.relationFeeling,
            mainQuestions: answers.mainQuestions || [],
            name, phone: cleanPhone,
          }),
        });
        const data = await res.json();
        if (data.id) {
          let alreadyUnlocked = false;
          try {
            const u = localStorage.getItem("gwangyeoradar_unlock_until");
            const up = localStorage.getItem("gwangyeoradar_unlock_phone") || "";
            alreadyUnlocked = !!u && Number(u) > Date.now() && !!up && !!cleanPhone && up === cleanPhone;
          } catch {}
          redirectTo = alreadyUnlocked ? `/gwangyeoradar/result/${data.id}` : `/gwangyeoradar/pay?id=${data.id}`;
        } else {
          redirectTo = "";
        }
      } catch {
        redirectTo = "";
      }

      const elapsedMin = 3200;
      setTimeout(() => {
        clearInterval(timer);
        if (!redirectTo) { setStep("contact"); setError("분석 중 오류가 발생했습니다. 다시 시도해주세요."); return; }
        setLoadingTextIdx(LOADING_TEXTS.length - 1);
        setTimeout(() => { window.location.href = redirectTo; }, 350);
      }, elapsedMin);
    })();
  };

  // ── 인트로 ──
  if (step === "intro") {
    return (
      <div style={S.wrap}>
        <div style={{ background: "linear-gradient(180deg, #0c1f2e 0%, #071019 100%)", paddingBottom: 40 }}>
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Link href="/main-v2" style={{ color: "#67e8f9", fontSize: 13, textDecoration: "none" }}>← 점운 홈</Link>
              <button onClick={shareLanding} style={{ fontSize: 12, color: "#67e8f9", fontWeight: 700, background: "rgba(8,145,178,0.15)", border: "1px solid rgba(103,232,249,0.4)", borderRadius: 20, padding: "5px 12px", cursor: "pointer" }}>🔗 공유</button>
            </div>

            <p style={{ fontSize: 12, letterSpacing: "0.12em", color: "#67e8f9", fontWeight: 900, margin: "0 0 10px" }}>📡 연락통신</p>
            <div style={{ fontSize: 60, marginBottom: 14 }}>📡</div>
            <h1 style={{ fontSize: 27, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.35, wordBreak: "keep-all" }}>
              요즘 나와 멀어진<br />
              <span style={{ background: "linear-gradient(135deg,#22d3ee,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                사람이 있나요?
              </span>
            </h1>
            <p style={{ color: "#a5f3fc", fontSize: 15, lineHeight: 1.7, margin: "0 0 28px" }}>
              내가 놓치고 있던 관계 신호를<br />찾아보세요.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
              {["📡 관계 신호 분석", "🔍 연락 패턴 진단", "🎯 27가지 정밀 신호", "📤 공유 가능"].map(t => (
                <span key={t} style={{ background: "rgba(8,145,178,0.25)", border: "1px solid rgba(8,145,178,0.5)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#a5f3fc" }}>{t}</span>
              ))}
            </div>

            <button onClick={goQuiz} style={S.btn}>관계 분석 시작 →</button>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>입력한 정보를 바탕으로 관계 패턴을 분석합니다</p>
            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(103,232,249,0.55)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.02em" }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px" }}>
          {[
            { icon: "📶", title: "연락 패턴 분석", desc: "연락 빈도·답장 속도·주도권을\n종합해서 알려드려요" },
            { icon: "🌡️", title: "관계 온도 측정", desc: "지금 이 관계가 얼마나\n따뜻한지 온도로 보여드려요" },
            { icon: "🧭", title: "놓친 신호 발견", desc: "혼자서는 알아채기 어려운\n신호를 짚어드려요" },
            { icon: "🧾", title: "행동 처방전", desc: "지금 뭘 하면 좋을지\n구체적으로 알려드려요" },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: 15 }}>{f.title}</p>
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px" }}>
          <button onClick={goQuiz} style={S.btn}>관계 분석 시작하기 →</button>
          <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 10, textAlign: "center" }}>오늘 <strong style={{ color: "#22d3ee" }}>{count}</strong>명이 관계 신호를 확인했어요</p>
        </div>

        <footer style={{ padding: "32px 20px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 380, margin: "0 auto", padding: "20px 18px", borderRadius: 20, background: "#050d14", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ color: "#67e8f9", fontSize: 11, fontWeight: 700, margin: "0 0 10px" }}>© 2026 점운 · Powered by 점운</p>
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
    );
  }

  // ── 로딩 ──
  if (step === "loading") {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📡</div>
          <p style={{ color: "#67e8f9", fontSize: 15, fontWeight: 700, minHeight: 24 }}>{LOADING_TEXTS[loadingTextIdx]}</p>
          <div style={{ width: 180, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, margin: "20px auto 0", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((loadingTextIdx + 1) / LOADING_TEXTS.length) * 100}%`, background: "linear-gradient(90deg,#0891b2,#22d3ee)", borderRadius: 4, transition: "width 0.5s" }} />
          </div>
        </div>
      </div>
    );
  }

  // ── 연락처 입력 ──
  if (step === "contact") {
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ paddingTop: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setStep("quiz")} style={{ background: "none", border: "none", color: "#67e8f9", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
            <span style={{ fontSize: 13, color: "#6b7280" }}>마지막 단계</span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>결과를 받을 정보를 입력해주세요</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>전화번호는 결과 보관·잠금 해제에 사용돼요</p>

          <div style={{ background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 20 }}>
            <div style={S.row}>
              <label style={S.label}>이름 또는 별명 (선택)</label>
              <input style={S.input} placeholder="예) 지민" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div style={S.row}>
              <label style={S.label}>전화번호 ★ 필수</label>
              <input style={{ ...S.input, border: `1px solid ${error.includes("전화") ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.15)"}` }}
                placeholder="010-0000-0000" inputMode="tel" value={phone}
                onChange={e => { setPhone(e.target.value); setError(""); }} />
              <input
                type="text" name="website" value={hpField} onChange={e => setHpField(e.target.value)}
                autoComplete="off" tabIndex={-1} aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }}
                style={{ marginTop: 3, accentColor: "#0ea5e9", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>
                <strong style={{ color: "#e5e7eb" }}>[필수] 개인정보 수집·이용 동의</strong><br />
                점운(jeomun.com)이 전화번호를 서비스 제공에 활용하며, 3년간 보유 후 파기합니다.
              </span>
            </label>
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

          <button onClick={submit} style={S.btn}>내 관계 신호 분석하기 📡</button>
          <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 10 }}>무료로 핵심 결과부터 확인할 수 있어요</p>
        </div>
      </div>
    );
  }

  // ── 퀴즈 ──
  const q = QUIZ_STEPS[quizIdx];
  return (
    <div style={S.wrap}>
      <div style={{ ...S.inner, paddingTop: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <button onClick={() => (quizIdx === 0 ? setStep("intro") : setQuizIdx(quizIdx - 1))} style={{ background: "none", border: "none", color: "#67e8f9", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
          <p style={{ fontSize: 12, color: "#67e8f9", fontWeight: 700, margin: 0 }}>{quizIdx + 1} / {QUIZ_STEPS.length}</p>
        </div>
        <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 28 }}>
          <div style={{ height: "100%", width: `${((quizIdx + 1) / QUIZ_STEPS.length) * 100}%`, background: "#0ea5e9", borderRadius: 4, transition: "width 0.3s" }} />
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 6, wordBreak: "keep-all", lineHeight: 1.5 }}>{q.title}</h2>
        {q.sub && <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginBottom: 24 }}>{q.sub}</p>}
        {!q.sub && <div style={{ marginBottom: 18 }} />}

        {q.type === "choice" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {q.options.map(opt => (
              <button key={opt.value} onClick={() => pickChoice(q.key, opt.value)}
                style={{ width: "100%", background: "rgba(14,165,233,0.1)", border: "1.5px solid rgba(14,165,233,0.25)", borderRadius: 16, padding: "16px 16px", fontSize: 14.5, fontWeight: 700, color: "#e0f2fe", cursor: "pointer", wordBreak: "keep-all", textAlign: "left" }}>
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {q.type === "text" && (
          <div>
            <input style={S.input} placeholder={q.placeholder} value={answers[q.key] || ""} onChange={e => setText(q.key, e.target.value)}
              onKeyDown={e => e.key === "Enter" && nextFromText()} autoFocus />
            <button onClick={nextFromText} style={{ ...S.btn, marginTop: 20 }}>다음 →</button>
          </div>
        )}

        {q.type === "multi" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {q.options.map(opt => {
                const selected = (answers[q.key] || []).includes(opt.value);
                return (
                  <button key={opt.value} onClick={() => toggleMulti(q.key, opt.value, q.max)}
                    style={{ width: "100%", background: selected ? "rgba(14,165,233,0.3)" : "rgba(14,165,233,0.08)", border: `1.5px solid ${selected ? "#38bdf8" : "rgba(14,165,233,0.25)"}`, borderRadius: 16, padding: "14px 16px", fontSize: 14, fontWeight: selected ? 900 : 700, color: selected ? "#38bdf8" : "#e0f2fe", cursor: "pointer", wordBreak: "keep-all", textAlign: "left" }}>
                    {selected ? "✓ " : ""}{opt.label}
                  </button>
                );
              })}
            </div>
            <button onClick={nextFromMulti} style={S.btn}>다음 →</button>
          </div>
        )}
      </div>
    </div>
  );
}
