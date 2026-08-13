import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, date, phone, amount, package: pkg, categories, plan, discountCode, discountPercent, originalAmount, source, category } = body;
    const name = body.name && String(body.name).trim() ? String(body.name).trim() : "고객";
    if (!id || !amount) return NextResponse.json({ ok: false });
    await db.ref(`v2_direct_payments/${id}`).set({
      id, date, name,
      phone: phone || "",
      amount: Number(amount),
      package: pkg || "",
      categories: categories || [],
      plan: plan || "",
      discountCode: discountCode || "",
      discountPercent: discountPercent || 0,
      originalAmount: originalAmount || Number(amount),
      source: source || "",
      category: category || "",
    });

    // 에스더님 결제 알림 이메일 (실패해도 결제 저장은 성공 처리)
    const appLabel = source ? `[${source}]` : "";
    const itemLabel = category || pkg || (categories?.join(", ")) || plan || "운세";
    try {
      await resend.emails.send({
        from: "점운 <onboarding@resend.dev>",
        to: "junga6783@gmail.com",
        subject: `💳 결제 알림 ${appLabel} ${name}님 ₩${Number(amount).toLocaleString()}`,
        html: `
          <h2>💳 점운 결제 알림</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">이름</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">전화번호</td><td style="padding:8px;border:1px solid #ddd">${phone || "-"}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">결제 앱</td><td style="padding:8px;border:1px solid #ddd">${source || "사주"}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">상품</td><td style="padding:8px;border:1px solid #ddd">${itemLabel}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">결제금액</td><td style="padding:8px;border:1px solid #ddd;color:#7c3aed;font-weight:bold">₩${Number(amount).toLocaleString()}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">시각</td><td style="padding:8px;border:1px solid #ddd">${new Date().toLocaleString("ko-KR")}</td></tr>
          </table>
          <p style="margin-top:16px">👉 <a href="https://jeomun.com/admin/direct-payments">어드민에서 확인하기</a></p>
        `,
      });
    } catch (emailErr) {
      console.error("결제 알림 이메일 발송 실패:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
