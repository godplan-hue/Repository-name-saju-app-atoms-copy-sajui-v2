"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const G_PREMIUM = "linear-gradient(135deg, #c026d3, #9333ea)";
const G_NAVY = "linear-gradient(135deg, #3b5a82, #1f3a5f)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const YOUR_CHANGE_TYPES: { category: string; title: string; insight: string; hidden1: string; hidden2: string }[] = [
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

function getYourChangeType(name: string, birthYear: string | number, birthMonth: string | number, birthDay: string | number) {
  const fullData = String(name) + String(birthYear) + String(birthMonth) + String(birthDay);
  let hash = 0;
  for (let i = 0; i < fullData.length; i++) hash += fullData.charCodeAt(i);
  hash += (parseInt(String(birthMonth)) || 0) * 7;
  hash += (parseInt(String(birthDay)) || 0) * 13;
  hash += (parseInt(String(birthYear)) || 0) * 3;
  return YOUR_CHANGE_TYPES[Math.abs(hash) % YOUR_CHANGE_TYPES.length];
}


const ALL_SCORE_CATS = [
  { key: "🌟 오늘의 운세", scoreKey: "total",  color: "#f59e0b", icon: "🌟" },
  { key: "💰 재물운",      scoreKey: "wealth", color: "#f59e0b", icon: "💰" },
  { key: "💕 연애운",      scoreKey: "love",   color: "#ec4899", icon: "💕" },
  { key: "💪 건강운",      scoreKey: "health", color: "#10b981", icon: "💪" },
  { key: "🎯 성공운",      scoreKey: "success",color: "#8b5cf6", icon: "🎯" },
  { key: "✨ 총운",        scoreKey: "total",  color: "#6366f1", icon: "✨" },
];

const FREE_CAT = "🌟 오늘의 운세";
const SELECT_CATS = ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT);

