import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

const PART_LABELS: Record<string, string> = {
  friend: "친구",
  love: "연인",
  ex: "전애인",
  some: "썸·바람 상대",
  work: "직장 사람",
  family: "가족",
  travel: "여행 동행자",
};

type CatType = {
  name: string; emoji: string; color: string; min: number;
  tagline: string; desc: string; advice: string;
  pastPattern: string; warningSigns: string[]; recoveryTip: string;
  futureForecast: string; actionPlan: string[]; darkSide: string;
  breakupStyle: string; celebTwin: string;
};

const TYPES: CatType[] = [
  { name: "칼단호 고양이", emoji: "🗡️", color: "#ef4444", min: 88, tagline: "정 없는 게 아니라 판단이 빠른 것", desc: "이미 마음속에서는 결론이 났어요. 미련이나 재고의 여지 없이 칼같이 정리하는 타입이에요.", advice: "가끔은 단호함이 관계를 지키는 힘이 되기도 하지만, 너무 성급하게 끊어내진 않았는지 한 번쯤 돌아보는 것도 좋아요.",
    pastPattern: "어릴 때부터 애매한 관계에 에너지 뺏기는 걸 극도로 싫어했던 경험이 쌓여서, 정리는 빠를수록 좋다는 확신이 생겼어요.",
    warningSigns: ["상대 얘기만 나와도 표정이 굳는다", "이미 마음속으로 결론 내렸으면서 말은 안 한다", "주변에서 '너무 매정한 거 아니냐'는 말을 듣는다"],
    recoveryTip: "정말 놓치기 아까운 사람이라면, 손절 버튼을 누르기 전에 딱 한 번만 '왜 이렇게까지 됐는지' 상대에게 직접 물어보는 걸 추천해요.",
    futureForecast: "앞으로 3개월, 이미 정리 대상으로 찍힌 관계는 자연스럽게 연락이 끊길 가능성이 높아요. 다만 정리 속도가 너무 빨라 좋은 인연까지 놓칠 수 있으니 주의가 필요해요.",
    actionPlan: ["손절 결정 전 24시간 유예 시간 가져보기", "정말 중요한 사람 리스트 3명만 예외로 남겨두기", "감정적 결정인지 이성적 결정인지 한 번 더 점검하기"],
    darkSide: "한계를 넘으면 '한 번 손절 명단에 오르면 절대 복구 불가' 모드가 돼요. 사과를 해도, 시간이 지나도 마음의 문을 다시 안 열어줘서 주변 사람들이 서운해하는 경우가 많아요.",
    breakupStyle: "구구절절 설명하지 않아요. 연락을 끊거나 '우리 그만 보자' 한 마디로 정리하고, 뒤돌아보지 않는 스타일이에요.",
    celebTwin: "냉철하게 판결을 내리는 법정 드라마 속 원칙주의 판사 캐릭터랑 닮았어요. 감정에 흔들리지 않고 팩트로 정리하는 타입이죠." },
  { name: "쿨거리 고양이", emoji: "😎", color: "#f97316", min: 76, tagline: "감정 소모는 딱 질색, 쿨하게 거리두기", desc: "손절까지는 아니어도 스스로를 지키기 위해 자연스럽게 거리를 두는 스타일이에요. 티는 안 나지만 마음은 이미 반쯤 정리됐어요.", advice: "쿨한 거리두기도 좋지만, 정말 소중한 관계라면 한 번쯤은 솔직한 대화를 시도해보세요.",
    pastPattern: "감정 소모가 심했던 관계에서 크게 데인 경험이 있어서, 미리 거리를 두는 게 나를 지키는 방법이라는 걸 체득했어요.",
    warningSigns: ["연락 빈도가 자연스럽게 줄고 있다", "만나도 예전만큼 이야기가 깊어지지 않는다", "그 사람 얘기를 할 때 감정 기복이 거의 없다"],
    recoveryTip: "거리를 두는 것 자체는 나쁘지 않지만, 정말 소중한 사람이라면 '쿨한 척' 대신 솔직한 감정을 한 번쯤 표현해보는 게 관계를 살릴 수 있어요.",
    futureForecast: "지금처럼 거리를 유지하면 3개월 뒤엔 자연스럽게 남처럼 멀어질 가능성이 커요. 관계를 유지하고 싶다면 지금이 마지막 타이밍일 수 있어요.",
    actionPlan: ["이번 주 안에 그 사람에게 먼저 안부 연락 한 번 해보기", "거리를 두는 진짜 이유를 스스로 적어보기", "정말 놓고 싶은 관계인지 다시 한 번 점검하기"],
    darkSide: "극단으로 가면 상대가 눈치채지도 못하게 서서히 증발하는 '고스팅'에 가까워져요. 정리했다는 티도 안 내고 그냥 사라지는 식이라 상대는 영문도 모른 채 남겨져요.",
    breakupStyle: "굳이 이별 통보를 하지 않아요. 답장이 느려지고, 약속을 자연스럽게 줄이면서 서서히 존재감을 지우는 방식으로 정리해요.",
    celebTwin: "츤데레 재벌 3세 드라마 캐릭터 같아요. 겉으론 차갑고 무심해 보이지만 사실 나름의 기준으로 사람을 재고 있는 타입이에요." },
  { name: "선긋기 고양이", emoji: "📏", color: "#eab308", min: 64, tagline: "관계에도 선이 필요하다는 걸 아는 사람", desc: "완전히 손절하진 않지만 넘지 말아야 할 선은 확실히 긋는 타입이에요. 균형 감각이 좋은 편이에요.", advice: "선을 긋는 것과 마음을 닫는 것은 다르다는 걸 기억하세요. 필요할 땐 선을 조금 넓혀줘도 괜찮아요.",
    pastPattern: "관계에서 선을 안 지켰다가 크게 상처받은 경험 때문에, 이제는 처음부터 명확한 기준을 정해두는 게 습관이 됐어요.",
    warningSigns: ["상대가 선을 넘으면 즉시 표정이나 태도가 달라진다", "'거기까지만' 이라는 말을 자주 쓴다", "예외를 잘 두지 않는 원칙주의 성향이 있다"],
    recoveryTip: "선을 긋는 건 좋은 습관이지만, 정말 가까워지고 싶은 사람에게는 가끔 그 선을 조금 낮춰주는 유연함도 필요해요.",
    futureForecast: "지금의 균형을 잘 유지하면 3개월 뒤에도 무리 없이 관계를 이어갈 수 있어요. 다만 너무 자주 선을 그으면 상대가 거리감을 느껴 멀어질 수 있어요.",
    actionPlan: ["이번 주엔 선 하나를 의도적으로 살짝 넘겨보기", "왜 이 선이 필요한지 상대에게 설명해주기", "정말 지켜야 할 선과 융통성 있어도 되는 선 구분해보기"],
    darkSide: "극단으로 가면 모든 관계에 계약서 쓰듯 조건을 다는 사람이 돼요. 융통성이 완전히 사라지면 주변 사람들이 부담스러워하고 하나둘 떠나갈 수 있어요.",
    breakupStyle: "감정적으로 폭발하지 않아요. '여기까지가 내 선이다'라고 조용히 통보하고, 그 선을 지키지 않으면 미련 없이 관계를 정리해요.",
    celebTwin: "회사에서 원칙과 매뉴얼을 칼같이 지키는 대기업 팀장 캐릭터랑 비슷해요. 공과 사를 확실히 구분하는 타입이죠." },
  { name: "눈치백단 고양이", emoji: "👀", color: "#84cc16", min: 52, tagline: "분위기부터 파악하고 움직이는 신중파", desc: "바로 정리하기보다 상황을 살피고 눈치껏 판단하는 스타일이에요. 성급한 결정보다 관찰을 먼저 해요.", advice: "너무 오래 눈치만 보다가 타이밍을 놓치지 않도록, 판단이 섰다면 행동으로 옮기는 연습도 필요해요.",
    pastPattern: "성급하게 판단했다가 후회한 경험이 있어서, 이제는 충분히 관찰한 뒤에 움직이는 게 몸에 뱄어요.",
    warningSigns: ["결정을 내려놓고도 계속 상황을 재확인한다", "주변 사람들 반응부터 살핀다", "확신이 서기 전까진 티를 전혀 안 낸다"],
    recoveryTip: "관찰력은 큰 장점이지만, 판단이 섰는데도 계속 미루면 타이밍을 놓쳐요. 확신이 들었다면 이제는 행동으로 옮겨보세요.",
    futureForecast: "3개월 안에 지금 지켜보고 있는 관계의 방향이 명확해질 거예요. 계속 관찰만 하기보다 한 번은 직접 확인해보는 게 도움이 돼요.",
    actionPlan: ["관찰만 하지 말고 이번 주 안에 직접 물어보기", "판단이 선 순간을 스스로 인지하고 메모해두기", "행동으로 옮기는 데드라인 정해두기"],
    darkSide: "극단으로 가면 결정을 영원히 미루는 우유부단함으로 변해요. 눈치만 보다가 정작 중요한 순간에 아무 행동도 못 하고 관계를 놓치게 될 수 있어요.",
    breakupStyle: "직접 통보하기보다 분위기로 먼저 신호를 보내요. 상대가 눈치채고 먼저 물어봐 주길 은근히 기다리는 스타일이에요.",
    celebTwin: "미스터리 드라마 속 모든 걸 관찰하고 마지막에 진실을 밝히는 탐정 캐릭터랑 닮았어요. 서두르지 않고 확실할 때 움직여요." },
  { name: "우유부단 고양이", emoji: "🤔", color: "#22c55e", min: 40, tagline: "끊자니 아쉽고, 잡자니 애매한 마음", desc: "손절해야 하나 계속 고민만 하다가 결정을 못 내리는 타입이에요. 정을 쉽게 놓지 못해요.", advice: "결정을 미루는 동안 스스로 더 지칠 수 있어요. 마감 기한을 정해두고 결정해보는 것도 방법이에요.",
    pastPattern: "정을 쉽게 떼지 못하는 성격 때문에, 관계를 끊어야 할 순간에도 늘 결정을 미뤄온 패턴이 반복되고 있어요.",
    warningSigns: ["같은 고민을 몇 주째 반복하고 있다", "결정을 남에게 미루거나 물어본다", "'그래도 혹시나' 하는 마음이 계속 남아있다"],
    recoveryTip: "결정을 미루는 시간이 길어질수록 나만 더 지쳐요. 딱 일주일만 기한을 정해두고 그 안에는 반드시 결정하는 연습을 해보세요.",
    futureForecast: "지금처럼 결정을 미루면 3개월 뒤에도 같은 고민을 반복하고 있을 가능성이 높아요. 스스로 마감 기한을 정하는 게 이 굴레를 끊는 방법이에요.",
    actionPlan: ["결정 마감일을 캘린더에 직접 적어두기", "믿을 만한 사람에게 상황을 솔직히 털어놓고 조언 구하기", "장단점을 종이에 적어 눈으로 직접 비교해보기"],
    darkSide: "극단으로 가면 아무 결정도 못 내린 채 관계에 끌려다니게 돼요. 상대가 나 대신 관계를 정리해버리는 상황을 맞을 수도 있어요.",
    breakupStyle: "이별 통보를 몇 번이나 준비했다가 취소하곤 해요. 결국 정리는 상대가 먼저 하게 되는 경우가 많아요.",
    celebTwin: "고백 직전까지 갔다가 매번 타이밍을 놓치는 로맨스 드라마 서브 남주·여주 캐릭터 같아요. 마음은 확실한데 행동이 늦어요." },
  { name: "정많은 고양이", emoji: "🥹", color: "#14b8a6", min: 28, tagline: "미운 정 고운 정 다 든 게 함정", desc: "서운한 일이 있어도 그동안 쌓인 정 때문에 쉽게 손절하지 못하는 타입이에요. 사람을 참 오래 품는 편이에요.", advice: "정도 소중하지만 나를 갉아먹는 관계라면 정 때문에 계속 참지 않아도 괜찮아요.",
    pastPattern: "사람을 오래 품는 성향이라, 서운한 일이 쌓여도 그동안의 좋았던 기억 때문에 쉽게 놓지 못하는 패턴이 반복돼요.",
    warningSigns: ["서운한 걸 참고 넘기는 게 익숙해졌다", "'그래도 좋은 사람이었는데' 라는 말을 자주 한다", "손해를 봐도 먼저 손절을 꺼내지 못한다"],
    recoveryTip: "정 때문에 참는 관계라면, 나를 갉아먹는 부분과 정말 소중한 부분을 분리해서 생각해보는 연습이 필요해요.",
    futureForecast: "지금처럼 참고 넘어가는 패턴이 계속되면 3개월 뒤에도 같은 서운함을 반복해서 느낄 가능성이 커요. 한 번은 솔직하게 감정을 표현하는 게 필요해요.",
    actionPlan: ["서운했던 일 하나만 골라 직접 이야기해보기", "정 때문에 참고 있는 건 아닌지 스스로 점검해보기", "나를 지치게 하는 관계 리스트 만들어보기"],
    darkSide: "극단으로 가면 나를 힘들게 하는 사람도 끝까지 놓지 못해서 스스로가 소진되는 상태까지 갈 수 있어요. 주변에서 '왜 그렇게까지 참냐'는 말을 자주 듣게 돼요.",
    breakupStyle: "정리하겠다고 마음먹어도 마지막 순간에 마음이 약해져서 다시 관계를 이어가는 경우가 많아요. 완전한 손절보다는 흐지부지되는 쪽에 가까워요.",
    celebTwin: "미운 정 고운 정 다 든 오랜 인연을 끝까지 못 놓는 가족 드라마 속 맏이 캐릭터랑 비슷해요. 참는 게 습관이 된 타입이에요." },
  { name: "집착냥이", emoji: "😿", color: "#3b82f6", min: 15, tagline: "놓으면 큰일 날 것 같은 불안함", desc: "관계가 흔들려도 놓지 못하고 붙잡는 타입이에요. 손절은커녕 오히려 더 매달리게 돼요.", advice: "집착할수록 관계는 더 힘들어질 수 있어요. 나 자신을 먼저 돌보는 시간을 가져보세요.",
    pastPattern: "소중한 사람을 잃은 경험이나 불안정한 애착 패턴 때문에, 관계가 흔들릴수록 오히려 더 붙잡으려는 성향이 강해졌어요.",
    warningSigns: ["연락이 늦어지면 불안감이 크게 올라온다", "상대의 SNS나 일정을 계속 확인하게 된다", "관계가 끝날까 봐 먼저 말을 못 꺼낸다"],
    recoveryTip: "붙잡을수록 상대는 더 멀어질 수 있어요. 관계에만 쏟던 에너지를 나 자신을 채우는 데 나눠보는 연습이 필요해요.",
    futureForecast: "지금의 불안한 패턴이 계속되면 3개월 뒤 관계가 오히려 더 힘들어질 수 있어요. 내 마음의 안정을 먼저 찾는 게 관계에도 도움이 돼요.",
    actionPlan: ["연락 확인 횟수를 하루 3번으로 제한해보기", "나만의 취미나 루틴에 시간 투자하기", "불안할 때 상대 대신 믿을 만한 친구에게 털어놓기"],
    darkSide: "극단으로 가면 상대의 일거수일투족을 확인하려 하거나 집착이 관계를 더 망가뜨리는 상황까지 갈 수 있어요. 스스로도, 상대도 지치게 만드는 패턴이에요.",
    breakupStyle: "먼저 정리를 꺼내는 일이 거의 없어요. 관계가 끝나도 계속 매달리거나 미련을 놓지 못하는 경우가 많아요.",
    celebTwin: "짝사랑하는 상대에게 올인하는 순정만화 속 캐릭터랑 닮았어요. 마음이 크고 순수한 만큼 상처도 크게 받는 타입이에요." },
  { name: "올인집사 고양이", emoji: "💞", color: "#a855f7", min: 0, tagline: "이 관계에 내 모든 걸 걸었어요", desc: "상대가 어떻게 하든 끝까지 곁을 지키는 타입이에요. 손절이라는 단어 자체가 낯설게 느껴져요.", advice: "헌신은 아름답지만 일방적인 관계는 결국 지치게 만들어요. 나에게도 마음을 좀 나눠주세요.",
    pastPattern: "누군가에게 헌신하는 것에서 존재 의미를 느끼는 성향이라, 관계에 내 모든 걸 쏟아붓는 패턴이 자연스럽게 자리 잡았어요.",
    warningSigns: ["내 시간과 감정을 늘 상대에게 먼저 맞춘다", "손해를 봐도 상대를 먼저 챙긴다", "'헤어지자'는 말은 상상도 안 해봤다"],
    recoveryTip: "헌신은 아름답지만 일방적이면 오래 못 가요. 나에게 쏟는 시간과 에너지도 최소한으로 확보해보는 연습이 필요해요.",
    futureForecast: "지금처럼 나를 뒷전에 두는 패턴이 계속되면 3개월 뒤엔 번아웃처럼 지칠 수 있어요. 상대에게도 내 마음을 표현하는 균형이 필요해요.",
    actionPlan: ["일주일에 하루는 온전히 나만을 위한 시간 만들기", "받고 싶은 걸 상대에게 솔직하게 말해보기", "관계에서 나의 몫과 상대의 몫을 구분해보기"],
    darkSide: "극단으로 가면 나를 완전히 잃어버릴 정도로 관계에 매몰돼요. 상대가 잘못해도 다 이해하고 넘어가면서 결국 나 혼자 지치는 상황이 반복될 수 있어요.",
    breakupStyle: "손절이라는 개념 자체가 낯설어서, 관계가 끝나도 스스로 정리하기보다 상대가 떠날 때까지 기다리는 편이에요.",
    celebTwin: "가족이나 연인을 위해 모든 걸 희생하는 신파 드라마 속 헌신적 주인공 캐릭터랑 닮았어요. 사랑이 깊은 만큼 스스로를 잘 안 돌보는 타입이에요." },
];

