import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const { name, email, birth, birthHour, gender, planType, partnerName, partnerBirth, packageType } = await request.json();


    console.log("분석 요청:", { name, email, birth, birthHour, planType, packageType });


    // 무료 분석: 템플릿만 사용 (API 호출 안 함)
    if (planType === "free") {
      console.log("무료 분석 - 템플릿 반환");
      const result = {
        name: getNameTemplate(name),
        wealthLuck: getWealthTemplate(birth),
        loveLuck: getLoveTemplate(birth),
        healthLuck: getHealthTemplate(birth),
        couple: getCoupleTemplate(birth),
        yearlyLuck: getYearlyTemplate(birth),
        monthlyLuck: getMonthlyTemplate(birth),
        fullAnalysis: getFullTemplate(birth),
      };
      return NextResponse.json({ result });
    }


    // 유료 분석: API 호출
    let maxTokens = 10000;
if (packageType === "기본 분석") maxTokens = 10000;
else if (packageType === "베이직") maxTokens = 20000;
else if (packageType === "프리미엄") maxTokens = 30000;
else if (packageType === "VIP 커플팩") maxTokens = 40000;


    console.log(`Sonnet API 호출 시작 (${packageType}, max_tokens: ${maxTokens})...`);
   
    const apiResult = await callSonnetAPI({
      name,
      birth,
      birthHour,
      partnerName,
      partnerBirth,
      packageType,
      maxTokens
    });


    console.log("API 분석 완료");


    return NextResponse.json({ result: apiResult });
  } catch (error) {
    console.error("분석 오류:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}


async function callSonnetAPI(userData: any): Promise<any> {
  const { name, birth, birthHour, partnerName, partnerBirth, packageType, maxTokens } = userData;


  let prompt = "";


  if (packageType === "기본 분석") {
    prompt = `당신은 전문 사주분석가입니다. 다음 정보로 사주분석을 해주세요.
【본인정보】이름: ${name}, 생년월일: ${birth}, 태어난 시간: ${birthHour === "unknown" ? "모름" : birthHour + "시"}
【분석 항목】1. 올해 운세 2. 월별 운세
각 항목당 5000~7000자로 상세하게 작성해주세요.
JSON 형식: {"yearlyLuck": "내용", "monthlyLuck": "내용"}`;
  } else if (packageType === "베이직") {
    prompt = `당신은 전문 사주분석가입니다. 다음 정보로 사주분석을 해주세요.
【본인정보】이름: ${name}, 생년월일: ${birth}, 태어난 시간: ${birthHour === "unknown" ? "모름" : birthHour + "시"}
【분석 항목】1. 올해 운세 2. 월별 운세 3. 재물운 4. 연애운
각 항목당 5000~7000자로 상세하게 작성해주세요.
JSON 형식: {"yearlyLuck": "내용", "monthlyLuck": "내용", "wealthLuck": "내용", "loveLuck": "내용"}`;
  } else if (packageType === "프리미엄") {
    prompt = `당신은 전문 사주분석가입니다. 다음 정보로 사주분석을 해주세요.
【본인정보】이름: ${name}, 생년월일: ${birth}, 태어난 시간: ${birthHour === "unknown" ? "모름" : birthHour + "시"}
【분석 항목】1. 올해 운세 2. 월별 운세 3. 재물운 4. 연애운 5. 건강운
각 항목당 5000~7000자로 상세하게 작성해주세요.
JSON 형식: {"yearlyLuck": "내용", "monthlyLuck": "내용", "wealthLuck": "내용", "loveLuck": "내용", "healthLuck": "내용"}`;
  } else if (packageType === "VIP 커플팩") {
    prompt = `당신은 전문 사주분석가입니다. 다음 정보로 사주분석을 해주세요.
【본인정보】이름: ${name}, 생년월일: ${birth}, 태어난 시간: ${birthHour === "unknown" ? "모름" : birthHour + "시"}
${partnerName ? `【상대방정보】이름: ${partnerName}, 생년월일: ${partnerBirth}` : ""}
【분석 항목】1. 올해 운세 2. 월별 운세 3. 이름분석 4. 재물운 5. 연애운 6. 건강운 7. 궁합분석 8. 전체사주
각 항목당 5000~7000자로 상세하게 작성해주세요.
JSON 형식: {"yearlyLuck": "내용", "monthlyLuck": "내용", "name": "내용", "wealthLuck": "내용", "loveLuck": "내용", "healthLuck": "내용", "couple": "내용", "fullAnalysis": "내용"}`;
  }


  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });


    if (!response.ok) {
      const errorData = await response.json();
      console.error("API 응답 오류:", errorData);
      throw new Error(`API 오류: ${response.statusText}`);
    }


    const data = await response.json();
    const content = data.content[0].text;


    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON 파싱 실패");
    }


    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error("Sonnet API 호출 실패:", error);
    throw error;
  }
}


