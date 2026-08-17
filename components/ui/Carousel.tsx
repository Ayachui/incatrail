"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/media/gallery";

type CarouselProps = {
  images: readonly GalleryImage[];
  /** Interval in ms; omit or set to 0 to disable auto rotation. */
  autoPlayMs?: number;
  /** CSS aspect-ratio of a single slide, e.g. "4000 / 1848". */
  aspectRatio?: string;
  /** Show dimmed, slightly overlapping neighbours around the active slide. */
  interlaced?: boolean;
  /** Scanline overlay that masks compression artifacts of low-res sources. */
  scanlines?: boolean;
  label?: string;
};

const SWIPE_THRESHOLD_PX = 48;

const SCANLINE_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, rgba(3,2,5,0.1) 0px, rgba(3,2,5,0.1) 1px, rgba(3,2,5,0) 1px, rgba(3,2,5,0) 3px)",
} as const;

/** Slide width and neighbour overlap, both as a share of the viewport width. */
const INTERLACED_LAYOUT = {
  mobile: { basis: 84, overlap: 6 },
  desktop: { basis: 68, overlap: 10 },
} as const;

export function Carousel({
  images,
  autoPlayMs = 0,
  aspectRatio = "16 / 10",
  interlaced = false,
  scanlines = false,
  label = "Gallery",
}: CarouselProps) {
  const total = images.length;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthQuery = window.matchMedia("(min-width: 768px)");
    setPrefersReducedMotion(motionQuery.matches);
    setIsDesktop(widthQuery.matches);

    const onMotionChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);
    const onWidthChange = (event: MediaQueryListEvent) =>
      setIsDesktop(event.matches);

    motionQuery.addEventListener("change", onMotionChange);
    widthQuery.addEventListener("change", onWidthChange);
    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      widthQuery.removeEventListener("change", onWidthChange);
    };
  }, []);

  useEffect(() => {
    if (!autoPlayMs || isPaused || prefersReducedMotion || total <= 1) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % total),
      autoPlayMs
    );
    return () => window.clearInterval(timer);
  }, [autoPlayMs, isPaused, prefersReducedMotion, total]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const startX = pointerStartX.current;
    pointerStartX.current = null;
    if (startX === null) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  if (total === 0) return null;

  const layout = interlaced
    ? isDesktop
      ? INTERLACED_LAYOUT.desktop
      : INTERLACED_LAYOUT.mobile
    : { basis: 100, overlap: 0 };

  // Negative margins make neighbours overlap, so a slide advances by less than
  // its own width; centring the active slide keeps the peek symmetric.
  const step = layout.basis - layout.overlap;
  const trackOffset = 50 - step / 2 - index * step;

  return (
    <div
      className="group relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        className="relative overflow-hidden touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
      >
        <div
          className="flex w-full items-center transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(${trackOffset}%)` }}
        >
          {images.map((image, slideIndex) => {
            const isActive = slideIndex === index;
            // Slides are translated outside the clipping box, so lazy loading
            // never triggers for neighbours - preload them to avoid a flash.
            const distance = Math.min(
              Math.abs(slideIndex - index),
              total - Math.abs(slideIndex - index)
            );
            return (
              <div
                key={image.src}
                className="relative shrink-0 grow-0"
                style={{
                  flexBasis: `${layout.basis}%`,
                  marginLeft: `${-layout.overlap / 2}%`,
                  marginRight: `${-layout.overlap / 2}%`,
                  zIndex: isActive ? 20 : 10,
                }}
                aria-hidden={!isActive}
              >
                <div
                  style={{ aspectRatio }}
                  className={`relative w-full overflow-hidden rounded-sm border bg-[#0a0612] transition-all duration-700 ease-out motion-reduce:transition-none ${
                    isActive
                      ? "border-[#3b1c4a] opacity-100 scale-100 shadow-[0_0_60px_rgba(107,33,168,0.25)]"
                      : "border-[#3b1c4a]/40 opacity-35 scale-[0.9] grayscale-[40%]"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    quality={85}
                    sizes="(max-width: 768px) 84vw, 700px"
                    loading={distance <= 1 ? "eager" : "lazy"}
                    className="object-cover opacity-90 select-none brightness-[0.96] contrast-[1.04] saturate-[0.95]"
                    draggable={false}
                  />
                  {scanlines && (
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-multiply"
                      style={SCANLINE_STYLE}
                      aria-hidden
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030205]/55 via-transparent to-transparent" />
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-1 top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-sm border border-[#3b1c4a] bg-[#030205]/80 text-[#c39bd3] backdrop-blur-sm transition-colors duration-500 hover:border-[#c39bd3] hover:bg-[#6b21a8] hover:text-white md:left-3 md:h-12 md:w-12"
        >
          <ChevronLeft size={20} strokeWidth={1} className="shrink-0" />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-1 top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-sm border border-[#3b1c4a] bg-[#030205]/80 text-[#c39bd3] backdrop-blur-sm transition-colors duration-500 hover:border-[#c39bd3] hover:bg-[#6b21a8] hover:text-white md:right-3 md:h-12 md:w-12"
        >
          <ChevronRight size={20} strokeWidth={1} className="shrink-0" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <div className="flex items-center gap-2">
          {images.map((image, slideIndex) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(slideIndex)}
              aria-label={`Go to slide ${slideIndex + 1}`}
              aria-current={slideIndex === index}
              className={`h-[2px] transition-all duration-500 ${
                slideIndex === index
                  ? "w-8 bg-[#c39bd3]"
                  : "w-4 bg-[#3b1c4a] hover:bg-[#9b59b6]"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#6b4a7a]">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
