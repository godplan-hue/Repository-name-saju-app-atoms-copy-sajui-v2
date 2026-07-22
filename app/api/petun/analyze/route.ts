import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const STEMS = ["경","신","임","계","갑","을","병","정","무","기"];
const OH_MAP: Record<string,string> = {
  "갑":"목","을":"목","병":"화","정":"화","무":"토","기":"토","경":"금","신":"금","임":"수","계":"수"
};
function getOh(year: number): string {
  return OH_MAP[STEMS[year % 10]] || "목";
}

function getCompatScore(oh1: string, oh2: string, extra: number): number {
  const base: Record<string, Record<string,number>> = {
    목: { 목:75, 화:90, 토:55, 금:50, 수:85 },
    화: { 목:85, 화:75, 토:90, 금:55, 수:48 },
    토: { 목:48, 화:85, 토:72, 금:88, 수:52 },
    금: { 목:52, 화:47, 토:85, 금:73, 수:90 },
    수: { 목:88, 화:50, 토:47, 금:84, 수:72 },
  };
  const b = base[oh1]?.[oh2] ?? 70;
  return Math.min(99, Math.max(44, b + extra));
}

function getPetPersonality(oh: string): { title: string; desc: string; trait: string; care: string; play: string; emotion: string } {
  const m: Record<string, { title: string; desc: string; trait: string; care: string; play: string; emotion: string }> = {
    목: { title: "모험가 타입 🌳", desc: "호기심이 왕성하고 활발한 강아지예요. 새로운 냄새와 장소를 탐험하는 것을 좋아하고, 산책 시간이 하루 중 가장 행복한 순간이에요.", trait: "활발함·호기심·탐험 본능·빠른 학습", care: "매일 충분한 운동과 산책이 필수예요. 지루함을 느끼면 물건을 씹거나 짖을 수 있어요. 새로운 장난감과 후각 자극 놀이가 잘 맞아요.", play: "공 던지기, 냄새 찾기 게임, 장애물 코스", emotion: "칭찬을 매우 좋아하고 보상 훈련이 잘 먹혀요. 혼자 두는 시간이 길면 분리불안이 생길 수 있어요." },
    화: { title: "애교쟁이 타입 🔥", desc: "열정적이고 감정 표현이 풍부한 강아지예요. 보호자의 관심을 받을 때 가장 행복하고, 낯선 사람에게도 먼저 다가가는 사교적인 성격이에요.", trait: "애교·감정 표현 풍부·사교성·열정", care: "충분한 스킨십과 관심이 필요해요. 외로움을 많이 타고 사람과 함께 있는 시간을 원해요. 과도한 흥분을 조절하는 훈련도 필요해요.", play: "터그 놀이, 함께 달리기, 반응형 장난감", emotion: "감정 기복이 있을 수 있어요. 혼났을 때 오래 풀이 죽어있을 수 있으니 단호하되 사랑스럽게 교육하세요." },
    토: { title: "충성견 타입 🪨", desc: "가족에 대한 충성심이 깊고 안정적인 성격이에요. 변화보다 익숙한 루틴을 좋아하고, 보호자 곁에 항상 있으려 해요.", trait: "충성심·안정성·루틴 선호·가족 중심", care: "규칙적인 생활 패턴이 중요해요. 급격한 환경 변화나 이사는 스트레스 요인이 될 수 있어요. 일관된 훈련 방식이 효과적이에요.", play: "보호자와 함께하는 조용한 놀이, 코 훈련, 산책", emotion: "신뢰가 쌓이기까지 시간이 걸리지만, 한번 신뢰하면 변하지 않아요. 처음 보는 사람에게 경계심을 보일 수 있어요." },
    금: { title: "독립파 타입 ⚡", desc: "자존감이 높고 독립적인 성격의 강아지예요. 자기만의 공간과 시간을 중요시하고, 원할 때 혼자 있고 싶어해요.", trait: "독립성·자존심·자기 페이스·영리함", care: "강요하지 않는 것이 중요해요. 스스로 다가올 때 충분히 반응해주세요. 날카로운 두뇌로 지적 자극이 필요해요.", play: "퍼즐 장난감, 숨기기 게임, 혼자 노는 장난감", emotion: "감정 표현이 적을 수 있지만 나름대로 애정 표현을 해요. 무리하게 안으려 하면 스트레스를 받을 수 있어요." },
    수: { title: "천재 타입 🌊", desc: "영리하고 직관적인 강아지예요. 학습 능력이 뛰어나고, 보호자의 감정 변화를 빠르게 감지해요.", trait: "영리함·직관력·빠른 학습·감수성", care: "정신적 자극이 충분히 필요해요. 훈련을 잘 받아들이고, 지루함을 느끼면 영리한 방식으로 말썽을 피워요.", play: "훈련, 퍼즐 게임, 숨바꼭질, 클리커 트레이닝", emotion: "보호자 감정에 민감하게 반응해요. 집에서 갈등이 있으면 강아지도 스트레스를 받을 수 있어요." },
  };
  return m[oh] || m["목"];
}

