"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { lunarToSolar } from "@/lib/lunarToSolar";

function getTodayCount() {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const lcg = ((seed * 1664525 + 1013904223) & 0xffffffff) >>> 0;
  const base = 680 + (lcg % 300);
  const block = new Date().getHours() < 8 ? 0 : new Date().getHours() < 16 ? 1 : 2;
  return (base + (block >= 1 ? 480 + (lcg % 220) : 0) + (block >= 2 ? 550 + ((lcg >> 4) % 300) : 0)).toLocaleString();
}

// 연애 성향 퀴즈 — 답변 기반 결과 느낌을 위해 궁합 계산 전 추가
const LOVE_QUIZ: { q: string; a: string; b: string; aType: "E" | "S"; bType: "E" | "S" }[] = [
  { q: "갈등이 생기면 나는?", a: "바로 대화로 풀어야 마음이 편하다", b: "시간을 두고 감정이 가라앉은 후 얘기한다", aType: "E", bType: "S" },
  { q: "애정 표현은 주로?", a: "말과 스킨십으로 자주 표현한다", b: "행동과 배려로 은근히 표현한다", aType: "E", bType: "S" },
  { q: "데이트 스타일은?", a: "즉흥적이고 새로운 걸 시도하는 게 좋다", b: "계획적이고 익숙한 곳이 편하다", aType: "E", bType: "S" },
  { q: "연락은 어느 정도가 좋을까?", a: "자주 연락하고 일상을 공유해야 안심된다", b: "필요할 때만 연락해도 괜찮다", aType: "E", bType: "S" },
  { q: "힘든 일이 있을 때 나는?", a: "상대방에게 바로 털어놓고 위로받고 싶다", b: "혼자 정리한 후에 얘기하고 싶다", aType: "E", bType: "S" },
  { q: "관계에서 가장 중요한 건?", a: "서로에 대한 설렘과 감정 표현", b: "신뢰와 안정감", aType: "E", bType: "S" },
];

