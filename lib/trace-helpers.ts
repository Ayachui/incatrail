export type TraceProductType = "purple_gold" | "fermented";

export type TraceBurnStage =
  | "intake"
  | "fmad_thermal_shock"
  | "drying_stabilized"
  | "packaging";

export type TraceGeo = {
  lat: number;
  lng: number;
  accuracyM?: number;
  altitudeM?: number;
  capturedAt?: number;
};

export type TraceBurnEvent = {
  stage: TraceBurnStage;
  txHash: string;
  amountTznk: number;
  timestamp: number;
  testMode?: boolean;
};

export type TraceIntake = {
  farmerId?: string;
  communityId?: string;
  farmerName: string;
  farmerWallet?: string;
  community: string;
  harvestDate: string;
  rawWeightKg: number;
  variety: string;
  chakraLocationGeo?: TraceGeo;
  photos?: string[];
  recoleccion?: {
    farmerId?: string;
    communityId?: string;
    location?: TraceGeo;
    capturedAt?: number;
    photos?: string[];
  };
  pesaje?: {
    netWeightKg?: number;
    grossWeightKg?: number;
    tareKg?: number;
    location?: TraceGeo;
    capturedAt?: number;
    transitDurationMinutes?: number;
    photos?: string[];
    receiptPhotos?: string[];
  };
};

export type TraceFmadProtocol = {
  operatorName: string;
  dryingOperatorName?: string;
  thermalShockTempC: number;
  vacuumPressureMbar?: number;
  vacuumPressureMbarMin?: number;
  vacuumPressureMbarMax?: number;
  purpleCutConfirmation: boolean;
  secondaryDryingTempC: number;
  finalMoisturePercent: number;
  dryWeightKg: number;
  photos?: string[];
  purpleCutPhotos?: string[];
  warehouseDelivery?: {
    arrivalTimestamp?: number;
    arrivalLocation?: TraceGeo;
    coldRoomConfirmed?: boolean;
    storagePhotos?: string[];
  };
};

export type TracePackaging = {
  packageNetWeightKg: number;
  totalPackages: number;
  productPackagingTempC: number;
  productPackagingTempPhotos?: string[];
  sampleRetained: boolean;
  vacuumSeal: boolean;
  vacuumSealPhotos?: string[];
  shelfLifeDays?: number;
  packagedAt?: number;
};

export type TracePhotoLedgerEntry = {
  stage: string;
  url: string;
  capturedAt: number;
  storyNote?: string;
};

export type TraceBatchLot = {
  id: string;
  productType?: TraceProductType;
  status: string;
  traceSubStatus?: string;
  updatedAt?: number;
  timelineEditedAt?: number;
  intake?: TraceIntake;
  fmadProtocol?: TraceFmadProtocol;
  packaging?: TracePackaging;
  burnEvents?: TraceBurnEvent[];
  pendingBurnStages?: TraceBurnStage[];
  easAttestations?: {
    harvestUid?: string;
    fmadUid?: string;
    finalLotUid?: string;
  };
  nftTokenId?: string;
  qrCodeUrl?: string;
  stickerImageUrl?: string;
  buyerStory?: string;
  protocolViolation?: boolean;
  photoLedger?: TracePhotoLedgerEntry[];
};

export type TraceEntity = {
  id: string;
  kind: "farmer" | "operator" | "community";
  name: string;
  photoUrl?: string;
  photoUrls?: string[];
  biography?: string;
  socialUrl?: string;
  walletAddress?: string;
  walletLink?: string;
  geo?: TraceGeo;
  isGeoLocked?: boolean;
};

export type TraceLotStickerThumb = {
  id: string;
  stickerImageUrl?: string;
  status: string;
};

export const TRACE_PRODUCT_LABEL: Record<TraceProductType, string> = {
  purple_gold: "Purple Gold (sin fermentar)",
  fermented: "Cacao Fermentado",
};

export const TRACE_BASESCAN_URL = "https://basescan.org";
export const TRACE_EAS_EXPLORER_URL = "https://base.easscan.org";
export const TRACE_BURN_TZNK = 500;

export function displayTraceLotId(raw: string): string {
  return raw.replace(/_/g, "/");
}

export function formatTraceGeo(geo: TraceGeo): string {
  const lat = geo.lat.toFixed(5);
  const lng = geo.lng.toFixed(5);
  const alt =
    typeof geo.altitudeM === "number" && Number.isFinite(geo.altitudeM)
      ? ` · ${Math.round(geo.altitudeM)} m`
      : "";
  return `${lat}, ${lng}${alt}`;
}

