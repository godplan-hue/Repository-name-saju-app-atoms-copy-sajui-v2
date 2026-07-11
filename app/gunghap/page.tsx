"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GunghapPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [phone, setPhone] = useState("");
  const [name1, setName1] = useState("");
  const [year1, setYear1] = useState("");
  const [month1, setMonth1] = useState("");
  const [day1, setDay1] = useState("");
  const [gender1, setGender1] = useState("");
  const [name2, setName2] = useState("");
  const [year2, setYear2] = useState("");
  const [month2, setMonth2] = useState("");
  const [day2, setDay2] = useState("");
  const [gender2, setGender2] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const S = {
    wrap: { minHeight: "100vh", background: "#0a0015", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    row: { marginBottom: 14 },
    btn: { width: "100%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer" },
    gBtn: (active: boolean) => ({
      flex: 1, padding: "12px 0", borderRadius: 12, border: `2px solid ${active ? "#ec4899" : "rgba(255,255,255,0.15)"}`,
      background: active ? "rgba(236,72,153,0.2)" : "transparent", color: active ? "#ec4899" : "#9ca3af",
      cursor: "pointer", fontSize: 14, fontWeight: active ? 900 : 400,
    }),
  };

  const analyze = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("전화번호를 입력해주세요."); return; }
    if (!year1 || year1.length < 4) { setError("나의 출생연도를 입력해주세요."); return; }
    if (!year2 || year2.length < 4) { setError("상대방 출생연도를 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/gunghap/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone, email,
          name1: name1 || "나", birthYear1: year1, birthMonth1: month1 || "1", birthDay1: day1 || "1", gender1,
          name2: name2 || "상대방", birthYear2: year2, birthMonth2: month2 || "1", birthDay2: day2 || "1", gender2,
        }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/gunghap/result/${data.id}`);
      } else {
        setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "intro") {
    return (
      <div style={S.wrap}>
        {/* 히어로 */}
        <div style={{ background: "linear-gradient(180deg, #1a0030 0%, #0a0015 100%)", paddingBottom: 40 }}>
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
            <Link href="/main-v2" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 24, textAlign: "left" }}>← 점운 홈</Link>

            <div style={{ fontSize: 64, marginBottom: 16 }}>💞</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.3 }}>
              우리 궁합<br />
              <span style={{ background: "linear-gradient(135deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                몇 점일까?
              </span>
            </h1>
            <p style={{ color: "#c4b5fd", fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
              오행 사주로 보는 진짜 궁합<br />
              성격·연애·갈등·결혼까지 전부 분석
            </p>

            {/* 배지 */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
              {["✨ 환상궁합 발견", "💬 연애 패턴 분석", "🃏 인연 타로 뽑기", "📤 카카오 공유 가능"].map(t => (
                <span key={t} style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#c4b5fd" }}>{t}</span>
              ))}
            </div>

            {/* 점수 미리보기 */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
              {[
                { pair: "화 × 토", score: 93, tag: "환상궁합" },
                { pair: "목 × 수", score: 87, tag: "좋은궁합" },
                { pair: "금 × 수", score: 91, tag: "환상궁합" },
              ].map(item => (
                <div key={item.pair} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 12px", textAlign: "center", flex: 1 }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>{item.pair}</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: "#f472b6", margin: "0 0 2px" }}>{item.score}점</p>
                  <p style={{ fontSize: 10, color: "#a78bfa", margin: 0 }}>{item.tag}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setStep("form")} style={S.btn}>
              지금 무료로 궁합 보기 →
            </button>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>기본 결과 무료 · 상세 분석 990원</p>
            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(167,139,250,0.55)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.02em" }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>
          </div>
        </div>

        {/* 기능 설명 */}
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px" }}>
          {[
            { icon: "🔮", title: "오행 궁합 점수", desc: "사주 오행으로 계산한 진짜 궁합 점수를 알려드려요" },
            { icon: "💬", title: "연애 패턴 분석", desc: "두 사람의 연애 방식과 갈등 패턴을 정확히 짚어줘요" },
            { icon: "🃏", title: "인연 타로 뽑기", desc: "오늘 두 사람의 인연을 타로 카드로 확인해보세요" },
            { icon: "💍", title: "결혼 궁합 체크", desc: "함께 살면 어떨지 결혼 궁합도 살펴드려요" },
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

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px" }}>
          <button onClick={() => setStep("form")} style={S.btn}>
            궁합 분석 시작하기 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ paddingTop: 32, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>궁합 분석</span>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>두 사람의 정보를 입력해주세요</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>출생연도만 있어도 기본 분석이 가능해요</p>

        {/* 나 */}
        <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#a78bfa", margin: "0 0 14px" }}>💜 나</p>

          <div style={S.row}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 지민" value={name1} onChange={e => setName1(e.target.value)} />
          </div>

          <div style={S.row}>
            <label style={S.label}>전화번호 (필수)</label>
            <input style={{ ...S.input, border: `1px solid ${error.includes("전화") ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.15)"}` }}
              placeholder="010-0000-0000" inputMode="tel" value={phone}
              onChange={e => { setPhone(e.target.value); setError(""); }} />
          </div>

          <div style={S.row}>
            <label style={S.label}>이메일 (선택)</label>
            <input style={S.input} placeholder="example@email.com" inputMode="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>출생연도 *</label>
              <input style={S.input} placeholder="1998" maxLength={4} inputMode="numeric" value={year1}
                onChange={e => setYear1(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>월 (선택)</label>
              <input style={S.input} placeholder="3" maxLength={2} inputMode="numeric" value={month1}
                onChange={e => setMonth1(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>일 (선택)</label>
              <input style={S.input} placeholder="15" maxLength={2} inputMode="numeric" value={day1}
                onChange={e => setDay1(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>성별 (선택)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setGender1("여성")} style={S.gBtn(gender1 === "여성")}>👩 여성</button>
              <button onClick={() => setGender1("남성")} style={S.gBtn(gender1 === "남성")}>👨 남성</button>
            </div>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }}
                style={{ marginTop: 3, accentColor: "#ec4899", width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.6 }}>
                <strong style={{ color: "#e5e7eb" }}>[필수] 개인정보 수집·이용 및 마케팅 수신 동의</strong><br />
                점운(jeomun.com)이 전화번호·이메일을 수집하여 운세 정보 및 혜택 안내에 활용하며, 3년간 보유 후 파기합니다. 언제든지 수신거부 가능합니다.
              </span>
            </label>
          </div>
        </div>

        {/* 상대방 */}
        <div style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#f472b6", margin: "0 0 14px" }}>🩷 상대방</p>

          <div style={S.row}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 태현" value={name2} onChange={e => setName2(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>출생연도 *</label>
              <input style={S.input} placeholder="1996" maxLength={4} inputMode="numeric" value={year2}
                onChange={e => setYear2(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>월 (선택)</label>
              <input style={S.input} placeholder="7" maxLength={2} inputMode="numeric" value={month2}
                onChange={e => setMonth2(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>일 (선택)</label>
              <input style={S.input} placeholder="22" maxLength={2} inputMode="numeric" value={day2}
                onChange={e => setDay2(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
          </div>

          <div>
            <label style={S.label}>성별 (선택)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setGender2("여성")} style={S.gBtn(gender2 === "여성")}>👩 여성</button>
              <button onClick={() => setGender2("남성")} style={S.gBtn(gender2 === "남성")}>👨 남성</button>
            </div>
          </div>
        </div>

        {error && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        <button onClick={analyze} disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "궁합 분석 중... 🔮" : "궁합 점수 확인하기 💞"}
        </button>
        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 10 }}>
          기본 결과 무료 · 상세 분석 ₩990
        </p>

      {/* 회사정보 */}
      <footer style={{ padding: "32px 20px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 380, margin: "0 auto", padding: "18px 16px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700, margin: "0 0 8px" }}>© 2026 점운 · Powered by 점운</p>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10.5, lineHeight: 1.8, marginBottom: 12 }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38, 7층 7017호(대치동)</p>
            <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
            <p style={{ margin: "2px 0 0", color: "#f87171", fontWeight: 900 }}>※ 전화 문의는 받지 않습니다. 카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 10 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "6px 16px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 800, fontSize: 11 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "6px 16px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 800, fontSize: 11 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 11 }}>
            <a href="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>이용약관</a>
            <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 8px" }}>|</span>
            <a href="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>개인정보처리방침</a>
            <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 8px" }}>|</span>
            <a href="/refund" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>환불정책</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}