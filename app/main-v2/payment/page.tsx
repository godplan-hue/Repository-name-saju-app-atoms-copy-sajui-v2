"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isPartnerHost } from "@/lib/isPartnerHost";

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
  const highlightWealthLove = searchParams.get("highlight") === "wealthlove";

  const [isPartner, setIsPartner] = useState(false);
  const [brand, setBrand] = useState<{ businessName: string; logoUrl: string; customPriceBasic?: string; customPriceStandard?: string; customPricePremium?: string; customPriceVip?: string } | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    const partner = isPartnerHost(hostname);
    setIsPartner(partner);
    if (partner) {
      const slug = hostname.split(".")[0];
      fetch(`/api/partner/brand?subdomain=${encodeURIComponent(slug)}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setBrand(data); })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (highlightWealthLove || searchParams.get("scrollTo") === "packages") {
      const el = document.getElementById("packages-section");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [highlightWealthLove, searchParams]);

  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<PromoCode | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [awaitOther, setAwaitOther] = useState<{ id: string; label: string } | null>(null);
  const [otherInput, setOtherInput] = useState("");

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

  const PACKAGES = [
    { id: "basic",    emoji: "💎", name: "기본 분석",  sub: "재물운 + 연애운",          price: "₩9,900",  priceNum: 9900,  pages: 30,  count: 2, chars: "전문가급 심층 분석", features: ["wealthLuck", "loveLuck"] },
    { id: "standard", emoji: "☀️", name: "베이직",     sub: "올해+재물+연애+월별",      price: "₩19,900", priceNum: 19900, pages: 75,  count: 4, chars: "전문가급 심층 분석", features: ["yearlyLuck", "wealthLuck", "loveLuck", "monthlyLuck"] },
    { id: "premium",  emoji: "🌿", name: "프리미엄",   sub: "올해+재물+연애+월별+건강", price: "₩24,900", priceNum: 24900, pages: 100, count: 5, chars: "전문가급 심층 분석", features: ["yearlyLuck", "wealthLuck", "loveLuck", "monthlyLuck", "healthLuck"] },
    { id: "vip",      emoji: "👑", name: "VIP 커플팩", sub: "8개 전부 + 궁합",          price: "₩29,900", priceNum: 29900, pages: 150, count: 8, chars: "전문가급 심층 분석", features: ["name", "yearlyLuck", "wealthLuck", "loveLuck", "healthLuck", "couple", "monthlyLuck", "analysis"] },
  ];

  const [selectedPackage, setSelectedPackage] = useState("기본 분석");

  const currentPkg = PACKAGES.find(p => p.name === selectedPackage) ?? PACKAGES[0];

  const getDisplayPrice = (pkg: typeof PACKAGES[0]) => {
    const customPriceMap: Record<string, string | undefined> = {
      basic: brand?.customPriceBasic, standard: brand?.customPriceStandard,
      premium: brand?.customPricePremium, vip: brand?.customPriceVip,
    };
    return (isPartner && customPriceMap[pkg.id]) ? customPriceMap[pkg.id]! : pkg.price;
  };


  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #d97706 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1719399184315-5ffab4006e18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fCVFQyVCQiVBOCVFQyU4NSU4OSUyMCVFQyU5NSU4NCVFRCU4QSVCOHxlbnwwfHwwfHx8MA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>

      {/* 재회운/반려동물 궁합 이름 입력 오버레이 */}
      {awaitOther && (
        <>
          <div onClick={() => setAwaitOther(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 302 }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 303, background: "linear-gradient(180deg,#1a0f35,#0f0620)", borderRadius: "20px 20px 0 0", padding: "28px 20px 40px", maxWidth: 500, margin: "0 auto" }}>
            <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 16, marginBottom: 16, textAlign: "center" }}>
              {awaitOther.id === "pet_compat" ? "🐾 반려동물 이름을 입력해주세요" : "💔 상대방 이름을 입력해주세요"}
            </p>
            <input
              value={otherInput}
              onChange={e => setOtherInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && otherInput.trim()) {
                  const go = async () => {
                    sessionStorage.setItem("specialOtherName", otherInput.trim());
                    const paidPrice = await finalPrice(2900);
                    setAwaitOther(null);
                    router.push(`/payment-complete?special=${awaitOther!.id}&paid=${paidPrice}`);
                  };
                  go();
                }
              }}
              placeholder={awaitOther.id === "pet_compat" ? "예: 초코" : "예: 홍길동"}
              autoFocus
              style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid rgba(251,191,36,0.5)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, fontWeight: 700, outline: "none", boxSizing: "border-box", marginBottom: 14 }}
            />
            <button
              onClick={async () => {
                if (!otherInput.trim()) return;
                sessionStorage.setItem("specialOtherName", otherInput.trim());
                const paidPrice = await finalPrice(2900);
                setAwaitOther(null);
                router.push(`/payment-complete?special=${awaitOther!.id}&paid=${paidPrice}`);
              }}
              disabled={!otherInput.trim()}
              style={{ width: "100%", padding: "14px 0", background: otherInput.trim() ? "linear-gradient(135deg,#fbbf24,#ec4899,#8b5cf6)" : "rgba(255,255,255,0.1)", color: otherInput.trim() ? "#1a0f2e" : "rgba(255,255,255,0.4)", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: otherInput.trim() ? "pointer" : "not-allowed" }}
            >
              💳 결제하기 · ₩2,900
            </button>
          </div>
        </>
      )}

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(194, 65, 12, 0.2)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px" }}>

        <h2 style={{ textAlign: "center", color: "#fbbf24", marginBottom: 16, fontSize: "clamp(18px, 5vw, 26px)", fontWeight: 900 }}>💎 운세 구매</h2>

        {/* 신규 990원 */}
        <div style={{ maxWidth: 600, margin: "0 auto 20px" }}>
          <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 900, margin: "0 0 8px 2px" }}>⚡ 신규 990원</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { id: "sinyeon",         emoji: "🎍", label: "신년운세",     sub: "올해 사주 완벽분석" },
              { id: "love_detail",     emoji: "💝", label: "연애사주",     sub: "나의 연애 DNA" },
              { id: "findmatch",       emoji: "🔮", label: "내 사람 찾기", sub: "나에게 맞는 사람" },
              { id: "marriage_detail", emoji: "💍", label: "결혼사주",     sub: "결혼 타이밍" },
              { id: "divorce",         emoji: "🌱", label: "이혼운세",     sub: "관계의 끝·새 출발" },
            ].map(s => (
              <button key={s.id}
                onClick={async () => {
                  const paidPrice = await finalPrice(990);
                  router.push(`/payment-complete?special=${s.id}&paid=${paidPrice}`);
                }}
                style={{ padding: "12px 6px", background: "rgba(20,10,40,0.55)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(251,191,36,0.35)", borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white" }}
              >
                <p style={{ margin: "0 0 3px", fontSize: 22 }}>{s.emoji}</p>
                <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 900 }}>{s.label}</p>
                <p style={{ margin: "0 0 4px", fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{s.sub}</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: "#fbbf24" }}>₩990</p>
              </button>
            ))}
            <button
              onClick={async () => {
                const paidPrice = await finalPrice(4900);
                router.push(`/payment-complete?special=sinyeon_premium&paid=${paidPrice}`);
              }}
              style={{ gridColumn: "span 3", padding: "12px 16px", background: "rgba(20,10,40,0.55)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(251,191,36,0.35)", borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", color: "white" }}
            >
              <div style={{ textAlign: "left" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 900 }}>📅 신년+월별 12달</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>신년운세 + 12달 월별 상세 분석</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24", flexShrink: 0 }}>₩4,900</span>
            </button>
          </div>
        </div>

        {/* 특별 2900원 */}
        <div style={{ maxWidth: 600, margin: "0 auto 20px" }}>
          <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 900, margin: "0 0 8px 2px" }}>💫 특별 2,900원</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[
              { id: "daeun",      emoji: "🌌", label: "대운(大運)",   sub: "10년 단위 운명 흐름", daeun: true },
              { id: "reunion",    emoji: "💔", label: "재회운",        sub: "다시 만날 수 있을까" },
              { id: "taegil",     emoji: "📅", label: "택일(擇日)",   sub: "내 사주에 맞는 좋은 날" },
              { id: "pet_compat", emoji: "🐾", label: "반려동물 궁합", sub: "나와 우리 아이 궁합" },
            ].map(s => (
              <button key={s.id}
                onClick={async () => {
                  if ((s as any).daeun) { router.push(`/main-v2/daewoon/pay`); return; }
                  if (s.id === "reunion" || s.id === "pet_compat") {
                    setOtherInput("");
                    setAwaitOther({ id: s.id, label: s.label });
                    return;
                  }
                  const paidPrice = await finalPrice(2900);
                  router.push(`/payment-complete?special=${s.id}&paid=${paidPrice}`);
                }}
                style={{ padding: "10px 4px", background: "rgba(20,10,40,0.55)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white" }}
              >
                <p style={{ margin: "0 0 3px", fontSize: 20 }}>{s.emoji}</p>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 900, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.label}</p>
                <p style={{ margin: "0 0 4px", fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 600, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.sub}</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: "#c4b5fd" }}>₩2,900</p>
              </button>
            ))}
          </div>
        </div>

        {/* 심층 분석 3900원 */}
        {!isPartner && (
          <div style={{ maxWidth: 600, margin: "0 auto 20px" }}>
            <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 900, margin: "0 0 8px 2px" }}>✨ 심층 분석 3,900원</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {[
                { id: "재물운", emoji: "💰", label: "재물운", catKey: "💰 재물운" },
                { id: "연애운", emoji: "💕", label: "연애운", catKey: "💕 연애운" },
                { id: "건강운", emoji: "💪", label: "건강운", catKey: "💪 건강운" },
                { id: "성공운", emoji: "🎯", label: "성공운", catKey: "🎯 성공운" },
                { id: "총운",   emoji: "✨", label: "총운",   catKey: "✨ 총운"   },
              ].map(s => (
                <button key={s.id}
                  onClick={async () => {
                    const paidPrice = await finalPrice(3900);
                    sessionStorage.setItem("v2_paid_cats", JSON.stringify([s.catKey]));
                    router.push(`/payment-complete?package=${encodeURIComponent(s.label)}&pages=30&paid=${paidPrice}`);
                  }}
                  style={{ padding: "10px 4px", background: "rgba(20,10,40,0.55)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(251,191,36,0.35)", borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white" }}
                >
                  <p style={{ margin: "0 0 3px", fontSize: 20 }}>{s.emoji}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 900, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: "#fbbf24" }}>₩3,900</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 만세력 신뢰 문구 */}
        <div style={{ maxWidth: 600, margin: "0 auto 16px", background: "rgba(20,10,40,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 14, padding: "18px 20px", textAlign: "center" }}>
          <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, margin: "0 0 6px" }}>🔮 정확한 사주 원국 분석</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700, margin: "0 0 3px", lineHeight: 1.7 }}>만세력 기반 · 음양오행 · 천간지지 · 십성 완벽 분석</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700, margin: "0 0 3px", lineHeight: 1.7 }}>연주 · 월주 · 일주 · 시주 사주팔자 완전 해석</p>
          <p style={{ color: "#ff69b4", fontSize: 12, fontWeight: 900, margin: 0, lineHeight: 1.7 }}>올해 운세 · 재물운 · 연애운 · 건강운 · 궁합분석까지</p>
        </div>

        <h2 style={{ textAlign: "center", color: "#d4af37", marginBottom: 16, fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 900 }}>📦 패키지 (더 저렴해!)</h2>

        {/* 할인코드 */}
        <div style={{ maxWidth: 480, margin: "0 auto 20px" }}>
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

        {/* 패키지 카드 — 2×2 소형 그리드, 클릭하면 선택 */}
        <div id="packages-section" style={{ maxWidth: 600, margin: "0 auto 24px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {PACKAGES.map(pkg => {
            const isSelected = selectedPackage === pkg.name;
            const displayPrice = getDisplayPrice(pkg);
            const discountedPrice = appliedDiscount && !isPartner
              ? `₩${Math.round(pkg.priceNum * (1 - appliedDiscount.discountPercent / 100)).toLocaleString()}`
              : null;
            return (
              <button key={pkg.id}
                onClick={async () => {
                  setSelectedPackage(pkg.name);
                  if (isPartner) { alert(`${brand?.businessName || "담당자"}에게 직접 문의해주세요.`); return; }
                  setIsProcessing(true);
                  try {
                    sessionStorage.setItem("selectedPackage", pkg.name);
                    const paidPrice = await finalPrice(pkg.priceNum);
                    router.push(`/payment-complete?package=${encodeURIComponent(pkg.name)}&pages=${pkg.pages}&paid=${paidPrice}`);
                  } finally { setIsProcessing(false); }
                }}
                disabled={isProcessing}
                style={{ padding: "14px 8px", background: isSelected ? "linear-gradient(135deg, rgba(251,191,36,0.22), rgba(236,72,153,0.18))" : "rgba(20,10,40,0.55)", backdropFilter: "blur(10px)", border: isSelected ? "2px solid #fbbf24" : "1.5px solid rgba(196,181,253,0.5)", borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white", transition: "all 0.15s", boxShadow: isSelected ? "0 6px 22px rgba(251,191,36,0.2)" : "none" }}
              >
                <p style={{ margin: "0 0 4px", fontSize: 24 }}>{pkg.emoji}</p>
                <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 900, color: isSelected ? "#fbbf24" : "#ffffff" }}>{pkg.name}</p>
                <p style={{ margin: "0 0 6px", fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600, wordBreak: "keep-all", lineHeight: 1.4 }}>{pkg.sub}</p>
                {discountedPrice ? (
                  <>
                    <p style={{ margin: "0 0 1px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, textDecoration: "line-through" }}>{displayPrice}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#90EE90" }}>{discountedPrice}</p>
                  </>
                ) : (
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: isSelected ? "#fbbf24" : "#c4b5fd" }}>{displayPrice}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* 사주 완벽분석 가격 표시 */}
        <div style={{ maxWidth: 1000, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 4 }}>【사주 완벽분석】</p>
          <p style={{ color: "#ffffff", fontSize: 14, fontWeight: 900 }}>990원~29,900원</p>
        </div>

        {/* 선택된 패키지 정보 텍스트 */}
        <div style={{ maxWidth: 500, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ color: "#ffffff", fontSize: 14, fontWeight: 900, marginBottom: 10 }}>
            선택된 패키지: <span style={{ color: "#fbbf24", fontWeight: 900 }}>{currentPkg.name}</span>
          </p>
          <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900, marginBottom: 10 }}>
            🎯 {currentPkg.count}개 운세
          </p>
          <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 900, marginBottom: 20 }}>
            📄 {currentPkg.chars}
          </p>
          {isPartner && (
            <div style={{ background: "rgba(251,191,36,0.12)", border: "1.5px solid rgba(251,191,36,0.5)", borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, margin: "0 0 6px 0" }}>📞 {brand?.businessName || "담당자"}에게 직접 문의해주세요</p>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.6 }}>이 가격은 안내용이며, 결제·상담은 {brand?.businessName || "담당자"}에게 직접 문의해주세요.</p>
            </div>
          )}
          <a href="/main-v2" style={{ display: "inline-block", padding: 12, background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", textDecoration: "none" }}>
            ← 돌아가기
          </a>
        </div>

        {/* 사업자 고지 */}
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, padding: "0 16px 24px" }}>
          본 서비스는 기획의신(대표 장문정)<br/>사업자등록번호<br/>773-60-00359가 운영합니다.
        </p>
      </div>
    </main>
  );
}
