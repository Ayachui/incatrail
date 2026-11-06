"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Ingredient, Language, PercentageMode, Recipe } from '@/lib/lab/types';
import { INITIAL_INGREDIENTS } from '@/lib/lab/data/ingredients';
import { DEFAULT_RECIPES } from '@/lib/lab/data/defaultRecipes';
import { calculateFormulation } from '@/lib/lab/utils/bioSynergyEngine';
import {
  EconomicsInputSettings,
  DEFAULT_ECONOMICS_SETTINGS,
} from '@/lib/lab/utils/economicsEngine';
import { TopBar } from './TopBar';
import { BottomNav, ActiveTab } from './BottomNav';
import { PinLockModal, UserRole } from './PinLockModal';
import { CalculatorView } from './views/CalculatorView';
import { SynergyView } from './views/SynergyView';
import { TechCardView } from './views/TechCardView';
import { LabelView } from './views/LabelView';
import { ClientNarrativeView } from './views/ClientNarrativeView';
import { EconomicsView } from './views/EconomicsView';
import { IngredientsView } from './views/IngredientsView';
import { FirebaseConfigView } from './views/FirebaseConfigView';
import { SocialMediaGeneratorView } from './views/SocialMediaGeneratorView';
import { SettingsView } from './views/SettingsView';