function getNameTemplate(name: string): string {
  return `${name}님의 이름은 깊은 의미를 담고 있습니다.\n\n각 글자가 지닌 뜻을 통해 당신의 성격과 운명을 알 수 있습니다.\n\n긍정적인 기운이 가득한 이름입니다.\n\n당신의 이름은 좋은 운을 불러옵니다.`;
}


function getWealthTemplate(birth: string): string {
  const year = parseInt(birth.split("-")[0]);
 
  if (year >= 1970 && year < 1980) {
    return `당신의 재물운은 꾸준한 상승세를 보입니다.\n\n중년 이후 본격적인 재물 증식이 시작됩니다.\n\n부동산과 투자를 통해 자산을 늘릴 수 있습니다.\n\n인내심 있는 노력이 결실을 맺을 것입니다.`;
  } else if (year >= 1980 && year < 1990) {
    return `당신은 안정적인 재물 관리 능력을 가지고 있습니다.\n\n초반에는 기초를 다지는 시간이 될 것입니다.\n\n30대 후반부터 재물운이 본격화됩니다.\n\n꾸준한 노력으로 좋은 성과를 얻을 수 있습니다.`;
  } else if (year >= 1990 && year < 2000) {
    return `당신의 재물운은 활기차고 역동적입니다.\n\n새로운 기회들이 자주 찾아올 것입니다.\n\n창의적인 활동으로 재물을 모을 수 있습니다.\n\n긍정적인 마음으로 도전하면 성공합니다.`;
  } else {
    return `당신은 창의적인 재물 관리 능력을 가지고 있습니다.\n\n새로운 아이디어로 수입을 창출할 수 있습니다.\n\n도전적인 시도가 좋은 결과를 가져올 것입니다.\n\n긍정적인 태도가 재물을 불러옵니다.`;
  }
}


function getLoveTemplate(birth: string): string {
  const month = parseInt(birth.split("-")[1]);
 
  if (month >= 1 && month <= 3) {
    return `당신의 연애운은 진중하고 깊습니다.\n\n진심 어린 관계를 지향하는 성향입니다.\n\n한 번 마음을 정하면 오래 함께합니다.\n\n배우자와 깊은 이해와 신뢰를 나눕니다.`;
  } else if (month >= 4 && month <= 6) {
    return `당신의 연애운은 따뜻하고 포용적입니다.\n\n많은 사람들에게 호감을 받는 매력이 있습니다.\n\n안정적이고 행복한 관계를 만들 수 있습니다.\n\n가정에서 큰 행복을 찾을 것입니다.`;
  } else if (month >= 7 && month <= 9) {
    return `당신의 연애운은 활기차고 긍정적입니다.\n\n새로운 만남이 자주 찾아올 것입니다.\n\n즐겁고 신나는 관계를 선호합니다.\n\n함께 성장할 수 있는 파트너를 만날 것입니다.`;
  } else {
    return `당신의 연애운은 성숙하고 현명합니다.\n\n시간이 지날수록 더 깊어지는 사랑을 경험합니다.\n\n서로를 존중하는 관계를 만듭니다.\n\n행복한 결혼 생활을 이룰 것입니다.`;
  }
}


function getHealthTemplate(birth: string): string {
  const year = parseInt(birth.split("-")[0]);
 
  if (year >= 1970 && year < 1980) {
    return `당신의 건강운은 전반적으로 양호합니다.\n\n규칙적인 생활로 건강을 유지할 수 있습니다.\n\n중년 이후 정기적인 건강검진이 중요합니다.\n\n적당한 운동으로 장수할 수 있습니다.`;
  } else if (year >= 1980 && year < 1990) {
    return `당신은 강인한 체질을 타고났습니다.\n\n스트레스 관리가 건강의 핵심입니다.\n\n충분한 수면과 운동으로 활력을 유지하세요.\n\n건강한 생활 습관이 좋은 미래를 만듭니다.`;
  } else if (year >= 1990 && year < 2000) {
    return `당신의 건강운은 매우 좋습니다.\n\n활동적인 생활로 건강을 유지할 수 있습니다.\n\n긍정적인 마음가짐이 건강을 지킵니다.\n\n규칙적인 운동으로 더욱 건강해질 것입니다.`;
  } else {
    return `당신은 건강한 체질을 가지고 있습니다.\n\n균형 잡힌 생활로 건강을 지킬 수 있습니다.\n\n마음의 평온이 육체 건강을 만듭니다.\n\n긍정적인 생각이 건강을 지켜줍니다.`;
  }
}


