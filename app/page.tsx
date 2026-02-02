"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import LiquidTabBar from "../components/LiquidTabBar";

const BG = "#E9E9E9";
const YELLOW = "#FFD158";

function formatWon(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function TicketTag({
  onClick,
}: {
  onClick: () => void;
}) {
  // ✅ “요란하지 않게” 발급 느낌: 아주 미세한 팝 + 숨쉬기
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        border: "none",
        padding: 0,
        background: "transparent",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
      }}
      aria-label="식권"
    >
      <div
        style={{
          position: "relative",
          width: 86, // ✅ 57 * 1.5 = 85.5 → 86
          height: 54, // 비율 맞춰 넉넉히
          display: "grid",
          placeItems: "center",
          transformOrigin: "center",
          animation: "ticketPop 260ms ease-out, ticketBreathe 2.8s ease-in-out 300ms infinite",
        }}
      >
        {/* SVG는 transform scale로 키우면 “깨져 보이는” 경우가 있어서 width/height로 고정 */}
        <img
          src="/assets/ticket.svg"
          alt=""
          width={86}
          height={54}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        {/* 텍스트는 반드시 “티켓 내부” 중앙 */}
        <span
          style={{
            position: "relative",
            zIndex: 2,
            fontSize: 14,
            fontWeight: 600,
            color: "#111",
            transform: "translateY(0px)",
          }}
        >
          식권
        </span>
      </div>

      <style jsx>{`
        @keyframes ticketPop {
          0% {
            transform: scale(0.96);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes ticketBreathe {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-1px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          div {
            animation: none !important;
          }
        }
      `}</style>
    </button>
  );
}

