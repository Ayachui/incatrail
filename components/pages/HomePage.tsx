"use client";

import Image from "next/image";
import {
  ShieldCheck,
  Leaf,
  ChevronDown,
  Mountain,
  FlaskConical,
  Sparkles,
  Activity,
  Link as LinkIcon,
  QrCode,
  Camera,
  Mail,
  Phone,
  MapPin,
  Hexagon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  MEDIA,
  heroMediaClass,
  usePublicMedia,
} from "@/hooks/usePublicMedia";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const { hasHeroVideo, hasHeroPoster, heroImageSrc, terroirImageSrc } =
    usePublicMedia();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {hasHeroVideo ? (
            <>
              <div className="absolute inset-0 z-0 min-h-full w-full">
                <Image
                  src={heroImageSrc}
                  alt=""
                  fill
                  priority
                  className={heroMediaClass}
                  sizes="100vw"
                />
              </div>
              <video
                className={`absolute inset-0 z-[1] h-full w-full ${heroMediaClass} motion-reduce:hidden`}
                autoPlay
                muted
                loop
                playsInline
                poster={
                  hasHeroPoster ? MEDIA.heroPoster : undefined
                }
                aria-hidden
              >
                <source src={MEDIA.heroVideo} type="video/mp4" />
              </video>
            </>
          ) : (
            <div className="absolute inset-0 z-0 min-h-full w-full">
              <Image
                src={heroImageSrc}
                alt=""
                fill
                priority
                className={heroMediaClass}
                sizes="100vw"
              />
            </div>
          )}
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a0b2e]/70 via-[#030205]/82 to-[#030205]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-[#6b21a8]/20 rounded-full blur-[120px] md:blur-[150px] pointer-events-none z-0" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex-grow flex flex-col justify-center">
          <FadeIn delay={0.2} duration={1.5}>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-6 md:w-8 h-[1px] bg-[#9b59b6]"></div>
              <p className="text-[#c39bd3] text-xs md:text-sm font-light tracking-[0.3em] uppercase">
                {t.hero.pre}
              </p>
              <div className="w-6 md:w-8 h-[1px] bg-[#9b59b6]"></div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.5} duration={1.5}>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white leading-[1.1] mb-8 font-light">
              {t.hero.title1} <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#c39bd3] to-[#7d3c98]">{t.hero.title2}</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.8} duration={1.5}>
            <p className="text-base md:text-xl text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed mb-16">
              {t.hero.desc}
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={1.1} duration={1.5}>
          <a href="#philosophy" className="relative z-10 flex items-center justify-center text-[#9b59b6] hover:text-white transition-colors duration-500 cursor-pointer p-4">
            <ChevronDown size={32} className="animate-bounce font-light" strokeWidth={1} />
          </a>
        </FadeIn>
      </section>

      {/* The Purple Philosophy */}
      <section id="philosophy" className="py-24 md:py-32 bg-[#030205] relative border-b border-[#3b1c4a]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <FadeIn direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#4a235a] to-transparent opacity-20 blur-2xl"></div>
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight relative">
                  {t.phil.title1} <br/><span className="text-[#c39bd3] italic">{t.phil.title2}</span>
                </h2>
                <div className="space-y-6 text-neutral-400 font-light text-base md:text-lg leading-relaxed relative">
                  <p>{t.phil.p1}</p>
                  <p>
                    {t.phil.p2.split('«Фиолетовое Золото»')[0]}
                    {lang === "ru" ? (
                      <strong className="text-white font-normal">«Фиолетовое Золото»</strong>
                    ) : lang === "es" ? (
                      <strong className="text-white font-normal">«Oro Púrpura»</strong>
                    ) : (
                      <strong className="text-white font-normal">
                        {"'Purple Gold'"}
                      </strong>
                    )}
                    {t.phil.p2.split('«Фиолетовое Золото»')[1] || t.phil.p2.split("'Purple Gold'")[1] || t.phil.p2.split("'Oro Púrpura'")[1]}
                  </p>
                  <p>{t.phil.p3}</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto lg:max-w-none">
                <div className="bg-[#0a0612] p-8 border border-[#3b1c4a] rounded-sm text-center flex flex-col items-center">
                  <ShieldCheck className="text-[#9b59b6] mb-4 shrink-0" size={32} strokeWidth={1} />
                  <h4 className="text-white font-serif text-xl mb-2">{t.phil.f1}</h4>
                  <p className="text-neutral-500 text-sm font-light">{t.phil.f1d}</p>
                </div>
                <div className="bg-[#0a0612] p-8 border border-[#3b1c4a] rounded-sm text-center flex flex-col items-center">
                  <Activity className="text-[#9b59b6] mb-4 shrink-0" size={32} strokeWidth={1} />
                  <h4 className="text-white font-serif text-xl mb-2">{t.phil.f2}</h4>
                  <p className="text-neutral-500 text-sm font-light">{t.phil.f2d}</p>
                </div>
                <div className="sm:col-span-2 flex justify-center">
                  <div className="w-full sm:w-[calc(50%-0.75rem)]">
                    <div className="bg-[#0a0612] p-8 border border-[#3b1c4a] rounded-sm text-center flex flex-col items-center">
                      <Hexagon className="text-[#9b59b6] mb-4 shrink-0" size={32} strokeWidth={1} />
                      <h4 className="text-white font-serif text-xl mb-2">{t.phil.f3}</h4>
                      <p className="text-neutral-500 text-sm font-light">{t.phil.f3d}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Terroir Section */}
      <section id="terroir" className="py-24 md:py-32 bg-[#050308] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <FadeIn direction="right">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[#3b1c4a]/50 group">
                <div className="absolute inset-0 bg-[#4a235a]/10 group-hover:bg-transparent transition-colors duration-1000 z-10 pointer-events-none"></div>
                <Image
                  src={terroirImageSrc}
                  alt="Zamora Chinchipe — Amazon forest / Bosque Amazónico"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-80 grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-[#9b59b6]"></div>
                  <p className="text-[#c39bd3] text-xs font-light tracking-[0.2em] uppercase">{t.terroir.pre}</p>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                  {t.terroir.title1}<br/>
                  <span className="text-2xl md:text-3xl text-[#c39bd3] italic mt-3 block">{t.terroir.title2}</span>
                </h2>

                <div className="space-y-6 text-neutral-400 font-light text-base md:text-lg leading-relaxed">
                  <p>{t.terroir.p1}</p>
                  <p>{t.terroir.p2}</p>
                  <p className="text-neutral-300 italic border-l-2 border-[#6b21a8] pl-6 mt-6">
                    {t.terroir.p3}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* The 10-Hour Rule (Process) */}
      <section id="process" className="py-24 md:py-32 bg-[#020104] relative border-y border-[#3b1c4a]/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#4a235a]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">{t.process.title}</h2>
              <p className="text-neutral-400 font-light text-base md:text-lg">
                {t.process.desc}
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="max-w-md mx-auto mb-16 md:mb-20">
              <div className="relative aspect-[3/4] overflow-hidden border border-[#3b1c4a]/50 bg-[#0a0612]">
                <Image
                  src="/media/20260422_160026.jpg"
                  alt="Cacao beans right after forest harvest"
                  fill
                  sizes="(max-width: 768px) 80vw, 420px"
                  className="object-cover object-center opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030205]/80 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-xs uppercase tracking-[0.16em] text-[#c39bd3]">
                  {t.process.photoCaption}
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-[#3b1c4a] -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
              <FadeIn delay={0.1}>
                <div className="bg-[#0a0612] border border-[#3b1c4a]/50 p-8 md:p-10 relative group hover:border-[#c39bd3]/50 transition-colors duration-500 h-full flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-[#020104] px-4 mb-6 md:mb-0">
                    <span className="text-[#c39bd3] font-serif italic text-2xl">0h</span>
                  </div>
                  <h4 className="text-xl font-serif text-white text-center mt-2 md:mt-6 mb-4">{t.process.s1}</h4>
                  <p className="text-neutral-400 text-sm font-light text-center leading-relaxed flex-grow">
                    {t.process.d1}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="bg-[#0a0612] border border-[#3b1c4a]/50 p-8 md:p-10 relative group hover:border-[#c39bd3]/50 transition-colors duration-500 h-full flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-[#020104] px-4 mb-6 md:mb-0">
                    <span className="text-[#c39bd3] font-serif italic text-2xl">3h</span>
                  </div>
                  <h4 className="text-xl font-serif text-white text-center mt-2 md:mt-6 mb-4">{t.process.s2}</h4>
                  <p className="text-neutral-400 text-sm font-light text-center leading-relaxed flex-grow">
                    {t.process.d2}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="bg-[#0a0612] border border-[#3b1c4a]/50 p-8 md:p-10 relative group hover:border-[#c39bd3]/50 transition-colors duration-500 h-full flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-[#020104] px-4 mb-6 md:mb-0">
                    <span className="text-[#c39bd3] font-serif italic text-2xl">10h</span>
                  </div>
                  <h4 className="text-xl font-serif text-white text-center mt-2 md:mt-6 mb-4">{t.process.s3}</h4>
                  <p className="text-neutral-400 text-sm font-light text-center leading-relaxed flex-grow">
                    {t.process.d3}
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Comparisons Section (Tables) */}
      <section id="comparison" className="py-24 md:py-32 bg-[#050308] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">{t.comp.title}</h2>
              <p className="text-neutral-400 font-light text-base md:text-lg max-w-2xl mx-auto">
                {t.comp.desc}
              </p>
            </div>
          </FadeIn>

          {/* Table 1 */}
          <FadeIn delay={0.2}>
            <div className="mb-16">
              <h3 className="text-xl font-serif text-[#c39bd3] mb-6 flex items-center gap-3">
                <ShieldCheck size={20} className="shrink-0" /> {t.comp.t1Title}
              </h3>
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#3b1c4a]">
                      <th className="py-4 px-4 text-neutral-500 font-light w-1/4">{t.comp.th1}</th>
                      <th className="py-4 px-4 text-neutral-400 font-normal w-1/4">{t.comp.th2}</th>
                      <th className="py-4 px-4 text-neutral-300 font-normal w-1/4">{t.comp.th3}</th>
                      <th className="py-4 px-4 text-[#c39bd3] font-serif text-lg w-1/4 border-l border-[#3b1c4a] bg-[#0a0612]/50">{t.comp.th4}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-light">
                    {t.comp.table1.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-900 hover:bg-[#0a0612]/30 transition-colors">
                        <td className="py-4 px-4 text-neutral-400">{row.p}</td>
                        <td className="py-4 px-4 text-neutral-500">{row.i}</td>
                        <td className="py-4 px-4 text-neutral-300">{row.f}</td>
                        <td className="py-4 px-4 text-white border-l border-[#3b1c4a] bg-[#0a0612]/50">
                          {idx === 0 || idx === 1 ? (
                            <span><strong className="font-normal text-[#c39bd3]">{row.in.split('.')[0]}{idx === 0 ? '.' : ''}</strong>{row.in.substring(row.in.indexOf('.') + (idx === 0 ? 1 : 0))}</span>
                          ) : (
                            row.in
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>

          {/* Table 2 */}
          <FadeIn delay={0.3}>
            <div>
              <h3 className="text-xl font-serif text-[#c39bd3] mb-6 flex items-center gap-3">
                <Activity size={20} className="shrink-0" /> {t.comp.t2Title}
              </h3>
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#3b1c4a]">
                      <th className="py-4 px-4 text-neutral-500 font-light w-1/4">{t.comp.th1}</th>
                      <th className="py-4 px-4 text-neutral-400 font-normal w-1/4">{t.comp.th2}</th>
                      <th className="py-4 px-4 text-neutral-300 font-normal w-1/4">{t.comp.th3}</th>
                      <th className="py-4 px-4 text-[#c39bd3] font-serif text-lg w-1/4 border-l border-[#3b1c4a] bg-[#0a0612]/50">{t.comp.th4}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-light">
                    {t.comp.table2.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-900 hover:bg-[#0a0612]/30 transition-colors">
                        <td className="py-4 px-4 text-neutral-400">{row.p}</td>
                        <td className={`py-4 px-4 ${idx === 2 ? 'text-red-900/50' : 'text-neutral-500'}`}>{row.i}</td>
                        <td className="py-4 px-4 text-neutral-300">{row.f}</td>
                        <td className="py-4 px-4 text-white border-l border-[#3b1c4a] bg-[#0a0612]/50">
                          {idx === 0 && <span>{lang === 'ru' ? 'Насыщенный ' : lang === 'es' ? 'Púrpura ' : 'Vibrant '}<strong className="font-normal text-[#c39bd3]">{lang === 'ru' ? 'Фиолетовый' : lang === 'es' ? 'Vibrante' : 'Purple'}</strong> {row.in.replace(/.*(Фиолетовый|Purple|Vibrante)/i, '')}</span>}
                          {idx === 1 && row.in}
                          {idx === 2 && <span><strong className="text-green-400 font-normal">{row.in.split(' ')[0]}</strong> {row.in.substring(row.in.indexOf(' '))}</span>}
                          {idx === 3 && <strong className="text-[#c39bd3] font-normal">{row.in}</strong>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Directions of Use */}
      <section id="application" className="py-24 md:py-32 bg-[#050308] relative border-t border-[#3b1c4a]/30">
         <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">{t.usage.title}</h2>
              <p className="text-neutral-400 font-light text-base md:text-lg max-w-2xl mx-auto">
                {t.usage.desc}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div className="group p-8 md:p-10 bg-[#0a0612] border border-[#3b1c4a]/50 hover:border-[#c39bd3] transition-colors duration-500 h-full">
                <Mountain className="text-[#9b59b6] mb-6 shrink-0 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
                <h3 className="text-2xl font-serif text-white mb-4">{t.usage.f1}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t.usage.f1d}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="group p-8 md:p-10 bg-[#0a0612] border border-[#3b1c4a]/50 hover:border-[#c39bd3] transition-colors duration-500 h-full">
                <Sparkles className="text-[#9b59b6] mb-6 shrink-0 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
                <h3 className="text-2xl font-serif text-white mb-4">{t.usage.f2}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t.usage.f2d}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="group p-8 md:p-10 bg-[#0a0612] border border-[#3b1c4a]/50 hover:border-[#c39bd3] transition-colors duration-500 h-full">
                <Leaf className="text-[#9b59b6] mb-6 shrink-0 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
                <h3 className="text-2xl font-serif text-white mb-4">{t.usage.f3}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t.usage.f3d}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="group p-8 md:p-10 bg-[#0a0612] border border-[#3b1c4a]/50 hover:border-[#c39bd3] transition-colors duration-500 h-full">
                <FlaskConical className="text-[#9b59b6] mb-6 shrink-0 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
                <h3 className="text-2xl font-serif text-white mb-4">{t.usage.f4}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t.usage.f4d}</p>
              </div>
            </FadeIn>
          </div>
         </div>
      </section>

      {/* TZNK & Blockchain Section */}
      <section id="tzunki" className="py-24 md:py-32 bg-[#020104] relative border-t border-[#3b1c4a]/30 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#c39bd3 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6b21a8]/20 border border-[#9b59b6]/30 rounded text-[#c39bd3] text-xs uppercase tracking-widest font-mono">
                  <LinkIcon size={14} className="shrink-0" /> {t.tznk.pre}
                </div>
                <div className="flex items-start justify-between gap-6">
                  <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                    {t.tznk.title1} <br/>{t.tznk.title2}
                  </h2>
                  <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0">
                    <Image
                      src="/media/logo tznk.png"
                      alt="TZNK logo"
                      fill
                      sizes="(max-width: 768px) 80px, 112px"
                      className="object-contain opacity-95"
                    />
                  </div>
                </div>
                <div className="space-y-6 text-neutral-400 font-light text-base md:text-lg leading-relaxed">
                  <p>
                    {t.tznk.p1.split('TZNK')[0]}<strong className="text-white font-normal">TZNK (tzunki.com)</strong>{t.tznk.p1.split('(tzunki.com)')[1] || t.tznk.p1.split('TZNK (tzunki.com)')[1]}
                  </p>
                  <p>
                    {t.tznk.p2.split('—')[0]}— <strong className="text-white font-normal">{t.tznk.p2.split('—')[1]}</strong>
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="bg-[#0a0612] border border-[#3b1c4a] p-8 md:p-10 rounded-sm relative shadow-2xl overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/122429/leaf-nature-green-spring-122429.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt=""
                  fill
                  sizes="100vw"
                  className="absolute inset-0 object-cover opacity-10 mix-blend-overlay pointer-events-none"
                />
                <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                  <QrCode size={100} className="text-[#9b59b6]" />
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#1a0b2e] flex items-center justify-center shrink-0 border border-[#3b1c4a]">
                      <Camera size={20} className="text-[#c39bd3] shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg md:text-xl mb-1">{t.tznk.f1}</h4>
                      <p className="text-neutral-500 font-light text-sm">{t.tznk.f1d}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#1a0b2e] flex items-center justify-center shrink-0 border border-[#3b1c4a]">
                      <LinkIcon size={20} className="text-[#c39bd3] shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg md:text-xl mb-1">{t.tznk.f2}</h4>
                      <p className="text-neutral-500 font-light text-sm">{t.tznk.f2d}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#1a0b2e] flex items-center justify-center shrink-0 border border-[#3b1c4a]">
                      <QrCode size={20} className="text-[#c39bd3] shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg md:text-xl mb-1">{t.tznk.f3}</h4>
                      <p className="text-neutral-500 font-light text-sm">{t.tznk.f3d}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contacts / Partnership */}
      <section id="contacts" className="py-24 md:py-32 bg-[#020104] border-t border-[#3b1c4a]/30">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">{t.contact.title}</h2>
              <p className="text-neutral-500 font-light tracking-wide">{t.contact.desc}</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <div className="p-8 md:p-12 border border-[#3b1c4a]/50 hover:border-[#c39bd3]/50 transition-colors duration-500 bg-[#0a0612] max-w-2xl mx-auto text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-[#6b21a8]/10 pointer-events-none">
                <Leaf size={150} />
              </div>
              
              <h4 className="text-2xl font-serif text-white mb-8 relative z-10">The Inca Trail Foods</h4>
              
              <div className="flex flex-col items-center justify-center gap-6 font-light relative z-10">
                
                <div className="flex items-center gap-4 text-neutral-300">
                  <MapPin className="text-[#9b59b6] shrink-0" size={20} />
                  <span className="tracking-wide">{t.contact.loc}</span>
                </div>

                <a href="mailto:info@incatrailfoods.com" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                  <Mail className="text-[#9b59b6] shrink-0 group-hover:text-white transition-colors" size={20} />
                  <span className="tracking-wider">info@incatrailfoods.com</span>
                </a>

                <a href="https://wa.me/593982873007" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                  <Phone className="text-[#9b59b6] shrink-0 group-hover:text-white transition-colors" size={20} />
                  <span className="tracking-wider">+593 98 287 3007 <span className="text-xs text-neutral-500 ml-2">(WhatsApp / Telegram)</span></span>
                </a>

              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </>
  );
}
