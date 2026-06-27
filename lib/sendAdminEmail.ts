import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "junga6783@gmail.com";

export async function sendAdminEmail(subject: string, body: string) {
  try {
    await resend.emails.send({
      from: "점운 알림 <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject,
      text: body,
    });
  } catch (e) {
    console.error("Admin email failed:", e);
  }
}
