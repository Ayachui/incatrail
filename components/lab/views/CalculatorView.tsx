"use client";
import React, { useState } from 'react';
import {
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  RotateCcw,
  Scale,
  Sparkles,
  Info,
  DollarSign,
  Droplets,
  Layers,
} from 'lucide-react';
import { Ingredient, Language, PercentageMode, PotencyTarget, Recipe, RecipeItem } from '@/lib/lab/types';
import { FormulationCalculations } from '@/lib/lab/utils/bioSynergyEngine';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface CalculatorViewProps {
  recipe: Recipe;
  onRecipeChange: (newRecipe: Recipe) => void;
  formulation: FormulationCalculations;
  allRecipes: Recipe[];
  onSelectRecipe: (id: string) => void;
  ingredients: Ingredient[];
  language: Language;
  percentageMode: PercentageMode;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  recipe,
  onRecipeChange,
  formulation,
  allRecipes,
  onSelectRecipe,
  ingredients,
  language,
  percentageMode,
}) => {
  const t = TRANSLATIONS[language];
  const isRu = language === 'ru';
  const isEs = language === 'es';
  const unitMg = isRu ? 'мг' : 'mg';
  const unitG = isRu ? 'г' : 'g';
  const unitKg = isRu ? 'кг' : 'kg';

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNewIngredientId, setSelectedNewIngredientId] = useState<string>(ingredients[0]?.id || '');
  const [newBakersPercent, setNewBakersPercent] = useState<number>(1.0);

  // Potency scaling for mushrooms
  const hasMushrooms = recipe.items.some((item) => item.ingredientId === 'mushrooms');

  const handlePotencyChange = (target: PotencyTarget) => {
    let mushroomBakers = 3.57; // default 500mg/20g
    let pepperBakers = 0.71;
    let hibiscusBakers = 1.71;

    if (target === 'microdose') {
      mushroomBakers = 1.07; // ~150mg
      pepperBakers = 0.50;
      hibiscusBakers = 1.20;
    } else if (target === 'creative') {
      mushroomBakers = 2.14; // ~300mg
      pepperBakers = 0.60;
      hibiscusBakers = 1.45;
    } else if (target === 'therapeutic') {
      mushroomBakers = 3.57; // ~500mg
      pepperBakers = 0.71;
      hibiscusBakers = 1.71;
    } else if (target === 'ceremonial') {
      mushroomBakers = 7.14; // ~1000mg
      pepperBakers = 0.95;
      hibiscusBakers = 2.40;
    }

    const updatedItems = recipe.items.map((item) => {
      if (item.ingredientId === 'mushrooms') return { ...item, bakersPercentage: mushroomBakers };
      if (item.ingredientId === 'black_pepper') return { ...item, bakersPercentage: pepperBakers };
      if (item.ingredientId === 'hibiscus') return { ...item, bakersPercentage: hibiscusBakers };
      return item;
    });

    onRecipeChange({
      ...recipe,
      potencyTarget: target,
      items: updatedItems,
    });
  };

  const handlePasteWeightChange = (weight: number) => {
    onRecipeChange({
      ...recipe,
      basePasteWeightGrams: Math.max(10, weight),
    });
  };

  const handleItemPercentChange = (ingredientId: string, percent: number) => {
    const updated = recipe.items.map((item) => {
      if (item.ingredientId === ingredientId) {
        return { ...item, bakersPercentage: Math.max(0, percent) };
      }
      return item;
    });
    onRecipeChange({
      ...recipe,
      items: updated,
    });
  };

  const handleRemoveItem = (ingredientId: string) => {
    if (ingredientId === 'cacao_paste') return; // Cannot remove base
    onRecipeChange({
      ...recipe,
      items: recipe.items.filter((i) => i.ingredientId !== ingredientId),
    });
  };

  const handleAddIngredient = () => {
    if (!selectedNewIngredientId) return;
    if (recipe.items.some((i) => i.ingredientId === selectedNewIngredientId)) {
      setShowAddModal(false);
      return;
    }

    const newItem: RecipeItem = {
      ingredientId: selectedNewIngredientId,
      bakersPercentage: newBakersPercent,
      notes: 'Добавлен технологом',
    };

    onRecipeChange({
      ...recipe,
      items: [...recipe.items, newItem],
    });
    setShowAddModal(false);
  };

  const availableToAdd = ingredients.filter(
    (ing) => !recipe.items.some((i) => i.ingredientId === ing.id)
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Controls: Preset Selector & Preset Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              {t.presetSelector}
            </label>
            <div className="relative">
              <select
                value={recipe.id}
                onChange={(e) => onSelectRecipe(e.target.value)}
                className="w-full md:w-96 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {allRecipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {language === 'ru' ? r.nameRu : language === 'es' ? (r.nameEs || r.nameEn) : r.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Paste Weight Presets */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              {t.basePasteWeight}
            </span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={recipe.basePasteWeightGrams}
                  onChange={(e) => handlePasteWeightChange(parseFloat(e.target.value) || 1000)}
                  className="w-32 h-10 px-3 font-mono text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">{unitG}</span>
              </div>
              <div className="flex items-center gap-1">
                {[200, 500, 1000, 5000].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handlePasteWeightChange(w)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                      recipe.basePasteWeightGrams === w
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {w >= 1000 ? `${w / 1000}${unitKg}` : `${w}${unitG}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Description Text */}
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
          {language === 'ru' ? recipe.descriptionRu : language === 'es' ? (recipe.descriptionEs || recipe.descriptionEn) : recipe.descriptionEn}
        </p>

        {/* Potency Targeter Slider for Mushroom Matrices */}
        {hasMushrooms && (
          <div className="mt-4 p-3.5 bg-purple-50/70 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                {t.potencyTitle}
              </span>
              <span className="text-xs font-mono text-purple-700 dark:text-purple-400 font-semibold">
                {formulation.metrics.tryptamineDoseMgPer20g} {unitMg} {isRu ? 'псилоцина / порция 20 г' : isEs ? 'psilocina / porción 20 g' : 'psilocin / 20g dose'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'microdose', label: t.potencyMicro },
                { id: 'creative', label: t.potencyCreative },
                { id: 'therapeutic', label: t.potencyTherapeutic },
                { id: 'ceremonial', label: t.potencyCeremonial },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handlePotencyChange(lvl.id as PotencyTarget)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium text-center transition-all ${
                    recipe.potencyTarget === lvl.id
                      ? 'bg-purple-700 text-white shadow font-semibold'
                      : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-white'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* KPI Metric Strips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {language === 'ru' ? 'База какао (Base)' : language === 'es' ? 'Base Pura de Cacao' : 'Pure Cacao Base'}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              {formulation.pureCacaoBasePercentage.toFixed(1)}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {language === 'ru'
              ? `В готовой плитке: ${formulation.totalCacaoPercentage.toFixed(1)}%`
              : language === 'es'
              ? `En barra final: ${formulation.totalCacaoPercentage.toFixed(1)}%`
              : `In finished bar: ${formulation.totalCacaoPercentage.toFixed(1)}%`}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t.freeButter}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {formulation.freeButterPercentage}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {formulation.freeButterPercentage > 8.0
              ? isRu ? 'Липидный порог CCK' : isEs ? 'Freno lipídico CCK' : 'CCK Lipid Brake'
              : isRu ? 'Микро-клин / норма' : isEs ? 'Micro-cuña / óptimo' : 'Micro-wedge optimal'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t.totalBatchWeight}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {formulation.totalWeightGrams >= 1000
                ? `${(formulation.totalWeightGrams / 1000).toFixed(2)} ${unitKg}`
                : `${formulation.totalWeightGrams} ${unitG}`}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Σ Baker&apos;s %: {formulation.totalBakersPercentage}%
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {isRu ? 'Себестоимость партии' : isEs ? 'Costo del Lote' : 'Batch Raw Cost'}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              ${formulation.items.reduce((acc: number, i) => acc + i.costUSD, 0).toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {isRu ? 'Сырье EXW Zamora' : isEs ? 'Materias primas EXW' : 'Raw materials EXW'}
          </span>
        </div>
      </div>

      {/* Sugar Seizing Critical Warning Banner */}
      {formulation.metrics.isSugarSeizingRisk && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="font-semibold block mb-0.5">
              {isRu
                ? 'Внимание: Риск Sugar Seizing (заклинивания меланжера)!'
                : isEs
                ? '¡Atención: Riesgo de Sugar Seizing (agarrotamiento del melanger)!'
                : 'Warning: Risk of Sugar Seizing (melanger jamming)!'}
            </strong>
            {t.sugarSeizingAlert}
          </div>
        </div>
      )}

      {/* Quick Active Synergy Badges Ribbon */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
          {t.activeBadges}
        </span>

        {formulation.metrics.isSglt1Active && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            SGLT1 Active (+28% speed)
          </span>
        )}

        {formulation.metrics.isUgtBlocked && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            UGT & P-gp Block (20x Curcumin / 1.65x DP1)
          </span>
        )}

        {formulation.metrics.isLemonTekActive && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            In-Matrix Lemon-Tek & Acid Buffer
          </span>
        )}

        {formulation.metrics.isEndocannabinoidShieldActive && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            FAAH + CB2 Shield (Macamides)
          </span>
        )}

        {formulation.metrics.isCckLipidBrake && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            CCK Lipid Brake Alert
          </span>
        )}

        {formulation.metrics.isCaseinBlock && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Info className="w-3.5 h-3.5" />
            Casein Polyphenol Trap
          </span>
        )}
      </div>

      {/* Main Interactive Ingredients Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 md:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.ingredientsTable}
            </h3>
            <p className="text-xs text-slate-500">
              {isRu
                ? 'База расчетов: 100% Паста = 100.00% • Живые граммы и %'
                : isEs
                ? 'Base de cálculo: 100% Pasta = 100.00% • Gramos netos y %'
                : 'Calculation Base: 100% Paste = 100.00% • Net Grams & %'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addIngredient}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-3 px-4 md:px-6">{t.ingredientCol}</th>
                <th className={`py-3 px-3 text-right ${percentageMode === 'bakers' ? 'bg-purple-50/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300' : ''}`}>
                  {t.bakersCol}
                </th>
                <th className={`py-3 px-3 text-right ${percentageMode === 'standard' ? 'bg-purple-50/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300' : ''}`}>
                  {t.standardCol}
                </th>
                <th className="py-3 px-3 text-right">{t.weightCol}</th>
                <th className="py-3 px-3 text-right">{t.costCol}</th>
                <th className="py-3 px-4 hidden md:table-cell">{t.notesCol}</th>
                <th className="py-3 px-3 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {formulation.items.map((item) => {
                const isBase = item.ingredient.id === 'cacao_paste';
                const ingName = isRu
                  ? item.ingredient.nameRu
                  : isEs
                  ? item.ingredient.nameEs || item.ingredient.nameEn
                  : item.ingredient.nameEn;

                return (
                  <tr
                    key={item.ingredient.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isBase ? 'bg-purple-50/20 dark:bg-purple-950/10 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 md:px-6">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {ingName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ${item.ingredient.costPerKgUSD.toFixed(1)}/{unitKg} • {item.ingredient.category}
                      </div>
                    </td>

                    {/* Baker's % Input Column */}
                    <td className={`py-3 px-3 text-right font-mono ${percentageMode === 'bakers' ? 'bg-purple-50/30 dark:bg-purple-950/20 font-bold' : ''}`}>
                      {isBase ? (
                        <span className="text-purple-600 dark:text-purple-400 font-bold">100.00%</span>
                      ) : (
                        <div className="inline-flex items-center gap-1 justify-end">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="500"
                            value={item.bakersPercentage}
                            onChange={(e) =>
                              handleItemPercentChange(item.ingredient.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-20 text-right px-2 py-1 font-mono text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                          <span className="text-slate-400 text-[10px]">%</span>
                        </div>
                      )}
                    </td>

                    {/* Standard in-bar % */}
                    <td className={`py-3 px-3 text-right font-mono tabular-nums ${percentageMode === 'standard' ? 'bg-purple-50/30 dark:bg-purple-950/20 font-bold text-purple-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.standardPercentage.toFixed(2)}%
                    </td>

                    {/* Weight in grams */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {item.weightGrams >= 1000
                        ? `${(item.weightGrams / 1000).toFixed(3)} ${unitKg}`
                        : `${item.weightGrams.toFixed(1)} ${unitG}`}
                    </td>

                    {/* Cost USD */}
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      ${item.costUSD.toFixed(2)}
                    </td>

                    {/* Notes */}
                    <td className="py-3 px-4 hidden md:table-cell text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.notes || '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      {!isBase && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.ingredient.id)}
                          title={isRu ? 'Удалить' : isEs ? 'Eliminar' : 'Remove'}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 dark:bg-slate-950 font-mono font-bold text-xs text-slate-900 dark:text-white border-t-2 border-slate-200 dark:border-slate-800">
                <td className="py-3 px-4 md:px-6">{isRu ? 'ИТОГО' : 'TOTAL'}</td>
                <td className="py-3 px-3 text-right text-purple-600 dark:text-purple-400">
                  {formulation.totalBakersPercentage}%
                </td>
                <td className="py-3 px-3 text-right">100.00%</td>
                <td className="py-3 px-3 text-right">
                  {formulation.totalWeightGrams >= 1000
                    ? `${(formulation.totalWeightGrams / 1000).toFixed(2)} ${unitKg}`
                    : `${formulation.totalWeightGrams.toFixed(1)} ${unitG}`}
                </td>
                <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400">
                  ${formulation.items.reduce((acc: number, i) => acc + i.costUSD, 0).toFixed(2)}
                </td>
                <td className="py-3 px-4 hidden md:table-cell"></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {t.addIngredient}
            </h3>

            {availableToAdd.length === 0 ? (
              <p className="text-xs text-slate-500">
                {isRu
                  ? 'Все ингредиенты из каталога уже в рецепте.'
                  : isEs
                  ? 'Todos los ingredientes del catálogo ya están en la receta.'
                  : 'All catalog ingredients are already included in this recipe.'}
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    {isRu
                      ? 'Выберите ингредиент:'
                      : isEs
                      ? 'Seleccione ingrediente:'
                      : 'Select ingredient:'}
                  </label>
                  <select
                    value={selectedNewIngredientId}
                    onChange={(e) => setSelectedNewIngredientId(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {availableToAdd.map((ing) => {
                      const name = isRu
                        ? ing.nameRu
                        : isEs
                        ? ing.nameEs || ing.nameEn
                        : ing.nameEn;
                      return (
                        <option key={ing.id} value={ing.id}>
                          {name} (${ing.costPerKgUSD}/{unitKg})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    {isRu
                      ? 'Пекарский процент (% к 100% пасте):'
                      : isEs
                      ? 'Porcentaje de panadero (% sobre pasta 100%):'
                      : "Baker's percentage (% to 100% paste):"}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={newBakersPercent}
                    onChange={(e) => setNewBakersPercent(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {isRu ? 'Отмена' : isEs ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-4 py-2 text-xs font-medium rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm"
                  >
                    {isRu ? 'Добавить' : isEs ? 'Añadir' : 'Add'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
