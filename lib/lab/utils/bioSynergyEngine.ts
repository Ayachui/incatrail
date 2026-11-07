import { BioSynergyMetrics, Ingredient, Recipe, RecipeItem, TemperingParameters } from '../types';

export interface CalculatedItem {
  ingredient: Ingredient;
  bakersPercentage: number;
  standardPercentage: number;
  weightGrams: number;
  costUSD: number;
  notes?: string;
}

export interface FormulationCalculations {
  items: CalculatedItem[];
  totalBakersPercentage: number;
  totalWeightGrams: number;
  totalCacaoPercentage: number; // Final in-bar cacao solids percentage
  finalBarCacaoPercentage: number; // Explicit alias for final in-bar cacao content
  pureCacaoBasePercentage: number; // Pure cacao base (cacao paste + butter vs core chocolate) excluding spices/salts
  pureCacaoPastePercentage: number; // 100% paste ratio in core chocolate base
  freeButterPercentage: number;
  totalLipidsPercentage: number;
  milkPowderPercentage: number;
  panelaPercentage: number;
  saltPercentage: number;
  piperineGramsPer20g: number;
  metrics: BioSynergyMetrics;
  tempering: TemperingParameters;
}

export function isHotPepperOrChili(id: string, name?: string): boolean {
  if (id === 'black_pepper') return false;
  const s = (id + ' ' + (name || '')).toLowerCase();
  return (
    id === 'aji_chili' ||
    id === 'hot_pepper' ||
    id === 'chili' ||
    id === 'chili_pepper' ||
    id === 'cayenne' ||
    id === 'habanero' ||
    s.includes('chili') ||
    s.includes('chile') ||
    s.includes('aji') ||
    s.includes('ахи') ||
    s.includes('острый перец') ||
    s.includes('кайен')
  );
}

