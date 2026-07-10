import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// ── 오행 계산 ──────────────────────────────────────────────
function getOhaeng(year: number): string {
  const ganOh = ["목","목","화","화","토","토","금","금","수","수"];
  return ganOh[Math.abs((year - 4) % 10)] ?? "토";
}

// ── 합격 가능성 점수 ────────────────────────────────────────
function calcScore(year: number, month: number, day: number, field: string, companySize: string): number {
  const fieldBonus: Record<string,number> = { IT: 8, 경영: 6, 마케팅: 7, 금융: 7, 영업: 6, 의약: 8, 교육: 5, 공공: 6, 기타: 5 };
  const sizeBonus: Record<string,number> = { 대기업: 6, 중견: 7, 공기업: 5, 스타트업: 9, 중소: 8 };
  const monthBonus = [6,8,10,9,7,5,4,5,9,10,8,6][month-1] ?? 7;
  const dayVar = (day % 7) * 1.5;
  const ganBonus = [8,6,9,7,5,6,8,7,9,6][Math.abs((year-4)%10)] ?? 7;
  const raw = 50 + ganBonus + (fieldBonus[field]??5) + (sizeBonus[companySize]??6) + monthBonus + dayVar;
  return Math.min(97, Math.max(44, Math.round(raw)));
}

// ── 오행별 강점 ─────────────────────────────────────────────
const ohaengStrength: Record<string, { trait: string; keyword: string; advice: string }> = {
  목: { trait: "성장·기획 기질", keyword: "비전 제시, 창의적 문제해결, 장기 계획", advice: "자소서에서 '성장 가능성'과 '장기 비전'을 강조하세요. 면접에서 '5년 후 목표'를 구체적으로 말할수록 좋습니다." },
  화: { trait: "표현·소통 기질", keyword: "팀 리더십, 설득력, 열정 어필", advice: "자소서에서 '협업 경험'과 '결과를 만들어낸 과정'을 구체적 숫자로 표현하세요. 열정이 느껴지는 문체가 강점입니다." },
  토: { trait: "실행·안정 기질", keyword: "꼼꼼함, 책임감, 실무 능력", advice: "자소서에서 '맡은 일을 끝까지 완수한 경험'을 강조하세요. 실수 없이 꼼꼼하다는 인상을 줘야 합니다." },
  금: { trait: "분석·전략 기질", keyword: "논리적 사고, 데이터 분석, 원칙 준수", advice: "자소서에서 '문제를 분석하고 해결한 사례'를 데이터·수치와 함께 서술하세요. 논리 흐름이 명확해야 합니다." },
  수: { trait: "통찰·적응 기질", keyword: "유연성, 배움의 속도, 창의적 해결", advice: "자소서에서 '변화하는 환경에 빠르게 적응한 경험'을 보여주세요. 다양한 경험이 있다면 적극 활용하세요." },
};

