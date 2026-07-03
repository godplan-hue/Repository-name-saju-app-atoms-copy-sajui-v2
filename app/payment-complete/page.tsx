// app/payment-complete/page.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";

const SPECIAL_NAMES: Record<string, string> = {
  sinyeon: "신년운세",
  sinyeon_premium: "프리미엄 신년운세",
  reunion: "재회운",
  marriage_detail: "결혼사주",
  findmatch: "내 사람 찾기",
  love_detail: "연애사주",
  divorce: "이혼운세",
  taegil: "택일",
  pet_compat: "반려동물 궁합",
};

// 12간지 코드("00"~"11") → 24시 숫자 문자열
const HOUR_PERIOD_TO_24H: Record<string, string> = {
  "00": "23", "01": "1", "02": "3", "03": "5", "04": "7", "05": "9",
  "06": "11", "07": "13", "08": "15", "09": "17", "10": "19", "11": "21",
};

// 24시 숫자 → 12간지 코드 (서버 API 요구 형식)
function hourTo12Branch(hour24: string): string {
  const h = parseInt(hour24, 10);
  if (isNaN(h)) return "unknown";
  return String(Math.floor(((h + 1) % 24) / 2)).padStart(2, "0");
}

const BIRTH_HOURS = [
  { label: "자시(子時)", time: "23~01시", value: "23" },
  { label: "축시(丑時)", time: "01~03시", value: "1" },
  { label: "인시(寅時)", time: "03~05시", value: "3" },
  { label: "묘시(卯時)", time: "05~07시", value: "5" },
  { label: "진시(辰時)", time: "07~09시", value: "7" },
  { label: "사시(巳時)", time: "09~11시", value: "9" },
  { label: "오시(午時)", time: "11~13시", value: "11" },
  { label: "미시(未時)", time: "13~15시", value: "13" },
  { label: "신시(申時)", time: "15~17시", value: "15" },
  { label: "유시(酉時)", time: "17~19시", value: "17" },
  { label: "술시(戌時)", time: "19~21시", value: "19" },
  { label: "해시(亥時)", time: "21~23시", value: "21" },
];

const PKG_PRICE_MAP: Record<string, string> = {
  "기본 분析": "9900",
  "베이직": "19900", "프리미엄": "24900", "VIP 커플팩": "29900",
};

const CHARS_MAP: Record<number, string> = {
  30: "전문가급 심층 분석 포함",
  75: "전문가급 심층 분석 포함",
  100: "전문가급 심층 분석 포함",
  150: "전문가급 심층 분석 포함",
};

const PKG_DISPLAY_NAMES = ["기본 분석", "기본 분석", "베이직", "프리미엄", "VIP 커플팩"];

export default function PaymentComplete() {
  return (
    <Suspense fallback={null}>
      <PaymentCompleteInner />
    </Suspense>
  );
}

function PaymentCompleteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 결제 정보
  const [packageName, setPackageName] = useState("");
  const [pages, setPages] = useState(0);
  const [ready, setReady] = useState(false);
  const [isPackage, setIsPackage] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");

  // 사주 정보 폼 — 본인
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("unknown");
  const [gender, setGender] = useState("");

  // 사주 정보 폼 — 상대방 (VIP 커플팩 전용)
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthYear, setPartnerBirthYear] = useState("");
  const [partnerBirthMonth, setPartnerBirthMonth] = useState("");
  const [partnerBirthDay, setPartnerBirthDay] = useState("");
  const [partnerBirthHour, setPartnerBirthHour] = useState("unknown");

  const [isLoading, setIsLoading] = useState(false);
  const [needsForm, setNeedsForm] = useState(false);
  const [redirectTo, setRedirectTo] = useState(""); // daeun/yearly/naming용
  const formRef = useRef<HTMLDivElement>(null);

  // 할인코드
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; discountPercent: number } | null>(null);
  const [discountError, setDiscountError] = useState("");

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 저장된 본인 프로필 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("v2_saved_profile");
    if (!saved) return;
    try {
      const p = JSON.parse(saved);
      setName(p.name ?? "");
      setBirthYear(p.birthYear ?? "");
      setBirthMonth(p.birthMonth ? String(Number(p.birthMonth)) : "");
      setBirthDay(p.birthDay ? String(Number(p.birthDay)) : "");
      setBirthHour(
        p.birthHour && HOUR_PERIOD_TO_24H[p.birthHour]
          ? HOUR_PERIOD_TO_24H[p.birthHour]
          : "unknown"
      );
      if (p.gender) setGender(p.gender);
    } catch {}
  }, []);

  useEffect(() => {
    const paidParam = searchParams.get("paid") || "";
    if (paidParam) setPaidAmount(paidParam);

    // 이전 세션값 초기화 — 상품 섞임 방지 (v2_paid_cats는 모달에서 직접 세팅하므로 제외)
    sessionStorage.removeItem("specialType");
    sessionStorage.removeItem("specialPaid");
    sessionStorage.removeItem("v2_after_payment_goto");
    sessionStorage.removeItem("v2_naming_queue");
    sessionStorage.removeItem("selectedPackage");
    sessionStorage.removeItem("v2_plan");
    sessionStorage.removeItem("yearlyPaid");
    sessionStorage.removeItem("daeunPaid");

    // Q&A 무제한 해제
    try {
      const profileRaw = localStorage.getItem("v2_saved_profile");
      if (profileRaw) {
        const profile = JSON.parse(profileRaw);
        const n = profile.name ?? "";
        const y = profile.birthYear ?? 0;
        if (n && y) {
          const d = new Date();
          const todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
          localStorage.setItem(`v2_qa_unlock_${n}_${y}`, todayStr);
        }
      }
    } catch {}

    // 대운 — 별도 페이지로 이동
    const isDaeun = searchParams.get("daeun") === "1";
    if (isDaeun) {
      const daeunCount = searchParams.get("daeunCount") || "1";
      const daeunIndices = searchParams.get("daeunIndices") || "";
      sessionStorage.setItem("daeunPaid", "1");
      sessionStorage.setItem("daeunPaidCount", daeunCount);
      if (daeunIndices) {
        try {
          const existing = JSON.parse(sessionStorage.getItem("daeunPaidIndices") || "[]");
          const newIdx = daeunIndices.split(",").map(Number).filter(n => !isNaN(n));
          const merged = [...new Set([...existing, ...newIdx])];
          sessionStorage.setItem("daeunPaidIndices", JSON.stringify(merged));
        } catch {}
      }
      setPackageName("대운(大運)");
      setRedirectTo("/main-v2/daewoon");
      setNeedsForm(true);
      setReady(true);
      return;
    }

    // 올해운세 — 별도 페이지로 이동
    const isYearly = searchParams.get("yearly") === "1";
    if (isYearly) {
      sessionStorage.setItem("yearlyPaid", "1");
      setPackageName("올해 운세");
      setRedirectTo("/main-v2/yearly");
      setNeedsForm(true);
      setReady(true);
      return;
    }

    // 묶음 naming — special 페이지로 이동
    const namingFlag = searchParams.get("naming");
    if (namingFlag === "1") {
      // 이전 세션 잔류값 초기화
      sessionStorage.removeItem("selectedPackage");
      sessionStorage.removeItem("v2_plan");
      sessionStorage.removeItem("v2_paid_cats");
      const queueStr = searchParams.get("queue") || "";
      const queueArr = queueStr ? queueStr.split(",").filter(Boolean) : [];
      if (queueArr.length > 0) {
        sessionStorage.setItem("v2_naming_queue", JSON.stringify(queueArr));
        sessionStorage.setItem("specialType", queueArr[0]);
        sessionStorage.setItem("specialPaid", "1");
        sessionStorage.setItem("v2_after_payment_goto", "special");
      }
      setPackageName(searchParams.get("package") || `${queueArr.length}개 운세 묶음`);
      setRedirectTo("/main-v2/special");
      setNeedsForm(true);
      setReady(true);
      return;
    }

    // 개별 special — 폼 인라인으로 보여주기
    const specialType = searchParams.get("special");
    if (specialType) {
      // 이전 세션 잔류값 초기화
      sessionStorage.removeItem("selectedPackage");
      sessionStorage.removeItem("v2_plan");
      sessionStorage.removeItem("v2_paid_cats");
      sessionStorage.removeItem("v2_naming_queue");
      sessionStorage.setItem("specialType", specialType);
      sessionStorage.setItem("specialPaid", "1");
      sessionStorage.setItem("v2_after_payment_goto", "special");
      setPackageName(SPECIAL_NAMES[specialType] || specialType);
      setNeedsForm(true);
      setReady(true);
      return;
    }

    // 패키지 — 폼 인라인으로 보여주기
    const pkg = searchParams.get("package") || "베이직";
    const pg = searchParams.get("pages") || "75";
    const paid = searchParams.get("paid") || "";

    // 이전 세션 잔류값 초기화 (다른 상품 섞임 방지)
    sessionStorage.removeItem("specialType");
    sessionStorage.removeItem("specialPaid");
    sessionStorage.removeItem("v2_after_payment_goto");
    sessionStorage.removeItem("v2_naming_queue");

    sessionStorage.setItem("selectedPackage", pkg);
    if (paid) sessionStorage.setItem("price", paid);
    sessionStorage.setItem("v2_plan", "package");

    // 추천인 커미션
    const refPartnerId = localStorage.getItem("v2_ref");
    if (refPartnerId && paid) {
      fetch("/api/partner/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId: refPartnerId, paidAmount: Number(paid) }),
      }).catch(() => {});
      localStorage.removeItem("v2_ref");
    }

    setPackageName(pkg);
    setPages(parseInt(pg));
    setIsPackage(true);
    setNeedsForm(true);
    setReady(true);
  }, [searchParams]);

  // 분석 API 호출 → 결과지 이동
  const applyDiscountCode = async () => {
    const code = discountInput.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetch(`/api/promo-codes?code=${encodeURIComponent(code)}`);
      if (!res.ok) { setDiscountError("유효하지 않은 코드입니다."); return; }
      const data = await res.json();
      if (!data.active) { setDiscountError("이미 사용된 코드입니다."); return; }
      setAppliedDiscount({ code, discountPercent: data.discountPercent });
      setDiscountError("");
    } catch {
      setDiscountError("코드 확인 중 오류가 발생했습니다.");
    }
  };

  const runAnalysis = async (p: {
    name: string; birthYear: string; birthMonth: string; birthDay: string;
    birthHour: string; pkg: string;
    partnerName?: string; partnerBirthYear?: string; partnerBirthMonth?: string;
    partnerBirthDay?: string; partnerBirthHour?: string;
  }, pricePaid?: string) => {
    setIsLoading(true);
    try {
      const birthDate = `${p.birthYear}-${String(p.birthMonth).padStart(2, "0")}-${String(p.birthDay).padStart(2, "0")}`;

      let prevSaved: Record<string, string> = {};
      try { prevSaved = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}"); } catch {}
      localStorage.setItem("v2_saved_profile", JSON.stringify({
        ...prevSaved,
        name: p.name,
        birthYear: p.birthYear,
        birthMonth: String(p.birthMonth).padStart(2, "0"),
        birthDay: String(p.birthDay).padStart(2, "0"),
      }));

      const isPkg = PKG_DISPLAY_NAMES.includes(p.pkg);
      const prePlan = isPkg ? "package" : "select";

      const res = await fetch("/api/v2/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: p.name,
          birth: birthDate,
          birthHour: hourTo12Branch(p.birthHour),
          gender: "N",
          relationship: "solo",
          category: "🌟 오늘의 운세",
          planType: prePlan,
          partnerName: p.partnerName || undefined,
          partnerBirthHour: hourTo12Branch(p.partnerBirthHour ?? "unknown"),
          partnerBirth: (p.partnerBirthYear && p.partnerBirthMonth && p.partnerBirthDay)
            ? `${p.partnerBirthYear}-${String(p.partnerBirthMonth).padStart(2,"0")}-${String(p.partnerBirthDay).padStart(2,"0")}`
            : undefined,
          partnerGender: "N",
        }),
      });

      if (!res.ok) {
        alert("분석 실패. 다시 시도해주세요.");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      const plan = isPkg ? "package" : "select";
      const profile = {
        name: p.name, birthYear: p.birthYear, birthMonth: p.birthMonth,
        birthDay: p.birthDay, birthHour: p.birthHour, gender: "N", relationship: "solo",
      };
      const result = { ...data, profile, histId: Date.now(), savedAt: new Date().toISOString() };
      const price = plan === "select" ? (pricePaid || paidAmount || "990") : (PKG_PRICE_MAP[p.pkg] ?? "9900");

      sessionStorage.setItem("v2_result", JSON.stringify(result));
      sessionStorage.setItem("v2_paid", "1");
      sessionStorage.setItem("v2_plan", plan);
      sessionStorage.setItem("selectedPackage", p.pkg);
      sessionStorage.setItem("price", price);

      const _d = new Date();
      const _tk = `${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,"0")}-${String(_d.getDate()).padStart(2,"0")}`;
      localStorage.setItem(`v2_qa_unlock_${p.name}_${p.birthYear}`, _tk);

      // 보관함 저장 — result 페이지를 거치지 않아도 저장되도록 여기서도 저장
      try {
        const _paidCatsRaw = sessionStorage.getItem("v2_paid_cats");
        const _allAnalyses = result.allAnalyses as Record<string, string> | undefined;
        const _catKeys = _allAnalyses ? Object.keys(_allAnalyses) : [];
        const _cats: string[] = _paidCatsRaw ? JSON.parse(_paidCatsRaw) : _catKeys;
        const _phone = (() => { try { return sessionStorage.getItem("v2_payment_phone") || localStorage.getItem("v2_saved_phone") || ""; } catch { return ""; } })();
        if (_cats.length > 0 && p.name && result.histId) {
          const _hist: any[] = JSON.parse(localStorage.getItem("v2_history") || "[]");
          _cats.forEach((_cat: string, _i: number) => {
            const _itemId = `${result.histId}-${_i}`;
            if (_hist.some((h: any) => h.id === _itemId)) return;
            const _item = {
              id: _itemId,
              date: result.savedAt,
              name: p.name,
              category: _cat,
              scores: result.scores ?? {},
              analysis: (_allAnalyses ?? {})[_cat] ?? "",
              isPaid: true,
              planType: plan,
              birthYear: p.birthYear ?? "",
              luckyColor: result.luckyColor ?? "",
              luckyNumber: result.luckyNumber ?? "",
              luckyDirection: result.luckyDirection ?? "",
            };
            _hist.unshift(_item);
            if (p.name) {
              fetch("/api/v2/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: p.name, phone: _phone, item: _item }),
              }).catch(() => {});
            }
          });
          localStorage.setItem("v2_history", JSON.stringify(_hist.slice(0, 50)));
        }
      } catch {}

      const specialT = sessionStorage.getItem("specialType");
      const specialP = sessionStorage.getItem("specialPaid");
      if (specialT && specialP === "1") {
        router.push("/main-v2/special");
      } else {
        router.push("/main-v2/result");
      }
    } catch (error) {
      console.error("분석 오류:", error);
      alert("분석 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const handleAnalysis = async () => {
    if (!name || !birthYear || !birthMonth || !birthDay) {
      alert("이름과 생년월일을 입력해주세요!");
      return;
    }
    if (redirectTo && !gender) {
      alert("성별을 선택해주세요!");
      return;
    }
    if (packageName === "VIP 커플팩") {
      if (!partnerName || !partnerBirthYear || !partnerBirthMonth || !partnerBirthDay) {
        alert("상대방의 정보를 입력해주세요!");
        return;
      }
    }
    let effectivePaid = paidAmount;
    if (appliedDiscount) {
      try {
        const res = await fetch("/api/promo-codes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: appliedDiscount.code }),
        });
        if (res.ok) {
          const data = await res.json();
          effectivePaid = String(Math.round(Number(paidAmount) * (1 - data.discountPercent / 100)));
        }
      } catch {}
    }
    // naming/daeun/yearly: 프로필 저장 후 redirectTo로 이동
    if (redirectTo) {
      let prev: Record<string,string> = {};
      try { prev = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}"); } catch {}
      const fullProfile = { ...prev, name, birthYear, birthMonth: String(birthMonth).padStart(2,"0"), birthDay: String(birthDay).padStart(2,"0"), birthHour, gender, relationship: "나" };
      localStorage.setItem("v2_saved_profile", JSON.stringify(fullProfile));
      sessionStorage.setItem("v2_profile", JSON.stringify(fullProfile));
      router.replace(redirectTo);
      return;
    }
    runAnalysis({
      name, birthYear, birthMonth, birthDay, birthHour,
      pkg: packageName,
      partnerName, partnerBirthYear, partnerBirthMonth, partnerBirthDay, partnerBirthHour,
    }, effectivePaid);
  };

  useEffect(() => {
    if (ready && needsForm) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [ready, needsForm]);

  if (!ready) return null;

  const isRedirectOnly = !needsForm && redirectTo !== "";

  const inp: React.CSSProperties = {
    width: "100%", padding: 6, borderRadius: 6,
    border: "1px solid #fbbf24", background: "#fff",
    color: "#333", fontSize: 12, fontWeight: 700,
    boxSizing: "border-box", fontFamily: "inherit",
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://i.pinimg.com/736x/39/74/d2/3974d23bcbb31d29d39bbe657914e8f7.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "12px 14px 12px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", width: "100%", textAlign: "center" }}>

          {/* 완료 체크마크 */}
          <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 10px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(251,191,36,0.45)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#1a0f2e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 style={{ color: "#fbbf24", fontSize: "clamp(18px,4vw,26px)", fontWeight: 900, marginBottom: 8 }}>결제 완료!</h1>
          <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, marginBottom: 10, lineHeight: 1.5 }}>
            <span style={{ color: "#fbbf24", fontWeight: 900 }}>{packageName}</span><br/>
            {isPackage ? "패키지 결제가 완료되었습니다!" : "결제가 완료되었습니다!"}
          </p>

          {/* 결제 정보 카드 */}
          <div style={{ background: "rgba(20,10,40,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.35)", padding: 10, borderRadius: 12, marginBottom: 10, textAlign: "left" }}>
            <p style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, margin: "0 0 6px 0" }}>📊 결제 정보</p>
            {isPackage && ["기본 분석","기본 분석","베이직","프리미엄","VIP 커플팩"].includes(packageName) ? (
              <>
                <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 4px 0" }}>패키지: <span style={{ fontWeight: 900 }}>{packageName}</span></p>
                <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 4px 0" }}>분석 수준: <span style={{ fontWeight: 900 }}>{CHARS_MAP[pages] ?? "전문가급 심층 분석 포함"}</span></p>
              </>
            ) : isPackage ? (
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 4px 0" }}>상품: <span style={{ fontWeight: 900 }}>{packageName.replace(/\+/g, ", ")}</span></p>
            ) : (
              <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 4px 0" }}>상품: <span style={{ fontWeight: 900 }}>{packageName}</span></p>
            )}
            {paidAmount && <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: "0 0 4px 0" }}>결제 금액: <span style={{ color: "#fbbf24", fontWeight: 900 }}>₩{Number(paidAmount).toLocaleString()}</span></p>}
            <p style={{ color: "#f5f5f5", fontSize: 12, fontWeight: 700, margin: 0 }}>상태: <span style={{ color: "#90EE90", fontWeight: 900 }}>완료</span></p>
          </div>

          {/* 보관함 저장 안내 */}
          <div style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 10, textAlign: "left" }}>
            <p style={{ color: "#f9a8d4", fontSize: 12, fontWeight: 900, margin: "0 0 4px" }}>📂 보관함 저장 안내</p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 700, margin: 0, lineHeight: 1.7 }}>
              결제한 이 기기에는 자동 저장됩니다.<br/>
              다른 기기(PC ↔ 모바일)에서 보려면<br/>
              → 보관함에서 결제할 때 입력한 <span style={{ color: "#fbbf24" }}>핸드폰번호</span>를 입력하면 불러올 수 있어요.
            </p>
          </div>

          {/* 대운/올해운세/naming — 기존처럼 버튼으로 이동 */}
          {isRedirectOnly && (
            <>
              <button onClick={() => router.replace(redirectTo)} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 12, boxShadow: "0 6px 22px rgba(251,191,36,0.35)" }}>🔮 분석 보기</button>
            </>
          )}

          {/* 사주 정보 입력 폼 — 파란색 (special + package 공통) */}
          {needsForm && (
            <div ref={formRef} style={{ background: "rgba(139,92,246,0.3)", padding: 10, borderRadius: 10, marginBottom: 10, border: "1px solid rgba(251,191,36,0.3)", textAlign: "left" }}>
              <h3 style={{ color: "#fbbf24", fontSize: 12, fontWeight: 900, margin: "0 0 6px 0" }}>🌟 아래 사주 정보 입력 후 분석 시작!</h3>

              {/* ── 본인 정보 ── */}
              <div style={{ marginBottom: 6, paddingBottom: 6, borderBottom: "1px solid rgba(251,191,36,0.4)" }}>
                <p style={{ color: "#fbbf24", fontSize: 11, fontWeight: 900, margin: "0 0 4px 0" }}>본인 정보</p>

                <div style={{ marginBottom: 4 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#fbbf24", marginBottom: 2 }}>이름</label>
                  <input type="text" placeholder="이름을 입력하세요" value={name} onChange={e => setName(e.target.value)} style={inp} />
                </div>

                <div style={{ marginBottom: 4 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#fbbf24", marginBottom: 2 }}>생년월일</label>
                  <input type="number" placeholder="연도 (예: 1990)" value={birthYear} onChange={e => setBirthYear(e.target.value)} min="1900" max={new Date().getFullYear()} style={{ ...inp, marginBottom: 4 }} />
                  <div style={{ display: "flex", gap: "4%" }}>
                    <select value={birthMonth} onChange={e => setBirthMonth(e.target.value)} style={{ ...inp, width: "48%" }}>
                      <option value="">월 선택</option>
                      {months.map(m => <option key={m} value={m}>{m}월</option>)}
                    </select>
                    <select value={birthDay} onChange={e => setBirthDay(e.target.value)} style={{ ...inp, width: "48%" }}>
                      <option value="">일 선택</option>
                      {days.map(d => <option key={d} value={d}>{d}일</option>)}
                    </select>
                  </div>
                </div>

                {redirectTo && (
                  <div style={{ marginBottom: 4 }}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#fbbf24", marginBottom: 2 }}>성별</label>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["남자", "여자"].map(g => (
                        <button key={g} onClick={() => setGender(g)} style={{ flex: 1, padding: "4px 0", border: gender === g ? "2px solid #fbbf24" : "1.5px solid #ddd", background: gender === g ? "#fffbeb" : "#fff", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer", color: gender === g ? "#b45309" : "#333" }}>
                          {g === "남자" ? "👦 남자" : "👧 여자"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: 4 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#fbbf24", marginBottom: 2 }}>태어난 시</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, marginBottom: 3 }}>
                    {BIRTH_HOURS.map(h => (
                      <button key={h.value} onClick={() => setBirthHour(h.value)} style={{ padding: "4px 1px", border: birthHour === h.value ? "2px solid #fbbf24" : "1.5px solid #ddd", background: birthHour === h.value ? "#fffbeb" : "#fff", borderRadius: 6, fontWeight: 700, fontSize: 9, cursor: "pointer", color: birthHour === h.value ? "#b45309" : "#333", textAlign: "center" }}>
                        {h.label}<br/><span style={{ fontSize: 7, opacity: 0.65 }}>{h.time}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setBirthHour("unknown")} style={{ width: "100%", padding: "4px 0", border: birthHour === "unknown" ? "2px solid #fbbf24" : "1.5px solid #ddd", background: birthHour === "unknown" ? "#fffbeb" : "#fff", borderRadius: 6, fontWeight: 700, fontSize: 10, cursor: "pointer", color: birthHour === "unknown" ? "#b45309" : "#333" }}>모름</button>
                </div>
              </div>

              {/* ── 상대방 정보 (VIP 커플팩 전용) ── */}
              {packageName === "VIP 커플팩" && (
                <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "2px solid rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.15)", padding: 10, borderRadius: 10, marginTop: 4 }}>
                  <p style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 900, margin: "0 0 10px 0" }}>상대방 정보</p>

                  <div style={{ marginBottom: 4 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#c4b5fd", marginBottom: 5 }}>상대방 이름</label>
                    <input type="text" placeholder="상대방 이름을 입력하세요" value={partnerName} onChange={e => setPartnerName(e.target.value)} style={{ ...inp, border: "1px solid #c4b5fd" }} />
                  </div>

                  <div style={{ marginBottom: 4 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#c4b5fd", marginBottom: 5 }}>상대방 생년월일</label>
                    <input type="number" placeholder="연도 (예: 1990)" value={partnerBirthYear} onChange={e => setPartnerBirthYear(e.target.value)} min="1900" max={new Date().getFullYear()} style={{ ...inp, border: "1px solid #c4b5fd", marginBottom: 7 }} />
                    <div style={{ display: "flex", gap: "4%" }}>
                      <select value={partnerBirthMonth} onChange={e => setPartnerBirthMonth(e.target.value)} style={{ ...inp, width: "48%", border: "1px solid #c4b5fd" }}>
                        <option value="">월 선택</option>
                        {months.map(m => <option key={m} value={m}>{m}월</option>)}
                      </select>
                      <select value={partnerBirthDay} onChange={e => setPartnerBirthDay(e.target.value)} style={{ ...inp, width: "48%", border: "1px solid #c4b5fd" }}>
                        <option value="">일 선택</option>
                        {days.map(d => <option key={d} value={d}>{d}일</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#c4b5fd", marginBottom: 5 }}>상대방 태어난 시</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 5 }}>
                      {BIRTH_HOURS.map(h => (
                        <button key={h.value} onClick={() => setPartnerBirthHour(h.value)} style={{ padding: "4px 1px", border: partnerBirthHour === h.value ? "2px solid #c4b5fd" : "1.5px solid #ddd", background: partnerBirthHour === h.value ? "#f5f3ff" : "#fff", borderRadius: 6, fontWeight: 700, fontSize: 9, cursor: "pointer", color: partnerBirthHour === h.value ? "#6d28d9" : "#333", textAlign: "center" }}>
                          {h.label}<br/><span style={{ fontSize: 7, opacity: 0.65 }}>{h.time}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setPartnerBirthHour("unknown")} style={{ width: "100%", padding: "4px 0", border: partnerBirthHour === "unknown" ? "2px solid #c4b5fd" : "1.5px solid #ddd", background: partnerBirthHour === "unknown" ? "#f5f3ff" : "#fff", borderRadius: 6, fontWeight: 700, fontSize: 10, cursor: "pointer", color: partnerBirthHour === "unknown" ? "#6d28d9" : "#333" }}>모름</button>
                  </div>
                </div>
              )}


              {/* 분석 시작 버튼 */}
              <button onClick={handleAnalysis} disabled={isLoading} style={{ width: "100%", padding: 10, background: isLoading ? "rgba(251,191,36,0.5)" : "linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: isLoading ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(251,191,36,0.3)" }}>
                {isLoading ? "🔮 분석 중..." : "🔮 분석 시작"}
              </button>
            </div>
          )}


          {/* 할인코드 — 모든 결제완료 공통 */}
          <div style={{ marginTop: 8, paddingBottom: 8, borderTop: "1px solid rgba(251,191,36,0.3)", paddingTop: 8 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#fbbf24", marginBottom: 4 }}>🎟 할인코드</label>
            {!appliedDiscount ? (
              <>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="할인코드 입력"
                    value={discountInput}
                    onChange={e => { setDiscountInput(e.target.value); setDiscountError(""); }}
                    style={{ flex: 1, padding: 6, borderRadius: 6, border: "1px solid #fbbf24", background: "#fff", color: "#333", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}
                  />
                  <button onClick={applyDiscountCode} style={{ padding: "6px 12px", background: "rgba(251,191,36,0.15)", border: "1px solid #fbbf24", color: "#fbbf24", borderRadius: 6, fontWeight: 900, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>적용</button>
                </div>
                {discountError && <p style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, margin: "6px 0 0 0" }}>{discountError}</p>}
              </>
            ) : (
              <div style={{ background: "rgba(144,238,144,0.15)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(144,238,144,0.5)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ color: "#90EE90", fontWeight: 900, fontSize: 13 }}>{"✓"} {appliedDiscount.discountPercent}% 할인 적용!</span>
                  <button onClick={() => { setAppliedDiscount(null); setDiscountInput(""); }} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>취소</button>
                </div>
                <span style={{ color: "#fbbf24", fontSize: 12, fontWeight: 700 }}>
                  {Number(paidAmount).toLocaleString()}원 → {Math.round(Number(paidAmount) * (1 - appliedDiscount.discountPercent / 100)).toLocaleString()}원
                </span>
              </div>
            )}
          </div>

          <button onClick={() => router.push("/main-v2")} style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>← 홈으로 돌아가기</button>
        </div>
      </div>
    </main>
  );
}
