"use client";
import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  Shield,
  KeyRound,
  RotateCcw,
  Check,
  Search,
  Filter,
  Save,
  Sliders,
  Sparkles,
  Layers,
  Database,
  Lock,
  Globe,
} from 'lucide-react';
import { Ingredient, Language, PercentageMode } from '@/lib/lab/types';
import { INITIAL_INGREDIENTS } from '@/lib/lab/data/ingredients';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface SettingsViewProps {
  ingredients: Ingredient[];
  onUpdateIngredients: (updated: Ingredient[]) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  percentageMode: PercentageMode;
  onPercentageModeChange: (mode: PercentageMode) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLockApp: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  ingredients,
  onUpdateIngredients,
  language,
  onLanguageChange,
  percentageMode,
  onPercentageModeChange,
  darkMode,
  onToggleDarkMode,
  onLockApp,
}) => {
  const t = TRANSLATIONS[language];
  const isRu = language === 'ru';
  const isEs = language === 'es';

  // Search and filter for ingredient cost management
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Local copy of costs for batch saving
  const [costs, setCosts] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    ingredients.forEach((ing) => {
      map[ing.id] = ing.costPerKgUSD;
    });
    return map;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security PIN state (User default: 0611, Admin default: 1508)
  const [currentUserPin, setCurrentUserPin] = useState(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('inca_lab_user_pin') : null) || '0611';
  });
  const [currentAdminPin, setCurrentAdminPin] = useState(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('inca_lab_admin_pin') : null) || '1508';
  });
  const [newUserPin, setNewUserPin] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Default overhead settings in localStorage
  const [defaultLabor, setDefaultLabor] = useState<number>(() => {
    return parseFloat(localStorage.getItem('inca_lab_default_labor') || '12.0');
  });
  const [defaultBarPkg, setDefaultBarPkg] = useState<number>(() => {
    return parseFloat(localStorage.getItem('inca_lab_default_pkg_bar') || '0.85');
  });
  const [defaultBlockPkg, setDefaultBlockPkg] = useState<number>(() => {
    return parseFloat(localStorage.getItem('inca_lab_default_pkg_block') || '0.35');
  });
  const [defaultDeadLoss, setDefaultDeadLoss] = useState<number>(() => {
    return parseFloat(localStorage.getItem('inca_lab_default_deadloss') || '8.5');
  });

  const handleCostChange = (id: string, val: number) => {
    setCosts((prev) => ({
      ...prev,
      [id]: Math.max(0, val),
    }));
  };

  const handleSaveAllCosts = () => {
    const updated = ingredients.map((ing) => ({
      ...ing,
      costPerKgUSD: costs[ing.id] !== undefined ? costs[ing.id] : ing.costPerKgUSD,
    }));
    onUpdateIngredients(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetToDefaultCosts = () => {
    if (
      window.confirm(
        isRu
          ? 'Сбросить себестоимость всех ингредиентов к заводским ценам EXW Zamora?'
          : 'Reset raw material costs to baseline EXW Zamora prices?'
      )
    ) {
      const resetCosts: Record<string, number> = {};
      const updated = ingredients.map((ing) => {
        const initial = INITIAL_INGREDIENTS.find((i) => i.id === ing.id);
        const baseline = initial ? initial.costPerKgUSD : ing.costPerKgUSD;
        resetCosts[ing.id] = baseline;
        return {
          ...ing,
          costPerKgUSD: baseline,
        };
      });
      setCosts(resetCosts);
      onUpdateIngredients(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleSaveUserPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserPin.trim().length < 4) {
      setPinChangeMsg({
        text: isRu ? 'ПИН-код пользователя должен быть минимум 4 цифры' : 'User PIN must be at least 4 digits',
        success: false,
      });
      return;
    }
    localStorage.setItem('inca_lab_user_pin', newUserPin.trim());
    setCurrentUserPin(newUserPin.trim());
    setNewUserPin('');
    setPinChangeMsg({
      text: isRu ? 'ПИН пользователя успешно обновлен!' : 'User PIN updated successfully!',
      success: true,
    });
    setTimeout(() => setPinChangeMsg(null), 3000);
  };

  const handleSaveAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPin.trim().length < 4) {
      setPinChangeMsg({
        text: isRu ? 'ПИН-код администратора должен быть минимум 4 цифры' : 'Admin PIN must be at least 4 digits',
        success: false,
      });
      return;
    }
    localStorage.setItem('inca_lab_admin_pin', newAdminPin.trim());
    setCurrentAdminPin(newAdminPin.trim());
    setNewAdminPin('');
    setPinChangeMsg({
      text: isRu ? 'ПИН администратора успешно обновлен!' : 'Admin PIN updated successfully!',
      success: true,
    });
    setTimeout(() => setPinChangeMsg(null), 3000);
  };

  const handleSaveOverheads = () => {
    localStorage.setItem('inca_lab_default_labor', defaultLabor.toString());
    localStorage.setItem('inca_lab_default_pkg_bar', defaultBarPkg.toString());
    localStorage.setItem('inca_lab_default_pkg_block', defaultBlockPkg.toString());
    localStorage.setItem('inca_lab_default_deadloss', defaultDeadLoss.toString());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleHardResetApplication = () => {
    if (
      window.confirm(
        isRu
          ? 'ВНИМАНИЕ! Это действие удалит все сохраненные изменения рецептов, цен и настроек и вернет фабричное состояние. Продолжить?'
          : 'WARNING! This will clear all stored recipes, prices and custom settings back to factory state. Proceed?'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const filteredIngredients = ingredients.filter((ing) => {
    const matchesSearch =
      ing.nameRu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ing.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || ing.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isRu ? 'Настройки лаборатории и себестоимость' : 'Lab Settings & Raw Material Costs'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRu
                ? 'Управление базовыми ценами ($/кг), накладными расходами, ПИН-кодом и параметрами системы'
                : 'Manage baseline raw material costs ($/kg), overhead defaults, team security PIN and system preferences'}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{isRu ? 'Изменения сохранены!' : 'Settings saved!'}</span>
          </div>
        )}
      </div>

      {/* SECTION 1: Raw Materials Cost Management (Key User Request) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isRu ? 'Себестоимость сырья ($/кг)' : 'Raw Material Base Costs ($/kg)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isRu
                ? 'Цены напрямую транслируются в калькулятор рецептур и блок юнит-экономики'
                : 'Prices immediately cascade into recipe formulation math and unit economics engine'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefaultCosts}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRu ? 'Базовые цены' : 'Reset to Default'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAllCosts}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isRu ? 'Сохранить все цены' : 'Save All Costs'}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isRu ? 'Поиск сырья...' : 'Search raw materials...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            {['all', 'cacao', 'sweetener', 'dairy', 'spice', 'adaptogen', 'mineral'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? (isRu ? 'Все' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients Cost Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">{isRu ? 'Ингредиент' : 'Ingredient'}</th>
                <th className="py-2.5 px-3 font-semibold">{isRu ? 'Категория' : 'Category'}</th>
                <th className="py-2.5 px-4 font-semibold text-right">{isRu ? 'Себестоимость ($/кг)' : 'Base Cost ($/kg)'}</th>
                <th className="py-2.5 px-4 font-semibold text-right">{isRu ? 'Цена за 100г' : 'Cost / 100g'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {filteredIngredients.map((ing) => {
                const currentVal = costs[ing.id] !== undefined ? costs[ing.id] : ing.costPerKgUSD;
                return (
                  <tr key={ing.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {isRu ? ing.nameRu : ing.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {isRu ? ing.descriptionRu : ing.descriptionEn}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {ing.category}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <span className="font-mono text-slate-400">$</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={currentVal}
                          onChange={(e) => handleCostChange(ing.id, parseFloat(e.target.value) || 0)}
                          className="w-24 text-right font-mono font-bold text-xs py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <span className="font-mono text-slate-400">/кг</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                      ${(currentVal / 10).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: Production Overheads & Operational Defaults */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>{isRu ? 'Производственные нормативы и накладные расходы' : 'Operational Norms & Overhead Defaults'}</span>
          </h3>
          <button
            type="button"
            onClick={handleSaveOverheads}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isRu ? 'Сохранить нормативы' : 'Save Defaults'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
              {isRu ? 'Труд и амортизация меланжера ($/кг):' : 'Labor & Melanger Wear ($/kg):'}
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={defaultLabor}
              onChange={(e) => setDefaultLabor(parseFloat(e.target.value) || 0)}
              className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
              {isRu ? 'Премиум упаковка плитки ($):' : 'Luxury Bar Box & Foil ($):'}
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              value={defaultBarPkg}
              onChange={(e) => setDefaultBarPkg(parseFloat(e.target.value) || 0)}
              className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
              {isRu ? 'Вакуумный пакет блока ($):' : 'Block Vacuum Pouch ($):'}
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              value={defaultBlockPkg}
              onChange={(e) => setDefaultBlockPkg(parseFloat(e.target.value) || 0)}
              className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
              {isRu ? 'Базовые потери на камнях (%):' : 'Default Melanger Dead Loss (%):'}
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="30"
              value={defaultDeadLoss}
              onChange={(e) => setDefaultDeadLoss(parseFloat(e.target.value) || 0)}
              className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Security & PIN Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Shield className="w-4 h-4 text-purple-600" />
          <span>{isRu ? 'Безопасность и ПИН-код доступа команды' : 'Team Security & Access PIN'}</span>
        </h3>

        <div className="space-y-6">
          {pinChangeMsg && (
            <div
              className={`text-xs p-3 rounded-xl font-medium ${
                pinChangeMsg.success
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              {pinChangeMsg.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User PIN Card */}
            <form onSubmit={handleSaveUserPin} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isRu ? 'ПИН пользователя (Оператор цеха)' : 'User PIN (Lab Operator)'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {currentUserPin}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isRu ? 'По умолчанию: 0611. Дает доступ к калькулятору и расчетам.' : 'Default: 0611. Unlocks calculator, formulas, and labels.'}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  maxLength={8}
                  placeholder={isRu ? 'Новый ПИН (мин 4)' : 'New PIN (min 4)'}
                  value={newUserPin}
                  onChange={(e) => setNewUserPin(e.target.value)}
                  className="w-full font-mono text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="shrink-0 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
                >
                  {isRu ? 'Сохранить' : 'Save'}
                </button>
              </div>
            </form>

            {/* Admin PIN Card */}
            <form onSubmit={handleSaveAdminPin} className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  {isRu ? 'ПИН администратора (Главный технолог)' : 'Admin PIN (Master Formulator)'}
                </span>
                <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2.5 py-1 rounded-lg">
                  {currentAdminPin}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isRu ? 'По умолчанию: 1508. Полный административный доступ к настройкам и тарифам.' : 'Default: 1508. Grants root administrative control over rates and keys.'}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  maxLength={8}
                  placeholder={isRu ? 'Новый ПИН (мин 4)' : 'New Admin PIN (min 4)'}
                  value={newAdminPin}
                  onChange={(e) => setNewAdminPin(e.target.value)}
                  className="w-full font-mono text-xs py-2 px-3 rounded-xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="shrink-0 px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold transition-colors shadow-xs"
                >
                  {isRu ? 'Сохранить' : 'Save'}
                </button>
              </div>
            </form>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between text-xs space-y-3">
            <div>
              <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>{isRu ? 'Управление активной сессией' : 'Active Session Lockout'}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                {isRu
                  ? 'При выходе из системы или нажатии кнопки блокировки потребуется повторный ввод ПИН-кода для доступа к рецептурам и экономике.'
                  : 'Locking will immediately terminate authorization in this browser, requiring the team PIN for reentry.'}
              </p>
            </div>

            <button
              type="button"
              onClick={onLockApp}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors text-center"
            >
              {isRu ? 'Заблокировать лабораторию прямо сейчас' : 'Lock Laboratory Now'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: Application Defaults & Hard Reset */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Globe className="w-4 h-4 text-purple-600" />
          <span>{isRu ? 'Интерфейс и сброс состояния' : 'Preferences & Factory Reset'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {isRu ? 'Режим процентов по умолчанию:' : 'Default Percentage Mode:'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onPercentageModeChange('bakers')}
                className={`flex-1 py-1.5 rounded-lg font-medium ${
                  percentageMode === 'bakers'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.bakersMode}
              </button>
              <button
                type="button"
                onClick={() => onPercentageModeChange('standard')}
                className={`flex-1 py-1.5 rounded-lg font-medium ${
                  percentageMode === 'standard'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.standardMode}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {isRu ? 'Язык интерфейса по умолчанию:' : isEs ? 'Idioma de interfaz predeterminado:' : 'Default UI Language:'}
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onLanguageChange('ru')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                  language === 'ru'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                  language === 'en'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('es')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                  language === 'es'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                ES
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex flex-col justify-between">
            <div>
              <span className="block font-bold text-red-700 dark:text-red-400 mb-1">
                {isRu ? 'Заводской сброс приложения' : 'Factory Reset'}
              </span>
              <p className="text-[11px] text-red-600/80 dark:text-red-300/80">
                {isRu ? 'Очистить кэш, вернуть начальные формулы и цены' : 'Clear all local storage and revert to origin'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleHardResetApplication}
              className="mt-3 py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {isRu ? 'Сбросить все данные' : 'Reset Everything'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
