"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const G = "linear-gradient(135deg, #ec4899, #8b5cf6)";
const G_PREMIUM = "linear-gradient(135deg, #c026d3, #9333ea)";
const G_NAVY = "linear-gradient(135deg, #3b5a82, #1f3a5f)";
const BG = "linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)";

const YOUR_CHANGE_TYPES: { category: string; title: string; insight: string; hidden1: string; hidden2: string }[] = [
    { category: "💰 돈", title: "돈은 벌지만 자산은 안 늘어남", insight: "월급도 나쁘지 않고 사업도 굴러가는데\n막상 통장을 보면 모인 게 없어요", hidden1: "당신에게 부족한 건 버는 능력이 아니에요\n버는 돈을 '머무르게' 하는 방법을 모르고 있을 뿐이에요\n그 방법 하나만 알면 흐름이 통째로 바뀝니다", hidden2: "3월에 들어오는 작은 부수입 하나를 그대로 써버리지 않고\n자동이체로 따로 떼어 모으기 시작하면\n9월쯔음 그 돈이 두 배 가까이 불어나 있을 확률이 높습니다\n지금부터 작은 습관을 만들어두는 것이 그 흐름을 제대로 받는 핵심입니다." },
    { category: "💰 돈", title: "큰돈은 들어오는데 자꾸 사라짐", insight: "보너스든 계약금이든 한 번씩 크게 들어오는데\n이상하게 그 직후에 꼭 큰 지출이 따라와요", hidden1: "그건 우연이 아니라 당신 사주에 새겨진 흐름이에요\n돈이 들어오는 타이밍과 나가는 타이밍이 묶여있어서 그래요\n이 흐름을 한 번 끊으면 그 다음부터는 쌓이기 시작해요", hidden2: "7월에 예상보다 큰 돈이 들어오는데\n들어온 즉시 절반을 다른 계좌로 옮겨두면\n연말에 큰 지출이 생겨도 무너지지 않고 버틸 확률이 높습니다\n지금부터 작은 습관을 만들어두는 것이 그 흐름을 제대로 받는 핵심입니다." },
    { category: "💰 돈", title: "일을 많이 해도 가난한 느낌", insight: "남들 보기엔 바쁘고 열심히 사는데\n정작 마음 한구석엔 항상 쪼들리는 느낌이 있어요", hidden1: "당신의 벌이 자체는 평균 이상이에요\n문제는 '나는 부족하다'는 믿음이 지출을 자꾸 만들어낸다는 거예요\n그 믿음의 뿌리를 알면 씀씀이가 자연스럽게 바뀝니다", hidden2: "4월에 가계부를 한 달만 제대로 적어보면\n생각보다 새는 돈의 절반이 충동적인 소비라는 걸 알게 되고\n그걸 막는 순간부터 풍요로움을 체감하게 될 확률이 높습니다\n지금부터 작은 습관을 만들어두는 것이 그 흐름을 제대로 받는 핵심입니다." },
    { category: "💕 애정", title: "짝을 못 만나고 있음", insight: "주변은 다 짝이 있는데\n나만 자꾸 혼자인 것 같아서 외로워요", hidden1: "당신이 인연이 없는 사람이라서가 아니에요\n지금까지는 인연이 들어올 시기가 아니었을 뿐이에요\n그 문이 곧 열리는 흐름이 사주에 보입니다", hidden2: "5월에 지인이 잡는 모임이나 소개 자리에 한 번 나가게 되는데\n평소라면 거절했을 그 자리에 가보면\n그 사람과 가을까지 이어지는 인연이 시작될 확률이 높습니다\n마음을 정직하게 표현하는 것이 그 흐름을 가장 크게 키우는 방법입니다." },
    { category: "💕 애정", title: "만나는 사람마다 헤어짐", insight: "시작할 때는 분명 설레고 좋았는데\n이상하게 항상 비슷한 지점에서 끝이 나요", hidden1: "헤어짐이 반복된 건 당신 탓이 아니에요\n지금까지 만난 사람들이 당신 사주와 맞물리는 방향이 아니었을 뿐이에요\n맞는 방향을 알면 이번엔 다르게 흘러갑니다", hidden2: "8월쯔음 비슷한 패턴이 또 보이는 사람을 만나게 되는데\n그때 예전처럼 맞춰주기만 하지 않고 솔직하게 말을 꺼내면\n이번엔 같은 지점에서 끝나지 않고 오래 갈 확률이 높습니다\n마음을 정직하게 표현하는 것이 그 흐름을 가장 크게 키우는 방법입니다." },
    { category: "🎯 성공", title: "열심히 해도 인정받지 못함", insight: "분명 남들보다 더 많이 노력하는데\n그게 잘 안 보이는 것 같아 답답해요", hidden1: "당신의 실력은 이미 인정받을 수준을 넘었어요\n다만 그게 드러날 무대가 아직 열리지 않았을 뿐이에요\n그 무대가 머지않아 당신 앞에 펼쳐집니다", hidden2: "6월에 평소엔 안 나서던 발표나 보고 자리가 한 번 생기는데\n그 기회를 피하지 않고 직접 나서서 맡으면\n그걸 본 핵심 인물에게 제대로 각인될 확률이 높습니다\n지금의 작은 선택이 그 시기를 결정짓는 가장 중요한 요소입니다." },
    { category: "🎯 성공", title: "꿈은 크지만 시작 용기가 없음", insight: "머릿속엔 좋은 계획이 가득한데\n막상 첫발을 떼려면 망설여져요", hidden1: "그 계획은 충분히 현실성 있는 계획이에요\n다만 두려움이 실제 위험보다 훨씬 크게 느껴지고 있을 뿐이에요\n그 두려움의 크기는 시작과 함께 줄어듭니다", hidden2: "4월 안에 가장 작은 단위로 한 가지만 시작해보면\n생각보다 반응이 빠르게 따라오고\n그 흐름을 타고 연말까지 계획을 키워나갈 확률이 높습니다\n지금의 작은 선택이 그 시기를 결정짓는 가장 중요한 요소입니다." },
    { category: "💼 사업", title: "사업 아이디어는 많은데 실행 못함", insight: "괜찮은 아이디어가 계속 떠오르는데\n실행으로 옮길 자신이 잘 안 생겨요", hidden1: "아이디어 자체는 이미 충분히 괜찮은 수준이에요\n지금까지는 실행하기에 맞는 여건이 아니었을 뿐이에요\n지금이 바로 그 여건이 갖춰지는 시점입니다", hidden2: "5월에 그동안 떠올린 아이디어 중 하나를\n작은 규모로 시범 운영해보면\n예상보다 빠르게 첫 매출이 잡혀 자신감이 붙을 확률이 높습니다\n숫자와 사람 관리를 동시에 챙기는 것이 그 흐름을 지키는 비결입니다." },
    { category: "💼 사업", title: "사업해봤는데 망함", insight: "한 번 시작했다가 실패한 경험이 있어서\n다시 시도할 자신감이 잘 안 생겨요", hidden1: "그 실패는 당신의 능력 부족이 아니었어요\n시점과 조건이 그때는 맞지 않았을 뿐이에요\n이번엔 그 조건이 당신에게 유리하게 바뀝니다", hidden2: "9월쯔음 예전과 비슷한 기회가 다시 찾아오는데\n그때 자금 관리만 미리 따로 정해두고 시작하면\n이번엔 지난번과 다르게 안정적으로 자리잡을 확률이 높습니다\n숫자와 사람 관리를 동시에 챙기는 것이 그 흐름을 지키는 비결입니다." },
    { category: "💍 결혼", title: "결혼하고 싶은데 상대가 없음", insight: "결혼은 하고 싶은데\n연애 자체가 잘 시작되지 않아서 답답해요", hidden1: "당신은 결혼할 준비가 이미 충분히 되어 있는 사람이에요\n지금 비어있는 건 사람 한 명뿐이에요\n그 사람이 들어오는 흐름이 머지않아 시작됩니다", hidden2: "10월에 지인 결혼식이나 모임 자리에서\n평소와 다르게 적극적으로 대화를 이어가면\n그 자리에서 만난 사람과 내년 봄까지 이어질 확률이 높습니다\n서로의 속도를 존중하는 마음이 그 시기를 가장 안전하게 만듭니다." },
    { category: "🏢 직장", title: "열심히 일해도 승진이 안 됨", insight: "성과는 분명히 냈다고 생각하는데\n자리는 늘 그대로인 것 같아요", hidden1: "당신의 실력은 이미 그 자리를 넘어선 수준이에요\n다만 그 실력이 드러날 무대가 아직 오지 않았을 뿐이에요\n그 무대가 곧 당신 앞에 열립니다", hidden2: "7월 인사 시즌 전에 그동안의 성과를\n숫자와 기록으로 정리해서 먼저 보고하면\n그 자료가 결정적인 한 표가 되어 승진할 확률이 높습니다\n꾸준히 보여주는 모습이 그 시기를 앞당기는 가장 확실한 방법입니다." },
    { category: "🏢 직장", title: "이직을 고민만 하고 있음", insight: "지금 자리가 답답한 건 맞는데\n막상 옮기려니 용기가 잘 안 나요", hidden1: "그 답답함은 당신이 약해서가 아니에요\n지금 자리가 당신의 그릇에 비해 작을 뿐이에요\n더 맞는 자리가 이미 당신 쪽으로 움직이고 있어요", hidden2: "6월에 생각지도 못한 곳에서 이직 제안이 하나 들어오는데\n조건만 보고 거절하지 않고 한 번 만나서 들어보면\n생각보다 훨씬 좋은 자리로 옮기게 될 확률이 높습니다\n꾸준히 보여주는 모습이 그 시기를 앞당기는 가장 확실한 방법입니다." },
    { category: "👶 자녀", title: "아이 문제로 마음이 무거움", insight: "겉으론 괜찮은 척하지만\n속으론 아이 걱정이 계속 떠나지 않아요", hidden1: "그 걱정은 부모라면 누구나 갖는 자연스러운 마음이에요\n다만 지금 아이에게 필요한 건 조금 다른 방식의 관심이에요\n그 방식을 알면 마음이 한결 가벼워집니다", hidden2: "5월에 잔소리 대신 아이가 좋아하는 것 하나를\n같이 해보는 시간을 따로 만들면\n그 한 번을 계기로 마음의 문이 다시 열릴 확률이 높습니다\n그 순간을 놓치지 않고 알아채는 것이 부모로서 가장 큰 역할입니다." },
    { category: "👶 자녀", title: "아이의 미래가 자꾸 걸림", insight: "자꾸 남들 아이와 비교하게 되고\n괜히 불안한 마음이 들 때가 많아요", hidden1: "아이는 이미 자기만의 속도로 잘 자라고 있어요\n다만 그 속도가 남들과 다르게 보일 뿐이에요\n그 속도를 알아보는 눈이 지금 당신에게 필요해요", hidden2: "9월쯔음 아이가 평소와 다르게 몰입하는 모습을\n우연히 보게 되는데\n그 분야를 살짝 밀어주면 내년에 눈에 띄게 두드러질 확률이 높습니다\n그 순간을 놓치지 않고 알아채는 것이 부모로서 가장 큰 역할입니다." },
    { category: "📖 학업", title: "노력한 만큼 성적이 안 나옴", insight: "공부하는 시간은 분명히 늘었는데\n결과는 제자리에 머물러 있는 것 같아요", hidden1: "그동안의 노력은 절대 사라지지 않았어요\n다만 지금 방식이 당신에게 잘 맞지 않을 뿐이에요\n맞는 방식으로 바꾸면 결과가 곧 따라옵니다", hidden2: "4월에 공부 방식을 한 가지만 바꿔서\n암기 대신 직접 풀어보는 시간을 늘리면\n다음 시험에서 성적이 눈에 띄게 오를 확률이 높습니다\n지금의 작은 실천이 그 결과를 만드는 가장 확실한 차이가 됩니다." },
    { category: "📖 학업", title: "시험이나 합격 앞에서 불안함", insight: "준비는 충분히 한 것 같은데\n결과를 생각하면 자꾸 불안해져요", hidden1: "그 불안은 잘하고 싶은 마음이 큰 만큼 생기는 거예요\n당신의 준비는 이미 충분한 수준에 와 있어요\n지금 필요한 건 그 마음을 가라앉히는 일뿐이에요", hidden2: "시험 한 달 전부터 매일 10분씩 마음을 가라앉히는 시간을 가지면\n시험 당일 평소보다 훨씬 차분하게 풀어내서\n합격할 확률이 높습니다\n지금의 작은 실천이 그 결과를 만드는 가장 확실한 차이가 됩니다." },
    { category: "💪 건강", title: "이유 없이 자꾸 피곤함", insight: "특별히 무리한 것도 없는데\n몸이 늘 무겁고 개운한 날이 별로 없어요", hidden1: "그 피로는 게을러서 생기는 게 아니에요\n당신 사주에서 특정 부위에 에너지가 쉽게 새는 흐름이 있을 뿐이에요\n그 부위를 알고 채워주면 컨디션이 눈에 띄게 달라집니다", hidden2: "3월부터 자기 전 30분 일찍 잠들고 아침에 물 한 잔을 챙기면\n5월쯔음 몸이 한결 가벼워진 걸 체감하게 될 확률이 높습니다\n몸이 보내는 신호를 가볍게 넘기지 않는 것이 회복을 앞당기는 길입니다." },
    { category: "💪 건강", title: "병원 가면 괜찮다는데 계속 불편함", insight: "검사를 해도 별다른 이상은 없다는데\n몸은 계속 어딘가 불편한 느낌이 들어요", hidden1: "수치로는 안 보이지만 사주상으로는 분명한 신호가 있어요\n몸이 아니라 그 부위와 연결된 마음의 피로일 수 있어요\n그 연결을 알면 불편함의 진짜 이유가 보입니다", hidden2: "8월에 스트레스의 원인이 되는 일을 하나 정리하고 나면\n그 불편하던 증상도 같이 가벼워질 확률이 높습니다\n몸이 보내는 신호를 가볍게 넘기지 않는 것이 회복을 앞당기는 길입니다." },
    { category: "💰 돈", title: "투자만 하면 항상 타이밍이 안 좋음", insight: "남들 들어갈 때 빠지고\n내가 들어가면 항상 꺾이는 느낌이에요", hidden1: "그건 운이 없어서가 아니라 당신의 결정 타이밍에 흐름이 있어서예요\n지금까지는 그 타이밍을 거꾸로 타고 있었을 뿐이에요\n타이밍을 알면 같은 판단도 결과가 달라집니다", hidden2: "10월에 큰 결정을 내리기 전 한 주만 더 지켜보면\n그 다음 들어가는 타이밍에 수익을 볼 확률이 높습니다\n지금부터 작은 습관을 만들어두는 것이 그 흐름을 제대로 받는 핵심입니다." },
    { category: "💰 돈", title: "남보다 늦게 돈이 모이는 것 같음", insight: "친구들은 하나둘 자리 잡아가는데\n나는 항상 한 발 늦는 것 같아요", hidden1: "당신은 늦은 게 아니라 다른 속도로 쌓이는 사주예요\n초반엔 더디지만 후반에 크게 모이는 흐름이 있어요\n그 흐름을 알면 지금의 더딤이 더 이상 불안하지 않습니다", hidden2: "지금처럼 매달 일정 금액을 꾸준히 모으는 습관만 유지하면\n11월쯔음 한꺼번에 자산이 불어나는 걸 확인할 확률이 높습니다\n지금부터 작은 습관을 만들어두는 것이 그 흐름을 제대로 받는 핵심입니다." },
    { category: "💕 애정", title: "마음에 둔 사람이 있는데 다가가기 어려움", insight: "이 사람이다 싶은 사람이 있는데\n막상 다가가려면 자꾸 망설여져요", hidden1: "그 망설임은 거절이 두려운 게 아니라 신중한 성격 때문이에요\n다만 지금은 신중함보다 먼저 다가가야 하는 시기예요\n타이밍을 놓치면 아쉬움이 오래 남습니다", hidden2: "6월 안에 가벼운 약속 하나를 먼저 제안해보면\n생각보다 쉽게 그 사람도 응할 확률이 높습니다\n마음을 정직하게 표현하는 것이 그 흐름을 가장 크게 키우는 방법입니다." },
    { category: "💕 애정", title: "권태기처럼 마음이 식은 것 같음", insight: "예전 같은 설렘이 없어서\n이 관계가 맞는 건지 헷갈려요", hidden1: "설렘이 줄어든 건 사랑이 끝나서가 아니라 관계가 다음 단계로 넘어가는 신호예요\n다만 지금 그 신호를 잘못 해석하면 진짜 위기가 됩니다\n제대로 읽으면 관계가 더 단단해질 시기예요", hidden2: "7월에 평소와 다른 곳으로 짧은 여행을 한 번 다녀오면\n그걸 계기로 관계가 다시 따뜻해질 확률이 높습니다\n마음을 정직하게 표현하는 것이 그 흐름을 가장 크게 키우는 방법입니다." },
    { category: "🎯 성공", title: "남들보다 늦게 빛을 보는 느낌", insight: "같은 출발선이었던 사람들은 앞서가는데\n나는 아직 제자리인 것 같아요", hidden1: "당신은 늦은 게 아니라 늦게 터지는 사주예요\n초반에 쌓는 시간이 길수록 한 번 터질 때 크게 터집니다\n그 터지는 시점이 머지않아 옵니다", hidden2: "9월에 지금까지 쌓아온 걸 한 번에 보여줄 기회가 오는데\n그걸 놓치지 않고 잡으면 단번에 주목받을 확률이 높습니다\n지금의 작은 선택이 그 시기를 결정짓는 가장 중요한 요소입니다." },
    { category: "🎯 성공", title: "성공은 했는데 허전함이 큼", insight: "원하던 걸 이뤘는데\n생각보다 마음이 채워지지 않아요", hidden1: "그 허전함은 실패가 아니라 다음 단계로 넘어갈 준비가 됐다는 신호예요\n지금 이룬 것은 끝이 아니라 더 큰 흐름의 시작점이에요\n그 다음 흐름을 알면 허전함이 방향으로 바뀝니다", hidden2: "12월 전에 다음 목표를 구체적으로 하나 정해두면\n새해부터 그 허전함이 방향으로 바뀔 확률이 높습니다\n지금의 작은 선택이 그 시기를 결정짓는 가장 중요한 요소입니다." },
    { category: "💼 사업", title: "동업자와 자꾸 의견이 부딫힘", insight: "같은 목표인데\n방향만 얘기하면 자꾸 부딫혀요", hidden1: "그 갈등은 사이가 안 좋아서가 아니라 두 사람의 흐름이 서로 다른 시기에 있어서예요\n한 사람이 맞춰야 할 시기가 곧 옵니다\n그 시기를 알면 갈등이 자연스럽게 줄어듭니다", hidden2: "5월에 역할을 명확히 나누는 대화를 한 번 제대로 하면\n그 뒤로 부딫히는 일이 눈에 띄게 줄어들 확률이 높습니다\n숫자와 사람 관리를 동시에 챙기는 것이 그 흐름을 지키는 비결입니다." },
    { category: "💼 사업", title: "매출은 있는데 마음이 늘 불안함", insight: "숫자로 보면 나쁘지 않은데\n마음은 항상 불안하고 초조해요", hidden1: "그 불안은 숫자 때문이 아니라 다음 흐름이 안 보여서 생기는 거예요\n당신 사주에는 분명한 상승 구간이 예정돼 있어요\n그 구간을 알면 지금의 불안이 한결 가벼워집니다", hidden2: "8월부터 매출이 한 단계 더 오르는 흐름이 보이는데\n지금 약한 부분 하나만 정리해두면 그 상승을 제대로 받을 확률이 높습니다\n숫자와 사람 관리를 동시에 챙기는 것이 그 흐름을 지키는 비결입니다." },
    { category: "💍 결혼", title: "결혼은 했는데 자꾸 다투게 됨", insight: "서로 사랑해서 결혼했는데\n요즘 들어 부딫히는 일이 늘었어요", hidden1: "그 다툼은 사랑이 줄어서가 아니라 두 사람의 생활 흐름이 어긋나 있어서예요\n흐름이 다시 맞춰지는 시기가 곧 옵니다\n그때까지 버티는 방법을 알면 한결 수월해집니다", hidden2: "6월에 둘만의 시간을 따로 만들어 솔직하게 얘기를 나누면\n그 한 번의 대화로 흐름이 다시 맞춰질 확률이 높습니다\n서로의 속도를 존중하는 마음이 그 시기를 가장 안전하게 만듭니다." },
    { category: "💍 결혼", title: "상대 가족과의 관계가 부담스러움", insight: "결혼 자체는 좋은데\n양가 문제만 생각하면 마음이 무거워져요", hidden1: "그 부담은 당신이 부족해서가 아니라 아직 서로 익숙해지는 시간이 더 필요해서예요\n시간이 지나면 자연스럽게 풀리는 흐름이 사주에 보입니다\n지금 조급해하지 않는 게 가장 중요해요", hidden2: "추석 즈음 작은 안부 인사 하나를 먼저 건네면\n그걸 계기로 관계가 한결 편해질 확률이 높습니다\n서로의 속도를 존중하는 마음이 그 시기를 가장 안전하게 만듭니다." },
    { category: "🏢 직장", title: "상사와의 관계가 너무 힘듦", insight: "일은 할 만한데\n상사 때문에 매일이 스트레스예요", hidden1: "그 마찰은 당신의 잘못이 아니라 두 사람의 기질이 부딫히는 시기일 뿐이에요\n이 시기는 길게 가지 않고 곧 바뀌는 흐름이 보입니다\n그때까지 버티는 요령을 알면 훨씬 수월해집니다", hidden2: "10월쯔음 조직에 변화가 한 번 생기는데\n그 변화 이후로 지금의 마찰이 자연스럽게 줄어들 확률이 높습니다\n꾸준히 보여주는 모습이 그 시기를 앞당기는 가장 확실한 방법입니다." },
    { category: "🏢 직장", title: "지금 하는 일이 나와 안 맞는 것 같음", insight: "월급 때문에 다니긴 하는데\n이 일이 내 길이 맞나 자꾸 헷갈려요", hidden1: "그 의문은 적성이 없어서가 아니라 진짜 길이 따로 있다는 신호예요\n지금 일은 그 길로 가기 전 거쳐가는 과정일 수 있어요\n그 진짜 길이 보이는 시기가 머지않았습니다", hidden2: "7월에 관심 있던 분야를 작게 시도해보면\n그게 내년 진짜 방향이 되어줄 확률이 높습니다\n꾸준히 보여주는 모습이 그 시기를 앞당기는 가장 확실한 방법입니다." },
    { category: "👶 자녀", title: "아이와 대화가 점점 줄어듦", insight: "예전엔 이것저것 얘기했는데\n요즘은 대화가 점점 짧아져요", hidden1: "그건 사이가 멀어진 게 아니라 아이가 자기만의 시간이 필요한 시기에 들어선 거예요\n다가가는 방식을 조금만 바꾸면 다시 마음을 열어줍니다\n그 방식을 알면 관계가 다시 가까워집니다", hidden2: "5월에 잔소리 없이 그냥 옆에 같이 있어주는 시간을 늘리면\n여름방학쯔음 먼저 말을 걸어올 확률이 높습니다\n그 순간을 놓치지 않고 알아채는 것이 부모로서 가장 큰 역할입니다." },
    { category: "👶 자녀", title: "아이가 진로를 못 정해서 답답함", insight: "이제 정해야 할 시기인데\n아이가 계속 갈팡질팡해요", hidden1: "그건 아이가 게을러서가 아니라 아직 자기 강점을 못 찾았을 뿐이에요\n아이 사주에는 분명히 두드러지는 재능의 방향이 있어요\n그 방향을 알면 진로 고민이 훨씬 가벼워집니다", hidden2: "9월에 아이가 자연스럽게 몰입하는 활동을 지켜보고\n그 방향을 슬쩍 지지해주면 내년 봄 진로가 또렷해질 확률이 높습니다\n그 순간을 놓치지 않고 알아채는 것이 부모로서 가장 큰 역할입니다." },
    { category: "📖 학업", title: "공부는 하는데 동기부여가 안 됨", insight: "해야 하는 건 아는데\n막상 책상에 앉으면 마음이 안 잡혀요", hidden1: "그건 의지가 약해서가 아니라 지금 목표가 흐릿해서 생기는 현상이에요\n목표가 또렷해지는 시기가 곧 오고 있어요\n그 시기를 알면 동기부여가 자연스럽게 살아납니다", hidden2: "4월에 막연한 목표를 숫자로 구체화해서 적어보면\n5월부터 동기부여가 눈에 띄게 살아날 확률이 높습니다\n지금의 작은 실천이 그 결과를 만드는 가장 확실한 차이가 됩니다." },
    { category: "📖 학업", title: "전공이나 진로 선택이 고민됨", insight: "선택은 해야 하는데\n어느 쪽이 맞는지 확신이 안 서요", hidden1: "그 망설임은 우유부단해서가 아니라 두 길 모두 가능성이 있어서예요\n다만 당신 사주에는 더 유리하게 작동하는 방향이 분명히 있어요\n그 방향을 알면 선택이 훨씬 가벼워집니다", hidden2: "6월 전에 두 길 중 더 끌리는 쪽을 짧게 체험해보면\n그 경험이 확실한 답을 줄 확률이 높습니다\n지금의 작은 실천이 그 결과를 만드는 가장 확실한 차이가 됩니다." },
    { category: "💪 건강", title: "스트레스가 몸으로 자꾸 나타남", insight: "마음만 힘든 게 아니라\n몸에도 자꾸 증상이 나타나요", hidden1: "그건 약해서가 아니라 당신 사주에서 스트레스가 특정 부위로 모이는 흐름이 있어서예요\n그 부위를 알고 미리 관리하면 증상이 훨씬 줄어듭니다\n몸과 마음이 같이 회복되는 시기가 오고 있어요", hidden2: "3월부터 일주일에 두 번 가벼운 산책을 시작하면\n6월쯔음 증상이 눈에 띄게 줄어들 확률이 높습니다\n몸이 보내는 신호를 가볍게 넘기지 않는 것이 회복을 앞당기는 길입니다." },
    { category: "💰 돈", title: "부수입을 만들고 싶은데 뭘 해야할지 모름", insight: "월급 외에 뭔가 더 해보고 싶은데\n뭘 해야 할지 막막해요", hidden1: "당신 사주에는 부수입에 유리한 재능의 방향이 따로 있어요\n지금까지는 그 방향을 못 찾았을 뿐이에요\n방향을 알면 작게 시작해도 결과가 다릅니다", hidden2: "5월에 평소 잘한다고 들었던 일 하나를 작게 팔아보면\n가을쯔음 그게 꾸준한 부수입으로 자리잡을 확률이 높습니다\n지금부터 작은 습관을 만들어두는 것이 그 흐름을 제대로 받는 핵심입니다." },
    { category: "💕 애정", title: "재회를 생각하고 있음", insight: "헤어졌는데\n그 사람이 자꾸 생각나서 흔들려요", hidden1: "그 마음이 드는 데는 사주상 분명한 이유가 있어요\n다만 재회가 좋은 선택인지는 당신 사주의 흐름에 따라 달라요\n그 흐름을 알면 흔들리는 마음이 정리됩니다", hidden2: "9월에 그 사람과 다시 연락이 닿을 계기가 생기는데\n예전과 똑같은 방식으로 다가가지 않으면 이번엔 다르게 흘러갈 확률이 높습니다\n마음을 정직하게 표현하는 것이 그 흐름을 가장 크게 키우는 방법입니다." },
    { category: "🎯 성공", title: "주변의 기대가 부담스러움", insight: "잘할 거라는 기대를 많이 받는데\n그게 오히려 부담으로 느껴져요", hidden1: "그 부담은 당신이 약해서가 아니라 기대에 맞는 결과를 내는 시기가 따로 있어서예요\n지금은 그 시기로 가는 과정일 뿐이에요\n시기를 알면 부담이 압박이 아니라 동력이 됩니다", hidden2: "8월에 그 기대에 맞는 결과물이 하나 나오는데\n그걸 솔직하게 공유하면 부담이 응원으로 바뀔 확률이 높습니다\n지금의 작은 선택이 그 시기를 결정짓는 가장 중요한 요소입니다." },
    { category: "💼 사업", title: "확장을 해야 할지 유지를 해야 할지 고민됨", insight: "지금보다 키우고 싶은데\n무리하는 건 아닌지 계속 고민돼요", hidden1: "그 고민은 욕심이 아니라 신중한 판단력이에요\n다만 당신 사주에는 확장에 유리한 명확한 시기가 있어요\n그 시기 전후로 판단을 나누면 훨씬 안전합니다", hidden2: "10월 전까지 자금 여유를 확인해두고\n10월에 작은 규모로 먼저 확장해보면\n무리 없이 키워나갈 확률이 높습니다\n숫자와 사람 관리를 동시에 챙기는 것이 그 흐름을 지키는 비결입니다." },
    { category: "💍 결혼", title: "프러포즈나 결혼 시기를 못 정함", insight: "결혼할 사람이라는 확신은 있는데\n언제가 좋을지 시기를 못 정하고 있어요", hidden1: "그 망설임은 확신이 부족해서가 아니라 가장 좋은 시기를 본능적으로 기다리는 거예요\n당신 사주에는 결혼에 특히 유리한 시기가 따로 있어요\n그 시기를 알면 결정이 훨씬 쉬워집니다", hidden2: "11월에 두 사람 모두에게 여유가 생기는 시기가 오는데\n그때 날을 정하면 준비 과정이 유난히 순조로울 확률이 높습니다\n서로의 속도를 존중하는 마음이 그 시기를 가장 안전하게 만듭니다." },
    { category: "🏢 직장", title: "창업이나 독립을 고민하고 있음", insight: "회사를 나가서 내 일을 해보고 싶은데\n타이밍을 모르겠어요", hidden1: "그 고민은 무모해서가 아니라 독립에 유리한 시기를 본능적으로 기다리는 거예요\n당신 사주에는 독립이 유리하게 작동하는 시기가 분명히 있어요\n그 시기를 알면 결정이 훨씬 안전해집니다", hidden2: "내년 3월 전에 최소한의 자금과 거래처 하나를 미리 확보해두면\n독립한 첫 6개월을 안정적으로 넘길 확률이 높습니다\n꾸준히 보여주는 모습이 그 시기를 앞당기는 가장 확실한 방법입니다." },
    { category: "👶 자녀", title: "사춘기 자녀와 부딫히는 일이 많음", insight: "예전엔 순했던 아이가\n요즘은 자꾸 부딫히고 반항해요", hidden1: "그건 아이가 나빠진 게 아니라 자기 정체성을 찾아가는 자연스러운 과정이에요\n지금 방식으로 부딫히면 거리가 더 멀어질 수 있어요\n다른 접근 방식을 알면 갈등이 빠르게 줄어듭니다", hidden2: "7월에 잔소리를 한 박자 늦추고 질문으로 바꿔보면\n여름이 끝나갈 즈음 부딫히는 일이 줄어들 확률이 높습니다\n그 순간을 놓치지 않고 알아채는 것이 부모로서 가장 큰 역할입니다." },
    { category: "📖 학업", title: "유학이나 큰 도전을 고민하고 있음", insight: "더 큰 무대로 가고 싶은데\n확신이 안 서서 계속 미루고 있어요", hidden1: "그 망설임은 능력 부족이 아니라 큰 결정 앞에서 누구나 갖는 두려움이에요\n당신 사주에는 그 도전이 유리하게 작동하는 시기가 보입니다\n시기를 알면 망설임이 확신으로 바뀝니다", hidden2: "9월에 서류나 준비를 마무리해두면\n내년 초 도전이 시작될 때 빠르게 자리잡을 확률이 높습니다\n지금의 작은 실천이 그 결과를 만드는 가장 확실한 차이가 됩니다." },
    { category: "💪 건강", title: "수면 문제로 계속 피곤함", insight: "잠을 자도 푹 잔 느낌이 없고\n낮에도 계속 피곤해요", hidden1: "그건 단순히 체력 문제가 아니라 당신 사주에서 마음이 쉬지 못하는 흐름이 있어서예요\n생각이 많은 시기일수록 잠이 얕아지는 경향이 있어요\n그 흐름을 알면 수면의 질이 달라집니다", hidden2: "자기 전 휴대폰을 30분 먼저 내려놓는 습관을 4월부터 들이면\n6월쯔음 수면의 질이 눈에 띄게 달라질 확률이 높습니다\n몸이 보내는 신호를 가볍게 넘기지 않는 것이 회복을 앞당기는 길입니다." },
    { category: "💰 돈", title: "빚이나 대출 때문에 마음이 무거움", insight: "갚아야 할 게 있다는 게\n항상 마음 한구석을 무겁게 눌러요", hidden1: "그 무게는 능력이 없어서가 아니라 지금이 정리의 시기이기 때문이에요\n당신 사주에는 부담이 가벼워지는 흐름이 분명히 보입니다\n그 흐름을 알면 지금의 무게가 견딜만해집니다", hidden2: "5월에 갚는 순서를 금리 높은 것부터 다시 정리하면\n연말까지 부담이 눈에 띄게 가벼워질 확률이 높습니다\n지금부터 작은 습관을 만들어두는 것이 그 흐름을 제대로 받는 핵심입니다." },
    { category: "🎯 성공", title: "번아웃이 와서 의욕이 없음", insight: "예전엔 열정 넘쳤는데\n요즘은 뭘 해도 의욕이 안 생겨요", hidden1: "그건 게을러진 게 아니라 너무 오래 같은 방향으로 달려와서 생긴 자연스러운 신호예요\n지금은 잠시 멈추고 방향을 다시 점검할 시기예요\n그 점검이 끝나면 더 강한 의욕이 돌아옵니다", hidden2: "8월에 일주일 정도 제대로 쉬는 시간을 만들어두면\n9월부터 예전보다 더 강한 의욕이 돌아올 확률이 높습니다\n지금의 작은 선택이 그 시기를 결정짓는 가장 중요한 요소입니다." },
    { category: "💼 사업", title: "직원이나 거래처와의 신뢰 문제로 고민됨", insight: "믿고 맡겼는데\n결과가 기대와 달라서 자꾸 마음이 상해요", hidden1: "그 실망은 사람을 잘못 본 게 아니라 서로 신뢰를 쌓는 시기를 지나는 중이에요\n당신 사주에는 좋은 사람을 알아보는 안목이 강하게 작동하는 시기가 있어요\n그 시기를 알면 사람 문제가 훨씬 줄어듭니다", hidden2: "10월에 새로운 거래처나 직원을 들이게 되는데\n이번엔 안목이 정확하게 작동해 오래 갈 사람을 알아볼 확률이 높습니다\n숫자와 사람 관리를 동시에 챙기는 것이 그 흐름을 지키는 비결입니다." },
    { category: "💍 결혼", title: "비혼을 고민하고 있음", insight: "결혼이 꼭 필요한지\n요즘 자꾸 의문이 들어요", hidden1: "그 의문은 잘못된 게 아니라 당신만의 답을 찾아가는 과정이에요\n다만 당신 사주에는 결혼이 유리하게 작동하는 흐름도 분명히 존재해요\n그 흐름을 알면 더 확신 있는 선택을 할 수 있습니다", hidden2: "11월쯔음 마음이 한 방향으로 또렷하게 기우는 계기가 생기는데\n그 신호를 따라가면 어떤 선택이든 후회 없을 확률이 높습니다\n서로의 속도를 존중하는 마음이 그 시기를 가장 안전하게 만듭니다." },
    { category: "🏢 직장", title: "회사에서 입지가 점점 좁아지는 느낌", insight: "예전엔 내 자리가 분명했는데\n요즘은 점점 위치가 애매해지는 것 같아요", hidden1: "그건 능력이 떨어진 게 아니라 조직 안의 흐름이 바뀌는 과도기일 뿐이에요\n당신 사주에는 다시 입지를 단단히 다지는 시기가 보입니다\n그 시기를 알면 지금의 불안이 훨씬 가벼워집니다", hidden2: "6월에 작은 프로젝트 하나를 자원해서 맡으면\n9월쯔음 그 결과로 입지가 다시 단단해질 확률이 높습니다\n꾸준히 보여주는 모습이 그 시기를 앞당기는 가장 확실한 방법입니다." },
    { category: "👶 자녀", title: "임신이나 출산 시기를 고민하고 있음", insight: "아이는 갖고 싶은데\n지금이 맞는 시기인지 계속 고민돼요", hidden1: "그 고민은 망설임이 아니라 신중하게 준비하는 마음이에요\n당신 사주에는 특히 순조로운 흐름이 작동하는 시기가 따로 있어요\n그 시기를 알면 결정이 훨씬 편안해집니다", hidden2: "내년 봄까지가 특히 순조로운 흐름인데\n지금부터 몸과 마음을 미리 준비해두면 그 시기가 한결 편안할 확률이 높습니다\n그 순간을 놓치지 않고 알아채는 것이 부모로서 가장 큰 역할입니다." },
];

// 무료 분석에서 사용자가 직접 고른 카테고리(재물운/연애운/성공운/건강운 등)를
// "당신의 변화" 50개 템플릿의 카테고리로 매핑 — 완전 무작위 매칭으로 인해
// 기혼자에게 "비혼 고민" 같은 전혀 안 맞는 내용이 뜨는 문제를 줄임
const SELECTED_CAT_TO_CHANGE_CAT: Record<string, string> = {
  "💰 재물운": "💰 돈",
  "💕 연애운": "💕 애정",
  "🎯 성공운": "🎯 성공",
  "💪 건강운": "💪 건강",
};

function getYourChangeType(name: string, birthYear: string | number, birthMonth: string | number, birthDay: string | number, selectedCategory?: string, directInterest?: string | null) {
  const fullData = String(name) + String(birthYear) + String(birthMonth) + String(birthDay);
  let hash = 0;
  for (let i = 0; i < fullData.length; i++) hash += fullData.charCodeAt(i);
  hash += (parseInt(String(birthMonth)) || 0) * 7;
  hash += (parseInt(String(birthDay)) || 0) * 13;
  hash += (parseInt(String(birthYear)) || 0) * 3;

  // 사용자가 직접 고른 관심사(directInterest)가 가장 정확한 신호이고,
  // 없으면 분석 시작 시 선택한 카테고리(selectedCategory) 매핑을 시도함
  const mappedCat = directInterest ?? (selectedCategory ? SELECTED_CAT_TO_CHANGE_CAT[selectedCategory] : undefined);
  const pool = mappedCat ? YOUR_CHANGE_TYPES.filter(t => t.category === mappedCat) : YOUR_CHANGE_TYPES;
  const target = pool.length > 0 ? pool : YOUR_CHANGE_TYPES;

  // "오늘의 운세"는 매일 제공되는데 같은 사람·같은 카테고리면 항상 같은 템플릿만
  // 나오면 매일 봐도 똑같아서 이상함 — 날짜를 섞어 그날그날 풀 안에서 다음 템플릿으로
  // 하루씩 돌아가게 함(같은 날 안에서는 그대로 고정, 다음 날엔 자동으로 다른 템플릿)
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  return target[Math.abs(hash + daysSinceEpoch) % target.length];
}

// 문장이 길 때 카드 너비에 맞춰 CSS로만 줄바꿈을 맡기면 문장마다 길이가 달라
// 한쪽에 거의 다 차고 한 단어만 남는 식으로 들쭉날쭉해짐 — 그래서 일정 길이가
// 넘는 문장은 중간 지점에 가장 가까운 띄어쓰기에서 직접 잘라 두 줄로 강제 분리함
function splitLong(line: string, threshold = 22): string[] {
  if (line.length <= threshold) return [line];
  const mid = Math.floor(line.length / 2);
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === " ") {
      const dist = Math.abs(i - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    }
  }
  if (best === -1) return [line];
  return [line.slice(0, best), line.slice(best + 1)];
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
      // 카테고리명(이모지+공백 포함)을 ID에 넣으면 상세페이지 이동 시 URL 인코딩 문제로
      // 매칭이 깨지는 버그가 있었음 — 영문/숫자만 쓰는 안전한 ID로 변경 (충돌 방지는 유지)
      const id = `${r.histId}-${i}`;
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
  return (
    <Suspense fallback={null}>
      <V2ResultInner />
    </Suspense>
  );
}

