import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "합격 자소서 사주 | 점운 — 내 사주 강점으로 쓰는 자기소개서",
  description: "내 사주의 강점과 적성을 파악해 합격 자기소개서를 써보세요. 사주로 보는 나의 직업 적성, 강점, 면접 운까지 AI가 분석해드려요.",
  keywords: ["합격 자소서", "자기소개서 사주", "취업 사주", "면접 운", "직업 적성 사주", "취업운"],
  openGraph: { title: "합격 자소서 — 내 사주 강점으로", description: "사주로 보는 나의 강점과 적성으로 합격 자소서 써보기.", url: "https://jeomun.com/resume-saju" },
  alternates: { canonical: "https://jeomun.com/resume-saju" },
};

const tips = [
  { icon: "💪", title: "나의 핵심 강점", desc: "사주 일간(日干)으로 내가 타고난 기질과 강점을 파악해요. 자소서 첫 문장이 달라져요." },
  { icon: "🎯", title: "직업 적성 분석", desc: "오행(五行) 균형으로 내가 잘 맞는 직종과 환경을 찾아요. 엉뚱한 곳에 에너지 낭비하지 마세요." },
  { icon: "📅", title: "면접 좋은 날", desc: "내 사주와 맞는 날에 면접을 보면 실력이 더 잘 발휘돼요. 택일로 합격 확률을 높여요." },
  { icon: "🌟", title: "취업운 타이밍", desc: "지금 내 취업운이 어떤 시기인지 알면 전략이 달라져요. 최적의 타이밍을 파악해요." },
];

const faqs = [
  { q: "자소서랑 사주가 무슨 관계예요?", a: "사주는 내 타고난 기질·강점·적성을 보여줘요. 이걸 알면 자소서에 억지로 꾸미지 않아도 진짜 나의 강점을 자연스럽게 쓸 수 있어요." },
  { q: "어떤 직종이 나한테 맞는지 알 수 있나요?", a: "네, 사주 오행과 일간으로 창의형·분석형·리더형·서비스형 등 어떤 환경에서 능력을 발휘하는지 알 수 있어요." },
  { q: "면접 날짜도 사주로 고를 수 있나요?", a: "네! 택일 기능으로 내 사주와 가장 잘 맞는 면접 날짜를 고를 수 있어요. 기운이 맞는 날 더 자연스럽게 실력이 나와요." },
  { q: "취업이 잘 안 풀리는 이유도 알 수 있나요?", a: "대운·세운의 흐름으로 지금이 어떤 시기인지, 언제쯤 좋은 기회가 오는지 파악할 수 있어요." },
];

export default function ResumeSajuPage() {
  return (
    <main style={{ minHeight:"100vh", background:"#fafafa", fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color:"#1f2937" }}>
      <div style={{ background:"linear-gradient(135deg,#1e3a8a,#1d4ed8,#3b82f6)", padding:"60px 20px 48px", textAlign:"center", color:"white" }}>
        <p style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.8)", margin:"0 0 10px" }}>📝 합격 자소서 × 사주</p>
        <h1 style={{ fontSize:"clamp(24px,5vw,38px)", fontWeight:900, margin:"0 0 12px", lineHeight:1.25 }}>내 사주 강점으로 쓰는<br/>합격 자기소개서</h1>
        <p style={{ fontSize:14, opacity:0.85, margin:"0 0 28px", lineHeight:1.7 }}>억지로 꾸미지 마세요<br/>내 타고난 강점을 사주로 찾아 써봐요</p>
        <Link href="/main-v2" style={{ display:"inline-block", padding:"14px 36px", background:"white", color:"#1d4ed8", borderRadius:50, fontWeight:900, fontSize:16, textDecoration:"none", boxShadow:"0 6px 20px rgba(0,0,0,0.2)" }}>
          ✨ 내 사주 강점 알아보기
        </Link>
        <p style={{ fontSize:12, opacity:0.7, marginTop:10 }}>무료 분석 · 즉시 결과 · 990원~</p>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"40px 20px" }}>
        <h2 style={{ fontSize:20, fontWeight:900, textAlign:"center", marginBottom:24 }}>사주로 자소서가 달라지는 이유</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:40 }}>
          {tips.map(t => (
            <div key={t.title} style={{ display:"flex", gap:16, alignItems:"flex-start", background:"white", borderRadius:14, padding:"16px 18px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize:28 }}>{t.icon}</span>
              <div><p style={{ fontWeight:800, fontSize:14, margin:"0 0 4px" }}>{t.title}</p><p style={{ fontSize:13, color:"#6b7280", margin:0, lineHeight:1.6 }}>{t.desc}</p></div>
            </div>
          ))}
        </div>

        <div style={{ background:"linear-gradient(135deg,#eff6ff,#dbeafe)", border:"2px solid #93c5fd", borderRadius:16, padding:"24px 20px", textAlign:"center", marginBottom:40 }}>
          <p style={{ fontWeight:900, fontSize:18, color:"#1d4ed8", margin:"0 0 8px" }}>🎓 취업 성공을 위한 사주 분석</p>
          <p style={{ fontSize:13, color:"#1e40af", margin:"0 0 20px", lineHeight:1.7 }}>강점 파악 → 적성 직종 확인 → 면접 좋은 날 택일<br/>이 3가지면 자소서가 달라져요</p>
          <Link href="/main-v2" style={{ display:"inline-block", padding:"13px 36px", background:"linear-gradient(135deg,#1e3a8a,#3b82f6)", color:"white", borderRadius:50, fontWeight:900, fontSize:15, textDecoration:"none" }}>
            📝 내 강점 사주로 확인하기
          </Link>
        </div>

        <h2 style={{ fontSize:20, fontWeight:900, textAlign:"center", marginBottom:20 }}>자주 묻는 질문</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {faqs.map(f => (
            <div key={f.q} style={{ background:"white", borderRadius:14, padding:"18px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ fontWeight:800, fontSize:14, color:"#1d4ed8", margin:"0 0 6px" }}>Q. {f.q}</p>
              <p style={{ fontSize:13, color:"#374151", margin:0, lineHeight:1.7 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)", padding:"40px 20px", textAlign:"center" }}>
        <p style={{ color:"white", fontSize:22, fontWeight:900, margin:"0 0 8px" }}>합격의 기운을 내 편으로</p>
        <p style={{ color:"rgba(255,255,255,0.85)", fontSize:14, margin:"0 0 20px" }}>무료 오늘의 운세 → 990원 취업·직업운 분석</p>
        <Link href="/main-v2" style={{ display:"inline-block", padding:"14px 40px", background:"white", color:"#1d4ed8", borderRadius:50, fontWeight:900, fontSize:16, textDecoration:"none" }}>✨ 시작하기</Link>
      </div>
    </main>
  );
}
