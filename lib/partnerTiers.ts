// 파트너 등급 정의 + 결제 즉시 정산액을 계산하는 유틸.
// 실제 입금(정산)은 매월 1회로 모아서 보내고, 여기서는 "결제 시점에 얼마를
// 줘야 하는지" 계산만 자동으로 함 — 계산은 즉시, 지급은 월별.

export type PartnerTierId = "free" | "silver" | "gold" | "platinum" | "diamond";

export interface PartnerTier {
  id: PartnerTierId;
  name: string;
  annualFee: number;
  monthlyLimit: number | null; // null = 무제한
  revenueSharePercent: number; // 카드수수료·부가세 차감한 순수익 중 파트너 몫(%)
}

export const PARTNER_TIERS: PartnerTier[] = [
  { id: "free", name: "무료", annualFee: 0, monthlyLimit: 30, revenueSharePercent: 30 },
  { id: "silver", name: "실버", annualFee: 150000, monthlyLimit: 150, revenueSharePercent: 40 },
  { id: "gold", name: "골드", annualFee: 350000, monthlyLimit: 300, revenueSharePercent: 45 },
  { id: "platinum", name: "플래티넘", annualFee: 1000000, monthlyLimit: 600, revenueSharePercent: 55 },
  { id: "diamond", name: "다이아", annualFee: 2000000, monthlyLimit: null, revenueSharePercent: 70 },
];

export function getPartnerTier(id: string): PartnerTier {
  return PARTNER_TIERS.find(t => t.id === id) ?? PARTNER_TIERS[0];
}

// 카드/PG 결제수수료율 — 실제 계약된 수수료율(토스페이먼츠 등)로 반드시 확인 후 교체할 것
const PG_FEE_RATE = 0.03;

export interface SettlementBreakdown {
  grossAmount: number;   // 고객이 실제로 결제한 금액
  pgFee: number;         // 카드/PG 수수료 추정치
  vat: number;           // 부가세(결제금액에 이미 포함된 값 기준, 금액/11)
  netAmount: number;     // 수수료·부가세 뗀 순수익
  partnerShare: number;  // 파트너에게 줄 몫
  platformShare: number; // 플랫폼이 가져가는 몫
}

export function calculatePartnerSettlement(grossAmount: number, tierId: string): SettlementBreakdown {
  const tier = getPartnerTier(tierId);
  const pgFee = Math.round(grossAmount * PG_FEE_RATE);
  // 부가세 포함가 기준: 결제금액 = 공급가액 × 1.1 이므로 부가세 = 결제금액 / 11
  const vat = Math.round(grossAmount / 11);
  const netAmount = grossAmount - pgFee - vat;
  const partnerShare = Math.round(netAmount * (tier.revenueSharePercent / 100));
  const platformShare = netAmount - partnerShare;
  return { grossAmount, pgFee, vat, netAmount, partnerShare, platformShare };
}

// ── 파트너 할인코드 ──────────────────────────────────────────
// 실제 DB가 아직 없어서 localStorage에 보관. 나중에 진짜 DB(Firebase 등)가
// 연결되면 이 부분만 API 호출로 바꾸면 됨
export interface PartnerDiscountCode {
  code: string;
  discountPercent: number; // 고객이 받는 할인율
  partnerName: string;
  tierId: PartnerTierId;
  active: boolean;
}

const DISCOUNT_CODES_KEY = "v2_partner_discount_codes";
const SETTLEMENTS_KEY = "v2_partner_settlements";

export function getDiscountCodes(): PartnerDiscountCode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DISCOUNT_CODES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // 처음엔 테스트용 코드 하나를 기본으로 넣어둠
  const seed: PartnerDiscountCode[] = [
    { code: "SUMMER2024", discountPercent: 20, partnerName: "테스트파트너", tierId: "silver", active: true },
  ];
  localStorage.setItem(DISCOUNT_CODES_KEY, JSON.stringify(seed));
  return seed;
}

export function findDiscountCode(code: string): PartnerDiscountCode | null {
  const found = getDiscountCodes().find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
  return found ?? null;
}

export interface SettlementRecord extends SettlementBreakdown {
  id: string;
  date: string;
  partnerName: string;
  discountCode: string;
  customerPaid: number; // 할인 적용 후 실제 결제액(=grossAmount)
}

export function recordSettlement(discount: PartnerDiscountCode, originalPrice: number): SettlementRecord {
  const customerPaid = Math.round(originalPrice * (1 - discount.discountPercent / 100));
  const breakdown = calculatePartnerSettlement(customerPaid, discount.tierId);
  const record: SettlementRecord = {
    ...breakdown,
    id: `${Date.now()}`,
    date: new Date().toISOString(),
    partnerName: discount.partnerName,
    discountCode: discount.code,
    customerPaid,
  };
  if (typeof window !== "undefined") {
    try {
      const list: SettlementRecord[] = JSON.parse(localStorage.getItem(SETTLEMENTS_KEY) || "[]");
      list.unshift(record);
      localStorage.setItem(SETTLEMENTS_KEY, JSON.stringify(list.slice(0, 200)));
    } catch {}
  }
  return record;
}

export function getSettlements(): SettlementRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SETTLEMENTS_KEY) || "[]");
  } catch {
    return [];
  }
}