export default function LabApp() {
  const [mounted, setMounted] = useState(false);

  // 1. PIN Security & Access Control
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>('user');

  // 2. Language (ru | en | es) & Percentage Mode (bakers | standard)
  const [language, setLanguage] = useState<Language>('ru');
  const [percentageMode, setPercentageMode] = useState<PercentageMode>('bakers');

  // 3. Theme
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // 4. Navigation Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');

  // 5. Data Store: Ingredients & Recipes
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [recipes, setRecipes] = useState<Recipe[]>(DEFAULT_RECIPES);
  const [activeRecipeId, setActiveRecipeId] = useState<string>('recipe_neurogenesis_70');

  // 6. Economics Settings
  const [economicsSettings, setEconomicsSettings] = useState<EconomicsInputSettings>(DEFAULT_ECONOMICS_SETTINGS);

  // Hydration sync with localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const auth = localStorage.getItem('inca_lab_session_auth');
      if (auth === 'true') {
        setIsLocked(false);
      }
      const savedRole = localStorage.getItem('inca_lab_session_role') as UserRole;
      if (savedRole === 'admin' || savedRole === 'user') {
        setRole(savedRole);
      }
      const savedLang = localStorage.getItem('inca_lab_lang') as Language;
      if (savedLang === 'en' || savedLang === 'es' || savedLang === 'ru') {
        setLanguage(savedLang);
      }
      const savedPct = localStorage.getItem('inca_lab_pct_mode') as PercentageMode;
      if (savedPct === 'bakers' || savedPct === 'standard') {
        setPercentageMode(savedPct);
      }
      const savedTheme = localStorage.getItem('inca_lab_theme');
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
      } else {
        setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }

      const savedIngs = localStorage.getItem('inca_lab_ingredients');
      if (savedIngs) {
        try {
          setIngredients(JSON.parse(savedIngs));
        } catch (e) {}
      }

      const savedRecipes = localStorage.getItem('inca_lab_recipes');
      if (savedRecipes) {
        try {
          const parsed: Recipe[] = JSON.parse(savedRecipes);
          setRecipes(parsed.map((r) => {
            const def = DEFAULT_RECIPES.find((d) => d.id === r.id);
            if (def && def.isPreset) {
              return {
                ...r,
                nameEs: def.nameEs || r.nameEs,
                descriptionEs: def.descriptionEs || r.descriptionEs,
                items:
                  r.id === 'recipe_inca_master_70' &&
                  r.items.some((i) => i.ingredientId === 'panela' && Math.abs(i.bakersPercentage - 45.8) < 0.2)
                    ? def.items
                    : r.items,
              };
            }
            return r;
          }));
        } catch (e) {}
      }

      const savedEcon = localStorage.getItem('inca_lab_econ_settings');
      if (savedEcon) {
        try {
          setEconomicsSettings(JSON.parse(savedEcon));
        } catch (e) {}
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('inca_lab_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('inca_lab_theme', 'light');
    }
  }, [darkMode, mounted]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('inca_lab_lang', lang);
  };

  const handlePercentageModeChange = (mode: PercentageMode) => {
    setPercentageMode(mode);
    localStorage.setItem('inca_lab_pct_mode', mode);
  };

  const handleLockApp = () => {
    localStorage.removeItem('inca_lab_session_auth');
    localStorage.removeItem('inca_lab_session_role');
    setIsLocked(true);
  };

  const handleUnlock = (unlockedRole: UserRole) => {
    setRole(unlockedRole);
    setIsLocked(false);
  };

  const handleEconomicsChange = (newSettings: EconomicsInputSettings) => {
    setEconomicsSettings(newSettings);
    localStorage.setItem('inca_lab_econ_settings', JSON.stringify(newSettings));
  };

  const activeRecipe = useMemo(() => {
    return recipes.find((r) => r.id === activeRecipeId) || recipes[0] || DEFAULT_RECIPES[0];
  }, [recipes, activeRecipeId]);

  const ingredientsMap = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredients.forEach((ing) => map.set(ing.id, ing));
    return map;
  }, [ingredients]);

  // 7. Live Formulation Calculation Engine
  const formulation = useMemo(() => {
    return calculateFormulation(activeRecipe, ingredientsMap, true);
  }, [activeRecipe, ingredientsMap]);

  // Handlers for modifying recipe & adding custom ingredients
  const handleRecipeChange = (updatedRecipe: Recipe) => {
    const updated = recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r));
    setRecipes(updated);
    localStorage.setItem('inca_lab_recipes', JSON.stringify(updated));
  };

  const handleSelectRecipe = (id: string) => {
    setActiveRecipeId(id);
  };

  const handleAddRecipe = (newRecipe: Recipe) => {
    const updated = [...recipes, newRecipe];
    setRecipes(updated);
    localStorage.setItem('inca_lab_recipes', JSON.stringify(updated));
    setActiveRecipeId(newRecipe.id);
  };

  const handleDeleteRecipe = (id: string) => {
    const updated = recipes.filter((r) => r.id !== id);
    setRecipes(updated);
    localStorage.setItem('inca_lab_recipes', JSON.stringify(updated));
    if (activeRecipeId === id && updated.length > 0) {
      setActiveRecipeId(updated[0].id);
    }
  };

  const handleAddCustomIngredient = (newIng: Ingredient) => {
    const updated = [...ingredients, newIng];
    setIngredients(updated);
    localStorage.setItem('inca_lab_ingredients', JSON.stringify(updated));
  };

  const handleUpdateSingleIngredient = (updatedIng: Ingredient) => {
    const updated = ingredients.map((ing) => (ing.id === updatedIng.id ? updatedIng : ing));
    setIngredients(updated);
    localStorage.setItem('inca_lab_ingredients', JSON.stringify(updated));
  };

  const handleDeleteIngredient = (id: string) => {
    const updated = ingredients.filter((ing) => ing.id !== id);
    setIngredients(updated);
    localStorage.setItem('inca_lab_ingredients', JSON.stringify(updated));
  };

  const handleUpdateIngredients = (updated: Ingredient[]) => {
    setIngredients(updated);
    localStorage.setItem('inca_lab_ingredients', JSON.stringify(updated));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#030205] text-neutral-300 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-black text-sm tracking-tighter animate-pulse">
            IT
          </div>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
            Loading Inca Trail Lab OS...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-purple-600 selection:text-white">
      {/* Top Header Navigation */}
      <TopBar
        language={language}
        onLanguageChange={handleLanguageChange}
        percentageMode={percentageMode}
        onPercentageModeChange={handlePercentageModeChange}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onLockApp={handleLockApp}
        onOpenSettings={() => setActiveTab('settings')}
        role={role}
      />

      {/* Dual Navigation: Universal top scrollbar + Mobile bottom dock */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
      />

      {/* Main Viewport Stage with bottom padding for mobile dock */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-28 lg:pb-16">
        {activeTab === 'calculator' && (
          <CalculatorView
            recipe={activeRecipe}
            onRecipeChange={handleRecipeChange}
            formulation={formulation}
            allRecipes={recipes}
            onSelectRecipe={handleSelectRecipe}
            ingredients={ingredients}
            language={language}
            percentageMode={percentageMode}
          />
        )}

        {activeTab === 'synergy' && (
          <SynergyView
            recipe={activeRecipe}
            formulation={formulation}
            language={language}
          />
        )}

        {activeTab === 'techcard' && (
          <TechCardView
            recipe={activeRecipe}
            formulation={formulation}
            language={language}
          />
        )}

        {activeTab === 'label' && (
          <LabelView
            recipe={activeRecipe}
            formulation={formulation}
            language={language}
          />
        )}

        {activeTab === 'client' && (
          <ClientNarrativeView
            recipe={activeRecipe}
            formulation={formulation}
            language={language}
          />
        )}

        {activeTab === 'social' && (
          <SocialMediaGeneratorView
            recipe={activeRecipe}
            formulation={formulation}
            language={language}
          />
        )}

        {activeTab === 'economics' && (
          <EconomicsView
            recipe={activeRecipe}
            formulation={formulation}
            language={language}
            settings={economicsSettings}
            onSettingsChange={handleEconomicsChange}
          />
        )}

        {activeTab === 'database' && (
          <IngredientsView
            ingredients={ingredients}
            onAddCustomIngredient={handleAddCustomIngredient}
            onUpdateIngredient={handleUpdateSingleIngredient}
            onDeleteIngredient={handleDeleteIngredient}
            recipes={recipes}
            activeRecipeId={activeRecipeId}
            onSelectRecipe={handleSelectRecipe}
            onUpdateRecipe={handleRecipeChange}
            onAddRecipe={handleAddRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            language={language}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            ingredients={ingredients}
            onUpdateIngredients={handleUpdateIngredients}
            language={language}
            onLanguageChange={handleLanguageChange}
            percentageMode={percentageMode}
            onPercentageModeChange={handlePercentageModeChange}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onLockApp={handleLockApp}
          />
        )}

        {activeTab === 'firebase' && (
          <FirebaseConfigView
            recipes={recipes}
            ingredients={ingredients}
            language={language}
          />
        )}
      </main>

      {/* Security PIN Lock Dialog */}
      <PinLockModal
        isOpen={isLocked}
        onUnlock={handleUnlock}
        language={language}
      />
    </div>
  );
}
