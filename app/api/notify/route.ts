import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const TEMPLATE_ID = "KA01TP260707074506936mbBzxpn4qkL";
const CHANNEL_ID  = "KA01PF260706125302467VRdBJa7q3Us";

function makeAuth(apiKey: string, apiSecret: string): string {
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const signature = crypto.createHmac("sha256", apiSecret).update(date + salt).digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const { phone, amount, histId, partnerName } = await request.json();
    if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

    const apiKey    = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("Solapi env missing");
      return NextResponse.json({ error: "Solapi config missing" }, { status: 500 });
    }

    const link = histId
      ? `https://jeomun.com/main-v2/history/${histId}`
      : "https://jeomun.com/main-v2/history";

    const res = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": makeAuth(apiKey, apiSecret),
      },
      body: JSON.stringify({
        message: {
          to: String(phone).replace(/\D/g, ""),
          kakaoOptions: {
            pfId: CHANNEL_ID,
            templateId: TEMPLATE_ID,
            variables: {
              "#{파트너명}": partnerName || "점운",
              "#{금액}": String(amount ?? 0),
              "#{링크}": link,
            },
          },
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Solapi send error:", JSON.stringify(data));
      return NextResponse.json({ error: "알림톡 발송 실패", detail: data }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify route error:", error);
    return NextResponse.json({ error: "발송 오류" }, { status: 500 });
  }
}
