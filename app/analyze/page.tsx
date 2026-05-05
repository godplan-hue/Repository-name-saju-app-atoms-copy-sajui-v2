'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Analyze() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(50);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const packages = [
    { pages: 50, name: '⭐ 베이직', price: 9900, desc: '현실 사주 분석 (50P)' },
    { pages: 100, name: '🔮 프리미엄', price: 19900, desc: '상세 사주 분석 (100P)' },
    { pages: 150, name: '👑 풀코스', price: 29900, desc: '완벽 분석 (150P)' },
    { pages: 200, name: '💎 커플팩', price: 34900, desc: '완벽 분석 + 궁합 (200P)' }
  ];

  const features = [
    { id: 'daily', icon: '📖', name: '오늘의 운세' },
    { id: 'monthly', icon: '📅', name: '이번달 운세' },
    { id: 'yearly', icon: '🎯', name: '올해 운세' },
    { id: 'wealth', icon: '💰', name: '재물운 분석' },
    { id: 'love', icon: '❤️', name: '연애운 분석' },
    { id: 'health', icon: '🏥', name: '건강운 분석' },
    { id: 'family', icon: '👨‍👩‍👧', name: '가족운 분석' },
    { id: 'social', icon: '⭐', name: '사회운 분석' }
  ];

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const currentPackage = packages.find(p => p.pages === selectedPackage) || packages[0];

  const handlePayment = () => {
    const params = new URLSearchParams({
      name,
      gender,
      birthDate,
      birthTime,
      type: selectedFeatures.join(','),
      pages: selectedPackage.toString()
    });
    router.push(`/payment?${params.toString()}`);
  };

  return (
    <main style={{minHeight: "100vh", background: "linear-gradient(180deg, #0a0618 0%, #0f0a2e 100%)", color: "white", fontFamily: "sans-serif"}}>
      
      {/* 헤더 */}
      <header style={{borderBottom: "1px solid rgba(139,92,246,0.3)", padding: "16px 24px"}}>
        <h1 style={{fontSize: 24, fontWeight: 900, marginBottom: 0, color: "#fbbf24"}}>⭐ 점운</h1>
      </header>

      <div style={{maxWidth: 1200, margin: "0 auto", padding: "40px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40}}>
        
        {/* 왼쪽: 입력 */}
        <div>
          <h2 style={{fontSize: 28, fontWeight: 900, marginBottom: 32, color: "#fbbf24"}}>정확한 생년월일시</h2>
          <p style={{color: "#94a3b8", marginBottom: 24}}>더 정확한 분석</p>

          <div style={{marginBottom: 24}}>
            <label style={{display: "block", color: "#a78bfa", fontWeight: 700, marginBottom: 8}}>👤 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{width: "100%", padding: "12px", borderRadius: 8, border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.1)", color: "white", fontSize: 14}}
              placeholder="이름 입력"
            />
          </div>

          <div style={{marginBottom: 24}}>
            <label style={{display: "block", color: "#a78bfa", fontWeight: 700, marginBottom: 8}}>👥 성별</label>
            <div style={{display: "flex", gap: 12}}>
              <button
                onClick={() => setGender('female')}
                style={{flex: 1, padding: 12, borderRadius: 8, border: gender === 'female' ? "2px solid #f59e0b" : "1px solid rgba(139,92,246,0.3)", background: gender === 'female' ? "rgba(245,158,11,0.2)" : "rgba(139,92,246,0.1)", color: "white", fontWeight: 700, cursor: "pointer"}}
              >
                👩 여성
              </button>
              <button
                onClick={() => setGender('male')}
                style={{flex: 1, padding: 12, borderRadius: 8, border: gender === 'male' ? "2px solid #f59e0b" : "1px solid rgba(139,92,246,0.3)", background: gender === 'male' ? "rgba(245,158,11,0.2)" : "rgba(139,92,246,0.1)", color: "white", fontWeight: 700, cursor: "pointer"}}
              >
                👨 남성
              </button>
            </div>
          </div>

          <div style={{marginBottom: 24}}>
            <label style={{display: "block", color: "#a78bfa", fontWeight: 700, marginBottom: 8}}>📅 생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={{width: "100%", padding: "12px", borderRadius: 8, border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.1)", color: "white", fontSize: 14}}
            />
          </div>

          <div style={{marginBottom: 24}}>
            <label style={{display: "block", color: "#a78bfa", fontWeight: 700, marginBottom: 8}}>⏰ 출생시간</label>
            <input
              type="text"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              placeholder="오전(05-07시)"
              style={{width: "100%", padding: "12px", borderRadius: 8, border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.1)", color: "white", fontSize: 14}}
            />
          </div>
        </div>

        {/* 오른쪽: 패키지 + 기능 */}
        <div>
          <h3 style={{color: "#fbbf24", fontWeight: 800, fontSize: 18, marginBottom: 20}}>📦 패키지 선택</h3>

          {packages.map(pkg => (
            <div
              key={pkg.pages}
              onClick={() => setSelectedPackage(pkg.pages)}
              style={{background: selectedPackage === pkg.pages ? "rgba(245,158,11,0.2)" : "rgba(139,92,246,0.1)", border: selectedPackage === pkg.pages ? "2px solid #f59e0b" : "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "16px", marginBottom: 12, cursor: "pointer"}}
            >
              <p style={{fontWeight: 800, color: "white", marginBottom: 2, marginTop: 0}}>{pkg.name}</p>
              <p style={{color: "#94a3b8", fontSize: 12, marginTop: 0, marginBottom: 8}}>{pkg.desc}</p>
              <p style={{fontSize: 16, fontWeight: 900, color: "#fbbf24", marginTop: 0, marginBottom: 0}}>{pkg.price.toLocaleString()}원</p>
            </div>
          ))}

          <h3 style={{color: "#fbbf24", fontWeight: 800, fontSize: 18, marginBottom: 20, marginTop: 24}}>📚 운세 종류 (선택)</h3>

          <div style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24}}>
            {features.map(feature => (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                style={{background: selectedFeatures.includes(feature.id) ? "rgba(245,158,11,0.2)" : "rgba(139,92,246,0.1)", border: selectedFeatures.includes(feature.id) ? "2px solid #f59e0b" : "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "16px", color: "white", fontWeight: 700, cursor: "pointer", textAlign: "center"}}
              >
                <p style={{fontSize: 24, marginBottom: 4}}>{feature.icon}</p>
                <p style={{fontSize: 12, margin: 0}}>{feature.name}</p>
              </button>
            ))}
          </div>

          {/* 최종 가격 */}
          <div style={{background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "16px", marginBottom: 16}}>
            <p style={{color: "#94a3b8", marginBottom: 8}}>💰 최종 가격</p>
            <p style={{fontSize: 28, fontWeight: 900, color: "#fbbf24", marginBottom: 0}}>{currentPackage.price.toLocaleString()}원</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={!name || !birthDate || !birthTime}
            style={{width: "100%", padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 800, background: name && birthDate && birthTime ? "linear-gradient(135deg,#f59e0b,#d97706)" : "rgba(100,100,100,0.3)", color: "black", border: "none", cursor: name && birthDate && birthTime ? "pointer" : "not-allowed", marginBottom: 12}}
          >
            ✨ 결제하기
          </button>

          <button
            onClick={() => window.location.href = '/'}
            style={{width: "100%", padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 700, background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)", cursor: "pointer"}}
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    </main>
  );
}