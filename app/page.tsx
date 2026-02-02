"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const BG = "#E9E9E9";

/**
 * ✅ Figma 기준(375 아트보드)
 * padding: 14px * 2 = 28px
 * content width: 375 - 28 = 347px
 */
const ARTBOARD_W = 375;
const SIDE_PADDING = 14;
const CONTENT_W = ARTBOARD_W - SIDE_PADDING * 2; // 347

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

// ====== 임시 아이콘 (외부 라이브러리 X) ======
function Icon({
  name,
  active,
}: {
  name: "home" | "ledger" | "invitation" | "store" | "my";
  active?: boolean;
}) {
  const stroke = active ? "#111" : "rgba(0,0,0,0.45)";

  switch (name) {
    case "home":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="block">
          <path
            d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ledger":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="block">
          <path
            d="M7 3h10a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9 8h8M9 12h8M9 16h6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "invitation":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="block">
          <path d="M4 7h16v12H4V7z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <path
            d="M4.5 7.5L12 13l7.5-5.5"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "store":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="block">
          <path d="M6 8l1-4h10l1 4" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M6 8v12h12V8" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 12h6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "my":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="block">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" stroke={stroke} strokeWidth="1.8" />
          <path
            d="M4 21a8 8 0 0 1 16 0"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

// ====== 하단바 배경 SVG(너가 준 402x103) ======
function BottomNavSvg() {
  return (
    <svg viewBox="0 0 402 103" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="block">
      <g filter="url(#filter0_d_72_172)">
        <rect x="24" y="18" width="354" height="61" rx="30.5" fill="white" fillOpacity="0.2" shapeRendering="crispEdges" />
      </g>
      <defs>
        <filter
          id="filter0_d_72_172"
          x="4"
          y="0"
          width="394"
          height="101"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="10" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_72_172" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_72_172" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

function LiquidBottomNav({
  active,
  onChange,
}: {
  active: number; // 0..4
  onChange: (idx: number) => void;
}) {
  // SVG 기준
  const SVG_W = 402;
  const SVG_H = 103;

  // inner glass rect: x=24 y=18 w=354 h=61
  const innerX = 24;
  const innerY = 18;
  const innerW = 354;
  const innerH = 61;

  const tabCount = 5;
  const pillW = innerW / tabCount;

  const pillLeftPct = ((innerX + active * pillW) / SVG_W) * 100;
  const pillTopPct = (innerY / SVG_H) * 100;
  const pillWidthPct = (pillW / SVG_W) * 100;
  const pillHeightPct = (innerH / SVG_H) * 100;

  const tabs = [
    { label: "홈", icon: "home" as const },
    { label: "장부", icon: "ledger" as const },
    { label: "청첩장", icon: "invitation" as const },
    { label: "스토어", icon: "store" as const },
    { label: "MY", icon: "my" as const },
  ] as const;

  return (
    // ✅ 여기! 하단바는 카드 폭(347)과 동일하게 고정
    <div className="relative mx-auto w-full" style={{ maxWidth: CONTENT_W, height: 103 }}>
      <div className="absolute inset-0">
        <BottomNavSvg />
      </div>

      {/* pill */}
      <div
        className="absolute"
        style={{
          left: `${pillLeftPct}%`,
          top: `${pillTopPct}%`,
          width: `${pillWidthPct}%`,
          height: `${pillHeightPct}%`,
          borderRadius: 9999,
          background: "#EDEDED",
        }}
      />

      {/* clickable region */}
      <div
        className="absolute"
        style={{
          left: `${(innerX / SVG_W) * 100}%`,
          top: `${(innerY / SVG_H) * 100}%`,
          width: `${(innerW / SVG_W) * 100}%`,
          height: `${(innerH / SVG_H) * 100}%`,
        }}
      >
        <div className="grid h-full w-full grid-cols-5">
          {tabs.map((t, idx) => {
            const isActive = idx === active;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => onChange(idx)}
                className="flex h-full w-full flex-col items-center justify-center gap-[4px] active:opacity-70"
                style={{ paddingTop: 2 }}
              >
                <Icon name={t.icon} active={isActive} />
                <div
                  className="text-[12px] font-semibold"
                  style={{
                    color: isActive ? "#111" : "rgba(0,0,0,0.55)",
                    lineHeight: "12px",
                  }}
                >
                  {t.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MainPage() {
  const router = useRouter();
  const balance = 300_000;
  const [activeTab, setActiveTab] = useState(0);

  const shortcuts = useMemo(
    () => ["웨딩 신청", "웨딩홀 예약", "스태프 특가", "상견례", "가전 혼수", "예물 예단", "다이어트", "신혼 여행"],
    []
  );

  return (
    <main className="min-h-screen w-full" style={{ background: BG }}>
      {/* ✅ 컨테이너는 “가로 375 기준”으로만 잡고, 안쪽 콘텐츠는 347로 통일 */}
      <div className="mx-auto w-full" style={{ maxWidth: ARTBOARD_W, paddingLeft: SIDE_PADDING, paddingRight: SIDE_PADDING }}>
        <div style={{ paddingTop: 54, paddingBottom: 26 }}>
          {/* ===== 노란 메인 카드 (너가 준 CSS 기준) ===== */}
          <section
            className="relative mx-auto"
            style={{
              width: CONTENT_W, // ✅ 347 고정
              height: 199,
              background:
                "linear-gradient(0deg, #FFD158, #FFD158), linear-gradient(360deg, rgba(255, 255, 255, 0.3) 53.3%, rgba(255, 255, 255, 0.7) 100%)",
              backdropFilter: "blur(2px)",
              borderRadius: 20,
            }}
          >
            {/* ✅ 로고: 새 파일 사용 */}
            <div className="absolute left-5 top-5">
              <img src="/assets/maumpay-logo.svg" alt="MaumPay" className="h-6 w-auto" />
            </div>

            {/* ✅ 식권: 네가 넣어둔 티켓 SVG 파일 사용 (파일명 다르면 여기만 수정) */}
            <div className="absolute right-5 top-4">
              <div className="relative">
                <img src="/assets/ticket.svg" alt="식권" className="h-9 w-auto" />
                {/* 텍스트는 필요하면 SVG 안에 넣고, 여기선 최소로 */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-[13px] font-bold"
                  style={{ color: "rgba(0,0,0,0.55)" }}
                >
                  식권
                </div>
              </div>
            </div>

            {/* 금액(우측) + ✅ 화살표 아이콘 */}
            <div className="absolute right-6 top-[70px] flex items-center gap-2">
              <div className="text-[40px] font-extrabold tracking-tight text-[#333]">{formatWon(balance)}</div>
              <img src="/assets/chevron-right.svg" alt=">" className="h-6 w-6 opacity-60" />
            </div>

            {/* 충전 | 송금 */}
            <div className="absolute left-6 top-[116px] flex items-center gap-5 text-[18px] font-semibold text-[#6E6E6E]">
              <button type="button" className="active:opacity-70">
                충전
              </button>
              <span className="text-[#C8C8C8]">|</span>
              <button type="button" className="active:opacity-70">
                송금
              </button>
            </div>

            {/* 노란 버튼 */}
            <button
              type="button"
              onClick={() => router.push("/scan")}
              className="absolute left-1/2 -translate-x-1/2 active:opacity-80"
              style={{
                width: 323, // ✅ 네가 준 값 그대로
                height: 55,
                left: 26, // figma absolute 기준이라, 가운데정렬 대신 정확한 값 적용
                bottom: 12,
                transform: "none",
                background: "#FFDC82",
                border: "2px solid #FFE08E",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxSizing: "border-box",
              }}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/35">
                ▦
              </span>
              <span className="text-[20px] font-extrabold text-[#333]">마음 전하기</span>
            </button>
          </section>

          {/* 배너 */}
          <section className="mt-5">
            <div
              className="relative overflow-hidden rounded-[22px] bg-white px-4 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
              style={{ width: CONTENT_W, margin: "0 auto" }}
            >
              <div className="h-[70px] w-full rounded-[18px] bg-[#D6D6D6]" />
              <div className="absolute bottom-5 right-6 text-[16px] font-semibold text-[#8A8A8A]">1/10</div>
            </div>
          </section>

          {/* 아이콘 그리드 */}
          <section className="mt-5">
            <div
              className="rounded-[22px] bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
              style={{ width: CONTENT_W, margin: "0 auto" }}
            >
              <div className="grid grid-cols-4 gap-x-6 gap-y-7">
                {shortcuts.map((label) => (
                  <button key={label} type="button" className="flex flex-col items-center gap-2 active:opacity-70">
                    <div className="h-[56px] w-[56px] rounded-[16px] bg-[#D9D9D9]" />
                    <div className="text-[13px] font-semibold text-[#6E6E6E]">{label}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 하단 네비 */}
          <div className="mt-8 flex justify-center pb-2">
            <LiquidBottomNav active={activeTab} onChange={setActiveTab} />
          </div>
        </div>
      </div>
    </main>
  );
}