function getCoupleTemplate(birth: string): string {
  const year = parseInt(birth.split("-")[0]);
  const animalYear = (year - 1900) % 12;
  const animals = ["쥐", "소", "호랑이", "토끼", "뱀", "말", "양", "원숭이", "닭", "개", "돼지", ""];
  const currentAnimal = animals[animalYear];
 
  if (animalYear === 0) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 용띠와 원숭이띠입니다.\n\n상호 보완적인 관계를 만들 수 있습니다.\n\n서로를 이해하고 존중하면 좋은 관계입니다.\n\n함께 성장하는 부부가 될 수 있습니다.`;
  } else if (animalYear === 1) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 쥐띠와 뱀띠입니다.\n\n안정적이고 오래가는 관계를 만듭니다.\n\n신뢰와 성실로 가정을 이룹니다.\n\n깊은 사랑으로 행복한 가정을 꾸립니다.`;
  } else if (animalYear === 2) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 말띠와 개띠입니다.\n\n활발하고 즐거운 관계를 만듭니다.\n\n함께 도전하고 성취할 수 있습니다.\n\n신나는 인생을 함께 할 수 있습니다.`;
  } else if (animalYear === 3) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 양띠와 돼지띠입니다.\n\n부드럽고 따뜻한 관계를 만듭니다.\n\n상대를 배려하는 마음으로 행복합니다.\n\n평화로운 가정을 이룰 수 있습니다.`;
  } else if (animalYear === 4) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 소띠와 닭띠입니다.\n\n깊이 있는 관계를 만들 수 있습니다.\n\n서로를 이해하는 지혜로운 부부입니다.\n\n조화로운 가정을 이룰 것입니다.`;
  } else if (animalYear === 5) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 호랑이띠와 개띠입니다.\n\n역동적이고 활기찬 관계를 만듭니다.\n\n함께 새로운 경험을 쌓을 수 있습니다.\n\n즐거운 인생 여정을 함께 합니다.`;
  } else if (animalYear === 6) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 토끼띠와 돼지띠입니다.\n\n부드럽고 온화한 관계를 만듭니다.\n\n서로를 배려하는 마음이 깊습니다.\n\n따뜻한 가정을 이룰 것입니다.`;
  } else if (animalYear === 7) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 쥐띠와 용띠입니다.\n\n재미있고 신나는 관계를 만듭니다.\n\n서로를 웃게 만드는 부부입니다.\n\n행복한 결혼 생활을 할 것입니다.`;
  } else if (animalYear === 8) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 뱀띠와 소띠입니다.\n\n솔직하고 진심 어린 관계를 만듭니다.\n\n서로를 소중히 여기는 부부입니다.\n\n신뢰로 이루어진 가정을 꾸립니다.`;
  } else if (animalYear === 9) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 호랑이띠와 말띠입니다.\n\n성실하고 진지한 관계를 만듭니다.\n\n서로 지켜주는 마음이 깊습니다.\n\n든든한 가정을 이룰 것입니다.`;
  } else if (animalYear === 10) {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 토끼띠와 양띠입니다.\n\n따뜻하고 포근한 관계를 만듭니다.\n\n서로를 보듬는 마음이 깊습니다.\n\n행복한 가정을 이룰 것입니다.`;
  } else {
    return `${currentAnimal}띠인 당신과 잘 맞는 상대는 쥐띠와 원숭이띠입니다.\n\n역동적이고 성공적인 관계를 만듭니다.\n\n함께 큰 꿈을 이룰 수 있습니다.\n\n위대한 부부가 될 것입니다.`;
  }
}


function getYearlyTemplate(birth: string): string {
  const year = birth.split("-")[0];
  const templates: { [key: string]: string } = {
    "197": `${year}년생 당신에게 올해는 새로운 도전의 시작입니다.\n\n새로운 기회가 찾아올 것입니다.\n\n변화를 두려워하지 마세요.\n\n올해는 성장의 해가 될 것입니다.`,
    "198": `${year}년생 당신에게 올해는 안정과 성장이 함께할 시기입니다.\n\n기초를 다지는 한 해가 될 것입니다.\n\n인내심이 필요한 시간입니다.\n\n좋은 결실을 맺을 수 있습니다.`,
    "199": `${year}년생 당신에게 올해는 새로운 시작입니다.\n\n도전할 준비를 하세요.\n\n좋은 기회가 찾아올 것입니다.\n\n긍정적인 에너지로 가득할 것입니다.`,
    "200": `${year}년생 당신에게 올해는 성장의 시간입니다.\n\n꿈을 향해 나아갈 시기입니다.\n\n노력이 빛날 한 해입니다.\n\n새로운 가능성이 열릴 것입니다.`,
  };


  for (const [key, value] of Object.entries(templates)) {
    if (year.startsWith(key)) {
      return value;
    }
  }
 
  return `올해는 새로운 변화와 성장이 함께할 시기입니다.\n\n긍정적인 에너지로 한 해를 시작하세요.\n\n좋은 기회를 놓치지 마세요.\n\n당신의 노력이 빛날 것입니다.`;
}


function getMonthlyTemplate(birth: string): string {
  const month = parseInt(birth.split("-")[1]);
  const monthNames = ["", "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const monthTexts: { [key: number]: string } = {
    1: `${monthNames[month]}은 새로운 시작의 달입니다.\n\n신선한 에너지가 넘칠 것입니다.\n\n계획을 세우기에 좋은 시기입니다.\n\n긍정적인 변화가 시작될 것입니다.`,
    2: `${monthNames[month]}은 관계가 중요한 달입니다.\n\n주변 사람들과의 소통이 좋습니다.\n\n새로운 인연을 기대해보세요.\n\n따뜻한 감정으로 가득할 것입니다.`,
    3: `${monthNames[month]}은 성장의 달입니다.\n\n새로운 도전을 시작하기 좋은 시기입니다.\n\n활동적인 에너지가 넘칠 것입니다.\n\n좋은 결과를 기대할 수 있습니다.`,
    4: `${monthNames[month]}은 안정의 달입니다.\n\n기초를 다지기에 적합합니다.\n\n차분한 마음으로 일을 진행하세요.\n\n좋은 결과가 나타날 것입니다.`,
    5: `${monthNames[month]}은 행운의 달입니다.\n\n긍정적인 에너지가 가득합니다.\n\n새로운 기회가 찾아올 것입니다.\n\n활발한 활동을 시작하기 좋습니다.`,
    6: `${monthNames[month]}은 성찰의 달입니다.\n\n내면을 돌아보기에 좋은 시기입니다.\n\n차분한 마음으로 계획을 세우세요.\n\n새로운 방향을 찾을 수 있습니다.`,
    7: `${monthNames[month]}은 변화의 달입니다.\n\n새로운 시작을 준비해보세요.\n\n창의적인 에너지가 넘칩니다.\n\n좋은 기회를 포착할 수 있습니다.`,
    8: `${monthNames[month]}은 성과의 달입니다.\n\n노력의 결실이 나타날 것입니다.\n\n자신감을 가지고 나아가세요.\n\n행운이 함께할 것입니다.`,
    9: `${monthNames[month]}은 조화의 달입니다.\n\n인간관계가 좋아질 것입니다.\n\n평온함이 찾아올 것입니다.\n\n좋은 협력을 기대할 수 있습니다.`,
    10: `${monthNames[month]}은 수확의 달입니다.\n\n그동안의 노력이 빛날 것입니다.\n\n긍정적인 변화가 일어날 것입니다.\n\n좋은 소식을 기대해보세요.`,
    11: `${monthNames[month]}은 준비의 달입니다.\n\n앞으로의 계획을 세우기 좋습니다.\n\n차분한 마음으로 계획하세요.\n\n새로운 시작을 준비할 수 있습니다.`,
    12: `${monthNames[month]}은 마무리의 달입니다.\n\n한 해를 정리하기에 좋은 시기입니다.\n\n감사한 마음으로 마무리하세요.\n\n새로운 에너지를 준비하세요.`,
  };


  return monthTexts[month] || `이번 달은 새로운 기회와 가능성으로 가득합니다.\n\n긍정적인 에너지로 한 달을 보내세요.\n\n좋은 결과를 기대할 수 있습니다.\n\n당신의 노력이 빛날 것입니다.`;
}


function getFullTemplate(birth: string): string {
  const [year, month, day] = birth.split("-");
  return `${year}년 ${month}월 ${day}일 생 당신의 전체 사주 분석입니다.\n\n당신은 타고난 성격과 능력을 가지고 있습니다.\n\n인생 전체 흐름을 이해하는 것이 중요합니다.\n\n자신의 강점을 활용하여 삶을 설계해보세요.`;
}