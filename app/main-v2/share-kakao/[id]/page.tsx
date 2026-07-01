import type { Metadata } from "next";
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
    const image = "https://i.pinimg.com/1200x/21/92/2c/21922cc59f29ba66e12cc4546e316079.jpg";
    return {
      title,
      description,
      openGraph: { title, description, images: [image] },
    };
  } catch {
    return { title: "점운 - 사주 결과" };
  }
}

export default async function KakaoSharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <KakaoShareClient id={id} />;
}
