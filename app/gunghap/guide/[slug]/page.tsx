import type { Metadata } from "next";
import Link from "next/link";

type Entry = { slug: string; title: string; desc: string; h1: string; sub: string; emoji: string; };

const DATA: Entry[] = [
  { slug:"saju-gunghap", title:"사주 궁합 | 점운 궁합", desc:"두 사람의 사주 오행 궁합을 무료로 분석합니다. 생년월일로 오행 에너지 궁합 점수와 연애 패턴을 확인하세요.", h1:"사주 궁합 — 오행으로 보는 두 사람의 인연", sub:"생년월일 오행 궁합 점수와 연애 패턴 무료 분석", emoji:"💑" },
  { slug:"free-gunghap", title:"무료 궁합 | 점운 궁합", desc:"무료 궁합 분석 — 두 사람의 생년월일로 오행 궁합 점수를 즉시 무료로 확인하세요.", h1:"무료 궁합 — 생년월일로 즉시 오행 궁합 확인", sub:"완전 무료로 보는 오행 궁합 점수와 연애 분석", emoji:"🆓" },
  { slug:"yeonin-gunghap", title:"연인 궁합 | 점운 궁합", desc:"연인 궁합 분석 — 현재 연인과의 오행 궁합과 연애 패턴을 분석합니다. 장단점과 갈등 원인도 확인하세요.", h1:"연인 궁합 — 두 사람의 연애 패턴 분석", sub:"오행 궁합으로 보는 연인과의 장단점·갈등 원인", emoji:"💕" },
  { slug:"gyeolhon-gunghap", title:"결혼 궁합 | 점운 궁합", desc:"결혼 궁합 분석 — 결혼을 고려 중이라면 오행 궁합으로 두 사람의 장기적 관계를 확인하세요.", h1:"결혼 궁합 — 오행으로 보는 평생 인연 분석", sub:"결혼 적합도·장기 관계·상생 패턴 오행 분석", emoji:"💍" },
  { slug:"ohaeng-gunghap", title:"오행 궁합 | 점운 궁합", desc:"오행 궁합 분석 — 목·화·토·금·수 오행 에너지로 두 사람의 상생(相生)·상극(相剋) 관계를 분석합니다.", h1:"오행 궁합 — 상생과 상극으로 보는 두 사람", sub:"목·화·토·금·수 오행 에너지 상생·상극 관계 분석", emoji:"☯️" },
  { slug:"mokho-gunghap", title:"목·화 오행 궁합 | 점운 궁합", desc:"목(木)·화(火) 오행 궁합 — 목과 화는 상생 관계입니다. 두 사람의 에너지가 서로 강화됩니다.", h1:"목·화 궁합 — 상생하는 최고의 조합", sub:"목 오행과 화 오행의 상생 궁합 분석", emoji:"🌿🔥" },
  { slug:"hwato-gunghap", title:"화·토 오행 궁합 | 점운 궁합", desc:"화(火)·토(土) 오행 궁합 — 화와 토는 상생 관계입니다. 열정과 안정이 서로를 지지합니다.", h1:"화·토 궁합 — 열정과 안정의 상생 조합", sub:"화 오행과 토 오행의 상생 궁합 분석", emoji:"🔥🌍" },
  { slug:"togeum-gunghap", title:"토·금 오행 궁합 | 점운 궁합", desc:"토(土)·금(金) 오행 궁합 — 토와 금은 상생 관계입니다. 안정과 결단력이 조화를 이룹니다.", h1:"토·금 궁합 — 안정과 결단의 상생 조합", sub:"토 오행과 금 오행의 상생 궁합 분석", emoji:"🌍💎" },
  { slug:"geumsoo-gunghap", title:"금·수 오행 궁합 | 점운 궁합", desc:"금(金)·수(水) 오행 궁합 — 금과 수는 상생 관계입니다. 결단력과 지혜가 서로 강화됩니다.", h1:"금·수 궁합 — 결단과 지혜의 상생 조합", sub:"금 오행과 수 오행의 상생 궁합 분석", emoji:"💎💧" },
  { slug:"sumok-gunghap", title:"수·목 오행 궁합 | 점운 궁합", desc:"수(水)·목(木) 오행 궁합 — 수와 목은 상생 관계입니다. 지혜와 성장이 서로를 키웁니다.", h1:"수·목 궁합 — 지혜와 성장의 상생 조합", sub:"수 오행과 목 오행의 상생 궁합 분석", emoji:"💧🌿" },
  { slug:"mok-gunghap", title:"목 오행 궁합 | 점운 궁합", desc:"목(木) 오행 사람의 궁합 — 목 오행 기질의 궁합 최적 파트너와 주의 관계를 분석합니다.", h1:"목 오행 궁합 — 목 기질의 최적 파트너", sub:"목 오행 사람과 잘 맞는 오행과 주의 관계", emoji:"🌿" },
  { slug:"hwa-gunghap", title:"화 오행 궁합 | 점운 궁합", desc:"화(火) 오행 사람의 궁합 — 화 오행 기질의 궁합 최적 파트너와 주의 관계를 분석합니다.", h1:"화 오행 궁합 — 화 기질의 최적 파트너", sub:"화 오행 사람과 잘 맞는 오행과 주의 관계", emoji:"🔥" },
  { slug:"to-gunghap", title:"토 오행 궁합 | 점운 궁합", desc:"토(土) 오행 사람의 궁합 — 토 오행 기질의 궁합 최적 파트너와 주의 관계를 분석합니다.", h1:"토 오행 궁합 — 토 기질의 최적 파트너", sub:"토 오행 사람과 잘 맞는 오행과 주의 관계", emoji:"🌍" },
  { slug:"geum-gunghap", title:"금 오행 궁합 | 점운 궁합", desc:"금(金) 오행 사람의 궁합 — 금 오행 기질의 궁합 최적 파트너와 주의 관계를 분석합니다.", h1:"금 오행 궁합 — 금 기질의 최적 파트너", sub:"금 오행 사람과 잘 맞는 오행과 주의 관계", emoji:"💎" },
  { slug:"su-gunghap", title:"수 오행 궁합 | 점운 궁합", desc:"수(水) 오행 사람의 궁합 — 수 오행 기질의 궁합 최적 파트너와 주의 관계를 분석합니다.", h1:"수 오행 궁합 — 수 기질의 최적 파트너", sub:"수 오행 사람과 잘 맞는 오행과 주의 관계", emoji:"💧" },
  { slug:"idong-gunghap", title:"이동 궁합 | 점운 궁합", desc:"이 사람이 내 인연인가? — 오행 궁합으로 지금 만나는 사람이 나의 진짜 인연인지 분석합니다.", h1:"이 사람이 내 인연? — 오행 궁합으로 분석", sub:"현재 만나는 사람과의 오행 궁합 인연 분석", emoji:"🤔" },
  { slug:"cheotnune-gunghap", title:"첫눈에 반한 궁합 | 점운 궁합", desc:"첫눈에 반한 사람과의 궁합 — 오행 끌림의 과학으로 첫눈에 반하는 궁합 패턴을 분석합니다.", h1:"첫눈에 반한 궁합 — 오행 끌림의 과학", sub:"첫눈에 반하는 오행 궁합 패턴과 인연 분석", emoji:"👀" },
  { slug:"solo-gunghap", title:"솔로 궁합 찾기 | 점운 궁합", desc:"솔로인 당신에게 맞는 이상형 오행 궁합 — 내 오행 기질에 맞는 이상적인 파트너를 찾으세요.", h1:"솔로 이상형 — 내 오행에 맞는 이상형 찾기", sub:"내 오행 기질에 맞는 이상적인 파트너 분석", emoji:"💫" },
  { slug:"galdung-gunghap", title:"갈등 궁합 분석 | 점운 궁합", desc:"왜 이 사람과 자꾸 싸울까? — 오행 상극 관계로 갈등의 원인과 해결법을 분석합니다.", h1:"갈등 궁합 — 왜 자꾸 싸우는지 오행이 답한다", sub:"오행 상극 관계로 보는 갈등 원인과 해결법", emoji:"⚔️" },
  { slug:"jaemul-gunghap", title:"재물 궁합 | 점운 궁합", desc:"돈 궁합 분석 — 두 사람이 함께할 때 재물 에너지가 어떻게 작용하는지 오행으로 분석합니다.", h1:"재물 궁합 — 함께하면 돈이 모이는 궁합", sub:"두 사람의 오행 재물 에너지 궁합 분석", emoji:"💰" },
  { slug:"geongang-gunghap", title:"건강 궁합 | 점운 궁합", desc:"건강 궁합 분석 — 두 사람의 오행 건강 에너지 궁합으로 서로의 건강에 미치는 영향을 분석합니다.", h1:"건강 궁합 — 서로의 건강에 미치는 영향", sub:"두 사람의 오행 건강 에너지 궁합 분석", emoji:"❤️" },
  { slug:"yeonae-gunghap", title:"연애 궁합 테스트 | 점운 궁합", desc:"연애 궁합 테스트 — 두 사람의 연애 스타일이 맞는지 오행으로 즉시 테스트해보세요.", h1:"연애 궁합 테스트 — 두 사람의 연애 스타일 분석", sub:"오행 에너지로 보는 연애 스타일과 궁합 점수", emoji:"💝" },
  { slug:"mbti-gunghap", title:"MBTI 궁합 | 점운 궁합", desc:"MBTI 궁합과 오행 궁합을 함께 보는 종합 분석 — 두 사람의 기질 궁합을 더 정확하게 파악하세요.", h1:"MBTI+오행 궁합 — 기질 궁합 종합 분석", sub:"MBTI와 오행을 결합한 종합 궁합 분석", emoji:"🧠" },
  { slug:"hyeolgaeg-gunghap", title:"혈액형 궁합 | 점운 궁합", desc:"혈액형 궁합과 오행 궁합을 함께 — 혈액형 기반 궁합과 오행 에너지를 결합한 종합 분석입니다.", h1:"혈액형+오행 궁합 — 종합 궁합 분석", sub:"혈액형 궁합과 오행 에너지를 결합한 분석", emoji:"🩸" },
  { slug:"byeoljari-gunghap", title:"별자리 궁합 | 점운 궁합", desc:"별자리 궁합과 오행 궁합을 함께 — 별자리와 오행 에너지를 결합한 종합 궁합 분석입니다.", h1:"별자리+오행 궁합 — 종합 궁합 분석", sub:"별자리와 사주 오행을 결합한 종합 궁합", emoji:"⭐" },
  { slug:"naeneon-gunghap", title:"나이 차이 궁합 | 점운 궁합", desc:"나이 차이 궁합 — 나이 차이가 있는 커플의 오행 궁합을 분석합니다. 연상·연하 궁합도 확인하세요.", h1:"나이 차이 궁합 — 연상·연하 오행 궁합 분석", sub:"나이 차이가 있는 커플의 오행 궁합 분석", emoji:"👫" },
  { slug:"janggeori-gunghap", title:"장거리 연애 궁합 | 점운 궁합", desc:"장거리 연애 궁합 — 멀리 있는 연인과의 오행 궁합과 장기 인연 가능성을 분석합니다.", h1:"장거리 연애 궁합 — 멀어도 맞는 인연인가?", sub:"장거리 연애 커플의 오행 궁합과 인연 분석", emoji:"📍" },
  { slug:"jaehoe-gunghap", title:"재회 궁합 | 점운 궁합", desc:"재회 가능성 궁합 — 헤어진 연인과의 오행 궁합으로 재회 가능성과 관계 회복 방향을 분석합니다.", h1:"재회 궁합 — 헤어진 연인과의 재회 가능성", sub:"오행 궁합으로 보는 재회 가능성과 관계 회복", emoji:"🔄" },
  { slug:"dongjeongsae-gunghap", title:"동성 궁합 | 점운 궁합", desc:"동성 친구·동료 궁합 — 같은 성별 친구나 동료와의 오행 궁합으로 관계 패턴을 분석합니다.", h1:"동성 궁합 — 친구·동료와의 오행 관계 분석", sub:"동성 친구·동료와의 오행 궁합과 관계 패턴", emoji:"🤝" },
  { slug:"appa-eomma-gunghap", title:"부모 자식 궁합 | 점운 궁합", desc:"부모 자식 궁합 — 부모와 자녀의 오행 궁합으로 양육 방향과 관계 패턴을 분석합니다.", h1:"부모 자식 궁합 — 오행으로 보는 양육 관계", sub:"부모와 자녀의 오행 궁합과 양육 방향 분석", emoji:"👨‍👩‍👧" },
  { slug:"gisuk-gunghap", title:"기숙사 룸메이트 궁합 | 점운 궁합", desc:"함께 사는 사람과의 궁합 — 룸메이트·동거인의 오행 궁합으로 생활 패턴 궁합을 분석합니다.", h1:"룸메이트 궁합 — 함께 사는 사람과의 궁합", sub:"동거·룸메이트의 오행 궁합과 생활 패턴 분석", emoji:"🏠" },
  { slug:"jikjang-gunghap", title:"직장 동료 궁합 | 점운 궁합", desc:"직장 동료 궁합 — 함께 일하는 사람과의 오행 궁합으로 협업 패턴과 갈등 예방을 분석합니다.", h1:"직장 동료 궁합 — 함께 일하는 사람과의 궁합", sub:"직장 동료와의 오행 궁합과 협업 패턴 분석", emoji:"💼" },
  { slug:"sangsa-gunghap", title:"상사 부하 궁합 | 점운 궁합", desc:"상사·부하 궁합 — 직장 상하 관계의 오행 궁합으로 소통 방식과 관계 패턴을 분석합니다.", h1:"상사·부하 궁합 — 직장 관계 오행 분석", sub:"상사와 부하의 오행 궁합과 소통 패턴 분석", emoji:"👔" },
  { slug:"chingu-gunghap", title:"친구 궁합 | 점운 궁합", desc:"친구 궁합 — 가장 친한 친구와의 오행 궁합으로 우정의 패턴과 강점을 분석합니다.", h1:"친구 궁합 — 가장 친한 친구와의 오행 분석", sub:"친구와의 오행 궁합과 우정 패턴 분석", emoji:"🤗" },
  { slug:"gwangye-gunghap", title:"관계별 궁합 총정리 | 점운 궁합", desc:"관계별 오행 궁합 총정리 — 연인·친구·동료·가족 모든 관계의 오행 궁합을 한 번에 분석합니다.", h1:"관계별 오행 궁합 총정리", sub:"연인·친구·동료·가족 모든 관계 오행 궁합", emoji:"🌐" },
  { slug:"gwangye-jinhwal", title:"관계 진화 궁합 | 점운 궁합", desc:"관계가 발전하는 궁합 — 두 사람의 오행 궁합에서 친구→연인→결혼으로 발전하는 패턴을 분석합니다.", h1:"관계 발전 궁합 — 친구에서 연인으로 발전하는 궁합", sub:"오행 궁합으로 보는 관계 발전 가능성 분석", emoji:"📈" },
  { slug:"sungsoo-gunghap", title:"성수기 궁합 | 점운 궁합", desc:"고백·프로포즈 최적 타이밍 궁합 — 오행 에너지로 두 사람의 관계가 가장 좋은 시기를 분석합니다.", h1:"고백·프로포즈 최적 타이밍 궁합 분석", sub:"오행 에너지로 보는 고백·프로포즈 최적 타이밍", emoji:"💌" },
  { slug:"geongang-gunghap2", title:"건강과 궁합 | 점운 궁합", desc:"건강을 높이는 궁합 — 함께 있을 때 건강 에너지가 올라가는 오행 궁합 패턴을 분석합니다.", h1:"건강 높이는 궁합 — 함께 있으면 건강해지는 조합", sub:"건강 에너지를 높이는 오행 궁합 패턴 분석", emoji:"💪" },
  { slug:"gyoyuk-gunghap", title:"자녀 교육 궁합 | 점운 궁합", desc:"자녀 교육 궁합 — 부모와 자녀의 오행 궁합으로 최적 교육 방식과 학습 방향을 분석합니다.", h1:"자녀 교육 궁합 — 아이에게 맞는 교육 방식", sub:"부모-자녀 오행 궁합으로 찾는 최적 교육 방향", emoji:"📚" },
  { slug:"seongjokke-gunghap", title:"성격 궁합 | 점운 궁합", desc:"성격 궁합 분석 — 두 사람의 성격이 오행으로 얼마나 맞는지, 어디서 충돌하는지 분석합니다.", h1:"성격 궁합 — 두 사람의 성격 오행 궁합 분석", sub:"오행 기질로 보는 성격 궁합과 충돌 포인트", emoji:"🎭" },
  { slug:"sotongjangae-gunghap", title:"소통 궁합 | 점운 궁합", desc:"소통 궁합 분석 — 두 사람이 얼마나 잘 소통하는지 오행 에너지로 분석합니다.", h1:"소통 궁합 — 두 사람의 대화 스타일 분석", sub:"오행 에너지로 보는 소통 스타일과 대화 궁합", emoji:"💬" },
  { slug:"mirae-gunghap", title:"미래 궁합 | 점운 궁합", desc:"두 사람의 미래 궁합 — 지금 에너지에서 두 사람의 5년·10년 후 관계를 오행으로 예측합니다.", h1:"미래 궁합 — 두 사람의 5년·10년 후 관계 예측", sub:"오행 에너지로 보는 두 사람의 장기 미래 분석", emoji:"🔭" },
  { slug:"gyeolhon-timing-gunghap", title:"결혼 타이밍 궁합 | 점운 궁합", desc:"결혼 최적 타이밍 궁합 — 두 사람이 결혼하기 가장 좋은 에너지 시기를 오행으로 분석합니다.", h1:"결혼 타이밍 궁합 — 결혼하기 가장 좋은 시기", sub:"오행 에너지로 보는 결혼 최적 타이밍 분석", emoji:"📅" },
  { slug:"ibyeol-gunghap", title:"이별 궁합 | 점운 궁합", desc:"이별 후 재회 가능성 — 헤어진 두 사람의 오행 궁합으로 재회·새 출발 가능성을 분석합니다.", h1:"이별 후 궁합 — 재회할 수 있는 인연인가?", sub:"오행 궁합으로 보는 이별 후 재회 가능성 분석", emoji:"💔" },
  { slug:"gunghap-score", title:"궁합 점수 계산 | 점운 궁합", desc:"궁합 점수 계산 — 오행 궁합 점수 44~99점 중 두 사람이 몇 점인지 즉시 계산해보세요.", h1:"궁합 점수 계산 — 두 사람의 오행 궁합 점수", sub:"오행 궁합 점수 계산법과 점수별 의미 분석", emoji:"🔢" },
  { slug:"gunghap-test", title:"궁합 테스트 | 점운 궁합", desc:"궁합 테스트 — 두 사람의 생년월일을 입력하면 즉시 오행 궁합 점수와 관계 분석을 확인합니다.", h1:"궁합 테스트 — 생년월일로 즉시 궁합 확인", sub:"생년월일 입력 → 오행 궁합 점수+관계 분석 즉시", emoji:"📊" },
  { slug:"gunghap-app", title:"궁합 앱 | 점운 궁합", desc:"무료 궁합 앱 — 두 사람의 생년월일로 즉시 오행 궁합을 분석하는 무료 앱입니다.", h1:"궁합 앱 — 즉시 무료 오행 궁합 분석 앱", sub:"두 사람의 생년월일로 즉시 분석하는 무료 궁합 앱", emoji:"📱" },
  { slug:"2026-gunghap", title:"2026년 궁합 | 점운 궁합", desc:"2026년 두 사람의 궁합 — 올해 오행 에너지에서 두 사람의 관계가 어떻게 흘러가는지 분석합니다.", h1:"2026년 궁합 — 올해 두 사람의 관계 흐름", sub:"2026년 오행 에너지와 두 사람의 궁합 분석", emoji:"📅" },
  { slug:"gung-gunghabok", title:"궁합 복이 있나 | 점운 궁합", desc:"내 사주에 궁합 복이 있나? — 내 사주 오행에서 이성 인연·결혼 에너지가 있는지 분석합니다.", h1:"내 사주에 궁합 복이 있나? 오행으로 분석", sub:"내 사주 오행의 이성 인연·결혼 에너지 분석", emoji:"🍀" },
  { slug:"namja-gunghap", title:"남자 이상형 궁합 | 점운 궁합", desc:"남자 이상형 오행 궁합 — 내 오행 기질에 가장 잘 맞는 남성 파트너 유형을 분석합니다.", h1:"남자 이상형 궁합 — 나에게 맞는 남성 오행 유형", sub:"내 오행 기질에 맞는 이상적인 남성 파트너 분석", emoji:"💙" },
  { slug:"yeoja-gunghap", title:"여자 이상형 궁합 | 점운 궁합", desc:"여자 이상형 오행 궁합 — 내 오행 기질에 가장 잘 맞는 여성 파트너 유형을 분석합니다.", h1:"여자 이상형 궁합 — 나에게 맞는 여성 오행 유형", sub:"내 오행 기질에 맞는 이상적인 여성 파트너 분석", emoji:"❤️" },
  { slug:"ohaeng-sangsaeng", title:"오행 상생 궁합 | 점운 궁합", desc:"오행 상생 궁합 — 목→화→토→금→수 상생 관계로 가장 좋은 궁합 조합을 분석합니다.", h1:"오행 상생 궁합 — 서로를 키워주는 최고의 조합", sub:"오행 상생 관계로 보는 궁합 최고 조합 분석", emoji:"🔄" },
  { slug:"ohaeng-sanggeum", title:"오행 상극 궁합 | 점운 궁합", desc:"오행 상극 궁합 — 목→토, 토→수, 수→화, 화→금, 금→목 상극 관계에서 갈등 원인을 분석합니다.", h1:"오행 상극 궁합 — 갈등 원인과 극복 방법", sub:"오행 상극 관계 궁합의 갈등 원인과 해결법", emoji:"⚡" },
  { slug:"inweon-kkeum", title:"인연 끊기 궁합 | 점운 궁합", desc:"인연이 끊어지는 궁합 패턴 — 오행으로 자꾸 헤어지고 재회하는 반복 인연 패턴을 분석합니다.", h1:"반복 인연 궁합 — 자꾸 끌리는 이유", sub:"오행으로 보는 반복되는 인연 패턴 분석", emoji:"🔁" },
  { slug:"geumjeong-gunghap", title:"금정 궁합 | 점운 궁합", desc:"금정(金正) 궁합 분석 — 한국 전통 사주 궁합 방식과 오행 에너지를 결합한 현대식 궁합 분석.", h1:"전통+현대 사주 궁합 — 오행 에너지 종합 분석", sub:"전통 사주 궁합과 오행 에너지를 결합한 분석", emoji:"🏛️" },
  { slug:"tarot-gunghap", title:"타로+궁합 | 점운 궁합", desc:"타로카드와 오행 궁합을 함께 — 타로 에너지와 오행 에너지로 두 사람의 관계를 더 깊이 분석합니다.", h1:"타로+오행 궁합 — 두 가지 관점으로 보는 궁합", sub:"타로카드와 오행 에너지를 결합한 궁합 분석", emoji:"🃏" },
  { slug:"gunghap-vs-love", title:"궁합 vs 사랑 | 점운 궁합", desc:"궁합이 안 맞아도 사랑할 수 있을까? — 오행 궁합과 실제 관계의 차이를 분석합니다.", h1:"궁합이 안 맞아도 사랑할 수 있을까?", sub:"오행 궁합 점수와 실제 관계 사이의 차이 분석", emoji:"💭" },
  { slug:"best-gunghap", title:"최고 궁합 조합 | 점운 궁합", desc:"오행별 최고 궁합 조합 — 목·화·토·금·수 오행별로 가장 이상적인 궁합 파트너 조합입니다.", h1:"오행별 최고 궁합 조합 — 나의 이상적 파트너", sub:"오행별 최고 궁합 조합과 관계 패턴 분석", emoji:"👑" },
  { slug:"worst-gunghap", title:"최악 궁합 조합 | 점운 궁합", desc:"오행별 주의 궁합 조합 — 목·화·토·금·수 오행별로 가장 갈등이 많은 궁합 조합입니다.", h1:"오행별 주의 궁합 — 갈등이 많은 조합 확인", sub:"오행별 갈등 많은 궁합 조합과 극복 방법", emoji:"⚠️" },
  { slug:"in-yeon-gunghap", title:"인연 궁합 | 점운 궁합", desc:"전생 인연 궁합 — 오행으로 두 사람이 전생 인연으로 연결된 관계인지 분석합니다.", h1:"전생 인연 궁합 — 오행으로 보는 전생 인연", sub:"오행으로 분석하는 전생 인연과 현재 관계 의미", emoji:"⏳" },
  { slug:"gunghap-guseng", title:"궁합 구성 | 점운 궁합", desc:"사주 궁합 구성 요소 — 연주·월주·일주·시주의 오행으로 궁합을 분석하는 방법을 알아보세요.", h1:"사주 궁합 구성 — 연·월·일·시 오행 궁합법", sub:"사주 원국 오행으로 궁합을 분석하는 방법", emoji:"📐" },
  { slug:"il-gunghap", title:"일주 궁합 | 점운 궁합", desc:"일주(日主) 궁합 — 사주에서 가장 중요한 일간 오행으로 궁합을 분석합니다.", h1:"일주 궁합 — 일간 오행으로 보는 핵심 궁합", sub:"사주 일간 오행으로 분석하는 핵심 궁합 분석", emoji:"☀️" },
  { slug:"eon-gunghap", title:"연주 궁합 | 점운 궁합", desc:"연주(年柱) 궁합 — 생년 오행으로 두 사람의 기질과 기본 에너지 궁합을 분석합니다.", h1:"연주 궁합 — 생년 오행으로 보는 기질 궁합", sub:"생년 오행으로 분석하는 기질 궁합 분석", emoji:"🗓️" },
  { slug:"gunghap-free-test", title:"무료 궁합 테스트 | 점운 궁합", desc:"완전 무료 궁합 테스트 — 두 사람의 생년월일을 입력하면 즉시 오행 궁합 점수를 확인할 수 있습니다.", h1:"무료 궁합 테스트 — 즉시 오행 궁합 점수 확인", sub:"두 사람 생년월일 입력 → 즉시 궁합 점수 확인", emoji:"✅" },
  { slug:"gunghap-gaenyeom", title:"궁합이란 무엇인가 | 점운 궁합", desc:"궁합이란? — 사주 오행으로 두 사람의 에너지 조화를 분석하는 전통 방법입니다. 의미와 활용법을 알아보세요.", h1:"궁합이란? — 오행으로 보는 두 사람의 에너지 조화", sub:"사주 오행 궁합의 의미와 현대적 활용법", emoji:"📖" },
  { slug:"gunghap-history", title:"궁합의 역사 | 점운 궁합", desc:"궁합의 역사 — 한국 전통 사주 궁합의 역사와 현대 오행 궁합으로의 발전 과정을 소개합니다.", h1:"궁합의 역사 — 전통에서 현대 오행 궁합으로", sub:"한국 전통 사주 궁합의 역사와 현대적 발전", emoji:"🏛️" },
  { slug:"gunghap-accuracy", title:"궁합 정확도 | 점운 궁합", desc:"오행 궁합은 얼마나 정확한가? — 오행 에너지 기반 궁합 분석의 근거와 정확도를 설명합니다.", h1:"오행 궁합 정확도 — 근거와 활용 방법", sub:"오행 에너지 궁합의 근거와 실생활 활용법", emoji:"🎯" },
  { slug:"yeolsen-gunghap", title:"열성 궁합 | 점운 궁합", desc:"열정적인 연애 궁합 — 화·목 오행이 강한 사람들의 열정적인 연애 궁합 패턴을 분석합니다.", h1:"열정 연애 궁합 — 화·목 오행의 불꽃 궁합", sub:"화·목 오행이 강한 사람들의 연애 패턴 분석", emoji:"🔥" },
  { slug:"andong-gunghap", title:"안정적 궁합 | 점운 궁합", desc:"안정적인 관계 궁합 — 토·금 오행이 강한 사람들의 안정적이고 신뢰 깊은 궁합 패턴을 분석합니다.", h1:"안정적 궁합 — 토·금 오행의 신뢰 깊은 궁합", sub:"토·금 오행이 강한 사람들의 안정적 관계 패턴", emoji:"🏰" },
  { slug:"romantic-gunghap", title:"로맨틱 궁합 | 점운 궁합", desc:"로맨틱한 연애 궁합 — 화·수 오행 조합의 신비롭고 로맨틱한 궁합 패턴을 분석합니다.", h1:"로맨틱 궁합 — 화·수 오행의 신비로운 조합", sub:"화·수 오행 조합의 로맨틱한 궁합 패턴 분석", emoji:"🌹" },
  { slug:"friend-to-lover", title:"친구에서 연인으로 | 점운 궁합", desc:"친구에서 연인으로 발전하는 궁합 — 우정에서 사랑으로 발전하는 오행 궁합 패턴을 분석합니다.", h1:"친구→연인 발전 궁합 — 우정이 사랑이 되는 궁합", sub:"친구에서 연인으로 발전하는 오행 궁합 패턴", emoji:"💫" },
  { slug:"gunghabok-2", title:"궁합이 좋은 연예인 | 점운 궁합", desc:"궁합 좋은 연예인 커플 — 오행 궁합으로 분석한 연예인 커플의 궁합 패턴을 확인하세요.", h1:"연예인 오행 궁합 — 이상적인 궁합 패턴 분석", sub:"유명 커플의 오행 궁합 패턴과 연애 분석", emoji:"⭐" },
  { slug:"daeun-gunghap", title:"대운 궁합 | 점운 궁합", desc:"대운 궁합 — 두 사람의 10년 대운에서 관계가 어떻게 변하는지 오행으로 분석합니다.", h1:"대운 궁합 — 10년 흐름에서 보는 두 사람의 관계", sub:"대운 오행으로 보는 두 사람의 장기 관계 변화", emoji:"⏳" },
  { slug:"sessal-gunghap", title:"세살 궁합 | 점운 궁합", desc:"세운 궁합 — 올해 연간 오행에서 두 사람의 관계가 어떻게 흘러가는지 분석합니다.", h1:"세운 궁합 — 올해 두 사람의 관계 흐름 분석", sub:"올해 세운 오행으로 보는 두 사람의 관계 흐름", emoji:"📅" },
  { slug:"gunghap-summary", title:"오행 궁합 요약 | 점운 궁합", desc:"오행 궁합 한눈에 보기 — 목·화·토·금·수 오행별 궁합 매트릭스를 한 번에 확인하세요.", h1:"오행 궁합 매트릭스 — 한눈에 보는 궁합표", sub:"목·화·토·금·수 오행별 궁합 매트릭스 완전 정리", emoji:"📊" },
  { slug:"gunghap-vs-saju", title:"궁합 vs 사주 차이 | 점운 궁합", desc:"궁합과 사주의 차이 — 개인 사주와 두 사람 궁합의 차이를 이해하고 함께 활용하는 방법을 알아보세요.", h1:"사주 vs 궁합 — 차이를 알고 함께 활용하는 법", sub:"개인 사주와 궁합의 차이와 통합 활용 방법", emoji:"⚖️" },
  { slug:"nai-gunghap", title:"나이 차이 궁합 | 점운 궁합", desc:"나이 차이 궁합 분석 — 연상·연하 관계에서 오행 에너지가 어떻게 작용하는지 분석합니다.", h1:"나이 차이 궁합 — 연상·연하 오행 에너지 분석", sub:"나이 차이에 따른 오행 궁합 에너지 조화 분석", emoji:"🎂" },
  { slug:"yeonsang-gunghap", title:"연상 연하 궁합 | 점운 궁합", desc:"연상 연하 궁합 분석 — 나이 차이가 나는 커플의 오행 에너지 궁합과 관계 패턴을 분석합니다.", h1:"연상·연하 궁합 — 나이 차이 커플의 오행 분석", sub:"연상·연하 커플의 오행 궁합 에너지와 관계 패턴", emoji:"👫" },
  { slug:"janggeon-gunghap", title:"장거리 연애 궁합 | 점운 궁합", desc:"장거리 연애 궁합 — 멀리 떨어진 두 사람의 오행 에너지가 장거리 관계를 어떻게 지지하는지 분석합니다.", h1:"장거리 연애 궁합 — 오행이 지지하는 장거리 인연", sub:"장거리 관계에서도 맞는 오행 궁합 패턴 분석", emoji:"✈️" },
  { slug:"jikjang-gunghap", title:"직장 동료 궁합 | 점운 궁합", desc:"직장 동료 궁합 분석 — 함께 일하는 동료와의 오행 에너지 궁합으로 협업 패턴과 갈등 원인을 분석합니다.", h1:"직장 동료 궁합 — 함께 일하는 오행 에너지 조화", sub:"직장 동료와의 오행 궁합과 협업 패턴 분석", emoji:"🏢" },
  { slug:"seonbae-gunghap", title:"선배 후배 궁합 | 점운 궁합", desc:"선배·후배 궁합 분석 — 선후배 관계에서 오행 에너지가 어떻게 조화를 이루는지 분석합니다.", h1:"선배·후배 궁합 — 오행으로 보는 선후배 에너지", sub:"선후배 관계에서의 오행 에너지 조화와 갈등 분석", emoji:"🎓" },
  { slug:"seongjuck-gunghap", title:"성격 궁합 | 점운 궁합", desc:"성격 궁합 분석 — 두 사람의 성격 유형과 오행 기질이 얼마나 잘 맞는지 심층 분석합니다.", h1:"성격 궁합 — 오행 기질로 보는 성격 조화 분석", sub:"두 사람의 성격 유형과 오행 기질 조화 심층 분석", emoji:"🧩" },
  { slug:"chwimi-gunghap", title:"취미 궁합 | 점운 궁합", desc:"취미 궁합 분석 — 오행 기질별 선호하는 취미와 두 사람의 여가 활동 궁합을 분석합니다.", h1:"취미 궁합 — 오행 기질로 보는 여가 활동 조화", sub:"오행 기질별 취미 선호와 두 사람의 여가 궁합 분석", emoji:"🎭" },
  { slug:"sotongjisik-gunghap", title:"소통 방식 궁합 | 점운 궁합", desc:"소통 방식 궁합 분석 — 두 사람의 오행 기질에 따른 소통 방식 차이와 갈등 원인을 분석합니다.", h1:"소통 궁합 — 오행으로 보는 두 사람의 소통 방식", sub:"오행 기질별 소통 방식 차이와 갈등 예방 분석", emoji:"💬" },
  { slug:"gajog-gunghap", title:"가족 관계 궁합 | 점운 궁합", desc:"가족 관계 궁합 — 부모·형제·배우자 가족과의 오행 에너지 궁합을 분석합니다.", h1:"가족 관계 궁합 — 오행으로 보는 가족 에너지", sub:"부모·형제·배우자 가족과의 오행 에너지 궁합 분석", emoji:"👨‍👩‍👧‍👦" },
  { slug:"ilju-gunghap", title:"일주 궁합 | 점운 궁합", desc:"일주 궁합 분석 — 두 사람의 일주(日柱) 천간·지지가 만나 이루는 궁합 패턴을 분석합니다.", h1:"일주 궁합 — 일주 천간·지지로 보는 두 사람 궁합", sub:"일주 천간·지지가 만드는 궁합 패턴 심층 분석", emoji:"🌙" },
  { slug:"yeonju-gunghap", title:"연주 궁합 | 점운 궁합", desc:"연주 궁합 분석 — 두 사람의 태어난 해(年柱) 오행 에너지가 이루는 궁합을 분석합니다.", h1:"연주 궁합 — 태어난 해 오행으로 보는 궁합", sub:"연주 천간·지지로 보는 두 사람의 오행 궁합 분석", emoji:"📅" },
  { slug:"sipseong-gunghap", title:"십성 궁합 | 점운 궁합", desc:"십성 궁합 분석 — 사주 십성(비겁·식상·재성·관성·인성)으로 두 사람의 관계 역할을 분석합니다.", h1:"십성 궁합 — 사주 십성으로 보는 두 사람 역할", sub:"비겁·식상·재성·관성·인성 십성으로 보는 관계 패턴", emoji:"⭐" },
  { slug:"gunghap-jeomsu", title:"궁합 점수 해석 | 점운 궁합", desc:"궁합 점수 해석법 — 44~99점 오행 궁합 점수가 무엇을 의미하는지, 점수별 관계 특성을 안내합니다.", h1:"궁합 점수 해석 — 44~99점의 의미", sub:"오행 궁합 점수별 관계 특성과 해석 완전 가이드", emoji:"📊" },
  { slug:"gunghap-tarot", title:"궁합 타로 | 점운 궁합", desc:"궁합 타로카드 뽑기 — 오행 궁합 분석 후 타로카드로 두 사람의 현재 관계 에너지를 확인하세요.", h1:"궁합 타로 — 두 사람의 관계 에너지 카드 뽑기", sub:"오행 궁합 후 타로카드로 보는 두 사람의 인연", emoji:"🃏" },
  { slug:"gunghap-munguje", title:"궁합 문제 해결 | 점운 궁합", desc:"궁합 문제 해결법 — 오행 상극 관계에서 생기는 갈등을 오행의 지혜로 해결하는 방법을 안내합니다.", h1:"궁합 문제 해결 — 오행 갈등을 이기는 지혜", sub:"오행 상극 관계 갈등의 원인과 오행별 해결 방법", emoji:"🔧" },
  { slug:"gunghap-jeongsaeg", title:"궁합 정색 | 점운 궁합", desc:"궁합 정석 가이드 — 오행 궁합을 제대로 보는 방법과 올바른 해석 기준을 안내합니다.", h1:"궁합 정석 — 오행 궁합을 제대로 보는 방법", sub:"오행 궁합의 올바른 해석 기준과 주의 사항 가이드", emoji:"📖" },
  { slug:"haeshi-gunghap", title:"해시 년도별 궁합 | 점운 궁합", desc:"돼지띠·쥐띠·소띠 등 12지지 띠별 오행 궁합 — 내 띠와 잘 맞는 상대방의 띠를 분석합니다.", h1:"띠별 궁합 — 12지지 띠로 보는 오행 궁합", sub:"12지지 띠별 오행 에너지와 최고·최악 궁합 패턴", emoji:"🐷" },
  { slug:"new-couple-gunghap", title:"새 연인 궁합 확인 | 점운 궁합", desc:"새 연인 궁합 확인 — 막 사귀기 시작한 연인과의 오행 궁합을 빠르게 무료로 확인하세요.", h1:"새 연인 궁합 — 첫 만남부터 알아보는 오행 궁합", sub:"새로 시작하는 연인 관계의 오행 궁합 빠른 분석", emoji:"🌸" },
  { slug:"gunghap-vs-mbti", title:"궁합 vs MBTI | 점운 궁합", desc:"오행 궁합 vs MBTI 궁합 비교 — 두 가지 궁합 분석 방법의 차이와 함께 활용하는 방법을 안내합니다.", h1:"오행 궁합 vs MBTI — 더 정확한 궁합 찾기", sub:"오행 궁합과 MBTI 궁합의 차이와 통합 활용법", emoji:"🆚" },
  { slug:"gunghap-online", title:"온라인 궁합 보기 | 점운 궁합", desc:"온라인 무료 궁합 — 두 사람의 생년월일만으로 온라인에서 즉시 오행 궁합을 무료로 분석합니다.", h1:"온라인 무료 궁합 — 즉시 오행 궁합 분석", sub:"온라인에서 두 사람 생년월일로 즉시 무료 궁합 분석", emoji:"🌐" },
  { slug:"ex-couple-gunghap", title:"전 연인 궁합 | 점운 궁합", desc:"전 연인 오행 궁합 — 헤어진 전 연인과의 오행 궁합으로 과거 관계 패턴과 재결합 가능성을 분석합니다.", h1:"전 연인 궁합 — 오행으로 보는 과거 관계 패턴", sub:"전 연인과의 오행 궁합과 재결합 가능성 분석", emoji:"💔" },
  { slug:"first-love-gunghap", title:"첫사랑 궁합 | 점운 궁합", desc:"첫사랑 오행 궁합 — 잊지 못하는 첫사랑과의 오행 에너지 궁합으로 그 특별한 인연의 의미를 분석합니다.", h1:"첫사랑 궁합 — 오행으로 보는 첫사랑 인연의 의미", sub:"첫사랑과의 오행 에너지 궁합과 특별한 인연 분석", emoji:"🌸" },
  { slug:"triangle-gunghap", title:"삼각관계 궁합 | 점운 궁합", desc:"삼각관계 오행 궁합 분석 — 세 사람 사이의 오행 에너지 역학을 분석하고 올바른 선택을 돕습니다.", h1:"삼각관계 궁합 — 세 사람 오행 에너지 역학 분석", sub:"삼각관계 세 사람의 오행 에너지 역학 관계 분석", emoji:"🔺" },
  { slug:"gunghap-score-99", title:"궁합 99점 의미 | 점운 궁합", desc:"궁합 최고점 99점의 의미 — 오행 궁합 99점이 나왔을 때의 진짜 의미와 현실적인 관계 조언입니다.", h1:"궁합 99점 — 최고 점수 오행 궁합의 진짜 의미", sub:"오행 궁합 최고점 99점의 의미와 현실적인 관계 조언", emoji:"💯" },
];

