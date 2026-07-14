"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOPICS = [
  { key: "today", label: "🌅 오늘 운세", desc: "오늘 하루 흐름" },
  { key: "love", label: "💞 연애·인연", desc: "사랑과 인연" },
  { key: "work", label: "💼 직업·돈", desc: "일과 재물" },
  { key: "choice", label: "🤔 선택·결정", desc: "갈림길에서" },
  { key: "heal", label: "🌿 마음 치유", desc: "위로가 필요할 때" },
];

export default function TarotPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [tarotLocked, setTarotLocked] = useState(false);

  useEffect(() => {
    try {
      const until = Number(localStorage.getItem("tarot_unlock_until") || 0);
      if (!until || until < Date.now()) setTarotLocked(true);
    } catch {}
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [topic, setTopic] = useState("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    if (!birthYear || birthYear.length < 4) { setError("출생연도를 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/tarot/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: cleanPhone, email, birthYear, birthMonth: birthMonth || "1", birthDay: birthDay || "1", topic }),
      });
      const data = await res.json();
      if (data.id) {
        if (typeof window !== "undefined") {
          localStorage.setItem("tarot_last_params", JSON.stringify({ name, phone: cleanPhone, birthYear, birthMonth, birthDay }));
        }
        router.push(`/tarot/result/${data.id}`);
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
    wrap: { minHeight: "100vh", background: "#0f0320", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    row: { marginBottom: 14 },
    btn: { width: "100%", background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" } as const,
  };

  if (step === "intro") {
    return (
      <div style={S.wrap}>
        <style>{`@keyframes floatCard{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}`}</style>
        <div style={{ background: "linear-gradient(180deg,#1a0533 0%,#0f0320 100%)", paddingBottom: 40 }}>
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
            <Link href="/main-v2" style={{ color: "#c084fc", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 24, textAlign: "left" }}>← 점운 홈</Link>
            <div style={{ fontSize: 72, marginBottom: 16, display: "inline-block", animation: "floatCard 3s ease-in-out infinite" }}>🃏</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.3 }}>
              오늘 나에게 온 카드는?
              <br />
              <span style={{ background: "linear-gradient(135deg,#c084fc,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>점운 타로</span>
            </h1>
            <p style={{ color: "#c4b5fd", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px" }}>
              내 생년 오행으로 찾는 소울카드<br />
              연애 · 직업 · 선택 · 치유 · 오늘운세
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 28, justifyContent: "center" }}>
              {[
                { emoji: "⭐", name: "별", bg: "linear-gradient(135deg,#0c4a6e,#38bdf8)" },
                { emoji: "☀️", name: "태양", bg: "linear-gradient(135deg,#78350f,#fbbf24)" },
                { emoji: "🌙", name: "달", bg: "linear-gradient(135deg,#2e1065,#a78bfa)" },
                { emoji: "🌍", name: "세계", bg: "linear-gradient(135deg,#064e3b,#34d399)" },
              ].map(c => (
                <div key={c.name} style={{ width: 78, height: 115, background: c.bg, borderRadius: 10, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                  <span style={{ fontSize: 28 }}>{c.emoji}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 700, marginTop: 8 }}>{c.name}</span>
                </div>
              ))}
            </div>
            {tarotLocked ? (
              <div style={{ background: "rgba(251,191,36,0.1)", border: "1.5px solid rgba(251,191,36,0.5)", borderRadius: 18, padding: "20px", textAlign: "left" }}>
                <p style={{ fontSize: 14, fontWeight: 900, color: "#fbbf24", margin: "0 0 8px" }}>🔒 사주 990원 결제 후 30일 이용해요</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: "0 0 14px", lineHeight: 1.7 }}>
                  사주 결제 1회로<br />감정일기·다이어트·가계부·타로·펫운 5개 앱 30일 이용
                </p>
                <a href="/tarot/pay" style={{ display: "inline-block", background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#1a1a00", fontSize: 14, fontWeight: 900, padding: "13px 28px", borderRadius: 22, textDecoration: "none" }}>
                  사주 990원으로 30일 이용 →
                </a>
              </div>
            ) : (
              <>
                <button onClick={() => setStep("form")} style={S.btn}>지금 카드 뽑기 🃏 →</button>
                <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>사주 결제 후 30일 이용 · 30초만에 결과 확인</p>
              </>
            )}
            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(196,181,253,0.5)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.02em" }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px" }}>
          {[
            { icon: "🔮", title: "오행 소울카드", desc: "내 생년 오행에 맞는 수호 타로카드를 먼저 알려드려요. 오직 나만의 카드예요." },
            { icon: "💞", title: "5가지 주제 리딩", desc: "연애·직업·돈·선택고민·마음치유 중 원하는 주제를 골라서 뽑아요." },
            { icon: "🃏", title: "대아르카나 22장", desc: "정통 타로의 22가지 메이저 카드로 지금 나에게 온 메시지를 전해요." },
            { icon: "🔄", title: "다시 뽑기 가능", desc: "언제든 다시 뽑을 수 있어요. 친구한테 공유해서 반응을 즐겨보세요." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: 15 }}>{f.title}</p>
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {!tarotLocked && (
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px 40px" }}>
            <button onClick={() => setStep("form")} style={S.btn}>카드 뽑으러 가기 →</button>
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

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ paddingTop: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: "#c084fc", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>타로 카드 뽑기</span>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 4px" }}>무엇이 궁금하세요?</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>주제를 고르고 카드를 뽑아보세요</p>

        <div style={{ marginBottom: 20 }}>
          <label style={S.label}>오늘 물어볼 주제</label>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {TOPICS.map(t => (
              <button key={t.key} onClick={() => setTopic(t.key)}
                style={{ padding: "12px 16px", borderRadius: 12, border: `2px solid ${topic === t.key ? "#c084fc" : "rgba(255,255,255,0.12)"}`, background: topic === t.key ? "rgba(192,132,252,0.15)" : "transparent", color: topic === t.key ? "#e9d5ff" : "#9ca3af", cursor: "pointer", fontSize: 14, fontWeight: topic === t.key ? 900 : 400, textAlign: "left" as const, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{t.label.split(" ")[0]}</span>
                <div>
                  <span style={{ fontWeight: 700 }}>{t.label.split(" ").slice(1).join(" ")}</span>
                  <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 8 }}>{t.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#c084fc", margin: "0 0 4px" }}>🔮 내 정보</p>
          <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 14px" }}>전화번호·생년 필수 · 이름 선택</p>

          <div style={S.row}>
            <label style={S.label}>전화번호 (필수)</label>
            <input style={{ ...S.input, border: `1px solid ${error.includes("전화") ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }}
              placeholder="010-0000-0000" inputMode="tel" value={phone}
              onChange={e => { setPhone(e.target.value); setError(""); }} />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1.5 }}>
              <label style={S.label}>출생연도 (필수)</label>
              <input style={{ ...S.input, border: `1px solid ${error.includes("연도") ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }}
                placeholder="1995" maxLength={4} inputMode="numeric" value={birthYear}
                onChange={e => { setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>월 (선택)</label>
              <input style={S.input} placeholder="7" maxLength={2} inputMode="numeric" value={birthMonth}
                onChange={e => setBirthMonth(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>일 (선택)</label>
              <input style={S.input} placeholder="11" maxLength={2} inputMode="numeric" value={birthDay}
                onChange={e => setBirthDay(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
          </div>

          <div style={S.row}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 민지, 별이" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div style={S.row}>
            <label style={S.label}>이메일 (선택)</label>
            <input style={S.input} placeholder="example@email.com" inputMode="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }}
                style={{ marginTop: 3, accentColor: "#c084fc", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>
                <strong style={{ color: "#e5e7eb" }}>[필수] 개인정보 수집·이용 및 마케팅 수신 동의</strong><br />
                점운(jeomun.com)이 전화번호·이메일을 수집하여 운세 정보 및 혜택 안내에 활용하며, 3년간 보유 후 파기합니다. 언제든지 수신거부 가능합니다.
              </span>
            </label>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        <button onClick={analyze} disabled={loading}
          style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "카드 뽑는 중... 🃏" : "카드 뽑기 →"}
        </button>
        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 10 }}>완전 무료 · 결과 후 다시 뽑기 가능</p>

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