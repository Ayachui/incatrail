"use client";
import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, UserCheck, ShieldAlert } from 'lucide-react';
import { Language } from '@/lib/lab/types';
import { TRANSLATIONS } from '@/lib/lab/utils/i18n';

export type UserRole = 'user' | 'admin';

interface PinLockModalProps {
  isOpen: boolean;
  onUnlock: (role: UserRole) => void;
  language: Language;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({ isOpen, onUnlock, language }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [remember, setRemember] = useState(true);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUserPin = typeof window !== 'undefined' ? localStorage.getItem('inca_lab_user_pin') : null;
    const storedAdminPin = typeof window !== 'undefined' ? localStorage.getItem('inca_lab_admin_pin') : null;

    const validUserPin = storedUserPin || '0611';
    const validAdminPin = storedAdminPin || '1508';

    if (pin === validAdminPin) {
      if (remember) {
        localStorage.setItem('inca_lab_session_auth', 'true');
        localStorage.setItem('inca_lab_session_role', 'admin');
      }
      setError(false);
      onUnlock('admin');
    } else if (pin === validUserPin) {
      if (remember) {
        localStorage.setItem('inca_lab_session_auth', 'true');
        localStorage.setItem('inca_lab_session_role', 'user');
      }
      setError(false);
      onUnlock('user');
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-2xl bg-[#0a0812] p-6 shadow-2xl border border-[#3b1c4a]/60 text-center text-white animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-950/70 border border-purple-500/30 text-[#c39bd3] flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-white font-serif">
          {t.lockedTitle}
        </h2>
        <p className="mt-1 text-xs text-neutral-400">
          {t.lockedSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1 text-left">
              {t.enterPin}
            </label>
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                autoFocus
                placeholder="••••"
                className={`w-full text-center text-2xl tracking-widest font-mono h-12 rounded-xl border bg-[#030205] text-white focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-rose-500 ring-rose-500/20'
                    : 'border-[#3b1c4a] focus:border-[#c39bd3] focus:ring-[#c39bd3]/20'
                }`}
              />
              <KeyRound className="absolute left-3.5 top-3.5 w-5 h-5 text-neutral-500" />
            </div>
            {error && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">
                {t.pinError}
              </p>
            )}
          </div>

          <label className="flex items-center justify-center gap-2 cursor-pointer text-xs text-neutral-400 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-neutral-700 bg-neutral-900 text-purple-600 focus:ring-purple-500"
            />
            <span>{t.rememberSession}</span>
          </label>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.unlockBtn}</span>
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#3b1c4a]/40 text-[11px] text-neutral-500 flex flex-col gap-1">
          <span>Inca Trail Foods • Internal R&D Suite</span>
          <span className="text-[10px] text-neutral-600">Access Restricted • User: 0611 | Admin: 1508</span>
        </div>
      </div>
    </div>
  );
};
