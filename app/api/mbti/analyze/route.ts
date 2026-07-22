import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type Dim = "EI" | "SN" | "TF" | "JP";

const DIMS: Array<{ dim: Dim; dir: 1 | -1 }> = [
  { dim: "EI", dir: 1 }, { dim: "EI", dir: -1 }, { dim: "EI", dir: 1 }, { dim: "EI", dir: -1 },
  { dim: "SN", dir: -1 }, { dim: "SN", dir: 1 }, { dim: "SN", dir: -1 }, { dim: "SN", dir: 1 },
  { dim: "TF", dir: 1 }, { dim: "TF", dir: -1 }, { dim: "TF", dir: 1 }, { dim: "TF", dir: -1 },
  { dim: "JP", dir: 1 }, { dim: "JP", dir: -1 }, { dim: "JP", dir: 1 }, { dim: "JP", dir: -1 },
];

interface TypeData {
  name: string;
  oh: string;
  desc: string;
  strength: string[];
  weakness: string[];
  love: string;
  career: string;
  celeb: string[];
  ohDesc: string;
}

const TYPE_DATA: Record<string, TypeData> = {
  INTJ: {
    name: "건축가", oh: "금",
    desc: "전략적 사고와 독립심이 강한 완벽주의자. 목표를 세우고 효율적으로 달성하는 능력이 뛰어나며, 혁신적인 시스템을 설계합니다. 계획한 대로 움직이는 것을 선호하며 타협보다 원칙을 중시합니다.",
    strength: ["장기 전략 설계 능력", "강한 의지와 결단력", "높은 기준 유지", "독립적 문제 해결"],
    weakness: ["지나친 완벽주의 번아웃", "감정 표현의 어려움", "타인 비판에 날카로움", "관계 형성 어려움"],
    love: "깊은 신뢰와 지적 자극을 줄 수 있는 파트너를 원합니다. 감정보다는 헌신적 행동으로 사랑을 표현합니다.",
    career: "전략기획, 프로그래머, 과학자, 건축가, 경영컨설턴트",
    celeb: ["일론 머스크", "마크 저커버그", "크리스토퍼 놀란"],
    ohDesc: "금(金) 오행 — 불필요한 것을 쳐내고 핵심만 남기는 정제의 에너지. 원칙과 기준이 곧 당신의 힘입니다.",
  },
  INTP: {
    name: "논리학자", oh: "수",
    desc: "세상의 원리를 탐구하는 사색가. 복잡한 개념을 분석하고 새로운 아이디어를 연결하는 능력이 뛰어납니다. 지식 탐구에 끝이 없으며 독창적인 이론을 만들어냅니다.",
    strength: ["분석적 사고", "창의적 문제 해결", "객관성", "독창적 이론 구성"],
    weakness: ["우유부단함", "실행력 부족", "사회성 어려움", "감정 공감의 어려움"],
    love: "지적 대화가 가능한 파트너를 원하며, 관계에서도 자유와 독립을 중요하게 여깁니다.",
    career: "연구원, 철학자, 프로그래머, 수학자, AI 개발자",
    celeb: ["아인슈타인", "찰스 다윈", "빌 게이츠"],
    ohDesc: "수(水) 오행 — 깊이 흐르는 지혜의 에너지. 겉보기엔 고요하지만 내면에 방대한 세계가 있습니다.",
  },
  ENTJ: {
    name: "통솔자", oh: "금",
    desc: "타고난 리더. 목표를 향해 조직을 이끌고 효율적인 시스템을 구축하는 능력이 탁월합니다. 결단력 있고 전략적이며 도전을 두려워하지 않습니다.",
    strength: ["강한 리더십", "전략적 사고", "결단력", "높은 목표 달성 능력"],
    weakness: ["고집스러울 수 있음", "감정보다 목표 우선", "타인 감정 간과", "지나친 통제 욕구"],
    love: "동등한 수준의 자신감 있는 파트너를 선호합니다. 관계도 프로젝트처럼 발전시켜 나갑니다.",
    career: "CEO, 기업가, 변호사, 관리자, 정치인",
    celeb: ["스티브 잡스", "마가렛 대처", "나폴레옹"],
    ohDesc: "금(金) 오행 — 강인하고 결단력 있는 금속의 에너지. 목표를 향해 흔들리지 않습니다.",
  },
  ENTP: {
    name: "변론가", oh: "목",
    desc: "아이디어의 마법사. 토론을 즐기고 기존 틀을 깨는 혁신적 사고를 합니다. 가능성을 보고 새로운 연결고리를 만드는 것을 즐깁니다.",
    strength: ["혁신적 사고", "뛰어난 토론 능력", "빠른 학습", "높은 적응력"],
    weakness: ["시작만 하고 완성 어려움", "논쟁적으로 보일 수 있음", "규칙 싫어함", "집중력 분산"],
    love: "지적 자극을 주고받을 수 있는 파트너와 불꽃 튀는 관계를 원합니다.",
    career: "기업가, 변호사, 발명가, 마케터, 크리에이터",
    celeb: ["오바마", "레오나르도 다빈치", "벤저민 프랭클린"],
    ohDesc: "목(木) 오행 — 끊임없이 새 가지를 뻗어나가는 나무의 에너지. 성장과 확장이 본능입니다.",
  },
  INFJ: {
    name: "옹호자", oh: "목",
    desc: "깊은 통찰력과 공감 능력을 가진 이상주의자. 사람들을 돕고 세상을 더 좋게 만들고 싶은 강한 내면의 사명감이 있습니다.",
    strength: ["깊은 공감 능력", "강한 통찰력", "창의적 비전", "헌신과 성실함"],
    weakness: ["완벽주의로 인한 번아웃", "너무 개인적으로 받아들임", "내향적 고립", "결단 어려움"],
    love: "깊고 의미 있는 연결을 원합니다. 피상적인 관계는 원하지 않습니다.",
    career: "상담사, 심리치료사, 작가, 사회활동가, 교사",
    celeb: ["마틴 루터 킹", "마더 테레사", "마하트마 간디"],
    ohDesc: "목(木) 오행 — 조용하지만 강하게 자라는 나무처럼, 내면의 비전이 세상을 변화시킵니다.",
  },
  INFP: {
    name: "중재자", oh: "수",
    desc: "이상적인 세계를 꿈꾸는 공상가. 강한 가치관과 풍부한 내면세계를 가지며, 진정성과 의미를 중시합니다.",
    strength: ["풍부한 감수성", "깊은 공감 능력", "높은 창의성", "강한 가치관"],
    weakness: ["비현실적 이상주의", "비판에 예민", "실행력 부족", "자기 비하 경향"],
    love: "진정한 연결과 감정적 깊이를 원합니다. 이해받는 것이 가장 중요합니다.",
    career: "작가, 예술가, 상담사, 음악가, 사회복지사",
    celeb: ["J.K.롤링", "조니 뎁", "윌리엄 셰익스피어"],
    ohDesc: "수(水) 오행 — 깊고 조용히 흐르는 물처럼, 표면 아래 무한한 감수성의 세계가 있습니다.",
  },
  ENFJ: {
    name: "선도자", oh: "화",
    desc: "카리스마 넘치는 영감의 원천. 사람들의 잠재력을 이끌어내고 공동체를 하나로 묶는 천부적인 능력이 있습니다.",
    strength: ["뛰어난 사회성", "공감과 리더십", "강한 설득력", "이타적 헌신"],
    weakness: ["타인 기대에 지나치게 신경 씀", "자기 돌봄 소홀", "지나친 이상주의", "갈등 회피"],
    love: "파트너의 성장을 적극 지원합니다. 서로 영감을 주고받는 관계를 원합니다.",
    career: "교사, 상담사, HR전문가, 정치인, 코치",
    celeb: ["오프라 윈프리", "버락 오바마", "토니 로빈스"],
    ohDesc: "화(火) 오행 — 주위를 따뜻하게 밝히는 불꽃 에너지. 사람들을 하나로 모으는 빛입니다.",
  },
  ENFP: {
    name: "활동가", oh: "목",
    desc: "열정적이고 창의적인 자유 영혼. 새로운 가능성에 흥분하고 사람들과의 진정한 연결을 소중히 여깁니다.",
    strength: ["강한 열정과 에너지", "높은 창의성", "사람들과의 진정한 연결", "높은 적응력"],
    weakness: ["집중력 분산", "약속 지키기 어려움", "세부사항 놓침", "지나친 이상주의"],
    love: "깊은 감정적 연결과 함께 성장하는 관계를 원합니다.",
    career: "크리에이터, 기업가, 배우, 마케터, 상담사",
    celeb: ["로빈 윌리엄스", "엘렌 드제너러스", "월트 디즈니"],
    ohDesc: "목(木) 오행 — 새싹이 끊임없이 자라듯, 가능성을 향해 늘 새로운 방향을 탐색합니다.",
  },
  ISTJ: {
    name: "현실주의자", oh: "토",
    desc: "신뢰와 책임감의 상징. 사실과 데이터를 중시하며 약속을 반드시 지킵니다. 안정적이고 꼼꼼한 집행자입니다.",
    strength: ["강한 책임감", "세밀한 꼼꼼함", "높은 신뢰성", "오랜 인내심"],
    weakness: ["변화에 대한 저항", "융통성 부족", "감정 표현의 어려움", "과도한 규칙 집착"],
    love: "안정적이고 신뢰할 수 있는 관계를 원합니다. 행동으로 사랑을 표현합니다.",
    career: "공무원, 회계사, 변호사, 의사, 군인",
    celeb: ["앙겔라 메르켈", "조지 워싱턴", "워렌 버핏"],
    ohDesc: "토(土) 오행 — 흔들리지 않는 대지처럼, 믿음직하고 든든한 안정의 에너지입니다.",
  },
  ISFJ: {
    name: "수호자", oh: "토",
    desc: "헌신적이고 따뜻한 보호자. 사랑하는 사람들을 위해 묵묵히 헌신하며, 세심하게 배려하는 타고난 수호자입니다.",
    strength: ["헌신과 깊은 배려", "뛰어난 세심함", "높은 신뢰성", "협력적 태도"],
    weakness: ["자신을 희생하는 경향", "변화 적응의 어려움", "직접적 표현의 어려움", "과도한 걱정"],
    love: "파트너에게 헌신적이며, 안정적이고 따뜻한 가정을 만들고 싶어합니다.",
    career: "간호사, 교사, 사회복지사, 상담사, 사무직",
    celeb: ["케이트 미들턴", "비욘세", "Anne Hathaway"],
    ohDesc: "토(土) 오행 — 모든 생명을 품는 대지처럼, 주변 사람들을 따뜻하게 지켜줍니다.",
  },
  ESTJ: {
    name: "경영자", oh: "금",
    desc: "질서와 체계를 중시하는 관리자. 명확한 규칙과 구조를 선호하며, 조직을 효율적으로 이끄는 능력이 있습니다.",
    strength: ["뛰어난 조직력", "강한 책임감", "명확한 리더십", "빠른 결단력"],
    weakness: ["유연성 부족", "감정 간과", "지나친 통제 욕구", "새로운 아이디어 저항"],
    love: "전통적 가치를 중시하며 안정적이고 헌신적인 관계를 원합니다.",
    career: "관리자, CEO, 군 장교, 판사, 교장",
    celeb: ["힐러리 클린턴", "드와이트 아이젠하워", "Frank Sinatra"],
    ohDesc: "금(金) 오행 — 날카롭고 공정한 금속의 에너지. 기준과 원칙으로 조직을 세웁니다.",
  },
  ESFJ: {
    name: "집정관", oh: "토",
    desc: "따뜻하고 사교적인 화합의 중심. 사람들을 하나로 모으고 화목한 분위기를 만드는 타고난 능력이 있습니다.",
    strength: ["뛰어난 사교성", "깊은 배려심", "강한 팀워크", "책임감 있는 행동"],
    weakness: ["갈등 회피 경향", "타인 시선 과도하게 신경 씀", "변화 적응 어려움", "지나친 자기희생"],
    love: "헌신적이고 안정적인 관계를 원합니다. 파트너를 세심하게 돌봅니다.",
    career: "교사, 간호사, HR전문가, 이벤트 플래너, 영업",
    celeb: ["테일러 스위프트", "Jennifer Garner", "Steve Harvey"],
    ohDesc: "토(土) 오행 — 모두를 따뜻하게 품는 대지의 에너지. 공동체의 중심이 됩니다.",
  },
  ISTP: {
    name: "장인", oh: "금",
    desc: "조용하지만 기술적으로 탁월한 문제 해결사. 손으로 만지고 분해하고 이해하는 것을 좋아하는 실용주의자입니다.",
    strength: ["뛰어난 문제 해결", "위기 상황의 침착함", "높은 실용성", "독립성"],
    weakness: ["감정 표현의 어려움", "장기 계획 어려움", "지루함에 민감", "관계 맺기 어려움"],
    love: "감정보다는 행동으로 사랑을 보여줍니다. 각자의 공간을 존중하는 관계를 원합니다.",
    career: "엔지니어, 외과의, 파일럿, 프로그래머, 정비사",
    celeb: ["브루스 리", "클린트 이스트우드", "Michael Jordan"],
    ohDesc: "금(金) 오행 — 정밀하게 다듬어진 도구처럼, 핵심을 꿰뚫는 실용의 에너지입니다.",
  },
  ISFP: {
    name: "모험가", oh: "수",
    desc: "감성적이고 개방적인 예술가 기질. 아름다움을 발견하고 현재 순간을 온전히 즐기는 자유로운 영혼입니다.",
    strength: ["예술적 감수성", "높은 유연성", "깊은 공감 능력", "현재에 집중하는 능력"],
    weakness: ["장기 계획의 어려움", "비판에 예민", "경쟁 회피", "자기 표현의 어려움"],
    love: "진정성 있는 감정적 연결을 원합니다. 말보다 행동으로 마음을 전합니다.",
    career: "예술가, 음악가, 패션 디자이너, 수의사, 요리사",
    celeb: ["마이클 잭슨", "Lady Gaga", "프리다 칼로"],
    ohDesc: "수(水) 오행 — 어떤 그릇에도 담기는 물처럼, 유연하고 자유롭게 자신을 표현합니다.",
  },
  ESTP: {
    name: "사업가", oh: "화",
    desc: "에너지 넘치는 행동파. 지금 이 순간을 즐기며 위험을 감수하고 새로운 것에 도전하는 걸 두려워하지 않습니다.",
    strength: ["강한 실행력", "탁월한 위기 대응", "자연스러운 카리스마", "높은 적응력"],
    weakness: ["충동적 결정", "장기적 관점 부족", "인내심 부족", "감정 간과"],
    love: "역동적이고 자발적인 관계를 원합니다. 함께 모험을 즐길 파트너가 필요합니다.",
    career: "기업가, 세일즈, 응급구조사, 경찰, 트레이더",
    celeb: ["어니스트 헤밍웨이", "Benjamin Franklin (사업가 측면)", "사이먼 코웰"],
    ohDesc: "화(火) 오행 — 타오르는 불처럼 즉각적이고 강렬한 에너지. 순간순간이 빛납니다.",
  },
  ESFP: {
    name: "연예인", oh: "화",
    desc: "삶 자체가 무대인 자유로운 영혼. 유머와 에너지로 주변을 밝히며, 사람들과 함께하는 것을 진심으로 즐깁니다.",
    strength: ["뛰어난 사교성", "강한 낙관주의", "현재에 집중하는 능력", "타고난 엔터테인먼트"],
    weakness: ["장기 계획의 어려움", "비판에 민감", "충동적 결정", "루틴 싫어함"],
    love: "활기차고 재미있는 관계를 원합니다. 함께하는 순간순간이 특별해야 합니다.",
    career: "연예인, 이벤트 플래너, 교사, 영업, 요리사",
    celeb: ["마릴린 먼로", "엘비스 프레슬리", "Justin Bieber"],
    ohDesc: "화(火) 오행 — 주변을 환하게 밝히는 불꽃처럼, 어디서든 존재감이 빛납니다.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { answers: number[]; userName?: string; phone?: string; email?: string; marketing?: boolean };
    const { answers, userName, phone, email } = body;
    const marketing = body.marketing === true;
    if (!answers || answers.length !== 16) {
      return NextResponse.json({ error: "answers 16개 필요" }, { status: 400 });
    }

    const dimScores: Record<Dim, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
    for (let i = 0; i < 16; i++) {
      dimScores[DIMS[i].dim] += answers[i] * DIMS[i].dir;
    }

    const E = dimScores.EI > 0;
    const S = dimScores.SN > 0;
    const T = dimScores.TF > 0;
    const J = dimScores.JP > 0;
    const type = `${E ? "E" : "I"}${S ? "S" : "N"}${T ? "T" : "F"}${J ? "J" : "P"}`;

    const pct = (score: number) =>
      Math.min(95, Math.max(55, Math.round((Math.abs(score) / 8) * 40 + 55)));

    const data = TYPE_DATA[type];
    const result = {
      type, name: data.name, oh: data.oh, desc: data.desc,
      strength: data.strength, weakness: data.weakness,
      love: data.love, career: data.career, celeb: data.celeb, ohDesc: data.ohDesc,
      eiScore: dimScores.EI, snScore: dimScores.SN, tfScore: dimScores.TF, jpScore: dimScores.JP,
      eiPct: pct(dimScores.EI), snPct: pct(dimScores.SN), tfPct: pct(dimScores.TF), jpPct: pct(dimScores.JP),
      userName: userName || "",
      phone: phone || "",
      email: email || "",
      marketing,
      createdAt: Date.now(),
    };

    const ref = db.ref("mbti_analyses").push();
    await ref.set(result);
    return NextResponse.json({ id: ref.key, ...result }, { headers: CORS_HEADERS });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const snap = await db.ref(`mbti_analyses/${id}`).get();
    if (!snap.exists()) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ id, ...snap.val() }, { headers: CORS_HEADERS });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
