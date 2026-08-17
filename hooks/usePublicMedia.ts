"use client";

import { useState, useEffect } from "react";

export const MEDIA = {
  heroVideo: "/media/hero.mp4",
  heroPoster: "/media/hero-poster.jpg",
  heroImage: "/media/hero.jpg",
  terroir: "/media/terroir.jpg",
} as const;

export const FALLBACK_HERO_IMAGE =
  "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=1920";
/** Pexels slug for this id changed (404); keep Unsplash - allowed in next.config */
export const FALLBACK_TERROIR_IMAGE =
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80";

export const heroMediaClass =
  "object-cover scale-105 brightness-[0.28] contrast-[1.15] grayscale-[35%]";

async function mediaExists(path: string): Promise<boolean> {
  try {
    const r = await fetch(path, { method: "HEAD", cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}

export function usePublicMedia() {
  const [hasHeroVideo, setHasHeroVideo] = useState(false);
  const [hasHeroPoster, setHasHeroPoster] = useState(false);
  const [hasHeroImage, setHasHeroImage] = useState(false);
  const [hasTerroirImage, setHasTerroirImage] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [v, p, h, t] = await Promise.all([
          mediaExists(MEDIA.heroVideo),
          mediaExists(MEDIA.heroPoster),
          mediaExists(MEDIA.heroImage),
          mediaExists(MEDIA.terroir),
        ]);
        if (cancelled) return;
        setHasHeroVideo(v);
        setHasHeroPoster(p);
        setHasHeroImage(h);
        setHasTerroirImage(t);
      } catch {
        if (cancelled) return;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const heroImageSrc = hasHeroImage ? MEDIA.heroImage : FALLBACK_HERO_IMAGE;
  const terroirImageSrc = hasTerroirImage ? MEDIA.terroir : FALLBACK_TERROIR_IMAGE;

  return { hasHeroVideo, hasHeroPoster, heroImageSrc, terroirImageSrc };
}
