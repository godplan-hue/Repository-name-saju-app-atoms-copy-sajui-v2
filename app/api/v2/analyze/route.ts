import { NextRequest, NextResponse } from "next/server";

function calcScore(birth: string, salt: number): number {
  const nums = birth.replace(/-/g, "").split("").map(Number);
  const sum = nums.reduce((a, b) => a + b, 0);
  return Math.min(95, Math.max(55, ((sum * 7 + salt * 13) % 41) + 55));
}

function getTemplateAnalysis(name: string, birth: string, category: string, scores: Record<string, number>): string {
  const year = parseInt(birth.split("-")[0]);
  const half = year % 2 === 0;

  const map: Record<string, string> = {
    "💰 재물운": `${name}님의 재물운 점수는 ${scores.wealth}점입니다.\n\n올해 재물의 흐름이 ${scores.wealth >= 75 ? "매우 강하게" : "조금씩"} 들어오는 시기입니다. 특히 하반기에 새로운 수입 채널이 열릴 가능성이 높습니다.\n\n${half ? "부동산과 투자를 통한 자산 증식이 기대됩니다." : "사업과 직장에서 좋은 기회가 찾아올 것입니다."}\n\n지금 집중해야 할 것은 지출 관리입니다. 작은 절약이 큰 자산이 됩니다.`,
    "💕 연애운": `${name}님의 연애운 점수는 ${scores.love}점입니다.\n\n${scores.love >= 75 ? "강한 인연의 기운이 흐르고 있습니다." : "소중한 만남의 기운이 서서히 다가오고 있습니다."}\n\n봄과 가을 사이, 예상치 못한 곳에서 특별한 인연을 만날 수 있습니다.\n\n진심으로 상대를 대할 때 가장 좋은 결과가 나타납니다. 지금은 자신을 사랑하는 것이 먼저입니다.`,
    "🎯 성공운": `${name}님의 성공운 점수는 ${scores.success}점입니다.\n\n${scores.success >= 75 ? "강한 추진력과 성취의 기운이 함께합니다." : "차분히 기초를 다지는 시기입니다."}\n\n노력한 만큼 반드시 결과가 따라옵니다. 포기하지 않는 것이 성공의 열쇠입니다.\n\n주변의 도움을 받아들이고, 협력을 통해 더 큰 성과를 이룰 수 있습니다.`,
    "💪 건강운": `${name}님의 건강운 점수는 ${scores.health}점입니다.\n\n${scores.health >= 75 ? "전반적으로 건강 상태가 좋습니다." : "규칙적인 생활로 건강을 챙겨야 할 시기입니다."}\n\n충분한 수분 섭취와 규칙적인 운동을 추천합니다.\n\n마음의 여유가 몸의 건강으로 이어집니다.`,
    "✨ 총운": `${name}님의 올해 총운 점수는 ${scores.total}점입니다.\n\n${scores.total >= 75 ? "전반적으로 좋은 기운이 흐르는 한 해입니다." : "차분히 기초를 다지며 준비하는 한 해입니다."}\n\n재물운, 연애운, 건강운이 균형 있게 펼쳐질 것입니다. 특히 인간관계에서 좋은 소식이 기다리고 있습니다.\n\n지금의 노력이 내년의 큰 결실로 이어질 것입니다.`,
  };

  return map[category] ?? map["✨ 총운"];
}

export async function POST(request: NextRequest) {
  try {
    const { name, birth, birthHour, gender, relationship, category, planType } = await request.json();

    const scores = {
      total: calcScore(birth, 1),
      wealth: calcScore(birth, 2),
      love: calcScore(birth, 3),
      health: calcScore(birth, 4),
      success: calcScore(birth, 5),
    };

    const luckyColors = ["보라색", "분홍색", "하늘색", "황금색", "초록색"];
    const luckyDirections = ["동쪽", "서쪽", "남쪽", "북쪽"];
    const [y, m, d] = birth.split("-").map(Number);
    const luckyColor = luckyColors[(y + m + d) % luckyColors.length];
    const luckyNumber = ((y + m * 13 + d * 7) % 9) + 1;
    const luckyDirection = luckyDirections[(y + m) % luckyDirections.length];

    if (planType === "free") {
      const analysis = getTemplateAnalysis(name, birth, category, scores);
      return NextResponse.json({ scores, analysis, luckyColor, luckyNumber, luckyDirection });
    }

    // 유료: Anthropic API
    const prompt = `전문 사주분석가로서 ${name}님의 ${category} 운세를 분석해주세요.
생년월일: ${birth}, 태어난 시간: ${birthHour === "unknown" ? "모름" : birthHour + "시"}, 성별: ${gender}
분석 대상: ${relationship === "나" ? "본인" : relationship}
운세 점수 - 총운: ${scores.total}, 재물: ${scores.wealth}, 연애: ${scores.love}, 건강: ${scores.health}, 성공: ${scores.success}

위 점수를 참고하여 ${category}에 대한 상세하고 희망찬 운세 분석을 700자 내외로 작성해주세요.
구체적인 시기, 행동 지침, 긍정적인 메시지를 포함해주세요.`;

    const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!apiResponse.ok) throw new Error("API error");
    const data = await apiResponse.json();
    const analysis = data.content[0].text;

    return NextResponse.json({ scores, analysis, luckyColor, luckyNumber, luckyDirection });
  } catch (error) {
    console.error("v2 analyze error:", error);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다" }, { status: 500 });
  }
}
