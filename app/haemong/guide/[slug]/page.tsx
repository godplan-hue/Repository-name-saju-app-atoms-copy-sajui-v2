import type { Metadata } from "next";
import Link from "next/link";

type Entry = { slug: string; title: string; desc: string; h1: string; sub: string; emoji: string; };

const DATA: Entry[] = [
  { slug:"dwaeji-kkum", title:"돼지꿈 해몽 | 점운 꿈해몽", desc:"돼지꿈 해몽 — 돼지꿈은 재물·행운의 상징입니다. 꿈 속 상황에 따라 의미가 달라집니다.", h1:"돼지꿈 해몽 — 재물과 행운의 신호", sub:"돼지꿈이 의미하는 재물·사업·임신 운세 분석", emoji:"🐷" },
  { slug:"baem-kkum", title:"뱀꿈 해몽 | 점운 꿈해몽", desc:"뱀꿈 해몽 — 뱀꿈은 재물·지혜·위험의 복합 신호입니다. 뱀 색깔과 상황으로 의미가 달라집니다.", h1:"뱀꿈 해몽 — 재물·지혜의 복합 신호", sub:"뱀꿈 색깔·크기·상황별 해몽과 운세 의미", emoji:"🐍" },
  { slug:"yong-kkum", title:"용꿈 해몽 | 점운 꿈해몽", desc:"용꿈 해몽 — 용꿈은 크게 성공하는 대길몽입니다. 용의 색과 하늘·물 상황별 의미를 분석합니다.", h1:"용꿈 해몽 — 대성공의 대길몽", sub:"용 색깔·상황별 해몽과 성공·재물 운세", emoji:"🐉" },
  { slug:"mul-kkum", title:"물꿈 해몽 | 점운 꿈해몽", desc:"물꿈 해몽 — 맑은 물꿈은 좋은 소식, 흙탕물은 주의 신호입니다. 물 상태별 해몽을 확인하세요.", h1:"물꿈 해몽 — 맑은 물 vs 흙탕물의 차이", sub:"물꿈 상태·장소·상황별 해몽과 운세 분석", emoji:"💧" },
  { slug:"bul-kkum", title:"불꿈 해몽 | 점운 꿈해몽", desc:"불꿈 해몽 — 불꿈은 열정·에너지·변화의 신호입니다. 불 크기와 상황으로 의미가 달라집니다.", h1:"불꿈 해몽 — 열정과 변화의 에너지 신호", sub:"불꿈 크기·상황별 해몽과 성공·주의 운세", emoji:"🔥" },
  { slug:"ibbal-kkum", title:"이빨꿈 해몽 | 점운 꿈해몽", desc:"이빨꿈 해몽 — 이빨 빠지는 꿈은 가족·건강·변화의 신호입니다. 상황별 의미를 확인하세요.", h1:"이빨꿈 해몽 — 가족과 건강의 변화 신호", sub:"이빨 빠지는 꿈·이빨 꿈 상황별 해몽", emoji:"🦷" },
  { slug:"jukneun-kkum", title:"죽는꿈 해몽 | 점운 꿈해몽", desc:"죽는꿈 해몽 — 죽는 꿈은 나쁜 꿈이 아닙니다. 변화·재생·새 출발의 긍정적 신호일 수 있습니다.", h1:"죽는꿈 해몽 — 변화와 새 출발의 신호", sub:"죽는 꿈 상황별 해몽과 변화·재생 운세", emoji:"🌟" },
  { slug:"nala-kkum", title:"날아다니는꿈 해몽 | 점운 꿈해몽", desc:"날아다니는꿈 해몽 — 하늘을 나는 꿈은 자유·성공·상승 에너지의 신호입니다.", h1:"날아다니는꿈 해몽 — 자유와 성공의 상승 신호", sub:"날아다니는 꿈 높이·상황별 해몽 분석", emoji:"🦅" },
  { slug:"jjockyneun-kkum", title:"쫓기는꿈 해몽 | 점운 꿈해몽", desc:"쫓기는꿈 해몽 — 쫓기는 꿈은 스트레스·두려움·해결 과제의 신호입니다. 상황별 의미를 확인하세요.", h1:"쫓기는꿈 해몽 — 스트레스와 해결 과제의 신호", sub:"쫓기는 꿈 대상·상황별 해몽과 현실 의미", emoji:"🏃" },
  { slug:"mulgo-kkum", title:"물고기꿈 해몽 | 점운 꿈해몽", desc:"물고기꿈 해몽 — 물고기꿈은 재물·임신·새 기회의 신호입니다. 크기와 수에 따라 의미가 달라집니다.", h1:"물고기꿈 해몽 — 재물과 임신의 길몽", sub:"물고기 크기·수·상황별 해몽 분석", emoji:"🐟" },
  { slug:"taemong", title:"태몽 해몽 | 점운 꿈해몽", desc:"태몽 해몽 — 임신을 알리는 태몽의 의미를 분석합니다. 동물·식물·과일별 태몽 해몽을 확인하세요.", h1:"태몽 해몽 — 임신을 알리는 꿈의 의미", sub:"동물·식물·과일별 태몽 해몽과 아기 성별 예측", emoji:"🌙" },
  { slug:"aegi-kkum", title:"아기꿈 해몽 | 점운 꿈해몽", desc:"아기꿈 해몽 — 아기꿈은 새로운 시작·임신·기회의 신호입니다. 아기 상태별 의미를 분석합니다.", h1:"아기꿈 해몽 — 새로운 시작과 임신의 신호", sub:"아기꿈 상태·상황별 해몽과 길흉 분석", emoji:"👶" },
  { slug:"sae-kkum", title:"새꿈 해몽 | 점운 꿈해몽", desc:"새꿈 해몽 — 새 꿈은 자유·소식·날아오름의 신호입니다. 새 종류와 상황별 의미를 분석합니다.", h1:"새꿈 해몽 — 자유와 좋은 소식의 신호", sub:"새 종류·상황별 해몽과 운세 분석", emoji:"🐦" },
  { slug:"ho-kkum", title:"호랑이꿈 해몽 | 점운 꿈해몽", desc:"호랑이꿈 해몽 — 호랑이꿈은 강한 기운·성공·권위의 신호입니다. 상황별 의미를 확인하세요.", h1:"호랑이꿈 해몽 — 강한 기운과 성공의 신호", sub:"호랑이꿈 상황·행동별 해몽과 운세 분석", emoji:"🐯" },
  { slug:"gom-kkum", title:"곰꿈 해몽 | 점운 꿈해몽", desc:"곰꿈 해몽 — 곰꿈은 강인함·보호·귀인의 신호입니다. 곰 크기와 행동에 따라 의미가 달라집니다.", h1:"곰꿈 해몽 — 강인함과 보호의 신호", sub:"곰꿈 크기·행동·색별 해몽 분석", emoji:"🐻" },
  { slug:"sonyeo-kkum", title:"소꿈 해몽 | 점운 꿈해몽", desc:"소꿈 해몽 — 소꿈은 재물·노력·풍요의 신호입니다. 소의 행동과 색에 따라 의미가 달라집니다.", h1:"소꿈 해몽 — 재물과 풍요의 신호", sub:"소꿈 색·행동별 해몽과 재물 운세 분석", emoji:"🐄" },
  { slug:"dog-kkum", title:"개꿈 해몽 | 점운 꿈해몽", desc:"개꿈 해몽 — 개꿈은 충성·친구·위험 경고의 신호입니다. 상황과 행동에 따라 의미가 달라집니다.", h1:"개꿈 해몽 — 충성과 위험 경고의 신호", sub:"개꿈 상황·행동별 해몽과 길흉 분석", emoji:"🐕" },
  { slug:"goyangyi-kkum", title:"고양이꿈 해몽 | 점운 꿈해몽", desc:"고양이꿈 해몽 — 고양이꿈은 직관·신비·경계의 신호입니다. 고양이 색과 행동별 의미를 분석합니다.", h1:"고양이꿈 해몽 — 직관과 신비의 신호", sub:"고양이꿈 색·행동별 해몽과 운세 분석", emoji:"🐱" },
  { slug:"mal-kkum", title:"말꿈 해몽 | 점운 꿈해몽", desc:"말꿈 해몽 — 말꿈은 성공·도약·여행의 신호입니다. 말의 색과 달리는 방향으로 의미가 달라집니다.", h1:"말꿈 해몽 — 성공과 도약의 신호", sub:"말꿈 색·방향·상황별 해몽 분석", emoji:"🐎" },
  { slug:"gorila-kkum", title:"원숭이꿈 해몽 | 점운 꿈해몽", desc:"원숭이꿈 해몽 — 원숭이꿈은 재주·변화·장난의 신호입니다. 상황에 따라 길흉이 달라집니다.", h1:"원숭이꿈 해몽 — 재주와 변화의 신호", sub:"원숭이꿈 상황별 해몽과 길흉 분석", emoji:"🐒" },
  { slug:"haemong-free", title:"무료 꿈해몽 | 점운 꿈해몽", desc:"무료 꿈해몽 — 오늘 꾼 꿈을 무료로 해석해드려요. 100가지 꿈 카테고리 즉시 해몽 가능합니다.", h1:"무료 꿈해몽 — 오늘 꿈을 즉시 해석해드려요", sub:"100가지 꿈 카테고리 무료 해몽 서비스", emoji:"🔮" },
  { slug:"ijeongsaengsong-kkum", title:"전생꿈 해몽 | 점운 꿈해몽", desc:"전생을 꿈에서 보는 해몽 — 전생 꿈은 과거의 인연·업(業)·현재 과제의 신호입니다.", h1:"전생꿈 해몽 — 과거의 인연과 업의 신호", sub:"전생 꿈 상황별 해몽과 현실 의미 분석", emoji:"⏳" },
  { slug:"gochimsil-kkum", title:"공중화장실꿈 해몽 | 점운 꿈해몽", desc:"공중화장실꿈 해몽 — 화장실 꿈은 재물·스트레스 해소·변화의 신호입니다.", h1:"화장실꿈 해몽 — 재물과 스트레스 해소 신호", sub:"화장실꿈 상황별 해몽과 재물 운세 분석", emoji:"🚽" },
  { slug:"byeolleteo-kkum", title:"번개꿈 해몽 | 점운 꿈해몽", desc:"번개꿈 해몽 — 번개꿈은 갑작스러운 변화·깨달음·에너지의 신호입니다.", h1:"번개꿈 해몽 — 갑작스러운 변화와 깨달음 신호", sub:"번개꿈 상황별 해몽과 변화 운세 분석", emoji:"⚡" },
  { slug:"nun-kkum", title:"눈꿈 해몽 | 점운 꿈해몽", desc:"눈(雪)꿈 해몽 — 눈꿈은 순수함·정화·새 시작의 신호입니다. 눈의 양과 상황별 의미를 확인하세요.", h1:"눈꿈 해몽 — 순수함과 새 시작의 신호", sub:"눈꿈 양·상황별 해몽과 변화 운세 분석", emoji:"❄️" },
  { slug:"bi-kkum", title:"비꿈 해몽 | 점운 꿈해몽", desc:"비꿈 해몽 — 비꿈은 감정 정화·슬픔·풍요의 신호입니다. 비의 세기와 상황별 의미를 분석합니다.", h1:"비꿈 해몽 — 감정 정화와 풍요의 신호", sub:"비꿈 세기·상황별 해몽과 감정 운세 분석", emoji:"🌧️" },
  { slug:"haetbit-kkum", title:"햇빛꿈 해몽 | 점운 꿈해몽", desc:"햇빛꿈 해몽 — 밝은 햇빛 꿈은 성공·건강·긍정 에너지의 대길몽입니다.", h1:"햇빛꿈 해몽 — 성공과 긍정 에너지의 대길몽", sub:"햇빛꿈 상황별 해몽과 성공 운세 분석", emoji:"☀️" },
  { slug:"dal-kkum", title:"달꿈 해몽 | 점운 꿈해몽", desc:"달꿈 해몽 — 달꿈은 여성성·직관·감수성·임신의 신호입니다. 달 모양에 따라 의미가 달라집니다.", h1:"달꿈 해몽 — 여성성과 직관의 신호", sub:"달꿈 모양·상황별 해몽과 운세 분석", emoji:"🌙" },
  { slug:"byeol-kkum", title:"별꿈 해몽 | 점운 꿈해몽", desc:"별꿈 해몽 — 별꿈은 희망·소망·성취의 신호입니다. 별 수와 밝기에 따라 의미가 달라집니다.", h1:"별꿈 해몽 — 희망과 소망 성취의 신호", sub:"별꿈 수·밝기·상황별 해몽과 운세 분석", emoji:"⭐" },
  { slug:"hyogeum-kkum", title:"황금꿈 해몽 | 점운 꿈해몽", desc:"황금꿈 해몽 — 황금 꿈은 재물·성공·행운의 최고 길몽입니다. 황금 상황별 의미를 확인하세요.", h1:"황금꿈 해몽 — 재물과 성공의 최고 길몽", sub:"황금꿈 상황별 해몽과 재물 운세 분석", emoji:"💰" },
  { slug:"donnyeo-kkum", title:"돈꿈 해몽 | 점운 꿈해몽", desc:"돈꿈 해몽 — 돈 꿈은 재물 에너지의 신호입니다. 돈을 줍거나 잃거나 받는 상황별 의미를 분석합니다.", h1:"돈꿈 해몽 — 재물 에너지의 신호", sub:"돈꿈 상황(줍기·잃기·받기)별 해몽과 재물 운세", emoji:"💵" },
  { slug:"gyedan-kkum", title:"계단꿈 해몽 | 점운 꿈해몽", desc:"계단꿈 해몽 — 계단 꿈은 성장·진급·도전의 신호입니다. 올라가는 꿈과 내려오는 꿈은 의미가 다릅니다.", h1:"계단꿈 해몽 — 성장과 진급의 신호", sub:"계단꿈 방향·상황별 해몽과 운세 분석", emoji:"🪜" },
  { slug:"daridaree-kkum", title:"다리꿈 해몽 | 점운 꿈해몽", desc:"다리(橋)꿈 해몽 — 다리 꿈은 연결·전환·기회의 신호입니다. 다리 상태별 의미를 분석합니다.", h1:"다리꿈 해몽 — 연결과 기회의 신호", sub:"다리꿈 상태·상황별 해몽과 운세 분석", emoji:"🌉" },
  { slug:"jip-kkum", title:"집꿈 해몽 | 점운 꿈해몽", desc:"집꿈 해몽 — 집 꿈은 안정·자아·가족의 신호입니다. 집 상태와 상황에 따라 의미가 달라집니다.", h1:"집꿈 해몽 — 안정과 자아의 신호", sub:"집꿈 상태·상황별 해몽과 운세 분석", emoji:"🏠" },
  { slug:"hakgyo-kkum", title:"학교꿈 해몽 | 점운 꿈해몽", desc:"학교꿈 해몽 — 학교 꿈은 성장·배움·과거 인연의 신호입니다. 시험·교실·선생님별 의미를 분석합니다.", h1:"학교꿈 해몽 — 성장과 배움의 신호", sub:"학교꿈 상황별 해몽과 운세 분석", emoji:"🏫" },
  { slug:"shihyeom-kkum", title:"시험꿈 해몽 | 점운 꿈해몽", desc:"시험꿈 해몽 — 시험 꿈은 긴장·준비·도전의 신호입니다. 합격·불합격 상황별 의미를 확인하세요.", h1:"시험꿈 해몽 — 긴장과 도전의 신호", sub:"시험꿈 결과·상황별 해몽과 현실 의미 분석", emoji:"📝" },
  { slug:"bieohagi-kkum", title:"비행기꿈 해몽 | 점운 꿈해몽", desc:"비행기꿈 해몽 — 비행기 꿈은 도약·여행·성공의 신호입니다. 이착륙·추락 상황별 의미를 분석합니다.", h1:"비행기꿈 해몽 — 도약과 성공의 신호", sub:"비행기꿈 상황별 해몽과 운세 분석", emoji:"✈️" },
  { slug:"baeteum-kkum", title:"배꿈 해몽 | 점운 꿈해몽", desc:"배(船)꿈 해몽 — 배 꿈은 인생 항해·기회·안정의 신호입니다. 바다 상태별 의미가 달라집니다.", h1:"배꿈 해몽 — 인생 항해와 기회의 신호", sub:"배꿈 바다 상태·방향별 해몽 분석", emoji:"🚢" },
  { slug:"sanso-kkum", title:"산꿈 해몽 | 점운 꿈해몽", desc:"산꿈 해몽 — 산 꿈은 목표·도전·성취의 신호입니다. 산 높이와 오르내리는 상황별 의미를 분석합니다.", h1:"산꿈 해몽 — 목표와 성취의 신호", sub:"산꿈 높이·상황별 해몽과 운세 분석", emoji:"⛰️" },
  { slug:"gangnyeo-kkum", title:"강꿈 해몽 | 점운 꿈해몽", desc:"강꿈 해몽 — 강 꿈은 흐름·변화·감정의 신호입니다. 강물 상태와 건너는 상황별 의미를 분석합니다.", h1:"강꿈 해몽 — 흐름과 변화의 신호", sub:"강꿈 상태·상황별 해몽과 감정 운세 분석", emoji:"🌊" },
  { slug:"bada-kkum", title:"바다꿈 해몽 | 점운 꿈해몽", desc:"바다꿈 해몽 — 바다 꿈은 무한한 가능성·감정·자유의 신호입니다. 바다 상태별 의미를 분석합니다.", h1:"바다꿈 해몽 — 무한한 가능성과 자유의 신호", sub:"바다꿈 상태·상황별 해몽과 운세 분석", emoji:"🌊" },
  { slug:"gae-kkum", title:"개구리꿈 해몽 | 점운 꿈해몽", desc:"개구리꿈 해몽 — 개구리꿈은 변화·도약·풍요의 신호입니다. 개구리 수와 상황별 의미를 분석합니다.", h1:"개구리꿈 해몽 — 변화와 도약의 신호", sub:"개구리꿈 수·상황별 해몽과 운세 분석", emoji:"🐸" },
  { slug:"geosbul-kkum", title:"거북이꿈 해몽 | 점운 꿈해몽", desc:"거북이꿈 해몽 — 거북이꿈은 장수·안정·귀인의 대길몽입니다. 상황별 의미를 확인하세요.", h1:"거북이꿈 해몽 — 장수와 안정의 대길몽", sub:"거북이꿈 상황별 해몽과 길흉 분석", emoji:"🐢" },
  { slug:"juja-kkum", title:"주사꿈 해몽 | 점운 꿈해몽", desc:"주사꿈 해몽 — 주사 맞는 꿈은 치료·변화·외부 자극의 신호입니다. 상황별 의미를 분석합니다.", h1:"주사꿈 해몽 — 치료와 변화의 신호", sub:"주사꿈 상황별 해몽과 건강 운세 분석", emoji:"💉" },
  { slug:"piyo-kkum", title:"피꿈 해몽 | 점운 꿈해몽", desc:"피꿈 해몽 — 피 꿈은 재물·에너지·감정의 신호입니다. 피 색깔과 상황에 따라 의미가 달라집니다.", h1:"피꿈 해몽 — 재물과 에너지의 신호", sub:"피꿈 색·상황별 해몽과 재물 운세 분석", emoji:"🩸" },
  { slug:"ingeum-kkum", title:"임신꿈 해몽 | 점운 꿈해몽", desc:"임신꿈 해몽 — 임신 꿈은 새로운 프로젝트·시작·창조의 신호입니다. 본인이나 타인의 임신 꿈도 분석합니다.", h1:"임신꿈 해몽 — 새로운 시작과 창조의 신호", sub:"임신꿈 상황별 해몽과 새 시작 운세 분석", emoji:"🌱" },
  { slug:"sago-kkum", title:"사고꿈 해몽 | 점운 꿈해몽", desc:"사고꿈 해몽 — 사고 꿈은 경고·주의·변화의 신호입니다. 꿈 속 사고 상황별 현실 의미를 분석합니다.", h1:"사고꿈 해몽 — 경고와 주의의 신호", sub:"사고꿈 상황별 해몽과 현실 주의 사항 분석", emoji:"⚠️" },
  { slug:"gyeol-kkum", title:"결혼꿈 해몽 | 점운 꿈해몽", desc:"결혼꿈 해몽 — 결혼 꿈은 인연·결합·새 출발의 신호입니다. 상황별 해몽과 연애 운세를 분석합니다.", h1:"결혼꿈 해몽 — 인연과 새 출발의 신호", sub:"결혼꿈 상황별 해몽과 연애·결혼 운세 분석", emoji:"💍" },
  { slug:"ireohon-kkum", title:"이혼꿈 해몽 | 점운 꿈해몽", desc:"이혼꿈 해몽 — 이혼 꿈은 분리·자유·변화의 신호입니다. 반드시 나쁜 꿈이 아닐 수 있습니다.", h1:"이혼꿈 해몽 — 분리와 변화의 신호", sub:"이혼꿈 상황별 해몽과 관계 변화 운세 분석", emoji:"💔" },
  { slug:"gwe-kkum", title:"귀신꿈 해몽 | 점운 꿈해몽", desc:"귀신꿈 해몽 — 귀신 꿈은 두려움·경고·과거 인연의 신호입니다. 귀신 종류와 상황별 의미를 분석합니다.", h1:"귀신꿈 해몽 — 두려움과 경고의 신호", sub:"귀신꿈 종류·상황별 해몽과 현실 의미 분석", emoji:"👻" },
  { slug:"obi-kkum", title:"외계인꿈 해몽 | 점운 꿈해몽", desc:"외계인꿈 해몽 — 외계인 꿈은 미지의 가능성·새로운 관점·변화의 신호입니다.", h1:"외계인꿈 해몽 — 미지의 가능성과 변화 신호", sub:"외계인꿈 상황별 해몽과 운세 분석", emoji:"👽" },
  { slug:"sinseon-kkum", title:"신선꿈 해몽 | 점운 꿈해몽", desc:"신선꿈 해몽 — 신선 꿈은 큰 행운·귀인·깨달음의 대길몽입니다. 상황별 의미를 확인하세요.", h1:"신선꿈 해몽 — 큰 행운과 귀인의 대길몽", sub:"신선꿈 상황별 해몽과 행운 운세 분석", emoji:"✨" },
  { slug:"bumonim-kkum", title:"부모님꿈 해몽 | 점운 꿈해몽", desc:"부모님꿈 해몽 — 부모님 꿈은 근심·건강·인연의 신호입니다. 살아계신 분·돌아가신 분별 의미가 다릅니다.", h1:"부모님꿈 해몽 — 근심과 인연의 신호", sub:"부모님꿈 상황·생사별 해몽과 운세 분석", emoji:"👨‍👩‍👧" },
  { slug:"chingu-kkum", title:"친구꿈 해몽 | 점운 꿈해몽", desc:"친구꿈 해몽 — 친구 꿈은 인간관계·도움·경쟁의 신호입니다. 친구와의 상황별 의미를 분석합니다.", h1:"친구꿈 해몽 — 인간관계와 도움의 신호", sub:"친구꿈 상황별 해몽과 인간관계 운세 분석", emoji:"👫" },
  { slug:"yeonin-kkum", title:"연인꿈 해몽 | 점운 꿈해몽", desc:"연인꿈 해몽 — 연인 꿈은 감정·연애·그리움의 신호입니다. 만남·이별·다툼 상황별 의미를 분석합니다.", h1:"연인꿈 해몽 — 감정과 연애의 신호", sub:"연인꿈 상황별 해몽과 연애 운세 분석", emoji:"💑" },
  { slug:"jeonggwan-kkum", title:"전 애인꿈 해몽 | 점운 꿈해몽", desc:"전 애인꿈 해몽 — 전 애인 꿈은 미련·교훈·재회의 신호입니다. 상황별 의미를 분석합니다.", h1:"전 애인꿈 해몽 — 미련과 재회의 신호", sub:"전 애인꿈 상황별 해몽과 재회 운세 분석", emoji:"🔁" },
  { slug:"yumyeongin-kkum", title:"유명인꿈 해몽 | 점운 꿈해몽", desc:"유명인꿈 해몽 — 연예인·정치인·역사 인물 꿈은 동일시·욕망·목표의 신호입니다.", h1:"유명인꿈 해몽 — 동일시와 목표의 신호", sub:"유명인꿈 상황별 해몽과 운세 분석", emoji:"⭐" },
  { slug:"sinjik-kkum", title:"직장꿈 해몽 | 점운 꿈해몽", desc:"직장꿈 해몽 — 직장 꿈은 커리어·스트레스·성취의 신호입니다. 상황별 의미를 분석합니다.", h1:"직장꿈 해몽 — 커리어와 스트레스의 신호", sub:"직장꿈 상황별 해몽과 직업 운세 분석", emoji:"🏢" },
  { slug:"haegobae-kkum", title:"해고꿈 해몽 | 점운 꿈해몽", desc:"해고꿈 해몽 — 해고 꿈은 변화·전환·새 기회의 신호입니다. 반드시 나쁜 꿈이 아닙니다.", h1:"해고꿈 해몽 — 변화와 새 기회의 신호", sub:"해고꿈 상황별 해몽과 직업 변화 운세 분석", emoji:"🔄" },
  { slug:"isamul-kkum", title:"이사꿈 해몽 | 점운 꿈해몽", desc:"이사꿈 해몽 — 이사 꿈은 변화·새 시작·전환의 신호입니다. 이사 상황별 의미를 분석합니다.", h1:"이사꿈 해몽 — 변화와 새 시작의 신호", sub:"이사꿈 상황별 해몽과 변화 운세 분석", emoji:"📦" },
  { slug:"eumsikyeo-kkum", title:"음식꿈 해몽 | 점운 꿈해몽", desc:"음식꿈 해몽 — 음식 꿈은 풍요·욕구·충족의 신호입니다. 음식 종류와 상황별 의미를 분석합니다.", h1:"음식꿈 해몽 — 풍요와 욕구 충족의 신호", sub:"음식꿈 종류·상황별 해몽과 운세 분석", emoji:"🍱" },
  { slug:"gwanil-kkum", title:"과일꿈 해몽 | 점운 꿈해몽", desc:"과일꿈 해몽 — 과일 꿈은 결실·풍요·임신의 신호입니다. 과일 종류와 익음에 따라 의미가 달라집니다.", h1:"과일꿈 해몽 — 결실과 풍요의 신호", sub:"과일꿈 종류·익음별 해몽과 운세 분석", emoji:"🍎" },
  { slug:"meokneun-kkum", title:"먹는꿈 해몽 | 점운 꿈해몽", desc:"먹는꿈 해몽 — 음식 먹는 꿈은 에너지 충전·풍요·욕구 충족의 신호입니다.", h1:"먹는꿈 해몽 — 에너지 충전과 풍요 신호", sub:"먹는꿈 음식 종류·상황별 해몽 분석", emoji:"🍽️" },
  { slug:"eomma-kkum", title:"엄마꿈 해몽 | 점운 꿈해몽", desc:"엄마꿈 해몽 — 엄마 꿈은 안정·그리움·근심의 신호입니다. 살아계신 분·돌아가신 분별 의미가 다릅니다.", h1:"엄마꿈 해몽 — 안정과 근심의 신호", sub:"엄마꿈 상황·생사별 해몽과 운세 분석", emoji:"👩" },
  { slug:"appa-kkum", title:"아빠꿈 해몽 | 점운 꿈해몽", desc:"아빠꿈 해몽 — 아빠 꿈은 권위·보호·과제의 신호입니다. 상황별 의미를 분석합니다.", h1:"아빠꿈 해몽 — 권위와 보호의 신호", sub:"아빠꿈 상황별 해몽과 운세 분석", emoji:"👨" },
  { slug:"halmeoni-kkum", title:"할머니꿈 해몽 | 점운 꿈해몽", desc:"할머니꿈 해몽 — 할머니 꿈은 지혜·행운·귀인의 신호입니다. 돌아가신 할머니 꿈도 길몽일 수 있습니다.", h1:"할머니꿈 해몽 — 지혜와 행운의 신호", sub:"할머니꿈 상황별 해몽과 행운 운세 분석", emoji:"👵" },
  { slug:"aideul-kkum", title:"아이꿈 해몽 | 점운 꿈해몽", desc:"아이꿈 해몽 — 아이 꿈은 순수함·새 시작·미래의 신호입니다. 아이와의 상황별 의미를 분석합니다.", h1:"아이꿈 해몽 — 순수함과 미래의 신호", sub:"아이꿈 상황별 해몽과 운세 분석", emoji:"🧒" },
  { slug:"namu-kkum", title:"나무꿈 해몽 | 점운 꿈해몽", desc:"나무꿈 해몽 — 나무 꿈은 성장·안정·자아의 신호입니다. 나무 크기와 상태에 따라 의미가 달라집니다.", h1:"나무꿈 해몽 — 성장과 안정의 신호", sub:"나무꿈 크기·상태별 해몽과 운세 분석", emoji:"🌳" },
  { slug:"kkot-kkum", title:"꽃꿈 해몽 | 점운 꿈해몽", desc:"꽃꿈 해몽 — 꽃 꿈은 사랑·아름다움·축복의 신호입니다. 꽃 색깔과 종류별 의미를 분석합니다.", h1:"꽃꿈 해몽 — 사랑과 축복의 신호", sub:"꽃꿈 색깔·종류별 해몽과 연애 운세 분석", emoji:"🌸" },
  { slug:"pado-kkum", title:"파도꿈 해몽 | 점운 꿈해몽", desc:"파도꿈 해몽 — 파도 꿈은 감정 변화·위기·에너지의 신호입니다. 파도 크기별 의미를 분석합니다.", h1:"파도꿈 해몽 — 감정 변화와 에너지 신호", sub:"파도꿈 크기·상황별 해몽과 감정 운세 분석", emoji:"🌊" },
  { slug:"sinjung-kkum", title:"신중한꿈 해몽 | 점운 꿈해몽", desc:"신과 관련된 꿈 해몽 — 신·부처·하느님 꿈은 큰 행운·축복·보호의 대길몽입니다.", h1:"신 관련 꿈 해몽 — 큰 행운과 축복의 대길몽", sub:"신·부처·하느님 꿈 상황별 해몽과 운세 분석", emoji:"🙏" },
  { slug:"beom-kkum", title:"범(호랑이)꿈 해몽 | 점운 꿈해몽", desc:"범꿈 해몽 — 호랑이(범) 꿈은 강한 에너지·성공·권위의 신호입니다. 색깔과 행동별 의미를 분석합니다.", h1:"범꿈 해몽 — 강한 에너지와 권위의 신호", sub:"범꿈 색·행동별 해몽과 성공 운세 분석", emoji:"🐅" },
  { slug:"muneoyi-kkum", title:"문어꿈 해몽 | 점운 꿈해몽", desc:"문어꿈 해몽 — 문어 꿈은 복잡한 인간관계·능력·재물의 신호입니다.", h1:"문어꿈 해몽 — 능력과 재물의 신호", sub:"문어꿈 상황별 해몽과 운세 분석", emoji:"🐙" },
  { slug:"gaemi-kkum", title:"개미꿈 해몽 | 점운 꿈해몽", desc:"개미꿈 해몽 — 개미 꿈은 근면·협동·재물의 신호입니다. 개미 수와 상황별 의미를 분석합니다.", h1:"개미꿈 해몽 — 근면과 재물의 신호", sub:"개미꿈 수·상황별 해몽과 재물 운세 분석", emoji:"🐜" },
  { slug:"nabi-kkum", title:"나비꿈 해몽 | 점운 꿈해몽", desc:"나비꿈 해몽 — 나비 꿈은 변화·아름다움·행운의 신호입니다. 색깔과 수에 따라 의미가 달라집니다.", h1:"나비꿈 해몽 — 변화와 행운의 신호", sub:"나비꿈 색·수별 해몽과 운세 분석", emoji:"🦋" },
  { slug:"jigiram-kkum", title:"지렁이꿈 해몽 | 점운 꿈해몽", desc:"지렁이꿈 해몽 — 지렁이 꿈은 재물·정보·기회의 신호입니다. 상황에 따라 의미가 달라집니다.", h1:"지렁이꿈 해몽 — 재물과 기회의 신호", sub:"지렁이꿈 상황별 해몽과 재물 운세 분석", emoji:"🪱" },
  { slug:"geotda-kkum", title:"걸어가는꿈 해몽 | 점운 꿈해몽", desc:"걸어가는꿈 해몽 — 걷는 꿈은 방향·목표·현실 점검의 신호입니다. 방향과 길 상태별 의미를 분석합니다.", h1:"걷는꿈 해몽 — 방향과 목표의 신호", sub:"걷는꿈 방향·길 상태별 해몽과 운세 분석", emoji:"🚶" },
  { slug:"dalri-kkum", title:"달리는꿈 해몽 | 점운 꿈해몽", desc:"달리는꿈 해몽 — 달리는 꿈은 에너지·도전·도망의 신호입니다. 빠르기와 방향별 의미를 분석합니다.", h1:"달리는꿈 해몽 — 에너지와 도전의 신호", sub:"달리는꿈 속도·방향별 해몽과 운세 분석", emoji:"🏃" },
  { slug:"ssauneun-kkum", title:"싸우는꿈 해몽 | 점운 꿈해몽", desc:"싸우는꿈 해몽 — 싸우는 꿈은 갈등·에너지 발산·승리의 신호입니다. 상대와 결과별 의미를 분석합니다.", h1:"싸우는꿈 해몽 — 갈등과 에너지의 신호", sub:"싸우는꿈 상대·결과별 해몽과 운세 분석", emoji:"⚔️" },
  { slug:"ulneun-kkum", title:"우는꿈 해몽 | 점운 꿈해몽", desc:"우는꿈 해몽 — 우는 꿈은 감정 해소·변화·슬픔의 신호입니다. 꿈에서 우는 것은 좋은 신호일 수 있습니다.", h1:"우는꿈 해몽 — 감정 해소와 변화의 신호", sub:"우는꿈 상황별 해몽과 감정 운세 분석", emoji:"😭" },
  { slug:"otneun-kkum", title:"웃는꿈 해몽 | 점운 꿈해몽", desc:"웃는꿈 해몽 — 웃는 꿈은 기쁨·행운·좋은 관계의 신호입니다. 함께 웃는 사람별 의미를 분석합니다.", h1:"웃는꿈 해몽 — 기쁨과 행운의 신호", sub:"웃는꿈 상황별 해몽과 행운 운세 분석", emoji:"😄" },
  { slug:"gibneun-kkum", title:"기쁜꿈 해몽 | 점운 꿈해몽", desc:"기쁜꿈 해몽 — 기쁨을 느끼는 꿈은 좋은 에너지·행운·긍정의 신호입니다.", h1:"기쁜꿈 해몽 — 좋은 에너지와 행운 신호", sub:"기쁜꿈 상황별 해몽과 운세 분석", emoji:"🌟" },
  { slug:"miso-kkum", title:"미소꿈 해몽 | 점운 꿈해몽", desc:"미소 짓는꿈 해몽 — 미소 짓는 꿈은 평화·만족·좋은 인연의 신호입니다.", h1:"미소꿈 해몽 — 평화와 좋은 인연의 신호", sub:"미소꿈 상황별 해몽과 인연 운세 분석", emoji:"😊" },
  { slug:"jamsuri-kkum", title:"잠수리꿈 해몽 | 점운 꿈해몽", desc:"잠자리꿈 해몽 — 잠자리 꿈은 좋은 소식·기쁨·변화의 신호입니다.", h1:"잠자리꿈 해몽 — 좋은 소식과 변화 신호", sub:"잠자리꿈 상황별 해몽과 운세 분석", emoji:"🦗" },
  { slug:"bihaenggeon-kkum", title:"비행선꿈 해몽 | 점운 꿈해몽", desc:"우주·로켓 꿈 해몽 — 우주·로켓 꿈은 원대한 꿈·성공·혁신의 신호입니다.", h1:"우주·로켓꿈 해몽 — 원대한 꿈과 성공 신호", sub:"우주·로켓꿈 상황별 해몽과 성공 운세 분석", emoji:"🚀" },
  { slug:"haemong-interpretation", title:"꿈해몽 해석 방법 | 점운 꿈해몽", desc:"꿈해몽을 제대로 해석하는 방법 — 꿈의 감정·색깔·반복 여부로 의미를 더 정확하게 파악하는 법을 안내합니다.", h1:"꿈해몽 해석 방법 — 꿈을 정확히 읽는 법", sub:"꿈의 감정·색깔·반복 여부로 의미 파악하기", emoji:"📖" },
  { slug:"gilmong", title:"길몽 해몽 | 점운 꿈해몽", desc:"길몽 해몽 — 대표적인 길몽 50가지의 의미를 확인하세요. 재물·사랑·건강·성공 길몽 모음.", h1:"길몽 해몽 — 대표 길몽 50가지 의미 모음", sub:"재물·사랑·건강·성공 길몽 해몽 완전 가이드", emoji:"✨" },
  { slug:"hyungmong", title:"흉몽 해몽 | 점운 꿈해몽", desc:"흉몽 해몽 — 흉몽이라고 다 나쁜 건 아닙니다. 흉몽별 실제 의미와 대처법을 안내합니다.", h1:"흉몽 해몽 — 흉몽도 의미가 있습니다", sub:"대표 흉몽별 실제 의미와 대처법 안내", emoji:"🌑" },
  { slug:"banbok-kkum", title:"반복되는꿈 해몽 | 점운 꿈해몽", desc:"반복되는꿈 해몽 — 같은 꿈을 반복적으로 꾸는 것은 강한 메시지의 신호입니다. 의미를 분석합니다.", h1:"반복되는꿈 해몽 — 강한 메시지의 신호", sub:"반복 꿈의 유형별 해몽과 현실 메시지 분석", emoji:"🔄" },
  { slug:"saengsaeng-kkum", title:"생생한꿈 해몽 | 점운 꿈해몽", desc:"생생한 꿈 해몽 — 매우 생생하게 기억되는 꿈은 강한 에너지·예지몽의 신호일 수 있습니다.", h1:"생생한꿈 해몽 — 강한 에너지와 예지몽 신호", sub:"생생한 꿈 유형별 해몽과 예지몽 분석", emoji:"⚡" },
  { slug:"achim-kkum", title:"아침꿈 해몽 | 점운 꿈해몽", desc:"아침꿈 해몽 — 새벽 5-7시에 꾸는 꿈은 예지몽 가능성이 높습니다. 아침꿈 의미를 분석합니다.", h1:"아침꿈 해몽 — 예지몽 가능성이 높은 새벽 꿈", sub:"아침·새벽 꿈 유형별 해몽과 예지 분석", emoji:"🌅" },
  { slug:"kkum-yeonae", title:"꿈 연애운 | 점운 꿈해몽", desc:"꿈으로 보는 연애운 — 꿈에서 연애·사랑 신호를 찾으세요. 연애 관련 꿈 해몽 모음.", h1:"꿈 연애운 해몽 — 꿈에서 찾는 사랑의 신호", sub:"연애·사랑 관련 꿈 유형별 해몽 완전 가이드", emoji:"💕" },
  { slug:"kkum-jaemul", title:"꿈 재물운 | 점운 꿈해몽", desc:"꿈으로 보는 재물운 — 돈·황금·복권·사업 관련 꿈이 재물을 암시합니다. 재물 꿈 해몽 모음.", h1:"꿈 재물운 해몽 — 꿈에서 찾는 재물 신호", sub:"돈·황금·사업 관련 꿈 해몽 완전 가이드", emoji:"💰" },
  { slug:"kkum-geongang", title:"꿈 건강운 | 점운 꿈해몽", desc:"꿈으로 보는 건강운 — 신체·병원·치료 관련 꿈이 건강을 암시합니다. 건강 꿈 해몽 모음.", h1:"꿈 건강운 해몽 — 꿈에서 찾는 건강 신호", sub:"신체·병원·치료 관련 꿈 해몽 완전 가이드", emoji:"❤️" },
  { slug:"taemong-aegi", title:"태몽 아기 성별 | 점운 꿈해몽", desc:"태몽으로 보는 아기 성별 — 태몽 종류별 아기 성별 예측 정보를 확인하세요.", h1:"태몽 아기 성별 — 태몽으로 보는 아들·딸 예측", sub:"태몽 유형별 아기 성별 예측 정보 모음", emoji:"👶" },
  { slug:"bam-kkum", title:"밤에 꾸는꿈 해몽 | 점운 꿈해몽", desc:"밤에 꾸는꿈 해몽 — 깊은 밤 자정 전후 꿈은 무의식·본능의 강한 신호입니다.", h1:"밤꿈 해몽 — 무의식과 본능의 신호", sub:"밤 시간대별 꿈 해몽과 무의식 신호 분석", emoji:"🌙" },
  { slug:"kkum-ilgi", title:"꿈일기 쓰기 | 점운 꿈해몽", desc:"꿈일기 쓰는 법 — 꿈을 기억하고 해석하려면 꿈일기가 필수입니다. 효과적인 꿈일기 방법을 안내합니다.", h1:"꿈일기 쓰기 — 꿈을 기억하고 해석하는 법", sub:"꿈일기 작성법과 꿈 기억력 향상 방법 안내", emoji:"📔" },
  { slug:"haemong-app", title:"꿈해몽 앱 | 점운 꿈해몽", desc:"무료 꿈해몽 앱 — 오늘 꾼 꿈을 앱에서 즉시 해몽하세요. 100가지 꿈 카테고리 무료 해석.", h1:"꿈해몽 앱 — 오늘 꿈을 앱에서 즉시 해석", sub:"100가지 꿈 카테고리 무료 해몽 앱 서비스", emoji:"📱" },
  { slug:"kkum-ohaeng", title:"꿈 오행 해석 | 점운 꿈해몽", desc:"오행으로 꿈을 해석하는 법 — 목·화·토·금·수 오행 에너지로 꿈의 의미를 더 깊이 이해하세요.", h1:"꿈 오행 해석 — 오행으로 꿈의 깊은 의미를", sub:"목·화·토·금·수 오행으로 꿈 해석하는 방법", emoji:"☯️" },
  { slug:"saju-kkum", title:"사주 꿈해몽 | 점운 꿈해몽", desc:"사주와 꿈을 함께 해석하는 법 — 내 사주 오행 기질과 꿈을 결합해 더 정확한 운세를 확인하세요.", h1:"사주 꿈해몽 — 사주와 꿈을 함께 해석하기", sub:"사주 오행 기질과 꿈 해몽을 결합한 운세 분석", emoji:"🔮" },
  { slug:"kkum-haemong-2026", title:"2026년 꿈해몽 | 점운 꿈해몽", desc:"2026년 꿈해몽 — 올해의 에너지와 꿈 해몽을 결합해 2026년 운세를 분석합니다.", h1:"2026년 꿈해몽 — 올해 꿈이 말하는 운세", sub:"2026년 오행 에너지와 꿈 해몽 연결 분석", emoji:"📅" },
  { slug:"geumgo-kkum", title:"금고꿈 해몽 | 점운 꿈해몽", desc:"금고꿈 해몽 — 금고 꿈은 재물·비밀·안전의 신호입니다. 열린 금고와 닫힌 금고의 의미가 다릅니다.", h1:"금고꿈 해몽 — 재물과 비밀의 신호", sub:"금고꿈 상황별 해몽과 재물 운세 분석", emoji:"🔒" },
  { slug:"bokgwon-kkum", title:"복권꿈 해몽 | 점운 꿈해몽", desc:"복권꿈 해몽 — 복권 꿈은 갑작스러운 행운·재물·변화의 신호입니다. 상황별 의미를 분석합니다.", h1:"복권꿈 해몽 — 갑작스러운 행운의 신호", sub:"복권꿈 상황별 해몽과 재물 운세 분석", emoji:"🎰" },
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
    keywords: ["꿈해몽", "무료꿈해몽", "꿈풀이", "태몽해몽", "길몽흉몽", "점운꿈해몽"],
    openGraph: { title: d.title, description: d.desc, url: `https://jeomun.com/haemong/guide/${d.slug}` },
  };
}

