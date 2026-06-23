"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PartnerCustomer {
  id: string;
  partnerId: string;
  partnerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageType: string;
  consentGiven: boolean;
  charge?: { listPrice: number; baseFee: number; vat: number; totalCharge: number };
  createdAt: string;
}

interface MonthlySummary { partnerName: string; count: number; revenue: number; }

export default function AdminPartnerCustomers() {
  const router = useRouter();
  const [customers, setCustomers] = useState<PartnerCustomer[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary[]>([]);
  const [recentPerPartner, setRecentPerPartner] = useState(50);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("adminId")) { router.push("/admin/login"); return; }
    fetch("/api/admin/partner-customers").then(res => res.json()).then(data => {
      setCustomers(data.customers || []);
      setMonthlySummary(data.monthlySummary || []);
      setRecentPerPartner(data.recentPerPartner || 50);
    }).finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  // 같은 고객이 여러 번 분석을 받으면 "전체 생성 내역"에는 매번 한 줄씩
  // 생기는 게 정상(거래 내역이라서)이지만, "이 사람이 누구다"를 보려면 그걸
  // 전화번호/이메일 기준으로 한 명당 한 줄로 묶어서 따로 보여줄 필요가 있음
  const byCustomer = new Map<string, { name: string; email: string; phone: string; byPartner: Map<string, { count: number; total: number }>; count: number; total: number; lastAt: string }>();
  customers.forEach(c => {
    const key = c.customerPhone || c.customerEmail || c.customerName;
    const cur = byCustomer.get(key) || { name: c.customerName, email: c.customerEmail, phone: c.customerPhone, byPartner: new Map<string, { count: number; total: number }>(), count: 0, total: 0, lastAt: c.createdAt };
    cur.count += 1;
    cur.total += c.charge?.totalCharge || 0;
    const p = cur.byPartner.get(c.partnerName) || { count: 0, total: 0 };
    p.count += 1;
    p.total += c.charge?.totalCharge || 0;
    cur.byPartner.set(c.partnerName, p);
    if (new Date(c.createdAt) > new Date(cur.lastAt)) cur.lastAt = c.createdAt;
    byCustomer.set(key, cur);
  });
  const uniqueCustomers = Array.from(byCustomer.values()).sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo'", display: "flex" }}>
      <div style={{ width: "250px", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 20px", color: "white", display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 900, marginTop: 0, marginBottom: "30px" }}>👑 점운</h1>
        <div style={{ flex: 1 }}>
          <a href="/admin" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📊 대시보드</a>
          <a href="/admin/partners" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>👥 파트너 관리</a>
          <a href="/admin/partner-customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>📁 파트너 고객 DB</a>
          <a href="/admin/customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>👤 일반회원 DB</a>
          <a href="/admin/discount-codes" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🎟️ 할인코드</a>
          <a href="/admin/top-sales" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>⭐ TOP 판매자</a>
          <a href="/partner" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🏠 파트너 메인</a>
          <a href="/partner/create-analysis" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🔮 사주 분석 생성</a>
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "20px", color: "#333" }}>📁 전체 파트너 고객 DB</h1>

          <h2 style={{ fontSize: "16px", fontWeight: 900, margin: "0 0 10px", color: "#333" }}>📌 이번 달 파트너별 사용료 매출</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginBottom: 30 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>파트너</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>생성 건수</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>우리가 받은 사용료 합계</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: "16px", textAlign: "center", color: "#999" }}>이번 달 생성 내역이 없습니다.</td></tr>
              ) : (
                monthlySummary.map((v) => (
                  <tr key={v.partnerName} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#666", fontWeight: 700 }}>{v.partnerName}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{v.count}건</td>
                    <td style={{ padding: "12px", color: "#333", fontWeight: 900 }}>₩{v.revenue.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h2 style={{ fontSize: "16px", fontWeight: 900, margin: "0 0 10px", color: "#333" }}>👥 고유 고객 목록 (중복 제거, 총 {uniqueCustomers.length}명)</h2>
          <p style={{ fontSize: "12px", color: "#999", margin: "0 0 10px" }}>같은 사람이 여러 번 분석을 받아도 한 줄로만 보여요(전화번호·이메일 기준). 파트너별 최근 {recentPerPartner}건 안에서만 집계돼요.</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", marginBottom: 30 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>고객명</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>이메일</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>전화</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>이용한 파트너</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>구매 건수</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>총 결제액</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>최근 이용일</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: "20px", textAlign: "center", color: "#999" }}>불러오는 중...</td></tr>
              ) : uniqueCustomers.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "20px", textAlign: "center", color: "#999" }}>아직 고객 기록이 없습니다.</td></tr>
              ) : (
                uniqueCustomers.map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#333", fontWeight: 700 }}>{c.name}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.email || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.phone || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>
                      {Array.from(c.byPartner.entries()).map(([name, v], j) => (
                        <div key={j}>{name}: {v.count}건/₩{v.total.toLocaleString()}</div>
                      ))}
                    </td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.count}건</td>
                    <td style={{ padding: "12px", color: "#333", fontWeight: 900 }}>₩{c.total.toLocaleString()}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{new Date(c.lastAt).toLocaleString("ko-KR")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h2 style={{ fontSize: "16px", fontWeight: 900, margin: "0 0 10px", color: "#333" }}>📋 전체 생성 내역(거래 단위, 총 {customers.length}건)</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>파트너</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>고객명</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>이메일</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>전화</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>상품</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>사용료(VAT포함)</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>동의</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>생성일시</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: "20px", textAlign: "center", color: "#999" }}>불러오는 중...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "20px", textAlign: "center", color: "#999" }}>아직 파트너가 생성한 고객 기록이 없습니다.</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={`${c.partnerId}-${c.id}`} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#666", fontWeight: 700 }}>{c.partnerName}</td>
                    <td style={{ padding: "12px", color: "#333" }}>{c.customerName}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.customerEmail || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.customerPhone || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.packageType}</td>
                    <td style={{ padding: "12px", color: "#333", fontWeight: 700 }}>{c.charge ? `₩${c.charge.totalCharge.toLocaleString()}` : "-"}</td>
                    <td style={{ padding: "12px", color: c.consentGiven ? "#2e7d32" : "#c33" }}>{c.consentGiven ? "✅ 동의함" : "❌ 미확인"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{new Date(c.createdAt).toLocaleString("ko-KR")}</td>
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
