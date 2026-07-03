import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MERCHANT_ID = process.env.PAYUP_MERCHANT_ID || "moon6783";
const API_CERT_KEY = process.env.PAYUP_API_CERT_KEY || "";
const BASE_URL = "https://api.payup.co.kr";

function makeTimestamp(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
}

function makeOrderNumber(): string {
  return `JU${Date.now()}`.slice(0, 20);
}

export async function POST(req: NextRequest) {
  if (!API_CERT_KEY) {
    return NextResponse.json({ success: false, error: "결제 설정이 완료되지 않았습니다." }, { status: 500 });
  }

  let body: Record<string, string | number>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { cardNo, expireMonth, expireYear, birthday, cardPw, amount, itemName, userName, mobileNumber } = body;

  const missing = (["cardNo", "expireMonth", "expireYear", "birthday", "cardPw", "amount", "itemName", "userName"] as const)
    .filter(k => !body[k]);
  if (missing.length > 0) {
    return NextResponse.json({ success: false, error: `필수 입력값 누락: ${missing.join(", ")}` }, { status: 400 });
  }

  const orderNumber = makeOrderNumber();
  const timestamp = makeTimestamp();
  const amountStr = String(amount);

  // sha256(merchantId|orderNumber|amount|apiCertKey|timestamp)
  const signStr = `${MERCHANT_ID}|${orderNumber}|${amountStr}|${API_CERT_KEY}|${timestamp}`;
  const signature = crypto.createHash("sha256").update(signStr).digest("hex");

  const payload = {
    orderNumber,
    cardNo: String(cardNo).replace(/\s/g, ""),
    expireMonth: String(expireMonth).padStart(2, "0"),
    expireYear: String(expireYear).slice(-2),
    birthday: String(birthday),
    cardPw: String(cardPw),
    amount: amountStr,
    quota: "0",
    itemName: String(itemName).slice(0, 128),
    userName: String(userName).slice(0, 50),
    mobileNumber: mobileNumber ? String(mobileNumber).replace(/\D/g, "") : "",
    signature,
    timestamp,
  };

  try {
    const response = await fetch(`${BASE_URL}/v2/api/payment/${MERCHANT_ID}/keyin2`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.responseCode === "0000") {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        orderNumber,
        authNumber: result.authNumber,
        cardName: result.cardName,
      });
    }

    return NextResponse.json({
      success: false,
      error: result.responseMsg || "결제에 실패했습니다.",
      code: result.responseCode,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[PayUp] API 호출 실패:", msg);
    return NextResponse.json({ success: false, error: "결제 서버 연결에 실패했습니다." }, { status: 500 });
  }
}
