"use client";

import { useState } from "react";

export default function Payment() {
  const [selectedPackage, setSelectedPackage] = useState("베이직");
  const [selectedFeatures, setSelectedFeatures] = useState(["wealth", "love", "health"]);

  const packages = [
    { 
      id: "basic", 
      name: "기본 분석", 
      price: "₩9,900", 
      features: ["today", "monthly"],
      desc: "오늘 운세 + 이번달 운세"
    },
    { 
      id: "standard", 
      name: "베이직", 
      price: "₩19,900", 
      features: ["wealth", "love", "health"],
      desc: "재물운 + 연애운 + 건강운"
    },
    { 
      id: "premium", 
      name: "프리미엄", 
      price: "₩24,900", 
      features: ["wealth", "love", "health", "yearly", "analysis"],
      desc: "재물운 + 연애운 + 건강운 + 올해 운세 + 전체 사주분석"
    },
    { 
      id: "couple", 
      name: "커플팩", 
      price: "₩29,900", 
      features: ["today", "monthly", "yearly", "wealth", "love", "health", "family", "couple"],
      desc: "남녀 각각 8개 운세 + 궁합 분석"
    }
  ];

  const fortuneItems = [
    { id: "today", icon: "☀️", name: "오늘 운세" },
    { id: "monthly", icon: "🌙", name: "이번달 운세" },
    { id: "yearly", icon: "🎋", name: "올해 운세" },
    { id: "analysis", icon: "✨", name: "전체 사주분석" },
    { id: "wealth", icon: "💎", name: "재물운 분석" },
    { id: "love", icon: "💕", name: "연애운 분석" },
    { id: "health", icon: "🌿", name: "건강운 분석" },
    { id: "couple", icon: "👫", name: "궁합 분석" }
  ];

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg.name);
    setSelectedFeatures(pkg.features);
  };

  const handlePayment = () => {
    alert(`${selectedPackage} 패키지 (${selectedFeatures.length}개 운세)가 선택되었습니다. 결제 진행 예정`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px" }}>
        <h1 style={{ textAlign: "center", color: "#fbbf24", marginBottom: 40, fontSize: "clamp(20px, 5vw, 32px)", fontWeight: 900 }}>💳 유료 패키지</h1>

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {packages.map(pkg => (
            <div key={pkg.id} onClick={() => handlePackageSelect(pkg)} style={{ background: selectedPackage === pkg.name ? "rgba(251,191,36,0.2)" : "rgba(108,64,200,0.9)", border: selectedPackage === pkg.name ? "2px solid #fbbf24" : "1px solid rgba(139,92,246,0.8)", borderRadius: 12, padding: 20, cursor: "pointer", transition: "all 0.3s" }}>
              <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.name}</h3>
              <p style={{ color: "#f5f5f5", fontSize: 24, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.price}</p>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 10px 0" }}>{pkg.desc}</p>
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: 0 }}>📊 {pkg.features.length}개 운세 포함</p>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", marginBottom: 40 }}>
          <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 20 }}>✨ 선택된 운세</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, background: "rgba(108,64,200,0.5)", padding: 20, borderRadius: 12 }}>
            {fortuneItems.map(item => (
              <div key={item.id} style={{ background: selectedFeatures.includes(item.id) ? "rgba(251,191,36,0.3)" : "rgba(139,92,246,0.3)", border: selectedFeatures.includes(item.id) ? "2px solid #fbbf24" : "1px solid rgba(139,92,246,0.5)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ color: "#f5f5f5", fontSize: 11, fontWeight: 700, margin: 0 }}>{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 20 }}>
            선택된 패키지: <span style={{ color: "#fbbf24", fontWeight: 900 }}>{selectedPackage}</span>
          </p>
          <button onClick={handlePayment} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: "pointer" }}>💳 결제하기</button>
        </div>
      </div>
    </main>
  );
}