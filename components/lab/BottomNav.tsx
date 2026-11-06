"use client";
import React, { useState } from 'react';
import {
  FlaskConical,
  Activity,
  FileText,
  Tag,
  Sparkles,
  TrendingUp,
  Database,
  Cloud,
  Share2,
  Settings,
  MoreHorizontal,
} from 'lucide-react';
import { Language } from '@/lib/lab/types';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

export type ActiveTab =
  | 'calculator'
  | 'synergy'
  | 'techcard'
  | 'label'
  | 'client'
  | 'social'
  | 'economics'
  | 'database'
  | 'settings'
  | 'firebase';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, language }) => {
  const t = TRANSLATIONS[language];
  const [showMobileMore, setShowMobileMore] = useState(false);

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'calculator', label: t.navCalculator, icon: FlaskConical },
    { id: 'synergy', label: t.navSynergy, icon: Activity },
    { id: 'techcard', label: t.navTechCard, icon: FileText },
    { id: 'label', label: t.navLabel, icon: Tag },
    { id: 'client', label: t.navClient, icon: Sparkles },
    { id: 'social', label: t.navSocial || (language === 'ru' ? 'ИИ Соцсети' : language === 'es' ? 'IA Redes' : 'AI Social'), icon: Share2 },
    { id: 'economics', label: t.navEconomics, icon: TrendingUp },
    { id: 'database', label: t.navDatabase, icon: Database },
    { id: 'settings', label: t.navSettings || (language === 'ru' ? 'Настройки' : language === 'es' ? 'Ajustes' : 'Settings'), icon: Settings },
    { id: 'firebase', label: t.navFirebase, icon: Cloud },
  ];

  return (
    <>
      {/* 1. Universal Top Horizontal Scroll Bar: Always accessible on both Mobile & Desktop! */}
      <nav className="sticky top-14 z-30 flex items-center gap-1.5 px-3 sm:px-6 py-2 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar no-print shadow-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onTabChange(tab.id);
                setShowMobileMore(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap shrink-0 text-xs ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm font-bold scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 2. Fixed Mobile Bottom Navigation Dock (High z-index z-50, shadow, always pinned at viewport bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.12)] no-print pb-safe">
        {/* Core 4 Quick Tabs */}
        {tabs.slice(0, 4).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onTabChange(tab.id);
                setShowMobileMore(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-w-[50px] transition-all ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[58px]">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Economics Tab (Prominently pinned) */}
        <button
          type="button"
          onClick={() => {
            onTabChange('economics');
            setShowMobileMore(false);
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-w-[50px] transition-all ${
            activeTab === 'economics'
              ? 'text-purple-600 dark:text-purple-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === 'economics' ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[58px]">
            {t.navEconomics}
          </span>
        </button>

        {/* More Actions Menu Drawer */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMobileMore(!showMobileMore)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-w-[50px] transition-all ${
              ['client', 'social', 'database', 'settings', 'firebase'].includes(activeTab) || showMobileMore
                ? 'text-purple-600 dark:text-purple-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">
              {language === 'ru' ? 'Еще' : language === 'es' ? 'Más' : 'More'}
            </span>
          </button>

          {/* Popup sheet when "More / Еще" is tapped */}
          {showMobileMore && (
            <div className="absolute bottom-14 right-0 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 z-50">
              {[
                { id: 'client' as const, label: t.navClient, icon: Sparkles },
                { id: 'social' as const, label: t.navSocial || (language === 'ru' ? 'ИИ Соцсети' : language === 'es' ? 'IA Redes' : 'AI Social'), icon: Share2 },
                { id: 'database' as const, label: t.navDatabase, icon: Database },
                { id: 'settings' as const, label: t.navSettings || (language === 'ru' ? 'Настройки' : language === 'es' ? 'Ajustes' : 'Settings'), icon: Settings },
                { id: 'firebase' as const, label: t.navFirebase, icon: Cloud },
              ].map((m) => {
                const Icon = m.icon;
                const isItemActive = activeTab === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onTabChange(m.id);
                      setShowMobileMore(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                      isItemActive
                        ? 'bg-purple-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