// ── 직무별 합격 키워드 ──────────────────────────────────────
const fieldKeywords: Record<string, { keywords: string[]; strategy: string; interview: string[] }> = {
  IT: {
    keywords: ["알고리즘 능력", "포트폴리오(GitHub)", "기술 스택 명시", "트러블슈팅 경험", "협업 도구(Git·Jira)"],
    strategy: "IT 직무는 '할 수 있다'보다 '한 것'이 중요합니다. GitHub 링크, 프로젝트 결과물, 기술 스택을 구체적으로 나열하세요. 자소서보다 포트폴리오가 먼저 봐집니다.",
    interview: ["본인이 가장 자신있는 기술 스택과 프로젝트를 설명해주세요.", "협업 중 기술적 의견 충돌이 있었을 때 어떻게 해결했나요?", "최근 관심있는 기술 트렌드는 무엇이고 어떻게 공부하고 있나요?"]
  },
  경영: {
    keywords: ["리더십 경험(숫자화)", "전략적 사고", "데이터 기반 의사결정", "팀 성과 기여", "글로벌 역량"],
    strategy: "경영직은 '리더십'을 구체적인 숫자로 증명해야 합니다. '팀장으로 매출 30% 향상' 같은 형식이 효과적입니다. 전략·기획·분석 경험을 강조하세요.",
    interview: ["본인이 이끌었던 프로젝트에서 가장 어려웠던 점과 해결 방법을 말해주세요.", "데이터를 활용해 의사결정을 내린 경험이 있나요?", "5년 후 어떤 리더가 되고 싶으신가요?"]
  },
  마케팅: {
    keywords: ["SNS·디지털 마케팅 실무", "캠페인 기획 경험", "데이터 분석(GA·Meta)", "트렌드 감각", "콘텐츠 제작 능력"],
    strategy: "마케팅은 '감각'을 증명해야 합니다. 본인이 직접 운영한 SNS, 제작한 콘텐츠, 기획한 캠페인의 성과 수치를 보여주세요. 트렌드에 민감함을 드러내야 합니다.",
    interview: ["최근 인상적이었던 마케팅 캠페인이 있다면 소개해주세요.", "본인의 SNS나 콘텐츠 채널이 있다면 소개해주세요.", "저예산으로 높은 효과를 낸 마케팅 아이디어를 제안해본다면?"]
  },
  금융: {
    keywords: ["수치·데이터 분석", "규정·컴플라이언스 이해", "자격증(CPA/CFA/금투사)", "리스크 관리", "논리적 글쓰기"],
    strategy: "금융은 '정확성'과 '신뢰성'이 핵심입니다. 관련 자격증, 수치를 다룬 경험, 오류 없는 꼼꼼함을 강조하세요. 자소서 자체도 오탈자 없이 완벽해야 합니다.",
    interview: ["금융 시장에서 최근 관심있는 이슈는 무엇인가요?", "리스크와 수익 사이의 균형을 어떻게 생각하시나요?", "데이터를 분석해서 의사결정을 내린 경험을 말해주세요."]
  },
  영업: {
    keywords: ["커뮤니케이션 능력", "실적 수치화(매출·계약)", "고객 관리 경험", "협상 능력", "추진력·목표달성"],
    strategy: "영업은 숫자로 말해야 합니다. '매출 120% 달성', '신규 고객 15명 확보' 같은 실적을 자소서에 반드시 넣으세요. 에너지와 추진력이 느껴져야 합니다.",
    interview: ["가장 어려운 고객을 설득했던 경험을 말해주세요.", "실적이 목표에 미달했을 때 어떻게 극복했나요?", "본인의 영업 스타일을 한 단어로 표현한다면?"]
  },
  의약: {
    keywords: ["연구 경험·논문", "실험 프로토콜 이해", "임상 지식", "팀 연구 기여도", "규정(GMP·GLP) 이해"],
    strategy: "의약 직무는 전문성이 최우선입니다. 연구 프로젝트, 논문, 인턴십 경험을 구체적으로 서술하세요. 실험 환경 경험과 규정 준수 능력을 강조하세요.",
    interview: ["연구 중 예상치 못한 결과가 나왔을 때 어떻게 대응했나요?", "팀 연구에서 본인이 맡은 역할과 기여도는?", "이 직무를 선택한 이유와 향후 연구 방향은?"]
  },
  교육: {
    keywords: ["전달력·설명 능력", "커리큘럼 설계", "학습자 이해", "인내심", "교육 성과 사례"],
    strategy: "교육 직무는 '가르쳐서 변화를 만든 경험'이 핵심입니다. 학생의 성적 향상, 이해도 개선 사례를 구체적으로 쓰세요. 열정과 사명감이 느껴져야 합니다.",
    interview: ["가장 가르치기 어려웠던 학생(또는 내용)과 어떻게 극복했나요?", "본인만의 수업 설계 방식이 있다면 소개해주세요.", "교육자로서 가장 중요하게 생각하는 가치는?"]
  },
  공공: {
    keywords: ["NCS 역량", "전공 지식·자격증", "봉사·사회 기여", "규정 준수", "공익 가치관"],
    strategy: "공기업·공공기관은 NCS가 핵심입니다. 직무 적합성을 체계적으로 증명하고, '공익을 위해 일하고 싶다'는 동기를 진정성있게 표현하세요. 규정 준수 경험이 중요합니다.",
    interview: ["공공기관을 선택한 이유와 어떤 기여를 하고 싶으신가요?", "규정이나 원칙에 어긋나는 상황을 경험했을 때 어떻게 대처했나요?", "NCS 직무역량 중 본인이 가장 자신있는 항목은?"]
  },
  기타: {
    keywords: ["직무 적합성", "성장 가능성", "팀워크", "문제해결 경험", "열정 표현"],
    strategy: "지원 직무에 맞는 구체적인 경험을 찾아 연결하세요. '왜 이 회사의 이 직무인가'를 명확히 설명하는 것이 가장 중요합니다.",
    interview: ["이 직무를 선택한 구체적인 이유는?", "본인의 가장 큰 강점은 무엇이고 어떻게 증명할 수 있나요?", "입사 후 첫 6개월 동안 어떻게 업무에 적응할 계획인가요?"]
  }
};