function getOhFood(oh: string): { best: string[]; good: string[]; desc: string } {
  const m: Record<string, { best: string[]; good: string[]; desc: string }> = {
    목: { best: ["닭고기 (삶은)", "브로콜리", "당근", "완두콩"], good: ["연어(익힌)", "고구마", "블루베리"], desc: "목오행 강아지는 성장 에너지가 강해요. 단백질과 채소 균형이 중요해요. 닭고기와 녹색 채소가 오행 에너지와 잘 맞아요." },
    화: { best: ["연어 (익힌)", "달걀 (익힌)", "블루베리", "닭고기 (삶은)"], good: ["고구마", "당근", "딸기"], desc: "화오행 강아지는 에너지가 넘쳐요. 오메가3가 풍부한 연어와 항산화 성분이 풍부한 베리류가 에너지 균형을 잡아줘요." },
    토: { best: ["소고기 (익힌)", "고구마", "당근", "호박"], good: ["닭고기 (삶은)", "브로콜리", "사과(씨 제거)"], desc: "토오행 강아지는 안정적인 소화가 중요해요. 영양가 높고 소화하기 좋은 음식이 잘 맞아요. 고구마는 특히 좋은 탄수화물 공급원이에요." },
    금: { best: ["블루베리", "사과(씨 제거)", "닭고기 (삶은)", "연어(익힌)"], good: ["브로콜리", "당근", "달걀(익힌)"], desc: "금오행 강아지는 면역력 관리가 중요해요. 항산화 성분이 풍부한 베리류와 고품질 단백질이 면역 에너지를 강화해요." },
    수: { best: ["연어 (익힌)", "고등어(익힌)", "블루베리", "브로콜리"], good: ["닭고기 (삶은)", "달걀(익힌)", "딸기"], desc: "수오행 강아지는 뇌 건강과 신경계 영양이 중요해요. DHA가 풍부한 생선이 영리한 두뇌를 더 빛나게 해줘요." },
  };
  return m[oh] || m["목"];
}

