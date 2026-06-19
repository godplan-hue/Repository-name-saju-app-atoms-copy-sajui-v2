"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
interface PromoCode {
  code: string;
  discountPercent: number;
  note: string;
  active: boolean;
}

export default function Payment() {
  return (
    <Suspense fallback={null}>
      <PaymentInner />
    </Suspense>
  );
}

function PaymentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 재물운/연애운 배너로 들어온 경우 — "기본분석"(재물운/연애운 미포함)이 아니라
  // 그 둘이 실제로 들어있는 가장 싼 패키지(베이직)를 기본 선택값으로 보여줌
  const highlightWealthLove = searchParams.get("highlight") === "wealthlove";
  const [selectedPackage, setSelectedPackage] = useState(highlightWealthLove ? "베이직" : "기본 분석");
  const [selectedFeatures, setSelectedFeatures] = useState(highlightWealthLove ? ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck"] : ["yearlyLuck", "monthlyLuck"]);
  // 할인코드 — 관리자가 원하는 손님에게만 골라서 주는 프로모션 코드(파트너와는 무관)
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<PromoCode | null>(null);
  const [discountError, setDiscountError] = useState("");

  const applyDiscountCode = async () => {
    try {
      const res = await fetch(`/api/promo-codes?code=${encodeURIComponent(discountInput)}`);
      if (!res.ok) { setDiscountError("유효하지 않은 할인코드입니다."); setAppliedDiscount(null); return; }
      const data = await res.json();
      setAppliedDiscount(data.code);
      setDiscountError("");
    } catch {
      setDiscountError("할인코드 확인 중 오류가 발생했습니다.");
    }
  };

  // 결제 시점에 서버에서 코드 재검증 + 사용횟수 기록
  const finalPrice = async (originalPrice: number): Promise<number> => {
    if (!appliedDiscount) return originalPrice;
    try {
      const res = await fetch("/api/promo-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: appliedDiscount.code }),
      });
      const data = await res.json();
      if (!data.success) { alert(data.error || "할인코드 적용에 실패했습니다."); return originalPrice; }
      return Math.round(originalPrice * (1 - data.discountPercent / 100));
    } catch {
      alert("할인코드 처리 중 오류가 발생했습니다. 할인 없이 진행합니다.");
      return originalPrice;
    }
  };
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

  // "당신의 변화" 카드에서 들어온 경우 990원 선택 섹션으로 자동 스크롤
  // (페이지 전체 순서는 그대로 유지하고, 이 경로로 온 사람만 헤매지 않게 함)
  useEffect(() => {
    if (searchParams.get("scrollTo") === "select") {
      const el = document.getElementById("select-section");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [searchParams]);

  // 재물운/연애운 배너로 들어온 경우 — 소개문구 다 안 보고 바로 패키지 비교 카드부터 보이게 스크롤
  useEffect(() => {
    if (highlightWealthLove) {
      const el = document.getElementById("packages-section");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [highlightWealthLove]);

  const packages = [
    {
      id: "basic",
      name: "기본 분석",
      price: "₩9,900",
      pages: 30,
      features: ["yearlyLuck", "monthlyLuck"],
      count: 2,
      chars: "전문가급 심층 분석",
      desc: "올해 운세 + 월별 운세"
    },
    {
      id: "standard",
      name: "베이직",
      price: "₩19,900",
      pages: 75,
      features: ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck"],
      count: 4,
      chars: "전문가급 심층 분석",
      desc: "올해 운세 + 월별 운세 + 재물운 + 연애운"
    },
    {
      id: "premium",
      name: "프리미엄",
      price: "₩24,900",
      pages: 100,
      features: ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck", "healthLuck"],
      count: 5,
      chars: "전문가급 심층 분석",
      desc: "올해 운세 + 월별 운세 + 재물운 + 연애운 + 건강운"
    },
    {
      id: "vip",
      name: "VIP 커플팩",
      price: "₩29,900",
      pages: 150,
      features: ["name", "yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck", "healthLuck", "couple", "analysis"],
      count: 8,
      chars: "전문가급 심층 분석",
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
      const originalPrice = Number((currentPackage?.price ?? "0").replace(/[^0-9]/g, ""));
      const paidPrice = await finalPrice(originalPrice); // 할인 적용 + 정산 자동 계산/기록

      router.push(`/payment-complete?package=${encodeURIComponent(selectedPackage)}&pages=${pages}&paid=${paidPrice}`);
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

        {/* 할인코드(일반고객용 — 파트너 사용료와는 무관) */}
        <div style={{ maxWidth: 480, margin: "0 auto 30px" }}>
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
          {appliedDiscount && (
            <p style={{ color: "#90EE90", fontSize: 12, fontWeight: 800, marginTop: 8, marginBottom: 0 }}>✅ {appliedDiscount.discountPercent}% 할인 적용됨</p>
          )}
          {discountError && (
            <p style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, marginTop: 8, marginBottom: 0 }}>{discountError}</p>
          )}
        </div>

        <div id="packages-section" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {packages.map(pkg => {
            const wlBadge = !highlightWealthLove ? null
              : pkg.id === "standard" ? { prefix: "💰 재물운·연애운 포함 · ", highlight: "가장 저렴" }
              : pkg.id === "vip" ? { prefix: "👑 전부 다 포함 · ", highlight: "최고급" }
              : null;
            const cardBg = pkg.id === "vip" && wlBadge
              ? "linear-gradient(135deg, rgba(91,33,182,0.68), rgba(124,58,237,0.58))"
              : wlBadge
              ? "linear-gradient(135deg, rgba(139,92,246,0.55), rgba(168,85,247,0.42))"
              : selectedPackage === pkg.name
              ? "linear-gradient(135deg, rgba(251,191,36,0.22), rgba(236,72,153,0.18))"
              : "rgba(139,92,246,0.16)";
            return (
            <div key={pkg.id} onClick={() => handlePackageSelect(pkg)} style={{ background: cardBg, backdropFilter: "blur(10px)", border: selectedPackage === pkg.name ? "2px solid #fbbf24" : wlBadge ? "2px solid rgba(236,72,153,0.7)" : "1px solid rgba(196,181,253,0.45)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.3s", boxShadow: selectedPackage === pkg.name ? "0 6px 22px rgba(251,191,36,0.2)" : "0 4px 16px rgba(0,0,0,0.15)" }}>
              {wlBadge && (
                <p style={{ fontSize: 11, fontWeight: 900, margin: "0 0 6px 0", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  <span style={{ color: "#ff3b3b" }}>{wlBadge.prefix}</span>
                  <span style={{ color: "#ffffff" }}>{wlBadge.highlight}</span>
                </p>
              )}
              <h3 style={{ color: "#fbbf24", fontSize: 18, fontWeight: 900, margin: "0 0 2px 0" }}>{pkg.name}</h3>
              <p style={{ color: "#f5f5f5", fontSize: 11, fontWeight: 700, margin: "0 0 8px 0", opacity: 0.85 }}>【심층 상세 분석】</p>
              {appliedDiscount ? (
                <p style={{ margin: "0 0 10px 0" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 700, textDecoration: "line-through", marginRight: 8 }}>{pkg.price}</span>
                  <span style={{ color: "#90EE90", fontSize: 24, fontWeight: 900 }}>₩{Math.round(Number(pkg.price.replace(/[^0-9]/g, "")) * (1 - appliedDiscount.discountPercent / 100)).toLocaleString()}</span>
                </p>
              ) : (
                <p style={{ color: "#ffffff", fontSize: 24, fontWeight: 900, margin: "0 0 10px 0" }}>{pkg.price}</p>
              )}
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 10px 0", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />
              <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: "0 0 6px 0" }}>🎯 {pkg.count}개 운세</p>
              <p style={{ color: "#ffffff", fontSize: 11, fontWeight: 700, margin: 0 }}>📄 {(pkg as any).chars}</p>
            </div>
            );
          })}
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 4 }}>【사주 완벽분석】</p>
          <p style={{ color: "#ffffff", fontSize: 14, fontWeight: 900 }}>990~29,900원</p>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", marginBottom: 20, background: "rgba(20,10,40,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.35)", padding: 24, borderRadius: 18, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
          <h3 style={{ color: "#fbbf24", fontSize: 17, fontWeight: 900, marginBottom: 20, letterSpacing: "-0.3px" }}>✨ 포함된 운세</h3>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {fortuneItems.map(item => {
              const on = selectedFeatures.includes(item.id);
              return (
                <div key={item.id} style={{ background: on ? "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(139,92,246,0.25))" : "rgba(255,255,255,0.05)", border: on ? "1.5px solid #fbbf24" : "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 14, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", boxShadow: on ? "0 4px 14px rgba(251,191,36,0.18)" : "none", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                  <p style={{ color: on ? "#fbbf24" : "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 900, margin: 0, whiteSpace: "normal", wordBreak: "keep-all" }}>{item.name}</p>
                </div>
              );
            })}
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
            📄 {currentPackage?.chars ?? "전문가급 심층 분석"}
          </p>
          <button onClick={handlePayment} disabled={isProcessing} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: isProcessing ? "not-allowed" : "pointer", opacity: isProcessing ? 0.6 : 1, marginBottom: 12 }}>💳 {isProcessing ? "처리중..." : "결제하기"}</button>

          <a href="/main-v2" style={{ display: "inline-block", padding: 12, background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", textDecoration: "none" }}>
            ← 돌아가기
          </a>
        </div>

        {/* 운세 선택 섹션 */}
        <div id="select-section" style={{ maxWidth: 1000, margin: "0 auto 40px", background: "rgba(20,10,40,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.35)", padding: "24px 22px", borderRadius: 18, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
          <h2 style={{ color: "#fbbf24", fontSize: 17, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.3px" }}>✨ 어떤 운세를 확인할까요?</h2>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>1개 선택 · </span><span style={{ color: "#ff69b4", fontWeight: 900 }}>₩990</span>
          </p>

          <button
            onClick={() => setSelectedCats(selectedCats.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
            style={{ width: "100%", padding: "11px 16px", marginBottom: 10, background: selectedCats.length === SELECT_CATS.length ? "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(139,92,246,0.25))" : "rgba(255,255,255,0.06)", border: `1.5px solid ${selectedCats.length === SELECT_CATS.length ? "#fbbf24" : "rgba(255,255,255,0.18)"}`, borderRadius: 12, fontWeight: 800, fontSize: 13, color: selectedCats.length === SELECT_CATS.length ? "#fbbf24" : "rgba(255,255,255,0.8)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}
          >
            <span>✨ 전체 선택</span>
            <span style={{ width: 20, height: 20, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, background: selectedCats.length === SELECT_CATS.length ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "transparent", border: selectedCats.length === SELECT_CATS.length ? "none" : "1.5px solid rgba(255,255,255,0.3)", color: "#1a1a1a" }}>
              {selectedCats.length === SELECT_CATS.length ? "✓" : ""}
            </span>
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SELECT_CATS.map(c => {
              const on = selectedCats.includes(c.key);
              return (
                <button key={c.key}
                  onClick={() => setSelectedCats(on ? selectedCats.filter(k => k !== c.key) : [...selectedCats, c.key])}
                  style={{ padding: "13px 16px", border: `1.5px solid ${on ? "#fbbf24" : "rgba(255,255,255,0.15)"}`, borderRadius: 14, background: on ? "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(139,92,246,0.18))" : "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s", boxShadow: on ? "0 4px 14px rgba(251,191,36,0.15)" : "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: on ? "#fbbf24" : "rgba(255,255,255,0.85)" }}>{c.key.replace(/\S+\s/, "")}</span>
                    </div>
                  </div>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, background: on ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "transparent", border: on ? "none" : "1.5px solid rgba(255,255,255,0.3)", color: "#1a1a1a", flexShrink: 0 }}>
                    {on ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 운세 보기 버튼 */}
          <button
            onClick={async () => {
              if (selectedCats.length === 0) return;
              // 결제 후 결과 페이지가 "어떤 카테고리를 결제했는지" 알 수 있도록 반드시 저장해야 함
              // (이게 없으면 결과 페이지가 기본값으로 5개 전부를 보여주는 버그가 생김)
              sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
              const pkgName = selectedCats.map(c => c.replace(/\S+\s/, "")).join("+");
              const originalPrice = selectedCats.length * 990;
              const paidPrice = await finalPrice(originalPrice); // 할인 적용 + 정산 자동 계산/기록
              router.push(`/payment-complete?package=${encodeURIComponent(pkgName)}&pages=${selectedCats.length * 30}&paid=${paidPrice}`);
            }}
            disabled={selectedCats.length === 0}
            style={{ width: "100%", marginTop: 18, padding: "15px 0", background: selectedCats.length > 0 ? "linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6)" : "rgba(255,255,255,0.1)", color: selectedCats.length > 0 ? "#1a0f2e" : "rgba(255,255,255,0.4)", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: selectedCats.length > 0 ? "pointer" : "not-allowed", boxShadow: selectedCats.length > 0 ? "0 6px 22px rgba(251,191,36,0.35)" : "none", letterSpacing: "-0.2px" }}
          >
            {selectedCats.length > 0 ? `💎 ${selectedCats.length}개 결제하기 · ₩${(appliedDiscount ? Math.round(selectedCats.length * 990 * (1 - appliedDiscount.discountPercent / 100)) : selectedCats.length * 990).toLocaleString()}` : "운세를 선택하세요"}
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
              <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900 }}>3초 이내 완성</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
