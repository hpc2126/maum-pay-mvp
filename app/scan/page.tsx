import { Suspense } from "react";
import ScanClient from "./ScanClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ScanClient />
    </Suspense>
  );
}