function ScanCard({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();
  const qrRef = useRef<Html5Qrcode | null>(null);
  const navigatingRef = useRef(false);

  useEffect(() => {
    const id = "qr-card-reader";
    const qr = new Html5Qrcode(id);
    qrRef.current = qr;

    const start = async () => {
      try {
        navigatingRef.current = false;

        await qr.start(
          { facingMode: "environment" },
          {
            fps: 12,
            // ✅ 프레임/오버레이는 UI에서 안 보여주지만, 내부 인식 성능을 위해 기본값 유지
            qrbox: undefined as any,
            disableFlip: true,
          },
          async (decodedText) => {
            if (navigatingRef.current) return;
            const raw = (decodedText || "").trim();

            const isUrl = /^https?:\/\//i.test(raw);
            if (!isUrl) return;

            navigatingRef.current = true;
            try {
              await qr.stop();
              await qr.clear();
            } catch {}

            router.push(raw);
          },
          () => {}
        );

        // ✅ canvas/img 숨김 (중복 렌더링 방지)
        setTimeout(() => {
          const el = document.getElementById(id);
          if (!el) return;
          const canvas = el.querySelector("canvas");
          const img = el.querySelector("img");
          if (canvas) (canvas as HTMLCanvasElement).style.display = "none";
          if (img) (img as HTMLImageElement).style.display = "none";
        }, 0);
      } catch (e) {
        // 카메라 권한 실패 등: 여기서 토스트/문구 추가 가능
      }
    };

    start();

    return () => {
      (async () => {
        try {
          await qr.stop();
          await qr.clear();
        } catch {}
      })();
    };
  }, [router]);

  return (
    <div
      style={{
        borderRadius: 20,
        background: "#000",
        height: 199,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
        border: "3px solid #FFD158",
      }}
    >
      {/* ✅ 카메라 */}
      <div
        id="qr-card-reader"
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
        }}
      />

      {/* ✅ 상단 로고(white) + 닫기 */}
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 14,
          right: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 5,
        }}
      >
        <img
          src="/assets/maumpay-logo-white.svg"
          alt="MaumPay"
          style={{ height: 20, width: "auto", display: "block" }}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          style={{
            width: 44,
            height: 44,
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.92)",
            fontSize: 28,
            lineHeight: "44px",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          ×
        </button>
      </div>

      {/* ✅ 중앙 안내문 (아주 연하게) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center", opacity: 0.18, color: "#fff" }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
            신랑측🤵🏻 ∙ 신부측👰🏻‍♀️ 확인 후
          </div>
          <div style={{ fontSize: 28, fontWeight: 650, letterSpacing: "-0.02em" }}>
            QR코드를 스캔하세요
          </div>
        </div>
      </div>

      {/* ✅ html5-qrcode video 보정 */}
      <style jsx global>{`
        #qr-card-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        #qr-card-reader canvas,
        #qr-card-reader img {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

export default function MainPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [scanOpen, setScanOpen] = useState(false);

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
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)",
      }}
    >
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "14px 20px 0" }}>
        {/* ✅ 상단 카드(노란 카드 ↔ 스캔 카드 전환) */}
        <section>
          {scanOpen ? (
            <ScanCard onClose={() => setScanOpen(false)} />
          ) : (
            <div
              style={{
                borderRadius: 20,
                height: 199,
                padding: 18,
                background:
                  "linear-gradient(0deg, #FFD158, #FFD158), linear-gradient(360deg, rgba(255, 255, 255, 0.3) 53.3%, rgba(255, 255, 255, 0.7) 100%)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                position: "relative",
                boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
              }}
            >
              {/* 상단: 로고 + 티켓 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginTop: 2, // ✅ 상단 패딩 더 타이트
                }}
              >
                <img
                  src="/assets/maumpay-logo.svg"
                  alt="MaumPay"
                  style={{
                    height: 22,
                    width: "auto",
                    display: "block",
                  }}
                />

                <div style={{ marginTop: -2 }}>
                  <TicketTag onClick={() => router.push("/guest/ticket")} />
                </div>
              </div>

              {/* 금액 + > */}
              <div
                style={{
                  position: "absolute",
                  right: 18,
                  top: 70,
                  display: "flex",
                  alignItems: "center",
                  gap: 8, // ✅ 원/chevron 간격 너무 벌어지지 않게
                }}
              >
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 600, // ✅ 볼드 덜하게
                    letterSpacing: "-0.02em",
                    color: "#111",
                  }}
                >
                  {formatWon(balance)}
                </div>
                <img
                  src="/assets/chevron-right.svg"
                  alt=""
                  style={{ width: 18, height: 18, opacity: 0.65 }}
                />
              </div>

              {/* 충전 | 송금 */}
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  top: 112,
                  display: "flex",
                  alignItems: "center",
                  gap: 14, // ✅ 너무 벌어지지 않게
                  color: "rgba(0,0,0,0.55)",
                  fontSize: 14,
                  fontWeight: 500, // ✅ 볼드 덜하게
                }}
              >
                <button
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    color: "rgba(0,0,0,0.55)",
                    cursor: "pointer",
                  }}
                >
                  충전
                </button>
                <span style={{ opacity: 0.35 }}>|</span>
                <button
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    color: "rgba(0,0,0,0.55)",
                    cursor: "pointer",
                  }}
                >
                  송금
                </button>
              </div>

              {/* 마음 전하기 버튼(카드 안에 정확히) */}
              <button
                type="button"
                onClick={() => setScanOpen(true)}
                style={{
                  position: "absolute",
                  left: 12,
                  right: 12,
                  bottom: 12,
                  height: 55,
                  borderRadius: 14,
                  background: "#FFDC82",
                  border: "2px solid #FFE08E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#111",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <img
                  src="/assets/send-heart.svg"
                  alt=""
                  style={{ width: 22, height: 22 }}
                />
                마음 전하기
              </button>
            </div>
          )}
        </section>

        {/* ✅ 배너(단일 흰 카드) */}
        <section style={{ marginTop: 16 }}>
          <div
            style={{
              borderRadius: 22,
              background: "#fff",
              height: 92, // ✅ “좀만” 낮춤
              boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: 16,
                bottom: 14,
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(0,0,0,0.35)",
              }}
            >
              1/10
            </div>
          </div>
        </section>

        {/* ✅ 아이콘 그리드 */}
        <section style={{ marginTop: 16 }}>
          <div
            style={{
              borderRadius: 22,
              background: "#fff",
              padding: 18,
              boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "18px 18px",
              }}
            >
              {shortcuts.map((label) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "center",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      margin: "0 auto",
                      borderRadius: 16,
                      background: "#D9D9D9",
                    }}
                  />
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgba(0,0,0,0.55)",
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

      {/* ✅ 하단 네비 */}
      <LiquidTabBar active={activeTab} onChange={setActiveTab} />

      {/* ✅ 전체 배경색 고정(스크롤 당길 때 흰색 방지) */}
      <style jsx global>{`
        html,
        body {
          background: ${BG};
        }
      `}</style>
    </div>
  );
}