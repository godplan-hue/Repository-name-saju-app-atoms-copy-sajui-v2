import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, link, partnerName } = await req.json();
    if (!phone) return NextResponse.json({ ok: false });

    const cleanPhone = (phone as string).replace(/\D/g, "");
    if (cleanPhone.length < 10) return NextResponse.json({ ok: false });

    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const pfId = process.env.SOLAPI_PF_ID;
    const templateId = process.env.SOLAPI_TEMPLATE_ID;

    if (!apiKey || !apiSecret || !pfId || !templateId) {
      return NextResponse.json({ ok: false, error: "missing env" });
    }

    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString("hex");
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(date + salt)
      .digest("hex");

    const resultLink = link || "https://jeomun.com/main-v2/history";

    const body = {
      message: {
        to: cleanPhone,
        kakaoOptions: {
          pfId,
          templateId,
          variables: {
            "#{금액}": String(amount || ""),
            "#{링크}": resultLink,
          },
        },
      },
    };

    const solapiRes = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `HMAC-SHA256 ApiKey=${apiKey}, Date=${date}, salt=${salt}, signature=${signature}`,
      },
      body: JSON.stringify(body),
    });

    const data = await solapiRes.json();
    return NextResponse.json({ ok: solapiRes.ok, data });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
