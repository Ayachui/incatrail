"use client";

import type { ReactNode } from "react";

export type FadeDirection = "up" | "down" | "left" | "right";

/**
 * Kept for API compatibility with the landing. Animations were causing
 * invisible content (opacity:0 SSR / failed hydration). Content always renders.
 */
export function FadeIn({
  children,
}: {
  children: ReactNode;
  delay?: number;
  direction?: FadeDirection;
  duration?: number;
}) {
  return <>{children}</>;
}
