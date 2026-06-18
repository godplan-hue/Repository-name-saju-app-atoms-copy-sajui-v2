"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PartnerCreateAnalysis() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerTier, setPartnerTier] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "unknown",
    gender: "",
    packageType: "기본 분석",
  });

  const birthHours = [
    { label: "자시(子時)", value: "00" },
    { label: "축시(丑時)", value: "01" },
    { label: "인시(寅時)", value: "02" },
    { label: "묘시(卯時)", value: "03" },
    { label: "진시(辰時)", value: "04" },
    { label: "사시(巳時)", value: "05" },
    { label: "오시(午時)", value: "06" },
    { label: "미시(未時)", value: "07" },
    { label: "신시(申時)", value: "08" },
    { label: "유시(酉時)", value: "09" },
    { label: "술시(戌時)", value: "10" },
    { label: "해시(亥時)", value: "11" },
    { label: "모름", value: "unknown" },
  ];

  const packages = [
    { name: "기본 분석", price: "₩9,900", pages: "30페이지" },
    { name: "베이직", price: "₩19,900", pages: "75페이지" },
    { name: "프리미엄", price: "₩24,900", pages: "100페이지" },
    { name: "VIP 커플팩", price: "₩29,900", pages: "150페이지" },
  ];

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const id = localStorage.getItem("partnerId");
    const name = localStorage.getItem("partnerName");
    const tier = localStorage.getItem("partnerTier");

    if (!id) {
      router.push("/partner/login");
      return;
    }

    setPartnerId(id);
    setPartnerName(name || "");
    setPartnerTier(tier || "");
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async () => {
    if (!formData.customerName.trim()) {
      alert("고객 이름을 입력해주세요");
      return;
    }

    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      alert("생년월일을 입력해주세요");
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.customerName,
          email: formData.customerEmail,
          birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
          birthHour: formData.birthHour === "unknown" ? "unknown" : String(formData.birthHour).padStart(2, "0"),
          gender: formData.gender,
        }),
      });

      if (!response.ok) {
        alert("분석 중 오류가 발생했습니다");
        setAnalyzing(false);
        return;
      }

      const data = await response.json();

      console.log("API 응답:", data);

      // 분석 결과 저장
      if (data && data.result) {
        sessionStorage.setItem("analysisResult", JSON.stringify(data.result));
        sessionStorage.setItem("analysisName", formData.customerName);
        sessionStorage.setItem("selectedPackage", formData.packageType);

        console.log("sessionStorage 저장 완료");

        // 보관함에 영구 저장 — 고객이 "못받았다"고 하면 나중에 다시 꺼내 보낼 수 있어야 함
        fetch("/api/partner/archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partnerId,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
            birthHour: formData.birthHour,
            gender: formData.gender,
            packageType: formData.packageType,
            result: data.result,
          }),
        }).catch(err => console.error("보관함 저장 실패:", err));

        // 결과 페이지로 이동
        router.push("/partner/analysis-result");
      } else {
        alert("분석 결과를 받지 못했습니다");
        setAnalyzing(false);
      }
    } catch (error) {
      console.error("분석 오류:", error);
      alert("분석 중 오류가 발생했습니다");
      setAnalyzing(false);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <Head>
        <title>분석 생성 - 점운 파트너</title>
      </Head>

      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
          fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* 헤더 */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0, color: "#333" }}>
                🔮 {partnerName}님
              </h1>
              <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>
                {partnerTier} | 파트너 분석 생성
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => router.push("/partner/archive")}
              style={{
                padding: "10px 20px",
                background: "#eef0ff",
                color: "#667eea",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📁 보관함
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("partnerId");
                localStorage.removeItem("partnerName");
                localStorage.removeItem("partnerTier");
                router.push("/partner/login");
              }}
              style={{
                padding: "10px 20px",
                background: "#fee",
                color: "#c33",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              로그아웃
            </button>
            </div>
          </div>

          {/* 메인 폼 */}
          <div
            style={{
              background: "white",
              padding: isMobile ? "20px" : "40px",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: 900, marginTop: 0, marginBottom: "30px", color: "#333" }}>
              📋 고객 정보 입력
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
              {/* 고객 이름 */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "#333" }}>
                  👤 고객 이름 *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="고객 이름"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* 고객 이메일 */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "#333" }}>
                  📧 고객 이메일
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="customer@email.com"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* 고객 전화 */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "#333" }}>
                  📱 고객 전화
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="01012345678"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* 성별 */}
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, marginBottom: "8px", color: "#333" }}>
                  👥 성별 *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">선택하세요</option>
                  <option value="남">남성</option>
                  <option value="여">여성</option>
                </select>
              </div>
            </div>

            {/* 생년월일 */}
            <h3 style={{ fontSize: "16px", fontWeight: 900, marginBottom: "15px", color: "#333" }}>
              📅 생년월일 입력 *
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "30px" }}>
              <div>
                <input
                  type="number"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleInputChange}
                  placeholder="년(1990)"
                  min="1900"
                  max="2024"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">월</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {i + 1}월
                  </option>
                ))}
              </select>
              <select
                name="birthDay"
                value={formData.birthDay}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">일</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {i + 1}일
                  </option>
                ))}
              </select>
            </div>

            {/* 생시 */}
            <h3 style={{ fontSize: "16px", fontWeight: 900, marginBottom: "15px", color: "#333" }}>
              🕐 생시 선택
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "10px", marginBottom: "30px" }}>
              {birthHours.map((hour) => (
                <button
                  key={hour.value}
                  onClick={() => setFormData((prev) => ({ ...prev, birthHour: hour.value }))}
                  style={{
                    padding: "12px",
                    border: formData.birthHour === hour.value ? "3px solid #667eea" : "2px solid #ddd",
                    background: formData.birthHour === hour.value ? "#eef0ff" : "white",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    color: formData.birthHour === hour.value ? "#667eea" : "#333",
                  }}
                >
                  {hour.label}
                </button>
              ))}
            </div>

            {/* 패키지 선택 */}
            <h3 style={{ fontSize: "16px", fontWeight: 900, marginBottom: "15px", color: "#333" }}>
              📦 패키지 선택
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "15px", marginBottom: "30px" }}>
              {packages.map((pkg) => (
                <button
                  key={pkg.name}
                  onClick={() => setFormData((prev) => ({ ...prev, packageType: pkg.name }))}
                  style={{
                    padding: "20px",
                    border: formData.packageType === pkg.name ? "3px solid #667eea" : "2px solid #ddd",
                    background: formData.packageType === pkg.name ? "#eef0ff" : "white",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    color: formData.packageType === pkg.name ? "#667eea" : "#333",
                  }}
                >
                  <div style={{ fontWeight: 900, marginBottom: "5px" }}>{pkg.name}</div>
                  <div style={{ fontSize: "13px", opacity: 0.8 }}>{pkg.price}</div>
                  <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "5px" }}>{pkg.pages}</div>
                </button>
              ))}
            </div>

            {/* 분석 버튼 */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{
                width: "100%",
                padding: "16px",
                background: analyzing ? "#ccc" : "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 900,
                fontSize: "16px",
                cursor: analyzing ? "not-allowed" : "pointer",
                opacity: analyzing ? 0.7 : 1,
              }}
            >
              {analyzing ? "🔄 분석 중..." : "✨ 분석 시작"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}