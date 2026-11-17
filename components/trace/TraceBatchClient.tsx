"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  TRACE_BASESCAN_URL,
  TRACE_BURN_TZNK,
  TRACE_EAS_EXPLORER_URL,
  TRACE_PRODUCT_LABEL,
  buildTraceTimeline,
  burnStageLabel,
  displayTraceLotId,
  formatBabaToDryRatio,
  formatEcuadorClock,
  formatExpiryDate,
  formatTraceGeo,
  googleMapsSatelliteUrl,
  isOnChainBurn,
  isSyntheticBurn,
  lotBurnProgress,
  matchEntity,
  resolveCommunityEntity,
  resolveFarmerEntity,
  resolveShelfLifeDays,
  stagePhotosFor,
  type TraceBatchLot,
  type TraceEntity,
  type TraceGeo,
  type TraceLotStickerThumb,
} from "@/lib/trace-helpers";

type Props = { batchId: string };

function easScanUrl(uid: string): string {
  return `${TRACE_EAS_EXPLORER_URL}/attestation/view/${uid}`;
}

function QrSticker({ value, caption }: { value: string; caption: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void QRCode.toDataURL(value, {
      width: 360,
      margin: 2,
      color: { dark: "#062c1c", light: "#ffffff" },
    }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  if (!dataUrl) return null;
  return (
    <div className="mx-auto flex w-fit flex-col items-center rounded-2xl bg-white p-3 text-[#062c1c] shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt={`QR ${caption}`} className="h-44 w-44" />
      <p className="mt-1.5 font-mono text-xs font-semibold tracking-wide">{caption}</p>
    </div>
  );
}

function MediaLightbox({
  urls,
  label,
  compact,
}: {
  urls: string[];
  label?: string;
  compact?: boolean;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const unique = useMemo(() => urls.filter((u, i, a) => Boolean(u) && a.indexOf(u) === i), [urls]);

  const close = useCallback(() => setOpenIdx(null), []);
  const goPrev = useCallback(() => {
    setOpenIdx((i) => (i === null || i <= 0 ? i : i - 1));
  }, []);
  const goNext = useCallback(() => {
    setOpenIdx((i) => (i === null || i >= unique.length - 1 ? i : i + 1));
  }, [unique.length]);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIdx, close, goNext, goPrev]);

  if (!unique.length) {
    return label ? <p className="mt-2 text-sm text-white/45">Sin fotos de {label}</p> : null;
  }

  const current = openIdx !== null ? unique[openIdx] : null;
  const canPrev = openIdx !== null && openIdx > 0;
  const canNext = openIdx !== null && openIdx < unique.length - 1;

  return (
    <div className={label ? "mt-3" : undefined}>
      {label && (
        <p className="mb-2 text-[11px] uppercase tracking-wider text-teal-300/80">
          {label} · {unique.length}
        </p>
      )}
      <div
        className={
          compact
            ? "flex flex-wrap gap-2"
            : unique.length === 1
              ? "grid grid-cols-1 gap-2"
              : "grid grid-cols-2 gap-2"
        }
      >
        {unique.map((u, i) => (
          <button
            key={u}
            type="button"
            onClick={() => setOpenIdx(i)}
            className={
              compact
                ? "block overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10 transition hover:ring-teal-400/50"
                : "flex w-full items-center justify-center overflow-hidden rounded-xl bg-black/40 p-2 ring-1 ring-white/10 transition hover:ring-teal-400/50"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u}
              alt={label || "Foto"}
              className={
                compact
                  ? "h-16 w-16 object-cover"
                  : "max-h-[min(28rem,70vh)] w-auto max-w-full object-contain"
              }
            />
          </button>
        ))}
      </div>

      {current && openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex flex-col bg-black/92 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onClick={close}
        >
          <div className="mb-2 flex shrink-0 items-center justify-between gap-2 px-1">
            <p className="text-sm text-white/70">
              {label ? `${label} · ` : ""}
              {openIdx + 1}/{unique.length}
            </p>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <a
                href={current}
                download
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-teal-100"
              >
                Descargar
              </a>
              <button
                type="button"
                onClick={close}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white"
              >
                Cerrar
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {canPrev && (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Anterior"
                className="absolute left-2 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-lg text-white hover:bg-black/80"
              >
                ‹
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt={label || "Foto"}
              className="max-h-full max-w-full rounded-xl object-contain"
            />
            {canNext && (
              <button
                type="button"
                onClick={goNext}
                aria-label="Siguiente"
                className="absolute right-2 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-lg text-white hover:bg-black/80"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StageStoryNotes({
  lot,
  stage,
}: {
  lot: TraceBatchLot;
  stage: "intake" | "warehouse" | "fmad_thermal_shock" | "drying_stabilized" | "packaging";
}) {
  const notes = (lot.photoLedger ?? [])
    .filter((p) => p.stage === stage && typeof p.storyNote === "string" && p.storyNote.trim())
    .map((p) => p.storyNote!.trim())
    .filter((n, i, a) => a.indexOf(n) === i)
    .slice(0, 3);
  if (!notes.length) return null;
  return (
    <div className="mt-2.5 space-y-1 rounded-xl border border-teal-400/20 bg-teal-500/5 px-3 py-2 text-xs text-teal-100/90">
      {notes.map((note) => (
        <p key={note} className="leading-relaxed">
          ✦ {note}
        </p>
      ))}
    </div>
  );
}

function PersonCard({
  role,
  name,
  entity,
  onOpen,
}: {
  role: string;
  name: string;
  entity?: TraceEntity | null;
  onOpen: () => void;
}) {
  const photos = entity?.photoUrls?.length
    ? entity.photoUrls
    : entity?.photoUrl
      ? [entity.photoUrl]
      : [];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-left transition hover:border-teal-400/40"
    >
      {photos[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photos[0]}
          alt=""
          className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-2 ring-teal-500/30"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xs text-white/50">
          —
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-teal-300/80">{role}</p>
        <p className="truncate text-base font-medium text-white">{name}</p>
        <p className="mt-1 text-[11px] text-teal-300/90">Ver perfil →</p>
      </div>
    </button>
  );
}

function PersonProfileModal({
  open,
  onClose,
  role,
  name,
  entity,
  geoFallback,
}: {
  open: boolean;
  onClose: () => void;
  role: string;
  name: string;
  entity?: TraceEntity | null;
  geoFallback?: TraceGeo | null;
}) {
  const [lots, setLots] = useState<TraceLotStickerThumb[]>([]);
  const [lotsLoading, setLotsLoading] = useState(false);

  useEffect(() => {
    if (!open || !name.trim()) return;
    let cancelled = false;
    setLotsLoading(true);
    const kind = entity?.kind || "farmer";
    const q = new URLSearchParams({
      kind,
      name: name.trim(),
      closedOnly: "1",
    });
    if (entity?.id) q.set("entityId", entity.id);
    void fetch(`/api/campo/entity-lots?${q}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { ok?: boolean; lots?: TraceLotStickerThumb[] }) => {
        if (!cancelled && data.ok && Array.isArray(data.lots)) setLots(data.lots);
      })
      .catch(() => {
        if (!cancelled) setLots([]);
      })
      .finally(() => {
        if (!cancelled) setLotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, name, entity?.kind, entity?.id]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const photos = entity?.photoUrls?.length
    ? entity.photoUrls
    : entity?.photoUrl
      ? [entity.photoUrl]
      : [];
  const social = entity?.socialUrl?.trim();
  const bio = entity?.biography?.trim();
  const basename =
    entity?.walletLink && !entity.walletLink.startsWith("0x") ? entity.walletLink : null;
  const address =
    entity?.walletAddress || (entity?.walletLink?.startsWith("0x") ? entity.walletLink : null);

  const fincaGeo =
    entity?.kind === "community"
      ? entity.geo ||
        (geoFallback && Number.isFinite(geoFallback.lat) && Number.isFinite(geoFallback.lng)
          ? geoFallback
          : undefined)
      : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 sm:items-center"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col overflow-hidden rounded-t-[1.5rem] border border-white/15 bg-[#0a1f16] shadow-2xl sm:rounded-[1.5rem]"
        style={{
          maxHeight:
            "min(92dvh, calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 1.5rem))",
          marginBottom: "max(0px, env(safe-area-inset-bottom))",
          marginLeft: "max(0.75rem, env(safe-area-inset-left))",
          marginRight: "max(0.75rem, env(safe-area-inset-right))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 pb-3 pt-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wider text-teal-300/80">{role}</p>
            <h2 className="truncate text-xl font-semibold text-teal-50">{name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl border border-white/15 px-3 py-1.5 text-sm text-white/80"
          >
            Cerrar
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          {photos.length > 0 && (
            <div className="mb-3">
              <MediaLightbox urls={photos} label="Fotos" compact />
            </div>
          )}

          {(basename || address) && (
            <div className="mb-3 rounded-2xl border border-white/10 bg-black/30 p-3">
              <p className="text-[10px] uppercase tracking-wider text-white/45">Wallet Base</p>
              {basename && (
                <p className="mt-1 break-all font-mono text-[12px] text-teal-200/90">{basename}</p>
              )}
              {address && (
                <p className="mt-0.5 break-all font-mono text-[11px] leading-snug text-white/60">
                  {address}
                </p>
              )}
            </div>
          )}

          {fincaGeo && Number.isFinite(fincaGeo.lat) && Number.isFinite(fincaGeo.lng) ? (
            <div className="mb-3 rounded-2xl border border-emerald-500/25 bg-emerald-950/25 p-3">
              <p className="text-[10px] uppercase tracking-wider text-emerald-200/70">
                Ubicación GPS{entity?.isGeoLocked ? " · fijo en perfil" : ""}
              </p>
              <p className="mt-1 font-mono text-[13px] leading-snug text-emerald-50/95">
                {formatTraceGeo(fincaGeo)}
              </p>
              <a
                href={googleMapsSatelliteUrl(fincaGeo.lat, fincaGeo.lng)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex min-h-[40px] items-center text-sm font-medium text-teal-300 underline decoration-teal-400/50 underline-offset-2 hover:text-teal-200"
              >
                Google Maps · vista satélite
              </a>
            </div>
          ) : entity?.kind === "community" ? (
            <p className="mb-3 text-sm text-white/45">
              Sin coordenadas GPS en el perfil de la finca.
            </p>
          ) : null}

          {bio && (
            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-white/45">Biografía</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-white/80">{bio}</p>
            </div>
          )}

          {social && (
            <a
              href={social.startsWith("http") ? social : `https://${social}`}
              target="_blank"
              rel="noreferrer"
              className="mb-3 block truncate text-sm text-teal-300 underline"
            >
              {social.replace(/^https?:\/\//, "")}
            </a>
          )}

          <div className="pb-2">
            <p className="text-[10px] uppercase tracking-wider text-white/45">Lotes cerrados</p>
            {lotsLoading ? (
              <p className="mt-2 text-sm text-white/50">Cargando…</p>
            ) : lots.length === 0 ? (
              <p className="mt-2 text-sm text-white/45">Sin lotes con etiqueta aún</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {lots.map((l) => (
                  <Link
                    key={l.id}
                    href={`/trace/${encodeURIComponent(l.id)}`}
                    className="group relative block overflow-hidden rounded-xl ring-1 ring-white/15 transition hover:ring-teal-400/60"
                    title={displayTraceLotId(l.id)}
                    onClick={onClose}
                  >
                    {l.stickerImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l.stickerImageUrl}
                        alt={displayTraceLotId(l.id)}
                        className="h-16 w-16 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center bg-teal-950 font-mono text-[9px] text-teal-200">
                        {displayTraceLotId(l.id).slice(0, 10)}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TraceBatchClient({ batchId }: Props) {
  const [lot, setLot] = useState<TraceBatchLot | null>(null);
  const [farmers, setFarmers] = useState<TraceEntity[]>([]);
  const [operators, setOperators] = useState<TraceEntity[]>([]);
  const [communities, setCommunities] = useState<TraceEntity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    role: string;
    name: string;
    entity?: TraceEntity | null;
    geoFallback?: TraceGeo | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [lotRes, fRes, oRes, cRes] = await Promise.all([
          fetch(`/api/campo/batch/${encodeURIComponent(batchId)}`),
          fetch("/api/campo/entities?kind=farmer"),
          fetch("/api/campo/entities?kind=operator"),
          fetch("/api/campo/entities?kind=community"),
        ]);
        const data = (await lotRes.json().catch(() => ({}))) as {
          ok?: boolean;
          lot?: TraceBatchLot;
          error?: string;
        };
        if (!lotRes.ok || !data.ok || !data.lot) {
          throw new Error(data.error || "Lote no encontrado");
        }
        if (cancelled) return;
        setLot(data.lot);
        type EntitiesResp = { ok?: boolean; entities?: TraceEntity[] };
        const [f, o, c] = await Promise.all([
          fRes.ok ? (fRes.json().catch(() => ({})) as Promise<EntitiesResp>) : Promise.resolve({} as EntitiesResp),
          oRes.ok ? (oRes.json().catch(() => ({})) as Promise<EntitiesResp>) : Promise.resolve({} as EntitiesResp),
          cRes.ok ? (cRes.json().catch(() => ({})) as Promise<EntitiesResp>) : Promise.resolve({} as EntitiesResp),
        ]);
        if (cancelled) return;
        if (f.ok) setFarmers(f.entities || []);
        if (o.ok) setOperators(o.entities || []);
        if (c.ok) setCommunities(c.entities || []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [batchId]);

  const linkedFarmer = useMemo(() => resolveFarmerEntity(lot, farmers), [lot, farmers]);
  const linkedFinca = useMemo(() => resolveCommunityEntity(lot, communities), [lot, communities]);
  const displayFarmerName = linkedFarmer?.name || lot?.intake?.farmerName?.trim() || "";
  const displayFincaName = linkedFinca?.name || lot?.intake?.community?.trim() || "";

  const stagePhotos = useMemo(() => (lot ? stagePhotosFor(lot) : null), [lot]);
  const timeline = useMemo(() => (lot ? buildTraceTimeline(lot) : null), [lot]);
  const burnProgress = useMemo(() => (lot ? lotBurnProgress(lot) : null), [lot]);

  const card = "rounded-2xl border border-white/10 bg-black/35 p-4 pb-5";
  const campoConfirmed = Boolean(burnProgress?.allOnChain);
  const isPurpleGold = (lot?.productType || "purple_gold") === "purple_gold";
  const productLabel = TRACE_PRODUCT_LABEL[lot?.productType || "purple_gold"];
  const hasWarehouse =
    isPurpleGold &&
    Boolean(
      lot?.fmadProtocol?.warehouseDelivery?.coldRoomConfirmed ||
        lot?.fmadProtocol?.warehouseDelivery?.storagePhotos?.length,
    );
  const envaseStepNum = isPurpleGold ? (hasWarehouse ? 5 : 4) : hasWarehouse ? 4 : 3;
  const chainStepNum = envaseStepNum + 1;
  const fmadStepNum = hasWarehouse ? 3 : 2;
  const dryingStepNum = hasWarehouse ? 4 : 3;

  const packagingRows = useMemo(() => {
    if (!lot?.packaging) return [];
    const p = lot.packaging;
    const shelfDays = resolveShelfLifeDays(p.shelfLifeDays);
    const packagedAt = p.packagedAt ?? lot.updatedAt;
    const rows = [
      { label: "Peso neto por paquete", value: `${p.packageNetWeightKg} kg` },
      { label: "Total de bolsas / paquetes", value: String(p.totalPackages) },
      { label: "Temp. al envasar", value: `${p.productPackagingTempC} °C` },
      {
        label: "Muestra testigo",
        value: p.sampleRetained ? "Retenida · control interno" : "No registrada",
      },
      { label: "Vida útil", value: `${shelfDays} días` },
      { label: "Sellado al vacío", value: p.vacuumSeal ? "Sí" : "No" },
    ];
    if (packagedAt && Number.isFinite(packagedAt)) {
      rows.push({
        label: "Fecha de envasado",
        value: new Date(packagedAt).toLocaleDateString("es-EC", { timeZone: "UTC" }),
      });
      rows.push({
        label: "Fecha de vencimiento",
        value: formatExpiryDate(packagedAt, shelfDays),
      });
    }
    return rows;
  }, [lot]);

  const qrTargetUrl =
    lot?.qrCodeUrl ||
    `https://incatrailfoods.com/trace/${encodeURIComponent(lot?.id || batchId)}`;

  return (
    <div className="min-h-[85dvh] bg-gradient-to-b from-[#0B2E1A] via-[#0a2418] to-[#06140e] px-4 py-8 text-white">
      <div className="mx-auto max-w-lg">
        <p className="text-xs uppercase tracking-[0.25em] text-teal-300/70">
          {productLabel} · Verify
        </p>
        <h1 className="mt-2 font-serif text-3xl text-teal-50">Trazabilidad del lote</h1>
        <p className="mt-1 font-mono text-sm text-white/60">
          {lot ? displayTraceLotId(lot.id) : displayTraceLotId(batchId)}
        </p>

        {lot && (
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/api/campo/batch/${encodeURIComponent(lot.id)}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[40px] items-center rounded-xl border border-teal-400/35 bg-teal-950/30 px-4 py-2 text-xs font-medium text-teal-100 transition hover:border-teal-300/55 hover:bg-teal-900/40"
            >
              PDF trazabilidad
            </a>
          </div>
        )}

        {loading && <p className="mt-8 text-white/60">Cargando…</p>}
        {error && (
          <p className="mt-8 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm">
            {error}
          </p>
        )}

        {lot && stagePhotos && (
          <>
            {lot.buyerStory && (
              <div className={`${card} mt-6 border-teal-400/25 bg-teal-950/30`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                  Historia del lote
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-teal-50/90">
                  {lot.buyerStory}
                </p>
              </div>
            )}

            <div className={`${card} mt-6`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                Personas vinculadas al lote
              </p>
              <div className="mt-3 space-y-2">
                {isPurpleGold && (displayFarmerName || linkedFarmer) && (
                  <PersonCard
                    role="Agricultor"
                    name={displayFarmerName || linkedFarmer!.name}
                    entity={linkedFarmer}
                    onOpen={() =>
                      setProfile({
                        role: "Agricultor",
                        name: displayFarmerName || linkedFarmer!.name,
                        entity: linkedFarmer,
                      })
                    }
                  />
                )}
                {(displayFincaName || linkedFinca) && (
                  <PersonCard
                    role={isPurpleGold ? "Lote (finca)" : "Cooperativa / acopio / productor"}
                    name={displayFincaName || linkedFinca!.name}
                    entity={linkedFinca}
                    onOpen={() =>
                      setProfile({
                        role: isPurpleGold ? "Lote (finca)" : "Cooperativa / acopio / productor",
                        name: displayFincaName || linkedFinca!.name,
                        entity: linkedFinca,
                        geoFallback: isPurpleGold
                          ? lot.intake?.recoleccion?.location ||
                            lot.intake?.chakraLocationGeo ||
                            linkedFinca?.geo ||
                            null
                          : lot.intake?.pesaje?.location ||
                            lot.intake?.chakraLocationGeo ||
                            linkedFinca?.geo ||
                            null,
                      })
                    }
                  />
                )}
                {lot.fmadProtocol?.operatorName && (
                  <PersonCard
                    role="Operador FMAD"
                    name={lot.fmadProtocol.operatorName}
                    entity={matchEntity(operators, lot.fmadProtocol.operatorName)}
                    onOpen={() =>
                      setProfile({
                        role: "Operador FMAD",
                        name: lot.fmadProtocol!.operatorName,
                        entity: matchEntity(operators, lot.fmadProtocol!.operatorName),
                      })
                    }
                  />
                )}
                {isPurpleGold &&
                  lot.fmadProtocol?.dryingOperatorName &&
                  lot.fmadProtocol.dryingOperatorName !== lot.fmadProtocol.operatorName && (
                    <PersonCard
                      role="Operador secado"
                      name={lot.fmadProtocol.dryingOperatorName}
                      entity={matchEntity(operators, lot.fmadProtocol.dryingOperatorName)}
                      onOpen={() =>
                        setProfile({
                          role: "Operador secado",
                          name: lot.fmadProtocol!.dryingOperatorName!,
                          entity: matchEntity(operators, lot.fmadProtocol!.dryingOperatorName),
                        })
                      }
                    />
                  )}
              </div>
            </div>

            <div className="mt-4">
              <QrSticker value={qrTargetUrl} caption={displayTraceLotId(lot.id)} />
            </div>

            {timeline && (
              <div className={`${card} mt-6`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                  Línea de tiempo del lote
                </p>
                {timeline.milestones.length === 0 ? (
                  <p className="mt-2 text-sm text-white/50">
                    Sin marcas de tiempo registradas (recolección, almacén o quemas $TZNK).
                  </p>
                ) : (
                  <div className="mt-4">
                    <div className="relative border-l-2 border-teal-500/40 pl-4">
                      {timeline.milestones.map((m, idx) => {
                        const seg = timeline.segments.find((s) => s.toId === m.id);
                        return (
                          <div key={m.id} className="relative pb-6 last:pb-0">
                            <span className="absolute -left-[calc(0.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-400 ring-2 ring-[#0a2418]" />
                            {seg && (
                              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-amber-200/80">
                                + {seg.durationLabel}
                              </p>
                            )}
                            <p className="text-sm font-medium text-teal-50">{m.label}</p>
                            <p className="font-mono text-xs text-white/55">
                              {formatEcuadorClock(m.timestampMs)}
                            </p>
                            {idx === timeline.milestones.length - 1 &&
                              timeline.milestones.length >= 2 && (
                                <p className="mt-3 text-xs text-teal-300/90">
                                  Tiempo total (primer hito → cierre):{" "}
                                  <span className="font-semibold text-teal-100">
                                    {timeline.totalDurationLabel}
                                  </span>
                                </p>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <ol className="mt-8 space-y-4">
              <li className={card}>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                  {isPurpleGold ? "1 · Origen" : "1 · Compra / recepción"}
                </p>
                {lot.intake ? (
                  <>
                    {isPurpleGold ? (
                      <>
                        <p className="mt-2 text-lg">{displayFarmerName || lot.intake.farmerName}</p>
                        <p className="text-sm text-white/70">
                          {displayFincaName || lot.intake.community}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-lg">{displayFincaName || lot.intake.community}</p>
                    )}
                    <p className="mt-1 text-sm text-white/60">
                      {lot.intake.harvestDate} ·{" "}
                      {lot.intake.pesaje?.netWeightKg ?? lot.intake.rawWeightKg} kg
                      {isPurpleGold ? " baba" : ""} · {lot.intake.variety}
                    </p>
                    {(lot.intake.pesaje?.location || lot.intake.chakraLocationGeo) && (
                      <p className="mt-1 text-xs text-white/50">
                        GPS{" "}
                        {formatTraceGeo(
                          lot.intake.pesaje?.location || lot.intake.chakraLocationGeo!,
                        )}
                      </p>
                    )}
                    {isPurpleGold && lot.intake.recoleccion?.capturedAt && (
                      <p className="mt-1 text-xs text-white/45">
                        Recolección (1A):{" "}
                        {new Date(lot.intake.recoleccion.capturedAt).toLocaleString("es-EC")}
                      </p>
                    )}
                    {lot.intake.pesaje?.capturedAt && (
                      <p className="text-xs text-white/45">
                        {isPurpleGold ? "Pesaje (1B)" : "Compra registrada"}:{" "}
                        {new Date(lot.intake.pesaje.capturedAt).toLocaleString("es-EC")}
                      </p>
                    )}
                    <MediaLightbox
                      urls={stagePhotos.intake}
                      label={isPurpleGold ? "Origen" : "Compra"}
                    />
                    <StageStoryNotes lot={lot} stage="intake" />
                  </>
                ) : (
                  <p className="mt-2 text-sm text-white/50">Sin datos de origen</p>
                )}
              </li>

              {hasWarehouse && (
                <li className={card}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                    2 · Entrega al almacén · cámara fría 4°C
                  </p>
                  {lot.fmadProtocol?.warehouseDelivery ? (
                    <>
                      {lot.fmadProtocol.warehouseDelivery.arrivalTimestamp && (
                        <p className="mt-2 text-sm text-white/70">
                          Llegada:{" "}
                          {new Date(
                            lot.fmadProtocol.warehouseDelivery.arrivalTimestamp,
                          ).toLocaleString("es-EC")}
                        </p>
                      )}
                      {lot.fmadProtocol.warehouseDelivery.arrivalLocation && (
                        <p className="text-xs text-white/50">
                          GPS planta{" "}
                          {formatTraceGeo(lot.fmadProtocol.warehouseDelivery.arrivalLocation)}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-teal-200/90">
                        Ingreso 4°C:{" "}
                        {lot.fmadProtocol.warehouseDelivery.coldRoomConfirmed
                          ? "confirmado"
                          : "pendiente"}
                      </p>
                      <MediaLightbox urls={stagePhotos.warehouse} label="Almacén / cámara fría" />
                      <StageStoryNotes lot={lot} stage="warehouse" />
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-white/50">Sin registro de almacén</p>
                  )}
                </li>
              )}

              <li className={card}>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                  {isPurpleGold
                    ? `${fmadStepNum} · FMAD · termoshock 75°C`
                    : `${fmadStepNum} · Esterilización / dosificado`}
                </p>
                {lot.fmadProtocol ? (
                  <>
                    <p className="mt-2 text-sm">Operador: {lot.fmadProtocol.operatorName}</p>
                    <p className="text-sm text-white/70">
                      Termoshock {lot.fmadProtocol.thermalShockTempC}°C
                      {(() => {
                        const a =
                          lot.fmadProtocol.vacuumPressureMbarMin ??
                          lot.fmadProtocol.vacuumPressureMbar;
                        const b =
                          lot.fmadProtocol.vacuumPressureMbarMax ??
                          lot.fmadProtocol.vacuumPressureMbar;
                        if (a === undefined && b === undefined) return "";
                        if (a !== undefined && b !== undefined && a !== b) {
                          return ` · presión ${a}–${b} mbar`;
                        }
                        return ` · presión ${a ?? b} mbar`;
                      })()}
                    </p>
                    {isPurpleGold && (
                      <p className="mt-1 text-sm">
                        Corte púrpura:{" "}
                        {lot.fmadProtocol.purpleCutConfirmation ? (
                          <span className="text-teal-300">confirmado</span>
                        ) : (
                          <span className="text-amber-300">sin confirmar</span>
                        )}
                      </p>
                    )}
                    {lot.protocolViolation && (
                      <p className="mt-2 text-sm text-amber-300">
                        Registro con alerta de protocolo
                      </p>
                    )}
                    <MediaLightbox
                      urls={stagePhotos.fmad}
                      label={isPurpleGold ? "Termoshock" : "Esterilización"}
                    />
                    {isPurpleGold && (
                      <MediaLightbox urls={stagePhotos.purple} label="Corte púrpura" />
                    )}
                    <StageStoryNotes lot={lot} stage="fmad_thermal_shock" />
                  </>
                ) : (
                  <p className="mt-2 text-sm text-white/50">
                    {isPurpleGold ? "Sin protocolo FMAD" : "Sin registro de esterilización"}
                  </p>
                )}
              </li>

              {isPurpleGold && (
                <li className={card}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                    {dryingStepNum} · Secado
                  </p>
                  {lot.fmadProtocol ? (
                    <>
                      <p className="mt-2 text-sm text-white/70">
                        Operador:{" "}
                        {lot.fmadProtocol.dryingOperatorName || lot.fmadProtocol.operatorName}
                      </p>
                      <p className="text-sm text-white/70">
                        {lot.fmadProtocol.secondaryDryingTempC}°C · humedad{" "}
                        {lot.fmadProtocol.finalMoisturePercent}% · {lot.fmadProtocol.dryWeightKg}{" "}
                        kg seco
                      </p>
                      {formatBabaToDryRatio(
                        lot.intake?.rawWeightKg,
                        lot.fmadProtocol.dryWeightKg,
                      ) && (
                        <p className="mt-1 text-sm text-teal-200/90">
                          Relación baba → seco:{" "}
                          {formatBabaToDryRatio(
                            lot.intake?.rawWeightKg,
                            lot.fmadProtocol.dryWeightKg,
                          )}
                          {lot.intake ? (
                            <span className="mt-0.5 block text-xs text-white/50">
                              {lot.intake.rawWeightKg} kg baba → {lot.fmadProtocol.dryWeightKg} kg
                              seco
                            </span>
                          ) : null}
                        </p>
                      )}
                      <MediaLightbox urls={stagePhotos.drying} label="Secado" />
                      <StageStoryNotes lot={lot} stage="drying_stabilized" />
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-white/50">Sin datos de secado</p>
                  )}
                </li>
              )}

              <li className={card}>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                  {envaseStepNum} · Envase
                </p>
                {lot.packaging ? (
                  <>
                    <dl className="mt-3 divide-y divide-white/5 text-sm text-white/75">
                      {packagingRows.map((r) => (
                        <div
                          key={r.label}
                          className="flex flex-wrap justify-between gap-x-3 gap-y-0.5 py-1.5 first:pt-0 last:pb-0"
                        >
                          <dt className="text-white/50">{r.label}</dt>
                          <dd className="font-medium text-teal-100">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <MediaLightbox
                      urls={stagePhotos.packagingTemp}
                      label="Temp. de envasado"
                    />
                  </>
                ) : (
                  <p className="mt-2 text-sm text-white/70">Estado lote: {lot.status}</p>
                )}
                <MediaLightbox urls={stagePhotos.pack} label="Envase" />
                {lot.packaging?.vacuumSeal && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-300/80">
                      Vacuum seal
                    </p>
                    <MediaLightbox urls={stagePhotos.vacuum} label="Vacuum seal" />
                  </div>
                )}
                <StageStoryNotes lot={lot} stage="packaging" />
              </li>

              <li className={card}>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                  {chainStepNum} · Confirmación en blockchain
                </p>
                {campoConfirmed ? (
                  <p className="mt-2 text-sm text-teal-200">
                    Todas las etapas con burn() on-chain confirmado (
                    {burnProgress?.onChain.length} × {TRACE_BURN_TZNK} $TZNK · apoyo Amazonía)
                  </p>
                ) : burnProgress && burnProgress.onChain.length > 0 ? (
                  <p className="mt-2 text-sm text-amber-100/90">
                    Quemas parciales — faltan etapas on-chain o hay registros de modo prueba por
                    reemplazar.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-white/50">
                    Aún sin quemas on-chain en este lote
                  </p>
                )}

                {(() => {
                  const onChainBurns = (lot.burnEvents || []).filter(isOnChainBurn);
                  const totalBurned = onChainBurns.reduce(
                    (acc, ev) => acc + (Number(ev.amountTznk) || 0),
                    0,
                  );
                  if (onChainBurns.length === 0 && !(lot.totalTznkBurned && lot.totalTznkBurned > 0)) {
                    return null;
                  }
                  const displayTotal = totalBurned || lot.totalTznkBurned || 0;
                  return (
                    <div className="mt-3 rounded-xl border border-amber-400/25 bg-amber-950/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                        Quemas $TZNK · apoyo al proyecto y ecosistema
                      </p>
                      <p className="mt-1 text-sm font-semibold text-amber-100">
                        {displayTotal.toLocaleString("es-EC")} $TZNK quemados
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/65">
                        Tokens $TZNK quemados para siempre en apoyo al proyecto y conservación de la
                        Amazonía.
                      </p>
                      {onChainBurns.length > 0 && (
                        <ul className="mt-2.5 space-y-1.5">
                          {onChainBurns.map((ev) => (
                            <li
                              key={`${ev.stage}-${ev.txHash}`}
                              className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 rounded-lg border border-white/10 bg-black/25 px-2.5 py-1.5 text-xs"
                            >
                              <span className="font-medium text-white">
                                {burnStageLabel(ev.stage, lot.productType || "purple_gold")} ·{" "}
                                {(Number(ev.amountTznk) || 0).toLocaleString("es-EC")} $TZNK
                              </span>
                              <a
                                className="font-mono text-[11px] text-teal-300 underline"
                                href={`${TRACE_BASESCAN_URL}/tx/${ev.txHash}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Basescan · {ev.txHash.slice(0, 10)}…{ev.txHash.slice(-6)}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()}

                {(lot.easAttestations?.harvestUid ||
                  lot.easAttestations?.fmadUid ||
                  lot.easAttestations?.finalLotUid) && (
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <p className="text-[11px] uppercase tracking-wider text-white/45">
                      Attestaciones EAS
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-white/70">
                      {lot.easAttestations.harvestUid && (
                        <li>
                          Cosecha:{" "}
                          <a
                            className="text-teal-300 underline"
                            href={easScanUrl(lot.easAttestations.harvestUid)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            EASScan
                          </a>
                        </li>
                      )}
                      {lot.easAttestations.fmadUid && (
                        <li>
                          FMAD:{" "}
                          <a
                            className="text-teal-300 underline"
                            href={easScanUrl(lot.easAttestations.fmadUid)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            EASScan
                          </a>
                        </li>
                      )}
                      {lot.easAttestations.finalLotUid && (
                        <li>
                          Lote final:{" "}
                          <a
                            className="text-teal-300 underline"
                            href={easScanUrl(lot.easAttestations.finalLotUid)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            EASScan
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {(lot.nftTokenId || lot.nftAsset?.tokenId) && (
                  <div className="mt-4 rounded-xl border border-teal-400/25 bg-black/30 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-teal-300">
                      NFT del lote (Almacén)
                    </p>
                    <p className="mt-1 font-mono text-sm text-teal-100">
                      Token #{lot.nftAsset?.tokenId || lot.nftTokenId}
                    </p>
                    {lot.nftAsset?.txHash && (
                      <p className="mt-1 text-xs text-white/70">
                        Tx:{" "}
                        <a
                          href={`${TRACE_BASESCAN_URL}/tx/${lot.nftAsset.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-teal-300 underline"
                        >
                          {lot.nftAsset.txHash.slice(0, 10)}…{lot.nftAsset.txHash.slice(-6)}
                        </a>
                      </p>
                    )}
                    {lot.nftAsset?.recipientWallet && (
                      <p className="mt-0.5 font-mono text-[11px] text-white/60">
                        Titular: {lot.nftAsset.recipientWallet.slice(0, 6)}…
                        {lot.nftAsset.recipientWallet.slice(-4)}
                      </p>
                    )}
                    {lot.nftAsset?.metadataUri && (
                      <p className="mt-0.5 truncate text-[11px] text-white/60">
                        URI: <span className="font-mono">{lot.nftAsset.metadataUri}</span>
                      </p>
                    )}
                    {lot.nftAsset?.metadata &&
                      Object.keys(lot.nftAsset.metadata).length > 0 && (
                        <dl className="mt-2 grid grid-cols-1 gap-1 border-t border-white/10 pt-2 text-[11px] sm:grid-cols-2">
                          {Object.entries(lot.nftAsset.metadata).map(([k, v]) => (
                            <div key={k} className="truncate text-white/70">
                              <dt className="inline font-semibold text-white/85">{k}: </dt>
                              <dd className="inline font-mono">{String(v)}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                  </div>
                )}
              </li>
            </ol>
          </>
        )}
      </div>

      <PersonProfileModal
        open={Boolean(profile)}
        onClose={() => setProfile(null)}
        role={profile?.role || ""}
        name={profile?.name || ""}
        entity={profile?.entity}
        geoFallback={profile?.geoFallback}
      />
    </div>
  );
}
