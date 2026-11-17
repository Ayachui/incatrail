import { redirect } from "next/navigation";

type Props = { params: { batchId: string[] } };

function decodeBatchId(parts: string[] | string): string {
  const arr = Array.isArray(parts) ? parts : [parts];
  return arr
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    })
    .join("/");
}

export default function VerifyRedirectPage({ params }: Props) {
  redirect(`/trace/${encodeURIComponent(decodeBatchId(params.batchId))}`);
}
