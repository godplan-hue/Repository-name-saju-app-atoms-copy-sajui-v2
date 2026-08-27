"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function getTodayCount(base: number) {
  const seed = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
  const lcg = ((seed * 1103515245 + 12345) & 0x7fffffff) >>> 0;
  const hour = new Date().getHours();
  const block = hour < 8 ? 0 : hour < 16 ? 1 : 2;
  return (base + (lcg % 140) + block * (200 + (lcg % 90))).toLocaleString();
}

type Result = {
  name: string; part: string; partLabel: string; score: number;
  typeName: string; typeEmoji: string; typeColor: string; tagline: string;
  description: string; advice: string;
  bestMatch: string; bestMatchEmoji: string; worstMatch: string; worstMatchEmoji: string;
  rank: number;
};

export default function SonjeolgakResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [todayCount, setTodayCount] = useState("0");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTodayCount(getTodayCount(640));
    try {
      const u = localStorage.getItem("sonjeolgak_unlock_until");
      if (u && Number(u) > Date.now()) setPaid(true);
    } catch {}

    if (id === "inline") {
      try {
        const raw = sessionStorage.getItem("sonjeolgak_inline_result");
        if (raw) setResult(JSON.parse(raw));
      } catch {}
      setLoading(false);
      return;
    }

    fetch(`/api/sonjeolgak/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.result) setResult(d.result); })
      .finally(() => setLoading(false));
  }, [id]);

  const share = () => {
    const text = result ? `나의 ${result.partLabel} 손절각은 "${result.typeName}"! 너는 몇 점일까?` : "손절각 테스트 해보기";
    const url = typeof window !== "undefined" ? window.location.href : "https://jeomun.com/sonjeolgak";
    try {
      const kakao = (window as any).Kakao;
      if (kakao?.isInitialized?.()) {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: { title: "점운 손절각", description: text, imageUrl: "https://jeomun.com/og-image.png", link: { mobileWebUrl: url, webUrl: url } },
          buttons: [{ title: "나도 테스트하기", link: { mobileWebUrl: url, webUrl: url } }],
        });
        return;
      }
    } catch {}
    try {
      window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(text + " " + url)}`;
      setTimeout(() => {
        navigator.clipboard?.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, 400);
    } catch {
      navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#0a0015", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
  };

  if (loading) {
    return (
      <div style={S.wrap}><div style={{ ...S.inner, textAlign: "center", paddingTop: 100 }}>
        <div style={{ fontSize: 44 }}>🐱</div>
        <p style={{ color: "#a78bfa" }}>결과 불러오는 중...</p>
      </div></div>
    );
  }

  if (!result) {
    return (
      <div style={S.wrap}><div style={{ ...S.inner, textAlign: "center", paddingTop: 100 }}>
        <p style={{ color: "#9ca3af" }}>결과를 찾을 수 없어요.</p>
        <Link href="/sonjeolgak" style={{ color: "#a78bfa" }}>다시 테스트하기 →</Link>
      </div></div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        <div style={{ paddingTop: 28, textAlign: "center", marginBottom: 18 }}>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>{result.partLabel} 손절각 결과</p>
          <h1 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>{result.name}님의 손절각 지수</h1>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${result.typeColor}22, #1a0030)`, border: `1.5px solid ${result.typeColor}55`, borderRadius: 24, padding: "32px 20px", textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 64, marginBottom: 10 }}>{result.typeEmoji}</div>
          <p style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px", color: result.typeColor }}>{result.typeName}</p>
          <p style={{ fontSize: 13, color: "#d8b4fe", margin: "0 0 16px" }}>{result.tagline}</p>
          <div style={{ fontSize: 40, fontWeight: 900, color: "white" }}>{result.score}<span style={{ fontSize: 16, color: "#9ca3af" }}>점</span></div>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0 0" }}>상위 {result.rank}%의 손절각을 가지고 있어요</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "18px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 900, margin: "0 0 8px", color: "#e9d5ff" }}>🐾 이런 성향이에요</p>
          <p style={{ fontSize: 13.5, color: "#e5e7eb", lineHeight: 1.7, margin: 0 }}>{result.description}</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "18px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 900, margin: "0 0 8px", color: "#e9d5ff" }}>💡 이렇게 해보세요</p>
          <p style={{ fontSize: 13.5, color: "#e5e7eb", lineHeight: 1.7, margin: 0 }}>{result.advice}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 16, padding: "14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#4ade80", margin: "0 0 6px", fontWeight: 900 }}>궁합 좋은 유형</p>
            <div style={{ fontSize: 26 }}>{result.bestMatchEmoji}</div>
            <p style={{ fontSize: 12.5, fontWeight: 700, margin: 0 }}>{result.bestMatch}</p>
          </div>
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 16, padding: "14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "#f87171", margin: "0 0 6px", fontWeight: 900 }}>부딪히는 유형</p>
            <div style={{ fontSize: 26 }}>{result.worstMatchEmoji}</div>
            <p style={{ fontSize: 12.5, fontWeight: 700, margin: 0 }}>{result.worstMatch}</p>
          </div>
        </div>

        <button onClick={share} style={{ width: "100%", background: "#FEE500", color: "#1a1a1a", border: "none", borderRadius: 16, padding: "15px", fontSize: 14.5, fontWeight: 900, cursor: "pointer", marginBottom: 12 }}>
          💬 친구한테 공유하기
        </button>
        {copied && <p style={{ textAlign: "center", fontSize: 12, color: "#4ade80", marginTop: -6, marginBottom: 12 }}>링크가 복사됐어요!</p>}

        {!paid && (
          <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(236,72,153,0.12))", border: "1.5px solid rgba(236,72,153,0.4)", borderRadius: 20, padding: "20px 18px", marginBottom: 16, textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 900, margin: "0 0 6px" }}>🔒 다른 관계의 손절각도 궁금하다면?</p>
            <p style={{ fontSize: 12.5, color: "#d8b4fe", margin: "0 0 14px", lineHeight: 1.6 }}>
              연애·전애인·썸/바람·직장·가족·여행<br />6개 파트를 990원에 전부 열어보세요
            </p>
            <button onClick={() => { window.location.href = "/sonjeolgak/pay"; }}
              style={{ width: "100%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", border: "none", borderRadius: 16, padding: "13px", fontSize: 14, fontWeight: 900, cursor: "pointer" }}>
              ₩990 · 6개 파트 전체 잠금해제 →
            </button>
          </div>
        )}

        <Link href="/sonjeolgak" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: "14px", color: "#e5e7eb", fontSize: 13.5, fontWeight: 700, textDecoration: "none", marginBottom: 12 }}>
          🐾 나도 손절각 해보기 (무료) →
        </Link>

        <a href="/main-v2" style={{ display: "block", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "12px", color: "#9ca3af", fontSize: 12.5, textDecoration: "none", marginBottom: 20 }}>
          🔮 이 관계, 사주로도 궁금하다면 → 점운 사주 990원
        </a>

        <div style={{ background: "rgba(236,72,153,0.06)", border: "1px solid rgba(236,72,153,0.15)", borderRadius: 12, padding: "10px 16px", marginBottom: 20, textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "#f9a8d4" }}>오늘 <b style={{ color: "#ec4899" }}>{todayCount}명</b>이 손절각을 확인했어요</span>
        </div>

        <div style={{ maxWidth: 380, margin: "0 auto", padding: "20px 18px", borderRadius: 20, background: "#0a0020", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, margin: "0 0 10px" }}>© 2026 점운 · Powered by 점운</p>
          <div style={{ color: "#94a3b8", fontSize: 10.5, lineHeight: 1.9, marginBottom: 14 }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
            <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38,<br />7층 7017호(대치동)</p>
            <p style={{ margin: 0 }}>대표전화 010-2106-2689 · 유선 031-585-7255</p>
            <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다.<br />카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 12 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "7px 18px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 900, fontSize: 12 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "7px 18px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, color: "#e2e8f0", textDecoration: "none", fontWeight: 700, fontSize: 12 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 11, display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/terms" style={{ color: "#6b7280", textDecoration: "none" }}>이용약관</Link>
            <Link href="/privacy" style={{ color: "#6b7280", textDecoration: "none" }}>개인정보처리방침</Link>
            <Link href="/refund" style={{ color: "#6b7280", textDecoration: "none" }}>환불정책</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
