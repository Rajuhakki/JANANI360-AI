import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  Users, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Ambulance, 
  HeartHandshake
} from 'lucide-react';

interface HeroSectionProps {
  onOpenLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] bg-[#070a12] pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
      {/* Dynamic Background Radial Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] hero-glow-emerald rounded-full pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] hero-glow-indigo rounded-full pointer-events-none translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start relative z-10">
        
        {/* Left Column: Headline, Description & CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-6 lg:sticky lg:top-28"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.15]">
            <span className="block">{t('hero.titleLine1')}</span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent block mt-1">
              {t('hero.titleLine2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
            {t('hero.subtitle')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              onClick={onOpenLogin}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <span>{t('hero.primaryCta')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/track')}
              className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2 hover:border-slate-600 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('hero.secondaryCta')}</span>
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xl sm:text-2xl">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('hero.stats.mothersTracked')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t('hero.stats.mothersLabel')}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-1.5 text-teal-300 font-black text-xl sm:text-2xl">
                <Activity className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{t('hero.stats.riskPrevention')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t('hero.stats.riskLabel')}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-1.5 text-cyan-300 font-black text-xl sm:text-2xl">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t('hero.stats.facilitiesConnected')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t('hero.stats.facilitiesLabel')}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-400 font-black text-xl sm:text-2xl">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('hero.stats.turnaroundTime')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t('hero.stats.turnaroundLabel')}</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Structured Live Triage Content Above, Healthcare Image Mosaic Below (Zero Overlaps) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-6 space-y-5"
        >
          {/* UPPER SIDE CONTENT: Command Monitor Status Cards */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold font-mono uppercase text-slate-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                Real-Time Clinical Telemetry & Triage
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                AI ACTIVE
              </span>
            </div>

            {/* Live Status Card 1: Emergency Referrals */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider">{t('hero.cards.liveStatus')}</span>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <Ambulance className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
                  <span className="text-sm sm:text-base font-black text-white">{t('hero.cards.activeReferrals')}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium pl-1">{t('hero.cards.triagedByAI')}</p>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right shrink-0">
                <span className="block text-xs font-black text-emerald-300 font-mono">100% ONLINE</span>
                <span className="text-[10px] text-slate-400">Emergency Protocol</span>
              </div>
            </div>

            {/* Live Status Card 2: ASHA Field Sync */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-teal-950/30 to-slate-950 border border-teal-500/40 shadow-inner flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 shadow-sm">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 flex items-center gap-2">
                    {t('hero.cards.ashaActive')}
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 inline shrink-0" />
                  </h4>
                  <p className="text-[11px] text-teal-300 font-semibold mt-0.5">{t('hero.cards.districtAlert')}</p>
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="text-xs font-bold text-emerald-400">Synchronized</span>
              </div>
            </div>
          </div>

          {/* BELOW IMAGES: Clean, Non-Overlapping Visual Gallery */}
          <div className="space-y-4 pt-1">
            {/* Primary Integrated Healthcare Photography */}
            <div className="rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group relative">
              <img 
                src="/images/hero-hospital.jpg" 
                alt="Government Maternal Healthcare Center Doctor and Nurse" 
                loading="eager"
                className="w-full h-[320px] sm:h-[380px] object-cover object-center transform group-hover:scale-102 transition-transform duration-700 brightness-[0.98]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="text-xs font-bold text-white bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm">
                  🏥 Government Maternal Healthcare Center Specialists
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Live Care Station
                </span>
              </div>
            </div>

            {/* Secondary & Tertiary Field Images in a Clean 2-Column Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-xl group flex flex-col">
                <div className="overflow-hidden relative h-32 sm:h-36 w-full">
                  <img 
                    src="/images/asha-outreach.jpg" 
                    alt="ASHA Worker in Rural Health Outreach" 
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="bg-slate-950 py-2 px-3 text-xs font-extrabold text-emerald-300 text-center border-t border-slate-800/90 flex items-center justify-center gap-1.5 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Rural Outreach Sync</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-xl group flex flex-col">
                <div className="overflow-hidden relative h-32 sm:h-36 w-full">
                  <img 
                    src="/images/emergency-ambulance.jpg" 
                    alt="108 Emergency Referral Ambulance" 
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="bg-slate-950 py-2 px-3 text-xs font-extrabold text-amber-300 text-center border-t border-slate-800/90 flex items-center justify-center gap-1.5 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>108 Emergency Telemetry</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );

};
