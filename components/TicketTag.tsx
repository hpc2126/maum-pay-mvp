// components/TicketTag.tsx
"use client";

export default function TicketTag() {
  // ✅ 원본 ticket.svg 비율: 57 / 36
  // 너무 크지 않게 (지금 스샷에서 살짝 큰 상태라) 적당히 조정
  const width = 72; // 필요하면 68~76 사이에서만 미세조정

  return (
    <div
      className="relative"
      style={{
        width,
        aspectRatio: "57 / 36",
        display: "grid",
        placeItems: "center",
      }}
    >
      <img
        src="/assets/ticket.svg"
        alt="식권"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain", // ✅ 비율 유지
        }}
        draggable={false}
      />

      {/* ✅ 텍스트는 티켓 안 정중앙 */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontSize: 15,
          fontWeight: 900,
          color: "#111",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          pointerEvents: "none",
          transform: "translateY(0px)",
          userSelect: "none",
        }}
      >
        식권
      </span>
    </div>
  );
}