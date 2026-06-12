"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import html2canvas from "html2canvas";
import JSZip from "jszip";

function PaidAnalysisResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paidInfo, setPaidInfo] = useState<any>(null);
  const [packageName, setPackageName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const analysisAnswers: { [key: string]: string } = {
    "💰 돈-돈은 벌지만 자산은 안 늘어남": "당신은 충분히 벌고 있습니다. 문제는 돈이 들어올 때마다 나간다는 것이죠. 이것은 당신의 '금전 흐름의 법칙'을 모르기 때문입니다.\n\n올해 8월과 11월 사이가 당신의 황금 타이밍입니다. 이 시기에 투자를 시작하면 자산이 2배로 증식됩니다.\n\n특히 9월 첫주가 가장 중요한 시점입니다. 이때 결정한 투자가 당신의 재물운을 완전히 바꿀 것입니다.\n\n지금부터 매월 수입의 30%를 따로 떼어두세요. 9월이 오면 그 돈으로 당신의 첫 투자를 시작하십시오. 이것이 부자로 가는 정확한 길입니다.",
    "💰 돈-큰돈은 들어오는데 자꾸 사라짐": "당신은 복의 기운이 강해서 큰돈을 받습니다. 하지만 그 돈을 붙잡지 못하고 있습니다.\n\n당신이 피해야 할 지출의 신호를 알려드리겠습니다. 10월과 12월에 갑자기 큰 지출 기회가 생기는데, 여기서 멈춰야 합니다.\n\n큰돈을 받았다면 최소 3개월은 그 돈을 건드리지 마세요. 특히 받은 달부터 3개월 후인 달이 '보관의 시점'입니다.\n\n이렇게 3개월을 버티면, 그 돈은 자동으로 당신의 자산이 됩니다. 이것이 당신의 재물운을 지키는 법칙입니다.",
    "💰 돈-일을 많이 해도 가난한 느낌": "당신의 월급은 충분합니다. 문제는 마음입니다. 당신을 가난하게 만드는 무의식적 믿음이 있습니다.\n\n당신이 무언가를 사려고 할 때 항상 '미안해'라고 생각하지 않습니까? 이것이 당신의 가난입니다.\n\n부자의 마인드 전환점은 7월입니다. 7월부터 당신의 '풍요의식'이 깨어납니다.\n\n이때부터 자신을 위해 기꺼이 돈을 쓰세요. 좋은 옷, 좋은 음식, 자기계발. 이것들이 당신의 복을 불러옵니다.\n\n당신이 자신에게 투자할수록, 우주는 당신에게 더 많은 돈을 보낼 것입니다.",
    "💰 돈-투자를 하고 싶은데 시작을 못함": "투자를 두려워하는 것은 지혜입니다만, 지금은 행동할 시점입니다.\n\n당신이 투자해야 할 구체적 시점은 9월부터 11월 사이입니다. 이 시기의 투자는 위험이 거의 없습니다.\n\n첫 투자는 당신이 잃어도 괜찮은 금액으로 시작하세요. 보통 월급의 10%가 적당합니다.\n\n당신의 사주에는 투자의 길이 명확히 보입니다. 이번 가을은 당신의 경제적 독립을 이루는 시작이 될 것입니다.",
    "💰 돈-부채가 자꾸 늘어남": "당신의 부채는 큰 문제가 아닙니다. 당신에게는 부채를 해결할 능력이 충분히 있습니다.\n\n부채가 자꾸 늘어나는 이유는 '시점'의 문제입니다. 당신이 부채를 갚기에 가장 좋은 시점은 올해 8월과 내년 2월입니다.\n\n이 두 시기에 집중해서 갚으면, 나머지 기간에는 부채가 자동으로 줄어듭니다.\n\n당신의 사주는 내년 3월부터 완전히 달라질 것을 보여줍니다. 그때쯤이면 부채는 완전히 사라지고, 당신은 새로운 경제적 자유를 누릴 것입니다.",
    "💕 애정-짝을 못 만나고 있음": "당신을 기다리는 사람이 존재합니다. 그 사람은 당신을 찾고 있습니다.\n\n만날 정확한 시점은 올해 10월부터 내년 1월 사이입니다. 이 기간에 특별한 만남이 찾아올 것입니다.\n\n신호는 작은 것부터 시작됩니다. 평소와 다른 장소에 가게 되거나, 새로운 모임에 초대받게 될 것입니다. 그 신호를 놓치지 마세요.\n\n당신의 연애운은 매우 강합니다. 이제 단순히 기다리는 것이 아니라, 조금씩 움직일 시간입니다. 새로운 옷을 입고, 새로운 장소에 가세요. 그곳에서 당신의 사람을 만날 것입니다.",
    "💕 애정-만나는 사람마다 헤어짐": "당신이 만나는 사람들은 모두 시간이 필요한 사람들입니다. 그들과의 관계는 충돌하기 쉽습니다.\n\n당신과 오래갈 사람의 특징은 명확합니다. 당신보다 나이가 많고, 당신을 이해해주는 여유가 있는 사람입니다.\n\n지금까지 만난 사람들과 헤어진 이유는 '시점'의 불일치였습니다. 당신이 성장할 시기에 상대는 정체된 것입니다.\n\n올해 11월부터는 당신의 운이 달라집니다. 이때 만나는 사람이 바로 당신의 사람입니다. 그 사람과는 자연스럽게 오래갈 것입니다.",
    "💕 애정-좋아하는 사람이 없음": "당신의 마음이 닫혀있는 것이 아닙니다. 당신은 '기다리고 있는' 것입니다.\n\n당신의 감정이 살아나는 정확한 시점은 내년 3월입니다. 이때 당신은 처음으로 진정한 감정을 느낄 것입니다.\n\n그 사람은 갑자기 나타나지 않습니다. 조금씩 당신의 일상에 스며들 것입니다.\n\n지금은 당신 자신을 돌보는 시간입니다. 당신이 행복할수록, 그 사람을 더 쉽게 만날 것입니다. 당신의 웃음이 당신의 운을 바꿀 것입니다.",
    "💕 애정-현재 관계가 불안정함": "당신의 관계가 불안한 이유는 기초가 아직 완성되지 않았기 때문입니다.\n\n관계가 깨질 위험한 시점은 9월과 12월입니다. 이 시기에는 특별히 더 신경써야 합니다.\n\n관계를 다시 살리는 방법은 간단합니다. 상대방과 솔직하게 대화하세요. 당신의 불안감을 말하고, 상대방의 불안감을 들으세요.\n\n올해 내내 이 과정을 거치면, 내년부터 당신의 관계는 완전히 달라질 것입니다. 더 깊고, 더 안정적인 사랑이 될 것입니다.",
    "💕 애정-이별 후 힘들어함": "당신의 상처는 깊지만, 이것이 당신을 바꿀 것입니다.\n\n상처가 완전히 치유되는 시기는 내년 2월입니다. 그때쯤이면 당신은 이 이별을 축복이라고 생각할 것입니다.\n\n새로운 사랑이 시작될 신호는 봄에 옵니다. 봄이 되면 당신은 자연스럽게 새로운 사람을 만날 것입니다.\n\n지금은 당신 자신에게 집중하세요. 취미활동, 자기계발, 친구들과의 시간. 이 모든 것이 당신을 새로운 사람으로 만들 것입니다. 그 새로운 당신이 더 행복한 사랑을 만들 것입니다.",
    "🎯 성공-열심히 해도 인정받지 못함": "당신의 능력은 충분합니다. 문제는 '알려지지 않은 것'입니다.\n\n당신을 주목할 정확한 시점은 내년 4월입니다. 그때부터 당신의 능력을 알아보는 사람들이 나타날 것입니다.\n\n하지만 그때를 기다리기만 해서는 안 됩니다. 지금부터 당신의 업적을 조금씩 알려야 합니다.\n\n당신의 능력을 세상에 알리는 가장 좋은 방법은 '작은 성공'을 반복하는 것입니다. 작은 프로젝트를 완성하고, 그것을 자랑하세요. 그러다 보면 큰 기회가 올 것입니다.",
    "🎯 성공-꿈은 크지만 시작 용기가 없음": "당신의 꿈은 현실이 될 수 있습니다. 당신에게는 그 꿈을 이룰 능력이 있습니다.\n\n시작해야 할 정확한 시점은 10월입니다. 이 시점부터 우주의 에너지가 당신을 돕기 시작합니다.\n\n성공으로 가는 구체적 첫 단계는 '선언'입니다. 당신의 꿈을 누군가에게 말하세요. 이것이 당신의 용기를 깨울 것입니다.\n\n두려움을 극복하는 가장 좋은 방법은 '작게 시작하는 것'입니다. 당신의 큰 꿈을 작은 목표로 나누세요. 그 작은 목표들을 하나씩 이루다 보면, 큰 꿈도 자연스럽게 이루어질 것입니다.",
    "🎯 성공-실수가 자꾸 나옴": "당신이 실수를 하는 이유는 당신이 계속 움직이고 있기 때문입니다. 이것은 좋은 신호입니다.\n\n실수가 자연스럽게 줄어드는 시점은 내년 5월입니다. 그때까지 당신은 경험이 풍부해질 것입니다.\n\n실수에서 배우는 방법은 '기록'입니다. 자신이 한 실수를 기록하고, 그것을 분석하세요. 이 과정이 당신을 성숙하게 만들 것입니다.\n\n당신의 실수는 모두 자산이 됩니다. 지금의 실수들이 내년의 성공을 만들 것입니다.",
    "🎯 성공-경쟁에서 지고 있음": "당신이 뒤지는 것처럼 보이지만, 당신은 더 단단한 기초를 다지고 있습니다.\n\n당신이 추월할 정확한 시점은 내년 7월입니다. 그때부터 당신의 속도가 빨라질 것입니다.\n\n역전의 기회는 내년 겨울에 옵니다. 그때 경쟁자들은 실패를 경험할 것이고, 당신은 그것을 극복할 것입니다.\n\n지금 당신이 할 일은 '기초 다지기'입니다. 흔들리지 않는 기초가 당신을 최종 승자로 만들 것입니다.",
    "🎯 성공-일이 자꾸 꼬임": "당신의 일이 꼬이는 것은 우주가 당신을 더 나은 길로 인도하고 있다는 신호입니다.\n\n일이 풀리는 정확한 시기는 올해 11월입니다. 그때부터 모든 것이 순조롭게 흘러갈 것입니다.\n\n지금 당신이 겪는 문제를 해결하는 방법은 '다른 관점에서 보기'입니다. 같은 문제도 다른 각도에서 보면 해결책이 보입니다.\n\n당신의 사주는 올해 말부터 완전히 달라질 것을 보여줍니다. 지금의 어려움은 그 변화를 위한 과정입니다.",
    "💼 사업-사업 아이디어는 많은데 실행 못함": "당신의 아이디어들은 모두 좋은 아이디어입니다. 문제는 '타이밍'입니다.\n\n사업을 실행해야 할 정확한 시점은 내년 3월입니다. 이 시점부터 사업 운이 매우 좋아집니다.\n\n성공할 아이디어의 구체적 형태는 당신이 가장 좋아하는 아이디어입니다. 다른 아이디어는 잠시 미루세요.\n\n안정적으로 시작하는 방법은 작은 규모에서 시작하는 것입니다. 큰 투자 없이도 시작할 수 있는 방법이 있을 것입니다. 그렇게 시작하면 내년 가을쯤 큰 성공을 맞이할 것입니다.",
    "💼 사업-사업해봤는데 망함": "당신의 실패는 당신의 능력이 부족해서가 아닙니다. 단지 '시점'이 맞지 않았을 뿐입니다.\n\n실패의 근본 원인은 당신이 이미 알고 있을 것입니다. 그것을 인정하고 받아들이세요. 그것이 당신을 강하게 만들 것입니다.\n\n이번에 성공할 구체적 조건은 명확합니다. 당신은 이제 혼자가 아닙니다. 신뢰할 수 있는 파트너를 찾으세요.\n\n성공하는 사업의 정확한 형태는 당신의 경험과 일치하는 사업입니다. 새로운 분야가 아니라, 당신이 이미 아는 분야에서 다시 시도하세요. 내년 봄, 당신은 반드시 성공할 것입니다.",
    "💼 사업-사업 자금이 부족함": "당신의 사업에 필요한 자금은 반드시 들어올 것입니다. 우주가 당신의 사업을 응원하고 있습니다.\n\n자금이 들어오는 정확한 시기는 내년 2월입니다. 이 시점까지 기다려야 합니다.\n\n자금을 얻는 구체적 방법은 '당신의 네트워크'입니다. 주변 사람들과 당신의 사업에 대해 이야기하세요. 그 중에서 투자자가 나타날 것입니다.\n\n투자자를 만나는 신호는 '우연한 만남'입니다. 평소와 다른 자리에 나가면, 당신의 사업에 관심 있는 사람을 만날 것입니다.",
    "💼 사업-사업이 잘 안 되고 있음": "당신의 사업이 성장이 더딘 것처럼 보이지만, 실은 단단한 기초를 다지고 있습니다.\n\n사업이 급성장할 정확한 시점은 내년 8월입니다. 그때부터 매출이 확 증가할 것입니다.\n\n지금 당신이 해야 할 일은 경영 방향을 다시 생각하는 것입니다. 지금까지의 방식이 맞는지 확인하고, 필요하면 변화를 주세요.\n\n당신의 사주는 올해 말부터 대변화를 보여줍니다. 지금의 어려움은 그 변화를 위한 준비 기간입니다. 끝까지 포기하지 마세요.",
    "💼 사업-직장을 그만두고 싶음": "당신의 욕구는 정당합니다. 당신은 자유로워질 준비가 되어 있습니다.\n\n직장을 그만둘 정확한 시점은 내년 4월입니다. 이 시점부터 당신은 독립할 준비를 시작해야 합니다.\n\n지금부터 준비해야 할 것들이 있습니다. 저축, 스킬 개발, 네트워크 구축. 이 모든 것이 당신의 독립을 성공적으로 만들 것입니다.\n\n성공적인 독립의 방법은 '천천히 시작하는 것'입니다. 직장을 완전히 그만두기 전에 부업으로 시작하세요. 그렇게 안정성을 확보한 후 독립하면, 실패할 확률이 거의 없을 것입니다.",
    "💍 결혼-결혼하고 싶은데 상대가 없음": "당신의 결혼 준비는 이미 충분합니다. 이제 그 준비와 맞는 사람만 기다리면 됩니다.\n\n만날 사람의 정확한 시점은 올해 12월부터 내년 3월 사이입니다. 이 시기에 당신의 운명의 사람이 나타날 것입니다.\n\n그 사람을 만나는 과정은 자연스러울 것입니다. 조금 다른 모습으로 자신을 표현하면, 그 사람은 당신을 찾아올 것입니다.\n\n결혼까지의 구체적 과정은 매우 빠를 것입니다. 만난 후 1년 안에 결혼 제안을 받을 가능성이 높습니다. 당신의 결혼은 매우 행복할 것입니다.",
    "💍 결혼-결혼 시기를 놓쳤나 싶음": "당신의 결혼 시기는 정확하게 정해져 있습니다. 그것은 내년 여름입니다.\n\n지금 누군가와 함께라 해도, 그것이 당신의 최고의 결혼 상대인지 확인해야 합니다. 당신의 사주는 내년 여름에 더 좋은 사람을 만날 수 있음을 보여줍니다.\n\n지금부터 준비해야 할 것은 '당신 자신'입니다. 당신이 더 성숙해질수록, 더 좋은 상대를 만날 것입니다.\n\n최적의 결혼 상대의 특징은 명확합니다. 당신과 가치관이 같고, 당신의 성장을 도와주는 사람입니다. 그런 사람이 내년 여름에 나타날 것입니다.",
    "💍 결혼-결혼 후 관계가 힘들어짐": "당신들의 관계가 힘든 것은 결혼이 성숙 단계에 들어섰기 때문입니다. 이것은 좋은 신호입니다.\n\n관계가 회복되는 정확한 시점은 올해 12월입니다. 이 시점부터 당신들은 다시 서로를 바라보기 시작할 것입니다.\n\n다시 사랑에 빠지는 방법은 간단합니다. 상대방과 솔직하게 대화하세요. 당신이 상대를 감사해할 때, 상대도 당신을 감사해할 것입니다.\n\n지금의 어려움은 당신들을 더 단단하게 만들 것입니다. 이것을 견딘 부부는 평생 함께할 것입니다.",
    "💍 결혼-이혼을 생각 중임": "지금 당신이 이혼을 생각하는 것은 당신의 결혼이 최고의 위기를 맞이했다는 뜻입니다. 하지만 이것은 끝이 아니라 변화의 신호입니다.\n\n결혼 회복의 마지막 기회는 올해 안에 옵니다. 이 기간에 상대방과 진정으로 대화하세요.\n\n부부 관계의 진정한 원인을 찾으세요. 그것은 상대방이 아니라 당신들 사이의 작은 오해일 수 있습니다.\n\n결혼을 살리는 구체적 방법은 '전문가의 도움'입니다. 커플 상담을 받아보세요. 당신들은 충분히 회복될 수 있습니다. 내년 봄, 당신들의 결혼은 새로워질 것입니다.",
    "💍 결혼-자녀 계획이 안 이루어짐": "당신이 아이를 가지지 못하는 것은 신체적 이유보다 '타이밍'의 문제입니다.\n\n아이가 올 정확한 시점은 내년 5월부터 8월 사이입니다. 이 기간에 임신이 될 가능성이 매우 높습니다.\n\n지금 준비해야 할 것은 신체와 마음의 준비입니다. 건강한 생활, 충분한 휴식, 긍정적인 마음. 이 모든 것이 당신을 아이를 가질 수 있는 상태로 만들 것입니다.\n\n당신들의 자녀는 특별한 아이가 될 것입니다. 이 기간의 기다림이 당신을 더 좋은 부모로 만들 것입니다."
  };

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const infoStr = sessionStorage.getItem("analysisResult");
    const category = sessionStorage.getItem("analysisCategory");
    const title = sessionStorage.getItem("analysisTitle");
    const pkg = sessionStorage.getItem("selectedPackage") || "기본 분석";

    if (infoStr) {
      try {
        const parsed = JSON.parse(infoStr);
        parsed.category = category;
        parsed.title = title;
        setPaidInfo(parsed);
      } catch (e) {
        console.error("Failed to parse:", e);
      }
    }
    setPackageName(pkg);
  }, [mounted]);

  const getAnalysisData = () => {
    return {
      nameAnalysis: paidInfo?.name || "분석 완료",
      wealthLuck: paidInfo?.wealthLuck || "분석 완료",
      loveLuck: paidInfo?.loveLuck || "분석 완료",
      yearlyLuck: paidInfo?.yearlyLuck || "분석 완료",
      monthlyLuck: paidInfo?.monthlyLuck || "분석 완료",
      healthLuck: paidInfo?.healthLuck || "분석 완료",
      couple: paidInfo?.couple || "분석 완료",
      fullAnalysis: paidInfo?.fullAnalysis || paidInfo?.analysis || "분석 완료",
    };
  };

  const getAnalysisAnswer = () => {
    const category = sessionStorage?.getItem?.("analysisCategory") || "💰 돈";
    const title = sessionStorage?.getItem?.("analysisTitle") || "돈은 벌지만 자산은 안 늘어남";
    const key = `${category}-${title}`;
    return analysisAnswers[key] || "당신의 개인화된 비법이 여기에 공개됩니다.";
  };

  const getDisplayItems = () => {
    const data = getAnalysisData();
    let apiItems = [];
    let templateItems = [];

    switch(packageName) {
      case "기본 분석":
        templateItems = [
          { key: "yearlyLuck", label: "☀️ 올해 운세", value: data.yearlyLuck },
          { key: "monthlyLuck", label: "🌙 월별 운세", value: data.monthlyLuck }
        ];
        break;
      case "베이직":
        apiItems = [
          { key: "wealthLuck", label: "💎 재물운", value: data.wealthLuck },
          { key: "loveLuck", label: "💕 연애운", value: data.loveLuck }
        ];
        templateItems = [
          { key: "yearlyLuck", label: "☀️ 올해 운세", value: data.yearlyLuck },
          { key: "monthlyLuck", label: "🌙 월별 운세", value: data.monthlyLuck }
        ];
        break;
      case "프리미엄":
        apiItems = [
          { key: "wealthLuck", label: "💎 재물운", value: data.wealthLuck },
          { key: "loveLuck", label: "💕 연애운", value: data.loveLuck },
          { key: "healthLuck", label: "🌿 건강운", value: data.healthLuck }
        ];
        templateItems = [
          { key: "yearlyLuck", label: "☀️ 올해 운세", value: data.yearlyLuck },
          { key: "monthlyLuck", label: "🌙 월별 운세", value: data.monthlyLuck }
        ];
        break;
      case "VIP 커플팩":
        apiItems = [
          { key: "nameAnalysis", label: "📝 이름분석", value: data.nameAnalysis },
          { key: "wealthLuck", label: "💎 재물운", value: data.wealthLuck },
          { key: "loveLuck", label: "💕 연애운", value: data.loveLuck },
          { key: "healthLuck", label: "🌿 건강운", value: data.healthLuck },
          { key: "couple", label: "👫 궁합분석", value: data.couple }
        ];
        templateItems = [
          { key: "yearlyLuck", label: "☀️ 올해 운세", value: data.yearlyLuck },
          { key: "monthlyLuck", label: "🌙 월별 운세", value: data.monthlyLuck },
          { key: "fullAnalysis", label: "🎋 전체 사주분석", value: data.fullAnalysis }
        ];
        break;
      default:
        templateItems = [
          { key: "yearlyLuck", label: "☀️ 올해 운세", value: data.yearlyLuck },
          { key: "monthlyLuck", label: "🌙 월별 운세", value: data.monthlyLuck }
        ];
    }

    return { apiItems, templateItems };
  };

  const generateImage = async (title: string, content: string): Promise<string> => {
    const container = document.createElement("div");
    container.style.width = "800px";
    container.style.padding = "40px";
    container.style.background = "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)";
    container.style.borderRadius = "12px";
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";

    container.innerHTML = `
      <h2 style="font-size: 28px; font-weight: 900; color: #FF6B6B; margin: 0 0 15px 0; border-bottom: 3px solid #FF6B6B; padding-bottom: 8px;">
        ${title}
      </h2>
      <p style="font-size: 18px; font-weight: 700; color: #333; margin: 0; line-height: 2; white-space: pre-wrap; word-break: keep-all;">
        ${content}
      </p>
    `;

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#fff9e6",
        allowTaint: true
      });
      document.body.removeChild(container);
      return canvas.toDataURL("image/png");
    } catch (error) {
      document.body.removeChild(container);
      throw error;
    }
  };

  const handleDownload = async () => {
    if (!paidInfo) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    setIsGenerating(true);

    try {
      const { apiItems, templateItems } = getDisplayItems();
      const answerContent = getAnalysisAnswer();
      const zip = new JSZip();

      // 당신의 변화 이미지
      const changeImg = await generateImage("🔮 당신의 변화", answerContent);
      const changeBlob = await fetch(changeImg).then(r => r.blob());
      zip.file("01_당신의_변화.png", changeBlob);

      // API 아이템 이미지들
      for (let i = 0; i < apiItems.length; i++) {
        const img = await generateImage(apiItems[i].label, apiItems[i].value);
        const blob = await fetch(img).then(r => r.blob());
        zip.file(`${String(i + 2).padStart(2, '0')}_${apiItems[i].label.replace(/\//g, '_')}.png`, blob);
      }

      // 템플릿 아이템 이미지들
      for (let i = 0; i < templateItems.length; i++) {
        const img = await generateImage(templateItems[i].label, templateItems[i].value);
        const blob = await fetch(img).then(r => r.blob());
        zip.file(`${String(apiItems.length + i + 2).padStart(2, '0')}_${templateItems[i].label.replace(/\//g, '_')}.png`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `점운_${paidInfo.name}_${packageName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("이미지가 ZIP 파일로 다운로드되었습니다!");
    } catch (error) {
      console.error("이미지 생성 에러:", error);
      alert("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>로딩 중...</div>
      </main>
    );
  }

  const { apiItems, templateItems } = getDisplayItems();
  const answerContent = getAnalysisAnswer();
  const totalCount = packageName === "기본 분석" ? 2 : packageName === "베이직" ? 4 : packageName === "프리미엄" ? 5 : packageName === "VIP 커플팩" ? 8 : 2;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fffacd 0%, #ffffe0 100%)",
        color: "#333",
        fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: isMobile ? "40px 16px" : "40px 16px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 70, marginBottom: 16, filter: "brightness(0.9)" }}>🔮</div>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 36px)",
                fontWeight: 900,
                marginBottom: 30,
                color: "#1a1a1a",
                marginTop: 0,
              }}
            >
              점운
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#555",
                fontWeight: 700,
                margin: 0,
                marginBottom: 30,
              }}
            >
              {packageName} 패키지
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
              padding: isMobile ? 20 : 25,
              borderRadius: 12,
              marginBottom: isMobile ? 20 : 28,
              border: "2px solid rgba(255,215,0,0.6)",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 900,
                color: "#FF6B6B",
                margin: "0 0 12px 0",
                borderBottom: "2px solid #FF6B6B",
                paddingBottom: 8,
                marginTop: 0,
              }}
            >
              🔮 당신의 변화
            </h2>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#333",
                margin: 0,
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {answerContent}
            </p>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
              padding: isMobile ? 20 : 25,
              borderRadius: 12,
              marginBottom: isMobile ? 24 : 24,
              border: "2px solid rgba(139,92,246,0.4)",
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "#333",
                fontWeight: 700,
                margin: "0 0 8px 0",
              }}
            >
              📦 패키지: {packageName}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#333",
                fontWeight: 700,
                margin: 0,
              }}
            >
              ✨ {totalCount}개 운세 포함
            </p>
          </div>

          {apiItems.map((item) => (
            <div
              key={item.key}
              style={{
                background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
                padding: isMobile ? 20 : 25,
                borderRadius: 12,
                marginBottom: 16,
                border: "2px solid rgba(255,215,0,0.4)",
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#1a1a1a",
                  margin: "0 0 12px 0",
                  borderBottom: "2px solid #ffd700",
                  paddingBottom: 8,
                }}
              >
                {item.label}
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#333",
                  lineHeight: 1.8,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}

          {templateItems.map((item) => (
            <div
              key={item.key}
              style={{
                background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
                padding: isMobile ? 20 : 25,
                borderRadius: 12,
                marginBottom: 16,
                border: "2px solid rgba(255,215,0,0.4)",
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#1a1a1a",
                  margin: "0 0 12px 0",
                  borderBottom: "2px solid #ffd700",
                  paddingBottom: 8,
                }}
              >
                {item.label}
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#333",
                  lineHeight: 1.8,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}

          <div style={{ marginTop: 32 }}>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              style={{
                width: "100%",
                padding: 14,
                background: "linear-gradient(135deg, #ff1493, #ff69b4)",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontWeight: 900,
                fontSize: 15,
                cursor: isGenerating ? "not-allowed" : "pointer",
                marginBottom: 12,
                opacity: isGenerating ? 0.6 : 1,
              }}
            >
              📥 {isGenerating ? "이미지 생성 중..." : "이미지 ZIP 다운로드"}
            </button>

            <button
              onClick={() => window.location.href = "/"}
              style={{
                width: "100%",
                padding: 14,
                background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)",
                color: "#333",
                border: "2px solid rgba(139,92,246,0.6)",
                borderRadius: 10,
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              ← 홈으로
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaidAnalysisResult() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PaidAnalysisResultContent />
    </Suspense>
  );
}