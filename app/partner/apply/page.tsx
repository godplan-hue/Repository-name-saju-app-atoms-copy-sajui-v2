"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerApply() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState("");

  const tiers = [
    { name: "무료", fee: "₩0", month: "월 50건(연 최대 600건)", revenue: "30%", value: "free" },
    { name: "실버", fee: "₩150,000", month: "월 150건(연 최대 1,800건)", revenue: "45%", value: "silver" },
    { name: "골드", fee: "₩350,000", month: "월 300건(연 최대 3,600건)", revenue: "55%", value: "gold" },
    { name: "다이아", fee: "₩1,000,000", month: "무제한", revenue: "70%", value: "diamond" }
  ];

  const handleApply = (tier: string) => {
    router.push(`/partner/apply-form?tier=${tier}`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 1000, margin: "0 auto" }}>
        
        {/* 헤더 */}
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <a href="/partner" style={{ display: "inline-block", background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20, textDecoration: "none" }}>← 돌아가기</a>
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900, marginBottom: 12, marginTop: 0 }}>파트너 등급 선택</h1>
          <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, marginBottom: 0 }}>점운과 함께 수익을 창출하세요</p>
        </div>

        {/* 등급 선택 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 40 }}>
          {tiers.map((tier) => (
            <div key={tier.value} style={{ background: "rgba(139,92,246,0.65)", border: "2px solid rgba(245,158,11,0.4)", borderRadius: 12, padding: 20, textAlign: "center", cursor: "pointer", transition: "all 0.3s", transform: selectedTier === tier.value ? "scale(1.05)" : "scale(1)" }} onClick={() => setSelectedTier(tier.value)}>
              <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 16px 0" }}>{tier.name}</h2>
              <p style={{ color: "#f5f5f5", fontSize: 20, fontWeight: 900, margin: "0 0 12px 0" }}>{tier.fee}</p>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 8px 0" }}>
                한도: {tier.month.split("(")[0]}
                {tier.month.includes("(") && (<><br/><br/>({tier.month.split("(")[1]}</>)}
              </p>
              <p style={{ color: "#ff9500", fontSize: 12, fontWeight: 900, margin: "0 0 16px 0" }}>사용료 {tier.revenue} 할인</p>
              <button onClick={() => handleApply(tier.value)} style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>가입하기</button>
            </div>
          ))}
        </div>

        {/* 설명 */}
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
          <h3 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12, marginTop: 0 }}>📋 파트너 정보</h3>
          <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
            <li>• 분석 1건 생성할 때마다 등급별 할인이 적용된 사용료가 즉시 청구됩니다</li>
            <li>• 무료 등급은 추가 비용이 없습니다(분석 생성 시 사용료만 발생)</li>
            <li>• 등급 업그레이드는 언제든 가능합니다</li>
            <li>• 자세한 정책은 파트너 정책 페이지에서 확인하세요</li>
          </ul>
        </div>
      </div>
    </main>
  );
}