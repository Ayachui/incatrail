"use client";
import React from 'react';
import {
  FileText,
  Printer,
  Thermometer,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language, Recipe } from '@/lib/lab/types';
import { FormulationCalculations, CalculatedItem } from '@/lib/lab/utils/bioSynergyEngine';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface TechCardViewProps {
  recipe: Recipe;
  formulation: FormulationCalculations;
  language: Language;
}

export const TechCardView: React.FC<TechCardViewProps> = ({ recipe, formulation, language }) => {
  const t = TRANSLATIONS[language];
  const tp = formulation.tempering;
  const isRu = language === 'ru';
  const isEs = language === 'es';
  const unitKg = isRu ? 'кг' : 'kg';
  const unitG = isRu ? 'г' : 'g';

  const handlePrint = () => {
    window.print();
  };

  const getPhaseText = (ingId: string): string => {
    if (isRu) {
      if (ingId === 'cacao_butter') return 'Шаг 1А (Растопить 60°C)';
      if (ingId === 'cacao_paste') return '1/3 на Шаге 1Б + 2/3 на Шаге 2';
      if (ingId === 'panela' || ingId === 'sea_salt' || ingId === 'hibiscus') return 'Шаг 1Б (Дробно за 20 мин)';
      if (ingId === 'mushrooms') return 'Шаг 3 (Строго 36.5°C при охлаждении)';
      if (ingId === 'milk_powder') return 'Шаг 1Б (Деликатный ввод при <42°C)';
      return 'Шаг 1А (Липофилы) / Шаг 2 (Тело)';
    } else if (isEs) {
      if (ingId === 'cacao_butter') return 'Paso 1A (Fundir a 60°C)';
      if (ingId === 'cacao_paste') return '1/3 en Paso 1B + 2/3 en Paso 2';
      if (ingId === 'panela' || ingId === 'sea_salt' || ingId === 'hibiscus') return 'Paso 1B (Fraccionado en 20 min)';
      if (ingId === 'mushrooms') return 'Paso 3 (36.5°C exactos al enfriar)';
      if (ingId === 'milk_powder') return 'Paso 1B (Delicado <42°C)';
      return 'Paso 1A (Lipofílicos) / Paso 2 (Cuerpo)';
    } else {
      if (ingId === 'cacao_butter') return 'Step 1A (Melt at 60°C)';
      if (ingId === 'cacao_paste') return '1/3 at Step 1B + 2/3 at Step 2';
      if (ingId === 'panela' || ingId === 'sea_salt' || ingId === 'hibiscus') return 'Step 1B (Dosed over 20 min)';
      if (ingId === 'mushrooms') return 'Step 3 (Strictly 36.5°C during cooling)';
      if (ingId === 'milk_powder') return 'Step 1B (Gentle <42°C)';
      return 'Step 1A (Lipophiles) / Step 2 (Body)';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner & Print PDF Trigger */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.techCardTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.techCardSubtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-purple-600 dark:hover:bg-purple-700 text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>{t.printPdfBtn}</span>
        </button>
      </div>

      {/* Official Laboratory Tech Regulation Document (Printable) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
        {/* Header Block of Tech Card */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold block">
              {isRu
                ? 'ТЕХНОЛОГИЧЕСКАЯ ИНСТРУКЦИЯ • МАНУФАКТУРА CACAO ZAMORA'
                : isEs
                ? 'FICHA TÉCNICA DE MANUFACTURA • CACAO ZAMORA'
                : 'MANUFACTURING TECH REGULATION • CACAO ZAMORA'}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {isRu ? recipe.nameRu : isEs ? (recipe.nameEs || recipe.nameEn) : recipe.nameEn}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {isRu ? 'Код:' : isEs ? 'Código:' : 'Code:'} {recipe.code} •{' '}
              {isRu
                ? 'База: 100% Паста ВМС (18 мкм, велла без лавадо)'
                : isEs
                ? 'Base: 100% Pasta FMAD (18 µm, cutícula intacta)'
                : 'Base: 100% FMAD Paste (18 µm, intact cuticle)'}
            </p>
          </div>

          <div className="text-left sm:text-right sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-6">
            <span className="text-[11px] text-slate-400 uppercase font-mono block">
              {isRu ? 'Размер партии:' : isEs ? 'Tamaño del lote:' : 'Batch size:'}
            </span>
            <span className="text-xl font-mono font-bold text-slate-900 dark:text-white">
              {formulation.totalWeightGrams >= 1000
                ? `${(formulation.totalWeightGrams / 1000).toFixed(2)} ${isRu ? 'кг' : 'kg'}`
                : `${formulation.totalWeightGrams} ${isRu ? 'г' : 'g'}`}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-mono font-semibold block">
              Total Cacao: {formulation.totalCacaoPercentage}%
            </span>
          </div>
        </div>

        {/* Recipe Weight Specification Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
            {isRu
              ? '1. Рецептурная ведомость загрузки (навеска в граммах)'
              : isEs
              ? '1. Lista de Carga de Ingredientes (peso en gramos)'
              : '1. Ingredient Batch Weight Specification (grams)'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">{isRu ? 'Ингредиент' : isEs ? 'Ingrediente' : 'Ingredient'}</th>
                  <th className="py-2.5 px-3 text-right">{isRu ? 'Пекарский %' : isEs ? '% Panadero' : "Baker's %"}</th>
                  <th className="py-2.5 px-3 text-right">{isRu ? 'В плитке %' : isEs ? '% en Barra' : 'In-Bar %'}</th>
                  <th className="py-2.5 px-3 text-right font-bold">{isRu ? 'Навеска (г)' : isEs ? 'Peso (g)' : 'Weight (g)'}</th>
                  <th className="py-2.5 px-3">{isRu ? 'Фаза загрузки в меланжер' : isEs ? 'Fase en Melanger' : 'Melanger Loading Phase'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {formulation.items.map((i: CalculatedItem) => {
                  const ingName = isRu ? i.ingredient.nameRu : isEs ? (i.ingredient.nameEs || i.ingredient.nameEn) : i.ingredient.nameEn;
                  return (
                    <tr key={i.ingredient.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-medium text-slate-900 dark:text-white font-sans">
                        {ingName}
                      </td>
                      <td className="py-2 px-3 text-right text-purple-600">{i.bakersPercentage.toFixed(2)}%</td>
                      <td className="py-2 px-3 text-right text-slate-600">{i.standardPercentage.toFixed(2)}%</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {i.weightGrams >= 1000
                          ? `${(i.weightGrams / 1000).toFixed(3)} ${unitKg}`
                          : `${i.weightGrams.toFixed(1)} ${unitG}`}
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-500 font-sans">
                        {getPhaseText(i.ingredient.id)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step-by-Step Melanger Execution Protocol */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            {isRu
              ? '2. Поэтапный технологический регламент переработки'
              : isEs
              ? '2. Protocolo Tecnológico Paso a Paso'
              : '2. Step-by-Step Melanger Processing Protocol'}
          </h3>

          {/* Step 1A */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-purple-700 dark:text-purple-300 font-mono">
                {t.step1aTitle}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                58–60 °C • 15 {isRu ? 'мин' : 'min'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.step1aDesc}
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              {isRu
                ? 'Контрольная точка: полное растворение микропудры перца, куркумы и имбиря в непрерывной триглицеридной сетке.'
                : isEs
                ? 'Punto de control: Disolución completa de micropigmentos de pimienta, cúrcuma y jengibre en la red lipídica continua.'
                : 'Control Point: Complete dissolution of black pepper, turmeric, and ginger micropowders in the continuous lipid phase.'}
            </div>
          </div>

          {/* Step 1B */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-700 dark:text-indigo-300 font-mono">
                {t.step1bTitle}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                45 °C • 1.5–1.75 {isRu ? 'ч' : 'h'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.step1bDesc}
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              {isRu
                ? 'Контрольная точка: дисперсность суспензии <20 мкм по микрометру. Отсутствие комкования сахара (Sugar Seizing).'
                : isEs
                ? 'Punto de control: Dispersión de suspensión <20 µm en micrómetro. Cero agarrotamiento de azúcares (Sugar Seizing).'
                : 'Control Point: Suspension fineness <20 µm on micrometer. Zero sugar seizing.'}
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-teal-700 dark:text-teal-300 font-mono">
                {t.step2Title}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold">
                42–45 °C • {isRu ? 'РОВНО 45 мин' : isEs ? 'EXACTAMENTE 45 min' : 'STRICTLY 45 min'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.step2Desc}
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              {isRu
                ? 'Контрольная точка: строго ограничить гомогенизацию 45 минутами во избежание термической и трибохимической деградации флаванолов DP1–DP7.'
                : isEs
                ? 'Punto de control: Limitar estrictamente la homogeneización a 45 minutos para proteger flavonoles DP1–DP7 de degradación térmica.'
                : 'Control Point: Strictly limit homogenization to 45 minutes to avoid thermal and tribochemical oxidation of DP1–DP7 flavanols.'}
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-purple-800 dark:text-purple-300 font-mono">
                {t.step3Title}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-200 text-purple-900 dark:bg-purple-900 dark:text-purple-100 font-bold">
                {tp.seedingTempC} °C Seeding Gate
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.step3Desc}
            </p>
            <div className="text-[11px] text-purple-700 dark:text-purple-300 font-mono pt-1 border-t border-purple-200/60 dark:border-purple-800/60">
              {isRu
                ? 'Контрольная точка: проверка качества кристаллизации (тест на полоске поликарбоната: застывание за 3 мин при 20°C, зеркальный блеск и чистый хруст).'
                : isEs
                ? 'Punto de control: Prueba de cristalización en tira de policarbonato (solidificación en 3 min a 20°C, brillo espejo y quiebre limpio).'
                : 'Control Point: Crystallization test on polycarbonate strip (solidification in 3 min at 20°C, mirror snap and gloss).'}
            </div>
          </div>
        </div>

        {/* Dynamic Thermodynamic Silk Tempering Protocol Table */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
              {t.temperingTableTitle}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">{t.tempPreCool}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{tp.preCoolingTempC} °C</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900">
              <span className="text-[10px] text-purple-600 dark:text-purple-400 block mb-1">{t.tempSeeding}</span>
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{tp.seedingTempC} °C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">{t.tempSilkPercent}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{tp.silkPercentage}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">{t.tempMixDuration}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{tp.mixingMinutes} {isRu ? 'мин' : 'min'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">{t.tempCasting}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{tp.castingTempC} °C</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">{t.tempTunnel}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{tp.coolingTunnelTempC}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
