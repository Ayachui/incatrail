"use client";
import React, { useState } from 'react';
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  RefreshCw,
  ShieldAlert,
  Send,
  Sliders,
  MessageCircle,
  Instagram,
  Linkedin,
  Mail,
  Flame,
  Mountain,
  Heart,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Language, Recipe } from '@/lib/lab/types';
import { FormulationCalculations } from '@/lib/lab/utils/bioSynergyEngine';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface SocialMediaGeneratorViewProps {
  recipe: Recipe;
  formulation: FormulationCalculations;
  language: Language;
}

type Platform = 'instagram' | 'telegram' | 'linkedin' | 'newsletter';
type Mood = 'ceremonial' | 'biohacking' | 'luxury' | 'ancestral';
type Angle = 'living_purple' | 'no_nausea' | 'theobromine_flow' | 'high_altitude' | 'private_allocation';

export const SocialMediaGeneratorView: React.FC<SocialMediaGeneratorViewProps> = ({
  recipe,
  formulation,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isRu = language === 'ru';
  const isEs = language === 'es';
  const m = formulation.metrics;

  const [platform, setPlatform] = useState<Platform>('instagram');
  const [mood, setMood] = useState<Mood>('biohacking');
  const [angle, setAngle] = useState<Angle>('no_nausea');
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate fallback authentic text if server or API key is not present
  const getFallbackPost = (plt: Platform, md: Mood, agl: Angle): string => {
    const rawName = isRu ? recipe.nameRu : isEs ? (recipe.nameEs || recipe.nameEn) : recipe.nameEn;
    const pureBasePct = formulation.pureCacaoBasePercentage.toFixed(0);
    const productName = `${rawName} (${pureBasePct}% Base Cacao)`;

    if (isRu) {
      if (plt === 'instagram') {
        return `🌿 Не все какао создано равным. Знакомьтесь: живое фиолетовое какао из амазонских чакр Самора-Чинчипе.
        
В большинстве традиционного церемониального какао при попытке ощутить глубокое состояние вы сталкиваетесь с мышечным спазмом, тошнотой и тяжестью в ЖКТ. 

Почему наша формула «${productName}» (${pureBasePct}% чистая основа семени) ощущается принципиально иначе?
✨ Мы сохраняем живую матрицу семени: благодаря вакуумно-микроволновой дегидратации (FMAD) при низких температурах бобы минуют спонтанное брожение и обжарку. Сохраняется королевский фиолетовый пигмент и 63.5 мг/г нативных флаванолов.
✨ Умный симпорт SGLT1: стехиометрия нерафинированной панелы и морской соли мягко открывает эпителиальный барьер тонкого кишечника. Всасывание происходит уже на 15-й минуте.
✨ Никакого кофеинового спада: преобладание теобромина дарит длительное расширение капилляров, тепло в груди и кристальный ментальный фокус без тахикардии.

Мы создаем этот продукт в тесном партнерстве с коренными семьями народа Шуар на высоте свыше 1000 метров.

Лимитированная лабораторная партия доступна по предзаказу. Ссылка в шапке профиля @incatrailfoods.

#IncaTrailFoods #CacaoNacional #PurpleCacao #Biohacking #CeremonialCacao #ZamoraChinchipe #NoJitters #Superfood`;
      } else if (plt === 'telegram') {
        return `⚡️ Фармакокинетика священного растения: почему от обычного сырого какао часто тошнит, а от фиолетового Nacional — нет?

Разбираем биохимию матрицы «${productName}» (${pureBasePct}% чистая какао-база).

Многие практики церемониального какао знают этот неприятный симптом: выпиваешь густой напиток 40–50 г — и через 20 минут желудок скручивает спазм. 

Причина проста:
1. Окисленные полифенолы ферментированного и пережаренного какао раздражают слизистую блуждающего нерва (vagus nerve), вызывая эметический рефлекс.
2. Избыток свободного жира активирует холецистокининовый тормоз (CCK), наглухо блокируя эвакуацию пищи из желудка.

Что мы изменили в Inca Trail Foods:
▫️ Полный отказ от ферментации: технология FMAD фиксирует нативный фиолетовый профиль семени.
▫️ Дегидратация при низких температурах сохраняет мономеры (-)-эпикатехина (DP1), которые стимулируют эндотелиальный оксид азота (eNOS), мягко расширяя периферические сосуды.
▫️ Баланс электролитов и гликемического вектора запускает натрий-глюкозный насос SGLT1. Биодоступные вещества мгновенно попадают в системный кровоток без перегрузки печени.

Результат — чистый вход, ясное сознание, открытое сердце и 3–4 часа устойчивого творческого потока.

🔐 Доступ к закрытой аллокации партии: incatrailfoods.com`;
      } else if (plt === 'linkedin') {
        return `Bridging Indigenous Agroforestry and Modern Nutraceutical Science: The Story of Unfermented Purple Cacao.

The functional foods and luxury chocolate sectors are undergoing a tectonic shift. Consumers no longer accept heavy sugar loads or over-roasted confectionery masquerading as "wellness."

At Inca Trail Foods, our R&D focus is anchored in high-altitude cloud forests of Zamora-Chinchipe, Ecuador (1,000–1,200m a.s.l.):
• Direct ethical partnerships with indigenous Shuar farming communities (Napurak & Los Bayanes).
• Proprietary FMAD processing: Eliminating spontaneous fermentation and thermal degradation preserves over 90% of native monomeric flavanols and the natural purple anthocyanin matrix.
• Formulation "${productName}" (${pureBasePct}% unfermented cacao & butter core matrix): Engineered for maximized cellular bioavailability via active SGLT1 cotransport and presystemic enzymatic balance.

We are establishing a new category: Grand Cru Nutraceutical Matrices.

For institutional inquiries, private retreats, and B2B sample allocations: visit incatrailfoods.com or reach out directly.

#Nutraceuticals #FunctionalFood #FoodTech #IncaTrailFoods #DirectTrade #Sustainability #Biochemistry`;
      } else {
        return `Дорогой друг,

Пишем вам из предгорий Амазонии, где реликтовые деревья Cacao Nacional дают плоды с семенами редчайшего фиолетового цвета.

Сегодня мы открываем закрытую аллокацию формулы «${productName}» (${pureBasePct}% чистая основа какао).

В отличие от магазинного шоколада или тяжелого ферментированного церемониального какао, эта формула разработана как гармоничная соматосенсорная система. 
Она не вызывает спазмов и тошноты, не перегружает печень и не дает тремора. 20–30 граммов на языке раскрывают глубокое периферическое тепло, стимулируют выработку эндотелиального оксида азота и погружают в состояние сосредоточенного спокойствия.

Количество плиток в этой лабораторной партии строго ограничено производительностью каменного меланжера.

Зарезервировать вашу часть урожая: incatrailfoods.com/private

С уважением и теплом,
Команда Inca Trail Foods`;
      }
    } else if (isEs) {
      if (plt === 'instagram') {
        return `✨ Más allá de lo ceremonial: La Matriz Viva de Cacao Púrpura de Zamora.

Les presentamos «${productName}» (${pureBasePct}% base pura de cacao fino), cultivado en los bosques de niebla de Zamora-Chinchipe, Ecuador (1.200 m s.n.m.).

¿Alguna vez has sentido pesadez estomacal o náuseas con el cacao ceremonial tradicional? He aquí por qué nuestra formulación entrega euforia pura sin bajones:
🟣 Antocianinas Púrpuras Vivas: Deshidratado al vacío a baja temperatura (FMAD) dentro de las 3 horas posteriores a la cosecha, sin fermentación espontánea y sin tostado térmico.
🟣 Cotransporte Activo SGLT1: El equilibrio estequiométrico de panela pura y sal marina activa la absorción duodenal en 15–20 minutos sin sobrecarga gástrica.
🟣 Claridad Teobromínica: Vasodilatación periférica prolongada y ondas cerebrales alfa sin la taquicardia del exceso de cafeína.

Producido en alianza ética directa con familias indígenas Shuar.

Lote exclusivo de laboratorio disponible en incatrailfoods.com (enlace en perfil @incatrailfoods).

#IncaTrailFoods #CacaoPurpura #CacaoNacional #Biohacking #CacaoCeremonial #ZamoraChinchipe #Superalimento #Ecuador`;
      } else if (plt === 'telegram') {
        return `⚡️ Farmacocinética de una planta sagrada: ¿Por qué el cacao crudo convencional provoca náuseas y el Cacao Púrpura Nacional no?

Análisis biomecánico de la matriz «${productName}» (${pureBasePct}% base pura).

Muchos facilitadores y practicantes de cacao ceremonial conocen este síntoma: tomas una dosis de 40–50 g y a los 20 minutos sientes un espasmo gástrico.

La causa bioquímica es clara:
1. Los polifenoles oxidados del cacao sobrefermentado o tostado irritan las terminales del nervio vago provocando el reflejo emético.
2. El exceso de grasa libre activa el freno lipídico de la colecistoquinina (CCK), retrasando el vaciamiento del estómago hasta un 50%.

La innovación de Inca Trail Foods:
▫️ Eliminación de la fermentación espontánea: La tecnología FMAD conserva el color púrpura natural y el perfil intacto de la semilla.
▫️ Monómeros de (-)-epicatequina (DP1): Estimulan la eNOS endotelial liberando óxido nítrico, abriendo el flujo microvascular sin tensión somática.
▫️ SGLT1 Activo: La bomba sodio-glucosa facilita la entrada celular inmediata de los flavonoides sin sobrecargar el hígado.

Resultado: Una entrada suave, mente cristalina, apertura de corazón y 3 a 4 horas de flujo creativo sostenido.

🔐 Acceso a la asignación privada: incatrailfoods.com`;
      } else if (plt === 'linkedin') {
        return `Uniendo Agroforestería Ancestral y Ciencia Nutracéutica: La Revolución del Cacao Púrpura sin Fermentar.

Los sectores de alimentos funcionales y chocolate ultra-premium demandan autenticidad bioquímica. Ya no es aceptable el exceso de azúcar ni el cacao quemado bajo la etiqueta de "bienestar".

En Inca Trail Foods, nuestra I+D se fundamenta en los bosques nubosos de Zamora-Chinchipe, Ecuador (1.000–1.200 m s.n.m.):
• Alianzas comerciales éticas con comunidades indígenas Shuar (Napurak y Los Bayanes).
• Procesamiento patentado FMAD: Deshidratación al vacío a baja temperatura que conserva más del 90% de flavonoles monoméricos y las antocianinas púrpuras vivas.
• Formulación «${productName}» (${pureBasePct}% base pura): Diseñada para maximizar la biodisponibilidad celular mediante cotransporte SGLT1 e inhibición del primer paso hepático.

Estamos definiendo una nueva categoría global: Matrices Nutracéuticas Grand Cru.

Para consultas institucionales, retiros de bienestar y muestras B2B: visite incatrailfoods.com o contáctenos directamente.

#Nutraceuticos #FoodTech #IncaTrailFoods #ComercioJusto #Sostenibilidad #Bioquimica #Ecuador`;
      } else {
        return `Estimado amigo,

Le escribimos desde las estribaciones de la Amazonía ecuatoriana, donde los árboles relictos de Cacao Nacional producen semillas con un color púrpura extraordinario.

Hoy abrimos la asignación privada de nuestra fórmula «${productName}» (${pureBasePct}% base pura de cacao).

A diferencia del chocolate comercial o del cacao ceremonial pesado, esta fórmula ha sido concebida como un sistema somatosensorial armónico. 
No genera náuseas ni pesadez, no estresa el hígado y no produce temblores. Una porción de 20 a 30 gramos en el paladar despierta un calor expansivo en el pecho, activa la microcirculación y sumerge la mente en un estado de enfoque sereno.

El número de tabletas de este lote está estrictamente limitado por la capacidad de nuestro melanger de piedra.

Reserve su asignación en: incatrailfoods.com/private

Con aprecio y respeto,
El equipo de Inca Trail Foods`;
      }
    } else {
      // English version
      if (plt === 'instagram') {
        return `✨ Beyond Ceremonial: The Living Purple Cacao Matrix.

Meet "${productName}" (${pureBasePct}% Pure Cacao Base) from the high-altitude cloud forests of Zamora-Chinchipe, Ecuador (1,200m a.s.l.).

Ever experienced nausea or gastric heaviness from traditional raw cacao? Here is why our formulation delivers pure euphoria without the crash:
🟣 Living Purple Anthocyanins: Processed via low-temp vacuum dehydration (FMAD) within 3 hours of harvest—no fermentation, zero roasting.
🟣 Active SGLT1 Cotransport: Balanced trace electrolytes activate natural duodenal uptake within 15–20 minutes.
🟣 Theobromine Clarity: Gentle, sustained vasodilation and alpha-wave coherence without caffeine tremors.

Sustainably sourced in partnership with indigenous Shuar families.

Private allocation now open at incatrailfoods.com (link in bio @incatrailfoods).

#IncaTrailFoods #PurpleCacao #Nootropics #Biohacking #CeremonialCacao #FunctionalMedicine #ZamoraChinchipe`;
      } else {
        return `Bridging Amazonian Wisdom & Pharmacokinetic Precision.

Introducing "${productName}" (${pureBasePct}% Pure Cacao Base) by Inca Trail Foods.
Sourced from native unfermented purple Cacao Nacional at 1,200m elevation in Ecuador.

Key Highlights:
1. 63.5 mg/g native bioactive flavanols preserved via FMAD.
2. Active SGLT1 mucosal absorption prevents gastric heaviness and nausea.
3. Sustained endothelial nitric oxide release for calm, expansive focus.

Reserve your allocation at incatrailfoods.com.`;
      }
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);

    try {
      const response = await fetch('/api/gemini/social-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          mood,
          angle,
          recipeName: isRu ? recipe.nameRu : isEs ? (recipe.nameEs || recipe.nameEn) : recipe.nameEn,
          language,
          pureCacaoBasePercentage: formulation.pureCacaoBasePercentage.toFixed(0),
          bioMetrics: {
            flavanols: m.totalFlavanolsMgPer20g,
            multiplierEpicatechin: m.multiplierEpicatechin,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text) {
          setGeneratedText(data.text);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend Gemini API call failed or offline, using high-fidelity fallback generator:', e);
    }

    // High fidelity fallback generator
    setTimeout(() => {
      const fallback = getFallbackPost(platform, mood, angle);
      setGeneratedText(fallback);
      setLoading(false);
    }, 600);
  };

  // Run on mount if empty or language/recipe changes
  React.useEffect(() => {
    setGeneratedText(getFallbackPost(platform, mood, angle));
  }, [platform, mood, angle, language, recipe]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const wordCount = generatedText ? generatedText.trim().split(/\s+/).length : 0;
  const charCount = generatedText.length;

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>
                {isRu
                  ? 'ИИ Генератор контента для соцсетей'
                  : isEs
                  ? 'Generador de Contenido IA para Redes Sociales'
                  : 'AI Social Media Content Generator'}
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRu
                ? 'Презентация инноваций фиолетового какао без раскрытия коммерческих тайн и рецептурных долей'
                : isEs
                ? 'Promoción del cacao púrpura sin revelar secretos comerciales ni fórmulas confidenciales'
                : 'Highlight purple cacao innovation without exposing proprietary ratios, recipes, or trade secrets'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>
              {isRu ? 'Сгенерировать / Регенерация' : isEs ? 'Generar / Regenerar' : 'Generate / Regenerate'}
            </span>
          </button>
        </div>
      </div>

      {/* Safety Compliance Banner */}
      <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="text-purple-950 dark:text-purple-200 leading-relaxed">
          <strong>
            {isRu
              ? 'Защита коммерческой тайны активна:'
              : isEs
              ? 'Protección de Secreto Comercial Activa:'
              : 'Trade Secret Shield Active:'}
          </strong>{' '}
          {isRu
            ? 'ИИ обучен строго избегать раскрытия пекарских процентов, точных граммовок, технологических температур Шелка и формул смешивания. В фокусе — терруар Самора, партнерство с Шуар, технология FMAD, живые антоцианы и чистая энергия без тошноты.'
            : isEs
            ? 'El modelo de IA está configurado para no revelar porcentajes de formulación, gramos exactos ni temperaturas críticas del melanger, enfocándose en el terroir de Zamora, comunidades Shuar, tecnología FMAD y digestión limpia.'
            : 'The AI model is strictly instructed to keep formulation percentages, gram weights, and exact melanger calibrations confidential, focusing exclusively on terroir, living flavanols, FMAD technology, and digestive comfort.'}
        </div>
      </div>

      {/* Control Panels: Platform, Mood, Angle */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        {/* Platform Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
            {isRu ? '1. Платформа публикации:' : isEs ? '1. Plataforma de Publicación:' : '1. Target Platform:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              {
                id: 'instagram' as const,
                label: 'Instagram',
                icon: Instagram,
                sub: isRu ? 'Визуальный сторителлинг' : isEs ? 'Storytelling visual' : 'Visual Story',
              },
              {
                id: 'telegram' as const,
                label: 'Telegram',
                icon: MessageCircle,
                sub: isRu ? 'Биохакинг канал' : isEs ? 'Canal de Biohacking' : 'Channel post',
              },
              {
                id: 'linkedin' as const,
                label: 'LinkedIn',
                icon: Linkedin,
                sub: isRu ? 'B2B & Инновации' : isEs ? 'B2B e Innovación' : 'B2B & FoodTech',
              },
              {
                id: 'newsletter' as const,
                label: 'Email Memo',
                icon: Mail,
                sub: isRu ? 'Закрытый клуб' : isEs ? 'Club Privado' : 'Private Memo',
              },
            ].map((p) => {
              const Icon = p.icon;
              const isActive = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-all text-left ${
                    isActive
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <Icon className="w-4 h-4" />
                    <span>{p.label}</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-normal">{p.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mood & Tone Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
            {isRu ? '2. Настроение и тональность:' : isEs ? '2. Estado de Ánimo y Tono:' : '2. Voice & Tone:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              {
                id: 'biohacking' as const,
                label: isRu ? 'Научный биохакинг' : isEs ? 'Biohacking Científico' : 'Scientific Biohack',
                sub: isRu ? 'Эпикатехин, eNOS, фокус' : isEs ? 'Epicatequina, eNOS, foco' : 'eNOS, flavanols, clarity',
              },
              {
                id: 'ceremonial' as const,
                label: isRu ? 'Церемониальный' : isEs ? 'Ceremonial Profundo' : 'Ceremonial & Soul',
                sub: isRu ? 'Глубина, тепло, сердце' : isEs ? 'Calidez, apertura, alma' : 'Warmth, grounding, flow',
              },
              {
                id: 'luxury' as const,
                label: isRu ? 'Высокий люкс' : isEs ? 'Alta Gama / Lujo' : 'Haute Luxury',
                sub: isRu ? 'Grand Cru терруар 1200м' : isEs ? 'Terroir Grand Cru 1200m' : 'Grand Cru, 1,200m altitude',
              },
              {
                id: 'ancestral' as const,
                label: isRu ? 'Шуар Сторителлинг' : isEs ? 'Herencia Ancestral Shuar' : 'Ancestral Shuar',
                sub: isRu ? 'Чакра-агролесоводство' : isEs ? 'Agroforestería en chackras' : 'Amazonian Chakra forests',
              },
            ].map((mItem) => (
              <button
                key={mItem.id}
                type="button"
                onClick={() => setMood(mItem.id)}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition-all text-left ${
                  mood === mItem.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                }`}
              >
                <span className="font-bold">{mItem.label}</span>
                <span className="text-[10px] opacity-80 font-normal">{mItem.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Angle & Core Message Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
            {isRu ? '3. Главный посыл и акцент:' : isEs ? '3. Enfoque y Mensaje Central:' : '3. Core Narrative Angle:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
            {[
              {
                id: 'no_nausea' as const,
                label: isRu ? 'Вход без тошноты' : isEs ? 'Entrada sin náuseas' : 'Zero-Nausea Uptake',
                desc: isRu ? 'Симпорт SGLT1 вместо спазма' : isEs ? 'SGLT1 suave y rápido' : 'SGLT1 rapid gentle absorption',
              },
              {
                id: 'living_purple' as const,
                label: isRu ? 'Живой фиолетовый FMAD' : isEs ? 'Púrpura Vivo FMAD' : 'Living FMAD Purple',
                desc: isRu ? 'Без ферментации и обжарки' : isEs ? 'Sin fermentación ni tostado' : 'Unfermented living flavanols',
              },
              {
                id: 'theobromine_flow' as const,
                label: isRu ? 'Теоброминовый поток' : isEs ? 'Flujo de Teobromina' : 'Theobromine Flow',
                desc: isRu ? 'Без кофеинового спада' : isEs ? 'Energía limpia sin bajón' : 'No crash, vascular expansion',
              },
              {
                id: 'high_altitude' as const,
                label: isRu ? 'Высокогорный щит 1200м' : isEs ? 'Escudo de Altura 1200m' : '1,200m Terroir Shield',
                desc: isRu ? 'УФ-стресс и флаванолы' : isEs ? 'Estrés UV y antioxidantes' : 'UV stress triggers flavanols',
              },
              {
                id: 'private_allocation' as const,
                label: isRu ? 'Закрытая аллокация' : isEs ? 'Asignación Privada' : 'Private Allocation',
                desc: isRu ? 'Лимитированный тираж' : isEs ? 'Reserva de lote limitada' : 'Exclusive reserve batch',
              },
            ].map((aItem) => (
              <button
                key={aItem.id}
                type="button"
                onClick={() => setAngle(aItem.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition-all text-left ${
                  angle === aItem.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                }`}
              >
                <span className="font-bold text-xs">{aItem.label}</span>
                <span className="text-[10px] opacity-80">{aItem.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Post Stage & Mockup Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              {isRu ? 'Сгенерированный пост' : isEs ? 'Texto Generado' : 'Generated Copy'} ({platform.toUpperCase()})
            </span>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>{wordCount} {isRu ? 'слов' : isEs ? 'palabras' : 'words'}</span>
              <span>•</span>
              <span>{charCount} {isRu ? 'символов' : isEs ? 'caracteres' : 'chars'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{isRu ? 'Регенерировать' : isEs ? 'Regenerar' : 'Regenerate'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>
                {copied
                  ? isRu
                    ? 'Скопировано!'
                    : isEs
                    ? '¡Copiado!'
                    : 'Copied!'
                  : isRu
                  ? 'Скопировать'
                  : isEs
                  ? 'Copiar Texto'
                  : 'Copy Text'}
              </span>
            </button>
          </div>
        </div>

        {/* Text Area / Render */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  {isRu
                    ? 'Генерация через Gemini...'
                    : isEs
                    ? 'Generando vía Gemini...'
                    : 'Generating via Gemini...'}
                </span>
              </div>
            </div>
          )}

          <textarea
            rows={14}
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            className="w-full text-xs font-mono p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
};
