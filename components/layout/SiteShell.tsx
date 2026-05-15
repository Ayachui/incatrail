"use client";

import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-[#030205] text-[#e0e0e0] font-sans selection:bg-[#6b21a8] selection:text-white"
      style={{
        minHeight: "100vh",
        backgroundColor: "#030205",
        color: "#e0e0e0",
      }}
    >
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
