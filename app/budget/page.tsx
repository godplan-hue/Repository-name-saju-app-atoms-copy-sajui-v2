"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type EntryType = "expense" | "income";
type Entry = { id: string; date: string; type: EntryType; category: string; amount: number; memo: string; createdAt: number };

const CAT_EXPENSE = ["식비", "카페/음료", "교통", "주거/공과금", "쇼핑", "의료/건강", "교육", "여가/취미", "구독서비스", "기타"];
const CAT_INCOME = ["월급/급여", "부업/알바", "투자수익", "용돈", "기타수입"];
const CAT_EMOJI: Record<string, string> = {
  "식비": "🍚", "카페/음료": "☕", "교통": "🚌", "주거/공과금": "🏠", "쇼핑": "🛍️",
  "의료/건강": "💊", "교육": "📚", "여가/취미": "🎮", "구독서비스": "📱", "기타": "💳",
  "월급/급여": "💰", "부업/알바": "💼", "투자수익": "📈", "용돈": "🎁", "기타수입": "💵",
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => new Date().toISOString().slice(0, 7);

export default function BudgetPage() {
  const [view, setView] = useState<"list" | "add" | "chart">("list");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [mcUserId, setMcUserId] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  const [setupName, setSetupName] = useState("");
  const [setupPhone, setSetupPhone] = useState("");
  const [setupEmail, setSetupEmail] = useState("");
  const [currentMonth, setCurrentMonth] = useState(thisMonth());
  const [form, setForm] = useState<{ type: EntryType; date: string; category: string; amount: string; memo: string }>({
    type: "expense", date: todayStr(), category: "식비", amount: "", memo: "",
  });

  useEffect(() => {
    let uid = "";
    // 이미 셋업 완료한 유저 처리
    const alreadySetup = localStorage.getItem("budget_setup_done");
    try {
      const profile = localStorage.getItem("v2_saved_profile");
      if (profile) {
        const p = JSON.parse(profile);
        if (p.name) setSetupName(p.name);
        if (p.email) setSetupEmail(p.email);
        if (p.phone) {
          const clean = p.phone.replace(/\D/g, "");
          setSetupPhone(p.phone);
          uid = `phone_${clean}`;
          setHasPhone(true);
          if (alreadySetup) setSetupDone(true);
        }
      }
    } catch {}
    if (!uid) {
      setHasPhone(false);
      let devId = localStorage.getItem("budget_device_id");
      if (!devId) { devId = Date.now().toString(36) + Math.random().toString(36).slice(2); localStorage.setItem("budget_device_id", devId); }
      uid = `device_${devId}`;
    }
    setMcUserId(uid);

    const stored = localStorage.getItem("budget_entries");
    if (stored) setEntries(JSON.parse(stored));

    fetch(`/api/budget?userId=${uid}`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.data) && d.data.length > 0) {
          setEntries(d.data);
          localStorage.setItem("budget_entries", JSON.stringify(d.data));
        }
      })
      .catch(() => {});
  }, []);

  function saveBudgetSetup() {
    const cleanPhone = setupPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { alert("전화번호를 입력해주세요."); return; }
    try {
      const existing = localStorage.getItem("v2_saved_profile");
      const profile = existing ? JSON.parse(existing) : {};
      if (setupName) profile.name = setupName;
      profile.phone = setupPhone;
      if (setupEmail) profile.email = setupEmail;
      localStorage.setItem("v2_saved_profile", JSON.stringify(profile));
    } catch {}
    const uid = `phone_${cleanPhone}`;
    setMcUserId(uid);
    setHasPhone(true);
    localStorage.setItem("budget_setup_done", "1");
    // 무료DB 리드 저장
    fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "lead", userId: uid, name: setupName.trim() || "", phone: cleanPhone, email: setupEmail.trim() || "", createdAt: Date.now() }),
    }).catch(() => {});
    // Firebase에서 기존 데이터 로드
    fetch(`/api/budget?userId=${uid}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.data) && d.data.length > 0) { setEntries(d.data); localStorage.setItem("budget_entries", JSON.stringify(d.data)); } })
      .catch(() => {});
    setSetupDone(true);
  }

  function saveEntries(e: Entry[]) {
    setEntries(e);
    localStorage.setItem("budget_entries", JSON.stringify(e));
    if (mcUserId) {
      fetch("/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mcUserId, entries: e }),
      }).catch(() => {});
    }
  }

  function addEntry() {
    const amount = parseInt(form.amount.replace(/[^0-9]/g, ""));
    if (!amount) { alert("금액을 입력해주세요"); return; }
    const e: Entry = { id: Date.now().toString(), date: form.date, type: form.type, category: form.category, amount, memo: form.memo, createdAt: Date.now() };
    saveEntries([e, ...entries]);
    setForm(f => ({ ...f, amount: "", memo: "" }));
    setView("list");
  }

  function deleteEntry(id: string) { saveEntries(entries.filter(e => e.id !== id)); }

  function prevMonth() {
    setCurrentMonth(prev => {
      const d = new Date(prev + "-01");
      d.setMonth(d.getMonth() - 1);
      return d.toISOString().slice(0, 7);
    });
  }
  function nextMonth() {
    setCurrentMonth(prev => {
      const d = new Date(prev + "-01");
      d.setMonth(d.getMonth() + 1);
      return d.toISOString().slice(0, 7);
    });
  }

  const monthEntries = entries.filter(e => e.date.startsWith(currentMonth));
  const monthIncome = monthEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const monthExpense = monthEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const balance = monthIncome - monthExpense;

  const catBreakdown = monthEntries
    .filter(e => e.type === "expense")
    .reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>);

  // 날짜별 그룹핑
  const grouped = monthEntries.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {} as Record<string, Entry[]>);

  const cats = view === "add" ? (form.type === "expense" ? CAT_EXPENSE : CAT_INCOME) : [];

  if (!setupDone) {
    const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 14px", fontSize: 16, color: "white", outline: "none", boxSizing: "border-box" };
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
        <nav style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 20px" }}>
          <Link href="/" style={{ fontSize: 17, fontWeight: 900, color: "#fbbf24", textDecoration: "none" }}>점운 가계부</Link>
        </nav>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "48px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 60, marginBottom: 14 }}>💰</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>점운 가계부</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
              일기처럼 쓰는 수입·지출 기록<br />전화번호로 기록 영구 보관
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>이름 또는 별명 (선택)</label>
              <input type="text" value={setupName} onChange={e => setSetupName(e.target.value)} placeholder="예) 에스더" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>전화번호 * (영구 보관 필수)</label>
              <input type="tel" inputMode="tel" value={setupPhone} onChange={e => setSetupPhone(e.target.value)} placeholder="010-0000-0000" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>이메일 (선택)</label>
              <input type="email" inputMode="email" value={setupEmail} onChange={e => setSetupEmail(e.target.value)} placeholder="example@email.com" style={inp} />
            </div>
          </div>
          <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 24, fontSize: 12, color: "#fbbf24", lineHeight: 1.6 }}>
            ⚠️ 전화번호 필수 — 다른 기기에서 기록을 불러오려면 반드시 입력해주세요.
          </div>

          <button onClick={saveBudgetSetup} style={{ width: "100%", background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#0f172a", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
            가계부 시작하기 →
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(251,191,36,0.5)", marginTop: 12, lineHeight: 1.6, letterSpacing: "0.02em" }}>
            🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <nav style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: 17, fontWeight: 900, color: "#fbbf24", textDecoration: "none" }}>점운 가계부</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={prevMonth} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 10px", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 14 }}>‹</button>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", minWidth: 64, textAlign: "center" }}>{currentMonth}</span>
          <button onClick={nextMonth} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 10px", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 14 }}>›</button>
        </div>
      </nav>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 16px 110px" }}>

        {/* 전화번호 없음 안내 */}
        {!hasPhone && (
          <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            ⚠️ 전화번호 미등록 — 가계부가 이 기기에만 저장되고 영구 보관되지 않아요.<br />
            <a href="/main-v2" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>사주 앱에서 전화번호 등록하기 →</a>
          </div>
        )}

        {/* 크몽·탈잉 신뢰 뱃지 */}
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(251,191,36,0.45)", marginBottom: 16, lineHeight: 1.6, letterSpacing: "0.02em" }}>
          🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
        </p>

        {/* 이번 달 요약 */}
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: "18px", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "#4ade80" }}>수입</p>
              <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 900, color: "#4ade80" }}>+{monthIncome.toLocaleString()}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "#f87171" }}>지출</p>
              <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 900, color: "#f87171" }}>-{monthExpense.toLocaleString()}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: balance >= 0 ? "#fbbf24" : "#f87171" }}>잔액</p>
              <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 900, color: balance >= 0 ? "#fbbf24" : "#f87171" }}>{balance >= 0 ? "+" : ""}{balance.toLocaleString()}</p>
            </div>
          </div>
          {monthExpense > 0 && monthIncome > 0 && monthExpense > monthIncome * 0.85 && (
            <div style={{ marginTop: 12, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 10, padding: "8px 12px", fontSize: 12, color: "#fbbf24" }}>
              💰 이번 달 지출이 많네요 →{" "}
              <a href="/main-v2" style={{ color: "#fbbf24", textDecoration: "underline", fontWeight: 700 }}>재물운 확인해보기</a>
            </div>
          )}
        </div>

        {/* ── 내역 탭 ── */}
        {view === "list" && (
          <div>
            {Object.keys(grouped).length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.35)" }}>
                <div style={{ fontSize: 52, marginBottom: 8 }}>💳</div>
                <p style={{ margin: 0, fontSize: 14 }}>이번 달 내역이 없어요</p>
                <p style={{ margin: "6px 0 0", fontSize: 12 }}>+ 추가하기로 기록해보세요</p>
              </div>
            ) : (
              Object.entries(grouped)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([date, dayEntries]) => {
                  const dayExp = dayEntries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
                  const dayInc = dayEntries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
                  return (
                    <div key={date} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>{date}</span>
                        <span style={{ fontSize: 12 }}>
                          {dayInc > 0 && <span style={{ color: "#4ade80", marginRight: 8 }}>+{dayInc.toLocaleString()}</span>}
                          {dayExp > 0 && <span style={{ color: "#f87171" }}>-{dayExp.toLocaleString()}</span>}
                        </span>
                      </div>
                      {dayEntries.map(e => (
                        <div key={e.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: e.memo ? 4 : 0 }}>
                              <span style={{ fontSize: 16 }}>{CAT_EMOJI[e.category] || "💳"}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: e.type === "income" ? "#4ade80" : "#e5e7eb" }}>{e.category}</span>
                            </div>
                            {e.memo && <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.memo}</p>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 10 }}>
                            <span style={{ fontSize: 15, fontWeight: 900, color: e.type === "income" ? "#4ade80" : "#f87171" }}>
                              {e.type === "income" ? "+" : "-"}{e.amount.toLocaleString()}
                            </span>
                            <button onClick={() => deleteEntry(e.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 20, padding: 0, lineHeight: 1 }}>×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
            )}

            {/* 재물운 CTA */}
            <div style={{ marginTop: 24, background: "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(251,191,36,0.08))", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 16, padding: "18px", textAlign: "center" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: "#fbbf24", fontWeight: 700 }}>💰 재물운으로 돈 흐름 분석</p>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>사주로 올해 재물운의 흐름을 확인해보세요</p>
              <Link href="/main-v2" style={{ display: "inline-block", background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#0f172a", textDecoration: "none", borderRadius: 12, padding: "11px 24px", fontWeight: 900, fontSize: 13 }}>
                재물운 확인하기 →
              </Link>
            </div>
          </div>
        )}

        {/* ── 추가 탭 ── */}
        {view === "add" && (
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 18, padding: "20px 18px" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 900 }}>새 내역 추가</h3>

            {/* 수입/지출 토글 */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {(["expense", "income"] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t, category: t === "expense" ? "식비" : "월급/급여" }))}
                  style={{ flex: 1, background: form.type === t ? (t === "income" ? "#4ade80" : "#f87171") : "rgba(255,255,255,0.08)", color: form.type === t ? "#0f172a" : "rgba(255,255,255,0.65)", border: "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}>
                  {t === "income" ? "💚 수입" : "❤️ 지출"}
                </button>
              ))}
            </div>

            {/* 날짜 */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>날짜</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "white", outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* 카테고리 */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 8 }}>카테고리</label>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {cats.map(cat => (
                  <button key={cat} onClick={() => setForm(f => ({ ...f, category: cat }))}
                    style={{ padding: "7px 12px", background: form.category === cat ? (form.type === "income" ? "#4ade80" : "#f87171") : "rgba(255,255,255,0.08)", color: form.category === cat ? "#0f172a" : "rgba(255,255,255,0.7)", border: "none", borderRadius: 20, fontSize: 12, fontWeight: form.category === cat ? 700 : 400, cursor: "pointer" }}>
                    {CAT_EMOJI[cat] || ""} {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 금액 */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>금액 *</label>
              <div style={{ position: "relative" }}>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0" inputMode="numeric"
                  style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 44px 13px 14px", fontSize: 20, color: "white", fontWeight: 900, outline: "none", boxSizing: "border-box" }} />
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(255,255,255,0.45)" }}>원</span>
              </div>
            </div>

            {/* 메모 */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>메모 (선택)</label>
              <input value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
                placeholder="어디서 얼마나 썼나요?"
                style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "white", outline: "none", boxSizing: "border-box" }} />
            </div>

            <button onClick={addEntry}
              style={{ width: "100%", background: form.type === "income" ? "#4ade80" : "#f97316", color: "#0f172a", border: "none", borderRadius: 14, padding: "15px", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
              저장하기
            </button>
          </div>
        )}

        {/* ── 차트 탭 ── */}
        {view === "chart" && (
          <div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>{currentMonth} 카테고리별 지출 분석</p>
            {Object.keys(catBreakdown).length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.35)" }}>
                <p style={{ margin: 0, fontSize: 14 }}>이번 달 지출 내역이 없어요</p>
              </div>
            ) : (
              Object.entries(catBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, amt]) => {
                  const r = monthExpense > 0 ? Math.round((amt / monthExpense) * 100) : 0;
                  return (
                    <div key={cat} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13 }}>{CAT_EMOJI[cat] || "💳"} {cat}</span>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{amt.toLocaleString()}원 <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>({r}%)</span></span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 9 }}>
                        <div style={{ width: `${r}%`, height: "100%", background: "#f97316", borderRadius: 99 }} />
                      </div>
                    </div>
                  );
                })
            )}

            {/* 총 지출 요약 */}
            {monthExpense > 0 && (
              <div style={{ marginTop: 20, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>총 지출</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "#f87171" }}>{monthExpense.toLocaleString()}원</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>총 수입</span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "#4ade80" }}>{monthIncome.toLocaleString()}원</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>잔액</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: balance >= 0 ? "#fbbf24" : "#f87171" }}>{balance >= 0 ? "+" : ""}{balance.toLocaleString()}원</span>
                </div>
              </div>
            )}

            <div style={{ marginTop: 20, background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(251,191,36,0.06))", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16, padding: "16px", textAlign: "center" }}>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#fbbf24" }}>💰 재물운으로 돈 흐름 분석하기</p>
              <Link href="/main-v2" style={{ display: "inline-block", background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#0f172a", textDecoration: "none", borderRadius: 12, padding: "10px 22px", fontWeight: 900, fontSize: 13 }}>
                990원으로 재물운 보기 →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 하단 탭바 */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex" }}>
        {([
          { key: "list", label: "내역", emoji: "📋" },
          { key: "add", label: "+ 추가", emoji: "➕" },
          { key: "chart", label: "분석", emoji: "📊" },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)}
            style={{ flex: 1, background: tab.key === "add" ? "rgba(251,191,36,0.08)" : "none", border: "none", color: view === tab.key ? "#fbbf24" : "rgba(255,255,255,0.45)", cursor: "pointer", padding: "12px 0 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 10, fontWeight: view === tab.key ? 900 : 400 }}>
            <span style={{ fontSize: 22 }}>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
