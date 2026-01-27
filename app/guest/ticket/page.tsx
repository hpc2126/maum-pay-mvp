import { Suspense } from "react";
import TicketClient from "./TicketClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-200" />}>
      <TicketClient />
    </Suspense>
  );
}