export type Situation = { case: string; meaning: string };
export type FortuneAngle = { type: string; emoji: string; content: string };

export type DreamEntry = {
  emoji: string;
  category: string;
  luck: "길몽" | "흉몽" | "보통";
  summary: string;
  basicMeaning: string;
  situations: Situation[];
  fortuneAngles: FortuneAngle[];
  todayAdvice: string;
  tags: string[];
  related: string[];
};

export const DREAM_CATEGORIES = [
  { id: "animal",    label: "동물",      emoji: "🐍", bg: "linear-gradient(145deg,#f0fdf4,#dcfce7)", border: "#86efac", accent: "#16a34a" },
  { id: "money",     label: "재물·돈",   emoji: "💰", bg: "linear-gradient(145deg,#fefce8,#fef9c3)", border: "#fde047", accent: "#b45309" },
  { id: "person",    label: "사람·인연", emoji: "👤", bg: "linear-gradient(145deg,#dbeafe,#bfdbfe)", border: "#93c5fd", accent: "#1d4ed8" },
  { id: "body",      label: "신체",      emoji: "🦷", bg: "linear-gradient(145deg,#f5f3ff,#ede9fe)", border: "#c4b5fd", accent: "#7c3aed" },
  { id: "nature",    label: "자연·물",   emoji: "🌊", bg: "linear-gradient(145deg,#ecfeff,#cffafe)", border: "#67e8f9", accent: "#0284c7" },
  { id: "situation", label: "상황·행동", emoji: "✈️", bg: "linear-gradient(145deg,#fef2f2,#fecaca)", border: "#fca5a5", accent: "#dc2626" },
  { id: "object",    label: "사물·집",   emoji: "🏠", bg: "linear-gradient(145deg,#fdf2f8,#fce7f3)", border: "#f9a8d4", accent: "#be185d" },
  { id: "special",   label: "길몽 모음", emoji: "⭐", bg: "linear-gradient(145deg,#fefce8,#fef9c3)", border: "#fde047", accent: "#ca8a04" },
];

