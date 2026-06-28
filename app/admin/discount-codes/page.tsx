"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PromoCode {
  code: string;
  discountPercent: number;
  note: string;
  active: boolean;
  usageCount: number;
}

export default function AdminDiscountCodes() {
  const router = useRouter();
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [form, setForm] = useState({ code: "", discountPercent: 10, note: "" });
  const [saving, setSaving] = useState(false);

  const loadAll = () => {
    fetch("/api/promo-codes").then(res => res.json()).then(data => setCodes(data.codes || []));
  };

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      router.push("/admin/login");
      return;
    }
    loadAll();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  const handleDeleteCode = async (code: string) => {
    if (!confirm(`${code} 코드를 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/promo-codes?code=${encodeURIComponent(code)}`, { method: "DELETE" });
    if (res.ok) {
      setCodes(prev => prev.filter(c => c.code !== code));
    } else {
      alert("삭제 실패");
    }
  };

  const handleAddCode = async () => {
    if (!form.code.trim()) { alert("코드를 입력해주세요."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { alert("코드 생성에 실패했습니다."); return; }
      setForm({ code: "", discountPercent: 10, note: "" });
      loadAll();
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo', sans-serif", display: "flex" }}>
      <div style={{ width: "250px", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 20px", color: "white", display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 900, marginTop: 0, marginBottom: "30px" }}>👑 점운</h1>
        <div style={{ flex: 1 }}>
          <a href="/admin" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📊 대시보드</a>
          <a href="/admin/partners" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>👥 파트너 관리</a>
          <a href="/admin/partner-customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>📁 파트너 고객 DB</a>
          <a href="/admin/customers" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>👤 일반회원 DB</a>
          <a href="/admin/discount-codes" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>🎟️ 할인코드</a>
          <a href="/admin/top-sales" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>⭐ TOP 판매자</a>
          <a href="/partner" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🏠 파트너 메인</a>
          <a href="/partner/create-analysis" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>🔮 사주 분석 생성</a>
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "10px", color: "#333" }}>🎟️ 할인코드 관리</h1>
          <p style={{ fontSize: "13px", color: "#999", margin: "0 0 24px" }}>원하는 손님에게만 골라서 줄 수 있는 일반고객용 할인코드입니다. (파트너 사용료와는 무관)</p>

          {/* 코드 추가 폼 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="코드(예: FRIEND2026)" style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
            <input type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: Number(e.target.value) })} placeholder="할인율%" min={1} max={100} style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13, width: 90 }} />
            <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="메모(누구에게 왜 줬는지)" style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13, width: 220 }} />
            <button onClick={handleAddCode} disabled={saving} style={{ padding: "8px 16px", background: "#667eea", color: "white", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{saving ? "추가중..." : "+ 코드 추가"}</button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>코드</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>할인율</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>메모</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>사용 횟수</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>상태</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#999" }}>아직 등록된 할인코드가 없습니다.</td></tr>
              ) : (
                codes.map(c => (
                  <tr key={c.code} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#666", fontWeight: 700 }}>{c.code}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.discountPercent}%</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.note || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.usageCount || 0}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.active ? "활성" : "비활성"}</td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => handleDeleteCode(c.code)} style={{ padding: "4px 10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>삭제</button>
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
