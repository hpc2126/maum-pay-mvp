// components/LiquidTabBar.tsx
"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

function TabIcon({
  name,
  active,
}: {
  name: "home" | "note" | "mail" | "bag" | "user";
  active?: boolean;
}) {
  const stroke = active ? "#111" : "rgba(0,0,0,0.45)";
  const size = 20;

  switch (name) {
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11.5L12 4l9 7.5"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 10.5V20h11V10.5"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "note":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M7 3h10a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 8h8M9 12h8M9 16h6"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "mail":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6h16v12H4z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 6.5 12 12l7.5-5.5"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bag":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M6 8h12l-1 13H7L6 8Z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 8a3 3 0 0 1 6 0"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "user":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4 20c1.7-3.2 5-5 8-5s6.3 1.8 8 5"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export default function LiquidTabBar({
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

    const center = b.left - s.left + b.width / 2;
    // ✅ pill은 각 탭 칸 폭의 ~72% 정도가 가장 안정적 (너가 원한 figma 느낌)
    const w = Math.max(86, Math.min(110, b.width * 0.72));

    setPill({ left: center, width: w });
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
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
      }}
    >
      {/* ✅ 페이지 폭과 동일하게 */}
      <div style={{ width: "100%", maxWidth: 448, paddingLeft: 20, paddingRight: 20 }}>
        <div
          ref={shellRef}
          style={{
            height: 61,
            borderRadius: 30.5,
            background: "rgba(255,255,255,0.20)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: "0 2px 20px rgba(0,0,0,0.10)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 100%)",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />

          {/* ✅ pill */}
          {pill && (
            <div
              style={{
                position: "absolute",
                top: 4,
                height: 53,
                left: pill.left,
                width: pill.width,
                transform: "translateX(-50%)",
                borderRadius: 26.5,
                background: "#EDEDED",
                boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                transition: "left 200ms ease, width 200ms ease",
                pointerEvents: "none",
              }}
            />
          )}

          <div
            style={{
              height: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              paddingLeft: 14,
              paddingRight: 14,
              position: "relative",
            }}
          >
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
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    userSelect: "none",
                  }}
                >
                  <TabIcon name={t.icon} active={isActive} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
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

        {/* outer subtle shadow */}
        <div
          style={{
            pointerEvents: "none",
            marginTop: -61,
            height: 61,
            borderRadius: 30.5,
            boxShadow: "0 16px 34px rgba(0,0,0,0.10)",
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  );
}