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
          title: '상생(相生) · 상극(相剋)',
          color: '#a78bfa',
          bgColor: 'rgba(167, 139, 250, 0.15)',
          items: [
            { name: '상생(相生)', desc: '목생화(木生火)·화생토(火生土)·토생금(土生金)·금생수(金生水)·수생목(水生木) — 오행이 차례로 서로를 살려주는 순환 관계입니다.' },
            { name: '상극(相剋)', desc: '목극토(木剋土)·토극수(土剋水)·수극화(水剋火)·화극금(火剋金)·금극목(金剋木) — 오행이 서로를 억누르고 다스리는 관계입니다.' }
          ]
        }
      ]
    },
    jeong: {
      title: '십성(十星)',
      layout: 'grid',
      items: [
        { name: '정재(正財)', desc: '내가 다스리는 오행 중 음양이 같은 것 — 꾸준히 모이는 안정된 재물, 월급처럼 정직하게 들어오는 수입을 상징합니다.', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '편재(偏財)', desc: '내가 다스리는 오행 중 음양이 다른 것 — 유동적인 재물, 투자나 사업처럼 크게 오가는 돈의 흐름을 상징합니다.', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
        { name: '정관(正官)', desc: '나를 다스리는 오행 중 음양이 같은 것 — 명예와 지위, 정당한 책임과 질서를 상징합니다.', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '편관(偏官)', desc: '나를 다스리는 오행 중 음양이 다른 것 — 권력과 경쟁, 도전적인 추진력을 상징합니다.', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
        { name: '정인(正印)', desc: '나를 낳아주는 오행 중 음양이 같은 것 — 어머니의 보살핌과 같은 학문, 안정적인 배움과 보호를 상징합니다.', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '편인(偏印)', desc: '나를 낳아주는 오행 중 음양이 다른 것 — 독창적인 직관, 예상치 못한 곳에서 오는 도움을 상징합니다.', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
        { name: '식신(食神)', desc: '내가 낳는 오행 중 음양이 같은 것 — 먹고사는 일의 풍요, 여유와 표현력을 상징합니다.', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '상관(傷官)', desc: '내가 낳는 오행 중 음양이 다른 것 — 날카로운 재능과 비판정신, 틀을 벗어나려는 기운을 상징합니다.', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
        { name: '비견(比肩)', desc: '나와 오행·음양이 모두 같은 것 — 형제처럼 나란히 서는 기운, 자립심과 선의의 경쟁심을 상징합니다.', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
        { name: '겁재(劫財)', desc: '나와 오행은 같으나 음양이 다른 것 — 함께 나누면서도 서로 다투게 되는 기운, 협력과 경쟁이 공존함을 상징합니다.', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' }
      ]
    },
    sang: {
      title: '상생·상극',
      layout: 'sections',
      sections: [
        {
          title: '상생(相生) · 서로를 살리는 순환',
          color: '#22c55e',
          bgColor: 'rgba(34, 197, 94, 0.15)',
          items: [
            { name: '목생화(木生火)', desc: '나무가 타올라 불을 살립니다 — 성장의 기운이 열정으로 이어집니다.' },
            { name: '화생토(火生土)', desc: '불이 다 타고 남은 재가 흙이 됩니다 — 열정이 안정과 신뢰를 만듭니다.' },
            { name: '토생금(土生金)', desc: '흙 속에서 쇠가 만들어집니다 — 신중함이 결단력을 길러냅니다.' },
            { name: '금생수(金生水)', desc: '쇠가 녹으면 물이 됩니다 — 결단력이 깊은 지혜로 이어집니다.' },
            { name: '수생목(水生木)', desc: '물이 나무를 자라게 합니다 — 지혜가 다시 새로운 성장의 씨앗이 됩니다.' }
          ]
        },
        {
          title: '상극(相剋) · 서로를 다스리는 관계',
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.15)',
          items: [
            { name: '목극토(木剋土)', desc: '나무뿌리가 흙을 가르고 자랍니다 — 성장의 기운이 지나치면 안정을 흔들 수 있습니다.' },
            { name: '토극수(土剋水)', desc: '흙이 물의 흐름을 가둡니다 — 신중함이 지나치면 유연함을 막을 수 있습니다.' },
            { name: '수극화(水剋火)', desc: '물이 불을 끕니다 — 차분함이 과한 열정을 가라앉힙니다.' },
            { name: '화극금(火剋金)', desc: '불이 쇠를 녹여 형태를 바꿉니다 — 열정이 지나친 단호함을 누그러뜨립니다.' },
            { name: '금극목(金剋木)', desc: '쇠도끼가 나무를 벱니다 — 결단력이 과도한 확장을 다듬어줍니다.' }
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
              ● 십성
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
              ● 상생·상극
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
              ● 십성
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
              ● 상생·상극
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