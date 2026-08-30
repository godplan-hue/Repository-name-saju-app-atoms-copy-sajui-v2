"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { lunarToSolar } from "@/lib/lunarToSolar";

const HOURS = [
  "모름", "자시(23~01시)", "축시(01~03시)", "인시(03~05시)", "묘시(05~07시)",
  "진시(07~09시)", "사시(09~11시)", "오시(11~13시)", "미시(13~15시)",
  "신시(15~17시)", "유시(17~19시)", "술시(19~21시)", "해시(21~23시)",
];

interface Props {
  partnerId: string;
  ctaText: string;
  primary: string;
  formType?: string;
}

interface PersonForm {
  name: string;
  birth: string;
  gender: "male" | "female" | "";
  hour: string;
  lunar: boolean;
}

const emptyPerson = (): PersonForm => ({ name: "", birth: "", gender: "", hour: "모름", lunar: false });

export default function LandingForm({ partnerId, ctaText, primary, formType = "1person" }: Props) {
  const router = useRouter();
  const is2person = formType === "2person";

  const [phone, setPhone] = useState("");
  const [p1, setP1] = useState<PersonForm>(emptyPerson());
  const [p2, setP2] = useState<PersonForm>(emptyPerson());
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!p1.name.trim()) return "이름을 입력해주세요.";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) return "전화번호를 입력해주세요.";
    if (p1.birth.length !== 8 || isNaN(Number(p1.birth))) return "생년월일 8자리를 입력해주세요. 예) 19950315";
    if (!p1.gender) return "성별을 선택해주세요.";
    if (is2person) {
      if (!p2.name.trim()) return "상대방 이름을 입력해주세요.";
      if (p2.birth.length !== 8 || isNaN(Number(p2.birth))) return "상대방 생년월일 8자리를 입력해주세요.";
      if (!p2.gender) return "상대방 성별을 선택해주세요.";
    }
    return "";
  };

  const buildProfile = (p: PersonForm, phoneNum: string, email = "") => ({
    name: p.name.trim(),
    birthYear: p.birth.slice(0, 4), birthMonth: p.birth.slice(4, 6), birthDay: p.birth.slice(6, 8),
    gender: p.gender, birthHour: p.hour === "모름" ? "" : p.hour.replace(/\(.*\)/, "").trim(),
    isLunar: p.lunar, phone: phoneNum, email,
  });

  const handleSubmit = async () => {
    const validErr = validate();
    if (validErr) { setErr(validErr); return; }
    setErr("");
    setLoading(true);

    const cleanPhone = phone.replace(/\D/g, "");
    const profile1 = buildProfile(p1, cleanPhone);

    try {
      await fetch("/api/v2/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile1, referredBy: partnerId }),
      });
    } catch {}

    try {
      // 사주 계산은 항상 양력 기준이라, 음력으로 입력한 고객은 저장 직전에
      // 양력으로 변환해준다. 고객 DB기록(profile1, 위 /api/v2/customer 호출)은
      // 원본 입력값 그대로 남기고, 여기 로컬 저장값만 변환한다.
      const toSajuProfile = (p: PersonForm, base: ReturnType<typeof buildProfile>) => {
        if (!p.lunar) return base;
        const solar = lunarToSolar(Number(base.birthYear), Number(base.birthMonth), Number(base.birthDay));
        return {
          ...base,
          birthYear: String(solar.year),
          birthMonth: String(solar.month).padStart(2, "0"),
          birthDay: String(solar.day).padStart(2, "0"),
        };
      };

      localStorage.setItem("v2_saved_profile", JSON.stringify(toSajuProfile(p1, profile1)));
      localStorage.setItem("referred_by", partnerId);
      if (is2person) {
        const profile2 = buildProfile(p2, "");
        localStorage.setItem("v2_partner_profile", JSON.stringify(toSajuProfile(p2, profile2)));
      }
    } catch {}

    setLoading(false);
    router.push(`/main-v2?ref=${partnerId}`);
  };

  const inp = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #e5e7eb", background: "white",
    fontSize: 15, outline: "none", boxSizing: "border-box" as const,
    fontFamily: "inherit", color: "#1f2937",
  };
  const label = { fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6, display: "block" as const };

  const PersonFields = ({ p, setP, prefix }: { p: PersonForm; setP: (fn: (prev: PersonForm) => PersonForm) => void; prefix: string }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={label}>{prefix} 이름</label>
        <input value={p.name} onChange={e => setP(prev => ({ ...prev, name: e.target.value }))} style={inp} placeholder="예) 홍길동" maxLength={10} />
      </div>
      <div>
        <label style={label}>{prefix} 생년월일 <span style={{ fontWeight: 400, color: "#9ca3af" }}>(8자리)</span></label>
        <input
          value={p.birth}
          onChange={e => setP(prev => ({ ...prev, birth: e.target.value.replace(/\D/g, "").slice(0, 8) }))}
          style={inp} placeholder="예) 19950315" inputMode="numeric"
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => setP(prev => ({ ...prev, lunar: false }))} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${!p.lunar ? primary : "#e5e7eb"}`, background: !p.lunar ? `${primary}15` : "white", color: !p.lunar ? primary : "#9ca3af", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>양력</button>
          <button onClick={() => setP(prev => ({ ...prev, lunar: true }))} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${p.lunar ? primary : "#e5e7eb"}`, background: p.lunar ? `${primary}15` : "white", color: p.lunar ? primary : "#9ca3af", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>음력</button>
        </div>
      </div>
      <div>
        <label style={label}>{prefix} 성별</label>
        <div style={{ display: "flex", gap: 10 }}>
          {(["male", "female"] as const).map(g => (
            <button key={g} onClick={() => setP(prev => ({ ...prev, gender: g }))} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: `1.5px solid ${p.gender === g ? primary : "#e5e7eb"}`, background: p.gender === g ? `${primary}15` : "white", color: p.gender === g ? primary : "#9ca3af", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              {g === "male" ? "🙋‍♂️ 남자" : "🙋‍♀️ 여자"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label style={label}>{prefix} 태어난 시간 <span style={{ fontWeight: 400, color: "#9ca3af" }}>(선택)</span></label>
        <select value={p.hour} onChange={e => setP(prev => ({ ...prev, hour: e.target.value }))} style={{ ...inp, appearance: "none" as const, WebkitAppearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
          {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div id="form-section" style={{ background: "white", borderRadius: 20, padding: "28px 22px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", maxWidth: 480, margin: "0 auto" }}>
      <p style={{ textAlign: "center", fontWeight: 900, fontSize: 17, color: "#1f2937", margin: "0 0 24px" }}>
        {is2person ? "💑 두 분의 정보 입력하기" : "📋 정보 입력하기"}
      </p>

      {/* 전화번호 (1인 공통) */}
      <div style={{ marginBottom: 20 }}>
        <label style={label}>전화번호</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^\d-]/g, ""))}
          style={inp} placeholder="예) 010-1234-5678" inputMode="tel"
        />
      </div>

      {/* 1인 필드 */}
      {!is2person && <PersonFields p={p1} setP={setP1} prefix="" />}

      {/* 2인 필드 */}
      {is2person && (
        <>
          <div style={{ background: `${primary}08`, border: `1px solid ${primary}30`, borderRadius: 12, padding: "16px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: primary, margin: "0 0 14px" }}>👤 내 정보</p>
            <PersonFields p={p1} setP={setP1} prefix="나의" />
          </div>
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 14px", marginBottom: 4 }}>
            <p style={{ fontSize: 13, fontWeight: 900, color: "#374151", margin: "0 0 14px" }}>👤 상대방 정보</p>
            <PersonFields p={p2} setP={setP2} prefix="상대방" />
          </div>
        </>
      )}

      {err && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 12, textAlign: "center" }}>{err}</p>}

      <button
        onClick={handleSubmit} disabled={loading}
        style={{ width: "100%", marginTop: 22, padding: "15px 0", background: loading ? "#d1d5db" : `linear-gradient(135deg, ${primary}, ${primary}cc)`, color: "white", border: "none", borderRadius: 12, fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : `0 4px 16px ${primary}40` }}
      >
        {loading ? "저장 중..." : `🔮 ${ctaText}`}
      </button>
      <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 10 }}>무료 오늘의 운세로 먼저 체험해보세요</p>
    </div>
  );
}
