"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isPartnerHost } from "@/lib/isPartnerHost";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG_IMG = "https://i.pinimg.com/1200x/3c/d5/82/3cd582b516489126cddf762e4ad4d717.jpg";

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
];

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

const label: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 900,
  color: "#1a1a2e", marginBottom: 7,
};

export default function V2Profile() {
  const router = useRouter();
  const [brand, setBrand] = useState<{ businessName: string; logoUrl: string } | null>(null);
  const [form, setForm] = useState({
    name: "", relationship: "나",
    birthYear: "", birthMonth: "", birthDay: "",
    gender: "", birthHour: "",
    phone: "", email: "",
  });
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (!isPartnerHost(hostname)) return;
    const slug = hostname.split(".")[0];
    fetch(`/api/partner/brand?subdomain=${encodeURIComponent(slug)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setBrand(data); })
      .catch(() => {});
  }, []);

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
    const saved = localStorage.getItem("v2_saved_profile");
    const loggedInName = localStorage.getItem("v2_user_name") ?? "";
    if (saved) {
      try {
        const p = JSON.parse(saved);
        const sameName = !loggedInName || p.name === loggedInName;
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

  const finish = () => {
    sessionStorage.setItem("v2_profile", JSON.stringify(form));
    localStorage.setItem("v2_saved_profile", JSON.stringify({
      name: form.name, birthYear: form.birthYear, birthMonth: form.birthMonth, birthDay: form.birthDay,
      gender: form.gender, birthHour: form.birthHour, phone: form.phone, email: form.email,
    }));
    fetch("/api/v2/customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});
    const pendingModal = sessionStorage.getItem("v2_after_profile_modal");
    if (pendingModal === "daewoon") {
      router.push("/main-v2/daewoon");
    } else if (pendingModal) {
      router.push("/main-v2");
    } else {
      router.push("/main-v2/analysis");
    }
  };

  const submit = () => {
    if (!form.name.trim()) { alert("이름을 입력해주세요"); return; }
    if (!form.birthYear || !form.birthMonth || !form.birthDay) { alert("생년월일을 입력해주세요"); return; }
    if (!form.gender) { alert("성별을 선택해주세요"); return; }
    if (!form.birthHour) { alert("태어난 시를 선택해주세요"); return; }
    if (!agreed) { alert("개인정보 수집·이용에 동의해주세요"); return; }
    if (form.phone && !/^01[0-9]-?\d{3,4}-?\d{4}$/.test(form.phone.replace(/\s/g, ""))) {
      alert("전화번호 형식을 다시 확인해주세요 (예: 010-1234-5678)"); return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      alert("이메일 형식을 다시 확인해주세요 (예: example@email.com)"); return;
    }
    finish();
  };

  const sel: React.CSSProperties = {
    padding: "11px 8px", borderRadius: 12, textAlign: "center",
    fontWeight: 900, fontSize: 12, cursor: "pointer", transition: "all 0.15s", border: "1.5px solid rgba(0,0,0,0.08)",
  };

  return (
    <main style={{ minHeight: "100vh", backgroundImage: `url('${BG_IMG}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.42)", pointerEvents: "none", zIndex: 0 }} />

      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {brand?.businessName ? `🐱 ${brand.businessName}` : "🐱 점운"}
          </span>
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#8b5cf6" }}>🔒 암호화 보호</span>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 60px", position: "relative", zIndex: 2 }}>

        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 44, lineHeight: 1, marginBottom: 8 }}>🐱</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 4px", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>내 사주 정보</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", margin: 0, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>저장된 정보가 있으면 자동으로 채워집니다</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.78)", backdropFilter: "blur(14px)", borderRadius: 24, padding: "22px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.18)", border: "1.5px solid rgba(251,191,36,0.45)", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* 이름 */}
          <div>
            <span style={label}>이름</span>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="이름을 입력해주세요" style={inp}
              onFocus={e => (e.currentTarget.style.borderColor = "#8b5cf6")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")} />
          </div>

          {/* 생년월일 */}
          <div>
            <span style={label}>생년월일</span>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
              <input type="number" value={form.birthYear}
                onChange={e => setForm(p => ({ ...p, birthYear: e.target.value }))}
                placeholder="1990" min="1900" max="2024"
                style={{ ...inp, textAlign: "center" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#fbbf24")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(251,191,36,0.4)")} />
              <select value={form.birthMonth} onChange={e => setForm(p => ({ ...p, birthMonth: e.target.value }))} style={{ ...inp, textAlign: "center" }}>
                <option value="">월</option>
                {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}월</option>)}
              </select>
              <select value={form.birthDay} onChange={e => setForm(p => ({ ...p, birthDay: e.target.value }))} style={{ ...inp, textAlign: "center" }}>
                <option value="">일</option>
                {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}일</option>)}
              </select>
            </div>
          </div>

          {/* 성별 */}
          <div>
            <span style={label}>성별</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[{ v: "남", label: "😼 남성" }, { v: "여", label: "😻 여성" }].map(g => (
                <button key={g.v} onClick={() => setForm(p => ({ ...p, gender: g.v }))}
                  style={{ ...sel, background: form.gender === g.v ? "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))" : "#fdf2f8", border: form.gender === g.v ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", color: form.gender === g.v ? "#be185d" : "#374151", padding: "16px 0", fontSize: 14, boxShadow: form.gender === g.v ? "0 4px 14px rgba(251,191,36,0.2)" : "none" }}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 태어난 시 */}
          <div>
            <span style={label}>태어난 시 <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>모르시면 '모름' 선택</span></span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 6 }}>
              {HOURS.map(h => (
                <button key={h.value} onClick={() => setForm(p => ({ ...p, birthHour: h.value }))}
                  style={{ ...sel, background: form.birthHour === h.value ? "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))" : "#fdf2f8", border: form.birthHour === h.value ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", color: form.birthHour === h.value ? "#be185d" : "#374151", boxShadow: form.birthHour === h.value ? "0 4px 14px rgba(251,191,36,0.2)" : "none", padding: "9px 4px" }}>
                  <div style={{ fontSize: 10 }}>{h.label}</div>
                  <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>{h.time}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setForm(p => ({ ...p, birthHour: "unknown" }))}
              style={{ ...sel, width: "100%", background: form.birthHour === "unknown" ? "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))" : "#fdf2f8", border: form.birthHour === "unknown" ? "2px solid #fbbf24" : "1.5px solid rgba(0,0,0,0.08)", color: form.birthHour === "unknown" ? "#be185d" : "#374151", padding: "11px 0", fontSize: 13, boxShadow: form.birthHour === "unknown" ? "0 4px 14px rgba(251,191,36,0.2)" : "none" }}>
              모름
            </button>
          </div>

          {/* 연락처 (선택) */}
          <div>
            <span style={{ ...label, marginBottom: 10 }}>연락처 <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>선택</span></span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="tel" value={form.phone}
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
            </div>
          </div>

          {/* 개인정보 동의 */}
          <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(6px)", borderRadius: 14, padding: "14px 14px 12px", border: "1.5px solid rgba(251,191,36,0.35)" }}>
            <p style={{ fontSize: 12, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>📋 개인정보 수집·이용 동의</p>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.8, marginBottom: 10 }}>
              <div>• 수집 목적: 사주 분석 서비스 제공</div>
              <div>• 수집 항목: 이름, 생년월일, 성별, 출생시간, 전화번호, 이메일</div>
              <div>• 보유 기간: 3년 · 동의 거부 시 서비스 이용 불가</div>
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

        </div>

        {/* 분석 시작 버튼 */}
        <button onClick={submit}
          style={{ width: "100%", marginTop: 16, padding: "16px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: "pointer", boxShadow: "0 6px 22px rgba(236,72,153,0.4)", letterSpacing: "-0.2px" }}>
          🔮 분석 시작
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 800, marginTop: 12, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>🔒 입력 정보는 암호화 보호됩니다</p>
      </div>
    </main>
  );
}
