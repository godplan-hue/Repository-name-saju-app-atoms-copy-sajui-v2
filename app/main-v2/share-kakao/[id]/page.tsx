import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/firebase";
import KakaoShareClient from "./KakaoShareClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const snap = await db.ref(`sharedResults/${id}`).once("value");
    const entry = snap.val();
    if (!entry) return { title: "점운 - 사주 결과" };
    const isPartner = !!entry.businessName;
    const appName = isPartner ? entry.businessName : "점운";
    const title = `${entry.name}님의 사주 분석 결과 - ${appName}`;
    const description = isPartner
      ? `총운 ${entry.scores?.total ?? "?"}점! AI 사주 분석 결과`
      : `총운 ${entry.scores?.total ?? "?"}점! 나도 무료로 사주 보기 👉 jeomun.com`;
    return {
      title,
      description,
      openGraph: { title, description, images: ["https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg"] },
    };
  } catch {
    return { title: "점운 - 사주 결과" };
  }
}

export default async function KakaoSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // 봇(카카오·소셜 미리보기)이 아닌 실제 사용자는 결과지로 서버사이드 즉시 이동
  // → share-kakao URL이 브라우저 히스토리에 절대 남지 않음
  const headersList = await headers();
  const ua = (headersList.get("user-agent") || "").toLowerCase();
  const isBot = /bot|crawl|scrap|spider|facebook|slack|discord|telegram|preview|kakaotalk-scrap|kakaostory-scrap/i.test(ua);
  if (!isBot) redirect(`/main-v2/result?sid=${id}`);
  return <KakaoShareClient id={id} />;
}
