"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Side } from "@/lib/theme";
import { QRCodeCanvas } from "qrcode.react";

const BLUE = "#275DBA";
const YELLOW = "#FFD158";

function safe(s: string | null) {
  return (s ?? "").trim();
}

export default function GuestTicketPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const side = (sp.get("side") as Side) || "groom";
  const hostCode = safe(sp.get("hostCode")) || "TEST01";
  const amount = Number(safe(sp.get("amount")) || "0");
  const senderName = safe(sp.get("senderName")) || "김강우";
  const relation = safe(sp.get("relation"));

  const dateOneLine = safe(sp.get("date")) || "2025년 12월 20일 (토) 12:00";
  const hostTitle =
    safe(sp.get("hostTitle")) || (side === "groom" ? "이몽룡 신랑측" : "성춘향 신부측");
  const hallLabel = safe(sp.get("hall")) || "7층 연회장";
  const mealTime = safe(sp.get("mealTime")) || "12:00-14:00";

  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);

  const qrPayload = useMemo(() => {
    const payload = {
      v: 1,
      type: "MEAL_TICKET",
      side,
      hostCode,
      amount,
      senderName: senderName || undefined,
      relation: relation || undefined,
      adult,
      child,
    };
    return JSON.stringify(payload);
  }, [side, hostCode, amount, senderName, relation, adult, child]);

  const close = () => router.push("/");

  const watermarkText = useMemo(() => {
    const t = senderName.length ? senderName : "김강우";
    // 얇게 갈 거라 글자 크기 줄이고 반복량으로 꽉 채움
    return new Array(80).fill(t).join("  ");
  }, [senderName]);

  const dec = (setter: Dispatch<SetStateAction<number>>) =>
  setter((v) => Math.max(0, v - 1));

const inc = (setter: Dispatch<SetStateAction<number>>) =>
  setter((v) => Math.min(9, v + 1));
  const numberColor = (n: number) => (n <= 0 ? "#CFCFCF" : "#333");

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-5 pt-10 pb-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <img src="/assets/logo.svg" alt="MaumPay" className="h-7 w-auto" />
        <button
          onClick={close}
          className="flex h-12 w-12 items-center justify-center rounded-full text-4xl leading-none text-[#333] active:opacity-60"
          aria-label="close"
        >
          ×
        </button>
      </header>

      {/* ✅ 베이스는 사각형, 티켓 요소(노치/절취선)는 유지 */}
      <section className="mt-8 overflow-hidden bg-white shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
        {/* 날짜 */}
        <div className="px-7 pt-10 pb-7 text-center">
          <div className="text-[28px] font-extrabold text-[#333] whitespace-nowrap">
            {dateOneLine}
          </div>
        </div>

        {/* ✅ 티켓 절취선 + 좌우 노치(반원) 복구 */}
        <div className="relative">
          <div className="mx-7 border-t border-dashed border-[#D9D9D9]" />
          <div className="absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 -translate-x-1/2 rounded-full bg-[#E9E9E9]" />
          <div className="absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#E9E9E9]" />
        </div>

        {/* QR + Info */}
        <div className="px-7 py-8">
          {/* ✅ 2) QR과 타이틀을 상단 정렬 */}
          <div className="flex items-start gap-6">
            {/* QR: 스샷 크기 감(너무 작지 않게 160) */}
            <div className="shrink-0 rounded-2xl bg-white p-1">
              <QRCodeCanvas value={qrPayload} size={160} />
            </div>

            <div className="min-w-0 pt-1">
              {/* 타이틀 */}
              <div
                className="text-2xl font-extrabold leading-tight"
                style={{ color: BLUE }}
              >
                {hostTitle}
              </div>

              {/* ✅ 3) 연회시간 뱃지 작게 */}
              <div className="mt-4 text-2xl font-extrabold text-[#333] whitespace-nowrap">
  14:00까지 유효
</div>

              {/* ✅ 4) 7층 연회장: 라운드 제거 + 스샷처럼 단단한 박스 */}
              <div className="mt-4 inline-flex items-center bg-[#E6E6E6] px-3 py-3 text-3xl font-extrabold text-[#333] whitespace-nowrap">
                {hallLabel}
              </div>
            </div>
          </div>

          {/* ✅ 5) 워터마크: 훨씬 얇게 */}
          <div className="mt-8 overflow-hidden bg-[#222]">
            <div className="marquee">
              <div className="track">
                <span className="chunk">{watermarkText}</span>
                <span className="chunk" aria-hidden="true">
                  {watermarkText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 절취선 + 노치 */}
        <div className="relative">
          <div className="mx-7 border-t border-dashed border-[#D9D9D9]" />
          <div className="absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 -translate-x-1/2 rounded-full bg-[#E9E9E9]" />
          <div className="absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#E9E9E9]" />
        </div>

        {/* 수량 */}
        <div className="px-7 py-10">
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div className="pl-3 text-3xl font-extrabold text-[#333]">대인</div>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => dec(setAdult)}
                  className="h-10 w-10 rounded-xl bg-[#D9D9D9] text-2xl font-bold text-[#555555] active:opacity-70"
                >
                  −
                </button>
                <div
                  className="w-12 text-center text-6xl font-extrabold"
                  style={{ color: numberColor(adult) }}
                >
                  {adult}
                </div>
                <button
                  onClick={() => inc(setAdult)}
                  className="h-10 w-10 rounded-xl bg-[#D9D9D9] text-2xl font-bold text-[#555555] active:opacity-70"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mx-auto h-px w-full bg-[#E6E6E6]" />

            <div className="flex items-center justify-between">
              <div className="pl-3 text-3xl font-extrabold text-[#333]">소인</div>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => dec(setChild)}
                  className="h-10 w-10 rounded-xl bg-[#D9D9D9] text-2xl font-bold text-[#555555] active:opacity-70"
                >
                  −
                </button>
                <div
                  className="w-12 text-center text-6xl font-extrabold"
                  style={{ color: numberColor(child) }}
                >
                  {child}
                </div>
                <button
                  onClick={() => inc(setChild)}
                  className="h-10 w-10 rounded-xl bg-[#D9D9D9] text-2xl font-bold text-[#555555] active:opacity-70"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* ✅ 워터마크를 훨씬 얇게 */
        .marquee {
          width: 100%;
          overflow: hidden;
          padding: 6px 0; /* 더 얇게 */
        }

        .track {
          display: flex;
          width: max-content;
          animation: marqueeMove 10.5s linear infinite;
        }

        .chunk {
          display: inline-block;
          padding-left: 14px;
          font-weight: 900;
          font-size: 26px; /* 텍스트도 줄임 */
          color: ${YELLOW};
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        @keyframes marqueeMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </main>
  );
}