"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const PLANS = [
  {
    id: "lite",
    name: "라이트",
    price: 990,
    priceStr: "₩990",
    badge: null,
    desc: "1개 심층 분석",
    features: ["AI 심층 분석 1회", "상세 운세 텍스트", "럭키 아이템 분석"],
    highlight: false,
    packageName: "기본 분석",
    pages: 30,
  },
  {
    id: "popular",
    name: "인기",
    price: 4990,
    priceStr: "₩4,990",
    badge: "🔥 인기",
    desc: "3개 심층 분석",
    features: ["AI 심층 분석 3회", "재물·연애·건강 분석", "PDF 저장", "분석 공유 기능"],
    highlight: true,
    packageName: "베이직",
    pages: 75,
  },
  {
    id: "unlimited",
    name: "프리미엄",
    price: 9990,
    priceStr: "₩9,990",
    badge: "👑 최고",
    desc: "무제한 심층 분석",
    features: ["AI 심층 분석 무제한", "전 카테고리 분석", "궁합 분석 포함", "PDF 저장", "월별 운세 상세"],
    highlight: false,
    packageName: "프리미엄",
    pages: 100,
  },
];

export default function V2Payment() {
  const router = useRouter();
  const [selected, setSelected] = useState("popular");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    const plan = PLANS.find(p => p.id === selected);
    if (!plan) return;
    setIsProcessing(true);
    sessionStorage.setItem("selectedPackage", plan.packageName);
    // 실제 토스 결제 연동 시 여기서 토스 SDK 호출
    // 현재는 payment-complete로 직접 이동
    setTimeout(() => {
      router.push(`/payment-complete?package=${encodeURIComponent(plan.packageName)}&pages=${plan.pages}`);
    }, 800);
  };

  const selectedPlan = PLANS.find(p => p.id === selected);

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 56, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 600 }}>뒤로</span>
        </button>
        <span style={{ fontWeight: 900, fontSize: 15, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>포인트 충전</span>
        <div style={{ width: 48 }} />
      </header>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* 상단 배너 */}
        <div style={{ background: G, borderRadius: 20, padding: "24px 20px", textAlign: "center", marginBottom: 28, color: "white" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💎</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 8px" }}>AI 심층 분석 포인트</h1>
          <p style={{ fontSize: 13, opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            무료 분석의 미리보기에서 보셨나요?<br />
            포인트 충전으로 전체 분석을 확인하세요
          </p>
        </div>

        {/* 플랜 선택 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                background: "white",
                borderRadius: 20,
                padding: "20px",
                border: selected === plan.id
                  ? "2px solid #ec4899"
                  : "1.5px solid rgba(236,72,153,0.15)",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s",
                boxShadow: selected === plan.id ? "0 8px 24px rgba(236,72,153,0.15)" : "0 2px 12px rgba(139,92,246,0.05)",
              }}
            >
              {plan.badge && (
                <div style={{ position: "absolute", top: -10, right: 16, background: G, color: "white", fontSize: 12, fontWeight: 900, padding: "4px 12px", borderRadius: 20, boxShadow: "0 4px 12px rgba(236,72,153,0.3)" }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px" }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontWeight: 600 }}>{plan.desc}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: selected === plan.id ? "#ec4899" : "#1a1a2e" }}>{plan.priceStr}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {plan.features.map(f => (
                  <span key={f} style={{ fontSize: 12, color: selected === plan.id ? "#8b5cf6" : "#6b7280", background: selected === plan.id ? "#ede9fe" : "#f9fafb", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 결제 버튼 */}
        <div style={{ background: "white", borderRadius: 20, padding: "20px", marginBottom: 16, border: "1.5px solid rgba(236,72,153,0.12)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>선택한 플랜</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#1a1a2e" }}>{selectedPlan?.name} {selectedPlan?.priceStr}</span>
          </div>
          <button
            onClick={handlePay}
            disabled={isProcessing}
            style={{ width: "100%", padding: "16px 0", background: isProcessing ? "#e5e7eb" : G, color: isProcessing ? "#9ca3af" : "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: isProcessing ? "not-allowed" : "pointer", boxShadow: isProcessing ? "none" : "0 8px 24px rgba(236,72,153,0.3)" }}
          >
            {isProcessing ? "결제 처리 중..." : `💳 ${selectedPlan?.priceStr} 결제하기`}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", lineHeight: 1.7, fontWeight: 500 }}>
          🔒 결제는 토스페이먼츠를 통해 안전하게 처리됩니다<br />
          결제 완료 후 즉시 이용 가능합니다
        </p>
      </div>
    </main>
  );
}
