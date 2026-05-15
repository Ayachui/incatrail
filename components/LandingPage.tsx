"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Leaf,
  ChevronDown,
  Mountain,
  FlaskConical,
  Sparkles,
  Activity,
  Link as LinkIcon,
  QrCode,
  Camera,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

type Lang = "ru" | "en" | "es";
type FadeDirection = "up" | "down" | "left" | "right";

const FadeIn = ({
  children,
  delay = 0,
  direction = "up",
  duration = 1,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: FadeDirection;
  duration?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = domRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch(direction) {
      case 'up': return 'translateY(40px)';
      case 'down': return 'translateY(-40px)';
      case 'left': return 'translateX(40px)';
      case 'right': return 'translateX(-40px)';
      default: return 'translateY(40px)';
    }
  };

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, transform ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`
      }}
      className="will-change-transform"
    >
      {children}
    </div>
  );
};

// --- Словари переводов ---
const translations = {
  ru: {
    nav: { concept: "Концепция", process: "Процесс", profile: "Профиль", blockchain: "TZNK & Блокчейн", contact: "Связь" },
    hero: { pre: "Абсолют Какао", title1: "Фиолетовое", title2: "Золото", desc: "Мы останавливаем время. Оригинальный Насиональ из Самора Чинчипе, сохранивший первозданную биохимию и цвет истинной природы." },
    phil: { 
      title1: "Секрет цвета:", title2: "Сохранение жизни", 
      p1: "Классическая ферментация какао — это великое искусство. Это прекрасная отрасль, создающая сложный гастрономический профиль элитного шоколада, к которой мы относимся с глубоким уважением.",
      p2: "Однако для проекта «Фиолетовое Золото» мы выбрали принципиально иной путь. Наша цель — не создание шоколадного вкуса через окисление, а крио-фиксация изначальной биохимии растения. Мы отказываемся от ферментации намеренно.",
      p3: "Глубокий фиолетовый срез нашего боба — это визуальный паспорт его нативности. Это абсолютное сохранение оригинальных антоцианов, антиоксидантов и нетронутой молекулярной структуры Cacao Ancestral.",
      f1: "Нативная матрица", f1d: "Отсутствие кислот распада и температурного разрушения молекул.",
      f2: "Биодоступность", f2d: "Максимальный природный уровень эпикатехина и теобромина."
    },
    terroir: {
      pre: "Колыбель какао", title1: "Высокогорье Саморы. Майо-чинчипе.", title2: "Эндемичный какао. Шуарские фермеры.",
      p1: "Самора Чинчипе — место, где более 5000 лет назад культура Майо-Чинчипе впервые прикоснулась к сакральному растению. Это не просто регион, это родина мирового какао.",
      p2: "Наше сырье — это аутентичный сорт Насиональ. Он не выращивается на выжженных солнцем индустриальных плантациях. Он рождается на высоте, в густой тени девственных фруктовых лесов, сохраняя симбиоз с древней экосистемой Амазонии.",
      p3: "Богатая минералами почва, кристальная вода и забота индейцев племени Шуар формируют мощный дух растения, который мы бережно фиксируем в каждом бобе."
    },
    process: {
      title: "Искусство Времени: Правило 10 Часов", desc: "Наш процесс — это ювелирная термодинамическая хирургия. Мы останавливаем окисление навсегда за 10 часов от момента сбора плода в лесу.",
      s1: "Лесной Сбор", d1: "Ручной сбор плодов в диких садах Саморы. Прямая логистика в охлаждаемых контейнерах исключает малейший риск случайного старта ферментации в пути.",
      s2: "Вакуумный Щит (80°C)", d2: "Ошпаривание в вакуумной среде при 80°C (ровно 5 минут). Точечный термический шок денатурирует фермент окисления. Фиолетовый пигмент фиксируется навечно.",
      s3: "Стабилизация (40°C)", d3: "Бережная сушка при 40°C до идеальных 6-8% влажности. Формирование «стеклянного хруста» без потери эфирных масел. Фасовка в вакуум."
    },
    comp: {
      title: "Сравнительная Матрица", desc: "Два разных пути в мире премиального какао: искусство вкуса против науки сохранения жизни.",
      t1Title: "Философия и Процесс", t2Title: "Пищевой и Биохимический Профиль",
      th1: "Параметр", th2: "Индустриальный", th3: "Fine Flavor (Традиция)", th4: "Inca Trail",
      table1: [
        { p: "Ферментация", i: "Массовая (7-10 дней)", f: "Контролируемая (для вкуса)", in: "0 дней. Вакуумный щит." },
        { p: "Термообработка", i: "Жесткая обжарка", f: "Бережная обжарка", in: "Крио-стабилизация (макс 40°C)" },
        { p: "Главная цель", i: "Удешевление, объем", f: "Сложная ароматика, гастрономия", in: "Максимальная биодоступность" }
      ],
      table2: [
        { p: "Цвет (Антоцианы)", i: "Блекло-коричневый (разрушены)", f: "Темно-коричневый (снижены)", in: "Насыщенный Фиолетовый (100% сохранены)" },
        { p: "Кислотность (pH)", i: "Высокая (уксусная, молочная)", f: "Сбалансированная ферментацией", in: "Нативная (кислоты ферментации отсутствуют)" },
        { p: "Риск Микотоксинов", i: "Высокий", f: "Низкий (строгий контроль)", in: "Нулевой (нет среды для плесени)" },
        { p: "Полифенолоксидаза", i: "Активна (идет распад)", f: "Активна (формирование вкуса)", in: "Мгновенно денатурирована" }
      ]
    },
    tznk: {
      pre: "Аутентичность", title1: "Проект TZNK &", title2: "Вечный Блокчейн",
      p1: "Производство фиолетового какао неразрывно связано с проектом TZNK (tzunki.com). Наша работа с индейцами Шуар — это реальная помощь в сохранении лесов Амазонии, уважение к труду общин и защита их наследия.",
      p2: "Массовый рынок скрывает истинное происхождение продукта. Мы внедряем беспрецедентный уровень прозрачности: от момента сбора плода до запечатывания палеты с вакуумными 5-кг упаковками — всё фиксируется на фото и видео.",
      f1: "Визуальный контроль", f1d: "Фиксация каждого этапа: координаты сбора, фермер, вакуумная обработка и фасовка.",
      f2: "Запись в Блокчейн", f2d: "История партии навсегда вписывается в децентрализованный реестр. Данные невозможно подделать.",
      f3: "Цифровой паспорт", f3d: "Каждая упаковка имеет уникальный QR-код, открывающий историю создания именно этого какао."
    },
    usage: {
      title: "Векторы Применения", desc: "Совершенное, готовое к употреблению сырье без необходимости химической фумигации.",
      f1: "Церемониальный Абсолют", f1d: "Лучший в мире какао для сакральных практик. Выращен в древних фруктовых лесах. Отсутствие ферментации сохраняет не только молекулу теобромина, но и оригинальную энергию Амазонии. Идеальный проводник.",
      f2: "Элитное Какао-Масло", f2d: "Отказ от ферментации означает полное отсутствие кислот распада. Результат — кристально чистое какао-масло с деликатнейшим нативным ароматом, идеальное для высокой парфюмерии и косметологии.",
      f3: "Уникальный Порошок", f3d: "База для революционных суперфудов. Яркий фиолетовый цвет, непревзойденный уровень антиоксидантов делают этот продукт функциональным ингредиентом номер один для спортивного и ноотропного питания.",
      f4: "Сырье для Экстрактов", f4d: "Мечта биохакинга. Нативные флавоноиды, не разрушенные бактериями. Вакуумная сушка сохраняет идеальную матрицу для последующей высокотехнологичной экстракции (CO2, спиртовой или водной)."
    },
    contact: {
      title: "Контакты и Партнерство", desc: "Свяжитесь с нами для обсуждения поставок.", loc: "Провинция Самора Чинчипе, Эквадор"
    }
  },
  en: {
    nav: { concept: "Concept", process: "Process", profile: "Profile", blockchain: "TZNK & Blockchain", contact: "Contact" },
    hero: { pre: "The Absolute Cacao", title1: "Purple", title2: "Gold", desc: "We stop time. Original Nacional from Zamora Chinchipe, preserving the primal biochemistry and color of true nature." },
    phil: { 
      title1: "The Secret of Color:", title2: "Preserving Life", 
      p1: "Classic cacao fermentation is a magnificent art. It is a beautiful industry that creates the complex gastronomic profile of elite chocolate, to which we hold the deepest respect.",
      p2: "However, for the 'Purple Gold' project, we chose a fundamentally different path. Our goal is not to create chocolate flavor through oxidation, but the cryo-fixation of the plant's primal biochemistry. We intentionally bypass fermentation.",
      p3: "The deep purple cross-section of our bean is the visual passport of its nativeness. It is the absolute preservation of original anthocyanins, antioxidants, and the untouched molecular structure of Cacao Ancestral.",
      f1: "Native Matrix", f1d: "Absence of decay acids and temperature-induced molecular destruction.",
      f2: "Bioavailability", f2d: "Maximum natural levels of epicatechin and theobromine."
    },
    terroir: {
      pre: "Cradle of Cacao", title1: "Zamora Highlands. Mayo-Chinchipe.", title2: "Endemic cacao. Shuar farmers.",
      p1: "Zamora Chinchipe is where, over 5,000 years ago, the Mayo-Chinchipe culture first touched the sacred plant. It is not just a region; it is the true birthplace of world cacao.",
      p2: "Our raw material is the authentic Nacional variety. It is not grown on sun-scorched industrial plantations. It is born at high altitudes, in the dense shade of virgin fruit forests, maintaining a pure symbiosis with the ancient Amazonian ecosystem.",
      p3: "Mineral-rich soil, crystal water, and the stewardship of the indigenous Shuar people shape the powerful spirit of the plant, which we carefully capture in every bean."
    },
    process: {
      title: "The Art of Time: The 10-Hour Rule", desc: "Our process is meticulous thermodynamic surgery. We stop oxidation forever within 10 hours from the moment the fruit is harvested in the forest.",
      s1: "Forest Harvest", d1: "Manual harvesting in the wild gardens of Zamora. Direct logistics in refrigerated containers eliminates the slightest risk of accidental fermentation starting en route.",
      s2: "Vacuum Shield (80°C)", d2: "Scalding in a vacuum environment at 80°C (exactly 5 minutes). Precise thermal shock denatures the oxidation enzyme. The purple pigment is fixed forever.",
      s3: "Stabilization (40°C)", d3: "Gentle drying at 40°C to an ideal 6-8% moisture content. Formation of a 'glass crunch' without losing essential oils. Vacuum packaging."
    },
    comp: {
      title: "Comparative Matrix", desc: "Two different paths in the world of premium cacao: the art of taste versus the science of preserving life.",
      t1Title: "Philosophy & Process", t2Title: "Nutritional & Biochemical Profile",
      th1: "Parameter", th2: "Industrial", th3: "Fine Flavor (Tradition)", th4: "Inca Trail",
      table1: [
        { p: "Fermentation", i: "Mass scale (7-10 days)", f: "Controlled (for flavor)", in: "0 days. Vacuum shield." },
        { p: "Thermal Processing", i: "Harsh roasting", f: "Gentle roasting", in: "Cryo-stabilization (max 40°C)" },
        { p: "Main Goal", i: "Cost reduction, volume", f: "Complex aromatics, gastronomy", in: "Maximum bioavailability" }
      ],
      table2: [
        { p: "Color (Anthocyanins)", i: "Faded brown (destroyed)", f: "Dark brown (reduced)", in: "Vibrant Purple (100% preserved)" },
        { p: "Acidity (pH)", i: "High (acetic, lactic acids)", f: "Balanced by fermentation", in: "Native (no fermentation acids)" },
        { p: "Mycotoxin Risk", i: "High", f: "Low (strict control)", in: "Zero (no environment for mold)" },
        { p: "Polyphenol Oxidase", i: "Active (decaying)", f: "Active (flavor formation)", in: "Instantly denatured" }
      ]
    },
    tznk: {
      pre: "Authenticity", title1: "Project TZNK &", title2: "Eternal Blockchain",
      p1: "The production of purple cacao is inextricably linked to the TZNK project (tzunki.com). Our work with the Shuar indigenous people is real assistance in preserving the Amazon forests, respecting community labor, and protecting their heritage.",
      p2: "The mass market hides the true origin of the product. We are introducing an unprecedented level of transparency: from the moment the fruit is harvested to the sealing of the pallet with 5 kg vacuum bags — everything is recorded on photo and video.",
      f1: "Visual Control", f1d: "Fixation of each stage: harvest coordinates, farmer identity, vacuum processing, and packaging.",
      f2: "Blockchain Record", f2d: "The batch history is permanently inscribed in a decentralized ledger. Data cannot be forged.",
      f3: "Digital Passport", f3d: "Each package receives a unique QR code revealing the creation history of that exact cacao."
    },
    usage: {
      title: "Application Vectors", desc: "Perfect, ready-to-use raw material without the need for chemical fumigation.",
      f1: "Ceremonial Absolute", f1d: "The world's finest cacao for sacred practices. Grown in ancient fruit forests. The absence of fermentation preserves not only the theobromine molecule but the original energy of the Amazon. The perfect conductor.",
      f2: "Elite Cacao Butter", f2d: "Skipping fermentation means the complete absence of decay acids. The result is crystal clear cacao butter with the most delicate native aroma, ideal for haute perfumery and cosmetology.",
      f3: "Unique Powder", f3d: "The foundation for revolutionary superfoods. Vibrant purple color and unsurpassed antioxidant levels make this product the number one functional ingredient for sports and nootropic nutrition.",
      f4: "Raw Material for Extracts", f4d: "A biohacker's dream. Native flavonoids, undestroyed by bacteria. Vacuum drying preserves the ideal matrix for subsequent high-tech extraction (CO2, alcohol, or water)."
    },
    contact: {
      title: "Contacts & Partnership", desc: "Contact us to discuss supply opportunities.", loc: "Zamora Chinchipe Province, Ecuador"
    }
  },
  es: {
    nav: { concept: "Concepto", process: "Proceso", profile: "Perfil", blockchain: "TZNK & Blockchain", contact: "Contacto" },
    hero: { pre: "El Cacao Absoluto", title1: "Oro", title2: "Púrpura", desc: "Detenemos el tiempo. Nacional original de Zamora Chinchipe, conservando la bioquímica primordial y el color de la verdadera naturaleza." },
    phil: { 
      title1: "El secreto del color:", title2: "Preservando la vida", 
      p1: "La fermentación clásica del cacao es un arte magnífico. Es una hermosa industria que crea el complejo perfil gastronómico del chocolate de élite, a la cual tenemos el más profundo respeto.",
      p2: "Sin embargo, para el proyecto 'Oro Púrpura', elegimos un camino fundamentalmente diferente. Nuestro objetivo no es crear sabor a chocolate mediante la oxidación, sino la criofijación de la bioquímica primordial de la planta. Omitimos intencionalmente la fermentación.",
      p3: "El corte transversal púrpura profundo de nuestro grano es el pasaporte visual de su natividad. Es la preservación absoluta de las antocianinas originales, antioxidantes y la estructura molecular intacta del Cacao Ancestral.",
      f1: "Matriz Nativa", f1d: "Ausencia de ácidos de descomposición y destrucción molecular inducida por temperatura.",
      f2: "Biodisponibilidad", f2d: "Niveles naturales máximos de epicatequina y teobromina."
    },
    terroir: {
      pre: "La Cuna del Cacao", title1: "Tierras Altas de Zamora. Mayo-Chinchipe.", title2: "Cacao endémico. Agricultores Shuar.",
      p1: "Zamora Chinchipe es donde, hace más de 5.000 años, la cultura Mayo-Chinchipe tocó por primera vez la planta sagrada. No es solo una región; es la verdadera cuna del cacao mundial.",
      p2: "Nuestra materia prima es la auténtica variedad Nacional. No se cultiva en plantaciones industriales abrasadas por el sol. Nace en la altura, bajo la densa sombra de bosques frutales vírgenes, manteniendo una simbiosis pura con el antiguo ecosistema amazónico.",
      p3: "El suelo rico en minerales, el agua cristalina y el cuidado de los indígenas Shuar moldean el poderoso espíritu de la planta, que capturamos cuidadosamente en cada grano."
    },
    process: {
      title: "El Arte del Tiempo: Regla de 10 Horas", desc: "Nuestro proceso es una meticulosa cirugía termodinámica. Detenemos la oxidación para siempre dentro de las 10 horas desde que la fruta se cosecha en el bosque.",
      s1: "Cosecha Forestal", d1: "Cosecha manual en los jardines silvestres de Zamora. La logística directa en contenedores refrigerados elimina el menor riesgo de un inicio accidental de fermentación en el camino.",
      s2: "Escudo de Vacío (80°C)", d2: "Escaldado en ambiente de vacío a 80°C (exactamente 5 minutos). El choque térmico preciso desnaturaliza la enzima de oxidación. El pigmento púrpura se fija para siempre.",
      s3: "Estabilización (40°C)", d3: "Secado suave a 40°C hasta alcanzar una humedad ideal del 6-8%. Formación de un 'crujido de cristal' sin perder los aceites esenciales. Envasado al vacío."
    },
    comp: {
      title: "Matriz Comparativa", desc: "Dos caminos diferentes en el mundo del cacao premium: el arte del sabor versus la ciencia de preservar la vida.",
      t1Title: "Filosofía y Proceso", t2Title: "Perfil Nutricional y Bioquímico",
      th1: "Parámetro", th2: "Industrial", th3: "Fine Flavor (Tradición)", th4: "Inca Trail",
      table1: [
        { p: "Fermentación", i: "Masiva (7-10 días)", f: "Controlada (para sabor)", in: "0 días. Escudo de vacío." },
        { p: "Procesamiento Térmico", i: "Tueste severo", f: "Tueste suave", in: "Crio-estabilización (máx 40°C)" },
        { p: "Objetivo Principal", i: "Reducción de costos, volumen", f: "Aromática compleja, gastronomía", in: "Máxima biodisponibilidad" }
      ],
      table2: [
        { p: "Color (Antocianinas)", i: "Marrón pálido (destruido)", f: "Marrón oscuro (reducido)", in: "Púrpura Vibrante (100% preservado)" },
        { p: "Acidez (pH)", i: "Alta (ácidos acético, láctico)", f: "Equilibrada por fermentación", in: "Nativa (sin ácidos de fermentación)" },
        { p: "Riesgo de Micotoxinas", i: "Alto", f: "Bajo (control estricto)", in: "Cero (sin entorno para moho)" },
        { p: "Polifenol Oxidasa", i: "Activa (descomposición)", f: "Activa (formación de sabor)", in: "Desnaturalizada instantáneamente" }
      ]
    },
    tznk: {
      pre: "Autenticidad", title1: "Proyecto TZNK &", title2: "Blockchain Eterno",
      p1: "La producción del cacao púrpura está indisolublemente ligada al proyecto TZNK (tzunki.com). Nuestro trabajo con el pueblo indígena Shuar es una ayuda real para preservar los bosques amazónicos, respetar el trabajo comunitario y proteger su patrimonio.",
      p2: "El mercado masivo oculta el verdadero origen del producto. Implementamos un nivel de transparencia sin precedentes: desde la cosecha hasta el sellado del palet con bolsas de vacío de 5 kg, todo se registra en foto y video.",
      f1: "Control Visual", f1d: "Fijación de cada etapa: coordenadas de cosecha, identidad del agricultor, procesamiento al vacío y envasado.",
      f2: "Registro en Blockchain", f2d: "La historia del lote se inscribe de forma permanente en un registro descentralizado. Los datos no pueden ser falsificados.",
      f3: "Pasaporte Digital", f3d: "Cada paquete recibe un código QR único que revela la historia de creación de ese cacao exacto."
    },
    usage: {
      title: "Vectores de Aplicación", desc: "Materia prima perfecta, lista para usar, sin necesidad de fumigación química.",
      f1: "Absoluto Ceremonial", f1d: "El mejor cacao del mundo para prácticas sagradas. Cultivado en bosques frutales antiguos. La ausencia de fermentación preserva no solo la molécula de teobromina, sino la energía original del Amazonas. El conductor perfecto.",
      f2: "Manteca de Cacao de Élite", f2d: "Omitir la fermentación significa la ausencia total de ácidos de descomposición. El resultado es una manteca de cacao cristalina con el aroma nativo más delicado, ideal para la alta perfumería y cosmética.",
      f3: "Polvo Único", f3d: "La base para superalimentos revolucionarios. El color púrpura vibrante y los niveles insuperables de antioxidantes hacen de este producto el ingrediente funcional número uno para la nutrición deportiva y nootrópica.",
      f4: "Materia Prima para Extractos", f4d: "El sueño de un biohacker. Flavonoides nativos, no destruidos por bacterias. El secado al vacío preserva la matriz ideal para una posterior extracción de alta tecnología (CO2, alcohol o agua)."
    },
    contact: {
      title: "Contactos y Asociación", desc: "Contáctenos para discutir oportunidades de suministro.", loc: "Provincia de Zamora Chinchipe, Ecuador"
    }
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("ru");
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#030205] text-[#e0e0e0] font-sans selection:bg-[#6b21a8] selection:text-white">
      
      {/* Навигация */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-500 bg-[#030205]/80 backdrop-blur-xl border-b border-[#3b1c4a]/30">
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-light tracking-[0.25em] text-white uppercase font-serif">
              THE INCA TRAIL
            </span>
            <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-[#9b59b6] uppercase mt-1">
              Ecuador • Zamora
            </span>
          </div>
          
          <div className="hidden lg:flex gap-8 text-[11px] font-light tracking-[0.15em] uppercase text-neutral-400">
            <a href="#philosophy" className="hover:text-[#c39bd3] transition-colors duration-300">{t.nav.concept}</a>
            <a href="#process" className="hover:text-[#c39bd3] transition-colors duration-300">{t.nav.process}</a>
            <a href="#comparison" className="hover:text-[#c39bd3] transition-colors duration-300">{t.nav.profile}</a>
            <a href="#tzunki" className="hover:text-[#c39bd3] transition-colors duration-300">{t.nav.blockchain}</a>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-light uppercase tracking-widest text-neutral-600">
              <button onClick={() => setLang('es')} className={`hover:text-white transition-colors ${lang === 'es' ? 'text-[#c39bd3] font-medium' : ''}`}>ES</button>
              <span>|</span>
              <button onClick={() => setLang('en')} className={`hover:text-white transition-colors ${lang === 'en' ? 'text-[#c39bd3] font-medium' : ''}`}>EN</button>
              <span>|</span>
              <button onClick={() => setLang('ru')} className={`hover:text-white transition-colors ${lang === 'ru' ? 'text-[#c39bd3] font-medium' : ''}`}>RU</button>
            </div>
            
            <a href="#contacts" className="hidden md:inline-flex px-6 py-3 border border-[#6b21a8] text-[#c39bd3] text-xs font-light tracking-[0.15em] uppercase hover:bg-[#6b21a8] hover:text-white transition-all duration-500">
              {t.nav.contact}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transform scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1620575306359-25f0a071cde2?q=80&w=2000&auto=format&fit=crop')",
            filter: "brightness(0.25) contrast(1.2) grayscale(40%)" 
          }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a0b2e]/60 via-[#030205]/80 to-[#030205]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-[#6b21a8]/20 rounded-full blur-[120px] md:blur-[150px] pointer-events-none z-0"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex-grow flex flex-col justify-center">
          <FadeIn delay={0.2} duration={1.5}>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-6 md:w-8 h-[1px] bg-[#9b59b6]"></div>
              <p className="text-[#c39bd3] text-xs md:text-sm font-light tracking-[0.3em] uppercase">
                {t.hero.pre}
              </p>
              <div className="w-6 md:w-8 h-[1px] bg-[#9b59b6]"></div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.5} duration={1.5}>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-white leading-[1.1] mb-8 font-light">
              {t.hero.title1} <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#c39bd3] to-[#7d3c98]">{t.hero.title2}</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.8} duration={1.5}>
            <p className="text-base md:text-xl text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed mb-16">
              {t.hero.desc}
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={1.1} duration={1.5}>
          <a href="#philosophy" className="relative z-10 flex items-center justify-center text-[#9b59b6] hover:text-white transition-colors duration-500 cursor-pointer p-4">
            <ChevronDown size={32} className="animate-bounce font-light" strokeWidth={1} />
          </a>
        </FadeIn>
      </section>

      {/* The Purple Philosophy */}
      <section id="philosophy" className="py-24 md:py-32 bg-[#030205] relative border-b border-[#3b1c4a]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <FadeIn direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#4a235a] to-transparent opacity-20 blur-2xl"></div>
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight relative">
                  {t.phil.title1} <br/><span className="text-[#c39bd3] italic">{t.phil.title2}</span>
                </h2>
                <div className="space-y-6 text-neutral-400 font-light text-base md:text-lg leading-relaxed relative">
                  <p>{t.phil.p1}</p>
                  <p>
                    {t.phil.p2.split('«Фиолетовое Золото»')[0]}
                    {lang === 'ru' ? <strong className="text-white font-normal">«Фиолетовое Золото»</strong> : <strong className="text-white font-normal">'Purple Gold' / 'Oro Púrpura'</strong>}
                    {t.phil.p2.split('«Фиолетовое Золото»')[1] || t.phil.p2.split("'Purple Gold'")[1] || t.phil.p2.split("'Oro Púrpura'")[1]}
                  </p>
                  <p>{t.phil.p3}</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#0a0612] p-8 border border-[#3b1c4a] rounded-sm text-center lg:translate-y-8 flex flex-col items-center">
                  <ShieldCheck className="text-[#9b59b6] mb-4 shrink-0" size={32} strokeWidth={1} />
                  <h4 className="text-white font-serif text-xl mb-2">{t.phil.f1}</h4>
                  <p className="text-neutral-500 text-sm font-light">{t.phil.f1d}</p>
                </div>
                <div className="bg-[#0a0612] p-8 border border-[#3b1c4a] rounded-sm text-center flex flex-col items-center">
                  <Activity className="text-[#9b59b6] mb-4 shrink-0" size={32} strokeWidth={1} />
                  <h4 className="text-white font-serif text-xl mb-2">{t.phil.f2}</h4>
                  <p className="text-neutral-500 text-sm font-light">{t.phil.f2d}</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Terroir Section */}
      <section id="terroir" className="py-24 md:py-32 bg-[#050308] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <FadeIn direction="right">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[#3b1c4a]/50 group">
                <div className="absolute inset-0 bg-[#4a235a]/10 group-hover:bg-transparent transition-colors duration-1000 z-10 pointer-events-none"></div>
                <img 
                  src="https://images.unsplash.com/photo-1542841791-09885b5a2663?q=80&w=1000&auto=format&fit=crop" 
                  alt="Amazon Rainforest / Bosque Amazónico" 
                  className="object-cover w-full h-full opacity-80 filter grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-[#9b59b6]"></div>
                  <p className="text-[#c39bd3] text-xs font-light tracking-[0.2em] uppercase">{t.terroir.pre}</p>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                  {t.terroir.title1}<br/>
                  <span className="text-2xl md:text-3xl text-[#c39bd3] italic mt-3 block">{t.terroir.title2}</span>
                </h2>

                <div className="space-y-6 text-neutral-400 font-light text-base md:text-lg leading-relaxed">
                  <p>{t.terroir.p1}</p>
                  <p>{t.terroir.p2}</p>
                  <p className="text-neutral-300 italic border-l-2 border-[#6b21a8] pl-6 mt-6">
                    {t.terroir.p3}
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* The 10-Hour Rule (Process) */}
      <section id="process" className="py-24 md:py-32 bg-[#020104] relative border-y border-[#3b1c4a]/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#4a235a]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">{t.process.title}</h2>
              <p className="text-neutral-400 font-light text-base md:text-lg">
                {t.process.desc}
              </p>
            </div>
          </FadeIn>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-[#3b1c4a] -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
              <FadeIn delay={0.1}>
                <div className="bg-[#0a0612] border border-[#3b1c4a]/50 p-8 md:p-10 relative group hover:border-[#c39bd3]/50 transition-colors duration-500 h-full flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-[#020104] px-4 mb-6 md:mb-0">
                    <span className="text-[#c39bd3] font-serif italic text-2xl">0h</span>
                  </div>
                  <h4 className="text-xl font-serif text-white text-center mt-2 md:mt-6 mb-4">{t.process.s1}</h4>
                  <p className="text-neutral-400 text-sm font-light text-center leading-relaxed flex-grow">
                    {t.process.d1}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="bg-[#0a0612] border border-[#3b1c4a]/50 p-8 md:p-10 relative group hover:border-[#c39bd3]/50 transition-colors duration-500 h-full flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-[#020104] px-4 mb-6 md:mb-0">
                    <span className="text-[#c39bd3] font-serif italic text-2xl">3h</span>
                  </div>
                  <h4 className="text-xl font-serif text-white text-center mt-2 md:mt-6 mb-4">{t.process.s2}</h4>
                  <p className="text-neutral-400 text-sm font-light text-center leading-relaxed flex-grow">
                    {t.process.d2}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.5}>
                <div className="bg-[#0a0612] border border-[#3b1c4a]/50 p-8 md:p-10 relative group hover:border-[#c39bd3]/50 transition-colors duration-500 h-full flex flex-col items-center">
                  <div className="md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-[#020104] px-4 mb-6 md:mb-0">
                    <span className="text-[#c39bd3] font-serif italic text-2xl">10h</span>
                  </div>
                  <h4 className="text-xl font-serif text-white text-center mt-2 md:mt-6 mb-4">{t.process.s3}</h4>
                  <p className="text-neutral-400 text-sm font-light text-center leading-relaxed flex-grow">
                    {t.process.d3}
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Comparisons Section (Tables) */}
      <section id="comparison" className="py-24 md:py-32 bg-[#050308] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">{t.comp.title}</h2>
              <p className="text-neutral-400 font-light text-base md:text-lg max-w-2xl mx-auto">
                {t.comp.desc}
              </p>
            </div>
          </FadeIn>

          {/* Table 1 */}
          <FadeIn delay={0.2}>
            <div className="mb-16">
              <h3 className="text-xl font-serif text-[#c39bd3] mb-6 flex items-center gap-3">
                <ShieldCheck size={20} className="shrink-0" /> {t.comp.t1Title}
              </h3>
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#3b1c4a]">
                      <th className="py-4 px-4 text-neutral-500 font-light w-1/4">{t.comp.th1}</th>
                      <th className="py-4 px-4 text-neutral-400 font-normal w-1/4">{t.comp.th2}</th>
                      <th className="py-4 px-4 text-neutral-300 font-normal w-1/4">{t.comp.th3}</th>
                      <th className="py-4 px-4 text-[#c39bd3] font-serif text-lg w-1/4 border-l border-[#3b1c4a] bg-[#0a0612]/50">{t.comp.th4}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-light">
                    {t.comp.table1.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-900 hover:bg-[#0a0612]/30 transition-colors">
                        <td className="py-4 px-4 text-neutral-400">{row.p}</td>
                        <td className="py-4 px-4 text-neutral-500">{row.i}</td>
                        <td className="py-4 px-4 text-neutral-300">{row.f}</td>
                        <td className="py-4 px-4 text-white border-l border-[#3b1c4a] bg-[#0a0612]/50">
                          {idx === 0 || idx === 1 ? (
                            <span><strong className="font-normal text-[#c39bd3]">{row.in.split('.')[0]}{idx === 0 ? '.' : ''}</strong>{row.in.substring(row.in.indexOf('.') + (idx === 0 ? 1 : 0))}</span>
                          ) : (
                            row.in
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>

          {/* Table 2 */}
          <FadeIn delay={0.3}>
            <div>
              <h3 className="text-xl font-serif text-[#c39bd3] mb-6 flex items-center gap-3">
                <Activity size={20} className="shrink-0" /> {t.comp.t2Title}
              </h3>
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#3b1c4a]">
                      <th className="py-4 px-4 text-neutral-500 font-light w-1/4">{t.comp.th1}</th>
                      <th className="py-4 px-4 text-neutral-400 font-normal w-1/4">{t.comp.th2}</th>
                      <th className="py-4 px-4 text-neutral-300 font-normal w-1/4">{t.comp.th3}</th>
                      <th className="py-4 px-4 text-[#c39bd3] font-serif text-lg w-1/4 border-l border-[#3b1c4a] bg-[#0a0612]/50">{t.comp.th4}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-light">
                    {t.comp.table2.map((row, idx) => (
                      <tr key={idx} className="border-b border-neutral-900 hover:bg-[#0a0612]/30 transition-colors">
                        <td className="py-4 px-4 text-neutral-400">{row.p}</td>
                        <td className={`py-4 px-4 ${idx === 2 ? 'text-red-900/50' : 'text-neutral-500'}`}>{row.i}</td>
                        <td className="py-4 px-4 text-neutral-300">{row.f}</td>
                        <td className="py-4 px-4 text-white border-l border-[#3b1c4a] bg-[#0a0612]/50">
                          {idx === 0 && <span>{lang === 'ru' ? 'Насыщенный ' : lang === 'es' ? 'Púrpura ' : 'Vibrant '}<strong className="font-normal text-[#c39bd3]">{lang === 'ru' ? 'Фиолетовый' : lang === 'es' ? 'Vibrante' : 'Purple'}</strong> {row.in.replace(/.*(Фиолетовый|Purple|Vibrante)/i, '')}</span>}
                          {idx === 1 && row.in}
                          {idx === 2 && <span><strong className="text-green-400 font-normal">{row.in.split(' ')[0]}</strong> {row.in.substring(row.in.indexOf(' '))}</span>}
                          {idx === 3 && <strong className="text-[#c39bd3] font-normal">{row.in}</strong>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TZNK & Blockchain Section */}
      <section id="tzunki" className="py-24 md:py-32 bg-[#020104] relative border-t border-[#3b1c4a]/30 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#c39bd3 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6b21a8]/20 border border-[#9b59b6]/30 rounded text-[#c39bd3] text-xs uppercase tracking-widest font-mono">
                  <LinkIcon size={14} className="shrink-0" /> {t.tznk.pre}
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                  {t.tznk.title1} <br/>{t.tznk.title2}
                </h2>
                <div className="space-y-6 text-neutral-400 font-light text-base md:text-lg leading-relaxed">
                  <p>
                    {t.tznk.p1.split('TZNK')[0]}<strong className="text-white font-normal">TZNK (tzunki.com)</strong>{t.tznk.p1.split('(tzunki.com)')[1] || t.tznk.p1.split('TZNK (tzunki.com)')[1]}
                  </p>
                  <p>
                    {t.tznk.p2.split('—')[0]}— <strong className="text-white font-normal">{t.tznk.p2.split('—')[1]}</strong>
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="bg-[#0a0612] border border-[#3b1c4a] p-8 md:p-10 rounded-sm relative shadow-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop" alt="Amazon texture" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                  <QrCode size={100} className="text-[#9b59b6]" />
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#1a0b2e] flex items-center justify-center shrink-0 border border-[#3b1c4a]">
                      <Camera size={20} className="text-[#c39bd3] shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg md:text-xl mb-1">{t.tznk.f1}</h4>
                      <p className="text-neutral-500 font-light text-sm">{t.tznk.f1d}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#1a0b2e] flex items-center justify-center shrink-0 border border-[#3b1c4a]">
                      <LinkIcon size={20} className="text-[#c39bd3] shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg md:text-xl mb-1">{t.tznk.f2}</h4>
                      <p className="text-neutral-500 font-light text-sm">{t.tznk.f2d}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[#1a0b2e] flex items-center justify-center shrink-0 border border-[#3b1c4a]">
                      <QrCode size={20} className="text-[#c39bd3] shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-white font-serif text-lg md:text-xl mb-1">{t.tznk.f3}</h4>
                      <p className="text-neutral-500 font-light text-sm">{t.tznk.f3d}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Directions of Use */}
      <section className="py-24 md:py-32 bg-[#050308] relative border-t border-[#3b1c4a]/30">
         <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">{t.usage.title}</h2>
              <p className="text-neutral-400 font-light text-base md:text-lg max-w-2xl mx-auto">
                {t.usage.desc}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div className="group p-8 md:p-10 bg-[#0a0612] border border-[#3b1c4a]/50 hover:border-[#c39bd3] transition-colors duration-500 h-full">
                <Mountain className="text-[#9b59b6] mb-6 shrink-0 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
                <h3 className="text-2xl font-serif text-white mb-4">{t.usage.f1}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t.usage.f1d}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="group p-8 md:p-10 bg-[#0a0612] border border-[#3b1c4a]/50 hover:border-[#c39bd3] transition-colors duration-500 h-full">
                <Sparkles className="text-[#9b59b6] mb-6 shrink-0 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
                <h3 className="text-2xl font-serif text-white mb-4">{t.usage.f2}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t.usage.f2d}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="group p-8 md:p-10 bg-[#0a0612] border border-[#3b1c4a]/50 hover:border-[#c39bd3] transition-colors duration-500 h-full">
                <Leaf className="text-[#9b59b6] mb-6 shrink-0 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
                <h3 className="text-2xl font-serif text-white mb-4">{t.usage.f3}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t.usage.f3d}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="group p-8 md:p-10 bg-[#0a0612] border border-[#3b1c4a]/50 hover:border-[#c39bd3] transition-colors duration-500 h-full">
                <FlaskConical className="text-[#9b59b6] mb-6 shrink-0 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
                <h3 className="text-2xl font-serif text-white mb-4">{t.usage.f4}</h3>
                <p className="text-neutral-400 font-light leading-relaxed">{t.usage.f4d}</p>
              </div>
            </FadeIn>
          </div>
         </div>
      </section>

      {/* Contacts / Partnership */}
      <section id="contacts" className="py-24 md:py-32 bg-[#020104] border-t border-[#3b1c4a]/30">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">{t.contact.title}</h2>
              <p className="text-neutral-500 font-light tracking-wide">{t.contact.desc}</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <div className="p-8 md:p-12 border border-[#3b1c4a]/50 hover:border-[#c39bd3]/50 transition-colors duration-500 bg-[#0a0612] max-w-2xl mx-auto text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-[#6b21a8]/10 pointer-events-none">
                <Leaf size={150} />
              </div>
              
              <h4 className="text-2xl font-serif text-white mb-8 relative z-10">The Inca Trail Foods</h4>
              
              <div className="flex flex-col items-center justify-center gap-6 font-light relative z-10">
                
                <div className="flex items-center gap-4 text-neutral-300">
                  <MapPin className="text-[#9b59b6] shrink-0" size={20} />
                  <span className="tracking-wide">{t.contact.loc}</span>
                </div>

                <a href="mailto:info@incatrailfoods.com" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                  <Mail className="text-[#9b59b6] shrink-0 group-hover:text-white transition-colors" size={20} />
                  <span className="tracking-wider">info@incatrailfoods.com</span>
                </a>

                <a href="https://wa.me/593982873007" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                  <Phone className="text-[#9b59b6] shrink-0 group-hover:text-white transition-colors" size={20} />
                  <span className="tracking-wider">+593 98 287 3007 <span className="text-xs text-neutral-500 ml-2">(WhatsApp / Telegram)</span></span>
                </a>

              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#3b1c4a]/30 bg-[#010002] text-center">
        <p className="text-neutral-600 text-xs font-light px-4">
          © {new Date().getFullYear()} The Inca Trail Foods. Ecuador, Zamora Chinchipe.
        </p>
      </footer>
    </div>
  );
}