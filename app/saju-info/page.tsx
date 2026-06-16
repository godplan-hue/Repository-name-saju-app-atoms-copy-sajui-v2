'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SajuInfo() {
  const [activeTab, setActiveTab] = useState('yinyang');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tabData = {
    yinyang: {
      title: '음양오행',
      layout: 'sections',
      sections: [
        {
          title: '음양(陰陽)',
          color: '#22c55e',
          bgColor: 'rgba(34, 197, 94, 0.15)',
          items: [
            { name: '양(陽)', desc: '밝음·낮·여름·남쪽·남성·적극·진보·외향성을 상징합니다.' },
            { name: '음(陰)', desc: '어두움·밤·겨울·북쪽·여성·안정·보수·내향성을 상징합니다.' }
          ]
        },
        {
          title: '오행(五行)',
          color: '#ec4899',
          bgColor: 'rgba(236, 72, 153, 0.15)',
          items: [
            { name: '목(木) · 나무', desc: '성장·발전·창의성·정의감·참을성을 상징합니다.' },
            { name: '화(火) · 불', desc: '열정·외향성·지혜·예술성·표현력을 상징합니다.' },
            { name: '토(土) · 흙', desc: '중심·신뢰·현실성·포용력·신중함을 상징합니다.' },
            { name: '금(金) · 쇠', desc: '정의·결단력·질서·엄격함·독립심을 상징합니다.' },
            { name: '수(水) · 물', desc: '지혜·유연성·신비성·내성·수성을 상징합니다.' }
          ]
        },
        {
          title: '상성(相性) · 상극(相剋)',
          color: '#a78bfa',
          bgColor: 'rgba(167, 139, 250, 0.15)',
          items: [
            { name: '상성(相性)', desc: '목·노·토·기·토·주가 서로 도움을 주는 상태를 상징합니다.' },
            { name: '상극(相剋)', desc: '나무·불·흙·쇠·물이 서로 극하는 상태를 상징합니다.' }
          ]
        }
      ]
    },
    jeong: {
      title: '최강자지',
      layout: 'grid',
      items: [
        { name: '정재(正財)', desc: '변하지 않는 다른 곧장 관계 정재·정답·다정답 정재 상징', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '편재(偏財)', desc: '변하는 다른 곧장 관계 편재·부동산·사업재 상징', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
        { name: '정관(正官)', desc: '변하지 않는 나를 제어하는 것 정관·명예·지위 상징', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '편관(偏官)', desc: '변하는 나를 제어하는 것 편관·권력·경쟁 상징', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
        { name: '정인(正印)', desc: '변하지 않는 나를 낳는 것 정인·어머니·배움 상징', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '편인(偏印)', desc: '변하는 나를 낳는 것 편인·의외성·신비 상징', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
        { name: '식신(食神)', desc: '나와 같은 음양·나를 낳는 것 식신·창의·표현 상징', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '상관(傷官)', desc: '나와 같은 음양·나를 제어하는 것 상관·손실·창의 상징', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
        { name: '비견(比肩)', desc: '나와 같은 오행·같은 음양 비견·형제·경쟁 상징', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '겁재(劫財)', desc: '나와 같은 오행·다른 음양 겁재·손실·협력 상징', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' }
      ]
    },
    sang: {
      title: '상성',
      layout: 'sections',
      sections: [
        {
          title: '음양(陰陽)',
          color: '#22c55e',
          bgColor: 'rgba(34, 197, 94, 0.15)',
          items: [
            { name: '양(陽)', desc: '밝음·낮·여름·남쪽·남성·적극·진보·외향성을 상징합니다.' },
            { name: '음(陰)', desc: '어두움·밤·겨울·북쪽·여성·안정·보수·내향성을 상징합니다.' }
          ]
        },
        {
          title: '오행(五行)',
          color: '#ec4899',
          bgColor: 'rgba(236, 72, 153, 0.15)',
          items: [
            { name: '목(木) · 나무', desc: '성장·발전·창의성·정의감·참을성을 상징합니다.' },
            { name: '화(火) · 불', desc: '열정·외향성·지혜·예술성·표현력을 상징합니다.' },
            { name: '토(土) · 흙', desc: '중심·신뢰·현실성·포용력·신중함을 상징합니다.' },
            { name: '금(金) · 쇠', desc: '정의·결단력·질서·엄격함·독립심을 상징합니다.' },
            { name: '수(水) · 물', desc: '지혜·유연성·신비성·내성·수성을 상징합니다.' }
          ]
        },
        {
          title: '상성(相性) · 상극(相剋)',
          color: '#a78bfa',
          bgColor: 'rgba(167, 139, 250, 0.15)',
          items: [
            { name: '상성(相性)', desc: '목·노·토·기·토·주가 서로 도움을 주는 상태를 상징합니다.' },
            { name: '상극(相剋)', desc: '나무·불·흙·쇠·물이 서로 극하는 상태를 상징합니다.' }
          ]
        }
      ]
    }
  };

  const currentTab = tabData[activeTab as keyof typeof tabData];
  const isGrid = currentTab.layout === 'grid';

  if (isMobile) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3d2670 0%, #4a3280 50%, #3d2670 100%)",
        color: "white",
        fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        padding: "12px 12px 30px 12px",
        position: "relative"
      }}>
        <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.1)", zIndex: 1, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10 }}>
          {/* 헤더 */}
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#e9d5ff", margin: 0 }}>사주를 이해하는 핵심 개념 정리</h1>
          </div>

          {/* 탭 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            <button
              onClick={() => setActiveTab('yinyang')}
              style={{
                padding: "9px 11px",
                background: activeTab === 'yinyang' ? "linear-gradient(135deg, #a78bfa, #c084fc)" : "rgba(139, 92, 246, 0.5)",
                color: "white",
                border: activeTab === 'yinyang' ? "2px solid #5b21b6" : "2px solid rgba(167, 139, 250, 0.8)",
                borderRadius: 5,
                fontWeight: 900,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              ● 음양오행
            </button>
            
            <button
              onClick={() => setActiveTab('jeong')}
              style={{
                padding: "9px 11px",
                background: activeTab === 'jeong' ? "#a5f3fc" : "rgba(165, 243, 252, 0.2)",
                color: activeTab === 'jeong' ? "#0c4a6e" : "white",
                border: "2px solid rgba(165, 243, 252, 0.4)",
                borderRadius: 5,
                fontWeight: 900,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              ● 최강자지
            </button>
            
            <button
              onClick={() => setActiveTab('sang')}
              style={{
                padding: "9px 11px",
                background: activeTab === 'sang' ? "#ec4899" : "rgba(236, 72, 153, 0.5)",
                color: "white",
                border: "2px solid #ec4899",
                borderRadius: 5,
                fontWeight: 900,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              ● 상성
            </button>
            
            <Link
              href="/"
              style={{
                display: "block",
                padding: "9px 11px",
                background: "#f59e0b",
                color: "black",
                border: "none",
                borderRadius: 5,
                fontWeight: 900,
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "none",
                textAlign: "center"
              }}
            >
              ← 돌아가기
            </Link>
          </div>

          {/* 컨텐츠 */}
          <div>
            {isGrid ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(currentTab as any).items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: item.bgColor,
                      border: `2px solid ${item.color}`,
                      borderRadius: 5,
                      padding: 10
                    }}
                  >
                    <p style={{ color: item.color, fontWeight: 900, fontSize: 11, margin: "0 0 5px 0" }}>
                      {item.name}
                    </p>
                    <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 10, lineHeight: 1.5, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(currentTab as any).sections.map((section: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: section.bgColor,
                      border: `2px solid ${section.color}`,
                      borderRadius: 5,
                      padding: 10
                    }}
                  >
                    <h3 style={{ color: section.color, fontWeight: 900, fontSize: 12, marginTop: 0, marginBottom: 7 }}>
                      ● {section.title}
                    </h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {section.items.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} style={{ borderLeft: `2px solid ${section.color}`, paddingLeft: 8 }}>
                          <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 11, margin: "0 0 3px 0" }}>
                            {item.name}
                          </p>
                          <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 10, lineHeight: 1.5, margin: 0 }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link
              href="/free-analysis"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                color: "black",
                padding: "8px 24px",
                borderRadius: 999,
                fontWeight: 900,
                fontSize: 11,
                textDecoration: "none",
                boxShadow: "0 8px 30px rgba(251, 191, 36, 0.4)",
                cursor: "pointer"
              }}
            >
              ✨ 지금 분석해보기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // PC 버전
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #3d2670 0%, #4a3280 50%, #3d2670 100%)",
      color: "white",
      fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      padding: "18px 20px 45px 20px",
      position: "relative"
    }}>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.1)", zIndex: 1, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 820, margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#e9d5ff", margin: 0 }}>사주를 이해하는 핵심 개념 정리</h1>
        </div>

        {/* 메인 컨테이너 */}
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, alignItems: "start" }}>
          {/* 왼쪽: 탭 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => setActiveTab('yinyang')}
              style={{
                padding: "11px 13px",
                background: activeTab === 'yinyang' ? "linear-gradient(135deg, #a78bfa, #c084fc)" : "rgba(139, 92, 246, 0.5)",
                color: "white",
                border: activeTab === 'yinyang' ? "2px solid #5b21b6" : "2px solid rgba(167, 139, 250, 0.8)",
                borderRadius: 6,
                fontWeight: 900,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              ● 음양오행
            </button>
            
            <button
              onClick={() => setActiveTab('jeong')}
              style={{
                padding: "11px 13px",
                background: activeTab === 'jeong' ? "#a5f3fc" : "rgba(165, 243, 252, 0.2)",
                color: activeTab === 'jeong' ? "#0c4a6e" : "white",
                border: "2px solid rgba(165, 243, 252, 0.4)",
                borderRadius: 6,
                fontWeight: 900,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              ● 최강자지
            </button>
            
            <button
              onClick={() => setActiveTab('sang')}
              style={{
                padding: "11px 13px",
                background: activeTab === 'sang' ? "#ec4899" : "rgba(236, 72, 153, 0.5)",
                color: "white",
                border: "2px solid #ec4899",
                borderRadius: 6,
                fontWeight: 900,
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              ● 상성
            </button>
            
            <Link
              href="/"
              style={{
                display: "block",
                padding: "11px 13px",
                background: "#f59e0b",
                color: "black",
                border: "none",
                borderRadius: 6,
                fontWeight: 900,
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "none",
                textAlign: "center",
                marginTop: 6
              }}
            >
              ← 돌아가기
            </Link>
          </div>

          {/* 오른쪽: 컨텐츠 */}
          <div>
            {isGrid ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {(currentTab as any).items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: item.bgColor,
                      border: `2px solid ${item.color}`,
                      borderRadius: 6,
                      padding: 14,
                      minHeight: 90
                    }}
                  >
                    <p style={{ color: item.color, fontWeight: 900, fontSize: 13, margin: "0 0 6px 0" }}>
                      {item.name}
                    </p>
                    <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {(currentTab as any).sections.map((section: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: section.bgColor,
                      border: `2px solid ${section.color}`,
                      borderRadius: 6,
                      padding: 13
                    }}
                  >
                    <h3 style={{ color: section.color, fontWeight: 900, fontSize: 14, marginTop: 0, marginBottom: 10 }}>
                      ● {section.title}
                    </h3>
                    
                    <div style={{ display: "grid", gap: 8 }}>
                      {section.items.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} style={{ borderLeft: `2px solid ${section.color}`, paddingLeft: 10 }}>
                          <p style={{ color: "#fbbf24", fontWeight: 900, fontSize: 13, margin: "0 0 4px 0" }}>
                            {item.name}
                          </p>
                          <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 25 }}>
          <Link
            href="/free-analysis"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              color: "black",
              padding: "9px 26px",
              borderRadius: 999,
              fontWeight: 900,
              fontSize: 11,
              textDecoration: "none",
              boxShadow: "0 8px 30px rgba(251, 191, 36, 0.4)",
              cursor: "pointer"
            }}
          >
            ✨ 지금 분석해보기
          </Link>
        </div>
      </div>
    </main>
  );
}