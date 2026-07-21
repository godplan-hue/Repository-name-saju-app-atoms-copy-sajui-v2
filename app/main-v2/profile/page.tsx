"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isPartnerHost } from "@/lib/isPartnerHost";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const STEP_BACKGROUNDS: Record<number, string> = {
  1: "https://i.pinimg.com/736x/35/04/d8/3504d87bd6b5aae73941f6d85c3f6686.jpg",
  2: "https://i.pinimg.com/1200x/3c/d5/82/3cd582b516489126cddf762e4ad4d717.jpg",
  3: "https://i.pinimg.com/1200x/6d/df/69/6ddf69eba555283a55f2007a0d43699f.jpg",
  4: "https://i.pinimg.com/vwebp/736x/9d/a4/47/9da447bd262e5f09a7d0745ba1fddeb8.webp",
  5: "https://i.pinimg.com/736x/a8/78/60/a87860d56c2d18f7d1995e0050d42632.jpg",
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

const HOUR_LABEL: Record<string, string> = Object.fromEntries(HOURS.map(h => [h.value, h.label]));

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

const STEPS = [
  { icon: "🐱", title: "누구의 운세를 볼까요?", hint: "" },
  { icon: "🎂", title: "생년월일을 입력해주세요", hint: "" },
  { icon: "😼😻", title: "성별을 선택해주세요", hint: "" },
  { icon: "🌙✨", title: "태어난 시를 선택해주세요", hint: "모르시면 '모름'을 선택해도 됩니다" },
  { icon: "💌", title: "연락처를 입력해주세요", hint: "" },
];

