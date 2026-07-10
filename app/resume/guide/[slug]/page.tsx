import type { Metadata } from "next";
import Link from "next/link";

type Entry = { slug: string; title: string; desc: string; h1: string; sub: string; emoji: string; };

const DATA: Entry[] = [
  { slug:"ai-jasoseo", title:"AI 자소서 분석 | 점운 합격", desc:"생년월일로 합격 가능성을 AI가 분석해드려요. 직무·기업 맞춤 자소서 전략과 면접 질문을 바로 확인하세요.", h1:"AI 자소서 — 내 사주에 맞는 합격 전략", sub:"오행 기질로 자소서 방향을 잡아드려요", emoji:"🎯" },
  { slug:"hapgyeok-jasoseo", title:"합격 자소서 쓰는 법 | 점운 합격", desc:"합격 자소서의 비밀은 직무와 오행 기질의 일치입니다. 내 사주로 합격 자소서 방향을 확인하세요.", h1:"합격 자소서 — 오행 기질이 합격률을 바꾼다", sub:"사주로 보는 나만의 합격 자소서 전략", emoji:"📄" },
  { slug:"chwieob-saju", title:"취업 사주 분석 | 점운 합격", desc:"취업 운세를 사주로 분석합니다. 지금이 취업 타이밍인지, 어떤 기업이 잘 맞는지 확인하세요.", h1:"취업 사주 — 지금이 내 취업 타이밍인가?", sub:"생년월일로 취업 에너지와 최적 타이밍 분석", emoji:"🔮" },
  { slug:"hapgyeok-unse", title:"합격 운세 | 점운 합격", desc:"올해 합격 운세를 사주로 확인하세요. 서류·면접·최종 합격까지 각 단계별 에너지를 분석합니다.", h1:"합격 운세 — 올해 내 합격 가능성은?", sub:"사주로 보는 2026년 취업·합격 에너지", emoji:"⚡" },
  { slug:"chwieob-unse", title:"취업 운세 2026 | 점운 합격", desc:"2026년 취업 운세 분석. 내 사주에서 취업이 잘 되는 시기와 잘 맞는 직무를 확인하세요.", h1:"취업 운세 — 2026년 내 취업 흐름 읽기", sub:"올해 취업 에너지가 강한 달과 방향 파악", emoji:"📅" },
  { slug:"jasoseo-strategy", title:"자소서 전략 | 점운 합격", desc:"합격하는 자소서는 전략이 다릅니다. 내 오행 기질을 살린 자소서 전략으로 서류 통과율을 높이세요.", h1:"자소서 전략 — 오행 기질로 서류를 통과하라", sub:"목·화·토·금·수 오행별 자소서 핵심 전략", emoji:"📝" },
  { slug:"myeonjeo-unse", title:"면접 운세 | 점운 합격", desc:"면접 운세를 사주로 확인하세요. 면접 성공 에너지가 강한 시기와 면접에서 강조할 포인트를 분석합니다.", h1:"면접 운세 — 면접장에서 빛나는 타이밍", sub:"사주로 보는 면접 성공 에너지와 전략", emoji:"🎤" },
  { slug:"seolyeo-tongkwa", title:"서류 통과 비결 | 점운 합격", desc:"서류 통과율을 높이는 사주 전략. 내 오행과 직무의 에너지 일치도를 분석해 합격률을 높입니다.", h1:"서류 통과 — 내 오행과 직무의 에너지 일치", sub:"서류 통과율을 높이는 사주 분석 전략", emoji:"📋" },
  { slug:"it-jasoseo", title:"IT 자소서 | 점운 합격", desc:"IT직군 합격 자소서 전략. 개발·기획·데이터 직무에 맞는 오행 기질과 자소서 키워드를 분석합니다.", h1:"IT 자소서 — 수·금 오행의 분석력을 살려라", sub:"IT 직무 합격 키워드와 자소서 전략 분석", emoji:"💻" },
  { slug:"gyeongyeong-jasoseo", title:"경영 자소서 | 점운 합격", desc:"경영·경제 직군 합격 자소서. 전략적 사고와 리더십을 강조하는 오행별 자소서 방향을 확인하세요.", h1:"경영 자소서 — 토·금 오행의 전략성을 강조", sub:"경영직 합격을 위한 오행 기질 자소서 전략", emoji:"📊" },
  { slug:"marketing-jasoseo", title:"마케팅 자소서 | 점운 합격", desc:"마케팅 직군 합격 자소서. 창의성과 커뮤니케이션을 살린 오행별 자소서 전략을 확인하세요.", h1:"마케팅 자소서 — 화·목 오행의 창의력으로 차별화", sub:"마케팅 직무 합격 자소서 전략과 키워드", emoji:"📣" },
  { slug:"finance-jasoseo", title:"금융 자소서 | 점운 합격", desc:"금융·회계 직군 자소서 전략. 수·금 오행의 분석력을 살린 자소서로 서류 통과율을 높이세요.", h1:"금융 자소서 — 수·금 오행의 정밀함으로 승부", sub:"금융직 합격 자소서 핵심 키워드와 전략", emoji:"💰" },
  { slug:"daegieob-jasoseo", title:"대기업 자소서 | 점운 합격", desc:"대기업 자소서 전략. 대기업이 원하는 인재상과 내 오행 기질의 일치도를 분석합니다.", h1:"대기업 자소서 — 인재상과 오행 기질의 일치", sub:"삼성·LG·현대 등 대기업 합격 자소서 전략", emoji:"🏢" },
  { slug:"startup-jasoseo", title:"스타트업 자소서 | 점운 합격", desc:"스타트업 자소서 전략. 빠른 성장과 창의성을 살린 목·화 오행 자소서 전략을 확인하세요.", h1:"스타트업 자소서 — 목·화 오행의 도전정신으로", sub:"스타트업 합격을 위한 오행별 자소서 전략", emoji:"🚀" },
  { slug:"gongi-jasoseo", title:"공기업 자소서 | 점운 합격", desc:"공기업·공무원 합격 자소서. 안정성과 공공성을 강조하는 토·금 오행 자소서 전략입니다.", h1:"공기업 자소서 — 토·금 오행의 안정감이 강점", sub:"공기업 합격 인재상과 오행별 자소서 방향", emoji:"🏛️" },
  { slug:"jungyeon-jasoseo", title:"중견기업 자소서 | 점운 합격", desc:"중견기업 자소서 전략. 성장 가능성과 전문성을 강조하는 오행별 자소서 방향을 확인하세요.", h1:"중견기업 자소서 — 성장과 전문성의 균형", sub:"중견기업 합격 자소서 오행별 전략 분석", emoji:"🏗️" },
  { slug:"jungso-jasoseo", title:"중소기업 자소서 | 점운 합격", desc:"중소기업 자소서 전략. 멀티태스킹과 주도성을 살린 오행별 자소서 핵심 방향입니다.", h1:"중소기업 자소서 — 주도성이 합격을 만든다", sub:"중소기업 자소서 핵심 키워드와 오행 전략", emoji:"🔑" },
  { slug:"saju-hapgyeok", title:"사주 합격 분석 | 점운 합격", desc:"사주로 보는 합격 가능성 분석. 내 사주에서 취업·합격 에너지가 강한 시기를 찾아드립니다.", h1:"사주 합격 — 내 사주에 합격 에너지가 있다", sub:"생년월일로 분석하는 취업 합격 사주 전략", emoji:"🌟" },
  { slug:"ohaeng-jigeob", title:"오행 직업 추천 | 점운 합격", desc:"오행(목·화·토·금·수)으로 보는 적합한 직업과 직무. 내 오행 기질에 맞는 직업 방향을 찾으세요.", h1:"오행 직업 — 내 기질에 맞는 직업이 있다", sub:"목·화·토·금·수 오행별 천직과 적합 직무", emoji:"🌿" },
  { slug:"hapgyeok-hwallyul", title:"합격률 높이는 방법 | 점운 합격", desc:"합격률을 높이는 사주 전략. 내 오행 점수와 직무 적합도를 분석해 합격률을 수치로 확인하세요.", h1:"합격률 — 사주로 보는 나의 합격 가능성 수치", sub:"오행 점수로 계산하는 직무별 합격률 분석", emoji:"📈" },
  { slug:"chwieob-taiming", title:"취업 타이밍 | 점운 합격", desc:"지금이 취업 타이밍인지 사주로 확인하세요. 대운·세운으로 보는 최적 취업 시기 분석입니다.", h1:"취업 타이밍 — 사주로 보는 최적 취업 시기", sub:"대운·세운으로 분석하는 나의 취업 골든타임", emoji:"⏰" },
  { slug:"jasoseo-keyword", title:"자소서 핵심 키워드 | 점운 합격", desc:"자소서 합격 키워드를 사주로 분석합니다. 내 오행 기질에서 나온 강점 키워드로 차별화하세요.", h1:"자소서 키워드 — 오행에서 찾는 나만의 강점", sub:"직무·기업별 합격 자소서 핵심 키워드 분석", emoji:"🔍" },
  { slug:"spec-chwieob", title:"스펙 없이 취업 | 점운 합격", desc:"스펙이 부족해도 합격하는 자소서 전략. 내 오행 기질을 살리면 스펙을 넘어설 수 있습니다.", h1:"스펙 취업 — 스펙보다 기질이 합격을 만든다", sub:"오행 기질로 스펙의 한계를 극복하는 전략", emoji:"💡" },
  { slug:"nospect-hapgyeok", title:"무스펙 합격 전략 | 점운 합격", desc:"스펙 없이 합격하는 자소서 비법. 사주 오행 기질을 강조하면 서류 심사관의 눈에 띌 수 있습니다.", h1:"무스펙 합격 — 기질로 스펙을 이기는 전략", sub:"내 오행 강점으로 서류를 통과하는 방법", emoji:"🏆" },
  { slug:"jasoseo-example", title:"합격 자소서 예시 | 점운 합격", desc:"오행별 합격 자소서 예시를 확인하세요. 목·화·토·금·수 오행에 따른 자소서 방향과 예시입니다.", h1:"합격 자소서 예시 — 오행별 합격 자소서 방향", sub:"오행 기질에 따른 자소서 문체와 내용 가이드", emoji:"📖" },
  { slug:"gyeongyeok-jasoseo", title:"경력 자소서 전략 | 점운 합격", desc:"경력직 이직 자소서 전략. 경력을 어떻게 사주 기질과 연결해 어필할지 분석합니다.", h1:"경력 자소서 — 내 경력과 오행 기질의 연결", sub:"경력직 이직 합격을 위한 자소서 전략", emoji:"💼" },
  { slug:"jikmu-jasoseo", title:"직무 맞춤 자소서 | 점운 합격", desc:"직무별 맞춤 자소서 전략. 개발·마케팅·영업·기획 등 직무에 따른 오행별 자소서 방향입니다.", h1:"직무 자소서 — 직무와 오행 기질의 최적 매칭", sub:"직무별 합격 키워드와 오행 자소서 전략", emoji:"🎯" },
  { slug:"2026-chwieob", title:"2026년 취업 운세 | 점운 합격", desc:"2026년 취업 운세를 사주로 분석합니다. 올해 취업 에너지가 강한 달과 방향을 확인하세요.", h1:"2026년 취업 — 올해 내 취업 에너지는?", sub:"2026년 사주로 보는 취업 황금 시기 분석", emoji:"📆" },
  { slug:"2026-hapgyeok", title:"2026년 합격 운세 | 점운 합격", desc:"2026년 합격 운세. 올해 서류·면접·최종 합격 에너지가 강한 시기를 사주로 분석합니다.", h1:"2026년 합격 — 올해 합격 에너지의 흐름", sub:"2026년 사주로 보는 나의 합격 타이밍", emoji:"🗓️" },
  { slug:"saju-chwieob-timing", title:"사주 취업 타이밍 | 점운 합격", desc:"사주로 보는 취업 최적 타이밍. 대운과 세운으로 분석하는 내 취업 골든 타임입니다.", h1:"사주 취업 타이밍 — 언제 지원해야 붙는가", sub:"대운·세운으로 분석하는 취업 골든 타임", emoji:"⏱️" },
  { slug:"hapgyeok-energy", title:"합격 에너지 분석 | 점운 합격", desc:"사주 합격 에너지를 분석합니다. 내 사주에서 합격 에너지가 강한 시기와 방향을 확인하세요.", h1:"합격 에너지 — 사주에서 합격이 보인다", sub:"오행 합격 에너지와 취업 방향 사주 분석", emoji:"✨" },
  { slug:"jasoseo-help", title:"자소서 도움 | 점운 합격", desc:"자소서 방향을 잡지 못하고 있다면? 내 사주 오행 기질에서 자소서 핵심 방향을 찾아드립니다.", h1:"자소서 도움 — 사주에서 자소서 방향이 보인다", sub:"막막한 자소서, 오행 기질로 방향을 잡자", emoji:"🙋" },
  { slug:"chwieob-taegil", title:"취업 택일 | 점운 합격", desc:"원서 제출·면접 날짜를 사주 택일로 잡으세요. 합격 에너지가 강한 날을 골라 드립니다.", h1:"취업 택일 — 합격 에너지 가득한 날 선택", sub:"원서 제출·면접일 사주 택일로 합격률 올리기", emoji:"📅" },
  { slug:"myeonjeo-question", title:"면접 예상 질문 | 점운 합격", desc:"내 사주와 직무를 분석해 면접 예상 질문 TOP 3를 알려드립니다. 미리 준비하면 합격률이 높아집니다.", h1:"면접 예상 질문 — 사주로 보는 나의 면접 대비", sub:"직무·기업별 면접 예상 질문 사주 분석", emoji:"❓" },
  { slug:"myeonjeo-strategy", title:"면접 전략 | 점운 합격", desc:"면접 성공 전략을 사주로 분석합니다. 내 오행 기질을 살린 면접 어필 방향을 확인하세요.", h1:"면접 전략 — 오행 기질을 면접에서 살려라", sub:"내 오행 강점을 면접에서 어필하는 전략", emoji:"💪" },
  { slug:"myeonjeo-prep", title:"면접 준비 | 점운 합격", desc:"면접 준비를 사주로 체계화합니다. 내 오행 기질에 맞는 면접 준비 방향과 강조 포인트입니다.", h1:"면접 준비 — 사주 기질로 면접을 준비하라", sub:"오행별 면접 준비 방향과 강조 포인트", emoji:"📚" },
  { slug:"career-change-saju", title:"이직 사주 분석 | 점운 합격", desc:"이직 타이밍을 사주로 분석합니다. 지금 이직이 맞는지, 어떤 기업이 잘 맞는지 확인하세요.", h1:"이직 사주 — 지금 이직이 내 타이밍인가", sub:"사주로 보는 이직 최적 시기와 방향 분석", emoji:"🔄" },
  { slug:"ijigu-timing", title:"이직 타이밍 | 점운 합격", desc:"사주로 보는 이직 최적 타이밍. 대운·세운으로 분석하는 이직 골든타임을 확인하세요.", h1:"이직 타이밍 — 사주로 보는 최적 이직 시기", sub:"대운으로 분석하는 이직 성공 가능성과 타이밍", emoji:"🚀" },
  { slug:"career-saju", title:"커리어 사주 | 점운 합격", desc:"내 커리어 방향을 사주로 분석합니다. 오행 기질로 적합한 직업과 커리어 경로를 확인하세요.", h1:"커리어 사주 — 내 사주가 말하는 커리어 방향", sub:"오행 기질로 분석하는 최적 커리어 경로", emoji:"🗺️" },
  { slug:"jigeob-saju", title:"직업 사주 | 점운 합격", desc:"직업 운세를 사주로 분석합니다. 내 사주에서 적합한 직업과 직무를 찾아드립니다.", h1:"직업 사주 — 내 사주에서 천직이 보인다", sub:"오행 기질로 보는 나에게 맞는 직업과 직무", emoji:"🎯" },
  { slug:"wood-jasoseo", title:"목 오행 자소서 전략 | 점운 합격", desc:"목 오행(봄 에너지) 기질을 살린 자소서 전략. 성장·도전·리더십을 강조하는 자소서 방향입니다.", h1:"목 오행 자소서 — 성장과 리더십을 어필하라", sub:"목 오행 기질로 차별화하는 자소서 전략", emoji:"🌿" },
  { slug:"fire-jasoseo", title:"화 오행 자소서 전략 | 점운 합격", desc:"화 오행(열정 에너지) 기질을 살린 자소서 전략. 열정·창의성·커뮤니케이션을 강조하세요.", h1:"화 오행 자소서 — 열정과 창의성을 강조하라", sub:"화 오행 기질로 빛나는 자소서 전략", emoji:"🔥" },
  { slug:"earth-jasoseo", title:"토 오행 자소서 전략 | 점운 합격", desc:"토 오행(안정 에너지) 기질을 살린 자소서 전략. 신뢰·팀워크·책임감을 강조하는 방향입니다.", h1:"토 오행 자소서 — 신뢰와 책임감을 어필하라", sub:"토 오행 기질로 안정감 있는 자소서 만들기", emoji:"🌍" },
  { slug:"metal-jasoseo", title:"금 오행 자소서 전략 | 점운 합격", desc:"금 오행(결단 에너지) 기질을 살린 자소서 전략. 분석력·완성도·전문성을 강조하는 방향입니다.", h1:"금 오행 자소서 — 전문성과 분석력을 어필하라", sub:"금 오행 기질로 완성도 높은 자소서 만들기", emoji:"💎" },
  { slug:"water-jasoseo", title:"수 오행 자소서 전략 | 점운 합격", desc:"수 오행(지혜 에너지) 기질을 살린 자소서 전략. 논리력·창의적 문제해결·통찰력을 강조하세요.", h1:"수 오행 자소서 — 논리력과 통찰력을 살려라", sub:"수 오행 기질로 논리적인 자소서 전략 만들기", emoji:"💧" },
  { slug:"jasoseo-tips", title:"자소서 팁 | 점운 합격", desc:"합격률을 높이는 자소서 팁. 사주 오행으로 자소서 문체·내용·강조점을 잡는 방법입니다.", h1:"자소서 팁 — 오행 기질로 자소서를 업그레이드", sub:"사주로 보는 자소서 핵심 팁과 방향", emoji:"💡" },
  { slug:"hapgyeok-2026", title:"2026년 합격 전략 | 점운 합격", desc:"2026년 합격을 위한 사주 전략. 올해 합격 에너지가 강한 월과 직무 방향을 분석합니다.", h1:"2026년 합격 전략 — 올해 합격 흐름을 타라", sub:"2026년 사주로 보는 합격 전략과 타이밍", emoji:"🗓️" },
  { slug:"chwieob-luck", title:"취업운 분석 | 점운 합격", desc:"취업운을 사주로 분석합니다. 내 사주에서 취업 성공 에너지가 언제 가장 강한지 확인하세요.", h1:"취업운 — 사주로 보는 나의 취업 성공 에너지", sub:"오행 기질과 취업운의 관계를 분석합니다", emoji:"🍀" },
  { slug:"first-job", title:"첫 취업 자소서 | 점운 합격", desc:"첫 취업을 위한 자소서 전략. 경험이 없어도 오행 기질로 강점을 어필하는 방법을 찾아드립니다.", h1:"첫 취업 — 경험 없어도 오행 기질로 합격", sub:"신입 취업 자소서 오행별 전략과 키워드", emoji:"🌱" },
  { slug:"job-hunting-saju", title:"구직 사주 | 점운 합격", desc:"구직 활동 중이라면 사주로 방향을 잡으세요. 내 오행 기질에 맞는 직무와 기업을 찾아드립니다.", h1:"구직 사주 — 사주로 찾는 내 취업 방향", sub:"구직 중 방향을 잡는 사주 오행 분석", emoji:"🔎" },
  { slug:"resume-writing", title:"이력서 작성법 | 점운 합격", desc:"이력서 작성에 오행 기질을 더하세요. 채용담당자의 눈에 띄는 이력서 방향을 분석합니다.", h1:"이력서 작성 — 오행 기질로 이력서를 완성하라", sub:"사주로 보는 나만의 이력서 차별화 전략", emoji:"📋" },
  { slug:"resume-ai", title:"AI 이력서 분석 | 점운 합격", desc:"AI와 사주로 이력서를 분석합니다. 직무·기업 맞춤 이력서 전략을 바로 확인하세요.", h1:"AI 이력서 분석 — 사주와 AI로 이력서 완성", sub:"AI 분석 + 오행 기질로 이력서 전략 수립", emoji:"🤖" },
  { slug:"resume-strategy", title:"이력서 전략 | 점운 합격", desc:"이력서 전략을 사주로 분석합니다. 내 오행 기질에서 강점을 찾아 이력서에 반영하는 방법입니다.", h1:"이력서 전략 — 오행 강점을 이력서에 담아라", sub:"사주 오행으로 이력서 차별화 전략 만들기", emoji:"📌" },
  { slug:"jikjang-unse", title:"직장 운세 | 점운 합격", desc:"직장 운세를 사주로 분석합니다. 현재 직장에서의 성공 에너지와 이직 타이밍을 확인하세요.", h1:"직장 운세 — 현재 직장의 사주 에너지 분석", sub:"사주로 보는 직장 성공 에너지와 이직 타이밍", emoji:"🏢" },
  { slug:"career-fortune", title:"커리어 운세 | 점운 합격", desc:"커리어 운세를 사주로 분석합니다. 올해 커리어에서 어떤 에너지가 강한지 확인하세요.", h1:"커리어 운세 — 사주로 보는 올해 커리어 흐름", sub:"오행으로 보는 커리어 성공 에너지와 방향", emoji:"📊" },
  { slug:"success-unse", title:"성공 운세 | 점운 합격", desc:"성공 운세를 사주로 분석합니다. 내 사주에서 성공 에너지가 강한 분야와 시기를 찾아드립니다.", h1:"성공 운세 — 사주에서 보는 나의 성공 방향", sub:"오행 성공 에너지와 최적 성공 방향 분석", emoji:"🌟" },
  { slug:"job-fit", title:"직업 적합도 | 점운 합격", desc:"직업 적합도를 사주로 분석합니다. 내 오행 기질에 맞는 직업과 직무 방향을 찾아드립니다.", h1:"직업 적합도 — 내 오행 기질에 맞는 직업은?", sub:"오행 기질로 분석하는 직업 적합도와 방향", emoji:"✅" },
  { slug:"aptitude-saju", title:"사주 적성 분석 | 점운 합격", desc:"사주로 적성을 분석합니다. 내 오행 기질에서 타고난 강점과 적합한 직업 방향을 찾으세요.", h1:"사주 적성 — 오행 기질에서 타고난 재능 발견", sub:"사주 오행으로 보는 적성과 천직 방향", emoji:"🎭" },
  { slug:"career-timing", title:"커리어 타이밍 | 점운 합격", desc:"커리어 전환 타이밍을 사주로 분석합니다. 지금이 이직·승진·창업의 좋은 타이밍인지 확인하세요.", h1:"커리어 타이밍 — 사주로 보는 최적 커리어 전환 시기", sub:"대운으로 분석하는 커리어 골든 타이밍", emoji:"⏰" },
  { slug:"sales-jasoseo", title:"영업 자소서 | 점운 합격", desc:"영업직 합격 자소서 전략. 화·목 오행의 커뮤니케이션과 열정을 살린 자소서 방향입니다.", h1:"영업 자소서 — 화·목 오행의 설득력을 살려라", sub:"영업직 합격 자소서 핵심 키워드와 전략", emoji:"🗣️" },
  { slug:"medical-jasoseo", title:"의료·의약 자소서 | 점운 합격", desc:"의료·의약 직군 자소서 전략. 수·금 오행의 정밀함과 책임감을 강조하는 방향입니다.", h1:"의료 자소서 — 수·금 오행의 정밀함과 책임감", sub:"의료·의약 직군 합격 자소서 오행 전략", emoji:"🏥" },
  { slug:"edu-jasoseo", title:"교육직 자소서 | 점운 합격", desc:"교육직 합격 자소서 전략. 토·목 오행의 인내심과 성장 지원 기질을 살린 방향입니다.", h1:"교육 자소서 — 토·목 오행의 인내와 성장 지원", sub:"교육직 합격을 위한 오행별 자소서 전략", emoji:"📚" },
  { slug:"public-jasoseo", title:"공공기관 자소서 | 점운 합격", desc:"공공기관·공무원 자소서 전략. 토·금 오행의 안정성과 공공성을 강조하는 방향입니다.", h1:"공공 자소서 — 토·금 오행의 공공성과 안정감", sub:"공공기관 합격 자소서 오행 전략 분석", emoji:"🏛️" },
  { slug:"hapgyeok-score", title:"합격 점수 분석 | 점운 합격", desc:"내 합격 점수를 사주로 분석합니다. 직무·기업별 합격 가능성 점수를 수치로 확인하세요.", h1:"합격 점수 — 사주로 보는 나의 합격 가능성", sub:"직무·오행·타이밍으로 계산하는 합격 점수", emoji:"💯" },
  { slug:"chwieob-gap", title:"취업 공백기 극복 | 점운 합격", desc:"취업 공백기를 극복하는 자소서 전략. 공백기를 오행 기질 성장의 증거로 만드는 방법입니다.", h1:"취업 공백기 — 오행 기질로 공백기를 강점으로", sub:"취업 공백기를 자소서 강점으로 만드는 전략", emoji:"🔄" },
  { slug:"career-switch", title:"직종 전환 자소서 | 점운 합격", desc:"직종 전환 시 자소서 전략. 기존 경력을 새 직무에 맞게 오행 기질로 재해석하는 방법입니다.", h1:"직종 전환 — 오행 기질로 새 직무에 도전하라", sub:"직종 전환 자소서에서 오행 기질을 살리는 법", emoji:"🔀" },
  { slug:"late-bloomer", title:"늦깎이 취업 | 점운 합격", desc:"늦깎이 취업에도 사주 전략이 있습니다. 오행 기질로 늦은 취업의 강점을 만드세요.", h1:"늦깎이 취업 — 사주로 보면 늦지 않았다", sub:"오행 기질로 늦깎이 취업의 강점을 찾는 전략", emoji:"🌅" },
  { slug:"chwieob-stress", title:"취업 스트레스 해소 | 점운 합격", desc:"취업 스트레스를 사주로 관리하세요. 내 오행 기질에 맞는 스트레스 해소법과 재충전 방법입니다.", h1:"취업 스트레스 — 사주로 보는 나의 회복 방법", sub:"오행 기질별 취업 스트레스 해소와 재충전", emoji:"💆" },
  { slug:"jikmu-fit", title:"직무 적합성 분석 | 점운 합격", desc:"직무 적합성을 사주로 분석합니다. 내 오행 기질이 지원 직무와 얼마나 맞는지 확인하세요.", h1:"직무 적합성 — 내 오행과 직무의 에너지 일치도", sub:"오행 기질과 직무 에너지의 일치도 분석", emoji:"🎯" },
  { slug:"leader-saju", title:"리더십 사주 | 점운 합격", desc:"리더십 사주를 분석합니다. 내 사주에서 리더십 에너지가 강한 오행과 직무 방향을 찾으세요.", h1:"리더십 사주 — 내 사주에서 리더 에너지를 찾다", sub:"오행으로 보는 나의 리더십 유형과 발휘 방법", emoji:"👑" },
  { slug:"analyst-saju", title:"분석가 사주 | 점운 합격", desc:"분석가 적합 사주를 확인하세요. 수·금 오행의 논리력과 정밀함이 강한 직무를 분석합니다.", h1:"분석가 사주 — 수·금 오행의 논리력이 빛나는 직무", sub:"사주로 보는 데이터·전략 분석 직무 적합도", emoji:"📐" },
  { slug:"creator-saju", title:"크리에이터 사주 | 점운 합격", desc:"크리에이터 적합 사주. 화·목 오행의 창의성과 표현력이 강한 직무를 분석합니다.", h1:"크리에이터 사주 — 화·목 오행의 창의성을 살려라", sub:"사주로 보는 콘텐츠·마케팅 크리에이터 적합도", emoji:"🎨" },
  { slug:"tech-saju", title:"기술직 사주 | 점운 합격", desc:"기술직 적합 사주. 수·금 오행의 분석력과 전문성이 강한 기술 직무를 찾아드립니다.", h1:"기술직 사주 — 수·금 오행의 전문성과 정밀함", sub:"사주로 보는 IT·엔지니어링 기술직 적합도", emoji:"⚙️" },
  { slug:"business-saju", title:"사업·경영 사주 | 점운 합격", desc:"사업·경영 적합 사주. 목·화 오행의 도전 정신과 토 오행의 안정적 경영 기질을 분석합니다.", h1:"사업 사주 — 목·화 오행의 도전과 토 오행의 경영", sub:"사주로 보는 사업·경영 적합도와 방향", emoji:"💼" },
  { slug:"service-saju", title:"서비스직 사주 | 점운 합격", desc:"서비스직 적합 사주. 화·토 오행의 공감 능력과 친화력이 강한 서비스 직무를 분석합니다.", h1:"서비스직 사주 — 화·토 오행의 공감력이 강점", sub:"사주로 보는 고객서비스·영업 직무 적합도", emoji:"🤝" },
  { slug:"data-career", title:"데이터 커리어 | 점운 합격", desc:"데이터 분석·AI 직무에 맞는 사주 분석. 수·금 오행의 논리적 분석력 방향을 확인하세요.", h1:"데이터 커리어 — 수·금 오행의 분석력을 살려라", sub:"사주로 보는 데이터 사이언스·AI 직무 적합도", emoji:"📊" },
  { slug:"ai-career", title:"AI 직업 사주 | 점운 합격", desc:"AI·디지털 직군 적합 사주. 수·금 오행의 논리력과 창의적 문제해결 기질을 분석합니다.", h1:"AI 직업 사주 — 미래 AI 시대의 내 직업 방향", sub:"사주로 보는 AI 시대 최적 직업과 커리어 전략", emoji:"🤖" },
  { slug:"design-saju", title:"디자인 직업 사주 | 점운 합격", desc:"디자인·크리에이티브 직군 적합 사주. 화·목 오행의 미적 감각과 창의성을 분석합니다.", h1:"디자인 사주 — 화·목 오행의 미적 감각이 강점", sub:"사주로 보는 디자인·크리에이티브 직무 적합도", emoji:"🎨" },
  { slug:"content-saju", title:"콘텐츠 직업 사주 | 점운 합격", desc:"콘텐츠 창작 직군 적합 사주. 화·목 오행의 표현력과 스토리텔링 기질을 분석합니다.", h1:"콘텐츠 사주 — 화·목 오행의 표현력을 살려라", sub:"사주로 보는 콘텐츠 크리에이터 직무 적합도", emoji:"📱" },
  { slug:"jasoseo-sincerity", title:"자소서 진정성 | 점운 합격", desc:"진정성 있는 자소서를 쓰는 법. 내 오행 기질을 솔직하게 담으면 채용담당자의 마음을 움직입니다.", h1:"자소서 진정성 — 오행 기질을 솔직하게 담아라", sub:"진정성 있는 자소서로 합격률을 높이는 법", emoji:"💝" },
  { slug:"jasoseo-differentiation", title:"자소서 차별화 | 점운 합격", desc:"자소서 차별화 전략. 천편일률적 자소서에서 벗어나 오행 기질로 차별화하는 방법입니다.", h1:"자소서 차별화 — 오행으로 만드는 나만의 자소서", sub:"1만 명 중에서 눈에 띄는 자소서 차별화 전략", emoji:"⭐" },
  { slug:"jasoseo-motivation", title:"자소서 지원동기 | 점운 합격", desc:"자소서 지원동기 작성법. 내 오행 기질과 기업의 에너지를 연결하는 설득력 있는 동기를 만드세요.", h1:"자소서 지원동기 — 오행 기질로 설득력을 높여라", sub:"채용담당자를 설득하는 지원동기 작성 전략", emoji:"🎯" },
  { slug:"jasoseo-strength", title:"자소서 강점 작성 | 점운 합격", desc:"자소서 강점을 오행 기질에서 찾으세요. 억지로 만든 강점보다 타고난 오행 강점이 설득력 있습니다.", h1:"자소서 강점 — 오행 기질에서 진짜 강점을 찾아라", sub:"사주 오행에서 찾는 나만의 자소서 강점", emoji:"💪" },
  { slug:"jasoseo-weakness", title:"자소서 약점 극복 | 점운 합격", desc:"자소서 약점 극복 전략. 오행 기질로 약점을 성장 스토리로 전환하는 방법을 찾으세요.", h1:"자소서 약점 — 오행 기질로 약점을 강점으로", sub:"약점을 성장 스토리로 만드는 자소서 전략", emoji:"🌱" },
  { slug:"salary-unse", title:"연봉 운세 | 점운 합격", desc:"연봉 운세를 사주로 분석합니다. 내 사주에서 연봉 상승 에너지가 강한 시기와 방향을 확인하세요.", h1:"연봉 운세 — 사주로 보는 나의 연봉 상승 타이밍", sub:"오행 재물 에너지로 보는 연봉 협상 전략", emoji:"💰" },
  { slug:"promotion-saju", title:"승진 사주 | 점운 합격", desc:"승진 사주를 분석합니다. 내 사주에서 승진 에너지가 강한 시기와 직장 내 어필 방향을 확인하세요.", h1:"승진 사주 — 사주로 보는 나의 승진 에너지", sub:"오행 성공 에너지와 승진 타이밍 사주 분석", emoji:"⬆️" },
  { slug:"work-life", title:"워라밸 사주 | 점운 합격", desc:"워라밸에 맞는 직업을 사주로 찾으세요. 내 오행 기질에 맞는 일·삶의 균형 방향을 분석합니다.", h1:"워라밸 사주 — 오행 기질에 맞는 일·삶의 균형", sub:"사주로 보는 나의 최적 워라밸 직업 방향", emoji:"⚖️" },
  { slug:"remote-work", title:"재택근무 사주 | 점운 합격", desc:"재택근무에 맞는 사주를 분석합니다. 내 오행 기질이 재택과 출근 중 어떤 환경에 맞는지 확인하세요.", h1:"재택근무 사주 — 내 오행 기질은 재택이 맞나?", sub:"오행 기질로 보는 최적 근무 환경 분석", emoji:"🏠" },
  { slug:"chwieob-anxiety", title:"취업 불안 해소 | 점운 합격", desc:"취업 불안을 사주로 관리하세요. 내 오행 기질에 맞는 불안 해소법과 자신감 회복 방법입니다.", h1:"취업 불안 — 사주로 보는 나의 불안 해소법", sub:"오행 기질별 취업 불안 해소와 자신감 회복", emoji:"🕊️" },
  { slug:"hapgyeok-wish", title:"합격 기원 사주 | 점운 합격", desc:"합격을 기원하는 사주 분석. 내 합격 에너지가 강한 방향과 날짜를 찾아 합격 가능성을 높이세요.", h1:"합격 기원 — 사주로 찾는 합격 에너지 방향", sub:"합격 에너지를 높이는 사주 분석과 기원", emoji:"🙏" },
  { slug:"fresh-graduate", title:"신입 자소서 | 점운 합격", desc:"신입 취업 자소서 전략. 경험이 없는 신입도 오행 기질로 채용담당자를 설득하는 방법입니다.", h1:"신입 자소서 — 경험 없어도 오행 기질로 합격", sub:"신입 취업자를 위한 오행 기질 자소서 전략", emoji:"🎓" },
  { slug:"experienced-hire", title:"경력직 자소서 | 점운 합격", desc:"경력직 이직 자소서 전략. 경력을 오행 기질과 연결해 채용담당자를 설득하는 방법입니다.", h1:"경력직 자소서 — 경력과 오행 기질의 완벽한 연결", sub:"경력직 이직을 위한 오행 기질 자소서 전략", emoji:"🔑" },
];

