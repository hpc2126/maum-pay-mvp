// components/TicketTag.tsx
"use client";

export default function TicketTag() {
  // ✅ 원하는 크기: 여기만 조절 (1.5배 느낌)
  const W = 78; // 72~84 사이에서만 조절 추천

  return (
    <div
      style={{
        width: W,
        aspectRatio: "57 / 36",
        display: "block",
      }}
      aria-label="식권"
    >
      {/* ✅ SVG를 인라인으로 넣으면 iOS에서 래스터 깨짐 거의 사라짐 */}
      <svg
        viewBox="0 0 57 36"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
        }}
      >
        {/* ✅ iOS 픽셀 깨짐의 주범인 filter 제거 (그림자/블러 없음) */}
        <path
          d="M3 3H52V12C47.5556 13.8519 47.5556 20.1481 52 22V31H3V22C7.44444 20.1481 7.44444 13.8519 3 12V3Z"
          fill="#FFD158"
        />

        {/* ✅ 텍스트를 SVG 안에 직접 넣어서 “밖에 나돌” 가능성 0 */}
        <text
          x="27.5"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12.5"
          fontWeight="900"
          fill="#111"
          style={{
            letterSpacing: "-0.02em",
          }}
        >
          식권
        </text>
      </svg>
    </div>
  );
}