export default function V2Profile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [savedMode, setSavedMode] = useState(false);
  const [isFreeFlow, setIsFreeFlow] = useState(false);
  const [brand, setBrand] = useState<{ businessName: string; logoUrl: string } | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (!isPartnerHost(hostname)) return;
    const slug = hostname.split(".")[0];
    fetch(`/api/partner/brand?subdomain=${encodeURIComponent(slug)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setBrand(data); })
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    name: "", relationship: "나",
    birthYear: "", birthMonth: "", birthDay: "",
    gender: "", birthHour: "",
    phone: "", email: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [phoneStep, setPhoneStep] = useState(true);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const loggedInName = localStorage.getItem("v2_user_name") ?? "";
    let sameName = true;
    try {
      const saved = localStorage.getItem("v2_saved_profile");
      if (saved && loggedInName) sameName = JSON.parse(saved).name === loggedInName;
    } catch {}
    if (sameName && isPrivacyAgreementValid()) setAgreed(true);
  }, []);

  useEffect(() => {
    // 무료 플로우: 저장된 정보 있으면 바로 분석, 없으면 5단계 마법사
    const flow = sessionStorage.getItem("v2_profile_flow");
    if (flow === "free") {
      sessionStorage.removeItem("v2_profile_flow");
      setIsFreeFlow(true);
      const saved = localStorage.getItem("v2_saved_profile");
      const loggedInName = localStorage.getItem("v2_user_name") ?? "";
      if (saved) {
        try {
          const p = JSON.parse(saved);
          const sameName = !loggedInName || p.name === loggedInName;
          if (sameName && p.name && p.birthYear && p.gender && p.birthHour) {
            sessionStorage.setItem("v2_profile", JSON.stringify(p));
            const afterGoto = sessionStorage.getItem("v2_after_payment_goto");
            sessionStorage.removeItem("v2_after_payment_goto");
            if (afterGoto === "special") {
              router.replace("/main-v2/special");
            } else {
              sessionStorage.removeItem("specialPaid");
              sessionStorage.removeItem("specialType");
              router.replace("/main-v2/analysis");
            }
            return;
          }
        } catch {}
      }
      setChecking(false);
      return; // 저장 정보 없음 → 5단계 마법사 표시
    }

    // 직접 URL 접근(구글, URL 공유 등) 감지 → 메인으로 리다이렉트
    const fromApp = sessionStorage.getItem("v2_from_app");
    sessionStorage.removeItem("v2_from_app");
    const verifiedPhone = localStorage.getItem("v2_verified_phone");
    const saved = localStorage.getItem("v2_saved_profile");
    if (!fromApp) {
      window.location.replace("/main-v2");
      return; // 리다이렉트 — checking 풀지 않음 (깜박임 방지)
    }

    // 유료 or 일반 플로우: 전화번호로 본인 확인
    // 이전에 본인 확인한 전화번호가 있으면 → 바로 savedMode (다음 한 번만)
    if (verifiedPhone && saved) {
      try {
        const p = JSON.parse(saved);
        const loggedInName = localStorage.getItem("v2_user_name") ?? "";
        // 로그인 이름이 다른 사람이면 이전 정보 무시 → 처음부터 (전화번호 입력)
        const nameOk = !loggedInName || !p.name || p.name === loggedInName;
        if (nameOk && (p.phone || "").replace(/[^0-9]/g, "") === verifiedPhone && p.birthYear && p.gender && p.birthHour) {
          setForm(prev => ({ ...prev, ...p, relationship: p.relationship || "나" }));
          setSavedMode(true);
          setPhoneStep(false);
          setChecking(false);
          return;
        }
        // 다른 사람 → 저장된 이전 정보 초기화
        if (!nameOk) {
          localStorage.removeItem("v2_saved_profile");
          localStorage.removeItem("v2_verified_phone");
        }
      } catch {}
    }
    setChecking(false); // 처음 방문 or 다른 사람 → 전화번호 입력 화면 표시
  }, []);

  const TOTAL = 5;
  const progress = (step / TOTAL) * 100;
  const cur = STEPS[step - 1];

  const checkPhone = async () => {
    const phone = phoneInput.replace(/[^0-9]/g, "");
    if (phone.length < 10) { alert("전화번호를 정확히 입력해주세요"); return; }
    setPhoneLoading(true);
    try {
      const res = await fetch(`/api/v2/customer?phone=${encodeURIComponent(phone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.profile) {
          const p = data.profile;
          const profileData = { name: p.name || "", birthYear: p.birthYear || "", birthMonth: p.birthMonth || "", birthDay: p.birthDay || "", gender: p.gender || "", birthHour: p.birthHour || "", phone, email: p.email || "" };
          setForm(prev => ({ ...prev, ...profileData, relationship: "나" }));
          localStorage.setItem("v2_saved_profile", JSON.stringify(profileData));
          localStorage.setItem("v2_verified_phone", phone);
          setSavedMode(true);
        } else {
          // Firebase에서 못 찾음 → 로컬에 기존 데이터 있으면 그대로 사용 (입력 전에 완성 가능)
          const localSaved = localStorage.getItem("v2_saved_profile");
          let usedLocal = false;
          if (localSaved) {
            try {
              const localP = JSON.parse(localSaved);
              if (localP.birthYear && localP.gender && localP.birthHour) {
                const profileData = { ...localP, phone };
                setForm(prev => ({ ...prev, ...profileData, relationship: localP.relationship || "나" }));
                localStorage.setItem("v2_saved_profile", JSON.stringify(profileData));
                localStorage.setItem("v2_verified_phone", phone);
                setSavedMode(true);
                usedLocal = true;
              }
            } catch {}
          }
          if (!usedLocal) {
            setForm({ name: "", relationship: "나", birthYear: "", birthMonth: "", birthDay: "", gender: "", birthHour: "", phone, email: "" });
            localStorage.removeItem("v2_saved_profile");
          }
        }
      } else {
        setForm(prev => ({ ...prev, phone }));
      }
    } catch {
      setForm(prev => ({ ...prev, phone }));
    }
    setPhoneStep(false);
    setPhoneLoading(false);
  };

  const finish = () => {
    sessionStorage.setItem("v2_profile", JSON.stringify(form));
    localStorage.setItem("v2_saved_profile", JSON.stringify({
      name: form.name, birthYear: form.birthYear, birthMonth: form.birthMonth, birthDay: form.birthDay,
      gender: form.gender, birthHour: form.birthHour, phone: form.phone, email: form.email,
    }));
    if (form.phone) localStorage.setItem("v2_verified_phone", form.phone.replace(/[^0-9]/g, ""));
    fetch("/api/v2/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});
    // 재방문자(savedMode)는 매번 분석 재실행 없이 메인으로 (보관함·결과는 메인에서 이동)
    if (savedMode) {
      const pendingPayUrl = sessionStorage.getItem("v2_profile_next_url");
      if (pendingPayUrl) {
        sessionStorage.removeItem("v2_profile_next_url");
        window.location.href = pendingPayUrl;
        return;
      }
      router.push("/main-v2");
      return;
    }
    // 결제 전 프로필 먼저 수집했을 때 → 결제 페이지로 복귀
    const pendingPayUrl = sessionStorage.getItem("v2_profile_next_url");
    if (pendingPayUrl) {
      sessionStorage.removeItem("v2_profile_next_url");
      window.location.href = pendingPayUrl;
      return;
    }
    // 유료 결제가 있으면 분석 재실행 없이 결과지로 (결과지에서 필요 시 자동 재호출함)
    if (localStorage.getItem("v2_paid") === "1") {
      router.push("/main-v2/result");
      return;
    }
    // 무료 플로우: 이전 결제 잔여 플래그 전부 제거 후 analysis로 강제 이동
    if (isFreeFlow) {
      sessionStorage.removeItem("v2_after_payment_goto");
      sessionStorage.removeItem("specialPaid");
      sessionStorage.removeItem("specialType");
      router.push("/main-v2/analysis");
      return;
    }
    const pendingModal = sessionStorage.getItem("v2_after_profile_modal");
    const afterPaymentGoto = sessionStorage.getItem("v2_after_payment_goto");
    if (pendingModal === "daewoon") {
      router.push("/main-v2/daewoon");
    } else if (pendingModal) {
      router.push("/main-v2");
    } else if (afterPaymentGoto === "special") {
      sessionStorage.removeItem("v2_after_payment_goto");
      router.push("/main-v2/special");
    } else {
      router.push("/main-v2/analysis");
    }
  };

  const next = () => {
    const ok: Record<number, boolean> = {
      1: !!form.name.trim() && !!form.relationship,
      2: !!(form.birthYear && form.birthMonth && form.birthDay),
      3: !!form.gender,
      4: !!form.birthHour,
      5: true,
    };
    if (!ok[step]) { alert("정보를 입력해주세요"); return; }
    if (step < TOTAL) { setStep(s => s + 1); return; }
    finish();
  };

  // 직접 접근 여부 확인 중 → 아무것도 렌더링하지 않음 (깜박임 방지)
  if (checking) return null;

  // ── 전화번호 본인 확인 화면 ──────────────────
  if (phoneStep && !isFreeFlow) {
    return (
      <main style={{ minHeight: "100vh", backgroundImage: "url('https://i.pinimg.com/1200x/3c/d5/82/3cd582b516489126cddf762e4ad4d717.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,5,50,0.68)", zIndex: 1, pointerEvents: "none" }} />
        <header style={{ position: "sticky", top: 0, zIndex: 100, height: 52, padding: "0 16px", display: "flex", alignItems: "center", background: "rgba(20,5,50,0.7)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            <span style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>←</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24" }}>🐱 점운 메인으로</span>
          </button>
        </header>
        <div style={{ position: "relative", zIndex: 10, maxWidth: 480, margin: "0 auto", padding: "40px 20px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔮</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px", textAlign: "center" }}>점운 사주 분석</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: "0 0 32px", textAlign: "center" }}>전화번호로 본인 확인 후 시작합니다</p>
          <div style={{ width: "100%", background: "rgba(60,20,100,0.72)", backdropFilter: "blur(16px)", borderRadius: 20, padding: "24px 20px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24", display: "block", marginBottom: 8 }}>📱 전화번호</label>
            <input
              type="tel" value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") checkPhone(); }}
              placeholder="010-0000-0000"
              style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1.5px solid rgba(251,191,36,0.4)", fontSize: 16, boxSizing: "border-box", outline: "none", color: "#1a1a2e", background: "rgba(255,255,255,0.9)", textAlign: "center", letterSpacing: 2 }}
            />
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "8px 0 20px", textAlign: "center" }}>전화번호로 기존 정보를 불러옵니다</p>
            <button
              onClick={checkPhone} disabled={phoneLoading}
              style={{ width: "100%", padding: "15px 0", background: phoneLoading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "#fff", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: phoneLoading ? "not-allowed" : "pointer" }}>
              {phoneLoading ? "확인 중..." : "다음 →"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── 저장된 정보 단일 폼 (유료 재방문자) ──────────────────
  if (savedMode) {
    const bgImg = "https://i.pinimg.com/1200x/3c/d5/82/3cd582b516489126cddf762e4ad4d717.jpg";
    const cardInp: React.CSSProperties = {
      width: "100%", padding: "13px 14px", borderRadius: 12,
      border: "1.5px solid rgba(251,191,36,0.4)", fontSize: 15,
      boxSizing: "border-box", outline: "none",
      fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      color: "#1a1a2e", background: "rgba(255,255,255,0.85)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    };
    return (
      <main style={{ minHeight: "100vh", backgroundImage: `url('${bgImg}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,5,50,0.68)", zIndex: 1, pointerEvents: "none" }} />
        <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
          <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24" }}>{brand?.businessName ? `🐱 ${brand.businessName}` : "🐱 점운"}</span>
          </button>
        </header>

        <div style={{ position: "relative", zIndex: 10, maxWidth: 480, margin: "0 auto", padding: "32px 16px 60px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 42, lineHeight: 1, marginBottom: 8 }}>🔮</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", margin: "0 0 4px" }}>점운 분석</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0 }}>당신의 정보를 입력해주세요</p>
          </div>

          <div style={{ background: "rgba(60,20,100,0.72)", backdropFilter: "blur(16px)", borderRadius: 20, padding: "22px 18px 24px", boxShadow: "0 12px 40px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontSize: 12, fontWeight: 900, color: "#fbbf24", margin: "0 0 14px" }}>본인 정보</p>

            <label style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24", display: "block", marginBottom: 6 }}>이름</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="이름 입력" style={{ ...cardInp, marginBottom: 14 }} />

            <label style={{ fontSize: 12, fontWeight: 700, color: "#fbbf24", display: "block", marginBottom: 6 }}>생년월일</label>
            <input type="number" value={form.birthYear} onChange={e => setForm(p => ({ ...p, birthYear: e.target.value }))} placeholder="1990" min="1900" max="2024" style={{ ...cardInp, marginBottom: 8, textAlign: "center" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              <select value={form.birthMonth} onChange={e => setForm(p => ({ ...p, birthMonth: e.target.value }))} style={{ ...cardInp, cursor: "pointer" }}>
                <option value="">월</option>
                {Array.from({ length: 12 }, (_, i) => <option key={i+1} value={String(i+1).padStart(2,"0")}>{i+1}월</option>)}
              </select>
              <select value={form.birthDay} onChange={e => setForm(p => ({ ...p, birthDay: e.target.value }))} style={{ ...cardInp, cursor: "pointer" }}>
                <option value="">일</option>
                {Array.from({ length: 31 }, (_, i) => <option key={i+1} value={String(i+1).padStart(2,"0")}>{i+1}일</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
              {HOURS.filter(h => h.value !== "unknown").map(h => (
                <button key={h.value} onClick={() => setForm(p => ({ ...p, birthHour: h.value }))}
                  style={{ padding: "8px 2px", borderRadius: 10, border: form.birthHour === h.value ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", background: form.birthHour === h.value ? "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))" : "#fdf2f8", color: form.birthHour === h.value ? "#be185d" : "#374151", fontWeight: 800, fontSize: 10, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                  <div>{h.label}</div>
                  <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{h.time}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setForm(p => ({ ...p, birthHour: "unknown" }))}
              style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: form.birthHour === "unknown" ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", background: form.birthHour === "unknown" ? "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))" : "#fdf2f8", color: form.birthHour === "unknown" ? "#be185d" : "#374151", fontWeight: 800, fontSize: 13, cursor: "pointer", marginBottom: 20 }}>
              모름
            </button>

            <button
              onClick={() => {
                if (!form.birthYear || !form.birthMonth || !form.birthDay) { alert("생년월일을 입력해주세요"); return; }
                if (!form.birthHour) { alert("태어난 시를 선택해주세요"); return; }
                finish();
              }}
              style={{ width: "100%", padding: "16px 0", background: "#fbbf24", color: "#1a0f2e", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 17, cursor: "pointer", boxShadow: "0 6px 22px rgba(251,191,36,0.45)" }}>
              분석 시작
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("v2_saved_profile");
                localStorage.removeItem("v2_verified_phone");
                setSavedMode(false);
                setPhoneInput("");
                setPhoneStep(true);
              }}
              style={{ width: "100%", padding: "11px 0", marginTop: 10, background: "transparent", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              다른 사람 정보로 보기 (배우자·자녀 등)
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── 5단계 마법사 (새 사용자 or 무료 플로우) ──────────────
  return (
    <main style={{ minHeight: "100vh", backgroundImage: `url('${STEP_BACKGROUNDS[step]}'), ${BG}`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative" }}>

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0 }}>←</button>
          )}
          <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{brand?.businessName ? `🐱 ${brand.businessName}` : "🐱 점운"}</span>
          </button>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#8b5cf6" }}>{step} / {TOTAL}</span>
      </header>

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
            <div>
              <label style={{ fontSize: 13, fontWeight: 800, color: "#374151", display: "block", marginBottom: 6 }}>이름 (별명도 괜찮아요)</label>
              <input
                autoFocus
                type="text" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="홍길동"
                style={{ ...inp, marginBottom: 18 }}
                onFocus={e => (e.currentTarget.style.borderColor = "#fbbf24")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")}
              />
              <label style={{ fontSize: 13, fontWeight: 800, color: "#374151", display: "block", marginBottom: 8 }}>누구의 운세인가요?</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
              {RELS.map(r => (
                <button key={r.value} onClick={() => setForm(p => {
                  if (r.value === p.relationship) return { ...p, relationship: r.value };
                  return { ...p, relationship: r.value, gender: "", birthYear: "", birthMonth: "", birthDay: "", birthHour: "" };
                })}
                  style={{ padding: "15px 8px", borderRadius: 14, border: form.relationship === r.value ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", background: form.relationship === r.value ? "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))" : "#fdf2f8", cursor: "pointer", textAlign: "center", boxShadow: form.relationship === r.value ? "0 4px 14px rgba(251,191,36,0.25)" : "none", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: form.relationship === r.value ? "#be185d" : "#374151" }}>{r.label}</div>
                </button>
              ))}
            </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
                <input type="number" value={form.birthYear} onChange={e => {
                  if (e.target.value === form.birthYear) return;
                  setForm(p => ({ ...p, birthYear: e.target.value, gender: "", birthHour: "" }));
                }} placeholder="1990" min="1900" max="2024" style={{ ...inp, textAlign: "center" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#fbbf24")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")} />
                <select value={form.birthMonth} onChange={e => {
                  if (e.target.value === form.birthMonth) return;
                  setForm(p => ({ ...p, birthMonth: e.target.value, gender: "", birthHour: "" }));
                }} style={{ ...inp, textAlign: "center" }}>
                  <option value="">월</option>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}월</option>)}
                </select>
                <select value={form.birthDay} onChange={e => {
                  if (e.target.value === form.birthDay) return;
                  setForm(p => ({ ...p, birthDay: e.target.value, gender: "", birthHour: "" }));
                }} style={{ ...inp, textAlign: "center" }}>
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
              <input autoFocus type="tel" value={form.phone}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  let formatted = digits;
                  if (digits.length > 3 && digits.length <= 7) formatted = `${digits.slice(0,3)}-${digits.slice(3)}`;
                  else if (digits.length > 7) formatted = `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
                  setForm(p => ({ ...p, phone: formatted }));
                }}
                placeholder="010-0000-0000" style={inp}
                onFocus={e => (e.currentTarget.style.borderColor = "#fbbf24")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")} />
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="example@email.com" style={inp}
                onFocus={e => (e.currentTarget.style.borderColor = "#fbbf24")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")} />
              <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(6px)", borderRadius: 14, padding: "14px 14px 12px", border: "1.5px solid rgba(251,191,36,0.35)" }}>
                <p style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px" }}>📋 개인정보 수집·이용 동의서</p>
                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.8, marginBottom: 12 }}>
                  <div>• 수집 목적: 사주 분석 서비스 제공</div>
                  <div>• 수집 항목: 이름, 생년월일, 성별, 출생시간, 전화번호, 이메일</div>
                  <div>• 보유 기간: 3년</div>
                  <div>• 동의 거부: 서비스 이용 불가</div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                  <input type="checkbox" checked={agreed} onChange={e => {
                    setAgreed(e.target.checked);
                    localStorage.setItem("v2_privacy_agreed", e.target.checked ? "1" : "0");
                    if (e.target.checked) localStorage.setItem("v2_privacy_agreed_at", String(Date.now()));
                  }} style={{ width: 18, height: 18, accentColor: "#fbbf24", cursor: "pointer", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: agreed ? "#be185d" : "#374151" }}>
                    동의합니다 <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>(필수)</span>
                  </span>
                </label>
              </div>
              <button
                onClick={() => {
                  if (!agreed) { alert("개인정보 수집·이용에 동의해주세요."); return; }
                  if (form.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone.replace(/\s/g, ""))) {
                    alert("전화번호 형식을 다시 확인해주세요 (예: 010-1234-5678)"); return;
                  }
                  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
                    alert("이메일 형식을 다시 확인해주세요 (예: example@email.com)"); return;
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
