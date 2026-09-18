import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

const ZODIAC_NAMES = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

const ZODIAC_DATA: Record<string, { emoji: string; color: string; title: string; incantation: string; meaning: string; caution: string }> = {
  쥐: { emoji: "🐭", color: "#fbbf24", title: "재물을 부르는 쥐띠 부적", incantation: "돈이 스스로 찾아오는 기운을 담았습니다", meaning: "쥐띠는 예리한 감각으로 기회를 알아채는 띠입니다. 이 부적은 그 감각이 재물로 이어지도록 돕는 기운을 담았습니다.", caution: "이 기운은 오래 두면 흐려집니다. 오늘 안에 사주로 재물 흐름을 확인해보세요." },
  소: { emoji: "🐮", color: "#d97706", title: "쌓이는 복을 지키는 소띠 부적", incantation: "묵묵히 쌓아온 노력이 결실을 맺는 기운", meaning: "소띠는 성실함으로 차곡차곡 쌓는 힘이 강한 띠입니다. 이 부적은 그동안 쌓아온 것이 흩어지지 않고 결실로 이어지게 지켜줍니다.", caution: "지키는 기운은 방심하는 순간 새어나갑니다. 지금 사주로 올해 결실의 시기를 확인하세요." },
  호랑이: { emoji: "🐯", color: "#f97316", title: "기세를 몰아주는 호랑이띠 부적", incantation: "망설임을 걷어내고 앞으로 나아가는 기운", meaning: "호랑이띠는 강한 추진력을 타고났습니다. 이 부적은 그 기세가 꺾이지 않고 원하는 방향으로 뻗어가도록 돕습니다.", caution: "기세는 방향을 놓치면 힘만 빠집니다. 사주로 지금 밀어붙여야 할 방향을 확인해보세요." },
  토끼: { emoji: "🐰", color: "#f472b6", title: "인복을 끌어오는 토끼띠 부적", incantation: "귀인이 스스로 다가오게 하는 기운", meaning: "토끼띠는 온화한 기운으로 주변 사람을 끌어당기는 힘이 있습니다. 이 부적은 그 인복이 결정적인 순간에 도움으로 돌아오게 합니다.", caution: "인복은 알아보지 못하면 스쳐 지나갑니다. 사주로 올해 귀인이 나타나는 시기를 확인하세요." },
  용: { emoji: "🐲", color: "#ef4444", title: "대성운을 여는 용띠 부적", incantation: "큰 그릇을 채우는 기운을 담았습니다", meaning: "용띠는 열두 띠 중 가장 큰 스케일의 운을 타고난 띠로 불립니다. 이 부적은 그 큰 그릇에 걸맞은 기회가 열리도록 돕습니다.", caution: "큰 기회는 준비 안 된 사람을 비켜갑니다. 사주로 지금 준비해야 할 것을 확인하세요." },
  뱀: { emoji: "🐍", color: "#10b981", title: "지혜를 밝히는 뱀띠 부적", incantation: "흔들리지 않는 판단력을 세우는 기운", meaning: "뱀띠는 조용히 상황을 꿰뚫어 보는 직관이 강한 띠입니다. 이 부적은 그 판단력이 결정적인 순간 흔들리지 않게 지켜줍니다.", caution: "직관은 확신이 없으면 무뎌집니다. 사주로 지금 믿어도 되는 선택인지 확인해보세요." },
  말: { emoji: "🐴", color: "#38bdf8", title: "운을 실어나르는 말띠 부적", incantation: "멈춰있던 흐름을 다시 움직이는 기운", meaning: "말띠는 활동적인 에너지로 변화와 이동에서 운이 트이는 띠입니다. 이 부적은 정체된 흐름을 다시 힘차게 움직이도록 돕습니다.", caution: "흐름은 타이밍을 놓치면 다시 멈춥니다. 사주로 지금이 움직일 때인지 확인하세요." },
  양: { emoji: "🐑", color: "#a78bfa", title: "관계운을 다독이는 양띠 부적", incantation: "곁에 있는 사람이 힘이 되게 하는 기운", meaning: "양띠는 부드러운 기운으로 사람 사이의 조화를 만드는 띠입니다. 이 부적은 주변 관계가 힘이 되어 돌아오도록 지켜줍니다.", caution: "좋은 관계도 관리하지 않으면 멀어집니다. 사주로 올해 연애·인간관계 흐름을 확인해보세요." },
  원숭이: { emoji: "🐵", color: "#a3e635", title: "재치로 여는 원숭이띠 부적", incantation: "위기를 기회로 바꾸는 순발력의 기운", meaning: "원숭이띠는 영리한 임기응변으로 상황을 자기 것으로 만드는 띠입니다. 이 부적은 그 재치가 실제 성과로 이어지게 돕습니다.", caution: "재치는 방향이 없으면 헛돌기만 합니다. 사주로 지금 재능을 써야 할 곳을 확인하세요." },
  닭: { emoji: "🐔", color: "#fb7185", title: "명예를 세우는 닭띠 부적", incantation: "노력한 만큼 인정받게 하는 기운", meaning: "닭띠는 꼼꼼한 계획과 성실함으로 인정받는 띠입니다. 이 부적은 그 노력이 제대로 평가받고 명예로 이어지게 돕습니다.", caution: "인정은 때를 놓치면 다른 사람 몫이 됩니다. 사주로 올해 성공운이 오는 시기를 확인해보세요." },
  개: { emoji: "🐶", color: "#22d3ee", title: "신뢰를 지키는 개띠 부적", incantation: "곁을 지켜주는 사람을 알아보는 기운", meaning: "개띠는 의리와 신뢰로 관계를 지켜내는 힘이 강한 띠입니다. 이 부적은 진짜 내 편을 알아보고 지키는 안목을 열어줍니다.", caution: "신뢰는 방심하는 순간 깨지기 쉽습니다. 사주로 지금 곁에 두어야 할 인연을 확인해보세요." },
  돼지: { emoji: "🐷", color: "#e879f9", title: "복을 불러들이는 돼지띠 부적", incantation: "타고난 복이 지금 열리게 하는 기운", meaning: "돼지띠는 열두 띠 중 복이 많은 띠로 불립니다. 이 부적은 그 타고난 복이 지금 이 시기에 열리도록 돕습니다.", caution: "복은 알아채지 못하면 그냥 지나갑니다. 사주로 지금 열리고 있는 복을 확인해보세요." },
};

