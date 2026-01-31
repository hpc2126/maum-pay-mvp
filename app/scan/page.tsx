"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Html5QrcodeType = {
  start: (
    cameraIdOrConfig: any,
    config: any,
    qrCodeSuccessCallback: (decodedText: string) => void,
    qrCodeErrorCallback: (errorMessage: string) => void
  ) => Promise<void>;
  stop: () => Promise<void>;
  clear: () => Promise<void>;
};

export default function ScanPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const qrRef = useRef<Html5QrcodeType | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        setError("");
        setReady(false);

        // ✅ 브라우저에서만 로드 (SSR/빌드 안전)
        const mod = await import("html5-qrcode");
        const Html5Qrcode = mod.Html5Qrcode as any;

        const id = "qr-reader";
        const qr: Html5QrcodeType = new Html5Qrcode(id, /* verbose */ false);
        qrRef.current = qr;

        if (!mounted) return;

        setReady(true);

        await qr.start(
          { facingMode: "environment" },
          {
            fps: 12,
            // ✅ 프레임 크기: 너무 커지면 화면을 덮어버려서 "카메라 안나오는 것처럼" 보임
            qrbox: { width: 260, height: 260 },
            // iOS 안정성 옵션들(라이브러리 내부 video에 적용됨)
            // (필수는 아니지만, 재생 안정성에 도움)
            aspectRatio: 1.0,
            disableFlip: false,
          },
          async (decodedText: string) => {
            if (isNavigatingRef.current) return;

            const raw = (decodedText || "").trim();
            const isUrl = /^https?:\/\//i.test(raw);

            if (!isUrl) {
              setError("예식장 QR이 아닙니다. (링크 QR만 인식)");
              return;
            }

            isNavigatingRef.current = true;

            try {
              await qr.stop();
              await qr.clear();
            } catch {}

            router.push(raw);
          },
          // ✅ 4번째 인자(필수): 프레임마다 실패 콜백 (너무 시끄러우면 비워도 됨)
          (_errMsg: string) => {
            // setError를 계속 호출하면 화면이 깜빡일 수 있어서 보통은 비움
          }
        );
      } catch (e: any) {
        setError(e?.message || "카메라를 시작할 수 없습니다.");
      }
    };

    boot();

    return () => {
      mounted = false;
      (async () => {
        try {
          await qrRef.current?.stop();
          await qrRef.current?.clear();
        } catch {}
      })();
    };
  }, [router]);

  return (
    <main className="mx-auto min-h-screen max-w-md bg-black">
      {/* 카메라 영역 */}
      <div className="relative h-screen w-full">
        {/* html5-qrcode가 내부에 video를 생성 */}
        <div id="qr-reader" className="absolute inset-0" />

        {/* 반투명 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-black/55" />

        {/* 중앙 스캔 프레임(노란 테두리) */}
        <div className="pointer-events-none absolute left-1/2 top-[16%] -translate-x-1/2">
          <div className="h-[420px] w-[320px] rounded-[36px] border-[6px] border-[#FFD158] shadow-[0_0_0_2px_rgba(0,0,0,0.15)]" />
          {/* 가운데 짧은 가이드(원하면 제거 가능) */}
          <div className="absolute left-1/2 top-1/2 h-14 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD158]" />
          <div className="absolute left-1/2 top-1/2 mt-14 h-3 w-20 -translate-x-1/2 rounded-full bg-[#FFD158]" />
        </div>

        {/* 상단 UI */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 pt-10">
          <div className="text-white/90 text-xl font-semibold">MaumPay</div>
          <button
            onClick={() => router.push("/")}
            className="h-12 w-12 rounded-full text-4xl leading-none text-white active:opacity-70"
            aria-label="close"
          >
            ×
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="absolute left-0 right-0 top-[62%] px-6 text-center text-white">
          <div className="text-lg font-semibold text-white/90">
            신랑측 👨‍🦱 · 신부측 👰 확인 후
          </div>
          <div className="mt-2 text-4xl font-extrabold tracking-tight">
            QR코드를 스캔하세요
          </div>
        </div>

        {/* 하단 도움 패널 */}
        <div className="absolute left-0 right-0 bottom-0 px-6 pb-10">
          <div className="rounded-[36px] bg-white/90 p-7 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="text-2xl font-extrabold text-[#111]">
              혹시 인식이 안 되나요?
            </div>
            <ul className="mt-4 space-y-2 text-lg font-medium text-[#666]">
              <li>• QR이 프레임 안에 들어오도록 맞춰주세요</li>
              <li>• 반사/어두우면 각도를 바꿔보세요</li>
            </ul>

            {!ready && (
              <div className="mt-4 text-sm text-[#777]">카메라 준비 중…</div>
            )}
            {error && (
              <div className="mt-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}