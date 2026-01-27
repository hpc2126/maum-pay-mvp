"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Side } from "@/lib/theme";

const BLUE = "#275DBA";
const YELLOW = "#F4C84B";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function toNumberSafe(s: string) {
  const x = Number(s);
  return Number.isFinite(x) ? x : 0;
}

function formatShortKrw(amount: number) {
  if (amount <= 0) return "";
  if (amount % 10_000 === 0) return `${amount / 10_000}만원`;
  return formatWon(amount);
}

export default function GuestAmountPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const side = (sp.get("side") as Side) || "groom";
  const hostCode = sp.get("hostCode") || "";

  // MVP 기본값 (나중에 host 조회 붙이면 교체)
  const weddingDateText = sp.get("date") || "2025/12/20일(토)";
  const venueText = sp.get("venue") || "마음호텔 그랜드볼룸홀 12:00";

  const personName = sp.get("person") || (side === "groom" ? "이몽룡" : "성춘향");
  const roleText = side === "groom" ? "신랑" : "신부";
  const parentsText = sp.get("parents") || "부 홍상직 · 모 옥영향";

  const [digits, setDigits] = useState<string>("");
  const amount = useMemo(() => toNumberSafe(digits), [digits]);

  const add = (delta: number) => {
    const next = Math.min(amount + delta, 999_999_999);
    setDigits(String(next));
  };

  const pressDigit = (d: string) => {
    if (d === "back") return;
    const next = (digits + d).replace(/^0+/, "");
    if (next.length > 9) return;
    setDigits(next);
  };

  const backspace = () => setDigits((prev) => prev.slice(0, -1));
  const clearAll = () => setDigits("");

  const goNext = () => {
    if (!hostCode) return router.push("/error/invalid");
    if (amount <= 0) return;

    const q = new URLSearchParams({
      side,
      hostCode,
      amount: String(amount),
      date: weddingDateText,
      venue: venueText,
      person: personName,
      parents: parentsText,
    });

    router.push(`/guest/sender?${q.toString()}`);
  };

  const quickAdds = [
    { label: "+1만", value: 10_000 },
    { label: "+5만", value: 50_000 },
    { label: "+10만", value: 100_000 },
    { label: "+100만", value: 1_000_000 },
  ] as const;

  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "back"] as const;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-6 pt-10 pb-10">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D6D6D6] text-sm font-semibold text-[#7A7A7A]">
          1
        </span>
        <span className="rounded-full bg-[#F4C84B] px-4 py-1 text-sm font-semibold text-[#111]">
          Step2
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D6D6D6] text-sm font-semibold text-[#7A7A7A]">
          3
        </span>
      </div>

      {/* Date & venue */}
      <div className="mt-12">
        <div className="text-2xl font-semibold tracking-tight text-[#7A7A7A]">
          {weddingDateText}
        </div>
        <div className="mt-2 text-lg font-medium text-[#8A8A8A]">
          {venueText}
        </div>

        <div className="mt-5 h-px w-full bg-[#D3D3D3]" />

        {/* Target */}
        <div className="mt-6 text-3xl font-semibold leading-tight">
          <span style={{ color: BLUE }}>
            {personName} {roleText}
          </span>
          <span className="font-medium text-[#8A8A8A]">님에게</span>
        </div>

        <div className="mt-2 text-lg font-medium text-[#9A9A9A]">{parentsText}</div>

        {/* ✅ 질문 ↔ 금액 전환 + 요약 + 다음 */}
        <div className="mt-12">
          {amount <= 0 ? (
            // 입력 전: 질문만
            <div className="text-3xl font-semibold tracking-tight text-[#8A8A8A]">
              얼마나 전할까요?
            </div>
          ) : (
            // 입력 후: 질문 자리 → 금액
            <div>
              <div className="flex items-center justify-between gap-3">
                {/* 금액: 질문과 동일 크기/두께 */}
                <div className="text-3xl font-semibold tracking-tight text-[#111]">
                  {formatWon(amount)}
                </div>

                {/* 초기화(리셋) */}
                <button
                  type="button"
                  onClick={clearAll}
                  aria-label="금액 초기화"
                  title="초기화"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D6D6D6] text-[#555] active:opacity-70"
                >
                  <span className="text-2xl leading-none">↺</span>
                </button>
              </div>

              <div className="mt-3 text-x1 font-medium text-[#8A8A8A]">
                {formatShortKrw(amount)}
              </div>

              <button
                onClick={goNext}
                style={{ backgroundColor: YELLOW }}
                className="mt-10 h-16 w-full rounded-3xl text-xl font-bold text-[#111] active:opacity-80"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick add */}
      <div className="mt-10 grid grid-cols-4 gap-3">
        {quickAdds.map((q) => (
          <button
            key={q.label}
            onClick={() => add(q.value)}
            className="rounded-2xl bg-[#DADADA] py-3 text-sm font-semibold text-[#6E6E6E] active:opacity-70"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Keypad */}
      <div className="mt-10 grid grid-cols-3 gap-y-10">
        {keypad.map((k: (typeof keypad)[number]) => (
          <button
            key={k}
            onClick={() => {
              if (k === "back") backspace();
              else pressDigit(k);
            }}
            className="h-14 select-none text-5xl font-medium text-[#111] active:opacity-60"
            aria-label={k === "back" ? "backspace" : `digit-${k}`}
          >
            {k === "back" ? "←" : k}
          </button>
        ))}
      </div>
    </main>
  );
}