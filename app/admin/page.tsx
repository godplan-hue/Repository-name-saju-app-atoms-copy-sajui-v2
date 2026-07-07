"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalPartners: number;
  monthlyRevenue: number;
  totalAnalysis: number;
  directMonthlyRevenue: number;
  directTotalRevenue: number;
  directCount: number;
  directMonthlyCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalPartners: 0, monthlyRevenue: 0, totalAnalysis: 0,
    directMonthlyRevenue: 0, directTotalRevenue: 0, directCount: 0, directMonthlyCount: 0,
  });

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

  const NAV = [
    { href: "/admin", label: "📊 대시보드", active: true },
    { href: "/admin/partners", label: "👥 파트너 관리" },
    { href: "/admin/partner-customers", label: "📁 파트너 고객 DB" },
    { href: "/admin/customers", label: "👤 일반회원 DB" },
    { href: "/admin/direct-payments", label: "💳 일반회원 결제내역" },
    { href: "/admin/free-leads", label: "🎁 무료DB" },
    { href: "/admin/discount-codes", label: "🎟️ 할인코드" },
    { href: "/admin/top-sales", label: "⭐ TOP 판매자" },
    { href: "/partner", label: "🏠 파트너 메인" },
    { href: "/partner/create-analysis", label: "🔮 사주 분석 생성" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo', sans-serif", display: "flex" }}>
      <div style={{ width: "250px", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 20px", color: "white", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <h1 style={{ fontSize: "24px", fontWeight: 900, marginTop: 0, marginBottom: "30px" }}>👑 점운</h1>
        <div style={{ flex: 1 }}>
          {NAV.map(n => (
            <a key={n.href} href={n.href} style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: n.active ? "rgba(255,255,255,0.3)" : "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: n.active ? 700 : 500, fontSize: "14px" }}>{n.label}</a>
          ))}
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>

      <div style={{ flex: 1, padding: "30px", overflowX: "auto" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "6px", color: "#333" }}>👑 어드민 대시보드</h1>
          <p style={{ fontSize: "14px", color: "#666", margin: "0 0 28px" }}>{adminName}님 환영합니다!</p>

          {/* 파트너 매출 */}
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#888", margin: "0 0 10px" }}>📦 파트너 매출</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "24px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "8px" }}>파트너 수</div>
              <div style={{ fontSize: "32px", fontWeight: 900 }}>{stats.totalPartners}개</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", padding: "24px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "8px" }}>파트너 이번달 매출</div>
              <div style={{ fontSize: "26px", fontWeight: 900 }}>₩{stats.monthlyRevenue.toLocaleString()}</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", padding: "24px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "8px" }}>파트너 분석 건수</div>
              <div style={{ fontSize: "32px", fontWeight: 900 }}>{stats.totalAnalysis}건</div>
            </div>
          </div>

          {/* 일반회원 직접 결제 */}
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#888", margin: "0 0 10px" }}>👤 일반회원 직접 결제 (jeomun.com)</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            <div style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", padding: "24px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "8px" }}>이번달 결제 건수</div>
              <div style={{ fontSize: "30px", fontWeight: 900 }}>{stats.directMonthlyCount}건</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", padding: "24px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "8px" }}>이번달 매출</div>
              <div style={{ fontSize: "24px", fontWeight: 900 }}>₩{stats.directMonthlyRevenue.toLocaleString()}</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", padding: "24px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "8px" }}>누적 결제 건수</div>
              <div style={{ fontSize: "30px", fontWeight: 900 }}>{stats.directCount}건</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #ec4899, #db2777)", padding: "24px", borderRadius: "12px", color: "white" }}>
              <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "8px" }}>누적 매출</div>
              <div style={{ fontSize: "24px", fontWeight: 900 }}>₩{stats.directTotalRevenue.toLocaleString()}</div>
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#bbb", margin: "10px 0 0" }}>* 일반회원 매출은 오늘 이후 결제분부터 집계됩니다 · 상세 내역은 💳 일반회원 결제내역에서 확인</p>
        </div>
      </div>
    </main>
  );
}