export function calculateFormulation(
  recipe: Recipe,
  ingredientsMap: Map<string, Ingredient>,
  spiceBloomingActive: boolean = true
): FormulationCalculations {
  const basePasteWeight = recipe.basePasteWeightGrams || 1000;

  // 1. Calculate sum of Baker's %
  let totalBakersPercentage = 0;
  recipe.items.forEach((item) => {
    totalBakersPercentage += item.bakersPercentage;
  });

  if (totalBakersPercentage === 0) totalBakersPercentage = 100;

  // Total batch weight = basePasteWeight * (totalBakersPercentage / 100)
  const totalWeightGrams = basePasteWeight * (totalBakersPercentage / 100);

  // 2. Calculate item weights and standard percentages
  let totalCacaoGrams = 0;
  let freeButterGrams = 0;
  let totalFatGrams = 0;
  let panelaGrams = 0;
  let saltGrams = 0;
  let blackPepperGrams = 0;
  let mushroomsGrams = 0;
  let hibiscusGrams = 0;
  let turmericGrams = 0;
  let gingerGrams = 0;
  let macaGrams = 0;
  let guayusaGrams = 0;
  let copaibaGrams = 0;
  let moringaGrams = 0;
  let ajiChiliGrams = 0;
  let milkPowderGrams = 0;
  let milkFatGrams = 0;

  const items: CalculatedItem[] = recipe.items.map((item) => {
    const ing = ingredientsMap.get(item.ingredientId) || {
      id: item.ingredientId,
      nameRu: 'Неизвестный ингредиент',
      nameEn: 'Unknown Ingredient',
      category: 'other' as const,
      costPerKgUSD: 0,
      descriptionRu: '',
      descriptionEn: '',
      chemicals: {
        moisture: 0,
        fat: 0,
        sugars: 0,
        protein: 0,
        fiber: 0,
        sodiumMg: 0,
        potassiumMg: 0,
        ironMg: 0,
        magnesiumMg: 0,
        zincMg: 0,
        epicatechinDP1MgPerG: 0,
        procyanidinsDP2DP7MgPerG: 0,
        theobromineMgPerG: 0,
        caffeineMgPerG: 0,
      },
    };

    const weightGrams = basePasteWeight * (item.bakersPercentage / 100);
    const standardPercentage = (item.bakersPercentage / totalBakersPercentage) * 100;
    const costUSD = (weightGrams / 1000) * ing.costPerKgUSD;

    // Track component specifics
    const fatFromIng = (weightGrams * ing.chemicals.fat) / 100;
    totalFatGrams += fatFromIng;

    if (ing.category === 'cacao' || ing.id === 'cacao_paste' || ing.id === 'cacao_butter' || ing.id.includes('cacao')) {
      totalCacaoGrams += weightGrams;
      if (ing.id === 'cacao_butter' || ing.id.includes('butter')) {
        freeButterGrams += weightGrams;
      }
    } else if (ing.id === 'panela') {
      panelaGrams += weightGrams;
    } else if (ing.id === 'sea_salt') {
      saltGrams += weightGrams;
    } else if (ing.id === 'black_pepper' || (ing.chemicals.piperinePercent && ing.chemicals.piperinePercent > 0)) {
      blackPepperGrams += weightGrams;
    } else if (ing.id === 'mushrooms' || (ing.chemicals.tryptaminesPercent && ing.chemicals.tryptaminesPercent > 0)) {
      mushroomsGrams += weightGrams;
    } else if (ing.id === 'hibiscus') {
      hibiscusGrams += weightGrams;
    } else if (ing.id === 'turmeric') {
      turmericGrams += weightGrams;
    } else if (ing.id === 'ginger') {
      gingerGrams += weightGrams;
    } else if (ing.id === 'maca') {
      macaGrams += weightGrams;
    } else if (ing.id === 'guayusa') {
      guayusaGrams += weightGrams;
    } else if (ing.id === 'copaiba') {
      copaibaGrams += weightGrams;
    } else if (ing.id === 'moringa') {
      moringaGrams += weightGrams;
    } else if (isHotPepperOrChili(ing.id, ing.nameEn || ing.nameRu)) {
      ajiChiliGrams += weightGrams;
    } else if (ing.id === 'milk_powder') {
      milkPowderGrams += weightGrams;
      milkFatGrams += (weightGrams * 26.0) / 100;
    }

    return {
      ingredient: ing,
      bakersPercentage: item.bakersPercentage,
      standardPercentage,
      weightGrams,
      costUSD,
      notes: item.notes,
    };
  });

  // Final In-Bar percentages (% of total finished chocolate mass)
  const totalCacaoPercentage = (totalCacaoGrams / totalWeightGrams) * 100;
  const finalBarCacaoPercentage = totalCacaoPercentage;
  const freeButterPercentage = (freeButterGrams / totalWeightGrams) * 100;
  const totalLipidsPercentage = (totalFatGrams / totalWeightGrams) * 100;
  const milkPowderPercentage = (milkPowderGrams / totalWeightGrams) * 100;
  const panelaPercentage = (panelaGrams / totalWeightGrams) * 100;
  const saltPercentage = (saltGrams / totalWeightGrams) * 100;
  const blackPepperPercentage = (blackPepperGrams / totalWeightGrams) * 100;
  const hibiscusPercentage = (hibiscusGrams / totalWeightGrams) * 100;
  const macaPercentage = (macaGrams / totalWeightGrams) * 100;
  const copaibaPercentage = (copaibaGrams / totalWeightGrams) * 100;
  const ajiChiliPercentage = (ajiChiliGrams / totalWeightGrams) * 100;
  const moringaPercentage = (moringaGrams / totalWeightGrams) * 100;

  // Exact Cacao Solids in finished chocolate bar
  const pureCacaoBasePercentage = totalCacaoPercentage;
  const pureCacaoPastePercentage = totalWeightGrams > 0
    ? ((totalCacaoGrams - freeButterGrams) / totalWeightGrams) * 100
    : totalCacaoPercentage;

  // 3. Hot Pepper / Chili & Piperine exact data integration from recipe
  const chiliItem = items.find((i) => isHotPepperOrChili(i.ingredient.id, i.ingredient.nameEn || i.ingredient.nameRu));
  const hasAjiChili = ajiChiliGrams > 0;
  const ajiChiliBakersPercentage = chiliItem ? chiliItem.bakersPercentage : 0;
  const chiliInBarPercentage = ajiChiliPercentage;
  const chiliWeightGramsIn20g = (chiliInBarPercentage / 100) * 20;

  // Specific capsaicin quantification from ingredient chemical profile (standard ~2.5 mg/g if unspecified)
  const capsaicinMgPerG = chiliItem?.ingredient.chemicals.capsaicinMgPerG ?? (hasAjiChili ? 2.5 : 0);
  const capsaicinMgPer20g = chiliWeightGramsIn20g * capsaicinMgPerG;

  // Black Pepper & Piperine specifics
  const blackPepperItem = items.find((i) => i.ingredient.id === 'black_pepper' || (i.ingredient.chemicals.piperinePercent && i.ingredient.chemicals.piperinePercent > 0));
  const blackPepperBakers = blackPepperItem?.bakersPercentage || 0;
  const blackPepperIn20g = (blackPepperGrams / totalWeightGrams) * 20;
  const piperinePct = blackPepperItem?.ingredient.chemicals.piperinePercent ?? 5.5; // 5.5% piperine standard
  const piperineGramsPer20g = (blackPepperIn20g * piperinePct) / 100;
  const piperineMgPer20g = piperineGramsPer20g * 1000;

  // 4. Pharmacokinetic synergy triggers (evaluated strictly against active formulation ratios)
  const isSglt1Active = panelaPercentage >= 15.0 && saltPercentage >= 0.35;
  // Full UGT blockade: >= 3.8 mg pure piperine in 20g dose, OR >= 0.38% in matrix, OR >= 0.50% BP
  const isUgtBlocked = piperineMgPer20g >= 3.8 || blackPepperPercentage >= 0.38 || blackPepperBakers >= 0.50;
  const isLemonTekActive = hibiscusPercentage >= 1.0;
  const isEndocannabinoidShieldActive = macaPercentage >= 0.8 && copaibaPercentage > 0;
  const isCckLipidBrake = freeButterPercentage > 8.0 && mushroomsGrams > 0;
  const isCaseinBlock = milkPowderPercentage >= 12.0;
  const isTrpv1Overload = blackPepperPercentage + ajiChiliPercentage > 0.65;

  // Dynamic TRPV1 mucosal microvascular perfusion activation:
  // Therapeutic threshold: capsaicin >= 0.03% in bar (~15 µg capsaicin).
  // Physiological response curve: 0.18% in bar yields +10% blood flow (+0.10); scales smoothly up to +18% max.
  const isTrpv1Active = hasAjiChili && chiliInBarPercentage >= 0.03;
  let trpv1BloodFlowMultiplier = 1.0;
  if (isTrpv1Active) {
    trpv1BloodFlowMultiplier = 1.0 + Math.min(0.18, (chiliInBarPercentage / 0.18) * 0.10);
  }

  // Sugar Seizing Risk: in 0% added butter, if dry non-fat additions > 24% of matrix
  const dryAdditionsWithoutButter = totalWeightGrams - (totalCacaoGrams - freeButterGrams) - freeButterGrams;
  const dryAdditionsPercent = (dryAdditionsWithoutButter / totalWeightGrams) * 100;
  const isSugarSeizingRisk = freeButterPercentage < 2.5 && dryAdditionsPercent > 24.0;

  // 5. Dynamic Bioactive Architecture in 20g standard dose:
  // Calculated specifically by summing across ALL ingredients in the recipe
  // weighted by their exact final in-bar mass delivered in 20g.
  let epicatechinNominalMg = 0;
  let procyanidinsDP2DP7Mg = 0;
  let theobromineMgPer20g = 0;
  let caffeineMgPer20g = 0;
  let tryptamineDoseMgPer20g = 0;

  items.forEach((item) => {
    const itemIn20g = (item.standardPercentage / 100) * 20; // grams of this ingredient in 20g finished bar
    const chem = item.ingredient.chemicals;

    if (chem.epicatechinDP1MgPerG) {
      epicatechinNominalMg += itemIn20g * chem.epicatechinDP1MgPerG;
    }
    if (chem.procyanidinsDP2DP7MgPerG) {
      procyanidinsDP2DP7Mg += itemIn20g * chem.procyanidinsDP2DP7MgPerG;
    }
    if (chem.theobromineMgPerG) {
      theobromineMgPer20g += itemIn20g * chem.theobromineMgPerG;
    }
    if (chem.caffeineMgPerG) {
      caffeineMgPer20g += itemIn20g * chem.caffeineMgPerG;
    }
    if (chem.tryptaminesPercent) {
      tryptamineDoseMgPer20g += itemIn20g * (chem.tryptaminesPercent * 10);
    }
  });

  const totalFlavanolsMgPer20g = epicatechinNominalMg + procyanidinsDP2DP7Mg;

  // 6. Dynamic Bio-Multiplier Calculations based on recipe enzyme interactions
  // (-)-Epicatechin bio-availability multiplier
  let mEpicatechin = 1.15; // native 18 µm micro-particle matrix baseline
  if (isSglt1Active) mEpicatechin *= 1.28;
  if (isUgtBlocked) {
    mEpicatechin *= 1.65;
  } else if (piperineMgPer20g > 0) {
    // Exact proportional UGT saturation curve based on piperine dose in 20g
    const ugtFraction = Math.min(1.0, piperineMgPer20g / 3.8);
    mEpicatechin *= 1.0 + (ugtFraction * 0.65);
  }

  // Integrate dynamic TRPV1 mucosal vasodilation from hot pepper / chili:
  if (isTrpv1Active) {
    mEpicatechin *= trpv1BloodFlowMultiplier;
    // Pharmacokinetic cross-synergy: enhanced splanchnic blood flow flushing through inhibited UGT enzymes
    if (isUgtBlocked) {
      mEpicatechin *= 1.05;
    }
  }

  if (spiceBloomingActive && freeButterPercentage >= 3.0) mEpicatechin *= 1.08;
  if (isLemonTekActive) mEpicatechin *= 1.12;
  if (moringaPercentage >= 0.3) mEpicatechin *= 1.22;
  if (isCckLipidBrake) mEpicatechin *= 0.82;
  if (isCaseinBlock) mEpicatechin *= 0.58;

  const epicatechinEffectiveBioDoseMg = epicatechinNominalMg * mEpicatechin;

  // Curcumin multiplier
  let mCurcumin = 1.20;
  if (isUgtBlocked) {
    mCurcumin = 20.0;
    if (spiceBloomingActive && freeButterPercentage >= 3.0) mCurcumin *= 1.35;
  } else if (piperineMgPer20g >= 1.5 || blackPepperPercentage >= 0.20 || blackPepperBakers >= 0.25) {
    mCurcumin = 1.0 + (Math.min(1.0, piperineMgPer20g / 3.8) * 19.0);
  }
  if (isCaseinBlock) mCurcumin *= 0.75;

  // Tryptamine (Psilocin) multiplier
  let mTryptamines = 1.10;
  if (isSglt1Active) mTryptamines *= 1.22;
  if (isUgtBlocked) {
    mTryptamines *= 1.45;
  } else if (piperineMgPer20g > 0) {
    mTryptamines *= 1.0 + (Math.min(1.0, piperineMgPer20g / 3.8) * 0.45);
  }
  if (isLemonTekActive) mTryptamines *= 1.35;
  if (isCckLipidBrake) mTryptamines *= 0.78;
  if (isCaseinBlock) mTryptamines *= 0.65;
  const effectiveTryptamineBioDoseMg = tryptamineDoseMgPer20g * mTryptamines;

  // Mineral bioavailability (Mg, Fe, Zn)
  let mMinerals = 0.45; // baseline phytate IP6 blockade
  if (isLemonTekActive) mMinerals *= 2.85; // dechelation -> ~1.28x
  if (isSglt1Active) mMinerals *= 1.10;
  if (isUgtBlocked) mMinerals *= 1.15;
  if (isCaseinBlock) mMinerals *= 0.70;

  // Anandamide / Macamides multiplier
  let mAnandamide = 1.0;
  if (macaPercentage >= 0.8) mAnandamide *= 1.85; // FAAH block
  if (isUgtBlocked) mAnandamide *= 1.25;
  if (spiceBloomingActive && freeButterPercentage >= 3.0) mAnandamide *= 1.30;
  if (freeButterPercentage > 8.0) mAnandamide *= 1.28;

  const metrics: BioSynergyMetrics = {
    multiplierEpicatechin: Number(mEpicatechin.toFixed(2)),
    multiplierCurcumin: Number(mCurcumin.toFixed(1)),
    multiplierTryptamines: Number(mTryptamines.toFixed(2)),
    multiplierMinerals: Number(mMinerals.toFixed(2)),
    multiplierAnandamide: Number(mAnandamide.toFixed(2)),
    isSglt1Active,
    isUgtBlocked,
    isLemonTekActive,
    isEndocannabinoidShieldActive,
    isCckLipidBrake,
    isCaseinBlock,
    isTrpv1Overload,
    isSugarSeizingRisk,
    totalFlavanolsMgPer20g: Number(totalFlavanolsMgPer20g.toFixed(1)),
    epicatechinEffectiveBioDoseMg: Number(epicatechinEffectiveBioDoseMg.toFixed(1)),
    epicatechinNominalMgPer20g: Number(epicatechinNominalMg.toFixed(1)),
    procyanidinsDP2DP7MgPer20g: Number(procyanidinsDP2DP7Mg.toFixed(1)),
    theobromineMgPer20g: Number(theobromineMgPer20g.toFixed(1)),
    piperineMgPer20g: Number(piperineMgPer20g.toFixed(2)),
    tryptamineDoseMgPer20g: Number(tryptamineDoseMgPer20g.toFixed(2)),
    effectiveTryptamineBioDoseMg: Number(effectiveTryptamineBioDoseMg.toFixed(2)),
    hasAjiChili,
    ajiChiliBakersPercentage: Number(ajiChiliBakersPercentage.toFixed(2)),
    isTrpv1Active,
    capsaicinMgPer20g: Number(capsaicinMgPer20g.toFixed(3)),
    chiliWeightGramsIn20g: Number(chiliWeightGramsIn20g.toFixed(3)),
    chiliInBarPercentage: Number(chiliInBarPercentage.toFixed(2)),
    trpv1BloodFlowMultiplier: Number(trpv1BloodFlowMultiplier.toFixed(3)),
    finalBarCacaoPercentage: Number(finalBarCacaoPercentage.toFixed(2)),
  };

  // 7. In-Melanger Silk Tempering Gates Calculation
  const milkFatInLipidsPercent = totalFatGrams > 0 ? (milkFatGrams / totalFatGrams) * 100 : 0;
  const tempering = calculateTemperingParameters(freeButterPercentage, milkPowderPercentage, milkFatInLipidsPercent, totalLipidsPercentage);

  return {
    items,
    totalBakersPercentage: Number(totalBakersPercentage.toFixed(2)),
    totalWeightGrams: Number(totalWeightGrams.toFixed(1)),
    totalCacaoPercentage: Number(totalCacaoPercentage.toFixed(2)),
    finalBarCacaoPercentage: Number(finalBarCacaoPercentage.toFixed(2)),
    pureCacaoBasePercentage: Number(pureCacaoBasePercentage.toFixed(1)),
    pureCacaoPastePercentage: Number(pureCacaoPastePercentage.toFixed(1)),
    freeButterPercentage: Number(freeButterPercentage.toFixed(2)),
    totalLipidsPercentage: Number(totalLipidsPercentage.toFixed(2)),
    milkPowderPercentage: Number(milkPowderPercentage.toFixed(2)),
    panelaPercentage: Number(panelaPercentage.toFixed(2)),
    saltPercentage: Number(saltPercentage.toFixed(2)),
    piperineGramsPer20g: Number((piperineGramsPer20g * 1000).toFixed(2)), // in mg
    metrics,
    tempering,
  };
}

