"use client";
import React, { useState } from 'react';
import { Sparkles, Copy, Check, Share2, Mountain, Leaf, Flame, Shield, Heart } from 'lucide-react';
import { Language, Recipe } from '@/lib/lab/types';
import { FormulationCalculations } from '@/lib/lab/utils/bioSynergyEngine';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface ClientNarrativeViewProps {
  recipe: Recipe;
  formulation: FormulationCalculations;
  language: Language;
}

export const ClientNarrativeView: React.FC<ClientNarrativeViewProps> = ({
  recipe,
  formulation,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);
  const m = formulation.metrics;
  const isRu = language === 'ru';
  const isEs = language === 'es';

  const narrativeRu = `ИНКА ТРЕЙЛ | ФАРМАКО-БОТАНИЧЕСКИЙ ДОСЬЕ
ПРОДУКТ: ${recipe.nameRu} (Код: ${recipe.code})
ТЕРРУАР: Высокогорные органические чакра-леса Самора-Чинчипе (1000–1200м над уровнем моря)
ПАРТНЕРСТВО: Коренные общины Шуар (Napurak, Los Bayanes)
ТЕХНОЛОГИЯ: FMAD (Вакуумно-микроволновое обезвоживание) • Помол 18 мкм с цельной веллой

1. ПАРАДИГМА ВЫСОКОГОРЬЯ И ЖИВАЯ МАТРИЦА СЕМЕНИ
Экстремальная высота тропических лесов Амазонии (до 1360м) формирует естественный щит: холодные ночи и мощный ультрафиолетовый стресс принуждают реликтовые деревья Cacao Nacional синтезировать феноменальные концентрации защитных полифенолов и мономеров (-)-эпикатехина. Благодаря технологии FMAD, стручок перерабатывается в течение 3 часов после вскрытия, полностью минуя спонтанное брожение и высокотемпературную обжарку. Сохраняется свыше 90% нативных флаванолов (63.5 мг/г), 26 мг/г теобромина и природный комплекс антоцианов королевского фиолетового цвета.

2. СИНЕРГЕТИЧЕСКИЙ МЕХАНИЗМ РЕЦЕПТУРЫ
В отличие от стандартного шоколада, формула "${recipe.nameRu}" функционирует как замкнутая биохимическая система:
• Активация натрий-глюкозного насоса SGLT1: стехиометрический баланс нерафинированной панелы и морской соли открывает эпителиальный парацеллюлярный транспорт в тонком кишечнике, ускоряя всасывание в первые 15–20 минут.
• Преодоление барьера первого прохождения: микродозы пиперина временно ингибируют кишечные ферменты UGT1A9/10 и эффлюксный белок P-gp, увеличивая системную биодоступность целевых веществ в ${m.multiplierEpicatechin}x – ${m.multiplierCurcumin}x раз.
• Сосудистая вазодилатация: 18.5 мг/г мономерного (-)-эпикатехина запускают выброс оксида азота эндотелием, раскрывая периферическое русло и обеспечивая мягкое тепло без мышечного спазма.

3. СОМАТОСЕНСОРНЫЙ ПРОТОКОЛ ДЕГУСТАЦИИ (20–30 г)
Поместите порцию 20–30 г на язык и дайте какао-маслу медленно растаять, обволакивая слизистую оболочку. Не разжевывайте.
• 00–20 мин: Появление мягкого тепла в грудной клетке, раскрытие периферических сосудов, ощущение легкости в ЖКТ.
• 20–40 мин: Плавный вход в состояние кристальной ментальной ясности благодаря альфа-волновой когерентности (L-теанин) и эндоканнабиноидной защите анандамида.
• 40–180 мин: Стабильное плато творческого потока, эмпатии и сосредоточения без спада и перевозбуждения.`;

  const narrativeEs = `INCA TRAIL | DOSSIER FITOFARMACOLÓGICO DE ÉLITE
PRODUCTO: ${recipe.nameEs || recipe.nameEn} (Código: ${recipe.code})
TERROIR: Bosques de niebla de altura en Zamora-Chinchipe (1.000–1.200 m s.n.m.)
ALIANZA: Comunidades indígenas Shuar (Napurak, Los Bayanes)
TECNOLOGÍA: FMAD (Deshidratación por Atmósfera Modificada) • Molienda de 18 µm con cutícula intacta

1. EL PARADIGMA DE ALTURA Y LA MATRIZ VIVA DE LA SEMILLA
La altitud extrema de los bosques nubosos amazónicos (hasta 1.360 m) crea un escudo natural: las noches frías y la intensa radiación ultravioleta fuerzan a los árboles ancestrales de Cacao Nacional a sintetizar concentraciones extraordinarias de polifenoles y monómeros de (-)-epicatequina. Gracias a la tecnología FMAD, la mazorca se procesa en menos de 3 horas tras la cosecha, evitando por completo la fermentación espontánea y el tostado destructivo. Se conserva más del 90% de los flavonoles nativos (63.5 mg/g), 26 mg/g de teobromina y las antocianinas púrpuras vivas.

2. MECANISMO DE SINERGIA FARMACOCINÉTICA
A diferencia del chocolate tradicional, la fórmula «${recipe.nameEs || recipe.nameEn}» opera como una matriz biodinámica cerrada:
• Cotransporte Activo Sodio-Glucosa (SGLT1): La proporción exacta de panela pura y sal marina genera un gradiente osmótico que activa la absorción duodenal en los primeros 15–20 minutos.
• Bloqueo del Primer Paso Hepático: La piperina inhibe reversiblemente UGT1A9/10 y la bomba P-gp, elevando la biodisponibilidad sistémica de los ligandos activos en ${m.multiplierEpicatechin}x – ${m.multiplierCurcumin}x.
• Vasodilatación Endotelial: 18.5 mg/g de (-)-epicatequina estimulan la enzima eNOS para liberar óxido nítrico, expandiendo el lecho microvascular y eliminando el frío en extremidades y la rigidez muscular.

3. PROTOCOLO SOMATOSENSORIAL DE CONSUMO (20–30 g)
Coloque una porción de 20–30 g sobre la lengua y permita que se funda lentamente con el calor bucal. No mastique.
• 00–20 min: Sensación de calidez expansiva en el pecho, vasodilatación periférica y ausencia total de pesadez estomacal.
• 20–40 min: Entrada lúcida y serena guiada por la coherencia de ondas alfa (L-teanina de guayusa) y la protección del anandamida.
• 40–180 min: Meseta prolongada de enfoque cognitivo, empatía y calma mental sin taquicardia ni bajón.`;

  const narrativeEn = `THE INCA TRAIL | PHYTOMEDICAL DOSSIER
PRODUCT: ${recipe.nameEn} (Code: ${recipe.code})
TERROIR: High-Altitude Amazonian Cloud Forests, Zamora-Chinchipe (1,000–1,200m a.s.l.)
SOURCING: Indigenous Shuar Farming Communities (Napurak, Los Bayanes)
PROCESSING: FMAD (Fast Modified Atmosphere Dehydration) • 18 µm Stone-Milled with Intact Veleta

1. THE HIGH-ALTITUDE PARADIGM & LIVING SEED MATRIX
Anchored in the cloud forests of Ecuador, high UV exposure and crisp mountain nights compel ancient Cacao Nacional trees to synthesize extraordinarily dense concentrations of secondary metabolites—specifically monomeric flavanols and theobromine. Processed via proprietary low-temperature vacuum dehydration (FMAD) within 3 hours of pod opening, spontaneous fermentation is eliminated. This permanently preserves >90% of native bioactives (63.5 mg/g flavanols, 26 mg/g theobromine, and vibrant purple anthocyanins).

2. PHARMACOKINETIC SYNERGY NODES
Unlike conventional luxury chocolate, "${recipe.nameEn}" operates as a self-reinforcing pharmacodynamic matrix:
• Active Sodium-Glucose Cotransport (SGLT1): Trace minerals and panela sugars create an osmotic gradient across enterocytes, pulling water-soluble flavanols into the bloodstream within 15–20 minutes.
• Presystemic First-Pass Inhibition: Piperine micro-dosing transiently down-regulates UGT1A9/10 and P-glycoprotein, amplifying systemic bioavailability by ${m.multiplierEpicatechin}x – ${m.multiplierCurcumin}x.
• Endothelial Nitric Oxide Release: 18.5 mg/g (-)-epicatechin triggers eNOS enzyme activity, dilating systemic microvasculature and eliminating cold extremities and somatic tension.

3. SOMATOSENSORY TASTING PROTOCOL (20–30g)
Allow a 20–30g portion to slow-melt on the tongue without chewing, allowing lipid micellization:
• 00–20 min: SGLT1 active mucosal absorption begins with chest warmth and vascular relaxation.
• 20–40 min: Smooth cognitive transition guided by L-theanine alpha-wave entrainment (8–12 Hz) and FAAH-mediated anandamide preservation.
• 40–180 min: Extended therapeutic plateau of calm focus, heightened sensory clarity, and empathic resonance without caffeine jitters.`;

  const activeNarrative = isRu ? narrativeRu : isEs ? narrativeEs : narrativeEn;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNarrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.clientTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.clientSubtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t.copiedText : t.copyTextBtn}</span>
        </button>
      </div>

      {/* Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Mountain className="w-6 h-6 text-purple-600 mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            {isRu ? 'Высокогорный щит 1200м' : isEs ? 'Escudo de Altura 1.200m' : 'High-Altitude Shield'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isRu
              ? '1000–1200м над уровнем моря в Амазонии. Природный стресс ультрафиолетом стимулирует максимальный синтез флаванолов без агрохимии.'
              : isEs
              ? '1.000–1.200 m s.n.m. en la Amazonía ecuatoriana. El estrés UV natural estimula la síntesis máxima de flavonoles protectores.'
              : '1,000–1,200m a.s.l. in the Amazonian cloud forest. Natural UV exposure triggers dense flavanol synthesis without agrochemicals.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Leaf className="w-6 h-6 text-emerald-600 mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            {isRu ? 'Технология FMAD' : isEs ? 'Tecnología FMAD' : 'FMAD Technology'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isRu
              ? 'Вакуумно-микроволновый импульс останавливает фермент PPO, навсегда сохраняя королевский фиолетовый цвет антоцианов и 90% флаванолов.'
              : isEs
              ? 'Deshidratación por atmósfera modificada que inactiva la enzima PPO, preservando el color púrpura vivo y más del 90% de flavonoles.'
              : 'Modified atmosphere vacuum dehydration halts PPO enzymes, preserving royal purple anthocyanins and >90% of native flavanols.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Heart className="w-6 h-6 text-rose-500 mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
            {isRu ? 'Соматосенсорика без спазма' : isEs ? 'Somatosensorial sin Náuseas' : 'Somatic Ease & Flow'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isRu
              ? 'Симпорт SGLT1 и мономерный эпикатехин eNOS обеспечивают мягкое расширение сосудов и прилив тепла без тошноты и тахикардии.'
              : isEs
              ? 'El cotransporte SGLT1 y la epicatequina activan la eNOS, entregando vasodilatación periférica y calidez sin espasmos gástricos.'
              : 'SGLT1 symport and monomeric epicatechin stimulate eNOS, yielding gentle vascular warmth without nausea or rapid heart rate.'}
          </p>
        </div>
      </div>

      {/* Narrative Text Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            {isRu ? 'Текст досье для клиента' : isEs ? 'Texto del Dossier para el Cliente' : 'Client Presentation Dossier'}
          </span>
          <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
            {isRu ? 'Готово к копированию' : isEs ? 'Listo para copiar' : 'Ready to Copy'}
          </span>
        </div>

        <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800">
          {activeNarrative}
        </pre>
      </div>
    </div>
  );
};
