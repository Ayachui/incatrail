"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Tag,
  Download,
  Copy,
  Check,
  Scale,
  Type,
  Eye,
  EyeOff,
  RotateCcw,
  Calendar,
  AlertTriangle,
  Building,
  FileText,
  Sparkles,
  ClipboardList,
  Layers,
  Box,
} from 'lucide-react';
import { Language, Recipe } from '@/lib/lab/types';
import { FormulationCalculations, CalculatedItem } from '@/lib/lab/utils/bioSynergyEngine';
import { calculateNutritionFacts } from '@/lib/lab/utils/nutritionEngine';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface LabelViewProps {
  recipe: Recipe;
  formulation: FormulationCalculations;
  language: Language;
}

export const LabelView: React.FC<LabelViewProps> = ({ recipe, formulation, language }) => {
  const t = TRANSLATIONS[language];
  const isRu = language === 'ru';
  const isEs = language === 'es';

  // 1. Net Weight of Package (Independent from Serving Size)
  const [netWeightGrams, setNetWeightGrams] = useState<number>(() => {
    const saved = localStorage.getItem('inca_lab_label_net_weight');
    return saved ? parseFloat(saved) || 100 : 100;
  });
  const [customNetWeightInput, setCustomNetWeightInput] = useState<string>(netWeightGrams.toString());

  // 2. Serving Size for Nutrition Facts
  const [servingSize, setServingSize] = useState<number>(30);
  const [customServingInput, setCustomServingInput] = useState<string>('30');

  // 3. Custom Product Name
  const [customTitle, setCustomTitle] = useState<string>('');
  const [showActiveBioComplex, setShowActiveBioComplex] = useState<boolean>(true);

  // 4. Production Date & Best Before
  const todayIso = new Date().toISOString().split('T')[0];
  const [mfgDate, setMfgDate] = useState<string>(todayIso);

  // Copy status feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active product name: custom or recipe name in current language
  const activeProductName = useMemo(() => {
    if (customTitle.trim()) return customTitle.trim();
    if (isEs) return recipe.nameEs || recipe.nameEn;
    if (isRu) return recipe.nameRu;
    return recipe.nameEn;
  }, [customTitle, recipe, isEs, isRu]);

  // Calculate servings per container from Net Weight / Serving Size
  const servingsCount = Math.max(1, Math.round(netWeightGrams / servingSize));

  const facts = calculateNutritionFacts(formulation, servingSize);

  // Format date helper: returns DD.MM.YYYY and Best Before (2 years later)
  const dateInfo = useMemo(() => {
    try {
      const parts = mfgDate.split('-');
      const year = parseInt(parts[0], 10);
      const month = parts[1];
      const day = parts[2];
      const mfgFormatted = `${day}.${month}.${year}`;
      const expYear = year + 2;
      const expFormatted = `${day}.${month}.${expYear}`;
      return { mfg: mfgFormatted, exp: expFormatted, batch: `LOT-${year}-${recipe.code}` };
    } catch (e) {
      return { mfg: '05.11.2026', exp: '05.11.2028', batch: `LOT-2026-${recipe.code}` };
    }
  }, [mfgDate, recipe.code]);

  // CRITICAL FIX: Only ingredients that are ACTUALLY IN THIS RECIPE with weight > 0
  const actualRecipeIngredients = useMemo(() => {
    return formulation.items
      .filter((item) => item.weightGrams > 0.01 && item.bakersPercentage > 0)
      .sort((a, b) => b.weightGrams - a.weightGrams);
  }, [formulation.items]);

  // Localized ingredient names
  const getIngredientLabelName = (item: CalculatedItem, lang: Language): string => {
    const id = item.ingredient.id;
    if (lang === 'es') {
      if (id === 'cacao_paste') return 'pasta de cacao fino de aroma 100% Cacao Nacional no fermentado (Ecuador, molienda a piedra 18 µm)';
      if (id === 'panela') return 'panela de caña orgánica sin refinar';
      if (id === 'cacao_butter') return 'manteca de cacao virgen prensada en frío (FMAD)';
      if (id === 'sea_salt') return 'sal marina artesanal';
      if (id === 'black_pepper') return 'pimienta negra amazónica';
      if (id === 'mushrooms') return 'polvo fúngico adaptogénico';
      if (id === 'hibiscus') return 'flor de jamaica (hibisco)';
      if (id === 'turmeric') return 'cúrcuma orgánica';
      if (id === 'ginger') return 'jengibre amazónico';
      if (id === 'maca') return 'maca andina gelatinizada';
      if (id === 'guayusa') return 'hoja de guayusa amazónica';
      if (id === 'vanilla') return 'vainilla en vaina Bourbon';
      if (id === 'ishpingo') return 'ishpingo (canela amazónica)';
      if (id === 'moringa') return 'moringa silvestre';
      if (id === 'aji_chili') return 'ají amazónico';
      if (id === 'copaiba') return 'aceite puro de copaiba';
      if (id === 'milk_powder') return 'leche entera en polvo 26% materia grasa';
      return item.ingredient.nameEs || item.ingredient.nameEn;
    } else if (lang === 'en') {
      if (id === 'cacao_paste') return '100% raw unfermented purple Cacao Nacional paste (Ecuador, 18 µm stone-milled with intact veleta)';
      if (id === 'panela') return 'organic unrefined Amazonian panela cane sugar';
      if (id === 'cacao_butter') return 'cold-pressed native cocoa butter (FMAD)';
      if (id === 'sea_salt') return 'artisan sea salt';
      if (id === 'black_pepper') return 'Amazonian black pepper';
      if (id === 'mushrooms') return 'adaptogenic mushroom micro-powder';
      if (id === 'hibiscus') return 'hibiscus flower (Flor de Jamaica)';
      if (id === 'turmeric') return 'organic turmeric root';
      if (id === 'ginger') return 'Amazonian ginger';
      if (id === 'maca') return 'Andean gelatinized maca';
      if (id === 'guayusa') return 'Amazonian guayusa leaf';
      if (id === 'vanilla') return 'pure Bourbon vanilla';
      if (id === 'ishpingo') return 'Amazonian ishpingo (wild cinnamon)';
      if (id === 'moringa') return 'wild moringa leaf';
      if (id === 'aji_chili') return 'Amazonian aji chili';
      if (id === 'copaiba') return 'pure copaiba resin oil';
      if (id === 'milk_powder') return 'whole milk powder (26% milkfat)';
      return item.ingredient.nameEn;
    } else {
      if (id === 'cacao_paste') return 'паста из фиолетовых бобов какао Cacao Nacional 100% неферментированная (Эквадор, помол 18 мкм с цельной веллой)';
      if (id === 'panela') return 'нерафинированный тростниковый сахар панела органический';
      if (id === 'cacao_butter') return 'масло какао недезодорированное прямого холодного отжима (FMAD)';
      if (id === 'sea_salt') return 'соль морская садочная';
      if (id === 'black_pepper') return 'черный перец амазонский';
      if (id === 'mushrooms') return 'микропудра адаптогенных грибов';
      if (id === 'hibiscus') return 'цветки гибискуса (каркаде)';
      if (id === 'turmeric') return 'корень куркумы органический';
      if (id === 'ginger') return 'имбирь амазонский';
      if (id === 'maca') return 'мака перуанская';
      if (id === 'guayusa') return 'лист амазонской гуаюсы';
      if (id === 'vanilla') return 'стручковая ваниль Бурбон';
      if (id === 'ishpingo') return 'дикая корица ишпинго';
      if (id === 'moringa') return 'лист дикорастущей моринги';
      if (id === 'aji_chili') return 'перец ахи амазонский';
      if (id === 'copaiba') return 'масло смолы копайба';
      if (id === 'milk_powder') return 'молоко цельное сухое 26% жирности';
      return item.ingredient.nameRu;
    }
  };

  const ingredientsText = useMemo(() => {
    const list = actualRecipeIngredients.map((i) => getIngredientLabelName(i, language));
    if (isEs) {
      return `Ingredientes: ${list.join(', ')}. Contiene mínimo ${formulation.totalCacaoPercentage.toFixed(0)}% de sólidos totales de cacao fino de aroma.`;
    } else if (isRu) {
      return `Состав: ${list.join(', ')}. Общее содержание сухого остатка какао — не менее ${formulation.totalCacaoPercentage.toFixed(0)}%.`;
    } else {
      return `Ingredients: ${list.join(', ')}. Contains minimum ${formulation.totalCacaoPercentage.toFixed(0)}% total cacao solids.`;
    }
  }, [actualRecipeIngredients, formulation.totalCacaoPercentage, language, isEs, isRu]);

  // Subtitle / Descriptor
  const subtitleText = useMemo(() => {
    if (isEs) {
      return '100% Matriz viva de semilla amazónica sin tostar ni fermentar. Deshidratación al vacío FMAD. Molienda en piedra a 18 µm con veleta intacta.';
    } else if (isRu) {
      return '100% Живая амазонская матрица семени без обжарки и брожения. Вакуумная дегидратация FMAD. Каменный помол 18 мкм с цельной веллой.';
    } else {
      return '100% Living Amazonian seed matrix without roasting or fermentation. FMAD vacuum dehydration. 18 µm stone-milled with intact veleta.';
    }
  }, [isEs, isRu]);

  // Net Weight Text (Independently Set)
  const netWeightText = useMemo(() => {
    const oz = (netWeightGrams / 28.35).toFixed(1);
    if (isEs) return `Peso Neto: ${netWeightGrams} g (${oz} oz)`;
    if (isRu) return `Масса нетто: ${netWeightGrams} г (${oz} oz)`;
    return `Net Wt: ${netWeightGrams} g (${oz} oz)`;
  }, [netWeightGrams, isEs, isRu]);

  // Storage and Date Text
  const dateAndStorageText = useMemo(() => {
    if (isEs) {
      return `Fecha de elaboración: ${dateInfo.mfg}\nConsumir preferentemente antes de: 24 meses (2 años) desde la fecha de fabricación.\nFecha de vencimiento: ${dateInfo.exp}\nNúmero de lote: ${dateInfo.batch}\nCondiciones de conservación: Conservar entre 14°C y 18°C en lugar fresco y seco, con humedad relativa inferior al 65%, protegido de la luz solar directa y olores extraños.`;
    } else if (isRu) {
      return `Дата изготовления: ${dateInfo.mfg}\nСрок годности: 24 месяца (2 года) от даты производства.\nГоден до: ${dateInfo.exp}\nНомер партии: ${dateInfo.batch}\nУсловия хранения: Хранить при температуре от +14°C до +18°C и относительной влажности воздуха не более 65% вдали от прямых солнечных лучей и посторонних запахов.`;
    } else {
      return `Production Date: ${dateInfo.mfg}\nBest Before: 24 months (2 years) from manufacturing date.\nExpiry Date: ${dateInfo.exp}\nBatch Number: ${dateInfo.batch}\nStorage: Store at 14°C–18°C (57°F–64°F) in a dry, dark place below 65% relative humidity away from strong odors.`;
    }
  }, [dateInfo, isEs, isRu]);

  // Warnings & Allergen Precautions
  const containsDairy = actualRecipeIngredients.some((i) => i.ingredient.category === 'dairy');
  const warningsText = useMemo(() => {
    if (isEs) {
      return `Advertencias: Alto contenido de teobromina natural y antioxidantes monoméricos (-)-epicatequina. Porción recomendada: 15–25 g. No recomendado para menores de 12 años, personas con hipersensibilidad a los componentes, ni durante el embarazo o lactancia sin supervisión médica. Tóxico para mascotas (perros y gatos).\nAlérgenos: ${containsDairy ? 'Contiene derivados lácteos y lactosa.' : 'Libre de gluten, soya, lactosa y OMG. Procesado en equipo exclusivo sin trazas de frutos secos.'}`;
    } else if (isRu) {
      return `Предостережения: Содержит высокую концентрацию природного теобромина и мономерных антиоксидантов (-)-эпикатехина. Рекомендуемая порция: 15–25 г. Не рекомендуется лицам с индивидуальной непереносимостью компонентов, детям до 12 лет, а также женщинам в период беременности и лактации без консультации специалиста. Не скармливать домашним животным (теобромин опасен для собак и кошек).\nАллергены: ${containsDairy ? 'Содержит молочный белок и лактозу.' : 'Не содержит глютена, сои, лактозы и ГМО. Произведено на моно-оборудовании без следов орехов.'}`;
    } else {
      return `Precautions: Contains high natural levels of theobromine and monomeric (-)-epicatechin. Recommended serving: 15–25g. Not recommended for children under 12, pregnant or nursing individuals without professional guidance, or those sensitive to theobromine. Toxic to pets (dogs and cats).\nAllergens: ${containsDairy ? 'Contains milk protein and lactose.' : 'Free of gluten, soy, lactose, dairy, and GMOs. Processed on dedicated peanut/tree-nut free equipment.'}`;
    }
  }, [containsDairy, isEs, isRu]);

  // Manufacturer & Origin Credentials
  const manufacturerText = useMemo(() => {
    if (isEs) {
      return `Fabricado y distribuido por: Inca Trail Foods S.A.\nOrigen y planta: Parroquia Napurak, Cantón Zamora, Zamora-Chinchipe, Ecuador.\nSitio web: incatrailfoods.com • Contacto: info@incatrailfoods.com\nOrigen Ético: Alianza Directa con Comunidades Indígenas Shuar • Agroforestería en Chackras Ancestrales.`;
    } else if (isRu) {
      return `Изготовитель / Произведено по заказу: Inca Trail Foods S.A.\nАдрес производства: Parroquia Napurak, Cantón Zamora, Zamora-Chinchipe, Ecuador (Эквадор).\nОфициальный сайт: incatrailfoods.com • Контакты: info@incatrailfoods.com\nСтандарты: Прямое партнерство с коренными общинами Шуар • Дикоросы и органические чакры.`;
    } else {
      return `Manufactured for & Distributed by: Inca Trail Foods S.A.\nOrigin Address: Napurak Parish, Cantón Zamora, Zamora-Chinchipe, Ecuador.\nWebsite: incatrailfoods.com • Contact: info@incatrailfoods.com\nEthical Sourcing: Direct Fair Partnership with Indigenous Shuar Communities • Ancient Chakra Agroforestry.`;
    }
  }, [isEs, isRu]);

  // Marketing Story
  const marketingStoryText = useMemo(() => {
    if (isEs) {
      return `Dossier del Producto: Cacao Nacional morado ancestral recolectado en los bosques nublados de Zamora-Chinchipe, Ecuador (>1,000 m s.n.m.). Procesado en menos de 3 horas mediante deshidratación al vacío FMAD a baja temperatura sin tostado ni fermentación espontánea, preservando los pigmentos violáceos de antocianinas y 63.5 mg/g de flavanoles nativos. Formulado para una suave apertura vascular, energía sostenida y claridad mental sin caídas de cafeína ni molestias gástricas.`;
    } else if (isRu) {
      return `О продукте: Редчайшее амазонское какао Cacao Nacional из реликтовых чакр провинции Самора-Чинчипе (высота свыше 1000 м). Благодаря технологии вакуумной дегидратации FMAD бобы перерабатываются в течение 3 часов после сбора урожая, минуя обжарку и спонтанное брожение. Это сохраняет природный королевский фиолетовый пигмент антоцианов и 63.5 мг/г нативных флаванолов. Формула калибрована для мягкого расширения капилляров, бодрости и спокойной ментальной ясности без кофеинового спада и чувства тошноты.`;
    } else {
      return `Product Dossier: Ancient unfermented purple Cacao Nacional sourced from high-altitude Amazonian cloud forests in Zamora-Chinchipe, Ecuador (>1,000m a.s.l.). Processed within 3 hours via low-temperature FMAD vacuum dehydration without roasting or fermentation, preserving the vibrant royal purple anthocyanins and 63.5 mg/g native flavanols. Engineered for smooth peripheral circulation, expanded cognitive presence, and lasting focus without caffeine crashes or stomach distress.`;
    }
  }, [isEs, isRu]);

  const fullCompositeLabelText = `========================================
${activeProductName.toUpperCase()}
${subtitleText}
========================================
${netWeightText}

${dateAndStorageText}

${ingredientsText}

${warningsText}

${manufacturerText}

PACKAGING STORY:
${marketingStoryText}
========================================`;

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleNetWeightChange = (val: number) => {
    const valid = Math.max(1, Math.min(5000, val));
    setNetWeightGrams(valid);
    setCustomNetWeightInput(valid.toString());
    localStorage.setItem('inca_lab_label_net_weight', valid.toString());
  };

  const handleServingSizeChange = (val: number) => {
    const valid = Math.max(1, Math.min(1000, val));
    setServingSize(valid);
    setCustomServingInput(valid.toString());
  };

  // Canvas Drawing with Exact Vertical Rhythm (NO OVERLAPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 960; // 960x960 square canvas
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Outer Border
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, size - 60, size - 60);

    const left = 60;
    const right = size - 60;
    const width = right - left;

    // 1. Brand Header
    let y = 75;
    ctx.fillStyle = '#6B21A8';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('INCA TRAIL FOODS • CACAO ZAMORA', left, y);
    y += 32;

    // 2. Product Title
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
    const displayTitle =
      activeProductName.length > 38 ? activeProductName.slice(0, 38) + '...' : activeProductName;
    ctx.fillText(displayTitle, left, y);
    y += 20;

    // 3. Hairline Divider
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    y += 48;

    // 4. Main Nutrition Facts Header
    const fdaHeaderText = isEs
      ? 'Información Nutricional'
      : isRu
      ? 'Пищевая ценность'
      : 'Nutrition Facts';

    ctx.fillStyle = '#000000';
    ctx.font = isEs
      ? '900 52px "Plus Jakarta Sans", sans-serif'
      : isRu
      ? '900 56px "Plus Jakarta Sans", sans-serif'
      : '900 64px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(fdaHeaderText, left, y);
    y += 32;

    // 5. Servings per Container (Calculated from Net Weight / Serving Size)
    const servingsPerContainerLabel = isEs
      ? `${servingsCount} porciones por envase (${netWeightGrams}g neto)`
      : isRu
      ? `${servingsCount} порций в упаковке (${netWeightGrams}г нетто)`
      : `${servingsCount} servings per container (${netWeightGrams}g net)`;

    ctx.font = '500 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(servingsPerContainerLabel, left, y);
    y += 28;

    // 6. Serving Size Line
    const servingSizeLabel = isEs
      ? 'Tamaño por porción'
      : isRu
      ? 'Размер порции'
      : 'Serving size';

    ctx.font = 'bold 21px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(servingSizeLabel, left, y);
    ctx.textAlign = 'right';
    ctx.fillText(
      `${facts.servingSizeGrams}g (${(facts.servingSizeGrams / 28.35).toFixed(1)} oz)`,
      right,
      y
    );
    ctx.textAlign = 'left';
    y += 16;

    // 7. HEAVY BAR (Thick 14px bar with generous bottom margin to prevent collision)
    ctx.fillStyle = '#000000';
    ctx.fillRect(left, y, width, 14);
    y += 14 + 22; // Safely moves below the heavy bar

    // 8. "Amount per serving" line
    const amountPerServingText = isEs
      ? 'Cantidad por porción'
      : isRu
      ? 'Количество на порцию'
      : 'Amount per serving';

    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(amountPerServingText, left, y);
    y += 42; // Generous space for 48px Calories title

    // 9. "Calories" Row
    const caloriesText = isEs ? 'Calorías' : isRu ? 'Калории' : 'Calories';
    ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(caloriesText, left, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${facts.calories}`, right, y);
    ctx.textAlign = 'left';
    y += 20; // Move below Calories descenders

    // 10. MEDIUM BAR
    ctx.fillStyle = '#000000';
    ctx.fillRect(left, y, width, 6);
    y += 6 + 22;

    // 11. % Daily Value Header
    const dailyValueHeader = isEs
      ? '% Valor Diario*'
      : isRu
      ? '% Дневная норма*'
      : '% Daily Value*';

    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(dailyValueHeader, right, y);
    ctx.textAlign = 'left';
    y += 12;

    // 12. Nutrient Rows (Consistent row height = 28px)
    const drawNutrientRow = (
      label: string,
      value: string,
      dv: string,
      indent: boolean = false,
      bold: boolean = false
    ) => {
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();

      y += 20; // text baseline inside row
      ctx.fillStyle = '#000000';
      ctx.font = bold
        ? 'bold 17px "Plus Jakarta Sans", sans-serif'
        : '500 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${indent ? '    ' : ''}${label} `, left, y);

      const labelMetrics = ctx.measureText(`${indent ? '    ' : ''}${label} `);
      ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(value, left + labelMetrics.width, y);

      if (dv) {
        ctx.textAlign = 'right';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(dv, right, y);
        ctx.textAlign = 'left';
      }
      y += 8; // spacing below baseline to next line
    };

    drawNutrientRow(
      isEs ? 'Grasa Total' : isRu ? 'Жиры' : 'Total Fat',
      `${facts.totalFatG}g`,
      `${Math.round((facts.totalFatG / 78) * 100)}%`,
      false,
      true
    );
    drawNutrientRow(
      isEs ? 'Grasa Saturada' : isRu ? 'Насыщенные жиры' : 'Saturated Fat',
      `${facts.saturatedFatG}g`,
      `${Math.round((facts.saturatedFatG / 20) * 100)}%`,
      true,
      false
    );
    drawNutrientRow(
      isEs ? 'Colesterol' : isRu ? 'Холестерин' : 'Cholesterol',
      `${facts.cholesterolMg}mg`,
      `${Math.round((facts.cholesterolMg / 300) * 100)}%`,
      false,
      true
    );
    drawNutrientRow(
      isEs ? 'Sodio' : isRu ? 'Натрий' : 'Sodium',
      `${facts.sodiumMg}mg`,
      `${Math.round((facts.sodiumMg / 2300) * 100)}%`,
      false,
      true
    );
    drawNutrientRow(
      isEs ? 'Carbohidratos Totales' : isRu ? 'Углеводы' : 'Total Carbohydrate',
      `${facts.totalCarbsG}g`,
      `${Math.round((facts.totalCarbsG / 275) * 100)}%`,
      false,
      true
    );
    drawNutrientRow(
      isEs ? 'Fibra Dietética' : isRu ? 'Пищевые волокна' : 'Dietary Fiber',
      `${facts.dietaryFiberG}g`,
      `${Math.round((facts.dietaryFiberG / 28) * 100)}%`,
      true,
      false
    );
    drawNutrientRow(
      isEs ? 'Azúcares Totales' : isRu ? 'Сахара' : 'Total Sugars',
      `${facts.totalSugarsG}g`,
      '',
      true,
      false
    );
    drawNutrientRow(
      isEs ? 'Incluye Azúcares Añadidos' : isRu ? 'Включая добавленный сахар' : 'Includes Added Sugars',
      `${facts.addedSugarsG}g`,
      `${Math.round((facts.addedSugarsG / 50) * 100)}%`,
      true,
      false
    );
    drawNutrientRow(
      isEs ? 'Proteínas' : isRu ? 'Белки' : 'Protein',
      `${facts.proteinG}g`,
      '',
      false,
      true
    );

    // 13. Thick Bar before minerals
    y += 4;
    ctx.fillStyle = '#000000';
    ctx.fillRect(left, y, width, 8);
    y += 8 + 18;

    // 14. Minerals line
    ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#334155';
    if (isEs) {
      ctx.fillText(
        `Hierro ${facts.ironMg}mg (${Math.round((facts.ironMg / 18) * 100)}% VD)   •   Potasio ${facts.potassiumMg}mg (${Math.round((facts.potassiumMg / 4700) * 100)}% VD)`,
        left,
        y
      );
      y += 18;
      ctx.fillText(
        `Magnesio ${facts.magnesiumMg}mg (${Math.round((facts.magnesiumMg / 420) * 100)}% VD)   •   Calcio ${facts.calciumMg}mg`,
        left,
        y
      );
    } else if (isRu) {
      ctx.fillText(
        `Железо ${facts.ironMg}мг (${Math.round((facts.ironMg / 18) * 100)}% ДН)   •   Калий ${facts.potassiumMg}мг (${Math.round((facts.potassiumMg / 4700) * 100)}% ДН)`,
        left,
        y
      );
      y += 18;
      ctx.fillText(
        `Магний ${facts.magnesiumMg}мг (${Math.round((facts.magnesiumMg / 420) * 100)}% ДН)   •   Кальций ${facts.calciumMg}мг`,
        left,
        y
      );
    } else {
      ctx.fillText(
        `Iron ${facts.ironMg}mg (${Math.round((facts.ironMg / 18) * 100)}% DV)   •   Potassium ${facts.potassiumMg}mg (${Math.round((facts.potassiumMg / 4700) * 100)}% DV)`,
        left,
        y
      );
      y += 18;
      ctx.fillText(
        `Magnesium ${facts.magnesiumMg}mg (${Math.round((facts.magnesiumMg / 420) * 100)}% DV)   •   Calcium ${facts.calciumMg}mg`,
        left,
        y
      );
    }
    y += 20;

    // 15. Bioactive Box or Footnote
    if (showActiveBioComplex) {
      ctx.fillStyle = '#F5F3FF';
      ctx.fillRect(left, y, width, 84);
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.strokeRect(left, y, width, 84);

      ctx.fillStyle = '#5B21B6';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        isEs
          ? 'COMPLEJO BIOACTIVO NATIVO (FMAD CACAO NACIONAL MORADO)'
          : isRu
          ? 'НАТИВНЫЙ БИОАКТИВНЫЙ КОМПЛЕКС (FMAD PURPLE NACIONAL)'
          : 'NATIVE FLAVANOL COMPLEX (FMAD PURPLE NACIONAL)',
        left + 14,
        y + 22
      );

      ctx.fillStyle = '#1E1B4B';
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillText(
        isEs
          ? `(-)-Epicatequina (DP1): ${facts.monomericEpicatechinMg} mg   •   Flavanoles Totales: ${facts.totalFlavanolsMg} mg`
          : isRu
          ? `(-)-Эпикатехин (DP1): ${facts.monomericEpicatechinMg} мг   •   Общие флаванолы: ${facts.totalFlavanolsMg} мг`
          : `(-)-Epicatechin (DP1): ${facts.monomericEpicatechinMg} mg   •   Total Flavanols: ${facts.totalFlavanolsMg} mg`,
        left + 14,
        y + 45
      );
      ctx.fillText(
        isEs
          ? `Teobromina: ${facts.theobromineMg} mg   •   Factor Farmacocinético: ${facts.effectiveBioAvailabilityFactor}x`
          : isRu
          ? `Теобромин: ${facts.theobromineMg} мг   •   Множитель биодоступности: ${facts.effectiveBioAvailabilityFactor}x`
          : `Theobromine: ${facts.theobromineMg} mg   •   Pharmacokinetic Factor: ${facts.effectiveBioAvailabilityFactor}x`,
        left + 14,
        y + 67
      );
    } else {
      ctx.font = '400 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(
        isEs
          ? '* El % Valor Diario (VD) indica cuánto contribuye un nutriente en una porción a una dieta diaria de 2000 calorías.'
          : isRu
          ? '* Процент дневной нормы указывает на долю питательного вещества в ежедневном рационе из 2000 ккал.'
          : '* The % Daily Value (DV) tells you how much a nutrient in a serving contributes to a daily 2,000 calorie diet.',
        left,
        y + 16
      );
    }
  }, [
    activeProductName,
    facts,
    netWeightGrams,
    servingSize,
    servingsCount,
    language,
    showActiveBioComplex,
    isEs,
    isRu,
  ]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const safeName = activeProductName.replace(/[^a-zA-Z0-9а-яА-Я_-]/g, '_');
    link.download = `IncaTrail_${safeName}_${netWeightGrams}g_${language}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Fast Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.labelTitle} ({language.toUpperCase()})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEs
                  ? 'Textos listos para imprenta y empaque + Generador cuadrado FDA PNG 1:1 sin desajustes'
                  : isRu
                  ? 'Основные тексты этикетки для копирования упаковщику + Квадратный FDA экспорт PNG'
                  : 'Ready-to-copy packaging texts for printers + Pristine 1:1 Square FDA PNG generator'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopyText(fullCompositeLabelText, 'all')}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-semibold shadow-sm transition-colors"
            >
              {copiedKey === 'all' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <ClipboardList className="w-4 h-4 text-purple-600" />
              )}
              <span>
                {copiedKey === 'all'
                  ? isEs
                    ? '¡Todo Copiado!'
                    : isRu
                    ? 'Всё скопировано!'
                    : 'All Copied!'
                  : isEs
                  ? 'Copiar TODOS los textos'
                  : isRu
                  ? 'Скопировать ВСЕ тексты'
                  : 'Copy ALL Texts'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportPngBtn}</span>
            </button>
          </div>
        </div>

        {/* Global Controls: Title Override, Net Weight (Manual), Serving Size, Complex Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Custom Product Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-purple-600" />
              <span>{isEs ? 'Nombre en etiqueta:' : isRu ? 'Название продукта:' : 'Product Name:'}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={isEs ? recipe.nameEs || recipe.nameEn : isRu ? recipe.nameRu : recipe.nameEn}
                className="w-full text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2 px-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              {customTitle && (
                <button
                  type="button"
                  onClick={() => setCustomTitle('')}
                  title="Reset to recipe title"
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Net Weight (Manual Entry & Selector) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-purple-600" />
              <span>{isEs ? 'Peso Neto del envase:' : isRu ? 'Масса нетто упаковки:' : 'Net Weight of Pack:'}</span>
            </label>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">
                {[50, 70, 100, 1000].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleNetWeightChange(w)}
                    className={`px-2 py-1 rounded-md font-bold transition-all ${
                      netWeightGrams === w
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {w >= 1000 ? (isRu ? '1кг' : '1kg') : `${w}${isRu ? 'г' : 'g'}`}
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={customNetWeightInput}
                  onChange={(e) => {
                    setCustomNetWeightInput(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) handleNetWeightChange(val);
                  }}
                  className="w-full text-xs font-mono font-bold text-center py-1.5 px-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Serving Size for Nutrition Facts */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-purple-600" />
              <span>{isEs ? 'Tamaño de porción (Nutrición):' : isRu ? 'Размер разовой порции:' : 'Serving Size (KCAL):'}</span>
            </label>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">
                {[20, 30, 50].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleServingSizeChange(sz)}
                    className={`px-2 py-1 rounded-md font-bold transition-all ${
                      servingSize === sz
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {sz}{isRu ? 'г' : 'g'}
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={customServingInput}
                  onChange={(e) => {
                    setCustomServingInput(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) handleServingSizeChange(val);
                  }}
                  className="w-full text-xs font-mono font-bold text-center py-1.5 px-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Bioactive Complex Toggle */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={showActiveBioComplex}
                onChange={(e) => setShowActiveBioComplex(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span className="flex-1 text-[11px]">
                {isEs ? 'Complejo bioactivo en PNG' : isRu ? 'Блок биокомплекса в PNG' : 'Bioactive Block in PNG'}
              </span>
              {showActiveBioComplex ? (
                <Eye className="w-4 h-4 text-purple-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Main Grid: LEFT = Copyable Packaging Texts, RIGHT = Square PNG Canvas Exporter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Clean, Copyable Label Texts (7 Required Blocks) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>
                {isEs
                  ? 'Textos listos para imprenta y empaque (copia rápida)'
                  : isRu
                  ? 'Тексты для этикетки и типографии (готовые к копированию)'
                  : 'Print & Packaging Texts (Ready to Copy)'}
              </span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {language.toUpperCase()} • {actualRecipeIngredients.length} {isEs ? 'ingredientes activos' : isRu ? 'ингредиентов в рецепте' : 'active ingredients'}
            </span>
          </div>

          {/* 1. Product Name & Subtitle */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-purple-600" />
                <span>1. {isEs ? 'Nombre del producto y descriptor' : isRu ? 'Название продукта и подстрочник' : 'Product Name & Subtitle'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(`${activeProductName}\n${subtitleText}`, 'title')}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                {copiedKey === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'title' ? (isEs ? 'Copiado' : isRu ? 'Скопировано' : 'Copied') : (isEs ? 'Copiar' : isRu ? 'Копировать' : 'Copy')}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 font-sans text-xs">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                {activeProductName}
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {subtitleText}
              </div>
            </div>
          </div>

          {/* 2. Net Weight */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-purple-600" />
                <span>2. {isEs ? 'Peso Neto' : isRu ? 'Вес нетто' : 'Net Weight'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(netWeightText, 'weight')}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                {copiedKey === 'weight' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'weight' ? (isEs ? 'Copiado' : isRu ? 'Скопировано' : 'Copied') : (isEs ? 'Copiar' : isRu ? 'Копировать' : 'Copy')}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{netWeightText}</span>
              <span className="text-[11px] font-normal text-slate-400 font-sans">
                {isEs
                  ? `(${servingsCount} porciones de ${servingSize}g)`
                  : isRu
                  ? `(${servingsCount} порций по ${servingSize}г)`
                  : `(${servingsCount} servings of ${servingSize}g)`}
              </span>
            </div>
          </div>

          {/* 3. Dates & Best Before (2 years) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>3. {isEs ? 'Fechas y conservación (2 años)' : isRu ? 'Даты производства и хранения (2 года)' : 'Manufacturing Date & 2-Year Expiry'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(dateAndStorageText, 'date')}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                {copiedKey === 'date' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'date' ? (isEs ? 'Copiado' : isRu ? 'Скопировано' : 'Copied') : (isEs ? 'Copiar' : isRu ? 'Копировать' : 'Copy')}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-2 text-xs">
              <label className="text-slate-500 font-medium">
                {isEs ? 'Fecha de elaboración:' : isRu ? 'Дата выработки:' : 'Production Date:'}
              </label>
              <input
                type="date"
                value={mfgDate}
                onChange={(e) => setMfgDate(e.target.value)}
                className="text-xs font-mono py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {dateAndStorageText}
            </pre>
          </div>

          {/* 4. Ingredients List (Strictly from Current Recipe) */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>4. {isEs ? 'Lista de ingredientes (del receta actual por orden decreciente)' : isRu ? 'Список ингредиентов (из текущего рецепта по убыванию)' : 'Ingredients List (Current Recipe in Descending Order)'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(ingredientsText, 'ingredients')}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                {copiedKey === 'ingredients' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'ingredients' ? (isEs ? 'Copiado' : isRu ? 'Скопировано' : 'Copied') : (isEs ? 'Copiar' : isRu ? 'Копировать' : 'Copy')}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {ingredientsText}
            </div>
          </div>

          {/* 5. Warnings & Precautions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>5. {isEs ? 'Advertencias y alérgenos' : isRu ? 'Предостережения и аллергены' : 'Precautions & Allergen Statements'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(warningsText, 'warnings')}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                {copiedKey === 'warnings' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'warnings' ? (isEs ? 'Copiado' : isRu ? 'Скопировано' : 'Copied') : (isEs ? 'Copiar' : isRu ? 'Копировать' : 'Copy')}</span>
              </button>
            </div>
            <pre className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/40 font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {warningsText}
            </pre>
          </div>

          {/* 6. Manufacturer Address & Origin */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-purple-600" />
                <span>6. {isEs ? 'Fabricante y origen' : isRu ? 'Адрес и сведения о производителе' : 'Manufacturer & Origin Information'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(manufacturerText, 'mfg')}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                {copiedKey === 'mfg' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'mfg' ? (isEs ? 'Copiado' : isRu ? 'Скопировано' : 'Copied') : (isEs ? 'Copiar' : isRu ? 'Копировать' : 'Copy')}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {manufacturerText}
            </pre>
          </div>

          {/* 7. Marketing Copy for Packaging Back Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>7. {isEs ? 'Texto de marketing para empaque' : isRu ? 'Общий маркетинговый текст о продукте' : 'Product Story / Marketing Copy'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(marketingStoryText, 'story')}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
              >
                {copiedKey === 'story' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'story' ? (isEs ? 'Copiado' : isRu ? 'Скопировано' : 'Copied') : (isEs ? 'Copiar' : isRu ? 'Копировать' : 'Copy')}</span>
              </button>
            </div>
            <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900/40 font-sans text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {marketingStoryText}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Square PNG Exporter (1:1 High-Res 960x960, NO OVERLAPS) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                {isEs ? 'PNG Cuadrado 1:1' : isRu ? 'Квадратный PNG 1:1' : 'Square 1:1 PNG'} ({language.toUpperCase()})
              </span>
              <button
                type="button"
                onClick={handleDownloadPng}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isEs ? 'Descargar PNG' : isRu ? 'Скачать PNG' : 'Download PNG'}</span>
              </button>
            </div>

            {/* High-res Canvas Preview with perfect baseline spacing */}
            <div className="w-full aspect-square rounded-2xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden shadow-lg bg-white">
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
            </div>

            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center space-y-0.5">
              <p className="font-medium">
                {isEs
                  ? `Resolución: 960×960 px (${servingsCount} porciones de ${servingSize}g en ${netWeightGrams}g).`
                  : isRu
                  ? `Разрешение: 960×960 px (${servingsCount} порций по ${servingSize}г в ${netWeightGrams}г).`
                  : `Resolution: 960×960 px (${servingsCount} servings of ${servingSize}g in ${netWeightGrams}g).`}
              </p>
              <p className="text-[10px] text-slate-400">
                {isEs
                  ? 'Diseño FDA calibrado con espaciado vertical estricto sin solapamientos.'
                  : isRu
                  ? 'Разметка FDA выровнена с точными интервалами без наложений строк.'
                  : 'Calibrated FDA layout with pristine vertical rhythm and zero text overlap.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
