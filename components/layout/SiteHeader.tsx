"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function SiteHeader() {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-500 bg-[#030205]/80 backdrop-blur-xl border-b border-[#3b1c4a]/30">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        <Link href="/" className="flex flex-col hover:opacity-90 transition-opacity">
          <span className="text-xl md:text-2xl font-light tracking-[0.25em] text-white uppercase font-serif">
            THE INCA TRAIL
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-[#9b59b6] uppercase mt-1">
            Ecuador • Zamora
          </span>
        </Link>

        <div className="hidden lg:flex gap-8 text-[11px] font-light tracking-[0.15em] uppercase text-neutral-400">
          <Link
            href="/#philosophy"
            className="hover:text-[#c39bd3] transition-colors duration-300"
          >
            {t.nav.concept}
          </Link>
          <Link
            href="/#process"
            className="hover:text-[#c39bd3] transition-colors duration-300"
          >
            {t.nav.process}
          </Link>
          <Link
            href="/#comparison"
            className="hover:text-[#c39bd3] transition-colors duration-300"
          >
            {t.nav.profile}
          </Link>
          <Link
            href="/#application"
            className="hover:text-[#c39bd3] transition-colors duration-300"
          >
            {t.nav.application}
          </Link>
          <Link
            href="/#tzunki"
            className="hover:text-[#c39bd3] transition-colors duration-300"
          >
            {t.nav.blockchain}
          </Link>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-xs md:text-sm font-light uppercase tracking-widest text-neutral-600">
            <button
              type="button"
              onClick={() => setLang("es")}
              className={`hover:text-white transition-colors ${lang === "es" ? "text-[#c39bd3] font-medium" : ""}`}
            >
              ES
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`hover:text-white transition-colors ${lang === "en" ? "text-[#c39bd3] font-medium" : ""}`}
            >
              EN
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setLang("ru")}
              className={`hover:text-white transition-colors ${lang === "ru" ? "text-[#c39bd3] font-medium" : ""}`}
            >
              RU
            </button>
          </div>

          <Link
            href="/#contacts"
            className="hidden md:inline-flex px-6 py-3 border border-[#6b21a8] text-[#c39bd3] text-xs font-light tracking-[0.15em] uppercase hover:bg-[#6b21a8] hover:text-white transition-all duration-500"
          >
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </nav>
  );
}
