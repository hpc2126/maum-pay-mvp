import GuestConfirmHost from "@/components/guest/GuestConfirmHost";

export default async function Page({
  params,
}: {
  params: Promise<{ hostCode: string }>;
}) {
  const { hostCode } = await params;

  // MVP: 서버에서 hostCode로 결혼식/표시이름 조회하는 로직은 나중에 붙임
  return <GuestConfirmHost side="groom" hostCode={hostCode} />;
}