export async function generateStaticParams() {
  return DATA.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];
  return {
    title: d.title,
    description: d.desc,
    keywords: ["사주궁합", "무료궁합", "오행궁합", "연인궁합", "결혼궁합", "점운궁합"],
    openGraph: { title: d.title, description: d.desc, url: `https://jeomun.com/gunghap/guide/${d.slug}` },
  };
}

export default async function GunghapSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];

  const features = [
    { icon: "💑", title: "오행 궁합 점수", desc: "두 사람의 생년월일로 오행 에너지 궁합 점수를 44~99점으로 즉시 계산합니다." },
    { icon: "🔍", title: "연애 패턴 분석", desc: "상생·상극 관계로 두 사람의 연애 패턴, 장단점, 갈등 원인을 분석합니다." },
    { icon: "💍", title: "결혼 궁합 분석", desc: "장기적인 관점에서 결혼 적합도와 함께할 때의 에너지 방향을 분석합니다." },
    { icon: "🃏", title: "타로카드 뽑기", desc: "오행 궁합 후 타로카드로 두 사람의 현재 관계 에너지를 뽑아볼 수 있습니다." },
  ];

  const faqs = [
    { q: "궁합 분석이 정확한가요?", a: "오행 에너지 기반 궁합은 두 사람의 기질과 에너지 조화를 분석합니다. 실제 관계에서 상생·상극 패턴이 나타나는 경우가 많습니다." },
    { q: "상극 궁합이면 절대 안 되나요?", a: "그렇지 않습니다. 상극 관계에서도 서로 이해하고 보완하면 좋은 관계가 됩니다. 갈등 원인을 알고 대처하는 것이 핵심입니다." },
    { q: "어떤 정보가 필요한가요?", a: "두 사람의 생년월일(년·월·일)만 입력하면 즉시 오행 궁합 분석이 가능합니다." },
    { q: "무료로 이용 가능한가요?", a: "오행 궁합 점수와 기본 분석은 무료입니다. 연애 패턴·갈등 원인·결혼 궁합 전체 분석은 990원에 확인하세요." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a0010 0%,#3d0020 50%,#1a0010 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "#f5f5f5", wordBreak: "keep-all" as const }}>
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{d.emoji}</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1.3, margin: "0 0 14px", background: "linear-gradient(135deg,#f9a8d4,#fb7185)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{d.h1}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 28px" }}>{d.sub}</p>
        <Link href="/gunghap" style={{ display: "inline-block", background: "linear-gradient(135deg,#e11d48,#be185d)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 32px", borderRadius: 30, textDecoration: "none", boxShadow: "0 8px 32px rgba(225,29,72,0.4)" }}>
          지금 궁합 보기 →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>두 사람 생년월일 입력 · 즉시 오행 궁합 분석</p>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>점운 궁합이 특별한 이유</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(249,168,212,0.2)", borderRadius: 16, padding: "18px 14px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 900, color: "white", margin: "0 0 6px" }}>{f.title}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(249,168,212,0.15)", borderRadius: 14, padding: "16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#f9a8d4", margin: "0 0 8px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#2d0015,#1a0010)", border: "1px solid rgba(249,168,212,0.3)", borderRadius: 24, padding: "32px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💑</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 10px" }}>지금 궁합 보기</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 22px" }}>두 사람의 생년월일로 오행 궁합 점수와 연애 패턴을 즉시 무료로 분석해드려요</p>
          <Link href="/gunghap" style={{ display: "inline-block", background: "linear-gradient(135deg,#e11d48,#be185d)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 30, textDecoration: "none" }}>
            무료 궁합 보기 →
          </Link>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/gunghap" style={{ color: "#f9a8d4", fontSize: 13, textDecoration: "none" }}>← 궁합 홈</Link>
          <Link href="/main-v2" style={{ color: "#f9a8d4", fontSize: 13, textDecoration: "none" }}>사주 보기</Link>
          <Link href="/mbti" style={{ color: "#f9a8d4", fontSize: 13, textDecoration: "none" }}>MBTI 보기</Link>
        </div>
      </section>
    </main>
  );
}
