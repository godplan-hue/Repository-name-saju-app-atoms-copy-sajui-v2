"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FreeAnalysis() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [usedFreeAnalysis, setUsedFreeAnalysis] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    gender: "",
    interest: ""
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (e: PopStateEvent) => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (formData.name) {
      const used = localStorage.getItem(`freeAnalysis_${formData.name}`);
      setUsedFreeAnalysis(used === "true");
    }
  }, [formData.name]);

  const birthHours = [
    { label: "자시(子時)", value: "00", time: "23:00 ~ 01:00" },
    { label: "축시(丑時)", value: "01", time: "01:00 ~ 03:00" },
    { label: "인시(寅時)", value: "02", time: "03:00 ~ 05:00" },
    { label: "묘시(卯時)", value: "03", time: "05:00 ~ 07:00" },
    { label: "진시(辰時)", value: "04", time: "07:00 ~ 09:00" },
    { label: "사시(巳時)", value: "05", time: "09:00 ~ 11:00" },
    { label: "오시(午時)", value: "06", time: "11:00 ~ 13:00" },
    { label: "미시(未時)", value: "07", time: "13:00 ~ 15:00" },
    { label: "신시(申時)", value: "08", time: "15:00 ~ 17:00" },
    { label: "유시(酉時)", value: "09", time: "17:00 ~ 19:00" },
    { label: "술시(戌時)", value: "10", time: "19:00 ~ 21:00" },
    { label: "해시(亥時)", value: "11", time: "21:00 ~ 23:00" },
    { label: "모름", value: "unknown", time: "모르는 경우" }
  ];

  const backgroundImages: { [key: number]: string } = {
    1: "url('https://images.unsplash.com/photo-1627764574958-fb54cd7d7448?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGFyb3R8ZW58MHx8MHx8fDA%3D')",
    2: "url('https://images.unsplash.com/photo-1598495494482-172d89ff078c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXlzdGljYWwlMjBhcnR8ZW58MHx8MHx8fDA%3D')",
    3: "url('https://images.unsplash.com/photo-1674598981784-947a1644b840?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNoaW5lc2UlMjBhc3Ryb2xvZ3l8ZW58MHx8MHx8fDA%3D')",
    4: "url('https://images.unsplash.com/photo-1616777103777-d11788eb26eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG9yYWNsZSUyMGNhcmRzfGVufDB8fDB8fHww')",
    5: "url('https://images.unsplash.com/photo-1621923647893-901f834b3e6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b3JhY2xlJTIwY2FyZHN8ZW58MHx8MHx8fDA%3D')",
    6: "url('https://images.unsplash.com/photo-1709141426613-27e8b5d55f13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvc21pYyUyMGRlc3Rpbnl8ZW58MHx8MHx8fDA%3D')"
  };

  const analysisTypes = [
    { category: "💰 돈", title: "돈은 벌지만 자산은 안 늘어남", insight: "월급도 나쁘지 않고 사업도 굴러가는데\n막상 통장을 보면 모인 게 없어요", hidden1: "당신에게 부족한 건 버는 능력이 아니에요\n버는 돈을 '머무르게' 하는 방법을 모르고 있을 뿐이에요\n그 방법 하나만 알면 흐름이 통째로 바뀝니다", hidden2: "올해 자산이 눈에 보이게 불어나는 시기\n지금 당장 막아야 할 새는 돈의 구멍\n월급을 자산으로 바꾸는 구체적인 순서" },
    { category: "💰 돈", title: "큰돈은 들어오는데 자꾸 사라짐", insight: "보너스든 계약금이든 한 번씩 크게 들어오는데\n이상하게 그 직후에 꼭 큰 지출이 따라와요", hidden1: "그건 우연이 아니라 당신 사주에 새겨진 흐름이에요\n돈이 들어오는 타이밍과 나가는 타이밍이 묶여있어서 그래요\n이 흐름을 한 번 끊으면 그 다음부터는 쌓이기 시작해요", hidden2: "큰돈이 들어오는 다음 시기와 정확한 달\n그 돈을 지키기 위해 미리 해둬야 할 행동\n지출의 고리를 끊는 구체적인 방법" },
    { category: "💰 돈", title: "일을 많이 해도 가난한 느낌", insight: "남들 보기엔 바쁘고 열심히 사는데\n정작 마음 한구석엔 항상 쪼들리는 느낌이 있어요", hidden1: "당신의 벌이 자체는 평균 이상이에요\n문제는 '나는 부족하다'는 믿음이 지출을 자꾸 만들어낸다는 거예요\n그 믿음의 뿌리를 알면 씀씀이가 자연스럽게 바뀝니다", hidden2: "그 불안한 믿음이 시작된 정확한 시기\n무의식적으로 새는 지출의 패턴\n진짜 풍요로움을 느끼기 시작하는 시점" },
    { category: "💕 애정", title: "짝을 못 만나고 있음", insight: "주변은 다 짝이 있는데\n나만 자꾸 혼자인 것 같아서 외로워요", hidden1: "당신이 인연이 없는 사람이라서가 아니에요\n지금까지는 인연이 들어올 시기가 아니었을 뿐이에요\n그 문이 곧 열리는 흐름이 사주에 보입니다", hidden2: "인연이 실제로 나타나는 정확한 시기\n그 사람을 만나게 될 장소나 계기의 신호\n첫 만남에서 놓치면 안 되는 포인트" },
    { category: "💕 애정", title: "만나는 사람마다 헤어짐", insight: "시작할 때는 분명 설레고 좋았는데\n이상하게 항상 비슷한 지점에서 끝이 나요", hidden1: "헤어짐이 반복된 건 당신 탓이 아니에요\n지금까지 만난 사람들이 당신 사주와 맞물리는 방향이 아니었을 뿐이에요\n맞는 방향을 알면 이번엔 다르게 흘러갑니다", hidden2: "반복된 이별의 진짜 원인이 된 패턴\n당신과 실제로 잘 맞는 사람의 구체적 특징\n이번 인연을 오래 가져가는 방법" },
    { category: "🎯 성공", title: "열심히 해도 인정받지 못함", insight: "분명 남들보다 더 많이 노력하는데\n그게 잘 안 보이는 것 같아 답답해요", hidden1: "당신의 실력은 이미 인정받을 수준을 넘었어요\n다만 그게 드러날 무대가 아직 열리지 않았을 뿐이에요\n그 무대가 머지않아 당신 앞에 펼쳐집니다", hidden2: "당신이 본격적으로 주목받는 정확한 시기\n그 전에 미리 해두면 좋은 결정적 행동\n핵심 인물에게 확실히 각인되는 방법" },
    { category: "🎯 성공", title: "꿈은 크지만 시작 용기가 없음", insight: "머릿속엔 좋은 계획이 가득한데\n막상 첫발을 떼려면 망설여져요", hidden1: "그 계획은 충분히 현실성 있는 계획이에요\n다만 두려움이 실제 위험보다 훨씬 크게 느껴지고 있을 뿐이에요\n그 두려움의 크기는 시작과 함께 줄어듭니다", hidden2: "지금 시작해야 가장 유리한 정확한 시점\n첫걸음으로 삼아야 할 구체적인 행동\n두려움이 사라지는 순간의 신호" },
    { category: "💼 사업", title: "사업 아이디어는 많은데 실행 못함", insight: "괜찮은 아이디어가 계속 떠오르는데\n실행으로 옮길 자신이 잘 안 생겨요", hidden1: "아이디어 자체는 이미 충분히 괜찮은 수준이에요\n지금까지는 실행하기에 맞는 여건이 아니었을 뿐이에요\n지금이 바로 그 여건이 갖춰지는 시점입니다", hidden2: "실행으로 옮기기에 가장 유리한 정확한 시점\n지금 아이디어 중 가장 성공 가능성 높은 형태\n무리하지 않고 안정적으로 시작하는 순서" },
    { category: "💼 사업", title: "사업해봤는데 망함", insight: "한 번 시작했다가 실패한 경험이 있어서\n다시 시도할 자신감이 잘 안 생겨요", hidden1: "그 실패는 당신의 능력 부족이 아니었어요\n시점과 조건이 그때는 맞지 않았을 뿐이에요\n이번엔 그 조건이 당신에게 유리하게 바뀝니다", hidden2: "지난 실패의 진짜 원인이 된 한 가지 요소\n이번에 성공하려면 반드시 갖춰야 할 조건\n다시 시작해도 좋은 정확한 시기" },
    { category: "💍 결혼", title: "결혼하고 싶은데 상대가 없음", insight: "결혼은 하고 싶은데\n연애 자체가 잘 시작되지 않아서 답답해요", hidden1: "당신은 결혼할 준비가 이미 충분히 되어 있는 사람이에요\n지금 비어있는 건 사람 한 명뿐이에요\n그 사람이 들어오는 흐름이 머지않아 시작됩니다", hidden2: "그 사람을 만나게 되는 정확한 시기\n결혼까지 이어지는 구체적인 흐름\n좋은 인연을 알아보는 신호" },
    { category: "🏢 직장", title: "열심히 일해도 승진이 안 됨", insight: "성과는 분명히 냈다고 생각하는데\n자리는 늘 그대로인 것 같아요", hidden1: "당신의 실력은 이미 그 자리를 넘어선 수준이에요\n다만 그 실력이 드러날 무대가 아직 오지 않았을 뿐이에요\n그 무대가 곧 당신 앞에 열립니다", hidden2: "승진의 문이 실제로 열리는 정확한 시기\n그 전에 보여줘야 할 결정적인 행동 한 가지\n윗사람에게 확실히 각인되는 방법" },
    { category: "🏢 직장", title: "이직을 고민만 하고 있음", insight: "지금 자리가 답답한 건 맞는데\n막상 옮기려니 용기가 잘 안 나요", hidden1: "그 답답함은 당신이 약해서가 아니에요\n지금 자리가 당신의 그릇에 비해 작을 뿐이에요\n더 맞는 자리가 이미 당신 쪽으로 움직이고 있어요", hidden2: "이직을 결심해도 좋은 정확한 시기\n놓치면 아까운 제안이 들어오는 신호\n새 자리에서 빠르게 자리잡는 방법" },
    { category: "👶 자녀", title: "아이 문제로 마음이 무거움", insight: "겉으론 괜찮은 척하지만\n속으론 아이 걱정이 계속 떠나지 않아요", hidden1: "그 걱정은 부모라면 누구나 갖는 자연스러운 마음이에요\n다만 지금 아이에게 필요한 건 조금 다른 방식의 관심이에요\n그 방식을 알면 마음이 한결 가벼워집니다", hidden2: "아이와의 관계가 풀리기 시작하는 시기\n지금 아이에게 가장 필요한 한 마디\n부모와 아이 모두 편해지는 구체적인 방법" },
    { category: "👶 자녀", title: "아이의 미래가 자꾸 걸림", insight: "자꾸 남들 아이와 비교하게 되고\n괜히 불안한 마음이 들 때가 많아요", hidden1: "아이는 이미 자기만의 속도로 잘 자라고 있어요\n다만 그 속도가 남들과 다르게 보일 뿐이에요\n그 속도를 알아보는 눈이 지금 당신에게 필요해요", hidden2: "아이의 재능이 눈에 띄게 드러나는 시기\n비교를 멈추고 믿어줘야 하는 신호\n아이와 부모가 함께 성장하는 방법" },
    { category: "📖 학업", title: "노력한 만큼 성적이 안 나옴", insight: "공부하는 시간은 분명히 늘었는데\n결과는 제자리에 머물러 있는 것 같아요", hidden1: "그동안의 노력은 절대 사라지지 않았어요\n다만 지금 방식이 당신에게 잘 맞지 않을 뿐이에요\n맞는 방식으로 바꾸면 결과가 곧 따라옵니다", hidden2: "성적이 눈에 띄게 오르기 시작하는 시기\n지금 바꿔야 할 학습 방식 한 가지\n끝까지 집중력을 유지하는 구체적인 방법" },
    { category: "📖 학업", title: "시험이나 합격 앞에서 불안함", insight: "준비는 충분히 한 것 같은데\n결과를 생각하면 자꾸 불안해져요", hidden1: "그 불안은 잘하고 싶은 마음이 큰 만큼 생기는 거예요\n당신의 준비는 이미 충분한 수준에 와 있어요\n지금 필요한 건 그 마음을 가라앉히는 일뿐이에요", hidden2: "합격운이 가장 강하게 작용하는 정확한 시점\n시험 전 마음을 다잡는 구체적인 방법\n끝까지 흔들리지 않고 가는 비결" },
    { category: "💪 건강", title: "이유 없이 자꾸 피곤함", insight: "특별히 무리한 것도 없는데\n몸이 늘 무겁고 개운한 날이 별로 없어요", hidden1: "그 피로는 게을러서 생기는 게 아니에요\n당신 사주에서 특정 부위에 에너지가 쉽게 새는 흐름이 있을 뿐이에요\n그 부위를 알고 채워주면 컨디션이 눈에 띄게 달라집니다", hidden2: "에너지가 가장 약해지는 정확한 시기와 부위\n지금 바로 보강해야 할 생활 습관 한 가지\n몸이 가벼워지는 변화가 시작되는 시점" },
    { category: "💪 건강", title: "병원 가면 괜찮다는데 계속 불편함", insight: "검사를 해도 별다른 이상은 없다는데\n몸은 계속 어딘가 불편한 느낌이 들어요", hidden1: "수치로는 안 보이지만 사주상으로는 분명한 신호가 있어요\n몸이 아니라 그 부위와 연결된 마음의 피로일 수 있어요\n그 연결을 알면 불편함의 진짜 이유가 보입니다", hidden2: "그 불편함의 사주상 진짜 원인\n증상이 가벼워지기 시작하는 시기\n몸과 마음을 함께 회복하는 방법" },
    { category: "💰 돈", title: "투자만 하면 항상 타이밍이 안 좋음", insight: "남들 들어갈 때 빠지고\n내가 들어가면 항상 꺾이는 느낌이에요", hidden1: "그건 운이 없어서가 아니라 당신의 결정 타이밍에 흐름이 있어서예요\n지금까지는 그 타이밍을 거꾸로 타고 있었을 뿐이에요\n타이밍을 알면 같은 판단도 결과가 달라집니다", hidden2: "당신에게 유리한 투자 타이밍의 흐름\n특히 조심해야 할 시기와 신호\n결정을 내리기 전 꼭 확인할 한 가지" },
    { category: "💰 돈", title: "남보다 늦게 돈이 모이는 것 같음", insight: "친구들은 하나둘 자리 잡아가는데\n나는 항상 한 발 늦는 것 같아요", hidden1: "당신은 늦은 게 아니라 다른 속도로 쌓이는 사주예요\n초반엔 더디지만 후반에 크게 모이는 흐름이 있어요\n그 흐름을 알면 지금의 더딤이 더 이상 불안하지 않습니다", hidden2: "재물이 본격적으로 쌓이기 시작하는 시기\n지금 해두면 그 시기에 크게 도움 되는 준비\n속도보다 중요한 방향의 신호" },
    { category: "💕 애정", title: "마음에 둔 사람이 있는데 다가가기 어려움", insight: "이 사람이다 싶은 사람이 있는데\n막상 다가가려면 자꾸 망설여져요", hidden1: "그 망설임은 거절이 두려운 게 아니라 신중한 성격 때문이에요\n다만 지금은 신중함보다 먼저 다가가야 하는 시기예요\n타이밍을 놓치면 아쉬움이 오래 남습니다", hidden2: "다가가기에 가장 좋은 정확한 시점\n그 사람의 마음을 확인할 수 있는 신호\n관계를 시작하는 구체적인 첫마디" },
    { category: "💕 애정", title: "권태기처럼 마음이 식은 것 같음", insight: "예전 같은 설렘이 없어서\n이 관계가 맞는 건지 헷갈려요", hidden1: "설렘이 줄어든 건 사랑이 끝나서가 아니라 관계가 다음 단계로 넘어가는 신호예요\n다만 지금 그 신호를 잘못 해석하면 진짜 위기가 됩니다\n제대로 읽으면 관계가 더 단단해질 시기예요", hidden2: "관계가 다시 따뜻해지는 정확한 시기\n지금 두 사람에게 필요한 한 가지 변화\n권태기를 넘기는 구체적인 방법" },
    { category: "🎯 성공", title: "남들보다 늦게 빛을 보는 느낌", insight: "같은 출발선이었던 사람들은 앞서가는데\n나는 아직 제자리인 것 같아요", hidden1: "당신은 늦은 게 아니라 늦게 터지는 사주예요\n초반에 쌓는 시간이 길수록 한 번 터질 때 크게 터집니다\n그 터지는 시점이 머지않아 옵니다", hidden2: "본격적으로 빛을 보기 시작하는 정확한 시기\n그 전에 반드시 채워둬야 할 준비\n주변에서 당신을 다시 보게 되는 신호" },
    { category: "🎯 성공", title: "성공은 했는데 허전함이 큼", insight: "원하던 걸 이뤘는데\n생각보다 마음이 채워지지 않아요", hidden1: "그 허전함은 실패가 아니라 다음 단계로 넘어갈 준비가 됐다는 신호예요\n지금 이룬 것은 끝이 아니라 더 큰 흐름의 시작점이에요\n그 다음 흐름을 알면 허전함이 방향으로 바뀝니다", hidden2: "다음 목표가 명확해지는 정확한 시기\n지금 허전함의 진짜 원인\n진짜 만족을 채우는 구체적인 방향" },
    { category: "💼 사업", title: "동업자와 자꾸 의견이 부딫힘", insight: "같은 목표인데\n방향만 얘기하면 자꾸 부딫혀요", hidden1: "그 갈등은 사이가 안 좋아서가 아니라 두 사람의 흐름이 서로 다른 시기에 있어서예요\n한 사람이 맞춰야 할 시기가 곧 옵니다\n그 시기를 알면 갈등이 자연스럽게 줄어듭니다", hidden2: "갈등이 풀리기 시작하는 정확한 시기\n지금 먼저 양보해야 할 부분\n동업이 안정되는 구체적인 신호" },
    { category: "💼 사업", title: "매출은 있는데 마음이 늘 불안함", insight: "숫자로 보면 나쁘지 않은데\n마음은 항상 불안하고 초조해요", hidden1: "그 불안은 숫자 때문이 아니라 다음 흐름이 안 보여서 생기는 거예요\n당신 사주에는 분명한 상승 구간이 예정돼 있어요\n그 구간을 알면 지금의 불안이 한결 가벼워집니다", hidden2: "매출이 본격적으로 상승하는 정확한 시기\n지금 정리해두면 좋은 약점 한 가지\n마음이 편해지는 시점의 신호" },
    { category: "💍 결혼", title: "결혼은 했는데 자꾸 다투게 됨", insight: "서로 사랑해서 결혼했는데\n요즘 들어 부딫히는 일이 늘었어요", hidden1: "그 다툼은 사랑이 줄어서가 아니라 두 사람의 생활 흐름이 어긋나 있어서예요\n흐름이 다시 맞춰지는 시기가 곧 옵니다\n그때까지 버티는 방법을 알면 한결 수월해집니다", hidden2: "흐름이 다시 맞아지는 정확한 시기\n지금 먼저 풀어야 할 갈등의 핵심\n관계가 다시 편해지는 신호" },
    { category: "💍 결혼", title: "상대 가족과의 관계가 부담스러움", insight: "결혼 자체는 좋은데\n양가 문제만 생각하면 마음이 무거워져요", hidden1: "그 부담은 당신이 부족해서가 아니라 아직 서로 익숙해지는 시간이 더 필요해서예요\n시간이 지나면 자연스럽게 풀리는 흐름이 사주에 보입니다\n지금 조급해하지 않는 게 가장 중요해요", hidden2: "관계가 편해지기 시작하는 정확한 시기\n지금 거리를 두면 좋은 부분\n양가 관계가 안정되는 신호" },
    { category: "🏢 직장", title: "상사와의 관계가 너무 힘듦", insight: "일은 할 만한데\n상사 때문에 매일이 스트레스예요", hidden1: "그 마찰은 당신의 잘못이 아니라 두 사람의 기질이 부딫히는 시기일 뿐이에요\n이 시기는 길게 가지 않고 곧 바뀌는 흐름이 보입니다\n그때까지 버티는 요령을 알면 훨씬 수월해집니다", hidden2: "그 관계가 풀리거나 바뀌는 정확한 시기\n지금 당장 줄여야 할 마찰의 포인트\n스트레스 없이 버티는 구체적인 방법" },
    { category: "🏢 직장", title: "지금 하는 일이 나와 안 맞는 것 같음", insight: "월급 때문에 다니긴 하는데\n이 일이 내 길이 맞나 자꾸 헷갈려요", hidden1: "그 의문은 적성이 없어서가 아니라 진짜 길이 따로 있다는 신호예요\n지금 일은 그 길로 가기 전 거쳐가는 과정일 수 있어요\n그 진짜 길이 보이는 시기가 머지않았습니다", hidden2: "당신에게 맞는 진짜 방향이 보이는 시기\n지금 일에서 챙겨야 할 경험 한 가지\n전환을 준비해야 할 신호" },
    { category: "👶 자녀", title: "아이와 대화가 점점 줄어듦", insight: "예전엔 이것저것 얘기했는데\n요즘은 대화가 점점 짧아져요", hidden1: "그건 사이가 멀어진 게 아니라 아이가 자기만의 시간이 필요한 시기에 들어선 거예요\n다가가는 방식을 조금만 바꾸면 다시 마음을 열어줍니다\n그 방식을 알면 관계가 다시 가까워집니다", hidden2: "아이가 다시 마음을 여는 정확한 시기\n지금 시도하면 좋은 대화 방식\n부모와 아이가 가까워지는 신호" },
    { category: "👶 자녀", title: "아이가 진로를 못 정해서 답답함", insight: "이제 정해야 할 시기인데\n아이가 계속 갈팡질팡해요", hidden1: "그건 아이가 게을러서가 아니라 아직 자기 강점을 못 찾았을 뿐이에요\n아이 사주에는 분명히 두드러지는 재능의 방향이 있어요\n그 방향을 알면 진로 고민이 훨씬 가벼워집니다", hidden2: "아이의 재능이 뚜렷하게 드러나는 시기\n지금 부모가 짚어줘야 할 방향\n아이가 스스로 결정하게 되는 신호" },
    { category: "📖 학업", title: "공부는 하는데 동기부여가 안 됨", insight: "해야 하는 건 아는데\n막상 책상에 앉으면 마음이 안 잡혀요", hidden1: "그건 의지가 약해서가 아니라 지금 목표가 흐릿해서 생기는 현상이에요\n목표가 또렷해지는 시기가 곧 오고 있어요\n그 시기를 알면 동기부여가 자연스럽게 살아납니다", hidden2: "목표가 다시 또렷해지는 정확한 시기\n지금 집중력을 끌어올리는 구체적인 방법\n동기부여가 살아나는 신호" },
    { category: "📖 학업", title: "전공이나 진로 선택이 고민됨", insight: "선택은 해야 하는데\n어느 쪽이 맞는지 확신이 안 서요", hidden1: "그 망설임은 우유부단해서가 아니라 두 길 모두 가능성이 있어서예요\n다만 당신 사주에는 더 유리하게 작동하는 방향이 분명히 있어요\n그 방향을 알면 선택이 훨씬 가벼워집니다", hidden2: "당신에게 더 유리한 방향이 드러나는 시기\n선택 전 확인해야 할 신호\n선택 후 후회 없이 가는 방법" },
    { category: "💪 건강", title: "스트레스가 몸으로 자꾸 나타남", insight: "마음만 힘든 게 아니라\n몸에도 자꾸 증상이 나타나요", hidden1: "그건 약해서가 아니라 당신 사주에서 스트레스가 특정 부위로 모이는 흐름이 있어서예요\n그 부위를 알고 미리 관리하면 증상이 훨씬 줄어듭니다\n몸과 마음이 같이 회복되는 시기가 오고 있어요", hidden2: "스트레스가 모이는 정확한 부위\n증상이 줄어들기 시작하는 시기\n몸과 마음을 함께 다스리는 방법" },
    { category: "💰 돈", title: "부수입을 만들고 싶은데 뭘 해야할지 모름", insight: "월급 외에 뭔가 더 해보고 싶은데\n뭘 해야 할지 막막해요", hidden1: "당신 사주에는 부수입에 유리한 재능의 방향이 따로 있어요\n지금까지는 그 방향을 못 찾았을 뿐이에요\n방향을 알면 작게 시작해도 결과가 다릅니다", hidden2: "당신에게 유리한 부수입의 구체적 방향\n시작하기 좋은 정확한 시기\n작게 시작해서 키우는 방법" },
    { category: "💕 애정", title: "재회를 생각하고 있음", insight: "헤어졌는데\n그 사람이 자꾸 생각나서 흔들려요", hidden1: "그 마음이 드는 데는 사주상 분명한 이유가 있어요\n다만 재회가 좋은 선택인지는 당신 사주의 흐름에 따라 달라요\n그 흐름을 알면 흔들리는 마음이 정리됩니다", hidden2: "재회가 실제로 가능한지에 대한 흐름\n재회한다면 가장 유리한 시기\n같은 실수를 반복하지 않는 방법" },
    { category: "🎯 성공", title: "주변의 기대가 부담스러움", insight: "잘할 거라는 기대를 많이 받는데\n그게 오히려 부담으로 느껴져요", hidden1: "그 부담은 당신이 약해서가 아니라 기대에 맞는 결과를 내는 시기가 따로 있어서예요\n지금은 그 시기로 가는 과정일 뿐이에요\n시기를 알면 부담이 압박이 아니라 동력이 됩니다", hidden2: "기대에 부응하는 결과가 나오는 시기\n지금 부담을 줄이는 구체적인 방법\n주변의 기대가 응원으로 바뀌는 신호" },
    { category: "💼 사업", title: "확장을 해야 할지 유지를 해야 할지 고민됨", insight: "지금보다 키우고 싶은데\n무리하는 건 아닌지 계속 고민돼요", hidden1: "그 고민은 욕심이 아니라 신중한 판단력이에요\n다만 당신 사주에는 확장에 유리한 명확한 시기가 있어요\n그 시기 전후로 판단을 나누면 훨씬 안전합니다", hidden2: "확장하기에 가장 안전한 정확한 시기\n지금 갖춰야 할 조건 한 가지\n무리 없이 키워가는 순서" },
    { category: "💍 결혼", title: "프러포즈나 결혼 시기를 못 정함", insight: "결혼할 사람이라는 확신은 있는데\n언제가 좋을지 시기를 못 정하고 있어요", hidden1: "그 망설임은 확신이 부족해서가 아니라 가장 좋은 시기를 본능적으로 기다리는 거예요\n당신 사주에는 결혼에 특히 유리한 시기가 따로 있어요\n그 시기를 알면 결정이 훨씬 쉬워집니다", hidden2: "결혼에 가장 유리한 정확한 시기\n프러포즈 전 챙겨야 할 준비\n오래가는 결혼의 시작점" },
    { category: "🏢 직장", title: "창업이나 독립을 고민하고 있음", insight: "회사를 나가서 내 일을 해보고 싶은데\n타이밍을 모르겠어요", hidden1: "그 고민은 무모해서가 아니라 독립에 유리한 시기를 본능적으로 기다리는 거예요\n당신 사주에는 독립이 유리하게 작동하는 시기가 분명히 있어요\n그 시기를 알면 결정이 훨씬 안전해집니다", hidden2: "독립하기에 가장 유리한 정확한 시기\n그 전에 갖춰야 할 최소한의 준비\n안정적으로 자리잡는 방법" },
    { category: "👶 자녀", title: "사춘기 자녀와 부딫히는 일이 많음", insight: "예전엔 순했던 아이가\n요즘은 자꾸 부딫히고 반항해요", hidden1: "그건 아이가 나빠진 게 아니라 자기 정체성을 찾아가는 자연스러운 과정이에요\n지금 방식으로 부딫히면 거리가 더 멀어질 수 있어요\n다른 접근 방식을 알면 갈등이 빠르게 줄어듭니다", hidden2: "갈등이 줄어들기 시작하는 시기\n지금 시도하면 좋은 접근 방식\n사춘기를 잘 넘기는 부모의 자세" },
    { category: "📖 학업", title: "유학이나 큰 도전을 고민하고 있음", insight: "더 큰 무대로 가고 싶은데\n확신이 안 서서 계속 미루고 있어요", hidden1: "그 망설임은 능력 부족이 아니라 큰 결정 앞에서 누구나 갖는 두려움이에요\n당신 사주에는 그 도전이 유리하게 작동하는 시기가 보입니다\n시기를 알면 망설임이 확신으로 바뀝니다", hidden2: "도전하기에 가장 유리한 정확한 시기\n떠나기 전 반드시 준비해둘 것\n새로운 곳에서 빠르게 자리잡는 방법" },
    { category: "💪 건강", title: "수면 문제로 계속 피곤함", insight: "잠을 자도 푹 잔 느낌이 없고\n낮에도 계속 피곤해요", hidden1: "그건 단순히 체력 문제가 아니라 당신 사주에서 마음이 쉬지 못하는 흐름이 있어서예요\n생각이 많은 시기일수록 잠이 얕아지는 경향이 있어요\n그 흐름을 알면 수면의 질이 달라집니다", hidden2: "마음이 안정되며 잠이 깊어지는 시기\n지금 바꾸면 좋은 저녁 습관 한 가지\n피로가 풀리기 시작하는 신호" },
    { category: "💰 돈", title: "빚이나 대출 때문에 마음이 무거움", insight: "갚아야 할 게 있다는 게\n항상 마음 한구석을 무겁게 눌러요", hidden1: "그 무게는 능력이 없어서가 아니라 지금이 정리의 시기이기 때문이에요\n당신 사주에는 부담이 가벼워지는 흐름이 분명히 보입니다\n그 흐름을 알면 지금의 무게가 견딜만해집니다", hidden2: "부담이 본격적으로 가벼워지는 시기\n지금 우선적으로 정리해야 할 부분\n돈 흐름이 안정되는 신호" },
    { category: "🎯 성공", title: "번아웃이 와서 의욕이 없음", insight: "예전엔 열정 넘쳤는데\n요즘은 뭘 해도 의욕이 안 생겨요", hidden1: "그건 게을러진 게 아니라 너무 오래 같은 방향으로 달려와서 생긴 자연스러운 신호예요\n지금은 잠시 멈추고 방향을 다시 점검할 시기예요\n그 점검이 끝나면 더 강한 의욕이 돌아옵니다", hidden2: "의욕이 다시 살아나는 정확한 시기\n지금 꼭 쉬어야 하는 이유\n번아웃 없이 오래 가는 방법" },
    { category: "💼 사업", title: "직원이나 거래처와의 신뢰 문제로 고민됨", insight: "믿고 맡겼는데\n결과가 기대와 달라서 자꾸 마음이 상해요", hidden1: "그 실망은 사람을 잘못 본 게 아니라 서로 신뢰를 쌓는 시기를 지나는 중이에요\n당신 사주에는 좋은 사람을 알아보는 안목이 강하게 작동하는 시기가 있어요\n그 시기를 알면 사람 문제가 훨씬 줄어듭니다", hidden2: "신뢰할 사람을 알아보는 안목이 강해지는 시기\n지금 거리를 둬야 할 신호\n믿을 사람과 오래 가는 방법" },
    { category: "💍 결혼", title: "비혼을 고민하고 있음", insight: "결혼이 꼭 필요한지\n요즘 자꾸 의문이 들어요", hidden1: "그 의문은 잘못된 게 아니라 당신만의 답을 찾아가는 과정이에요\n다만 당신 사주에는 결혼이 유리하게 작동하는 흐름도 분명히 존재해요\n그 흐름을 알면 더 확신 있는 선택을 할 수 있습니다", hidden2: "당신에게 맞는 삶의 방향이 또렷해지는 시기\n결혼이 유리하게 작동하는 조건\n어떤 선택이든 후회 없이 가는 방법" },
    { category: "🏢 직장", title: "회사에서 입지가 점점 좁아지는 느낌", insight: "예전엔 내 자리가 분명했는데\n요즘은 점점 위치가 애매해지는 것 같아요", hidden1: "그건 능력이 떨어진 게 아니라 조직 안의 흐름이 바뀌는 과도기일 뿐이에요\n당신 사주에는 다시 입지를 단단히 다지는 시기가 보입니다\n그 시기를 알면 지금의 불안이 훨씬 가벼워집니다", hidden2: "입지가 다시 단단해지는 정확한 시기\n지금 보여줘야 할 결정적인 모습\n신뢰를 회복하는 구체적인 방법" },
    { category: "👶 자녀", title: "임신이나 출산 시기를 고민하고 있음", insight: "아이는 갖고 싶은데\n지금이 맞는 시기인지 계속 고민돼요", hidden1: "그 고민은 망설임이 아니라 신중하게 준비하는 마음이에요\n당신 사주에는 특히 순조로운 흐름이 작동하는 시기가 따로 있어요\n그 시기를 알면 결정이 훨씬 편안해집니다", hidden2: "가장 순조로운 정확한 시기\n그 전에 미리 준비해두면 좋은 것\n마음이 편안해지는 신호" },
  ];

  const getAnalysisType = () => {
    const fullData = formData.name + formData.birthYear + formData.birthMonth + formData.birthDay;
    let hash = 0;
    
    for (let i = 0; i < fullData.length; i++) {
      hash += fullData.charCodeAt(i);
    }
    
    hash += (parseInt(formData.birthMonth) * 7);
    hash += (parseInt(formData.birthDay) * 13);
    hash += (parseInt(formData.birthYear) * 3);

    // 사용자가 "지금 가장 궁금한 것"을 선택했으면, 그 카테고리 안에서만 매칭
    // (예: 돈이 궁금하다고 선택하면 돈 관련 질문/답변만 나오도록)
    const pool = formData.interest
      ? analysisTypes.filter(t => t.category === formData.interest)
      : analysisTypes;
    const target = pool.length > 0 ? pool : analysisTypes;

    return target[Math.abs(hash) % target.length];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const phoneOnly = value.replace(/[^0-9]/g, "");
      let formatted = phoneOnly;
      if (phoneOnly.length > 3 && phoneOnly.length <= 7) {
        formatted = phoneOnly.slice(0, 3) + "-" + phoneOnly.slice(3);
      } else if (phoneOnly.length > 7) {
        formatted = phoneOnly.slice(0, 3) + "-" + phoneOnly.slice(3, 7) + "-" + phoneOnly.slice(7, 11);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = () => {
    const currentStepData = {
      1: formData.name,
      2: formData.gender,
      3: formData.birthYear && formData.birthMonth && formData.birthDay,
      4: formData.birthHour,
      5: formData.email,
      6: formData.phone
    };

    if (!currentStepData[step as keyof typeof currentStepData]) {
      alert("정보를 입력해주세요");
      return;
    }

    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAnalyze = async () => {
    if (!formData.phone.trim()) {
      alert("전화번호를 입력해주세요");
      return;
    }

    if (usedFreeAnalysis) {
      alert(`❌ ${formData.name}님은 이미 무료 분석을 사용하셨습니다.\n\n유료 분석을 결제해주세요.`);
      return;
    }

    const selectedType = getAnalysisType();
    sessionStorage.setItem("analysisCategory", selectedType.category);
    sessionStorage.setItem("analysisTitle", selectedType.title);

    setAnalyzing(true);
    setStep(7);
    localStorage.setItem(`freeAnalysis_${formData.name}`, "true");
    setUsedFreeAnalysis(true);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
          birthHour: formData.birthHour,
          gender: formData.gender,
          planType: "free"
        }),
      });

      if (!response.ok) {
        let errorMessage = "분석 중 오류가 발생했습니다.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const textError = await response.text();
          errorMessage = textError || response.statusText;
        }
        alert(errorMessage);
        setAnalyzing(false);
        setStep(6);
        return;
      }

      const data = await response.json();
      setAnalysisResult(data.result);
      setAnalyzing(false);
    } catch (error) {
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(error);
      setAnalyzing(false);
      setStep(6);
    }
  };

  const handleShare = () => {
    const birthHourLabel = birthHours.find(h => h.value === formData.birthHour)?.label || '모름';
    const shareUrl = typeof window !== 'undefined' ? window.location.origin + "/free-analysis" : "/free-analysis";
    const shareText = `${formData.name}님의 무료 사주 분석 결과 🔮\n\n이름: ${formData.name}\n생년월일: ${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}\n생시: ${birthHourLabel}\n\n📱 나도 무료 사주 분석 받아보기!\n점운 - 무료 사주 분석`;
    const shareTextWithUrl = `${shareText}\n\n${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: "무료 사주 분석",
        text: shareText,
        url: shareUrl,
      }).catch(err => console.log('Share error:', err));
    } else {
      navigator.clipboard.writeText(shareTextWithUrl).then(() => {
        alert("✅ 공유 내용이 복사되었습니다!\n\n" + shareTextWithUrl);
      }).catch(() => {
        alert(shareTextWithUrl);
      });
    }
  };

  const handleDownloadPDF = () => {
    alert("📄 PDF 저장은 유료 분석에서 가능합니다.\n\n기본(₩9,900)을 결제하세요.");
  };

  const handleGoToPayment = () => {
    if (analysisResult) {
      const selectedType = getAnalysisType();
      sessionStorage.setItem("analysisResult", JSON.stringify(analysisResult));
      sessionStorage.setItem("analysisName", formData.name);
      sessionStorage.setItem("analysisCategory", selectedType.category);
      sessionStorage.setItem("analysisTitle", selectedType.title);
    }
    router.push("/payment");
  };

  const handleResetAnalysis = () => {
    setStep(1);
    setFormData({
      name: "",
      email: "",
      phone: "",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      birthHour: "",
      gender: "",
      interest: ""
    });
    setUsedFreeAnalysis(false);
    setAnalyzing(false);
    setAnalysisResult(null);
  };

  if (!mounted) return null;

  if (usedFreeAnalysis && step === 1 && formData.name) {
    return (
      <>
        <Head>
          <meta name="google" content="notranslate" />
          <meta httpEquiv="Content-Language" content="ko-KR" />
        </Head>
        <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #d97706 100%)", color: "white", padding: "40px 20px", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20, marginTop: 0 }}>✅ 무료 분석 완료!</h1>
            <p style={{ fontSize: isMobile ? 14 : 18, marginBottom: 30, lineHeight: 1.2, marginTop: 0, wordBreak: "keep-all", whiteSpace: "pre-wrap" }}>{`${formData.name}님은 이미 무료 분석을 사용하셨습니다.\n\n다른 이름으로는 분석 가능합니다.\n더 자세한 분석을 원하신다면\n유료 분석을 결제해주세요.`}</p>
            <button onClick={() => router.push("/payment")} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: "pointer", marginBottom: 12 }}>💳 유료 분석 결제하기</button>
            <button onClick={handleResetAnalysis} style={{ width: "100%", padding: 16, background: "rgba(255, 255, 255, 0.2)", color: "white", border: "2px solid white", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: "pointer" }}>🔄 다른 이름으로 분석</button>
          </div>
        </main>
      </>
    );
  }

  if (step === 7) {
    const result = analysisResult || { name: "분석 완료", wealthLuck: "분석 완료", loveLuck: "분석 완료", healthLuck: "분석 완료", couple: "분석 완료", yearlyLuck: "분석 완료", monthlyLuck: "분석 완료", fullAnalysis: "분석 완료" };
    const selectedType = getAnalysisType();

    return (
      <>
        <Head>
          <meta name="google" content="notranslate" />
          <meta httpEquiv="Content-Language" content="ko-KR" />
        </Head>
        <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)", color: "#333", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 10, padding: isMobile ? "20px 16px" : "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ maxWidth: isMobile ? "100%" : "900px", margin: "0 auto", width: "100%" }}>
              <h1 style={{ textAlign: "center", color: "#d4af37", marginBottom: isMobile ? 20 : 30, fontSize: isMobile ? "26px" : "36px", fontWeight: 900, marginTop: 0 }}>🔮 사주 분석 결과</h1>

              {analyzing ? (
                <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: isMobile ? 40 : 60, borderRadius: 12, textAlign: "center" }}>
                  <p style={{ fontSize: isMobile ? 16 : 20, marginBottom: 30, color: "#333", fontWeight: 700, marginTop: 0 }}>사주를 정밀 분석 중입니다</p>
                  <p style={{ fontSize: isMobile ? 13 : 16, marginBottom: 20, color: "#666", marginTop: 0 }}>당신의 사주팔자를 분석 중입니다</p>
                  <div style={{ fontSize: isMobile ? 40 : 60, marginTop: 0, marginBottom: 0 }}>🔄</div>
                </div>
              ) : (
                <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: isMobile ? 25 : 50, borderRadius: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12, marginBottom: isMobile ? 20 : 28 }}>
                    <button onClick={handleShare} style={{ padding: isMobile ? 13 : 16, background: "linear-gradient(135deg, #00bcd4, #0097a7)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>📱 공유하기</button>
                    <button onClick={handleDownloadPDF} style={{ padding: isMobile ? 13 : 16, background: "linear-gradient(135deg, #ff9800, #f57c00)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>📄 PDF 저장</button>
                  </div>

                  <div style={{ background: "linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%)", padding: isMobile ? 20 : 25, borderRadius: 12, marginBottom: isMobile ? 15 : 20, border: "2px solid rgba(255,215,0,0.6)" }}>
                    <p style={{ fontSize: isMobile ? 11 : 12, fontWeight: 900, color: "#FF6B6B", margin: "0 0 8px 0", textAlign: "center" }}>{selectedType.category}</p>
                    <h2 style={{ fontSize: isMobile ? 14 : 15, fontWeight: 900, color: "#FF6B6B", margin: "0 0 12px 0", borderBottom: "2px solid #FF6B6B", paddingBottom: 8, marginTop: 0 }}>✨ {selectedType.title}</h2>

                    <p style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: "#333", margin: "0 0 12px 0", lineHeight: 1.6, fontStyle: "italic", whiteSpace: "pre-wrap" }}>"{selectedType.insight}"</p>

                    <p style={{ fontSize: isMobile ? 11 : 12, fontWeight: 900, color: "#FF6B6B", margin: "10px 0 6px 0" }}>🎯 당신의 변화</p>
                    <p style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: "#333", margin: "0 0 12px 0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{selectedType.hidden1}</p>

                    <div style={{ background: "rgba(255,215,0,0.15)", padding: "10px 12px", borderRadius: 8, filter: "blur(0.8px)", opacity: 0.8 }}>
                      <p style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: "#d4af37", margin: "0 0 6px 0" }}>🔮 유료분석에서 공개</p>
                      <p style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: "#333", margin: "0", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{selectedType.hidden2}</p>
                    </div>

                    <p style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: "#d4af37", margin: "12px 0 0 0", textAlign: "center", fontStyle: "italic" }}>👉 {formData.name}님의 정확한 변화 시점과<br/>구체적 실행법이 모두 공개됩니다</p>
                  </div>

                  <button onClick={handleGoToPayment} style={{ width: "100%", padding: isMobile ? 15 : 17, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 15 : 17, cursor: "pointer", marginBottom: isMobile ? 20 : 28 }}>💎 {selectedType.category} 완벽 공략법 보기</button>

                  <div id="result-content">
                    <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>📝 이름 분석</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.2, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.name}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>💎 재물운</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.wealthLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>💕 연애운</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.loveLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35, filter: "blur(2px)", opacity: 0.6 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🌿 건강운</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.healthLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 35 : 45, filter: "blur(2px)", opacity: 0.6 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>👫 궁합 분석</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.couple}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35, filter: "blur(2px)", opacity: 0.6 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>☀️ 올해 운세</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.yearlyLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 25 : 35, filter: "blur(2px)", opacity: 0.6 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🌙 월별 운세</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.monthlyLuck}</p>
                    </div>

                    <div style={{ marginBottom: isMobile ? 35 : 45, filter: "blur(2px)", opacity: 0.6 }}>
                      <h2 style={{ color: "#d4af37", fontSize: isMobile ? 17 : 21, fontWeight: 900, marginBottom: isMobile ? 10 : 14, borderBottom: "3px solid #d4af37", paddingBottom: isMobile ? 8 : 10, marginTop: 0 }}>🎋 전체 사주분석</h2>
                      <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 500, lineHeight: 1.5, marginTop: 0, marginBottom: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>{result.fullAnalysis}</p>
                    </div>
                  </div>

                  <div style={{ background: "#fff3cd", padding: isMobile ? 18 : 22, borderRadius: 8, marginBottom: isMobile ? 20 : 28 }}>
                    <p style={{ color: "#333", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.8, marginTop: 0, marginBottom: 0, textAlign: "center" }}>✨ <strong>더 자세한 분석</strong>은<br/>유료 분석 코스에서!</p>
                  </div>

                  <button onClick={handleGoToPayment} style={{ width: "100%", padding: isMobile ? 15 : 17, background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 15 : 17, cursor: "pointer", marginBottom: 12 }}>💳 유료 분석 결제하기</button>
                  <p style={{ color: "#666", fontSize: isMobile ? 11 : 13, fontWeight: 700, textAlign: "center", marginTop: 0, marginBottom: 0 }}>📄 30페이지 - 올해 운세 + 월별 운세</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="ko-KR" />
      </Head>
      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0620 0%, #1a0f35 50%, #0a0420 100%)", backgroundImage: backgroundImages[step], backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", color: "white", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, padding: isMobile ? "25px 16px" : "40px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ maxWidth: isMobile ? "100%" : "700px", margin: "0 auto", width: "100%" }}>
            <h1 style={{ textAlign: "center", color: "#fbbf24", marginBottom: isMobile ? 35 : 50, fontSize: isMobile ? "26px" : "32px", fontWeight: 900, marginTop: 0 }}>🔮 무료 사주 분석</h1>

            {step === 1 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginBottom: isMobile ? 10 : 14, marginTop: 0 }}>이름을 입력해주세요</h2>
                <p style={{ color: "#ffffff", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.6, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>정확한 본명을 입력해주세요</p>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="홍길동" style={{ width: "100%", padding: isMobile ? "13px" : "16px", borderRadius: 8, border: "none", fontSize: isMobile ? 14 : 16, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000", marginBottom: isMobile ? 16 : 20 }} />
                <p style={{ color: "#ffffff", fontSize: isMobile ? 12 : 13, fontWeight: 700, marginTop: 0, marginBottom: 10 }}>지금 가장 궁금한 게 있다면 선택해주세요 (선택사항)</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: isMobile ? 22 : 28 }}>
                  {[{ v: "💰 돈", l: "💰 돈" }, { v: "💕 애정", l: "💕 연애" }, { v: "🎯 성공", l: "🎯 성공" }, { v: "💼 사업", l: "💼 사업" }, { v: "💍 결혼", l: "💍 결혼" }, { v: "🏢 직장", l: "🏢 직장" }, { v: "👶 자녀", l: "👶 자녀" }, { v: "📖 학업", l: "📖 학업" }, { v: "💪 건강", l: "💪 건강" }].map(opt => (
                    <button key={opt.v} type="button" onClick={() => setFormData(prev => ({ ...prev, interest: prev.interest === opt.v ? "" : opt.v }))}
                      style={{ padding: "9px 4px", borderRadius: 8, border: formData.interest === opt.v ? "2px solid #fbbf24" : "1px solid rgba(255,255,255,0.3)", background: formData.interest === opt.v ? "#fbbf24" : "rgba(255,255,255,0.12)", color: formData.interest === opt.v ? "#1a1a1a" : "#ffffff", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                      {opt.l}
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} disabled style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#999", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "not-allowed", opacity: 0.5 }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginBottom: isMobile ? 10 : 14, marginTop: 0 }}>성별을 선택해주세요</h2>
                <p style={{ color: "#ffffff", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.6, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>정확한 성별을 선택해주세요</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 11 : 14, marginBottom: isMobile ? 22 : 28 }}>
                  <button onClick={() => setFormData(prev => ({ ...prev, gender: "남" }))} style={{ padding: isMobile ? "13px" : "16px", borderRadius: 8, border: formData.gender === "남" ? "2px solid #fbbf24" : "2px solid rgba(255, 255, 255, 0.3)", background: formData.gender === "남" ? "rgba(251,191,36,0.3)" : "rgba(255, 255, 255, 0.1)", color: formData.gender === "남" ? "#fbbf24" : "#ffffff", fontWeight: 900, fontSize: isMobile ? 14 : 16, cursor: "pointer" }}>🧑 남성</button>
                  <button onClick={() => setFormData(prev => ({ ...prev, gender: "여" }))} style={{ padding: isMobile ? "13px" : "16px", borderRadius: 8, border: formData.gender === "여" ? "2px solid #fbbf24" : "2px solid rgba(255, 255, 255, 0.3)", background: formData.gender === "여" ? "rgba(251,191,36,0.3)" : "rgba(255, 255, 255, 0.1)", color: formData.gender === "여" ? "#fbbf24" : "#ffffff", fontWeight: 900, fontSize: isMobile ? 14 : 16, cursor: "pointer" }}>👩 여성</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>생년월일을 입력해주세요</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: isMobile ? 22 : 28 }}>
                  <input type="number" name="birthYear" value={formData.birthYear} onChange={handleInputChange} placeholder="1990" min="1900" max="2024" style={{ width: "100%", padding: isMobile ? "11px" : "14px", borderRadius: 8, border: "none", fontSize: isMobile ? 13 : 15, boxSizing: "border-box", backgroundColor: "#ffffff", color: "#333" }} />
                  <select name="birthMonth" value={formData.birthMonth} onChange={handleInputChange} style={{ width: "100%", padding: isMobile ? "11px" : "14px", borderRadius: 8, border: "none", fontSize: isMobile ? 13 : 15, boxSizing: "border-box", backgroundColor: "#ffffff", color: "#333" }}>
                    <option value="">월</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}월</option>
                    ))}
                  </select>
                  <select name="birthDay" value={formData.birthDay} onChange={handleInputChange} style={{ width: "100%", padding: isMobile ? "11px" : "14px", borderRadius: 8, border: "none", fontSize: isMobile ? 13 : 15, boxSizing: "border-box", backgroundColor: "#ffffff", color: "#333" }}>
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}일</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginBottom: isMobile ? 10 : 14, marginTop: 0 }}>태어난 시간을 선택해주세요</h2>
                <p style={{ color: "#ffffff", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.6, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>모르시면 "모름"을 선택하셔도 됩니다</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr", gap: isMobile ? 10 : 12, marginBottom: isMobile ? 22 : 28, maxHeight: isMobile ? "420px" : "380px", overflowY: "auto" }}>
                  {birthHours.map(hour => (
                    <button key={hour.value} onClick={() => setFormData(prev => ({ ...prev, birthHour: hour.value }))} style={{ padding: isMobile ? "12px" : "15px", borderRadius: 8, border: formData.birthHour === hour.value ? "3px solid #fbbf24" : "3px solid #ffffff", background: formData.birthHour === hour.value ? "#fbbf24" : "rgba(255, 255, 255, 0.15)", color: formData.birthHour === hour.value ? "#1a1a1a" : "#ffffff", fontWeight: 900, fontSize: isMobile ? 12 : 13, cursor: "pointer", textAlign: "center", lineHeight: 1.5 }}>
                      <div style={{ fontWeight: 900 }}>{hour.label}</div>
                      <div style={{ fontSize: isMobile ? 11 : 12, fontWeight: 700, opacity: 0.9, marginTop: "3px" }}>{hour.time}</div>
                    </button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginBottom: isMobile ? 10 : 14, marginTop: 0 }}>이메일을 입력해주세요</h2>
                <p style={{ color: "#ffffff", fontSize: isMobile ? 13 : 15, fontWeight: 700, lineHeight: 1.6, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>분석 결과를 받을 이메일을 입력해주세요</p>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" style={{ width: "100%", padding: isMobile ? "13px" : "16px", borderRadius: 8, border: "none", fontSize: isMobile ? 14 : 16, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000", marginBottom: isMobile ? 22 : 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleNextStep} style={{ padding: isMobile ? "13px" : "16px", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>다음 →</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div style={{ background: "rgba(236, 72, 153, 0.95)", padding: isMobile ? 30 : 40, borderRadius: 12, border: "2px solid rgba(236, 72, 153, 1)" }}>
                <h2 style={{ color: "#ffffff", fontSize: isMobile ? 17 : 20, fontWeight: 900, marginTop: 0, marginBottom: isMobile ? 22 : 28 }}>전화번호를 입력해주세요</h2>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="01012345678" maxLength={13} style={{ width: "100%", padding: isMobile ? "13px" : "16px", borderRadius: 8, border: "none", fontSize: isMobile ? 14 : 16, boxSizing: "border-box", backgroundColor: "#f5f5f5", color: "#000", marginBottom: isMobile ? 22 : 28 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 12 }}>
                  <button onClick={handlePrevStep} style={{ padding: isMobile ? "13px" : "16px", background: "rgba(255, 255, 255, 0.2)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.3)", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: "pointer" }}>← 이전</button>
                  <button onClick={handleAnalyze} disabled={analyzing} style={{ padding: isMobile ? "13px" : "16px", background: analyzing ? "rgba(255, 255, 255, 0.3)" : "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "black", border: "none", borderRadius: 8, fontWeight: 900, fontSize: isMobile ? 13 : 15, cursor: analyzing ? "not-allowed" : "pointer", opacity: analyzing ? 0.6 : 1 }}>분석 시작 →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}