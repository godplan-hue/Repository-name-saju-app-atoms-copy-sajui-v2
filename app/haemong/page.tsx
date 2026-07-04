"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DREAM_CATEGORIES,
  POPULAR_DREAMS,
  DREAMS,
  searchKeywords,
} from "@/lib/haemong/data";

export default function HaemongPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  function handleSearch() {
    if (!query.trim()) return;
    const found = searchKeywords(query.trim());
    setResults(found);
    setSearched(true);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  function goTo(keyword: string) {
    router.push(`/haemong/${encodeURIComponent(keyword)}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#e8e0f0", fontFamily: "'Apple SD Gothic Neo', sans-serif" }}>

      {/* 헤더 */}
      <div style={{ background: "linear-gradient(180deg,#0a0a1a 0%,#12082a 100%)", borderBottom: "1px solid #2a1a4a", padding: "20px 16px 24px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>🌙</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#d4b8f5", margin: 0, letterSpacing: -0.5 }}>꿈해몽</h1>
          <p style={{ fontSize: 13, color: "#8a7aaa", marginTop: 6, marginBottom: 0 }}>꿈이 전하는 오늘의 메시지</p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* 검색창 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="꿈 키워드 검색 (예: 뱀, 돼지, 이빨)"
            style={{
              flex: 1, padding: "14px 16px", borderRadius: 12,
              background: "#1a1030", border: "1px solid #3a2060",
              color: "#e8e0f0", fontSize: 15, outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "14px 18px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
              color: "#fff", fontSize: 16, cursor: "pointer", flexShrink: 0,
            }}
          >
            🔍
          </button>
        </div>

        {/* 검색 결과 */}
        {searched && (
          <div style={{ marginBottom: 28 }}>
            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#7a6a9a", fontSize: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🌫️</div>
                <p style={{ margin: 0 }}>검색 결과가 없어요</p>
                <p style={{ margin: "4px 0 0", fontSize: 12 }}>다른 키워드로 검색해 보세요</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 13, color: "#8a7aaa", marginBottom: 10 }}>"{query}" 검색 결과 {results.length}개</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {results.map(kw => {
                    const d = DREAMS[kw];
                    return (
                      <button
                        key={kw}
                        onClick={() => goTo(kw)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "14px 16px", borderRadius: 12,
                          background: "#1a1030", border: "1px solid #3a2060",
                          cursor: "pointer", textAlign: "left", width: "100%",
                        }}
                      >
                        <span style={{ fontSize: 28 }}>{d.emoji}</span>
                        <div>
                          <div style={{ color: "#d4b8f5", fontWeight: 600, fontSize: 15 }}>{kw}</div>
                          <div style={{ color: "#8a7aaa", fontSize: 13, marginTop: 2 }}>{d.summary}</div>
                        </div>
                        <span style={{
                          marginLeft: "auto", padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: d.luck === "길몽" ? "#064e3b" : d.luck === "흉몽" ? "#450a0a" : "#1e1e3a",
                          color: d.luck === "길몽" ? "#6ee7b7" : d.luck === "흉몽" ? "#fca5a5" : "#a5b4fc",
                        }}>{d.luck}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* 카테고리 */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#c4a8e8", marginBottom: 12, marginTop: 0 }}>카테고리</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {DREAM_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => router.push(`/haemong?category=${cat.id}`)}
                style={{
                  padding: "14px 12px", borderRadius: 12, border: `1px solid ${cat.border}`,
                  background: cat.bg, cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <span style={{ fontSize: 22 }}>{cat.emoji}</span>
                <span style={{ color: "#e8e0f0", fontSize: 14, fontWeight: 600 }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 인기 꿈 */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#c4a8e8", marginBottom: 12, marginTop: 0 }}>인기 꿈 해몽</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {POPULAR_DREAMS.map((kw, i) => {
              const d = DREAMS[kw];
              if (!d) return null;
              return (
                <button
                  key={kw}
                  onClick={() => goTo(kw)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 16px", borderRadius: 12,
                    background: "#110c22", border: "1px solid #2a1a4a",
                    cursor: "pointer", textAlign: "left", width: "100%",
                  }}
                >
                  <span style={{ color: "#5b21b6", fontWeight: 700, fontSize: 13, width: 20, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 22 }}>{d.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: "#d4b8f5", fontWeight: 600, fontSize: 15 }}>{kw}</span>
                    <span style={{ color: "#6a5a8a", fontSize: 12, marginLeft: 8 }}>{d.summary.slice(0, 18)}…</span>
                  </div>
                  <span style={{
                    padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, flexShrink: 0,
                    background: d.luck === "길몽" ? "#064e3b" : d.luck === "흉몽" ? "#450a0a" : "#1e1e3a",
                    color: d.luck === "길몽" ? "#6ee7b7" : d.luck === "흉몽" ? "#fca5a5" : "#a5b4fc",
                  }}>{d.luck}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 사주 연결 배너 */}
        <div
          style={{
            marginTop: 32, padding: "20px 16px", borderRadius: 16,
            background: "linear-gradient(135deg,#2d1b69,#1e1a3a)",
            border: "1px solid #5b21b6", textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🐱</div>
          <p style={{ color: "#c4a8e8", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>꿈 + 사주로 더 정확하게</p>
          <p style={{ color: "#8a7aaa", fontSize: 13, margin: "0 0 14px" }}>내 사주와 연결하면 꿈의 의미가 더 선명해져요</p>
          <button
            onClick={() => router.push("/main-v2")}
            style={{
              padding: "10px 24px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >
            내 사주 보러가기 →
          </button>
        </div>
      </div>
    </div>
  );
}
