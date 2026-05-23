"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FreeAnalysis() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [usedFreeAnalysis, setUsedFreeAnalysis] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    gender: ""
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (e: PopStateEvent) => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (formData.name) {
      const used = localStorage.getItem(`freeAnalysis_${formData.name}`);
      setUsedFreeAnalysis(used === "true");
    }
  }, [formData.name]);

  const birthHours = [
    { label: "자시(子時)", value: "00", time: "23:00 ~ 01:00" },
    { label: "축시(丑時)", value: "01", time: "01:00 ~ 03:00" },
    { label: "인시(寅時)", value: "02", time: "03:00 ~ 05:00" },
    { label: "묘시(卯時)", value: "03", time: "05:00 ~ 07:00" },
    { label: "진시(辰時)", value: "04", time: "07:00 ~ 09:00" },
    { label: "사시(巳時)", value: "05", time: "09:00 ~ 11:00" },
    { label: "오시(午時)", value: "06", time: "11:00 ~ 13:00" },
    { label: "미시(未時)", value: "07", time: "13:00 ~ 15:00" },
    { label: "신시(申時)", value: "08", time: "15:00 ~ 17:00" },
    { label: "유시(酉時)", value: "09", time: "17:00 ~ 19:00" },
    { label: "술시(戌時)", value: "10", time: "19:00 ~ 21:00" },
    { label: "해시(亥時)", value: "11", time: "21:00 ~ 23:00" },
    { label: "모름", value: "unknown", time: "모르는 경우" }
  ];

  const backgroundImages: { [key: number]: string } = {
    1: "url('https://images.unsplash.com/photo-1627764574958-fb54cd7d7448?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFyb3R8ZW58MHx8MHx8fDA%3D')",
    2: "url('https://images.unsplash.com/photo-1598495494482-172d89ff078c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXlzdGljYWwlMjBhcnR8ZW58MHx8MHx8fDA%3D')",
    3: "url('https://images.unsplash.com/photo-1674598981784-947a1644b840?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNoaW5lc2UlMjBhc3Ryb2xvZ3l8ZW58MHx8MHx8fDA%3D')",
    4: "url('https://images.unsplash.com/photo-1616777103777-d11788eb26eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG9yYWNsZSUyMGNhcmRzfGVufDB8fDB8fHww')",
    5: "url('https://images.unsplash.com/photo-1621923647893-901f834b3e6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b3JhY2xlJTIwY2FyZHN8ZW58MHx8MHx8fDA%3D')",
    6: "url('https://images.unsplash.com/photo-1709141426613-27e8b5d55f13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvc21pYyUyMGRlc3Rpbnl8ZW58MHx8MHx8fDA%3D')"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const phoneOnly = value.replace(/[^0-9]/g, "");
      let formatted = phoneOnly;
      if (phoneOnly.length > 3 && phoneOnly.length <= 7) {
        formatted = phoneOnly.slice(0, 3) + "-" + phoneOnly.slice(3);
      } else if (phoneOnly.length > 7) {
        formatted = phoneOnly.slice(0, 3) + "-" + phoneOnly.slice(3, 7) + "-" + phoneOnly.slice(7, 11);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = () => {
    const currentStepData = {
      1: formData.name,
      2: formData.gender,
      3: formData.birthYear && formData.birthMonth && formData.birthDay,
      4: formData.birthHour,
      5: formData.email,
      6: formData.phone
    };

    if (!currentStepData[step as keyof typeof currentStepData]) {
      alert("정보를 입력해주세요");
      return;
    }

    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAnalyze = async () => {
    if (!formData.phone.trim()) {
      alert("전화번호를 입력해주세요");
      return;
    }

    if (usedFreeAnalysis) {
      alert(`❌ ${formData.name}님은 이미 무료 분석을 사용하셨습니다.\n\n유료 분석을 결제해주세요.`);
      return;
    }

    setAnalyzing(true);
    setStep(7);
    localStorage.setItem(`freeAnalysis_${formData.name}`, "true");
    setUsedFreeAnalysis(true);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
          birthHour: formData.birthHour,
          gender: formData.gender
        }),
      });

      if (!response.ok) {
        let errorMessage = "분석 중 오류가 발생했습니다.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const textError = await response.text();
          errorMessage = textError || response.statusText;
        }
        alert(errorMessage);
        setAnalyzing(false);
        setStep(6);
        return;
      }

      const data = await response.json();
      setAnalysisResult(data.result);
      setAnalyzing(false);
    } catch (error) {
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
      setAnalyzing(false);
      setStep(6);
    }
  };

  const handleShare = () => {
    const birthHourLabel = birthHours.find(h => h.value === formData.birthHour)?.label || '모름';
    const shareUrl = typeof window !== 'undefined' ? window.location.origin + "/free-analysis" : "/free-analysis";
    const shareText = `${formData.name}님의 무료 사주 분석 결과 🔮\n\n이름: ${formData.name}\n생년월일: ${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}\n생시: ${birthHourLabel}\n\n📱 나도 무료 사주 분석 받아보기!\n점운 - 무료 사주 분석\n\n${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: "무료 사주 분석",
        text: shareText,
        url: shareUrl,
      }).catch(err => console.log('Share error:', err));
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("✅ 공유 내용이 복사되었습니다!\n\n" + shareText);
      }).catch(() => {
        alert(shareText);
      });
    }
  };

  const handleDownloadPDF = () => {
    alert("📄 PDF 저장은 유료 분석에서 가능합니다.\n\n기본(₩9,900)을 결제하세요.");
  };

  const handleResetAnalysis = () => {
    setStep(1);
    setFormData({ 
      name: "", 
      email: "", 
      phone: "",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      birthHour: "",
      gender: ""
    });
    setUsedFreeAnalysis(false);
    setAnalyzing(false);
    setAnalysisResult(null);
  };

  if (!mounted) return null;

  if (usedFreeAnalysis && step === 1 && formData.name) {
    return (
      <>
        <Head>
          <meta name="google" content="notranslate" />
          <meta httpEquiv="Content-Language" content="ko" />
        </Head>
        <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #d97706 100%)", color: "white", padding: "40px 20px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20, marginTop: 0 }}>✅ 무료 분석 완료!</h1>
            <p style={{ fontSize: isMobile ? 14 : 18, marginBottom: 30, lineHeight: 1.2, marginTop: 0, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{`${formData.name}님은 이미 무료 분석을 사용하셨습니다.\n\n다른 이름으로는 분석 가능합니다.\n더 자세한 분석을 원하신다면\n유료 분석을 결제해주세요.`}</p>
            <button onClick={() => router.push("/payment")} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: "pointer", marginBottom: 12 }}>💳 유료 분석 결제하기</button>
            <button onClick={handleResetAnalysis} style={{ width: "100%", padding: 16, background: "rgba(255, 255, 255, 0.2)", color: "white", border: "2px solid white", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: "pointer" }}>🔄 다른 이름으로 분석</button>
          </div>
        </main>
      </>
    );
  }

  if (step === 7) {
    const result = analysisResult || { name: "분석 완료", wealthLuck: "분석 완료", loveLuck: "분석 완료", healthLuck: "분석 완료", couple: "분석 완료", yearlyLuck: "분석 완료", monthlyLuck: "분석 완료", fullAnalysis: "분석 완료" };

    return (
      <>
        <Head>
          <meta name="google" content="notranslate" />
          <meta httpEquiv="Content-Language" content="ko" />
        </Head>
        <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)", color: "#333", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 10, padding: isMobile ? "20px 16px" : "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ maxWidth: isMobile ? "100%" : "900px", margin: "0 auto", width: "100%" }}>
              <h1 style={{ textAlign: "center", color: "#d4af37", marginBottom: isMobile ? 25 : 40, fontSize: isMobile ? "26px" : "36px", fontWeight: 900, marginTop: 0 }}>🔮 사주 분석 결과</h1>

              {analyzing ? (
                <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: isMobile ? 40 : 60, borderRadius: 12, textAlign: "center" }}>
                  <p style={{ fontSize: isMobile ? 16 : 20, marginBottom: 30, color: "#333", fontWeight: 700, marginTop: 0 }}>사주를 정밀 분석 중입니다</p>
                  <p style={{ fontSize: isMobile ? 13 : 16, marginBottom: 20, color: "#666", marginTop: 0 }}>당신의 사주팔자를 분석 중입니다</p>
                  <div style={{ fontSize: isMobile ? 40 : 60, marginTop: 0, marginBottom: 0 }}>🔄</div>
                </div>
              ) : (
                <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: isMobile ? 25 : 50, borderRadius: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12, marginBottom: isMobile ? 25 : 35 }}>
                    <button onClick={handleShare} style={{ padding: isMobile ? 13 : 16, background: "linear-gradient(135deg, #00bcd4, #0097a7)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>📱 공유하기</button>
                    <button onClick={handleDownloadPDF} style={{ padding: isMobile ? 13 : 16, background: "linear-gradient(135deg, #ff9800, #f57c00)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>📄 PDF 저장</button>
                  </div>

                  <div id="result-content">
                    <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>📝 이름 분석</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.2, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "break-word", wordWrap: "break-word" }}>{result.name}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>💎 재물운</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result.wealthLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>💕 연애운</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result.loveLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🌿 건강운</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result.healthLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 35 : 45 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>👫 궁합 분석</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result.couple}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35, opacity: 0.9 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>☀️ 올해 운세</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result.yearlyLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35, opacity: 0.9 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🌙 월별 운세</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result.monthlyLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 35 : 45, opacity: 0.9 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🎋 전체 사주분석</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result.fullAnalysis}</p>
                    </div>
                  </div>

                  <div style={{ background: "#fff3cd", padding: isMobile ? 18 : 22, borderRadius: 8, marginBottom: isMobile ? 20 : 28 }}>
                    <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.8, marginTop: 0, marginBottom: 0, textAlign: "center" }}>✨ <strong>더 자세한 분석</strong>은<br/>유료 분석 코스에서!</p>
                  </div>

                  <button onClick={() => router.push("/payment")} style={{ width: "100%", padding: isMobile ? 15 : 17, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 15 : 17, cursor: "pointer", marginBottom: 12 }}>💳 유료 분석 결제하기</button>
                  <p style={{ color: "#666", fontSize: isMobile ? 11 : 13, fontWeight: 700, textAlign: "center", marginTop: 0, marginBottom: 0 }}>📄 30페이지 - 올해 운세 + 월별 운세</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="ko" />
      </Head>
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: backgroundImages[step], backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, padding: isMobile ? "25px 16px" : "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "700px", margin: "0 auto", width: "100%" }}>
            <h1 style={{ textAlign: "center", color: "#fbbf24", marginBottom: isMobile ? 35 : 50, fontSize: isMobile ? "26px" : "32px", fontWeight: 900, marginTop: 0 }}>🔮 무료 사주 분석</h1>

            {step === 1 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginBottom: isMobile ? 10 : 14, marginTop: 0 }}>이름을 입력해주세요</h2>
                <p style={{ color: "#ffffff", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.6, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>정확한 본명을 입력해주세요</p>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="홍길동" style={{ width: "100%", padding: isMobile ? "13px" : "16px", borderRadius: 8, border: "none", fontSize: isMobile ? 14 : 16, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000", marginBottom: isMobile ? 22 : 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} disabled style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#999", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "not-allowed", opacity: 0.5 }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginBottom: isMobile ? 10 : 14, marginTop: 0 }}>성별을 선택해주세요</h2>
                <p style={{ color: "#ffffff", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.6, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>정확한 성별을 선택해주세요</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 11 : 14, marginBottom: isMobile ? 22 : 28 }}>
                  <button onClick={() => setFormData(prev => ({ ...prev, gender: "남" }))} style={{ padding: isMobile ? "13px" : "16px", borderRadius: 8, border: formData.gender === "남" ? "2px solid #fbbf24" : "2px solid rgba(255, 255, 255, 0.3)", background: formData.gender === "남" ? "rgba(251,191,36,0.3)" : "rgba(255, 255, 255, 0.1)", color: formData.gender === "남" ? "#fbbf24" : "#ffffff", fontWeight: 900, fontSize: isMobile ? 14 : 16, cursor: "pointer" }}>🧑 남성</button>
                  <button onClick={() => setFormData(prev => ({ ...prev, gender: "여" }))} style={{ padding: isMobile ? "13px" : "16px", borderRadius: 8, border: formData.gender === "여" ? "2px solid #fbbf24" : "2px solid rgba(255, 255, 255, 0.3)", background: formData.gender === "여" ? "rgba(251,191,36,0.3)" : "rgba(255, 255, 255, 0.1)", color: formData.gender === "여" ? "#fbbf24" : "#ffffff", fontWeight: 900, fontSize: isMobile ? 14 : 16, cursor: "pointer" }}>👩 여성</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>생년월일을 입력해주세요</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: isMobile ? 22 : 28 }}>
                  <input type="number" name="birthYear" value={formData.birthYear} onChange={handleInputChange} placeholder="1990" min="1900" max="2024" style={{ width: "100%", padding: isMobile ? "11px" : "14px", borderRadius: 8, border: "none", fontSize: isMobile ? 13 : 15, boxSizing: "border-box", backgroundColor: "#ffffff", color: "#333" }} />
                  <select name="birthMonth" value={formData.birthMonth} onChange={handleInputChange} style={{ width: "100%", padding: isMobile ? "11px" : "14px", borderRadius: 8, border: "none", fontSize: isMobile ? 13 : 15, boxSizing: "border-box", backgroundColor: "#ffffff", color: "#333" }}>
                    <option value="">월</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}월</option>
                    ))}
                  </select>
                  <select name="birthDay" value={formData.birthDay} onChange={handleInputChange} style={{ width: "100%", padding: isMobile ? "11px" : "14px", borderRadius: 8, border: "none", fontSize: isMobile ? 13 : 15, boxSizing: "border-box", backgroundColor: "#ffffff", color: "#333" }}>
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}일</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginBottom: isMobile ? 10 : 14, marginTop: 0 }}>태어난 시간을 선택해주세요</h2>
                <p style={{ color: "#ffffff", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.6, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>모르시면 "모름"을 선택하셔도 됩니다</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr", gap: isMobile ? 10 : 12, marginBottom: isMobile ? 22 : 28, maxHeight: isMobile ? "420px" : "380px", overflowY: "auto" }}>
                  {birthHours.map(hour => (
                    <button key={hour.value} onClick={() => setFormData(prev => ({ ...prev, birthHour: hour.value }))} style={{ padding: isMobile ? "12px" : "15px", borderRadius: 8, border: formData.birthHour === hour.value ? "3px solid #fbbf24" : "3px solid #ffffff", background: formData.birthHour === hour.value ? "#fbbf24" : "rgba(255, 255, 255, 0.15)", color: formData.birthHour === hour.value ? "#1a1a1a" : "#ffffff", fontWeight: 900, fontSize: isMobile ? 12 : 13, cursor: "pointer", textAlign: "center", lineHeight: 1.5 }}>
                      <div style={{ fontWeight: 900 }}>{hour.label}</div>
                      <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, opacity: 0.9, marginTop: "3px" }}>{hour.time}</div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginBottom: isMobile ? 10 : 14, marginTop: 0 }}>이메일을 입력해주세요</h2>
                <p style={{ color: "#ffffff", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.6, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>분석 결과를 받을 이메일을 입력해주세요</p>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" style={{ width: "100%", padding: isMobile ? "13px" : "16px", borderRadius: 8, border: "none", fontSize: isMobile ? 14 : 16, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000", marginBottom: isMobile ? 22 : 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>전화번호를 입력해주세요</h2>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="01012345678" maxLength={13} style={{ width: "100%", padding: isMobile ? "13px" : "16px", borderRadius: 8, border: "none", fontSize: isMobile ? 14 : 16, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000", marginBottom: isMobile ? 22 : 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleAnalyze} disabled={analyzing} style={{ padding: isMobile ? "13px" : "16px", background: analyzing ? "rgba(255, 255, 255, 0.3)" : "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: analyzing ? "not-allowed" : "pointer", opacity: analyzing ? 0.6 : 1 }}>분석 시작 →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}