export const DREAMS: Record<string, DreamEntry> = {

  "돼지꿈": {
    emoji: "🐷", category: "money", luck: "길몽",
    summary: "재물과 풍요의 상징, 꿈에서 보기만 해도 좋다",
    basicMeaning: "돼지는 예로부터 재물과 복을 상징하는 대표적인 길몽입니다. 살찐 돼지가 나타날수록, 집 안으로 들어올수록 더 큰 재물을 의미합니다. 이 꿈을 꾼 날은 복권이나 중요한 결정을 시도하기 좋은 날입니다.",
    situations: [
      { case: "돼지가 집 안으로 들어오는 꿈", meaning: "큰 재물이나 행운이 집 안으로 직접 들어온다는 매우 강한 길몽. 사업·투자에서 이익이 생기거나 뜻밖의 수입이 들어올 조짐." },
      { case: "돼지를 안거나 만지는 꿈", meaning: "재물을 직접 손에 쥐게 된다는 신호. 계획 중인 일이나 투자가 실제 결과로 이어질 가능성이 높음." },
      { case: "돼지가 도망가거나 죽는 꿈", meaning: "재물이 새어나갈 수 있는 경고. 불필요한 지출이나 사기를 조심해야 하는 시기." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "꿈을 꾼 후 1~2주 안에 예상치 못한 수입이 생길 수 있습니다. 복권·투자·사업 모두 좋은 타이밍입니다." },
      { type: "연애운", emoji: "💕", content: "풍요로운 에너지가 인간관계까지 번져, 매력이 올라가고 좋은 인연이 가까워지는 시기입니다." },
    ],
    todayAdvice: "오늘은 미뤄두었던 중요한 결정을 실행에 옮기기 좋은 날입니다. 재물운이 올라있으니 소극적으로 있지 마세요.",
    tags: ["재물운", "풍요", "로또", "길몽"],
    related: ["황금꿈", "뱀꿈", "돈꿈"],
  },

  "뱀꿈": {
    emoji: "🐍", category: "animal", luck: "길몽",
    summary: "재물과 변화의 신호, 큰 뱀일수록 강한 길몽",
    basicMeaning: "뱀꿈은 재물과 큰 변화를 상징하는 대표 길몽입니다. 뱀이 나를 물었다면 예상치 못한 재물이나 기회가 찾아온다는 신호입니다. 황금빛 뱀이나 큰 구렁이가 등장할수록 그 의미가 강해집니다.",
    situations: [
      { case: "뱀이 나를 무는 꿈", meaning: "전통적으로 강한 재물 길몽. 불쾌하게 느껴져도 현실에서는 뜻밖의 돈이나 기회가 들어오는 신호." },
      { case: "뱀이 몸을 감는 꿈", meaning: "재물이나 인연이 나를 붙들고 따라온다는 의미. 사업 계약이나 중요한 관계에서 긍정적 결과가 기대됨." },
      { case: "뱀에게 쫓기는 꿈", meaning: "피해야 할 상황이나 숨겨진 경쟁자를 암시. 주변 관계를 주의 깊게 살필 필요가 있음." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "변화가 찾아오는 시기입니다. 지금 진행 중인 일이나 투자에서 빠른 결과가 나타날 가능성이 높습니다." },
      { type: "성공운", emoji: "🎯", content: "큰 변화나 기회의 시작을 알리는 꿈입니다. 중요한 제안이나 기회가 오면 과감히 잡으세요." },
    ],
    todayAdvice: "변화를 두려워하지 마세요. 오늘 찾아오는 기회나 제안은 평소보다 훨씬 좋은 결과로 이어질 수 있습니다.",
    tags: ["재물운", "변화", "기회", "길몽"],
    related: ["돼지꿈", "황금꿈", "용꿈"],
  },

  "똥꿈": {
    emoji: "💩", category: "money", luck: "길몽",
    summary: "더럽지만 대표적 재물 길몽, 만지면 더 좋다",
    basicMeaning: "똥꿈은 꿈해몽에서 재물을 상징하는 가장 대표적인 길몽입니다. 더럽다는 느낌과 상관없이, 꿈에서 똥을 보거나 만지는 것은 큰 재물의 신호입니다. 온몸에 묻을수록 더 큰 행운입니다.",
    situations: [
      { case: "똥을 밟거나 만지는 꿈", meaning: "강한 재물 길몽. 실제로 뜻밖의 수입이나 횡재가 생길 가능성이 높음." },
      { case: "화장실에서 똥이 넘쳐흐르는 꿈", meaning: "재물이 넘쳐흐른다는 의미. 사업 매출 상승이나 큰 계약에서 특히 좋은 신호." },
      { case: "똥 냄새가 고약하게 느껴지는 꿈", meaning: "재물은 오지만 뒤탈이 있을 수 있다는 경고. 출처가 불분명한 돈은 조심해야 함." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "꿈을 꾼 직후가 재물운의 정점입니다. 중요한 계약, 투자, 복권 등을 시도하기 가장 좋은 타이밍." },
    ],
    todayAdvice: "꿈자리가 더러울수록 현실의 재물운은 높습니다. 오늘 중요한 재정적 결정이 있다면 망설이지 마세요.",
    tags: ["재물운", "횡재", "대길", "길몽"],
    related: ["돈꿈", "돼지꿈", "금꿈"],
  },

  "돈꿈": {
    emoji: "💵", category: "money", luck: "길몽",
    summary: "지폐·동전 모두 재물운 상승 신호",
    basicMeaning: "꿈에서 돈을 받거나 줍는 것은 재물운이 올라가는 강한 길몽입니다. 지폐 다발, 금고, 황금 등 돈과 관련된 것들이 나올수록 효과가 강합니다.",
    situations: [
      { case: "길에서 돈을 줍는 꿈", meaning: "뜻밖의 횡재나 임시 수입이 생기는 신호. 복권을 사거나 새로운 기회에 도전하기 좋은 날." },
      { case: "돈을 잃거나 도둑맞는 꿈", meaning: "지출 주의, 사기 조심. 충동적인 지출이나 검증되지 않은 투자를 피해야 함." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "재물운이 올라있는 시기입니다. 사업, 투자, 재테크 관련 결정을 내리기에 좋은 때입니다." },
      { type: "직장운", emoji: "💼", content: "급여 인상이나 새로운 수입원이 생길 가능성이 있는 시기입니다." },
    ],
    todayAdvice: "오늘은 재정 계획을 다시 점검하기 좋은 날입니다. 새로운 수입 기회에 열려있는 자세를 유지하세요.",
    tags: ["재물운", "횡재", "투자", "길몽"],
    related: ["금꿈", "복권꿈", "돼지꿈"],
  },

  "금꿈": {
    emoji: "🥇", category: "money", luck: "길몽",
    summary: "황금은 대길, 금을 얻거나 만지면 최고의 재물운",
    basicMeaning: "황금·금괴를 받거나 줍는 꿈은 꿈해몽 최고의 길몽 중 하나입니다. 금반지, 금목걸이 등 귀금속을 선물받는 꿈도 큰 재물운과 사랑을 상징합니다.",
    situations: [
      { case: "금광이나 황금이 가득한 방을 발견하는 꿈", meaning: "인생을 바꿀 만한 사업 기회나 투자 성공을 암시하는 대길몽." },
      { case: "금이 녹거나 가짜 금이 나오는 꿈", meaning: "겉보기에 좋아 보이는 제안이 실속이 없을 수 있다는 경고. 계약 내용을 꼼꼼히 확인해야 함." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "큰 재물이 들어오는 시기의 예고입니다. 장기 투자나 부동산 관련 결정에서 특히 좋은 결과가 예상됩니다." },
    ],
    todayAdvice: "금처럼 가치 있는 것에 집중하세요. 오늘은 장기적으로 중요한 결정을 내리기에 좋은 날입니다.",
    tags: ["재물운", "대길", "황금", "길몽"],
    related: ["돈꿈", "복권꿈", "황금꿈"],
  },

  "복권꿈": {
    emoji: "🎰", category: "money", luck: "길몽",
    summary: "뜻밖의 횡재 암시, 재물운 최고조",
    basicMeaning: "복권에 당첨되거나 로또를 맞추는 꿈은 예상치 못한 횡재나 행운이 찾아온다는 길몽입니다. 꿈이 선명하고 기쁨의 감정이 강할수록 그 의미가 크다고 봅니다.",
    situations: [
      { case: "복권 당첨 번호가 보이는 꿈", meaning: "재물운이 최고조인 시기의 신호. 실제 복권 구매를 시도해볼 만한 날." },
      { case: "복권을 사서 긁는데 당첨이 안 되는 꿈", meaning: "재물운은 있지만 노력이 필요하다는 의미. 꾸준한 시도와 계획이 중요한 시기." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "재물운이 상승하는 시기입니다. 투자, 사업, 복권 등 새로운 시도에 도전하기 좋은 때입니다." },
    ],
    todayAdvice: "행운의 기운이 높은 날입니다. 중요한 재정 결정이나 새로운 시도를 오늘 시작해보세요.",
    tags: ["횡재", "행운", "재물운", "길몽"],
    related: ["돈꿈", "돼지꿈", "금꿈"],
  },

  "호랑이꿈": {
    emoji: "🐯", category: "animal", luck: "길몽",
    summary: "권력과 성공, 나타나면 지위 상승의 신호",
    basicMeaning: "호랑이는 권력·성공·강한 에너지를 상징합니다. 호랑이를 타거나 함께 있는 꿈은 사업이나 직장에서 크게 성공할 조짐입니다.",
    situations: [
      { case: "호랑이를 타거나 함께 있는 꿈", meaning: "사업·직장에서 크게 성공할 조짐. 리더십이 강해지고 주변의 신뢰를 얻게 됨." },
      { case: "호랑이에게 쫓기는 꿈", meaning: "강한 경쟁자나 윗사람과의 갈등을 조심하라는 신호." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "권위와 성공이 따라오는 시기입니다. 발표, 제안, 협상 등 중요한 자리에서 자신감을 가지세요." },
      { type: "직장운", emoji: "💼", content: "승진이나 중요한 임무가 맡겨질 가능성이 높습니다." },
    ],
    todayAdvice: "오늘은 평소보다 당당하게 자신의 의견을 표현하기 좋은 날입니다.",
    tags: ["성공", "권력", "귀인", "길몽"],
    related: ["용꿈", "봉황꿈", "독수리꿈"],
  },

  "개꿈": {
    emoji: "🐕", category: "animal", luck: "보통",
    summary: "충성과 배신, 개의 행동으로 길흉이 갈린다",
    basicMeaning: "개는 충성·우정·인간관계를 상징합니다. 귀여운 개가 반갑게 달려오는 꿈은 좋은 친구나 든든한 동료를 만나게 될 길몽입니다.",
    situations: [
      { case: "강아지가 집으로 들어오는 꿈", meaning: "새로운 인연이나 좋은 소식이 온다는 길몽." },
      { case: "개에게 물리는 꿈", meaning: "가까운 사람의 배신이나 뒷담화 주의. 신뢰했던 사람에게 상처받을 수 있는 시기." },
    ],
    fortuneAngles: [
      { type: "인간관계", emoji: "👥", content: "인간관계에서 변화가 생기는 시기입니다. 새로운 인연은 환영하되, 기존 관계는 한 번 점검해보세요." },
    ],
    todayAdvice: "주변 사람들과의 관계에 신경 써보세요. 믿을 수 있는 사람이 누구인지 파악하는 것이 중요합니다.",
    tags: ["인간관계", "우정", "신뢰"],
    related: ["고양이꿈", "귀인꿈", "연인꿈"],
  },

  "고양이꿈": {
    emoji: "🐱", category: "animal", luck: "보통",
    summary: "독립과 직관, 여성 관계나 연애 신호",
    basicMeaning: "고양이는 독립심·직관·여성성을 상징합니다. 예쁜 고양이가 다가오거나 품에 안기는 꿈은 매력적인 이성과의 인연이나 좋은 협력자를 암시합니다.",
    situations: [
      { case: "고양이가 선물을 가져오는 꿈", meaning: "예상치 못한 이익이나 좋은 기회를 암시하는 길몽." },
      { case: "고양이에게 할퀴이거나 무는 꿈", meaning: "주변 여성과의 갈등이나 숨겨진 경쟁 주의." },
    ],
    fortuneAngles: [
      { type: "연애운", emoji: "💕", content: "매력적인 인연이 가까이 있습니다. 직관을 믿고 마음이 끌리는 방향으로 움직여 보세요." },
    ],
    todayAdvice: "오늘은 직관을 믿는 날입니다. 이성적인 판단보다 느낌이 더 정확할 수 있는 날이에요.",
    tags: ["연애운", "직관", "여성", "인연"],
    related: ["개꿈", "새꿈", "연인꿈"],
  },

  "물고기꿈": {
    emoji: "🐟", category: "animal", luck: "길몽",
    summary: "재물과 임신의 상징, 물고기 크기가 복의 크기",
    basicMeaning: "물고기꿈은 재물운과 임신을 상징하는 대표적인 길몽입니다. 큰 물고기를 잡거나 물고기 떼를 보는 꿈일수록 더 큰 복을 의미합니다.",
    situations: [
      { case: "큰 물고기를 잡는 꿈", meaning: "큰 재물이나 기회가 내 손에 들어온다는 강한 길몽." },
      { case: "물고기를 놓치거나 죽은 물고기를 보는 꿈", meaning: "기회를 놓칠 수 있다는 경고. 중요한 일에 더 집중해야 함." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "재물이 들어오는 시기입니다. 특히 사업·계약·투자에서 긍정적인 결과를 기대할 수 있습니다." },
      { type: "가족운", emoji: "👶", content: "임신을 원한다면 특히 좋은 신호입니다." },
    ],
    todayAdvice: "기회가 왔을 때 놓치지 마세요. 오늘은 손을 뻗으면 잡힐 것들이 많은 날입니다.",
    tags: ["재물운", "임신", "풍요", "길몽"],
    related: ["돼지꿈", "아기꿈", "뱀꿈"],
  },

  "용꿈": {
    emoji: "🐉", category: "special", luck: "길몽",
    summary: "왕중왕 길몽, 하늘로 오르는 용은 대박 신호",
    basicMeaning: "용꿈은 꿈해몽 중 최고의 길몽으로 손꼽힙니다. 특히 용이 하늘로 날아오르는 꿈, 용을 타는 꿈은 큰 성공과 명예를 얻는다는 대길몽입니다.",
    situations: [
      { case: "용이 하늘로 솟구치는 꿈", meaning: "극적인 성공이나 인생의 역전을 암시하는 최고의 길몽." },
      { case: "용이 여의주를 건네주는 꿈", meaning: "소원이 이루어진다는 의미." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "인생의 전환점이 되는 큰 성공이 가까이 있습니다." },
      { type: "재물운", emoji: "💰", content: "대규모 재물운이 들어오는 시기입니다." },
    ],
    todayAdvice: "오늘은 크게 생각하는 날입니다. 평소에 하지 못했던 큰 도전을 시작해보세요.",
    tags: ["대길", "성공", "명예", "태몽"],
    related: ["봉황꿈", "호랑이꿈", "하늘꿈"],
  },

  "소꿈": {
    emoji: "🐄", category: "animal", luck: "길몽",
    summary: "성실한 재물운, 꾸준한 노력의 보상",
    basicMeaning: "소꿈은 성실함·재물·건강을 상징하는 길몽입니다. 살찐 소를 보거나 소가 집 안으로 들어오는 꿈은 재물이 늘어나고 가업이 번성한다는 신호입니다.",
    situations: [
      { case: "소를 잡거나 소고기를 먹는 꿈", meaning: "재물이 들어오거나 건강이 좋아진다는 길몽." },
      { case: "소가 날뛰거나 다치는 꿈", meaning: "재산 관련 분쟁이나 건강 이상 주의." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "꾸준한 노력이 결실을 맺는 시기입니다." },
    ],
    todayAdvice: "빠른 결과보다 꾸준함이 중요한 날입니다.",
    tags: ["재물운", "성실", "건강", "길몽"],
    related: ["돼지꿈", "말꿈", "물고기꿈"],
  },

  "아기꿈": {
    emoji: "👶", category: "person", luck: "길몽",
    summary: "새로운 시작과 임신 신호, 귀엽고 건강한 아기는 대길",
    basicMeaning: "아기꿈은 새로운 시작·임신·순수한 기쁨을 상징하는 길몽입니다. 귀여운 아기를 안거나 웃는 아기를 보는 꿈은 새로운 사업·계획이 순조롭게 이루어질 것을 암시합니다.",
    situations: [
      { case: "건강하고 귀여운 아기를 안는 꿈", meaning: "임신, 새로운 프로젝트 시작, 사업 출발 등 새로운 시작의 강한 길조." },
      { case: "아기가 울거나 아파 보이는 꿈", meaning: "가족 중 건강 이상을 살펴보라는 신호." },
    ],
    fortuneAngles: [
      { type: "가족운", emoji: "👶", content: "임신이나 가족에게 기쁜 소식이 올 수 있는 시기입니다." },
      { type: "사업운", emoji: "💼", content: "새로운 사업이나 프로젝트를 시작하기에 최적의 타이밍입니다." },
    ],
    todayAdvice: "새로운 시작을 두려워하지 마세요. 오늘 심은 씨앗이 나중에 큰 결실로 돌아옵니다.",
    tags: ["임신", "새로운시작", "가족", "길몽"],
    related: ["임신꿈", "물고기꿈", "죽은사람꿈"],
  },

  "죽은사람꿈": {
    emoji: "👻", category: "person", luck: "길몽",
    summary: "돌아가신 분이 나오면 대부분 길몽, 말을 걸면 더 좋다",
    basicMeaning: "꿈에서 돌아가신 가족이나 지인이 나타나는 것은 흉몽이 아닙니다. 전통 꿈해몽에서 故人이 꿈에 나와 말을 건네는 것을 매우 좋은 신호로 봅니다.",
    situations: [
      { case: "돌아가신 분이 웃으며 선물을 주는 꿈", meaning: "큰 행운과 재물이 따라온다는 강한 길몽." },
      { case: "故人이 어둡거나 슬픈 표정으로 나타나는 꿈", meaning: "가족의 건강이나 중요한 일에 더 관심을 가지라는 신호." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "조상의 기운이 도와주는 시기입니다." },
    ],
    todayAdvice: "가족과의 연결을 소중히 여기는 날입니다.",
    tags: ["조상", "가족", "길몽", "재물운"],
    related: ["귀신꿈", "부모꿈", "집꿈"],
  },

  "임신꿈": {
    emoji: "🤰", category: "person", luck: "길몽",
    summary: "새로운 시작과 결실, 큰 프로젝트 성공 암시",
    basicMeaning: "임신꿈은 새로운 생명·창조·풍요를 상징하는 강한 길몽입니다. 실제 임신 여부와 관계없이, 큰 결실이나 새로운 시작을 알리는 신호입니다.",
    situations: [
      { case: "내가 임신한 꿈", meaning: "새로운 계획이나 사업이 결실을 맺을 것을 암시." },
      { case: "다른 사람이 임신한 꿈", meaning: "주변에서 기쁜 소식이 들어오거나, 협력 관계에서 좋은 결과가 나오는 신호." },
    ],
    fortuneAngles: [
      { type: "사업운", emoji: "💼", content: "새로운 프로젝트나 사업이 성공적으로 시작되는 시기입니다." },
      { type: "가족운", emoji: "👶", content: "임신을 원한다면 특히 강한 길몽입니다." },
    ],
    todayAdvice: "창조적인 에너지가 충만한 날입니다. 새로운 아이디어를 실행에 옮기기 좋은 타이밍입니다.",
    tags: ["임신", "새로운시작", "결실", "길몽"],
    related: ["아기꿈", "물고기꿈", "결혼꿈"],
  },

  "이빨빠지는꿈": {
    emoji: "🦷", category: "body", luck: "흉몽",
    summary: "가족 건강이나 이별 주의, 전통적 흉몽",
    basicMeaning: "이빨이 빠지는 꿈은 전통 꿈해몽에서 가장 대표적인 흉몽 중 하나입니다. 가족 중 누군가의 건강 이상이나 이별을 암시한다고 전해집니다.",
    situations: [
      { case: "이빨이 우수수 빠지는 꿈", meaning: "가까운 사람의 건강을 챙기라는 강한 경고." },
      { case: "빠진 이빨 자리에 새 이빨이 나오는 꿈", meaning: "힘든 상황이 지나고 새로운 기회가 온다는 긍정적 신호." },
    ],
    fortuneAngles: [
      { type: "건강운", emoji: "💪", content: "가족 중 건강에 이상이 없는지 살펴봐야 할 시기입니다." },
      { type: "인간관계", emoji: "👥", content: "중요한 인연과의 이별이나 갈등이 생길 수 있는 시기입니다." },
    ],
    todayAdvice: "소중한 사람들의 건강과 안녕을 확인해보세요.",
    tags: ["건강", "가족", "이별", "흉몽"],
    related: ["피꿈", "머리카락꿈", "죽은사람꿈"],
  },

  "피꿈": {
    emoji: "🩸", category: "body", luck: "보통",
    summary: "생명력과 활력, 상황에 따라 길흉이 갈린다",
    basicMeaning: "꿈에서 피가 나오는 것은 무조건 흉몽이 아닙니다. 피가 활력 있게 흐르거나 강한 생명력을 느끼는 꿈은 오히려 강한 에너지와 재물운을 상징합니다.",
    situations: [
      { case: "몸에서 피가 솟구치며 활력이 느껴지는 꿈", meaning: "강한 생명력과 에너지가 최고조인 시기." },
      { case: "피를 많이 흘려 무서운 느낌이 드는 꿈", meaning: "건강이나 재물의 손실 경고." },
    ],
    fortuneAngles: [
      { type: "건강운", emoji: "💪", content: "몸의 신호에 귀를 기울여야 할 때입니다." },
    ],
    todayAdvice: "몸의 변화에 민감하게 반응하세요.",
    tags: ["건강", "생명력", "활력"],
    related: ["이빨빠지는꿈", "머리카락꿈", "병원꿈"],
  },

  "머리카락꿈": {
    emoji: "💇", category: "body", luck: "보통",
    summary: "건강과 에너지, 머리카락 상태로 길흉 판단",
    basicMeaning: "머리카락이 풍성하고 건강하게 자라는 꿈은 건강과 에너지가 넘친다는 신호입니다. 반면 머리카락이 빠지는 꿈은 에너지 고갈이나 건강 주의를 암시합니다.",
    situations: [
      { case: "머리카락이 풍성하게 자라는 꿈", meaning: "건강과 에너지가 넘치는 시기." },
      { case: "머리카락이 갑자기 빠지는 꿈", meaning: "에너지 고갈이나 건강 주의 신호." },
    ],
    fortuneAngles: [
      { type: "건강운", emoji: "💪", content: "에너지 관리가 중요한 시기입니다." },
    ],
    todayAdvice: "몸의 에너지를 체크하는 날입니다.",
    tags: ["건강", "에너지", "변화"],
    related: ["이빨빠지는꿈", "피꿈", "눈꿈"],
  },

  "물꿈": {
    emoji: "🌊", category: "nature", luck: "보통",
    summary: "물의 상태가 운명을 결정, 맑으면 길몽",
    basicMeaning: "물꿈은 감정·흐름·변화를 상징합니다. 맑고 투명한 물에서 수영하거나 깨끗한 물이 흐르는 꿈은 앞날이 순조롭다는 길몽입니다.",
    situations: [
      { case: "맑은 물에서 수영하는 꿈", meaning: "앞날이 순조롭고 감정이 안정되는 시기." },
      { case: "탁하고 거친 물에 휩쓸리는 꿈", meaning: "감정적 혼란이나 외부 변화에 휩쓸릴 수 있음." },
    ],
    fortuneAngles: [
      { type: "감정운", emoji: "💭", content: "감정의 흐름을 잘 살펴봐야 할 시기입니다." },
    ],
    todayAdvice: "내 감정의 흐름을 관찰하는 날입니다.",
    tags: ["감정", "흐름", "변화", "정화"],
    related: ["비꿈", "바다꿈", "홍수꿈"],
  },

  "불꿈": {
    emoji: "🔥", category: "nature", luck: "길몽",
    summary: "정열과 성공의 불꽃, 타오를수록 길몽",
    basicMeaning: "불꿈은 열정·성공·정화를 상징합니다. 활활 타오르는 불을 보거나 불 앞에서 따뜻함을 느끼는 꿈은 사업·직장에서 크게 성공할 것을 암시합니다.",
    situations: [
      { case: "하늘 높이 솟구치는 불꽃을 보는 꿈", meaning: "열정이 결실을 맺는 강한 길몽." },
      { case: "집이 불타는 꿈", meaning: "큰 변화나 손실을 암시. 단, 불 후에 새싹이 나오면 새 시작의 신호." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "열정이 불꽃처럼 타오르는 시기입니다." },
      { type: "재물운", emoji: "💰", content: "사업이나 투자에서 빠른 성장이 기대되는 시기입니다." },
    ],
    todayAdvice: "열정이 넘치는 날입니다. 미뤄두었던 중요한 일을 오늘 시작하세요.",
    tags: ["열정", "성공", "정화", "길몽"],
    related: ["태양꿈", "번개꿈", "물꿈"],
  },

  "하늘꿈": {
    emoji: "☀️", category: "nature", luck: "길몽",
    summary: "맑은 하늘은 최고의 길몽, 밝은 미래의 신호",
    basicMeaning: "맑고 푸른 하늘, 태양이 빛나는 하늘을 보는 꿈은 앞날이 밝고 모든 일이 순조롭게 풀린다는 강한 신호입니다.",
    situations: [
      { case: "별이 가득한 밤하늘을 보는 꿈", meaning: "주변 사람들의 도움과 응원이 크다는 의미." },
      { case: "먹구름이 가득한 하늘을 보는 꿈", meaning: "일시적인 어려움이나 우울한 감정이 지속될 수 있음." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "앞날이 밝게 열리는 시기입니다." },
    ],
    todayAdvice: "밝은 마음으로 하루를 시작하세요.",
    tags: ["희망", "밝은미래", "길몽"],
    related: ["태양꿈", "별꿈", "비행꿈"],
  },

  "비행꿈": {
    emoji: "✈️", category: "situation", luck: "길몽",
    summary: "자유와 성공, 높이 날수록 큰 성공 암시",
    basicMeaning: "꿈에서 하늘을 날거나 비행기를 타는 꿈은 자유·성취·높은 목표 달성을 상징하는 대표 길몽입니다.",
    situations: [
      { case: "자유롭게 하늘을 나는 꿈", meaning: "현재의 제약에서 벗어나 목표를 이루게 된다는 강한 신호." },
      { case: "날다가 추락하는 꿈", meaning: "계획이 무너질 수 있다는 경고. 추락 직전에 다시 날아오르면 위기 극복을 의미." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "지금까지의 노력이 결실을 맺는 시기입니다." },
      { type: "직장운", emoji: "💼", content: "승진, 이직, 새로운 기회 등 커리어에서 중요한 변화가 생기는 시기입니다." },
    ],
    todayAdvice: "높이 날아오를 준비가 된 날입니다. 더 큰 목표를 향해 나아가세요.",
    tags: ["자유", "성공", "목표달성", "길몽"],
    related: ["새꿈", "하늘꿈", "추락꿈"],
  },

  "쫓기는꿈": {
    emoji: "🏃", category: "situation", luck: "흉몽",
    summary: "현실의 압박과 도피 심리, 맞서는 꿈이 해결책",
    basicMeaning: "꿈에서 무언가에 쫓기는 꿈은 현실에서 회피하고 싶은 상황, 압박감, 두려움을 상징합니다.",
    situations: [
      { case: "사람에게 쫓기는 꿈", meaning: "주변 관계나 경쟁에서 압박을 받고 있다는 신호." },
      { case: "돌아서서 쫓아오는 것을 직접 마주하는 꿈", meaning: "문제를 정면 돌파하려는 의지. 현실에서도 그렇게 하면 해결된다는 메시지." },
    ],
    fortuneAngles: [
      { type: "스트레스", emoji: "😰", content: "현실의 압박이 심한 시기입니다. 무엇이 나를 쫓고 있는지 직시하세요." },
    ],
    todayAdvice: "피하고 싶은 것을 오늘 직면해보세요.",
    tags: ["스트레스", "두려움", "압박", "흉몽"],
    related: ["추락꿈", "싸우는꿈", "귀신꿈"],
  },

  "결혼꿈": {
    emoji: "💍", category: "situation", luck: "길몽",
    summary: "새로운 시작과 계약, 연애·사업 모두 길조",
    basicMeaning: "결혼식 꿈은 새로운 인연·계약·출발을 상징합니다. 꿈에서 결혼하는 것은 새로운 협력 관계나 중요한 계약이 이루어진다는 길몽입니다.",
    situations: [
      { case: "화려한 결혼식에서 직접 결혼하는 꿈", meaning: "삶의 중요한 전환점이 온다는 신호." },
      { case: "결혼식이 취소되거나 신랑·신부가 안 나타나는 꿈", meaning: "예정된 계획이 차질을 빚을 수 있다는 경고." },
    ],
    fortuneAngles: [
      { type: "연애운", emoji: "💕", content: "새로운 인연이나 관계의 진전이 기대되는 시기입니다." },
      { type: "사업운", emoji: "💼", content: "중요한 계약이나 파트너십 체결에 좋은 타이밍입니다." },
    ],
    todayAdvice: "새로운 관계나 계약에 열린 마음을 가지세요.",
    tags: ["새출발", "인연", "계약", "길몽"],
    related: ["연인꿈", "임신꿈", "귀인꿈"],
  },

  "집꿈": {
    emoji: "🏠", category: "object", luck: "보통",
    summary: "마음의 상태와 미래 공간, 집 상태가 길흉 결정",
    basicMeaning: "집은 자기 자신과 가정을 상징합니다. 크고 아름다운 새 집을 얻는 꿈은 재산이 늘거나 안정된 미래가 온다는 길몽입니다.",
    situations: [
      { case: "새 집이나 넓은 저택을 갖는 꿈", meaning: "재산 증가나 안정된 미래를 암시하는 길몽." },
      { case: "집이 무너지거나 낡은 집에 사는 꿈", meaning: "가정의 불안이나 건강 이상 주의." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "부동산이나 거주지 관련 결정을 내리기 좋은 시기입니다." },
    ],
    todayAdvice: "내 삶의 기반을 점검하는 날입니다.",
    tags: ["가정", "안정", "재산"],
    related: ["이사꿈", "가족꿈", "부모꿈"],
  },

  "황금꿈": {
    emoji: "✨", category: "special", luck: "길몽",
    summary: "최고의 재물 길몽, 빛날수록 강하다",
    basicMeaning: "황금이 빛나는 꿈은 꿈해몽에서 손꼽히는 최고의 길몽입니다. 황금빛으로 빛나는 것들, 황금비, 황금 물건을 받는 꿈은 모두 강한 재물운을 상징합니다.",
    situations: [
      { case: "황금비가 내리거나 황금이 가득한 방을 보는 꿈", meaning: "인생을 바꿀 만한 사업 성공이나 대박 재물운을 암시하는 대길몽." },
      { case: "몸이 황금빛으로 빛나는 꿈", meaning: "건강과 재물이 모두 최고조에 달하는 매우 강한 길몽." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "재물운이 최고조인 시기입니다." },
      { type: "성공운", emoji: "🎯", content: "명예와 성공이 함께 따라오는 시기입니다." },
    ],
    todayAdvice: "오늘은 크게 생각하고 과감하게 행동할 날입니다.",
    tags: ["재물운", "황금", "대길", "길몽"],
    related: ["금꿈", "돈꿈", "용꿈"],
  },

  "봉황꿈": {
    emoji: "🦚", category: "special", luck: "길몽",
    summary: "귀한 인연과 성공의 신호, 용과 함께 최고의 길몽",
    basicMeaning: "봉황이 나타나는 꿈은 귀한 인연, 높은 지위, 큰 성공을 암시하는 대길몽입니다.",
    situations: [
      { case: "봉황이 날아오르는 꿈", meaning: "직위 상승이나 명예로운 일이 생기는 강한 신호." },
      { case: "봉황의 깃털을 받는 꿈", meaning: "훌륭한 귀인이 지혜와 능력을 나눠준다는 상징." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "명예와 사회적 지위가 높아지는 시기입니다." },
    ],
    todayAdvice: "자신의 가치를 당당히 드러내는 날입니다.",
    tags: ["대길", "귀인", "명예", "길몽"],
    related: ["용꿈", "새꿈", "호랑이꿈"],
  },

  "새꿈": {
    emoji: "🦅", category: "animal", luck: "길몽",
    summary: "자유와 희소식, 날아오르면 성공 신호",
    basicMeaning: "새가 하늘로 날아오르는 꿈은 자유·성공·희소식을 상징하는 길몽입니다.",
    situations: [
      { case: "새가 집 안으로 날아드는 꿈", meaning: "좋은 소식이나 반가운 손님이 온다는 암시." },
      { case: "새가 죽거나 날지 못하는 꿈", meaning: "계획한 일이 막힐 수 있다는 경고." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "희소식이 오는 시기입니다." },
    ],
    todayAdvice: "자유롭게 생각하고 넓은 시야를 유지하는 날입니다.",
    tags: ["성공", "희소식", "자유", "길몽"],
    related: ["독수리꿈", "봉황꿈", "비행꿈"],
  },

  "말꿈": {
    emoji: "🐎", category: "animal", luck: "길몽",
    summary: "속도와 진취, 흰 말은 대길몽",
    basicMeaning: "말꿈은 속도·진취·자유로운 정신을 상징하는 길몽입니다. 특히 흰 말이 달리는 꿈은 큰 성공과 명예를 암시합니다.",
    situations: [
      { case: "흰 말이 달리는 꿈", meaning: "강한 성공운과 명예운을 암시하는 대길몽." },
      { case: "말에서 떨어지는 꿈", meaning: "진행 중인 일에 차질이 생길 수 있다는 경고." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "빠른 성장이 기대되는 시기입니다." },
    ],
    todayAdvice: "앞을 향해 달려나가는 에너지가 넘치는 날입니다.",
    tags: ["성공", "속도", "진취", "길몽"],
    related: ["호랑이꿈", "소꿈", "비행꿈"],
  },

  "토끼꿈": {
    emoji: "🐰", category: "animal", luck: "길몽",
    summary: "귀여운 행운, 임신과 재물의 신호",
    basicMeaning: "토끼꿈은 귀여운 행운·임신·재물을 상징하는 길몽입니다. 흰 토끼가 나타나는 꿈은 행운과 평화로운 시기가 온다는 신호입니다.",
    situations: [
      { case: "흰 토끼가 나타나는 꿈", meaning: "행운과 평화로운 시기가 온다는 신호." },
      { case: "토끼가 도망가는 꿈", meaning: "기회를 놓칠 수 있다는 경고." },
    ],
    fortuneAngles: [
      { type: "가족운", emoji: "👶", content: "임신이나 가족 관련 기쁜 소식이 올 수 있는 시기입니다." },
    ],
    todayAdvice: "작은 행운도 감사하게 받아들이세요.",
    tags: ["행운", "임신", "평화", "길몽"],
    related: ["아기꿈", "고양이꿈", "물고기꿈"],
  },

  "곰꿈": {
    emoji: "🐻", category: "animal", luck: "길몽",
    summary: "강한 수호자, 모성과 보호의 상징",
    basicMeaning: "곰꿈은 강인한 힘·보호·모성을 상징합니다. 곰이 나를 보호해주거나 따르는 꿈은 강한 후원자나 귀인이 나타날 것을 암시합니다.",
    situations: [
      { case: "곰이 나를 지켜주는 꿈", meaning: "강한 후원자나 귀인이 나타나 도움을 줄 것을 암시." },
      { case: "곰에게 공격당하는 꿈", meaning: "강한 경쟁자나 힘 있는 사람과의 갈등 주의." },
    ],
    fortuneAngles: [
      { type: "귀인운", emoji: "🌟", content: "강한 후원자나 귀인이 나타날 시기입니다." },
    ],
    todayAdvice: "든든한 지원을 받을 수 있는 날입니다.",
    tags: ["보호", "귀인", "힘", "길몽"],
    related: ["호랑이꿈", "귀인꿈", "용꿈"],
  },

  "바다꿈": {
    emoji: "🏖️", category: "nature", luck: "보통",
    summary: "무한한 가능성, 바다 상태로 길흉 판단",
    basicMeaning: "바다꿈은 무한한 가능성·잠재력·감정의 깊이를 상징합니다. 맑고 잔잔한 바다는 안정적인 시기를, 거친 파도는 도전을 암시합니다.",
    situations: [
      { case: "잔잔하고 맑은 바다를 보는 꿈", meaning: "안정적이고 평화로운 시기." },
      { case: "거친 파도에 휩쓸리는 꿈", meaning: "큰 변화나 도전이 닥쳐올 수 있다는 암시." },
    ],
    fortuneAngles: [
      { type: "재물운", emoji: "💰", content: "무한한 가능성이 열려있는 시기입니다." },
    ],
    todayAdvice: "넓은 시야로 가능성을 탐색하는 날입니다.",
    tags: ["가능성", "감정", "변화"],
    related: ["물꿈", "비꿈", "홍수꿈"],
  },

  "무지개꿈": {
    emoji: "🌈", category: "nature", luck: "길몽",
    summary: "희망과 약속, 힘든 시기 끝의 신호",
    basicMeaning: "무지개꿈은 희망·약속·힘든 시기의 끝을 상징하는 대표적인 길몽입니다.",
    situations: [
      { case: "비가 그친 후 무지개가 뜨는 꿈", meaning: "힘든 시기가 끝나고 좋은 날이 온다는 강한 희망의 신호." },
      { case: "무지개 끝에 보물이 있는 꿈", meaning: "오래 기다리던 꿈이나 목표가 이루어진다는 길몽." },
    ],
    fortuneAngles: [
      { type: "희망운", emoji: "🌈", content: "힘든 시기가 끝나는 전환점입니다." },
    ],
    todayAdvice: "희망을 잃지 마세요. 지금의 어려움은 더 밝은 내일을 위한 과정입니다.",
    tags: ["희망", "약속", "전환점", "길몽"],
    related: ["비꿈", "하늘꿈", "물꿈"],
  },

  "산꿈": {
    emoji: "⛰️", category: "nature", luck: "길몽",
    summary: "목표와 안정, 정상에 오를수록 큰 성공",
    basicMeaning: "산꿈은 목표·도전·안정감을 상징합니다. 산 정상에 오르거나 높은 산을 오르는 꿈은 목표를 달성하고 큰 성공을 이루는 것을 암시합니다.",
    situations: [
      { case: "산 정상에 오르는 꿈", meaning: "목표 달성이나 큰 성공을 암시하는 강한 길몽." },
      { case: "산에서 길을 잃는 꿈", meaning: "목표나 방향에 혼란이 생길 수 있다는 경고." },
    ],
    fortuneAngles: [
      { type: "성공운", emoji: "🎯", content: "높은 목표를 향해 나아가는 시기입니다." },
    ],
    todayAdvice: "한 걸음씩 올라가면 반드시 정상에 도달합니다.",
    tags: ["목표", "도전", "안정", "길몽"],
    related: ["하늘꿈", "비행꿈", "호랑이꿈"],
  },

  "추락꿈": {
    emoji: "📉", category: "situation", luck: "흉몽",
    summary: "불안과 통제력 상실, 현실 점검이 필요",
    basicMeaning: "추락하는 꿈은 불안·통제력 상실·실패에 대한 두려움을 상징합니다.",
    situations: [
      { case: "높은 곳에서 추락하는 꿈", meaning: "현재 진행 중인 중요한 일에 차질이 생길 수 있다는 경고." },
      { case: "추락하다가 안전하게 착지하는 꿈", meaning: "위기를 극복하고 다시 일어설 수 있다는 희망적인 신호." },
    ],
    fortuneAngles: [
      { type: "직장운", emoji: "💼", content: "직장이나 사업에서 예상치 못한 변화가 생길 수 있습니다." },
    ],
    todayAdvice: "현재 상황을 냉정하게 점검하는 날입니다.",
    tags: ["불안", "경고", "변화", "흉몽"],
    related: ["쫓기는꿈", "비행꿈", "시험꿈"],
  },

  "시험꿈": {
    emoji: "📝", category: "situation", luck: "보통",
    summary: "준비 상태를 점검, 합격 여부보다 태도가 중요",
    basicMeaning: "시험을 치르는 꿈은 현실에서의 압박감이나 자신을 평가받는 상황을 반영합니다.",
    situations: [
      { case: "자신감 있게 시험을 잘 치르는 꿈", meaning: "현실에서도 자신의 실력을 제대로 발휘할 수 있는 시기." },
      { case: "답을 모르거나 시험을 망치는 꿈", meaning: "준비 부족에 대한 경고." },
    ],
    fortuneAngles: [
      { type: "학업운", emoji: "📚", content: "자신의 실력을 평가받는 시기입니다." },
    ],
    todayAdvice: "실력을 제대로 보여줄 준비를 하는 날입니다.",
    tags: ["시험운", "준비", "평가"],
    related: ["합격꿈", "학교꿈", "쫓기는꿈"],
  },

  "싸우는꿈": {
    emoji: "👊", category: "situation", luck: "보통",
    summary: "내면의 갈등, 이기면 길몽 지면 흉몽",
    basicMeaning: "싸우는 꿈은 내면의 갈등·경쟁·억눌린 감정을 상징합니다. 꿈에서 이기는 경우는 현실에서도 경쟁이나 갈등을 이겨낼 수 있다는 길몽입니다.",
    situations: [
      { case: "싸워서 이기는 꿈", meaning: "경쟁이나 갈등에서 승리하는 길몽." },
      { case: "싸워서 지는 꿈", meaning: "억눌린 감정이나 해결되지 않은 갈등이 있다는 신호." },
    ],
    fortuneAngles: [
      { type: "인간관계", emoji: "👥", content: "갈등이 있는 관계를 정리해야 할 시기입니다." },
    ],
    todayAdvice: "내면의 갈등을 솔직하게 표현하는 날입니다.",
    tags: ["갈등", "경쟁", "감정"],
    related: ["쫓기는꿈", "귀신꿈", "연인꿈"],
  },

  "귀신꿈": {
    emoji: "👾", category: "person", luck: "흉몽",
    summary: "억눌린 두려움, 직면하면 해결된다",
    basicMeaning: "귀신꿈은 억눌린 두려움·해결되지 않은 문제·스트레스를 상징합니다.",
    situations: [
      { case: "귀신이 쫓아오는 꿈", meaning: "해결하지 못한 문제나 과거의 상처가 발목을 잡고 있다는 신호." },
      { case: "귀신과 대화하거나 친해지는 꿈", meaning: "두려움을 극복하고 있다는 긍정적 신호." },
    ],
    fortuneAngles: [
      { type: "심리운", emoji: "🧠", content: "내면의 두려움이나 과거의 문제를 해결해야 할 시기입니다." },
    ],
    todayAdvice: "두려움과 직접 마주하는 용기가 필요한 날입니다.",
    tags: ["두려움", "억압", "직면", "흉몽"],
    related: ["쫓기는꿈", "죽은사람꿈", "싸우는꿈"],
  },

  "부모꿈": {
    emoji: "👨‍👩‍👧", category: "person", luck: "길몽",
    summary: "지지와 보호, 부모의 미소는 대길몽",
    basicMeaning: "꿈에서 부모님이 나타나는 것은 지지·보호·인생 조언을 상징합니다. 부모님이 웃으며 칭찬해주거나 좋은 말을 해주는 꿈은 강한 길몽입니다.",
    situations: [
      { case: "부모님이 웃으며 칭찬해주는 꿈", meaning: "현재 하고 있는 일이 올바른 방향임을 확인해주는 신호." },
      { case: "부모님이 아파 보이거나 힘들어 보이는 꿈", meaning: "실제 부모님의 건강을 살펴봐야 할 시기." },
    ],
    fortuneAngles: [
      { type: "가족운", emoji: "👨‍👩‍👧", content: "가족 관계에서 안정과 지지가 필요한 시기입니다." },
    ],
    todayAdvice: "오늘 부모님이나 가족에게 먼저 연락을 해보세요.",
    tags: ["가족", "지지", "보호", "길몽"],
    related: ["죽은사람꿈", "아기꿈", "집꿈"],
  },

  "전연인꿈": {
    emoji: "💔", category: "person", luck: "보통",
    summary: "과거 미련이나 재회의 신호, 감정 정리 필요",
    basicMeaning: "전 연인이 꿈에 나타나는 것은 과거에 대한 미련·해결되지 않은 감정·또는 새로운 인연의 신호를 상징합니다.",
    situations: [
      { case: "전 연인과 행복하게 재회하는 꿈", meaning: "과거에 대한 그리움이 강한 시기. 또는 비슷한 인연이 새로 찾아올 수 있음." },
      { case: "전 연인과 싸우거나 차갑게 대하는 꿈", meaning: "과거를 완전히 정리하고 앞으로 나아갈 준비가 됐다는 신호." },
    ],
    fortuneAngles: [
      { type: "연애운", emoji: "💕", content: "감정 정리가 필요한 시기입니다." },
    ],
    todayAdvice: "과거를 아름답게 기억하되 앞으로 나아가는 힘을 찾으세요.",
    tags: ["연애운", "과거", "감정", "미련"],
    related: ["연인꿈", "결혼꿈", "이별꿈"],
  },

  "차꿈": {
    emoji: "🚗", category: "object", luck: "보통",
    summary: "인생의 방향과 속도, 운전 상태가 핵심",
    basicMeaning: "차는 인생의 방향·속도·통제력을 상징합니다. 내가 운전석에 앉아 시원하게 달리는 꿈은 인생에서 주도권을 쥐고 나아간다는 길몽입니다.",
    situations: [
      { case: "좋은 차를 새로 사는 꿈", meaning: "지위 상승이나 재물운 상승을 암시." },
      { case: "차가 고장 나거나 사고가 나는 꿈", meaning: "현재 진행 중인 일에 차질이 생길 수 있다는 경고." },
    ],
    fortuneAngles: [
      { type: "직장운", emoji: "💼", content: "커리어 방향을 점검해야 할 시기입니다." },
    ],
    todayAdvice: "오늘은 내 인생의 방향을 점검하는 날입니다.",
    tags: ["방향", "속도", "커리어"],
    related: ["비행꿈", "집꿈", "추락꿈"],
  },

  "음식꿈": {
    emoji: "🍚", category: "object", luck: "길몽",
    summary: "풍요와 건강, 맛있게 먹을수록 길몽",
    basicMeaning: "꿈에서 맛있는 음식을 먹는 것은 건강·풍요·만족을 상징하는 길몽입니다.",
    situations: [
      { case: "맛있는 음식을 배불리 먹는 꿈", meaning: "현실에서 원하는 것을 얻게 된다는 신호." },
      { case: "음식이 상하거나 맛이 없는 꿈", meaning: "건강이나 재물 관리에 신경 쓰라는 경고." },
    ],
    fortuneAngles: [
      { type: "건강운", emoji: "💪", content: "몸과 마음의 영양이 충분한 시기입니다." },
      { type: "재물운", emoji: "💰", content: "풍요로운 시기가 다가오고 있습니다." },
    ],
    todayAdvice: "감사함을 잊지 마세요.",
    tags: ["건강", "풍요", "재물운", "길몽"],
    related: ["집꿈", "돼지꿈", "물고기꿈"],
  },

};

export function getAllKeywords(): string[] {
  return Object.keys(DREAMS);
}

export function getByCategory(cat: string): string[] {
  return Object.keys(DREAMS).filter(k => DREAMS[k].category === cat);
}

export function searchKeywords(query: string): string[] {
  const q = query.trim();
  if (!q) return [];
  return Object.keys(DREAMS).filter(k =>
    k.includes(q) ||
    DREAMS[k].summary.includes(q) ||
    DREAMS[k].tags.some(t => t.includes(q))
  );
}

export const POPULAR_DREAMS = [
  "돼지꿈", "뱀꿈", "이빨빠지는꿈", "돈꿈", "죽은사람꿈",
  "불꿈", "물꿈", "아기꿈", "비행꿈", "결혼꿈",
  "호랑이꿈", "용꿈", "똥꿈", "복권꿈", "금꿈",
  "귀신꿈", "쫓기는꿈", "임신꿈", "피꿈", "황금꿈",
  "고양이꿈", "전연인꿈", "머리카락꿈", "싸우는꿈",
];