export function googleMapsSatelliteUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lng}&zoom=18&basemap=satellite`;
}

export function formatBabaToDryRatio(
  rawKg?: number,
  dryKg?: number,
): string | null {
  if (!rawKg || !dryKg || !Number.isFinite(rawKg) || !Number.isFinite(dryKg) || dryKg <= 0) {
    return null;
  }
  return `${(rawKg / dryKg).toFixed(2)} : 1`;
}

export function formatEcuadorClock(ms: number): string {
  if (!Number.isFinite(ms)) return "—";
  try {
    return new Intl.DateTimeFormat("es-EC", {
      timeZone: "America/Guayaquil",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString("es-EC");
  }
}

export function resolveShelfLifeDays(raw?: number): number {
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 1 && raw <= 3650) {
    return Math.round(raw);
  }
  return 730;
}

export function formatExpiryDate(packagedAt: number, shelfLifeDays: number): string {
  const d = new Date(packagedAt + shelfLifeDays * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export function burnStageLabel(
  stage: TraceBurnStage,
  product: TraceProductType = "purple_gold",
): string {
  switch (stage) {
    case "intake":
      return product === "fermented" ? "Compra / recepción" : "Origen / cosecha";
    case "fmad_thermal_shock":
      return product === "fermented" ? "Esterilización / dosificado" : "FMAD · termoshock";
    case "drying_stabilized":
      return "Secado estabilizado";
    case "packaging":
      return "Envase y sellado";
  }
}

export function stagesForProduct(product: TraceProductType = "purple_gold"): TraceBurnStage[] {
  if (product === "fermented") {
    return ["intake", "fmad_thermal_shock", "packaging"];
  }
  return ["intake", "fmad_thermal_shock", "drying_stabilized", "packaging"];
}

export function isSyntheticBurn(e: TraceBurnEvent): boolean {
  if (e.testMode) return true;
  const h = (e.txHash || "").trim().toLowerCase();
  if (!h) return true;
  if (h.startsWith("test:") || h.startsWith("offline:") || h.startsWith("0x0000000000")) {
    return true;
  }
  return false;
}

export function isOnChainBurn(e: TraceBurnEvent): boolean {
  return Boolean(e.txHash?.trim()) && !isSyntheticBurn(e);
}

export function lotBurnProgress(lot: TraceBatchLot) {
  const required = stagesForProduct(lot.productType ?? "purple_gold");
  const onChain: TraceBurnStage[] = [];
  const syntheticOnly: TraceBurnStage[] = [];
  const pending: TraceBurnStage[] = [];
  for (const stage of required) {
    const e = lot.burnEvents?.find((x) => x.stage === stage);
    if (e && isOnChainBurn(e)) onChain.push(stage);
    else if (e && isSyntheticBurn(e)) syntheticOnly.push(stage);
    else pending.push(stage);
  }
  return {
    required,
    onChain,
    syntheticOnly,
    pending,
    allOnChain:
      pending.length === 0 && syntheticOnly.length === 0 && onChain.length === required.length,
  };
}

function uniq(urls: string[] | undefined): string[] {
  return (urls || []).filter((u, i, a) => Boolean(u) && a.indexOf(u) === i);
}

export function stagePhotosFor(lot: TraceBatchLot) {
  const whUrls = uniq(lot.fmadProtocol?.warehouseDelivery?.storagePhotos);
  const warehouseSet = new Set(whUrls);
  const purpleSet = new Set(lot.fmadProtocol?.purpleCutPhotos || []);
  const ledger = (stage: string) =>
    uniq((lot.photoLedger || []).filter((p) => p.stage === stage).map((p) => p.url));

  const rec = uniq(lot.intake?.recoleccion?.photos);
  const recFinal = rec.length ? rec : ledger("intake").slice(0, 12);
  const pes = uniq(lot.intake?.pesaje?.photos);
  const recpt = uniq(lot.intake?.pesaje?.receiptPhotos);
  const intakeCombined = uniq([...recFinal, ...pes, ...recpt]);
  const intake = intakeCombined.length ? intakeCombined : uniq(lot.intake?.photos);

  const fmadProto = uniq(lot.fmadProtocol?.photos).filter(
    (u) => !purpleSet.has(u) && !warehouseSet.has(u),
  );
  const fmad = fmadProto.length
    ? fmadProto
    : ledger("fmad_thermal_shock").filter((u) => !purpleSet.has(u) && !warehouseSet.has(u));

  const specialPack = new Set([
    ...(lot.packaging?.productPackagingTempPhotos || []),
    ...(lot.packaging?.vacuumSealPhotos || []),
  ]);
  const pack = ledger("packaging").filter((u) => !specialPack.has(u));

  return {
    intake,
    warehouse: whUrls,
    fmad,
    purple: uniq(lot.fmadProtocol?.purpleCutPhotos),
    drying: ledger("drying_stabilized"),
    pack,
    packagingTemp: uniq(lot.packaging?.productPackagingTempPhotos),
    vacuum: uniq(lot.packaging?.vacuumSealPhotos),
  };
}

export type TraceMilestone = {
  id: string;
  label: string;
  timestampMs: number;
};

export type TraceSegment = {
  fromId: string;
  toId: string;
  labelFrom: string;
  labelTo: string;
  durationLabel: string;
};

function formatDurationMs(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const totalMin = Math.floor(ms / 60_000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} d`);
  if (hours > 0) parts.push(`${hours} h`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins} min`);
  return parts.join(" ");
}

export function buildTraceTimeline(lot: TraceBatchLot) {
  const product: TraceProductType = lot.productType || "purple_gold";
  const stages = stagesForProduct(product);
  const milestones: TraceMilestone[] = [];
  const fermented = product === "fermented";

  const push = (id: string, label: string, ts?: number) => {
    if (ts && Number.isFinite(ts)) milestones.push({ id, label, timestampMs: ts });
  };
  const burnTs = (stage: TraceBurnStage) => {
    const e = lot.burnEvents?.find((x) => x.stage === stage);
    return e?.timestamp && Number.isFinite(e.timestamp) ? e.timestamp : undefined;
  };

  if (!fermented) {
    push("recoleccion", "Recolección finca (1A)", lot.intake?.recoleccion?.capturedAt);
  }
  push(
    fermented ? "compra" : "origen_fijado",
    fermented ? "Compra / recepción" : "Origen fijado / pesaje (1B)",
    lot.intake?.pesaje?.capturedAt ?? burnTs("intake"),
  );
  if (!fermented) {
    push(
      "almacen",
      "Entrega almacén · cámara fría 4°C",
      lot.fmadProtocol?.warehouseDelivery?.arrivalTimestamp,
    );
  }
  if (stages.includes("fmad_thermal_shock")) {
    push("fmad_thermal_shock", burnStageLabel("fmad_thermal_shock", product), burnTs("fmad_thermal_shock"));
  }
  if (stages.includes("drying_stabilized")) {
    push("drying_stabilized", burnStageLabel("drying_stabilized"), burnTs("drying_stabilized"));
  }
  if (stages.includes("packaging")) {
    push("packaging", burnStageLabel("packaging"), burnTs("packaging"));
  }

  milestones.sort((a, b) => a.timestampMs - b.timestampMs);

  const segments: TraceSegment[] = [];
  for (let i = 0; i < milestones.length - 1; i++) {
    const a = milestones[i]!;
    const b = milestones[i + 1]!;
    segments.push({
      fromId: a.id,
      toId: b.id,
      labelFrom: a.label,
      labelTo: b.label,
      durationLabel: formatDurationMs(Math.max(0, b.timestampMs - a.timestampMs)),
    });
  }

  const totalDurationLabel =
    milestones.length >= 2
      ? formatDurationMs(
          Math.max(0, milestones[milestones.length - 1]!.timestampMs - milestones[0]!.timestampMs),
        )
      : "—";

  return { milestones, segments, totalDurationLabel };
}

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

export function matchEntity(entities: TraceEntity[], rawName?: string | null): TraceEntity | null {
  const trimmed = (rawName || "").trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  const exact = entities.find((e) => e.name.trim().toLowerCase() === lower);
  if (exact) return exact;
  const norm = normalizeName(trimmed);
  if (!norm) return null;
  return entities.find((e) => normalizeName(e.name) === norm) ?? null;
}

export function resolveFarmerEntity(lot: TraceBatchLot | null, farmers: TraceEntity[]): TraceEntity | null {
  const id = lot?.intake?.farmerId || lot?.intake?.recoleccion?.farmerId;
  if (id) {
    const byId = farmers.find((f) => f.id === id);
    if (byId) return byId;
  }
  return matchEntity(farmers, lot?.intake?.farmerName);
}

export function resolveCommunityEntity(lot: TraceBatchLot | null, communities: TraceEntity[]): TraceEntity | null {
  const id = lot?.intake?.communityId || lot?.intake?.recoleccion?.communityId;
  if (id) {
    const byId = communities.find((c) => c.id === id);
    if (byId) return byId;
  }
  return matchEntity(communities, lot?.intake?.community);
}
