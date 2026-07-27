import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, ShieldCheck, UserCheck, Menu, X, HeartPulse, Activity } from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';

interface GovernmentHeaderProps {
  onOpenLogin: () => void;
}

export const GovernmentHeader: React.FC<GovernmentHeaderProps> = ({ onOpenLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-2xl transition-all duration-300">
      {/* Topmost Government Official Banner Bar */}
      <div className="govt-banner-bg border-b border-slate-800/90 text-xs text-slate-300 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* State & Department Branding */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-500/50 shrink-0"></span>
              <span className="text-slate-100 font-bold tracking-tight">{t('header.stateGovt')}</span>
              <span className="text-slate-600 hidden sm:inline-block">|</span>
              <span className="hidden sm:inline text-slate-300">{t('header.department')}</span>
              <span className="text-slate-600 hidden lg:inline-block">|</span>
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold text-[11px] border border-emerald-500/20">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                {t('header.mission')}
              </span>
            </div>
          </div>

          {/* Right Header Actions: Emergency Helpline & Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 font-bold text-[11px] shadow-sm shadow-red-950/50 hover:bg-red-900/90 hover:border-red-500/60 transition-all duration-200">
              <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-bounce" />
              <span className="tracking-wide">{t('header.helpline')}</span>
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="header" />
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Emblem */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group shrink-0" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/45 group-hover:scale-105 border border-emerald-300/30 transition-all duration-300 shrink-0">
              <HeartPulse className="w-6 h-6 text-slate-950 group-hover:rotate-6 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  JANANI360 AI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 font-mono shadow-inner hidden sm:inline-block">
                  {t('common.officialOs')}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-400 -mt-0.5 font-medium tracking-wide">
                {t('common.karnatakaGovt')}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links - Professional Glassmorphic Pill Container */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-slate-900/70 px-2 py-1.5 rounded-2xl border border-slate-800/90 backdrop-blur-md shadow-inner text-xs font-bold text-slate-300">
            <button 
              onClick={() => scrollToSection('overview')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-300 hover:bg-slate-800/90 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              {t('header.nav.overview')}
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-300 hover:bg-slate-800/90 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              {t('header.nav.features')}
            </button>
            <button 
              onClick={() => scrollToSection('ai-support')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-300 hover:bg-slate-800/90 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              {t('header.nav.aiSupport')}
            </button>
            <button 
              onClick={() => scrollToSection('referral-radar')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-300 hover:bg-slate-800/90 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              {t('header.nav.referralRadar')}
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-300 hover:bg-slate-800/90 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              {t('header.nav.impact')}
            </button>
            <button 
              onClick={() => scrollToSection('initiatives')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-300 hover:bg-slate-800/90 active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              {t('header.nav.initiatives')}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/track')}
              className="px-4 py-2.5 rounded-xl border border-slate-700/90 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-emerald-500/10 active:scale-95 whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('header.motherPortal')}</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/45 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{t('header.officialAccess')}</span>
            </button>
          </div>

          {/* Mobile & Medium Screen Menu Toggle */}
          <div className="flex xl:hidden items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-emerald-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5 text-emerald-400" />}
            </button>
          </div>

        </div>
      </div>

      {/* Responsive Mobile & Medium Screen Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 backdrop-blur-2xl px-4 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-1 py-1 flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Portal Navigation
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {t('common.officialOs')}
            </span>
          </div>
          <nav className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-200">
            <button 
              onClick={() => scrollToSection('overview')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 text-slate-200 hover:text-emerald-400 transition-all flex items-center justify-between"
            >
              <span>{t('header.nav.overview')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 text-slate-200 hover:text-emerald-400 transition-all flex items-center justify-between"
            >
              <span>{t('header.nav.features')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('ai-support')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 text-slate-200 hover:text-emerald-400 transition-all flex items-center justify-between"
            >
              <span>{t('header.nav.aiSupport')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('referral-radar')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 text-slate-200 hover:text-emerald-400 transition-all flex items-center justify-between"
            >
              <span>{t('header.nav.referralRadar')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 text-slate-200 hover:text-emerald-400 transition-all flex items-center justify-between"
            >
              <span>{t('header.nav.impact')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('initiatives')}
              className="text-left px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 text-slate-200 hover:text-emerald-400 transition-all flex items-center justify-between"
            >
              <span>{t('header.nav.initiatives')}</span>
            </button>
          </nav>

          <div className="md:hidden pt-3 border-t border-slate-900/90 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/track'); }}
              className="w-full py-3 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('header.motherPortal')}</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>{t('header.officialAccess')}</span>
            </button>
          </div>

          <div className="sm:hidden pt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 font-bold text-xs text-center shadow-sm">
            <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-bounce shrink-0" />
            <span>{t('header.helpline')}</span>
          </div>
        </div>
      )}
    </header>
  );
};

