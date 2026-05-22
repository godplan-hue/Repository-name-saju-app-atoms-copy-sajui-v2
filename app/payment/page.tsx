"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Payment() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState("기본 분석");
  const [selectedFeatures, setSelectedFeatures] = useState(["yearlyLuck", "monthlyLuck"]);
  const [isMobile, setIsMobile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const packages = [
    { 
      id: "basic", 
      name: "기본 분석", 
      price: "₩9,900", 
      pages: 30,
      features: ["yearlyLuck", "monthlyLuck"],
      count: 2,
      desc: "올해 운세 + 월별 운세"
    },
    { 
      id: "standard", 
      name: "베이직", 
      price: "₩19,900", 
      pages: 75,
      features: ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck"],
      count: 4,
      desc: "올해 운세 + 월별 운세<br/>+ 재물운 + 연애운"
    },
    { 
      id: "premium", 
      name: "프리미엄", 
      price: "₩24,900", 
      pages: 100,
      features: ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck", "healthLuck"],
      count: 5,
      desc: "올해 운세 + 월별 운세<br/>+ 재물운 + 연애운 + 건강운"
    },
    { 
      id: "vip", 
      name: "VIP 커플팩", 
      price: "₩29,900", 
      pages: 150,
      features: ["name", "yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck", "healthLuck", "couple", "analysis"],
      count: 8,
      desc: "본인 분석(8개) + 상대방 정보 입력<br/>궁합분석 포함"
    }
  ];

  const fortuneItems = [
    { id: "name", icon: "📝", name: "이름분석" },
    { id: "yearlyLuck", icon: "☀️", name: "올해 운세" },
    { id: "monthlyLuck", icon: "🌙", name: "월별 운세" },
    { id: "analysis", icon: "✨", name: "전체 사주분석" },
    { id: "wealthLuck", icon: "💎", name: "재물운" },
    { id: "loveLuck", icon: "💕", name: "연애운" },
    { id: "healthLuck", icon: "🌿", name: "건강운" },
    { id: "couple", icon: "👫", name: "궁합분석" }
  ];

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg.name);
    setSelectedFeatures(pkg.features);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const currentPages = packages.find(p => p.name === selectedPackage)?.pages || 30;
      router.push(`/payment-complete?package=${selectedPackage}&pages=${currentPages}`);
    } catch (error) {
      alert("결제 처리 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPackage = packages.find(p => p.name === selectedPackage);
  const currentPages = currentPackage?.pages || 30;
  const currentCount = currentPackage?.count || 2;

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #d97706 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1719399184315-5ffab4006e18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fCVFQyVCQiVBOCVFQyU4NSU4OSUyMCVFQyU5NSU4NCVFRCU4QSVCOHxlbnwwfHwwfHx8MA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(194, 65, 12, 0.2)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px" }}>
        
        {/* 상단 설명 */}
        <section style={{ maxWidth: 800, margin: "0 auto 60px", textAlign: "center" }}>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>정확한 사주 원국 분석</h1>
          <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 12, lineHeight: 1.8 }}>음양오행·천간지지 십성 완벽 분석</p>
          <p style={{ color: "#ff1493", fontSize: 15, fontWeight: 900, marginBottom: 24 }}>최고 수준의 사주 분석</p>
          <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 32, lineHeight: 1.8 }}>당신의 인생을 완벽하게 읽어드립니다</p>
          
          {isMobile ? (
            <p style={{ color: "#ff1493", fontSize: 15, fontWeight: 900, marginBottom: 24, lineHeight: 1.8 }}>
              30페이지 기본분석부터<br/>150페이지 완벽분석까지<br/>올해 운세, 월별 운세,<br/>재물운, 연애운, 건강운,<br/>궁합분석까지
            </p>
          ) : (
            <p style={{ color: "#ff1493", fontSize: 15, fontWeight: 900, marginBottom: 24, lineHeight: 1.8 }}>
              30페이지 기본분석부터 150페이지 완벽분석까지<br/>올해 운세, 월별 운세, 재물운, 연애운, 건강운, 궁합분석까지
            </p>
          )}
        </section>

        {/* 패키지 선택 */}
        <h2 style={{ textAlign: "center", color: "#d4af37", marginBottom: 40, fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900 }}>💳 패키지 선택</h2>

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {packages.map(pkg => (
            <div key={pkg.id} onClick={() => handlePackageSelect(pkg)} style={{ background: selectedPackage === pkg.name ? "rgba(251,191,36,0.2)" : "rgba(108,64,200,0.9)", border: selectedPackage === pkg.name ? "2px solid #fbbf24" : "1px solid rgba(139,92,246,0.8)", borderRadius: 12, padding: 20, cursor: "pointer", transition: "all 0.3s" }}>
              <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.name}</h3>
              <p style={{ color: "#f5f5f5", fontSize: 24, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.price}</p>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 10px 0", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: "0 0 6px 0" }}>🎯 {pkg.count}개 운세</p>
              <p style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, margin: 0 }}>📄 {pkg.pages}페이지</p>
            </div>
          ))}
        </div>

        {/* 가격 정보 */}
        <div style={{ maxWidth: 1000, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ color: "#ffffff", fontSize: 14, fontWeight: 900 }}>💰 9,900~29,900원</p>
        </div>

        {/* 선택된 운세 */}
        <div style={{ maxWidth: 1000, margin: "0 auto", marginBottom: 40, background: "#f5f5f5", padding: 24, borderRadius: 12 }}>
          <h3 style={{ color: "#1a1a1a", fontSize: 18, fontWeight: 900, marginBottom: 20 }}>✨ 포함된 운세</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {fortuneItems.map(item => (
              <div key={item.id} style={{ background: selectedFeatures.includes(item.id) ? "#ff1493" : "#e0e0e0", border: selectedFeatures.includes(item.id) ? "2px solid #ff69b4" : "1px solid #cccccc", borderRadius: 10, padding: 12, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <p style={{ color: selectedFeatures.includes(item.id) ? "#ffffff" : "#1a1a1a", fontSize: 11, fontWeight: 900, margin: 0, whiteSpace: "normal", wordBreak: "keep-all" }}>{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 왜 점운인가 */}
        <section style={{ maxWidth: 900, margin: "0 auto 60px", background: "rgba(139,92,246,0.2)", padding: 40, borderRadius: 12 }}>
          <h2 style={{ textAlign: "center", color: "#fbbf24", fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 900, marginBottom: 40 }}>왜 점운인가?</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginBottom: 8 }}>사주 완벽분석</h3>
              <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900 }}>기본분석(30P)부터<br/>VIP(150P)까지</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginBottom: 8 }}>합리적인 가격</h3>
              <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900 }}>9,900~29,900원</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginBottom: 8 }}>즉시 다운로드</h3>
              <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900 }}>3분 이내 PDF 완성</p>
            </div>
          </div>
        </section>

        {/* 결제 버튼 */}
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#ffffff", fontSize: 14, fontWeight: 900, marginBottom: 10 }}>
            선택된 패키지: <span style={{ color: "#fbbf24", fontWeight: 900 }}>{selectedPackage}</span>
          </p>
          <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900, marginBottom: 10 }}>
            🎯 {currentCount}개 운세
          </p>
          <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900, marginBottom: 20 }}>
            📄 {currentPages}페이지
          </p>
          <button onClick={handlePayment} disabled={isProcessing} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: isProcessing ? "not-allowed" : "pointer", opacity: isProcessing ? 0.6 : 1 }}>💳 {isProcessing ? "처리중..." : "결제하기"}</button>
        </div>
      </div>
    </main>
  );
}