import Link from "next/link";
import TraceBatchClient from "@/components/trace/TraceBatchClient";
import { displayTraceLotId } from "@/lib/trace-helpers";

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

export async function generateMetadata({ params }: Props) {
  const id = displayTraceLotId(decodeBatchId(params.batchId));
  return {
    title: `Trace ${id} · Inca Trail Foods`,
    description: "Public lot traceability — Inca Trail Foods",
  };
}

export default function TracePage({ params }: Props) {
  const decoded = decodeBatchId(params.batchId);
  return (
    <div>
      <div className="mx-auto max-w-lg px-4 pt-8 sm:px-6">
        <Link
          href="/products"
          className="text-sm font-medium text-[var(--itf-accent)] hover:underline"
        >
          ← Products
        </Link>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--itf-accent)]">
          Inca Trail Foods · Trace
        </p>
      </div>
      <div className="mt-2 overflow-hidden rounded-t-3xl bg-[#0B2E1A]">
        <TraceBatchClient batchId={decoded} />
      </div>
    </div>
  );
}
