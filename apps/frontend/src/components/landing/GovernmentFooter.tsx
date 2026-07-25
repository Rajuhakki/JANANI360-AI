import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartPulse, ShieldCheck, Lock, PhoneCall, ExternalLink } from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';

export const GovernmentFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#05070e] text-slate-400 border-t border-slate-800 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800/80">
          
          {/* Col 1: Government Branding & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg">
                <HeartPulse className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white block">
                  JANANI360 AI Health Platform
                </span>
                <span className="text-[11px] text-slate-400">
                  {t('footer.departmentName')}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Autonomous AI-driven operating system for maternal, neonatal, and pediatric care across primary, secondary, and tertiary public healthcare facilities.
            </p>
            <div className="text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Official Address: </span>
              {t('footer.address')}
            </div>
          </div>

          {/* Col 2: Emergency Helplines */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Emergency Helplines</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2 space-x-reverse p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 font-semibold">
                <PhoneCall className="w-4 h-4 text-red-400 shrink-0" />
                <span>108 Maternal &amp; Neonatal Ambulance</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>104 State Health Information Line</span>
              </div>
            </div>
          </div>

          {/* Col 3: Language Selector & Compliance */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('common.selectLanguage')}</h4>
            <div className="space-y-3">
              <LanguageSelector variant="header" className="w-full" />
              
              <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
                <div className="flex items-center space-x-1.5 space-x-reverse text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('auth.compliantBadge')}</span>
                </div>
                <div className="flex items-center space-x-1.5 space-x-reverse text-indigo-400 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t('auth.encryptedBadge')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>{t('footer.copyright')}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#privacy" className="hover:text-slate-300 transition">{t('footer.links.privacy')}</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-300 transition">{t('footer.links.terms')}</a>
            <span>•</span>
            <a href="#accessibility" className="hover:text-slate-300 transition">{t('footer.links.accessibility')}</a>
            <span>•</span>
            <a href="https://abdm.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition flex items-center gap-1">
              <span>{t('footer.links.abdm')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