const MATCH_REASON: Record<string, string> = {
  "칼단호 고양이": "관계에 대한 판단이 빠르고 확실해서, 애매한 관계를 오래 끌지 않아도 되는 편안함이 있어요.",
  "쿨거리 고양이": "서로에게 적당한 거리를 존중해줘서, 부담 없이 관계를 이어갈 수 있어요.",
  "선긋기 고양이": "기준이 명확해서 감정 소모 없이 신뢰를 쌓을 수 있는 상대예요.",
  "눈치백단 고양이": "상황을 잘 살피고 배려해줘서, 편안하게 곁에 둘 수 있는 타입이에요.",
  "우유부단 고양이": "결정은 느려도 마음만큼은 오래 지켜주는 편이라 안정감을 줄 수 있어요.",
  "정많은 고양이": "정이 많아서 웬만한 서운함은 이해하고 넘어가주는 든든한 상대예요.",
  "집착냥이": "관심과 애정 표현이 확실해서, 사랑받는다는 느낌을 크게 받을 수 있어요.",
  "올인집사 고양이": "헌신적이고 한결같아서, 관계에서 안정감과 존중받는 느낌을 크게 받을 수 있어요.",
};

const CLASH_REASON: Record<string, string> = {
  "칼단호 고양이": "정리가 너무 빨라서, 대화로 풀 시간도 없이 관계가 끝나버릴 수 있어요.",
  "쿨거리 고양이": "속마음을 잘 안 드러내서, 어디까지가 진심인지 알기 어려워 답답할 수 있어요.",
  "선긋기 고양이": "선이 너무 확고해서, 가까워지고 싶어도 벽처럼 느껴질 수 있어요.",
  "눈치백단 고양이": "확신이 서기 전까진 계속 관망만 해서, 관계 발전이 더디게 느껴질 수 있어요.",
  "우유부단 고양이": "결정을 계속 미뤄서, 답답함이 쌓이고 관계가 애매하게 흘러갈 수 있어요.",
  "정많은 고양이": "서운해도 표현을 잘 안 해서, 속마음을 알 수 없어 오해가 쌓일 수 있어요.",
  "집착냥이": "불안이 커서 자주 확인받고 싶어하는 게 부담스럽게 느껴질 수 있어요.",
  "올인집사 고양이": "너무 다 맞춰주려 해서, 관계의 균형이 무너지고 오히려 부담스러울 수 있어요.",
};

