"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

export default function PaymentPartner() {
  return (
    <Suspense fallback={null}>
      <PaymentPartnerInner />
    </Suspense>
  );
}

function PaymentPartnerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "silver";
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const tierInfo: { [key: string]: { name: string; fee: number; month: string; revenue: string } } = {
    silver: { name: "실버", fee: 150000, month: "월 150건(연 최대 1,800건)", revenue: "45%" },
    gold: { name: "골드", fee: 350000, month: "월 300건(연 최대 3,600건)", revenue: "55%" },
    diamond: { name: "다이아", fee: 1000000, month: "무제한", revenue: "70%" }
  };

  const info = tierInfo[tier] || tierInfo.silver;

  const [discountInput, setDiscountInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const finalFee = Math.round(info.fee * (1 - discountPercent / 100));

  const applyDiscountCode = async () => {
    try {
      const res = await fetch(`/api/promo-codes?code=${encodeURIComponent(discountInput)}`);
      if (!res.ok) { setDiscountError("유효하지 않은 할인코드입니다."); setDiscountPercent(0); return; }
      const data = await res.json();
      setDiscountPercent(data.code.discountPercent);
      setDiscountError("");
    } catch {
      setDiscountError("할인코드 확인 중 오류가 발생했습니다.");
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const raw = sessionStorage.getItem("partnerSignupData");
      if (!raw) {
        alert("가입 정보를 찾을 수 없습니다. 다시 신청해주세요.");
        router.push("/partner/apply");
        return;
      }
      const formData = JSON.parse(raw);
      try {
        if (discountPercent > 0) {
          await fetch("/api/promo-codes", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: discountInput }),
          });
        }
        const res = await fetch("/api/partner/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, tier }),
        });
        const data = await res.json();
        if (!res.ok) { alert(data.error || "가입에 실패했습니다."); setIsProcessing(false); return; }
        sessionStorage.removeItem("partnerSignupData");
        alert(`${info.name} 파트너 가입이 완료되었습니다!\n결제 금액: ₩${finalFee.toLocaleString()}\n로그인 후 분석 생성 도구를 바로 이용하실 수 있습니다.`);
        router.push("/partner/login");
      } catch {
        alert("가입 처리 중 오류가 발생했습니다.");
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", maxWidth: 600, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        
        <div style={{ background: "rgba(108,64,200,0.15)", padding: 40, borderRadius: 16, border: "1px solid rgba(139,92,246,0.3)", width: "100%" }}>
          
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 900, marginBottom: 24, marginTop: 0, textAlign: "center" }}>파트너 가입</h1>

          {/* 등급 정보 */}
          <div style={{ background: "rgba(139,92,246,0.65)", padding: 20, borderRadius: 12, marginBottom: 24 }}>
            <h2 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 16px 0" }}>{info.name} 등급</h2>
            <div style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8 }}>
              {discountPercent > 0 ? (
                <p style={{ margin: "0 0 8px 0" }}>
                  💰 연회비: <span style={{ textDecoration: "line-through", opacity: 0.6 }}>₩{info.fee.toLocaleString()}</span>{" "}
                  <span style={{ color: "#90EE90" }}>₩{finalFee.toLocaleString()}</span>
                </p>
              ) : (
                <p style={{ margin: "0 0 8px 0" }}>💰 연회비: ₩{info.fee.toLocaleString()}</p>
              )}
              <p style={{ margin: "0 0 8px 0" }}>📊 월 한도: {info.month}</p>
              <p style={{ margin: "0" }}>💵 사용료 할인: {info.revenue}</p>
            </div>
          </div>

          {/* 할인코드 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={discountInput}
                onChange={e => setDiscountInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && applyDiscountCode()}
                placeholder="🎟️ 할인코드 입력(선택)"
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(251,191,36,0.4)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 13, fontWeight: 700, outline: "none" }}
              />
              <button onClick={applyDiscountCode} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a0f2e", fontWeight: 900, fontSize: 13, cursor: "pointer" }}>적용</button>
            </div>
            {discountPercent > 0 && (
              <p style={{ color: "#90EE90", fontSize: 12, fontWeight: 800, marginTop: 8, marginBottom: 0 }}>✅ {discountPercent}% 할인 적용됨{discountPercent >= 100 ? " (무료)" : ""}</p>
            )}
            {discountError && (
              <p style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, marginTop: 8, marginBottom: 0 }}>{discountError}</p>
            )}
          </div>

          {/* 환불정책 (접기/펼치기) */}
          <div style={{ background: "rgba(255,20,147,0.08)", padding: 12, borderRadius: 8, marginBottom: 24, border: "1px solid rgba(255,20,147,0.2)" }}>
            <button onClick={() => setShowRefund(!showRefund)} style={{ width: "100%", background: "transparent", border: "none", color: "#ff9500", fontSize: 11, fontWeight: 700, padding: "8px 0", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>{showRefund ? "▼" : "▶"}</span>
              ⚠️ 환불정책 확인
            </button>
            
            {showRefund && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,20,147,0.3)" }}>
                <p style={{ color: "#f5f5f5", fontSize: 10, fontWeight: 600, lineHeight: 1.6, margin: "0 0 6px 0" }}>아래 항목 중 하나라도 하면 환불 불가능:</p>
                <ul style={{ color: "#f5f5f5", fontSize: 10, fontWeight: 600, lineHeight: 1.5, margin: "0 0 6px 0", paddingLeft: 16 }}>
                  <li>파트너 자료 다운로드</li>
                  <li>온라인 미팅 참석</li>
                  <li>고객분석 1건 이상 생성</li>
                  <li>파트너 카톡방 입장</li>
                </ul>
                <p style={{ color: "#ff6b6b", fontSize: 10, fontWeight: 700, margin: "0" }}>7일 초과 → 무조건 환불불가</p>
              </div>
            )}
          </div>

          {/* 결제 버튼 */}
          <button onClick={handlePayment} disabled={isProcessing} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: isProcessing ? "not-allowed" : "pointer", marginBottom: 12, opacity: isProcessing ? 0.6 : 1 }}>
            {isProcessing ? "결제 처리 중..." : "💳 결제하기"}
          </button>

          <a href={`/partner/apply-form?tier=${tier}`} style={{ display: "block", width: "100%", padding: 14, background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>
            ← 돌아가기
          </a>
        </div>
      </div>
    </main>
  );
}