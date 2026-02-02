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
  const size = 20;

  const common = {
    stroke,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  switch (name) {
    case "home":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M3 11.5L12 4l9 7.5" {...common} />
          <path d="M6.5 10.5V20h11V10.5" {...common} />
        </svg>
      );
    case "note":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M7 3h10a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            {...common}
          />
          <path d="M9 8h8" {...common} />
          <path d="M9 12h8" {...common} />
          <path d="M9 16h6" {...common} />
        </svg>
      );
    case "mail":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M4 6h16v12H4z" {...common} />
          <path d="M4.5 6.5 12 12l7.5-5.5" {...common} />
        </svg>
      );
    case "bag":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M6 8h12l-1 13H7L6 8Z" {...common} />
          <path d="M9 8a3 3 0 0 1 6 0" {...common} />
        </svg>
      );
    case "user":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" {...common} />
          <path d="M4 20c1.7-3.2 5-5 8-5s6.3 1.8 8 5" {...common} />
        </svg>
      );
  }
}

/* ---------- Liquid TabBar ---------- */
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
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 16px)`,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            ref={shellRef}
            style={{
              position: "relative",
              height: 61,
              borderRadius: 30.5,
              overflow: "hidden",
              background: "rgba(255,255,255,0.20)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "0 2px 20px rgba(0,0,0,0.10)",
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

            {pill && (
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: pill.left,
                  width: pill.width,
                  height: 53,
                  transform: "translateX(-50%)",
                  borderRadius: 26.5,
                  background: "#EDEDED",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                  transition: "left 200ms ease-out, width 200ms ease-out",
                  pointerEvents: "none",
                }}
              />
            )}

            <div
              style={{
                position: "relative",
                height: "100%",
                paddingLeft: 14,
                paddingRight: 14,
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                alignItems: "center",
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
                      height: "100%",
                      border: "none",
                      background: "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      paddingTop: 2,
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <TabIcon name={t.icon} active={isActive} />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        lineHeight: 1,
                        letterSpacing: "-0.01em",
                        color: isActive ? "#111" : "rgba(0,0,0,0.55)",
                      }}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: -8,
              right: -8,
              top: -8,
              bottom: -8,
              borderRadius: 34,
              boxShadow: "0 16px 34px rgba(0,0,0,0.10)",
              opacity: 0.55,
              pointerEvents: "none",
            }}
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

  // iOS 핀치 확대 방지
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", prevent, { passive: false });
    document.addEventListener("gesturechange", prevent, { passive: false });
    document.addEventListener("gestureend", prevent, { passive: false });
    return () => {
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
      document.removeEventListener("gestureend", prevent);
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: BG,
        display: "flex",
        justifyContent: "center",
        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 110px)`,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 18 }}>
          {/* Yellow card */}
          <section>
            <div
              style={{
                borderRadius: 20,
                padding: 18,
                background:
                  "linear-gradient(0deg, #FFD158, #FFD158), linear-gradient(360deg, rgba(255, 255, 255, 0.3) 53.3%, rgba(255, 255, 255, 0.7) 100%)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            >
              {/* header row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 32,
                }}
              >
                <img
                  src="/assets/maumpay-logo.svg"
                  alt="MaumPay"
                  style={{ height: 22, width: "auto" }}
                />

                {/* ✅ 식권 클릭 -> /guest/ticket */}
                <button
                  type="button"
                  onClick={() => router.push("/guest/ticket")}
                  style={{
                    position: "relative",
                    height: 40,
                    border: 0,
                    padding: 0,
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  aria-label="식권"
                >
                  <img
                    src="/assets/ticket.svg"
                    alt="ticket"
                    style={{ height: "100%", width: "auto", display: "block" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#111",
                      letterSpacing: "-0.01em",
                      transform: "translateY(0.5px)",
                      pointerEvents: "none",
                    }}
                  >
                    식권
                  </span>
                </button>
              </div>

              {/* amount */}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#2B2B2B",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {formatWon(balance)}
                </div>
                <img
                  src="/assets/chevron-right.svg"
                  alt=">"
                  style={{ height: 18, width: 18, opacity: 0.7 }}
                />
              </div>

              {/* 충전/송금 */}
              <div
                style={{
                  marginTop: 10,
                  paddingLeft: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.55)",
                }}
              >
                <button style={{ border: 0, background: "transparent", padding: 0 }}>
                  충전
                </button>
                <span style={{ opacity: 0.5 }}>|</span>
                <button style={{ border: 0, background: "transparent", padding: 0 }}>
                  송금
                </button>
              </div>

              {/* ✅ 마음 전하기 클릭 -> /guest/sender */}
              <button
                type="button"
                onClick={() => router.push("/guest/sender")}
                style={{
                  marginTop: 12,
                  width: "100%",
                  height: 55,
                  background: "#FFDC82",
                  border: "2px solid #FFE08E",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111",
                  cursor: "pointer",
                }}
              >
                <img
                  src="/assets/send-heart.svg"
                  alt="send"
                  style={{ height: 18, width: 18 }}
                />
                마음 전하기
              </button>
            </div>
          </section>

          {/* banner */}
          <section style={{ marginTop: 16 }}>
            <div
              style={{
                height: 110,
                background: "#fff",
                borderRadius: 22,
                boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 16,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.35)",
                }}
              >
                1/10
              </div>
            </div>
          </section>

          {/* grid card */}
          <section style={{ marginTop: 18 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: 20,
                boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  columnGap: 22,
                  rowGap: 22,
                }}
              >
                {shortcuts.map((label) => (
                  <button
                    key={label}
                    type="button"
                    style={{
                      border: 0,
                      background: "transparent",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 18,
                        background: "#D9D9D9",
                      }}
                    />
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "rgba(0,0,0,0.55)",
                        letterSpacing: "-0.01em",
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
      </div>

      <LiquidTabBar active={activeTab} onChange={setActiveTab} />
    </main>
  );
}