function V2ResultInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // saving 상태(state)는 갱신이 비동기라 버튼을 빠르게 두 번 누르면 재진입 체크를
  // 통과해버려 저장이 중복 실행될 수 있음 — ref는 즉시 갱신되므로 이걸로 막음
  const savingRef = useRef(false);

  const [result, setResult] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [allAnalyses, setAllAnalyses] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [changeInterest, setChangeInterest] = useState<string | null>(null);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(SELECT_CATS.map(c => c.key));
  const [paidCats, setPaidCats] = useState<string[]>([]);
  const [selPlan, setSelPlan] = useState("vip");
  const [payBusy, setPayBusy] = useState(false);
  const [planType, setPlanType] = useState("");
  const [tier, setTier] = useState<"free" | "select" | "package">("free");
  const [pkgName, setPkgName] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const readChunksRef = useRef<string[]>([]);
  const readIdxRef = useRef(0);

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

  // 이 화면을 벗어나면(로그아웃, 뒤로가기 등) 읽어주기가 계속 돌아가지 않도록
  // 화면이 사라질 때 음성을 강제로 멈춤
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("v2_result");
    if (!raw) {
      // 다른 브라우저로 열어서 임시 저장소(세션)가 비어있는 경우 — 주소에
      // 공유 id(sid)가 같이 붙어왔다면, 처음부터 다시 분석하지 않고도
      // 그 결과를 그대로 볼 수 있는 공유 페이지로 대신 보내줌
      const sid = searchParams.get("sid");
      if (sid) { router.replace(`/main-v2/share/${sid}`); return; }
      router.replace("/main-v2/analysis");
      return;
    }
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

    // 결과를 서버에도 자동 저장해서, 브라우저를 바꿔도(예: 카카오톡 인앱
    // 브라우저 한계로 "다른 브라우저로 열기") 다시 분석하지 않고 그대로
    // 이어서 보고 읽을 수 있게 함 — 실패해도 화면 자체는 그대로 보이도록 조용히 무시
    (async () => {
      try {
        const shareCategories =
          !isPaid ? [{ icon: "🌟", label: "오늘의 운세", color: "#f59e0b", text: r.analysis ?? "" }]
          : isPackage
            ? (PKG_CAT_MAP[sessionStorage.getItem("selectedPackage") ?? ""] ?? PKG_CAT_MAP["기본 분석"])
                .filter(c => analyses[c.apiKey]).map(c => ({ icon: c.icon, label: c.label, color: c.color, text: analyses[c.apiKey], badge: "📦 패키지" }))
            : ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && cats.includes(c.key))
                .map(c => ({ icon: c.icon, label: c.key.replace(/\S+\s/, ""), color: c.color, text: analyses[c.key], badge: "💎 심층" }));
        const validCats = shareCategories.filter(c => c.text && c.text.trim());
        if (validCats.length === 0) return;
        const res = await fetch("/api/v2/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: r.profile?.name, scores: r.scores, luckyColor: r.luckyColor, luckyNumber: r.luckyNumber, luckyDirection: r.luckyDirection, categories: validCats, tier: isPackage ? "package" : isPaid ? "select" : "free", birthYear: r.profile?.birthYear }),
        });
        if (res.ok) {
          const data = await res.json();
          const sp = new URLSearchParams(window.location.search);
          sp.set("sid", data.id);
          router.replace(`${window.location.pathname}?${sp.toString()}`, { scroll: false });
        }
      } catch {}
    })();
  }, []);

  // "당신의 변화" 전체공개를 오늘 처음 보여주는 거라면, 그 사실을 localStorage에
  // 기록 — 렌더링 함수 안에서 직접 쓰지 않고 여기(useEffect)에서만 써야 함
  // 유료 "당신의 변화 — 전체공개" 카드도 무료 쪽과 똑같은 문제가 있었음 —
  // "이미 다 봤는지"를 렌더링마다 새로 읽으면, 이 효과가 방금 consumedKey를
  // "1"로 써버린 직후 다시 렌더링(읽기 등)될 때 카드가 사라져 보였음.
  // 그래서 이 페이지에 처음 들어왔을 때의 값(쓰기 전 값)을 스냅샷으로 고정해둠
  const [paidConsumedSnapshot, setPaidConsumedSnapshot] = useState<boolean | null>(null);
  useEffect(() => {
    const p = result?.profile;
    if (!p?.name || !p?.birthYear) return;
    if (tier !== "select" && tier !== "package") return;
    const interestOptions = ["💰 돈", "💕 애정", "🎯 성공", "💼 사업", "💍 결혼", "🏢 직장", "👶 자녀", "📖 학업", "💪 건강"];
    const todayKey = new Date().toDateString();
    const interestKey = `v2_change_interest_${p.name}_${p.birthYear}_${Number(p.birthMonth)}_${Number(p.birthDay)}_${todayKey}`;
    const consumedKey = `${interestKey}_consumed`;
    const savedInterest = localStorage.getItem(interestKey);
    const wasAlreadyConsumed = localStorage.getItem(consumedKey) === "1";
    setPaidConsumedSnapshot(wasAlreadyConsumed);
    if (savedInterest && interestOptions.includes(savedInterest) && !wasAlreadyConsumed) {
      localStorage.setItem(consumedKey, "1");
    }
  }, [tier, result]);

  // 무료의 "당신의 변화"가 "오늘 이미 받으셨어요" 상태인지를 렌더링 중에 매번
  // localStorage에서 새로 읽으면, 화면을 보여준 뒤 다른 동작(읽기 등)으로 다시
  // 렌더링될 때 카드 내용이 안내문구로 갑자기 바뀌어 보이는 문제가 있었음 —
  // 화면이 열릴 때 한 번만 확인해서 그 값을 그대로 유지하도록 고침
  const [freeConsumedSnapshot, setFreeConsumedSnapshot] = useState<boolean | null>(null);
  useEffect(() => {
    const p = result?.profile;
    if (!p?.name || !p?.birthYear) return;
    if (tier !== "free") return;
    const todayKey = new Date().toDateString();
    const interestKey = `v2_change_interest_${p.name}_${p.birthYear}_${Number(p.birthMonth)}_${Number(p.birthDay)}_${todayKey}`;
    const consumedKey = `${interestKey}_consumed`;
    setFreeConsumedSnapshot(localStorage.getItem(consumedKey) === "1");
  }, [tier, result]);

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
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const elements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (elements.length === 0) { alert("저장할 내용이 없습니다."); return; }
      if (window.innerWidth < 768) {
        const downloadCount = tier === "package" && elements.length > 1 ? elements.length - 1 : 1;
        alert(downloadCount > 1
          ? `📥 운세 ${downloadCount}개를 각각 따로 다운로드해야 해요!\n\n확인창이 뜨면 [다운로드]를 누르고, "다운로드 완료"가 뜬 후 다시 [다운로드]를 눌러주세요.\n\n한 번에 여러 번 누르지 말고 하나씩 순서대로 눌러주세요. 총 ${downloadCount}번 누르시면 끝나요.\n\n화면에 다운로드 알림이 고정되어 떠 있어요. 다운로드 안 하려면 [취소] 버튼을 누르면 돼요.`
          : "📥 잠시 후 '다운로드' 확인창이 뜨면 [다운로드]를 눌러주세요!");
      }
      // 카드마다 글자 길이가 달라 배율(scale)이 다르게 적용되면, 캡처된 캔버스 폭이
      // 서로 달라져서 합칠 때 한쪽에 빈 공간(세로 선처럼 보이는 경계)이 생김 —
      // 그래서 모든 카드에 동일한 배율을 적용하도록, 가장 긴 카드 기준으로 미리 계산해둠
      const maxScrollHeight = Math.max(...elements.map(el => el.scrollHeight));
      const sharedScale = maxScrollHeight > 6000 ? 1 : maxScrollHeight > 3000 ? 1.5 : 2;
      const canvases: HTMLCanvasElement[] = [];
      for (let elIdx = 0; elIdx < elements.length; elIdx++) {
        const el = elements[elIdx];
        const prevOv = el.style.overflow;
        const prevMH = el.style.maxHeight;
        const prevOvX = el.style.overflowX;
        el.style.overflow = "visible";
        el.style.overflowX = "hidden"; // 가로 스크롤바가 캡처될 때 세로 선처럼 보이는 것을 방지
        el.style.maxHeight = "none";
        // 맨 위 점수 요약 카드(index 0)는 노란 헤더가 둥근 모서리까지 차 있어서
        // 캡처 배경색도 똑같이 노란색으로 맞춰야 모서리에 흰색이 비치지 않음
        const captureBg = tier !== "package" ? "#ffffff" : (elIdx === 0 ? "#eab308" : "#fdf6e3");
        const c = await html2canvas(el, {
          backgroundColor: captureBg,
          scale: sharedScale,
          useCORS: true,
          logging: false,
          height: el.scrollHeight,
          windowWidth: 480,
          windowHeight: el.scrollHeight,
        });
        el.style.overflow = prevOv;
        el.style.overflowX = prevOvX;
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
        const failedLabels: string[] = [];
        canvases.slice(1).forEach((c, i) => {
          const label = pkgCats[i]?.label ?? `사주${i + 1}`;
          try {
            // 요약 카드 + 해당 카테고리 카드를 위아래로 이어붙인 새 캔버스를 만들어 저장.
            // 특정 카테고리(예: 건강운) 내용이 유난히 길면 합친 높이가 브라우저 캔버스
            // 한계를 넘어 조용히 실패(빈 이미지/다운로드 누락)할 수 있어서, 한계를
            // 넘으면 비율을 유지한 채 줄여서라도 안전하게 저장되도록 함
            const rawHeight = summary.height + 16 + c.height;
            const scale = rawHeight > MAX_CANVAS_HEIGHT ? MAX_CANVAS_HEIGHT / rawHeight : 1;
            const merged = document.createElement("canvas");
            merged.width = Math.round(Math.max(summary.width, c.width) * scale);
            merged.height = Math.round(rawHeight * scale);
            const ctx = merged.getContext("2d")!;
            ctx.fillStyle = "#fdf6e3";
            ctx.fillRect(0, 0, merged.width, merged.height);
            ctx.drawImage(summary, 0, 0, summary.width * scale, summary.height * scale);
            ctx.drawImage(c, 0, (summary.height + 16) * scale, c.width * scale, c.height * scale);
            downloadCanvas(merged, i, canvases.length - 1, label);
          } catch (e) {
            console.error(`이미지 저장 실패(${label}):`, e);
            failedLabels.push(label);
          }
        });
        if (failedLabels.length > 0) alert(`다음 항목은 이미지 저장에 실패했습니다: ${failedLabels.join(", ")}`);
        else setTimeout(() => alert(`✅ ${window.innerWidth < 768 ? "사진 앱(갤러리)" : "다운로드 폴더"}에 저장됐어요!`), 0);
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
            ctx.fillText(`🐱 점운 · AI 사주 분석 (${gi + 1}/${groups.length})`, merged.width / 2, headerH / 2);
            y = headerH;
          }
          for (const c of group) {
            ctx.drawImage(c, 0, y);
            y += c.height + 16;
          }
          downloadCanvas(merged, gi, groups.length);
        });
      }
      setTimeout(() => alert(`✅ ${window.innerWidth < 768 ? "사진 앱(갤러리)" : "다운로드 폴더"}에 저장됐어요!`), 0);
    } catch (e) {
      console.error("이미지 저장 실패:", e);
      alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const share = async () => {
    if (!result) return;
    let url = window.location.origin + "/main-v2";
    let extra = "";
    if (tier === "package" && result.profile?.birthYear) {
      const ganList = ["갑","을","병","정","무","기","경","신","임","계"];
      const y = Number(result.profile.birthYear);
      const gan = ganList[((y - 4) % 10 + 10) % 10];
      extra = `\n${gan} 천간을 타고난 사주 심층 분석 결과예요 🪬`;
    }
    // 공유받은 사람도(다른 휴대폰/브라우저) 실제 결과를 볼 수 있게, 공유하는
    // 순간 보이는 내용을 서버에 저장하고 그 고유 주소를 공유함 — 저장이
    // 실패해도 공유 자체는 막지 않고 그냥 메인 주소로 대체함
    try {
      // 화면에 보이는 카테고리별 색/아이콘까지 그대로 살려서 공유본도 똑같이 구분되어 보이게 함
      const categories =
        tier === "free" ? [{ icon: "🌟", label: "오늘의 운세", color: "#f59e0b", text: freeAnalysis }]
        : tier === "select" ? ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key))
            .map(c => ({ icon: c.icon, label: c.key.replace(/\S+\s/, ""), color: c.color, text: allAnalyses[c.key], badge: "💎 심층" }))
        : (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["기본 분석"])
            .filter(c => allAnalyses[c.apiKey])
            .map(c => ({ icon: c.icon, label: c.label, color: c.color, text: allAnalyses[c.apiKey], badge: "📦 패키지" }));
      const validCategories = categories.filter(c => c.text && c.text.trim());
      if (validCategories.length > 0) {
        const res = await fetch("/api/v2/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: result.profile?.name,
            scores: result.scores, luckyColor: result.luckyColor, luckyNumber: result.luckyNumber, luckyDirection: result.luckyDirection,
            categories: validCategories, tier, birthYear: result.profile?.birthYear,
          }),
        });
        if (res.ok) { const data = await res.json(); url = `${window.location.origin}/main-v2/share/${data.id}`; }
      }
    } catch {}
    const text = `${result.profile?.name}님의 운세 분석 🔮\n총운 ${result.scores?.total}점${extra}\n\n📱 나도 무료로!`;
    if (navigator.share) navigator.share({ title: "점운 운세 결과", text, url }).catch(() => {});
    else navigator.clipboard.writeText(`${text}\n${url}`).then(() => alert("✅ 링크 복사됨!"));
  };

  if (!result) return null;

  const { scores, luckyColor, luckyNumber, luckyDirection, profile } = result;
  const freeAnalysis: string = result.analysis ?? "";

  // 결과 읽어주기 — 브라우저 내장 음성합성(Web Speech API)이라 별도 비용/설치 없음.
  // 긴 글을 한 번에 읽히면 일부 브라우저(특히 크롬)에서 중간에 끊기는 경우가
  // 있어서, 문장 단위로 잘라 차례로 읽게 함(끊겨도 다음 문장부터 이어짐).
  // 멈춘 위치는 readChunksRef/readIdxRef에 저장해두고, 같은 화면에서 다시
  // 누르면 그 위치부터 이어서 읽음 — 화면을 벗어나면 컴포넌트가 다시 마운트
  // 되면서 이 값들도 초기화되므로, 재진입 시엔 자연히 처음부터 읽힘
  // 일부 기기(특히 안드로이드)는 음성 목록이 비동기로 늦게 로드되어, 그 전에
  // speak()를 호출하면 에러도 없이 그냥 소리가 안 나는 경우가 있음 — 목록이
  // 채워지길 잠깐 기다렸다가(최대 1초) 한국어 음성을 찾아서 명시적으로 지정함
  const getKoreanVoice = (): Promise<SpeechSynthesisVoice | null> => {
    return new Promise(resolve => {
      const pick = (list: SpeechSynthesisVoice[]) => list.find(v => v.lang?.toLowerCase().startsWith("ko")) || null;
      const existing = window.speechSynthesis.getVoices();
      if (existing.length > 0) { resolve(pick(existing)); return; }
      const timer = setTimeout(() => resolve(pick(window.speechSynthesis.getVoices())), 1000);
      window.speechSynthesis.onvoiceschanged = () => {
        clearTimeout(timer);
        resolve(pick(window.speechSynthesis.getVoices()));
      };
    });
  };

  const speakFrom = async (chunks: string[], startIdx: number) => {
    const voice = await getKoreanVoice();
    chunks.slice(startIdx).forEach((chunk, i) => {
      const idx = startIdx + i;
      const utter = new SpeechSynthesisUtterance(chunk);
      utter.lang = "ko-KR";
      if (voice) utter.voice = voice;
      utter.rate = 1;
      utter.onstart = () => { readIdxRef.current = idx; };
      utter.onerror = (e) => {
        setSpeaking(false);
        readChunksRef.current = [];
        readIdxRef.current = 0;
        // 사용자가 멈추기를 눌러서 취소된 경우에도 onerror가 호출되는데, 이건
        // 실패가 아니라 정상적인 중단이라 안내문을 띄우면 안 됨
        if (e.error === "canceled" || e.error === "interrupted") return;
        // 진짜 실패일 때는 이미 대기열에 들어가 있는 나머지 문장들도 전부
        // 멈춰야 함 — 안 그러면 "멈추기"를 눌러도 계속 읽히는 것처럼 보임
        window.speechSynthesis.cancel();
        alert("이 기기에서는 읽어주기가 원활하지 않아요.\n휴대폰 설정에서 음성 합성(텍스트 읽어주기) 기능과 한국어 음성이 설치되어 있는지 확인해주세요.");
      };
      if (idx === chunks.length - 1) {
        utter.onend = () => {
          setSpeaking(false);
          readIdxRef.current = 0;
          readChunksRef.current = [];
        };
      }
      window.speechSynthesis.speak(utter);
    });
  };

  const toggleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("카카오톡 등 앱 안에서는 화면 오른쪽 아래 점 세 개(⋮) 버튼을 누르고 [다른 브라우저로 열기]를 선택한 다음 읽기를 누르면 읽어주기 기능이 작동합니다.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (readChunksRef.current.length === 0) {
      // 화면에 실제로 보이는 내용만 정확히 읽게 함 — allAnalyses 안에는 "오늘의
      // 운세"(미리보기용, 결제 화면엔 안 보임) 항목도 같이 섞여있어서, 그걸 그대로
      // 다 읽으면 결제한 진짜 내용 대신 "오늘의 운세"만 계속 읽히는 문제가 있었음
      const visibleTexts =
        tier === "free" ? [freeAnalysis]
        : tier === "select" ? ALL_SCORE_CATS.filter(c => c.key !== FREE_CAT && paidCats.includes(c.key)).map(c => allAnalyses[c.key])
        : (PKG_CAT_MAP[pkgName] ?? PKG_CAT_MAP["기본 분석"]).filter(c => allAnalyses[c.apiKey]).map(c => allAnalyses[c.apiKey]);
      // 이모지는 음성합성기가 "반짝이는 별" 같은 설명으로 읽어버려서 제거하고,
      // "9~12월"이나 "06시~12시"처럼 숫자 사이에 물결표(~)가 있으면 그걸 "물결"
      // 이라고 그대로 읽어버려서 "9월에서 12월"/"06시에서 12시"처럼 자연스럽게
      // 읽히도록 미리 바꿔둠(화면 표시는 그대로, 음성으로만 들어가는 텍스트만 변환).
      // 숫자와 무관한 ~는 건드리지 않음
      const fullText = visibleTexts.filter(Boolean).join("\n")
        .replace(/(\d+)\s*~\s*(\d+)\s*(시|월|일|년|분|초|회|번|개|세)/g, "$1$3에서 $2$3")
        .replace(/(\d+[가-힣]{0,2})\s*~\s*(?=\d)/g, "$1에서 ")
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}\u{FE0F}]/gu, "")
        // 한글 단어 뒤 한자 괄호(예: "양기(陽氣)")는 음성합성기가 한글과 한자를
        // 둘 다 읽어서 "양기 양기"처럼 중복으로 들리므로, 괄호 속 한자는 통째로 제거
        // (전각 괄호 （） 도 같이 처리)
        .replace(/[（(][一-鿿]+[）)]/g, "")
        // 반대로 한자 뒤에 한글 발음 괄호(예: "水(수)")가 오는 경우도 똑같이
        // 중복으로 읽히므로, 앞의 한자는 빼고 괄호 속 한글 발음만 남김
        .replace(/[一-鿿]+[（(]([가-힣]+)[）)]/g, "$1")
        // 글 중간의 ×는 "곱하기"로 읽혀서 어색하므로, 나열 의미인 "와"로 바꿔서 읽음
        .replace(/×/g, " 와 ");
      if (!fullText.trim()) return;
      readChunksRef.current = fullText.split(/(?<=[.!?。\n])\s*/).map(s => s.trim()).filter(Boolean);
      readIdxRef.current = 0;
    }
    window.speechSynthesis.cancel();
    speakFrom(readChunksRef.current, readIdxRef.current);
    setSpeaking(true);
  };

  return (
    <main style={{ minHeight: "100vh", backgroundImage: `url('https://i.pinimg.com/1200x/18/97/18/189718a8189930b86d2088d7f1250c2c.jpg'), ${BG}`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>

      {/* 결과 읽어주기 — 어디로 스크롤하든 항상 누를 수 있게 고정 */}
      <button onClick={toggleReadAloud}
        style={{ position: "fixed", right: 16, bottom: 24, zIndex: 200, display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 50, border: "none", background: speaking ? "linear-gradient(135deg, #ef4444, #f97316)" : G, color: "white", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}>
        {speaking ? "⏹ 멈추기" : "🔊 읽어주기"}
      </button>

      {/* 헤더 */}
      <header style={{ minHeight: 52, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", rowGap: 6, columnGap: 6, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(236,72,153,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/main-v2")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>←</span>
          <span style={{ fontSize: 14, fontWeight: 900, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>🐱 점운</span>
        </button>
        <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
          <button onClick={() => router.push("/main-v2/history")} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            📂 보관함
          </button>
          <button onClick={share} style={{ padding: "5px 12px", background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>
            📱 공유
          </button>
          {paid && planType !== "select" && (
            <button onClick={saveImage} disabled={saving} style={{ padding: "5px 12px", background: "#ede9fe", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, fontWeight: 700, fontSize: 11, cursor: saving ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
              {saving ? "⏳..." : "🖼️ 저장"}
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* ── 점수 요약 카드 ── */}
        <div
          ref={el => { cardRefs.current[0] = el; }}
          style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(236,72,153,0.1)", marginBottom: 12, overflow: "hidden" }}
        >
          <div style={{ background: tier === "package" ? "#eab308" : G, color: tier === "package" ? "#3a2a00" : "white", textAlign: "center", borderRadius: "22px 22px 0 0" }}>
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

        {/* ── 무료/990원: 사주팔자 맛보기 (띠+오행만, 천간은 패키지에서만 공개) ── */}
        {(tier === "free" || tier === "select") && profile?.birthYear && (() => {
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
            <div style={{ background: "#fdf6e3", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
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
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
                {freeAnalysis}
              </p>
            </div>
          </div>
        )}

        {/* ── 당신의 변화 ── 원래 목적은 "무료 결과를 본 사람에게 결제를 유도"하는 것뿐이라,
             이미 결제한 사람에게는 더 이상 보여줄 이유가 없음(결제 직행도 마찬가지 — 유도할
             대상이 아예 아니었으므로 칩도 안 보여줌). 그래서:
             - 무료(tier=free): 항상 칩 선택 → 고르면 hidden2를 블러+결제 유도 버튼으로 보여줌
             - 유료(select/package): 무료에서 실제로 골랐던 적이 있는 사람한테만, 결제 후
               딱 한 번 전체 공개로 보여주고(보너스 성격), 그 다음부터는(같은 사람 재구매 포함)
               다시 보여주지 않음. 결제 직행(고른 적 없음)은 섹션 자체를 표시하지 않음 */}
        {(tier === "free" || tier === "select" || tier === "package") && profile?.name && profile?.birthYear && (() => {
          const locked = tier === "free";
          const interestOptions = ["💰 돈", "💕 애정", "🎯 성공", "💼 사업", "💍 결혼", "🏢 직장", "👶 자녀", "📖 학업", "💪 건강"];
          // main-v2/profile(무료)은 월/일을 "05"처럼 0패딩해서 저장하고 paid-info-input(결제
          // 직행)은 "5"처럼 패딩 없이 저장해서, 같은 사람·같은 생일이어도 키가 안 맞을 수 있어
          // 숫자로 정규화해서 비교. 날짜를 키에 포함시켜 "오늘 하루"만 유지되고
          // 다음 날 새로 무료 분석을 하면 다시 한 번 보여주도록 자동 초기화되게 함
          const todayKey = new Date().toDateString();
          const interestKey = `v2_change_interest_${profile.name}_${profile.birthYear}_${Number(profile.birthMonth)}_${Number(profile.birthDay)}_${todayKey}`;
          const consumedKey = `${interestKey}_consumed`;

          if (locked) {
            // 오늘 이미 결제로 전체공개를 받은 적이 있으면, 무료 쪽에서 또 칩을 고르고
            // 결제해도 더 안 보여줄 거라서 — 헷갈리지 않게 칩/결제유도 대신 안내만 보여줌
            const alreadyConsumedToday = freeConsumedSnapshot === true;
            if (alreadyConsumedToday) {
              return (
                <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden", padding: "18px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#f97316", margin: "0 0 6px" }}>🎁 오늘의 "당신의 변화"는 이미 받으셨어요<br />내일 다시 만나요!</p>
                  <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, margin: 0 }}>✨ 당신의 변화는 하루에 한 번만 만나볼 수 있는<br/>특별한 메시지예요</p>
                </div>
              );
            }
            // 오늘 이미 칩을 한 번 고른 적이 있으면(아직 결제 전), 다시 들어와도 또
            // 고르라고 하지 않고 그 선택을 그대로 이어서 보여줌 — 결제 전까지는
            // 블러+결제유도 화면이 계속 유지됨
            const savedInterestToday = typeof window !== "undefined" ? localStorage.getItem(interestKey) : null;
            const directInterest = changeInterest
              ?? (savedInterestToday && interestOptions.includes(savedInterestToday) ? savedInterestToday : null);
            if (!directInterest) {
              return (
                <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden" }}>
                  <div style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1a1a", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🎯 {profile.name}님의 변화</div>
                  <div style={{ padding: "16px 18px 20px" }}>
                    <p style={{ fontSize: 13, color: "#374151", fontWeight: 700, margin: "0 0 12px", textAlign: "center" }}>지금 가장 궁금한 게 있다면 골라보세요</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {interestOptions.map(opt => (
                        <button key={opt} onClick={() => { localStorage.setItem(interestKey, opt); setChangeInterest(opt); }}
                          style={{ padding: "10px 4px", borderRadius: 10, border: "1.5px solid #fbbf24", background: "#fffbeb", color: "#92400e", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay, undefined, directInterest);
            return (
              <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden" }}>
                <div style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1a1a", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🎯 {profile.name}님의 변화</div>
                <div style={{ padding: "16px 18px 20px" }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 800, margin: "0 0 6px" }}>{yc.category}</p>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px", borderBottom: "2px solid #fbbf24", paddingBottom: 8 }}>✨ {yc.title}</h3>
                  <div style={{ margin: "0 0 12px" }}>
                    {yc.insight.split("\n").flatMap(splitLong).map((line, i) => (
                      <p key={i} style={{ fontSize: 12.5, color: "#374151", fontWeight: 700, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{i === 0 ? `"${line}` : line}</p>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#f59e0b", fontWeight: 900, margin: "0 0 6px" }}>🎯 당신의 변화</p>
                  <div style={{ margin: "0 0 12px" }}>
                    {yc.hidden1.split("\n").flatMap(splitLong).map((line, i) => (
                      <p key={i} style={{ fontSize: 12.5, color: "#374151", fontWeight: 600, lineHeight: 1.6, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{line}</p>
                    ))}
                  </div>
                  <div style={{ background: "rgba(255,215,0,0.12)", borderRadius: 10, padding: "10px 12px", filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
                    <p style={{ fontSize: 10, color: "#d4af37", fontWeight: 800, margin: "0 0 6px" }}>🔮 990원 결제 시 공개</p>
                    {yc.hidden2.split("\n").flatMap(splitLong).map((line, i) => (
                      <p key={i} style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 700, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{line}</p>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 800, margin: "12px 0 0", textAlign: "center", fontStyle: "italic" }}>👉 {profile.name}님의 정확한 변화 시점과<br/>구체적인 실행법이 <span style={{ display: "inline-block", background: "#ec4899", color: "white", fontWeight: 900, fontStyle: "normal", padding: "2px 10px", borderRadius: 8, margin: "0 2px" }}>990원 결제</span> 시 모두 공개됩니다</p>
                  <button onClick={() => router.push("/main-v2/payment?scrollTo=select")} style={{ width: "100%", marginTop: 14, padding: "13px 0", background: "linear-gradient(135deg, #ff1493, #ff69b4)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 13, cursor: "pointer" }}>💎 {yc.category} 완벽 공략법 보기</button>
                </div>
              </div>
            );
          }

          // 유료: 무료에서 실제로 고른 적이 있어야만, 그리고 아직 한 번도 안 보여줬을 때만 노출.
          // "다 봤다"는 표시는 별도의 useEffect에서 하고(아래 참고) 여기서는 읽기만 함 —
          // 렌더링 중에 직접 localStorage.setItem을 하면 리액트가 순수성 검사를 위해
          // 렌더를 두 번 호출할 때 두 번째 호출에서 "이미 다 봤음"으로 읽혀서 바로
          // 사라져 보이는 버그가 있었음
          const savedInterest = typeof window !== "undefined" ? localStorage.getItem(interestKey) : null;
          const alreadyConsumed = paidConsumedSnapshot === true;
          if (!savedInterest || !interestOptions.includes(savedInterest) || alreadyConsumed) return null;
          const yc = getYourChangeType(profile.name, profile.birthYear, profile.birthMonth, profile.birthDay, undefined, savedInterest);
          return (
            <div style={{ background: "white", borderRadius: 24, border: "1.5px solid rgba(255,215,0,0.4)", marginBottom: 12, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#1a1a1a", padding: "12px 18px", fontSize: 13, fontWeight: 900 }}>🎯 {profile.name}님의 변화 — 전체 공개</div>
              <div style={{ padding: "16px 18px 20px" }}>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 800, margin: "0 0 6px" }}>{yc.category}</p>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px", borderBottom: "2px solid #fbbf24", paddingBottom: 8 }}>✨ {yc.title}</h3>
                <div style={{ margin: "0 0 12px" }}>
                  {yc.insight.split("\n").flatMap(splitLong).map((line, i) => (
                    <p key={i} style={{ fontSize: 12.5, color: "#374151", fontWeight: 700, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{i === 0 ? `"${line}` : line}</p>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "#f59e0b", fontWeight: 900, margin: "0 0 6px" }}>🎯 당신의 변화</p>
                <div style={{ margin: "0 0 12px" }}>
                  {yc.hidden1.split("\n").flatMap(splitLong).map((line, i) => (
                    <p key={i} style={{ fontSize: 12.5, color: "#374151", fontWeight: 600, lineHeight: 1.6, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{line}</p>
                  ))}
                </div>
                <div style={{ background: "rgba(255,215,0,0.12)", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 10, color: "#d4af37", fontWeight: 800, margin: "0 0 6px" }}>🔮 구체적인 변화 시점</p>
                  {yc.hidden2.split("\n").flatMap(splitLong).map((line, i) => (
                    <p key={i} style={{ fontSize: 13, color: "#1a1a2e", fontWeight: 700, margin: "0 0 4px", wordBreak: "keep-all", overflowWrap: "break-word" }}>{line}</p>
                  ))}
                </div>
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
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
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
              style={{ background: "#fdf6e3", borderRadius: 24, border: "1.5px solid rgba(217,180,80,0.45)", marginBottom: 12, boxShadow: "0 2px 14px rgba(217,180,80,0.12)" }}>
              <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid rgba(217,180,80,0.18)", background: "linear-gradient(90deg, rgba(217,180,80,0.10), transparent)" }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#1a1a2e" }}>{c.label}</span>
                <span style={{ fontSize: 10, background: G_PREMIUM, color: "white", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>📦 패키지</span>
                {c.apiKey === "💍 결혼·궁합운" && (
                  <span style={{ fontSize: 10, background: "#fdf2f8", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)", padding: "2px 9px", borderRadius: 20, fontWeight: 800 }}>💞 궁합 {scores?.total ?? 0}%</span>
                )}
              </div>
              <div style={{ padding: "14px 18px 20px" }}>
                <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap", wordBreak: "keep-all", overflowWrap: "anywhere" }}>
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
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.18)" }}>
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

        {/* ── 990원: 공유하기 + 유료 결제하기 + 다시 분석 + 보관함 저장 ── */}
        {tier === "select" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <button onClick={share}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.18)" }}>
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
                style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1.5px solid rgba(139,92,246,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.15)" }}>
                🔮 다시 분석
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/history")}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: "#4338ca", border: "1.5px solid rgba(99,102,241,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(99,102,241,0.18)" }}>
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
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d", border: "1.5px solid rgba(236,72,153,0.3)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(236,72,153,0.18)" }}>
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
                style={{ width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6d28d9", border: "1.5px solid rgba(139,92,246,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 12, cursor: "pointer", boxShadow: "0 2px 10px rgba(139,92,246,0.15)" }}>
                🔮 다시 분석
              </button>
            </div>
            <div style={{ marginBottom: 10 }}>
              <button onClick={() => router.push("/main-v2/history")}
                style={{ width: "100%", padding: "13px 0", background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)", color: "#4338ca", border: "1.5px solid rgba(99,102,241,0.35)", borderRadius: 50, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 10px rgba(99,102,241,0.18)" }}>
                📥 보관함 저장
              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <button onClick={saveImage} disabled={saving}
                style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 50, fontWeight: 900, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.3)", opacity: saving ? 0.7 : 1 }}>
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
