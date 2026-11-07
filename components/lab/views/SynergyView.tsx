"use client";
import React from 'react';
import {
  Activity,
  Zap,
  Shield,
  Heart,
  Brain,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  ChevronRight,
  Flame,
  Scale,
  Layers,
} from 'lucide-react';
import { Language, Recipe } from '@/lib/lab/types';
import { FormulationCalculations, isHotPepperOrChili } from '@/lib/lab/utils/bioSynergyEngine';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface SynergyViewProps {
  recipe: Recipe;
  formulation: FormulationCalculations;
  language: Language;
}

export const SynergyView: React.FC<SynergyViewProps> = ({ recipe, formulation, language }) => {
  const t = TRANSLATIONS[language];
  const m = formulation.metrics;
  const isRu = language === 'ru';
  const isEs = language === 'es';

  // Recipe-specific ingredient lookups
  const findItem = (id: string) => formulation.items.find((i) => i.ingredient.id === id);

  const cacaoPasteItem = findItem('cacao_paste');
  const blackPepperItem = findItem('black_pepper');
  const ajiChiliItem =
    formulation.items.find((i) =>
      isHotPepperOrChili(i.ingredient.id, i.ingredient.nameEn || i.ingredient.nameRu)
    ) || findItem('aji_chili');
  const turmericItem = findItem('turmeric');
  const mushroomItem = findItem('mushrooms');
  const hibiscusItem = findItem('hibiscus');
  const gingerItem = findItem('ginger');
  const macaItem = findItem('maca');
  const guayusaItem = findItem('guayusa');
  const copaibaItem = findItem('copaiba');
  const panelaItem = findItem('panela');
  const saltItem = findItem('sea_salt');
  const moringaItem = findItem('moringa');

  const hasCacao = !!cacaoPasteItem && cacaoPasteItem.weightGrams > 0;
  const hasPepper = !!blackPepperItem && blackPepperItem.weightGrams > 0;
  const hasAjiChili = !!ajiChiliItem && ajiChiliItem.weightGrams > 0;
  const hasTurmeric = !!turmericItem && turmericItem.weightGrams > 0;
  const hasMushrooms = !!mushroomItem && mushroomItem.weightGrams > 0;
  const hasHibiscus = !!hibiscusItem && hibiscusItem.weightGrams > 0;
  const hasGinger = !!gingerItem && gingerItem.weightGrams > 0;
  const hasMaca = !!macaItem && macaItem.weightGrams > 0;
  const hasGuayusa = !!guayusaItem && guayusaItem.weightGrams > 0;
  const hasCopaiba = !!copaibaItem && copaibaItem.weightGrams > 0;

  // Curcumin calculations
  const turmericBakersPct = turmericItem?.bakersPercentage || 0;
  const turmericGrams = turmericItem?.weightGrams || 0;
  const turmericIn20g = (turmericGrams / formulation.totalWeightGrams) * 20;
  const curcuminMgIn20g = turmericIn20g * 35; // ~3.5% curcumin = 35 mg/g

  // Combined spice load for TRPV1 mucosa safety
  const pepperPctInBar = blackPepperItem ? blackPepperItem.standardPercentage : 0;
  const ajiPctInBar = ajiChiliItem ? ajiChiliItem.standardPercentage : 0;
  const combinedSpicesPct = pepperPctInBar + ajiPctInBar;
  const isNearTrpv1Threshold = combinedSpicesPct >= 0.55 && combinedSpicesPct <= 0.65;
  const isTrpv1Over = combinedSpicesPct > 0.65;

  const unitMg = isRu ? 'мг' : 'mg';
  const unitG = isRu ? 'г' : 'g';
  const unitKg = isRu ? 'кг' : 'kg';

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t.synergyTitle}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-semibold uppercase">
                  {isRu ? recipe.nameRu : isEs ? (recipe.nameEs || recipe.nameEn) : recipe.nameEn}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.synergySubtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
              <span className="text-purple-600 dark:text-purple-300">
                {isRu ? 'Какао в плитке:' : isEs ? 'Cacao en barra:' : 'Cacao in Bar:'}{' '}
              </span>
              <strong className="text-purple-700 dark:text-purple-200">
                {formulation.totalCacaoPercentage.toFixed(1)}%
              </strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">{isRu ? 'Партия:' : isEs ? 'Lote:' : 'Batch:'} </span>
              <strong className="text-slate-900 dark:text-white">{formulation.totalWeightGrams} {unitG}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* SPECIAL FEATURE: DP1–DP7 Polyphenol Fractions & Volume Meaning */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-purple-800/80 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-800/60">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {isRu
                  ? 'Фракции полифенолов DP1–DP7 и клинический смысл объемов'
                  : isEs
                  ? 'Fracciones de Polifenoles DP1–DP7 y Significado Clínico de los Volúmenes'
                  : 'DP1–DP7 Polyphenol Profile & Clinical Bio-Equivalence'}
              </h3>
              <p className="text-[11px] text-purple-300">
                {isRu
                  ? 'Расчет по стандарту AOAC 2020.05 для неферментированного Cacao Nacional 18 мкм (порция 20 г)'
                  : isEs
                  ? 'Estándar AOAC 2020.05 para Cacao Nacional sin fermentar 18 µm (porción 20 g)'
                  : 'AOAC 2020.05 benchmark for native unfermented Cacao Nacional 18 µm (20g dose)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-purple-300">{isRu ? 'Какао в плитке:' : isEs ? 'Cacao en barra:' : 'Cacao in Bar:'}</span>
            <span className="px-2.5 py-0.5 rounded-md bg-purple-900 text-purple-200 font-bold">
              {formulation.totalCacaoPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* 4 Pillars of Flavanol Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* 1. Monomer (-)-Epicatechin DP1 */}
          <div className="p-4 rounded-xl bg-purple-900/40 border border-purple-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                DP1: {isRu ? 'Мономер (-)-Эпикатехин' : isEs ? 'Monómero (-)-Epicatequina' : 'DP1: Monomer Epicatechin'}
              </span>
              <Heart className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white flex items-baseline gap-1.5">
                <span>{m.epicatechinNominalMgPer20g}</span>
                <span className="text-xs font-normal text-purple-300">{unitMg}</span>
                <span className="text-[10px] text-purple-300 font-normal">
                  ({isRu ? 'номинал' : isEs ? 'nominal' : 'nominal'})
                </span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                <span>⚡ {m.epicatechinEffectiveBioDoseMg} {unitMg}</span>
                <span className="opacity-80">({m.multiplierEpicatechin}× {isRu ? 'в крови' : isEs ? 'en sangre' : 'in blood'})</span>
              </div>
            </div>
            <div className="text-[10px] text-purple-200 leading-snug font-sans pt-1">
              <strong>{isRu ? 'Что значит этот объем:' : isEs ? 'Significado clínico:' : 'Clinical equivalence:'}</strong>{' '}
              {isRu ? (
                <>
                  Номинал в 20 г: <strong>{m.epicatechinNominalMgPer20g} мг</strong>. Единственный мономер, проникающий в кровь напрямую через энтероциты. Синергия с перцем и SGLT1 дает биодоступность, эквивалентную <strong>{m.epicatechinEffectiveBioDoseMg} мг</strong> (~300–400 г обычного темного шоколада). Активирует eNOS (+4.5% FMD) и снимает спазмы.
                </>
              ) : isEs ? (
                <>
                  Nominal en 20 g: <strong>{m.epicatechinNominalMgPer20g} mg</strong>. Único flavanol que cruza enterocitos a la sangre. La sinergia con piperina y SGLT1 eleva la absorción sistémica a <strong>{m.epicatechinEffectiveBioDoseMg} mg</strong> (equivale a 300–400 g de chocolate común). Activa eNOS (+4.5% FMD).
                </>
              ) : (
                <>
                  Nominal in 20g: <strong>{m.epicatechinNominalMgPer20g} mg</strong>. Sole flavanol directly crossing enterocytes into blood. Synergy with piperine and SGLT1 unlocks systemic yield of <strong>{m.epicatechinEffectiveBioDoseMg} mg</strong> (equal to 300–400g regular dark chocolate). Activates eNOS (+4.5% FMD).
                </>
              )}
            </div>
          </div>

          {/* 2. Oligomeric Procyanidins DP2–DP7 */}
          <div className="p-4 rounded-xl bg-purple-900/40 border border-purple-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                DP2–DP7: {isRu ? 'Олигомеры (Димеры-Гептамеры)' : isEs ? 'Procianidinas DP2–DP7' : 'DP2–DP7: Oligomers'}
              </span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white flex items-baseline gap-1.5">
                <span>{m.procyanidinsDP2DP7MgPer20g}</span>
                <span className="text-xs font-normal text-purple-300">{unitMg}</span>
              </div>
              <div className="mt-1 text-[10px] text-purple-300">
                {isRu ? 'Люминальный щит и микробиом' : isEs ? 'Escudo luminal y microbiota' : 'Luminal shield & microbiota'}
              </div>
            </div>
            <div className="text-[10px] text-purple-200 leading-snug font-sans pt-1">
              <strong>{isRu ? 'Что значит этот объем:' : isEs ? 'Significado clínico:' : 'Clinical equivalence:'}</strong>{' '}
              {isRu ? (
                <>
                  Димеры B2, тримеры C1 до гептамеров (MW &gt; 578 Да). Не всасываются в тонком кишечнике напрямую, а работают в просвете ЖКТ как мощный антиоксидантный щит от окисления триптаминов. В толстой кишке ферментируются микробиотой в биоактивные валеролактоны с отложенной нейропротекцией через 6–12 ч.
                </>
              ) : isEs ? (
                <>
                  Dímeros B2, trímeros C1 hasta heptámeros (MW &gt; 578 Da). No cruzan directo al torrente; protegen el lumen intestinal contra la oxidación. La microbiota colónica los fermenta en valerolactonas bioactivas que aportan neuroprotección sostenida 6–12 h después.
                </>
              ) : (
                <>
                  Dimers B2, trimers C1 up to heptamers (MW &gt; 578 Da). Operate in intestinal lumen as a potent antioxidant shield. Colonic microbiota ferment them into bio-valerolactones yielding delayed neuroprotection 6–12 hours later.
                </>
              )}
            </div>
          </div>

          {/* 3. Total Bioactive Flavanols AOAC */}
          <div className="p-4 rounded-xl bg-purple-900/40 border border-purple-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                {isRu ? 'Общие флаванолы (AOAC)' : isEs ? 'Flavanoles Totales (AOAC)' : 'Total Flavanols (AOAC)'}
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white flex items-baseline gap-1.5">
                <span>{m.totalFlavanolsMgPer20g}</span>
                <span className="text-xs font-normal text-purple-300">{unitMg}</span>
              </div>
              <div className="mt-1 text-[10px] text-purple-300 font-mono">
                {isRu ? 'Сумма:' : isEs ? 'Suma:' : 'Sum:'} {m.epicatechinNominalMgPer20g} + {m.procyanidinsDP2DP7MgPer20g} = {m.totalFlavanolsMgPer20g} {unitMg}
              </div>
            </div>
            <div className="text-[10px] text-purple-200 leading-snug font-sans pt-1">
              <strong>{isRu ? 'Что значит этот объем:' : isEs ? 'Significado clínico:' : 'Clinical equivalence:'}</strong>{' '}
              {isRu ? (
                <>
                  Стандарт EFSA предписывает <strong>200 мг флаванолов какао в день</strong>. Порция 20 г Cacao Zamora содержит <strong>{(m.totalFlavanolsMgPer20g / 200).toFixed(1)}x суточные нормы EFSA</strong>. Суммарный био-потенциал с учетом буста DP1 = <strong>{(m.epicatechinEffectiveBioDoseMg + m.procyanidinsDP2DP7MgPer20g).toFixed(1)} мг</strong>.
                </>
              ) : isEs ? (
                <>
                  La norma de la EFSA exige <strong>200 mg diarios de flavonoles</strong>. Una sola dosis de 20 g de Cacao Zamora aporta <strong>{(m.totalFlavanolsMgPer20g / 200).toFixed(1)}x la dosis diaria recomendada por la EFSA</strong>. Potencial bio-sistémico total = <strong>{(m.epicatechinEffectiveBioDoseMg + m.procyanidinsDP2DP7MgPer20g).toFixed(1)} mg</strong>.
                </>
              ) : (
                <>
                  EFSA standard requires <strong>200 mg daily cocoa flavanols</strong>. A single 20g dose of Cacao Zamora delivers <strong>{(m.totalFlavanolsMgPer20g / 200).toFixed(1)}x the daily EFSA target</strong>. Total systemic bio-potential = <strong>{(m.epicatechinEffectiveBioDoseMg + m.procyanidinsDP2DP7MgPer20g).toFixed(1)} mg</strong>.
                </>
              )}
            </div>
          </div>

          {/* 4. Native Theobromine Nacional */}
          <div className="p-4 rounded-xl bg-purple-900/40 border border-purple-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                {isRu ? 'Теобромин Nacional' : isEs ? 'Teobromina Nacional' : 'Native Theobromine'}
              </span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white flex items-baseline gap-1.5">
                <span>{m.theobromineMgPer20g}</span>
                <span className="text-xs font-normal text-purple-300">{unitMg}</span>
              </div>
              <div className="mt-1 text-[10px] text-purple-300">
                {isRu ? 'Вазодилататор без тремора' : isEs ? 'Vasodilatador sin taquicardia' : 'Vasodilator without jitters'}
              </div>
            </div>
            <div className="text-[10px] text-purple-200 leading-snug font-sans pt-1">
              <strong>{isRu ? 'Что значит этот объем:' : isEs ? 'Significado clínico:' : 'Clinical equivalence:'}</strong>{' '}
              {isRu ? (
                <>
                  Природный алкалоид-вазодилататор (антагонист аденозина A1/A2A и ингибитор PDE4). В отличие от кофеина, не вызывает сужения сосудов, скачков давления и тремора, обеспечивая мягкое тепло в груди и спокойный фокус.
                </>
              ) : isEs ? (
                <>
                  Alcaloide vasodilatador nativo (antagonista A1/A2A e inhibidor de PDE4). A diferencia de la cafeína, no causa vasoconstricción, taquicardia ni temblores, promoviendo calidez torácica y enfoque sostenido.
                </>
              ) : (
                <>
                  Native vasodilator alkaloid (A1/A2A adenosine antagonist & PDE4 inhibitor). Unlike caffeine, it expands vessels without spikes or jitters, providing chest warmth and calm focus.
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Multiplier Grid: 5 Core Ligands with Active State & Baseline Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. (-)-Epicatechin DP1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                (-)-{isRu ? 'Эпикатехин DP1' : isEs ? 'Epicatequina DP1' : 'Epicatechin DP1'}
              </span>
              <Heart className="w-4 h-4 text-purple-500" />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
                {m.multiplierEpicatechin}x
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                +{Math.round((m.multiplierEpicatechin - 1) * 100)}% AUC
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                {m.epicatechinEffectiveBioDoseMg} {unitMg}
              </span>
              <span className="text-slate-400">
                / 20 {unitG} ({isRu ? 'номинал:' : isEs ? 'nominal:' : 'nominal:'}{' '}
                {m.epicatechinNominalMgPer20g} {unitMg})
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
            <div className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>
                {isRu ? 'От чего сравниваем (Baseline):' : isEs ? 'Comparación de base (Baseline):' : 'Baseline Comparison:'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-snug">
              {isRu ? (
                <>
                  <strong>Контроль 1.0x:</strong> Стандартный коммерческий темный шоколад (разрушение 80% мономеров при ферментации и обжарке).
                  <br />
                  <strong>В матрице INCA:</strong> Неферментированный Cacao Nacional 18 мкм (номинал <strong>{m.epicatechinNominalMgPer20g} мг</strong> DP1 на 20 г)
                  {hasPepper && (m.isUgtBlocked ? ` + пиперин (+65% за счет UGT-блока)` : ` + пиперин (+${Math.round(Math.min(1.0, m.piperineMgPer20g / 3.8) * 65)}% частичный UGT-блок)`)}
                  {m.isSglt1Active && ` + SGLT1 (+28% активный транспорт)`}
                  {hasAjiChili && ` + Острый перец (+${Math.round((m.trpv1BloodFlowMultiplier - 1) * 100)}% TRPV1 кровоток)`}.
                </>
              ) : isEs ? (
                <>
                  <strong>Control 1.0x:</strong> Chocolate negro comercial (degradación del 80% de monómeros por fermentación/tostado).
                  <br />
                  <strong>En matriz INCA:</strong> Cacao Nacional sin fermentar (nominal <strong>{m.epicatechinNominalMgPer20g} mg</strong> DP1 en 20 g)
                  {hasPepper && (m.isUgtBlocked ? ` + piperina (+65% por bloqueo UGT)` : ` + piperina (+${Math.round(Math.min(1.0, m.piperineMgPer20g / 3.8) * 65)}% UGT parcial)`)}
                  {m.isSglt1Active && ` + SGLT1 (+28% transporte activo)`}
                  {hasAjiChili && ` + Ají / Chile (+${Math.round((m.trpv1BloodFlowMultiplier - 1) * 100)}% flujo TRPV1)`}.
                </>
              ) : (
                <>
                  <strong>Control 1.0x:</strong> Standard commercial dark chocolate (80% monomer degradation during fermentation/roasting).
                  <br />
                  <strong>In INCA matrix:</strong> Native unfermented Cacao Nacional (nominal <strong>{m.epicatechinNominalMgPer20g} mg</strong> DP1 in 20g)
                  {hasPepper && (m.isUgtBlocked ? ` + piperine (+65% via UGT block)` : ` + piperine (+${Math.round(Math.min(1.0, m.piperineMgPer20g / 3.8) * 65)}% partial UGT)`)}
                  {m.isSglt1Active && ` + SGLT1 (+28% active transport)`}
                  {hasAjiChili && ` + Hot Pepper (+${Math.round((m.trpv1BloodFlowMultiplier - 1) * 100)}% TRPV1 flow)`}.
                </>
              )}
            </p>
          </div>
        </div>

        {/* 2. Curcuminoids (Turmeric) */}
        <div
          className={`rounded-2xl p-5 border flex flex-col justify-between shadow-sm transition-all ${
            hasTurmeric
              ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/40'
              : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isRu ? 'Куркуминоиды' : isEs ? 'Curcuminoides' : 'Curcuminoids'}
              </span>
              <Zap className={`w-4 h-4 ${hasTurmeric ? 'text-amber-500' : 'text-slate-400'}`} />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-3xl font-mono font-extrabold tabular-nums ${
                  hasTurmeric ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
                }`}
              >
                {hasTurmeric ? `${m.multiplierCurcumin}x` : '—'}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  hasTurmeric
                    ? m.multiplierCurcumin >= 15
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {hasTurmeric
                  ? m.multiplierCurcumin >= 15
                    ? isRu ? 'Пиковый UGT блок' : isEs ? 'Bloqueo UGT Pico' : 'Peak UGT Block'
                    : isRu ? 'Умеренный блок' : isEs ? 'Bloqueo Moderado' : 'Moderate Block'
                  : isRu ? 'Не в рецепте' : isEs ? 'No en receta' : 'Not in recipe'}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              {hasTurmeric ? (
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {curcuminMgIn20g.toFixed(1)} {unitMg}
                  </span>
                  <span className="text-slate-400">
                    {isRu ? `куркумина / 20 ${unitG}` : isEs ? `curcumina / 20 ${unitG}` : `curcumin / 20 ${unitG}`}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic">
                  {isRu
                    ? '0 мг (куркума не добавлена в текущий рецепт)'
                    : isEs
                    ? '0 mg (cúrcuma no añadida en esta fórmula)'
                    : '0 mg (turmeric not added in active formula)'}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
            <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>
                {isRu ? 'От чего сравниваем (Baseline):' : isEs ? 'Comparación de base (Baseline):' : 'Baseline Comparison:'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-snug">
              {hasTurmeric ? (
                m.isUgtBlocked ? (
                  isRu
                    ? `Куркума (${turmericBakersPct}%) растворена в жире (Spice Blooming 60°C) + пиперин (${m.piperineMgPer20g} мг/20г) блокирует UGT1A1 -> биодоступность возрастает ровно в 20 раз.`
                    : isEs
                    ? `Cúrcuma disuelta en fase lipídica + piperina (${m.piperineMgPer20g} mg/20g) satura UGT1A1 -> absorción multiplicada exactamente por 20x.`
                    : `Turmeric lipid dissolution + piperine (${m.piperineMgPer20g} mg/20g) saturates UGT1A1 -> 20.0x bio-uptake.`
                ) : (
                  isRu
                    ? `Куркума добавлена, но пиперин ниже порога полного насыщения (3.8 мг). Биодоступность умеренная (${m.multiplierCurcumin}x).`
                    : isEs
                    ? `Cúrcuma añadida pero piperina < 3.8 mg. Biodisponibilidad moderada (${m.multiplierCurcumin}x).`
                    : `Turmeric present but piperine < 3.8 mg. Moderate bioavailability (${m.multiplierCurcumin}x).`
                )
              ) : (
                isRu
                  ? 'Куркума отсутствует в этом рецепте (0 мг). Для активации 20x противовоспалительного контура введите куркуму в калькуляторе.'
                  : isEs
                  ? 'Cúrcuma no presente en esta fórmula. Añádala en el calculador para activar el circuito 20x.'
                  : 'Turmeric not present in this formulation. Add turmeric in calculator to engage 20x circuit.'
              )}
            </p>
          </div>
        </div>

        {/* 3. Tryptamines (Psilocin / Mushrooms) */}
        <div
          className={`rounded-2xl p-5 border flex flex-col justify-between shadow-sm transition-all ${
            hasMushrooms
              ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/40'
              : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isRu ? 'Триптамины (Псилоцин)' : isEs ? 'Triptaminas (Psilocina)' : 'Tryptamines (Psilocin)'}
              </span>
              <Sparkles className={`w-4 h-4 ${hasMushrooms ? 'text-indigo-500' : 'text-slate-400'}`} />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-3xl font-mono font-extrabold tabular-nums ${
                  hasMushrooms ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                }`}
              >
                {hasMushrooms ? `${m.multiplierTryptamines}x` : '—'}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  hasMushrooms ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                }`}
              >
                {hasMushrooms
                  ? isRu
                    ? `+${Math.round((m.multiplierTryptamines - 1) * 100)}% к силе`
                    : isEs
                    ? `+${Math.round((m.multiplierTryptamines - 1) * 100)}% potencia`
                    : `+${Math.round((m.multiplierTryptamines - 1) * 100)}% potency`
                  : isRu ? 'Не в рецепте' : isEs ? 'No en receta' : 'Not in recipe'}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              {hasMushrooms ? (
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {m.effectiveTryptamineBioDoseMg} {unitMg}
                  </span>
                  <span className="text-slate-400">
                    {isRu ? 'био-эквивалент' : isEs ? 'bio-equivalente' : 'bio-equivalent'} (
                    {m.tryptamineDoseMgPer20g} {unitMg} {isRu ? 'сырой' : isEs ? 'crudo' : 'raw'} / 20 {unitG})
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic">
                  {isRu
                    ? 'Чистая безалкогольная нутрицевтическая формула'
                    : isEs
                    ? 'Fórmula nutracéutica pura sin componentes fúngicos'
                    : 'Pure vascular nutraceutical formulation'}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
            <div className="font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>
                {isRu ? 'От чего сравниваем (Baseline):' : isEs ? 'Comparación de base (Baseline):' : 'Baseline Comparison:'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-snug">
              {hasMushrooms ? (
                isRu
                  ? `0.50 г в матрице эквивалентны ${(0.5 * m.multiplierTryptamines).toFixed(2)} г чая. ${
                      m.isLemonTekActive ? 'Lemon-Tek гибискуса активирует предгидролиз. ' : ''
                    }${hasGinger ? 'Имбирь блокирует 5-HT3 рецепторы тошноты.' : ''}`
                  : isEs
                  ? `0.50 g en matriz equivalen a ${(0.5 * m.multiplierTryptamines).toFixed(2)} g de té acuoso. ${
                      m.isLemonTekActive ? 'Lemon-Tek de hibisco activa prehidrólisis. ' : ''
                    }${hasGinger ? 'Jengibre bloquea receptores 5-HT3 de náusea.' : ''}`
                  : `0.50g in matrix equals ${(0.5 * m.multiplierTryptamines).toFixed(2)}g of water tea without nausea.`
              ) : (
                isRu
                  ? 'Грибы не включены в текущий рецепт (0 мг). Матрица функционирует как чистый сердечно-сосудистый нутрицевтик.'
                  : isEs
                  ? 'Hongos ausentes en esta fórmula (0 mg). La matriz actúa como nutracéutico vascular puro.'
                  : 'Mushrooms not included in this formula (0 mg). Operates as pure vascular nutraceutical.'
              )}
            </p>
          </div>
        </div>

        {/* 4. Hot Pepper: Aji Chili (Capsaicin / TRPV1 Vasomotor Mucosa) */}
        <div
          className={`rounded-2xl p-5 border flex flex-col justify-between shadow-sm transition-all ${
            hasAjiChili
              ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/40'
              : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isRu ? 'Острый перец / Ахи (TRPV1 Слизистая)' : isEs ? 'Ají / Chile Picante (TRPV1 Mucosa)' : 'Hot Pepper / Chili (TRPV1 Mucosa)'}
              </span>
              <Flame className={`w-4 h-4 ${hasAjiChili ? 'text-rose-500' : 'text-slate-400'}`} />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span
                className={`text-3xl font-mono font-extrabold tabular-nums ${
                  hasAjiChili ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
                }`}
              >
                {hasAjiChili ? `+${Math.round((m.trpv1BloodFlowMultiplier - 1) * 100)}%` : '—'}
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  hasAjiChili ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                }`}
              >
                {hasAjiChili
                  ? isRu ? 'CGRP Выброс / Кровоток' : isEs ? 'Flujo CGRP Activo' : 'CGRP Blood Flow'
                  : isRu ? 'Не добавлен' : isEs ? 'No añadido' : 'Not added'}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-mono space-y-0.5">
              {hasAjiChili ? (
                <>
                  <div>
                    {ajiChiliItem?.weightGrams.toFixed(1)} {unitG} ({ajiChiliItem?.bakersPercentage.toFixed(2)}% {isRu ? 'к пасте' : isEs ? 'a la pasta' : 'Baker\'s'} / {m.chiliInBarPercentage.toFixed(2)}% {isRu ? 'в плитке' : isEs ? 'en barra' : 'in bar'})
                  </div>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    ⚡ {(m.capsaicinMgPer20g * 1000).toFixed(0)} µg ({m.capsaicinMgPer20g.toFixed(3)} {unitMg}) {isRu ? 'капсаицина на порцию 20 г' : isEs ? 'capsaicina por porción 20 g' : 'capsaicin per 20g dose'} ({m.chiliWeightGramsIn20g.toFixed(3)} {unitG})
                  </div>
                </>
              ) : (
                <span className="text-slate-400 italic">0 {unitG} (0%)</span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
            <div className="font-semibold text-rose-900 dark:text-rose-300 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>
                {isRu ? 'Фармакокинетика острого перца:' : isEs ? 'Farmacocinética del ají picante:' : 'Capsaicin Mucosal Pharmacokinetics:'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-snug">
              {hasAjiChili ? (
                isRu
                  ? `Капсаицин (${(m.capsaicinMgPer20g * 1000).toFixed(0)} мкг в 20 г) активирует рецепторы TRPV1 на сенсорных C-волокнах слизистой ЖКТ. Локальный выброс нейропептида CGRP расширяет дуоденальные микрососуды на +${Math.round((m.trpv1BloodFlowMultiplier - 1) * 100)}%, ускоряя перенос мономерного (-)-эпикатехина DP1 в портальный кровоток без раздражения желудка.`
                  : isEs
                  ? `La capsaicina (${(m.capsaicinMgPer20g * 1000).toFixed(0)} µg en 20 g) activa los receptores TRPV1 en fibras C sensoriales. La liberación local del neuropéptido CGRP dilata los microvasos duodenales un +${Math.round((m.trpv1BloodFlowMultiplier - 1) * 100)}%, acelerando el transporte de (-)-epicatequina DP1 al torrente sanguíneo sin irritación gástrica.`
                  : `Capsaicin (${(m.capsaicinMgPer20g * 1000).toFixed(0)} µg in 20g) activates mucosal TRPV1 receptors on sensory C-fibers. Local CGRP release expands splanchnic microcirculation by +${Math.round((m.trpv1BloodFlowMultiplier - 1) * 100)}%, driving monomeric epicatechin DP1 into systemic blood without gastric discomfort.`
              ) : (
                isRu
                  ? 'Острый перец отсутствует (0%). Добавьте 0.15–0.18% ахи чили для включения локального вазомоторного ускорения всасывания через TRPV1 рецепторы.'
                  : isEs
                  ? 'Ají ausente (0%). Agregue 0.15–0.18% de ají chilis para acelerar la microcirculación duodenal mediante receptores TRPV1.'
                  : 'Aji chili absent (0%). Add 0.15–0.18% to stimulate mucosal microcirculation and accelerate DP1 uptake via TRPV1 receptors.'
              )}
            </p>
          </div>
        </div>

        {/* 5. Minerals (Mg, Fe, Zn Dechelation) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isRu ? 'Минералы (Mg²⁺, Fe²⁺, Zn²⁺)' : isEs ? 'Minerales (Mg²⁺, Fe²⁺, Zn²⁺)' : 'Minerals (Mg²⁺, Fe²⁺, Zn²⁺)'}
              </span>
              <Shield className="w-4 h-4 text-cyan-500" />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums">
                {m.multiplierMinerals}x
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  m.isLemonTekActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                }`}
              >
                {m.isLemonTekActive
                  ? isRu ? 'Дехелатировано' : isEs ? 'Desquelatado' : 'Dechelated'
                  : isRu ? 'Фитатный блок IP6' : isEs ? 'Bloqueo Fitatos IP6' : 'IP6 Phytate Block'}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-mono">
              <span>{isRu ? 'Гибискус (Flor de Jamaica):' : isEs ? 'Hibisco (Flor de Jamaica):' : 'Hibiscus:'} </span>
              <strong className={hasHibiscus ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}>
                {hibiscusItem ? `${hibiscusItem.bakersPercentage.toFixed(1)}%` : '0%'}
              </strong>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
            <div className="font-semibold text-cyan-900 dark:text-cyan-300 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>
                {isRu ? 'От чего сравниваем (Baseline):' : isEs ? 'Comparación de base (Baseline):' : 'Baseline Comparison:'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-snug">
              {m.isLemonTekActive ? (
                isRu
                  ? `Органические кислоты гибискуса (${hibiscusItem?.bakersPercentage.toFixed(1)}%) связывают минералы в растворимые цитраты, снимая фитатный блок до ${m.multiplierMinerals}x.`
                  : isEs
                  ? `Ácidos orgánicos del hibisco quelatan minerales en citratos solubles elevando biodisponibilidad a ${m.multiplierMinerals}x.`
                  : `Hibiscus organic acids convert ions into soluble citrates, boosting uptake to ${m.multiplierMinerals}x.`
              ) : (
                isRu
                  ? 'Гибискус не добавлен (<1.0%). Сырой боб содержит фитаты IP6, блокирующие 55–60% двухвалентных катионов.'
                  : isEs
                  ? 'Hibisco ausente (<1.0%). Fitatos IP6 bloquean el 55–60% de cationes divalentes.'
                  : 'Hibiscus absent (<1.0%). Bean phytates bind 55–60% of divalent cations.'
              )}
            </p>
          </div>
        </div>

        {/* 6. Endocannabinoids (Anandamide & Macamides) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isRu ? 'Анандамид (Блаженство)' : isEs ? 'Anandamida (Bienestar)' : 'Anandamide (Bliss Molecule)'}
              </span>
              <Brain className="w-4 h-4 text-teal-500" />
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-mono font-extrabold text-teal-600 dark:text-teal-400 tabular-nums">
                {m.multiplierAnandamide}x
              </span>
              <span
                className={`text-xs font-mono font-semibold ${
                  m.isEndocannabinoidShieldActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                }`}
              >
                {m.isEndocannabinoidShieldActive
                  ? isRu ? 'FAAH Блок Активен' : isEs ? 'Bloqueo FAAH Activo' : 'FAAH Block Active'
                  : isRu ? 'Базовый N-ацил' : isEs ? 'Línea base N-acilo' : 'Baseline NAE'}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-mono space-x-2">
              <span>Maca: {hasMaca ? `${macaItem?.bakersPercentage.toFixed(1)}%` : '0%'}</span>
              <span>Copaiba: {hasCopaiba ? `${copaibaItem?.bakersPercentage.toFixed(2)}%` : '0%'}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1.5">
            <div className="font-semibold text-teal-900 dark:text-teal-300 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>
                {isRu ? 'От чего сравниваем (Baseline):' : isEs ? 'Comparación de base (Baseline):' : 'Baseline Comparison:'}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-snug">
              {hasMaca ? (
                isRu
                  ? `Макамиды маки (${macaItem?.bakersPercentage.toFixed(1)}%) селективно ингибируют FAAH, защищая эндогенный анандамид от гидролиза`
                  : isEs
                  ? `Macamidas de maca (${macaItem?.bakersPercentage.toFixed(1)}%) inhiben selectivamente FAAH, prolongando la anandamida`
                  : `Maca macamides (${macaItem?.bakersPercentage.toFixed(1)}%) inhibit FAAH, protecting endogenous anandamide`
              ) : (
                isRu
                  ? 'Мака не добавлена (эндогенный анандамид быстро расщепляется ферментом FAAH за несколько минут)'
                  : isEs
                  ? 'Maca ausente (la anandamida se degrada por FAAH en pocos minutos)'
                  : 'Maca absent (endogenous anandamide is cleared by FAAH within minutes)'
              )}
              {hasCopaiba &&
                (isRu
                  ? ' + β-кариофиллен копайбы напрямую модулирует рецепторы CB2'
                  : isEs
                  ? ' + β-cariofileno de copaiba modula directamente los receptores CB2'
                  : ' + copaiba β-caryophyllene directly modulates CB2 receptors')}
              .
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pharmacokinetic Synergy Nodes: DYNAMICALLY EVALUATED PER ACTIVE RECIPE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isRu
                ? '4 Фармакокинетических узла синергии (Динамический статус рецепта)'
                : isEs
                ? '4 Nodos Farmacocinéticos de Sinergia (Estado Dinámico de la Fórmula)'
                : '4 Pharmacokinetic Synergy Nodes (Dynamic Formula Status)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isRu
                ? 'Статус каждого контура оценивается по точным навескам и процентам текущей партии'
                : isEs
                ? 'El estado de cada circuito se evalúa según los pesos y porcentajes del lote activo'
                : 'Status of each circuit is evaluated against exact batch ingredient weights and percentages'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              {isRu ? 'Активных узлов:' : isEs ? 'Nodos activos:' : 'Active nodes:'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-mono font-bold text-xs">
              {[
                m.isUgtBlocked || hasPepper,
                m.isSglt1Active || m.isLemonTekActive || hasGinger,
                hasCacao,
                hasGuayusa || hasMaca || hasCopaiba,
              ].filter(Boolean).length}{' '}
              / 4
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Node 1: First-Pass Breakdown (P-gp & UGT Block) */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              m.isUgtBlocked
                ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/60'
                : hasPepper
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300 text-sm">
                <Shield className="w-4 h-4 shrink-0" />
                <span>
                  1. {isRu ? 'Блокада первого прохождения (UGT & P-gp)' : isEs ? 'Bloqueo de Primer Paso (UGT & P-gp)' : 'First-Pass Breakdown Blockade'}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                  m.isUgtBlocked
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : hasPepper
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {m.isUgtBlocked
                  ? isRu ? 'АКТИВЕН (100% БЛОК)' : isEs ? 'ACTIVO (100% BLOQUEO)' : 'ACTIVE (100% BLOCK)'
                  : hasPepper
                  ? isRu ? 'ЧАСТИЧНЫЙ' : isEs ? 'PARCIAL' : 'PARTIAL'
                  : isRu ? 'НЕ АКТИВЕН' : isEs ? 'INACTIVO' : 'INACTIVE'}
              </span>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'Черный перец:' : isEs ? 'Pimienta negra:' : 'Black pepper:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {blackPepperItem
                      ? `${blackPepperItem.weightGrams.toFixed(1)} ${unitG} (${blackPepperItem.bakersPercentage.toFixed(2)}% ${isRu ? 'к пасте' : isEs ? 'a la pasta' : 'Baker\'s'} / ${pepperPctInBar.toFixed(2)}% ${isRu ? 'в плитке' : isEs ? 'en barra' : 'in bar'})`
                      : `0 ${unitG} (0%)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'Пиперин в 20г порции:' : isEs ? 'Piperina en 20g:' : 'Piperine in 20g:'}</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {m.piperineMgPer20g} {unitMg} {m.piperineMgPer20g >= 3.8 ? (isRu ? '✓ (Насыщение IC50)' : isEs ? '✓ (Saturación IC50)' : '✓ (IC50 Saturation)') : (isRu ? '(Порог 3.8-4.0 мг)' : isEs ? '(Umbral 3.8-4.0 mg)' : '(Gate 3.8-4.0 mg)')}
                  </span>
                </div>
              </div>

              <p className="text-[11px]">
                {hasPepper ? (
                  m.isUgtBlocked ? (
                    isRu ? (
                      `Пиперин (${m.piperineMgPer20g} мг на 20 г, ${blackPepperItem?.bakersPercentage.toFixed(2)}% к пасте) полностью насыщает активный центр ферментов UGT1A9/10 и помпы P-gp (порог насыщения 3.8–4.0 мг при IC50 = 15.5 мкМ). Ферментный барьер первого прохождения закрыт: биодоступность куркуминоидов возрастает в 20 раз, а эпикатехина и псилоцина — на 45–65%.`
                    ) : isEs ? (
                      `La piperina (${m.piperineMgPer20g} mg en 20 g, ${blackPepperItem?.bakersPercentage.toFixed(2)}% a la pasta) satura plenamente las enzimas UGT1A9/10 y la bomba P-gp (umbral de saturación 3.8-4.0 mg con IC50 = 15.5 µM). La biodisponibilidad de curcuminoides se eleva 20x y la epicatequina +65%.`
                    ) : (
                      `Piperine (${m.piperineMgPer20g} mg in 20g, ${blackPepperItem?.bakersPercentage.toFixed(2)}% Baker's) fully saturates UGT1A9/10 and P-gp efflux pump (saturation threshold 3.8–4.0 mg, IC50 = 15.5 µM). First-pass barrier is closed: curcumin bio-uptake jumps 20x, epicatechin +65%.`
                    )
                  ) : (
                    isRu ? (
                      `Черный перец присутствует (${blackPepperItem?.bakersPercentage.toFixed(2)}%), но доза пиперина (${m.piperineMgPer20g} мг/20г) ниже порога полного насыщения (3.8–4.0 мг). Рекомендуется увеличить долю перца до 0.50–0.70% к пасте.`
                    ) : isEs ? (
                      `Pimienta presente (${blackPepperItem?.bakersPercentage.toFixed(2)}%), pero la piperina (${m.piperineMgPer20g} mg/20g) está bajo el umbral de 3.8 mg. Aumentar a 0.50-0.70% para saturación total.`
                    ) : (
                      `Black pepper present (${blackPepperItem?.bakersPercentage.toFixed(2)}%), but piperine (${m.piperineMgPer20g} mg/20g) is below 3.8 mg saturation gate. Increase to 0.50–0.70% Baker's.`
                    )
                  )
                ) : (
                  isRu ? (
                    'В текущем рецепте отсутствует черный перец. Без пиперина 90–99% куркуминоидов и до 40% мономеров разрушаются при первом прохождении через ЖКТ.'
                  ) : isEs ? (
                    'Pimienta ausente en este lote. Sin piperina hasta el 99% de curcuminoides se eliminan en el primer paso.'
                  ) : (
                    'No black pepper in active formula. Without piperine, up to 99% of curcuminoids are cleared during first pass.'
                  )
                )}
              </p>
            </div>
          </div>

          {/* Node 2: SGLT1 active transport & nausea control + Aji Chili */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              m.isSglt1Active || m.isLemonTekActive || hasAjiChili
                ? 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300 text-sm">
                <Zap className="w-4 h-4 shrink-0" />
                <span>
                  2. {isRu ? 'Ускорение SGLT1 и купирование тошноты (TRPV1)' : isEs ? 'Aceleración SGLT1 y Anti-Náuseas (TRPV1)' : 'SGLT1 Uptake & Anti-Nausea Circuit (TRPV1)'}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                  m.isSglt1Active && m.isLemonTekActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : m.isSglt1Active || m.isLemonTekActive || hasGinger || hasAjiChili
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {m.isSglt1Active && m.isLemonTekActive
                  ? isRu ? 'АКТИВЕН' : isEs ? 'ACTIVO' : 'ACTIVE'
                  : m.isSglt1Active || m.isLemonTekActive || hasGinger || hasAjiChili
                  ? isRu ? 'ЧАСТИЧНЫЙ' : isEs ? 'PARCIAL' : 'PARTIAL'
                  : isRu ? 'НЕ АКТИВЕН' : isEs ? 'INACTIVO' : 'INACTIVE'}
              </span>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'SGLT1 (Панела ≥20% + Соль ≥0.4%):' : isEs ? 'SGLT1 (Panela ≥20% + Sal ≥0.4%):' : 'SGLT1 (Panela ≥20% + Salt ≥0.4%):'}</span>
                  <span className={`font-bold ${m.isSglt1Active ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {m.isSglt1Active ? (isRu ? 'Активен (2Na+/глюкоза)' : isEs ? 'Activo (2Na+/glucosa)' : 'Active (2Na+/glucose)') : (isRu ? 'Ниже порога' : isEs ? 'Bajo umbral' : 'Below gate')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'Lemon-Tek pH 3.8 (Гибискус):' : isEs ? 'Lemon-Tek pH 3.8 (Hibisco):' : 'Lemon-Tek pH 3.8 (Hibiscus):'}</span>
                  <span className={`font-bold ${m.isLemonTekActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {hasHibiscus ? `${hibiscusItem?.bakersPercentage.toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? '5-HT3 блок тошноты (Имбирь):' : isEs ? 'Bloqueo 5-HT3 náuseas (Jengibre):' : '5-HT3 Anti-Nausea (Ginger):'}</span>
                  <span className={`font-bold ${hasGinger ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hasGinger ? `${gingerItem?.bakersPercentage.toFixed(2)}% (${isRu ? '6-шогаол' : '6-shogaol'})` : (isRu ? 'Не добавлен' : isEs ? 'No añadido' : 'Not added')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'TRPV1 микроциркуляция (Острый перец):' : isEs ? 'Microcirculación TRPV1 (Ají / Chile):' : 'TRPV1 Microcirculation (Hot Pepper):'}</span>
                  <span className={`font-bold ${hasAjiChili ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                    {hasAjiChili
                      ? `${ajiChiliItem?.bakersPercentage.toFixed(2)}% (+${Math.round((m.trpv1BloodFlowMultiplier - 1) * 100)}% CGRP, ${(m.capsaicinMgPer20g * 1000).toFixed(0)} µg)`
                      : isRu ? 'Не добавлен' : isEs ? 'No añadido' : 'Not added'}
                  </span>
                </div>
              </div>

              <p className="text-[11px]">
                {isRu ? (
                  'Органические кислоты гибискуса запускают мягкий предгидролиз в матрице (In-Matrix Lemon-Tek, pH 3.8–4.2). Сахароза и ионы Na+ активируют котранспортер SGLT1, 6-шогаол имбиря блокирует 5-HT3 рецепторы тошноты, а капсаицин ахи чили ускоряет локальный кровоток слизистой.'
                ) : isEs ? (
                  'Ácidos orgánicos del hibisco inducen In-Matrix Lemon-Tek (pH 3.8–4.2). Sacarosa e iones Na+ activan cotransportador SGLT1, 6-shogaol de jengibre bloquea receptores 5-HT3 de náusea y el ají chilis acelera el flujo mucoso.'
                ) : (
                  'Hibiscus organic acids drive In-Matrix Lemon-Tek (pH 3.8–4.2). Sucrose and Na+ ions activate SGLT1 cotransport, ginger 6-shogaol blocks 5-HT3 nausea receptors, and aji chili capsaicin speeds mucosal blood flow.'
                )}
              </p>
            </div>
          </div>

          {/* Node 3: Vasodilation & Endothelial eNOS */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              hasCacao
                ? 'bg-teal-50/60 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/60'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-300 text-sm">
                <Heart className="w-4 h-4 shrink-0" />
                <span>
                  3. {isRu ? 'Снятие вазоконстрикции и мышечного тремора' : isEs ? 'Alivio de Vasoconstricción y Espasmo' : 'Vasodilation & Anti-Tremor eNOS'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {isRu ? 'АКТИВЕН' : isEs ? 'ACTIVO' : 'ACTIVE'}
              </span>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'Какао в плитке (сухой остаток + масло):' : isEs ? 'Cacao total en barra:' : 'Total Cacao in Bar:'}</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300">{formulation.totalCacaoPercentage.toFixed(1)}%</span>
                </div>
                {formulation.freeButterPercentage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isRu ? 'Свободное масло какао:' : isEs ? 'Manteca de cacao añadida:' : 'Added Cacao Butter:'}</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{formulation.freeButterPercentage.toFixed(1)}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">(-)-{isRu ? 'Эпикатехин DP1 био-доза:' : isEs ? 'Epicatequina DP1 dosis bioactiva:' : 'Epicatechin DP1 bio-dose:'}</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{m.epicatechinEffectiveBioDoseMg} {unitMg} / 20 {unitG}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'Теобромин Nacional:' : isEs ? 'Teobromina Nacional:' : 'Theobromine Nacional:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{m.theobromineMgPer20g} {unitMg} / 20 {unitG}</span>
                </div>
              </div>

              <p className="text-[11px]">
                {isRu ? (
                  'Мономерный эпикатехин Cacao Zamora стимулирует эндотелиальную eNOS, вызывая мощный выброс оксида азота (NO). Системная микроциркуляция расширяется, полностью устраняя озноб, холод в конечностях и сжатие челюстных мышц (бруксизм).'
                ) : isEs ? (
                  'La epicatequina monomérica estimula la eNOS endotelial, liberando óxido nítrico (NO). La microcirculación sistémica se expande, eliminando escalofríos y bruxismo mandibular.'
                ) : (
                  'Monomeric epicatechin stimulates endothelial nitric oxide synthase (eNOS), yielding vascular nitric oxide release. Microcirculation dilates, eliminating chills and jaw clenching.'
                )}
              </p>
            </div>
          </div>

          {/* Node 4: Sympathetic Shock Shield (Alpha-waves & Endocannabinoids) */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              hasGuayusa || hasMaca || hasCopaiba
                ? 'bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800/60'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 font-bold text-cyan-700 dark:text-cyan-300 text-sm">
                <Brain className="w-4 h-4 shrink-0" />
                <span>
                  4. {isRu ? 'Защита от симпатического шока (Альфа-ритм & CB2)' : isEs ? 'Escudo Simpático (Ondas Alfa & CB2)' : 'Sympathetic Shock Shield (Alpha & CB2)'}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                  hasGuayusa && hasMaca
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : hasGuayusa || hasMaca || hasCopaiba
                    ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {hasGuayusa && hasMaca
                  ? isRu ? 'АКТИВЕН' : isEs ? 'ACTIVO' : 'ACTIVE'
                  : hasGuayusa || hasMaca || hasCopaiba
                  ? isRu ? 'ЧАСТИЧНЫЙ' : isEs ? 'PARCIAL' : 'PARTIAL'
                  : isRu ? 'НЕ АКТИВЕН' : isEs ? 'INACTIVO' : 'INACTIVE'}
              </span>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'Гуаюса (L-теанин / Альфа 8-12 Гц):' : isEs ? 'Guayusa (L-teanina / Alfa 8-12 Hz):' : 'Guayusa (L-Theanine / Alpha 8-12 Hz):'}</span>
                  <span className={`font-bold ${hasGuayusa ? 'text-cyan-600' : 'text-slate-400'}`}>
                    {hasGuayusa ? `${guayusaItem?.bakersPercentage.toFixed(1)}%` : (isRu ? 'Не добавлена' : isEs ? 'No añadida' : 'Not added')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'Мака (Макамиды / FAAH блок):' : isEs ? 'Maca (Macamidas / Bloqueo FAAH):' : 'Maca (Macamides / FAAH Block):'}</span>
                  <span className={`font-bold ${hasMaca ? 'text-teal-600' : 'text-slate-400'}`}>
                    {hasMaca ? `${macaItem?.bakersPercentage.toFixed(1)}%` : (isRu ? 'Не добавлена' : isEs ? 'No añadida' : 'Not added')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isRu ? 'Копайба (β-кариофиллен / CB2):' : isEs ? 'Copaiba (β-cariofileno / CB2):' : 'Copaiba (β-Caryophyllene / CB2):'}</span>
                  <span className={`font-bold ${hasCopaiba ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {hasCopaiba ? `${copaibaItem?.bakersPercentage.toFixed(2)}%` : (isRu ? 'Не добавлена' : isEs ? 'No añadida' : 'Not added')}
                  </span>
                </div>
              </div>

              <p className="text-[11px]">
                {isRu ? (
                  'L-теанин гуаюсы модулирует когерентность альфа-волн коры (8–12 Гц), подавляя вегетативную панику при входе. Макамиды маки блокируют FAAH для сохранения анандамида, а бета-кариофиллен копайбы снимает соматическое напряжение через пути CB2.'
                ) : isEs ? (
                  'L-teanina de guayusa modula ondas alfa (8–12 Hz), frenando la ansiedad. Macamidas de maca bloquean FAAH para preservar anandamida, y el β-cariofileno relaja el sistema somático vía CB2.'
                ) : (
                  'Guayusa L-theanine fosters 8–12 Hz cortical alpha waves to buffer onset anxiety. Macamides inhibit FAAH to sustain anandamide, and copaiba beta-caryophyllene eases somatic tension via CB2.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Somatosensory Chronodynamics Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <span>{t.chronodynamicsTitle}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-xs font-bold text-purple-600 block mb-1">
              00 – 20 {isRu ? 'МИН' : 'MIN'}
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              {t.phase1Title ? t.phase1Title.split(':')[1] || t.phase1Title : 'SGLT1 Active Uptake'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.phase1Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-xs font-bold text-indigo-600 block mb-1">
              20 – 40 {isRu ? 'МИН' : 'MIN'}
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              {t.phase2Title ? t.phase2Title.split(':')[1] || t.phase2Title : 'Seamless Transition'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.phase2Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-xs font-bold text-teal-600 block mb-1">
              40 – 180 {isRu ? 'МИН' : 'MIN'}
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              {t.phase3Title ? t.phase3Title.split(':')[1] || t.phase3Title : 'Therapeutic Plateau'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.phase3Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-xs font-bold text-cyan-600 block mb-1">
              180 – 240 {isRu ? 'МИН' : 'MIN'}
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              {t.phase4Title ? t.phase4Title.split(':')[1] || t.phase4Title : 'Clean Integration'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.phase4Desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