export default function GunghapPage() {
  const count = getTodayCount();
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "form" | "quiz">("intro");
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<("E" | "S")[]>([]);
  const [phone, setPhone] = useState("");
  const [name1, setName1] = useState("");
  const [year1, setYear1] = useState("");
  const [month1, setMonth1] = useState("");
  const [day1, setDay1] = useState("");
  const [isLunar1, setIsLunar1] = useState(false);
  const [gender1, setGender1] = useState("");
  const [name2, setName2] = useState("");
  const [year2, setYear2] = useState("");
  const [month2, setMonth2] = useState("");
  const [day2, setDay2] = useState("");
  const [isLunar2, setIsLunar2] = useState(false);
  const [gender2, setGender2] = useState("");
  const [email, setEmail] = useState("");
  const [hpField, setHpField] = useState(""); // 허니팟 — 봇 방지용 숨김 필드, 사람 눈엔 안 보임
  const [agreed, setAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.name) setName1(p.name);
      if (p.phone) setPhone(p.phone);
      if (p.email) setEmail(p.email);
    } catch {}
  }, []);

  const S = {
    wrap: { minHeight: "100vh", background: "#0a0015", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    row: { marginBottom: 14 },
    btn: { width: "100%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer" },
    gBtn: (active: boolean) => ({
      flex: 1, padding: "12px 0", borderRadius: 12, border: `2px solid ${active ? "#ec4899" : "rgba(255,255,255,0.15)"}`,
      background: active ? "rgba(236,72,153,0.2)" : "transparent", color: active ? "#ec4899" : "#9ca3af",
      cursor: "pointer", fontSize: 14, fontWeight: active ? 900 : 400,
    }),
  };

  const goToQuiz = () => {
    if (hpField) return; // 봇 감지 — 조용히 무시
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    if (!year1 || year1.length < 4) { setError("나의 출생연도를 입력해주세요."); return; }
    if (!year2 || year2.length < 4) { setError("상대방 출생연도를 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
    setError("");
    setQuizIdx(0);
    setQuizAnswers([]);
    setStep("quiz");
  };

  const pickQuizAnswer = (type: "E" | "S") => {
    const next = [...quizAnswers, type];
    if (next.length < LOVE_QUIZ.length) {
      setQuizAnswers(next);
      setQuizIdx(quizIdx + 1);
      return;
    }
    setQuizAnswers(next);
    const eCount = next.filter(t => t === "E").length;
    const loveStyle = eCount >= 4 ? "E" : eCount <= 2 ? "S" : "균형";
    analyze(loveStyle);
  };

  const analyze = async (loveStyle: "E" | "S" | "균형") => {
    const cleanPhone = phone.replace(/\D/g, "");
    setLoading(true); setError("");
    try {
      // 음력 체크 시 실제 사주 계산(만세력)은 양력 기준이라, 계산용 값만 양력으로 변환한다.
      // 월/일이 없으면(연도만 입력) 변환 대상이 아니므로 원본 그대로 둔다.
      // 변환 실패 시 lunarToSolar가 원본 값을 그대로 돌려주므로 안전하다.
      let y1 = year1, m1 = month1 || "1", d1 = day1 || "1";
      if (isLunar1 && year1 && month1 && day1) {
        try {
          const solar = lunarToSolar(Number(year1), Number(month1), Number(day1));
          y1 = String(solar.year); m1 = String(solar.month); d1 = String(solar.day);
        } catch {}
      }
      let y2 = year2, m2 = month2 || "1", d2 = day2 || "1";
      if (isLunar2 && year2 && month2 && day2) {
        try {
          const solar = lunarToSolar(Number(year2), Number(month2), Number(day2));
          y2 = String(solar.year); m2 = String(solar.month); d2 = String(solar.day);
        } catch {}
      }
      const res = await fetch("/api/gunghap/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone, email,
          name1: name1 || "나", birthYear1: y1, birthMonth1: m1, birthDay1: d1, gender1,
          name2: name2 || "상대방", birthYear2: y2, birthMonth2: m2, birthDay2: d2, gender2,
          marketing: marketingAgreed,
          loveStyle,
        }),
      });
      const data = await res.json();
      if (data.id) {
        let alreadyUnlocked = false;
        try {
          const u = localStorage.getItem("gunghap_unlock_until");
          const up = localStorage.getItem("gunghap_unlock_phone") || "";
          alreadyUnlocked = !!u && Number(u) > Date.now() && !!up && !!cleanPhone && up === cleanPhone;
        } catch {}
        window.location.href = alreadyUnlocked ? `/gunghap/result/${data.id}` : `/gunghap/pay?id=${data.id}`;
      } else {
        setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "intro") {
    return (
      <div style={S.wrap}>
        {/* 히어로 */}
        <div style={{ background: "linear-gradient(180deg, #1a0030 0%, #0a0015 100%)", paddingBottom: 40 }}>
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Link href="/main-v2" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>← 점운 홈</Link>
              <button onClick={() => { const d = { title: "점운 궁합 — 오행으로 보는 우리 궁합", text: "오행 사주로 진짜 궁합 점수를 알아보세요! 🔮", url: "https://jeomun.com/gunghap" }; const _k=(window as any).Kakao; if(_k?.isInitialized()&&_k?.Share){_k.Share.sendDefault({objectType:"feed",content:{title:d.title,description:d.text,imageUrl:"https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg",link:{mobileWebUrl:d.url,webUrl:d.url}},buttons:[{title:"바로 보기",link:{mobileWebUrl:d.url,webUrl:d.url}},{title:"나도 해보기 →",link:{mobileWebUrl:d.url,webUrl:d.url}}]});}else{window.location.href=`kakaotalk://msg/send?text=${encodeURIComponent(d.text+'\n'+d.url)}`;}; }} style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(167,139,250,0.4)", borderRadius: 20, padding: "5px 12px", cursor: "pointer" }}>🔗 공유</button>
            </div>

            <div style={{ fontSize: 64, marginBottom: 16 }}>💞</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.3 }}>
              우리 궁합<br />
              <span style={{ background: "linear-gradient(135deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                몇 점일까?
              </span>
            </h1>
            <p style={{ color: "#c4b5fd", fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
              오행 사주로 보는 진짜 궁합<br />
              성격·연애·갈등·결혼까지 전부 분석
            </p>

            {/* 배지 */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
              {["✨ 환상궁합 발견", "💬 연애 패턴 분석", "🃏 인연 타로 뽑기", "📤 카카오 공유 가능"].map(t => (
                <span key={t} style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#c4b5fd" }}>{t}</span>
              ))}
            </div>

            {/* 점수 미리보기 */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
              {[
                { pair: "화 × 토", score: 93, tag: "환상궁합" },
                { pair: "목 × 수", score: 87, tag: "좋은궁합" },
                { pair: "금 × 수", score: 91, tag: "환상궁합" },
              ].map(item => (
                <div key={item.pair} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 12px", textAlign: "center", flex: 1 }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>{item.pair}</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: "#f472b6", margin: "0 0 2px" }}>{item.score}점</p>
                  <p style={{ fontSize: 10, color: "#a78bfa", margin: 0 }}>{item.tag}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setStep("form")} style={S.btn}>
              지금 궁합 보기 →
            </button>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>990원 · 전체 분석</p>
            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(167,139,250,0.55)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.02em" }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>
          </div>
        </div>

        {/* 기능 설명 */}
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px" }}>
          {[
            { icon: "🔮", title: "오행 궁합 점수", desc: "사주 오행으로 계산한\n진짜 궁합 점수를 알려드려요" },
            { icon: "💬", title: "연애 패턴 분석", desc: "두 사람의 연애 방식과\n갈등 패턴을 정확히 짚어줘요" },
            { icon: "🃏", title: "인연 타로 뽑기", desc: "오늘 두 사람의 인연을\n타로 카드로 확인해보세요" },
            { icon: "💍", title: "결혼 궁합 체크", desc: "함께 살면 어떨지\n결혼 궁합도 살펴드려요" },
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
          <button onClick={() => setStep("form")} style={S.btn}>
            궁합 분석 시작하기 →
          </button>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 10, textAlign: 'center' }}>오늘 <strong style={{ color: '#f472b6' }}>{count}</strong>명이 궁합을 확인했어요</p>
        </div>

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
    );
  }

  if (step === "quiz") {
    const q = LOVE_QUIZ[quizIdx];
    return (
      <div style={S.wrap}>
        <div style={{ ...S.inner, paddingTop: 32 }}>
          <p style={{ fontSize: 12, color: "#f9a8d4", textAlign: "center", marginBottom: 8, fontWeight: 700 }}>
            나의 연애 성향 · {quizIdx + 1} / {LOVE_QUIZ.length}
          </p>
          <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 28 }}>
            <div style={{ height: "100%", width: `${((quizIdx + 1) / LOVE_QUIZ.length) * 100}%`, background: "#ec4899", borderRadius: 4, transition: "width 0.3s" }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 32, wordBreak: "keep-all", lineHeight: 1.5 }}>
            {q.q}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <button onClick={() => pickQuizAnswer(q.aType)} disabled={loading} style={{ width: "100%", background: "rgba(236,72,153,0.1)", border: "1.5px solid rgba(236,72,153,0.25)", borderRadius: 18, padding: "20px 16px", fontSize: 15, fontWeight: 700, color: "#fce7f3", cursor: loading ? "not-allowed" : "pointer", wordBreak: "keep-all", textAlign: "left" }}>
              {q.a}
            </button>
            <button onClick={() => pickQuizAnswer(q.bType)} disabled={loading} style={{ width: "100%", background: "rgba(236,72,153,0.1)", border: "1.5px solid rgba(236,72,153,0.25)", borderRadius: 18, padding: "20px 16px", fontSize: 15, fontWeight: 700, color: "#fce7f3", cursor: loading ? "not-allowed" : "pointer", wordBreak: "keep-all", textAlign: "left" }}>
              {q.b}
            </button>
          </div>
          {loading && <p style={{ textAlign: "center", color: "#a78bfa", fontSize: 13, marginTop: 24 }}>궁합 분석 중... 🔮</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ paddingTop: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>궁합 분석</span>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>두 사람의 정보를 입력해주세요</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>출생연도만 있어도 기본 분석이 가능해요</p>

        {/* 나 */}
        <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#a78bfa", margin: "0 0 14px" }}>💜 나</p>

          <div style={S.row}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 지민" value={name1} onChange={e => setName1(e.target.value)} />
          </div>

          <div style={S.row}>
            <label style={S.label}>전화번호 (필수)</label>
            <input style={{ ...S.input, border: `1px solid ${error.includes("전화") ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.15)"}` }}
              placeholder="010-0000-0000" inputMode="tel" value={phone}
              onChange={e => { setPhone(e.target.value); setError(""); }} />
            <input
              type="text" name="website" value={hpField} onChange={e => setHpField(e.target.value)}
              autoComplete="off" tabIndex={-1} aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
          </div>

          <div style={S.row}>
            <label style={S.label}>이메일 (선택)</label>
            <input style={S.input} placeholder="example@email.com" inputMode="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>출생연도 *</label>
              <input style={S.input} placeholder="1998" maxLength={4} inputMode="numeric" value={year1}
                onChange={e => setYear1(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>월 (선택)</label>
              <input style={S.input} placeholder="3" maxLength={2} inputMode="numeric" value={month1}
                onChange={e => setMonth1(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>일 (선택)</label>
              <input style={S.input} placeholder="15" maxLength={2} inputMode="numeric" value={day1}
                onChange={e => setDay1(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700, margin: "0 0 6px" }}>음력 생일이면 체크해주세요 (양력으로 자동 변환)</p>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={isLunar1} onChange={e => setIsLunar1(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#ec4899", cursor: "pointer", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: isLunar1 ? "#f472b6" : "#e5e7eb" }}>음력 체크</span>
            </label>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>성별 (선택)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setGender1("여성")} style={S.gBtn(gender1 === "여성")}>👩 여성</button>
              <button onClick={() => setGender1("남성")} style={S.gBtn(gender1 === "남성")}>👨 남성</button>
            </div>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }}
                style={{ marginTop: 3, accentColor: "#ec4899", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>
                <strong style={{ color: "#e5e7eb" }}>[필수] 개인정보 수집·이용 동의</strong><br />
                점운(jeomun.com)이 전화번호·이메일을 서비스 제공에 활용하며, 3년간 보유 후 파기합니다.
              </span>
            </label>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginTop: 8 }}>
              <input type="checkbox" checked={marketingAgreed} onChange={e => setMarketingAgreed(e.target.checked)}
                style={{ marginTop: 3, accentColor: "#ec4899", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>
                <strong style={{ color: "#e5e7eb" }}>[선택] 마케팅 수신 동의</strong><br />
                이벤트·할인·운세 소식을 문자·카카오로 받습니다. 언제든지 수신거부 가능합니다.
              </span>
            </label>
          </div>
        </div>

        {/* 상대방 */}
        <div style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#f472b6", margin: "0 0 14px" }}>🩷 상대방</p>

          <div style={S.row}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 태현" value={name2} onChange={e => setName2(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>출생연도 *</label>
              <input style={S.input} placeholder="1996" maxLength={4} inputMode="numeric" value={year2}
                onChange={e => setYear2(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>월 (선택)</label>
              <input style={S.input} placeholder="7" maxLength={2} inputMode="numeric" value={month2}
                onChange={e => setMonth2(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>일 (선택)</label>
              <input style={S.input} placeholder="22" maxLength={2} inputMode="numeric" value={day2}
                onChange={e => setDay2(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: "#f472b6", fontWeight: 700, margin: "0 0 6px" }}>음력 생일이면 체크해주세요 (양력으로 자동 변환)</p>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={isLunar2} onChange={e => setIsLunar2(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#ec4899", cursor: "pointer", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: isLunar2 ? "#f472b6" : "#e5e7eb" }}>음력 체크</span>
            </label>
          </div>

          <div>
            <label style={S.label}>성별 (선택)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setGender2("여성")} style={S.gBtn(gender2 === "여성")}>👩 여성</button>
              <button onClick={() => setGender2("남성")} style={S.gBtn(gender2 === "남성")}>👨 남성</button>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        <button onClick={goToQuiz} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "궁합 분석 중... 🔮" : "궁합 점수 확인하기 💞"}
        </button>
        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 10 }}>
          990원 · 전체 분석
        </p>

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