function getZodiac(year: number): string {
  const idx = ((year - 4) % 12 + 12) % 12;
  return ZODIAC_NAMES[idx];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name?: string; phone?: string; email?: string; birthYear: number; birthMonth: number; birthDay: number; marketing?: boolean; adSource?: string };
    const { name, phone, email, birthYear, birthMonth, birthDay, adSource } = body;
    const marketing = body.marketing === true;

    if (!birthYear) {
      return NextResponse.json({ error: "출생연도 필요" }, { status: 400 });
    }

    const zodiac = getZodiac(Number(birthYear));
    const info = ZODIAC_DATA[zodiac];

    const result = {
      name: name || "",
      phone: phone || "",
      email: email || "",
      marketing,
      adSource: adSource || "",
      birthYear: Number(birthYear),
      birthMonth: birthMonth ? Number(birthMonth) : null,
      birthDay: birthDay ? Number(birthDay) : null,
      zodiac,
      ...info,
      createdAt: Date.now(),
    };

    const ref = isFakePhone(phone) ? null : db.ref("bokmun_analyses").push();
    if (ref) await ref.set(result);
    return NextResponse.json({ id: ref ? ref.key : null, ...result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const snap = await db.ref(`bokmun_analyses/${id}`).get();
    if (!snap.exists()) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ id, ...snap.val() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
