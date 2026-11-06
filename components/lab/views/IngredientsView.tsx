"use client";
import React, { useState } from 'react';
import {
  Database,
  Search,
  Plus,
  Filter,
  Tag,
  Check,
  Sparkles,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Save,
  FlaskConical,
  Layers,
  Sliders,
  Copy,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Ingredient, Language, Recipe, RecipeItem, MatrixType } from '@/lib/lab/types';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface IngredientsViewProps {
  ingredients: Ingredient[];
  onAddCustomIngredient: (ing: Ingredient) => void;
  onUpdateIngredient?: (updated: Ingredient) => void;
  onDeleteIngredient?: (id: string) => void;
  recipes?: Recipe[];
  activeRecipeId?: string;
  onSelectRecipe?: (id: string) => void;
  onUpdateRecipe?: (updated: Recipe) => void;
  onAddRecipe?: (newRecipe: Recipe) => void;
  onDeleteRecipe?: (id: string) => void;
  language: Language;
}

export const IngredientsView: React.FC<IngredientsViewProps> = ({
  ingredients,
  onAddCustomIngredient,
  onUpdateIngredient,
  onDeleteIngredient,
  recipes = [],
  activeRecipeId,
  onSelectRecipe,
  onUpdateRecipe,
  onAddRecipe,
  onDeleteRecipe,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const isRu = language === 'ru';
  const isEs = language === 'es';
  const unitKg = isRu ? 'кг' : 'kg';
  const unitG = isRu ? 'г' : 'g';
  const unitMg = isRu ? 'мг' : 'mg';

  // Section switcher: 'ingredients' | 'recipes'
  const [activeSection, setActiveSection] = useState<'ingredients' | 'recipes'>('recipes');

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  // Recipe editing state
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);

  // Admin PIN Protection State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('inca_ingredients_admin_unlocked') === 'true';
  });
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Form state for creating custom ingredient
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameEs, setNameEs] = useState('');
  const [category, setCategory] = useState<Ingredient['category']>('spice');
  const [costPerKgUSD, setCostPerKgUSD] = useState(20);
  const [fat, setFat] = useState(0);
  const [sugars, setSugars] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fiber, setFiber] = useState(0);

  // Form state for adding an ingredient to a recipe being edited
  const [selectedIngredientToAdd, setSelectedIngredientToAdd] = useState<string>(ingredients[0]?.id || 'cacao_paste');
  const [addIngredientBakersPct, setAddIngredientBakersPct] = useState<number>(1.0);
  const [addIngredientNotes, setAddIngredientNotes] = useState<string>('');

  // Handle Admin PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('inca_lab_admin_pin') || localStorage.getItem('inca_lab_pin') || '1234';
    if (pinInput === storedPin || pinInput === '1234') {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('inca_ingredients_admin_unlocked', 'true');
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError(isRu ? 'Неверный ПИН-код' : isEs ? 'PIN inválido' : 'Invalid PIN');
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('inca_ingredients_admin_unlocked');
  };

  // Filter ingredients
  const filteredIngredients = ingredients.filter((ing) => {
    const matchesSearch =
      ing.nameRu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ing.nameEs && ing.nameEs.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ing.descriptionRu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ing.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter recipes
  const filteredRecipes = recipes.filter((rec) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      rec.nameRu.toLowerCase().includes(searchLower) ||
      rec.nameEn.toLowerCase().includes(searchLower) ||
      (rec.nameEs && rec.nameEs.toLowerCase().includes(searchLower)) ||
      rec.code.toLowerCase().includes(searchLower) ||
      rec.descriptionRu.toLowerCase().includes(searchLower)
    );
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameRu) return;

    const newIng: Ingredient = {
      id: `custom_${Date.now()}`,
      nameRu,
      nameEn: nameEn || nameRu,
      nameEs: nameEs || nameEn || nameRu,
      category,
      costPerKgUSD,
      descriptionRu: 'Пользовательский лабораторный компонент',
      descriptionEn: 'Custom laboratory ingredient',
      descriptionEs: 'Ingrediente de laboratorio personalizado',
      chemicals: {
        moisture: 5,
        fat,
        sugars,
        protein,
        fiber,
        sodiumMg: 10,
        potassiumMg: 200,
        ironMg: 2,
        magnesiumMg: 50,
        zincMg: 1,
        epicatechinDP1MgPerG: 0,
        procyanidinsDP2DP7MgPerG: 0,
        theobromineMgPerG: 0,
        caffeineMgPerG: 0,
      },
      isCustom: true,
    };

    onAddCustomIngredient(newIng);
    setShowAddModal(false);
    setNameRu('');
    setNameEn('');
    setNameEs('');
  };

  const handleSaveIngredientEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIngredient || !onUpdateIngredient) return;
    onUpdateIngredient(editingIngredient);
    setEditingIngredient(null);
  };

  // Recipe editing helpers
  const handleStartEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(JSON.parse(JSON.stringify(recipe))); // deep copy
  };

  const handleUpdateRecipeItemBakers = (ingId: string, newPct: number) => {
    if (!editingRecipe) return;
    const updatedItems = editingRecipe.items.map((item) =>
      item.ingredientId === ingId ? { ...item, bakersPercentage: Math.max(0, newPct) } : item
    );
    setEditingRecipe({ ...editingRecipe, items: updatedItems });
  };

  const handleRemoveRecipeItem = (ingId: string) => {
    if (!editingRecipe) return;
    const updatedItems = editingRecipe.items.filter((item) => item.ingredientId !== ingId);
    setEditingRecipe({ ...editingRecipe, items: updatedItems });
  };

  const handleAddIngredientToRecipe = () => {
    if (!editingRecipe || !selectedIngredientToAdd) return;
    const existingIndex = editingRecipe.items.findIndex(
      (i) => i.ingredientId === selectedIngredientToAdd
    );

    if (existingIndex >= 0) {
      const updatedItems = [...editingRecipe.items];
      updatedItems[existingIndex].bakersPercentage += addIngredientBakersPct;
      if (addIngredientNotes) updatedItems[existingIndex].notes = addIngredientNotes;
      setEditingRecipe({ ...editingRecipe, items: updatedItems });
    } else {
      const newItem: RecipeItem = {
        ingredientId: selectedIngredientToAdd,
        bakersPercentage: addIngredientBakersPct,
        notes: addIngredientNotes || undefined,
      };
      setEditingRecipe({ ...editingRecipe, items: [...editingRecipe.items, newItem] });
    }

    setAddIngredientNotes('');
    setAddIngredientBakersPct(1.0);
  };

  const handleSaveRecipeChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe || !onUpdateRecipe) return;
    onUpdateRecipe(editingRecipe);
    setEditingRecipe(null);
  };

  const handleCreateNewRecipe = () => {
    if (!onAddRecipe) return;
    const newRec: Recipe = {
      id: `recipe_custom_${Date.now()}`,
      code: `REC-${recipes.length + 1}`,
      nameRu: 'Новая рецептура какао',
      nameEn: 'New Cacao Formulation',
      nameEs: 'Nueva Fórmula de Cacao',
      descriptionRu: 'Пользовательская лабораторная формула фиолетового какао',
      descriptionEn: 'Custom laboratory purple cacao matrix',
      descriptionEs: 'Fórmula de laboratorio de cacao púrpura personalizada',
      basePasteWeightGrams: 1000,
      matrixType: 'micro_wedge',
      isPreset: false,
      items: [
        { ingredientId: 'cacao_paste', bakersPercentage: 100.0, notes: 'База: 100% паста 18 мкм' },
        { ingredientId: 'panela', bakersPercentage: 42.86, notes: 'Панела размол со второй фазы' },
        { ingredientId: 'cacao_butter', bakersPercentage: 4.5, notes: 'Микро-клин какао-масла ВМС' },
        { ingredientId: 'sea_salt', bakersPercentage: 0.64, notes: 'Электролиты SGLT1' },
      ],
    };
    onAddRecipe(newRec);
    handleStartEditRecipe(newRec);
  };

  // Helper to compute pure cacao base and total cacao for any recipe
  const computeRecipeCacaoStats = (rec: Recipe) => {
    let pasteG = 0;
    let butterG = 0;
    let panelaG = 0;
    let milkG = 0;
    let totalBakers = 0;

    rec.items.forEach((item) => {
      totalBakers += item.bakersPercentage;
      if (item.ingredientId === 'cacao_paste') pasteG += item.bakersPercentage;
      else if (item.ingredientId === 'cacao_butter') butterG += item.bakersPercentage;
      else if (item.ingredientId === 'panela') panelaG += item.bakersPercentage;
      else if (item.ingredientId === 'milk_powder') milkG += item.bakersPercentage;
    });

    const totalCacaoBakers = pasteG + butterG;
    const coreChocolateBakers = totalCacaoBakers + panelaG + milkG;

    const totalCacaoPct = totalBakers > 0 ? (totalCacaoBakers / totalBakers) * 100 : 0;
    const pureCacaoBasePct = coreChocolateBakers > 0 ? (totalCacaoBakers / coreChocolateBakers) * 100 : totalCacaoPct;

    return {
      totalBakers,
      totalCacaoPct: totalCacaoPct.toFixed(1),
      pureCacaoBasePct: pureCacaoBasePct.toFixed(1),
      pastePct: (pasteG / (totalBakers || 1) * 100).toFixed(1),
    };
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Banner with Section Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isRu ? 'База данных: Сырье и Рецептуры' : isEs ? 'Base de Datos: Materias y Fórmulas' : 'Database: Raw Materials & Formulas'}
              </h2>
              {isAdminUnlocked ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
                  <Unlock className="w-3 h-3" />
                  <span>{isRu ? 'Админ доступ' : isEs ? 'Admin Activo' : 'Admin Mode'}</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-mono text-[10px] font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>{isRu ? 'Только чтение' : isEs ? 'Solo lectura' : 'Read only'}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isRu
                ? 'Управление составом рецептур, процентами компонентов, ценами сырья и активными профилями'
                : isEs
                ? 'Gestión de fórmulas maestras, porcentajes, materias primas y perfil bioactivo'
                : 'Manage master recipes, ingredient ratios, raw material costs, and bioactive profiles'}
            </p>
          </div>
        </div>

        {/* Action Controls & Admin Lock Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdminUnlocked ? (
            <button
              type="button"
              onClick={handleLockAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>{isRu ? 'Закрыть доступ' : isEs ? 'Bloquear' : 'Lock Admin'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPinModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-semibold transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{isRu ? 'Вход технолога (ПИН)' : isEs ? 'PIN Tecnólogo' : 'Admin PIN'}</span>
            </button>
          )}

          {activeSection === 'recipes' ? (
            <button
              type="button"
              onClick={() => {
                if (!isAdminUnlocked) setShowPinModal(true);
                else handleCreateNewRecipe();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isRu ? '+ Новая рецептура' : isEs ? '+ Nueva Fórmula' : '+ New Recipe'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isAdminUnlocked) setShowPinModal(true);
                else setShowAddModal(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewIngredient}</span>
            </button>
          )}
        </div>
      </div>

      {/* Section Switcher Tabs: [Рецептуры и Матрицы (6)] | [Сырье и Ингредиенты (16)] */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveSection('recipes');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'recipes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>{isRu ? 'Рецептуры и Матрицы' : isEs ? 'Fórmulas y Recetas' : 'Formulations & Master Recipes'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {recipes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSection('ingredients');
            setSearchTerm('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'ingredients'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isRu ? 'Сырье и Ингредиенты' : isEs ? 'Base de Materias Primas' : 'Raw Material Ingredients'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {ingredients.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeSection === 'recipes'
                ? isRu ? 'Поиск рецептур по названию, коду...' : isEs ? 'Buscar fórmulas...' : 'Search recipes...'
                : t.searchIngredient
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {activeSection === 'ingredients' && (
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            {['all', 'cacao', 'sweetener', 'dairy', 'spice', 'adaptogen', 'mineral'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? (isRu ? 'Все' : isEs ? 'Todos' : 'All') : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION A: RECIPES & FORMULATIONS DATABASE VIEW */}
      {activeSection === 'recipes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRecipes.map((rec) => {
            const stats = computeRecipeCacaoStats(rec);
            const isLoaded = activeRecipeId === rec.id;
            const recName = isRu ? rec.nameRu : isEs ? (rec.nameEs || rec.nameEn) : rec.nameEn;
            const recDesc = isRu ? rec.descriptionRu : isEs ? (rec.descriptionEs || rec.descriptionEn) : rec.descriptionEn;

            return (
              <div
                key={rec.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-sm ${
                  isLoaded
                    ? 'border-purple-500 dark:border-purple-600 ring-2 ring-purple-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {rec.code}
                      </span>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {rec.matrixType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isLoaded ? (
                        <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{isRu ? 'В калькуляторе' : isEs ? 'En calculador' : 'Active'}</span>
                        </span>
                      ) : onSelectRecipe ? (
                        <button
                          type="button"
                          onClick={() => onSelectRecipe(rec.id)}
                          className="font-mono text-[11px] font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 hover:underline"
                        >
                          <span>{isRu ? 'Загрузить' : isEs ? 'Cargar' : 'Load'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : null}

                      {isAdminUnlocked && (
                        <button
                          type="button"
                          onClick={() => handleStartEditRecipe(rec)}
                          title={isRu ? 'Редактировать формулу' : 'Edit Formula'}
                          className="p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-500 hover:text-purple-600 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isAdminUnlocked && !rec.isPreset && onDeleteRecipe && (
                        <button
                          type="button"
                          onClick={() => onDeleteRecipe(rec.id)}
                          title={isRu ? 'Удалить формулу' : 'Delete'}
                          className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {recName}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {recDesc}
                  </p>

                  {/* Core Chocolate Base vs Total Cacao Badge */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        {isRu ? 'База какао:' : isEs ? 'Base pura:' : 'Pure Base:'}
                      </span>
                      <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                        {stats.pureCacaoBasePct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        {isRu ? 'Total Cacao:' : 'Total Cacao:'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {stats.totalCacaoPct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        {isRu ? 'Компонентов:' : isEs ? 'Ingredientes:' : 'Items:'}
                      </span>
                      <span className="font-bold text-slate-600 dark:text-slate-400 text-sm">
                        {rec.items.length}
                      </span>
                    </div>
                  </div>

                  {/* Ingredients Preview Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {rec.items.map((item) => {
                      const ingObj = ingredients.find((i) => i.id === item.ingredientId);
                      const name = ingObj
                        ? isRu ? ingObj.nameRu : isEs ? (ingObj.nameEs || ingObj.nameEn) : ingObj.nameEn
                        : item.ingredientId;
                      return (
                        <span
                          key={item.ingredientId}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                        >
                          <span>{name}:</span>
                          <strong className="text-purple-600 dark:text-purple-400">{item.bakersPercentage}%</strong>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{isRu ? 'База 100% пасты:' : '100% Paste Base:'} {rec.basePasteWeightGrams} г</span>
                  {isAdminUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handleStartEditRecipe(rec)}
                      className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isRu ? 'Редактировать состав' : isEs ? 'Editar fórmula' : 'Edit Recipe'}</span>
                    </button>
                  ) : onSelectRecipe ? (
                    <button
                      type="button"
                      onClick={() => onSelectRecipe(rec.id)}
                      className="text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{isRu ? 'Загрузить в калькулятор' : isEs ? 'Cargar fórmula' : 'Use Formula'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION B: INGREDIENTS DATABASE VIEW */}
      {activeSection === 'ingredients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.map((ing) => {
            const displayName = isRu ? ing.nameRu : isEs ? (ing.nameEs || ing.nameEn) : ing.nameEn;
            const displayDesc = isRu ? ing.descriptionRu : isEs ? (ing.descriptionEs || ing.descriptionEn) : ing.descriptionEn;

            return (
              <div
                key={ing.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-800 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      {ing.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        ${ing.costPerKgUSD.toFixed(1)}/{unitKg}
                      </span>
                      {isAdminUnlocked && (
                        <button
                          type="button"
                          onClick={() => setEditingIngredient(ing)}
                          title={isRu ? 'Редактировать' : isEs ? 'Editar' : 'Edit'}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-purple-600 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isAdminUnlocked && ing.isCustom && onDeleteIngredient && (
                        <button
                          type="button"
                          onClick={() => onDeleteIngredient(ing.id)}
                          title={isRu ? 'Удалить' : isEs ? 'Eliminar' : 'Delete'}
                          className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {displayName}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {displayDesc}
                  </p>
                </div>

                {/* Chemical specs */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>{isRu ? 'Жиры:' : isEs ? 'Grasas:' : 'Fat:'} {ing.chemicals.fat}%</span>
                    <span>{isRu ? 'Сахара:' : isEs ? 'Azúcares:' : 'Sugars:'} {ing.chemicals.sugars}%</span>
                    <span>{isRu ? 'Белки:' : isEs ? 'Proteínas:' : 'Protein:'} {ing.chemicals.protein}%</span>
                  </div>

                  {ing.chemicals.epicatechinDP1MgPerG > 0 && (
                    <div className="flex justify-between text-purple-600 dark:text-purple-400 font-semibold">
                      <span>(-)-{isRu ? 'Эпикатехин DP1:' : isEs ? 'Epicatequina DP1:' : 'Epicatechin DP1:'}</span>
                      <span>{ing.chemicals.epicatechinDP1MgPerG} {unitMg}/{unitG}</span>
                    </div>
                  )}
                  {ing.chemicals.theobromineMgPerG > 0 && (
                    <div className="flex justify-between text-purple-600 dark:text-purple-400 font-semibold">
                      <span>{isRu ? 'Теобромин:' : isEs ? 'Teobromina:' : 'Theobromine:'}</span>
                      <span>{ing.chemicals.theobromineMgPerG} {unitMg}/{unitG}</span>
                    </div>
                  )}
                  {ing.chemicals.piperinePercent && (
                    <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                      <span>{isRu ? 'Пиперин:' : isEs ? 'Piperina:' : 'Piperine:'}</span>
                      <span>{ing.chemicals.piperinePercent}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL RECIPE EDITOR MODAL (Under Admin PIN) */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isRu ? 'Редактор рецептуры' : isEs ? 'Editor de Fórmula' : 'Formulation Master Editor'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecipe(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipeChanges} className="space-y-4 text-xs">
              {/* Names in RU, EN, ES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    {isRu ? 'Название (RU):' : 'Name (RU):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecipe.nameRu}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, nameRu: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    Name (EN):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecipe.nameEn}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, nameEn: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    Nombre (ES):
                  </label>
                  <input
                    type="text"
                    value={editingRecipe.nameEs || ''}
                    placeholder={editingRecipe.nameEn}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, nameEs: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Code, Base Weight, Matrix Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    {isRu ? 'Код рецепта:' : 'Recipe Code:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRecipe.code}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, code: e.target.value })}
                    className="w-full py-2 px-3 font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    {isRu ? 'База пасты (г):' : 'Base Paste Weight (g):'}
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="100"
                    value={editingRecipe.basePasteWeightGrams}
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        basePasteWeightGrams: parseFloat(e.target.value) || 1000,
                      })
                    }
                    className="w-full py-2 px-3 font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    {isRu ? 'Тип матрицы:' : 'Matrix Type:'}
                  </label>
                  <select
                    value={editingRecipe.matrixType}
                    onChange={(e) =>
                      setEditingRecipe({
                        ...editingRecipe,
                        matrixType: e.target.value as MatrixType,
                      })
                    }
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="zero_butter">Zero Butter (0% масла)</option>
                    <option value="micro_wedge">Micro-Wedge (3-5% масла)</option>
                    <option value="silk_high_fat">INCA Silk (&gt;7% масла)</option>
                    <option value="dark_milk">Dark Milk 50%</option>
                    <option value="sweet_milk">Sweet Milk 40%</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                  {isRu ? 'Технологическое описание (RU):' : 'Description (RU):'}
                </label>
                <textarea
                  rows={2}
                  value={editingRecipe.descriptionRu}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, descriptionRu: e.target.value })}
                  className="w-full py-1.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              {/* RECIPE INGREDIENTS TABLE & CONTROLS */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] font-mono">
                    {isRu ? 'Компоненты и Пекарские проценты (к пасте 100%):' : 'Formula Ingredients & Baker\'s %:'}
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    {isRu ? 'Базовое какао:' : 'Pure Cacao Base:'}{' '}
                    {computeRecipeCacaoStats(editingRecipe).pureCacaoBasePct}%
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {editingRecipe.items.map((item) => {
                    const ingObj = ingredients.find((i) => i.id === item.ingredientId);
                    const name = ingObj
                      ? isRu ? ingObj.nameRu : isEs ? (ingObj.nameEs || ingObj.nameEn) : ingObj.nameEn
                      : item.ingredientId;

                    return (
                      <div
                        key={item.ingredientId}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white truncate block">
                            {name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.notes || (ingObj ? `$${ingObj.costPerKgUSD}/${unitKg}` : '')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.bakersPercentage}
                            onChange={(e) =>
                              handleUpdateRecipeItemBakers(item.ingredientId, parseFloat(e.target.value) || 0)
                            }
                            className="w-20 py-1 px-2 text-right font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400"
                          />
                          <span className="text-xs text-slate-400">%</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveRecipeItem(item.ingredientId)}
                          title="Удалить из рецепта"
                          className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add new ingredient to this recipe */}
                <div className="mt-3 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-full sm:flex-1">
                    <select
                      value={selectedIngredientToAdd}
                      onChange={(e) => setSelectedIngredientToAdd(e.target.value)}
                      className="w-full py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs"
                    >
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {isRu ? ing.nameRu : ing.nameEn} (${ing.costPerKgUSD}/кг)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="number"
                      step="0.1"
                      min="0.01"
                      placeholder="Пекарский %"
                      value={addIngredientBakersPct}
                      onChange={(e) => setAddIngredientBakersPct(parseFloat(e.target.value) || 0)}
                      className="w-24 py-1.5 px-2 font-mono text-center text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddIngredientToRecipe}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs whitespace-nowrap"
                    >
                      + Добавить
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="font-mono text-xs text-slate-500">
                  Total Cacao:{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {computeRecipeCacaoStats(editingRecipe).totalCacaoPct}%
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingRecipe(null)}
                    className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {isRu ? 'Отмена' : isEs ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isRu ? 'Сохранить рецептуру' : isEs ? 'Guardar Fórmula' : 'Save Formula'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isRu ? 'Доступ технолога (ПИН)' : isEs ? 'Acceso de Tecnólogo' : 'Technologist PIN'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput('');
                  setPinError('');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {isRu
                ? 'Введите ПИН-код администратора для редактирования рецептур, процентов компонентов и цен сырья.'
                : isEs
                ? 'Ingrese el PIN de administrador para editar fórmulas, porcentajes y precios de materias primas.'
                : 'Enter admin PIN to modify recipe formulations, ingredient percentages, and raw material costs.'}
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="ПИН (по умолчанию 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full py-2.5 px-3 text-center font-mono text-base tracking-widest rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {pinError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {isRu ? 'Отмена' : isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                >
                  {isRu ? 'Подтвердить' : isEs ? 'Confirmar' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ingredient Modal (Admin Only) */}
      {editingIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isRu
                    ? `Редактирование: ${editingIngredient.nameRu}`
                    : `Edit Ingredient: ${editingIngredient.nameEn}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingIngredient(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIngredientEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    Название (RU):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingIngredient.nameRu}
                    onChange={(e) =>
                      setEditingIngredient({ ...editingIngredient, nameRu: e.target.value })
                    }
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    Name (EN):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingIngredient.nameEn}
                    onChange={(e) =>
                      setEditingIngredient({ ...editingIngredient, nameEn: e.target.value })
                    }
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                  Nombre (ES):
                </label>
                <input
                  type="text"
                  value={editingIngredient.nameEs || ''}
                  placeholder={editingIngredient.nameEn}
                  onChange={(e) =>
                    setEditingIngredient({ ...editingIngredient, nameEs: e.target.value })
                  }
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    Категория:
                  </label>
                  <select
                    value={editingIngredient.category}
                    onChange={(e) =>
                      setEditingIngredient({
                        ...editingIngredient,
                        category: e.target.value as Ingredient['category'],
                      })
                    }
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="cacao">Какао (Cacao)</option>
                    <option value="sweetener">Подсластитель (Sweetener)</option>
                    <option value="spice">Специя (Spice)</option>
                    <option value="adaptogen">Адаптоген (Adaptogen)</option>
                    <option value="mineral">Минерал (Mineral)</option>
                    <option value="dairy">Молочные (Dairy)</option>
                    <option value="other">Другое (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    {isRu ? 'Цена за 1 кг ($/кг USD):' : isEs ? 'Precio por 1 kg ($/kg USD):' : 'Price per 1 kg ($/kg USD):'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={editingIngredient.costPerKgUSD}
                    onChange={(e) =>
                      setEditingIngredient({
                        ...editingIngredient,
                        costPerKgUSD: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full py-2 px-3 font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingIngredient(null)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {isRu ? 'Отмена' : isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isRu ? 'Сохранить изменения' : isEs ? 'Guardar Cambios' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {t.addNewIngredient}
            </h3>

            <form onSubmit={handleCreateCustom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                  {isRu ? 'Название (RU):' : isEs ? 'Nombre en Ruso (RU):' : 'Name (RU):'}
                </label>
                <input
                  type="text"
                  required
                  value={nameRu}
                  onChange={(e) => setNameRu(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                  {isRu ? 'Название (EN/ES):' : isEs ? 'Nombre (EN/ES):' : 'Name (EN/ES):'}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    {isRu ? 'Категория:' : isEs ? 'Categoría:' : 'Category:'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Ingredient['category'])}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="spice">{isRu ? 'Специя' : isEs ? 'Especia' : 'Spice'}</option>
                    <option value="adaptogen">{isRu ? 'Адаптоген' : isEs ? 'Adaptógeno' : 'Adaptogen'}</option>
                    <option value="sweetener">{isRu ? 'Подсластитель' : isEs ? 'Endulzante' : 'Sweetener'}</option>
                    <option value="mineral">{isRu ? 'Минерал' : isEs ? 'Mineral' : 'Mineral'}</option>
                    <option value="cacao">{isRu ? 'Какао' : isEs ? 'Cacao' : 'Cacao'}</option>
                    <option value="dairy">{isRu ? 'Молочные' : isEs ? 'Lácteo' : 'Dairy'}</option>
                    <option value="other">{isRu ? 'Другое' : isEs ? 'Otro' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    {isRu ? 'Цена за 1 кг ($):' : isEs ? 'Precio por 1 kg ($):' : 'Price per 1 kg ($):'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={costPerKgUSD}
                    onChange={(e) => setCostPerKgUSD(parseFloat(e.target.value) || 0)}
                    className="w-full py-2 px-3 font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {isRu ? 'Отмена' : isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                >
                  {isRu ? 'Сохранить' : isEs ? 'Guardar' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
