import { B2BReserveClient } from "@/components/reserve/B2BReserveClient";

export const metadata = {
  title: "Live Lot Reserve | The Inca Trail Foods",
  description:
    "Verified origin cacao lots from Zamora-Chinchipe with Base L2 NFT traceability and live B2B inventory.",
};

export default function ProductsReservePage() {
  return (
    <div className="pt-20 md:pt-24">
      <B2BReserveClient mode="full" />
    </div>
  );
}
