import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, Cpu, Radio, Shield, HeartPulse, Check } from 'lucide-react';

export const OverviewSection: React.FC = () => {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: Users,
      title: t('overview.pillar1Title'),
      desc: t('overview.pillar1Desc'),
      badge: "ASHA Field Sync",
      color: "emerald"
    },
    {
      icon: Cpu,
      title: t('overview.pillar2Title'),
      desc: t('overview.pillar2Desc'),
      badge: "DISHA Compliant AI",
      color: "teal"
    },
    {
      icon: Radio,
      title: t('overview.pillar3Title'),
      desc: t('overview.pillar3Desc'),
      badge: "108 Telemetry Lock",
      color: "red"
    },
    {
      icon: Shield,
      title: t('overview.pillar4Title'),
      desc: t('overview.pillar4Desc'),
      badge: "0-5 Yrs Child Health",
      color: "indigo"
    }
  ];

  return (
    <section id="overview" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d19] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
            <span>{t('overview.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            {t('overview.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            {t('overview.description')}
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
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 glass-card-hover flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center space-x-1.5 space-x-reverse text-[11px] font-semibold text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
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
