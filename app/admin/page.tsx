"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalPartners: number;
  monthlyRevenue: number;
  totalAnalysis: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState<DashboardStats>({ totalPartners: 0, monthlyRevenue: 0, totalAnalysis: 0 });

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    const name = localStorage.getItem("adminName");
    if (!adminId) {
      router.push("/admin/login");
      return;
    }
    setAdminName(name || "");
    fetch("/api/admin/dashboard", { headers: { "x-admin-id": adminId } })
      .then((res) => res.json())
      .then((data) => {
        if (data.totalPartners !== undefined) setStats(data);
      });
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
          <a href="/admin" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>📊 대시보드</a>
          <a href="/admin/partners" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>👥 파트너 관리</a>
          <a href="/admin/partner-customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📁 파트너 고객 DB</a>
          <a href="/admin/discount-codes" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🎟️ 할인코드</a>
          <a href="/admin/top-sales" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>⭐ TOP 판매자</a>
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "10px", color: "#333" }}>👑 어드민 대시보드</h1>
          <p style={{ fontSize: "14px", color: "#666", margin: 0, marginBottom: "30px" }}>{adminName}님 환영합니다!</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "10px" }}>파트너</div>
              <div style={{ fontSize: "36px", fontWeight: 900 }}>{stats.totalPartners}</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", padding: "30px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "10px" }}>이번달 매출</div>
              <div style={{ fontSize: "36px", fontWeight: 900 }}>₩{stats.monthlyRevenue.toLocaleString()}</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", padding: "30px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "10px" }}>분석 건수</div>
              <div style={{ fontSize: "36px", fontWeight: 900 }}>{stats.totalAnalysis}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}