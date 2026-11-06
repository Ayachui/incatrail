export type Language = 'ru' | 'en' | 'es';

export type PercentageMode = 'bakers' | 'standard';

export interface ChemicalProfile {
  moisture: number; // %
  fat: number; // % lipids
  sugars: number; // %
  protein: number; // %
  fiber: number; // %
  sodiumMg: number; // mg / 100g
  potassiumMg: number; // mg / 100g
  ironMg: number; // mg / 100g
  magnesiumMg: number; // mg / 100g
  zincMg: number; // mg / 100g
  epicatechinDP1MgPerG: number; // mg / g (-)-epicatechin
  procyanidinsDP2DP7MgPerG: number; // mg / g
  theobromineMgPerG: number; // mg / g
  caffeineMgPerG: number; // mg / g
  piperinePercent?: number; // % piperine in black pepper
  capsaicinMgPerG?: number; // mg / g capsaicin in chili / hot pepper
  macamidesPercent?: number; // % macamides in maca
  betaCaryophyllenePercent?: number; // % BCP in copaiba
  organicAcidsPercent?: number; // % hibiscus acids
  tryptaminesPercent?: number; // % psilocybin/psilocin in mushroom
  quercetinMgPerG?: number; // mg / g in moringa
}

export interface Ingredient {
  id: string;
  nameRu: string;
  nameEn: string;
  nameEs?: string;
  category: 'cacao' | 'sweetener' | 'dairy' | 'spice' | 'adaptogen' | 'mineral' | 'other';
  costPerKgUSD: number; // EXW Zamora or import
  descriptionRu: string;
  descriptionEn: string;
  descriptionEs?: string;
  chemicals: ChemicalProfile;
  isCustom?: boolean;
}

export interface RecipeItem {
  ingredientId: string;
  bakersPercentage: number; // % relative to 100% paste (paste = 100.00%)
  notes?: string;
}

export type MatrixType = 'zero_butter' | 'micro_wedge' | 'silk_high_fat' | 'dark_milk' | 'sweet_milk';

export type PotencyTarget = 'microdose' | 'creative' | 'therapeutic' | 'ceremonial';

export interface Recipe {
  id: string;
  code: string;
  nameRu: string;
  nameEn: string;
  nameEs?: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionEs?: string;
  basePasteWeightGrams: number; // Base 100% paste grams
  items: RecipeItem[];
  matrixType: MatrixType;
  potencyTarget?: PotencyTarget;
  isPreset?: boolean;
}

export interface BioSynergyMetrics {
  multiplierEpicatechin: number;
  multiplierCurcumin: number;
  multiplierTryptamines: number;
  multiplierMinerals: number;
  multiplierAnandamide: number;
  isSglt1Active: boolean;
  isUgtBlocked: boolean;
  isLemonTekActive: boolean;
  isEndocannabinoidShieldActive: boolean;
  isCckLipidBrake: boolean;
  isCaseinBlock: boolean;
  isTrpv1Overload: boolean;
  isSugarSeizingRisk: boolean;
  totalFlavanolsMgPer20g: number;
  epicatechinEffectiveBioDoseMg: number;
  epicatechinNominalMgPer20g: number;
  procyanidinsDP2DP7MgPer20g: number;
  theobromineMgPer20g: number;
  piperineMgPer20g: number;
  tryptamineDoseMgPer20g: number;
  effectiveTryptamineBioDoseMg: number;
  hasAjiChili: boolean;
  ajiChiliBakersPercentage: number;
  isTrpv1Active: boolean;
  capsaicinMgPer20g: number;
  chiliWeightGramsIn20g: number;
  chiliInBarPercentage: number;
  trpv1BloodFlowMultiplier: number;
  finalBarCacaoPercentage: number;
}

export interface TemperingParameters {
  matrixTypeName: string;
  preCoolingTempC: number;
  seedingTempC: number;
  silkPercentage: number;
  mixingMinutes: number;
  castingTempC: number;
  coolingTunnelTempC: string;
  coolingMinutes: number;
  cacaoButterContentPercent: number;
  milkFatPercent: number;
}

export interface NutritionFactsData {
  servingSizeGrams: number;
  servingsPerContainer: number;
  calories: number;
  totalFatG: number;
  saturatedFatG: number;
  transFatG: number;
  cholesterolMg: number;
  sodiumMg: number;
  totalCarbsG: number;
  dietaryFiberG: number;
  totalSugarsG: number;
  addedSugarsG: number;
  proteinG: number;
  vitaminDMicrog: number;
  calciumMg: number;
  ironMg: number;
  potassiumMg: number;
  magnesiumMg: number;
  // Active Bio-Nutraceuticals
  monomericEpicatechinMg: number;
  procyanidinsMg: number;
  totalFlavanolsMg: number;
  theobromineMg: number;
  effectiveBioAvailabilityFactor: number;
}

export interface EconomicsCalculation {
  batchGrossWeightG: number;
  batchGrossWeightKg: number;
  deadLossPercent: number;
  deadLossG: number;
  netYieldG: number;
  netYieldKg: number;
  rawMaterialsCostUSD: number;
  packagingCostPerBarUSD: number;
  laborAndOverheadPerKgUSD: number;
  totalBatchCostUSD: number;
  costPerKgUSD: number;
  costPer100gBarUSD: number;
  costPer70gBarUSD: number;
  costPer50gBarUSD: number;
  costPer20gDoseUSD: number;
  costPer200gBlockUSD: number;
  // Margins
  wholesaleMarginPercent: number;
  wholesalePrice100gUSD: number;
  wholesaleBatchRevenueUSD: number;
  wholesaleBatchProfitUSD: number;
  retailMarginPercent: number;
  retailPrice100gUSD: number;
  retailBatchRevenueUSD: number;
  retailBatchProfitUSD: number;
}
