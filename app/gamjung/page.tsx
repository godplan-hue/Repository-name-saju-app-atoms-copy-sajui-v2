"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MOODS = [
  { score: 5, label: "최고!", emoji: "😄", color: "#fbbf24" },
  { score: 4, label: "좋음",  emoji: "🙂", color: "#4ade80" },
  { score: 3, label: "보통",  emoji: "😐", color: "#93c5fd" },
  { score: 2, label: "나쁨",  emoji: "😔", color: "#a78bfa" },
  { score: 1, label: "끔찍함",emoji: "😢", color: "#f87171" },
];

const ACTIVITIES = [
  { key: "sleep",    label: "수면",        emoji: "💤" },
  { key: "exercise", label: "운동",        emoji: "🏃" },
  { key: "food",     label: "맛있는 음식", emoji: "🍽️" },
  { key: "reading",  label: "독서",        emoji: "📚" },
  { key: "friends",  label: "친구",        emoji: "👫" },
  { key: "family",   label: "가족",        emoji: "👨‍👩‍👧" },
  { key: "date",     label: "데이트",      emoji: "💑" },
  { key: "alone",    label: "혼자 시간",   emoji: "🧘" },
  { key: "work",     label: "일·업무",     emoji: "💼" },
  { key: "study",    label: "공부",        emoji: "📖" },
  { key: "creative", label: "창작·취미",   emoji: "🎨" },
  { key: "shopping", label: "쇼핑",        emoji: "🛍️" },
  { key: "travel",   label: "나들이",      emoji: "🚶" },
  { key: "movie",    label: "영화·TV",     emoji: "📺" },
  { key: "music",    label: "음악",        emoji: "🎵" },
];

