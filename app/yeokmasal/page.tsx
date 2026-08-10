import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "역마살 사주 | 점운 — 내 사주에 역마살 있나?",
  description: "역마살 사주를 확인해보세요. 역마살이 있으면 이동·변화·해외 기운이 강해요. AI가 신살을 분석해드려요.",
  keywords: ["역마살", "역마살 사주", "역마살 뜻", "역마살 있는 사람", "사주 역마살", "역마살 해외"],
  openGraph: { title: "역마살 사주 — 점운", description: "내 사주에 역마살 있나? AI가 신살 분석.", url: "https://jeomun.com/yeokmasal" },
  alternates: { canonical: "https://jeomun.com/yeokmasal" },
};
export default function YeokmasalPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#fffbeb", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", color: "#1f2937" }}>
      <div style={{ background: "linear-gradient(135deg, #fef3c7, #fffbeb)", padding: "60px 20px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", margin: "0 0 10px" }}>🐎 역마살 사주</p>
        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.25 }}>내 사주에<br />역마살 있어?</h1>
        <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>역마살 — 이동·변화·해외 기운의 핵심<br />AI가 신살을 분석해드려요</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(135deg, #f59e0b, #92400e)", color: "white", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}>🐎 역마살 확인 — ₩990~</Link>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "20px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 900, fontSize: 15, color: "#92400e", margin: "0 0 8px" }}>역마살(驛馬殺)이란?</p>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>역마(말이 달린다)처럼 이동이 많고 변화가 잦은 기운. 해외 진출·이사·직장 이동이 잦아요. 잘 쓰면 글로벌 진출의 에너지가 돼요.</p>
        </div>
        {[{ icon: "✈️", title: "역마살 유무", desc: "내 사주 원국에 역마살이 있는지 확인" }, { icon: "🌍", title: "해외 기운", desc: "해외 취업·유학·이민 기운 분석" }, { icon: "🚗", title: "이동·이사 기운", desc: "자주 이사하거나 출장이 많은 팔자인지" }, { icon: "🔄", title: "변화 기운", desc: "직업·거주지 변화가 많은 시기 분석" }].map(f => (
          <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "white", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: 28 }}>{f.icon}</span>
            <div><p style={{ fontWeight: 800, fontSize: 14, margin: "0 0 4px" }}>{f.title}</p><p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{f.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #f59e0b, #92400e)", padding: "40px 20px", textAlign: "center" }}>
        <p style={{ color: "white", fontSize: 22, fontWeight: 900, margin: "0 0 20px" }}>역마살 지금 확인</p>
        <Link href="/main-v2" style={{ display: "inline-block", padding: "14px 40px", background: "white", color: "#92400e", borderRadius: 50, fontWeight: 900, fontSize: 16, textDecoration: "none" }}>🐎 시작하기</Link>
      </div>
    </main>
  );
}
