"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PaidInfoInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthYear, setPartnerBirthYear] = useState("");
  const [partnerBirthMonth, setPartnerBirthMonth] = useState("");
  const [partnerBirthDay, setPartnerBirthDay] = useState("");
  const [partnerBirthHour, setPartnerBirthHour] = useState("");
  const [partnerBirthMinute, setPartnerBirthMinute] = useState("");

  useEffect(() => {
    setName("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setBirthHour("");
    setBirthMinute("");
    setPartnerName("");
    setPartnerBirthYear("");
    setPartnerBirthMonth("");
    setPartnerBirthDay("");
    setPartnerBirthHour("");
    setPartnerBirthMinute("");
  }, []);

  useEffect(() => {
    const packageFromUrl = searchParams.get("package") || "";
    if (packageFromUrl) {
      setSelectedPackage(decodeURIComponent(packageFromUrl));
    }
  }, [searchParams]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleAnalysis = async () => {
    if (
      !name ||
      !birthYear ||
      !birthMonth ||
      !birthDay ||
      birthHour === "" ||
      birthMinute === ""
    ) {
      alert("모든 필수 정보를 입력해주세요!");
      return;
    }

    if (selectedPackage === "VIP 커플팩") {
      if (
        !partnerName ||
        !partnerBirthYear ||
        !partnerBirthMonth ||
        !partnerBirthDay ||
        partnerBirthHour === "" ||
        partnerBirthMinute === ""
      ) {
        alert("상대방의 모든 정보를 입력해주세요!");
        return;
      }
    }

    setIsLoading(true);

    try {
      const birthDate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

      const res = await fetch('/api/v2/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          birth: birthDate,
          birthHour: birthHour === 'unknown' ? 'unknown' : String(birthHour).padStart(2, '0'),
          gender: 'N',
          relationship: 'solo',
          category: '🌟 오늘의 운세',
          planType: 'paid',
        }),
      });

      if (!res.ok) {
        alert('분析 실패. 다시 시도해주세요.');
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      const PKG_NAMES = ['기본 분析', '베이직', '프리미엄', 'VIP 커플팩'];
      const plan = PKG_NAMES.includes(selectedPackage) ? 'package' : 'select';
      const profile = { name, birthYear, birthMonth, birthDay, birthHour, gender: 'N', relationship: 'solo' };
      const result = { ...data, profile, histId: Date.now(), savedAt: new Date().toISOString() };

      const PKG_PRICE_MAP: Record<string, string> = {
        '기본 분析': '9900',
        '베이직': '19900',
        '프리미엄': '24900',
        'VIP 커플팩': '29900',
      };
      const price = PKG_PRICE_MAP[selectedPackage] ?? '9900';

      sessionStorage.setItem('v2_result', JSON.stringify(result));
      sessionStorage.setItem('v2_paid', '1');
      sessionStorage.setItem('v2_plan', plan);
      sessionStorage.setItem('selectedPackage', selectedPackage);
      sessionStorage.setItem('price', price);

      router.push('/main-v2/result');
    } catch (error) {
      console.error('분析 오류:', error);
      alert('분析 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
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
              점운 분석
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#f5f5f5",
                fontWeight: 700,
                margin: 0,
              }}
            >
              당신의 정보를 입력해주세요
            </p>
          </div>

          <div
            style={{
              background: "rgba(108,64,200,0.3)",
              padding: 24,
              borderRadius: 12,
              marginBottom: 24,
              border: "1px solid rgba(251,191,36,0.3)",
            }}
          >
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "2px solid rgba(251,191,36,0.5)" }}>
              <h3 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, marginBottom: 16 }}>본인 정보</h3>

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
                  이름
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
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
                  생년월일
                </label>

                <input
                  type="number"
                  placeholder="연도를 입력하세요 (예: 1990)"
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
                  <option value="">월선택</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}월
                    </option>
                  ))}
                </select>

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
                  <option value="">일선택</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}일
                    </option>
                  ))}
                </select>

                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(e.target.value)}
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
                  <option value="">시간선택</option>
                  <option value="unknown">모름</option>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {String(hour).padStart(2, "0")}시
                    </option>
                  ))}
                </select>

                <select
                  value={birthMinute}
                  onChange={(e) => setBirthMinute(e.target.value)}
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
                  <option value="">분선택</option>
                  {minutes.map((minute) => (
                    <option key={minute} value={minute}>
                      {String(minute).padStart(2, "0")}분
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedPackage === "VIP 커플팩" && (
              <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "2px solid rgba(251,191,36,0.5)" }}>
                <h3 style={{ color: "#fbbf24", fontSize: 14, fontWeight: 900, marginBottom: 16 }}>상대방 정보</h3>

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
                    상대방 이름
                  </label>
                  <input
                    type="text"
                    placeholder="상대방 이름을 입력하세요"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
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
                    상대방 생년월일
                  </label>

                  <input
                    type="number"
                    placeholder="연도를 입력하세요 (예: 1990)"
                    value={partnerBirthYear}
                    onChange={(e) => setPartnerBirthYear(e.target.value)}
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

                  <select
                    value={partnerBirthMonth}
                    onChange={(e) => setPartnerBirthMonth(e.target.value)}
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
                    <option value="">월선택</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}월
                      </option>
                    ))}
                  </select>

                  <select
                    value={partnerBirthDay}
                    onChange={(e) => setPartnerBirthDay(e.target.value)}
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
                    <option value="">일선택</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}일
                      </option>
                    ))}
                  </select>

                  <select
                    value={partnerBirthHour}
                    onChange={(e) => setPartnerBirthHour(e.target.value)}
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
                    <option value="">시간선택</option>
                    <option value="unknown">모름</option>
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>
                        {String(hour).padStart(2, "0")}시
                      </option>
                    ))}
                  </select>

                  <select
                    value={partnerBirthMinute}
                    onChange={(e) => setPartnerBirthMinute(e.target.value)}
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
                    <option value="">분선택</option>
                    {minutes.map((minute) => (
                      <option key={minute} value={minute}>
                        {String(minute).padStart(2, "0")}분
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleAnalysis}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: 16,
                background: isLoading ? "rgba(251,191,36,0.5)" : "linear-gradient(135deg, #fbbf24, #f59e0b)",
                color: "#1a1a1a",
                border: "none",
                borderRadius: 10,
                fontWeight: 900,
                fontSize: 16,
                cursor: isLoading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {isLoading ? "분석 중..." : "분석 시작"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}