"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";

export const dynamic = "force-dynamic";

export default function ScanPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [ready, setReady] = useState(false);

  const qrRef = useRef<Html5Qrcode | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const id = "qr-reader";
    const qr = new Html5Qrcode(id);
    qrRef.current = qr;

    const start = async () => {
      try {
        setError("");
        setReady(true);

        await qr.start(
          { facingMode: "environment" },
          { fps: 12, qrbox: { width: 260, height: 260 } },
          async (decodedText) => {
            if (isNavigatingRef.current) return;

            // ✅ scan은 예식장 QR 전용: URL만 허용
            const raw = (decodedText || "").trim();
            const isUrl = /^https?:\/\//i.test(raw);

            if (!isUrl) {
              setError("예식장 QR이 아닙니다. (링크 QR만 인식)");
              return;
            }

            // 중복 인식 방지
            isNavigatingRef.current = true;

            // 카메라 정지 후 이동 (연속 인식 방지)
            try {
              await qr.stop();
              await qr.clear();
            } catch {}

            router.push(raw);
          },
          () => {
            // 스캔 실패 이벤트(너무 시끄러우면 비워둬도 됨)
          }
        );
      } catch (e: any) {
        setError(e?.message || "카메라를 시작할 수 없습니다.");
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
    <main className="mx-auto min-h-screen max-w-md bg-[#E9E9E9] px-5 pt-10 pb-10">
      <div className="rounded-2xl bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
        <div className="mb-3 text-center text-lg font-bold text-[#111]">
          예식장 QR을 스캔해 주세요
        </div>

        <div
          id="qr-reader"
          className="overflow-hidden rounded-2xl bg-black"
          style={{ width: "100%", aspectRatio: "1 / 1" }}
        />

        {!ready && (
          <div className="mt-3 text-center text-sm text-[#777]">
            카메라 준비 중…
          </div>
        )}

        {error && (
          <div className="mt-3 text-center text-sm text-red-600">{error}</div>
        )}

        <div className="mt-3 text-center text-xs text-[#9A9A9A]">
          링크(QR 안에 URL)가 들어있는 예식장 QR만 인식합니다.
        </div>
      </div>
    </main>
  );
}