function getCompatDesc(oh1: string, oh2: string): { grade: string; summary: string; detail: string } {
  const rel: Record<string, { grade: string; summary: string; detail: string }> = {
    "목-목": { grade:"좋은 궁합 ✨", summary:"보호자와 강아지 모두 활발하고 성장 지향적이에요.", detail:"두 사람 모두 같은 목 에너지를 가졌어요. 함께 활동할 때 에너지가 잘 맞아요. 산책과 탐험을 함께 즐기면 관계가 더욱 깊어져요." },
    "목-화": { grade:"환상의 궁합 💞", summary:"보호자의 안정감이 강아지의 열정을 잘 받아줘요.", detail:"목이 화를 키우는 상생 관계예요. 보호자가 안정적인 에너지로 강아지의 넘치는 애교를 든든하게 받아줄 수 있어요." },
    "화-목": { grade:"좋은 궁합 ✨", summary:"강아지의 호기심이 보호자에게 활력을 줘요.", detail:"강아지의 탐험 에너지가 보호자에게도 새로운 즐거움을 선사해요. 함께 새로운 공원이나 장소를 탐험해보세요." },
    "화-화": { grade:"에너지 폭발 🔥", summary:"둘 다 활발하고 감성적이에요!", detail:"함께 있으면 에너지가 폭발적이에요. 흥분 조절 훈련을 함께 하면 더 좋은 관계가 될 수 있어요." },
    "화-토": { grade:"환상의 궁합 💞", summary:"보호자의 열정이 강아지에게 안정감을 줘요.", detail:"화가 토를 키우는 완벽한 상생이에요. 보호자의 적극적인 사랑이 충성스러운 강아지를 더욱 행복하게 해줘요." },
    "토-화": { grade:"좋은 궁합 ✨", summary:"강아지의 애교가 보호자에게 따뜻함을 줘요.", detail:"강아지의 넘치는 사랑 표현이 보호자에게 큰 기쁨이 돼요. 충분한 스킨십과 놀이 시간을 주세요." },
    "토-토": { grade:"안정의 궁합 🪨", summary:"둘 다 안정을 좋아해 편안한 관계예요.", detail:"서로에게 편안한 존재예요. 규칙적인 루틴을 함께 만들면 가장 이상적인 보호자-강아지 관계가 될 수 있어요." },
    "토-금": { grade:"환상의 궁합 💞", summary:"보호자의 포용력이 강아지의 독립성을 존중해줘요.", detail:"토가 금을 키우는 상생이에요. 강아지의 독립적인 성격을 이해하고 기다려줄 수 있는 최고의 보호자예요." },
    "금-토": { grade:"좋은 궁합 ✨", summary:"강아지의 충성심이 보호자에게 안정감을 줘요.", detail:"강아지의 변하지 않는 충성심이 보호자에게 큰 위로가 돼요. 서두르지 않고 신뢰를 쌓아가면 최고의 파트너가 돼요." },
    "금-수": { grade:"환상의 궁합 💞", summary:"보호자의 이성적인 면이 영리한 강아지와 잘 맞아요.", detail:"금이 수를 키우는 완벽한 상생이에요. 보호자의 체계적인 훈련 방식이 영리한 강아지의 능력을 최대로 발휘시켜줘요." },
    "수-금": { grade:"좋은 궁합 ✨", summary:"강아지의 영리함이 보호자와 깊이 통해요.", detail:"서로 지적으로 통하는 관계예요. 퍼즐 훈련과 클리커 트레이닝으로 특별한 유대감을 쌓을 수 있어요." },
    "수-목": { grade:"환상의 궁합 💞", summary:"보호자의 지혜가 강아지의 성장을 도와줘요.", detail:"수가 목을 키우는 완벽한 상생이에요. 보호자의 통찰력이 강아지의 탐험 본능을 올바른 방향으로 이끌어줘요." },
    "목-수": { grade:"좋은 궁합 ✨", summary:"강아지의 직관이 보호자의 마음을 잘 읽어요.", detail:"강아지가 보호자의 감정 변화를 빠르게 감지해요. 보호자가 힘들 때 가장 먼저 알아차리고 위로해줄 거예요." },
    "수-수": { grade:"깊은 연결 🌊", summary:"서로의 감정을 깊이 이해하는 관계예요.", detail:"둘 다 감수성이 풍부해 말 없이도 통해요. 조용하지만 깊고 특별한 유대감을 가진 관계예요." },
    "수-화": { grade:"노력이 필요해요 💪", summary:"서로 다른 에너지지만 균형을 찾을 수 있어요.", detail:"차가운 이성과 뜨거운 감성의 만남이에요. 보호자가 강아지의 감정 표현에 더 적극적으로 반응해주면 관계가 좋아져요." },
    "화-수": { grade:"노력이 필요해요 💪", summary:"강아지가 차분한 보호자에게 더 매달릴 수 있어요.", detail:"애교 많은 강아지가 표현이 적은 보호자에게 더 많은 관심을 구할 수 있어요. 의식적으로 더 자주 반응해주세요." },
    "목-금": { grade:"주의가 필요해요 ⚡", summary:"서로 다른 에너지 방향이에요.", detail:"활발한 강아지와 원칙을 중요시하는 보호자의 만남이에요. 강아지의 탐험 욕구를 충분히 허용해주면 관계가 훨씬 좋아져요." },
    "금-목": { grade:"주의가 필요해요 ⚡", summary:"독립적인 강아지에게 자유를 주세요.", detail:"강아지의 독립적인 성격을 이해하는 것이 중요해요. 억지로 안으려 하기보다 강아지가 먼저 다가올 때 충분히 반응해주세요." },
    "목-토": { grade:"주의가 필요해요 ⚡", summary:"강아지의 활발함을 보호자가 따라가기 바쁠 수 있어요.", detail:"보호자보다 훨씬 더 많은 운동과 자극이 필요한 강아지예요. 전문 훈련사나 도그워커의 도움이 필요할 수도 있어요." },
    "토-목": { grade:"노력이 필요해요 💪", summary:"강아지의 탐험 본능을 충분히 채워주는 것이 중요해요.", detail:"보호자보다 에너지가 많은 강아지예요. 산책과 운동 시간을 충분히 주면 집에서는 조용해질 수 있어요." },
    "화-금": { grade:"노력이 필요해요 💪", summary:"애교 많은 강아지에게 더 반응해주세요.", detail:"관심을 원하는 강아지에게 원칙적인 보호자가 냉정하게 느껴질 수 있어요. 의식적으로 더 많이 반응하고 칭찬해주세요." },
    "금-화": { grade:"노력이 필요해요 💪", summary:"독립적인 강아지의 공간을 존중해주세요.", detail:"애교 많은 보호자와 독립적인 강아지의 만남이에요. 강아지가 원하지 않을 때 억지로 안으려 하면 스트레스를 받아요." },
    "토-수": { grade:"노력이 필요해요 💪", summary:"영리한 강아지에게 충분한 정신적 자극을 주세요.", detail:"강아지의 지적 욕구가 보호자가 제공할 수 있는 것보다 클 수 있어요. 퍼즐 장난감과 훈련이 중요해요." },
    "수-토": { grade:"노력이 필요해요 💪", summary:"강아지의 감수성에 더 민감하게 반응해주세요.", detail:"강아지가 보호자의 감정 변화에 매우 민감해요. 집에서 안정적인 분위기를 유지하는 것이 강아지 건강에도 중요해요." },
  };
  const key = `${oh1}-${oh2}`;
  return rel[key] || { grade:"특별한 인연 💜", summary:"특별한 에너지를 가진 두 사람이에요.", detail:"각자의 에너지가 독특한 방식으로 연결돼요. 서로를 이해하고 맞춰가는 과정에서 특별한 유대감이 생길 거예요." };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petName, petBirthYear, petBirthMonth, petBirthDay, petSpecies,
            ownerName, ownerBirthYear, ownerPhone, ownerEmail } = body;
    const marketing = body.marketing === true;

    if (!petBirthYear) return NextResponse.json({ error: "강아지 생년을 입력해주세요" }, { status: 400 });

    const petOh = getOh(Number(petBirthYear));
    const ownerOh = ownerBirthYear ? getOh(Number(ownerBirthYear)) : null;

    const extra = ((Number(petBirthMonth||1)*3 + Number(petBirthDay||1) + Number(ownerBirthYear||0)) % 11) - 5;
    const compatScore = ownerOh ? getCompatScore(ownerOh, petOh, extra) : null;
    const petPersonality = getPetPersonality(petOh);
    const ohFood = getOhFood(petOh);
    const compatDesc = ownerOh ? getCompatDesc(ownerOh, petOh) : null;

    const result = {
      phone: ownerPhone || "",
      email: ownerEmail || "",
      marketing,
      name: ownerName || "보호자",
      petName: petName || "우리 강아지",
      petBirthYear, petBirthMonth, petBirthDay,
      petSpecies: petSpecies || "",
      ownerName: ownerName || "보호자",
      ownerBirthYear: ownerBirthYear || null,
      petOh, ownerOh,
      petPersonality,
      ohFood,
      compatScore,
      compatDesc,
      createdAt: Date.now(),
    };

    const ref = await db.ref("petun_analyses").push(result);
    return NextResponse.json({ id: ref.key, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "분석 중 오류" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 없음" }, { status: 400 });
    const snap = await db.ref(`petun_analyses/${id}`).once("value");
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch {
    return NextResponse.json({ error: "오류" }, { status: 500 });
  }
}
