"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { isPartnerHost } from "@/lib/isPartnerHost";
interface PromoCode {
  code: string;
  discountPercent: number;
  note: string;
  active: boolean;
  maxAmount?: number;
}

const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

export default function Payment() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: BG }} />}>
      <PaymentInner />
    </Suspense>
  );
}

function PaymentInner() {
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
  const selectedPackage = highlightWealthLove ? "기본 분석" : preselectInfo ? preselectInfo.name : "기본 분석";
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
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.phone) setModalMobile(p.phone.replace(/\D/g,"").slice(0,11));
    } catch {}
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) { audio.pause(); setMusicOn(false); }
    else { audio.volume = 0.35; audio.play().then(() => setMusicOn(true)).catch(() => {}); }
  };

  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<PromoCode | null>(null);
  const [discountError, setDiscountError] = useState("");

  const applyDiscountCode = async () => {
    const code = discountInput.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetch(`/api/promo-codes?code=${encodeURIComponent(code)}`);
      if (!res.ok) { setDiscountError("유효하지 않은 할인코드입니다."); setAppliedDiscount(null); return; }
      const data = await res.json();
      setAppliedDiscount({ code: data.code, discountPercent: data.discountPercent, note: data.note || "", active: data.active, maxAmount: data.maxAmount });
      setDiscountError("");
    } catch {
      setDiscountError("할인코드 확인 중 오류가 발생했습니다.");
    }
  };

  const finalPrice = (originalPrice: number): number => {
    if (!appliedDiscount) return originalPrice;
    if (appliedDiscount.maxAmount && originalPrice > appliedDiscount.maxAmount) return originalPrice;
    return Math.round(originalPrice * (1 - appliedDiscount.discountPercent / 100));
  };

  const consumeCoupon = async () => {
    if (!appliedDiscount) return;
    try {
      await fetch("/api/promo-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: appliedDiscount.code }),
      });
    } catch {}
  };

  const [_analysisName, setAnalysisName] = useState("");
  const [awaitOther, setAwaitOther] = useState<{ id: string; label: string } | null>(null);
  const [otherInput, setOtherInput] = useState("");

  // PortOne 결제 모달 상태
  const [showPayModal, setShowPayModal] = useState(false);
  const [modalPrice, setModalPrice] = useState(0);
  const [modalNextUrl, setModalNextUrl] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalMobile, setModalMobile] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [refundAgreed, setRefundAgreed] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const closePayModal = () => {
    setShowPayModal(false);
    setModalError(""); setModalLoading(false);
  };

  const openPortoneModal = async (price: number, nextUrl: string) => {
    if (price === 0) {
      await consumeCoupon();
      window.location.href = nextUrl;
      return;
    }
    setModalPrice(price);
    setModalNextUrl(nextUrl);
    setModalError("");
    setShowPayModal(true);
  };

  // 모바일 결제(카카오페이/카드)는 PG사 인증 후 이 페이지로 "새로 돌아오는" 방식이라
  // requestPayment()가 프로미스로 끝나지 않는 경우가 많음 — 결제 시작 전에 정보를
  // sessionStorage에 저장해두고, 돌아왔을 때 그 정보로 완료 처리를 이어감
  const finalizeModalPaymentSuccess = (info: {
    modalPrice: number; modalNextUrl: string; modalName: string; modalMobile: string;
    orderName: string; couponCode: string;
  }) => {
    const cleanMobile = info.modalMobile.replace(/\D/g, "");
    if (info.couponCode) {
      fetch("/api/promo-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: info.couponCode }),
      }).catch(() => {});
    }
    fetch("/api/v2/save-payment", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: `pay_${Date.now()}`,
        phone: cleanMobile || "",
        name: info.modalName.trim() || "",
        amount: info.modalPrice,
        category: info.orderName,
        source: "payment",
      }),
    }).catch(() => {});
    if (cleanMobile) {
      try { localStorage.setItem("v2_saved_phone", cleanMobile); } catch {}
    }
    window.location.href = info.modalNextUrl;
  };

  // 모바일에서 카카오페이/카드 인증 후 redirectUrl로 되돌아온 경우 감지 → 결제완료 처리 이어서 진행
  useEffect(() => {
    const pgPaymentId = searchParams.get("paymentId");
    if (!pgPaymentId) return;
    const pendingRaw = sessionStorage.getItem("pay_pending") || localStorage.getItem("pay_pending");
    if (!pendingRaw) return;
    sessionStorage.removeItem("pay_pending");
    try { localStorage.removeItem("pay_pending"); } catch {}
    const pgCode = searchParams.get("code");
    if (pgCode) {
      try {
        const info = JSON.parse(pendingRaw);
        setModalPrice(info.modalPrice);
        setModalNextUrl(info.modalNextUrl);
        setModalName(info.modalName);
        setModalMobile(info.modalMobile);
        setShowPayModal(true);
        setModalError(searchParams.get("message") || "결제에 실패했습니다. 다시 시도해주세요.");
      } catch {}
      return;
    }
    try {
      const info = JSON.parse(pendingRaw);
      finalizeModalPaymentSuccess(info);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const portoneModalPay = async (method: "CARD" | "KAKAOPAY") => {
    // 카카오톡 인앱 브라우저 안에서는 결제 인증 후 우리 사이트로 돌아오지 못하고
    // 카카오 화면에 갇히는 문제가 있어서, 결제 전에 외부 브라우저로 나가도록 안내함
    if (/KAKAOTALK|kakaoBrowser|KAKAO/i.test(navigator.userAgent)) {
      alert("카카오톡 안에서는 결제가 끝까지 진행되지 않을 수 있어요.\n\n화면 오른쪽 위 점 세 개(⋮) 버튼을 누르고\n[다른 브라우저로 열기]를 선택한 다음\n다시 결제해주세요.");
      return;
    }
    if (!refundAgreed) { setShowRefund(true); setModalError("결제 전 확인사항을 먼저 확인해주세요."); return; }
    setModalLoading(true); setModalError("");
    try {
      const cleanMobile = modalMobile.replace(/\D/g, "");
      const channelKey = method === "KAKAOPAY"
        ? "channel-key-b474ece1-40a8-4a8a-bc24-469e6dbf0948"
        : "channel-key-e3b35730-62df-4314-a2c9-afd813698cd7";
      const portone = await import("@portone/browser-sdk/v2");
      const _params = new URLSearchParams(modalNextUrl.split("?")[1] || "");
      const _orderName = _params.get("package") || _params.get("special") || "점운 운세";

      const pendingInfo = {
        modalPrice, modalNextUrl, modalName, modalMobile,
        orderName: _orderName, couponCode: appliedDiscount?.code || "",
      };
      // 모바일 리디렉션 방식은 이 페이지가 새로 로드되며 돌아오므로, 완료 처리에
      // 필요한 정보를 미리 저장해둠 (redirectUrl로 돌아왔을 때 위 useEffect가 사용)
      try { sessionStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); localStorage.setItem("pay_pending", JSON.stringify(pendingInfo)); } catch {}

      const res = await portone.requestPayment({
        storeId: "store-446686e2-22bd-4941-ae2a-83e7f3a15d87",
        channelKey,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        orderName: `점운 ${_orderName}`,
        totalAmount: modalPrice,
        currency: "KRW",
        payMethod: method === "KAKAOPAY" ? "EASY_PAY" : "CARD",
        ...(method === "KAKAOPAY" ? { easyPay: { easyPayProvider: "KAKAOPAY" } } : {}),
        customer: { fullName: modalName.trim() || "고객", phoneNumber: cleanMobile || "01000000000" },
        redirectUrl: `${window.location.origin}${window.location.pathname}${window.location.search}`,
      });
      // 리디렉션 방식이면 여기 도달하지 않고 페이지가 이동함 — 아래는 PC 팝업 등
      // 리디렉션 없이 바로 결과를 돌려받는 경우에만 실행됨
      if (res && "code" in res) {
        setModalError(res.message || "결제에 실패했습니다.");
        try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
        return;
      }
      try { sessionStorage.removeItem("pay_pending"); localStorage.removeItem("pay_pending"); } catch {}
      closePayModal();
      finalizeModalPaymentSuccess(pendingInfo);
    } catch { setModalError("결제 처리 중 오류가 발생했습니다."); }
    finally { setModalLoading(false); }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = sessionStorage.getItem("analysisName") || "분석 완료";
      setAnalysisName(name);
    }
  }, []);

  useEffect(() => {
    if (highlightWealthLove || searchParams.get("scrollTo") === "packages") {
      const el = document.getElementById("packages-section");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [highlightWealthLove, searchParams]);

  const packages = [
    { id: "basic",    name: "기본 분석",  price: "₩9,900",  pages: 30,  features: ["wealthLuck", "loveLuck"],                                                            count: 2, chars: "전문가급 심층 분석", desc: "재물운 + 연애운" },
    { id: "standard", name: "베이직",     price: "₩19,900", pages: 75,  features: ["yearlyLuck", "wealthLuck", "loveLuck", "monthlyLuck"],                               count: 4, chars: "전문가급 심층 분석", desc: "올해 운세 + 재물운 + 연애운 + 월별 운세" },
    { id: "premium",  name: "프리미엄",   price: "₩24,900", pages: 100, features: ["yearlyLuck", "wealthLuck", "loveLuck", "monthlyLuck", "healthLuck"],                 count: 5, chars: "전문가급 심층 분석", desc: "올해 운세 + 재물운 + 연애운 + 월별 운세 + 건강운" },
    { id: "vip",      name: "VIP 커플팩", price: "₩29,900", pages: 150, features: ["name", "yearlyLuck", "wealthLuck", "loveLuck", "healthLuck", "couple", "monthlyLuck", "analysis"], count: 8, chars: "전문가급 심층 분석", desc: "본인 분석(8개) +<br/>이름+전체사주+궁합포함<br/>(상대방 정보 입력)" },
  ];

  const fortuneItems = [
    { id: "name",        icon: "📝", name: "이름분석" },
    { id: "yearlyLuck",  icon: "☀️", name: "올해 운세" },
    { id: "monthlyLuck", icon: "🌙", name: "월별 운세" },
    { id: "analysis",    icon: "✨", name: "전체 사주분석" },
    { id: "wealthLuck",  icon: "💎", name: "재물운" },
    { id: "loveLuck",    icon: "💕", name: "연애운" },
    { id: "healthLuck",  icon: "🌿", name: "건강운" },
    { id: "couple",      icon: "👫", name: "궁합분석" },
  ];


  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #d97706 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1719399184315-5ffab4006e18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fCVFQyVCQiVBOCVFQyU4NSU4OSUyMCVFQyU5NSU4NCVFRCU4QSVCOHxlbnwwfHwwfHx8MA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden", WebkitTapHighlightColor: "transparent" }}>

      {/* 재회운/반려동물 궁합 이름 입력 오버레이 */}
      {awaitOther && (
        <>
          <div onClick={() => setAwaitOther(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 302 }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 303, background: "linear-gradient(180deg,#1a0f35,#0f0620)", borderRadius: "20px 20px 0 0", padding: "28px 20px 0", maxWidth: 500, margin: "0 auto" }}>
            <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 16, marginBottom: 16, textAlign: "center" }}>
              {awaitOther.id === "pet_compat" ? "🐾 반려동물 이름을 입력해주세요" : "💔 상대방 이름을 입력해주세요"}
            </p>
            <form onSubmit={e => {
              e.preventDefault();
              if (!otherInput.trim()) return;
              const cur = awaitOther!;
              sessionStorage.setItem("specialOtherName", otherInput.trim());
              const paidPrice = finalPrice(2900);
              setAwaitOther(null);
              openPortoneModal(paidPrice, `/payment-complete?special=${cur.id}&paid=${paidPrice}`);
            }}>
              <input
                value={otherInput}
                onChange={e => setOtherInput(e.target.value)}
                placeholder={awaitOther.id === "pet_compat" ? "예: 초코" : "예: 홍길동"}
                autoFocus
                enterKeyHint="go"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid rgba(251,191,36,0.5)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15, fontWeight: 700, outline: "none", boxSizing: "border-box", marginBottom: 14 }}
              />
              <button
                type="submit"
                style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg,#fbbf24,#ec4899,#8b5cf6)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 40 }}
              >
                결제하기 · ₩2,900
              </button>
            </form>
          </div>
        </>
      )}

      {/* PortOne 결제 모달 */}
      {showPayModal && (
        <>
          <div onClick={closePayModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 500 }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 501, background: "linear-gradient(180deg,#1a0835,#0d0520)", borderRadius: "22px 22px 0 0", padding: "24px 20px 40px", maxWidth: 500, margin: "0 auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)", overflowY: "auto", maxHeight: "90vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 16, margin: 0 }}>결제</p>
                <p style={{ color: "#c4b5fd", fontWeight: 700, fontSize: 13, margin: "2px 0 0" }}>₩{modalPrice.toLocaleString()}</p>
              </div>
              <button onClick={closePayModal} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22, cursor: "pointer", padding: "4px 8px" }}>✕</button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "block", color: "#fbbf24", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>이름 (선택)</label>
              <input value={modalName} onChange={e => setModalName(e.target.value)} placeholder="홍길동" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid rgba(251,191,36,0.4)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: 15, fontWeight: 700, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "#fbbf24", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>휴대폰번호 (선택)</label>
              <input value={modalMobile} onChange={e => setModalMobile(e.target.value.replace(/\D/g,"").slice(0,11))} placeholder="01012345678" inputMode="numeric" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid rgba(251,191,36,0.4)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: 15, fontWeight: 700, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <button type="button" onClick={() => setShowRefund(v => !v)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer", padding: "2px 0", display: "flex", alignItems: "center", gap: 4 }}>
                📋 결제 전 확인사항 {showRefund ? "▲" : "▼"}
              </button>
              {showRefund && (
                <div style={{ marginTop: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px" }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.6 }}>디지털 콘텐츠 특성상, 이용이 시작된 후에는 취소가 어렵습니다.</p>
                </div>
              )}
              <div onClick={() => setRefundAgreed(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none", marginTop: 8 }}>
                <span style={{ fontSize: 18, color: refundAgreed ? "#4ade80" : "rgba(255,255,255,0.4)", lineHeight: 1 }}>{refundAgreed ? "✅" : "⬜"}</span>
                <span style={{ fontSize: 12, color: refundAgreed ? "#4ade80" : "rgba(255,255,255,0.5)", fontWeight: refundAgreed ? 700 : 400 }}>네, 확인했어요!</span>
              </div>
            </div>
            {modalError && <p style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, margin: "0 0 10px", textAlign: "center" }}>⚠️ {modalError}</p>}
            <button onClick={() => portoneModalPay("CARD")} disabled={modalLoading || !refundAgreed}
              style={{ width: "100%", padding: "15px 0", background: (modalLoading || !refundAgreed) ? "rgba(251,191,36,0.4)" : "linear-gradient(135deg,#fbbf24,#ec4899,#8b5cf6)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: (modalLoading || !refundAgreed) ? "not-allowed" : "pointer", marginBottom: 10, boxShadow: (modalLoading || !refundAgreed) ? "none" : "0 6px 22px rgba(251,191,36,0.3)" }}>
              {modalLoading ? "결제 중..." : `💳 신용카드 ₩${modalPrice.toLocaleString()}`}
            </button>
            <button onClick={() => portoneModalPay("KAKAOPAY")} disabled={modalLoading || !refundAgreed}
              style={{ width: "100%", padding: "15px 0", background: (modalLoading || !refundAgreed) ? "#bba000" : "#FEE500", color: (modalLoading || !refundAgreed) ? "rgba(0,0,0,0.4)" : "#3C1E1E", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: (modalLoading || !refundAgreed) ? "not-allowed" : "pointer" }}>
              💛 카카오페이
            </button>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center", margin: "10px 0 0" }}>SSL 보안 결제 · PortOne 제공</p>
          </div>
        </>
      )}

      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
      <button onClick={toggleMusic} aria-label="배경음악 켜기/끄기" style={{ position: "fixed", top: 14, right: 14, zIndex: 200, background: musicOn ? "linear-gradient(135deg,#ec4899,#8b5cf6)" : "#f3e8ff", border: "none", borderRadius: 50, cursor: "pointer", fontSize: 15, padding: "6px 10px", color: musicOn ? "white" : "#9ca3af", fontWeight: 900, boxShadow: musicOn ? "0 2px 8px rgba(236,72,153,0.4)" : "none" }}>
        {musicOn ? "🎵 ON" : "🎵"}
      </button>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(194, 65, 12, 0.2)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px" }}>

        <h2 style={{ textAlign: "center", color: "#fbbf24", marginBottom: 12, fontSize: "clamp(18px, 5vw, 26px)", fontWeight: 900 }}>💎 운세 구매</h2>

        {/* 할인코드 */}
        <div style={{ maxWidth: 480, margin: "0 auto 20px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "12px 14px" }}>
          <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 900, margin: "0 0 8px" }}>🎟️ 할인코드 (있으면 먼저 입력하세요)</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={discountInput}
              onChange={e => { setDiscountInput(e.target.value); setAppliedDiscount(null); setDiscountError(""); }}
              onKeyDown={e => e.key === "Enter" && applyDiscountCode()}
              placeholder="코드 입력 후 적용 → 상품 선택"
              style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(251,191,36,0.4)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 13, fontWeight: 700, outline: "none" }}
            />
            <button onClick={applyDiscountCode} style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a0f2e", fontWeight: 900, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>적용</button>
          </div>
          {appliedDiscount && (
            <p style={{ color: appliedDiscount.discountPercent === 100 ? "#4ade80" : "#90EE90", fontSize: 12, fontWeight: 800, marginTop: 6, marginBottom: 0, whiteSpace: "pre-line" }}>
              {appliedDiscount.discountPercent === 100 ? "✅ 100% 무료 쿠폰 적용!\n아래 상품을 선택하면 무료로 진행됩니다." : `✅ ${appliedDiscount.discountPercent}% 할인 적용됨 — 아래 상품 가격에 자동 반영됩니다.`}
            </p>
          )}
          {discountError && (
            <p style={{ color: discountError.startsWith("✅") ? "#4ade80" : "#ff6b6b", fontSize: 12, fontWeight: 700, marginTop: 6, marginBottom: 0 }}>{discountError}</p>
          )}
        </div>

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
                onClick={() => {
                  const paidPrice = finalPrice(s.price);
                  openPortoneModal(paidPrice, `/payment-complete?special=${s.id}&paid=${paidPrice}`);
                }}
                style={{ padding: "10px 4px", background: s.bg, backdropFilter: "blur(10px)", border: `1.5px solid ${s.bdColor}`, borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white" }}
              >
                <p style={{ margin: "0 0 3px", fontSize: 20 }}>{s.emoji}</p>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 900, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.label}</p>
                <p style={{ margin: "0 0 4px", fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 600, wordBreak: "keep-all", lineHeight: 1.3, whiteSpace: s.sub.includes('\n') ? "pre-line" : "normal" }}>{s.sub}</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: s.accent }}>₩{s.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 특별 2900원 */}
        <div style={{ maxWidth: 600, margin: "0 auto 20px" }}>
          <p style={{ color: "#fbbf24", fontSize: 13, fontWeight: 900, margin: "0 0 8px 2px" }}>💫 특별 2,900원</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {[
              { id: "daeun",      emoji: "🌌", label: "대운(大運)",   sub: "10년 단위 운명 흐름", daeun: true },
              { id: "yearly",     emoji: "☀️", label: "연도별운세",   sub: "올해 흐름 +\n12개월 로드맵", yearly: true },
              { id: "reunion",    emoji: "💔", label: "재회운",        sub: "다시 만날 수 있을까" },
              { id: "taegil",     emoji: "📅", label: "택일(擇日)",   sub: "내 사주에 맞는\n좋은날" },
              { id: "pet_compat", emoji: "🐾", label: "반려동물 궁합", sub: "나와 우리 아이 궁합" },
            ].map(s => (
              <button key={s.id}
                onClick={() => {
                  if ((s as any).daeun) { window.location.href = `/main-v2/daewoon`; return; }
                  if ((s as any).yearly) { window.location.href = `/main-v2/yearly`; return; }
                  if (s.id === "taegil") { window.location.href = `/main-v2/taegil`; return; }
                  if (s.id === "reunion" || s.id === "pet_compat") {
                    setOtherInput("");
                    setAwaitOther({ id: s.id, label: s.label });
                    return;
                  }
                  const paidPrice = finalPrice(2900);
                  openPortoneModal(paidPrice, `/payment-complete?special=${s.id}&paid=${paidPrice}`);
                }}
                style={{ padding: "10px 4px", background: "rgba(20,10,40,0.55)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white" }}
              >
                <p style={{ margin: "0 0 3px", fontSize: 20 }}>{s.emoji}</p>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 900, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.label}</p>
                <p style={{ margin: "0 0 4px", fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 600, wordBreak: "keep-all", lineHeight: 1.3, whiteSpace: s.sub.includes('\n') ? "pre-line" : "normal" }}>{s.sub}</p>
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
                  onClick={() => {
                    const paidPrice = finalPrice(3900);
                    localStorage.setItem("v2_paid_cats", JSON.stringify([s.catKey]));
                    openPortoneModal(paidPrice, `/payment-complete?package=${encodeURIComponent(s.label)}&pages=30&paid=${paidPrice}`);
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
                { id: "vip",      emoji: "👑", label: "VIP 커플팩", sub: "본인 분석(8개) +<br/>이름+전체사주+궁합포함<br/>(상대방 정보 입력)", pages: 150, price: 29900 },
              ].map(s => (
                <button key={s.id}
                  onClick={() => {
                    const paidPrice = finalPrice(s.price);
                    openPortoneModal(paidPrice, `/payment-complete?package=${encodeURIComponent(s.label)}&pages=${s.pages}&paid=${paidPrice}`);
                  }}
                  style={{ padding: "10px 4px", background: "rgba(20,10,40,0.55)", backdropFilter: "blur(10px)", border: "1.5px solid rgba(139,92,246,0.5)", borderRadius: 14, cursor: "pointer", textAlign: "center", color: "white" }}
                >
                  <p style={{ margin: "0 0 3px", fontSize: 20 }}>{s.emoji}</p>
                  <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 900, wordBreak: "keep-all", lineHeight: 1.3 }}>{s.label}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 8, color: "rgba(255,255,255,0.7)", fontWeight: 600, wordBreak: "keep-all", lineHeight: 1.3 }} dangerouslySetInnerHTML={{ __html: s.sub }} />
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: "#c4b5fd" }}>{`₩${s.price.toLocaleString()}`}</p>
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

        <div style={{ maxWidth: 600, margin: "0 auto 16px", background: "linear-gradient(135deg, rgba(20,10,40,0.6), rgba(74,26,84,0.45))", backdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.35)", borderRadius: 14, padding: "12px 20px", textAlign: "center" }}>
          <p style={{ color: "#fbbf24", fontSize: 15, fontWeight: 900, margin: "0 0 3px" }}>🔓 전체 AI 심층 분석</p>
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
              <div key={pkg.id + "_large"} onClick={() => {
                const originalPrice = Number(pkg.price.replace(/[^0-9]/g, ""));
                const paidPrice = finalPrice(originalPrice);
                openPortoneModal(paidPrice, `/payment-complete?package=${encodeURIComponent(pkg.name)}&pages=${pkg.pages}&paid=${paidPrice}`);
              }} style={{ background: cardBg2, backdropFilter: "blur(10px)", border: wlBadge ? "2px solid rgba(236,72,153,0.7)" : "1px solid rgba(196,181,253,0.45)", borderRadius: 12, padding: 12, cursor: "pointer", transition: "all 0.3s", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                {wlBadge && (
                  <p style={{ fontSize: 9, fontWeight: 900, margin: "0 0 4px 0", textShadow: "0 1px 3px rgba(0,0,0,0.5)", wordBreak: "keep-all", lineHeight: 1.4 }}>
                    <span style={{ color: "#ff3b3b" }}>{wlBadge.prefix}</span>
                    <span style={{ color: "#ffffff" }}>{wlBadge.highlight}</span>
                  </p>
                )}
                <h3 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, margin: "0 0 2px 0" }}>{pkg.name}</h3>
                <p style={{ color: "#f5f5f5", fontSize: 9, fontWeight: 700, margin: "0 0 6px 0", opacity: 0.85 }}>【심층 상세 분석】</p>
                {(() => { const orig = Number(pkg.price.replace(/[^0-9]/g, "")); const disc = finalPrice(orig); return appliedDiscount && !isPartner && disc < orig ? (
                  <p style={{ margin: "0 0 6px 0" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, textDecoration: "line-through", marginRight: 4 }}>{pkg.price}</span>
                    <span style={{ color: "#90EE90", fontSize: 16, fontWeight: 900 }}>₩{disc.toLocaleString()}</span>
                  </p>
                ) : (
                  <p style={{ color: "#ffffff", fontSize: 16, fontWeight: 900, margin: "0 0 6px 0" }}>{displayPrice2}</p>
                ); })()}
                <p style={{ color: "#f5f5f5", fontSize: 10, fontWeight: 700, margin: "0 0 6px 0", lineHeight: 1.5, wordBreak: "keep-all" }} dangerouslySetInnerHTML={{ __html: pkg.desc }} />
                <p style={{ color: "#fbbf24", fontSize: 9, fontWeight: 700, margin: "0 0 3px 0" }}>🎯 {pkg.count}개 운세</p>
                <p style={{ color: "#ffffff", fontSize: 9, fontWeight: 700, margin: 0 }}>📄 {pkg.chars}</p>
              </div>
            );
          })}
        </div>

        <div style={{ maxWidth: 320, margin: "0 auto", marginBottom: 20, background: "rgba(20,10,40,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.35)", padding: 16, borderRadius: 18, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
          <h3 style={{ color: "#fbbf24", fontSize: 17, fontWeight: 900, marginBottom: 20, letterSpacing: "-0.3px" }}>✨ 포함된 운세</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
            {fortuneItems.map(item => (
              <div key={item.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 4px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: 900, margin: 0, wordBreak: "keep-all", lineHeight: 1.2 }}>{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 320, margin: "0 auto 40px", textAlign: "center" }}>
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

        <section style={{ maxWidth: 320, margin: "0 auto 40px", background: "rgba(139,92,246,0.2)", padding: "12px 10px", borderRadius: 12 }}>
          <h2 style={{ textAlign: "center", color: "#fbbf24", fontSize: 13, fontWeight: 900, marginBottom: 10 }}>【왜 {brand?.businessName || "점운"}인가?】</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>📄</div>
              <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 10, marginBottom: 3 }}>완벽분석</p>
              <p style={{ color: "#ffffff", fontSize: 9, fontWeight: 700, margin: 0 }}>990원부터</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>💰</div>
              <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 10, marginBottom: 3 }}>합리적 가격</p>
              <p style={{ color: "#ffffff", fontSize: 9, fontWeight: 700, margin: 0 }}>990~29,900원</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>⚡</div>
              <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 10, marginBottom: 3 }}>즉시 완성</p>
              <p style={{ color: "#ffffff", fontSize: 9, fontWeight: 700, margin: 0 }}>3초 이내</p>
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