export default function GamjungPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "mood" | "activity" | "form">("intro");
  const [moodScore, setMoodScore] = useState(0);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedMood = MOODS.find(m => m.score === moodScore);
  const [history, setHistory] = useState<Array<{id: string; moodLabel: string; moodEmoji: string; createdAt: number}>>([]);
  const [gamjungLocked, setGamjungLocked] = useState(false);
  const [gamjungNeverPaid, setGamjungNeverPaid] = useState(false);
  const [gamjungExpiringSoon, setGamjungExpiringSoon] = useState(false);
  const [gamjungDaysLeft, setGamjungDaysLeft] = useState(0);

  useEffect(() => {
    try {
      const h = localStorage.getItem("gamjung_history");
      if (h) setHistory(JSON.parse(h).slice(0, 5));
    } catch {}
    try {
      const p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}");
      if (p.name) setName(p.name);
      if (p.phone) setPhone(p.phone);
      if (p.email) setEmail(p.email);
    } catch {}
    // 30일 이용권 만료 체크
    try {
      const until = Number(localStorage.getItem("gamjung_unlock_until") || 0);
      const now = Date.now();
      if (!until) {
        setGamjungLocked(true);
        setGamjungNeverPaid(true);
      } else if (until < now) {
        setGamjungLocked(true);
      } else if (until - now < 3 * 24 * 60 * 60 * 1000) {
        setGamjungExpiringSoon(true);
        setGamjungDaysLeft(Math.ceil((until - now) / (24 * 60 * 60 * 1000)));
      }
    } catch {}
  }, []);

  const toggleActivity = (key: string) => {
    setSelectedActivities(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const analyze = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/gamjung/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: cleanPhone, email, moodScore, activities: selectedActivities, memo }),
      });
      const data = await res.json();
      if (data.id) {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(`gamjung_result_${data.id}`, JSON.stringify(data.result));
        }
        window.location.href = `/gamjung/result/${data.id}`;
      } else {
        setError("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#0f1a14", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    btn: { width: "100%", background: "linear-gradient(135deg,#065f46,#4ade80)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(74,222,128,0.3)" } as const,
  };

  if (step === "intro") {
    return (
      <div style={S.wrap}>
        <style>{`@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`}</style>
        <div style={{ background: "linear-gradient(180deg,#0a2010 0%,#0f1a14 100%)", paddingBottom: 40 }}>
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
            <Link href="/main-v2" style={{ color: "#4ade80", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 24, textAlign: "left" }}>← 점운 홈</Link>
            <div style={{ fontSize: 72, marginBottom: 16, display: "inline-block", animation: "breathe 3s ease-in-out infinite" }}>😊</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.3 }}>
              오늘 기분이 어때요?
              <br />
              <span style={{ background: "linear-gradient(135deg,#4ade80,#059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운 감정일기</span>
            </h1>
            <p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px" }}>
              기분 선택 → 활동 태그 → 오행 감정 분석<br />
              내 감정이 어떤 에너지인지 알아보세요
            </p>
            <div style={{ display: "flex", gap: 6, marginBottom: 28, justifyContent: "center" }}>
              {MOODS.map(m => (
                <div key={m.score} style={{ flex: 1, padding: "12px 4px", background: "rgba(255,255,255,0.05)", borderRadius: 12, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 22 }}>{m.emoji}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>
            {gamjungLocked ? (
              <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 16, padding: "16px 20px", marginBottom: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24", margin: "0 0 8px" }}>{gamjungNeverPaid ? "🔒 이용권이 필요해요" : "⏰ 30일 이용권이 만료됐어요"}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 12px", lineHeight: 1.6 }}>
                  {gamjungNeverPaid ? "990원 단독권 또는 7개앱 4,900원 풀패스로 이용해요" : "기존 감정일기는 계속 볼 수 있어요. 새 일기를 쓰려면 재활성화해주세요."}
                </p>
                <a href="/gamjung/pay" style={{ display: "inline-block", background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#1a1a00", fontSize: 13, fontWeight: 900, padding: "11px 24px", borderRadius: 20, textDecoration: "none" }}>
                  {gamjungNeverPaid ? "이용권 구매하기 →" : "30일 재활성화 →"}
                </a>
              </div>
            ) : (
              <>
                <button onClick={() => setStep("mood")} style={S.btn}>오늘 감정 기록하기 →</button>
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>감정일기 이용 중 · 1분이면 끝</p>
              </>
            )}
            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(74,222,128,0.5)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.02em" }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px" }}>
          {[
            { icon: "💚", title: "5단계 기분 선택", desc: "최고부터 끔찍함까지 —\n솔직하게 선택해요.\n판단 없이 기록해드려요." },
            { icon: "🏷️", title: "오늘 한 활동 태그", desc: "수면·운동·친구·일 등 오늘 있었던 일을 골라요.\n여러 개 선택 가능해요." },
            { icon: "🌿", title: "오행 감정 분석", desc: "내 기분이 목·화·토·금·수 중\n어떤 오행 에너지인지 알려드려요." },
            { icon: "💌", title: "오행별 맞춤 위로", desc: "지금 내 감정에 꼭 맞는\n조언과 위로를 드려요." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: 15 }}>{f.title}</p>
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {history.length > 0 && (
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px 16px" }}>
            <p style={{ fontSize: 13, color: "#4ade80", fontWeight: 700, margin: "0 0 10px" }}>📔 내 감정일기 기록</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {history.map(h => (
                <Link key={h.id} href={`/gamjung/result/${h.id}`} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: "12px 16px", textDecoration: "none" }}>
                  <span style={{ fontSize: 24 }}>{h.moodEmoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#e5e7eb", margin: "0 0 2px" }}>{h.moodLabel}</p>
                    <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{new Date(h.createdAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}</p>
                  </div>
                  <span style={{ color: "#4ade80", fontSize: 14 }}>›</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        {gamjungExpiringSoon && (
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px 12px" }}>
            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "12px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#c2410c", margin: "0 0 6px" }}>⏰ {gamjungDaysLeft}일 후 감정일기가 잠겨요</p>
              <a href="/gamjung/pay" style={{ color: "#ea580c", fontWeight: 700, fontSize: 12, textDecoration: "none" }}>지금 990원 결제하면 만료일부터 30일 자동 연장 →</a>
            </div>
          </div>
        )}
        {gamjungLocked ? (
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px 40px" }}>
            <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 14, padding: "20px 18px", textAlign: "center" }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: "#fbbf24", margin: "0 0 8px" }}>⏰ 30일 이용권이 만료됐어요</p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 14px" }}>기존 기록은 위에서 계속 볼 수 있어요.</p>
              <a href="/gamjung/pay" style={{ display: "inline-block", background: "linear-gradient(135deg, #f97316, #fb923c)", color: "white", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>사주 990원으로 30일 재활성화 →</a>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px 40px" }}>
            <button onClick={() => setStep("mood")} style={S.btn}>감정일기 시작하기 →</button>
          </div>
        )}

      {/* 회사정보 */}
      <footer style={{ padding: "32px 20px 24px", textAlign: "center" }}>
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
      </div>
    );
  }

  if (step === "mood") {
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ paddingTop: 32, marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: "#4ade80", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
            <span style={{ fontSize: 13, color: "#6b7280" }}>1 / 3</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>오늘 기분이 어때요?</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 28px" }}>솔직하게 골라주세요. 판단 없이 기록해요 😊</p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {MOODS.map(m => (
              <button key={m.score} onClick={() => { setMoodScore(m.score); setStep("activity"); }}
                style={{ padding: "18px 20px", borderRadius: 16, border: `2px solid ${moodScore === m.score ? m.color : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, textAlign: "left" as const }}>
                <span style={{ fontSize: 36 }}>{m.emoji}</span>
                <p style={{ fontWeight: 900, fontSize: 18, margin: 0, color: "white" }}>{m.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "activity") {
    return (
      <div style={S.wrap}>
        <div style={S.inner}>
          <div style={{ paddingTop: 32, marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setStep("mood")} style={{ background: "none", border: "none", color: "#4ade80", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
            <span style={{ fontSize: 13, color: "#6b7280" }}>2 / 3</span>
          </div>
          <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 16, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>{selectedMood?.emoji}</span>
            <div>
              <p style={{ fontWeight: 900, margin: 0, color: "#4ade80" }}>오늘 기분: {selectedMood?.label}</p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>잘 기록됐어요</p>
            </div>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>오늘 있었던 일을 골라요</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>여러 개 선택 가능해요 (선택 안 해도 OK)</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
            {ACTIVITIES.map(a => {
              const sel = selectedActivities.includes(a.key);
              return (
                <button key={a.key} onClick={() => toggleActivity(a.key)}
                  style={{ padding: "12px 8px", background: sel ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${sel ? "#4ade80" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, cursor: "pointer", textAlign: "center" as const }}>
                  <div style={{ fontSize: 22 }}>{a.emoji}</div>
                  <div style={{ fontSize: 11, color: sel ? "#4ade80" : "#9ca3af", marginTop: 4, fontWeight: sel ? 700 : 400 }}>{a.label}</div>
                </button>
              );
            })}
          </div>
          <button onClick={() => setStep("form")} style={S.btn}>
            {selectedActivities.length > 0 ? `${selectedActivities.length}개 선택 완료 →` : "다음으로 →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ paddingTop: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setStep("activity")} style={{ background: "none", border: "none", color: "#4ade80", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>3 / 3</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 4px" }}>거의 다 됐어요!</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>전화번호만 입력하면 오행 감정 분석이 나와요</p>

        <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 18, padding: "18px 16px", marginBottom: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>한마디 메모 (선택)</label>
            <input style={S.input} placeholder="오늘 하루를 한 줄로..." value={memo} onChange={e => setMemo(e.target.value)} maxLength={100} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>전화번호 (필수)</label>
            <input style={{ ...S.input, border: `1px solid ${error.includes("전화") ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }}
              placeholder="010-0000-0000" inputMode="tel" value={phone}
              onChange={e => { setPhone(e.target.value); setError(""); }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 지은, 행복이" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 0 }}>
            <label style={S.label}>이메일 (선택)</label>
            <input style={S.input} placeholder="example@email.com" inputMode="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.06)", border: `1.5px solid ${agreed ? "#4ade80" : "rgba(255,255,255,0.2)"}`, borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }}
              style={{ marginTop: 2, accentColor: "#4ade80", width: 18, height: 18, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#d1d5db", lineHeight: 1.7 }}>
              <strong style={{ color: "#4ade80", fontSize: 13 }}>[필수] 개인정보 수집·이용 및 마케팅 수신 동의</strong><br />
              점운(jeomun.com)이 전화번호·이메일을 수집하여 운세 정보 및 혜택 안내에 활용하며, 3년간 보유 후 파기합니다. 언제든지 수신거부 가능합니다.
            </span>
          </label>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}
        <button onClick={analyze} disabled={loading}
          style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "감정 분석 중... 🌿" : "오행 감정 분석 보기 →"}
        </button>
        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 10 }}>완전 무료 · 광고 없음</p>

      {/* 회사정보 */}
      <footer style={{ padding: "32px 20px 24px", textAlign: "center" }}>
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
      </div>
    </div>
  );
}