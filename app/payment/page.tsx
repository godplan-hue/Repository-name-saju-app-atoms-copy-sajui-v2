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
      pages: 30,
      features: ["today", "monthly"],
      desc: "오늘 운세 + 이번달 운세"
    },
    { 
      id: "standard", 
      name: "베이직", 
      price: "₩19,900", 
      pages: 75,
      features: ["wealth", "love", "health"],
      desc: "재물운 + 연애운 + 건강운"
    },
    { 
      id: "premium", 
      name: "프리미엄", 
      price: "₩24,900", 
      pages: 100,
      features: ["wealth", "love", "health", "yearly", "analysis"],
      desc: "재물운 + 연애운 + 건강운<br/>+ 올해 운세 + 전체 사주분석"
    },
    { 
      id: "couple", 
      name: "VIP 커플팩", 
      price: "₩29,900", 
      pages: 150,
      features: ["today", "monthly", "yearly", "analysis", "wealth", "love", "health", "couple"],
      desc: "남녀 각각 8개 운세<br/>+ 궁합 분석"
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
    alert(`${selectedPackage} 패키지 (${selectedFeatures.length}개 운세, ${packages.find(p => p.name === selectedPackage)?.pages}페이지)가 선택되었습니다. 결제 진행 예정`);
  };

  const currentPages = packages.find(p => p.name === selectedPackage)?.pages || 30;

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #d97706 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1719399184315-5ffab4006e18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fCVFQyVCQiVBOCVFQyU4NSU4OSUyMCVFQyU5NSU4NCVFRCU4QSVCOHxlbnwwfHwwfHx8MA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(194, 65, 12, 0.2)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px" }}>
        
        {/* 상단 설명 */}
        <section style={{ maxWidth: 800, margin: "0 auto 60px", textAlign: "center" }}>
          <h1 style={{ color: "#d4af37", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>정확한 사주 원국 분석</h1>
          <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 12, lineHeight: 1.8 }}>음양오행·천간지지 십성 완벽 분석</p>
          <p style={{ color: "#991b1b", fontSize: 13, fontWeight: 700, marginBottom: 24 }}>최고 수준의 사주 분석</p>
          <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 32, lineHeight: 1.8 }}>당신의 인생을 완벽하게 읽어드립니다</p>
          <p style={{ color: "#991b1b", fontSize: 13, fontWeight: 700, marginBottom: 24 }}>50페이지 기본분석부터 150페이지 완벽분석까지<br/>당신의 성격, 재물운, 연애운, 건강운, 직업 추천, 올해 운세까지 모두 포함!</p>
        </section>

        {/* 패키지 선택 */}
        <h2 style={{ textAlign: "center", color: "#ea580c", marginBottom: 40, fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900 }}>💳 패키지 선택</h2>

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {packages.map(pkg => (
            <div key={pkg.id} onClick={() => handlePackageSelect(pkg)} style={{ background: selectedPackage === pkg.name ? "rgba(251,191,36,0.2)" : "rgba(108,64,200,0.9)", border: selectedPackage === pkg.name ? "2px solid #fbbf24" : "1px solid rgba(139,92,246,0.8)", borderRadius: 12, padding: 20, cursor: "pointer", transition: "all 0.3s" }}>
              <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.name}</h3>
              <p style={{ color: "#f5f5f5", fontSize: 24, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.price}</p>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 10px 0", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: "0 0 6px 0" }}>📊 {pkg.features.length}개 운세</p>
              <p style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, margin: 0 }}>📄 {pkg.pages}페이지</p>
            </div>
          ))}
        </div>

        {/* 선택된 운세 */}
        <div style={{ maxWidth: 1000, margin: "0 auto", marginBottom: 40, background: "#ea580c", padding: 24, borderRadius: 12 }}>
          <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, marginBottom: 20 }}>✨ 선택된 운세</h3>
          
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>첫 번째 (4개)</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {fortuneItems.slice(0, 4).map(item => (
                <div key={item.id} style={{ background: selectedFeatures.includes(item.id) ? "rgba(251,191,36,0.4)" : "rgba(251,191,36,0.2)", border: selectedFeatures.includes(item.id) ? "2px solid #fbbf24" : "1px solid rgba(251,191,36,0.5)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                  <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: 0 }}>{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>두 번째 (4개)</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {fortuneItems.slice(4, 8).map(item => (
                <div key={item.id} style={{ background: selectedFeatures.includes(item.id) ? "rgba(251,191,36,0.4)" : "rgba(251,191,36,0.2)", border: selectedFeatures.includes(item.id) ? "2px solid #fbbf24" : "1px solid rgba(251,191,36,0.5)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                  <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: 0 }}>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 왜 점운인가 */}
        <section style={{ maxWidth: 900, margin: "0 auto 60px", background: "rgba(139,92,246,0.2)", padding: 40, borderRadius: 12 }}>
          <h2 style={{ textAlign: "center", color: "#fbbf24", fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 900, marginBottom: 40 }}>왜 점운인가?</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginBottom: 8 }}>50-150페이지 완벽분석</h3>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700 }}>기본분석(30P)부터 VIP 커플팩(150P)까지</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginBottom: 8 }}>합리적인 가격</h3>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700 }}>9,900~29,900</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginbottom: 8 }}>즉시 다운로드</h3>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700 }}>3분 이내 PDF 완성</p>
            </div>
          </div>
        </section>

        {/* 결제 버튼 */}
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            선택된 패키지: <span style={{ color: "#fbbf24", fontWeight: 900 }}>{selectedPackage}</span>
          </p>
          <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
            📄 {currentPages}페이지
          </p>
          <button onClick={handlePayment} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: "pointer" }}>💳 결제하기</button>
        </div>
      </div>
    </main>
  );
}