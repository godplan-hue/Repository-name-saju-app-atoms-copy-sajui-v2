"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PartnerGuide() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    if (!id) { router.push("/partner/login"); return; }
    setPartnerId(id);
  }, [router]);

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      await fetch("/api/partner/confirm-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId }),
      });
    } finally {
      setConfirmed(true);
      setConfirming(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 16px" }}>
        <button onClick={() => router.push("/partner/login")} style={{ background: "rgba(139,92,246,0.3)", color: "#fbbf24", border: "1px solid rgba(139,92,246,0.8)", padding: "10px 16px", borderRadius: 8, fontWeight: 900, cursor: "pointer", marginBottom: 20 }}>← 돌아가기</button>
        <h1 style={{ color: "#fbbf24", fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 900, marginBottom: 24 }}>📘 파트너 운영 가이드</h1>

        {!confirmed ? (
          <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)", textAlign: "center" }}>
            <p style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 700, lineHeight: 1.8, marginBottom: 14 }}>상호명 변경, 결과지 발송 방법 등 파트너 운영에 필요한 안내를 확인하실 수 있어요.</p>
            <p style={{ color: "#cbb6ff", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>가이드 확인 시 환불 규정이 적용돼요</p>
            <button onClick={handleConfirm} disabled={confirming} style={{ padding: "12px 32px", background: confirming ? "#999" : "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: confirming ? "not-allowed" : "pointer" }}>
              {confirming ? "처리중..." : "확인하고 보기"}
            </button>
          </div>
        ) : (
          <div style={{ background: "rgba(108,64,200,0.15)", padding: 30, borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ color: "#fbbf24", fontSize: 16, fontWeight: 900, marginBottom: 12 }}>결과지 발송 방식</h2>
            <ul style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, lineHeight: 1.8, marginLeft: 20, marginBottom: 0 }}>
              <li>• 결과지에는 "점운" 대신 파트너님이 등록하신 상호명이 자동으로 표시됩니다(가입 시 한 번만 등록하면 이후 모든 결과지에 자동 적용)</li>
              <li>• 실버 등급 이상부터는 결과지를 고객 이메일로 점운 사이트에서 바로 자동 발송할 수 있습니다</li>
              <li>• 무료 등급은 자동 발송 기능을 이용할 수 없으며, 이미지를 직접 다운로드하여 고객에게 전달해야 합니다</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
