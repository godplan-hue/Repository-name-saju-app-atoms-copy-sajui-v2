// app/payment-complete/page.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const CHARS_MAP: Record<number, string> = {
  30: "전문가급 심층 분석 포함",
  75: "전문가급 심층 분석 포함",
  100: "전문가급 심층 분석 포함",
  150: "전문가급 심층 분석 포함",
};

const PKG_NAMES = ["기본 분석", "베이직", "프리미엄", "VIP 커플팩"];

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
  const [packageName, setPackageName] = useState("");
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const pkg = searchParams.get("package") || "베이직";
    const pg = searchParams.get("pages") || "75";

    sessionStorage.setItem("selectedPackage", pkg);

    setPackageName(pkg);
    setPages(parseInt(pg));
  }, [searchParams]);

  const handleHome = () => {
    router.push("/main-v2");
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://i.pinimg.com/1200x/df/6d/df/df6ddf1858cf483c09d6d940fbc24e57.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", width: "100%", textAlign: "center" }}>
          <div style={{
            width: 84, height: 84, borderRadius: "50%", margin: "0 auto 24px",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 28px rgba(251,191,36,0.45)",
          }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#1a0f2e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>결제 완료!</h1>

          <p style={{ color: "#f5f5f5", fontSize: 16, fontWeight: 700, marginBottom: 24, lineHeight: 1.8 }}>
            <span style={{ color: "#fbbf24", fontWeight: 900 }}>{packageName}</span><br/>
            패키지 결제가 완료되었습니다!
          </p>

          <div style={{ background: "rgba(20,10,40,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(251,191,36,0.35)", padding: 24, borderRadius: 18, marginBottom: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.35)" }}>
            <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, margin: "0 0 12px 0" }}>📊 결제 정보</p>
            {PKG_NAMES.includes(packageName) ? (
              <>
                <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: "0 0 8px 0" }}>패키지: <span style={{ fontWeight: 900 }}>{packageName}</span></p>
                <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: "0 0 8px 0" }}>분석 수준: <span style={{ fontWeight: 900 }}>{CHARS_MAP[pages] ?? "전문가급 심층 분석 포함"}</span></p>
              </>
            ) : (
              <>
                <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: "0 0 8px 0" }}>패키지: <span style={{ fontWeight: 900 }}>{packageName.replace(/\+/g, ", ")}</span></p>
              </>
            )}
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: 0 }}>상태: <span style={{ color: "#90EE90", fontWeight: 900 }}>완료</span></p>
          </div>

          <button onClick={() => router.push(`/paid-info-input?package=${encodeURIComponent(packageName)}`)} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg, #fbbf24, #ec4899, #8b5cf6)", color: "#1a0f2e", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 12, boxShadow: "0 6px 22px rgba(251,191,36,0.35)" }}>🔮 유료분석 보기</button>

          <button onClick={handleHome} style={{ width: "100%", padding: 14, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", color: "#f5f5f5", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 12 }}>← 홈으로 돌아가기</button>

          <p style={{ color: "#999999", fontSize: 12, fontWeight: 700, marginTop: 0 }}>이메일로 영수증이 발송되었습니다.</p>
        </div>
      </div>
    </main>
  );
}
