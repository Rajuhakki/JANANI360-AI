import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartPulse, ShieldCheck, Lock, PhoneCall, ExternalLink } from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';

export const GovernmentFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#05070e] text-slate-400 border-t border-slate-800/90 text-xs py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-800/80">
          
          {/* Col 1: Government Branding & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-md shrink-0">
                <HeartPulse className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight block">
                  JANANI360 AI Health Platform
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">
                  {t('footer.departmentName', 'Department of Health & Family Welfare, Govt. of Karnataka')}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md font-normal">
              Autonomous AI-driven operating system for maternal, neonatal, and pediatric care across primary, secondary, and tertiary public healthcare facilities in Karnataka.
            </p>
            <div className="text-[11px] text-slate-400 font-medium">
              <span className="font-bold text-slate-200">Official Address: </span>
              {t('footer.address', 'Arogyatama Bhavan, Magadi Road, Bengaluru, Karnataka 560023')}
            </div>
          </div>

          {/* Col 2: Emergency Helplines */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Emergency Telemetry Lines</h4>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 shadow-sm">
                <PhoneCall className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
                <span>108 Maternal &amp; Neonatal Ambulance</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 shadow-sm">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>104 State Health Information Line</span>
              </div>
            </div>
          </div>

          {/* Col 3: Language Selector & Compliance */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">{t('common.selectLanguage', 'Interface Language')}</h4>
            <div className="space-y-3.5">
              <LanguageSelector variant="header" className="w-full" />
              
              <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1 font-bold">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('auth.compliantBadge', 'ICMR Guideline Compliant')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-400">
                  <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{t('auth.encryptedBadge', 'DISHA Data Encrypted')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Footer Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-400">
          <p>{t('footer.copyright', '© 2026 Government of Karnataka Health Department. All rights reserved. Built with JANANI360 AI Engine.')}</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <a href="#privacy" className="hover:text-white transition-colors">{t('footer.links.privacy', 'Privacy Policy')}</a>
            <span className="text-slate-700">•</span>
            <a href="#terms" className="hover:text-white transition-colors">{t('footer.links.terms', 'Terms of Service')}</a>
            <span className="text-slate-700">•</span>
            <a href="#accessibility" className="hover:text-white transition-colors">{t('footer.links.accessibility', 'Accessibility Standard')}</a>
            <span className="text-slate-700">•</span>
            <a href="https://abdm.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <span>{t('footer.links.abdm', 'ABDM National Portal')}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
