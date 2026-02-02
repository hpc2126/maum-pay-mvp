"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LiquidTabBar from "@/components/LiquidTabBar";

const BG = "#E9E9E9";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

/**
 * ✅ 식권 태그 (인라인 SVG + 텍스트 overlay)
 * - iOS에서 SVG img가 흐려지는 케이스 회피
 * - filter(그림자) 제거해서 또렷하게
 * - 요청대로 1.5배 크기 (기본 57x36 → 86x54)
 */
function TicketTag() {
  const W = 86; // 57 * 1.5
  const H = 54; // 36 * 1.5

  return (
    <div
      className="relative select-none"
      style={{
        width: W,
        height: H,
        transformOrigin: "center",
        animation: "ticketPop 520ms cubic-bezier(.2,.9,.2,1) 1",
      }}
      aria-label="식권"
    >
      {/* SVG (필터 제거 버전) */}
      <svg
        width={W}
        height={H}
        viewBox="0 0 57 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path
          d="M3 3H52V12C47.5556 13.8519 47.5556 20.1481 52 22V31H3V22C7.44444 20.1481 7.44444 13.8519 3 12V3Z"
          fill="#FFD158"
        />
      </svg>

      {/* 텍스트를 '티켓 안'에 정확히 */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: "#6B5600",
          letterSpacing: "-0.02em",
        }}
      >
        식권
      </div>

      {/* subtle 발급 느낌: 좌우로 흔들지 말고 '가볍게 팝'만 */}
      <style jsx>{`
        @keyframes ticketPop {
          0% {
            transform: scale(0.92);
            opacity: 0;
          }
          60% {
            transform: scale(1.03);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default function MainPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

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
    <main
      className="mx-auto min-h-screen max-w-md"
      style={{
        background: BG,
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
      }}
    >
      {/* 상단 여백: status bar랑 너무 멀지 않게 */}
      <div className="px-5 pt-6">
        {/* ✅ 노란 메인카드 */}
        <section>
          <div
            className="rounded-[20px]"
            style={{
              width: "100%",
              background:
                "linear-gradient(0deg, #FFD158, #FFD158), linear-gradient(360deg, rgba(255, 255, 255, 0.3) 53.3%, rgba(255, 255, 255, 0.7) 100%)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              padding: 18,
            }}
          >
            {/* 상단 라인: 로고/식권 상단 패딩 ‘같게’ 맞춤 (items-center + 같은 라인 높이) */}
            <div
              className="flex items-center justify-between"
              style={{ height: 54 }} // TicketTag(54px)와 맞춰서 정렬 안정화
            >
              <img
                src="/assets/maumpay-logo.svg"
                alt="MaumPay"
                style={{
                  height: 18, // 로고 1.3배 줄인 느낌 유지
                  width: "auto",
                  display: "block",
                }}
              />

              <TicketTag />
            </div>

            {/* 금액 + > */}
            <div className="mt-2 flex items-center justify-end">
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#2F2F2F",
                  letterSpacing: "-0.02em",
                }}
              >
                {formatWon(balance)}
              </div>

              {/* 간격 너무 벌어지지 않게 */}
              <img
                src="/assets/chevron-right.svg"
                alt=">"
                style={{
                  width: 18,
                  height: 18,
                  marginLeft: 8,
                  opacity: 0.7,
                }}
              />
            </div>

            {/* 충전 | 송금 */}
            <div
              className="mt-3 flex items-center"
              style={{
                gap: 18,
                fontSize: 14, // 아주 살짝 키움
                fontWeight: 700,
                color: "rgba(0,0,0,0.45)",
              }}
            >
              <button type="button" className="active:opacity-70">
                충전
              </button>
              <span style={{ color: "rgba(0,0,0,0.25)" }}>|</span>
              <button type="button" className="active:opacity-70">
                송금
              </button>
            </div>

            {/* 마음 전하기 버튼 (카드 안쪽에 고정) */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => router.push("/scan")}
                className="w-full active:opacity-80"
                style={{
                  height: 55,
                  borderRadius: 14,
                  background: "#FFDC82",
                  border: "2px solid #FFE08E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#1B1B1B",
                }}
              >
                <img
                  src="/assets/send-heart.svg"
                  alt=""
                  aria-hidden="true"
                  style={{ width: 22, height: 22 }}
                />
                마음 전하기
              </button>
            </div>
          </div>
        </section>

        {/* ✅ 배너: “흰색 카드 1겹”만 */}
        <section className="mt-5">
          <div
            className="relative rounded-[22px]"
            style={{
              background: "#fff",
              height: 92, // 조금 낮춘 상태
              boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
            }}
          >
            <div
              className="absolute right-5 bottom-4"
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "rgba(0,0,0,0.35)",
              }}
            >
              1/10
            </div>
          </div>
        </section>

        {/* 아이콘 그리드 */}
        <section className="mt-5">
          <div
            className="rounded-[22px] bg-white p-5"
            style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.10)" }}
          >
            <div className="grid grid-cols-4 gap-x-6 gap-y-6">
              {shortcuts.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="flex flex-col items-center gap-2 active:opacity-70 focus:outline-none focus-visible:outline-none"
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "#D9D9D9",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "rgba(0,0,0,0.50)",
                      letterSpacing: "-0.02em",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <LiquidTabBar active={activeTab} onChange={setActiveTab} />
    </main>
  );
}