function getType(score: number): CatType {
  return TYPES.find(t => score >= t.min) || TYPES[TYPES.length - 1];
}

function getMatch(score: number) {
  const idx = TYPES.findIndex(t => score >= t.min);
  const i = idx < 0 ? TYPES.length - 1 : idx;
  const best = TYPES[(i + 3) % TYPES.length];
  const worst = TYPES[(TYPES.length - 1 - i + TYPES.length) % TYPES.length];
  const worstTop3 = [1, 2, 4].map(off => {
    const t = TYPES[(TYPES.length - 1 - i + off + TYPES.length) % TYPES.length];
    return { type: t.name, emoji: t.emoji, reason: CLASH_REASON[t.name] };
  });
  return {
    best: best.name, bestEmoji: best.emoji, bestDetail: MATCH_REASON[best.name],
    worst: worst.name, worstEmoji: worst.emoji, worstTop3,
  };
}

function getRank(score: number): number {
  return Math.max(3, Math.round((110 - score) * 0.7));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, email, part, score } = body;
    const marketing = body.marketing === true;

    if (!part || !PART_LABELS[part] || typeof score !== "number") {
      return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
    }

    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    const type = getType(clamped);
    const match = getMatch(clamped);
    const rank = getRank(clamped);
    const relLabel = PART_LABELS[part];

    const result = {
      phone: phone || "",
      email: email || "",
      marketing,
      name: name || "익명",
      part,
      partLabel: relLabel,
      score: clamped,
      typeName: type.name,
      typeEmoji: type.emoji,
      typeColor: type.color,
      tagline: type.tagline,
      description: type.desc.replaceAll("관계", `${relLabel}와의 관계`),
      advice: type.advice,
      bestMatch: match.best,
      bestMatchEmoji: match.bestEmoji,
      bestMatchDetail: match.bestDetail,
      worstMatch: match.worst,
      worstMatchEmoji: match.worstEmoji,
      worstMatchTop3: match.worstTop3,
      rank,
      pastPattern: type.pastPattern,
      warningSigns: type.warningSigns,
      recoveryTip: type.recoveryTip,
      futureForecast: type.futureForecast,
      actionPlan: type.actionPlan,
      darkSide: type.darkSide,
      breakupStyle: type.breakupStyle,
      celebTwin: type.celebTwin,
      createdAt: Date.now(),
    };

    const ref = isFakePhone(phone) ? null : await db.ref("sonjeolgak_analyses").push(result);
    return NextResponse.json({ id: ref ? ref.key : null, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 없음" }, { status: 400 });
    const snap = await db.ref(`sonjeolgak_analyses/${id}`).once("value");
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch (e) {
    return NextResponse.json({ error: "오류" }, { status: 500 });
  }
}
