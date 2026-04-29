"use client";

import dynamic from "next/dynamic";
import { FormEvent, useState } from "react";
import { Check, FileX, Flame, HelpCircle, RotateCcw } from "lucide-react";
import { supabase } from "../lib/supabase";

const HeroGlobe = dynamic(() => import("@/components/HeroGlobe"), {
  ssr: false,
  loading: () => (
    <div
      className="mx-auto aspect-square w-full max-w-[200px] rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/15 blur-sm md:max-w-[260px] lg:max-w-[320px]"
      aria-hidden
    />
  ),
});

type SaveStatus = "idle" | "success" | "error";

const glassCard =
  "rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),inset_0_-1px_0_0_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-300 md:backdrop-blur-xl";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      alert("이메일을 입력해주세요");
      return;
    }

    setIsSaving(true);
    setSaveStatus("idle");

    const { error } = await supabase
      .from("generations")
      .insert({ email: trimmedEmail });

    if (error) {
      setSaveStatus("error");
      setIsSaving(false);
      return;
    }

    setSaveStatus("success");
    setEmail("");
    setIsSaving(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030014] text-[#F5F5F5] antialiased">
      {/* 배경: 홀로그램 틴트 + 라디얼 + 블롭 */}
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(124,58,237,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_60%,rgba(59,130,246,0.08),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_15%_75%,rgba(236,72,153,0.07),transparent_50%)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-[18%] top-[18%] h-[42vmin] w-[42vmin] rounded-full bg-purple-600/12 blur-2xl sm:blur-3xl animate-[float-y_20s_ease-in-out_infinite]" />
        <div className="absolute -right-[12%] top-[40%] h-[38vmin] w-[38vmin] rounded-full bg-blue-600/10 blur-2xl sm:blur-3xl animate-[float-y_16s_ease-in-out_infinite] [animation-delay:2s]" />
        <div className="absolute bottom-[5%] left-[25%] h-[36vmin] w-[36vmin] rounded-full bg-pink-600/8 blur-2xl sm:blur-3xl animate-[float-y_22s_ease-in-out_infinite] [animation-delay:1s]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 히어로 */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30 opacity-90"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[min(90vw,28rem)] -translate-x-1/2 rounded-full bg-purple-500/25 blur-3xl opacity-30 md:h-96 md:w-[36rem]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-32 right-[8%] h-56 w-56 rounded-full bg-pink-500/20 blur-3xl opacity-25 md:top-40"
            aria-hidden
          />

          <div className="relative z-10 grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-300 backdrop-blur-sm md:backdrop-blur-md">
                <Flame className="size-3.5 shrink-0 text-purple-300" aria-hidden />
                오늘만 무료 1회 제공
              </p>
              <h1 className="mt-7 break-keep break-words text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-white">아이디어는 많은데,</span>
                <span className="mt-1 block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent sm:mt-0.5">
                  왜 돈이 안 될까요?
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[#A1A1AA] md:mt-7 md:text-xl lg:mx-0">
                당신의 경험을 수익 구조로 바꿔주는 AI 엔진
              </p>
            </div>

            <div className="hidden justify-center md:flex lg:justify-end">
              <div className="relative">
                <div
                  className="absolute inset-0 -m-10 scale-110 rounded-full bg-gradient-to-tr from-purple-500/35 via-blue-500/25 to-pink-500/30 blur-2xl sm:blur-3xl md:-m-14"
                  aria-hidden
                />
                <div
                  className="absolute left-1/2 top-1/2 h-[min(100%,22rem)] w-[min(100%,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/15 blur-3xl"
                  aria-hidden
                />
                <div className="relative z-10">
                  <HeroGlobe />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 문제 공감 */}
        <section className="py-20 md:py-28">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
            혹시 이런 고민 있으신가요?
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article
              className={`group ${glassCard} p-6 hover:shadow-[0_0_48px_-12px_rgba(168,85,247,0.28)]`}
            >
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-purple-500/10 text-purple-300 transition-colors duration-300 group-hover:text-purple-200">
                <FileX className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="mt-4 text-base font-semibold leading-snug text-[#F5F5F5]">
                콘텐츠는 많은데 수익이 없다
              </p>
            </article>
            <article
              className={`group ${glassCard} p-6 hover:shadow-[0_0_48px_-12px_rgba(244,114,182,0.22)]`}
            >
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-pink-500/10 text-pink-300 transition-colors duration-300 group-hover:text-pink-200">
                <HelpCircle className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="mt-4 text-base font-semibold leading-snug text-[#F5F5F5]">
                뭘 팔아야 할지 모르겠다
              </p>
            </article>
            <article
              className={`group ${glassCard} p-6 hover:shadow-[0_0_48px_-12px_rgba(96,165,250,0.25)]`}
            >
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-blue-500/10 text-blue-300 transition-colors duration-300 group-hover:text-blue-200">
                <RotateCcw className="size-5" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="mt-4 text-base font-semibold leading-snug text-[#F5F5F5]">
                구조 없이 계속 시도만 한다
              </p>
            </article>
          </div>
        </section>

        {/* 해결 */}
        <section className="py-20 md:py-28">
          <div
            className={`${glassCard} px-6 py-14 text-center hover:shadow-[0_0_56px_-14px_rgba(167,139,250,0.2)] sm:px-10 md:px-14 md:py-16`}
          >
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
              이제 고민할 필요 없습니다
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#A1A1AA] md:text-xl">
              AI가 당신의 상황에 맞게{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-medium text-transparent">
                &apos;돈 되는 구조&apos;
              </span>
              를 설계해드립니다
            </p>
          </div>
        </section>

        {/* 혜택 */}
        <section className="py-20 md:py-28">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            당신이 받게 될 것
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {(
              [
                { label: "수익화 아이템 자동 생성 (3가지)", tone: "purple" as const },
                { label: "가격 전략 설계", tone: "pink" as const },
                { label: "랜딩페이지 핵심 문구", tone: "blue" as const },
                { label: "판매 퍼널 설계", tone: "purple" as const },
              ] as const
            ).map(({ label, tone }) => {
              const glow =
                tone === "purple"
                  ? "hover:shadow-[0_0_44px_-10px_rgba(168,85,247,0.28)]"
                  : tone === "pink"
                    ? "hover:shadow-[0_0_44px_-10px_rgba(244,114,182,0.22)]"
                    : "hover:shadow-[0_0_44px_-10px_rgba(96,165,250,0.26)]";
              const iconBg =
                tone === "purple"
                  ? "border-purple-400/20 bg-purple-500/15 text-purple-200"
                  : tone === "pink"
                    ? "border-pink-400/20 bg-pink-500/15 text-pink-200"
                    : "border-blue-400/20 bg-blue-500/15 text-blue-200";
              return (
                <li
                  key={label}
                  className={`${glassCard} flex items-start gap-4 p-6 ${glow}`}
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${iconBg} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]`}
                  >
                    <Check className="size-4" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="text-base font-semibold leading-snug text-[#F5F5F5] md:text-lg">
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* CTA */}
        <section className="py-20 md:pb-28 md:pt-8">
          <div
            className={`${glassCard} px-6 py-12 hover:shadow-[0_0_60px_-12px_rgba(192,132,252,0.22)] sm:px-10 sm:py-14`}
          >
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                지금 바로 수익 구조 만들기
              </h2>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                이메일만 남기면 결과를 받을 수 있어요 · 결과 받기
              </p>
              <form
                className="mt-8 flex flex-col gap-4 text-left"
                onSubmit={handleSubmit}
              >
                <label htmlFor="email" className="sr-only">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="이메일 주소"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-[#F5F5F5] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-zinc-500 focus:border-purple-400/40 focus:ring-2 focus:ring-purple-500/25 md:backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-900/30 transition-all duration-300 hover:from-purple-400 hover:to-pink-400 hover:shadow-2xl hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none disabled:hover:from-purple-500 disabled:hover:to-pink-500"
                >
                  {isSaving ? (
                    "저장 중..."
                  ) : (
                    <span className="flex flex-col items-center gap-0.5">
                      <span>지금 바로 수익 구조 만들기</span>
                      <span className="text-xs font-medium text-white/90">
                        결과 받기
                      </span>
                    </span>
                  )}
                </button>
                {saveStatus === "success" && (
                  <p className="text-center text-sm font-medium text-emerald-400/95">
                    ✅ 저장됐어요! 감사합니다
                  </p>
                )}
                {saveStatus === "error" && (
                  <p className="text-center text-sm font-medium text-rose-400/95">
                    ❌ 오류가 발생했어요
                  </p>
                )}
                <p className="text-center text-xs text-[#A1A1AA]">
                  오늘만 무료 1회 제공 · 이후 유료 전환
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* 신뢰 */}
        <section className="py-16 text-center md:py-20">
          <p className="text-lg font-semibold text-white md:text-xl">
            이미 검증된 시장
          </p>
          <p className="mx-auto mt-3 max-w-lg text-pretty text-sm leading-relaxed text-[#A1A1AA] md:text-base">
            Jasper, Copy.ai 같은 글로벌 AI 툴이 증명한 시장입니다
          </p>
        </section>
      </div>
    </div>
  );
}
