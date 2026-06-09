// app/payment-complete/page.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentComplete() {
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
    router.push("/");
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>✅</div>
         
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>결제 완료!</h1>
         
          <p style={{ color: "#f5f5f5", fontSize: 16, fontWeight: 700, marginBottom: 24, lineHeight: 1.8 }}>
            <span style={{ color: "#fbbf24", fontWeight: 900 }}>{packageName}</span> 패키지 결제가<br/>
            완료되었습니다!
          </p>

          <div style={{ background: "rgba(108,64,200,0.9)", padding: 24, borderRadius: 12, marginBottom: 24 }}>
            <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 700, margin: "0 0 12px 0" }}>📊 결제 정보</p>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: "0 0 8px 0" }}>패키지: <span style={{ fontWeight: 900 }}>{packageName}</span></p>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: "0 0 8px 0" }}>페이지: <span style={{ fontWeight: 900 }}>{pages}페이지</span></p>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: 0 }}>상태: <span style={{ color: "#90EE90", fontWeight: 900 }}>완료</span></p>
          </div>

          <button onClick={() => router.push(`/paid-info-input?package=${encodeURIComponent(packageName)}`)} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 12 }}>🔮 유료분석 보기</button>

          <button onClick={handleHome} style={{ width: "100%", padding: 14, background: "rgba(139,92,246,0.3)", color: "#f5f5f5", border: "1px solid rgba(139,92,246,0.8)", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 12 }}>← 홈으로 돌아가기</button>

          <p style={{ color: "#999999", fontSize: 12, fontWeight: 700, marginTop: 0 }}>이메일로 영수증이 발송되었습니다.</p>
        </div>
      </div>
    </main>
  );
}