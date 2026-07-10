"use client";
import { useState } from "react";

const STORE_ID = "store-446686e2-22bd-4941-ae2a-83e7f3a15d87";
const CHANNEL_KEY = "channel-key-2c42a945-12be-4dfd-a2f3-a8b5ff11467f";

export default function PortoneTestPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "fail">("idle");
  const [result, setResult] = useState<any>(null);

  const handlePayment = async () => {
    setStatus("loading");
    try {
      const PortOne = await import("@portone/browser-sdk/v2");
      const paymentId = `jeomun-test-${Date.now()}`;
      const response = await PortOne.requestPayment({
        storeId: STORE_ID,
        channelKey: CHANNEL_KEY,
        paymentId,
        orderName: "점운 사주 분석 (테스트)",
        totalAmount: 1000,
        currency: "KRW",
        payMethod: "CARD",
        customer: {
          fullName: "테스트 고객",
          email: "test@jeomun.com",
          phoneNumber: "01000000000",
        },
      });
      if (response?.code) {
        setStatus("fail");
        setResult({ code: response.code, message: response.message });
      } else {
        setStatus("success");
        setResult(response);
      }
    } catch (e: any) {
      setStatus("fail");
      setResult({ message: e?.message || "알 수 없는 오류" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff9f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 400, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🔮</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>점운 결제 테스트</h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>포트원 V2 · KG이니시스 테스트 채널</p>

        <div style={{ background: "#f8f8ff", borderRadius: 12, padding: 20, marginBottom: 28, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#666", fontSize: 14 }}>상품명</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>점운 사주 분석</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "#666", fontSize: 14 }}>결제수단</span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>신용카드</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e0e0e0", paddingTop: 12, marginTop: 4 }}>
            <span style={{ color: "#333", fontSize: 16, fontWeight: 700 }}>결제금액</span>
            <span style={{ color: "#e91e8c", fontSize: 20, fontWeight: 800 }}>₩1,000</span>
          </div>
        </div>

        {status === "idle" && (
          <button
            onClick={handlePayment}
            style={{ width: "100%", background: "#e91e8c", color: "#fff", border: "none", borderRadius: 12, padding: "16px 0", fontSize: 17, fontWeight: 700, cursor: "pointer" }}
          >
            카드로 결제하기
          </button>
        )}
        {status === "loading" && (
          <button disabled style={{ width: "100%", background: "#ccc", color: "#fff", border: "none", borderRadius: 12, padding: "16px 0", fontSize: 17, fontWeight: 700 }}>
            결제창 열리는 중...
          </button>
        )}
        {status === "success" && (
          <div>
            <div style={{ background: "#e8f5e9", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <p style={{ fontWeight: 700, color: "#2e7d32", fontSize: 16 }}>결제 성공</p>
              <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>결제ID: {result?.paymentId}</p>
            </div>
            <button
              onClick={() => { setStatus("idle"); setResult(null); }}
              style={{ width: "100%", background: "#f5f5f5", color: "#333", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              다시 테스트
            </button>
          </div>
        )}
        {status === "fail" && (
          <div>
            <div style={{ background: "#fff3e0", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
              <p style={{ fontWeight: 700, color: "#e65100", fontSize: 16 }}>결제 취소 또는 실패</p>
              <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{result?.message}</p>
            </div>
            <button
              onClick={() => { setStatus("idle"); setResult(null); }}
              style={{ width: "100%", background: "#f5f5f5", color: "#333", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              다시 시도
            </button>
          </div>
        )}

        <p style={{ fontSize: 11, color: "#bbb", marginTop: 20 }}>테스트 환경 · 실결제 없음</p>
      </div>
    </div>
  );
}
