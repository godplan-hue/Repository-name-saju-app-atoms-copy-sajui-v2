"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

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
  const [form, setForm] = useState({ code: "", discountPercent: 100, note: "", maxUses: 1, fullAccess: false, maxAmount: 990 });
  const [saving, setSaving] = useState(false);
  const [codeTab, setCodeTab] = useState<"mine"|"auto">("mine");
  const [couponPreview, setCouponPreview] = useState<{ code: string; discountPercent: number; note: string; maxUses: number; fullAccess: boolean; maxAmount: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const isAutoCode = (c: PromoCode) => c.code.startsWith("FREE") || c.code.startsWith("KAKAO") || c.note === "카카오공유무료쿠폰" || c.note === "SNS후기쿠폰(990원)" || c.note === "무료재물운쿠폰";

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
      setCouponPreview({ code: form.code.toUpperCase(), discountPercent: form.discountPercent, note: form.note, maxUses: form.maxUses, fullAccess: form.fullAccess, maxAmount: form.maxAmount });
      setForm({ code: "", discountPercent: 100, note: "", maxUses: 1, fullAccess: false, maxAmount: 990 });
      loadAll();
    } finally {
      setSaving(false);
    }
  };

  const filteredCodes = codes.filter(c => codeTab === "mine" ? !isAutoCode(c) : isAutoCode(c));

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

            {/* 적용 상품 */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#666", margin: "0 0 6px" }}>적용 상품 (어떤 결제에만 쓸 수 있나요?)</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { label: "990원 전용", value: 990 },
                  { label: "3,900원 이하", value: 3900 },
                  { label: "9,900원 이하", value: 9900 },
                  { label: "전체 상품", value: 0 },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, maxAmount: opt.value })}
                    style={{
                      padding: "6px 16px", borderRadius: 6, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      background: form.maxAmount === opt.value ? "#f59e0b" : "#e5e7eb",
                      color: form.maxAmount === opt.value ? "white" : "#333",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {form.maxAmount > 0 && (
                <p style={{ fontSize: 11, color: "#d97706", margin: "4px 0 0" }}>
                  ₩{form.maxAmount.toLocaleString()} 초과 상품엔 쿠폰 적용 안 됩니다.
                </p>
              )}
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
                전체 앱 열기 (감정일기·다이어트·가계부·육아일기(맘케어) 4개앱 30일)
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

          {/* 쿠폰 미리보기 */}
          {couponPreview && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#333", margin: 0 }}>🎉 쿠폰 생성 완료! — 스크린샷 찍어서 보내세요</p>
                <button onClick={() => setCouponPreview(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#999" }}>✕</button>
              </div>

              {/* 쿠폰 카드 */}
              <div style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                borderRadius: 20, padding: "2px", maxWidth: 480,
                boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
              }}>
                <div style={{
                  background: "#fff", borderRadius: 18, overflow: "hidden",
                  display: "flex", flexDirection: "column",
                }}>
                  {/* 상단 */}
                  <div style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
                    padding: "20px 24px", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, opacity: 0.85, letterSpacing: "0.1em" }}>JEOMUN.COM</p>
                      <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 900 }}>🔮 점운 할인 쿠폰</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontSize: 36, fontWeight: 900, lineHeight: 1 }}>
                        {couponPreview.discountPercent === 100 ? "FREE" : `${couponPreview.discountPercent}%`}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.85 }}>
                        {couponPreview.discountPercent === 100 ? "완전 무료" : "할인"}
                      </p>
                    </div>
                  </div>

                  {/* 점선 구분 */}
                  <div style={{ display: "flex", alignItems: "center", padding: "0 20px" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", flexShrink: 0, marginLeft: -30 }} />
                    <div style={{ flex: 1, borderTop: "2px dashed #e5e7eb", margin: "0 8px" }} />
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", flexShrink: 0, marginRight: -30 }} />
                  </div>

                  {/* 코드 영역 */}
                  <div style={{ padding: "20px 24px" }}>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 8px", fontWeight: 700, letterSpacing: "0.05em" }}>쿠폰 코드</p>
                    <div style={{
                      background: "linear-gradient(135deg, #f5f3ff, #fdf2f8)",
                      border: "2px dashed #c4b5fd",
                      borderRadius: 12, padding: "14px 20px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginBottom: 14,
                    }}>
                      <span style={{ fontSize: 26, fontWeight: 900, color: "#7c3aed", letterSpacing: "0.12em" }}>
                        {couponPreview.code}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(couponPreview.code);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        style={{
                          background: copied ? "#22c55e" : "#7c3aed",
                          color: "white", border: "none", borderRadius: 8,
                          padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        {copied ? "✓ 복사됨!" : "복사"}
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {couponPreview.note && (
                        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>📝 {couponPreview.note}</p>
                      )}
                      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
                        🔢 사용 횟수: {couponPreview.maxUses === -1 ? "무제한" : `${couponPreview.maxUses}회`}
                      </p>
                      {couponPreview.fullAccess && (
                        <p style={{ fontSize: 13, color: "#16a34a", margin: 0, fontWeight: 700 }}>
                          🌟 7개 앱 30일 전체 이용 포함
                        </p>
                      )}
                      <p style={{ fontSize: 13, color: "#f59e0b", margin: 0, fontWeight: 700 }}>
                        🛒 {couponPreview.maxAmount > 0 ? `₩${couponPreview.maxAmount.toLocaleString()} 이하 상품 전용` : "전체 상품 사용 가능"}
                      </p>
                      <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>
                        📍 사용처: jeomun.com/main-v2 → 결제 시 코드 입력
                      </p>
                    </div>
                  </div>

                  {/* 하단 */}
                  <div style={{ background: "#f9f9f9", padding: "12px 24px", borderTop: "1px solid #f3f4f6" }}>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, textAlign: "center" }}>
                      점운 AI 사주 · jeomun.com · 대한민국 AI 운세 플랫폼
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 탭 버튼 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setCodeTab("mine")}
              style={{ padding: "8px 18px", borderRadius: 20, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", background: codeTab === "mine" ? "#667eea" : "#e5e7eb", color: codeTab === "mine" ? "white" : "#333" }}
            >
              📝 내가 만든 쿠폰
            </button>
            <button
              onClick={() => setCodeTab("auto")}
              style={{ padding: "8px 18px", borderRadius: 20, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", background: codeTab === "auto" ? "#22c55e" : "#e5e7eb", color: codeTab === "auto" ? "white" : "#333" }}
            >
              🎁 자동·무료 쿠폰 (FREE·무료)
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
              {filteredCodes.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "20px", textAlign: "center", color: "#999" }}>등록된 코드가 없습니다.</td></tr>
              ) : (
                filteredCodes.map(c => (
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