export default async function HaemongSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];

  const features = [
    { icon: "🌙", title: "100가지 꿈 카테고리", desc: "동물·자연·사람·상황별 100가지 꿈 카테고리를 즉시 무료로 해몽합니다." },
    { icon: "🔮", title: "오행 기반 해석", desc: "목·화·토·금·수 오행 에너지로 꿈의 의미를 더 깊게 해석합니다." },
    { icon: "🌟", title: "태몽 전문 해몽", desc: "임신·태몽 관련 꿈을 전문적으로 해몽하고 아기의 기질을 미리 확인합니다." },
    { icon: "💕", title: "사주 연동 분석", desc: "내 사주 오행과 꿈을 결합해 연애·재물·건강 운세까지 분석합니다." },
  ];

  const faqs = [
    { q: "꿈해몽이 정확한가요?", a: "꿈은 무의식의 신호입니다. 꿈의 감정·색깔·반복 여부와 내 현실 상황을 함께 고려할 때 가장 정확합니다. 점운은 오행 에너지 기반으로 꿈의 의미를 분석합니다." },
    { q: "태몽해몽도 가능한가요?", a: "네. 동물·식물·자연 등 태몽 종류별로 전문 해몽을 제공합니다. 아기의 성별 예측과 기질 분석까지 확인할 수 있어요." },
    { q: "흉몽을 꿨는데 어떻게 하나요?", a: "흉몽이 반드시 나쁜 것은 아닙니다. 변화·경고·정화의 신호일 수 있습니다. 꿈 해몽 후 사주와 연결해 현실 의미를 파악하세요." },
    { q: "무료로 이용 가능한가요?", a: "네, 꿈해몽은 기본 무료입니다. 꿈 카테고리를 선택하면 즉시 해몽 결과를 확인할 수 있습니다." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0d0020 0%,#1a0035 50%,#0d0020 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "#f5f5f5", wordBreak: "keep-all" as const }}>
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{d.emoji}</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1.3, margin: "0 0 14px", background: "linear-gradient(135deg,#c084fc,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{d.h1}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 28px" }}>{d.sub}</p>
        <Link href="/haemong" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 32px", borderRadius: 30, textDecoration: "none", boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}>
          지금 꿈 해몽하기 →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>100가지 꿈 카테고리 · 무료 즉시 해몽</p>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>점운 꿈해몽이 특별한 이유</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(192,132,252,0.2)", borderRadius: 16, padding: "18px 14px" }}>
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
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.15)", borderRadius: 14, padding: "16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#c084fc", margin: "0 0 8px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#1a0035,#0d0020)", border: "1px solid rgba(192,132,252,0.3)", borderRadius: 24, padding: "32px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 10px" }}>지금 꿈 해몽하기</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 22px" }}>오늘 꾼 꿈이 어떤 의미인지 즉시 확인하세요. 100가지 카테고리 무료 해몽 서비스</p>
          <Link href="/haemong" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 30, textDecoration: "none" }}>
            무료 꿈해몽 시작 →
          </Link>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/haemong" style={{ color: "#c084fc", fontSize: 13, textDecoration: "none" }}>← 꿈해몽 홈</Link>
          <Link href="/main-v2" style={{ color: "#c084fc", fontSize: 13, textDecoration: "none" }}>사주 보기</Link>
          <Link href="/gunghap" style={{ color: "#c084fc", fontSize: 13, textDecoration: "none" }}>궁합 보기</Link>
        </div>
      </section>
    </main>
  );
}
