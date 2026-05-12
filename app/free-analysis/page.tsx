"use client";

import { useState } from "react";

export default function FreeAnalysis() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [analyzing, setAnalyzing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const phoneOnly = value.replace(/[^0-9]/g, "");
      let formatted = phoneOnly;
      if (phoneOnly.length > 3 && phoneOnly.length <= 7) {
        formatted = phoneOnly.slice(0, 3) + "-" + phoneOnly.slice(3);
      } else if (phoneOnly.length > 7) {
        formatted = phoneOnly.slice(0, 3) + "-" + phoneOnly.slice(3, 7) + "-" + phoneOnly.slice(7, 11);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAnalyze = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("모든 정보를 입력해주세요");
      return;
    }
    setAnalyzing(true);
    setStep(2);
    setTimeout(() => setAnalyzing(false), 2000);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", width: "100%" }}>
          <h1 style={{ textAlign: "center", color: "#fbbf24", marginBottom: 40, fontSize: "clamp(20px, 5vw, 32px)", fontWeight: 900 }}>🔮 무료 사주 분석</h1>

          {step === 1 && (
            <div style={{ background: "rgba(108,64,200,0.9)", padding: 24, borderRadius: 12, border: "1px solid rgba(139,92,246,1)" }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#fbbf24", fontSize: 14 }}>이름</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="홍길동" style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", fontSize: 14, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#fbbf24", fontSize: 14 }}>이메일</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", fontSize: 14, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000" }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 700, color: "#fbbf24", fontSize: 14 }}>전화번호</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="01012345678" maxLength={13} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", fontSize: 14, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000" }} />
              </div>
              <button onClick={handleAnalyze} style={{ width: "100%", padding: 12, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>분석 시작</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center" }}>
              {analyzing ? (
                <div style={{ background: "rgba(108,64,200,0.9)", padding: 40, borderRadius: 12, border: "1px solid rgba(139,92,246,1)" }}>
                  <p style={{ fontSize: 16, marginBottom: 30, color: "#f5f5f5" }}>AI가 당신의 사주를 분석 중입니다...</p>
                  <div style={{ fontSize: 40 }}>🔄</div>
                </div>
              ) : (
                <div style={{ background: "rgba(108,64,200,0.9)", padding: 24, borderRadius: 12, border: "1px solid rgba(139,92,246,1)" }}>
                  <p style={{ marginBottom: 20, lineHeight: 1.8, color: "#f5f5f5", fontSize: 14 }}>분석이 완료되었습니다!<br/><br/>더 자세한 분석 결과를 원하시나요?</p>
                  <button style={{ width: "100%", padding: 12, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>🎁 유료 패키지 보기</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}