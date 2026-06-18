"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PARTNER_TIERS, type PartnerDiscountCode, type SettlementRecord } from "@/lib/partnerTiers";

export default function AdminDiscountCodes() {
  const router = useRouter();
  const [codes, setCodes] = useState<PartnerDiscountCode[]>([]);
  const [usageByCode, setUsageByCode] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ code: "", discountPercent: 10, partnerName: "", tierId: "free" });
  const [saving, setSaving] = useState(false);

  const loadAll = () => {
    fetch("/api/partner/discount-codes").then(res => res.json()).then(data => setCodes(data.codes || []));
    fetch("/api/partner/settlements").then(res => res.json()).then((data: { settlements: SettlementRecord[] }) => {
      const counts: Record<string, number> = {};
      (data.settlements || []).forEach(r => { counts[r.discountCode] = (counts[r.discountCode] || 0) + 1; });
      setUsageByCode(counts);
    });
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

  const handleAddCode = async () => {
    if (!form.code.trim() || !form.partnerName.trim()) { alert("코드와 파트너명을 입력해주세요."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/partner/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { alert("코드 생성에 실패했습니다."); return; }
      setForm({ code: "", discountPercent: 10, partnerName: "", tierId: "free" });
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
          <a href="/admin/discount-codes" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "rgba(255,255,255,0.3)", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>🎟️ 할인코드</a>
          <a href="/admin/settlement" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>💰 정산 관리</a>
          <a href="/admin/top-sales" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>⭐ TOP 판매자</a>
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>🚪 로그아웃</button>
      </div>
      <div style={{ flex: 1, padding: "30px" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, marginBottom: "20px", color: "#333" }}>🎟️ 할인코드 관리</h1>

          {/* 코드 추가 폼 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
            <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="코드(예: SUMMER2024)" style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
            <input type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: Number(e.target.value) })} placeholder="할인율%" style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13, width: 90 }} />
            <input value={form.partnerName} onChange={e => setForm({ ...form, partnerName: e.target.value })} placeholder="파트너명" style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }} />
            <select value={form.tierId} onChange={e => setForm({ ...form, tierId: e.target.value })} style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
              {PARTNER_TIERS.map(t => <option key={t.id} value={t.id}>{t.name}({t.revenueSharePercent}%)</option>)}
            </select>
            <button onClick={handleAddCode} disabled={saving} style={{ padding: "8px 16px", background: "#667eea", color: "white", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{saving ? "추가중..." : "+ 코드 추가"}</button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>코드</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>할인율</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>파트너</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>등급</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>사용 횟수</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>상태</th>
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
                    <td style={{ padding: "12px", color: "#666" }}>{c.partnerName}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.tierId}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{usageByCode[c.code] || 0}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.active ? "활성" : "비활성"}</td>
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