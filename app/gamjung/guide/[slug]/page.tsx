import type { Metadata } from "next";
import Link from "next/link";

type Entry = { slug: string; title: string; desc: string; h1: string; sub: string; emoji: string; };

const DATA: Entry[] = [
  { slug:"gamjung-diary", title:"감정일기 | 점운 감정일기", desc:"오늘의 감정을 일기로 남기고, 사주 오행으로 감정의 흐름을 파악하세요. 감정 기록과 오행 분석 서비스입니다.", h1:"감정일기 — 오행으로 보는 내 감정의 흐름", sub:"오늘 감정을 기록하고 사주 오행으로 감정 흐름 파악", emoji:"📔" },
  { slug:"free-gamjung", title:"감정일기 시작 | 점운 감정일기", desc:"감정일기 — 회원가입 없이 즉시 오늘의 감정을 기록하고 오행 기질로 감정을 분석하세요.", h1:"감정일기 — 즉시 감정 기록과 오행 분석", sub:"회원가입 없이 즉시 감정 기록·오행 분석 서비스", emoji:"🆓" },
  { slug:"emotion-ohaeng", title:"감정과 오행 | 점운 감정일기", desc:"감정과 오행의 연결 — 분노·기쁨·슬픔·두려움·놀람의 감정이 오행과 어떻게 연결되는지 분석합니다.", h1:"감정과 오행 — 5가지 감정의 오행 에너지 분석", sub:"분노·기쁨·슬픔·두려움·놀람과 오행 에너지의 연결", emoji:"☯️" },
  { slug:"anger-ohaeng", title:"분노 오행 분석 | 점운 감정일기", desc:"분노 감정 오행 분석 — 목(木) 오행 에너지와 분노의 연결, 분노를 다스리는 오행 방법을 안내합니다.", h1:"분노와 오행 — 목 오행 에너지와 분노 다스리기", sub:"분노 감정과 목 오행 에너지 연결·다스리는 방법", emoji:"😤" },
  { slug:"joy-ohaeng", title:"기쁨 오행 분석 | 점운 감정일기", desc:"기쁨 감정 오행 분석 — 화(火) 오행 에너지와 기쁨의 연결, 기쁨 에너지를 키우는 방법을 안내합니다.", h1:"기쁨과 오행 — 화 오행 에너지와 기쁨 키우기", sub:"기쁨 감정과 화 오행 에너지 연결·기쁨 키우는 방법", emoji:"😊" },
  { slug:"worry-ohaeng", title:"걱정 오행 분석 | 점운 감정일기", desc:"걱정·불안 감정 오행 분석 — 토(土) 오행 에너지와 걱정의 연결, 걱정을 줄이는 방법을 안내합니다.", h1:"걱정과 오행 — 토 오행 에너지와 걱정 줄이기", sub:"걱정·불안 감정과 토 오행 에너지 연결·해소 방법", emoji:"😟" },
  { slug:"sadness-ohaeng", title:"슬픔 오행 분석 | 점운 감정일기", desc:"슬픔 감정 오행 분석 — 금(金) 오행 에너지와 슬픔의 연결, 슬픔을 치유하는 방법을 안내합니다.", h1:"슬픔과 오행 — 금 오행 에너지와 슬픔 치유하기", sub:"슬픔 감정과 금 오행 에너지 연결·치유하는 방법", emoji:"😢" },
  { slug:"fear-ohaeng", title:"두려움 오행 분석 | 점운 감정일기", desc:"두려움·공포 감정 오행 분석 — 수(水) 오행 에너지와 두려움의 연결, 두려움을 극복하는 방법을 안내합니다.", h1:"두려움과 오행 — 수 오행 에너지와 두려움 극복", sub:"두려움 감정과 수 오행 에너지 연결·극복하는 방법", emoji:"😨" },
  { slug:"emotion-diary-daily", title:"오늘의 감정일기 | 점운 감정일기", desc:"오늘의 감정일기 — 오늘 느낀 감정을 기록하고 오행 에너지로 오늘의 감정 흐름을 분석합니다.", h1:"오늘의 감정일기 — 오행 에너지로 보는 오늘 감정", sub:"오늘 느낀 감정 기록+오행 에너지 감정 흐름 분석", emoji:"📝" },
  { slug:"emotion-diary-weekly", title:"주간 감정일기 | 점운 감정일기", desc:"주간 감정일기 — 이번 주 감정의 흐름을 기록하고 오행 에너지로 주간 감정 패턴을 분석합니다.", h1:"주간 감정일기 — 이번 주 감정 흐름 오행 분석", sub:"이번 주 감정 흐름 기록과 오행 에너지 패턴 분석", emoji:"📅" },
  { slug:"emotion-diary-monthly", title:"월간 감정일기 | 점운 감정일기", desc:"월간 감정일기 — 이달 감정의 흐름을 기록하고 오행 에너지로 월간 감정 패턴을 분석합니다.", h1:"월간 감정일기 — 이달 감정 흐름 오행 분석", sub:"이달 감정 흐름 기록과 오행 에너지 월간 패턴 분석", emoji:"🗓️" },
  { slug:"emotion-healing", title:"감정 힐링 | 점운 감정일기", desc:"감정 힐링 방법 — 내 오행 기질에 맞는 감정 치유 방법과 에너지 회복 방법을 안내합니다.", h1:"감정 힐링 — 오행 기질별 맞춤 감정 치유 방법", sub:"오행 기질별 감정 치유 방법과 에너지 회복 가이드", emoji:"🌿" },
  { slug:"stress-relief", title:"스트레스 해소 | 점운 감정일기", desc:"오행 기질별 스트레스 해소법 — 내 오행 기질에 맞는 스트레스 해소 방법과 감정 관리법을 안내합니다.", h1:"스트레스 해소 — 오행 기질별 맞춤 해소 방법", sub:"오행 기질별 스트레스 해소법과 감정 관리 가이드", emoji:"😌" },
  { slug:"mindfulness-ohaeng", title:"마음챙김 오행 | 점운 감정일기", desc:"오행 마음챙김 — 동양 오행 철학으로 마음챙김을 실천하는 방법과 감정 인식 방법을 안내합니다.", h1:"오행 마음챙김 — 오행 철학으로 마음 챙기기", sub:"오행 철학 기반 마음챙김 실천법과 감정 인식 방법", emoji:"🧘" },
  { slug:"emotion-diary-saju", title:"사주 감정일기 | 점운 감정일기", desc:"사주 오행 감정일기 — 내 사주 오행 기질로 감정의 원인과 패턴을 더 깊이 이해하는 방법입니다.", h1:"사주 감정일기 — 사주 오행으로 감정 패턴 이해", sub:"사주 오행 기질로 감정 원인과 패턴 깊이 이해하기", emoji:"🔮" },
  { slug:"mok-emotion", title:"목 오행 감정 | 점운 감정일기", desc:"목(木) 오행 감정 분석 — 목 오행 기질의 감정 패턴, 주요 감정, 감정 관리 방법을 분석합니다.", h1:"목 오행 감정 — 목 기질의 감정 패턴과 관리법", sub:"목 오행 기질의 주요 감정 패턴과 감정 관리 방법", emoji:"🌿" },
  { slug:"hwa-emotion", title:"화 오행 감정 | 점운 감정일기", desc:"화(火) 오행 감정 분석 — 화 오행 기질의 감정 패턴, 주요 감정, 감정 관리 방법을 분석합니다.", h1:"화 오행 감정 — 화 기질의 감정 패턴과 관리법", sub:"화 오행 기질의 주요 감정 패턴과 감정 관리 방법", emoji:"🔥" },
  { slug:"to-emotion", title:"토 오행 감정 | 점운 감정일기", desc:"토(土) 오행 감정 분석 — 토 오행 기질의 감정 패턴, 주요 감정, 감정 관리 방법을 분석합니다.", h1:"토 오행 감정 — 토 기질의 감정 패턴과 관리법", sub:"토 오행 기질의 주요 감정 패턴과 감정 관리 방법", emoji:"🌍" },
  { slug:"geum-emotion", title:"금 오행 감정 | 점운 감정일기", desc:"금(金) 오행 감정 분석 — 금 오행 기질의 감정 패턴, 주요 감정, 감정 관리 방법을 분석합니다.", h1:"금 오행 감정 — 금 기질의 감정 패턴과 관리법", sub:"금 오행 기질의 주요 감정 패턴과 감정 관리 방법", emoji:"💎" },
  { slug:"su-emotion", title:"수 오행 감정 | 점운 감정일기", desc:"수(水) 오행 감정 분석 — 수 오행 기질의 감정 패턴, 주요 감정, 감정 관리 방법을 분석합니다.", h1:"수 오행 감정 — 수 기질의 감정 패턴과 관리법", sub:"수 오행 기질의 주요 감정 패턴과 감정 관리 방법", emoji:"💧" },
  { slug:"positive-emotion", title:"긍정 감정 키우기 | 점운 감정일기", desc:"긍정 감정 키우기 — 오행 기질로 내 긍정 에너지를 키우고 행복 감정을 늘리는 방법을 안내합니다.", h1:"긍정 감정 키우기 — 오행으로 행복 에너지 늘리기", sub:"오행 기질로 긍정 에너지·행복 감정 키우는 방법", emoji:"😊" },
  { slug:"negative-emotion", title:"부정 감정 다스리기 | 점운 감정일기", desc:"부정 감정 다스리기 — 오행 기질로 분노·슬픔·두려움 등 부정 감정을 다스리는 방법을 안내합니다.", h1:"부정 감정 다스리기 — 오행으로 감정 조절하기", sub:"오행 기질로 분노·슬픔·두려움 부정 감정 다스리기", emoji:"🛡️" },
  { slug:"emotion-pattern", title:"감정 패턴 분석 | 점운 감정일기", desc:"감정 패턴 분석 — 내 오행 기질로 반복되는 감정 패턴과 그 원인을 분석하는 방법을 안내합니다.", h1:"감정 패턴 분석 — 오행으로 보는 반복 감정 패턴", sub:"오행 기질로 반복되는 감정 패턴과 원인 분석법", emoji:"🔍" },
  { slug:"relationship-emotion", title:"관계 감정 일기 | 점운 감정일기", desc:"관계에서 오는 감정 일기 — 연인·가족·친구·직장 관계에서 오는 감정을 오행으로 분석합니다.", h1:"관계 감정 일기 — 오행으로 보는 관계 감정 패턴", sub:"연인·가족·친구·직장 관계 감정 오행 분석 일기", emoji:"💑" },
  { slug:"loneliness-ohaeng", title:"외로움 오행 분석 | 점운 감정일기", desc:"외로움 감정 오행 분석 — 외로움이 찾아오는 원인과 오행 기질별 외로움 극복 방법을 안내합니다.", h1:"외로움과 오행 — 외로움 원인과 극복 방법 분석", sub:"외로움 감정 원인과 오행 기질별 극복 방법 가이드", emoji:"🥺" },
  { slug:"anxiety-ohaeng", title:"불안 오행 분석 | 점운 감정일기", desc:"불안 감정 오행 분석 — 불안의 원인과 오행 기질별 불안 해소 방법을 안내합니다.", h1:"불안과 오행 — 불안 원인과 오행 해소 방법", sub:"불안 감정 원인과 오행 기질별 해소 방법 가이드", emoji:"😰" },
  { slug:"depression-ohaeng", title:"우울 오행 분석 | 점운 감정일기", desc:"우울 감정 오행 분석 — 우울한 마음의 원인과 오행 에너지로 마음을 밝히는 방법을 안내합니다.", h1:"우울과 오행 — 우울 원인과 마음 밝히는 방법", sub:"우울 감정 원인과 오행 에너지로 마음 밝히는 방법", emoji:"😞" },
  { slug:"happiness-ohaeng", title:"행복 오행 분석 | 점운 감정일기", desc:"행복 감정 오행 분석 — 내 오행 기질에 맞는 행복의 원천과 행복 에너지를 키우는 방법입니다.", h1:"행복과 오행 — 오행 기질별 행복의 원천", sub:"오행 기질에 맞는 행복의 원천과 행복 에너지 키우기", emoji:"😄" },
  { slug:"gratitude-diary", title:"감사 일기 | 점운 감정일기", desc:"감사 일기 오행 활용 — 오행 에너지로 매일 감사 일기를 쓰는 방법과 긍정 에너지 키우기를 안내합니다.", h1:"감사 일기 — 오행 에너지로 감사함 키우기", sub:"오행 에너지를 활용한 매일 감사 일기 작성법", emoji:"🙏" },
  { slug:"emotion-saju-connection", title:"감정과 사주 연결 | 점운 감정일기", desc:"감정과 사주 오행의 연결 — 사주 오행 기질이 감정 반응에 미치는 영향과 감정 조절법을 안내합니다.", h1:"감정과 사주 — 오행 기질이 감정에 미치는 영향", sub:"사주 오행 기질이 감정 반응에 미치는 영향 분석", emoji:"🔮" },
  { slug:"morning-emotion", title:"아침 감정 체크 | 점운 감정일기", desc:"아침 감정 체크 — 하루를 시작하기 전 오행 에너지로 아침 감정을 체크하고 하루를 준비하세요.", h1:"아침 감정 체크 — 오행 에너지로 하루 시작 준비", sub:"하루 시작 전 오행 에너지 아침 감정 체크 방법", emoji:"🌅" },
  { slug:"night-emotion", title:"밤 감정 정리 | 점운 감정일기", desc:"밤 감정 정리 — 하루를 마무리하며 오행 에너지로 오늘의 감정을 정리하고 내일을 준비하세요.", h1:"밤 감정 정리 — 오행 에너지로 하루 감정 마무리", sub:"하루 마무리 오행 에너지 감정 정리와 내일 준비", emoji:"🌙" },
  { slug:"emotion-diary-tips", title:"감정일기 쓰는 법 | 점운 감정일기", desc:"감정일기 쓰는 법 — 오행 에너지를 활용해 효과적으로 감정일기를 쓰는 방법과 팁을 안내합니다.", h1:"감정일기 쓰는 법 — 오행 에너지 활용 감정일기 팁", sub:"오행 에너지를 활용한 효과적인 감정일기 작성법 팁", emoji:"💡" },
  { slug:"emotion-mbti", title:"MBTI 감정 패턴 | 점운 감정일기", desc:"MBTI 유형별 감정 패턴 — MBTI 16유형의 감정 표현 방식과 오행 기질의 연결을 분석합니다.", h1:"MBTI 감정 패턴 — 유형별 감정 표현과 오행 연결", sub:"MBTI 16유형 감정 표현 방식과 오행 기질 연결 분석", emoji:"🧠" },
  { slug:"love-emotion-diary", title:"연애 감정일기 | 점운 감정일기", desc:"연애 감정일기 — 연애에서 오는 다양한 감정을 오행으로 분석하고 건강한 연애 감정을 키우세요.", h1:"연애 감정일기 — 오행으로 보는 연애 감정 패턴", sub:"연애 감정 패턴을 오행으로 분석하는 연애 감정일기", emoji:"💕" },
  { slug:"work-emotion-diary", title:"직장 감정일기 | 점운 감정일기", desc:"직장 감정일기 — 직장에서 오는 스트레스와 감정을 오행으로 분석하고 건강한 직장 생활을 만드세요.", h1:"직장 감정일기 — 오행으로 보는 직장 감정 패턴", sub:"직장 스트레스·감정 패턴을 오행으로 분석하는 일기", emoji:"🏢" },
  { slug:"family-emotion-diary", title:"가족 감정일기 | 점운 감정일기", desc:"가족 감정일기 — 가족 관계에서 오는 감정을 오행으로 분석하고 건강한 가족 관계를 만드세요.", h1:"가족 감정일기 — 오행으로 보는 가족 감정 패턴", sub:"가족 관계 감정 패턴을 오행으로 분석하는 감정일기", emoji:"👨‍👩‍👧‍👦" },
  { slug:"emotion-diary-app", title:"감정일기 앱 | 점운 감정일기", desc:"감정일기 앱 — 점운 감정일기 앱으로 매일 감정을 기록하고 오행 에너지로 감정 패턴을 분석하세요.", h1:"감정일기 앱 — 오행 감정 기록 분석 앱", sub:"매일 감정 기록+오행 에너지 패턴 분석 앱", emoji:"📱" },
  { slug:"sleep-emotion", title:"수면 감정 일기 | 점운 감정일기", desc:"수면과 감정 오행 분석 — 오행 기질로 수면의 질과 감정의 관계를 분석하고 더 잘 자는 방법을 안내합니다.", h1:"수면 감정 일기 — 오행으로 보는 수면과 감정 관계", sub:"오행 기질로 수면과 감정의 관계 분석과 수면 개선법", emoji:"😴" },
  { slug:"emotion-color", title:"감정 색깔 오행 | 점운 감정일기", desc:"감정 색깔과 오행 — 오행 오색(청·적·황·백·흑)과 감정의 연결로 내 감정 에너지를 시각화합니다.", h1:"감정 색깔 오행 — 오색으로 시각화하는 내 감정", sub:"오행 오색(청·적·황·백·흑)과 감정의 연결 시각화", emoji:"🌈" },
  { slug:"emotion-season", title:"계절별 감정 | 점운 감정일기", desc:"계절별 감정 오행 분석 — 봄·여름·가을·겨울 오행 에너지에 따른 감정 변화 패턴을 분석합니다.", h1:"계절별 감정 — 봄·여름·가을·겨울 오행 감정 흐름", sub:"계절별 오행 에너지와 감정 변화 패턴 분석 가이드", emoji:"🌿" },
  { slug:"emotion-weather", title:"날씨 감정 일기 | 점운 감정일기", desc:"날씨와 감정 오행 분석 — 오행 에너지로 맑음·흐림·비·눈 날씨가 감정에 미치는 영향을 분석합니다.", h1:"날씨 감정 일기 — 오행으로 보는 날씨와 감정", sub:"날씨 오행 에너지가 감정에 미치는 영향 분석 가이드", emoji:"⛅" },
  { slug:"emotion-food", title:"음식 감정 연결 | 점운 감정일기", desc:"음식과 감정 오행 연결 — 오행 기질별 감정에 좋은 음식과 피해야 할 음식을 분석합니다.", h1:"음식과 감정 — 오행 기질별 감정 도움 음식", sub:"오행 기질별 감정에 좋은 음식과 피해야 할 음식", emoji:"🍎" },
  { slug:"emotion-exercise", title:"운동 감정 일기 | 점운 감정일기", desc:"운동과 감정 오행 분석 — 오행 기질별 감정 해소에 좋은 운동 방법과 활동을 분석합니다.", h1:"운동 감정 일기 — 오행 기질별 감정 해소 운동", sub:"오행 기질별 감정 해소에 좋은 운동 방법 분석", emoji:"🏃" },
  { slug:"emotion-music", title:"음악 감정 치유 | 점운 감정일기", desc:"음악과 감정 오행 치유 — 오행 기질별 감정 치유에 좋은 음악과 사운드 테라피를 안내합니다.", h1:"음악 감정 치유 — 오행 기질별 감정 치유 음악", sub:"오행 기질별 감정 치유에 좋은 음악·사운드 테라피", emoji:"🎵" },
  { slug:"self-care-ohaeng", title:"오행 셀프케어 | 점운 감정일기", desc:"오행 기질별 셀프케어 — 내 오행 기질에 맞는 자기 돌봄 방법과 일상 루틴을 안내합니다.", h1:"오행 셀프케어 — 기질별 맞춤 자기 돌봄 루틴", sub:"오행 기질별 맞춤 셀프케어와 일상 루틴 가이드", emoji:"🌺" },
  { slug:"emotion-diary-record", title:"감정 기록 방법 | 점운 감정일기", desc:"감정 기록 방법 완전 가이드 — 매일 감정을 효과적으로 기록하고 오행 에너지로 분석하는 방법입니다.", h1:"감정 기록 방법 — 효과적인 오행 감정 기록 가이드", sub:"매일 감정을 효과적으로 기록·오행 분석하는 방법", emoji:"✍️" },
  { slug:"emotion-diary-benefits", title:"감정일기 효과 | 점운 감정일기", desc:"감정일기의 효과 — 매일 감정일기를 쓰면 어떤 변화가 일어나는지, 오행 에너지와의 연결을 안내합니다.", h1:"감정일기 효과 — 매일 쓰면 달라지는 오행 에너지", sub:"매일 감정일기가 가져오는 변화와 오행 에너지 연결", emoji:"✨" },
  { slug:"emotion-therapy", title:"감정 치유 방법 | 점운 감정일기", desc:"오행 감정 치유 방법 — 오행 기질별 감정 상처를 치유하고 마음의 회복력을 키우는 방법입니다.", h1:"감정 치유 방법 — 오행 기질별 마음 회복 방법", sub:"오행 기질별 감정 상처 치유와 마음 회복력 키우기", emoji:"💚" },
  { slug:"emotion-ohaeng-guide", title:"감정 오행 완전 가이드 | 점운 감정일기", desc:"감정과 오행 완전 가이드 — 5가지 감정과 오행 에너지의 연결, 감정 관리 방법의 완전한 가이드입니다.", h1:"감정 오행 완전 가이드 — 5감정×5오행 완전 분석", sub:"5가지 감정과 오행 에너지 연결 완전 가이드", emoji:"📖" },
  { slug:"gamjung-summary", title:"감정일기 완전 정리 | 점운 감정일기", desc:"감정일기 완전 정리 — 감정 기록·오행 분석·감정 치유의 완전한 가이드입니다.", h1:"감정일기 완전 정리 — 기록·분석·치유 완전 가이드", sub:"감정 기록·오행 분석·감정 치유 완전 정리 가이드", emoji:"📖" },
  { slug:"emotion-loneliness", title:"외로움 오행 치유 | 점운 감정일기", desc:"외로움 오행 치유 — 외로움을 느낄 때 오행 수(水) 에너지를 이해하고 치유하는 방법입니다.", h1:"외로움 오행 치유 — 수 에너지 외로움 이해·치유", sub:"외로움을 느낄 때 오행 수 에너지 이해와 치유 방법", emoji:"🌊" },
  { slug:"emotion-jealousy", title:"질투 오행 이해 | 점운 감정일기", desc:"질투 감정 오행 이해 — 질투심이 생기는 오행 에너지 원인과 건강한 해소 방법을 분석합니다.", h1:"질투 오행 이해 — 질투 에너지 원인과 건강한 해소", sub:"질투심의 오행 에너지 원인 이해와 건강한 감정 해소", emoji:"💚" },
  { slug:"emotion-shame", title:"수치심 오행 치유 | 점운 감정일기", desc:"수치심 오행 치유 — 수치심과 창피함의 오행 금(金) 에너지 원인과 자존감 회복 방법입니다.", h1:"수치심 오행 치유 — 금 에너지 수치심·자존감 회복", sub:"수치심의 오행 금 에너지 원인과 자존감 회복 방법", emoji:"😶" },
  { slug:"emotion-guilt", title:"죄책감 오행 치유 | 점운 감정일기", desc:"죄책감 오행 치유 — 죄책감의 오행 토(土) 에너지 원인과 자기용서·해소 방법을 안내합니다.", h1:"죄책감 오행 치유 — 토 에너지 죄책감·자기용서법", sub:"죄책감의 오행 토 에너지 원인과 자기용서 해소 방법", emoji:"😔" },
  { slug:"emotion-burnout", title:"번아웃 오행 치유 | 점운 감정일기", desc:"번아웃 오행 치유 — 번아웃(탈진)의 오행 에너지 원인과 오행 기질별 번아웃 회복 방법입니다.", h1:"번아웃 오행 치유 — 탈진 에너지 원인과 회복 방법", sub:"번아웃 탈진의 오행 에너지 원인과 기질별 회복 방법", emoji:"🔋" },
  { slug:"emotion-excitement", title:"설렘 오행 | 점운 감정일기", desc:"설렘 감정 오행 분석 — 기대감과 설렘의 오행 목(木)·화(火) 에너지와 긍정 활용법입니다.", h1:"설렘 오행 — 기대감·설렘의 목·화 에너지 분석", sub:"기대감과 설렘의 오행 목·화 에너지 이해·긍정 활용", emoji:"💓" },
  { slug:"emotion-boredom", title:"지루함 오행 | 점운 감정일기", desc:"지루함 감정 오행 분석 — 지루함·무기력의 오행 에너지 원인과 활력 회복 방법입니다.", h1:"지루함 오행 — 무기력·지루함 에너지 원인과 회복", sub:"지루함·무기력의 오행 에너지 원인과 활력 회복 방법", emoji:"😑" },
  { slug:"emotion-hope", title:"희망 오행 | 점운 감정일기", desc:"희망 감정 오행 분석 — 희망과 낙관의 오행 목(木) 에너지를 키우고 유지하는 방법입니다.", h1:"희망 오행 — 목 에너지 희망·낙관 키우는 방법", sub:"희망과 낙관의 오행 목 에너지를 키우고 유지하는 법", emoji:"🌱" },
  { slug:"emotion-confidence", title:"자신감 오행 | 점운 감정일기", desc:"자신감 오행 분석 — 자신감과 용기의 오행 화(火) 에너지를 강화하는 방법입니다.", h1:"자신감 오행 — 화 에너지 자신감·용기 강화 방법", sub:"자신감과 용기의 오행 화 에너지를 강화하는 방법", emoji:"💪" },
  { slug:"emotion-trust", title:"신뢰 오행 | 점운 감정일기", desc:"신뢰 감정 오행 분석 — 신뢰와 믿음의 오행 토(土) 에너지를 키우고 관계에 활용하는 방법입니다.", h1:"신뢰 오행 — 토 에너지 신뢰·믿음 키우는 방법", sub:"신뢰와 믿음의 오행 토 에너지를 키우고 관계 활용법", emoji:"🤝" },
  { slug:"emotion-forgiveness", title:"용서 오행 | 점운 감정일기", desc:"용서 감정 오행 분석 — 용서의 오행 금(金) 에너지와 용서를 통한 감정 정화 방법입니다.", h1:"용서 오행 — 금 에너지 용서를 통한 감정 정화", sub:"용서의 오행 금 에너지와 용서를 통한 감정 정화법", emoji:"🕊️" },
  { slug:"emotion-empathy", title:"공감 오행 | 점운 감정일기", desc:"공감 감정 오행 분석 — 공감력과 감수성의 오행 수(水) 에너지를 개발하는 방법입니다.", h1:"공감 오행 — 수 에너지 공감력·감수성 개발 방법", sub:"공감력과 감수성의 오행 수 에너지 개발 방법", emoji:"💙" },
  { slug:"morning-emotion-diary", title:"아침 감정일기 | 점운 감정일기", desc:"아침 감정일기 작성법 — 하루를 시작하는 아침 감정 기록과 오행 에너지 활성화 루틴입니다.", h1:"아침 감정일기 — 하루를 여는 오행 에너지 루틴", sub:"아침 감정 기록과 오행 에너지 활성화 하루 시작 루틴", emoji:"🌅" },
  { slug:"night-emotion-diary", title:"저녁 감정일기 | 점운 감정일기", desc:"저녁 감정일기 작성법 — 하루를 마무리하는 저녁 감정 기록과 오행 에너지 정화 루틴입니다.", h1:"저녁 감정일기 — 하루를 마무리하는 오행 루틴", sub:"저녁 감정 기록과 오행 에너지 정화 하루 마무리 루틴", emoji:"🌙" },
  { slug:"emotion-diary-1month", title:"감정일기 1달 챌린지 | 점운 감정일기", desc:"감정일기 1달 챌린지 — 30일 동안 매일 감정을 기록하면 오행 에너지가 어떻게 변하는지 안내합니다.", h1:"감정일기 30일 챌린지 — 오행 에너지 변화 추적", sub:"30일 매일 감정 기록으로 추적하는 오행 에너지 변화", emoji:"📆" },
  { slug:"emotion-diary-vs-journal", title:"감정일기 vs 일반일기 | 점운 감정일기", desc:"감정일기 vs 일반일기 차이 — 감정에 집중하는 일기와 일반 일기의 차이와 오행 활용법입니다.", h1:"감정일기 vs 일반일기 — 차이와 오행 활용법", sub:"감정일기와 일반일기 차이·오행 활용 방법 비교", emoji:"📚" },
  { slug:"emotion-diary-template", title:"감정일기 템플릿 | 점운 감정일기", desc:"감정일기 작성 템플릿 — 오행 기질에 맞는 맞춤 감정일기 템플릿과 작성 가이드입니다.", h1:"감정일기 템플릿 — 오행 기질 맞춤 작성 가이드", sub:"오행 기질에 맞는 감정일기 템플릿과 작성 가이드", emoji:"📝" },
  { slug:"emotion-color-therapy", title:"감정 색채 치유 | 점운 감정일기", desc:"감정 색채 치유(컬러테라피) — 오행 오색(청·적·황·백·흑)을 활용한 감정 치유 색채 요법입니다.", h1:"감정 색채 치유 — 오행 오색 컬러테라피 감정 치유", sub:"오행 오색 청·적·황·백·흑 활용 감정 치유 색채 요법", emoji:"🎨" },
  { slug:"emotion-music-therapy", title:"감정 음악 치유 | 점운 감정일기", desc:"감정 음악 치유(뮤직테라피) — 오행 에너지에 맞는 음악 선택으로 감정을 치유하는 방법입니다.", h1:"감정 음악 치유 — 오행 에너지 맞춤 뮤직테라피", sub:"오행 에너지에 맞는 음악 선택으로 감정 치유하는 법", emoji:"🎵" },
  { slug:"emotion-nature-therapy", title:"감정 자연 치유 | 점운 감정일기", desc:"감정 자연 치유 — 오행 자연 에너지(산·바다·숲·하늘·들판)를 활용한 감정 치유 방법입니다.", h1:"감정 자연 치유 — 오행 자연 에너지 감정 치유법", sub:"산·바다·숲·하늘·들판 오행 자연 에너지 감정 치유", emoji:"🌿" },
  { slug:"emotion-writing-therapy", title:"감정 글쓰기 치유 | 점운 감정일기", desc:"감정 글쓰기 치유(저널링) — 오행 기질에 맞는 감정 글쓰기 방식과 치유 효과를 안내합니다.", h1:"감정 글쓰기 치유 — 오행 기질 맞춤 저널링 방법", sub:"오행 기질에 맞는 감정 글쓰기 방식과 저널링 치유", emoji:"✍️" },
  { slug:"emotion-exercise-therapy", title:"감정 운동 치유 | 점운 감정일기", desc:"감정 운동 치유 — 오행 기질에 맞는 운동 종류와 감정 해소 효과적인 운동 방법을 안내합니다.", h1:"감정 운동 치유 — 오행 기질 맞춤 감정 해소 운동", sub:"오행 기질에 맞는 감정 해소 효과적인 운동 방법", emoji:"🏃" },
  { slug:"teen-emotion-diary", title:"청소년 감정일기 | 점운 감정일기", desc:"청소년 감정일기 — 10대 청소년의 감정 변화와 오행 에너지로 이해하는 감정 관리 가이드입니다.", h1:"청소년 감정일기 — 10대 감정 변화 오행 이해 가이드", sub:"10대 청소년 감정 변화와 오행 에너지 감정 관리", emoji:"🎒" },
  { slug:"couple-emotion-diary", title:"커플 감정일기 | 점운 감정일기", desc:"커플 감정일기 — 연인 사이의 감정 공유와 오행 기질 차이를 이해하는 커플 감정 일기입니다.", h1:"커플 감정일기 — 연인 감정 공유와 오행 기질 이해", sub:"연인 사이 감정 공유와 오행 기질 차이 이해 방법", emoji:"💑" },
  { slug:"family-emotion-diary", title:"가족 감정일기 | 점운 감정일기", desc:"가족 감정일기 — 가족 구성원 각자의 오행 기질을 이해하고 가족 감정을 건강하게 나누는 방법입니다.", h1:"가족 감정일기 — 오행 기질 이해 가족 감정 공유법", sub:"가족 구성원 오행 기질 이해와 건강한 감정 나누기", emoji:"👨‍👩‍👧‍👦" },
  { slug:"work-emotion-diary", title:"직장 감정일기 | 점운 감정일기", desc:"직장 감정일기 — 직장 생활에서 생기는 스트레스·감정을 오행으로 분석하고 해소하는 방법입니다.", h1:"직장 감정일기 — 직장 스트레스 오행 분석·해소법", sub:"직장 스트레스·감정을 오행으로 분석하고 해소하는 법", emoji:"🏢" },
  { slug:"breakup-emotion-diary", title:"이별 감정일기 | 점운 감정일기", desc:"이별 감정일기 — 이별 후 찾아오는 슬픔과 감정을 오행으로 이해하고 치유하는 방법입니다.", h1:"이별 감정일기 — 이별 후 슬픔 오행 이해·치유법", sub:"이별 후 슬픔과 감정을 오행 에너지로 이해하고 치유", emoji:"💔" },
  { slug:"loss-emotion-diary", title:"상실 감정일기 | 점운 감정일기", desc:"상실 감정일기 — 소중한 것을 잃었을 때 찾아오는 상실감을 오행으로 이해하고 극복하는 방법입니다.", h1:"상실 감정일기 — 상실감 오행 이해와 극복 방법", sub:"소중한 것을 잃었을 때 상실감을 오행으로 이해·극복", emoji:"🕯️" },
  { slug:"success-emotion-diary", title:"성취 감정일기 | 점운 감정일기", desc:"성취 감정일기 — 성공과 성취의 기쁨을 오행으로 기록하고 더 큰 성취로 연결하는 방법입니다.", h1:"성취 감정일기 — 성공 기쁨 오행 기록 더 큰 성취로", sub:"성공·성취의 기쁨을 오행으로 기록하고 더 발전하기", emoji:"🏆" },
  { slug:"anger-management-ohaeng", title:"분노 조절 오행 | 점운 감정일기", desc:"분노 조절 오행 방법 — 화(火) 오행 에너지 과잉으로 생기는 분노를 조절하는 5가지 방법입니다.", h1:"분노 조절 오행 — 화 에너지 과잉 분노 조절 5가지", sub:"화 오행 에너지 과잉 분노 조절하는 5가지 오행 방법", emoji:"🔥" },
  { slug:"anxiety-management-ohaeng", title:"불안 관리 오행 | 점운 감정일기", desc:"불안 관리 오행 방법 — 수(水) 오행 에너지 불균형에서 오는 불안을 다스리는 방법입니다.", h1:"불안 관리 오행 — 수 에너지 불안 다스리는 방법", sub:"수 오행 에너지 불균형 불안 관리하는 오행 방법", emoji:"😰" },
  { slug:"depression-ohaeng", title:"우울감 오행 치유 | 점운 감정일기", desc:"우울감 오행 치유 — 금(金) 오행 에너지 과잉에서 오는 우울감을 이해하고 치유하는 방법입니다.", h1:"우울감 오행 치유 — 금 에너지 우울감 이해·치유법", sub:"금 오행 에너지 과잉 우울감 이해와 치유 방법", emoji:"🌧️" },
  { slug:"stress-ohaeng", title:"스트레스 오행 분석 | 점운 감정일기", desc:"스트레스 오행 분석 — 오행 기질별 스트레스를 받는 상황과 각 기질에 맞는 스트레스 해소법입니다.", h1:"스트레스 오행 분석 — 기질별 스트레스 원인·해소법", sub:"오행 기질별 스트레스 받는 상황과 맞춤 해소 방법", emoji:"💆" },
  { slug:"emotion-diary-app", title:"감정일기 앱 활용 | 점운 감정일기", desc:"감정일기 앱 활용법 — 점운 감정일기 앱으로 오행 감정을 기록하고 분석하는 방법입니다.", h1:"감정일기 앱 활용 — 점운으로 오행 감정 기록·분석", sub:"점운 감정일기 앱으로 오행 감정 기록·분석 활용법", emoji:"📱" },
  { slug:"positive-emotion-ohaeng", title:"긍정 감정 오행 | 점운 감정일기", desc:"긍정 감정 오행 분석 — 감사·기쁨·평화·사랑·행복의 긍정 감정과 오행 에너지 연결입니다.", h1:"긍정 감정 오행 — 감사·기쁨·평화·사랑의 오행 에너지", sub:"감사·기쁨·평화·사랑·행복의 긍정 감정 오행 연결", emoji:"😊" },
  { slug:"negative-emotion-ohaeng", title:"부정 감정 오행 | 점운 감정일기", desc:"부정 감정 오행 분석 — 분노·슬픔·두려움·걱정·수치심의 부정 감정과 오행 에너지 이해입니다.", h1:"부정 감정 오행 — 분노·슬픔·두려움의 오행 이해", sub:"분노·슬픔·두려움·걱정·수치심의 부정 감정 오행 이해", emoji:"😟" },
  { slug:"seasonal-emotion", title:"계절 감정 변화 | 점운 감정일기", desc:"계절 감정 변화와 오행 — 봄·여름·가을·겨울 오행 에너지에 따른 감정 변화와 관리법입니다.", h1:"계절 감정 변화 — 봄·여름·가을·겨울 오행 감정", sub:"봄·여름·가을·겨울 오행 에너지에 따른 감정 변화", emoji:"🍂" },
  { slug:"emotion-self-love", title:"자기사랑 감정일기 | 점운 감정일기", desc:"자기사랑 오행 감정일기 — 오행 기질을 이해하고 나 자신을 사랑하는 방법과 감정 일기 작성법입니다.", h1:"자기사랑 감정일기 — 오행 기질 이해 자기사랑 방법", sub:"오행 기질 이해를 통한 자기사랑과 감정일기 작성법", emoji:"❤️" },
  { slug:"emotion-boundary", title:"감정 경계 설정 | 점운 감정일기", desc:"감정 경계 설정 오행 — 오행 금(金) 에너지를 활용해 건강한 감정적 경계를 설정하는 방법입니다.", h1:"감정 경계 설정 — 금 에너지 건강한 감정 경계 방법", sub:"오행 금 에너지를 활용한 건강한 감정적 경계 설정법", emoji:"🛡️" },
  { slug:"gamjung-free", title:"감정일기 시작 | 점운 감정일기", desc:"감정일기 시작 — 점운 감정일기로 오행 기질에 맞는 감정 분석을 시작하세요.", h1:"감정일기 — 오행 기질 감정 분석 시작하기", sub:"점운 감정일기로 오행 기질 맞춤 감정 분석 시작", emoji:"🎁" },
  { slug:"emotion-pregnancy", title:"임신·출산 감정일기 | 점운 감정일기", desc:"임신·출산 감정일기 — 임신·출산 과정의 다양한 감정을 오행으로 이해하고 기록하는 방법입니다.", h1:"임신·출산 감정일기 — 오행으로 이해하는 감정 변화", sub:"임신·출산 과정의 다양한 감정 오행 이해·기록 방법", emoji:"🤰" },
  { slug:"emotion-retirement", title:"은퇴·노년 감정일기 | 점운 감정일기", desc:"은퇴·노년 감정일기 — 인생 전환점인 은퇴 이후의 감정 변화를 오행으로 이해하고 치유합니다.", h1:"은퇴·노년 감정일기 — 오행으로 이해하는 인생 전환", sub:"은퇴 이후 인생 전환점의 감정 변화 오행 이해·치유", emoji:"🌅" },
  { slug:"emotion-social-media", title:"SNS 감정 오행 | 점운 감정일기", desc:"SNS 사용과 감정 오행 — SNS 사용이 오행 에너지와 감정에 미치는 영향을 분석합니다.", h1:"SNS 감정 오행 — SNS가 오행 에너지·감정에 미치는 영향", sub:"SNS 사용이 오행 에너지와 감정에 미치는 영향 분석", emoji:"📱" },
  { slug:"emotion-gratitude-journal", title:"감사일기 오행 | 점운 감정일기", desc:"감사일기와 오행 에너지 — 매일 감사한 것을 기록하는 감사일기가 오행 에너지에 미치는 효과입니다.", h1:"감사일기 오행 — 감사 기록이 오행 에너지에 미치는 효과", sub:"매일 감사 기록 감사일기와 오행 에너지 효과 분석", emoji:"🙏" },
  { slug:"emotion-visualization", title:"감정 시각화 오행 | 점운 감정일기", desc:"감정 시각화 오행 — 감정을 색깔·형태·이미지로 시각화하고 오행 에너지와 연결하는 방법입니다.", h1:"감정 시각화 오행 — 감정을 색깔·이미지 오행 연결", sub:"감정을 색깔·형태·이미지로 시각화하고 오행 에너지 연결", emoji:"🎨" },
  { slug:"emotion-mbti", title:"MBTI 감정 패턴 오행 | 점운 감정일기", desc:"MBTI 감정 패턴과 오행 — MBTI 유형별 감정 표현 방식과 오행 기질 감정 패턴을 분석합니다.", h1:"MBTI 감정 패턴 오행 — 유형별 감정 표현과 오행", sub:"MBTI 유형별 감정 표현 방식과 오행 기질 감정 패턴", emoji:"🧠" },
  { slug:"emotion-letter", title:"감정 편지 쓰기 | 점운 감정일기", desc:"감정 편지 쓰기 — 자신·과거·미래·소중한 사람에게 감정 편지를 쓰며 오행 에너지를 치유하는 방법.", h1:"감정 편지 쓰기 — 오행 에너지 치유하는 편지 쓰기", sub:"자신·과거·미래에게 쓰는 감정 편지로 오행 에너지 치유", emoji:"✉️" },
  { slug:"emotion-mindset", title:"감정 마인드셋 오행 | 점운 감정일기", desc:"감정 마인드셋과 오행 — 긍정적 감정 마인드셋을 오행 에너지로 강화하는 방법입니다.", h1:"감정 마인드셋 오행 — 긍정 마인드셋 오행 강화법", sub:"긍정적 감정 마인드셋을 오행 에너지로 강화하는 방법", emoji:"💡" },
  { slug:"emotion-diary-healing", title:"감정일기 치유 효과 | 점운 감정일기", desc:"감정일기 치유 효과 — 감정을 기록하는 것만으로도 오행 에너지가 정화되고 치유되는 과학적·오행적 근거.", h1:"감정일기 치유 효과 — 기록으로 오행 에너지 정화", sub:"감정 기록으로 오행 에너지가 정화되고 치유되는 근거", emoji:"💊" },
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
    keywords: ["감정일기", "오행감정", "감정분석", "감정치유", "점운감정일기", "사주감정"],
    openGraph: { title: d.title, description: d.desc, url: `https://jeomun.com/gamjung/guide/${d.slug}` },
  };
}