export async function generateStaticParams() {
  return DATA.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<import("next").Metadata> {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];
  return {
    title: d.title,
    description: d.desc,
    keywords: ["합격자소서", "취업사주", "자소서전략", "점운합격", "AI자소서", "합격운세"],
    openGraph: { title: d.title, description: d.desc, url: `https://jeomun.com/resume/guide/${d.slug}` },
  };
}

export default async function ResumeSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];

  const features = [
    { icon: "📊", title: "합격 가능성 점수", desc: "생년월일 + 직무로 합격 가능성을 0~100점으로 수치화해 드립니다." },
    { icon: "🎯", title: "직무 맞춤 키워드", desc: "내 오행 기질에서 나온 자소서 핵심 키워드로 차별화합니다." },
    { icon: "💬", title: "면접 예상 질문", desc: "직무별 면접 예상 질문 TOP 3를 미리 확인하고 준비하세요." },
    { icon: "🔮", title: "합격 타이밍 분석", desc: "사주 대운·세운으로 올해 취업 에너지가 강한 시기를 찾아드립니다." },
  ];

  const faqs = [
    { q: "생년월일만으로 자소서 전략이 나오나요?", a: "네. 오행(목·화·토·금·수)으로 기질을 분석하고, 직무·기업규모를 더해 225가지 맞춤 조합으로 자소서 전략을 생성합니다." },
    { q: "사주와 취업이 무슨 관계인가요?", a: "사주는 타고난 기질과 에너지 흐름을 봅니다. 내 오행 기질과 직무의 에너지가 일치할 때 합격률이 높아지고, 일치하는 날 면접·원서 제출 시 더 유리합니다." },
    { q: "결과는 언제 나오나요?", a: "이름·생년월일·직무·기업규모 입력 후 즉시 분석 결과를 확인할 수 있습니다. 별도 대기 없이 바로 나옵니다." },
    { q: "자소서 전략이 모두 다르게 나오나요?", a: "네. 오행(5종) × 직무(9개) × 기업규모(5개) = 225가지 맞춤 조합으로 개인별 자소서 전략이 생성됩니다." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0015 0%,#1a0035 50%,#0a0015 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "#f5f5f5", wordBreak: "keep-all" as const }}>
      {/* 히어로 */}
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{d.emoji}</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1.3, margin: "0 0 14px", background: "linear-gradient(135deg,#a78bfa,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{d.h1}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 28px" }}>{d.sub}</p>
        <Link href="/resume/start" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 32px", borderRadius: 30, textDecoration: "none", boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}>
          무료로 합격 점수 확인하기 →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>생년월일 + 직무 입력 → 즉시 분석</p>
      </section>

      {/* 특징 */}
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>점운 합격이 특별한 이유</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "18px 14px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 900, color: "white", margin: "0 0 6px" }}>{f.title}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#a78bfa", margin: "0 0 8px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 하단 CTA */}
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#1a0035,#2d1b69)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 24, padding: "32px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 10px" }}>지금 합격 점수 확인하기</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 22px" }}>생년월일 + 직무 + 기업규모 → 합격 가능성 점수 + 자소서 전략 + 면접 질문 즉시 확인</p>
          <Link href="/resume/start" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 30, textDecoration: "none" }}>
            무료 합격 분석 시작 →
          </Link>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/resume" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>← 점운 합격 홈</Link>
          <Link href="/main-v2" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>사주 직업운 보기</Link>
          <Link href="/jigun" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>직운 부업 추천</Link>
        </div>
      </section>
    </main>
  );
}
