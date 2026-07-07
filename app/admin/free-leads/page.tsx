"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  birthYear: string;
  code: string;
  used: boolean;
  createdAt: number;
}

export default function AdminFreeLeads() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) { router.push("/admin/login"); return; }
    fetch("/api/admin/free-leads", { headers: { "x-admin-id": adminId } })
      .then(r => r.json())
      .then(data => { setLeads(data.leads || []); })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  const NAV = [
    { href: "/admin", label: "📊 대시보드" },
    { href: "/admin/partners", label: "👥 파트너 관리" },
    { href: "/admin/partner-customers", label: "📁 파트너 고객 DB" },
    { href: "/admin/customers", label: "👤 일반회원 DB" },
    { href: "/admin/direct-payments", label: "💳 일반회원 결제내역" },
    { href: "/admin/free-leads", label: "🎁 무료DB", active: true },
    { href: "/admin/discount-codes", label: "🎟️ 할인코드" },
    { href: "/admin/top-sales", label: "⭐ TOP 판매자" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo'", display: "flex" }}>
      <div style={{ width: "250px", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 20px", color: "white", display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 900, marginTop: 0, marginBottom: "30px" }}>👑 점운</h1>
        <div style={{ flex: 1 }}>
          {NAV.map(n => (
            <a key={n.href} href={n.href} style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: n.active ? "rgba(255,255,255,0.3)" : "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: n.active ? 700 : 500, fontSize: "14px" }}>{n.label}</a>
          ))}
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>

      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginTop: 0, fontSize: "22px", fontWeight: 900 }}>🎁 무료DB ({leads.length}명)</h2>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>jeomun.com/free 에서 무료 재물운 신청한 고객 목록</p>

          {loading ? (
            <p style={{ color: "#6b7280" }}>불러오는 중...</p>
          ) : leads.length === 0 ? (
            <p style={{ color: "#6b7280" }}>아직 신청 데이터가 없어요.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>이름</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>전화번호</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>생년</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>쿠폰코드</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>사용여부</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>신청일</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid #e5e7eb", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{lead.name}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{lead.phone}</td>
                      <td style={{ padding: "12px 16px", color: "#6b7280" }}>{lead.birthYear}년</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 6, fontWeight: 700, letterSpacing: 1 }}>{lead.code}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: lead.used ? "#dcfce7" : "#fee2e2", color: lead.used ? "#166534" : "#991b1b", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                          {lead.used ? "사용됨" : "미사용"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("ko-KR") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
