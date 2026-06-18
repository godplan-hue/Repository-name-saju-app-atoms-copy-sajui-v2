"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type SettlementRecord } from "@/lib/partnerTiers";
export default function AdminSettlement() {
  const router = useRouter();
  const [records, setRecords] = useState<SettlementRecord[]>([]);
  useEffect(() => {
    if (!localStorage.getItem("adminId")) { router.push("/admin/login"); return; }
    fetch("/api/partner/settlements").then(res => res.json()).then(data => setRecords(data.settlements || []));
  }, [router]);
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };
  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo'", display: "flex" }}>
      <div style={{ width: "250px", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 20px", color: "white", display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 900, marginTop: 0, marginBottom: "30px" }}>👑 점운</h1>
        <div style={{ flex: 1 }}>
          <a href="/admin" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📊 대시보드</a>
          <a href="/admin/partners" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>👥 파트너 관리</a>
          <a href="/admin/partner-customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📁 파트너 고객 DB</a>
          <a href="/admin/discount-codes" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🎟️ 할인코드</a>
          <a href="/admin/settlement" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>💰 정산 관리</a>
          <a href="/admin/top-sales" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>⭐ TOP 판매자</a>
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "20px", color: "#333" }}>💰 정산 관리</h1>

          {/* 파트너별 이번 달 총 지급액 — 25일에 이 금액만 보내면 됨 */}
          <h2 style={{ fontSize: "16px", fontWeight: 900, margin: "0 0 10px", color: "#333" }}>📌 이번 달 파트너별 총 지급액</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginBottom: 30 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>파트너</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>건수</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>총 지급액</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const now = new Date();
                const thisMonth = records.filter(r => {
                  const d = new Date(r.date);
                  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
                });
                const byPartner = new Map<string, { count: number; total: number }>();
                thisMonth.forEach(r => {
                  const cur = byPartner.get(r.partnerName) || { count: 0, total: 0 };
                  cur.count += 1;
                  cur.total += r.partnerShare;
                  byPartner.set(r.partnerName, cur);
                });
                const rows = Array.from(byPartner.entries());
                if (rows.length === 0) {
                  return <tr><td colSpan={3} style={{ padding: "16px", textAlign: "center", color: "#999" }}>이번 달 지급 내역이 없습니다.</td></tr>;
                }
                return rows.map(([name, v]) => (
                  <tr key={name} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#666", fontWeight: 700 }}>{name}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{v.count}건</td>
                    <td style={{ padding: "12px", color: "#333", fontWeight: 900 }}>₩{v.total.toLocaleString()}</td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>

          <h2 style={{ fontSize: "16px", fontWeight: 900, margin: "0 0 10px", color: "#333" }}>📋 전체 거래 내역</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>파트너</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>일시</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>결제금액</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>수수료+부가세</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>파트너 정산액</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#999" }}>아직 할인코드로 결제된 내역이 없습니다.</td></tr>
              ) : (
                records.map(r => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#666" }}>{r.partnerName}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{new Date(r.date).toLocaleString("ko-KR")}</td>
                    <td style={{ padding: "12px", color: "#666" }}>₩{r.grossAmount.toLocaleString()}</td>
                    <td style={{ padding: "12px", color: "#666" }}>₩{(r.pgFee + r.vat).toLocaleString()}</td>
                    <td style={{ padding: "12px", color: "#666", fontWeight: 700 }}>₩{r.partnerShare.toLocaleString()}</td>
                    <td style={{ padding: "12px", color: "#666" }}>대기중(매월 25일 정산)</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}