"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

const BG = "#E9E9E9";
const YELLOW = "#F4C84B";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

/** 와이어프레임 느낌 "식권" 티켓 태그 */
function MealTicketTag() {
  return (
    <div className="relative inline-flex items-center">
      {/* 티켓 본체 */}
      <div
        className="relative inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-[#6B5600]"
        style={{
          background: "linear-gradient(180deg, #FFE08A 0%, #F4C84B 100%)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.65)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
          paddingRight: 18, // 오른쪽 노치 공간
        }}
      >
        식권
      </div>

      {/* 오른쪽 노치(파임) */}
      <span
        className="absolute right-[6px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.0)" }}
      />
      <span
        className="absolute right-[6px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full"
        style={{
          background: BG,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      />

      {/* 왼쪽 절취(작은 홈들) */}
      <div className="pointer-events-none absolute left-[6px] top-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="block h-[2px] w-[10px] rounded-full"
              style={{ backgroundColor: "rgba(107,86,0,0.20)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 하단바 홈 아이콘: QR처럼 보이지만 홈(활성) */
function HomeNavIcon({ active }: { active?: boolean }) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-2xl"
      style={{
        background: active
          ? "linear-gradient(180deg, #FFE08A 0%, #F4C84B 100%)"
          : "transparent",
        boxShadow: active ? "0 10px 22px rgba(0,0,0,0.12)" : "none",
      }}
    >
      <div className="grid grid-cols-3 gap-[3px]" style={{ transform: "scale(0.95)" }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="block h-[6px] w-[6px] rounded-[2px]"
            style={{
              backgroundColor: active ? "#111" : "#B5B5B5",
              opacity: [0, 2, 6].includes(i) ? 1 : 0.55,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MainPage() {
  const router = useRouter();
  const balance = 300_000;

  const shortcuts = useMemo(
    () => [
      "웨딩 신청",
      "웨딩홀 예약",
      "스태프 특가",
      "상견례",
      "가전 혼수",
      "예물 예단",
      "다이어트",
      "신혼 여행",
    ],
    []
  );

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-5 pt-8 pb-8">
      {/* 상단(와이어프레임: 밖에도 로고가 있지만, 너 말대로 카드 안에 로고가 있어야 하니 상단은 최소화) */}
      <header className="h-4" />

      {/* 메인 카드 */}
      <section className="mt-2">
        {/* 카드 stroke(테두리) */}
        <div
          className="relative rounded-[26px] p-[1.5px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 30%, rgba(0,0,0,0.06) 100%)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
          }}
        >
          {/* 카드 내부 배경 */}
          <div
            className="rounded-[25px] px-5 py-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.60) 55%, rgba(255,255,255,0.42) 100%)",
              backdropFilter: "blur(6px)",
            }}
          >
            {/* 카드 상단: 로고 + 식권태그(카드 안!) */}
            <div className="flex items-start justify-between">
              <img src="/assets/logo.svg" alt="MaumPay" className="h-7 w-auto" />
              <MealTicketTag />
            </div>

            {/* 금액(우측 정렬 + >) */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <div className="text-2xl font-extrabold text-[#333]">{formatWon(balance)}</div>
              <div className="text-2xl font-bold text-[#9A9A9A]">›</div>
            </div>

            {/* 충전 | 송금 + 마음 전하기 */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-5 text-sm font-semibold text-[#7A7A7A]">
                <button type="button" className="active:opacity-70">
                  충전
                </button>
                <span className="text-[#C8C8C8]">|</span>
                <button type="button" className="active:opacity-70">
                  송금
                </button>
              </div>

              <button
                type="button"
                onClick={() => router.push("/scan")}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white active:opacity-80"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(35,35,35,0.95) 0%, rgba(17,17,17,0.95) 100%)",
                  boxShadow: "0 14px 28px rgba(0,0,0,0.18)",
                }}
              >
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <span className="text-base leading-none">▦</span>
                </span>
                마음 전하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 배너 (와이어프레임처럼 작게/얇게) */}
      <section className="mt-5">
        <div className="relative overflow-hidden rounded-[22px] bg-[#CFCFCF] px-5 py-4">
          {/* 얇은 배너 영역 */}
          <div className="h-10 w-full rounded-[16px] bg-[#BEBEBE]" />
          <div className="absolute bottom-3 right-4 text-xs font-semibold text-[#666]">
            1/10
          </div>
        </div>
      </section>

      {/* 아이콘 그리드 */}
      <section className="mt-5">
        <div className="rounded-[22px] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
          <div className="grid grid-cols-4 gap-x-6 gap-y-6">
            {shortcuts.map((label) => (
              <button
                key={label}
                type="button"
                className="flex flex-col items-center gap-2 active:opacity-70"
              >
                <div className="h-12 w-12 rounded-xl bg-[#D9D9D9]" />
                <div className="text-xs font-semibold text-[#7A7A7A]">{label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 하단 바 (첫번째=홈 표현, 스캐너 아님) */}
      <nav className="mt-6">
        <div
          className="flex items-center justify-between rounded-[22px] bg-white px-6 py-3"
          style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.10)" }}
        >
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1"
          >
            <HomeNavIcon active />
          </button>

          <button type="button" className="flex flex-col items-center gap-1 active:opacity-70">
            <div className="h-8 w-8 rounded-xl bg-transparent" />
            <div className="text-xs font-semibold text-[#7A7A7A]">청첩장</div>
          </button>

          <button type="button" className="flex flex-col items-center gap-1 active:opacity-70">
            <div className="h-8 w-8 rounded-xl bg-transparent" />
            <div className="text-xs font-semibold text-[#7A7A7A]">스토어</div>
          </button>

          <button type="button" className="flex flex-col items-center gap-1 active:opacity-70">
            <div className="h-8 w-8 rounded-xl bg-transparent" />
            <div className="text-xs font-semibold text-[#7A7A7A]">MY</div>
          </button>
        </div>
      </nav>
    </main>
  );
}