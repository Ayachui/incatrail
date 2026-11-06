import { FormulationCalculations } from './bioSynergyEngine';

export type PackagingType = 'luxury_bar' | 'block_pouch' | 'bulk_zero';

export interface EconomicsInputSettings {
  deadLossPercent: number; // 0 to 30%
  laborAndOverheadPerKgUSD: number; // workshop labor + energy, e.g. $4.50
  wholesaleMarginPercent: number; // e.g. 55%
  retailMarginPercent: number; // e.g. 80%
  targetUnitGrams: number; // e.g. 100g, 20g, 1000g (1kg)
  packagingType: PackagingType;
  customPackagingCostPerUnitUSD?: number;
}

export const DEFAULT_ECONOMICS_SETTINGS: EconomicsInputSettings = {
  deadLossPercent: 3.5,
  laborAndOverheadPerKgUSD: 4.50,
  wholesaleMarginPercent: 55,
  retailMarginPercent: 80,
  targetUnitGrams: 100,
  packagingType: 'luxury_bar',
  customPackagingCostPerUnitUSD: 0.85,
};

export interface EconomicsCalculation {
  batchGrossWeightG: number;
  batchGrossWeightKg: number;
  deadLossPercent: number;
  deadLossG: number;
  netYieldG: number;
  netYieldKg: number;
  
  // Format & packaging
  targetUnitGrams: number;
  packagingType: PackagingType;
  packagingCostPerUnitUSD: number;
  unitsProduced: number;
  
  // Costs breakdown
  rawMaterialsCostUSD: number;
  totalPackagingCostUSD: number;
  laborTotalUSD: number;
  totalBatchCostUSD: number;
  costPerKgUSD: number;
  costPerUnitUSD: number;
  
  // Unit comparisons
  costPer100gBarUSD: number;
  costPer70gBarUSD: number;
  costPer50gBarUSD: number;
  costPer20gDoseUSD: number;
  costPer1kgBlockUSD: number;

  // Wholesale B2B
  wholesaleMarginPercent: number;
  wholesaleMarkupPercent: number;
  wholesalePricePerUnitUSD: number;
  wholesaleBatchRevenueUSD: number;
  wholesaleBatchProfitUSD: number;
  wholesaleRoiPercent: number;

  // Retail B2C
  retailMarginPercent: number;
  retailMarkupPercent: number;
  retailPricePerUnitUSD: number;
  retailBatchRevenueUSD: number;
  retailBatchProfitUSD: number;
  retailRoiPercent: number;
}

