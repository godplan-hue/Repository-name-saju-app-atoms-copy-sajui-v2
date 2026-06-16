// 패키지 정의
export const PACKAGES = {
  basic: {
    id: "basic",
    name: "기본 분석",
    price: 9900,
    pages: 30,
    features: ["yearlyLuck", "monthlyLuck"],
    count: 2,
    desc: "올해 운세 + 월별 운세"
  },
  standard: {
    id: "standard",
    name: "베이직",
    price: 19900,
    pages: 75,
    features: ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck"],
    count: 4,
    desc: "올해 운세 + 월별 운세<br/>+ 재물운 + 연애운"
  },
  premium: {
    id: "premium",
    name: "프리미엄",
    price: 24900,
    pages: 100,
    features: ["yearlyLuck", "monthlyLuck", "wealthLuck", "loveLuck", "healthLuck"],
    count: 5,
    desc: "올해 운세 + 월별 운세<br/>+ 재물운 + 연애운 + 건강운"
  },
  vip: {
    id: "vip",
    name: "VIP 커플팩",
    price: 29900,
    pages: 150,
    features: ["name", "wealthLuck", "loveLuck", "healthLuck", "couple", "yearlyLuck", "monthlyLuck", "analysis"],
    count: 8,
    desc: "본인 분석(8개) + 상대방 정보 입력<br/>궁합분석 포함"
  }
};

// 운세 항목
export const FORTUNE_ITEMS = [
  { id: "name", icon: "📝", name: "이름분석", label: "이름 분석" },
  { id: "wealthLuck", icon: "💎", name: "재물운", label: "재물운" },
  { id: "loveLuck", icon: "💕", name: "연애운", label: "연애운" },
  { id: "healthLuck", icon: "🌿", name: "건강운", label: "건강운" },
  { id: "couple", icon: "👫", name: "궁합분석", label: "궁합 분석" },
  { id: "yearlyLuck", icon: "☀️", name: "올해 운세", label: "올해 운세" },
  { id: "monthlyLuck", icon: "🌙", name: "월별 운세", label: "월별 운세" },
  { id: "analysis", icon: "🎋", name: "전체 사주분석", label: "전체 사주분석" }
];

// 패키지별 디스플레이 항목 매핑
export const getPackageFeatures = (packageName: string) => {
  const pkg = Object.values(PACKAGES).find(p => p.name === packageName);
  return pkg?.features || PACKAGES.basic.features;
};

// 패키지별 페이지수
export const getPackagePages = (packageName: string) => {
  const pkg = Object.values(PACKAGES).find(p => p.name === packageName);
  return pkg?.pages || 30;
};

// 패키지별 개수
export const getPackageCount = (packageName: string) => {
  const pkg = Object.values(PACKAGES).find(p => p.name === packageName);
  return pkg?.count || 2;
};
