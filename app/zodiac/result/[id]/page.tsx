"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type ZodiacResult = {
  name: string; zodiac: string; oh: string; crossKey: string;
  loveScore: number; workScore: number; healthScore: number; totalScore: number;
  luckyColors: string[]; luckyNumbers: number[]; luckyDirection: string;
  birthYear?: number;
};

const ZODIAC_INFO: Record<string, { emoji: string; symbol: string; period: string; element: string; planet: string; keyword: string; bg: string }> = {
  "양자리":    { emoji:"🐏", symbol:"♈", period:"3/21~4/19", element:"불", planet:"화성", keyword:"도전·열정·선구자", bg:"linear-gradient(135deg,#7f1d1d,#f97316)" },
  "황소자리":  { emoji:"🐂", symbol:"♉", period:"4/20~5/20", element:"흙", planet:"금성", keyword:"안정·감각·인내", bg:"linear-gradient(135deg,#064e3b,#4ade80)" },
  "쌍둥이자리":{ emoji:"👯", symbol:"♊", period:"5/21~6/21", element:"바람", planet:"수성", keyword:"소통·변화·지성", bg:"linear-gradient(135deg,#0c4a6e,#38bdf8)" },
  "게자리":    { emoji:"🦀", symbol:"♋", period:"6/22~7/22", element:"물", planet:"달", keyword:"감성·보호·가족", bg:"linear-gradient(135deg,#1e3a5f,#93c5fd)" },
  "사자자리":  { emoji:"🦁", symbol:"♌", period:"7/23~8/22", element:"불", planet:"태양", keyword:"자신감·리더십·창조", bg:"linear-gradient(135deg,#78350f,#fbbf24)" },
  "처녀자리":  { emoji:"🌾", symbol:"♍", period:"8/23~9/22", element:"흙", planet:"수성", keyword:"분석·완벽·봉사", bg:"linear-gradient(135deg,#14532d,#86efac)" },
  "천칭자리":  { emoji:"⚖️", symbol:"♎", period:"9/23~10/22", element:"바람", planet:"금성", keyword:"균형·조화·아름다움", bg:"linear-gradient(135deg,#831843,#f9a8d4)" },
  "전갈자리":  { emoji:"🦂", symbol:"♏", period:"10/23~11/22", element:"물", planet:"명왕성", keyword:"직관·변화·깊이", bg:"linear-gradient(135deg,#1c0533,#7c3aed)" },
  "사수자리":  { emoji:"🏹", symbol:"♐", period:"11/23~12/21", element:"불", planet:"목성", keyword:"자유·탐험·철학", bg:"linear-gradient(135deg,#312e81,#818cf8)" },
  "염소자리":  { emoji:"🐐", symbol:"♑", period:"12/22~1/19", element:"흙", planet:"토성", keyword:"야망·책임·성취", bg:"linear-gradient(135deg,#1c1917,#a8a29e)" },
  "물병자리":  { emoji:"🏺", symbol:"♒", period:"1/20~2/18", element:"바람", planet:"천왕성", keyword:"혁신·독창·박애", bg:"linear-gradient(135deg,#0c4a6e,#67e8f9)" },
  "물고기자리":{ emoji:"🐟", symbol:"♓", period:"2/19~3/20", element:"물", planet:"해왕성", keyword:"공감·예술·영성", bg:"linear-gradient(135deg,#2e1065,#c084fc)" },
};

const OH_EMOJI: Record<string,string> = { 목:"🌿", 화:"🔥", 토:"🏔️", 금:"⚡", 수:"🌊" };
const OH_COLOR: Record<string,string> = { 목:"#4ade80", 화:"#f87171", 토:"#fbbf24", 금:"#93c5fd", 수:"#a78bfa" };

