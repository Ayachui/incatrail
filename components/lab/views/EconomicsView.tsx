"use client";
import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Package,
  Layers,
  Scale,
  Building2,
  Store,
  Sparkles,
  Box,
  Sliders,
} from 'lucide-react';
import { Language, Recipe } from '@/lib/lab/types';
import { FormulationCalculations } from '@/lib/lab/utils/bioSynergyEngine';
import {
  calculateUnitEconomics,
  DEFAULT_ECONOMICS_SETTINGS,
  EconomicsInputSettings,
  PackagingType,
} from '@/lib/lab/utils/economicsEngine';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface EconomicsViewProps {
  recipe: Recipe;
  formulation: FormulationCalculations;
  language: Language;
  settings: EconomicsInputSettings;
  onSettingsChange: (settings: EconomicsInputSettings) => void;
}

export const EconomicsView: React.FC<EconomicsViewProps> = ({
  recipe,
  formulation,
  language,
  settings,
  onSettingsChange,
}) => {
  const t = TRANSLATIONS[language];
  const [customUnitInput, setCustomUnitInput] = useState<string>(settings.targetUnitGrams.toString());

  const econ = calculateUnitEconomics(formulation, settings);

  const handleFormatChange = (grams: number, pkg: PackagingType) => {
    onSettingsChange({
      ...settings,
      targetUnitGrams: grams,
      packagingType: pkg,
    });
    setCustomUnitInput(grams.toString());
  };

  const isRu = language === 'ru';
  const isEs = language === 'es';
  const unitKg = isRu ? 'кг' : 'kg';
  const unitG = isRu ? 'г' : 'g';
  const unitPcs = isRu ? 'шт' : isEs ? 'uds' : 'pcs';

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.economicsTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.economicsSubtitle} •{' '}
              {isRu
                ? 'Гибкая калибровка формата (плитки или блоки по 1 кг)'
                : isEs
                ? 'Calibración flexible de formato (barras o bloques de 1 kg)'
                : 'Flexible format calibration (bars or 1kg blocks)'}
            </p>
          </div>
        </div>
      </div>

      {/* Target Format & Packaging Selection */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-2">
            <Box className="w-4 h-4 text-purple-600" />
            <span>
              1.{' '}
              {isRu
                ? 'Целевой формат выпуска партии и тип фасовки'
                : isEs
                ? 'Formato de producción del lote y empaque'
                : 'Batch target format & packaging type'}
            </span>
          </h3>
          <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
            {isRu
              ? `Выпуск: ${econ.unitsProduced} шт по ${settings.targetUnitGrams}г`
              : isEs
              ? `Producción: ${econ.unitsProduced} uds de ${settings.targetUnitGrams}g`
              : `Yield: ${econ.unitsProduced} units of ${settings.targetUnitGrams}g`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            {
              label: isRu ? 'Порция 20г' : isEs ? 'Porción 20g' : 'Serving 20g',
              grams: 20,
              pkg: 'luxury_bar' as const,
            },
            {
              label: isRu ? 'Плитка 50г' : isEs ? 'Barra 50g' : 'Bar 50g',
              grams: 50,
              pkg: 'luxury_bar' as const,
            },
            {
              label: isRu ? 'Плитка 70г' : isEs ? 'Barra 70g' : 'Bar 70g',
              grams: 70,
              pkg: 'luxury_bar' as const,
            },
            {
              label: isRu ? 'Плитка 100г' : isEs ? 'Barra 100g' : 'Bar 100g',
              grams: 100,
              pkg: 'luxury_bar' as const,
            },
            {
              label: isRu ? 'Блок 200г' : isEs ? 'Bloque 200g' : 'Block 200g',
              grams: 200,
              pkg: 'block_pouch' as const,
            },
            {
              label: isRu ? 'Блок 500г' : isEs ? 'Bloque 500g' : 'Block 500g',
              grams: 500,
              pkg: 'block_pouch' as const,
            },
            {
              label: isRu ? 'Блок 1000г (1 кг)' : isEs ? 'Bloque 1000g (1 kg)' : 'Block 1000g (1 kg)',
              grams: 1000,
              pkg: 'bulk_zero' as const,
            },
          ].map((fmt) => (
            <button
              key={fmt.grams}
              type="button"
              onClick={() => handleFormatChange(fmt.grams, fmt.pkg)}
              className={`p-2.5 rounded-xl text-xs font-medium text-center border transition-all ${
                settings.targetUnitGrams === fmt.grams
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
              }`}
            >
              <div className="font-mono text-sm">
                {fmt.grams >= 1000 ? `${fmt.grams / 1000} ${unitKg}` : `${fmt.grams} ${unitG}`}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">{fmt.label}</div>
            </button>
          ))}
        </div>

        {/* Custom Weight and Packaging Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
              {isRu
                ? 'Свой вес единицы (г):'
                : isEs
                ? 'Peso personalizado por unidad (g):'
                : 'Custom unit weight (g):'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="5000"
                value={customUnitInput}
                onChange={(e) => {
                  setCustomUnitInput(e.target.value);
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    onSettingsChange({ ...settings, targetUnitGrams: val });
                  }
                }}
                className="w-full text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2 px-3"
              />
              <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                {unitG} / {unitPcs}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
              {isRu ? 'Тип упаковки:' : isEs ? 'Tipo de empaque:' : 'Packaging type:'}
            </label>
            <select
              value={settings.packagingType}
              onChange={(e) =>
                onSettingsChange({ ...settings, packagingType: e.target.value as PackagingType })
              }
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2 px-3"
            >
              <option value="luxury_bar">
                {isRu
                  ? 'Премиум плитка (фольга + конверт $0.85)'
                  : isEs
                  ? 'Barra de lujo (aluminio + estuche $0.85)'
                  : 'Luxury bar (foil + premium box $0.85)'}
              </option>
              <option value="block_pouch">
                {isRu
                  ? 'Вакуумный пакет блока ($0.35)'
                  : isEs
                  ? 'Bolsa al vacío de bloque ($0.35)'
                  : 'Vacuum pouch block ($0.35)'}
              </option>
              <option value="bulk_zero">
                {isRu
                  ? 'Без упаковки (сырье / bulk / $0.00)'
                  : isEs
                  ? 'Sin empaque (a granel / bulk / $0.00)'
                  : 'Bulk raw / no packaging ($0.00)'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
              {isRu
                ? 'Стоимость упаковки 1 шт ($):'
                : isEs
                ? 'Costo de empaque por unidad ($):'
                : 'Packaging cost per unit ($):'}
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              value={econ.packagingCostPerUnitUSD}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  customPackagingCostPerUnitUSD: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2 px-3"
            />
          </div>
        </div>
      </div>

      {/* Control Sliders & Operational Parameters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          <span>
            2.{' '}
            {isRu
              ? 'Производственные потери (до 30%) и накладные расходы'
              : isEs
              ? 'Mermas del proceso (hasta 30%) y costos indirectos'
              : 'Process dead loss (up to 30%) & operating overhead'}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dead Loss Slider (Expanded to 30%) */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isRu
                  ? 'Технологические потери на камнях (Dead Loss %):'
                  : isEs
                  ? 'Pérdidas tecnológicas en piedras (Dead Loss %):'
                  : 'Stone dead loss (% of total mass):'}
              </label>
              <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                {settings.deadLossPercent}% ({econ.deadLossG} {unitG})
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="30.0"
              step="0.5"
              value={settings.deadLossPercent}
              onChange={(e) =>
                onSettingsChange({ ...settings, deadLossPercent: parseFloat(e.target.value) || 0 })
              }
              className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0% ({isRu ? 'идеально' : isEs ? 'ideal' : 'ideal'})</span>
              <span>15% ({isRu ? 'густая масса' : isEs ? 'masa densa' : 'thick batch'})</span>
              <span>30% ({isRu ? 'макс. смыв' : isEs ? 'lavado máx' : 'max rinse'})</span>
            </div>
          </div>

          {/* Labor & Workshop Overhead per kg */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.laborCostPerKg}
              </label>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                ${settings.laborAndOverheadPerKgUSD.toFixed(2)} / {unitKg}
              </span>
            </div>
            <input
              type="number"
              step="0.25"
              min="0"
              value={settings.laborAndOverheadPerKgUSD}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  laborAndOverheadPerKgUSD: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2 px-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              {isRu
                ? 'Энергия, амортизация меланжера, оплата мастера'
                : isEs
                ? 'Energía, amortización del molino melanger, mano de obra'
                : 'Energy, melanger depreciation, master chocolatier labor'}
            </span>
          </div>
        </div>
      </div>

      {/* Yield & Full Cost Transparency Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {isRu ? 'Чистый выход (Net)' : isEs ? 'Rendimiento neto (Net)' : 'Net Yield'}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {econ.netYieldG >= 1000 ? `${econ.netYieldKg} ${unitKg}` : `${econ.netYieldG} ${unitG}`}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {isRu ? 'Брутто' : isEs ? 'Bruto' : 'Gross'}: {econ.batchGrossWeightKg} {unitKg} (
            {isRu ? 'Потери' : isEs ? 'Mermas' : 'Loss'}: {econ.deadLossPercent}%)
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t.totalBatchCost}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              ${econ.totalBatchCostUSD}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {isRu ? 'Сырье' : isEs ? 'Materia prima' : 'Raw'}: ${econ.rawMaterialsCostUSD} •{' '}
            {isRu ? 'Упаковка' : isEs ? 'Empaque' : 'Packaging'}: ${econ.totalPackagingCostUSD}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {t.costPerKg}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              ${econ.costPerKgUSD}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {isRu
              ? 'За 1 кг готовой продукции'
              : isEs
              ? 'Por 1 kg de producto terminado'
              : 'Per 1 kg of finished product'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border-2 border-purple-500/50 dark:border-purple-600/50 bg-purple-50/20 dark:bg-purple-950/20">
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
            {isRu
              ? `Себестоимость 1 шт (${settings.targetUnitGrams}г)`
              : isEs
              ? `Costo unitario (${settings.targetUnitGrams}g)`
              : `Unit cost (${settings.targetUnitGrams}g)`}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-mono font-black text-purple-700 dark:text-purple-300 tabular-nums">
              ${econ.costPerUnitUSD}
            </span>
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">
            {isRu
              ? 'Включая сырье, труд и упаковку'
              : isEs
              ? 'Incluye materia prima, mano de obra y empaque'
              : 'Including raw materials, labor, and packaging'}
          </span>
        </div>
      </div>

      {/* Commercial Pricing & Margin Calculators with Percentages (B2B vs B2C) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wholesale B2B Channel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
              <Building2 className="w-5 h-5" />
              <span>
                {isRu
                  ? 'Оптовый канал (B2B Wholesale / To\'ak / Сети)'
                  : isEs
                  ? 'Canal Mayorista (B2B Wholesale / Tiendas Gourmet)'
                  : 'Wholesale Channel (B2B / Boutique Retailers)'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
              {isRu ? 'Наценка:' : isEs ? 'Margen comercial:' : 'Markup:'} +{econ.wholesaleMarkupPercent}%
            </span>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {isRu
                  ? 'Маржинальность оптовая (Margin %):'
                  : isEs
                  ? 'Margen bruto mayorista (Margin %):'
                  : 'Wholesale Gross Margin (%):'}
              </span>
              <span className="font-mono text-sm font-bold text-indigo-600">
                {settings.wholesaleMarginPercent}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="85"
              step="1"
              value={settings.wholesaleMarginPercent}
              onChange={(e) =>
                onSettingsChange({ ...settings, wholesaleMarginPercent: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-600 dark:text-slate-400">
                {isRu
                  ? `Оптовая цена за 1 шт (${settings.targetUnitGrams}г):`
                  : isEs
                  ? `Precio mayorista por 1 ud (${settings.targetUnitGrams}g):`
                  : `Wholesale price per unit (${settings.targetUnitGrams}g):`}
              </span>
              <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                ${econ.wholesalePricePerUnitUSD}
              </span>
            </div>
            <div className="flex justify-between items-baseline text-slate-600 dark:text-slate-400">
              <span>
                {isRu
                  ? `Выручка с партии (${econ.unitsProduced} шт / ${econ.netYieldG}г):`
                  : isEs
                  ? `Ingreso bruto del lote (${econ.unitsProduced} uds / ${econ.netYieldG}g):`
                  : `Batch revenue (${econ.unitsProduced} units / ${econ.netYieldG}g):`}
              </span>
              <span className="font-bold">${econ.wholesaleBatchRevenueUSD}</span>
            </div>
            <div className="flex justify-between items-baseline text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-indigo-200/50">
              <span>
                {isRu
                  ? 'Чистая прибыль с партии:'
                  : isEs
                  ? 'Ganancia neta del lote:'
                  : 'Net profit per batch:'}
              </span>
              <div className="text-right">
                <span className="text-base block">+${econ.wholesaleBatchProfitUSD}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-normal">
                  {isRu ? 'Рентабельность ROI:' : isEs ? 'Rentabilidad ROI:' : 'ROI:'} {econ.wholesaleRoiPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Retail B2C Channel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-sm">
              <Store className="w-5 h-5" />
              <span>
                {isRu
                  ? 'Розничный канал (B2C Direct-to-Consumer / E-Commerce)'
                  : isEs
                  ? 'Canal Minorista (B2C Direct-to-Consumer / Web)'
                  : 'Retail Channel (B2C Direct-to-Consumer / Web)'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
              {isRu ? 'Наценка:' : isEs ? 'Margen comercial:' : 'Markup:'} +{econ.retailMarkupPercent}%
            </span>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {isRu
                  ? 'Маржинальность розничная (Margin %):'
                  : isEs
                  ? 'Margen bruto minorista (Margin %):'
                  : 'Retail Gross Margin (%):'}
              </span>
              <span className="font-mono text-sm font-bold text-purple-600">
                {settings.retailMarginPercent}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              step="1"
              value={settings.retailMarginPercent}
              onChange={(e) =>
                onSettingsChange({ ...settings, retailMarginPercent: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-600 dark:text-slate-400">
                {isRu
                  ? `Розничная цена за 1 шт (${settings.targetUnitGrams}г):`
                  : isEs
                  ? `Precio minorista por 1 ud (${settings.targetUnitGrams}g):`
                  : `Retail price per unit (${settings.targetUnitGrams}g):`}
              </span>
              <span className="text-xl font-bold text-purple-700 dark:text-purple-300">
                ${econ.retailPricePerUnitUSD}
              </span>
            </div>
            <div className="flex justify-between items-baseline text-slate-600 dark:text-slate-400">
              <span>
                {isRu
                  ? `Выручка с партии (${econ.unitsProduced} шт):`
                  : isEs
                  ? `Ingreso bruto del lote (${econ.unitsProduced} uds):`
                  : `Batch revenue (${econ.unitsProduced} units):`}
              </span>
              <span className="font-bold">${econ.retailBatchRevenueUSD}</span>
            </div>
            <div className="flex justify-between items-baseline text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-purple-200/50">
              <span>
                {isRu
                  ? 'Чистая прибыль с партии:'
                  : isEs
                  ? 'Ganancia neta del lote:'
                  : 'Net profit per batch:'}
              </span>
              <div className="text-right">
                <span className="text-base block">+${econ.retailBatchProfitUSD}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-normal">
                  {isRu ? 'Рентабельность ROI:' : isEs ? 'Rentabilidad ROI:' : 'ROI:'} {econ.retailRoiPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
