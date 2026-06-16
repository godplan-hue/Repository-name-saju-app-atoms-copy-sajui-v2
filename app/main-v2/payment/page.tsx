"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Payment() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState("기본 분석");
  const [selectedFeatures, setSelectedFeatures] = useState(["yearlyLuck", "monthlyLuck"]);
  const SELECT_CATS = [
    { key: "💰 재물운", icon: "💰" },
    { key: "💕 연애운", icon: "💕" },
    { key: "💪 건강운", icon: "💪" },
    { key: "🎯 성공운", icon: "🎯" },
    { key: "✨ 총운",   icon: "✨" },
  ];
  const [selectedCats, setSelectedCats] = useState<string[]>(SELECT_CATS.map(c => c.key));
  const [isMobile, setIsMobile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisName, setAnalysisName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);

      const name = sessionStorage.getItem("analysisName") || "분석 완료";
      setAnalysisName(name);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const packages = [
    {
      id: "basic",
      name: "기본 분석",
      price: "₩9,900",
      pages: 30,
      features: ["yearlyLuck", "monthlyLuck"],
      count: 2,
      chars: "전문가급 심층 분析",
      desc: "올해 운세 + 월별 운세"
    },
    {
      id: "standard",
      name: "베이직",
      price: "₩19,900",
      pages: 75,
      features: ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck"],
      count: 4,
      chars: "전문가급 심층 분析",
      desc: "올해 운세 + 월별 운세 + 재물운 + 연애운"
    },
    {
      id: "premium",
      name: "프리미엄",
      price: "₩24,900",
      pages: 100,
      features: ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck", "healthLuck"],
      count: 5,
      chars: "전문가급 심층 분析",
      desc: "올해 운세 + 월별 운세 + 재물운 + 연애운 + 건강운"
    },
    {
      id: "vip",
      name: "VIP 커플팩",
      price: "₩29,900",
      pages: 150,
      features: ["name", "yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck", "healthLuck", "couple", "analysis"],
      count: 8,
      chars: "전문가급 심층 분析",
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
      sessionStorage.setItem("selectedPackage", selectedPackage);

      const currentPackage = packages.find(p => p.name === selectedPackage);
      const pages = currentPackage?.pages || 30;

      router.push(`/payment-complete?package=${encodeURIComponent(selectedPackage)}&pages=${pages}`);
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

        <h2 style={{ textAlign: "center", color: "#d4af37", marginBottom: 20, fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 900 }}>💳 패키지 선택</h2>

        {/* 헤더 배너 */}
        <div style={{ maxWidth: 1200, margin: "0 auto 30px", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔓</div>
          <h3 style={{ color: "#ffffff", fontSize: 18, fontWeight: 900, margin: "0 0 6px" }}>【전체 AI 심층 분석】</h3>
          <p style={{ color: "#f5f5f5", fontSize: 13, margin: "0 0 4px" }}>운세를 완전히 해석해드립니다</p>
          <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700, margin: 0 }}>₩990부터 시작 · 이미지 저장&amp;보관함 포함</p>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {packages.map(pkg => (
            <div key={pkg.id} onClick={() => handlePackageSelect(pkg)} style={{ background: selectedPackage === pkg.name ? "rgba(251,191,36,0.2)" : "rgba(108,64,200,0.9)", border: selectedPackage === pkg.name ? "2px solid #fbbf24" : "1px solid rgba(139,92,246,0.8)", borderRadius: 12, padding: 20, cursor: "pointer", transition: "all 0.3s" }}>
              <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 2px 0" }}>{pkg.name}</h3>
              <p style={{ color: "#f5f5f5", fontSize: 11, fontWeight: 700, margin: "0 0 8px 0", opacity: 0.85 }}>【심층 상세 분석】</p>
              <p style={{ color: "#f5f5f5", fontSize: 24, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.price}</p>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 10px 0", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: "0 0 6px 0" }}>🎯 {pkg.count}개 운세</p>
              <p style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, margin: 0 }}>📄 {(pkg as any).chars}</p>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 4 }}>【사주 완벽분석】</p>
          <p style={{ color: "#ffffff", fontSize: 14, fontWeight: 900 }}>990~29,900원</p>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", marginBottom: 20, background: "#f5f5f5", padding: 24, borderRadius: 12 }}>
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

        <div style={{ maxWidth: 500, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ color: "#ffffff", fontSize: 14, fontWeight: 900, marginBottom: 10 }}>
            선택된 패키지: <span style={{ color: "#fbbf24", fontWeight: 900 }}>{selectedPackage}</span>
          </p>
          <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900, marginBottom: 10 }}>
            🎯 {currentCount}개 운세
          </p>
          <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900, marginBottom: 20 }}>
            📄 {currentPackage?.chars ?? "전문가급 심층 분析"}
          </p>
          <button onClick={handlePayment} disabled={isProcessing} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: isProcessing ? "not-allowed" : "pointer", opacity: isProcessing ? 0.6 : 1, marginBottom: 12 }}>💳 {isProcessing ? "처리중..." : "결제하기"}</button>

          <a href="/main-v2" style={{ display: "inline-block", padding: 12, background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", textDecoration: "none" }}>
            ← 돌아가기
          </a>
        </div>

        {/* 운세 선택 섹션 */}
        <div style={{ maxWidth: 1000, margin: "0 auto 40px", background: "#f5f5f5", padding: "16px 20px", borderRadius: 12 }}>
          <h2 style={{ color: "#1a1a1a", fontSize: 15, fontWeight: 900, marginBottom: 6 }}>어떤 운세를 확인할까요?</h2>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
            <span style={{ color: "#1a1a1a" }}>(1개 선택 · </span><span style={{ color: "#ef4444", fontWeight: 900 }}>₩990</span><span style={{ color: "#1a1a1a" }}>)</span>
          </p>

          <button
            onClick={() => setSelectedCats(selectedCats.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
            style={{ width: "100%", padding: "8px 14px", marginBottom: 8, background: selectedCats.length === SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 8, fontWeight: 800, fontSize: 12, color: selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <span>✨ 전체 선택</span>
            <span style={{ fontSize: 14 }}>{selectedCats.length === SELECT_CATS.length ? "☑️" : "⬜"}</span>
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {SELECT_CATS.map(c => {
              const on = selectedCats.includes(c.key);
              return (
                <button key={c.key}
                  onClick={() => setSelectedCats(on ? selectedCats.filter(k => k !== c.key) : [...selectedCats, c.key])}
                  style={{ padding: "9px 14px", border: `1.5px solid ${on ? "#ec4899" : "#e5e7eb"}`, borderRadius: 8, background: on ? "#fdf2f8" : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{c.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: on ? "#ec4899" : "#374151" }}>{c.key.replace(/\S+\s/, "")}</span>
                      <span style={{ fontSize: 10, color: "#1a1a1a", marginLeft: 6 }}>약 5,500자</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 15 }}>{on ? "✅" : "⬜"}</span>
                </button>
              );
            })}
          </div>

          {/* 운세 보기 버튼 */}
          <button
            onClick={() => {
              if (selectedCats.length === 0) return;
              const pkgName = selectedCats.map(c => c.replace(/\S+\s/, "")).join("+");
              router.push(`/payment-complete?package=${encodeURIComponent(pkgName)}&pages=${selectedCats.length * 30}`);
            }}
            disabled={selectedCats.length === 0}
            style={{ width: "100%", marginTop: 14, padding: "13px 0", background: selectedCats.length > 0 ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "#e5e7eb", color: selectedCats.length > 0 ? "white" : "#9ca3af", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: selectedCats.length > 0 ? "pointer" : "not-allowed", boxShadow: selectedCats.length > 0 ? "0 4px 16px rgba(236,72,153,0.35)" : "none" }}
          >
            {selectedCats.length > 0 ? `💎 ${selectedCats.length}개 결제하기 · ₩${(selectedCats.length * 990).toLocaleString()}` : "운세를 선택하세요"}
          </button>
        </div>

        <section style={{ maxWidth: 900, margin: "0 auto 60px", background: "rgba(139,92,246,0.2)", padding: 40, borderRadius: 12 }}>
          <h2 style={{ textAlign: "center", color: "#fbbf24", fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 900, marginBottom: 40 }}>【왜 점운인가?】</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginBottom: 8 }}>사주 완벽분석</h3>
              <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900 }}>990원부터<br/>VIP 커플팩 분석까지</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginBottom: 8 }}>합리적인 가격</h3>
              <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900 }}>990~29,900원</p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
              <h3 style={{ color: "#fbbf24", fontWeight: 900, marginBottom: 8 }}>즉시 다운로드</h3>
              <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900 }}>30초 이내 완성</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
