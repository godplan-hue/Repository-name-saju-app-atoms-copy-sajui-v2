"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDiscountCodes() {
  const router = useRouter();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo', sans-serif", display: "flex" }}>
      <div style={{ width: "250px", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 20px", color: "white", display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 900, marginTop: 0, marginBottom: "30px" }}>👑 점운</h1>
        <div style={{ flex: 1 }}>
          <a href="/admin" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📊 대시보드</a>
          <a href="/admin/partners" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>👥 파트너 관리</a>
          <a href="/admin/discount-codes" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>🎟️ 할인코드</a>
          <a href="/admin/settlement" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>💰 정산 관리</a>
          <a href="/admin/top-sales" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>⭐ TOP 판매자</a>
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "30px", color: "#333" }}>🎟️ 할인코드 관리</h1>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>코드</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>할인율</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>파트너</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>사용 횟수</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", color: "#666" }}>SUMMER2024</td>
                <td style={{ padding: "12px", color: "#666" }}>20%</td>
                <td style={{ padding: "12px", color: "#666" }}>테스트파트너</td>
                <td style={{ padding: "12px", color: "#666" }}>0</td>
                <td style={{ padding: "12px", color: "#666" }}>활성</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}