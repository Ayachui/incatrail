import Link from "next/link";

type BrandLogoSize = "sm" | "md";

type BrandLogoProps = {
  size?: BrandLogoSize;
  /** Second line under the wordmark. Pass null to show the wordmark alone. */
  subtitle?: string | null;
  href?: string;
  className?: string;
};

const SIZE_TOKENS: Record<
  BrandLogoSize,
  { mark: string; rule: string; title: string; subtitle: string; halo: string }
> = {
  md: {
    mark: "h-10 sm:h-12 md:h-14",
    rule: "h-8 md:h-11",
    title: "text-lg md:text-2xl",
    subtitle: "text-[9px] md:text-[10px]",
    halo: "h-24 w-24 md:h-32 md:w-32",
  },
  sm: {
    mark: "h-9",
    rule: "h-7",
    title: "text-base",
    subtitle: "text-[8px]",
    halo: "h-20 w-20",
  },
};

/**
 * The mark itself is a dark ink colour (#320A63) that would disappear on the
 * obsidian background, so it is used as a CSS mask and lit with the amethyst
 * gradient from the design system instead of being drawn as an image.
 */
export function BrandLogo({
  size = "md",
  subtitle = "Ecuador • Zamora",
  href = "/",
  className = "",
}: BrandLogoProps) {
  const tokens = SIZE_TOKENS[size];

  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 md:gap-5 ${className}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute left-0 top-1/2 -translate-x-1/4 -translate-y-1/2 rounded-full bg-[#6b21a8]/25 blur-2xl opacity-60 transition-opacity duration-700 group-hover:opacity-100 ${tokens.halo}`}
      />

      <span
        aria-hidden
        className={`brand-mark relative block shrink-0 aspect-[1061/609] ${tokens.mark}`}
      />

      <span
        aria-hidden
        className={`hidden shrink-0 sm:block w-px bg-gradient-to-b from-transparent via-[#3b1c4a] to-transparent ${tokens.rule}`}
      />

      <span className="flex flex-col min-w-0">
        <span
          className={`bg-gradient-to-r from-white via-white to-[#e9d5ff] bg-clip-text font-serif font-light uppercase tracking-[0.18em] sm:tracking-[0.25em] text-transparent ${tokens.title}`}
        >
          The Inca Trail
        </span>
        {subtitle ? (
          <span
            className={`mt-1 hidden sm:block uppercase tracking-[0.3em] text-[#9b59b6] transition-colors duration-500 group-hover:text-[#c39bd3] ${tokens.subtitle}`}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