export function calculateUnitEconomics(
  formulation: FormulationCalculations,
  settings: EconomicsInputSettings = DEFAULT_ECONOMICS_SETTINGS
): EconomicsCalculation {
  const batchGrossWeightG = formulation.totalWeightGrams;
  const batchGrossWeightKg = batchGrossWeightG / 1000;

  // 1. Raw materials cost
  let rawMaterialsCostUSD = 0;
  for (const item of formulation.items) {
    rawMaterialsCostUSD += item.costUSD;
  }

  // 2. Dead loss on stones (0 to 30%)
  const deadLossPercent = Math.min(30, Math.max(0, settings.deadLossPercent));
  const deadLossG = batchGrossWeightG * (deadLossPercent / 100);
  const netYieldG = Math.max(0, batchGrossWeightG - deadLossG);
  const netYieldKg = netYieldG / 1000;

  // 3. Target unit format & units count
  const targetUnitGrams = Math.max(1, settings.targetUnitGrams || 100);
  const unitsProducedExact = targetUnitGrams > 0 ? netYieldG / targetUnitGrams : 0;
  // If exact integer, show as integer, otherwise 1 decimal place
  const unitsProduced = Number(unitsProducedExact.toFixed(1));

  // 4. Packaging cost
  let packagingCostPerUnitUSD = 0;
  if (settings.packagingType === 'luxury_bar') {
    packagingCostPerUnitUSD = settings.customPackagingCostPerUnitUSD ?? 0.85;
  } else if (settings.packagingType === 'block_pouch') {
    packagingCostPerUnitUSD = settings.customPackagingCostPerUnitUSD ?? 0.35;
  } else {
    packagingCostPerUnitUSD = 0;
  }
  const totalPackagingCostUSD = unitsProducedExact * packagingCostPerUnitUSD;

  // 5. Labor & overhead
  const laborTotalUSD = batchGrossWeightKg * settings.laborAndOverheadPerKgUSD;

  // 6. Total Batch Cost & Cost per Net Kg
  const totalBatchCostUSD = rawMaterialsCostUSD + laborTotalUSD + totalPackagingCostUSD;
  const costPerKgUSD = netYieldKg > 0 ? totalBatchCostUSD / netYieldKg : 0;

  // Cost per 1 unit of chosen target format
  const rawAndLaborCostPerG = netYieldG > 0 ? (rawMaterialsCostUSD + laborTotalUSD) / netYieldG : 0;
  const costPerUnitUSD = (rawAndLaborCostPerG * targetUnitGrams) + packagingCostPerUnitUSD;

  // Standard unit reference costs (with luxury packaging for bars, pouch for 1kg)
  const costPer100gBarUSD = (rawAndLaborCostPerG * 100) + 0.85;
  const costPer70gBarUSD = (rawAndLaborCostPerG * 70) + 0.85;
  const costPer50gBarUSD = (rawAndLaborCostPerG * 50) + 0.75;
  const costPer20gDoseUSD = (rawAndLaborCostPerG * 20) + 0.25;
  const costPer1kgBlockUSD = (rawAndLaborCostPerG * 1000) + 0.50; // 1kg block vacuum

  // 7. Wholesale B2B Calculations (Target format from full net yield)
  const wm = Math.min(0.95, settings.wholesaleMarginPercent / 100);
  const wholesalePricePerUnitUSD = wm < 1 ? costPerUnitUSD / (1 - wm) : costPerUnitUSD * 2;
  const wholesaleMarkupPercent = costPerUnitUSD > 0
    ? ((wholesalePricePerUnitUSD - costPerUnitUSD) / costPerUnitUSD) * 100
    : 0;
  // Revenue from the entire net yield batch
  const wholesaleBatchRevenueUSD = wholesalePricePerUnitUSD * unitsProducedExact;
  const wholesaleBatchProfitUSD = wholesaleBatchRevenueUSD - totalBatchCostUSD;
  const wholesaleRoiPercent = totalBatchCostUSD > 0
    ? (wholesaleBatchProfitUSD / totalBatchCostUSD) * 100
    : 0;

  // 8. Retail B2C Calculations (Target format from full net yield)
  const rm = Math.min(0.95, settings.retailMarginPercent / 100);
  const retailPricePerUnitUSD = rm < 1 ? costPerUnitUSD / (1 - rm) : costPerUnitUSD * 4;
  const retailMarkupPercent = costPerUnitUSD > 0
    ? ((retailPricePerUnitUSD - costPerUnitUSD) / costPerUnitUSD) * 100
    : 0;
  // Revenue from the entire net yield batch
  const retailBatchRevenueUSD = retailPricePerUnitUSD * unitsProducedExact;
  const retailBatchProfitUSD = retailBatchRevenueUSD - totalBatchCostUSD;
  const retailRoiPercent = totalBatchCostUSD > 0
    ? (retailBatchProfitUSD / totalBatchCostUSD) * 100
    : 0;

  return {
    batchGrossWeightG: Number(batchGrossWeightG.toFixed(1)),
    batchGrossWeightKg: Number(batchGrossWeightKg.toFixed(2)),
    deadLossPercent,
    deadLossG: Number(deadLossG.toFixed(1)),
    netYieldG: Number(netYieldG.toFixed(1)),
    netYieldKg: Number(netYieldKg.toFixed(2)),
    targetUnitGrams,
    packagingType: settings.packagingType,
    packagingCostPerUnitUSD: Number(packagingCostPerUnitUSD.toFixed(2)),
    unitsProduced,
    rawMaterialsCostUSD: Number(rawMaterialsCostUSD.toFixed(2)),
    totalPackagingCostUSD: Number(totalPackagingCostUSD.toFixed(2)),
    laborTotalUSD: Number(laborTotalUSD.toFixed(2)),
    totalBatchCostUSD: Number(totalBatchCostUSD.toFixed(2)),
    costPerKgUSD: Number(costPerKgUSD.toFixed(2)),
    costPerUnitUSD: Number(costPerUnitUSD.toFixed(2)),
    costPer100gBarUSD: Number(costPer100gBarUSD.toFixed(2)),
    costPer70gBarUSD: Number(costPer70gBarUSD.toFixed(2)),
    costPer50gBarUSD: Number(costPer50gBarUSD.toFixed(2)),
    costPer20gDoseUSD: Number(costPer20gDoseUSD.toFixed(2)),
    costPer1kgBlockUSD: Number(costPer1kgBlockUSD.toFixed(2)),
    wholesaleMarginPercent: settings.wholesaleMarginPercent,
    wholesaleMarkupPercent: Number(wholesaleMarkupPercent.toFixed(1)),
    wholesalePricePerUnitUSD: Number(wholesalePricePerUnitUSD.toFixed(2)),
    wholesaleBatchRevenueUSD: Number(wholesaleBatchRevenueUSD.toFixed(2)),
    wholesaleBatchProfitUSD: Number(wholesaleBatchProfitUSD.toFixed(2)),
    wholesaleRoiPercent: Number(wholesaleRoiPercent.toFixed(1)),
    retailMarginPercent: settings.retailMarginPercent,
    retailMarkupPercent: Number(retailMarkupPercent.toFixed(1)),
    retailPricePerUnitUSD: Number(retailPricePerUnitUSD.toFixed(2)),
    retailBatchRevenueUSD: Number(retailBatchRevenueUSD.toFixed(2)),
    retailBatchProfitUSD: Number(retailBatchProfitUSD.toFixed(2)),
    retailRoiPercent: Number(retailRoiPercent.toFixed(1)),
  };
}
