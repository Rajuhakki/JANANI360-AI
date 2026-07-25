import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingDown, Award, Clock, ShieldCheck, Heart } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      value: t('impact.stat1Value'),
      label: t('impact.stat1Label'),
      icon: TrendingDown,
      color: "emerald"
    },
    {
      value: t('impact.stat2Value'),
      label: t('impact.stat2Label'),
      icon: Heart,
      color: "teal"
    },
    {
      value: t('impact.stat3Value'),
      label: t('impact.stat3Label'),
      icon: ShieldCheck,
      color: "cyan"
    },
    {
      value: t('impact.stat4Value'),
      label: t('impact.stat4Label'),
      icon: Clock,
      color: "amber"
    }
  ];

  return (
    <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d19] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('impact.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            {t('impact.title')}
          </h2>
        </div>

        {/* Big Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel-accent p-8 rounded-3xl border border-emerald-500/30 text-center space-y-3 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-300 leading-snug">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
