import { NextRequest, NextResponse } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// 결제 토큰 생성 (토스 앱인토스 인앱결제)
export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, orderName } = await req.json();

    const secretKey = process.env.TOSS_INAPP_SECRET_KEY || "";
    if (!secretKey) {
      return NextResponse.json({ error: "결제 키가 설정되지 않았습니다." }, { status: 500, headers: CORS });
    }

    const encoded = Buffer.from(`${secretKey}:`).toString("base64");
    const res = await fetch("https://api.tosspayments.com/v2/tosspay/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, amount, orderName }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || "결제 생성 실패" }, { status: 400, headers: CORS });
    }

    return NextResponse.json({ payToken: data.payToken }, { headers: CORS });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500, headers: CORS });
  }
}

// 결제 실행 (인증 후 실제 결제 처리)
export async function PATCH(req: NextRequest) {
  try {
    const { payToken } = await req.json();

    const secretKey = process.env.TOSS_INAPP_SECRET_KEY || "";
    const encoded = Buffer.from(`${secretKey}:`).toString("base64");

    const res = await fetch("https://api.tosspayments.com/v2/tosspay/payments/execute", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payToken }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || "결제 실행 실패" }, { status: 400, headers: CORS });
    }

    return NextResponse.json({ success: true, paymentKey: data.paymentKey }, { headers: CORS });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500, headers: CORS });
  }
}