export default async function GamjungSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];

  const features = [
    { icon: "📔", title: "오행 감정 기록", desc: "오늘 느낀 감정을 기록하고 사주 오행 에너지로 감정의 흐름과 패턴을 분석합니다." },
    { icon: "☯️", title: "5감정×5오행 분석", desc: "분노·기쁨·걱정·슬픔·두려움 5가지 감정과 목·화·토·금·수 오행의 연결을 분석합니다." },
    { icon: "🌿", title: "감정 치유 방법", desc: "오행 기질별 맞춤 감정 치유 방법과 자기 돌봄 루틴을 안내합니다." },
    { icon: "🔮", title: "사주 연동 분석", desc: "내 사주 오행 기질로 반복되는 감정 패턴과 원인을 더 깊이 이해합니다." },
  ];

  const faqs = [
    { q: "감정일기가 왜 필요한가요?", a: "감정일기를 쓰면 감정 패턴을 파악하고 더 건강한 감정 관리가 가능합니다. 오행 에너지와 연결하면 감정의 근본 원인을 더 깊이 이해할 수 있습니다." },
    { q: "오행과 감정은 어떻게 연결되나요?", a: "동양 오행 철학에서는 목=분노, 화=기쁨, 토=걱정, 금=슬픔, 수=두려움으로 연결합니다. 오행 균형이 맞으면 감정도 안정됩니다." },
    { q: "이용 요금이 있나요?", a: "첫 30일은 990원 단독권으로 시작할 수 있어요. 감정 기록 내역은 영구 보관됩니다." },
    { q: "사주와 어떻게 연결되나요?", a: "내 사주 오행 기질(목·화·토·금·수)에 따라 특히 강한 감정과 약한 감정이 달라집니다. 사주를 함께 보면 더 정확한 감정 분석이 가능합니다." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a2a1a 0%,#1a4a2a 50%,#0a2a1a 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "#f5f5f5", wordBreak: "keep-all" as const }}>
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{d.emoji}</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1.3, margin: "0 0 14px", background: "linear-gradient(135deg,#34d399,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{d.h1}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 28px" }}>{d.sub}</p>
        <Link href="/gamjung" style={{ display: "inline-block", background: "linear-gradient(135deg,#059669,#2563eb)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 32px", borderRadius: 30, textDecoration: "none", boxShadow: "0 8px 32px rgba(5,150,105,0.4)" }}>
          지금 감정일기 쓰기 →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>감정 기록 · 오행 분석 · 오행 치유</p>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>점운 감정일기가 특별한 이유</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 16, padding: "18px 14px" }}>
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
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: 14, padding: "16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#34d399", margin: "0 0 8px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#1a4a2a,#0a2a1a)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 24, padding: "32px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📔</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 10px" }}>오늘 감정일기 쓰기</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 22px" }}>오늘의 감정을 기록하고 사주 오행으로 감정의 흐름과 패턴을 즉시 분석해드려요</p>
          <Link href="/gamjung" style={{ display: "inline-block", background: "linear-gradient(135deg,#059669,#2563eb)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 30, textDecoration: "none" }}>
            감정일기 시작하기 →
          </Link>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/gamjung" style={{ color: "#34d399", fontSize: 13, textDecoration: "none" }}>← 감정일기 홈</Link>
          <Link href="/main-v2" style={{ color: "#34d399", fontSize: 13, textDecoration: "none" }}>사주 보기</Link>
          <Link href="/momcare" style={{ color: "#34d399", fontSize: 13, textDecoration: "none" }}>맘케어 보기</Link>
        </div>
      </section>
    </main>
  );
}
