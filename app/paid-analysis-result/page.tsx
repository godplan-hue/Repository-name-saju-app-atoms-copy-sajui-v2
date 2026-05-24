"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PaidAnalysisResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paidInfo, setPaidInfo] = useState<any>(null);
  const [packageName, setPackageName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const infoStr = localStorage.getItem("paidAnalysisInfo");
    const pkg = searchParams.get("package") || "베이직";

    if (infoStr) {
      setPaidInfo(JSON.parse(infoStr));
    }
    setPackageName(pkg);
  }, [searchParams]);

  const getAnalysisData = () => {
    const name = paidInfo?.name || "사용자";
    const hasTime = paidInfo?.birthTime && paidInfo.birthTime !== "00:00";

    return {
      nameAnalysis: `"${name}"은(는) 밝고 긍정적인\n에너지를 가진 이름입니다.\n\n각 글자가 지닌 뜻을 통해\n당신의 성격과 운명을 알 수 있습니다.\n\n주변 사람들에게 좋은 영향을 미치며,\n친화력이 우수합니다.`,
      wealthLuck: `재물운은 매우 우호적입니다.\n\n투자와 사업에 좋은 운을 타고 있으며,\n올해는 경제적 성장이 예상됩니다.`,
      loveLuck: `연애운은 긍정적입니다.\n\n새로운 인연을 만날 가능성이 높으며,\n기존 관계는 더욱 돈독해질 것입니다.`,
      yearlyLuck: `올해 운세는 매우 긍정적입니다.\n\n새로운 기회와 도전이 많을 것이며,\n성공의 가능성이 높습니다.`,
      monthlyLuck: `1월: 새로운 시작의 달\n2월: 준비와 계획의 달\n3월: 실행과 실현의 달\n\n(매월 다양한 변화가 예상됩니다)`,

      healthLuck: `건강운은 안정적입니다.\n\n규칙적인 운동과 식단 관리로\n더욱 건강한 한 해를 보낼 수 있습니다.`,
      couple: `궁합 분석 결과 매우 좋습니다.\n\n상호 존중과 이해가 바탕이 되어\n행복한 관계를 유지할 수 있습니다.`,
      fullAnalysis: `사주는 매우 특별합니다.\n\n음양오행의 조화가 잘 이루어져 있으며,\n인생의 모든 분야에서 발전이 예상됩니다.`,
    };
  };

  const getDisplayItems = () => {
    const data = getAnalysisData();
    const hasTime = paidInfo?.birthTime && paidInfo.birthTime !== "00:00";

    let items = [];

    if (hasTime) {
      items.push(
        { key: "nameAnalysis", label: "📝 이름분석", value: data.nameAnalysis },
        { key: "wealthLuck", label: "💎 재물운", value: data.wealthLuck },
        { key: "loveLuck", label: "💕 연애운", value: data.loveLuck },
        { key: "yearlyLuck", label: "☀️ 올해 운세", value: data.yearlyLuck },
        { key: "monthlyLuck", label: "🌙 월별 운세", value: data.monthlyLuck }
      );
    }

    items.push(
      { key: "healthLuck", label: "🌿 건강운", value: data.healthLuck },
      { key: "couple", label: "👫 궁합분석", value: data.couple },
      {
        key: "fullAnalysis",
        label: "💎 전체 사주분석",
        value: data.fullAnalysis,
      }
    );

    return items;
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const pdfContent = document.createElement("div");
      pdfContent.style.width = "210mm";
      pdfContent.style.height = "297mm";
      pdfContent.style.padding = "0";
      pdfContent.style.margin = "0";
      pdfContent.style.border = "none";
      pdfContent.style.background = "linear-gradient(135deg, #fffacd 0%, #ffffe0 100%)";
      pdfContent.style.fontFamily = "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
      pdfContent.style.color = "#333";
      pdfContent.style.display = "flex";
      pdfContent.style.flexDirection = "column";
      pdfContent.style.justifyContent = "center";
      pdfContent.style.alignItems = "center";
      pdfContent.style.position = "absolute";
      pdfContent.style.left = "-9999px";
      pdfContent.style.boxSizing = "border-box";

      const page1 = document.createElement("div");
      page1.style.width = "100%";
      page1.style.height = "100%";
      page1.style.display = "flex";
      page1.style.flexDirection = "column";
      page1.style.justifyContent = "center";
      page1.style.alignItems = "center";
      page1.style.textAlign = "center";
      page1.style.background = "linear-gradient(135deg, #fffacd 0%, #ffffe0 100%)";
      page1.style.padding = "0";
      page1.style.margin = "0";
      page1.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 10px;">🔮</div>
        <h1 style="font-size: 36px; font-weight: 900; margin: 5px 0;">점운</h1>
        <p style="font-size: 16px; font-weight: 700; margin: 10px 0 5px 0;">${paidInfo?.name || "사용자"}님의 사주 분석</p>
        <p style="font-size: 14px; font-weight: 700; margin: 0;">${packageName} 패키지</p>
      `;
      pdfContent.appendChild(page1);
      document.body.appendChild(pdfContent);

      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        backgroundColor: "#fffacd",
        logging: false,
        useCORS: true,
      });

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

      const items = getDisplayItems();
      for (let i = 0; i < items.length; i++) {
        pdf.addPage();
        const pageContent = document.createElement("div");
        pageContent.style.width = "210mm";
        pageContent.style.height = "297mm";
        pageContent.style.padding = "15mm";
        pageContent.style.margin = "0";
        pageContent.style.border = "none";
        pageContent.style.background = "linear-gradient(135deg, #fff8dc 0%, #fffacd 100%)";
        pageContent.style.fontFamily = "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
        pageContent.style.color = "#333";
        pageContent.style.position = "absolute";
        pageContent.style.left = "-9999px";
        pageContent.style.boxSizing = "border-box";
        pageContent.style.display = "flex";
        pageContent.style.flexDirection = "column";
        pageContent.style.overflow = "hidden";

        pageContent.innerHTML = `
          <h2 style="font-size: 20px; font-weight: 900; margin: 0 0 12px 0; border-bottom: 2px solid #ffd700; padding-bottom: 8px;">
            ${items[i].label}
          </h2>
          <p style="font-size: 13px; font-weight: 700; line-height: 1.7; color: #333; margin: 0; white-space: pre-wrap; flex: 1;">
            ${items[i].value}
          </p>
          <p style="font-size: 9px; font-weight: 700; color: #888; text-align: right; margin-top: 10px;">
            점운 AI 사주 분석 | ${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월
          </p>
        `;

        document.body.appendChild(pageContent);
        const pageCanvas = await html2canvas(pageContent, {
          scale: 2,
          backgroundColor: "#fffacd",
          logging: false,
          useCORS: true,
        });

        const pageImgData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageImgData, "PNG", 0, 0, 210, 297);
        document.body.removeChild(pageContent);
      }

      pdf.save(`점운_${paidInfo?.name || "사용자"}_${packageName}_분석.pdf`);
      document.body.removeChild(pdfContent);
      alert("PDF가 다운로드되었습니다!");
    } catch (error) {
      alert("PDF 생성 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const displayItems = getDisplayItems();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fffacd 0%, #ffffe0 100%)",
        color: "#333",
        fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "40px 16px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
          {/* 제목 */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 70, marginBottom: 16, filter: "brightness(0.9)" }}>🔮</div>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 36px)",
                fontWeight: 900,
                marginBottom: 12,
                color: "#1a1a1a",
              }}
            >
              {paidInfo?.name || "사용자"}님의 사주 분석
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#555",
                fontWeight: 700,
                margin: 0,
              }}
            >
              {packageName} 패키지
            </p>
          </div>

          {/* 정보 박스 */}
          <div
            style={{
              background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 24,
              border: "2px solid rgba(139,92,246,0.4)",
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "#333",
                fontWeight: 700,
                margin: "0 0 12px 0",
              }}
            >
              📅 생년월일: {paidInfo?.birthDate}
            </p>
            {paidInfo?.birthTime && paidInfo.birthTime !== "00:00" && (
              <p
                style={{
                  fontSize: 13,
                  color: "#333",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                🕐 태어난 시간: {paidInfo.birthTime}
              </p>
            )}
          </div>

          {/* 분석 결과 */}
          {displayItems.map((item) => (
            <div
              key={item.key}
              style={{
                background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
                padding: 20,
                borderRadius: 12,
                marginBottom: 16,
                border: "2px solid rgba(255,215,0,0.4)",
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#1a1a1a",
                  margin: "0 0 12px 0",
                  borderBottom: "2px solid #ffd700",
                  paddingBottom: 8,
                }}
              >
                {item.label}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#333",
                  lineHeight: 1.8,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}

          {/* 버튼 그룹 */}
          <div style={{ marginTop: 32 }}>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              style={{
                width: "100%",
                padding: 14,
                background: "linear-gradient(135deg, #ff1493, #ff69b4)",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontWeight: 900,
                fontSize: 15,
                cursor: isGenerating ? "not-allowed" : "pointer",
                marginBottom: 12,
                opacity: isGenerating ? 0.6 : 1,
              }}
            >
              📥 {isGenerating ? "PDF 생성 중..." : "PDF 다운로드"}
            </button>

            <button
              onClick={() => router.push("/")}
              style={{
                width: "100%",
                padding: 14,
                background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
                color: "#333",
                border: "2px solid rgba(139,92,246,0.6)",
                borderRadius: 10,
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ← 홈으로
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}