"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SPECIES = ["강아지", "고양이", "토끼", "햄스터", "기타"];

export default function PetunPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [petName, setPetName] = useState("");
  const [petYear, setPetYear] = useState("");
  const [petMonth, setPetMonth] = useState("");
  const [petDay, setPetDay] = useState("");
  const [petSpecies, setPetSpecies] = useState("강아지");
  const [ownerName, setOwnerName] = useState("");
  const [ownerYear, setOwnerYear] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    const cleanPhone = ownerPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { setError("보호자 전화번호를 입력해주세요."); return; }
    if (!petYear || petYear.length < 4) { setError("반려동물 출생연도를 입력해주세요."); return; }
    if (!agreed) { setError("개인정보 수집 동의를 체크해주세요."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/petun/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petName, petBirthYear: petYear, petBirthMonth: petMonth || "1", petBirthDay: petDay || "1", petSpecies,
          ownerName, ownerBirthYear: ownerYear || null, ownerPhone: cleanPhone, ownerEmail,
        }),
      });
      const data = await res.json();
      if (data.id) {
        window.location.href = `/petun/result/${data.id}`;
      } else {
        setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#05000f", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    input: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "13px 14px", color: "white", fontSize: 15, outline: "none", boxSizing: "border-box" as const },
    label: { fontSize: 12, color: "#9ca3af", marginBottom: 6, display: "block" as const },
    row: { marginBottom: 14 },
    btn: { width: "100%", background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer" },
    specBtn: (active: boolean) => ({
      flex: 1, padding: "10px 0", borderRadius: 12, border: `2px solid ${active ? "#06b6d4" : "rgba(255,255,255,0.15)"}`,
      background: active ? "rgba(6,182,212,0.2)" : "transparent", color: active ? "#06b6d4" : "#9ca3af",
      cursor: "pointer", fontSize: 13, fontWeight: active ? 900 : 400,
    }),
  };

  const features = [
    { icon: "🐾", title: "사주 오행 성격 분석", desc: "생년으로 계산한 오행으로\n반려동물 성격을 분석해요" },
    { icon: "❤️", title: "보호자-반려동물 궁합", desc: "보호자와 우리 아이의\n오행 궁합 점수를 알려드려요" },
    { icon: "🍗", title: "오행별 추천 음식", desc: "오행 에너지에 맞는\n음식과 영양소를 추천해요" },
    { icon: "💊", title: "건강운 & 주의 사항", desc: "오행별 건강 에너지와\n주의해야 할 건강 이슈예요" },
    { icon: "🏆", title: "좋아하는 것 TOP 5", desc: "우리 아이가 가장 좋아하는 것을\n사주로 알아봐요" },
    { icon: "🔍", title: "음식 안전도 체크", desc: "100+ 음식의 반려동물 안전 여부를\n바로 확인해요" },
  ];

  if (step === "intro") {
    return (
      <div style={S.wrap}>
        <div style={{ background: "linear-gradient(180deg, #0a001f 0%, #05000f 100%)", paddingBottom: 40 }}>
          <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px 0", textAlign: "center" }}>
            <Link href="/main-v2" style={{ color: "#06b6d4", fontSize: 13, textDecoration: "none", display: "block", marginBottom: 24, textAlign: "left" }}>← 점운 홈</Link>

            <div style={{ fontSize: 64, marginBottom: 16 }}>🐾</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.3 }}>
              우리 아이 사주 보기
              <br />
              <span style={{ background: "linear-gradient(135deg,#06b6d4,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                점운 펫운
              </span>
            </h1>
            <p style={{ color: "#a5f3fc", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px" }}>
              생년으로 보는 반려동물 오행 사주<br />
              성격·건강운·보호자 궁합·음식 추천
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 28, maxWidth: 240, margin: "0 auto 28px" }}>
              {["🐶 강아지", "🐱 고양이", "🐰 토끼", "🐹 햄스터"].map(t => (
                <span key={t} style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.4)", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#a5f3fc", textAlign: "center" }}>{t}</span>
              ))}
            </div>

            {/* 샘플 카드 */}
            <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
              {[
                { oh: "목", name: "보리", score: "활동력 92", color: "#4ade80" },
                { oh: "수", name: "초코", score: "지능 95", color: "#60a5fa" },
                { oh: "토", name: "뭉치", score: "충성도 97", color: "#fbbf24" },
              ].map(item => (
                <div key={item.name} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: `1px solid ${item.color}33`, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>{item.oh}오행</p>
                  <p style={{ fontSize: 14, fontWeight: 900, color: item.color, margin: "0 0 2px" }}>{item.name}</p>
                  <p style={{ fontSize: 11, color: "#d1d5db", margin: 0 }}>{item.score}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setStep("form")} style={S.btn}>
              지금 무료로 분석하기 🐾 →
            </button>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>완전 무료 · 보호자 정보 선택 입력</p>
            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(6,182,212,0.55)", marginTop: 10, lineHeight: 1.6, letterSpacing: "0.02em" }}>
              🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px" }}>
          {features.map(f => (
            <div key={f.title} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, margin: "0 0 4px", fontSize: 15 }}>{f.title}</p>
                <p style={{ color: "#9ca3af", fontSize: 13, margin: 0, lineHeight: 1.5, whiteSpace: "pre-line" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 24px" }}>
          <button onClick={() => setStep("form")} style={S.btn}>
            우리 아이 사주 분석하기 →
          </button>
        </div>

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
            <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다. 카카오톡으로 문의해 주세요.</p>
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
          <button onClick={() => setStep("intro")} style={{ background: "none", border: "none", color: "#06b6d4", fontSize: 13, cursor: "pointer", padding: 0 }}>← 뒤로</button>
          <span style={{ fontSize: 13, color: "#6b7280" }}>펫운 분석</span>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 4px" }}>우리 아이 정보를 입력해주세요</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>출생연도만 있어도 분석 가능해요!</p>

        {/* 반려동물 정보 */}
        <div style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#06b6d4", margin: "0 0 14px" }}>🐾 반려동물</p>

          <div style={S.row}>
            <label style={S.label}>종류</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SPECIES.map(s => (
                <button key={s} onClick={() => setPetSpecies(s)}
                  style={{ ...S.specBtn(petSpecies === s), flex: "none", padding: "8px 14px" }}>
                  {s === "강아지" ? "🐶" : s === "고양이" ? "🐱" : s === "토끼" ? "🐰" : s === "햄스터" ? "🐹" : "🐾"} {s}
                </button>
              ))}
            </div>
          </div>

          <div style={S.row}>
            <label style={S.label}>이름 (선택)</label>
            <input style={S.input} placeholder="예) 보리, 초코, 뭉치" value={petName} onChange={e => setPetName(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1.2 }}>
              <label style={S.label}>출생연도 *</label>
              <input style={S.input} placeholder="2020" maxLength={4} inputMode="numeric" value={petYear}
                onChange={e => setPetYear(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>월 (선택)</label>
              <input style={S.input} placeholder="3" maxLength={2} inputMode="numeric" value={petMonth}
                onChange={e => setPetMonth(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>일 (선택)</label>
              <input style={S.input} placeholder="15" maxLength={2} inputMode="numeric" value={petDay}
                onChange={e => setPetDay(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
          </div>
        </div>

        {/* 보호자 정보 */}
        <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 900, color: "#a78bfa", margin: "0 0 4px" }}>💜 보호자 정보</p>
          <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 14px" }}>전화번호 필수 · 이름/연도는 선택</p>

          <div style={S.row}>
            <label style={S.label}>전화번호 (필수)</label>
            <input style={{ ...S.input, border: `1px solid ${error.includes("전화") ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}` }}
              placeholder="010-0000-0000" inputMode="tel" value={ownerPhone}
              onChange={e => { setOwnerPhone(e.target.value); setError(""); }} />
          </div>

          <div style={S.row}>
            <label style={S.label}>이름 또는 별명 (선택)</label>
            <input style={S.input} placeholder="예) 민지" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
          </div>

          <div style={S.row}>
            <label style={S.label}>이메일 (선택)</label>
            <input style={S.input} placeholder="example@email.com" inputMode="email" type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} />
          </div>

          <div style={S.row}>
            <label style={S.label}>출생연도 (선택)</label>
            <input style={S.input} placeholder="1995" maxLength={4} inputMode="numeric" value={ownerYear}
              onChange={e => setOwnerYear(e.target.value.replace(/\D/g, "").slice(0, 4))} />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setError(""); }}
                style={{ marginTop: 3, accentColor: "#06b6d4", width: 16, height: 16, flexShrink: 0 }} />
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
          {loading ? "분석 중... 🐾" : "우리 아이 사주 보기 →"}
        </button>
        <p style={{ fontSize: 11, color: "#6b7280", textAlign: "center", marginTop: 10 }}>완전 무료 · 2초만에 결과 확인</p>

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
            <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다. 카카오톡으로 문의해 주세요.</p>
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