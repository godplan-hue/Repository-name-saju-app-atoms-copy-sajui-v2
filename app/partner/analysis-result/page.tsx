"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PartnerAnalysisResult() {
  const router = useRouter();
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [packageType, setPackageType] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("name");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const result = sessionStorage.getItem("analysisResult");
    const name = sessionStorage.getItem("analysisName");
    const pkg = sessionStorage.getItem("selectedPackage");

    if (!result) {
      router.push("/partner/create-analysis");
      return;
    }

    setAnalysisResults(JSON.parse(result));
    setCustomerName(name || "고객");
    setPackageType(pkg || "기본 분석");
    // 결과지에 점운 대신 표시할 파트너 상호명
    setBusinessName(localStorage.getItem("partnerBusinessName") || "");
  }, [router]);

  const tabs = [
    { key: "name", label: "이름 분석", data: analysisResults?.name },
    { key: "wealth", label: "재운", data: analysisResults?.wealthLuck },
    { key: "love", label: "애정운", data: analysisResults?.loveLuck },
    { key: "health", label: "건강운", data: analysisResults?.healthLuck },
    { key: "couple", label: "궁합", data: analysisResults?.couple },
    { key: "yearly", label: "연운", data: analysisResults?.yearlyLuck },
    { key: "monthly", label: "월운", data: analysisResults?.monthlyLuck },
    { key: "full", label: "전체 분석", data: analysisResults?.fullAnalysis },
  ];

  const handleSaveImage = async () => {
    if (!analysisResults) return;

    setIsGenerating(true);

    try {
      const html2canvas = (await import("html2canvas")).default;

      const sectionTabs = packageType === "기본" || packageType === "베이직"
        ? [
            { label: "이름 분석", data: analysisResults.name },
            { label: "전체 분석", data: analysisResults.fullAnalysis },
          ]
        : [
            { label: "이름 분석", data: analysisResults.name },
            { label: "재운", data: analysisResults.wealthLuck },
            { label: "애정운", data: analysisResults.loveLuck },
            { label: "건강운", data: analysisResults.healthLuck },
          ];

      let htmlContent = `
        <div style="width: 800px; background: #FFD700; padding: 50px 40px; text-align: center; box-sizing: border-box;">
          <div style="font-size: 60px; margin-bottom: 20px;">🔮</div>
          <h1 style="font-size: 36px; font-weight: 900; margin: 0 0 10px; color: #1a1a1a;">${businessName || "사주 분석"}</h1>
          <p style="font-size: 16px; font-weight: 700; margin: 0; color: #666;">${customerName}님 · ${packageType} 결과지</p>
        </div>
      `;

      sectionTabs.forEach((tab) => {
        htmlContent += `
          <div style="width: 800px; background: #FFD700; padding: 30px 40px; box-sizing: border-box;">
            <h2 style="font-size: 22px; font-weight: 900; color: #1a1a1a; margin: 0 0 16px;">${tab.label}</h2>
            <div style="background: #FFFACD; padding: 24px; border-radius: 8px; box-sizing: border-box;">
              <p style="font-size: 14px; font-weight: 600; line-height: 1.8; color: #333; white-space: pre-wrap; margin: 0; word-break: break-word;">${tab.data || "분석 결과를 불러올 수 없습니다"}</p>
            </div>
          </div>
        `;
      });

      htmlContent += `
        <div style="width: 800px; background: #FFD700; padding: 40px; text-align: center; box-sizing: border-box;">
          <div style="background: #FFFACD; padding: 40px; border-radius: 8px; box-sizing: border-box;">
            <p style="font-size: 24px; font-weight: 900; color: #1a1a1a; margin: 0 0 16px;">감사합니다</p>
            <p style="font-size: 15px; font-weight: 700; color: #333; margin: 0 0 20px; line-height: 1.8;">
              ${customerName}님의 사주 분석을 위해<br/>${businessName || "저희 사주 서비스"}를 이용해주셔서 진심으로 감사합니다.
            </p>
            <p style="font-size: 12px; color: #666; margin: 0;">사주 궁금하면 다시 방문해주세요</p>
          </div>
        </div>
      `;

      const element = document.createElement("div");
      element.innerHTML = htmlContent;
      element.style.position = "fixed";
      element.style.top = "-99999px";
      element.style.left = "0";
      document.body.appendChild(element);

      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: "#FFD700" });
        const link = document.createElement("a");
        link.download = `사주_${customerName}_${packageType}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        alert("이미지가 다운로드되었습니다");
      } finally {
        document.body.removeChild(element);
      }
    } catch (error) {
      console.error("이미지 생성 오류:", error);
      alert("이미지 생성 중 오류가 발생했습니다");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>분석 결과 - 사주 궁금하면</title>
      </Head>

      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
          color: "#333",
          fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
          padding: "20px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ textAlign: "center", color: "#d4af37", marginBottom: 30, fontSize: "36px", fontWeight: 900, marginTop: 0 }}>
            🔮 {businessName || "분석 결과"}
          </h1>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: isMobile ? "25px" : "50px",
              borderRadius: "12px",
            }}
          >
            <div style={{ marginBottom: "30px" }}>
              <h2 style={{ color: "#d4af37", fontSize: "24px", fontWeight: 900, marginBottom: "10px", marginTop: 0 }}>
                🎯 {customerName}님의
              </h2>
              <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>
                상품: {packageType}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "20px",
                overflowX: "auto",
                paddingBottom: "10px",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCurrentTab(tab.key)}
                  style={{
                    padding: "8px 16px",
                    background: currentTab === tab.key ? "#d4af37" : "#e8e8e8",
                    color: currentTab === tab.key ? "white" : "#333",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "30px",
                border: "2px solid rgba(255,215,0,0.6)",
                minHeight: "200px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 900,
                  color: "#FF6B6B",
                  margin: "0 0 12px 0",
                  borderBottom: "2px solid #FF6B6B",
                  paddingBottom: "8px",
                }}
              >
                {tabs.find((t) => t.key === currentTab)?.label}
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#333",
                  margin: 0,
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                  wordBreak: "keep-all",
                }}
              >
                {tabs.find((t) => t.key === currentTab)?.data || "분석 결과를 불러올 수 없습니다..."}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                onClick={handleSaveImage}
                disabled={isGenerating}
                style={{
                  padding: "16px",
                  background: isGenerating ? "#ccc" : "linear-gradient(135deg, #ff1493, #ff69b4)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 900,
                  fontSize: "15px",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  opacity: isGenerating ? 0.6 : 1,
                }}
              >
                🖼️ {isGenerating ? "생성 중..." : "이미지 저장"}
              </button>

              <button
                onClick={() => router.push("/partner/create-analysis")}
                style={{
                  padding: "16px",
                  background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
                  color: "#333",
                  border: "2px solid rgba(139,92,246,0.6)",
                  borderRadius: "10px",
                  fontWeight: 900,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                🔄 새로 분석
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}