// 별자리별 오늘/이번주/이번달 운세 템플릿
const READINGS: Record<string, Record<string, { today: string; week: string; month: string }>> = {
  "양자리": {
    love: { today:"새로운 인연이 예상되는 하루예요. 적극적으로 다가가세요.", week:"주중에 감정 표현이 중요해요. 솔직한 마음이 통해요.", month:"열정적인 사랑의 에너지가 가득한 달이에요." },
    work: { today:"도전적인 과제가 주어질 수 있어요. 자신감 있게 대처하세요.", week:"빠른 결단력이 빛을 발하는 한 주예요.", month:"새로운 프로젝트를 시작하기에 좋은 달이에요." },
    health: { today:"에너지가 넘치는 날이에요. 운동하기 좋은 타이밍이에요.", week:"무리하지 않는 선에서 활동량을 늘려보세요.", month:"꾸준한 운동 습관을 만들기 좋은 시기예요." },
  },
  "황소자리": {
    love: { today:"편안하고 안정적인 만남이 좋은 하루예요.", week:"감각적인 데이트가 관계를 깊게 해줄 거예요.", month:"천천히 신뢰를 쌓아가는 사랑이 싹트는 달이에요." },
    work: { today:"꼼꼼하게 마무리 짓는 것이 중요한 날이에요.", week:"성실한 태도가 인정받는 한 주가 될 거예요.", month:"꾸준한 노력이 결실을 맺기 시작하는 달이에요." },
    health: { today:"휴식이 최고의 보약인 날이에요.", week:"맛있는 음식과 충분한 수면이 활력을 줄 거예요.", month:"규칙적인 식습관으로 컨디션을 다스려 보세요." },
  },
  "쌍둥이자리": {
    love: { today:"대화가 잘 통하는 사람과 인연이 연결되는 날이에요.", week:"다양한 만남 속에서 특별한 사람을 만날 수 있어요.", month:"소통과 교류가 활발해지며 관계가 풍성해지는 달이에요." },
    work: { today:"아이디어가 풍부한 날이에요. 적극적으로 의견을 내세요.", week:"멀티태스킹 능력이 빛나는 한 주예요.", month:"새로운 정보와 아이디어로 성과를 내는 달이에요." },
    health: { today:"머리가 맑아지는 활동이 도움이 돼요.", week:"과도한 생각보다 몸을 움직이는 것이 좋아요.", month:"규칙적인 생활 패턴이 두뇌 건강을 지켜줄 거예요." },
  },
  "게자리": {
    love: { today:"가까운 사람과 따뜻한 시간을 보내세요.", week:"감정적인 교류가 깊어지는 한 주예요.", month:"가족과 연인 모두 소중하게 여기는 마음이 빛나는 달이에요." },
    work: { today:"직감적인 판단이 옳은 방향을 가리키는 날이에요.", week:"팀워크가 좋은 성과를 만들어낼 거예요.", month:"배려와 섬세함으로 주변의 신뢰를 얻는 달이에요." },
    health: { today:"감정 기복에 주의하고 마음을 안정시키세요.", week:"따뜻한 음식과 충분한 수분이 몸을 지켜줘요.", month:"정서적인 건강에 특히 신경 쓰는 달이 될 거예요." },
  },
  "사자자리": {
    love: { today:"당당하게 표현하는 것이 매력적으로 보이는 날이에요.", week:"드라마틱한 사랑의 감정이 고조되는 한 주예요.", month:"나를 빛나게 해주는 특별한 인연이 찾아오는 달이에요." },
    work: { today:"리더십을 발휘할 기회가 생길 거예요.", week:"창의적인 아이디어로 주목받는 한 주가 돼요.", month:"야망을 펼치기에 최적의 달이에요. 크게 도전하세요." },
    health: { today:"활동적인 하루가 기분을 UP 시켜줄 거예요.", week:"심장 건강에 좋은 유산소 운동을 시작해 보세요.", month:"에너지를 적절히 분배하는 것이 건강의 핵심이에요." },
  },
  "처녀자리": {
    love: { today:"세심한 배려가 상대방의 마음을 움직이는 날이에요.", week:"완벽함보다 있는 그대로를 보여주는 것이 더 매력적이에요.", month:"진실한 소통으로 관계가 깊어지는 달이에요." },
    work: { today:"꼼꼼한 분석과 검토가 빛을 발하는 날이에요.", week:"세부적인 사항까지 챙기는 능력이 인정받아요.", month:"체계적인 계획이 큰 성과로 이어지는 달이에요." },
    health: { today:"소화기 건강에 신경 써주세요. 식사를 천천히 하세요.", week:"규칙적인 생활이 몸의 균형을 잡아줄 거예요.", month:"건강한 루틴 만들기에 가장 좋은 달이에요." },
  },
  "천칭자리": {
    love: { today:"아름다운 만남이 기다리는 날이에요. 외모에 신경 써보세요.", week:"균형 잡힌 관계가 더욱 조화롭게 발전해요.", month:"사랑스러운 에너지가 넘쳐 새로운 인연이 생기는 달이에요." },
    work: { today:"중재자 역할이 중요한 날이에요. 양쪽을 잘 조율해 보세요.", week:"협력과 파트너십이 좋은 결과를 만들어요.", month:"균형 감각으로 복잡한 상황을 해결하는 달이에요." },
    health: { today:"허리와 신장 건강을 챙겨보세요.", week:"균형 잡힌 식단이 컨디션을 높여줄 거예요.", month:"요가나 필라테스 등 밸런스 운동이 도움이 돼요." },
  },
  "전갈자리": {
    love: { today:"깊고 강렬한 감정이 흐르는 날이에요.", week:"숨겨진 감정이 드러나며 관계의 진실을 마주하게 돼요.", month:"변화와 재탄생이 이루어지는 사랑의 달이에요." },
    work: { today:"직관을 믿고 과감하게 결단하는 날이에요.", week:"숨겨진 정보나 기회를 발견하는 한 주가 될 거예요.", month:"집중력과 탐구심으로 깊이 있는 성과를 내는 달이에요." },
    health: { today:"스트레스 해소가 가장 중요한 날이에요.", week:"감정을 안으로 쌓아두지 말고 표현하는 연습을 해요.", month:"정신 건강과 신체 건강 모두 균형 있게 챙기는 달이에요." },
  },
  "사수자리": {
    love: { today:"자유롭고 솔직한 대화가 관계를 발전시키는 날이에요.", week:"모험적인 데이트가 설레임을 더해줄 거예요.", month:"넓은 세계에서 나와 잘 맞는 사람을 만나는 달이에요." },
    work: { today:"큰 그림을 보는 시각이 도움이 되는 날이에요.", week:"새로운 배움과 도전이 성장의 발판이 돼요.", month:"원대한 목표를 향해 출발하기 좋은 달이에요." },
    health: { today:"야외 활동으로 기분 전환을 해보세요.", week:"과식을 조심하고 활동량을 늘려보세요.", month:"여행이나 새로운 스포츠로 몸과 마음을 깨워보세요." },
  },
  "염소자리": {
    love: { today:"진지하고 책임감 있는 모습이 매력적인 날이에요.", week:"천천히, 하지만 확실하게 관계를 발전시키세요.", month:"신뢰와 안정을 기반으로 한 사랑이 깊어지는 달이에요." },
    work: { today:"목표를 향해 묵묵히 나아가는 날이에요.", week:"성실함과 끈기가 빛을 발하는 한 주예요.", month:"오랫동안 준비한 것이 결실을 맺기 시작하는 달이에요." },
    health: { today:"무릎과 관절 건강을 챙겨보세요.", week:"스트레칭으로 몸의 긴장을 풀어주세요.", month:"꾸준한 운동 습관이 건강의 기반을 만들어줄 거예요." },
  },
  "물병자리": {
    love: { today:"독특하고 특별한 만남이 기다리는 날이에요.", week:"자유로운 소통이 관계를 신선하게 만들어요.", month:"기존의 틀을 깨는 새로운 형태의 사랑이 찾아오는 달이에요." },
    work: { today:"혁신적인 아이디어가 주목받는 날이에요.", week:"네트워킹과 협업에서 뜻밖의 기회가 생겨요.", month:"창의적인 접근으로 남다른 성과를 내는 달이에요." },
    health: { today:"순환계와 발목 건강에 신경 써주세요.", week:"새로운 운동 방식을 시도해 보는 것이 좋아요.", month:"정신적 자유로움이 몸 건강에도 영향을 줄 거예요." },
  },
  "물고기자리": {
    love: { today:"감수성이 높아지는 날, 로맨틱한 분위기를 즐기세요.", week:"꿈같은 사랑이 현실로 다가오는 한 주예요.", month:"깊은 공감과 영적인 연결이 이루어지는 달이에요." },
    work: { today:"직관과 창의력이 빛나는 날이에요.", week:"예술적이고 감성적인 접근이 좋은 결과를 가져와요.", month:"영감이 넘쳐 창작 활동에 최고의 달이에요." },
    health: { today:"충분한 수면과 휴식이 필요한 날이에요.", week:"명상이나 요가로 마음을 다스려 보세요.", month:"발 건강과 면역력에 특히 신경 쓰는 달이에요." },
  },
};

