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
  const preselectId = searchParams.get("preselect");
  const PRESELECT_INFO: Record<string, { name: string; features: string[] }> = {
    basic:    { name: "기본 분석", features: ["wealthLuck", "loveLuck"] },
    standard: { name: "베이직",   features: ["yearlyLuck", "wealthLuck", "loveLuck", "monthlyLuck"] },
    premium:  { name: "프리미엄", features: ["yearlyLuck", "wealthLuck", "loveLuck", "monthlyLuck", "healthLuck"] },
    vip:      { name: "VIP 커플팩", features: ["name", "yearlyLuck", "wealthLuck", "loveLuck", "healthLuck", "couple", "monthlyLuck", "analysis"] },
  };
  const preselectInfo = preselectId ? PRESELECT_INFO[preselectId] : undefined;
  const [selectedPackage, setSelectedPackage] = useState(
    highlightWealthLove ? "기본 분석" : preselectInfo ? preselectInfo.name : "기본 분석"
  );
  const [selectedFeatures, setSelectedFeatures] = useState(
    highlightWealthLove ? ["wealthLuck", "loveLuck"] : preselectInfo ? preselectInfo.features : ["wealthLuck", "loveLuck"]
  );
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
  const [isMobile, setIsMobile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisName, setAnalysisName] = useState("");
  const [awaitOther, setAwaitOther] = useState<{ id: string; label: string } | null>(null);
  const [otherInput, setOtherInput] = useState("");

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

  useEffect(() => {
    if (highlightWealthLove || searchParams.get("scrollTo") === "packages") {
      const el = document.getElementById("packages-section");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [highlightWealthLove, searchParams]);

  const packages = [
    {
      id: "basic",
      name: "기본 분석",
      price: "₩9,900",
      pages: 30,
      features: ["wealthLuck", "loveLuck"],
      count: 2,
      chars: "전문가급 심층 분석",
      desc: "재물운 + 연애운"
    },
    {
      id: "standard",
      name: "베이직",
      price: "₩19,900",
      pages: 75,
      features: ["yearlyLuck", "wealthLuck", "loveLuck", "monthlyLuck"],
      count: 4,
      chars: "전문가급 심층 분석",
      desc: "올해 운세 + 재물운 + 연애운 + 월별 운세"
    },
    {
      id: "premium",
      name: "프리미엄",
      price: "₩24,900",
      pages: 100,
      features: ["yearlyLuck", "wealthLuck", "loveLuck", "monthlyLuck", "healthLuck"],
      count: 5,
      chars: "전문가급 심층 분석",
      desc: "올해 운세 + 재물운 + 연애운 + 월별 운세 + 건강운"
    },
    {
      id: "vip",
      name: "VIP 커플팩",
      price: "₩29,900",
      pages: 150,
      features: ["name", "yearlyLuck", "wealthLuck", "loveLuck", "healthLuck", "couple", "monthlyLuck", "analysis"],
      count: 8,
      chars: "전문가급 심층 분석",
      desc: "본인 分析(8개) + 상대방 정보 입력<br/>궁합分析 포함"
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
      const paidPrice = await finalPrice(originalPrice);

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
              onKeyDown={e => { if (e.key === "Enter" && otherInput.trim()) { const go = async () => { sessionStorage.setItem("specialOtherName", otherInput.trim()); const paidPrice = await finalPrice(2900); setAwaitOther(null); router.push(`/payment-complete?special=${awaitOther.id}&paid=${paidPrice}`); }; go(); } }}
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
                router.push(`/payment-complete?special=${awaitOther.id}&paid=${paidPrice}`);
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
              { id: "sinyeon",         emoji: "🎍", label: "신년운세",       sub: "올해 사주 완벽분석",  price: 990,  accent: "#fbbf24", bdColor: "rgba(251,191,36,0.35)", bg: "rgba(20,10,40,0.55)" },
              { id: "love_detail",     emoji: "💝", label: "연애사주",       sub: "나의 연애 DNA",       price: 990,  accent: "#fbbf24", bdColor: "rgba(251,191,36,0.35)", bg: "rgba(20,10,40,0.55)" },
              { id: "findmatch",       emoji: "🔮", label: "내 사람 찾기",   sub: "나에게 맞는 사람",    price: 990,  accent: "#fbbf24", bdColor: "rgba(251,191,36,0.35)", bg: "rgba(20,10,40,0.55)" },
              { id: "marriage_detail", emoji: "💍", label: "결혼사주",       sub: "결혼 타이밍",         price: 990,  accent: "#fbbf24", bdColor: "rgba(251,191,36,0.35)", bg: "rgba(20,10,40,0.55)" },
              { id: "divorce",         emoji: "🌱", label: "이혼운세",       sub: "관계의 끝·새 출발",   price: 990,  accent: "#fbbf24", bdColor: "rgba(251,191,36,0.35)", bg: "rgba(20,10,40,0.55)" },
              { id: "sinyeon_premium", emoji: "📅", label: "신년+월별 12달", sub: "신년+12달 월별 상세",  price: 4900, accent: "#ef4444", bdColor: "rgba(239,68,68,0.8)",   bg: "rgba(40,5,5,0.75)"   },
            ].map(s => (
              <button key={s.id}
                onClick={async () => {
                  const paidPrice = await finalPrice(s.price);
                  router.push(`/payment-complete?special=${s.id}&paid=${paidPrice}`);
                }}
                style={{ padding: "10px 4px", background: s.bg, backdropFilter: "blur(10px)", border: `1.5px solid ${s.bdColor}`, borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white" }}
              >
                <p style={{ margin: "0 0 3px", fontSize: 20 }}>{s.emoji}</p>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 900, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.label}</p>
                <p style={{ margin: "0 0 4px", fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 600, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.sub}</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: s.accent }}>₩{s.price.toLocaleString()}</p>
              </button>
            ))}
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

        {/* 패키지 빠른 선택 (9900원~) */}
        {!isPartner && (
          <div style={{ maxWidth: 600, margin: "0 auto 20px" }}>
            <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 900, margin: "0 0 8px 2px" }}>📦 패키지 (더 저렴해!)</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { id: "basic",    emoji: "🐱", label: "기본 분석",  sub: "재물운 + 연애운",        pages: 30,  price: 9900  },
                { id: "standard", emoji: "🌟", label: "베이직",     sub: "올해+재물+연애+월별",     pages: 75,  price: 19900 },
                { id: "premium",  emoji: "💎", label: "프리미엄",   sub: "올해+재물+연애+월별+건강", pages: 100, price: 24900 },
                { id: "vip",      emoji: "👑", label: "VIP 커플팩", sub: "이름+전체사주+궁합포함",   pages: 150, price: 29900 },
              ].map(s => (
                <button key={s.id}
                  onClick={async () => {
                    const paidPrice = await finalPrice(s.price);
                    router.push(`/payment-complete?package=${encodeURIComponent(s.label)}&pages=${s.pages}&paid=${paidPrice}`);
                  }}
                  style={{ padding: "10px 4px", background: "rgba(20,10,40,0.55)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white" }}
                >
                  <p style={{ margin: "0 0 3px", fontSize: 20 }}>{s.emoji}</p>
                  <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 900, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.label}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 600, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.sub}</p>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: "#c4b5fd" }}>₩{s.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 할인코드(일반고객용 — 파트너 사용료와는 무관) */}
        <div style={{ maxWidth: 480, margin: "0 auto 16px" }}>
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

        {/* 만세력 신뢰 문구 — 패키지 구매 직전 신뢰 형성용 */}
        <div style={{ maxWidth: 600, margin: "0 auto 16px", background: "rgba(20,10,40,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 14, padding: "18px 20px", textAlign: "center" }}>
          <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, margin: "0 0 6px" }}>🔮 정확한 사주 원국 분석</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700, margin: "0 0 3px", lineHeight: 1.7 }}>만세력 기반 · 음양오행 · 천간지지 · 십성 완벽 분析</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 700, margin: "0 0 3px", lineHeight: 1.7 }}>연주 · 월주 · 일주 · 시주 사주팔자 완전 해석</p>
          <p style={{ color: "#ff69b4", fontSize: 12, fontWeight: 900, margin: 0, lineHeight: 1.7 }}>올해 운세 · 재물운 · 연애운 · 건강운 · 궁합분析까지</p>
        </div>

        <h2 style={{ textAlign: "center", color: "#d4af37", marginBottom: 16, fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 900 }}>📦 패키지 (더 저렴해!)</h2>

        {/* 헤더 배너 */}
        <div style={{ maxWidth: 600, margin: "0 auto 16px", background: "linear-gradient(135deg, rgba(20,10,40,0.6), rgba(74,26,84,0.45))", backdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.35)", borderRadius: 14, padding: "12px 20px", textAlign: "center" }}>
          <p style={{ color: "#fbbf24", fontSize: 15, fontWeight: 900, margin: "0 0 3px" }}>🔓 전체 AI 심층 분析</p>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, margin: "0 0 3px" }}>운세를 완전히 해석해드립니다</p>
          <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, margin: 0 }}>₩990부터 시작 · 이미지 저장&amp;보관함 포함</p>
        </div>


        <div id="packages-section" style={{ maxWidth: 600, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 30 }}>
          {packages.map(pkg => {
            const wlBadge = pkg.id === "basic" ? { prefix: "💰 재물운·연애운 포함 · ", highlight: "가장 저렴" }
              : pkg.id === "vip" ? { prefix: "이름+전체사주+궁합포함 · ", highlight: "최고급" }
              : null;
            const isSelected2 = selectedPackage === pkg.name;
            const cardBg2 = isSelected2
              ? "linear-gradient(135deg, rgba(251,191,36,0.22), rgba(236,72,153,0.18))"
              : pkg.id === "vip" && wlBadge
              ? "linear-gradient(135deg, rgba(84,20,105,0.55), rgba(122,38,145,0.45))"
              : wlBadge
              ? "linear-gradient(135deg, rgba(139,92,246,0.55), rgba(168,85,247,0.42))"
              : "rgba(139,92,246,0.16)";
            const customPriceMap2: Record<string, string | undefined> = {
              basic: brand?.customPriceBasic, standard: brand?.customPriceStandard,
              premium: brand?.customPricePremium, vip: brand?.customPriceVip,
            };
            const displayPrice2 = (isPartner && customPriceMap2[pkg.id]) ? customPriceMap2[pkg.id]! : pkg.price;
            return (
              <div key={pkg.id + "_large"} onClick={() => handlePackageSelect(pkg)} style={{ background: cardBg2, backdropFilter: "blur(10px)", border: isSelected2 ? "2px solid #fbbf24" : wlBadge ? "2px solid rgba(236,72,153,0.7)" : "1px solid rgba(196,181,253,0.45)", borderRadius: 12, padding: 12, cursor: "pointer", transition: "all 0.3s", boxShadow: isSelected2 ? "0 6px 22px rgba(251,191,36,0.2)" : "0 4px 16px rgba(0,0,0,0.15)" }}>
                {wlBadge && (
                  <p style={{ fontSize: 9, fontWeight: 900, margin: "0 0 4px 0", textShadow: "0 1px 3px rgba(0,0,0,0.5)", wordBreak: "keep-all", lineHeight: 1.4 }}>
                    <span style={{ color: "#ff3b3b" }}>{wlBadge.prefix}</span>
                    <span style={{ color: "#ffffff" }}>{wlBadge.highlight}</span>
                  </p>
                )}
                <h3 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, margin: "0 0 2px 0" }}>{pkg.name}</h3>
                <p style={{ color: "#f5f5f5", fontSize: 9, fontWeight: 700, margin: "0 0 6px 0", opacity: 0.85 }}>【심층 상세 분析】</p>
                {appliedDiscount && !isPartner ? (
                  <p style={{ margin: "0 0 6px 0" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, textDecoration: "line-through", marginRight: 4 }}>{pkg.price}</span>
                    <span style={{ color: "#90EE90", fontSize: 16, fontWeight: 900 }}>₩{Math.round(Number(pkg.price.replace(/[^0-9]/g, "")) * (1 - appliedDiscount.discountPercent / 100)).toLocaleString()}</span>
                  </p>
                ) : (
                  <p style={{ color: "#ffffff", fontSize: 16, fontWeight: 900, margin: "0 0 6px 0" }}>{displayPrice2}</p>
                )}
                <p style={{ color: "#f5f5f5", fontSize: 10, fontWeight: 700, margin: "0 0 6px 0", lineHeight: 1.5, wordBreak: "keep-all" }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />
                <p style={{ color: "#fbbf24", fontSize: 9, fontWeight: 700, margin: "0 0 3px 0" }}>🎯 {pkg.count}개 운세</p>
                <p style={{ color: "#ffffff", fontSize: 9, fontWeight: 700, margin: 0 }}>📄 {pkg.chars}</p>
              </div>
            );
          })}
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 4 }}>【사주 완벽분析】</p>
          <p style={{ color: "#ffffff", fontSize: 14, fontWeight: 900 }}>990원~29,900원</p>
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
          {isPartner ? (
            <div style={{ background: "rgba(251,191,36,0.12)", border: "1.5px solid rgba(251,191,36,0.5)", borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, margin: "0 0 6px 0" }}>📞 {brand?.businessName || "담당자"}에게 직접 문의해주세요</p>
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.6 }}>이 가격은 안내용이며, 결제·상담은 {brand?.businessName || "담당자"}에게 직접 문의해주세요.</p>
            </div>
          ) : (
            <button onClick={handlePayment} disabled={isProcessing} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, rgba(251,191,36,0.85), rgba(124,58,237,0.8))", backdropFilter: "blur(8px)", color: "white", border: "1px solid rgba(251,191,36,0.5)", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: isProcessing ? "not-allowed" : "pointer", opacity: isProcessing ? 0.6 : 1, marginBottom: 12, boxShadow: "0 8px 24px rgba(251,191,36,0.25)" }}>💳 {isProcessing ? "처리중..." : "결제하기"}</button>
          )}

          <a href="/main-v2" style={{ display: "inline-block", padding: 12, background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", textDecoration: "none" }}>
            ← 돌아가기
          </a>
        </div>

        <section style={{ maxWidth: 900, margin: "0 auto 60px", background: "rgba(139,92,246,0.2)", padding: 40, borderRadius: 12 }}>
          <h2 style={{ textAlign: "center", color: "#fbbf24", fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 900, marginBottom: 40 }}>【왜 {brand?.businessName || "점운"}인가?】</h2>
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

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 600, padding: "0 16px 24px" }}>
          본 서비스는 기획의신(대표 장문정)<br/>사업자등록번호<br/>773-60-00359가 운영합니다.
        </p>
      </div>
    </main>
  );
}
