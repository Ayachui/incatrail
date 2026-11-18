"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, PackageCheck, Send, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/lib/i18n/translations";

export type PublicB2BLot = {
  id: string;
  sourceBatchId: string;
  productType: string;
  productLabel: string;
  title: string;
  subtitle: string;
  heroImageUrl?: string;
  initialKg: number | null;
  allocatedKg: number | null;
  availableKg: number | null;
  nftTokenId?: string;
  mintTxHash?: string;
  basescanNftUrl?: string;
  origin?: {
    farmerName?: string;
    community?: string;
    region: string;
    harvestDate?: string;
  };
  fmadSummary?: {
    thermalShockTempC?: number;
    secondaryDryingTempC?: number;
    finalMoisturePercent?: number;
    dryWeightKg?: number;
    purpleCutConfirmation?: boolean;
  };
  verifiedOnChain: boolean;
  traceUrl: string;
};

type InquiryType = "sample" | "reserve" | "commercial";

const COPY: Record<
  Lang,
  {
    eyebrow: string;
    heading: string;
    subheading: string;
    totalLabel: string;
    allocatedLabel: string;
    availableLabel: string;
    originLabel: string;
    dryingLabel: string;
    nftLabel: string;
    verifyCta: string;
    sampleCta: string;
    reserveCta: string;
    commercialCta: string;
    viewAllCta: string;
    tabActive: string;
    tabPast: string;
    allocatedBadge: string;
    emptyActiveText: string;
    viewPastCta: string;
    emptyText: string;
    priceNote: string;
    modalTitleSample: string;
    modalTitleReserve: string;
    modalTitleCommercial: string;
    companyLabel: string;
    contactLabel: string;
    emailLabel: string;
    phoneLabel: string;
    countryLabel: string;
    lotLabel: string;
    kgLabel: string;
    messageLabel: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successBody: string;
  }
