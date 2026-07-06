import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function makeAuth(): string {
  const apiKey = process.env.SOLAPI_API_KEY!;
  const apiSecret = process.env.SOLAPI_API_SECRET!;
  const date = new Date().toISOString();
  const salt = crypto.randomUUID();
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(date + salt)
    .digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const from = process.env.SOLAPI_SENDER_NUMBER;
  if (!apiKey || !apiSecret || !from) {
    return NextResponse.json({ ok: false, reason: "env missing" });
  }

  try {
    const { to, text } = await req.json();
    if (!to || !text) return NextResponse.json({ ok: false });

    const res = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: makeAuth(),
      },
      body: JSON.stringify({
        message: { to, from, text },
      }),
    });

    const data = await res.json();
    return NextResponse.json({ ok: res.ok, data });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
