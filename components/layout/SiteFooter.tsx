"use client";

export function SiteFooter() {
  return (
    <footer className="py-12 border-t border-[#3b1c4a]/30 bg-[#010002] text-center">
      <p className="text-neutral-600 text-xs font-light px-4">
        © {new Date().getFullYear()} The Inca Trail Foods. Ecuador, Zamora
        Chinchipe.
      </p>
    </footer>
  );
}
