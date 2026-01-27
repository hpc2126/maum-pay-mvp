import GuestConfirmHost from "@/components/guest/GuestConfirmHost";

export default async function Page({
  params,
}: {
  params: Promise<{ hostCode: string }>;
}) {
  const { hostCode } = await params;

  return <GuestConfirmHost side="bride" hostCode={hostCode} />;
}