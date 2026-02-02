// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import NoZoom from "../components/NoZoom";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
} as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {/* iOS 핀치/더블탭 확대 강제 차단 */}
        <NoZoom />
        {children}
      </body>
    </html>
  );
}