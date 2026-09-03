import type { Metadata } from "next";
import DaewoonClient from "./DaewoonClient";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") qs.set(key, value);
    else if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
  }
  const query = qs.toString();
  const url = `https://jeomun.com/main-v2/daewoon${query ? `?${query}` : ""}`;

  return {
    openGraph: { url },
  };
}

export default function DaewoonPage() {
  return <DaewoonClient />;
}
