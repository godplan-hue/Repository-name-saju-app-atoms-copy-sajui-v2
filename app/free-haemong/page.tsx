"use client";
import { useState } from "react";
import { DREAMS, searchKeywords } from "@/lib/haemong/data";

const POPULAR = ["돼지꿈", "뱀꿈", "용꿈", "똥꿈", "황금꿈", "불꿈", "물꿈", "이빨빠지는꿈"];

type Step = "form" | "loading" | "result" | "done";

export default function FreeHaemongPage() {
  const [step, setStep] = useState<Step>("form");
  const [keyword, setKeyword] = useState("");
  const [phone, setPhone] = useState("");
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [dreamKey, setDreamKey] = useState("");

  async function handleSubmit() {
    if (!keyword.trim()) { alert("꿈 키워드를 입력해주세요."); return; }
    const ph = phone.replace(/\D/g, "");
    if (ph.length < 10) { alert("전화번호를 정확히 입력해주세요."); return; }

    setStep("loading");

    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, app: "haemong" }),
      });
      const data = await res.json();

      if (data.alreadyUsed) {
        setAlreadyUsed(true);
        setStep("result");
        return;
      }

      // 꿈 검색
      const found = searchKeywords(keyword.trim());
      if (found.length > 0) {
        setDreamKey(found[0]);
      } else {
        setDreamKey("돼지꿈"); // 기본
      }
      setStep("result");
    } catch {
      alert("오류가 발생했어요. 다시 시도해주세요.");
      setStep("form");
    }
  }

  const dream = dreamKey ? DREAMS[dreamKey] : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fdf2f8 0%,#ede9fe 100%)", fontFamily: "sans-serif" }}>
      {/* 헤더 */}
      <div style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)", padding: "20px 20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>🌙</div>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>점운 꿈해몽</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, margin: 0 }}>AI 꿈 해석 · 1회 무료 체험</p>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 40px" }}>

        {/* STEP: 폼 */}
        {step === "form" && (
          <>
            {/* 무료 배지 */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", marginBottom: 20, border: "2px solid #ec4899", boxShadow: "0 4px 20px rgba(236,72,153,0.15)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ background: "#ec4899", color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 800 }}>🎁 무료</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>꿈해몽 1회 무료 해석</span>
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                전화번호 인증 후 꿈 키워드를 입력하면<br />
                재물·연애·성공운까지 무료로 해석해 드려요.
              </p>
            </div>

            {/* 인기 꿈 태그 */}
            <p style={{ fontSize: 12, color: "#9333ea", fontWeight: 700, marginBottom: 8 }}>🔥 인기 꿈 키워드</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {POPULAR.map(k => (
                <button key={k} onClick={() => setKeyword(k)}
                  style={{ background: keyword === k ? "#ec4899" : "#f3e8ff", color: keyword === k ? "#fff" : "#7c3aed", border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  {k}
                </button>
              ))}
            </div>

            {/* 꿈 입력 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>꿈에서 본 것 <span style={{ color: "#ec4899" }}>*</span></label>
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="예) 뱀꿈, 돼지꿈, 불꿈, 이빨빠지는꿈"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* 전화번호 */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>전화번호 <span style={{ color: "#ec4899" }}>*</span></label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="01012345678"
                inputMode="tel"
                style={{ width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e5e7eb", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0" }}>전화번호 1개당 앱 1회 무료 체험 가능</p>
            </div>

            {/* 제출 버튼 */}
            <button onClick={handleSubmit}
              style={{ width: "100%", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 17, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(236,72,153,0.4)" }}>
              🌙 무료로 꿈 해석받기
            </button>

            {/* 하단 안내 */}
            <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 12 }}>
              더 보려면 꿈해몽 30일 이용권(₩990)이 필요해요
            </p>
          </>
        )}

        {/* STEP: 로딩 */}
        {step === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#7c3aed" }}>꿈을 해석하고 있어요...</p>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>잠시만 기다려주세요</p>
          </div>
        )}

        {/* STEP: 결과 */}
        {step === "result" && (
          <>
            {/* 이미 사용한 경우 */}
            {alreadyUsed && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", marginBottom: 20, textAlign: "center", border: "2px solid #fde047" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⚠️</div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px" }}>이미 무료 체험을 사용하셨어요</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>
                  해당 전화번호로 꿈해몽 무료 체험이<br />이미 완료됐어요.
                </p>
                <button onClick={() => window.open("/haemong/pay", "_blank")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>
                  🌙 꿈해몽 30일 이용권 ₩990
                </button>
              </div>
            )}

            {/* 정상 결과 */}
            {!alreadyUsed && dream && (
              <>
                {/* 결과 헤더 */}
                <div style={{ background: "linear-gradient(135deg,#ec4899,#8b5cf6)", borderRadius: 16, padding: "20px", marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 40, marginBottom: 6 }}>{dream.emoji}</div>
                  <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>{dreamKey}</h2>
                  <span style={{ background: dream.luck === "길몽" ? "#fbbf24" : dream.luck === "흉몽" ? "#ef4444" : "#9ca3af", color: "#1a1a2e", borderRadius: 20, padding: "3px 14px", fontSize: 13, fontWeight: 800 }}>
                    {dream.luck}
                  </span>
                </div>

                {/* 요약 */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: "1.5px solid #f3e8ff" }}>
                  <p style={{ fontSize: 13, color: "#7c3aed", fontWeight: 800, margin: "0 0 6px" }}>✨ 한줄 요약</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{dream.summary}</p>
                </div>

                {/* 기본 해석 */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: "1.5px solid #f3e8ff" }}>
                  <p style={{ fontSize: 13, color: "#7c3aed", fontWeight: 800, margin: "0 0 8px" }}>📖 꿈 해석</p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0 }}>{dream.basicMeaning}</p>
                </div>

                {/* 상황별 (1개만 무료 공개) */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: "1.5px solid #f3e8ff" }}>
                  <p style={{ fontSize: 13, color: "#7c3aed", fontWeight: 800, margin: "0 0 10px" }}>🎯 상황별 해석 (1개 무료 공개)</p>
                  {dream.situations.slice(0, 1).map((s, i) => (
                    <div key={i} style={{ background: "#fdf4ff", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed", margin: "0 0 4px" }}>"{s.case}"</p>
                      <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{s.meaning}</p>
                    </div>
                  ))}

                  {/* 나머지 잠금 */}
                  <div style={{ position: "relative", overflow: "hidden", borderRadius: 10, marginTop: 4 }}>
                    <div style={{ filter: "blur(4px)", pointerEvents: "none", opacity: 0.4, background: "#fdf4ff", padding: "12px 14px" }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed", margin: "0 0 4px" }}>"{dream.situations[1]?.case}"</p>
                      <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{dream.situations[1]?.meaning}</p>
                    </div>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.7)" }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed" }}>🔒 이용권으로 전체 공개</span>
                    </div>
                  </div>
                </div>

                {/* 오늘의 조언 */}
                <div style={{ background: "linear-gradient(135deg,#fdf4ff,#f0f9ff)", borderRadius: 14, padding: "16px 18px", marginBottom: 20, border: "1.5px solid #e9d5ff" }}>
                  <p style={{ fontSize: 13, color: "#7c3aed", fontWeight: 800, margin: "0 0 6px" }}>💡 오늘의 조언</p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>{dream.todayAdvice}</p>
                </div>

                {/* 잠금 안내 */}
                <div style={{ background: "#fff7ed", borderRadius: 14, padding: "14px 18px", marginBottom: 20, border: "1.5px solid #fed7aa", textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: "#92400e", margin: "0 0 4px" }}>🔒 이런 내용이 잠겨있어요</p>
                  <p style={{ fontSize: 12, color: "#78350f", margin: 0, lineHeight: 1.7 }}>
                    재물운 상세 해석 · 연애운 · 건강운 · 성공운<br />
                    상황별 전체 {dream.situations.length}가지 해석<br />
                    사주 연동 종합 해석
                  </p>
                </div>
              </>
            )}

            {/* 결제 CTA (공통) */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "2px solid #ec4899", boxShadow: "0 4px 20px rgba(236,72,153,0.2)", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: "#be185d", margin: "0 0 4px", textAlign: "center" }}>🌙 꿈해몽 전체 이용하기</p>
              <p style={{ fontSize: 12, color: "#6b7280", textAlign: "center", margin: "0 0 14px" }}>
                300개+ 꿈 해석 · 재물·연애·건강·성공운 전체<br />30일 무제한 이용
              </p>
              <button onClick={() => window.open("/haemong/pay", "_blank")}
                style={{ width: "100%", background: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "#fff", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 16, fontWeight: 900, cursor: "pointer" }}>
                🌙 꿈해몽 30일 이용권 ₩990
              </button>
            </div>

            {/* 다시 하기 */}
            {alreadyUsed && (
              <button onClick={() => { setStep("form"); setAlreadyUsed(false); setKeyword(""); setPhone(""); }}
                style={{ width: "100%", background: "transparent", border: "2px solid #e5e7eb", borderRadius: 12, padding: "12px 0", fontSize: 14, color: "#6b7280", cursor: "pointer", marginTop: 8 }}>
                다른 전화번호로 시도하기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
