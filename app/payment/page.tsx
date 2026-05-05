"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "";
  const birthDate = searchParams.get("birthDate") || "";
  const birthTime = searchParams.get("birthTime") || "";
  const gender = searchParams.get("gender") || "";
  const type = searchParams.get("type") || "";
  const pages = searchParams.get("pages") || "50";

  const pageCount = parseInt(pages);

  // 페이지수로 가격 결정 (Option 2: 24,900 / 29,900)
  const getPrice = (p: number) => {
    if (p <= 50) return 9900;
    if (p <= 100) return 19900;
    if (p <= 150) return 24900;
    return 29900;
  };

  const getPackageName = (p: number) => {
    if (p <= 50) return "✨ 기본분석 (50P)";
    if (p <= 100) return "⭐ 베이직 (100P)";
    if (p <= 150) return "🔮 프리미엄 (150P)";
    return "💎 커플팩 (200P + 궁합)";
  };

  const getPackageDescription = (p: number) => {
    if (p <= 50) return "사주 원국 분석 + 성격 + 재물운 + 연애운 + 건강운 + 올해 운세 + 개운법";
    if (p <= 100) return "기본분석 + 상세 성격분석 + 직업 추천 + 결혼시기 + 건강 관리법";
    if (p <= 150) return "베이직 + 심화분석 + 10년 대운 + 가족운 + 자녀운 + 사회운 + 명예운";
    return "프리미엄 모든 것 + 월별 상세운세 + 각 달 주의사항 + 궁합분석 + 궁극의 개운법";
  };

  const price = getPrice(pageCount);
  const packageName = getPackageName(pageCount);

  const typeNames: Record<string, string> = {
    daily: "오늘의 운세", monthly: "이번달 운세", yearly: "올해 운세",
    basic: "전체 사주분석", wealth: "재물운 분석", love: "연애운 분석",
    health: "건강운 분석", jeong: "궁합 분석"
  };

  const typeLabel = type.split(",").map(t => typeNames[t] || t).join(", ");

  const handlePayment = () => {
    const params = new URLSearchParams({
      name, birthDate, birthTime, gender, type, pages
    });
    router.push(`/result?${params.toString()}`);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#0a0618 0%,#0f0a2e 100%)",
      color: "white", fontFamily: "sans-serif",
    }}>

      {/* 헤더 */}
      <header style={{
        borderBottom: "1px solid rgba(139,92,246,0.3)",
        padding: "16px 24px",
      }}>
        <Link href="/" style={{
          fontSize: 22, fontWeight: 900, textDecoration: "none",
          background: "linear-gradient(135deg,#f59e0b,#fcd34d)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>⭐ 점운</Link>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>

        <h2 style={{
          textAlign: "center", fontSize: 28, fontWeight: 900, marginBottom: 32,
          background: "linear-gradient(135deg,#f59e0b,#fcd34d)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>💳 결제하기</h2>

        {/* 주문 요약 */}
        <div style={{
          background: "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))",
          border: "2px solid rgba(245,158,11,0.4)",
          borderRadius: 18, padding: "24px", marginBottom: 20,
        }}>
          <h3 style={{ color: "#fbbf24", fontWeight: 800, fontSize: 18, marginBottom: 18 }}>
            📋 주문 요약
          </h3>

          {[
            { label: "이름", value: name },
            { label: "생년월일", value: birthDate },
            { label: "출생시간", value: birthTime },
            { label: "성별", value: gender === "male" ? "👨 남성" : "👩 여성" },
            { label: "분석종류", value: typeLabel },
            { label: "패키지", value: packageName },
            { label: "패키지내용", value: getPackageDescription(pageCount) },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < 6 ? "1px solid rgba(139,92,246,0.15)" : "none",
            }}>
              <span style={{ color: "#94a3b8", fontSize: 15 }}>{item.label}</span>
              <span style={{ color: "white", fontWeight: 600, fontSize: 15 }}>{item.value}</span>
            </div>
          ))}

          {/* 결제금액 */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 16, paddingTop: 16,
            borderTop: "2px solid rgba(245,158,11,0.4)",
          }}>
            <span style={{ color: "white", fontWeight: 800, fontSize: 18 }}>결제금액</span>
            <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: 32 }}>
              {price.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 테스트 안내 */}
        <div style={{
          background: "rgba(59,130,246,0.15)",
          border: "1px solid rgba(59,130,246,0.4)",
          borderRadius: 14, padding: "16px", marginBottom: 20,
        }}>
          <p style={{ color: "#60a5fa", fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
            🧪 테스트 모드
          </p>
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            현재 테스트 중입니다. 결제 없이 결과를 확인하세요!
          </p>
        </div>

        {/* 결제 버튼 */}
        <button onClick={handlePayment}
          style={{
            width: "100%", padding: "22px", borderRadius: 16,
            fontSize: 20, fontWeight: 900, cursor: "pointer",
            background: "linear-gradient(135deg,#f59e0b,#d97706)",
            color: "black", border: "none",
            boxShadow: "0 8px 30px rgba(245,158,11,0.5)",
            marginBottom: 12,
          }}>
          ✨ {price.toLocaleString()}원 결제하기
        </button>

        <Link href="/analyze">
          <button style={{
            width: "100%", padding: "16px", borderRadius: 14,
            fontSize: 16, fontWeight: 700, cursor: "pointer",
            background: "rgba(139,92,246,0.15)",
            color: "#94a3b8", border: "1px solid rgba(139,92,246,0.3)",
          }}>
            ← 돌아가기
          </button>
        </Link>
      </div>
    </main>
  );
}

