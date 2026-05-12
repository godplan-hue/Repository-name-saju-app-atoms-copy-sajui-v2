"use client";

import { useState } from "react";

export default function Payment() {
  const [selectedPackage, setSelectedPackage] = useState("");

  const packages = [
    { id: "basic", name: "베이직", price: "₩9,900", features: ["기본 사주 분석", "총운 정보", "PDF 다운로드"] },
    { id: "standard", name: "스탠다드", price: "₩19,900", features: ["전체 사주 분석", "5개 운 분석", "궁합 분석", "PDF 다운로드", "상담 1회"] },
    { id: "premium", name: "프리미엄", price: "₩24,900", features: ["풀 사주 분석", "상세 운세", "궁합 + 미래운", "PDF + 이미지", "상담 3회"] },
    { id: "couple", name: "커플팩", price: "₩29,900", features: ["2인 사주 분석", "궁합 상세 분석", "미래 예측", "영상 상담 1회"] }
  ];

  const handlePayment = () => {
    if (!selectedPackage) {
      alert("패키지를 선택해주세요");
      return;
    }
    alert(`${selectedPackage} 패키지가 선택되었습니다. 결제 진행 예정`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px" }}>
        <h1 style={{ textAlign: "center", color: "#fbbf24", marginBottom: 40, fontSize: "clamp(20px, 5vw, 32px)", fontWeight: 900 }}>💳 유료 패키지</h1>

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {packages.map(pkg => (
            <div key={pkg.id} onClick={() => setSelectedPackage(pkg.name)} style={{ background: selectedPackage === pkg.name ? "rgba(251,191,36,0.2)" : "rgba(108,64,200,0.7)", border: selectedPackage === pkg.name ? "2px solid #fbbf24" : "1px solid rgba(139,92,246,0.8)", borderRadius: 12, padding: 20, cursor: "pointer", transition: "all 0.3s" }}>
              <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.name}</h3>
              <p style={{ color: "#f5f5f5", fontSize: 24, fontWeight: 900, margin: "0 0 20px 0" }}>{pkg.price}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {pkg.features.map((feature, i) => (
                  <li key={i} style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, marginBottom: 8, paddingLeft: 20, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0 }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 20 }}>
            선택된 패키지: <span style={{ color: "#fbbf24", fontWeight: 900 }}>{selectedPackage || "없음"}</span>
          </p>
          <button onClick={handlePayment} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: "pointer" }}>💳 결제하기</button>
        </div>
      </div>
    </main>
  );
}