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
  HeartHandshake,
  Stethoscope,
  Radio
} from 'lucide-react';

interface HeroSectionProps {
  onOpenLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[88vh] bg-[#070a12] pt-8 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
      {/* Dynamic Background Radial Glows & Grid Pattern */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-transparent rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-10 w-[550px] h-[550px] bg-gradient-to-tl from-cyan-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none translate-y-1/3"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
        
        {/* Left Column: Headline, Description & CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7 space-y-7"
        >
          {/* Official Accreditation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-black tracking-wide shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <span>{t('hero.badge', 'Government of Karnataka · AI Maternal Health Mission')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>

          {/* Main Title Typography */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            <span className="block">{t('hero.titleLine1', 'Next-Generation AI OS for')}</span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent block mt-1.5">
              {t('hero.titleLine2', 'Maternal & Child Healthcare')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            {t('hero.subtitle', 'Empowering ASHA Workers, Medical Officers, and Health Officials with intelligent high-risk triage, real-time partograph observation, and seamless hospital delivery coordination across Karnataka.')}
          </p>

          {/* Action Button Strip */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onOpenLogin}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 active:scale-98"
            >
              <span>{t('hero.primaryCta', 'Official Login / Role Access')}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/track')}
              className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-700/80 hover:border-emerald-500/50 text-slate-100 font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('hero.secondaryCta', 'Mother & Family Track Portal')}</span>
            </button>
          </div>

          {/* Live System Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-xl sm:text-2xl">
                <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t('hero.stats.mothersTracked', '320,000+')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">{t('hero.stats.mothersLabel', 'Mothers & Infants Tracked')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-teal-300 font-black text-xl sm:text-2xl">
                <Activity className="w-5 h-5 text-teal-400 shrink-0" />
                <span>{t('hero.stats.riskPrevention', '94.8%')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">{t('hero.stats.riskLabel', 'AI High-Risk Detection Rate')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-cyan-300 font-black text-xl sm:text-2xl">
                <Building2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>{t('hero.stats.facilitiesConnected', '2,400+')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">{t('hero.stats.facilitiesLabel', 'PHCs & District Hubs Wired')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xl sm:text-2xl">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{t('hero.stats.turnaroundTime', '< 15 Min')}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug">{t('hero.stats.turnaroundLabel', 'Emergency Triage Action Time')}</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: High-Tech Visual Hub & Telemetry Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl shadow-emerald-950/50 bg-slate-900/90 group">
            {/* Primary Integrated Healthcare Photography */}
            <img 
              src="/images/hero-hospital.jpg" 
              alt="Government Maternal Healthcare Center Doctor and Nurse" 
              loading="eager"
              className="w-full h-[440px] sm:h-[500px] object-cover object-center transform group-hover:scale-103 transition-transform duration-700 brightness-[0.92] contrast-[1.05]"
            />

            {/* Gradient Overlays for Depth & Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-slate-950/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-transparent to-transparent"></div>

            {/* Floating Live Triage Radar Card - Top Right */}
            <div className="absolute top-4 right-4 max-w-[250px] bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/40 shadow-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                  <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">{t('hero.cards.liveStatus', 'AI Triage Active')}</span>
                </div>
                <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <Ambulance className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-100 block">{t('hero.cards.activeReferrals', '108 Ambulance Unit')}</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">{t('hero.cards.triagedByAI', 'GPS Telemetry Synchronized')}</span>
                </div>
              </div>
            </div>

            {/* Floating Medical Officer Status Card - Top Left */}
            <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-800 flex items-center gap-2.5 shadow-xl">
              <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
                <Stethoscope className="w-4 h-4 text-teal-300" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">PHC Model Hub</span>
                <span className="text-xs font-black text-slate-100 block">Doctor Queue Ready</span>
              </div>
            </div>

            {/* Floating ASHA Community & Ward Card - Bottom Inset */}
            <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-slate-900/95 via-slate-950/95 to-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-teal-500/40 shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/30 to-emerald-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0">
                  <HeartHandshake className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{t('hero.cards.ashaActive', 'ASHA Worker Community Roster')}</h4>
                  <p className="text-[11px] text-slate-300 font-medium">{t('hero.cards.districtAlert', 'Instant QR Scanning & Offline Maternal Intake Enabled')}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
