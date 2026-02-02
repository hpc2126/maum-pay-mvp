"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BG = "#E9E9E9";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function TabIcon({
  name,
  active,
}: {
  name: "home" | "note" | "mail" | "bag" | "user";
  active?: boolean;
}) {
  const stroke = active ? "#111" : "rgba(0,0,0,0.45)";
  const fill = "none";
  const size = 20;

  switch (name) {
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
          <path d="M3 11.5L12 4l9 7.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 10.5V20h11V10.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "note":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
          <path d="M7 3h10a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 8h8M9 12h8M9 16h6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "mail":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
          <path d="M4 6h16v12H4z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <path d="M4.5 6.5 12 12l7.5-5.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "bag":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
          <path d="M6 8h12l-1 13H7L6 8Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 8a3 3 0 0 1 6 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "user":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          <path d="M4 20c1.7-3.2 5-5 8-5s6.3 1.8 8 5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

function LiquidTabBar({
  active,
  onChange,
}: {
  active: number;
  onChange: (idx: number) => void;
}) {
  const tabs = useMemo(
    () => [
      { key: "home", label: "홈", icon: "home" as const },
      { key: "ledger", label: "장부", icon: "note" as const },
      { key: "invitation", label: "청첩장", icon: "mail" as const },
      { key: "store", label: "스토어", icon: "bag" as const },
      { key: "my", label: "MY", icon: "user" as const },
    ],
    []
  );

  const shellRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const measure = () => {
    const shell = shellRef.current;
    const btn = btnRefs.current[active];
    if (!shell || !btn) return;

    const s = shell.getBoundingClientRect();
    const b = btn.getBoundingClientRect();

    const innerW = Math.max(78, Math.min(110, b.width * 0.78));
    const center = b.left - s.left + b.width / 2;

    setPill({ left: center, width: innerW });
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 flex justify-center">
      <div
        className="w-full max-w-md px-5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
      >
        <div className="relative">
          <div
            ref={shellRef}
            className="relative overflow-hidden rounded-[30.5px]"
            style={{
              height: 61,
              background: "rgba(255,255,255,0.20)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.10)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 100%)",
                opacity: 0.35,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 30.5,
              }}
            />

            {pill && (
              <div
                className="pointer-events-none absolute top-[4px] rounded-[26.5px] transition-[left,width] duration-200 ease-out"
                style={{
                  left: pill.left,
                  width: pill.width,
                  height: 53,
                  transform: "translateX(-50%)",
                  background: "#EDEDED",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                }}
              />
            )}

            <div className="relative h-full px-[14px]">
              <div className="grid h-full grid-cols-5">
                {tabs.map((t, idx) => {
                  const isActive = idx === active;
                  return (
                    <button
                      key={t.key}
                      ref={(el) => {
                        btnRefs.current[idx] = el;
                      }}
                      type="button"
                      onClick={() => onChange(idx)}
                      className="relative flex flex-col items-center justify-center gap-[4px] active:opacity-70 focus:outline-none"
                      style={{ paddingTop: 2, WebkitTapHighlightColor: "transparent" }}
                    >
                      <TabIcon name={t.icon} active={isActive} />
                      <span
                        className="text-[12px] font-semibold"
                        style={{
                          color: isActive ? "#111" : "rgba(0,0,0,0.55)",
                          letterSpacing: "-0.01em",
                          lineHeight: 1,
                        }}
                      >
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute -inset-x-2 -inset-y-2 rounded-[34px]"
            style={{ boxShadow: "0 16px 34px rgba(0,0,0,0.10)", opacity: 0.55 }}
          />
        </div>
      </div>
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
      <div className="px-5 pt-6">
        {/* 노란 메인카드 */}
        <section>
          <div
            className="rounded-[20px]"
            style={{
              background:
                "linear-gradient(0deg, #FFD158, #FFD158), linear-gradient(360deg, rgba(255,255,255,0.30) 53.3%, rgba(255,255,255,0.70) 100%)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              width: "100%",
              height: 199,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* 상단: 로고 + 식권 */}
            <div className="flex items-start justify-between">
              {/* ✅ 여기 로고: 반드시 이 경로 */}
              <img
                src="/assets/maumpay-logo.svg"
                alt="MaumPay"
                className="block"
                style={{ height: 18, width: "auto" }}
                draggable={false}
              />

              {/* ✅ 식권: ticket.svg 사용 + 텍스트는 SVG 안에 없으니 옆에 */}
              <div className="flex items-center gap-6">
                <img
                  src="/assets/ticket.svg"
                  alt="식권"
                  className="block"
                  style={{ height: 22, width: "auto" }}
                  draggable={false}
                />
              </div>
            </div>

            {/* 금액 */}
            <div className="flex items-center justify-end gap-2">
              <div className="text-[28px] font-extrabold text-[#222]">
                {formatWon(balance)}
              </div>
              <img
                src="/assets/chevron-right.svg"
                alt=">"
                className="block"
                style={{ height: 18, width: 18, opacity: 0.65 }}
                draggable={false}
              />
            </div>

            {/* 충전 | 송금 */}
            <div className="flex items-center gap-4 text-[14px] font-semibold text-[#7A7A7A]">
              <button type="button" className="active:opacity-70">충전</button>
              <span className="text-[#BDBDBD]">|</span>
              <button type="button" className="active:opacity-70">송금</button>
            </div>

            {/* 마음 전하기 버튼 */}
            <button
              type="button"
              onClick={() => router.push("/scan")}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-[14px] font-bold text-[#111] active:opacity-80"
              style={{
                height: 55,
                background: "#FFDC82",
                border: "2px solid #FFE08E",
              }}
            >
              <img
                src="/assets/send-heart.svg"
                alt=""
                className="block"
                style={{ height: 18, width: 18 }}
                draggable={false}
              />
              마음 전하기
            </button>
          </div>
        </section>

        {/* 광고 배너 (흰 카드만) */}
        <section className="mt-5">
          <div className="relative rounded-[22px] bg-white px-5 py-10 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <div className="absolute bottom-4 right-5 text-sm font-semibold text-[#9A9A9A]">
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
                  className="flex flex-col items-center gap-2 active:opacity-70 focus:outline-none"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#D9D9D9]" />
                  <div className="text-xs font-semibold text-[#7A7A7A]">
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