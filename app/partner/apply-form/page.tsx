"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PartnerApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "silver";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const tierInfo: { [key: string]: { name: string } } = {
    free: { name: "무료" },
    silver: { name: "실버" },
    gold: { name: "골드" },
    platinum: { name: "플래티넘" },
    diamond: { name: "다이아" }
  };

  const info = tierInfo[tier] || tierInfo.silver;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      alert("모든 정보를 입력해주세요!");
      return;
    }
    if (formData.password.length < 4) {
      alert("비밀번호는 4자 이상이어야 합니다!");
      return;
    }

    sessionStorage.setItem("partnerSignupData", JSON.stringify(formData));

    if (tier === "free") {
      // 무료 등급은 결제가 없으니 바로 가입 처리
      setSubmitting(true);
      try {
        const res = await fetch("/api/partner/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, tier }),
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || "가입에 실패했습니다."); return; }
        alert(`가입이 완료되었습니다!\n할인코드: ${data.discountCode}\n이 코드를 고객에게 안내해주세요.`);
        router.push("/partner/login");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    router.push(`/payment-partner?tier=${tier}`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 500, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 40, borderRadius: 16, border: "1px solid rgba(139,92,246,0.3)", width: "100%" }}>
          
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900, marginBottom: 12, marginTop: 0, textAlign: "center" }}>파트너 가입</h1>
          <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 24 }}>{info.name} 등급</p>

          {/* 입력 폼 */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, display: "block", marginBottom: 6 }}>이름 *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 8, color: "#f5f5f5", fontWeight: 700, fontSize: 13, boxSizing: "border-box", marginBottom: 16 }} />

            <label style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, display: "block", marginBottom: 6 }}>이메일 *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일을 입력하세요" style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 8, color: "#f5f5f5", fontWeight: 700, fontSize: 13, boxSizing: "border-box", marginBottom: 16 }} />

            <label style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, display: "block", marginBottom: 6 }}>비밀번호 (4자 이상) *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 8, color: "#f5f5f5", fontWeight: 700, fontSize: 13, boxSizing: "border-box", marginBottom: 16 }} />

            <label style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, display: "block", marginBottom: 6 }}>전화번호 *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="010-0000-0000" style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(139,92,246,0.5)", borderRadius: 8, color: "#f5f5f5", fontWeight: 700, fontSize: 13, boxSizing: "border-box" }} />
          </div>

          {/* 버튼 */}
          <button onClick={handleSubmit} disabled={submitting} style={{ width: "100%", padding: 14, background: submitting ? "#999" : "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer", marginBottom: 12 }}>
            {submitting ? "처리중..." : "계속하기"}
          </button>

          <a href="/partner/apply" style={{ display: "block", textAlign: "center", padding: 14, background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", textDecoration: "none" }}>
            ← 돌아가기
          </a>
        </div>
      </div>
    </main>
  );
}


