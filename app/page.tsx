// app/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LiquidTabBar from "../components/LiquidTabBar";
import TicketTag from "../components/TicketTag";

const BG = "#E9E9E9";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
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
      <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8 }}>
        {/* 노란 메인 카드 */}
        <section>
          <div
            style={{
              width: "100%",
              borderRadius: 20,
              background:
                "linear-gradient(0deg, #FFD158, #FFD158), linear-gradient(360deg, rgba(255, 255, 255, 0.3) 53.3%, rgba(255, 255, 255, 0.7) 100%)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              padding: 14, // ✅ 상단 패딩 더 좁게
            }}
          >
            {/* 로고 + 식권 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
  <img
    src="/assets/maumpay-logo.svg"
    alt="MaumPay"
    style={{ height: 22, width: "auto", display: "block" }}
    draggable={false}
  />
  <TicketTag />
</div>

            {/* 금액 + > */}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: "#2b2b2b",
                  letterSpacing: "-0.02em",
                }}
              >
                {formatWon(balance)}
              </div>
              <img
                src="/assets/chevron-right.svg"
                alt=">"
                width={18}
                height={18}
                style={{ opacity: 0.7, marginTop: 2 }}
                draggable={false}
              />
            </div>

            {/* 충전 | 송금 */}
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: "rgba(0,0,0,0.45)",
                fontWeight: 750,
                fontSize: 16,
              }}
            >
              <button type="button" style={{ border: 0, background: "transparent", padding: 0, font: "inherit", color: "inherit" }}>
                충전
              </button>
              <span style={{ opacity: 0.35 }}>|</span>
              <button type="button" style={{ border: 0, background: "transparent", padding: 0, font: "inherit", color: "inherit" }}>
                송금
              </button>
            </div>

            {/* 마음 전하기 버튼 */}
            <button
              type="button"
              onClick={() => router.push("/scan")}
              style={{
                marginTop: 12,
                width: "100%",
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
                color: "#222",
              }}
            >
              <img src="/assets/send-heart.svg" alt="" width={22} height={22} draggable={false} />
              마음 전하기
            </button>
          </div>
        </section>

        {/* 배너: 단일 카드 */}
        <section style={{ marginTop: 16 }}>
          <div
            style={{
              borderRadius: 22,
              background: "#fff",
              height: 106,
              boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: 18,
                bottom: 16,
                color: "#9a9a9a",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              1/10
            </div>
          </div>
        </section>

        {/* 그리드 카드 */}
        <section style={{ marginTop: 16 }}>
          <div
            style={{
              borderRadius: 22,
              background: "#fff",
              padding: 20,
              boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 18,
              }}
            >
              {shortcuts.map((label) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 18,
                      background: "#D9D9D9",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "rgba(0,0,0,0.55)",
                      textAlign: "center",
                      lineHeight: 1.2,
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