export type Ohaeng = "목" | "화" | "토" | "금" | "수";

export type QAItem = {
  question: string;
  answers: Record<Ohaeng, string>;
};

export type QACategory = {
  id: string;
  label: string;
  emoji: string;
  items: QAItem[];
};

export { wealthQA } from "./wealth";
export { loveQA } from "./love";
export { marriageQA } from "./marriage";
export { businessQA } from "./business";
export { careerQA } from "./career";
export { successQA } from "./success";
export { healthQA } from "./health";
export { childrenQA } from "./children";
export { generalQA } from "./general";

import { wealthQA } from "./wealth";
import { loveQA } from "./love";
import { marriageQA } from "./marriage";
import { businessQA } from "./business";
import { careerQA } from "./career";
import { successQA } from "./success";
import { healthQA } from "./health";
import { childrenQA } from "./children";
import { generalQA } from "./general";

export const QA_CATEGORIES: QACategory[] = [
  { id: "wealth",   label: "재물운",  emoji: "💰", items: wealthQA },
  { id: "love",     label: "연애운",  emoji: "💕", items: loveQA },
  { id: "marriage", label: "결혼운",  emoji: "💍", items: marriageQA },
  { id: "business", label: "사업운",  emoji: "🚀", items: businessQA },
  { id: "career",   label: "직업운",  emoji: "💼", items: careerQA },
  { id: "success",  label: "성공운",  emoji: "🏆", items: successQA },
  { id: "health",   label: "건강운",  emoji: "🍀", items: healthQA },
  { id: "children", label: "자녀운",  emoji: "👶", items: childrenQA },
  { id: "general",  label: "일반운세", emoji: "🔮", items: generalQA },
];

export function getOhaeng(birthYear: number): Ohaeng {
  const ohArr: Ohaeng[] = ["목","목","화","화","토","토","금","금","수","수"];
  return ohArr[((birthYear - 4) % 10 + 10) % 10];
}

export function fillTemplate(text: string, name: string): string {
  return text.replace(/\{\{name\}\}/g, name);
}
