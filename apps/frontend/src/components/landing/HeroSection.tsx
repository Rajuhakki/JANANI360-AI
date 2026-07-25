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

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Headline, Description & CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            <span className="block">{t('hero.titleLine1')}</span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent block mt-1">
              {t('hero.titleLine2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            {t('hero.subtitle')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-reverse pt-2">
            <button
              onClick={onOpenLogin}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 space-x-reverse"
            >
              <span>{t('hero.primaryCta')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/track')}
              className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition flex items-center justify-center space-x-2 space-x-reverse"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('hero.secondaryCta')}</span>
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-1.5 space-x-reverse text-emerald-400 font-black text-xl sm:text-2xl">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('hero.stats.mothersTracked')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t('hero.stats.mothersLabel')}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-1.5 space-x-reverse text-teal-300 font-black text-xl sm:text-2xl">
                <Activity className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{t('hero.stats.riskPrevention')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t('hero.stats.riskLabel')}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-1.5 space-x-reverse text-cyan-300 font-black text-xl sm:text-2xl">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t('hero.stats.facilitiesConnected')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t('hero.stats.facilitiesLabel')}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center space-x-1.5 space-x-reverse text-amber-400 font-black text-xl sm:text-2xl">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('hero.stats.turnaroundTime')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t('hero.stats.turnaroundLabel')}</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: High Quality Healthcare Image Mosaic & Live Triage Overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-emerald-950/40 bg-slate-900 group">
            {/* Primary Integrated Healthcare Photography */}
            <img 
              src="/images/hero-hospital.jpg" 
              alt="Government Maternal Healthcare Center Doctor and Nurse" 
              loading="eager"
              className="w-full h-[420px] sm:h-[480px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
            />

            {/* Gradient Overlays for Readability and Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#070a12]/60 via-transparent to-transparent"></div>

            {/* Floating Care Live Status Card - Top Right */}
            <div className="absolute top-4 right-4 max-w-[240px] glass-panel p-3 rounded-2xl border border-emerald-500/30 shadow-xl space-y-1.5">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">{t('hero.cards.liveStatus')}</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Ambulance className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-xs font-bold text-slate-100">{t('hero.cards.activeReferrals')}</span>
              </div>
              <p className="text-[10px] text-slate-400">{t('hero.cards.triagedByAI')}</p>
            </div>

            {/* Floating ASHA Community Card - Bottom Left */}
            <div className="absolute bottom-4 left-4 right-4 glass-panel-accent p-4 rounded-2xl border border-teal-500/40 shadow-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{t('hero.cards.ashaActive')}</h4>
                    <p className="text-[10px] text-slate-300">{t('hero.cards.districtAlert')}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

          </div>

          {/* Secondary Thumbnail Overlay (Community ASHA Outreach) */}
          <div className="hidden sm:block absolute -bottom-6 -left-6 w-44 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl z-20">
            <img 
              src="/images/asha-outreach.jpg" 
              alt="ASHA Worker in Rural Health Outreach" 
              loading="lazy"
              className="w-full h-28 object-cover"
            />
            <div className="bg-slate-950/90 py-1 px-2 text-[10px] font-bold text-emerald-300 text-center border-t border-slate-800">
              Rural Outreach Sync
            </div>
          </div>

          {/* Tertiary Thumbnail Overlay (108 Ambulance Unit) */}
          <div className="hidden sm:block absolute -top-6 -right-6 w-44 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl z-20">
            <img 
              src="/images/emergency-ambulance.jpg" 
              alt="108 Emergency Referral Ambulance" 
              loading="lazy"
              className="w-full h-28 object-cover"
            />
            <div className="bg-slate-950/90 py-1 px-2 text-[10px] font-bold text-amber-300 text-center border-t border-slate-800">
              108 Emergency Telemetry
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