// 오행×별자리 교차 설명
const CROSS_DESC: Record<string, Record<string, string>> = {
  목: {
    "양자리":"목오행의 성장 에너지와 양자리의 개척 정신이 만나, 어떤 도전도 두렵지 않은 강력한 추진력을 가졌어요.",
    "황소자리":"목오행의 뿌리 깊음과 황소자리의 인내력이 결합, 한 번 시작한 일은 반드시 결실을 맺어요.",
    "쌍둥이자리":"목오행의 창의성과 쌍둥이자리의 소통력이 시너지를 내, 아이디어를 행동으로 빠르게 연결해요.",
    "게자리":"목오행의 따뜻함과 게자리의 감수성이 만나, 주변 사람들에게 깊은 안정감을 주는 에너지예요.",
    "사자자리":"목오행의 성장 욕구와 사자자리의 리더십이 결합, 무대 위에서 빛나는 존재감을 발휘해요.",
    "처녀자리":"목오행의 꼼꼼함과 처녀자리의 분석력이 더해져, 어떤 프로젝트도 완벽하게 마무리해요.",
    "천칭자리":"목오행의 유연함과 천칭자리의 균형 감각이 만나, 사람들 사이에서 조화를 이끌어내요.",
    "전갈자리":"목오행의 생명력과 전갈자리의 집중력이 결합, 한 번 꽂힌 목표는 끝까지 이뤄내요.",
    "사수자리":"목오행의 확장성과 사수자리의 모험심이 시너지를 내, 새로운 영역을 개척하는 에너지예요.",
    "염소자리":"목오행의 꾸준함과 염소자리의 야망이 만나, 느리지만 확실하게 정상을 향해 나아가요.",
    "물병자리":"목오행의 창의성과 물병자리의 혁신성이 결합, 세상을 바꾸는 아이디어를 가진 에너지예요.",
    "물고기자리":"목오행의 공감 능력과 물고기자리의 감수성이 더해져, 예술적이고 치유하는 에너지를 가졌어요.",
  },
  화: {
    "양자리":"화오행의 열정과 양자리의 도전 정신이 만나, 불꽃처럼 강렬하고 빠른 에너지를 가졌어요.",
    "황소자리":"화오행의 따뜻함과 황소자리의 감각적 풍요로움이 결합, 삶의 아름다움을 즐길 줄 알아요.",
    "쌍둥이자리":"화오행의 표현력과 쌍둥이자리의 언변이 시너지를 내, 사람들을 끌어당기는 매력이 넘쳐요.",
    "게자리":"화오행의 정열과 게자리의 감성이 만나, 사랑하는 사람을 위해 모든 것을 내줄 수 있는 에너지예요.",
    "사자자리":"화오행의 빛과 사자자리의 카리스마가 결합, 어디서든 주인공이 되는 에너지를 가졌어요.",
    "처녀자리":"화오행의 열정과 처녀자리의 성실함이 더해져, 꾸준한 노력으로 완성도를 높이는 에너지예요.",
    "천칭자리":"화오행의 아름다움 추구와 천칭자리의 미적 감각이 만나, 세련되고 우아한 에너지예요.",
    "전갈자리":"화오행의 강렬함과 전갈자리의 깊이가 결합, 한번 사랑하면 뜨겁게 전부를 바치는 에너지예요.",
    "사수자리":"화오행의 자유로운 열정과 사수자리의 모험심이 시너지를 내, 세상을 무대로 삼는 에너지예요.",
    "염소자리":"화오행의 야망과 염소자리의 목표 의식이 만나, 성공을 향한 불굴의 의지를 가졌어요.",
    "물병자리":"화오행의 혁신 열망과 물병자리의 독창성이 결합, 세상을 놀라게 할 아이디어를 가졌어요.",
    "물고기자리":"화오행의 감성과 물고기자리의 예술성이 더해져, 깊고 아름다운 창작 에너지를 가졌어요.",
  },
  토: {
    "양자리":"토오행의 중심력과 양자리의 추진력이 만나, 흔들리지 않으면서도 앞으로 나가는 에너지예요.",
    "황소자리":"토오행의 안정감과 황소자리의 인내심이 결합, 어떤 상황에서도 든든한 기둥 같은 존재예요.",
    "쌍둥이자리":"토오행의 실용성과 쌍둥이자리의 아이디어가 시너지를 내, 말을 현실로 만드는 에너지예요.",
    "게자리":"토오행의 포용력과 게자리의 모성이 만나, 주변 모두를 따뜻하게 품어주는 에너지예요.",
    "사자자리":"토오행의 중심력과 사자자리의 리더십이 결합, 오랫동안 기억되는 강한 리더 에너지예요.",
    "처녀자리":"토오행의 꼼꼼함과 처녀자리의 완벽주의가 더해져, 모든 것을 제자리에 두는 에너지예요.",
    "천칭자리":"토오행의 균형 감각과 천칭자리의 조화 추구가 만나, 갈등을 자연스럽게 중재하는 에너지예요.",
    "전갈자리":"토오행의 깊이와 전갈자리의 통찰력이 결합, 표면 아래 숨겨진 진실을 꿰뚫어 봐요.",
    "사수자리":"토오행의 현실감과 사수자리의 철학적 시각이 시너지를 내, 이상을 현실로 만드는 에너지예요.",
    "염소자리":"토오행의 지구력과 염소자리의 야망이 만나, 느리지만 반드시 정상에 오르는 에너지예요.",
    "물병자리":"토오행의 실용성과 물병자리의 혁신이 결합, 획기적인 아이디어를 실현시키는 에너지예요.",
    "물고기자리":"토오행의 안정과 물고기자리의 영성이 더해져, 깊은 치유와 공감의 에너지를 가졌어요.",
  },
  금: {
    "양자리":"금오행의 날카로움과 양자리의 결단력이 만나, 어떤 장애물도 단번에 돌파하는 에너지예요.",
    "황소자리":"금오행의 가치 추구와 황소자리의 감각이 결합, 진짜 좋은 것을 알아보는 안목을 가졌어요.",
    "쌍둥이자리":"금오행의 논리와 쌍둥이자리의 언변이 시너지를 내, 설득력이 뛰어난 에너지예요.",
    "게자리":"금오행의 단호함과 게자리의 보호 본능이 만나, 가족을 지키는 강한 수호자 에너지예요.",
    "사자자리":"금오행의 빛나는 에너지와 사자자리의 카리스마가 결합, 진정한 금빛 리더 에너지예요.",
    "처녀자리":"금오행의 정확성과 처녀자리의 분석력이 더해져, 오류를 용납하지 않는 완벽주의 에너지예요.",
    "천칭자리":"금오행의 공정함과 천칭자리의 균형이 만나, 어디서든 올바른 판단을 내리는 에너지예요.",
    "전갈자리":"금오행의 강한 의지와 전갈자리의 깊이가 결합, 목표 앞에서 절대 물러서지 않는 에너지예요.",
    "사수자리":"금오행의 자유 의지와 사수자리의 모험심이 시너지를 내, 어떤 경계도 넘어서는 에너지예요.",
    "염소자리":"금오행의 결단력과 염소자리의 야망이 만나, 성공을 향한 철의 의지를 가진 에너지예요.",
    "물병자리":"금오행의 혁신과 물병자리의 독창성이 결합, 시대를 앞서가는 에너지예요.",
    "물고기자리":"금오행의 날카로운 직관과 물고기자리의 감수성이 더해져, 깊은 예술적 통찰을 가졌어요.",
  },
  수: {
    "양자리":"수오행의 지혜와 양자리의 행동력이 만나, 생각하는 것을 즉시 실행하는 에너지예요.",
    "황소자리":"수오행의 깊이와 황소자리의 감각이 결합, 삶의 진짜 가치를 알아보는 통찰력을 가졌어요.",
    "쌍둥이자리":"수오행의 흐르는 지식과 쌍둥이자리의 소통력이 시너지를 내, 지혜를 나누는 에너지예요.",
    "게자리":"수오행의 감성과 게자리의 직관이 만나, 말하지 않아도 느끼는 깊은 공감 에너지예요.",
    "사자자리":"수오행의 깊은 지혜와 사자자리의 빛이 결합, 내면에서 우러나오는 진정한 리더 에너지예요.",
    "처녀자리":"수오행의 통찰력과 처녀자리의 분석력이 더해져, 어떤 복잡한 문제도 명쾌하게 풀어요.",
    "천칭자리":"수오행의 흐름과 천칭자리의 균형이 만나, 자연스럽게 조화를 이끄는 에너지예요.",
    "전갈자리":"수오행의 직관과 전갈자리의 깊이가 결합, 다른 사람의 마음을 꿰뚫어 보는 에너지예요.",
    "사수자리":"수오행의 지혜와 사수자리의 철학이 시너지를 내, 삶의 깊은 의미를 탐구하는 에너지예요.",
    "염소자리":"수오행의 흐르는 힘과 염소자리의 인내가 만나, 오래 가는 진짜 성공을 만드는 에너지예요.",
    "물병자리":"수오행의 혁신적 사고와 물병자리의 독창성이 결합, 미래를 미리 보는 선각자 에너지예요.",
    "물고기자리":"수오행의 깊은 직관과 물고기자리의 영성이 더해져, 우주와 연결된 신비로운 에너지예요.",
  },
};

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(score), 300); }, [score]);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 900, color }}>{score}%</span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 4, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function ZodiacResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<ZodiacResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"today" | "week" | "month">("today");
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    fetch(`/api/zodiac/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.result) setResult(d.result); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const share = async () => {
    const url = `${window.location.origin}/zodiac/result/${id}`;
    if (navigator.share) {
      try { await navigator.share({ title: `${result?.zodiac} 오늘의 운세`, text: "점운 별자리 운세를 확인해봐요!", url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setSharing(true); setTimeout(() => setSharing(false), 2000);
    }
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#050d1a", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <div style={{ fontSize: 64, animation: "spin 2s linear infinite" }}>⭐</div>
        <p style={{ color: "#93c5fd", marginTop: 20, fontWeight: 700 }}>별자리 운세 불러오는 중...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <p style={{ color: "#9ca3af" }}>결과를 불러올 수 없어요.</p>
        <button onClick={() => router.push("/zodiac")} style={{ marginTop: 20, background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "white", border: "none", borderRadius: 22, padding: "14px 28px", fontSize: 15, fontWeight: 900, cursor: "pointer" }}>다시 시도</button>
      </div>
    );
  }

  const info = ZODIAC_INFO[result.zodiac] || ZODIAC_INFO["양자리"];
  const readings = READINGS[result.zodiac] || READINGS["양자리"];
  const displayName = result.name || "당신";
  const crossDesc = result.oh ? (CROSS_DESC[result.oh]?.[result.zodiac] || "") : "";
  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`;

  return (
    <div style={S.wrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={S.inner}>
        <div style={{ paddingTop: 32, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/zodiac" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none" }}>← 다시 보기</Link>
          <span style={{ fontSize: 13, color: "#6b7280" }}>점운 별자리</span>
        </div>
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 20 }}>{dateStr}</p>

        {/* 별자리 헤더 */}
        <div style={{ background: info.bg, borderRadius: 24, padding: "28px 20px", marginBottom: 20, textAlign: "center", animation: "fadeUp 0.5s ease both", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>{info.emoji}</div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", letterSpacing: 2, fontWeight: 700 }}>{info.symbol} {info.element}의 별자리</p>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 4px" }}>{result.zodiac}</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: "0 0 14px" }}>{info.period} · 수호 행성: {info.planet}</p>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 16px", display: "inline-block" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>✨ {displayName}의 오늘 에너지 {result.totalScore}%</span>
          </div>
        </div>

        {/* 오늘/이번주/이번달 탭 */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 4, marginBottom: 20 }}>
          {[{ key: "today", label: "오늘" }, { key: "week", label: "이번 주" }, { key: "month", label: "이번 달" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as "today"|"week"|"month")}
              style={{ flex: 1, padding: "10px", background: tab === t.key ? "linear-gradient(135deg,#1d4ed8,#7c3aed)" : "transparent", color: tab === t.key ? "white" : "#9ca3af", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* 사랑/직업/건강 점수 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 18px", marginBottom: 20, animation: "fadeUp 0.5s ease 0.1s both" }}>
          <ScoreBar label="💗 사랑" score={result.loveScore} color="#f472b6" />
          <ScoreBar label="💼 직업" score={result.workScore} color="#60a5fa" />
          <ScoreBar label="💪 건강" score={result.healthScore} color="#4ade80" />
        </div>

        {/* 탭별 운세 내용 */}
        <div style={{ marginBottom: 20, animation: "fadeUp 0.5s ease 0.2s both" }}>
          <div style={{ background: "rgba(147,197,253,0.07)", border: "1px solid rgba(147,197,253,0.15)", borderRadius: 20, padding: "18px 16px", marginBottom: 10 }}>
            <p style={{ fontSize: 12, color: "#93c5fd", fontWeight: 700, margin: "0 0 8px" }}>💗 {tab === "today" ? "오늘" : tab === "week" ? "이번 주" : "이번 달"} 사랑운</p>
            <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, margin: 0 }}>{readings.love[tab]}</p>
          </div>
          <div style={{ background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 20, padding: "18px 16px", marginBottom: 10 }}>
            <p style={{ fontSize: 12, color: "#60a5fa", fontWeight: 700, margin: "0 0 8px" }}>💼 {tab === "today" ? "오늘" : tab === "week" ? "이번 주" : "이번 달"} 직업·재물운</p>
            <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, margin: 0 }}>{readings.work[tab]}</p>
          </div>
          <div style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 20, padding: "18px 16px" }}>
            <p style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, margin: "0 0 8px" }}>💪 {tab === "today" ? "오늘" : tab === "week" ? "이번 주" : "이번 달"} 건강운</p>
            <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, margin: 0 }}>{readings.health[tab]}</p>
          </div>
        </div>

        {/* 행운 아이템 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "18px 16px", marginBottom: 20, animation: "fadeUp 0.5s ease 0.3s both" }}>
          <p style={{ fontSize: 13, fontWeight: 900, margin: "0 0 14px", color: "#fbbf24" }}>🍀 오늘의 행운 아이템</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 8px", textAlign: "center" as const }}>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>행운 색상</p>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{result.luckyColors.join(" · ")}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 8px", textAlign: "center" as const }}>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>행운 숫자</p>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{result.luckyNumbers.join(", ")}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 8px", textAlign: "center" as const }}>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>행운 방향</p>
              <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{result.luckyDirection}</p>
            </div>
          </div>
        </div>

        {/* 오행 × 별자리 교차 (점운 차별화) */}
        {result.oh && crossDesc && (
          <div style={{ background: `rgba(${result.oh==="목"?"74,222,128":result.oh==="화"?"248,113,113":result.oh==="토"?"251,191,36":result.oh==="금"?"147,197,253":"167,139,250"},0.08)`, border: `1px solid rgba(${result.oh==="목"?"74,222,128":result.oh==="화"?"248,113,113":result.oh==="토"?"251,191,36":result.oh==="금"?"147,197,253":"167,139,250"},0.2)`, borderRadius: 20, padding: "18px 16px", marginBottom: 20, animation: "fadeUp 0.5s ease 0.4s both" }}>
            <p style={{ fontSize: 12, fontWeight: 900, margin: "0 0 8px", color: OH_COLOR[result.oh] }}>{OH_EMOJI[result.oh]} {result.oh}오행 × {result.zodiac} 교차분석</p>
            <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, margin: "0 0 10px" }}>{crossDesc}</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>키워드: {info.keyword}</p>
          </div>
        )}

        {/* 12별자리 바로가기 */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>다른 별자리 운세</p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
            {["양자리","황소자리","쌍둥이자리","게자리","사자자리","처녀자리","천칭자리","전갈자리","사수자리","염소자리","물병자리","물고기자리"].filter(z => z !== result.zodiac).map(z => {
              const zi = ZODIAC_INFO[z];
              return (
                <Link key={z} href="/zodiac" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "6px 12px", fontSize: 12, color: "#9ca3af", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  {zi.emoji} {z.replace("자리","")}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 공유 버튼 */}
        <button onClick={share} style={{ width: "100%", background: "rgba(255,255,255,0.06)", color: "#93c5fd", border: "1px solid rgba(147,197,253,0.3)", borderRadius: 22, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>
          {sharing ? "✅ 링크 복사됨!" : "📤 친구에게 공유하기"}
        </button>

        {/* 사주 연결 CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(29,78,216,0.15),rgba(124,58,237,0.1))", border: "1px solid rgba(147,197,253,0.2)", borderRadius: 20, padding: "20px 18px" }}>
          <p style={{ fontWeight: 900, fontSize: 15, margin: "0 0 6px" }}>🔮 별자리보다 사주가 더 정확해요</p>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, margin: "0 0 14px" }}>
            {displayName}의 {result.zodiac} 에너지를<br />사주 원국으로 분석하면 연애·직업·재물 흐름을 정확하게 알 수 있어요.
          </p>
          <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "white", borderRadius: 22, padding: "14px", fontSize: 14, fontWeight: 900, textAlign: "center", textDecoration: "none" }}>
            AI 사주 무료로 받아보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
