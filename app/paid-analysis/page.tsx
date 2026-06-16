"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaidAnalysis() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const storedResult = localStorage.getItem("analysisResult");
    if (storedResult) {
      setAnalysisResult(JSON.parse(storedResult));
    }
  }, []);

  const handleDownloadPDF = () => {
    alert("📄 PDF 다운로드 준비 중입니다.\n(준비 예정)");
  };

  const handleShare = () => {
    const shareText = `유료 사주 분석 결과를 확인해보세요! 🔮\n\n점운 - 사주 분석\n${typeof window !== 'undefined' ? window.location.origin : ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: "유료 사주 분석",
        text: shareText,
        url: typeof window !== 'undefined' ? window.location.href : '',
      }).catch(err => console.log('Share error:', err));
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("✅ 공유 내용이 복사되었습니다!");
      }).catch(() => {
        alert(shareText);
      });
    }
  };

  if (!mounted) return null;

  const result = analysisResult || {
    name: "분석 결과",
    wealthLuck: "상세 분석 내용",
    loveLuck: "상세 분석 내용",
    healthLuck: "상세 분석 내용",
    couple: "상세 분석 내용",
    yearlyLuck: "상세 분석 내용",
    monthlyLuck: "상세 분석 내용",
    fullAnalysis: "상세 분석 내용"
  };

  return (
    <>
      <Head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="ko-KR" />
      </Head>
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)", color: "#333", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 10, padding: isMobile ? "20px 16px" : "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "900px", margin: "0 auto", width: "100%" }}>
            <h1 style={{ textAlign: "center", color: "#d4af37", marginBottom: isMobile ? 25 : 40, fontSize: isMobile ? "26px" : "36px", fontWeight: 900, marginTop: 0 }}>🔮 유료 사주 분석</h1>

            <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: isMobile ? 25 : 50, borderRadius: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12, marginBottom: isMobile ? 25 : 35 }}>
                <button onClick={handleShare} style={{ padding: isMobile ? 13 : 16, background: "linear-gradient(135deg, #00bcd4, #0097a7)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>📱 공유하기</button>
                <button onClick={handleDownloadPDF} style={{ padding: isMobile ? 13 : 16, background: "linear-gradient(135deg, #ff9800, #f57c00)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>📄 PDF 저장</button>
              </div>

              <div id="result-content">
                <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                  <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>📝 이름 분석</h2>
                  <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: isMobile ? 1.0 : 1.2, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "break-word", wordWrap: "break-word", maxWidth: "100%" }}>{result.name}</p>
                </div>

                <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                  <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>💎 재물운</h2>
                  <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.wealthLuck}</p>
                </div>

                <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                  <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>💕 연애운</h2>
                  <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.loveLuck}</p>
                </div>

                <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                  <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🌿 건강운</h2>
                  <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.healthLuck}</p>
                </div>

                <div style={{ marginBottom: isMobile ? 35 : 45 }}>
                  <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>👫 궁합 분석</h2>
                  <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.couple}</p>
                </div>

                <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                  <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>☀️ 올해 운세</h2>
                  <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.yearlyLuck}</p>
                </div>

                <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                  <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🌙 월별 운세</h2>
                  <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.monthlyLuck}</p>
                </div>

                <div style={{ marginBottom: isMobile ? 35 : 45 }}>
                  <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🎋 전체 사주분석</h2>
                  <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.fullAnalysis}</p>
                </div>
              </div>

              <div style={{ background: "#fff3cd", padding: isMobile ? 18 : 22, borderRadius: 8, marginBottom: isMobile ? 20 : 28 }}>
                <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.8, marginTop: 0, marginBottom: 0, textAlign: "center" }}>✨ 유료 분석으로 더 자세한 정보를 확인하세요! 🔮</p>
              </div>

              <button onClick={() => router.push("/")} style={{ width: "100%", padding: isMobile ? 15 : 17, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 15 : 17, cursor: "pointer" }}>🏠 메인으로 돌아가기</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}