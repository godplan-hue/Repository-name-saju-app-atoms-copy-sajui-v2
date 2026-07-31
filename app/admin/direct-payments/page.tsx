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
  sources?: string[];
  code?: string;
  used?: boolean;
  marketing?: boolean;
  createdAt: number;
}

const SOURCE_CFG: Record<string, [string, string, string]> = {
  jigun:      ["#ede9fe","#6d28d9","💼직운"],
  resume:     ["#dbeafe","#1d4ed8","📄합격자소서"],
  mbti:       ["#f3e8ff","#7c3aed","🔮MBTI"],
  lotto:      ["#fef3c7","#d97706","🎱행운번호"],
  gunghap:    ["#fce7f3","#be185d","💞궁합"],
  petun:      ["#ecfeff","#0e7490","🐾펫운"],
  tarot:      ["#ede9fe","#4c1d95","🃏타로"],
  zodiac:     ["#dbeafe","#1e40af","⭐별자리"],
  gamjung:    ["#d1fae5","#065f46","😊감정일기"],
  diet:       ["#dcfce7","#15803d","🥗다이어트"],
  budget:     ["#fef3c7","#92400e","💰가계부"],
  momcare:    ["#e0f2fe","#0369a1","👶맘케어"],
  "toss-mbti":    ["#e0eaff","#0064FF","🟦토스MBTI"],
  "toss-diet":    ["#dcfce7","#15803d","🥗토스다이어트"],
  "toss-daewoon": ["#dbeafe","#1d4ed8","🌊토스대운"],
  "toss-taegil":  ["#ede9fe","#5b21b6","📅토스택일"],
  "toss-fortune": ["#fef9c3","#a16207","☀️토스오늘운세"],
  "toss-gamjung": ["#d1fae5","#065f46","😊토스감정일기"],
  "toss-haemong": ["#fdf4ff","#7e22ce","🌙토스꿈해몽"],
  "toss-momcare": ["#ffe4e6","#be123c","👶토스맘케어"],
  "toss-budget":  ["#fef3c7","#78350f","💰토스가계부"],
  "toss-saju":   ["#e9d5ff","#7c3aed","🔮토스사주"],
  "toss-tarot":  ["#ede9fe","#4c1d95","🃏토스타로"],
  "toss-zodiac": ["#dbeafe","#1e40af","⭐토스별자리"],
  "toss-gunghap":["#fce7f3","#be185d","💞토스궁합"],
  "toss-petun":  ["#ecfeff","#0e7490","🐾토스펫운"],
  "toss-jigun":  ["#ede9fe","#6d28d9","💼토스직운"],
  "toss-resume": ["#dbeafe","#1d4ed8","📄토스합격"],
  haemong:    ["#fce7f3","#be185d","🌙꿈해몽"],
  free:       ["#fef3c7","#92400e","🎁재물운"],
};
function SourceBadge({ source }: { source: string }) {
  const [bg, color, label] = SOURCE_CFG[source] ?? ["#f3f4f6","#374151",source];
  return <span style={{ background: bg, color, padding: "2px 7px", borderRadius: 6, fontSize: 11, fontWeight: 700, marginRight: 3, display: "inline-block" }}>{label}</span>;
}

