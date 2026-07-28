import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Cpu, Radio, Shield, HeartPulse, Check } from 'lucide-react';

export const OverviewSection: React.FC = () => {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: Users,
      title: t('overview.pillar1Title', 'Field-to-Cloud ASHA Telemetry'),
      desc: t('overview.pillar1Desc', 'Enables community workers to record vitals and symptoms offline with intelligent real-time database synchronization.'),
      badge: "ASHA Field Sync",
      color: "emerald"
    },
    {
      icon: Cpu,
      title: t('overview.pillar2Title', 'AI High-Risk Clinical Prediction'),
      desc: t('overview.pillar2Desc', 'Deep generative models predict eclampsia, hemorrhage, and severe anemia hours before acute clinical manifestations.'),
      badge: "DISHA Compliant AI",
      color: "teal"
    },
    {
      icon: Radio,
      title: t('overview.pillar3Title', 'Automated Triage & Ambulance Lock'),
      desc: t('overview.pillar3Desc', 'Directly links high-risk alerts to emergency 108 dispatchers and regional District Hospital labor ward dashboards.'),
      badge: "108 Telemetry Lock",
      color: "red"
    },
    {
      icon: Shield,
      title: t('overview.pillar4Title', 'Continuous Pediatric Tracking'),
      desc: t('overview.pillar4Desc', 'Extends surveillance through childbirth into early childhood (0-5 yrs) with smart vaccination schedules and HBNC logs.'),
      badge: "0-5 Yrs Child Health",
      color: "indigo"
    }
  ];

  return (
    <section id="overview" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d19] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <HeartPulse className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
            <span>{t('overview.tag', 'Core Ecosystem Architecture')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('overview.title', 'Integrated Maternal & Child Protection Grid')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            {t('overview.description', 'Connecting decentralized primary community outreach with centralized tertiary specialists through continuous clinical artificial intelligence.')}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all transform hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-slate-950 text-emerald-300 border border-slate-800 shadow-sm shrink-0">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">{pillar.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{pillar.desc}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800 flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Standardized Public Protocol</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
