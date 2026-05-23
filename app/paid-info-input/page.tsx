"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PaidInfoInput() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");

  // 월 옵션 (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 일 옵션 (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 시간 옵션 (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // 분 옵션 (0-59, 5분 단위)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleAnalysis = () => {
    if (
      !name ||
      !birthYear ||
      !birthMonth ||
      !birthDay ||
      birthHour === "" ||
      birthMinute === ""
    ) {
      alert("모든 정보를 선택해주세요!");
      return;
    }

    // 데이터 포맷
    const birthDate = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;
    const birthTime = `${String(birthHour).padStart(2, "0")}:${String(birthMinute).padStart(2, "0")}`;

    // localStorage에 저장
    localStorage.setItem(
      "paidAnalysisInfo",
      JSON.stringify({
        name,
        birthDate,
        birthTime,
      })
    );

    // 분석 결과 페이지로 이동
    router.push("/paid-analysis-result");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
        padding: "40px 16px",
        fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 500, width: "100%" }}>
          {/* 제목 */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔮</div>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 36px)",
                fontWeight: 900,
                marginBottom: 12,
                color: "#fbbf24",
              }}
            >
              유료 분석
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#f5f5f5",
                fontWeight: 700,
                margin: 0,
              }}
            >
              당신의 상세한 사주 정보를 입력해주세요
            </p>
          </div>

          {/* 입력 폼 */}
          <div
            style={{
              background: "rgba(108,64,200,0.3)",
              padding: 24,
              borderRadius: 12,
              marginBottom: 24,
              border: "1px solid rgba(251,191,36,0.3)",
            }}
          >
            {/* 이름 입력 */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fbbf24",
                  marginBottom: 8,
                }}
              >
                👤 이름
              </label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #fbbf24",
                  background: "#fff",
                  color: "#333",
                  fontSize: 14,
                  fontWeight: 700,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* 생년월일 */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fbbf24",
                  marginBottom: 8,
                }}
              >
                📅 생년월일
              </label>

              {/* 연도 입력 */}
              <input
                type="number"
                placeholder="태어난 년도 (예: 1990)"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                min="1900"
                max={new Date().getFullYear()}
                style={{
                  width: "100%",
                  padding: 12,
                  marginBottom: 10,
                  borderRadius: 8,
                  border: "1px solid #fbbf24",
                  background: "#fff",
                  color: "#333",
                  fontSize: 14,
                  fontWeight: 700,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />

              {/* 월 선택 */}
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                style={{
                  width: "48%",
                  padding: 12,
                  marginRight: "4%",
                  marginBottom: 10,
                  borderRadius: 8,
                  border: "1px solid #fbbf24",
                  background: "#fff",
                  color: "#333",
                  fontSize: 14,
                  fontWeight: 700,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">월 선택</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>

              {/* 일 선택 */}
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                style={{
                  width: "48%",
                  padding: 12,
                  marginBottom: 10,
                  borderRadius: 8,
                  border: "1px solid #fbbf24",
                  background: "#fff",
                  color: "#333",
                  fontSize: 14,
                  fontWeight: 700,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">일 선택</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}일
                  </option>
                ))}
              </select>
            </div>

            {/* 태어난 시간 */}
            <div style={{ marginBottom: 0 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fbbf24",
                  marginBottom: 8,
                }}
              >
                🕐 태어난 시간
              </label>

              {/* 시간 선택 */}
              <select
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                style={{
                  width: "48%",
                  padding: 12,
                  marginRight: "4%",
                  borderRadius: 8,
                  border: "1px solid #fbbf24",
                  background: "#fff",
                  color: "#333",
                  fontSize: 14,
                  fontWeight: 700,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">시간</option>
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {String(hour).padStart(2, "0")}시
                  </option>
                ))}
              </select>

              {/* 분 선택 */}
              <select
                value={birthMinute}
                onChange={(e) => setBirthMinute(e.target.value)}
                style={{
                  width: "48%",
                  borderRadius: 8,
                  border: "1px solid #fbbf24",
                  background: "#fff",
                  color: "#333",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: 12,
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">분</option>
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {String(minute).padStart(2, "0")}분
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 분석 시작 버튼 */}
          <button
            onClick={handleAnalysis}
            style={{
              width: "100%",
              padding: 14,
              background: "linear-gradient(135deg, #ff1493, #ff69b4)",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
              marginBottom: 12,
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(255, 20, 147, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            분석 시작하기 ✨
          </button>

          {/* 홈으로 돌아가기 버튼 */}
          <button
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              padding: 14,
              background: "rgba(139,92,246,0.3)",
              color: "#f5f5f5",
              border: "1px solid rgba(139,92,246,0.8)",
              borderRadius: 10,
              fontWeight: 900,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            ← 홈으로
          </button>

          {/* 정보 박스 */}
          <div
            style={{
              background: "#fff3cd",
              padding: "18px 16px",
              borderRadius: 8,
              marginTop: 28,
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#333",
                fontSize: "13px",
                fontWeight: 700,
                lineHeight: 1.5,
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              ✨ 정확한 정보 입력으로
더 자세한 분석을 받으세요! 🔮
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}