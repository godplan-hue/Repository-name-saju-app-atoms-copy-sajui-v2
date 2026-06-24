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
      setError("서브도메인과 상호명을 입력해주세요.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/partner/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, subdomain: subdomain.trim(), businessName: businessName.trim(), logoUrl: logoUrl.trim() }),
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
              나만의 독립 사주앱 브랜드(서브도메인+로고)는 다이아 등급부터 이용할 수 있어요.
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
            서브도메인 주소로 들어온 손님에게는 "점운" 대신 등록하신 브랜드가 보여요. 실제 분석·결제·데이터는 그대로 점운 시스템을 씁니다.
          </p>

          <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#333" }}>서브도메인 주소 *</label>
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