> = {
  es: {
    eyebrow: "RESERVA DE LOTES EN VIVO • B2B",
    heading: "Reserva de Lotes Verificados",
    subheading:
      "Inventario en vivo de lotes cerrados con NFT acuñado en Base L2. Trazabilidad completa desde finca Shuar en Zamora-Chinchipe. Precios bajo cotización directa.",
    totalLabel: "Volumen total",
    allocatedLabel: "Asignado / Reservado",
    availableLabel: "Disponible",
    originLabel: "Origen",
    dryingLabel: "Secado / Estabilización",
    nftLabel: "NFT Base L2",
    verifyCta: "Pasaporte de trazabilidad",
    sampleCta: "Solicitar muestra",
    reserveCta: "Reservar volumen",
    commercialCta: "Consulta comercial B2B",
    viewAllCta: "Ver todo el inventario de lotes",
    tabActive: "En stock ahora",
    tabPast: "Lotes distribuidos",
    allocatedBadge: "DISTRIBUIDO • 0 KG",
    emptyActiveText:
      "Los lotes actuales han sido asignados. Nuevas cosechas verificadas en Base L2 están en estabilización.",
    viewPastCta: "Ver historial de lotes pasados",
    emptyText: "Actualmente estamos preparando los próximos lotes verificados en Base L2. Contáctanos para reservas anticipadas.",
    priceNote: "Precios B2B exclusivamente bajo cotización",
    modalTitleSample: "Solicitar muestra de lote",
    modalTitleReserve: "Solicitar reserva de volumen",
    modalTitleCommercial: "Consulta comercial B2B",
    companyLabel: "Empresa / Marca",
    contactLabel: "Persona de contacto",
    emailLabel: "Correo electrónico corporativo",
    phoneLabel: "WhatsApp / Teléfono",
    countryLabel: "País de destino",
    lotLabel: "Lote seleccionado",
    kgLabel: "Volumen solicitado (kg)",
    messageLabel: "Detalles (muestras, ficha técnica, Incoterms)",
    submitBtn: "Enviar solicitud",
    submittingBtn: "Enviando…",
    successTitle: "Solicitud recibida",
    successBody:
      "Hemos enviado una confirmación a tu correo y notificado a info@incatrailfoods.com. Las reservas de kilogramos se confirman tras la revisión de nuestro equipo.",
  },
  en: {
    eyebrow: "LIVE LOT RESERVE • B2B INVENTORY",
    heading: "Verified Origin Lot Reserve",
    subheading:
      "Live inventory of closed cacao lots verified with Base L2 NFTs. Full farm-to-export provenance from Zamora-Chinchipe. Wholesale pricing strictly on request.",
    totalLabel: "Total Volume",
    allocatedLabel: "Allocated / Reserved",
    availableLabel: "Available",
    originLabel: "Origin",
    dryingLabel: "Drying / Processing",
    nftLabel: "Base L2 NFT",
    verifyCta: "Traceability Passport",
    sampleCta: "Request Sample",
    reserveCta: "Reserve Volume",
    commercialCta: "Commercial Inquiry",
    viewAllCta: "Open full Live Lot Reserve",
    tabActive: "Available in Stock",
    tabPast: "Past / Allocated Lots",
    allocatedBadge: "ALLOCATED • 0 KG",
    emptyActiveText:
      "Current lots have been fully allocated. Next Base L2 verified harvests are in preparation.",
    viewPastCta: "View past verified lots",
    emptyText: "New Base L2 verified lots are currently being stabilized. Submit a commercial inquiry for upcoming harvests.",
    priceNote: "Wholesale pricing on request",
    modalTitleSample: "Request Lot Sample",
    modalTitleReserve: "Request Lot Volume Reservation",
    modalTitleCommercial: "B2B Commercial Inquiry",
    companyLabel: "Company / Chocolate Maker",
    contactLabel: "Contact Name",
    emailLabel: "Business Email",
    phoneLabel: "WhatsApp / Phone",
    countryLabel: "Destination Country",
    lotLabel: "Selected Lot",
    kgLabel: "Requested Volume (kg)",
    messageLabel: "Requirements (samples, COA, Incoterms)",
    submitBtn: "Submit Request",
    submittingBtn: "Sending…",
    successTitle: "Request Received",
    successBody:
      "An auto-confirmation has been sent to your email and our team at info@incatrailfoods.com has been notified. Lot kg are locked upon team confirmation.",
  },
  ru: {
    eyebrow: "РЕЗЕРВ ЛОТОВ • B2B СКЛАД",
    heading: "Резерв верифицированных лотов",
    subheading:
      "Актуальный остаток закрытых лотов с выпущенным NFT в сети Base L2. Полная прослеживаемость из Самора-Чинчипе. Цены предоставляются только по B2B-запросу.",
    totalLabel: "Объём лота",
    allocatedLabel: "Распределено",
    availableLabel: "Доступно",
    originLabel: "Происхождение",
    dryingLabel: "Параметры сушки",
    nftLabel: "NFT в Base L2",
    verifyCta: "Паспорт прослеживаемости",
    sampleCta: "Запросить образцы",
    reserveCta: "Зарезервировать объём",
    commercialCta: "Коммерческий запрос",
    viewAllCta: "Открыть весь склад лотов",
    tabActive: "В наличии сейчас",
    tabPast: "Прошлые / Распределённые",
    allocatedBadge: "РАСПРЕДЕЛЕНО • 0 КГ",
    emptyActiveText:
      "Текущие лоты полностью распределены. Следующие урожаи с NFT-верификацией готовятся к отгрузке.",
    viewPastCta: "Посмотреть прошлые лоты",
    emptyText: "Очередные лоты с NFT-верификацией готовятся к отгрузке. Оставьте запрос для бронирования следующего урожая.",
    priceNote: "Цены предоставляются по запросу",
    modalTitleSample: "Запрос образцов лота",
    modalTitleReserve: "Резервирование остатка лота",
    modalTitleCommercial: "Коммерческий запрос B2B",
    companyLabel: "Компания / Производство",
    contactLabel: "Контактное лицо",
    emailLabel: "Рабочий Email",
    phoneLabel: "WhatsApp / Telegram",
    countryLabel: "Страна доставки",
    lotLabel: "Выбранный лот",
    kgLabel: "Запрашиваемый объём (кг)",
    messageLabel: "Комментарий (образцы, спецификация, Incoterms)",
    submitBtn: "Отправить заявку",
    submittingBtn: "Отправка…",
    successTitle: "Заявка принята",
    successBody:
      "Подтверждение отправлено на ваш email, а уведомление — менеджеру на info@incatrailfoods.com. Резерв фиксируется после подтверждения администратором.",
  },
};

