import type { Metadata } from "next";
import Link from "next/link";

type Entry = { slug: string; title: string; desc: string; h1: string; sub: string; emoji: string; };

const DATA: Entry[] = [
  { slug:"bueob-chucheon", title:"부업 추천 | 점운 직운", desc:"내 사주 오행 기질로 딱 맞는 부업을 추천받으세요. 8가지 질문으로 부업 TOP3를 즉시 분석합니다.", h1:"부업 추천 — 사주로 찾는 나에게 딱 맞는 부업", sub:"오행 기질 × 라이프스타일 = 맞춤 부업 TOP3", emoji:"💼" },
  { slug:"jikun-saju", title:"직업 사주 | 점운 직운", desc:"직업 사주를 분석합니다. 내 오행 기질에 맞는 천직과 적합한 직무 방향을 찾아드립니다.", h1:"직업 사주 — 오행 기질에서 천직이 보인다", sub:"목·화·토·금·수 오행별 천직과 직업 방향 분석", emoji:"🔮" },
  { slug:"bueob-saju", title:"부업 사주 | 점운 직운", desc:"부업 사주를 분석합니다. 내 오행 기질에서 성공할 수 있는 부업 방향을 찾아드립니다.", h1:"부업 사주 — 사주로 찾는 성공하는 부업", sub:"오행 기질으로 보는 나의 부업 성공 방향", emoji:"✨" },
  { slug:"jinro-unse", title:"진로 운세 | 점운 직운", desc:"진로 운세를 사주로 분석합니다. 내 오행 기질에 맞는 진로 방향과 최적 타이밍을 확인하세요.", h1:"진로 운세 — 사주로 보는 나의 진로 방향", sub:"오행 에너지로 분석하는 진로와 직업 방향", emoji:"🗺️" },
  { slug:"side-job", title:"사이드잡 추천 | 점운 직운", desc:"나에게 맞는 사이드잡을 사주로 추천받으세요. 시간·자금·기질로 맞춤 사이드잡을 찾아드립니다.", h1:"사이드잡 추천 — 사주로 찾는 나만의 사이드잡", sub:"라이프스타일과 오행 기질로 찾는 사이드잡", emoji:"🚀" },
  { slug:"freelance-saju", title:"프리랜서 사주 | 점운 직운", desc:"프리랜서 적합 사주를 분석합니다. 독립적으로 일하기에 맞는 오행 기질과 분야를 확인하세요.", h1:"프리랜서 사주 — 독립과 자유를 위한 오행 분석", sub:"사주로 보는 프리랜서 적합도와 성공 방향", emoji:"💻" },
  { slug:"income-saju", title:"수입 사주 | 점운 직운", desc:"수입 운세를 사주로 분석합니다. 내 사주에서 수입이 늘어나는 에너지가 강한 시기와 방향입니다.", h1:"수입 사주 — 사주로 보는 나의 수입 흐름", sub:"오행 재물 에너지와 수입 증가 타이밍 분석", emoji:"💰" },
  { slug:"bueob-start", title:"부업 시작하는 법 | 점운 직운", desc:"부업을 처음 시작하는 방법을 사주로 분석합니다. 내 오행 기질에 맞는 부업 시작 단계를 확인하세요.", h1:"부업 시작 — 오행 기질에 맞는 첫 부업 선택", sub:"사주로 보는 나의 첫 부업 시작 방향과 단계", emoji:"🌱" },
  { slug:"content-bueob", title:"콘텐츠 부업 | 점운 직운", desc:"콘텐츠 부업을 사주로 분석합니다. 화·목 오행의 표현력으로 성공하는 콘텐츠 부업 방향입니다.", h1:"콘텐츠 부업 — 화·목 오행의 표현력으로 수익화", sub:"유튜브·인스타·블로그 콘텐츠 부업 오행 전략", emoji:"📱" },
  { slug:"sns-bueob", title:"SNS 부업 | 점운 직운", desc:"SNS 부업을 사주로 분석합니다. 내 오행 기질에 맞는 SNS 채널과 콘텐츠 방향을 찾으세요.", h1:"SNS 부업 — 오행 기질에 맞는 SNS 수익화", sub:"유튜브·인스타·틱톡 SNS 부업 오행별 전략", emoji:"📷" },
  { slug:"lecture-bueob", title:"강의 부업 | 점운 직운", desc:"강의 부업을 사주로 분석합니다. 내 오행 기질에서 가르치는 능력이 강한 방향을 확인하세요.", h1:"강의 부업 — 내 오행 기질로 가르침을 수익으로", sub:"온라인 강의·코칭·컨설팅 부업 오행 전략", emoji:"🎓" },
  { slug:"shop-bueob", title:"스마트스토어 부업 | 점운 직운", desc:"스마트스토어 부업을 사주로 분석합니다. 판매·유통에 맞는 토·금 오행 기질과 아이템 방향입니다.", h1:"스마트스토어 부업 — 토·금 오행의 상업적 기질", sub:"스마트스토어 성공을 위한 오행별 아이템 전략", emoji:"🛒" },
  { slug:"translate-bueob", title:"번역 부업 | 점운 직운", desc:"번역 부업을 사주로 분석합니다. 수·금 오행의 언어 감각과 정밀함이 강한 번역 방향입니다.", h1:"번역 부업 — 수·금 오행의 언어 감각을 살려라", sub:"번역·통역 부업에서 오행 기질을 활용하는 법", emoji:"🌏" },
  { slug:"writing-bueob", title:"글쓰기 부업 | 점운 직운", desc:"글쓰기 부업을 사주로 분석합니다. 화·수 오행의 표현력과 논리력을 살린 글쓰기 수익화 방향입니다.", h1:"글쓰기 부업 — 화·수 오행의 표현력을 수익으로", sub:"블로그·카피라이팅·원고 글쓰기 부업 오행 전략", emoji:"✍️" },
  { slug:"consulting-bueob", title:"컨설팅 부업 | 점운 직운", desc:"컨설팅 부업을 사주로 분석합니다. 금·토 오행의 전문성과 안정감으로 컨설팅 수익을 만드는 방법입니다.", h1:"컨설팅 부업 — 금·토 오행의 전문성으로 수익화", sub:"전문가 컨설팅 부업에서 오행 기질을 활용하는 법", emoji:"📋" },
  { slug:"design-bueob", title:"디자인 부업 | 점운 직운", desc:"디자인 부업을 사주로 분석합니다. 화·목 오행의 미적 감각과 창의성으로 디자인 수익을 만드세요.", h1:"디자인 부업 — 화·목 오행의 창의성을 수익으로", sub:"그래픽·영상·UI 디자인 부업 오행별 전략", emoji:"🎨" },
  { slug:"ai-bueob", title:"AI 부업 | 점운 직운", desc:"AI 도구를 활용한 부업을 사주로 분석합니다. 수·금 오행의 분석력으로 AI 자동화 수익을 만드세요.", h1:"AI 부업 — 수·금 오행의 분석력으로 AI 수익화", sub:"ChatGPT·AI 도구를 활용한 부업 오행 전략", emoji:"🤖" },
  { slug:"food-bueob", title:"음식 부업 | 점운 직운", desc:"음식 관련 부업을 사주로 분석합니다. 토 오행의 실용성과 화 오행의 열정으로 음식 수익을 만드세요.", h1:"음식 부업 — 토·화 오행의 실용성을 살린 수익화", sub:"배달·밀키트·쿠킹클래스 음식 부업 오행 전략", emoji:"🍳" },
  { slug:"realestate-bueob", title:"부동산 부업 | 점운 직운", desc:"부동산 부업을 사주로 분석합니다. 토 오행의 안정성과 금 오행의 분석력으로 부동산 수익을 만드세요.", h1:"부동산 부업 — 토·금 오행의 안정성을 살려라", sub:"부동산 투자·중개·임대 부업 오행별 전략", emoji:"🏠" },
  { slug:"video-bueob", title:"영상 부업 | 점운 직운", desc:"영상 관련 부업을 사주로 분석합니다. 화·목 오행의 표현력으로 유튜브·쇼츠·영상편집 수익을 만드세요.", h1:"영상 부업 — 화·목 오행의 표현력으로 영상 수익", sub:"유튜브·쇼츠·영상편집 부업 오행별 전략", emoji:"🎬" },
  { slug:"2026-bueob", title:"2026년 부업 추천 | 점운 직운", desc:"2026년 잘 되는 부업을 사주로 분석합니다. 올해 수입 에너지가 강한 부업 방향을 확인하세요.", h1:"2026년 부업 — 올해 내 수입 에너지가 강한 부업", sub:"2026년 사주로 보는 부업 성공 방향과 타이밍", emoji:"📅" },
  { slug:"wood-bueob", title:"목 오행 부업 추천 | 점운 직운", desc:"목 오행(봄 에너지) 기질에 맞는 부업을 찾으세요. 성장·교육·창작 방향의 부업이 잘 맞습니다.", h1:"목 오행 부업 — 성장과 창작으로 수익을 만들어라", sub:"목 오행 기질에 맞는 부업 TOP3 추천", emoji:"🌿" },
  { slug:"fire-bueob", title:"화 오행 부업 추천 | 점운 직운", desc:"화 오행(열정 에너지) 기질에 맞는 부업을 찾으세요. 콘텐츠·강의·마케팅 방향이 잘 맞습니다.", h1:"화 오행 부업 — 열정과 표현력으로 수익을 만들어라", sub:"화 오행 기질에 맞는 부업 TOP3 추천", emoji:"🔥" },
  { slug:"earth-bueob", title:"토 오행 부업 추천 | 점운 직운", desc:"토 오행(안정 에너지) 기질에 맞는 부업을 찾으세요. 판매·중개·관리 방향의 부업이 잘 맞습니다.", h1:"토 오행 부업 — 신뢰와 안정감으로 수익을 만들어라", sub:"토 오행 기질에 맞는 부업 TOP3 추천", emoji:"🌍" },
  { slug:"metal-bueob", title:"금 오행 부업 추천 | 점운 직운", desc:"금 오행(결단 에너지) 기질에 맞는 부업을 찾으세요. 컨설팅·분석·전문직 방향이 잘 맞습니다.", h1:"금 오행 부업 — 전문성과 분석력으로 수익을 만들어라", sub:"금 오행 기질에 맞는 부업 TOP3 추천", emoji:"💎" },
  { slug:"water-bueob", title:"수 오행 부업 추천 | 점운 직운", desc:"수 오행(지혜 에너지) 기질에 맞는 부업을 찾으세요. 번역·글쓰기·AI 방향의 부업이 잘 맞습니다.", h1:"수 오행 부업 — 지혜와 논리력으로 수익을 만들어라", sub:"수 오행 기질에 맞는 부업 TOP3 추천", emoji:"💧" },
  { slug:"jigeob-chucheon", title:"직업 추천 | 점운 직운", desc:"사주로 직업을 추천받으세요. 내 오행 기질에 맞는 천직과 최적 직업 방향을 찾아드립니다.", h1:"직업 추천 — 사주 오행으로 찾는 나의 천직", sub:"목·화·토·금·수 오행별 추천 직업과 방향", emoji:"🎯" },
  { slug:"tianjigeob", title:"천직 찾기 | 점운 직운", desc:"내 천직을 사주로 찾으세요. 오행 기질로 타고난 재능과 최적 직업 방향을 분석합니다.", h1:"천직 찾기 — 오행 기질에서 보이는 나의 천직", sub:"사주 오행으로 분석하는 천직과 적성 방향", emoji:"⭐" },
  { slug:"jinro-saju", title:"진로 사주 | 점운 직운", desc:"진로를 사주로 분석합니다. 학업·취업·창업 중 내 오행 기질에 맞는 진로 방향을 확인하세요.", h1:"진로 사주 — 사주로 보는 나의 최적 진로 방향", sub:"오행 기질로 분석하는 학업·취업·창업 진로", emoji:"🗺️" },
  { slug:"jigeob-aptitude", title:"직업 적성 | 점운 직운", desc:"직업 적성을 사주로 분석합니다. 내 오행 기질에서 타고난 재능과 직업 적성을 찾아드립니다.", h1:"직업 적성 — 오행 기질에서 찾는 타고난 재능", sub:"사주 오행으로 보는 직업 적성과 재능 방향", emoji:"🎭" },
  { slug:"ijigu-saju", title:"이직 사주 | 점운 직운", desc:"이직 사주를 분석합니다. 지금 이직이 맞는 타이밍인지, 어떤 직무로 이직해야 하는지 확인하세요.", h1:"이직 사주 — 지금 이직이 내 운의 흐름에 맞나", sub:"사주 대운으로 보는 이직 최적 타이밍과 방향", emoji:"🔄" },
  { slug:"ijigu-timing", title:"이직 타이밍 | 점운 직운", desc:"이직 최적 타이밍을 사주로 분석합니다. 대운·세운으로 이직 성공 에너지가 강한 시기를 찾으세요.", h1:"이직 타이밍 — 사주로 찾는 이직 골든 타임", sub:"대운·세운으로 분석하는 이직 성공 타이밍", emoji:"⏰" },
  { slug:"salary-up", title:"연봉 올리기 | 점운 직운", desc:"연봉 상승 사주를 분석합니다. 내 사주에서 연봉 협상·이직·부업으로 수입을 올리는 타이밍입니다.", h1:"연봉 올리기 — 사주로 보는 나의 수입 상승 타이밍", sub:"오행 재물 에너지와 연봉 상승 전략 분석", emoji:"💸" },
  { slug:"bueob-income", title:"부업 수입 | 점운 직운", desc:"부업으로 수입을 만드는 방법을 사주로 분석합니다. 내 오행 기질에 맞는 수입 창출 방향입니다.", h1:"부업 수입 — 오행 기질로 수입을 만드는 방법", sub:"사주로 보는 부업 수입 창출 방향과 전략", emoji:"💵" },
  { slug:"100man-bueob", title:"월100만 부업 | 점운 직운", desc:"월 100만원 부업을 사주로 찾으세요. 오행 기질에 맞는 현실적인 첫 부업 수익 목표입니다.", h1:"월100만 부업 — 오행 기질로 첫 수익 100만원", sub:"현실적인 첫 부업 수익 100만원 달성 전략", emoji:"🎯" },
  { slug:"500man-bueob", title:"월500만 부업 | 점운 직운", desc:"월 500만원 부업을 사주로 분석합니다. 오행 기질을 살린 고수익 부업 방향을 찾아드립니다.", h1:"월500만 부업 — 오행 기질로 고수익 부업 달성", sub:"월 500만원 부업 달성을 위한 오행 전략", emoji:"💎" },
  { slug:"no-cost-bueob", title:"무자본 부업 | 점운 직운", desc:"무자본으로 시작하는 부업을 사주로 추천합니다. 자금 없이도 오행 기질로 시작할 수 있는 부업입니다.", h1:"무자본 부업 — 자금 없이 오행 기질로 시작하라", sub:"0원으로 시작하는 오행 기질 맞춤 무자본 부업", emoji:"🆓" },
  { slug:"home-bueob", title:"집에서 하는 부업 | 점운 직운", desc:"집에서 하는 부업을 사주로 추천합니다. 재택·온라인으로 수익을 만드는 오행 맞춤 부업입니다.", h1:"집에서 하는 부업 — 재택으로 오행 기질 수익화", sub:"집에서 시작하는 오행 기질 맞춤 부업 TOP3", emoji:"🏠" },
  { slug:"online-bueob", title:"온라인 부업 | 점운 직운", desc:"온라인 부업을 사주로 추천합니다. PC·스마트폰으로 언제 어디서나 할 수 있는 오행 맞춤 부업입니다.", h1:"온라인 부업 — PC·모바일로 오행 기질 수익화", sub:"온라인으로 시작하는 오행 기질 맞춤 부업", emoji:"📱" },
  { slug:"beginner-bueob", title:"초보 부업 | 점운 직운", desc:"부업을 처음 시작하는 초보자를 위한 사주 부업 추천. 오행 기질로 가장 쉽게 시작하는 방법입니다.", h1:"초보 부업 — 처음 시작해도 오행 기질로 성공", sub:"부업 초보를 위한 오행 맞춤 첫 부업 추천", emoji:"🌱" },
  { slug:"mom-bueob", title:"주부 부업 | 점운 직운", desc:"주부에게 맞는 부업을 사주로 추천합니다. 육아·살림과 병행할 수 있는 오행 맞춤 부업입니다.", h1:"주부 부업 — 육아와 병행하는 오행 기질 부업", sub:"주부에게 맞는 오행 기질 부업 TOP3 추천", emoji:"🌸" },
  { slug:"office-bueob", title:"직장인 부업 | 점운 직운", desc:"직장인을 위한 부업을 사주로 추천합니다. 퇴근 후 시간을 활용하는 오행 맞춤 부업입니다.", h1:"직장인 부업 — 퇴근 후 오행 기질로 N잡러 되기", sub:"직장인이 퇴근 후 시작하는 오행 맞춤 부업", emoji:"💼" },
  { slug:"retired-bueob", title:"퇴직자 부업 | 점운 직운", desc:"퇴직 후 할 수 있는 부업을 사주로 추천합니다. 경력과 오행 기질을 살린 퇴직 후 부업입니다.", h1:"퇴직자 부업 — 경력과 오행 기질로 제2의 수입", sub:"퇴직 후 경력을 살리는 오행 기질 부업 전략", emoji:"🎖️" },
  { slug:"50s-bueob", title:"50대 부업 | 점운 직운", desc:"50대에 맞는 부업을 사주로 추천합니다. 경험과 오행 기질을 살린 50대 최적 부업 방향입니다.", h1:"50대 부업 — 경험과 오행 기질로 새 수입을 만들다", sub:"50대에 맞는 오행 기질 부업 TOP3 추천", emoji:"🌟" },
  { slug:"40s-bueob", title:"40대 부업 | 점운 직운", desc:"40대에 맞는 부업을 사주로 추천합니다. 사회 경험과 오행 기질을 활용하는 40대 부업 방향입니다.", h1:"40대 부업 — 경험과 오행 기질로 수입을 추가하라", sub:"40대 직장인·주부를 위한 오행 맞춤 부업", emoji:"💪" },
  { slug:"30s-bueob", title:"30대 부업 | 점운 직운", desc:"30대에 맞는 부업을 사주로 추천합니다. 커리어와 병행하는 30대 최적 오행 맞춤 부업입니다.", h1:"30대 부업 — 커리어와 병행하는 오행 기질 부업", sub:"30대에게 맞는 오행 기질 부업 TOP3 추천", emoji:"🚀" },
  { slug:"20s-bueob", title:"20대 부업 | 점운 직운", desc:"20대에 맞는 부업을 사주로 추천합니다. 젊음과 오행 기질을 살린 20대 최적 부업 방향입니다.", h1:"20대 부업 — 젊음과 오행 기질로 수익을 만들어라", sub:"20대를 위한 오행 기질 맞춤 부업 TOP3", emoji:"⚡" },
  { slug:"ohaeng-jigeob", title:"오행 직업 추천 | 점운 직운", desc:"오행으로 보는 최적 직업을 찾으세요. 목·화·토·금·수 오행 기질별 천직과 추천 직업입니다.", h1:"오행 직업 — 내 오행 기질에서 천직이 보인다", sub:"오행(목·화·토·금·수) 기질별 천직과 적합 직업", emoji:"🌿" },
  { slug:"saju-jigeob", title:"사주 직업 분석 | 점운 직운", desc:"사주로 직업을 분석합니다. 생년월일로 보는 내 타고난 직업 방향과 적성을 확인하세요.", h1:"사주 직업 분석 — 생년월일이 말하는 나의 직업", sub:"사주 오행으로 분석하는 나의 직업 방향과 적성", emoji:"🔮" },
  { slug:"career-saju", title:"커리어 사주 | 점운 직운", desc:"커리어 방향을 사주로 분석합니다. 지금 커리어가 내 오행 기질과 맞는지 확인하세요.", h1:"커리어 사주 — 내 커리어가 오행 기질과 맞나?", sub:"사주 오행으로 분석하는 커리어 방향과 전환 타이밍", emoji:"📊" },
  { slug:"success-saju", title:"성공 사주 | 점운 직운", desc:"성공 사주를 분석합니다. 내 사주에서 성공 에너지가 강한 분야와 타이밍을 찾아드립니다.", h1:"성공 사주 — 내 사주에서 성공 에너지를 찾아라", sub:"오행 성공 에너지와 최적 성공 방향 사주 분석", emoji:"🏆" },
  { slug:"money-saju", title:"재물 사주 | 점운 직운", desc:"재물 사주를 분석합니다. 내 사주에서 돈을 버는 방향과 재물 에너지가 강한 시기를 확인하세요.", h1:"재물 사주 — 내 사주에서 돈이 들어오는 방향", sub:"오행 재물 에너지와 수입 증가 타이밍 분석", emoji:"💰" },
  { slug:"business-start", title:"창업 사주 | 점운 직운", desc:"창업 사주를 분석합니다. 내 오행 기질에 맞는 창업 분야와 최적 창업 타이밍을 확인하세요.", h1:"창업 사주 — 오행 기질에 맞는 창업 방향", sub:"사주로 보는 창업 적합도와 최적 창업 타이밍", emoji:"🏗️" },
  { slug:"small-business", title:"소자본 창업 | 점운 직운", desc:"소자본 창업을 사주로 분석합니다. 적은 자본으로 오행 기질을 살린 창업 방향을 찾으세요.", h1:"소자본 창업 — 오행 기질로 적은 자본으로 시작", sub:"소자본 창업 성공을 위한 오행 기질 전략", emoji:"💡" },
  { slug:"online-shop", title:"온라인 쇼핑몰 부업 | 점운 직운", desc:"온라인 쇼핑몰 부업을 사주로 분석합니다. 토 오행의 상업적 기질로 쇼핑몰 성공 방향을 찾으세요.", h1:"온라인 쇼핑몰 — 토 오행의 상업적 기질로 수익화", sub:"온라인 쇼핑몰 성공을 위한 오행 기질 전략", emoji:"🛒" },
  { slug:"youtube-bueob", title:"유튜브 부업 | 점운 직운", desc:"유튜브 부업을 사주로 분석합니다. 화·목 오행의 표현력으로 유튜브 채널을 수익화하는 방향입니다.", h1:"유튜브 부업 — 화·목 오행의 표현력으로 수익화", sub:"유튜브 채널 성공을 위한 오행 기질 전략", emoji:"▶️" },
  { slug:"instagram-bueob", title:"인스타 부업 | 점운 직운", desc:"인스타그램 부업을 사주로 분석합니다. 화 오행의 감각과 목 오행의 성장 기질로 인스타 수익화입니다.", h1:"인스타 부업 — 화·목 오행의 감각으로 수익화", sub:"인스타그램 채널 수익화를 위한 오행 전략", emoji:"📸" },
  { slug:"blog-bueob", title:"블로그 부업 | 점운 직운", desc:"블로그 부업을 사주로 분석합니다. 수·화 오행의 표현력과 논리력으로 블로그 수익을 만드세요.", h1:"블로그 부업 — 수·화 오행의 글쓰기로 수익화", sub:"블로그 수익화를 위한 오행 기질 전략", emoji:"📝" },
  { slug:"coaching-bueob", title:"코칭 부업 | 점운 직운", desc:"코칭 부업을 사주로 분석합니다. 화·토 오행의 공감 능력과 신뢰감으로 코칭 수익을 만드세요.", h1:"코칭 부업 — 화·토 오행의 공감력으로 수익화", sub:"라이프·커리어 코칭 부업 오행 기질 전략", emoji:"🎤" },
  { slug:"tutoring-bueob", title:"과외 부업 | 점운 직운", desc:"과외 부업을 사주로 분석합니다. 목·토 오행의 인내력과 가르치는 기질로 과외 수익을 만드세요.", h1:"과외 부업 — 목·토 오행의 가르침 기질로 수익화", sub:"학습 과외·멘토링 부업 오행 기질 전략", emoji:"📚" },
  { slug:"skill-bueob", title:"재능 판매 부업 | 점운 직운", desc:"재능 판매 부업을 사주로 분석합니다. 내 오행 기질에서 타고난 재능을 크몽·탈잉에서 수익화하세요.", h1:"재능 판매 — 오행 기질에서 찾은 재능을 수익으로", sub:"크몽·탈잉 재능마켓 부업 오행 기질 전략", emoji:"💫" },
  { slug:"photography-bueob", title:"사진 부업 | 점운 직운", desc:"사진 부업을 사주로 분석합니다. 화·목 오행의 미적 감각과 관찰력으로 사진 수익을 만드세요.", h1:"사진 부업 — 화·목 오행의 미적 감각으로 수익화", sub:"사진 촬영·편집 부업 오행 기질 전략", emoji:"📷" },
  { slug:"writing-income", title:"글쓰기 수익화 | 점운 직운", desc:"글쓰기로 수익을 만드는 방법을 사주로 분석합니다. 수·화 오행의 표현력으로 글쓰기 수익화입니다.", h1:"글쓰기 수익 — 수·화 오행의 표현력을 수익으로", sub:"블로그·카피·전자책 글쓰기 수익화 오행 전략", emoji:"✍️" },
  { slug:"ai-income", title:"AI 수익화 | 점운 직운", desc:"AI 도구로 수익을 만드는 방법을 사주로 분석합니다. 수·금 오행의 분석력으로 AI 자동화 수익화입니다.", h1:"AI 수익화 — 수·금 오행의 분석력으로 AI 자동화", sub:"ChatGPT·AI 도구를 활용한 수익화 오행 전략", emoji:"🤖" },
  { slug:"digital-bueob", title:"디지털 부업 | 점운 직운", desc:"디지털 부업을 사주로 분석합니다. 수·금 오행의 디지털 감각으로 온라인 디지털 수익을 만드세요.", h1:"디지털 부업 — 수·금 오행의 디지털 기질로 수익화", sub:"온라인 디지털 부업 오행 기질 맞춤 전략", emoji:"💻" },
  { slug:"bueob-success", title:"부업 성공 비법 | 점운 직운", desc:"부업 성공 비법을 사주로 분석합니다. 오행 기질에 맞는 부업을 선택해야 성공 확률이 높아집니다.", h1:"부업 성공 — 오행 기질에 맞는 부업이 성공한다", sub:"부업 성공 확률을 높이는 오행 기질 맞춤 전략", emoji:"🏆" },
  { slug:"bueob-fail", title:"부업 실패 피하기 | 점운 직운", desc:"부업 실패를 피하는 방법을 사주로 분석합니다. 내 오행 기질에 안 맞는 부업을 미리 걸러내세요.", h1:"부업 실패 피하기 — 오행 기질로 실패 부업을 걸러라", sub:"오행 기질로 나에게 안 맞는 부업을 미리 파악", emoji:"⚠️" },
  { slug:"jigeob-change", title:"직업 전환 | 점운 직운", desc:"직업 전환 타이밍을 사주로 분석합니다. 지금이 직업을 바꿀 최적 타이밍인지, 어떤 방향으로 가야 하는지 확인하세요.", h1:"직업 전환 — 사주로 보는 최적 직업 전환 타이밍", sub:"오행 대운으로 분석하는 직업 전환 성공 전략", emoji:"🔀" },
  { slug:"new-career", title:"새로운 커리어 | 점운 직운", desc:"새 커리어를 사주로 분석합니다. 오행 기질로 새로운 커리어 방향과 성공 가능성을 확인하세요.", h1:"새로운 커리어 — 오행 기질로 새 출발을 준비하라", sub:"사주로 보는 새 커리어 방향과 성공 전략", emoji:"🌅" },
  { slug:"multiple-income", title:"다중 수입 만들기 | 점운 직운", desc:"다중 수입을 사주로 분석합니다. 내 오행 기질에서 여러 수입원을 동시에 운영하는 방법입니다.", h1:"다중 수입 — 오행 기질로 여러 수입원을 만들어라", sub:"오행 기질을 활용한 N잡러 다중 수입 전략", emoji:"🌐" },
  { slug:"passive-income", title:"패시브 인컴 | 점운 직운", desc:"패시브 인컴을 사주로 분석합니다. 내 오행 기질에 맞는 자동화 수입원을 만드는 방법입니다.", h1:"패시브 인컴 — 오행 기질로 자동화 수입을 만들어라", sub:"오행 기질에 맞는 패시브 인컴 방향 분석", emoji:"💤" },
  { slug:"n-job", title:"N잡러 되기 | 점운 직운", desc:"N잡러가 되는 방법을 사주로 분석합니다. 내 오행 기질에 맞는 여러 직업을 동시에 운영하는 전략입니다.", h1:"N잡러 되기 — 오행 기질로 여러 직업을 운영하라", sub:"오행 기질로 시작하는 N잡러 전략과 방향", emoji:"🔀" },
  { slug:"digital-nomad", title:"디지털 노마드 | 점운 직운", desc:"디지털 노마드 생활을 사주로 분석합니다. 내 오행 기질이 원격 근무·여행에 맞는지 확인하세요.", h1:"디지털 노마드 — 오행 기질로 자유로운 삶을 살아라", sub:"사주로 보는 디지털 노마드 적합도와 방향", emoji:"🌍" },
  { slug:"financial-freedom", title:"경제적 자유 | 점운 직운", desc:"경제적 자유를 사주로 분석합니다. 내 오행 기질에 맞는 수입 경로로 경제적 자유를 달성하는 방법입니다.", h1:"경제적 자유 — 오행 기질로 경제적 자유 달성 전략", sub:"사주로 보는 나의 경제적 자유 달성 경로", emoji:"🗝️" },
  { slug:"remote-work-bueob", title:"재택 부업 | 점운 직운", desc:"재택 부업을 사주로 분석합니다. 집에서 할 수 있는 오행 기질 맞춤 재택 부업 방향입니다.", h1:"재택 부업 — 집에서 오행 기질을 수익으로 만들어라", sub:"재택으로 할 수 있는 오행 기질 맞춤 부업 TOP3", emoji:"🏡" },
  { slug:"jigeob-satisfaction", title:"직업 만족도 | 점운 직운", desc:"직업 만족도를 사주로 분석합니다. 내 오행 기질과 직업의 에너지가 일치할 때 직업 만족도가 높아집니다.", h1:"직업 만족도 — 오행 기질과 직업의 에너지 일치", sub:"오행 기질로 찾는 높은 직업 만족도의 비밀", emoji:"😊" },
  { slug:"calling-saju", title:"사주 천직 분석 | 점운 직운", desc:"천직을 사주로 분석합니다. 생년월일에서 타고난 재능과 천직 방향을 찾아드립니다.", h1:"사주 천직 — 생년월일이 알려주는 나의 천직", sub:"오행 기질으로 분석하는 나의 천직과 재능", emoji:"✨" },
  { slug:"talent-saju", title:"재능 사주 | 점운 직운", desc:"재능 사주를 분석합니다. 내 사주에서 타고난 재능과 강점 방향을 오행으로 분석합니다.", h1:"재능 사주 — 사주에서 찾는 나만의 타고난 재능", sub:"오행 기질로 찾는 타고난 재능과 활용 방법", emoji:"🌟" },
  { slug:"personality-saju", title:"성격 사주 | 점운 직운", desc:"성격을 사주로 분석합니다. 내 오행 기질에서 나온 성격 특성과 직업 방향을 확인하세요.", h1:"성격 사주 — 오행 기질에서 보이는 나의 성격", sub:"오행 기질로 보는 나의 성격 특성과 직업 방향", emoji:"🎭" },
  { slug:"strength-saju", title:"강점 사주 | 점운 직운", desc:"강점을 사주로 분석합니다. 내 오행 기질에서 타고난 강점과 이를 직업·부업에 활용하는 방법입니다.", h1:"강점 사주 — 오행 기질에서 타고난 강점을 찾아라", sub:"사주 오행으로 분석하는 나의 강점과 활용 전략", emoji:"💪" },
  { slug:"bueob-2026", title:"2026년 부업 전략 | 점운 직운", desc:"2026년 부업 전략을 사주로 분석합니다. 올해 수입 에너지와 부업 성공 타이밍을 확인하세요.", h1:"2026년 부업 전략 — 올해 내 수입 에너지 방향", sub:"2026년 사주로 보는 부업 성공 타이밍과 방향", emoji:"📆" },
  { slug:"income-goal", title:"수입 목표 달성 | 점운 직운", desc:"수입 목표 달성 방법을 사주로 분석합니다. 내 오행 기질에 맞는 수입 경로로 목표를 달성하세요.", h1:"수입 목표 달성 — 오행 기질로 수입 목표를 이뤄라", sub:"오행 재물 에너지로 분석하는 수입 목표 달성 전략", emoji:"🎯" },
  { slug:"side-hustle", title:"사이드 허슬 | 점운 직운", desc:"사이드 허슬을 사주로 분석합니다. 내 오행 기질에 맞는 사이드 허슬 방향을 찾아드립니다.", h1:"사이드 허슬 — 오행 기질로 사이드 허슬 성공", sub:"오행 기질 맞춤 사이드 허슬 전략과 방향", emoji:"🏃" },
  { slug:"gig-economy", title:"긱 이코노미 부업 | 점운 직운", desc:"긱 이코노미 부업을 사주로 분석합니다. 프리랜서·긱 워커에 맞는 오행 기질과 방향을 찾으세요.", h1:"긱 이코노미 — 오행 기질로 긱 워커 성공 전략", sub:"프리랜서·긱 워커를 위한 오행 기질 부업 전략", emoji:"🔌" },
  { slug:"platform-bueob", title:"플랫폼 부업 | 점운 직운", desc:"플랫폼 부업을 사주로 분석합니다. 크몽·탈잉·클래스101 등 플랫폼에서 오행 기질을 수익화하세요.", h1:"플랫폼 부업 — 크몽·탈잉에서 오행 기질 수익화", sub:"온라인 플랫폼 부업 성공을 위한 오행 기질 전략", emoji:"🏪" },
  { slug:"expert-bueob", title:"전문가 부업 | 점운 직운", desc:"전문가 경력을 살린 부업을 사주로 분석합니다. 내 오행 기질과 전문 경력을 결합한 부업 방향입니다.", h1:"전문가 부업 — 경력과 오행 기질을 부업에 결합", sub:"전문 경력을 살리는 오행 기질 맞춤 부업 전략", emoji:"🎓" },
  { slug:"student-bueob", title:"학생 부업 | 점운 직운", desc:"학생에게 맞는 부업을 사주로 추천합니다. 학업과 병행 가능한 오행 기질 맞춤 학생 부업입니다.", h1:"학생 부업 — 학업과 병행하는 오행 기질 부업", sub:"대학생·고등학생을 위한 오행 맞춤 부업 TOP3", emoji:"🎒" },
  { slug:"dad-bueob", title:"아빠 부업 | 점운 직운", desc:"아빠에게 맞는 부업을 사주로 추천합니다. 가족과 시간을 보내면서 할 수 있는 오행 맞춤 부업입니다.", h1:"아빠 부업 — 가족과 함께하는 오행 기질 부업", sub:"육아·가족과 병행하는 아빠 오행 맞춤 부업", emoji:"👨‍👧" },
  { slug:"bueob-tips", title:"부업 꿀팁 | 점운 직운", desc:"부업 성공 꿀팁을 사주로 분석합니다. 오행 기질에 맞는 부업을 선택하는 핵심 팁을 확인하세요.", h1:"부업 꿀팁 — 오행 기질로 부업 성공률을 높여라", sub:"오행 기질 맞춤 부업 선택과 성공을 위한 꿀팁", emoji:"🍯" },
  { slug:"jikun-quiz", title:"직운 퀴즈 | 점운 직운", desc:"직운 퀴즈로 내 직업·부업 방향을 찾으세요. 8문항 퀴즈로 오행 기질 맞춤 부업 TOP3를 즉시 확인합니다.", h1:"직운 퀴즈 — 8문항으로 찾는 내 부업 TOP3", sub:"8문항 퀴즈 + 오행 기질 = 맞춤 부업 추천", emoji:"❓" },
  { slug:"affiliate-bueob", title:"제휴마케팅 부업 | 점운 직운", desc:"제휴마케팅 부업을 사주로 분석합니다. 수·화 오행의 설득력과 표현력으로 제휴마케팅 수익을 만드세요.", h1:"제휴마케팅 — 수·화 오행의 설득력으로 수익화", sub:"제휴마케팅 부업 성공을 위한 오행 기질 전략", emoji:"🔗" },
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
    keywords: ["부업추천", "직업사주", "진로사주", "점운직운", "부업사주", "오행직업"],
    openGraph: { title: d.title, description: d.desc, url: `https://jeomun.com/jigun/guide/${d.slug}` },
  };
}

