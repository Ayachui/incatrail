"use client";
import React from 'react';
import Link from 'next/link';
import { Moon, Sun, Lock, ShieldCheck, Sparkles, Percent, Settings, Shield, ArrowLeft } from 'lucide-react';
import { Language, PercentageMode } from '@/lib/lab/types';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

interface TopBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  percentageMode: PercentageMode;
  onPercentageModeChange: (mode: PercentageMode) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLockApp: () => void;
  onOpenSettings?: () => void;
  role?: 'user' | 'admin';
}

export const TopBar: React.FC<TopBarProps> = ({
  language,
  onLanguageChange,
  percentageMode,
  onPercentageModeChange,
  darkMode,
  onToggleDarkMode,
  onLockApp,
  onOpenSettings,
  role = 'user',
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print transition-colors">
      {/* Primary Top Bar Row */}
      <div className="h-14 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Wordmark & Link to Site */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 group" title="Return to incatrailfoods.com">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              IT
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                INCA TRAIL <span className="text-purple-600 dark:text-purple-400 font-extrabold">LAB OS</span>
              </span>
              <span className="hidden md:inline text-[10px] text-slate-400 font-mono tracking-wider -mt-0.5">
                CACAO ZAMORA • 18 µm
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium tracking-wider uppercase text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-full"
            title="Return to main site"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Site</span>
          </Link>

          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
            role === 'admin'
              ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60 font-semibold'
              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
          }`}>
            {role === 'admin' ? 'ADMIN' : 'USER'}
          </span>
        </div>

        {/* Global Controls & Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Percentage Mode: Baker's vs Standard (Hidden on very narrow screens, shown in sub-bar) */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => onPercentageModeChange('bakers')}
              className={`px-2 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                percentageMode === 'bakers'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.bakersMode}
            </button>
            <button
              type="button"
              onClick={() => onPercentageModeChange('standard')}
              className={`px-2 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                percentageMode === 'standard'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.standardMode}
            </button>
          </div>

          {/* Trilingual Switcher: RU | EN | ES (Always visible on all screen sizes!) */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={() => onLanguageChange('ru')}
              className={`px-1.5 sm:px-2 py-1 rounded-md font-bold transition-all ${
                language === 'ru'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 sm:px-2 py-1 rounded-md font-bold transition-all ${
                language === 'en'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('es')}
              className={`px-1.5 sm:px-2 py-1 rounded-md font-bold transition-all ${
                language === 'es'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ES
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            title="Toggle Light/Dark Theme"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Settings Shortcut */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              title={t.navSettings || 'Settings'}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Security PIN Lock Action */}
          <button
            type="button"
            onClick={onLockApp}
            title={t.lockApp}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline font-mono text-[11px]">PIN OK</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Bar: Percentage Switch for small screens */}
      <div className="sm:hidden px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 font-medium">
          {language === 'ru' ? 'Режим расчета:' : language === 'es' ? 'Modo de cálculo:' : 'Calculation mode:'}
        </span>
        <div className="flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg text-[11px]">
          <button
            type="button"
            onClick={() => onPercentageModeChange('bakers')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              percentageMode === 'bakers'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.bakersMode}
          </button>
          <button
            type="button"
            onClick={() => onPercentageModeChange('standard')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
              percentageMode === 'standard'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.standardMode}
          </button>
        </div>
      </div>
    </header>
  );
};
