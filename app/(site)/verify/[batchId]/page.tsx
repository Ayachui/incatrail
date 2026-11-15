import { redirect } from "next/navigation";

type Props = { params: { batchId: string } };

export default function VerifyRedirectPage({ params }: Props) {
  redirect(`/trace/${encodeURIComponent(decodeURIComponent(params.batchId))}`);
}
