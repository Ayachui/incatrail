import { NutritionFactsData } from '../types';
import { FormulationCalculations } from './bioSynergyEngine';

export function calculateNutritionFacts(
  formulation: FormulationCalculations,
  servingSizeGrams: number = 20
): NutritionFactsData {
  const totalBatchGrams = formulation.totalWeightGrams || 1000;
  const ratio = servingSizeGrams / totalBatchGrams;
  const servingsPerContainer = Math.max(1, Math.round(100 / servingSizeGrams));

  let caloriesTotal = 0;
  let fatTotal = 0;
  let satFatTotal = 0;
  let transFatTotal = 0;
  let cholesterolTotal = 0;
  let sodiumTotalMg = 0;
  let carbsTotal = 0;
  let fiberTotal = 0;
  let sugarsTotal = 0;
  let addedSugarsTotal = 0;
  let proteinTotal = 0;
  let calciumTotalMg = 0;
  let ironTotalMg = 0;
  let potassiumTotalMg = 0;
  let magnesiumTotalMg = 0;

  let epicatechinTotalMg = 0;
  let procyanidinsTotalMg = 0;
  let theobromineTotalMg = 0;

  for (const item of formulation.items) {
    const w = item.weightGrams;
    const c = item.ingredient.chemicals;

    // Fat
    const itemFat = (w * c.fat) / 100;
    fatTotal += itemFat;
    if (item.ingredient.id === 'cacao_paste' || item.ingredient.id === 'cacao_butter') {
      satFatTotal += itemFat * 0.60;
    } else if (item.ingredient.id === 'milk_powder') {
      satFatTotal += itemFat * 0.65;
      cholesterolTotal += (w * 0.95);
    }

    // Carbs & Fiber & Sugars
    const itemSugars = (w * c.sugars) / 100;
    const itemFiber = (w * c.fiber) / 100;
    sugarsTotal += itemSugars;
    fiberTotal += itemFiber;
    if (item.ingredient.id === 'panela') {
      addedSugarsTotal += itemSugars;
    }

    const otherCarbs = (w * Math.max(0, 100 - c.fat - c.protein - c.moisture)) / 100;
    carbsTotal += otherCarbs;

    // Protein
    proteinTotal += (w * c.protein) / 100;

    // Minerals
    sodiumTotalMg += (w * c.sodiumMg) / 100;
    potassiumTotalMg += (w * c.potassiumMg) / 100;
    ironTotalMg += (w * c.ironMg) / 100;
    magnesiumTotalMg += (w * c.magnesiumMg) / 100;
    if (item.ingredient.id === 'milk_powder') {
      calciumTotalMg += (w * 910) / 100;
    }

    // Flavanols & Bio-actives
    epicatechinTotalMg += w * c.epicatechinDP1MgPerG;
    procyanidinsTotalMg += w * c.procyanidinsDP2DP7MgPerG;
    theobromineTotalMg += w * c.theobromineMgPerG;
  }

  const availableCarbs = Math.max(0, carbsTotal - fiberTotal);
  caloriesTotal = (fatTotal * 9) + (proteinTotal * 4) + (availableCarbs * 4);

  return {
    servingSizeGrams,
    servingsPerContainer,
    calories: Math.round(caloriesTotal * ratio),
    totalFatG: Number((fatTotal * ratio).toFixed(1)),
    saturatedFatG: Number((satFatTotal * ratio).toFixed(1)),
    transFatG: 0,
    cholesterolMg: Math.round(cholesterolTotal * ratio),
    sodiumMg: Math.round(sodiumTotalMg * ratio),
    totalCarbsG: Number((carbsTotal * ratio).toFixed(1)),
    dietaryFiberG: Number((fiberTotal * ratio).toFixed(1)),
    totalSugarsG: Number((sugarsTotal * ratio).toFixed(1)),
    addedSugarsG: Number((addedSugarsTotal * ratio).toFixed(1)),
    proteinG: Number((proteinTotal * ratio).toFixed(1)),
    vitaminDMicrog: 0,
    calciumMg: Math.round(calciumTotalMg * ratio),
    ironMg: Number((ironTotalMg * ratio).toFixed(1)),
    potassiumMg: Math.round(potassiumTotalMg * ratio),
    magnesiumMg: Math.round(magnesiumTotalMg * ratio),
    monomericEpicatechinMg: Number((epicatechinTotalMg * ratio).toFixed(1)),
    procyanidinsMg: Number((procyanidinsTotalMg * ratio).toFixed(1)),
    totalFlavanolsMg: Number(((epicatechinTotalMg + procyanidinsTotalMg) * ratio).toFixed(1)),
    theobromineMg: Number((theobromineTotalMg * ratio).toFixed(1)),
    effectiveBioAvailabilityFactor: formulation.metrics.multiplierEpicatechin,
  };
}
