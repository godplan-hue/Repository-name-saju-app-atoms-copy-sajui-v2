"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import QASection from "@/components/QASection";

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

function QAListContent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let n = "", y = 0;
    const raw = sessionStorage.getItem("v2_result");
    if (raw) {
      try {
        const r = JSON.parse(raw);
        n = r?.profile?.name ?? "";
        y = Number(r?.profile?.birthYear ?? 0);
      } catch {}
    }
    if (!n || !y) {
      try {
        const saved = localStorage.getItem("v2_saved_profile");
        if (saved) { const p = JSON.parse(saved); n = p?.name ?? ""; y = Number(p?.birthYear ?? 0); }
      } catch {}
    }
    if (!n || !y) { router.replace("/main-v2"); return; }
    setName(n);
    setBirthYear(y);
    const plan = sessionStorage.getItem("v2_plan") ?? "";
    const paidSession = plan === "select" || plan === "package";
    const lsUnlock = localStorage.getItem(`v2_qa_unlock_${n}_${y}`);
    const paidToday = lsUnlock === todayKey();
    setUnlocked(paidSession || paidToday);
    setReady(true);
  }, [router]);

  if (!ready) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf4ff" }}>
      <p style={{ color: "#8b5cf6", fontWeight: 700 }}>불러오는 중...</p>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <div style={{ background: "white", borderBottom: "1px solid #f3e8ff", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#8b5cf6", padding: "0 4px" }}>←</button>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>사주 Q&amp;A</p>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: unlocked ? "#8b5cf6" : "#ef4444", display: "flex", alignItems: "center", gap: 5 }}>
            {unlocked ? "무제한 열람 가능" : "카테고리별 무료 3개 열람"}
            <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444" }}>· 결제 시 하루 무제한</span>
          </p>
        </div>
      </div>
      <div style={{ background: "white", padding: "4px 0", textAlign: "center", borderBottom: "1px solid #f3e8ff" }}>
        <span style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700 }}>💳 결제 시 하루 동안 무제한 이용 가능</span>
      </div>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 60px" }}>
        <QASection
          name={name}
          birthYear={birthYear}
          unlocked={unlocked}
          onBuyClick={() => router.push("/main-v2/payment?scrollTo=packages")}
        />
      </div>
    </main>
  );
}

export default function QAListPage() {
  return (
    <Suspense>
      <QAListContent />
    </Suspense>
  );
}
