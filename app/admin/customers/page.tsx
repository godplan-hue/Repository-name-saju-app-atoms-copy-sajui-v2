"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: string;
  relationship: string;
  createdAt: string;
}

export default function AdminCustomers() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const load = async (cur?: string | null) => {
    const res = await fetch(`/api/admin/customers${cur ? `?cursor=${encodeURIComponent(cur)}` : ""}`);
    const data = await res.json();
    setCustomers(prev => cur ? [...prev, ...data.customers] : data.customers);
    setCursor(data.nextCursor);
    if (!data.nextCursor) setDone(true);
  };

  useEffect(() => {
    if (!localStorage.getItem("adminId")) { router.push("/admin/login"); return; }
    load().finally(() => setLoading(false));
  }, [router]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try { await load(cursor); } finally { setLoadingMore(false); }
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
          <a href="/admin/partners" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>👥 파트너 관리</a>
          <a href="/admin/partner-customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📁 파트너 고객 DB</a>
          <a href="/admin/customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>👤 일반회원 DB</a>
          <a href="/admin/discount-codes" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🎟️ 할인코드</a>
          <a href="/admin/top-sales" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>⭐ TOP 판매자</a>
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "10px", color: "#333" }}>👤 일반회원 DB</h1>
          <p style={{ fontSize: "13px", color: "#999", margin: "0 0 20px" }}>파트너를 거치지 않고 직접 사주를 본 일반 고객 목록입니다. 최신 50건씩 불러오며, 아래 버튼으로 더 불러올 수 있어요.</p>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>이름</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>전화</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>이메일</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>생년월일</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>성별</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>관계</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>등록일시</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: "20px", textAlign: "center", color: "#999" }}>불러오는 중...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "20px", textAlign: "center", color: "#999" }}>아직 등록된 일반회원이 없습니다.</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#333", fontWeight: 700 }}>{c.name}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.phone || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.email || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.birthYear && c.birthMonth && c.birthDay ? `${c.birthYear}-${c.birthMonth}-${c.birthDay}` : "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.gender || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.relationship || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{new Date(c.createdAt).toLocaleString("ko-KR")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && !done && customers.length > 0 && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={handleLoadMore} disabled={loadingMore} style={{ padding: "10px 24px", background: "#eef0ff", color: "#667eea", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: loadingMore ? "not-allowed" : "pointer" }}>
                {loadingMore ? "불러오는 중..." : "더 보기"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
