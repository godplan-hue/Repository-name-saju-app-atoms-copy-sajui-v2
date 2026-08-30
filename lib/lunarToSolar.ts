import KoreanLunarCalendar from "korean-lunar-calendar";

// 음력 생년월일을 실제 사주 계산에 쓰이는 양력으로 변환한다.
// 변환 실패(라이브러리가 지원하지 않는 범위 등) 시에는 원본 값을 그대로 반환해
// 화면이 깨지거나 에러가 나지 않도록 한다 — 이 경우 기존과 동일하게 양력으로 취급됨.
export function lunarToSolar(year: number, month: number, day: number): { year: number; month: number; day: number } {
  try {
    const cal = new KoreanLunarCalendar();
    const ok = cal.setLunarDate(year, month, day, false);
    if (!ok) return { year, month, day };
    const solar = cal.getSolarCalendar();
    return { year: solar.year, month: solar.month, day: solar.day };
  } catch {
    return { year, month, day };
  }
}
