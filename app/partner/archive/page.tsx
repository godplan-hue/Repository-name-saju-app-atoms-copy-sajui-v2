"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

interface ArchiveEntry {
  id: string;
  customerName: string;
  packageType: string;
  createdAt: string;
}

export default function PartnerArchive() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    const name = localStorage.getItem("partnerName");
    if (!id) {
      router.push("/partner/login");
      return;
    }
    setPartnerId(id);
    setPartnerName(name || "");
    fetch(`/api/partner/archive?partnerId=${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => setEntries(data.entries || []))
      .finally(() => setLoading(false));
  }, [router]);

  const handleOpen = async (entryId: string) => {
    setOpeningId(entryId);
    try {
      const res = await fetch(`/api/partner/archive?partnerId=${encodeURIComponent(partnerId)}&id=${encodeURIComponent(entryId)}`);
      if (!res.ok) { alert("불러오기에 실패했습니다."); return; }
      const data = await res.json();
      sessionStorage.setItem("analysisResult", JSON.stringify(data.entry.result));
      sessionStorage.setItem("analysisName", data.entry.customerName);
      sessionStorage.setItem("selectedPackage", data.entry.packageType);
      router.push("/partner/analysis-result");
    } finally {
      setOpeningId("");
    }
  };

  return (
    <>
      <Head>
        <title>보관함 - 점운 파트너</title>
      </Head>
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", backgroundImage: "url('https://i.pinimg.com/736x/8b/1e/61/8b1e61fecad9a7ef1f44ca48081e25d1.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", padding: "20px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.65)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0, color: "#333" }}>📁 {partnerName}님의<br/>보관함</h1>
              <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>고객이 결과를 못 받았다고 하면<br/>여기서 다시 열어 재발송하세요</p>
            </div>
            <button onClick={() => router.push("/partner/create-analysis")} style={{ padding: "10px 20px", background: "#eef0ff", color: "#667eea", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>
              분석 생성
            </button>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
            {loading ? (
              <p style={{ textAlign: "center", color: "#999", padding: "30px 0" }}>불러오는 중...</p>
            ) : entries.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999", padding: "30px 0" }}>아직 생성한 분석이 없습니다.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ddd" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>고객명</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>상품</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}>생성일시</th>
                    <th style={{ padding: "12px", textAlign: "left", fontWeight: 700, color: "#333" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(e => (
                    <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", color: "#333", fontWeight: 700 }}>{e.customerName}</td>
                      <td style={{ padding: "12px", color: "#666" }}>{e.packageType}</td>
                      <td style={{ padding: "12px", color: "#666" }}>{new Date(e.createdAt).toLocaleString("ko-KR")}</td>
                      <td style={{ padding: "12px" }}>
                        <button onClick={() => handleOpen(e.id)} disabled={openingId === e.id} style={{ padding: "8px 16px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                          {openingId === e.id ? "여는중..." : "다시 보기 / 재발송"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
