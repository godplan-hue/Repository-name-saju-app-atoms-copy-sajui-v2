"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QASection from "@/components/QASection";

export default function QAPage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [birthYear, setBirthYear] = useState<number>(0);
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("v2_result");
    if (!raw) { router.replace("/main-v2"); return; }
    const r = JSON.parse(raw);
    const n = r?.profile?.name ?? "";
    const y = Number(r?.profile?.birthYear ?? 0);
    if (!n || !y) { router.replace("/main-v2"); return; }
    setName(n);
    setBirthYear(y);
    const plan = sessionStorage.getItem("v2_plan") ?? "";
    setUnlocked(plan === "select" || plan === "package");
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf4ff" }}>
        <p style={{ color: "#8b5cf6", fontWeight: 700 }}>불러오는 중...</p>
      </div>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fdf4ff 0%, #fce7f3 50%, #ede9fe 100%)",
      fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    }}>
      {/* 상단 헤더 */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(253,244,255,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #f3e8ff",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "#8b5cf6",
            padding: "4px 8px",
            borderRadius: 8,
          }}
        >←</button>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#1a1a2e" }}>🔮 사주 Q&amp;A</p>
          <p style={{ margin: 0, fontSize: 11, color: "#8b5cf6", fontWeight: 700 }}>{name}님 전용</p>
        </div>
      </div>

      {/* Q&A 본문 */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px 16px 80px" }}>
        <QASection
          name={name}
          birthYear={birthYear}
          unlocked={unlocked}
          onBuyClick={() => router.push("/main-v2/payment")}
        />
      </div>
    </main>
  );
}