interface Payment {
  id: string;
  date: string;
  name: string;
  phone: string;
  amount: number;
  package: string;
  categories: string[];
  plan: string;
  discountCode?: string;
  discountPercent?: number;
  originalAmount?: number;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

const NAV_LINKS = [
  { href: "/admin", label: "📊 대시보드" },
  { href: "/admin/partners", label: "👥 파트너 관리" },
  { href: "/admin/partner-customers", label: "📁 파트너 고객 DB" },
  { href: "/admin/customers", label: "👤 일반회원 DB" },
  { href: "/admin/direct-payments", label: "💳 일반회원 결제내역" },
  { href: "/admin/discount-codes", label: "🎟️ 할인코드" },
  { href: "/admin/top-sales", label: "⭐ TOP 판매자" },
];

export default function AdminDirectPayments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"payments" | "leads" | "sns">("payments");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [snsPending, setSnsPending] = useState<{phone: string; postUrl: string; createdAt: number}[]>([]);
  const [snsLoading, setSnsLoading] = useState(false);
  const [approvedCodes, setApprovedCodes] = useState<{phone: string; codes: string[]} | null>(null);

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (!adminId) { router.push("/admin/login"); return; }
    fetch("/api/admin/direct-payments", { headers: { "x-admin-id": adminId } })
      .then(r => r.json())
      .then(data => {
        setPayments(data.payments || []);
        setTotalRevenue(data.totalRevenue || 0);
        setMonthlyRevenue(data.monthlyRevenue || 0);
        setCount(data.count || 0);
      })
      .finally(() => setLoading(false));
    fetch("/api/admin/free-leads", { headers: { "x-admin-id": adminId } })
      .then(r => r.json())
      .then(data => setLeads(data.leads || []))
      .catch(() => {});
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    router.push("/admin/login");
  };

  const filtered = search.trim()
    ? payments.filter(p => p.name.includes(search) || p.phone.includes(search) || p.package.includes(search))
    : payments;

  const handleDeleteAllLeads = async () => {
    if (!confirm("무료DB 전체 삭제할까요?\n재물운무료·직운·합격자소서 데이터가 모두 지워집니다.")) return;
    const adminId = localStorage.getItem("adminId");
    await fetch("/api/admin/free-leads", {
      method: "DELETE",
      headers: { "x-admin-id": adminId || "" },
    });
    setLeads([]);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 결제 기록을 삭제할까요?`)) return;
    const adminId = localStorage.getItem("adminId");
    await fetch("/api/admin/direct-payments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-id": adminId || "" },
      body: JSON.stringify({ id }),
    });
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo', sans-serif", display: "flex" }}>
      {/* 사이드바 */}
      <div style={{ width: 250, background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 20px", color: "white", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 0, marginBottom: 30 }}>👑 점운</h1>
        <div style={{ flex: 1 }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{ display: "block", padding: "12px 15px", marginBottom: 10, background: l.href === "/admin/direct-payments" ? "rgba(255,255,255,0.3)" : "transparent", borderRadius: 8, color: "white", textDecoration: "none", fontWeight: l.href === "/admin/direct-payments" ? 700 : 500, fontSize: 14 }}>
              {l.label}
            </a>
          ))}
        </div>
        <button onClick={handleLogout} style={{ padding: "12px 15px", background: "rgba(255,255,255,0.2)", color: "white", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>🚪 로그아웃</button>
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, padding: 30, overflowX: "auto" }}>
        <div style={{ background: "white", padding: 30, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          {/* 탭 */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <button onClick={() => setTab("payments")} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: tab === "payments" ? "linear-gradient(135deg,#667eea,#764ba2)" : "#f3f4f6", color: tab === "payments" ? "white" : "#6b7280", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>💳 결제내역</button>
            <button onClick={() => setTab("leads")} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: tab === "leads" ? "linear-gradient(135deg,#ec4899,#8b5cf6)" : "#f3f4f6", color: tab === "leads" ? "white" : "#6b7280", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>🎁 무료DB ({leads.length}명)</button>
            <button onClick={() => {
              setTab("sns");
              setSnsLoading(true);
              fetch("/api/admin/sns-pending").then(r => r.json()).then(d => { setSnsPending(d.list || []); setSnsLoading(false); }).catch(() => setSnsLoading(false));
            }} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: tab === "sns" ? "linear-gradient(135deg,#f59e0b,#ec4899)" : "#f3f4f6", color: tab === "sns" ? "white" : "#6b7280", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>📸 SNS후기신청 {snsPending.length > 0 ? `(${snsPending.length})` : ""}</button>
          </div>

          {tab === "payments" && <>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px", color: "#333" }}>💳 일반회원 결제내역</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px" }}>jeomun.com 직접 결제 고객 기록 (파트너 제외)</p>

          {/* 요약 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: 20, borderRadius: 12, color: "white" }}>
              <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 6 }}>전체 결제 건수</div>
              <div style={{ fontSize: 32, fontWeight: 900 }}>{count}건</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)", padding: 20, borderRadius: 12, color: "white" }}>
              <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 6 }}>이번달 매출</div>
              <div style={{ fontSize: 32, fontWeight: 900 }}>₩{monthlyRevenue.toLocaleString()}</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", padding: 20, borderRadius: 12, color: "white" }}>
              <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 6 }}>누적 매출</div>
              <div style={{ fontSize: 32, fontWeight: 900 }}>₩{totalRevenue.toLocaleString()}</div>
            </div>
          </div>

          {/* 검색 */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="이름 · 전화번호 · 상품명 검색"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none" }}
          />

          {loading ? (
            <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>불러오는 중...</p>
          ) : filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
              {count === 0 ? "아직 결제 기록이 없어요. 첫 결제 후 자동으로 쌓입니다." : "검색 결과가 없어요."}
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                  {["결제일시", "이름", "전화번호", "상품", "플랜", "결제금액", "쿠폰", "삭제"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 900, color: "#374151", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "10px 12px", color: "#6b7280", whiteSpace: "nowrap" }}>{fmtDate(p.date)}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#111" }}>{p.name}</td>
                    <td style={{ padding: "10px 12px", color: "#6b7280" }}>{p.phone || "—"}</td>
                    <td style={{ padding: "10px 12px", color: "#374151" }}>{p.package}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 11, background: p.plan === "package" ? "#fef3c7" : "#ede9fe", color: p.plan === "package" ? "#92400e" : "#6d28d9", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>
                        {p.plan === "package" ? "📦 패키지" : "💎 개별"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 900, color: "#059669" }}>
                      {p.discountPercent ? (
                        <span>
                          <span style={{ textDecoration: "line-through", color: "#9ca3af", fontWeight: 400, fontSize: 11 }}>₩{(p.originalAmount || p.amount).toLocaleString()}</span>
                          {" "}₩{p.amount.toLocaleString()}
                        </span>
                      ) : `₩${p.amount.toLocaleString()}`}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      {p.discountCode ? (
                        <span style={{ fontSize: 11, background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>
                          🎟 {p.discountCode} ({p.discountPercent}%)
                        </span>
                      ) : <span style={{ color: "#d1d5db" }}>—</span>}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button onClick={() => handleDelete(p.id, p.name)} style={{ padding: "4px 10px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </>}

          {tab === "leads" && <>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px", color: "#333" }}>🎁 무료DB</h1>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px" }}>재물운무료 · 직운 · 합격자소서 전체 무료 신청 고객 목록</p>
            {/* 소스별 필터 */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {([
                { key: "all",    label: "전체",       emoji: "📋", activeBg: "#374151", inactiveBg: "#f3f4f6", activeText: "white", inactiveText: "#374151" },
                { key: "free",   label: "재물운무료",  emoji: "🎁", activeBg: "#f59e0b", inactiveBg: "#fef3c7", activeText: "white", inactiveText: "#92400e" },
                { key: "jigun",  label: "직운",       emoji: "💼", activeBg: "#7c3aed", inactiveBg: "#ede9fe", activeText: "white", inactiveText: "#6d28d9" },
                { key: "resume", label: "합격자소서",  emoji: "📄", activeBg: "#2563eb", inactiveBg: "#dbeafe", activeText: "white", inactiveText: "#1d4ed8" },
                { key: "mbti",    label: "MBTI",    emoji: "🔮", activeBg: "#a855f7", inactiveBg: "#f3e8ff", activeText: "white", inactiveText: "#7c3aed" },
                { key: "lotto",   label: "행운번호", emoji: "🎱", activeBg: "#d97706", inactiveBg: "#fef3c7", activeText: "white", inactiveText: "#92400e" },
                { key: "gunghap", label: "궁합",     emoji: "💞", activeBg: "#ec4899", inactiveBg: "#fce7f3", activeText: "white", inactiveText: "#be185d" },
                { key: "petun",   label: "펫운",     emoji: "🐾", activeBg: "#06b6d4", inactiveBg: "#ecfeff", activeText: "white", inactiveText: "#0e7490" },
                { key: "tarot",   label: "타로",     emoji: "🃏", activeBg: "#6d28d9", inactiveBg: "#ede9fe", activeText: "white", inactiveText: "#4c1d95" },
                { key: "zodiac",  label: "별자리",   emoji: "⭐", activeBg: "#1d4ed8", inactiveBg: "#dbeafe", activeText: "white", inactiveText: "#1e40af" },
                { key: "gamjung", label: "감정일기", emoji: "😊", activeBg: "#059669", inactiveBg: "#d1fae5", activeText: "white", inactiveText: "#065f46" },
                { key: "diet",    label: "다이어트", emoji: "🥗", activeBg: "#16a34a", inactiveBg: "#dcfce7", activeText: "white", inactiveText: "#15803d" },
                { key: "budget",   label: "가계부",    emoji: "💰", activeBg: "#b45309", inactiveBg: "#fef3c7", activeText: "white", inactiveText: "#92400e" },
                { key: "momcare",      label: "맘케어",       emoji: "👶", activeBg: "#0369a1", inactiveBg: "#e0f2fe", activeText: "white", inactiveText: "#0369a1" },
                { key: "toss-mbti",    label: "토스MBTI",    emoji: "🟦", activeBg: "#0064FF", inactiveBg: "#e0eaff", activeText: "white", inactiveText: "#0064FF" },
                { key: "toss-diet",    label: "토스다이어트", emoji: "🥗", activeBg: "#15803d", inactiveBg: "#dcfce7", activeText: "white", inactiveText: "#15803d" },
                { key: "toss-daewoon", label: "토스대운",     emoji: "🌊", activeBg: "#1d4ed8", inactiveBg: "#dbeafe", activeText: "white", inactiveText: "#1d4ed8" },
                { key: "toss-taegil",  label: "토스택일",     emoji: "📅", activeBg: "#5b21b6", inactiveBg: "#ede9fe", activeText: "white", inactiveText: "#5b21b6" },
                { key: "toss-fortune", label: "토스오늘운세",  emoji: "☀️", activeBg: "#a16207", inactiveBg: "#fef9c3", activeText: "white", inactiveText: "#a16207" },
                { key: "toss-gamjung", label: "토스감정일기",  emoji: "😊", activeBg: "#065f46", inactiveBg: "#d1fae5", activeText: "white", inactiveText: "#065f46" },
                { key: "toss-haemong", label: "토스꿈해몽",   emoji: "🌙", activeBg: "#7e22ce", inactiveBg: "#fdf4ff", activeText: "white", inactiveText: "#7e22ce" },
                { key: "toss-momcare", label: "토스맘케어",   emoji: "👶", activeBg: "#be123c", inactiveBg: "#ffe4e6", activeText: "white", inactiveText: "#be123c" },
                { key: "toss-budget",  label: "토스가계부",   emoji: "💰", activeBg: "#78350f", inactiveBg: "#fef3c7", activeText: "white", inactiveText: "#78350f" },
                { key: "toss-saju",   label: "토스사주",     emoji: "🔮", activeBg: "#7c3aed", inactiveBg: "#e9d5ff", activeText: "white", inactiveText: "#7c3aed" },
                { key: "toss-tarot",  label: "토스타로",     emoji: "🃏", activeBg: "#4c1d95", inactiveBg: "#ede9fe", activeText: "white", inactiveText: "#4c1d95" },
                { key: "toss-zodiac", label: "토스별자리",   emoji: "⭐", activeBg: "#1e40af", inactiveBg: "#dbeafe", activeText: "white", inactiveText: "#1e40af" },
                { key: "toss-gunghap",label: "토스궁합",     emoji: "💞", activeBg: "#be185d", inactiveBg: "#fce7f3", activeText: "white", inactiveText: "#be185d" },
                { key: "toss-petun",  label: "토스펫운",     emoji: "🐾", activeBg: "#0e7490", inactiveBg: "#ecfeff", activeText: "white", inactiveText: "#0e7490" },
                { key: "toss-jigun",  label: "토스직운",     emoji: "💼", activeBg: "#6d28d9", inactiveBg: "#ede9fe", activeText: "white", inactiveText: "#6d28d9" },
                { key: "toss-resume", label: "토스합격",     emoji: "📄", activeBg: "#1d4ed8", inactiveBg: "#dbeafe", activeText: "white", inactiveText: "#1d4ed8" },
                { key: "haemong",      label: "꿈해몽",       emoji: "🌙", activeBg: "#be185d", inactiveBg: "#fce7f3", activeText: "white", inactiveText: "#be185d" },
              ]).map(f => {
                const cnt = f.key === "all" ? leads.length : leads.filter(l => (l.sources ?? [l.source ?? "free"]).includes(f.key)).length;
                const active = sourceFilter === f.key;
                return (
                  <button key={f.key} onClick={() => setSourceFilter(f.key)}
                    style={{ padding: "8px 16px", background: active ? f.activeBg : f.inactiveBg, color: active ? f.activeText : f.inactiveText, border: "none", borderRadius: 20, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {f.emoji} {f.label} ({cnt}명)
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <button onClick={handleDeleteAllLeads} style={{ padding: "8px 18px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 20, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                🗑️ 전체 삭제
              </button>
            </div>
            {leads.length === 0 ? (
              <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>아직 신청 데이터가 없어요.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    {["이름", "전화번호", "이메일", "출처", "마케팅", "생년", "쿠폰코드", "사용여부", "신청일"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 900, color: "#374151" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.filter(l => sourceFilter === "all" || (l.sources ?? [l.source ?? "free"]).includes(sourceFilter)).map((lead, i) => (
                    <tr key={lead.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: "#111" }}>{lead.name || <span style={{color:"#aaa",fontWeight:400}}>—</span>}</td>
                      <td style={{ padding: "10px 12px", color: "#374151" }}>{lead.phone || "-"}</td>
                      <td style={{ padding: "10px 12px", color: "#6b7280" }}>{lead.email || "-"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {(lead.sources ?? [lead.source ?? "free"]).map(s => <SourceBadge key={s} source={s} />)}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {lead.marketing === true
                          ? <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>✅ 동의</span>
                          : <span style={{ color: "#d1d5db" }}>—</span>}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#6b7280" }}>{lead.birthYear ? `${lead.birthYear}년` : "-"}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {lead.code
                          ? <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 6, fontWeight: 700, letterSpacing: 1 }}>{lead.code}</span>
                          : <span style={{ color: "#d1d5db" }}>—</span>}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        {lead.code
                          ? <span style={{ background: lead.used ? "#dcfce7" : "#fee2e2", color: lead.used ? "#166534" : "#991b1b", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{lead.used ? "사용됨" : "미사용"}</span>
                          : <span style={{ color: "#d1d5db" }}>—</span>}
                      </td>
                      <td style={{ padding: "10px 12px", color: "#9ca3af", fontSize: 12 }}>
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("ko-KR") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>}

          {/* SNS 후기 신청 탭 */}
          {tab === "sns" && <>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 6px", color: "#333" }}>📸 SNS 후기 신청 목록</h1>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>링크 확인 후 승인하면 쿠폰 10장이 자동 생성돼요</p>

            {snsLoading && <p style={{ color: "#888" }}>불러오는 중...</p>}

            {approvedCodes && (
              <div style={{ background: "#f0fdf4", border: "2px solid #16a34a", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <p style={{ fontWeight: 900, color: "#16a34a", margin: "0 0 8px" }}>✅ {approvedCodes.phone} 승인 완료! 카카오로 전송하세요</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {approvedCodes.codes.map(c => (
                    <span key={c} style={{ background: "#dcfce7", border: "1px solid #16a34a", borderRadius: 8, padding: "4px 10px", fontWeight: 900, letterSpacing: 1, fontSize: 14 }}>{c}</span>
                  ))}
                </div>
                <button onClick={() => { navigator.clipboard.writeText(approvedCodes.codes.join("\n")); }} style={{ marginTop: 10, padding: "8px 16px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 900, cursor: "pointer" }}>📋 코드 전체 복사</button>
              </div>
            )}

            {!snsLoading && snsPending.length === 0 && <p style={{ color: "#888" }}>신청 내역이 없어요.</p>}

            {snsPending.map(item => (
              <div key={item.phone} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 900, color: "#333", margin: "0 0 4px" }}>📱 {item.phone}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px" }}>신청일: {new Date(item.createdAt).toLocaleString("ko-KR")}</p>
                    <a href={item.postUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#7c3aed", wordBreak: "break-all" }}>🔗 {item.postUrl}</a>
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm(`${item.phone} 승인하고 쿠폰 10장 발급할까요?`)) return;
                      const res = await fetch("/api/share-coupon/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: item.phone }) });
                      const data = await res.json();
                      if (data.codes) {
                        setApprovedCodes({ phone: item.phone, codes: data.codes });
                        setSnsPending(prev => prev.filter(p => p.phone !== item.phone));
                      } else {
                        alert(data.error || "승인 실패");
                      }
                    }}
                    style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "#fff", fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" }}
                  >✅ 승인 + 쿠폰 발급</button>
                </div>
              </div>
            ))}
          </>}
        </div>
      </div>
    </main>
  );
}
