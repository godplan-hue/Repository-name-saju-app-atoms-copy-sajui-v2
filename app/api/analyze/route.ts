import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, birth, birthHour, gender } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API 키가 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2500,
        messages: [
          {
            role: "user",
            content: `이름: ${name}
생년월일: ${birth}
생시: ${birthHour}
성별: ${gender}

당신은 전문 사주 분석가입니다. 다음 5가지를 매우 상세하게 작성하세요.

중요: 각 섹션마다:
- 각 문장을 새 줄에만 작성
- 문장과 문장 사이 빈 줄 필수
- 문장은 절대 중간에 끊지 말 것
- 최소 4줄 이상 작성

[이름 분석]
(4줄 이상)

[재물운]
(4줄 이상)

[연애운]
(4줄 이상)

[건강운]
(4줄 이상)

[궁합 분석]
(4줄 이상)`,
          },
        ],
      }),
    });

    if (!response.ok) {
      let errorMessage = "Claude API 오류";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || JSON.stringify(errorData);
      } catch (parseError) {
        const textError = await response.text();
        errorMessage = textError || response.statusText;
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();

    let analysisText = "";
    
    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      const firstContent = data.content[0];
      if (firstContent.type === "text") {
        analysisText = firstContent.text;
      }
    }

    const parseSection = (text: string, section: string): string => {
      const regex = new RegExp(`\\[${section}\\]([^\\[]*?)(?=\\[|$)`, 's');
      const match = text.match(regex);
      if (match && match[1]) {
        let result = match[1].trim();
        // 문장 끝에 줄바꿈 추가 (입니다. 다. 습니다. 등)
        result = result.replace(/([입니다다습니다]\.)/g, '$1\n\n');
        result = result.replace(/([습니다다])\n/g, '$1\n\n');
        // 연속된 줄바꿈 정리
        result = result.replace(/\n\n\n+/g, '\n\n');
        return result;
      }
      return "분석 완료";
    };

    const result = {
      name: parseSection(analysisText, "이름 분석"),
      wealthLuck: parseSection(analysisText, "재물운"),
      loveLuck: parseSection(analysisText, "연애운"),
      healthLuck: parseSection(analysisText, "건강운"),
      couple: parseSection(analysisText, "궁합 분석"),
      yearlyLuck: getYearlyTemplate(birth),
      monthlyLuck: getMonthlyTemplate(birth),
      fullAnalysis: getFullTemplate(birth),
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
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