// ── 기업 규모별 전략 ────────────────────────────────────────
const sizeStrategy: Record<string, string> = {
  대기업: "대기업 자소서는 형식이 엄격합니다. 두괄식 작성(결론 먼저), 글자수 정확히 맞추기, 오탈자 제로가 필수입니다. 직무 적합성을 회사의 사업 방향과 연결하세요. 인·적성 검사(GSAT·HMAT·NCS)를 병행 준비하세요.",
  중견: "중견기업은 '즉시 전력감'을 원합니다. 첫날부터 도움이 될 실무 능력을 강조하고, 장기 근속 의지를 표현하세요. 대기업보다 개성 있는 자소서도 통합니다.",
  공기업: "공기업은 NCS 중심입니다. 직무별 NCS 역량을 체계적으로 준비하고, 직업기초능력(의사소통·수리·문제해결) 점수를 높이세요. 봉사 활동과 사회 기여 경험을 강조하세요.",
  스타트업: "스타트업은 '자기주도'와 '빠른 실행'을 봅니다. 공식 형식보다는 개성, 도전정신, 창업 마인드를 표현하세요. '작은 성공이라도 내가 직접 만들어낸 것'을 보여주면 됩니다.",
  중소: "중소기업은 '오래 함께할 사람'을 원합니다. 이 회사에 구체적으로 기여할 수 있는 방법을 제시하고, 충성도와 안정적 근무 의지를 표현하세요.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, birthYear, birthMonth, birthDay, field, companySize, company, keywords, phone } = body;

    const year = parseInt(birthYear); const month = parseInt(birthMonth); const day = parseInt(birthDay);
    if (!year || !month || !day || !name || !field || !companySize) {
      return NextResponse.json({ error: "필수 입력값 누락" }, { status: 400 });
    }

    const oh = getOhaeng(year);
    const score = calcScore(year, month, day, field, companySize);
    const ohData = ohaengStrength[oh] ?? ohaengStrength["토"];
    const fieldData = fieldKeywords[field] ?? fieldKeywords["기타"];
    const sizeTip = sizeStrategy[companySize] ?? sizeStrategy["중소"];

    const result = {
      name, birthYear, birthMonth, birthDay, field, companySize,
      company: company || "", keywords: keywords || "", phone: phone || "",
      oh, score,
      trait: ohData.trait,
      ohKeyword: ohData.keyword,
      ohAdvice: ohData.advice,
      fieldKeywords: fieldData.keywords,
      fieldStrategy: fieldData.strategy,
      interview: fieldData.interview,
      sizeStrategy: sizeTip,
      createdAt: Date.now(),
    };

    // Firebase 저장
    const id = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    await db.ref(`resume_analyses/${id}`).set(result);

    // 전화번호 있으면 free_leads에 1회만 저장 (같은 번호 중복 저장 안 함)
    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, "");
      if (cleanPhone.length >= 10) {
        const existing = await db.ref(`free_leads/${cleanPhone}`).once("value");
        if (!existing.exists()) {
          await db.ref(`free_leads/${cleanPhone}`).set({
            phone: cleanPhone,
            name,
            email: "",
            source: "resume",
            createdAt: Date.now(),
          });
        }
      }
    }

    return NextResponse.json({ id, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "분석 생성 실패" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 필요" }, { status: 400 });
    const snap = await db.ref(`resume_analyses/${id}`).get();
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch (e) {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
