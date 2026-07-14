"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FOODS, OH_DIET, getOhFromYear, type Food } from "@/lib/foodDb";

type Meal = { id: string; name: string; cal: number; unit: string; time: string };
type DayLog = { meals: Meal[]; totalCal: number; updatedAt?: number };

const today = () => new Date().toISOString().slice(0, 10);

export default function DietPage() {
  const [view, setView] = useState<"today" | "search" | "history">("today");
  const [setupDone, setSetupDone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem("v2_saved_profile");
      if (saved) { const p = JSON.parse(saved); if (p.birthYear) return true; }
    } catch {}
    return false;
  });
  const [birthYear, setBirthYear] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const [mcUserId, setMcUserId] = useState("");
  const [dietLocked, setDietLocked] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [historyData, setHistoryData] = useState<Record<string, DayLog>>({});
  const [searchQ, setSearchQ] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");

  useEffect(() => {
    // 30일 이용권 잠금 체크
    try {
      const until = Number(localStorage.getItem("diet_unlock_until") || 0);
      if (!until || until < Date.now()) setDietLocked(true);
    } catch {}
    // 기존 사주 프로필에서 생년월일·전화번호 자동 로드
    let uid = "";
    let yr = "";
    let ph = "";
    try {
      const saved = localStorage.getItem("v2_saved_profile");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.birthYear) yr = String(p.birthYear);
        if (p.name) setName(p.name);
        if (p.email) setEmail(p.email);
        if (p.phone) { ph = p.phone; setHasPhone(true); uid = `phone_${p.phone.replace(/\D/g, "")}`; }
      }
    } catch {}
    if (!uid) {
      setHasPhone(false);
      let devId = localStorage.getItem("diet_device_id");
      if (!devId) { devId = Date.now().toString(36) + Math.random().toString(36).slice(2); localStorage.setItem("diet_device_id", devId); }
      uid = `device_${devId}`;
    }
    setMcUserId(uid);
    setBirthYear(yr);
    setPhone(ph);
    if (yr) setSetupDone(true);

    // localStorage에서 오늘 기록 로드
    const todayKey = today();
    const stored = localStorage.getItem(`diet_meals_${todayKey}`);
    if (stored) setMeals(JSON.parse(stored));

    // Firebase 동기화
    if (uid) {
      fetch(`/api/diet?userId=${uid}`)
        .then(r => r.json())
        .then(d => {
          if (d.data && typeof d.data === "object") {
            setHistoryData(d.data);
            if (d.data[todayKey]?.meals) {
              setMeals(d.data[todayKey].meals);
              localStorage.setItem(`diet_meals_${todayKey}`, JSON.stringify(d.data[todayKey].meals));
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  function saveToday(m: Meal[]) {
    const todayKey = today();
    const totalCal = m.reduce((s, x) => s + x.cal, 0);
    setMeals(m);
    setHistoryData(prev => ({ ...prev, [todayKey]: { meals: m, totalCal } }));
    localStorage.setItem(`diet_meals_${todayKey}`, JSON.stringify(m));
    if (mcUserId) {
      fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: mcUserId, date: todayKey, meals: m, totalCal }),
      }).catch(() => {});
    }
  }

  function addMeal(food: Pick<Food, "name" | "cal" | "unit">) {
    const m: Meal = {
      id: Date.now().toString(),
      name: food.name, cal: food.cal, unit: food.unit,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    saveToday([...meals, m]);
    setView("today");
    setSearchQ("");
  }

  function addCustom() {
    const cal = parseInt(customCal);
    if (!customName || !cal) return;
    addMeal({ name: customName, cal, unit: "직접 입력" });
    setCustomName(""); setCustomCal("");
  }

  function removeMeal(id: string) { saveToday(meals.filter(m => m.id !== id)); }

  function saveSetup() {
    const yr = parseInt(birthYear);
    if (!yr || yr < 1940 || yr > 2015) { alert("올바른 출생연도를 입력해주세요 (1940~2015)"); return; }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { alert("전화번호를 입력해주세요."); return; }
    try {
      const existing = localStorage.getItem("v2_saved_profile");
      const profile = existing ? JSON.parse(existing) : {};
      profile.birthYear = yr;
      if (name) profile.name = name;
      if (phone) profile.phone = phone;
      if (email) profile.email = email;
      localStorage.setItem("v2_saved_profile", JSON.stringify(profile));
    } catch {}
    const uid = `phone_${cleanPhone}`;
    setMcUserId(uid);
    setHasPhone(true);
    setSetupDone(true);
  }

  const yr = parseInt(birthYear) || 1990;
  const oh = getOhFromYear(yr);
  const ohData = OH_DIET[oh];
  const target = ohData?.kcal || 1700;
  const totalCal = meals.reduce((s, m) => s + m.cal, 0);
  const ratio = Math.min(100, Math.round((totalCal / target) * 100));

  const searchResults: Food[] = searchQ.length >= 1
    ? FOODS.filter(f => f.name.includes(searchQ) || f.cat.includes(searchQ)).slice(0, 30)
    : [];

  // 잠금 화면 (미결제 또는 만료)
  if (dietLocked) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#111827,#0f172a)", color: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.4 }}>사주 990원 결제 후<br />다이어트 30일 이용해요</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: "0 0 28px" }}>
          사주 결제 1회로<br />감정일기·다이어트·가계부·타로·펫운 5개 앱 30일 이용
        </p>
        <a href="/main-v2/pay?amount=990" style={{ display: "inline-block", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", fontSize: 15, fontWeight: 900, padding: "15px 36px", borderRadius: 26, textDecoration: "none" }}>
          사주 990원으로 30일 이용 →
        </a>
        <a href="/main-v2" style={{ display: "block", marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>← 점운 홈으로</a>
      </div>
    );
  }

  // 셋업 화면
  if (!setupDone) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#111827,#0f172a)", color: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
        <nav style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "14px 20px" }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 900, color: "#a5b4fc", textDecoration: "none" }}>점운 다이어트</Link>
        </nav>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "48px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 64, marginBottom: 14 }}>🥗</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>점운 다이어트</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
              오행 체질에 맞는 맞춤 칼로리 관리<br />바코드·AI 없이 빠른 칼로리 기록
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px", marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>이름 또는 별명 (선택)</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="예) 에스더"
              style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontSize: 16, color: "white", outline: "none", boxSizing: "border-box" as const }}
            />
          </div>

          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px", marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>전화번호 * (기록 영구보관 필수)</label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontSize: 16, color: "white", outline: "none", boxSizing: "border-box" as const }}
            />
          </div>

          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px", marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>이메일 (선택)</label>
            <input
              type="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontSize: 16, color: "white", outline: "none", boxSizing: "border-box" as const }}
            />
          </div>

          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px", marginBottom: 8 }}>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>출생연도 * (오행 체질 분석용)</label>
            <input
              type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)}
              placeholder="예: 1992" min="1940" max="2015"
              style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontSize: 18, color: "white", fontWeight: 700, outline: "none", boxSizing: "border-box" as const }}
            />
          </div>
          <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 24, fontSize: 12, color: "#fbbf24", lineHeight: 1.6 }}>
            ⚠️ 전화번호 필수 — 입력하지 않으면 다른 기기에서 기록을 불러올 수 없어요.
          </div>

          <button onClick={saveSetup} style={{ width: "100%", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
            오행 체질 분석 시작 →
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(74,222,128,0.5)", marginTop: 12, lineHeight: 1.6, letterSpacing: "0.02em" }}>
            🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: ohData.bg, color: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <nav style={{ background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: 17, fontWeight: 900, color: ohData.color, textDecoration: "none" }}>점운 다이어트</Link>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{today()}</span>
      </nav>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "20px 16px 110px" }}>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 14, lineHeight: 1.6 }}>
          🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
        </p>

        {/* 전화번호 없음 안내 */}
        {!hasPhone && (
          <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            ⚠️ 전화번호 미등록 — 기록이 이 기기에만 저장돼요.<br />
            <a href="/main-v2" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>사주 앱에서 전화번호 등록하기 →</a>
          </div>
        )}

        {/* 오행 체질 뱃지 */}
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 18px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>내 오행 체질</p>
            <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 900, color: ohData.color }}>{ohData.emoji} {ohData.label} — {ohData.type}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>일일 권장</p>
            <p style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 900, color: ohData.color }}>{ohData.kcal.toLocaleString()} kcal</p>
          </div>
        </div>

        {/* ── 오늘 탭 ── */}
        {view === "today" && (
          <>
            {/* 칼로리 진행 */}
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: "20px 18px", marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>오늘 섭취 칼로리</span>
                <span style={{ fontSize: 15, fontWeight: 900, color: ratio >= 100 ? "#f87171" : ohData.color }}>
                  {totalCal.toLocaleString()} / {target.toLocaleString()} kcal
                </span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 12, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ width: `${ratio}%`, height: "100%", background: ratio >= 100 ? "#f87171" : ohData.color, borderRadius: 99, transition: "width 0.4s ease" }} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                {ratio < 80 ? `${(target - totalCal).toLocaleString()} kcal 더 섭취 가능해요` :
                 ratio < 100 ? `목표까지 ${(target - totalCal).toLocaleString()} kcal 남았어요 💪` :
                 `목표 초과 +${(totalCal - target).toLocaleString()} kcal ⚠️`}
              </p>
            </div>

            {/* 오늘 음식 목록 */}
            <div style={{ marginBottom: 16 }}>
              {meals.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.35)" }}>
                  <div style={{ fontSize: 52, marginBottom: 8 }}>🍽️</div>
                  <p style={{ margin: 0, fontSize: 14 }}>아직 기록한 음식이 없어요</p>
                </div>
              ) : meals.map(m => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 4px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{m.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{m.unit} · {m.time}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: ohData.color }}>{m.cal.toLocaleString()} kcal</span>
                    <button onClick={() => removeMeal(m.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setView("search")} style={{ width: "100%", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", border: "none", borderRadius: 16, padding: "16px", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
              + 음식 추가하기
            </button>
            <button onClick={() => {
              const text = `🥗 오늘 내 다이어트 기록\n${today()} — ${totalCal.toLocaleString()} kcal / ${target.toLocaleString()} kcal\n${meals.slice(0,4).map(m=>`• ${m.name} ${m.cal}kcal`).join("\n")}\n\n내 오행 체질로 맞춤 다이어트 👉 jeomun.com/diet`;
              if (navigator.share) {
                navigator.share({ title: "점운 다이어트", text }).catch(() => {});
              } else {
                navigator.clipboard.writeText(text).then(() => alert("복사됐어요! 원하는 곳에 붙여넣기 하세요.")).catch(() => {});
              }
            }} style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", borderRadius: 16, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
              📤 오늘 기록 공유하기
            </button>

            {/* 오행 맞춤 식단 팁 */}
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{ohData.emoji} {ohData.label} 맞춤 식단 가이드</p>
              <p style={{ margin: "0 0 6px", fontSize: 13, lineHeight: 1.6 }}>✅ 잘 맞는 음식: <span style={{ color: ohData.color }}>{ohData.good.join(", ")}</span></p>
              <p style={{ margin: "0 0 6px", fontSize: 13, lineHeight: 1.6 }}>⚠️ 줄여야 할 것: {ohData.avoid.join(", ")}</p>
              <p style={{ margin: 0, fontSize: 13, color: ohData.color, lineHeight: 1.6 }}>💡 {ohData.tip}</p>
            </div>
          </>
        )}

        {/* ── 검색 탭 ── */}
        {view === "search" && (
          <>
            <input
              autoFocus
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="음식 이름 검색 (예: 삼겹살, 콜라, 사과)"
              style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "14px 16px", fontSize: 15, color: "white", outline: "none", boxSizing: "border-box", marginBottom: 16 }}
            />

            {searchQ.length === 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>자주 먹는 음식</p>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                  {["밥", "라면", "치킨", "커피", "과일", "빵", "계란", "김밥", "삼겹살"].map(k => (
                    <button key={k} onClick={() => setSearchQ(k)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 20, padding: "7px 14px", color: "rgba(255,255,255,0.75)", cursor: "pointer", fontSize: 13 }}>{k}</button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                {searchResults.map((f, i) => (
                  <button key={i} onClick={() => addMeal(f)} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "12px 16px", marginBottom: 6, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "white" }}>{f.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{f.unit} · {f.cat}</p>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 900, color: ohData.color, flexShrink: 0, marginLeft: 10 }}>{f.cal} kcal</span>
                  </button>
                ))}
              </div>
            )}

            {searchQ.length > 0 && searchResults.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textAlign: "center", padding: "16px 0" }}>"{searchQ}" 검색 결과 없음</p>
            )}

            {/* 직접 입력 */}
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px", marginTop: 8 }}>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>DB에 없으면 직접 입력</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="음식 이름" style={{ flex: 2, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "white", outline: "none" }} />
                <input value={customCal} onChange={e => setCustomCal(e.target.value)} placeholder="kcal" type="number" style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "white", outline: "none" }} />
              </div>
              <button onClick={addCustom} disabled={!customName || !customCal} style={{ width: "100%", background: customName && customCal ? ohData.color : "rgba(255,255,255,0.1)", color: customName && customCal ? ohData.bg : "rgba(255,255,255,0.4)", border: "none", borderRadius: 10, padding: "10px", fontSize: 14, fontWeight: 700, cursor: customName && customCal ? "pointer" : "default" }}>
                추가하기
              </button>
            </div>
          </>
        )}

        {/* ── 기록 탭 ── */}
        {view === "history" && (
          <>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>최근 30일 칼로리 기록</p>
            {Object.keys(historyData).length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.35)" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>📊</div>
                <p style={{ margin: 0, fontSize: 14 }}>아직 기록이 없어요</p>
              </div>
            ) : (
              Object.entries(historyData)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 30)
                .map(([date, log]) => {
                  const cal = log.totalCal || (log.meals || []).reduce((s, m) => s + m.cal, 0);
                  const r = Math.min(100, Math.round((cal / target) * 100));
                  return (
                    <div key={date} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{date}</span>
                        <span style={{ fontSize: 14, fontWeight: 900, color: r >= 100 ? "#f87171" : ohData.color }}>{cal.toLocaleString()} kcal</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6 }}>
                        <div style={{ width: `${r}%`, height: "100%", background: r >= 100 ? "#f87171" : ohData.color, borderRadius: 99 }} />
                      </div>
                      <div style={{ marginTop: 6 }}>
                        {(log.meals || []).slice(0, 3).map((m, i) => (
                          <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginRight: 8 }}>{m.name} {m.cal}kcal</span>
                        ))}
                        {(log.meals || []).length > 3 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>+{(log.meals || []).length - 3}개</span>}
                      </div>
                    </div>
                  );
                })
            )}

            {/* 사주 CTA */}
            <div style={{ marginTop: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "20px 18px", textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 900, color: "#f3f4f6" }}>🔮 건강 체질이 걱정된다면?</p>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>사주로 건강운 흐름을 분석하면<br />내 몸이 왜 이런지 답이 나와요.</p>
              <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", textDecoration: "none", borderRadius: 14, padding: "13px", fontWeight: 900, fontSize: 14, boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
                건강운 사주로 확인하기 — 990원 →
              </Link>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "8px 0 0" }}>단 1회 결제 · 반복청구 없음</p>
            </div>
          </>
        )}
      </div>



      {/* 회사정보 */}
      <footer style={{ padding: "32px 20px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 380, margin: "0 auto", padding: "20px 18px", borderRadius: 20, background: "#0a0020", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, margin: "0 0 10px" }}>© 2026 점운 · Powered by 점운</p>
          <div style={{ color: "#94a3b8", fontSize: 10.5, lineHeight: 1.9, marginBottom: 14 }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
            <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
            <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다.<br />카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 12 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "7px 18px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 900, fontSize: 12 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "7px 18px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, color: "#e2e8f0", textDecoration: "none", fontWeight: 700, fontSize: 12 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 11, display: "flex", justifyContent: "center", gap: 12 }}>
            <a href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>이용약관</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>개인정보처리방침</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href="/refund" style={{ color: "#94a3b8", textDecoration: "none" }}>환불정책</a>
          </div>
        </div>
      </footer>

      {/* 하단 탭바 */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex" }}>
        {([
          { key: "today", label: "오늘", emoji: "🍽️" },
          { key: "search", label: "음식 검색", emoji: "🔍" },
          { key: "history", label: "기록", emoji: "📊" },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)} style={{ flex: 1, background: "none", border: "none", color: view === tab.key ? ohData.color : "rgba(255,255,255,0.45)", cursor: "pointer", padding: "12px 0 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 10, fontWeight: view === tab.key ? 900 : 400 }}>
            <span style={{ fontSize: 22 }}>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
