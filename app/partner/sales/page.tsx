"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { getPartnerTier } from "@/lib/partnerTiers";

interface SalesEntry {
  id: string;
  customerName: string;
  packageType: string;
  charge?: { listPrice: number; baseFee: number; vat: number; totalCharge: number };
  createdAt: string;
}

export default function PartnerSales() {
  const router = useRouter();
  const [partnerId, setPartnerId] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [tierId, setTierId] = useState("free");
  const [entries, setEntries] = useState<SalesEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [allCount, setAllCount] = useState(0);
  const [commissionStats, setCommissionStats] = useState<any>(null);
  const [commissionList, setCommissionList] = useState<any[]>([]);

  const load = async (id: string, cur?: string | null) => {
    const res = await fetch(`/api/partner/archive?partnerId=${encodeURIComponent(id)}${cur ? `&cursor=${encodeURIComponent(cur)}` : ""}`);
    const data = await res.json();
    setEntries(prev => cur ? [...prev, ...data.entries] : (data.entries || []));
    setCursor(data.nextCursor);
    if (!data.nextCursor) setDone(true);
    // 목록은 최근 50건씩만 불러오니, 정확한 합계는 미리 집계해둔
    // partnerStats(stats)로 따로 계산함 — 목록이 일부만 불러와져도 합계는 정확함
    const yyyymm = new Date().toISOString().slice(0, 7);
    setMonthlyTotal(data.stats?.[yyyymm]?.revenue || 0);
    setMonthlyCount(data.stats?.[yyyymm]?.count || 0);
    setAllTotal(data.stats?.total?.revenue || 0);
    setAllCount(data.stats?.total?.count || 0);
  };

  useEffect(() => {
    const id = localStorage.getItem("partnerId");
    const name = localStorage.getItem("partnerName");
    if (!id) { router.push("/partner/login"); return; }
    setPartnerId(id);
    setPartnerName(name || "");
    setTierId(localStorage.getItem("partnerTier") || "free");
    load(id).finally(() => setLoading(false));
    fetch(`/api/partner/commission?partnerId=${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(d => { setCommissionStats(d.stats || {}); setCommissionList(d.list || []); })
      .catch(() => {});
  }, [router]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try { await load(partnerId, cursor); } finally { setLoadingMore(false); }
  };

  const tier = getPartnerTier(tierId);

  return (
    <>
      <Head><title>이용내역 - 점운 파트너</title></Head>
      <main style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)", padding: "20px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: 14, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 900, margin: 0, color: "#333" }}>💰 {partnerName}님의 이용내역</h1>
              <p style={{ fontSize: 11, color: "#999", margin: "6px 0 0" }}>현재 등급: {tier.name} (사용료 {tier.feeDiscountPercent}% 할인)</p>
            </div>
            <button onClick={() => router.push("/partner/guide")} style={{ padding: "8px 14px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              ← 가이드로
            </button>
          </div>

          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "12px 16px", borderRadius: 12, marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: "#92400e", fontWeight: 700, lineHeight: 1.6, margin: 0 }}>
              ※ 아래 금액은 고객님께 받으시는 가격이 아니라,<br/>분석을 1건 생성할 때마다 등급별 할인이 적용되어<br/>점운에 지불하시는 이용료입니다.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "white", borderRadius: 14, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 6 }}>이번 달 이용료</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#9333ea" }}>{monthlyTotal.toLocaleString()}원</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{monthlyCount}건</div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 6 }}>전체 이용료</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#9333ea" }}>{allTotal.toLocaleString()}원</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{allCount}건</div>
            </div>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: 14 }}>
            {loading ? (
              <p style={{ textAlign: "center", color: "#999", padding: "30px 0", fontSize: 12 }}>불러오는 중...</p>
            ) : entries.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999", padding: "30px 0", fontSize: 12 }}>아직 생성한 분석이 없습니다.</p>
            ) : (
              <>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ddd" }}>
                    <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#333" }}>날짜</th>
                    <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#333" }}>고객명</th>
                    <th style={{ padding: 10, textAlign: "left", fontWeight: 700, color: "#333" }}>상품</th>
                    <th style={{ padding: 10, textAlign: "right", fontWeight: 700, color: "#333" }}>이용료</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(e => (
                    <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: 10, color: "#666" }}>{new Date(e.createdAt).toLocaleDateString("ko-KR")}</td>
                      <td style={{ padding: 10, color: "#333", fontWeight: 700 }}>{e.customerName}</td>
                      <td style={{ padding: 10, color: "#666" }}>{e.packageType}</td>
                      <td style={{ padding: 10, color: "#9333ea", fontWeight: 800, textAlign: "right" }}>{(e.charge?.totalCharge || 0).toLocaleString()}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!done && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button onClick={handleLoadMore} disabled={loadingMore} style={{ padding: "10px 24px", background: "#f3e8ff", color: "#9333ea", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: loadingMore ? "not-allowed" : "pointer" }}>
                    {loadingMore ? "불러오는 중..." : "더 보기"}
                  </button>
                </div>
              )}
              </>
            )}
          </div>
          {/* 추천링크 수수료 섹션 */}
          <div style={{ background: "white", padding: "20px", borderRadius: 14, marginTop: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 900, color: "#333", margin: "0 0 12px" }}>🔗 추천링크 수수료 (20%)</h2>

            {/* 추천링크 복사 */}
            <div style={{ background: "#f5f3ff", borderRadius: 10, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#6b7280", flex: 1, wordBreak: "break-all" }}>
                jeomun.com/main-v2?ref={partnerId}
              </span>
              <button
                onClick={() => {
                  const url = `https://jeomun.com/main-v2?ref=${partnerId}`;
                  navigator.clipboard.writeText(url).then(() => alert("추천링크 복사됐어요!")).catch(() => alert(url));
                }}
                style={{ padding: "7px 14px", background: "#8b5cf6", color: "white", border: "none", borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
              >복사</button>
            </div>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 14px", lineHeight: 1.6 }}>
              이 링크로 들어온 고객이 결제하면 결제금액의 20%가 수수료로 적립됩니다.
            </p>

            {/* 수수료 통계 */}
            {commissionStats && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div style={{ background: "#fdf4ff", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 4 }}>이번 달 수수료</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#9333ea" }}>
                    {(commissionStats[new Date().toISOString().slice(0,7)]?.commission || 0).toLocaleString()}원
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                    {commissionStats[new Date().toISOString().slice(0,7)]?.count || 0}건
                  </div>
                </div>
                <div style={{ background: "#fdf4ff", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, marginBottom: 4 }}>전체 수수료</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#9333ea" }}>
                    {(commissionStats.total?.commission || 0).toLocaleString()}원
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                    {commissionStats.total?.count || 0}건
                  </div>
                </div>
              </div>
            )}

            {/* 수수료 내역 */}
            {commissionList.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {commissionList.map(c => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#fafafa", borderRadius: 8, border: "1px solid #f0f0f0" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>결제 {c.paidAmount.toLocaleString()}원</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(c.createdAt).toLocaleDateString("ko-KR")} · {c.status === "pending" ? "정산 대기" : "정산 완료"}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#9333ea" }}>+{c.commission.toLocaleString()}원</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>
                아직 추천 수수료가 없어요.<br/>추천링크를 공유해보세요!
              </p>
            )}
          </div>

        </div>
      </main>
    </>
  );
}
