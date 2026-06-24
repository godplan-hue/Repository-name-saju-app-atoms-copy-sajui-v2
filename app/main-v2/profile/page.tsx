"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

// 가입 정보 입력 화면 — 5단계(관계/생년월일/성별/시간/연락처)마다 다른 배경 이미지
const STEP_BACKGROUNDS: Record<number, string> = {
  1: "https://i.pinimg.com/1200x/8c/f1/ef/8cf1ef883860345144847962ce26fc8f.jpg",
  2: "https://i.pinimg.com/1200x/3c/d5/82/3cd582b516489126cddf762e4ad4d717.jpg",
  3: "https://i.pinimg.com/1200x/6d/df/69/6ddf69eba555283a55f2007a0d43699f.jpg",
  4: "https://i.pinimg.com/1200x/39/45/02/394502f20b666c553e7f506fe2aec52d.jpg",
  5: "https://i.pinimg.com/736x/de/36/33/de36332dd307cafef909ecdfdd2373cf.jpg",
};

const RELS = [
  { value: "나", icon: "🙋", label: "나" },
  { value: "배우자", icon: "💑", label: "배우자" },
  { value: "자녀", icon: "👧", label: "자녀" },
  { value: "부모", icon: "👨‍👩‍👧", label: "부모" },
  { value: "친구", icon: "🤝", label: "친구" },
  { value: "연인", icon: "💕", label: "연인" },
];

const HOURS = [
  { label: "자시(子時)", value: "00", time: "23~01시" },
  { label: "축시(丑時)", value: "01", time: "01~03시" },
  { label: "인시(寅時)", value: "02", time: "03~05시" },
  { label: "묘시(卯時)", value: "03", time: "05~07시" },
  { label: "진시(辰時)", value: "04", time: "07~09시" },
  { label: "사시(巳時)", value: "05", time: "09~11시" },
  { label: "오시(午時)", value: "06", time: "11~13시" },
  { label: "미시(未時)", value: "07", time: "13~15시" },
  { label: "신시(申時)", value: "08", time: "15~17시" },
  { label: "유시(酉時)", value: "09", time: "17~19시" },
  { label: "술시(戌時)", value: "10", time: "19~21시" },
  { label: "해시(亥時)", value: "11", time: "21~23시" },
  { label: "모름", value: "unknown", time: "모르는 경우" },
];

// 개인정보 보유 기간 3년 — 동의한 지 3년이 지나면 자동 건너뛰기를 멈추고 동의를 다시 받음
const PRIVACY_AGREEMENT_VALID_MS = 3 * 365 * 24 * 60 * 60 * 1000;
function isPrivacyAgreementValid(): boolean {
  if (localStorage.getItem("v2_privacy_agreed") !== "1") return false;
  const agreedAt = Number(localStorage.getItem("v2_privacy_agreed_at") ?? "0");
  return agreedAt > 0 && Date.now() - agreedAt < PRIVACY_AGREEMENT_VALID_MS;
}

