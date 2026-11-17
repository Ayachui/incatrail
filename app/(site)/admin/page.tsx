import { ItfBaseAdminClient } from "@/components/admin/ItfBaseAdminClient";

export const metadata = {
  title: "Admin | The Inca Trail Foods",
  robots: { index: false, follow: false },
};

export default function ItfAdminPage() {
  return <ItfBaseAdminClient />;
}
