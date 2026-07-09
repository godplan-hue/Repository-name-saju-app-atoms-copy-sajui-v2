import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 부업 상세 템플릿
const CAREER_DETAIL: Record<string, {
  title: string; icon: string; income: string;
  why: string; howToStart: string[]; platforms: string[]; timeline: string; trap: string;
}> = {
  content: {
    title: "SNS 콘텐츠 크리에이터", icon: "📱", income: "월 10만~500만원",
    why: "스마트폰 하나로 시작할 수 있고, 초기 투자비가 0원입니다. 내 이야기가 곧 콘텐츠가 되고, 팔로워가 쌓일수록 수입이 자동으로 늘어납니다. 한국에서 인스타·유튜브 쇼츠 시장이 폭발적으로 성장 중이라 지금이 기회입니다.",
    howToStart: ["주제를 딱 1개로 좁히세요 (육아/요리/직장생활/여행 등)", "첫 30개 영상은 조회수 신경 쓰지 말고 연습으로만 올리세요", "쇼츠나 릴스로 먼저 시작 — 긴 영상보다 알고리즘에 빠름", "일관성이 전부: 같은 시간대에 주 3회 이상 올리기"],
    platforms: ["유튜브 쇼츠", "인스타그램 릴스", "틱톡", "네이버 블로그"],
    timeline: "꾸준히 3개월 → 팔로워 1,000명 → 6개월 → 협찬 문의 시작",
    trap: "처음부터 장비에 돈 쓰지 마세요. 스마트폰으로 3개월은 충분합니다."
  },
  lecture: {
    title: "온라인 강의 / 코칭", icon: "🎓", income: "월 50만~1,000만원",
    why: "한 번 만들면 자면서도 팔리는 구조입니다. 탈잉 2년 연속 1위 강사처럼, 잘하는 걸 강의로 만들면 누적 수천만원이 됩니다. 한국은 '배우는 문화'가 강해서 시장이 매우 큽니다.",
    howToStart: ["내가 잘하는 것 3개 → 그중 남들이 돈 내고 배우고 싶을 것 1개 선택", "크몽에 클래스 등록 (강의 없이 1대1 서비스로 먼저 시작 가능)", "탈잉·클래스101은 플랫폼이 마케팅 해줌 — 검증된 공식 채널", "첫 강의는 완벽보다 빠른 출시가 중요"],
    platforms: ["탈잉", "클래스101", "크몽", "자체 카카오 채널"],
    timeline: "강의 등록 1달 → 첫 수강생 → 3개월 → 리뷰 쌓이면 자동 판매",
    trap: "완벽주의가 가장 큰 적. 수강생 1명만 받아도 일단 시작하세요."
  },
  shop: {
    title: "스마트스토어 / 구매대행", icon: "🛍️", income: "월 30만~300만원",
    why: "네이버 스마트스토어는 국내 최대 쇼핑 플랫폼입니다. 해외 구매대행은 내가 직접 수입하지 않아도 중간에서 주문만 받아도 됩니다. 재고 없는 방식으로 시작하면 리스크가 거의 없습니다.",
    howToStart: ["네이버 스마트스토어 무료 개설 (사업자 없어도 가능)", "초보는 위탁 판매(재고 없이 판매) 방식으로 시작", "유럽·일본 구매대행: 현지 쇼핑몰 → 한국 배송 대행", "아이템 선정이 90%. 팔리는 카테고리부터 분석하세요"],
    platforms: ["네이버 스마트스토어", "쿠팡 마켓플레이스", "11번가", "카카오쇼핑"],
    timeline: "개설 1주일 → 첫 상품 10개 등록 → 1달 → 첫 주문",
    trap: "재고 많이 사두지 마세요. 팔리는 것 확인 후 재입고 원칙."
  },
  translate: {
    title: "번역·통역 프리랜서", icon: "🌏", income: "월 30만~200만원",
    why: "언어 능력은 희소 자원입니다. 특히 일어·중국어는 한국에서 수요가 많은데 공급이 부족합니다. 재택으로 할 수 있고, 한 번 거래한 업체가 계속 의뢰를 주는 반복 수익 구조입니다.",
    howToStart: ["프리랜서 플랫폼에 번역 서비스 등록 (크몽, 링크드인)", "샘플 번역본 3~5개 준비 (포트폴리오 역할)", "첫 의뢰는 싸게 받고 리뷰 쌓기 → 이후 단가 올리기", "전문 분야(법률/의학/IT) 특화하면 단가가 2~3배 높아짐"],
    platforms: ["크몽", "프리랜서코리아", "LinkedIn", "번역 에이전시 직접 연락"],
    timeline: "등록 즉시 → 2주 내 첫 의뢰 가능 (프로필 완성 기준)",
    trap: "너무 싸게 받지 마세요. 저가 경쟁 트랩에 빠지면 탈출이 어렵습니다."
  },
  writing: {
    title: "글쓰기 / 카피라이터", icon: "✍️", income: "월 20만~150만원",
    why: "AI 시대에도 사람의 감성 글은 강세입니다. 블로그 원고, 광고 카피, 상세페이지 문구 — 기업들이 항상 찾습니다. 글쓰기 능력만 있으면 노트북 하나로 어디서든 일할 수 있습니다.",
    howToStart: ["네이버 블로그부터 시작해서 글 포트폴리오 만들기", "크몽에 '상세페이지 작성' '블로그 대행' 서비스 등록", "첫 3~5건은 저렴하게 → 리뷰 + 포트폴리오 확보", "전문 분야(부동산/뷰티/IT) 특화하면 단가가 높아짐"],
    platforms: ["크몽", "숨고", "프리랜서코리아", "LinkedIn"],
    timeline: "1달 내 첫 의뢰 → 3개월 → 월 30~50만원 안정화",
    trap: "한 클라이언트에만 의존하면 위험. 다양한 채널에 분산하세요."
  },
  consulting: {
    title: "1대1 컨설팅 / 멘토링", icon: "💼", income: "월 100만~500만원",
    why: "단가가 부업 중 가장 높습니다. 내 경험이 곧 상품이기 때문에 재고도 없고 초기 투자도 0입니다. 한 번에 수십만원을 받을 수 있어서 적은 고객으로도 큰 수익이 나옵니다.",
    howToStart: ["내가 10년 해온 것 중 남들이 부러워하는 것을 찾으세요", "크몽 '전문가 서비스'에 등록 (컨설팅 카테고리)", "첫 1~3건은 무료나 할인가로 진행 → 후기 확보", "카카오 채널 개설 후 1:1 상담 메뉴 추가"],
    platforms: ["크몽", "탈잉 1대1 레슨", "카카오 채널", "LinkedIn 직접 영업"],
    timeline: "첫 고객 확보 1~2달 → 후기 3개 이상 → 자동 의뢰 시작",
    trap: "시간당 가격이 너무 낮으면 번아웃. 처음부터 적정 단가로 시작하세요."
  },
  design: {
    title: "디자인 / 영상 편집", icon: "🎨", income: "월 30만~300만원",
    why: "유튜브 쇼츠·릴스·광고 시장이 폭발하면서 영상 편집 수요가 급증했습니다. Canva·캡컷 같은 도구 덕분에 전문 장비 없이도 충분히 시작할 수 있습니다.",
    howToStart: ["Canva Pro(무료 체험 가능)로 디자인 포트폴리오 10개 만들기", "쇼츠/릴스 편집 연습 → 5개 샘플 → 크몽 등록", "SNS 인플루언서 타겟: 편집 대행이 빠른 수요", "로고·썸네일이 가장 빨리 팔림"],
    platforms: ["크몽", "숨고", "인스타그램 직접 DM 영업", "유튜브 댓글 영업"],
    timeline: "포트폴리오 2주 → 크몽 등록 1일 → 1달 내 첫 의뢰",
    trap: "수정 요청이 무제한이 되지 않도록 계약서(메시지)에 수정 횟수 명시하세요."
  },
  ai: {
    title: "AI 자동화 대행", icon: "🤖", income: "월 50만~500만원",
    why: "지금 가장 뜨는 부업입니다. ChatGPT·Claude를 활용한 업무 자동화, 챗봇 제작, 콘텐츠 자동생성 — 이걸 해줄 수 있는 사람이 턱없이 부족합니다. 2026년 가장 빠르게 성장하는 분야입니다.",
    howToStart: ["ChatGPT·Claude 프롬프트 작성 연습 (무료)", "노코드 자동화: Make.com·Zapier 기초 배우기 (한 달)", "크몽에 'AI 자동화 대행', 'GPT 챗봇 제작' 서비스 등록", "중소기업 사장님들이 제일 큰 고객 — 인스타·카카오로 직접 영업"],
    platforms: ["크몽", "숨고", "LinkedIn", "소상공인 카페 직접 영업"],
    timeline: "기초 1달 → 첫 의뢰 → 3달 → 단가 올리기",
    trap: "AI 도구는 빠르게 변합니다. 최신 트렌드를 계속 공부해야 해요."
  },
  food: {
    title: "배달·밀키트 창업", icon: "🍱", income: "월 50만~200만원",
    why: "요리 실력이 있다면 가장 진입이 쉬운 부업입니다. 배달의민족·쿠팡이츠에 등록하거나, 인스타·당근으로 동네 배달을 시작할 수 있습니다. 시작 비용이 낮고 즉각적인 수익이 납니다.",
    howToStart: ["메뉴를 1~3가지로 딱 좁히세요 (너무 많으면 힘들어요)", "인스타그램에 음식 사진 올리고 '동네 배달' 홍보", "당근마켓 '동네 홍보'로 주변 주민에게 알리기", "위생 교육 이수 후 배달 플랫폼 입점"],
    platforms: ["배달의민족 B마트", "쿠팡이츠", "인스타그램", "당근마켓"],
    timeline: "준비 2주 → 첫 주문 → 1달 → 단골 확보",
    trap: "혼자 너무 많이 만들려다 지쳐요. 메뉴 수와 양을 처음엔 작게 시작하세요."
  },
  realestate: {
    title: "부동산 투자 / 임대", icon: "🏠", income: "월 50만~무한대",
    why: "가장 큰 수익이 나올 수 있는 분야입니다. 레버리지(대출)를 활용하면 적은 돈으로도 시작 가능합니다. 한국은 부동산 시장이 지속적으로 성장해왔습니다.",
    howToStart: ["공부 먼저: 경매·갭투자·지식산업센터 책 3권 읽기", "임장(현장 방문) 주 1회 이상 — 발품이 수익", "소액으로 오피스텔 전세 끼고 시작하는 방법 연구", "세금·대출 구조 먼저 이해 후 투자"],
    platforms: ["KB부동산", "호갱노노", "직방", "네이버 부동산"],
    timeline: "공부 3달 → 첫 투자 검토 → 6달~1년 → 수익 발생",
    trap: "공부 없이 따라하다가 큰 손실을 보는 경우가 많습니다. 공부가 제일 먼저입니다."
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, birthYear, birthMonth, birthDay, timeAvail, skill, speed, career, recommended } = body;

    if (!recommended || recommended.length === 0) {
      return NextResponse.json({ error: "추천 결과 없음" }, { status: 400 });
    }

    const result = {
      name: name || "익명", birthYear, birthMonth, birthDay,
      timeAvail, skill, speed, career,
      recommended,
      details: recommended.map((id: string) => CAREER_DETAIL[id] ?? CAREER_DETAIL["content"]),
      createdAt: Date.now(),
    };

    const id = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    await db.ref(`career_analyses/${id}`).set(result);

    return NextResponse.json({ id, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "분석 실패" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 필요" }, { status: 400 });
    const snap = await db.ref(`career_analyses/${id}`).get();
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch (e) {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
