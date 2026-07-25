import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, ShieldCheck, UserCheck, Menu, X, HeartPulse } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full shadow-2xl">
      {/* Topmost Government Official Banner Bar */}
      <div className="govt-banner-bg border-b border-slate-800 text-[11px] text-slate-300 py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* State & Department Branding */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-100 font-semibold">{t('header.stateGovt')}</span>
              <span className="text-slate-500">|</span>
              <span className="hidden sm:inline text-slate-300">{t('header.department')}</span>
              <span className="hidden lg:inline text-slate-500">|</span>
              <span className="hidden lg:inline text-emerald-400 font-semibold">{t('header.mission')}</span>
            </div>
          </div>

          {/* Right Header Actions: Emergency Helpline & Language Switcher */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="hidden md:flex items-center space-x-1.5 space-x-reverse px-2.5 py-0.5 rounded-md bg-red-950/60 border border-red-500/30 text-red-300 font-bold text-[10px]">
              <PhoneCall className="w-3 h-3 text-red-400 animate-bounce" />
              <span>{t('header.helpline')}</span>
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="header" />
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Emblem */}
          <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20 border border-emerald-300/30">
              <HeartPulse className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  JANANI360 AI
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {t('common.officialOs')}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5 font-medium">
                {t('common.karnatakaGovt')}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 space-x-reverse text-xs font-semibold text-slate-300">
            <button 
              onClick={() => scrollToSection('overview')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition"
            >
              {t('header.nav.overview')}
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition"
            >
              {t('header.nav.features')}
            </button>
            <button 
              onClick={() => scrollToSection('ai-support')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition"
            >
              {t('header.nav.aiSupport')}
            </button>
            <button 
              onClick={() => scrollToSection('referral-radar')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition"
            >
              {t('header.nav.referralRadar')}
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition"
            >
              {t('header.nav.impact')}
            </button>
            <button 
              onClick={() => scrollToSection('initiatives')}
              className="px-3 py-2 rounded-xl hover:text-emerald-400 hover:bg-slate-900 transition"
            >
              {t('header.nav.initiatives')}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => navigate('/track')}
              className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition flex items-center space-x-1.5 space-x-reverse"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('header.motherPortal')}</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center space-x-1.5 space-x-reverse"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t('header.officialAccess')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2 space-x-reverse">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-xs font-semibold text-slate-300">
            <button 
              onClick={() => scrollToSection('overview')}
              className="text-left px-3 py-2 rounded-lg bg-slate-900 text-slate-200"
            >
              {t('header.nav.overview')}
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-left px-3 py-2 rounded-lg bg-slate-900 text-slate-200"
            >
              {t('header.nav.features')}
            </button>
            <button 
              onClick={() => scrollToSection('ai-support')}
              className="text-left px-3 py-2 rounded-lg bg-slate-900 text-slate-200"
            >
              {t('header.nav.aiSupport')}
            </button>
            <button 
              onClick={() => scrollToSection('referral-radar')}
              className="text-left px-3 py-2 rounded-lg bg-slate-900 text-slate-200"
            >
              {t('header.nav.referralRadar')}
            </button>
            <button 
              onClick={() => scrollToSection('impact')}
              className="text-left px-3 py-2 rounded-lg bg-slate-900 text-slate-200"
            >
              {t('header.nav.impact')}
            </button>
          </nav>
          <div className="pt-2 border-t border-slate-900 flex flex-col space-y-2">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('/track'); }}
              className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 text-xs font-semibold text-center"
            >
              {t('header.motherPortal')}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs text-center"
            >
              {t('header.officialAccess')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