export function B2BReserveClient({ mode = "full" }: { mode?: "full" | "preview" }) {
  const { lang } = useLanguage();
  const c = COPY[lang];

  const [lots, setLots] = useState<PublicB2BLot[]>([]);
  const [viewFilter, setViewFilter] = useState<"active" | "past">("active");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState<InquiryType>("sample");
  const [selectedLot, setSelectedLot] = useState<PublicB2BLot | null>(null);

  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWhatsapp, setPhoneWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [requestedKg, setRequestedKg] = useState("");
  const [message, setMessage] = useState("");
  const [websiteHp, setWebsiteHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedOk, setSubmittedOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/itf/showcase", { cache: "no-store" });
        const json = (await res.json()) as { ok?: boolean; items?: PublicB2BLot[]; error?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load lots");
        if (!cancelled) setLots(json.items || []);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Load error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeLots = useMemo(() => lots.filter((l) => (l.availableKg ?? 0) > 0), [lots]);
  const pastLots = useMemo(() => lots.filter((l) => (l.availableKg ?? 0) <= 0), [lots]);

  const visibleLots = useMemo(() => {
    const source = viewFilter === "active" ? activeLots : pastLots;
    return mode === "preview" ? source.slice(0, 3) : source;
  }, [activeLots, pastLots, viewFilter, mode]);

  const openModal = (type: InquiryType, lot: PublicB2BLot | null) => {
    setInquiryType(type);
    setSelectedLot(lot);
    setRequestedKg(lot?.availableKg ? String(Math.min(5, lot.availableKg)) : "");
    setSubmittedOk(false);
    setSubmitError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/itf/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: inquiryType,
          batchId: selectedLot?.sourceBatchId,
          requestedKg: inquiryType === "reserve" ? Number(requestedKg) : undefined,
          company,
          contactName,
          email,
          phoneWhatsapp,
          country,
          message,
          locale: lang,
          website: websiteHp,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed");
      setSubmittedOk(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reserve" className="py-24 md:py-32 bg-[#050309] border-t border-[#3b1c4a]/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-[#9b59b6]" />
              <p className="text-[#c39bd3] text-xs font-light tracking-[0.25em] uppercase">
                {c.eyebrow}
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
              {c.heading}
            </h2>
            <p className="mt-4 text-neutral-400 font-light text-base leading-relaxed">
              {c.subheading}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openModal("commercial", null)}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#6b21a8] bg-[#6b21a8]/15 text-[#e4c8f2] text-xs tracking-[0.15em] uppercase hover:bg-[#6b21a8] hover:text-white transition"
            >
              <Send size={14} />
              {c.commercialCta}
            </button>
            {mode === "preview" ? (
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#3b1c4a] text-neutral-300 text-xs tracking-[0.15em] uppercase hover:border-[#c39bd3] hover:text-white transition"
              >
                {c.viewAllCta}
              </Link>
            ) : null}
          </div>
        </div>

        {/* Sleek Active vs Past / Distributed Switcher */}
        {!loading && !loadError && lots.length > 0 ? (
          <div className="mb-10 inline-flex flex-wrap items-center gap-1.5 border border-[#3b1c4a]/70 bg-[#0a0612] p-1">
            <button
              type="button"
              onClick={() => setViewFilter("active")}
              className={`px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                viewFilter === "active"
                  ? "bg-[#6b21a8] text-white font-medium shadow-[0_0_20px_rgba(107,33,168,0.35)]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {c.tabActive} ({activeLots.length})
            </button>
            <button
              type="button"
              onClick={() => setViewFilter("past")}
              className={`px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                viewFilter === "past"
                  ? "bg-[#3b1c4a] text-white font-medium"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {c.tabPast} ({pastLots.length})
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 animate-pulse border border-[#3b1c4a]/40 bg-[#0a0612]" />
            ))}
          </div>
        ) : loadError ? (
          <div className="border border-red-900/50 bg-[#12070d] p-6 text-sm text-red-200">
            {loadError}
          </div>
        ) : !visibleLots.length ? (
          <div className="border border-[#3b1c4a]/50 bg-[#0a0612] p-10 text-center">
            <p className="text-neutral-300 font-light">
              {viewFilter === "active" && pastLots.length > 0 ? c.emptyActiveText : c.emptyText}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {viewFilter === "active" && pastLots.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setViewFilter("past")}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#3b1c4a] text-neutral-200 text-xs uppercase tracking-[0.15em] hover:border-[#c39bd3] hover:text-white transition"
                >
                  {c.viewPastCta} ({pastLots.length})
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => openModal("commercial", null)}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#6b21a8] text-[#c39bd3] text-xs uppercase tracking-[0.15em] hover:bg-[#6b21a8] hover:text-white transition"
              >
                {c.commercialCta}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleLots.map((lot) => {
              const total = lot.initialKg ?? 0;
              const avail = lot.availableKg ?? 0;
              const alloc = lot.allocatedKg ?? Math.max(0, total - avail);
              const pctAvail = total > 0 ? Math.min(100, Math.round((avail / total) * 100)) : 0;

              return (
                <article
                  key={lot.id}
                  className={`flex flex-col border bg-[#0a0612] transition-colors ${
                    avail > 0
                      ? "border-[#3b1c4a]/60 hover:border-[#9b59b6]/70"
                      : "border-neutral-800/80 opacity-85 hover:opacity-100"
                  }`}
                >
                  {lot.heroImageUrl ? (
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-[#3b1c4a]/40 bg-[#140a24]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lot.heroImageUrl}
                        alt={lot.subtitle}
                        className="h-full w-full object-cover opacity-90"
                      />
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#030205]/85 border border-[#6b21a8]/70 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#d9b8eb]">
                        <ShieldCheck size={12} />
                        Base L2 NFT #{lot.nftTokenId || "Verified"}
                      </span>
                      {avail <= 0 ? (
                        <span className="absolute top-3 right-3 bg-[#030205]/90 border border-neutral-600 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-300">
                          {c.allocatedBadge}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#c39bd3]">
                          {lot.subtitle}
                        </p>
                        <h3 className="mt-1 font-serif text-2xl text-white">{lot.productLabel}</h3>
                      </div>
                      <span className="text-[11px] italic text-neutral-500">{c.priceNote}</span>
                    </div>

                    {/* Inventory Bar */}
                    <div className="mt-5 border border-[#3b1c4a]/50 bg-[#050309] p-4">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-neutral-500">{c.totalLabel}</div>
                          <div className="font-mono text-sm text-white font-semibold">{total} kg</div>
                        </div>
                        <div>
                          <div className="text-neutral-500">{c.allocatedLabel}</div>
                          <div className="font-mono text-sm text-neutral-300">{alloc} kg</div>
                        </div>
                        <div>
                          <div className="text-neutral-500">{c.availableLabel}</div>
                          <div className="font-mono text-sm text-emerald-400 font-semibold">
                            {avail} kg
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 w-full bg-[#1a0e2e] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7d3c98] to-emerald-400"
                          style={{ width: `${pctAvail}%` }}
                        />
                      </div>
                    </div>

                    {/* Origin & FMAD */}
                    <dl className="mt-5 space-y-2 text-xs text-neutral-300 font-light">
                      <div className="flex justify-between gap-3">
                        <dt className="text-neutral-500">{c.originLabel}</dt>
                        <dd className="text-right">
                          {lot.origin?.community || lot.origin?.region}
                          {lot.origin?.farmerName ? ` · ${lot.origin.farmerName}` : ""}
                        </dd>
                      </div>
                      {lot.fmadSummary ? (
                        <div className="flex justify-between gap-3">
                          <dt className="text-neutral-500">{c.dryingLabel}</dt>
                          <dd className="text-right font-mono">
                            {lot.fmadSummary.thermalShockTempC ?? 75}°C →{" "}
                            {lot.fmadSummary.secondaryDryingTempC ?? 40}°C ·{" "}
                            {lot.fmadSummary.finalMoisturePercent ?? "≤8"}% H₂O
                          </dd>
                        </div>
                      ) : null}
                      {lot.basescanNftUrl ? (
                        <div className="flex justify-between gap-3">
                          <dt className="text-neutral-500">{c.nftLabel}</dt>
                          <dd>
                            <a
                              href={lot.basescanNftUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-[#c39bd3] hover:text-white underline"
                            >
                              Basescan <ExternalLink size={11} />
                            </a>
                          </dd>
                        </div>
                      ) : null}
                    </dl>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-[#3b1c4a]/40 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openModal("sample", lot)}
                          className="px-3 py-2.5 border border-[#3b1c4a] text-neutral-200 text-[11px] uppercase tracking-wider hover:border-[#c39bd3] hover:text-white transition"
                        >
                          {c.sampleCta}
                        </button>
                        <button
                          type="button"
                          disabled={avail <= 0}
                          onClick={() => openModal("reserve", lot)}
                          className="px-3 py-2.5 bg-[#6b21a8] text-white text-[11px] uppercase tracking-wider hover:bg-[#7e22ce] disabled:opacity-40 transition"
                        >
                          {c.reserveCta}
                        </button>
                      </div>
                      <Link
                        href={`/trace/${encodeURIComponent(lot.sourceBatchId)}`}
                        className="flex items-center justify-center gap-1.5 py-2 text-xs text-[#c39bd3] hover:text-white transition"
                      >
                        <Sparkles size={13} />
                        {c.verifyCta} →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* B2B Inquiry / Sample / Reserve Modal */}
      {modalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg border border-[#3b1c4a] bg-[#0a0612] p-6 md:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#3b1c4a]/50 pb-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#c39bd3]">
                  The Inca Trail Foods · B2B
                </p>
                <h3 className="mt-1 font-serif text-2xl text-white">
                  {inquiryType === "sample"
                    ? c.modalTitleSample
                    : inquiryType === "reserve"
                      ? c.modalTitleReserve
                      : c.modalTitleCommercial}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {submittedOk ? (
              <div className="py-8 text-center space-y-4">
                <PackageCheck className="mx-auto text-emerald-400" size={40} />
                <h4 className="font-serif text-2xl text-white">{c.successTitle}</h4>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  {c.successBody}
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mt-2 px-6 py-2.5 bg-[#6b21a8] text-xs uppercase tracking-widest text-white"
                >
                  OK
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 space-y-4 text-sm">
                {/* Honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={websiteHp}
                  onChange={(e) => setWebsiteHp(e.target.value)}
                  className="hidden"
                  aria-hidden
                />

                {selectedLot ? (
                  <div className="border border-[#3b1c4a] bg-[#050309] px-3.5 py-2.5 text-xs flex justify-between">
                    <span className="text-neutral-400">{c.lotLabel}:</span>
                    <span className="font-mono text-[#c39bd3]">
                      {selectedLot.subtitle} ({selectedLot.availableKg ?? 0} kg)
                    </span>
                  </div>
                ) : null}

                {inquiryType === "reserve" ? (
                  <label className="block text-xs text-neutral-300">
                    {c.kgLabel} *
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max={selectedLot?.availableKg ?? undefined}
                      required
                      value={requestedKg}
                      onChange={(e) => setRequestedKg(e.target.value)}
                      className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 text-white font-mono"
                    />
                  </label>
                ) : null}

                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block text-xs text-neutral-300">
                    {c.companyLabel} *
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 text-white"
                    />
                  </label>
                  <label className="block text-xs text-neutral-300">
                    {c.contactLabel} *
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 text-white"
                    />
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block text-xs text-neutral-300">
                    {c.emailLabel} *
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 text-white"
                    />
                  </label>
                  <label className="block text-xs text-neutral-300">
                    {c.phoneLabel}
                    <input
                      type="text"
                      value={phoneWhatsapp}
                      onChange={(e) => setPhoneWhatsapp(e.target.value)}
                      className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 text-white"
                    />
                  </label>
                </div>

                <label className="block text-xs text-neutral-300">
                  {c.countryLabel}
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 text-white"
                  />
                </label>

                <label className="block text-xs text-neutral-300">
                  {c.messageLabel} *
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 w-full border border-[#3b1c4a] bg-[#050309] px-3 py-2 text-white"
                  />
                </label>

                {submitError ? (
                  <p className="text-xs text-red-400">{submitError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#6b21a8] text-white text-xs uppercase tracking-[0.18em] hover:bg-[#7e22ce] disabled:opacity-50 transition"
                >
                  {submitting ? c.submittingBtn : c.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
