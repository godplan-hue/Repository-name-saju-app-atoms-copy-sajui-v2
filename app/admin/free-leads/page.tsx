"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthYear?: string;
  source?: string;
  code?: string;
  used?: boolean;
  createdAt: number;
}

type SourceFilter = "all" | "free" | "jigun" | "resume";

export default function AdminFreeLeads() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

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
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>전화번호 기준 중복 없이 수집 · 출처별 필터 선택</p>

          {/* 소스별 필터 버튼 */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {([
              { key: "all",    label: "전체", emoji: "📋", color: "#6b7280", bg: sourceFilter === "all" ? "#374151" : "#f3f4f6", textColor: sourceFilter === "all" ? "white" : "#374151" },
              { key: "free",   label: "재물운무료", emoji: "🎁", color: "#92400e", bg: sourceFilter === "free" ? "#f59e0b" : "#fef3c7", textColor: sourceFilter === "free" ? "white" : "#92400e" },
              { key: "jigun",  label: "직운무료", emoji: "💼", color: "#6d28d9", bg: sourceFilter === "jigun" ? "#7c3aed" : "#ede9fe", textColor: sourceFilter === "jigun" ? "white" : "#6d28d9" },
              { key: "resume", label: "자소서무료", emoji: "📄", color: "#1d4ed8", bg: sourceFilter === "resume" ? "#2563eb" : "#dbeafe", textColor: sourceFilter === "resume" ? "white" : "#1d4ed8" },
            ] as { key: SourceFilter; label: string; emoji: string; color: string; bg: string; textColor: string }[]).map(f => {
              const cnt = f.key === "all" ? leads.length : leads.filter(l => (l.source ?? "free") === f.key).length;
              return (
                <button key={f.key} onClick={() => setSourceFilter(f.key)}
                  style={{ padding: "8px 16px", background: f.bg, color: f.textColor, border: "none", borderRadius: 20, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  {f.emoji} {f.label} ({cnt}명)
                </button>
              );
            })}
          </div>

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
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>이메일</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>생년</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>출처</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>쿠폰코드</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>사용여부</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151" }}>신청일</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.filter(l => sourceFilter === "all" || (l.source ?? "free") === sourceFilter).map((lead, i) => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid #e5e7eb", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{lead.name || <span style={{ color: "#9ca3af", fontWeight: 400 }}>—</span>}</td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{lead.phone}</td>
                      <td style={{ padding: "12px 16px", color: "#374151", fontSize: 12 }}>{lead.email || <span style={{ color: "#9ca3af" }}>—</span>}</td>
                      <td style={{ padding: "12px 16px", color: "#374151", fontSize: 12 }}>{lead.birthYear ? `${lead.birthYear}년` : <span style={{ color: "#9ca3af" }}>—</span>}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          background: lead.source === "jigun" ? "#ede9fe" : lead.source === "resume" ? "#dbeafe" : "#fef3c7",
                          color: lead.source === "jigun" ? "#6d28d9" : lead.source === "resume" ? "#1d4ed8" : "#92400e",
                          padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700
                        }}>
                          {lead.source === "jigun" ? "💼직운" : lead.source === "resume" ? "📄합격자소서" : "🎁무료재물운"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {lead.code
                          ? <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 6, fontWeight: 700, letterSpacing: 1 }}>{lead.code}</span>
                          : <span style={{ color: "#9ca3af", fontSize: 12 }}>없음</span>}
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
