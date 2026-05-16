"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PaymentComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packageName, setPackageName] = useState("");
  const [pages, setPages] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const pkg = searchParams.get("package") || "베이직";
    const pg = searchParams.get("pages") || "75";
    setPackageName(pkg);
    setPages(parseInt(pg));
  }, [searchParams]);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // PDF 콘텐츠 생성
      const pdfContent = document.createElement("div");
      pdfContent.style.width = "210mm";
      pdfContent.style.height = "297mm";
      pdfContent.style.padding = "20mm";
      pdfContent.style.background = "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
      pdfContent.style.fontFamily = "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
      pdfContent.style.color = "#333";
      pdfContent.style.display = "flex";
      pdfContent.style.flexDirection = "column";
      pdfContent.style.justifyContent = "center";
      pdfContent.style.alignItems = "center";
      pdfContent.style.position = "absolute";
      pdfContent.style.left = "-9999px";

      // 페이지 1: 표지
      const page1 = document.createElement("div");
      page1.style.width = "100%";
      page1.style.height = "100%";
      page1.style.display = "flex";
      page1.style.flexDirection = "column";
      page1.style.justifyContent = "center";
      page1.style.alignItems = "center";
      page1.style.textAlign = "center";
      page1.style.background = "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
      page1.innerHTML = `
        <div style="font-size: 48px; font-weight: 900; margin-bottom: 20px; color: #1a1a1a;">🔮</div>
        <h1 style="font-size: 42px; font-weight: 900; margin-bottom: 10px; color: #1a1a1a;">점운</h1>
        <p style="font-size: 24px; font-weight: 700; margin-bottom: 40px; color: #333;">당신의 운명을 분석합니다</p>
        <p style="font-size: 18px; font-weight: 700; color: #555;">${packageName} 패키지</p>
        <p style="font-size: 16px; font-weight: 700; color: #666; margin-top: 30px;">${pages}페이지 분석</p>
      `;
      pdfContent.appendChild(page1);
      document.body.appendChild(pdfContent);

      // Canvas로 변환
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        backgroundColor: "#ffd700",
        logging: false,
      });

      // PDF 생성
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

      // 추가 페이지들 (샘플 콘텐츠)
      for (let i = 2; i <= Math.min(pages, 10); i++) {
        pdf.addPage();
        const pageContent = document.createElement("div");
        pageContent.style.width = "210mm";
        pageContent.style.height = "297mm";
        pageContent.style.padding = "20mm";
        pageContent.style.background = "linear-gradient(135deg, #fff8dc 0%, #fffacd 100%)";
        pageContent.style.fontFamily = "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
        pageContent.style.color = "#333";
        pageContent.style.position = "absolute";
        pageContent.style.left = "-9999px";

        pageContent.innerHTML = `
          <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 20px; color: #1a1a1a; border-bottom: 3px solid #ffd700; padding-bottom: 10px;">
            페이지 ${i}. 당신의 운세 분석
          </h2>
          <p style="font-size: 14px; font-weight: 700; line-height: 1.8; color: #333; margin-bottom: 15px;">
            당신의 사주에는 깊은 의미와 메시지가 담겨 있습니다.
            음양오행의 원리와 천간지지의 배합을 통해,
            당신의 성격, 재능, 그리고 삶의 방향성을 읽어낼 수 있습니다.
          </p>
          <div style="background: rgba(255, 215, 0, 0.2); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <p style="font-size: 13px; font-weight: 700; color: #555; margin: 0;">
              ✨ 이 분석은 AI 기술과 전통 사주 학문을 결합하여 만들어졌습니다.
            </p>
          </div>
          <p style="font-size: 12px; font-weight: 700; color: #888; text-align: right; margin-top: 40px;">
            점운 AI 사주 분석 | ${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월
          </p>
        `;

        document.body.appendChild(pageContent);
        const pageCanvas = await html2canvas(pageContent, {
          scale: 2,
          backgroundColor: "#fffacd",
          logging: false,
        });

        const pageImgData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageImgData, "PNG", 0, 0, 210, 297);
        document.body.removeChild(pageContent);
      }

      // PDF 다운로드
      pdf.save(`점운_${packageName}_분석.pdf`);
      
      document.body.removeChild(pdfContent);
      alert("PDF가 다운로드되었습니다!");
    } catch (error) {
      alert("PDF 생성 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: "url('https://images.unsplash.com/photo-1711510778620-0f287fb5500f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, padding: "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>✅</div>
          
          <h1 style={{ color: "#fbbf24", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 900, marginBottom: 16 }}>결제 완료!</h1>
          
          <p style={{ color: "#f5f5f5", fontSize: 16, fontWeight: 700, marginBottom: 24, lineHeight: 1.8 }}>
            <span style={{ color: "#fbbf24", fontWeight: 900 }}>{packageName}</span> 패키지 결제가<br/>
            완료되었습니다!
          </p>

          <div style={{ background: "rgba(108,64,200,0.9)", padding: 24, borderRadius: 12, marginBottom: 24 }}>
            <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 700, margin: "0 0 12px 0" }}>📊 결제 정보</p>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: "0 0 8px 0" }}>패키지: <span style={{ fontWeight: 900 }}>{packageName}</span></p>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: "0 0 8px 0" }}>페이지: <span style={{ fontWeight: 900 }}>{pages}페이지</span></p>
            <p style={{ color: "#f5f5f5", fontSize: 13, fontWeight: 700, margin: 0 }}>상태: <span style={{ color: "#90EE90", fontWeight: 900 }}>완료</span></p>
          </div>

          <button onClick={handleDownload} disabled={isGenerating} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: isGenerating ? "not-allowed" : "pointer", marginBottom: 12, opacity: isGenerating ? 0.6 : 1 }}>📥 {isGenerating ? "PDF 생성 중..." : "PDF 다운로드"}</button>

          <button onClick={handleHome} style={{ width: "100%", padding: 14, background: "rgba(139,92,246,0.3)", color: "#f5f5f5", border: "1px solid rgba(139,92,246,0.8)", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: "pointer" }}>← 홈으로 돌아가기</button>

          <p style={{ color: "#999999", fontSize: 12, fontWeight: 700, marginTop: 24 }}>이메일로 영수증이 발송되었습니다.</p>
        </div>
      </div>
    </main>
  );
}