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
  const [consentGiven, setConsentGiven] = useState(false);

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
    { name: "기본 분석", price: "₩9,900", desc: ["올해 운세", "+ 월별 운세"] },
    { name: "베이직", price: "₩19,900", desc: ["올해 운세", "+ 월별 운세", "+ 재물운", "+ 연애운"] },
    { name: "프리미엄", price: "₩24,900", desc: ["올해 운세", "+ 월별 운세", "+ 재물운", "+ 연애운", "+ 건강운"] },
    { name: "VIP 커플팩", price: "₩29,900", desc: ["이름분석", "+ 올해 운세", "+ 월별 운세", "+ 재물운", "+ 연애운", "+ 건강운", "+ 궁합분석", "+ 전체 사주분석"] },
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

    if (!consentGiven) {
      alert("고객 개인정보 수집·이용 동의를 받았는지 확인 체크박스를 선택해주세요");
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
          packageType: formData.packageType,
        }),
      });

      if (!response.ok) {
        alert("분석 중 오류가 발생했습니다");
        setAnalyzing(false);
        return;
      }

      const data = await response.json();

      console.log("API 응답:", data);

      // 분석 결과 저장 — 이 시점에 사용료가 즉시 계산·청구됨(보관함 저장과 동시)
      if (data && data.result) {
        const archiveRes = await fetch("/api/partner/archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partnerId,
            partnerName,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
            birthHour: formData.birthHour,
            gender: formData.gender,
            packageType: formData.packageType,
            result: data.result,
            consentGiven,
          }),
        });
        const archiveData = await archiveRes.json();
        if (!archiveRes.ok) {
          alert(archiveData.error || "보관함 저장에 실패했습니다.");
          setAnalyzing(false);
          return;
        }

        sessionStorage.setItem("analysisResult", JSON.stringify(data.result));
        sessionStorage.setItem("analysisName", formData.customerName);
        sessionStorage.setItem("selectedPackage", formData.packageType);

        const charge = archiveData.charge;
        if (charge) {
          alert(`분석 생성 완료!\n사용료 ₩${charge.totalCharge.toLocaleString()}이 청구되었습니다(부가세 포함).\n※ 현재는 시뮬레이션이며, 실제 결제 연동 전 단계입니다.`);
        }

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
          backgroundImage: "url('https://i.pinimg.com/736x/72/39/ee/7239eea54bdf83f4cd67072fd375f87a.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          padding: "20px",
          fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.65)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "1000px", margin: "0 auto" }}>
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
                {partnerTier} | 파트너<br/>분석<br/>생성
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => router.push("/partner")}
              style={{
                padding: "10px 20px",
                background: "#fdf2f8",
                color: "#db2777",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🏠 파트너 메인
            </button>
            <button
              onClick={() => router.push("/partner/upgrade")}
              style={{
                padding: "10px 20px",
                background: "#fff3e0",
                color: "#ff9500",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ⭐ 등급업그레이드
            </button>
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
              onClick={() => router.push("/partner/guide")}
              style={{
                padding: "10px 20px",
                background: "#f0fdf4",
                color: "#16a34a",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📘 운영 가이드
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
                  <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "6px" }}>{pkg.price}</div>
                  <div style={{ fontSize: "11px", opacity: 0.65, fontWeight: 600, lineHeight: 1.5 }}>
                    {pkg.desc.map((line, i) => (
                      <span key={i}>{line}{i < pkg.desc.length - 1 && <br/>}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* 고객 동의 확인 */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "20px", padding: "14px", background: "#f8f8ff", border: "2px solid #ddd", borderRadius: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                style={{ marginTop: "3px", width: "16px", height: "16px", flexShrink: 0 }}
              />
              <span style={{ fontSize: "13px", color: "#333", fontWeight: 600, lineHeight: 1.6 }}>
                이 고객으로부터 <b>개인정보</b><br/>
                <b>(이름, 생년월일, 연락처 등)</b><br/>
                <b>수집·이용에 대한</b><br/>
                <b>동의</b>를 직접 받았으며,<br/>
                이 정보가 분석 결과 생성을 위해<br/>
                점운(회사)에도 전달·저장됨을<br/>
                고객에게 안내했음을 확인합니다.
              </span>
            </label>

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