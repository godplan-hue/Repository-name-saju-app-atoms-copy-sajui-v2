// 파트너 등급 정의 + "분석 1건 생성할 때마다 즉시 내는 사용료" 계산 유틸.
//
// 실제 돈 흐름: 고객이 파트너에게 직접 돈을 냄(우리는 모름/상관없음) ->
// 파트너가 우리 도구로 분석을 생성하는 그 순간, 우리에게 사용료를 즉시 냄.
// 그래서 한 달 모아서 정산/지급하는 절차가 필요 없음(파트너 -> 우리, 그 자리에서 끝).

export type PartnerTierId = "free" | "silver" | "gold" | "platinum" | "diamond";

export interface PartnerTier {
  id: PartnerTierId;
  name: string;
  annualFee: number;
  monthlyLimit: number | null; // null = 무제한
  feeDiscountPercent: number; // 정가에서 등급별로 깎아주는 사용료 할인율(%) — 높을수록 우리한테 적게 냄
}

export const PARTNER_TIERS: PartnerTier[] = [
  { id: "free", name: "무료", annualFee: 0, monthlyLimit: 50, feeDiscountPercent: 30 },
  { id: "silver", name: "실버", annualFee: 150000, monthlyLimit: 150, feeDiscountPercent: 40 },
  { id: "gold", name: "골드", annualFee: 350000, monthlyLimit: 300, feeDiscountPercent: 45 },
  { id: "platinum", name: "플래티넘", annualFee: 1000000, monthlyLimit: 600, feeDiscountPercent: 55 },
  { id: "diamond", name: "다이아", annualFee: 2000000, monthlyLimit: null, feeDiscountPercent: 70 },
];

export function getPartnerTier(id: string): PartnerTier {
  return PARTNER_TIERS.find(t => t.id === id) ?? PARTNER_TIERS[0];
}

// PARTNER_TIERS 배열 순서 = 등급 순서(낮음 -> 높음)
export function getTierIndex(id: string): number {
  const idx = PARTNER_TIERS.findIndex(t => t.id === id);
  return idx === -1 ? 0 : idx;
}

// 업그레이드 시 새 등급 연회비에서 기존에 낸 연회비를 뺀 차액만 추가로 내면 됨
export function calculateUpgradeFee(currentTierId: string, newTierId: string): number {
  const current = getPartnerTier(currentTierId);
  const next = getPartnerTier(newTierId);
  return Math.max(0, next.annualFee - current.annualFee);
}

export interface UsageCharge {
  listPrice: number;        // 패키지 정가
  baseFee: number;          // 정가 × (100-등급할인%) — 부가세 전 우리 매출
  vat: number;               // baseFee의 10% — 위에 얹어서 받음(합법)
  totalCharge: number;       // 파트너가 실제 내는 금액(baseFee+vat). 카드수수료는 우리가 부담하므로 별도 가산 안 함
}

export function calculatePartnerCharge(listPrice: number, tierId: string): UsageCharge {
  const tier = getPartnerTier(tierId);
  const baseFee = Math.round(listPrice * ((100 - tier.feeDiscountPercent) / 100));
  const vat = Math.round(baseFee * 0.1);
  const totalCharge = baseFee + vat;
  return { listPrice, baseFee, vat, totalCharge };
}