type PkgCat = { apiKey: string; icon: string; label: string; color: string };
const PKG_CAT_MAP: Record<string, PkgCat[]> = {
  "기본 분석": [
    { apiKey: "☀️ 올해 운세", icon: "☀️", label: "올해 운세", color: "#f59e0b" },
    { apiKey: "📅 월별운세",  icon: "🌙", label: "월별 운세", color: "#0ea5e9" },
  ],
  "베이직": [
    { apiKey: "☀️ 올해 운세", icon: "☀️", label: "올해 운세", color: "#f59e0b" },
    { apiKey: "📅 월별운세",  icon: "🌙", label: "월별 운세", color: "#0ea5e9" },
    { apiKey: "💰 재물운",    icon: "💎", label: "재물운",    color: "#f59e0b" },
    { apiKey: "💕 연애운",    icon: "💕", label: "연애운",    color: "#ec4899" },
  ],
  "프리미엄": [
    { apiKey: "☀️ 올해 운세", icon: "☀️", label: "올해 운세", color: "#f59e0b" },
    { apiKey: "📅 월별운세",  icon: "🌙", label: "월별 운세", color: "#0ea5e9" },
    { apiKey: "💰 재물운",    icon: "💎", label: "재물운",    color: "#f59e0b" },
    { apiKey: "💕 연애운",    icon: "💕", label: "연애운",    color: "#ec4899" },
    { apiKey: "💪 건강운",    icon: "🌿", label: "건강운",    color: "#10b981" },
  ],
  "VIP 커플팩": [
    { apiKey: "☀️ 올해 운세",   icon: "☀️", label: "올해 운세",    color: "#f59e0b" },
    { apiKey: "📅 월별운세",    icon: "🌙", label: "월별 운세",    color: "#0ea5e9" },
    { apiKey: "💰 재물운",      icon: "💎", label: "재물운",       color: "#f59e0b" },
    { apiKey: "💕 연애운",      icon: "💕", label: "연애운",       color: "#ec4899" },
    { apiKey: "💪 건강운",      icon: "🌿", label: "건강운",       color: "#10b981" },
    { apiKey: "📝 이름분석",     icon: "📝", label: "이름분석",     color: "#6366f1" },
    { apiKey: "💼 전체 사주분석", icon: "✨", label: "전체 사주분석", color: "#8b5cf6" },
    { apiKey: "💍 결혼·궁합운", icon: "👫", label: "궁합분석",     color: "#f43f5e" },
  ],
};

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(t);
  }, [score]);
  const dash = (animated / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray 1.2s ease" }} />
      <text x="50" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{animated}</text>
      <text x="50" y="60" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9" fontWeight="700">/ 100</text>
    </svg>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 400);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 900, color }}>{score}점</span>
      </div>
      <div style={{ height: 7, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 99, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

function saveToHistory(r: any, isPaid: boolean, analyses: Record<string, string>, paidCats: string[], planType: string) {
  if (!r?.histId || !isPaid) return;
  try {
    const hist = JSON.parse(localStorage.getItem("v2_history") || "[]");
    const date = r.savedAt ?? new Date().toISOString();
    const cats = paidCats.length > 0 ? paidCats : Object.keys(analyses);
    cats.forEach((cat, i) => {
      // histId + i(숫자)로만 만들면 비슷한 시각에 저장된 다른 분석과 ID가 겹쳐 서로 덮어쓸 수 있어,
      // 카테고리 이름까지 포함한 문자열 ID로 만들어 충돌을 원천적으로 막음
      const id = `${r.histId}_${cat}`;
      const entry = {
        id,
        date,
        name: r.profile?.name ?? "",
        category: cat,
        scores: r.scores ?? {},
        analysis: analyses[cat] ?? "",
        isPaid: true,
        planType,
      };
      const idx = hist.findIndex((h: any) => h.id === id);
      if (idx >= 0) hist[idx] = entry;
      else hist.unshift(entry);
    });
    localStorage.setItem("v2_history", JSON.stringify(hist.slice(0, 50)));
  } catch {}
}

export default function V2Result() {
  const router = useRouter();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [result, setResult] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [allAnalyses, setAllAnalyses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(SELECT_CATS.map(c => c.key));
  const [paidCats, setPaidCats] = useState<string[]>([]);
  const [selPlan, setSelPlan] = useState("vip");
  const [payBusy, setPayBusy] = useState(false);
  const [planType, setPlanType] = useState("");
  const [tier, setTier] = useState<"free" | "select" | "package">("free");
  const [pkgName, setPkgName] = useState("");

  const INLINE_PLANS = [
    { id: "vip", icon: "🐲", name: "용 코스", badge: "👑 최고", desc: "₩9,990", price: 9990, priceStr: "₩9,990", per: "무제한", features: ["AI 심층 분석", "전 분야 사주 분석 + 사업운+총운", "월별+오늘 운세", "결혼운+궁합 분석 포함"] },
  ];

  const INLINE_SELECT_CATS = [
    { key: "💰 재물운", icon: "💰", color: "#f59e0b" },
    { key: "💕 연애운", icon: "💕", color: "#ec4899" },
    { key: "💪 건강운", icon: "💪", color: "#10b981" },
    { key: "🎯 성공운", icon: "🎯", color: "#8b5cf6" },
    { key: "✨ 총운",   icon: "✨", color: "#6366f1" },
  ];

  useEffect(() => {
    const raw = sessionStorage.getItem("v2_result");
    if (!raw) { router.replace("/main-v2/analysis"); return; }
    const r = JSON.parse(raw);
    if (!r.histId) {
      r.histId = Date.now();
      r.savedAt = new Date().toISOString();
      sessionStorage.setItem("v2_result", JSON.stringify(r));
    }
    setResult(r);

    const price = sessionStorage.getItem("price") ?? "";
    const PKG_PRICES_SET = ["9900", "19900", "24900", "29900"];
    const isPackage = PKG_PRICES_SET.includes(price);
    const isSelect = price === "990";
    const v2Paid = sessionStorage.getItem("v2_paid") === "1";
    const isPaid = isPackage || isSelect || v2Paid;
    const rawPlan = sessionStorage.getItem("v2_plan") ?? "";
    const plan = isPackage ? "package" : isSelect ? "select" : (v2Paid ? rawPlan : "");
    const detectedTier: "free" | "select" | "package" = isPackage ? "package" : isSelect ? "select" : "free";

    setTier(detectedTier);
    if (isPackage) setPkgName(sessionStorage.getItem("selectedPackage") ?? "");
    setPaid(isPaid);
    setPlanType(plan);
    const analyses = isPaid ? (r.allAnalyses ?? {}) : {};
    setAllAnalyses(analyses);
    const cats = (() => {
      if (!isPaid) return [];
      if (isPackage) {
        const pkg = sessionStorage.getItem("selectedPackage") ?? "";
        return (PKG_CAT_MAP[pkg] ?? PKG_CAT_MAP["기본 분석"]).map(c => c.apiKey);
      }
      const saved = sessionStorage.getItem("v2_paid_cats");
      return saved ? JSON.parse(saved) : SELECT_CATS.map(c => c.key);
    })();
    if (isPaid) setPaidCats(cats);
    if (isPaid && Object.keys(analyses).length > 0) {
      if (isPackage) {
        const pkg = sessionStorage.getItem("selectedPackage") ?? "";
        const pkgCats = PKG_CAT_MAP[pkg] ?? PKG_CAT_MAP["기본 분석"];
        const labelAnalyses: Record<string, string> = {};
        pkgCats.forEach(c => { labelAnalyses[`${c.icon} ${c.label}`] = analyses[c.apiKey] ?? ""; });
        saveToHistory(r, isPaid, labelAnalyses, pkgCats.map(c => `${c.icon} ${c.label}`), plan);
      } else {
        saveToHistory(r, isPaid, analyses, cats, plan);
      }
    }
  }, []);

  const goToPay = () => {
    if (selectedCats.length === 0) return;
    sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
    sessionStorage.setItem("v2_plan", "select");
    setShowSelect(false);
    router.push("/main-v2/payment");
  };

  const payInline = async () => {
    if (payBusy) return;
    setPayBusy(true);
    try {
      const profile = result?.profile;
      if (profile) {
        const category = selectedCats.length > 0 ? selectedCats[0] : "💰 재물운";
        const res = await fetch("/api/v2/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            birth: `${profile.birthYear}-${profile.birthMonth}-${profile.birthDay}`,
            birthHour: profile.birthHour,
            gender: profile.gender,
            relationship: profile.relationship,
            category,
            planType: "paid",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const histId = result?.histId ?? Date.now();
          const savedAt = result?.savedAt ?? new Date().toISOString();
          const newResult = { ...data, category, profile, histId, savedAt };
          sessionStorage.setItem("v2_result", JSON.stringify(newResult));
        }
      }
      sessionStorage.setItem("v2_paid", "1");
      sessionStorage.setItem("v2_plan", selPlan);
      sessionStorage.setItem("v2_paid_cats", JSON.stringify(selectedCats));
      await new Promise(r => setTimeout(r, 1200));
      window.location.reload();
    } catch {
      setPayBusy(false);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const saveImage = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const elements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (elements.length === 0) { alert("저장할 내용이 없습니다."); return; }
      const canvases: HTMLCanvasElement[] = [];
      for (const el of elements) {
        const prevOv = el.style.overflow;
        const prevMH = el.style.maxHeight;
        el.style.overflow = "visible";
        el.style.maxHeight = "none";
        // 글자 수가 길어진 카드일수록 캔버스 최대 크기(보통 약 16,384px 또는
        // 268,435,456 픽셀)를 넘기기 쉬워 scale을 내용 길이에 맞춰 동적으로 낮춤
        const estScale = el.scrollHeight > 6000 ? 1 : el.scrollHeight > 3000 ? 1.5 : 2;
        const c = await html2canvas(el, {
          backgroundColor: "#ffffff",
          scale: estScale,
          useCORS: true,
          logging: false,
          height: el.scrollHeight,
          windowWidth: 480,
          windowHeight: el.scrollHeight,
        });
        el.style.overflow = prevOv;
        el.style.maxHeight = prevMH;
        canvases.push(c);
      }
      const MAX_CANVAS_HEIGHT = 14000; // 브라우저 캔버스 한계보다 여유 있게 안전선을 둠
      const totalH = canvases.reduce((s, c) => s + c.height, 0) + (canvases.length - 1) * 16;

      const downloadCanvas = (canvas: HTMLCanvasElement, idx: number, total: number, label?: string) => {
        const link = document.createElement("a");
        const suffix = label ? `_${label}` : (total > 1 ? `_${idx + 1}of${total}` : "");
        link.download = `점운_${result?.profile?.name ?? "운세"}_${new Date().toLocaleDateString("ko")}${suffix}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };

      // 9900원 이상 패키지(카테고리 여러 개)는 합쳐서 하나의 거대한 캔버스를 만들지 않고,
      // 카테고리별로 각각 따로 저장 — 캔버스 크기 한계로 인한 저장 실패를 원천적으로 줄임
      // (요약 카드는 따로 빼지 않고, 각 카테고리 이미지 맨 위에 함께 붙여서 8장 모두에 들어가게 함)
      if (tier === "package" && canvases.length > 1) {
        const pkgCats = (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["기본 분석"]).filter(c => allAnalyses[c.apiKey]);
        const summary = canvases[0];
        canvases.slice(1).forEach((c, i) => {
          const label = pkgCats[i]?.label ?? `사주${i + 1}`;
          // 요약 카드 + 해당 카테고리 카드를 위아래로 이어붙인 새 캔버스를 만들어 저장
          const merged = document.createElement("canvas");
          merged.width = Math.max(summary.width, c.width);
          merged.height = summary.height + 16 + c.height;
          const ctx = merged.getContext("2d")!;
          ctx.fillStyle = "#f5f3ff";
          ctx.fillRect(0, 0, merged.width, merged.height);
          ctx.drawImage(summary, 0, 0);
          ctx.drawImage(c, 0, summary.height + 16);
          downloadCanvas(merged, i, canvases.length - 1, label);
        });
        return;
      }

      if (totalH <= MAX_CANVAS_HEIGHT) {
        const merged = document.createElement("canvas");
        merged.width = canvases[0].width;
        merged.height = totalH;
        const ctx = merged.getContext("2d")!;
        ctx.fillStyle = tier === "package" ? "#f5f3ff" : "#fdf2f8";
        ctx.fillRect(0, 0, merged.width, merged.height);
        let y = 0;
        for (let i = 0; i < canvases.length; i++) {
          ctx.drawImage(canvases[i], 0, y);
          y += canvases[i].height + 16;
        }
        downloadCanvas(merged, 0, 1);
      } else {
        // 내용이 길어 한 장에 다 못 담으면, 안전한 크기로 나눠서 여러 장으로 저장
        const groups: HTMLCanvasElement[][] = [];
        let cur: HTMLCanvasElement[] = [];
        let curH = 0;
        for (const c of canvases) {
          if (curH + c.height > MAX_CANVAS_HEIGHT && cur.length > 0) {
            groups.push(cur);
            cur = [];
            curH = 0;
          }
          cur.push(c);
          curH += c.height + 16;
        }
        if (cur.length > 0) groups.push(cur);

        groups.forEach((group, gi) => {
          // 첫 장은 이미 브랜드 카드(🐱 점운)가 맨 위에 있으므로, 2번째 장부터는
          // 어느 카테고리든 잘리지 않고 시작하는 것과 별개로 상단에 브랜드 헤더를 직접 그려 넣음
          const needsHeader = gi > 0;
          const headerH = needsHeader ? 80 * window.devicePixelRatio : 0;
          const gH = group.reduce((s, c) => s + c.height, 0) + (group.length - 1) * 16 + headerH;
          const merged = document.createElement("canvas");
          merged.width = group[0].width;
          merged.height = gH;
          const ctx = merged.getContext("2d")!;
          ctx.fillStyle = tier === "package" ? "#f5f3ff" : "#fdf2f8";
          ctx.fillRect(0, 0, merged.width, merged.height);
          let y = 0;
          if (needsHeader) {
            const dpr = window.devicePixelRatio;
            ctx.fillStyle = tier === "package" ? "#2c4a73" : "#ec4899";
            ctx.fillRect(0, 0, merged.width, headerH);
            ctx.fillStyle = "#ffffff";
            ctx.font = `900 ${22 * dpr}px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`🐱 점운 · AI 사주 분析 (${gi + 1}/${groups.length})`, merged.width / 2, headerH / 2);
            y = headerH;
          }
          for (const c of group) {
            ctx.drawImage(c, 0, y);
            y += c.height + 16;
          }
          downloadCanvas(merged, gi, groups.length);
        });
      }
    } catch (e) {
      console.error("이미지 저장 실패:", e);
      alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const share = () => {
    if (!result) return;
    const url = window.location.origin + "/main-v2";
    let extra = "";
    if (tier === "package" && result.profile?.birthYear) {
      const ganList = ["갑","을","병","정","무","기","경","신","임","계"];
      const y = Number(result.profile.birthYear);
      const gan = ganList[((y - 4) % 10 + 10) % 10];
      extra = `\n${gan} 천간을 타고난 사주 심층 분析 결과예요 🪬`;
    }
    const text = `${result.profile?.name}님의 운세 분석 🔮\n총운 ${result.scores?.total}점${extra}\n\n📱 나도 무료로!\n${url}`;
    if (navigator.share) navigator.share({ title: "점운 운세 결과", text, url }).catch(() => {});
    else navigator.clipboard.writeText(text).then(() => alert("✅ 링크 복사됨!"));
  };

  if (!result) return null;

  const { scores, luckyColor, luckyNumber, luckyDirection, profile } = result;
  const freeAnalysis: string = result.analysis ?? "";

  return (
    <main style={{ minHeight: "100vh", background: BG, fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 헤더 */}
      <header style={{ height: 52, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🐱 점운</span>
        </button>
        <div style={{ display: "flex", gap: 7 }}>
          {(!paid || planType !== "select") && (
            <button onClick={share} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
              📱 공유
            </button>
          )}
          {paid && planType !== "select" && (
            <button onClick={saveImage} disabled={saving} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "⏳..." : "🖼️ 저장"}
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* ── 점수 요약 카드 ── */}
        <div
          ref={el => { cardRefs.current[0] = el; }}
          style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12 }}
        >
          <div style={{ background: tier === "package" ? G_NAVY : G, color: "white", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
            <p style={{ fontSize: 15, fontWeight: 900, margin: 0, padding: "10px 20px 0", letterSpacing: "-0.3px" }}>🐱 점운 · AI 사주 분석</p>
            <div style={{ padding: "14px 20px 24px" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>🔮</div>
              <h1 style={{ fontSize: 15, fontWeight: 900, margin: "0 0 12px", opacity: 0.9 }}>{profile?.name}님의 운세 분석</h1>
              <ScoreCircle score={scores?.total ?? 0} size={130} />
              <p style={{ fontSize: 12, opacity: 0.75, margin: "8px 0 0", fontWeight: 600 }}>총운 점수</p>
            </div>
          </div>
          {/* 럭키 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 18px 12px" }}>
            {[{ label: "행운 색", value: luckyColor, icon: "🎨" }, { label: "행운 숫자", value: luckyNumber, icon: "🔢" }, { label: "행운 방향", value: luckyDirection, icon: "🧭" }].map(item => (
              <div key={item.label} style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{item.value}</div>
              </div>
            ))}
          </div>
          {/* 6개 운세 점수 바 */}
          <div style={{ padding: "4px 18px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e", marginBottom: 14 }}>📊 분야별 운세 점수</div>
            {[
              { label: "🌟 오늘의 운세", key: "total",   color: "#f59e0b" },
              { label: "💰 재물운",      key: "wealth",  color: "#f59e0b" },
              { label: "💕 연애운",      key: "love",    color: "#ec4899" },
              { label: "💪 건강운",      key: "health",  color: "#10b981" },
              { label: "🎯 성공운",      key: "success", color: "#8b5cf6" },
              { label: "✨ 총운",        key: "total",   color: "#6366f1" },
            ].map(b => (
              <ScoreBar key={b.label} label={b.label} score={scores?.[b.key as keyof typeof scores] ?? 0} color={b.color} />
            ))}
          </div>
        </div>

        {/* ── 무료 전용: 사주팔자 맛보기 (띠+오행만, 천간은 패키지에서만 공개) ── */}
        {tier === "free" && profile?.birthYear && (() => {
          const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
          const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
          const ohEmoji: Record<string,string> = { "목":"🌳","화":"🔥","토":"⛰️","금":"⚪","수":"💧" };
          const y = Number(profile.birthYear);
          const z = zodiacList[((y - 4) % 12 + 12) % 12];
          const oh = ohArr[((y - 4) % 10 + 10) % 10];
          return (
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ background: G, color: "white", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🔮 {profile?.name}님의 사주팔자 맛보기</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "16px 18px" }}>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🐉</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>띠</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{z}띠</div>
                </div>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{ohEmoji[oh]}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>오행</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{oh}({oh === "목" ? "木" : oh === "화" ? "火" : oh === "토" ? "土" : oh === "금" ? "金" : "水"})</div>
                </div>
              </div>
              <div style={{ padding: "0 18px 16px" }}>
                <div style={{ background: "#fdf2f8", borderRadius: 14, padding: "12px 14px", textAlign: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#ec4899", fontWeight: 700, lineHeight: 1.6 }}>🪬 내 성격과 재물 흐름, 더 자세히 알고 싶다면?</div>
                </div>
                <button onClick={() => router.push("/main-v2/payment")} style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>
                  💎 9,900원 패키지 결제하고 전체 확인하기
                </button>
              </div>
            </div>
          );
        })()}

        {/* ── 패키지 전용: 사주팔자 한눈에 보기 + 오늘/내일의 한마디 ── */}
        {tier === "package" && profile?.birthYear && (() => {
          const zodiacList = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
          const ohArr = ["목","목","화","화","토","토","금","금","수","수"];
          const ganList = ["갑","을","병","정","무","기","경","신","임","계"];
          const ohEmoji: Record<string,string> = { "목":"🌳","화":"🔥","토":"⛰️","금":"⚪","수":"💧" };
          const y = Number(profile.birthYear);
          const z = zodiacList[((y - 4) % 12 + 12) % 12];
          const oh = ohArr[((y - 4) % 10 + 10) % 10];
          const gan = ganList[((y - 4) % 10 + 10) % 10];
          const dayMsgs = [
            "오늘은 그동안 미뤄온 결정을 내리기 좋은 날입니다.",
            "오늘은 사람과의 인연이 평소보다 강하게 작동하는 날입니다.",
            "오늘은 돈과 관련된 작은 선택이 길게 영향을 미치는 날입니다.",
            "오늘은 몸의 신호에 조금 더 귀 기울여야 하는 날입니다.",
            "오늘은 새로운 시도를 해볼 만한 기운이 흐르는 날입니다.",
            "오늘은 차분히 정리하고 돌아보기 좋은 날입니다.",
            "오늘은 평소보다 직관을 믿어도 좋은 날입니다.",
          ];
          const dIdx = new Date().getDay();
          const tomorrowMsgs = [
            "내일은 가까운 사람과의 대화에서 좋은 기운이 들어옵니다.",
            "내일은 작은 기회가 평소보다 눈에 잘 들어오는 흐름입니다.",
            "내일은 재물과 관련된 신호를 눈여겨봐야 하는 흐름입니다.",
            "내일은 몸과 마음을 챙기는 것이 우선인 흐름입니다.",
            "내일은 새로운 인연이나 제안이 들어올 수 있는 흐름입니다.",
            "내일은 오늘 한 결정의 결과가 서서히 드러나는 흐름입니다.",
            "내일은 한 주를 준비하는 마음가짐이 중요한 흐름입니다.",
          ];
          return (
            <div style={{ background: "linear-gradient(180deg, #fdf9ef 0%, #ffffff 14%)", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
              <div style={{ background: G_PREMIUM, color: "white", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🪬 {profile?.name}님의 사주팔자 한눈에 보기</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "16px 18px" }}>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🐉</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>띠</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{z}띠</div>
                </div>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{ohEmoji[oh]}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>오행</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{oh}({oh === "목" ? "木" : oh === "화" ? "火" : oh === "토" ? "土" : oh === "금" ? "金" : "水"})</div>
                </div>
                <div style={{ background: BG, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>🌳</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>천간</div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1a1a2e" }}>{gan}({gan === "갑" ? "甲" : gan === "을" ? "乙" : gan === "병" ? "丙" : gan === "정" ? "丁" : gan === "무" ? "戊" : gan === "기" ? "己" : gan === "경" ? "庚" : gan === "신" ? "辛" : gan === "임" ? "壬" : "癸"})</div>
                </div>
              </div>
              <div style={{ padding: "0 18px 16px" }}>
                <div style={{ background: "#f5f3ff", borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "#6d28d9", fontWeight: 800, marginBottom: 4 }}>🔮 오늘의 한마디</div>
                  <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{dayMsgs[dIdx]}</div>
                </div>
                <div style={{ background: "#f5f3ff", borderRadius: 14, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "#6d28d9", fontWeight: 800, marginBottom: 4 }}>🌙 내일의 예고</div>
                  <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>{tomorrowMsgs[(dIdx + 1) % 7]}</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── 무료: 오늘의 운세 카드 ── */}
        {tier === "free" && (
          <div
            ref={el => { cardRefs.current[1] = el; }}
            style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(34,197,94,0.25)", marginBottom: 12 }}
          >
            <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(236,72,153,0.07)" }}>
              <span style={{ fontSize: 22 }}>🌟</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>오늘의 운세</span>
              <span style={{ fontSize: 10, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>FREE</span>
            </div>
            <div style={{ padding: "14px 18px 20px" }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                {freeAnalysis}
              </p>
            </div>
          </div>
        )}

        {/* ── 무료: 당신의 변화 (호기심 유발 미끼, 990원 결제 시 전체 공개) ── */}
        {tier === "free" && profile?.name && profile?.birthYear && (() => {
          const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay);
          return (
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1a1a", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🎯 {profile.name}님의 변화</div>
              <div style={{ padding: "16px 18px 20px" }}>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 800, margin: "0 0 6px" }}>{yc.category}</p>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px", borderBottom: "2px solid #fbbf24", paddingBottom: 8 }}>✨ {yc.title}</h3>
                <p style={{ fontSize: 12.5, color: "#374151", fontWeight: 700, fontStyle: "italic", lineHeight: 1.7, margin: "0 0 12px", whiteSpace: "pre-wrap" }}>"{yc.insight}"</p>
                <p style={{ fontSize: 11, color: "#f59e0b", fontWeight: 900, margin: "0 0 6px" }}>🎯 당신의 변화</p>
                <p style={{ fontSize: 12.5, color: "#374151", fontWeight: 600, lineHeight: 1.7, margin: "0 0 12px", whiteSpace: "pre-wrap" }}>{yc.hidden1}</p>
                <div style={{ background: "rgba(255,215,0,0.12)", borderRadius: 10, padding: "10px 12px", filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
                  <p style={{ fontSize: 10, color: "#d4af37", fontWeight: 800, margin: "0 0 6px" }}>🔮 990원 결제 시 공개</p>
                  <p style={{ fontSize: 11.5, color: "#333", fontWeight: 600, margin: 0, whiteSpace: "pre-wrap" }}>{yc.hidden2}</p>
                </div>
                <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 800, margin: "12px 0 0", textAlign: "center", fontStyle: "italic" }}>👉 {profile.name}님의 정확한 변화 시점과<br/>구체적인 실행법이 <span style={{ display: "inline-block", background: "#ec4899", color: "white", fontWeight: 900, fontStyle: "normal", padding: "2px 10px", borderRadius: 8, margin: "0 2px" }}>990원 결제</span> 시 모두 공개됩니다</p>
                <button onClick={() => router.push("/main-v2/payment")} style={{ width: "100%", marginTop: 14, padding: "13px 0", background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>💎 {yc.category} 완벽 공략법 보기</button>
              </div>
            </div>
          );
        })()}

        {/* ── 990원: 선택한 5개 운세 ── */}
        {tier === "select" && Object.keys(allAnalyses).length > 0 && (
          ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key)).map((c, i) => (
            <div key={c.key} ref={el => { cardRefs.current[2 + i] = el; }}
              style={{ background: "white", borderRadius: 24, border: `1.5px solid ${c.color}44`, marginBottom: 12 }}>
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(236,72,153,0.07)" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{c.key.replace(/\S+\s/, "")}</span>
                <span style={{ fontSize: 10, background: G, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>💎 심층</span>
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                  {allAnalyses[c.key] ?? ""}
                </p>
              </div>
            </div>
          ))
        )}

        {/* ── 패키지(9900~29900): 패키지별 운세 ── */}
        {tier === "package" && Object.keys(allAnalyses).length > 0 && (
          (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["기본 분석"]).filter(c => allAnalyses[c.apiKey]).map((c, i) => (
            <div key={c.apiKey} ref={el => { cardRefs.current[2 + i] = el; }}
              style={{ background: "linear-gradient(180deg, #fdf9ef 0%, #ffffff 14%)", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(217,180,80,0.18)", background: "linear-gradient(90deg, rgba(217,180,80,0.10), transparent)" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{c.label}</span>
                <span style={{ fontSize: 10, background: G_PREMIUM, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>📦 패키지</span>
                {c.apiKey === "💍 결혼·궁합운" && (
                  <span style={{ fontSize: 10, background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>💞 궁합 {scores?.total ?? 0}%</span>
                )}
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all" }}>
                  {allAnalyses[c.apiKey]}
                </p>
              </div>
            </div>
          ))
        )}


        {/* ── 무료: 공유하기 + 유료 결제하기 ── */}
        {tier === "free" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={share}
                style={{ width: "100%", padding: "13px 0", background: "white", color: "#ec4899", border: "1.5px solid rgba(236,72,153,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.1)" }}>
                📤 공유하기
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                💳 유료 운세 결제하기
              </button>
            </div>
          </>
        )}

        {/* ── 990원: 유료 결제하기 + 다시 분석 + 보관함 저장 ── */}
        {tier === "select" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                💳 유료 운세 결제하기
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => { sessionStorage.removeItem("v2_paid"); sessionStorage.removeItem("v2_paid_cats"); sessionStorage.removeItem("price"); router.push("/main-v2/payment"); }}
                style={{ width: "100%", padding: "12px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                🔮 다시 분석
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/history")}
                style={{ width: "100%", padding: "13px 0", background: "white", color: "#8b5cf6", border: "1.5px solid rgba(139,92,246,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.1)" }}>
                📥 보관함 저장
              </button>
            </div>
          </>
        )}

        {/* ── 패키지(9900~29900): 공유하기 + 유료 결제하기 + 다시 분석 + 보관함 저장 + 이미지 저장 ── */}
        {tier === "package" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={share}
                style={{ width: "100%", padding: "13px 0", background: "white", color: "#ec4899", border: "1.5px solid rgba(236,72,153,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.1)" }}>
                📤 공유하기
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/payment")}
                style={{ width: "100%", padding: "15px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(236,72,153,0.35)" }}>
                💳 유료 운세 결제하기
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => { sessionStorage.removeItem("v2_paid"); sessionStorage.removeItem("v2_paid_cats"); sessionStorage.removeItem("price"); router.push("/main-v2/payment"); }}
                style={{ width: "100%", padding: "12px 0", background: "white", color: "#8b5cf6", border: "1.5px solid #8b5cf6", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                🔮 다시 분석
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/history")}
                style={{ width: "100%", padding: "13px 0", background: "white", color: "#8b5cf6", border: "1.5px solid rgba(139,92,246,0.4)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.1)" }}>
                📥 보관함 저장
              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <button onClick={saveImage} disabled={saving}
                style={{ width: "100%", padding: "14px 0", background: G, color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(236,72,153,0.3)", opacity: saving ? 0.7 : 1 }}>
                {saving ? "⏳ 저장 중..." : "🖼️ 이미지 저장"}
              </button>
            </div>
          </>
        )}
        <button onClick={() => router.push("/main-v2")}
          style={{ width: "100%", marginTop: 10, padding: "11px 0", background: "transparent", color: "#9ca3af", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
          🏠 홈으로
        </button>
      </div>

      {/* ── 운세 선택 모달 ── */}
      {showSelect && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={e => { if (e.target === e.currentTarget) setShowSelect(false); }}
        >
          <div style={{ width: "100%", maxWidth: 480, background: "white", borderRadius: "28px 28px 0 0", padding: "28px 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ width: 40, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 20px" }} />

            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>어떤 운세를 확인할까요?</h2>
            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: "0 0 20px" }}>
              {selectedCats.length > 0
                ? <><span style={{ color: "#ec4899", fontWeight: 800 }}>{selectedCats.length}개</span> 선택 · <span style={{ color: "#8b5cf6", fontWeight: 800 }}>₩{(selectedCats.length * 990).toLocaleString()}</span></>
                : "운세를 선택하세요"}
            </p>

            {/* 전체 선택 */}
            <button
              onClick={() => setSelectedCats(selectedCats.length === SELECT_CATS.length ? [] : SELECT_CATS.map(c => c.key))}
              style={{ width: "100%", padding: "10px 16px", marginBottom: 12, background: selectedCats.length === SELECT_CATS.length ? "#fdf2f8" : "white", border: `1.5px solid ${selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#e5e7eb"}`, borderRadius: 14, fontWeight: 800, fontSize: 13, color: selectedCats.length === SELECT_CATS.length ? "#ec4899" : "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span>✨ 전체 선택</span>
              <span style={{ fontSize: 16 }}>{selectedCats.length === SELECT_CATS.length ? "☑️" : "⬜"}</span>
            </button>

            {/* 개별 운세 카드 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
              {SELECT_CATS.map(c => {
                const on = selectedCats.includes(c.key);
                return (
                  <button key={c.key}
                    onClick={() => setSelectedCats(on ? selectedCats.filter(k => k !== c.key) : [...selectedCats, c.key])}
                    style={{ padding: "14px 16px", border: `1.5px solid ${on ? c.color : "#e5e7eb"}`, borderRadius: 16, background: on ? `${c.color}10` : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{c.icon}</span>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: on ? c.color : "#374151" }}>{c.key.replace(/\S+\s/, "")}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>약 3,500자 심층 분석</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 18 }}>{on ? "✅" : "⬜"}</span>
                  </button>
                );
              })}
            </div>

            {/* 결제 버튼 */}
            <button
              onClick={goToPay}
              disabled={selectedCats.length === 0}
              style={{ width: "100%", padding: "16px 0", background: selectedCats.length > 0 ? G : "#e5e7eb", color: selectedCats.length > 0 ? "white" : "#9ca3af", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 16, cursor: selectedCats.length > 0 ? "pointer" : "not-allowed", boxShadow: selectedCats.length > 0 ? "0 6px 20px rgba(236,72,153,0.35)" : "none" }}
            >
              {selectedCats.length > 0
                ? `💎 ${selectedCats.length}개 운세 보기 · ₩${(selectedCats.length * 990).toLocaleString()}`
                : "운세를 선택하세요"}
            </button>
            <button onClick={() => setShowSelect(false)}
              style={{ width: "100%", marginTop: 10, padding: "12px 0", background: "transparent", color: "#9ca3af", border: "none", fontSize: 13, cursor: "pointer" }}>
              취소
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
