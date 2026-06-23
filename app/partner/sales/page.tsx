"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { getPartnerTier } from "@/lib/partnerTiers";

interface SalesEntry {
  id: string;
  customerName: string;
  packageType: string;
  charge?: { listPrice: number; baseFee: number; vat: number; totalCharge: number };
  createdAt: string;
}

export default function PartnerSales() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState("");
  const [tierId, setTierId] = useState("free");
  const [entries, setEntries] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    const name = localStorage.getItem("partnerName");
    if (!id) { router.push("/partner/login"); return; }
    setPartnerName(name || "");
    setTierId(localStorage.getItem("partnerTier") || "free");
    fetch(`/api/partner/archive?partnerId=${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => setEntries(data.entries || []))
      .finally(() => setLoading(false));
  }, [router]);

  const tier = getPartnerTier(tierId);
  const now = new Date();
  const monthly = entries.filter(e => {
    const d = new Date(e.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const monthlyTotal = monthly.reduce((sum, e) => sum + (e.charge?.totalCharge || 0), 0);
  const allTotal = entries.reduce((sum, e) => sum + (e.charge?.totalCharge || 0), 0);

  return (
    <>
      <Head><title>이용내역 - 점운 파트너</title></Head>
      <main style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)", padding: "20px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: 14, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 900, margin: 0, color: "#333" }}>💰 {partnerName}님의 이용내역</h1>
              <p style={{ fontSize: 11, color: "#999", margin: "6px 0 0" }}>현재 등급: {tier.name} (사용료 {tier.feeDiscountPercent}% 할인)</p>
            </div>
            <button onClick={() => router.push("/partner/guide")} style={{ padding: "8px 14px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              ← 가이드로
            </button>
          </div>

          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "12px 16px", borderRadius: 12, marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#92400e", fontWeight: 700, lineHeight: 1.6, margin: 0 }}>
              ※ 아래 금액은 고객님께 받으시는 가격이 아니라, 분석을 1건 생성할 때마다 등급별 할인이 적용되어 점운에 지불하시는 이용료입니다.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "white", borderRadius: 14, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 6 }}>이번 달 이용료</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#9333ea" }}>{monthlyTotal.toLocaleString()}원</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{monthly.length}건</div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 6 }}>전체 이용료</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#9333ea" }}>{allTotal.toLocaleString()}원</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{entries.length}건</div>
            </div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: 14 }}>
            {loading ? (
              <p style={{ textAlign: "center", color: "#999", padding: "30px 0", fontSize: 12 }}>불러오는 중...</p>
            ) : entries.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999", padding: "30px 0", fontSize: 12 }}>아직 생성한 분석이 없습니다.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ddd" }}>
                    <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#333" }}>날짜</th>
                    <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#333" }}>고객명</th>
                    <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#333" }}>상품</th>
                    <th style={{ padding: 10, textAlign: "right", fontWeight: 700, color: "#333" }}>이용료</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(e => (
                    <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: 10, color: "#666" }}>{new Date(e.createdAt).toLocaleDateString("ko-KR")}</td>
                      <td style={{ padding: 10, color: "#333", fontWeight: 700 }}>{e.customerName}</td>
                      <td style={{ padding: 10, color: "#666" }}>{e.packageType}</td>
                      <td style={{ padding: 10, color: "#9333ea", fontWeight: 800, textAlign: "right" }}>{(e.charge?.totalCharge || 0).toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