export default async function JigunSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];

  const features = [
    { icon: "🎯", title: "오행 천직 분석", desc: "출생연도로 오행을 계산해 나에게 맞는 천직과 직업 방향을 즉시 분석합니다." },
    { icon: "💼", title: "부업 TOP3 추천", desc: "8문항 퀴즈 + 오행 기질 = 수입범위·시작법·플랫폼까지 포함한 맞춤 부업 TOP3." },
    { icon: "💰", title: "수입 범위 안내", desc: "추천 부업별 현실적인 월 수입 범위와 3단계 시작법을 바로 확인하세요." },
    { icon: "⚠️", title: "함정 주의 분석", desc: "이 부업에서 자주 실패하는 패턴을 미리 알려드립니다." },
  ];

  const faqs = [
    { q: "퀴즈가 몇 분이나 걸리나요?", a: "8문항 카드 선택으로 2분 이내에 완료됩니다. 한 문항 선택하면 자동으로 다음 문항으로 넘어가 빠릅니다." },
    { q: "부업 추천이 사람마다 다르게 나오나요?", a: "네. 시간·자금·강점·사교성·상황·SNS·수익방식·분야 8개 요소 + 오행 기질 조합으로 개인별 맞춤 부업 TOP3가 추천됩니다." },
    { q: "오행 천직은 어떻게 계산하나요?", a: "출생연도에서 천간 오행을 계산합니다. 목=성장·교육·창작, 화=열정·콘텐츠·마케팅, 토=판매·관리·서비스, 금=분석·전문직·컨설팅, 수=번역·글쓰기·AI" },
    { q: "부업 시작까지 도움을 받을 수 있나요?", a: "네. 각 부업별 3단계 시작법, 추천 플랫폼, 예상 수입 범위, 주의해야 할 함정까지 모두 안내합니다." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a1500 0%,#1a2800 50%,#0a1500 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "#f5f5f5", wordBreak: "keep-all" as const }}>
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{d.emoji}</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1.3, margin: "0 0 14px", background: "linear-gradient(135deg,#4ade80,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{d.h1}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 28px" }}>{d.sub}</p>
        <Link href="/jigun" style={{ display: "inline-block", background: "linear-gradient(135deg,#16a34a,#d97706)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 32px", borderRadius: 30, textDecoration: "none", boxShadow: "0 8px 32px rgba(22,163,74,0.4)" }}>
          무료로 부업 TOP3 찾기 →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>8문항 퀴즈 → 맞춤 부업 즉시 추천</p>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>점운 직운이 특별한 이유</h2>
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

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#4ade80", margin: "0 0 8px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#052e10,#1a2800)", border: "1px solid rgba(74,222,128,0.4)", borderRadius: 24, padding: "32px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💼</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 10px" }}>지금 부업 TOP3 찾기</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 22px" }}>8문항 퀴즈 + 오행 기질 → 수입범위·시작법·플랫폼 포함 맞춤 부업 TOP3 즉시 확인</p>
          <Link href="/jigun" style={{ display: "inline-block", background: "linear-gradient(135deg,#16a34a,#d97706)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 30, textDecoration: "none" }}>
            무료 직운 퀴즈 시작 →
          </Link>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/jigun" style={{ color: "#4ade80", fontSize: 13, textDecoration: "none" }}>← 직운 홈</Link>
          <Link href="/main-v2" style={{ color: "#4ade80", fontSize: 13, textDecoration: "none" }}>사주 직업운 보기</Link>
          <Link href="/resume" style={{ color: "#4ade80", fontSize: 13, textDecoration: "none" }}>합격자소서 분석</Link>
        </div>
      </section>
    </main>
  );
}