function calculateTemperingParameters(
  freeButterPercent: number,
  milkPowderPercent: number,
  milkFatPercent: number,
  totalLipidsPercent: number
): TemperingParameters {
  if (milkPowderPercent >= 20.0) {
    // Sweet Milk 40% (AMF Deep Eutectic)
    return {
      matrixTypeName: 'Sweet Milk 40% (Глубокая эвтектика СЦМ)',
      preCoolingTempC: 32.2,
      seedingTempC: 31.4,
      silkPercentage: 0.95,
      mixingMinutes: 4.5,
      castingTempC: 29.6,
      coolingTunnelTempC: '10–12 °C',
      coolingMinutes: 28,
      cacaoButterContentPercent: Number(freeButterPercent.toFixed(1)),
      milkFatPercent: Number(milkFatPercent.toFixed(1)),
    };
  } else if (milkPowderPercent >= 12.0) {
    // Dark Milk 50%
    return {
      matrixTypeName: 'Dark Milk 50% (Эвтектика CB + AMF)',
      preCoolingTempC: 32.8,
      seedingTempC: 32.0,
      silkPercentage: 0.85,
      mixingMinutes: 4.0,
      castingTempC: 30.2,
      coolingTunnelTempC: '10–12 °C',
      coolingMinutes: 25,
      cacaoButterContentPercent: Number(freeButterPercent.toFixed(1)),
      milkFatPercent: Number(milkFatPercent.toFixed(1)),
    };
  } else if (freeButterPercent > 7.0) {
    // High-fluidity Silk
    return {
      matrixTypeName: 'Высокотекучая темная матрица (INCA Silk)',
      preCoolingTempC: 34.0,
      seedingTempC: 33.6,
      silkPercentage: 0.55,
      mixingMinutes: 3.0,
      castingTempC: 31.4,
      coolingTunnelTempC: '12–14 °C',
      coolingMinutes: 18,
      cacaoButterContentPercent: Number(freeButterPercent.toFixed(1)),
      milkFatPercent: 0,
    };
  } else if (freeButterPercent >= 2.5) {
    // Micro-wedge
    return {
      matrixTypeName: 'Микро-клиновая и крафтовая (Нейрогенез / Salted Craft)',
      preCoolingTempC: 34.5,
      seedingTempC: 33.6,
      silkPercentage: 0.80,
      mixingMinutes: 3.5,
      castingTempC: 31.7,
      coolingTunnelTempC: '13–15 °C',
      coolingMinutes: 20,
      cacaoButterContentPercent: Number(freeButterPercent.toFixed(1)),
      milkFatPercent: 0,
    };
  } else {
    // Zero-butter Pure
    return {
      matrixTypeName: 'Безмасляная высокоплотная (Zero Added Butter / Pure Terroir)',
      preCoolingTempC: 35.0,
      seedingTempC: 33.8,
      silkPercentage: 0.95,
      mixingMinutes: 4.5,
      castingTempC: 32.0,
      coolingTunnelTempC: '14–16 °C',
      coolingMinutes: 25,
      cacaoButterContentPercent: Number(freeButterPercent.toFixed(1)),
      milkFatPercent: 0,
    };
  }
}
