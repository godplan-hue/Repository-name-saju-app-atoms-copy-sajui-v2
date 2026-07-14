"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PromoCode {
  code: string;
  discountPercent: number;
  note: string;
  active: boolean;
  usageCount: number;
  maxUses: number;
}

const MAX_USES_OPTIONS = [
  { label: "1회 (1번만)", value: 1 },
  { label: "3회", value: 3 },
  { label: "10회", value: 10 },
  { label: "33회", value: 33 },
  { label: "무제한", value: -1 },
];

const DISCOUNT_OPTIONS = [30, 50, 70, 100];

function maxUsesLabel(v: number) {
  if (v === -1) return "무제한";
  return `${v}회`;
}

export default function AdminDiscountCodes() {
  const router = useRouter();
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [form, setForm] = useState({ code: "", discountPercent: 100, note: "", maxUses: 1, fullAccess: false });
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
      setForm({ code: "", discountPercent: 100, note: "", maxUses: 1, fullAccess: false });
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
          <a href="/admin/direct-payments" style={{ display: "block", padding: "12px 15px", marginBottom: "10px", background: "transparent", borderRadius: "8px", color: "white", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>💳 일반회원 결제내역</a>
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
          <div style={{ background: "#f9f9f9", border: "1px solid #eee", borderRadius: 10, padding: "20px", marginBottom: 28 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: "#333", margin: "0 0 14px" }}>+ 새 코드 추가</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
              <input
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="코드 (예: FREE2026)"
                style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, minWidth: 160 }}
              />
              <input
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="메모 (누구에게 왜 줬는지)"
                style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, flex: 1, minWidth: 180 }}
              />
            </div>

            {/* 할인율 선택 */}
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#666", margin: "0 0 6px" }}>할인율</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {DISCOUNT_OPTIONS.map(pct => (
                  <button
                    key={pct}
                    onClick={() => setForm({ ...form, discountPercent: pct })}
                    style={{
                      padding: "6px 16px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      background: form.discountPercent === pct ? (pct === 100 ? "#22c55e" : "#667eea") : "#e5e7eb",
                      color: form.discountPercent === pct ? "white" : "#333",
                    }}
                  >
                    {pct === 100 ? "100% 무료" : `${pct}% 할인`}
                  </button>
                ))}
                <input
                  type="number"
                  value={form.discountPercent}
                  onChange={e => setForm({ ...form, discountPercent: Number(e.target.value) })}
                  min={1} max={100}
                  style={{ padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, width: 80 }}
                  placeholder="직접입력%"
                />
              </div>
            </div>

            {/* 사용 횟수 선택 */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#666", margin: "0 0 6px" }}>사용 횟수</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {MAX_USES_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, maxUses: opt.value })}
                    style={{
                      padding: "6px 16px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      background: form.maxUses === opt.value ? "#764ba2" : "#e5e7eb",
                      color: form.maxUses === opt.value ? "white" : "#333",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 전체 앱 열기 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#333" }}>
                <input
                  type="checkbox"
                  checked={form.fullAccess}
                  onChange={e => setForm({ ...form, fullAccess: e.target.checked })}
                  style={{ accentColor: "#22c55e", width: 16, height: 16 }}
                />
                전체 앱 열기 (꿈해몽·감정일기·다이어트·가계부·타로·펫운·맘케어 7개앱 30일)
              </label>
              {form.fullAccess && (
                <p style={{ fontSize: 11, color: "#16a34a", margin: "4px 0 0 24px" }}>
                  이 쿠폰 사용 시 사주 외 모든 앱이 자동으로 열립니다.
                </p>
              )}
            </div>

            <button
              onClick={handleAddCode}
              disabled={saving}
              style={{ padding: "9px 22px", background: saving ? "#ccc" : "#667eea", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer" }}
            >
              {saving ? "추가중..." : "+ 코드 추가"}
            </button>
          </div>

          {/* 목록 */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>코드</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>할인율</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>메모</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>사용</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>한도</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>상태</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "20px", textAlign: "center", color: "#999" }}>아직 등록된 할인코드가 없습니다.</td></tr>
              ) : (
                codes.map(c => (
                  <tr key={c.code} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px", color: "#333", fontWeight: 700 }}>{c.code}</td>
                    <td style={{ padding: "12px", color: c.discountPercent === 100 ? "#16a34a" : "#666", fontWeight: c.discountPercent === 100 ? 700 : 400 }}>{c.discountPercent}%</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.note || "-"}</td>
                    <td style={{ padding: "12px", color: "#666" }}>{c.usageCount || 0}회</td>
                    <td style={{ padding: "12px", color: "#666" }}>{maxUsesLabel(c.maxUses ?? 1)}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: c.active ? "#dcfce7" : "#fee2e2", color: c.active ? "#16a34a" : "#dc2626" }}>
                        {c.active ? "활성" : "소진"}
                      </span>
                    </td>
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
