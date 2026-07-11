import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "아이 사주 육아 | 점운 — 우리 아이 성격·재능·육아법 사주로 알아보기",
  description: "아이 사주로 성격, 재능, 적성을 파악해 맞춤 육아를 해보세요. 강요 말고 타고난 기질에 맞게 키우는 사주 육아법을 AI가 알려드려요.",
  keywords: ["아이 사주", "육아 사주", "아이 성격 사주", "아이 재능", "태어난 사주", "자녀 사주", "육아법"],
  openGraph: { title: "우리 아이 사주 — 맞춤 육아의 시작", description: "사주로 보는 아이 성격·재능·기질 맞춤 육아법.", url: "https://jeomun.com/parenting-saju" },
};

const tips = [
  { icon: "🧒", title: "아이 기질 파악", desc: "사주 일간으로 아이가 타고난 기질(활발형/섬세형/리더형/예술형 등)을 알 수 있어요. 왜 이렇게 행동하는지 이해가 달라져요." },
  { icon: "🎨", title: "숨겨진 재능 발견", desc: "오행 균형으로 아이에게 자연스럽게 맞는 분야를 파악해요. 예체능·이공계·사회과학 어디가 맞는지 미리 알 수 있어요." },
  { icon: "💬", title: "아이에게 맞는 소통법", desc: "아이 성격 유형에 따라 칭찬 방식, 혼내는 방식이 달라요. 기질에 맞는 소통이 훨씬 효과적이에요." },
  { icon: "🌱", title: "부모 사주와 궁합", desc: "부모와 아이 사주가 얼마나 잘 맞는지 파악하면 갈등 없이 더 잘 맞춰줄 수 있어요." },
];

const faqs = [
  { q: "아이가 왜 이렇게 말을 안 듣는지 알 수 있나요?", a: "사주로 아이 기질을 파악하면 '말을 안 드는 게 아니라 다르게 소통해야 하는 아이'인지 알 수 있어요. 기질에 맞는 소통법이 훨씬 효과적이에요." },
  { q: "어떤 교육이 맞을지 알 수 있나요?", a: "오행 균형으로 창의·논리·예체능·사회형 중 어디에 강점이 있는지 알 수 있어요. 아이한테 안 맞는 교육에 스트레스 주지 않아도 돼요." },
  { q: "아이 사주는 몇 살부터 볼 수 있나요?", a: "태어난 순간부터 사주가 완성돼요. 갓난아이부터도 기질·특성 파악이 가능해요." },
  { q: "부모 사주랑 아이 사주를 같이 봐도 되나요?", a: "네! 궁합 기능으로 부모-아이 사주 궁합을 보면 어떤 방식으로 맞춰줄지 힌트를 얻을 수 있어요." },
];

export default function ParentingSajuPage() {
  return (
    <main style={{ minHeight:"100vh", background:"#fafafa", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color:"#1f2937" }}>
      <div style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7,#c084fc)", padding:"60px 20px 48px", textAlign:"center", color:"white" }}>
        <p style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.8)", margin:"0 0 10px" }}>👶 아이 사주 × 육아</p>
        <h1 style={{ fontSize:"clamp(24px,5vw,38px)", fontWeight:900, margin:"0 0 12px", lineHeight:1.25 }}>우리 아이 성격·재능<br/>사주로 알아보는 맞춤 육아</h1>
        <p style={{ fontSize:14, opacity:0.85, margin:"0 0 28px", lineHeight:1.7 }}>강요하지 않아도 돼요<br/>타고난 기질대로 키우면 훨씬 편해요</p>
        <Link href="/main-v2" style={{ display:"inline-block", padding:"14px 36px", background:"white", color:"#7c3aed", borderRadius:50, fontWeight:900, fontSize:16, textDecoration:"none", boxShadow:"0 6px 20px rgba(0,0,0,0.2)" }}>
          ✨ 아이 사주 알아보기
        </Link>
        <p style={{ fontSize:12, opacity:0.7, marginTop:10 }}>무료 분석 · 즉시 결과 · 990원~</p>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"40px 20px" }}>
        <h2 style={{ fontSize:20, fontWeight:900, textAlign:"center", marginBottom:24 }}>사주 육아가 효과적인 이유</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:40 }}>
          {tips.map(t => (
            <div key={t.title} style={{ display:"flex", gap:16, alignItems:"flex-start", background:"white", borderRadius:14, padding:"16px 18px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize:28 }}>{t.icon}</span>
              <div><p style={{ fontWeight:800, fontSize:14, margin:"0 0 4px" }}>{t.title}</p><p style={{ fontSize:13, color:"#6b7280", margin:0, lineHeight:1.6 }}>{t.desc}</p></div>
            </div>
          ))}
        </div>

        <div style={{ background:"linear-gradient(135deg,#faf5ff,#f3e8ff)", border:"2px solid #c4b5fd", borderRadius:16, padding:"24px 20px", textAlign:"center", marginBottom:40 }}>
          <p style={{ fontWeight:900, fontSize:18, color:"#7c3aed", margin:"0 0 8px" }}>👶 아이 사주 분석 시작하기</p>
          <p style={{ fontSize:13, color:"#6d28d9", margin:"0 0 20px", lineHeight:1.7 }}>기질 파악 → 재능 발견 → 맞춤 소통법<br/>아이를 더 잘 이해하게 돼요</p>
          <Link href="/main-v2" style={{ display:"inline-block", padding:"13px 36px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", borderRadius:50, fontWeight:900, fontSize:15, textDecoration:"none" }}>
            🌱 아이 사주 보러 가기
          </Link>
        </div>

        <h2 style={{ fontSize:20, fontWeight:900, textAlign:"center", marginBottom:20 }}>자주 묻는 질문</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background:"white", borderRadius:14, padding:"18px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight:800, fontSize:14, color:"#7c3aed", margin:"0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize:13, color:"#374151", margin:0, lineHeight:1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", padding:"40px 20px", textAlign:"center" }}>
        <p style={{ color:"white", fontSize:22, fontWeight:900, margin:"0 0 8px" }}>아이를 더 잘 이해하는 방법</p>
        <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, margin:"0 0 20px" }}>무료 오늘의 운세 → 990원 자녀운 분석</p>
        <Link href="/main-v2" style={{ display:"inline-block", padding:"14px 40px", background:"white", color:"#7c3aed", borderRadius:50, fontWeight:900, fontSize:16, textDecoration:"none" }}>✨ 시작하기</Link>
      </div>
    </main>
  );
}
