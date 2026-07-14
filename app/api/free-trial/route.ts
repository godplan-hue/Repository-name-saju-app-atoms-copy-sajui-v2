import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const normalizePhone = (p: string) => p.replace(/\D/g, "");

// POST: 무료체험 1회 사용 처리
// body: { phone, app, name?, email? }
// returns: { ok, alreadyUsed }
export async function POST(req: NextRequest) {
  try {
    const { phone, app, name, email } = await req.json();
    if (!phone || !app) return NextResponse.json({ ok: false, error: "missing fields" });
    const ph = normalizePhone(phone);
    if (ph.length < 10) return NextResponse.json({ ok: false, error: "invalid phone" });

    const ref = db.ref(`free_trials/${ph}/${app}`);
    const snap = await ref.get();

    if (snap.exists()) {
      return NextResponse.json({ ok: true, alreadyUsed: true });
    }

    // 첫 사용 → 기록 저장
    await ref.set(true);

    // 무료 리드 DB에도 저장
    const leadRef = db.ref(`free_leads/${app}_free`).push();
    await leadRef.set({
      phone: ph,
      name: name || "",
      email: email || "",
      app,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, alreadyUsed: false });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}

// GET: 무료체험 사용 여부 확인
// ?phone=xxx&app=haemong
export async function GET(req: NextRequest) {
  try {
    const phone = req.nextUrl.searchParams.get("phone");
    const app = req.nextUrl.searchParams.get("app");
    if (!phone || !app) return NextResponse.json({ ok: false });
    const ph = normalizePhone(phone);
    const snap = await db.ref(`free_trials/${ph}/${app}`).get();
    return NextResponse.json({ ok: true, alreadyUsed: snap.exists() });
  } catch {
    return NextResponse.json({ ok: true, alreadyUsed: false });
  }
}
