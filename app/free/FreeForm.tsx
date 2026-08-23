"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";

export default function FreeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hpField, setHpField] = useState(""); // 허니팟 — 봇 방지용 숨김 필드, 사람 눈엔 안 보임
  const [agreed, setAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.name) setName(p.name);
      if (p.phone) setPhone(p.phone);
      if (p.email) setEmail(p.email);
    } catch {}
  }, []);

  async function handleSubmit() {
    if (hpField) return; // 봇 감지 — 조용히 무시
    const clean = phone.replace(/\D/g, "");
    if (clean.length < 10) { setError("전화번호를 정확히 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }

    setLoading(true); setError("");

    // 리드 DB 저장 — 응답 기다려서 중복 차단
    try {
      const res = await fetch("/api/free-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: clean, email: email.trim(), marketing: marketingAgreed }),
      });
      const data = await res.json();
      if (data.duplicate) {
        setError("이 전화번호로 이미 무료 재물운을 받으셨어요.\n유료 결제로 더 자세한 분석을 받아보세요.");
        setLoading(false);
        return;
      }
    } catch {
      // 네트워크 오류는 무시하고 진행
    }

    // 기본 프로필 localStorage 저장 (payment-complete 폼에서 이름 pre-fill용)
    localStorage.setItem("v2_saved_profile", JSON.stringify({
      name: name.trim(),
      phone: clean,
      email: email.trim(),
    }));

    // 재물운 결제 완료 플로우 (naming=1 아님 — 재물운 개별 분석)
    localStorage.setItem("v2_paid", "1");
    localStorage.setItem("v2_plan", "select");
    try {
      const cats = JSON.parse(localStorage.getItem("v2_paid_cats") || "[]");
      if (!cats.includes("💰 재물운")) cats.push("💰 재물운");
      localStorage.setItem("v2_paid_cats", JSON.stringify(cats));
    } catch {
      localStorage.setItem("v2_paid_cats", JSON.stringify(["💰 재물운"]));
    }

    // 일반 재물운 플로우: 이름/생년월일 폼 → 분석 → result/page.tsx
    window.location.href = "/payment-complete?package=" + encodeURIComponent("💰 재물운") + "&paid=0";
  }

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "24px 20px", boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 }}>이름 <span style={{ fontWeight: 400, color: "#9ca3af" }}>(선택)</span></label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="홍길동"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#ec4899", fontWeight: 900 }}>★ 필수</span></label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        <input
          type="text" name="website" value={hpField} onChange={e => setHpField(e.target.value)}
          autoComplete="off" tabIndex={-1} aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 800, color: "#6b7280", display: "block", marginBottom: 6 }}>이메일 <span style={{ fontWeight: 400, color: "#9ca3af" }}>(선택)</span></label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com"
          style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            style={{ marginTop: 2, accentColor: "#ec4899", width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
            <strong style={{ color: "#374151" }}>[필수] 개인정보 수집·이용 동의</strong><br />
            <strong style={{ color: "#ec4899" }}>점운</strong>(<a href="https://jeomun.com" target="_blank" rel="noreferrer" style={{ color: "#7c3aed" }}>jeomun.com</a>)이 이름·전화번호·이메일을 서비스 제공에 활용하며, <strong>3년간</strong> 보유 후 파기합니다.
          </span>
        </label>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginTop: 8 }}>
          <input type="checkbox" checked={marketingAgreed} onChange={e => setMarketingAgreed(e.target.checked)}
            style={{ marginTop: 2, accentColor: "#ec4899", width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
            <strong style={{ color: "#374151" }}>[선택] 마케팅 수신 동의</strong><br />
            이벤트·할인·운세 소식을 문자·카카오로 받습니다. 언제든지 수신거부 가능합니다.
          </span>
        </label>
      </div>
      {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 10px", textAlign: "center", whiteSpace: "pre-line" }}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading}
        style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", background: G, color: "#fff", fontSize: 16, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 16px rgba(236,72,153,0.4)" }}>
        {loading ? "⏳ 이동 중..." : "🔮 무료 재물운 받기 →"}
      </button>
      <p style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", margin: "10px 0 0" }}>
        전화번호당 1회 제공 · 언제든지 수신거부 가능
      </p>
      <p style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", margin: "6px 0 0" }}>
        운영: <a href="https://jeomun.com" target="_blank" rel="noreferrer" style={{ color: "#7c3aed", textDecoration: "none" }}>점운 (jeomun.com)</a>
      </p>
    </div>
  );
}
