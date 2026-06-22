import type { Metadata } from "next";
import { db } from "@/lib/firebase";
import ShareClient from "./ShareClient";

// 카카오톡 등에서 링크를 공유하면 미리보기 카드를 만들 때 이 메타데이터를
// 읽는데, 클라이언트 컴포넌트만 있으면 첫 응답 HTML에 제목/설명이 없어서
// 빈 링크로만 보임 — 서버에서 미리 결과를 읽어와 제목/설명을 채워줌
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const snap = await db.ref(`sharedResults/${id}`).once("value");
    const entry = snap.val();
    if (!entry) return { title: "점운 - 사주 결과" };
    const brand = entry.businessName || "점운";
    const catLabels = (entry.categories ?? []).map((c: any) => c.label).join(", ");
    const title = `🔮 ${entry.name}님의 사주 분석 결과 - ${brand}`;
    const description = `총운 ${entry.scores?.total ?? "?"}점! ${catLabels} 분석까지 한눈에 확인하세요.\nAI가 정밀하게 읽어내는 사주 분석, ${brand}에서 받아보세요 👉`;
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

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShareClient id={id} />;
}
