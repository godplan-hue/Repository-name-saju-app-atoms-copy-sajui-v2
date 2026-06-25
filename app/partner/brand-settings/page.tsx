"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PartnerBrandSettings() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [tier, setTier] = useState("free");
  const [loading, setLoading] = useState(true);
  const [subdomain, setSubdomain] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  // 다이아 파트너는 우리 도메인 안에서 직접 손님을 모으니, 보여주는 가격을
  // 자기 마음대로 바꿀 수 있게 함(실제 결제는 어차피 파트너가 직접 받으므로
  // 가격표는 화면 표시용일 뿐, 점운 시스템 결제·정산과는 무관함)
  const [customPriceBasic, setCustomPriceBasic] = useState("");
  const [customPriceStandard, setCustomPriceStandard] = useState("");
  const [customPricePremium, setCustomPricePremium] = useState("");
  const [customPriceVip, setCustomPriceVip] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savedSubdomain, setSavedSubdomain] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    if (!id) { router.push("/partner/login"); return; }
    setPartnerId(id);
    const t = localStorage.getItem("partnerTier") || "free";
    setTier(t);
    setBusinessName(localStorage.getItem("partnerBusinessName") || "");
    if (t === "diamond") {
      fetch(`/api/partner/brand?partnerId=${id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setSubdomain(data.subdomain || "");
            setBusinessName(data.businessName || "");
            setLogoUrl(data.logoUrl || "");
            setCustomPriceBasic(data.customPriceBasic || "");
            setCustomPriceStandard(data.customPriceStandard || "");
            setCustomPricePremium(data.customPricePremium || "");
            setCustomPriceVip(data.customPriceVip || "");
          }
        })
        .catch(() => {});
    }
    setLoading(false);
  }, [router]);

  const handleSave = async () => {
    setError("");
    setMessage("");
    if (!subdomain.trim() || !businessName.trim()) {
      setError("나만의 도메인과 상호명을 입력해주세요.");
      return;
    }
    // 가격을 너무 낮게 적어서 점운 브랜드 이미지를 깎아먹는 걸 막기 위해, 적어도
    // 가장 싼 기본 패키지 정가(9,900원)보다는 낮게 못 적게 함
    const prices = [customPriceBasic, customPriceStandard, customPricePremium, customPriceVip];
    for (const p of prices) {
      if (!p.trim()) continue;
      const num = Number(p.replace(/[^0-9]/g, ""));
      if (num > 0 && num < 9900) {
        setError("표시 가격은 9,900원 이상으로 입력해주세요.");
        return;
      }
    }
    setSaving(true);
    try {
      const res = await fetch("/api/partner/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId, subdomain: subdomain.trim(), businessName: businessName.trim(), logoUrl: logoUrl.trim(),
          customPriceBasic: customPriceBasic.trim(), customPriceStandard: customPriceStandard.trim(),
          customPricePremium: customPricePremium.trim(), customPriceVip: customPriceVip.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "저장에 실패했습니다."); return; }
      setSavedSubdomain(data.subdomain);
      setMessage(`✅ 저장 완료! https://${data.subdomain}.jeomun.com 으로 접속해보세요.`);
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  if (tier !== "diamond") {
    return (
      <>
        <Head><title>내 브랜드 설정 - 점운 파트너</title></Head>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8ff", padding: 20 }}>
          <div style={{ maxWidth: 380, textAlign: "center", background: "white", padding: 30, borderRadius: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💎</div>
            <h1 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10, color: "#333" }}>다이아 등급 전용 기능입니다</h1>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>
              나만의 독립 사주앱 브랜드(도메인+로고)는 다이아 등급부터 이용할 수 있어요.
            </p>
            <button onClick={() => router.push("/partner/upgrade")} style={{ padding: "12px 24px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: "pointer" }}>
              등급 업그레이드 하기
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head><title>내 브랜드 설정 - 점운 파트너</title></Head>
      <main style={{ minHeight: "100vh", background: "#f8f8ff", padding: "30px 16px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", background: "white", borderRadius: 14, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6, color: "#333" }}>💎 나만의 독립 사주앱 브랜드</h1>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 22, lineHeight: 1.6 }}>
            나만의 도메인 주소로 들어온 손님에게는 "점운" 대신 등록하신 브랜드가 보여요. 실제 분석·결제·데이터는 그대로 점운 시스템을 씁니다.
          </p>

          <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#333" }}>나만의 도메인 주소 *</label>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <input
              type="text"
              value={subdomain}
              onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="kim"
              style={{ flex: 1, padding: 12, border: "2px solid #ddd", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
            <span style={{ color: "#888", fontSize: 13, whiteSpace: "nowrap" }}>.jeomun.com</span>
          </div>
          <p style={{ fontSize: 11, color: "#aaa", marginBottom: 18 }}>영문 소문자·숫자·하이픈만, 3~20자</p>

          <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#333" }}>상호명 *</label>
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="예: 김철수 사주연구소"
            style={{ width: "100%", padding: 12, marginBottom: 18, border: "2px solid #ddd", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />

          <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#333" }}>로고 이미지 주소 (선택)</label>
          <input
            type="text"
            value={logoUrl}
            onChange={e => setLogoUrl(e.target.value)}
            placeholder="https://..."
            style={{ width: "100%", padding: 12, marginBottom: 6, border: "2px solid #ddd", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
          />
          <p style={{ fontSize: 11, color: "#aaa", marginBottom: 18 }}>비워두면 기본 점운 로고 모양을 그대로 씁니다</p>

          <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#333" }}>화면에 표시할 가격 (선택)</label>
          <p style={{ fontSize: 11, color: "#aaa", marginBottom: 10 }}>비워두면 기본 가격이 그대로 보여요. 실제 결제는 어차피 직접 받으시니, 화면에 보일 가격만 원하시는 대로 적어주세요.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
            <div>
              <p style={{ fontSize: 11, color: "#666", margin: "0 0 4px" }}>기본 분석 (기본 ₩9,900)</p>
              <input type="text" value={customPriceBasic} onChange={e => setCustomPriceBasic(e.target.value)} placeholder="₩9,900" style={{ width: "100%", padding: 10, border: "2px solid #ddd", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#666", margin: "0 0 4px" }}>베이직 (기본 ₩19,900)</p>
              <input type="text" value={customPriceStandard} onChange={e => setCustomPriceStandard(e.target.value)} placeholder="₩19,900" style={{ width: "100%", padding: 10, border: "2px solid #ddd", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#666", margin: "0 0 4px" }}>프리미엄 (기본 ₩24,900)</p>
              <input type="text" value={customPricePremium} onChange={e => setCustomPricePremium(e.target.value)} placeholder="₩24,900" style={{ width: "100%", padding: 10, border: "2px solid #ddd", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#666", margin: "0 0 4px" }}>VIP 커플팩 (기본 ₩29,900)</p>
              <input type="text" value={customPriceVip} onChange={e => setCustomPriceVip(e.target.value)} placeholder="₩29,900" style={{ width: "100%", padding: 10, border: "2px solid #ddd", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
            </div>
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{error}</p>}
          {message && <p style={{ color: "#16a34a", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{message}</p>}

          <button onClick={handleSave} disabled={saving} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 15, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "저장 중..." : "💾 저장하기"}
          </button>

          {savedSubdomain && (
            <a href={`https://${savedSubdomain}.jeomun.com`} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", marginTop: 14, color: "#667eea", fontWeight: 700, fontSize: 13 }}>
              🔗 {savedSubdomain}.jeomun.com 바로 가보기
            </a>
          )}
        </div>
      </main>
    </>
  );
}