const inp: React.CSSProperties = {
  width: "100%", padding: "13px 14px", borderRadius: 12,
  border: "1.5px solid rgba(251,191,36,0.4)", fontSize: 15,
  boxSizing: "border-box", outline: "none",
  fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  color: "#1a1a2e", background: "rgba(255,255,255,0.85)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

// 이름은 로그인 화면(/main-v2/login)에서 이미 받기 때문에 여기서 다시 묻지 않음
const STEPS = [
  { icon: "🐱", title: "누구의 운세를 볼까요?", hint: "" },
  { icon: "🎂", title: "생년월일을 입력해주세요", hint: "" },
  { icon: "😼😻", title: "성별을 선택해주세요", hint: "" },
  { icon: "🌙✨", title: "태어난 시를 선택해주세요", hint: "모르시면 '모름'을 선택해도 됩니다" },
  { icon: "💌", title: "연락처를 입력해주세요", hint: "" },
];

export default function V2Profile() {
  const router = useRouter();
  // 페이지를 새로 열 때 한 번만 랜덤으로 골라 5단계 내내 같은 배경 유지
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", relationship: "나",
    birthYear: "", birthMonth: "", birthDay: "",
    gender: "", birthHour: "",
    phone: "", email: "",
  });
  // 개인정보 동의도 한 번 체크하면 localStorage에 저장해 다음 방문 때 그대로
  // 체크된 상태로 시작 — 매번 다시 동의 체크를 해야 하는 불편을 줄임
  const [agreed, setAgreed] = useState(false);
  // 무료 다시보기는 화면 자체를 안 보여주고 곧바로 분석으로 건너뛰기 위한 플래그
  // — 유료 다시보기(paid-info-input)는 화면을 보여주고 자동 채움만 해줌, 여긴 다름
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // 동의 기록도 로그인한 이름과 저장된 정보의 이름이 같을 때만 유효 — 다른
    // 사람으로 들어왔으면 이전 사람이 했던 동의를 그대로 가져오면 안 됨
    const loggedInName = localStorage.getItem("v2_user_name") ?? "";
    let sameName = true;
    try {
      const saved = localStorage.getItem("v2_saved_profile");
      if (saved && loggedInName) sameName = JSON.parse(saved).name === loggedInName;
    } catch {}
    if (sameName && isPrivacyAgreementValid()) setAgreed(true);
  }, []);

  useEffect(() => {
    // 무료(오늘의 운세) 다시보기: 한 번 입력한 본인 정보가 완전하면 이 화면 자체를
    // 보여주지 않고 곧바로 분석으로 건너뜀 — 단, "같은 로그인 세션" 안에서만.
    // 로그아웃 후 다시 로그인하면(=새 세션) 예쁜 화면을 한 번 더 보여주고, 그
    // 세션 안에서는 그 다음부터 건너뜀. 다른 사람으로 보려면 로그아웃 필요.
    // 개인정보 동의는 3년 보유기간이 지나면 만료시켜 다시 동의를 받음
    const saved = localStorage.getItem("v2_saved_profile");
    const loggedInName = localStorage.getItem("v2_user_name") ?? "";
    const loginSessionId = localStorage.getItem("v2_login_session_id") ?? "";
    const shownForSession = localStorage.getItem("v2_profile_shown_session") ?? "";
    const alreadyShownThisSession = loginSessionId !== "" && loginSessionId === shownForSession;
    if (saved) {
      try {
        const p = JSON.parse(saved);
        // 로그인에서 새 이름을 입력했는데 저장된 정보가 다른 사람 이름이면,
        // 그 저장된 정보로 건너뛰거나 채우면 안 됨(다른 사람 정보가 그대로
        // 쓰이는 사고가 됨) — 로그인한 이름과 일치할 때만 신뢰함
        const sameName = !loggedInName || p.name === loggedInName;
        const complete = p.name && p.birthYear && p.birthMonth && p.birthDay && p.gender && p.birthHour;
        if (sameName && complete && isPrivacyAgreementValid() && alreadyShownThisSession) {
          setRedirecting(true);
          sessionStorage.setItem("v2_profile", JSON.stringify({
            name: p.name, relationship: "나",
            birthYear: p.birthYear, birthMonth: p.birthMonth, birthDay: p.birthDay,
            gender: p.gender, birthHour: p.birthHour,
            phone: p.phone ?? "", email: p.email ?? "",
          }));
          // push가 아니라 replace — 사용자가 직접 보지 못하는 자동 건너뛰기라
          // push로 하면 브라우저 히스토리에 보이지 않는 항목이 쌓여서 뒤로가기가
          // 엉뚱한 곳으로 튕기는 문제가 있었음
          router.replace("/main-v2/analysis");
          return;
        }
        if (sameName) {
          setForm(prev => ({
            ...prev,
            name: p.name ?? prev.name,
            birthYear: p.birthYear ?? prev.birthYear,
            birthMonth: p.birthMonth ?? prev.birthMonth,
            birthDay: p.birthDay ?? prev.birthDay,
            gender: p.gender ?? prev.gender,
            birthHour: p.birthHour ?? prev.birthHour,
            phone: p.phone ?? prev.phone,
            email: p.email ?? prev.email,
          }));
          return;
        }
      } catch {}
    }
    if (loggedInName && !["카카오 사용자", "네이버 사용자", "Google 사용자"].includes(loggedInName))
      setForm(p => ({ ...p, name: loggedInName }));
  }, []);

  if (redirecting) return null;

  const TOTAL = 5;
  const progress = (step / TOTAL) * 100;
  const cur = STEPS[step - 1];

  const finish = () => {
    sessionStorage.setItem("v2_profile", JSON.stringify(form));
    localStorage.setItem("v2_saved_profile", JSON.stringify({
      name: form.name, birthYear: form.birthYear, birthMonth: form.birthMonth, birthDay: form.birthDay,
      gender: form.gender, birthHour: form.birthHour, phone: form.phone, email: form.email,
    }));
    // 동의를 받은 연락처를 서버에도 저장 — 실패해도 분석 진행을 막지 않음
    fetch("/api/v2/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});
    // 이번 로그인 세션에서는 이미 화면을 봤다고 기록 — 같은 세션 안에서 또
    // 들어오면 건너뛰고, 로그아웃 후 다시 로그인하면(새 세션) 다시 보여줌
    const loginSessionId = localStorage.getItem("v2_login_session_id");
    if (loginSessionId) localStorage.setItem("v2_profile_shown_session", loginSessionId);
    router.push("/main-v2/analysis");
  };

  const next = () => {
    const ok: Record<number, boolean> = {
      1: !!form.relationship,
      2: !!(form.birthYear && form.birthMonth && form.birthDay),
      3: !!form.gender,
      4: !!form.birthHour,
      5: true, // 선택 입력
    };
    if (!ok[step]) { alert("정보를 입력해주세요"); return; }
    if (step < TOTAL) { setStep(s => s + 1); return; }
    finish();
  };

  return (
    <main style={{ minHeight: "100vh", backgroundImage: `url('${STEP_BACKGROUNDS[step]}'), ${BG}`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
          )}
          <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
          </button>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6" }}>{step} / {TOTAL}</span>
      </header>

      {/* 진행 바 */}
      <div style={{ height: 4, background: "rgba(236,72,153,0.1)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: G, transition: "width 0.4s ease", borderRadius: "0 4px 4px 0" }} />
      </div>


      <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px 60px" }}>

        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 10, display: "inline-block", animation: "bounce 2s ease-in-out infinite", filter: step === 1 ? "grayscale(1) brightness(1.8) contrast(0.9)" : "none" }}>{cur.icon}</div>
          <h1 style={{ fontSize: 19, fontWeight: 900, color: "#ffffff", margin: "0 0 4px", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{cur.title}</h1>
          {cur.hint && <p style={{ fontSize: 12, color: "#ffffff", margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>{cur.hint}</p>}
        </div>

        <div style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", borderRadius: 24, padding: "22px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.18)", border: "1.5px solid rgba(251,191,36,0.45)" }}>

          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
              {RELS.map(r => (
                <button key={r.value} onClick={() => setForm(p => {
                  // 관계를 바꾸면(예: 나 → 배우자) 이전에 저장된 내 정보(성별·생년월일 등)가
                  // 그대로 남아있어서, 새 사람 정보를 깜빡 잘못 입력할 위험이 있었음
                  // (예: 본인 성별이 그대로 남아 배우자 분석에 잘못 쓰이는 문제) —
                  // 관계가 실제로 바뀔 때는 성별·생년월일·태어난 시를 비워서 다시
                  // 명확하게 입력하도록 함
                  if (r.value === p.relationship) return { ...p, relationship: r.value };
                  return { ...p, relationship: r.value, gender: "", birthYear: "", birthMonth: "", birthDay: "", birthHour: "" };
                })}
                  style={{ padding: "15px 8px", borderRadius: 14, border: form.relationship === r.value ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", background: form.relationship === r.value ? "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))" : "#fdf2f8", cursor: "pointer", textAlign: "center", boxShadow: form.relationship === r.value ? "0 4px 14px rgba(251,191,36,0.25)" : "none", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: form.relationship === r.value ? "#be185d" : "#374151" }}>{r.label}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
                <input type="number" value={form.birthYear} onChange={e => setForm(p => {
                  // 생년월일을 실제로 바꾸면(이전에 저장된 본인 정보와 다른 사람을
                  // 입력하는 상황일 수 있음) 성별·태어난시를 비워서 다시 명확히
                  // 선택하게 함 — "관계"를 안 바꿔도(예: "나"로 둔 채로 배우자 정보를
                  // 입력해도) 성별이 엉뚱하게 그대로 남는 일을 막기 위함
                  if (e.target.value === p.birthYear) return p;
                  return { ...p, birthYear: e.target.value, gender: "", birthHour: "" };
                })}
                  placeholder="1990" min="1900" max="2024" style={{ ...inp, textAlign: "center" }} />
                <select value={form.birthMonth} onChange={e => setForm(p => {
                  if (e.target.value === p.birthMonth) return p;
                  return { ...p, birthMonth: e.target.value, gender: "", birthHour: "" };
                })} style={{ ...inp, textAlign: "center" }}>
                  <option value="">월</option>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}월</option>)}
                </select>
                <select value={form.birthDay} onChange={e => setForm(p => {
                  if (e.target.value === p.birthDay) return p;
                  return { ...p, birthDay: e.target.value, gender: "", birthHour: "" };
                })} style={{ ...inp, textAlign: "center" }}>
                  <option value="">일</option>
                  {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}일</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[{ v: "남", label: "😼 남성" }, { v: "여", label: "😻 여성" }].map(g => (
                <button key={g.v} onClick={() => setForm(p => ({ ...p, gender: g.v }))}
                  style={{ padding: "20px 0", borderRadius: 16, border: form.gender === g.v ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", background: form.gender === g.v ? "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))" : "#fdf2f8", color: form.gender === g.v ? "#be185d" : "#374151", fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: form.gender === g.v ? "0 4px 14px rgba(251,191,36,0.25)" : "none", transition: "all 0.15s" }}>
                  {g.label}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, maxHeight: 330, overflowY: "auto" }}>
              {HOURS.map(h => (
                <button key={h.value} onClick={() => setForm(p => ({ ...p, birthHour: h.value }))}
                  style={{ padding: "10px 6px", borderRadius: 12, border: form.birthHour === h.value ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", background: form.birthHour === h.value ? "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))" : "#fdf2f8", color: form.birthHour === h.value ? "#be185d" : "#374151", fontWeight: 800, fontSize: 11, cursor: "pointer", textAlign: "center", boxShadow: form.birthHour === h.value ? "0 4px 14px rgba(251,191,36,0.25)" : "none", transition: "all 0.15s" }}>
                  <div>{h.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{h.time}</div>
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                autoFocus type="tel" value={form.phone}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  let formatted = digits;
                  if (digits.length > 3 && digits.length <= 7) formatted = `${digits.slice(0,3)}-${digits.slice(3)}`;
                  else if (digits.length > 7) formatted = `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
                  setForm(p => ({ ...p, phone: formatted }));
                }}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); (e.currentTarget.nextElementSibling as HTMLInputElement)?.focus(); } }}
                placeholder="010-0000-0000" style={inp}
                onFocus={e => (e.currentTarget.style.borderColor = "#fbbf24")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")}
              />
              <input
                type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); } }}
                placeholder="example@email.com" style={inp}
                onFocus={e => (e.currentTarget.style.borderColor = "#fbbf24")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")}
              />
              {/* 개인정보 동의 */}
              <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(6px)", borderRadius: 14, padding: "14px 14px 12px", border: "1.5px solid rgba(251,191,36,0.35)" }}>
                <p style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px" }}>📋 개인정보 수집·이용 동의서</p>
                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.8, marginBottom: 12 }}>
                  <div>• 수집 목적: 사주 분석 서비스 제공</div>
                  <div>• 수집 항목: 이름, 생년월일, 성별, 출생시간, 전화번호, 이메일</div>
                  <div>• 보유 기간: 3년</div>
                  <div>• 동의 거부: 서비스 이용 불가</div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                  <input
                    type="checkbox" checked={agreed} onChange={e => {
                      setAgreed(e.target.checked);
                      localStorage.setItem("v2_privacy_agreed", e.target.checked ? "1" : "0");
                      if (e.target.checked) localStorage.setItem("v2_privacy_agreed_at", String(Date.now()));
                    }}
                    style={{ width: 18, height: 18, accentColor: "#fbbf24", cursor: "pointer", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 800, color: agreed ? "#be185d" : "#374151" }}>
                    동의합니다 <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>(필수)</span>
                  </span>
                </label>
              </div>
              <button
                onClick={() => {
                  if (!agreed) { alert("개인정보 수집·이용에 동의해주세요."); return; }
                  // 전화/이메일은 선택 입력이라 비워둬도 되지만, 입력했다면 최소한
                  // 형식이라도 맞는지 확인함(완전한 본인인증은 아니지만 무료로 가능한 선)
                  if (form.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone.replace(/\s/g, ""))) {
                    alert("전화번호 형식을 다시 확인해주세요 (예: 010-1234-5678)");
                    return;
                  }
                  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
                    alert("이메일 형식을 다시 확인해주세요 (예: example@email.com)");
                    return;
                  }
                  finish();
                }}
                disabled={!agreed}
                style={{ padding: "15px 0", background: agreed ? "linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6)" : "rgba(0,0,0,0.1)", color: agreed ? "#1a0f2e" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: agreed ? "pointer" : "not-allowed", boxShadow: agreed ? "0 6px 22px rgba(251,191,36,0.4)" : "none", marginTop: 4 }}>
                🔮 분석 시작
              </button>
            </div>
          )}

          {step < TOTAL && (
            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: step > 1 ? "1fr 2fr" : "1fr", gap: 10 }}>
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} style={{ padding: "14px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>← 이전</button>
              )}
              <button onClick={next} style={{ padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.3)" }}>
                다음 →
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#ffffff", fontWeight: 800, marginTop: 14, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>🔒 입력 정보는 암호화 보호됩니다</p>
      </div>

      <style jsx>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </main>
  );
}
