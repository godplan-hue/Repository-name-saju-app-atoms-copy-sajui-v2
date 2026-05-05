'use client';

import { useState } from 'react';

export default function SajuInfo() {
  const [activeCategory, setActiveCategory] = useState('yinyang');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const categories = [
    { id: 'yinyang', name: '음양오행', icon: '☯️' },
    { id: 'jeong', name: '최강자지', icon: '🎯' },
    { id: 'sang', name: '상성', icon: '💑' }
  ];

  const content: Record<string, any> = {
    yinyang: {
      title: '음양오행(陰陽五行)',
      items: [
        {
          id: 'yin',
          icon: '🌙',
          name: '음(陰)',
          desc: '음은 밤, 겨울, 북쪽, 여성, 안정, 보수, 내향성을 상징. 차분하고 신중하며 안정을 추구하는 특성.',
          keywords: ['밤', '여름', '북쪽', '여성', '안정']
        },
        {
          id: 'yang',
          icon: '☀️',
          name: '양(陽)',
          desc: '양은 낮, 여름, 남쪽, 남성, 적극, 진보, 외향성을 상징. 활발하고 진취적이며 변화를 추구하는 특성.',
          keywords: ['낮', '여름', '남쪽', '남성', '적극']
        },
        {
          id: 'wood',
          icon: '🌳',
          name: '목(木) - 나무',
          desc: '성장, 발전, 창의성, 정의감, 참을성을 상징. 목기운이 강한 사람은 창의력이 풍부하고 진취적.',
          keywords: ['성장', '발전', '창의', '정의', '동쪽']
        },
        {
          id: 'fire',
          icon: '🔥',
          name: '화(火) - 불',
          desc: '열정, 외향성, 지혜, 예술성, 표현력을 상징. 화기운이 강한 사람은 사교적이고 표현력이 뛰어남.',
          keywords: ['열정', '외향', '지혜', '예술', '남쪽']
        },
        {
          id: 'earth',
          icon: '🏔️',
          name: '토(土) - 흙',
          desc: '안정, 신뢰, 현실성, 포용력, 신중함을 상징. 토기운이 강한 사람은 믿음직하고 현실적.',
          keywords: ['안정', '신뢰', '현실', '포용', '중앙']
        },
        {
          id: 'metal',
          icon: '⚔️',
          name: '금(金) - 금속',
          desc: '정의, 결단력, 질서, 엄격함, 독립심을 상징. 금기운이 강한 사람은 결단력 있고 원칙적.',
          keywords: ['정의', '결단', '질서', '엄격', '서쪽']
        },
        {
          id: 'water',
          icon: '💧',
          name: '수(水) - 물',
          desc: '지혜, 유연성, 신비성, 내성, 수성을 상징. 수기운이 강한 사람은 지혜롭고 적응력이 뛰어남.',
          keywords: ['지혜', '유연', '신비', '내성', '북쪽']
        }
      ]
    },
    jeong: {
      title: '최강자지(最強自知)',
      items: [
        {
          id: 'jae',
          icon: '💰',
          name: '재성(財星)',
          desc: '재물운을 나타냄. 재성이 강하면 돈을 버는 능력이 뛰어나고 경제적으로 풍족함.',
          keywords: ['재물', '돈', '부', '경제', '수입']
        },
        {
          id: 'gwon',
          icon: '👑',
          name: '권성(權星)',
          desc: '권력과 지위를 나타냄. 권성이 강하면 리더십이 뛰어나고 지위가 높음.',
          keywords: ['권력', '지위', '리더십', '영향력', '권한']
        },
        {
          id: 'yeon',
          icon: '❤️',
          name: '연성(緣星)',
          desc: '인연과 관계운을 나타냄. 연성이 강하면 좋은 인연을 만나고 관계가 원만함.',
          keywords: ['인연', '관계', '결혼', '친구', '만남']
        },
        {
          id: 'yul',
          icon: '📚',
          name: '율성(律星)',
          desc: '학문과 지식을 나타냄. 율성이 강하면 공부 잘하고 지식이 많음.',
          keywords: ['학문', '지식', '공부', '지능', '교육']
        },
        {
          id: 'gwang',
          icon: '🌟',
          name: '광성(光星)',
          desc: '명예와 성공을 나타냄. 광성이 강하면 이름을 떨치고 사회적으로 성공함.',
          keywords: ['명예', '성공', '인정', '평판', '영광']
        },
        {
          id: 'sa',
          icon: '⚡',
          name: '사성(邪星)',
          desc: '도전과 변화를 나타냄. 사성이 강하면 적응력이 뛰어나고 변화를 잘 수용함.',
          keywords: ['도전', '변화', '적응', '혁신', '진취']
        },
        {
          id: 'ha',
          icon: '🎭',
          name: '해성(害星)',
          desc: '극복과 성장을 나타냄. 해성이 있으면 어려움이 있지만 극복하며 성장함.',
          keywords: ['극복', '성장', '도전', '경험', '학습']
        }
      ]
    },
    sang: {
      title: '상성(相性)',
      items: [
        {
          id: 'rat_ox',
          icon: '🐀',
          name: '자(鼠) - 나',
          desc: '지혜롭고, 다재다능하며, 사교적이고 민첩함. 약간의 성급함과 의심이 있을 수 있음.',
          keywords: ['지혜', '다재다능', '사교', '민첩', '12시']
        },
        {
          id: 'ox',
          icon: '🐂',
          name: '축(丑) - 소',
          desc: '성실하고, 책임감 강하며, 우직하고 신뢰할 수 있음. 다소 고집스러울 수 있음.',
          keywords: ['성실', '책임', '우직', '신뢰', '1시']
        },
        {
          id: 'tiger',
          icon: '🐅',
          name: '인(寅) - 호랑이',
          desc: '용감하고, 정의감 강하며, 지도력이 있음. 다소 성급하고 고집스러울 수 있음.',
          keywords: ['용감', '정의', '지도력', '성급', '3시']
        },
        {
          id: 'rabbit',
          icon: '🐰',
          name: '묘(卯) - 토끼',
          desc: '온화하고, 세심하며, 예술적 감수성이 뛰어남. 다소 우유부단할 수 있음.',
          keywords: ['온화', '세심', '예술', '우유부단', '5시']
        },
        {
          id: 'dragon',
          icon: '🐉',
          name: '진(辰) - 용',
          desc: '자신감 있고, 야망이 크며, 카리스마 있음. 다소 자존심이 셀 수 있음.',
          keywords: ['자신감', '야망', '카리스마', '자존심', '7시']
        },
        {
          id: 'snake',
          icon: '🐍',
          name: '사(巳) - 뱀',
          desc: '신비로우며, 지혜로우며, 깊이 있음. 다소 의심이 많을 수 있음.',
          keywords: ['신비', '지혜', '깊이', '의심', '9시']
        },
        {
          id: 'horse',
          icon: '🐴',
          name: '오(午) - 말',
          desc: '활발하고, 열정적이며, 자유로움. 다소 차분함이 부족할 수 있음.',
          keywords: ['활발', '열정', '자유', '행동력', '11시']
        },
        {
          id: 'goat',
          icon: '🐑',
          name: '미(未) - 양',
          desc: '온화하고, 감정이 풍부하며, 배려심이 많음. 다소 결단력이 부족할 수 있음.',
          keywords: ['온화', '감정', '배려', '예민', '1시']
        },
        {
          id: 'monkey',
          icon: '🐵',
          name: '신(申) - 원숭이',
          desc: '똑똑하고, 재치 있으며, 적응력이 뛰어남. 다소 영리하다는 인상을 줄 수 있음.',
          keywords: ['똑똑', '재치', '적응', '영리', '3시']
        },
        {
          id: 'rooster',
          icon: '🐓',
          name: '유(酉) - 닭',
          desc: '진실하고, 정직하며, 성실함. 다소 비판적일 수 있음.',
          keywords: ['진실', '정직', '성실', '비판', '5시']
        },
        {
          id: 'dog',
          icon: '🐕',
          name: '술(戌) - 개',
          desc: '충직하고, 의리 있으며, 믿음직함. 다소 고집스러울 수 있음.',
          keywords: ['충직', '의리', '믿음직', '고집', '7시']
        },
        {
          id: 'pig',
          icon: '🐷',
          name: '해(亥) - 돼지',
          desc: '순박하고, 진실하며, 선하고 따뜻함. 다소 순진할 수 있음.',
          keywords: ['순박', '진실', '따뜻', '순진', '9시']
        }
      ]
    }
  };

  const currentContent = content[activeCategory];

  return (
    <main style={{minHeight: "100vh", background: "linear-gradient(180deg, #0a0618 0%, #0f0a2e 100%)", color: "white", fontFamily: "sans-serif"}}>
      
      {/* 헤더 */}
      <header style={{borderBottom: "1px solid rgba(139,92,246,0.3)", padding: "16px 24px"}}>
        <h1 style={{fontSize: 24, fontWeight: 900, marginBottom: 0, color: "#fbbf24"}}>⭐ 점운</h1>
      </header>

      <div style={{maxWidth: 1200, margin: "0 auto", padding: "40px 20px"}}>
        
        <h2 style={{fontSize: 32, fontWeight: 900, marginBottom: 40, textAlign: "center", color: "#fbbf24"}}>사주를 이해하는 핵심 개념 정리</h2>

        <div style={{display: "grid", gridTemplateColumns: "250px 1fr", gap: 40}}>
          
          {/* 왼쪽: 카테고리 */}
          <div>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{width: "100%", padding: "16px", borderRadius: 12, marginBottom: 12, background: activeCategory === cat.id ? "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))" : "rgba(139,92,246,0.1)", border: activeCategory === cat.id ? "2px solid #f59e0b" : "1px solid rgba(139,92,246,0.3)", color: activeCategory === cat.id ? "#fbbf24" : "white", fontWeight: 800, cursor: "pointer", fontSize: 15, textAlign: "left"}}
              >
                <span style={{fontSize: 20, marginRight: 8}}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
            
            <button
              onClick={() => window.location.href = '/'}
              style={{width: "100%", padding: "12px", borderRadius: 12, marginTop: 24, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa", fontWeight: 700, cursor: "pointer"}}
            >
              ← 홈으로
            </button>
          </div>

          {/* 오른쪽: 상세 내용 */}
          <div>
            <h3 style={{fontSize: 28, fontWeight: 900, marginBottom: 30, color: "#fbbf24"}}>
              {currentContent.title}
            </h3>

            <div>
              {currentContent.items.map((item: any) => (
                <div key={item.id} style={{marginBottom: 16}}>
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                    style={{width: "100%", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "16px", textAlign: "left", color: "white", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"}}
                  >
                    <div>
                      <span style={{fontSize: 24, marginRight: 12}}>{item.icon}</span>
                      <span style={{fontWeight: 800, fontSize: 16}}>{item.name}</span>
                    </div>
                    <span style={{fontSize: 20}}>{expandedItem === item.id ? '▼' : '▶'}</span>
                  </button>

                  {expandedItem === item.id && (
                    <div style={{background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 12, padding: "16px", marginTop: 8}}>
                      <p style={{color: "#94a3b8", fontSize: 14, lineHeight: 1.8, marginBottom: 12}}>{item.desc}</p>
                      <div style={{display: "flex", flexWrap: "wrap", gap: 8}}>
                        {item.keywords.map((kw: string, i: number) => (
                          <span key={i} style={{background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#fbbf24"}}>
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}