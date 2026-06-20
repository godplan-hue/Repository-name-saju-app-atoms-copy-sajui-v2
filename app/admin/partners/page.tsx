"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PartnerRow {
  id: string;
  name: string;
  email: string;
  tier: string;
  analysisCount: number;
  revenue: number;
  guideConfirmedAt: string | null;
  totalPaid: number;
  lastPaidAt: string | null;
  usedCoupon: boolean;
  couponCodes: string[];
}

const TIER_NAMES: Record<string, string> = { free: "무료", silver: "실버", gold: "골드", diamond: "다이아" };

export default function AdminPartners() {
  const router = useRouter();
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPartners = () => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) { router.push("/admin/login"); return; }
    fetch("/api/admin/partners", { headers: { "x-admin-id": adminId } })
      .then((res) => res.json())
      .then((data) => setPartners(data.partners || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPartners();
  }, [router]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 파트너 계정을 삭제하시겠습니까? 되돌릴 수 없습니다.`)) return;
    const adminId = localStorage.getItem("adminId");
    const res = await fetch(`/api/admin/partners/${id}`, {
      method: "DELETE",
      headers: { "x-admin-id": adminId || "" },
    });
    if (!res.ok) { alert("삭제에 실패했습니다."); return; }
    loadPartners();
  };
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
          <a href="/admin/partners" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>👥 파트너 관리</a>
          <a href="/admin/partner-customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📁 파트너 고객 DB</a>
          <a href="/admin/discount-codes" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🎟️ 할인코드</a>
          <a href="/admin/top-sales" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>⭐ TOP 판매자</a>
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "30px", color: "#333" }}>👥 파트너 관리</h1>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>이름</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>이메일</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>등급</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>분석 건수</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>수익</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>가이드 확인</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>가입비 납부</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: "20px", textAlign: "center", color: "#999" }}>불러오는 중...</td></tr>
              ) : partners.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "20px", textAlign: "center", color: "#999" }}>가입된 파트너가 없습니다.</td></tr>
              ) : (
                partners.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#666" }}>{p.name}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{p.email}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{TIER_NAMES[p.tier] || p.tier}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{p.analysisCount}</td>
                    <td style={{ padding: "12px", color: "#666" }}>₩{p.revenue.toLocaleString()}</td>
                    <td style={{ padding: "12px", color: p.guideConfirmedAt ? "#16a34a" : "#999" }}>{p.guideConfirmedAt ? new Date(p.guideConfirmedAt).toLocaleString("ko-KR") : "미확인"}</td>
                    <td style={{ padding: "12px", color: p.totalPaid > 0 ? "#16a34a" : "#999" }}>
                      {p.totalPaid > 0 ? `₩${p.totalPaid.toLocaleString()} (${p.lastPaidAt ? new Date(p.lastPaidAt).toLocaleDateString("ko-KR") : ""})` : "없음"}
                      {p.usedCoupon && (
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: "#d97706", background: "#fef3c7", padding: "2px 6px", borderRadius: 10 }}>
                          🎟️ 쿠폰 사용{p.couponCodes.length > 0 ? `(${p.couponCodes.join(", ")})` : ""}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => handleDelete(p.id, p.name)} style={{ padding: "6px 12px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>삭제</button>
                    </td>
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