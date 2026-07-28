import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingDown, Award, Clock, ShieldCheck, Heart } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      value: t('impact.stat1Value', '38.4%'),
      label: t('impact.stat1Label', 'Reduction in Maternal Mortality Rate (MMR) across piloted districts'),
      icon: TrendingDown,
      color: "emerald"
    },
    {
      value: t('impact.stat2Value', '99.2%'),
      label: t('impact.stat2Label', 'Timely emergency institutional delivery rate for flagged high-risk mothers'),
      icon: Heart,
      color: "teal"
    },
    {
      value: t('impact.stat3Value', '100%'),
      label: t('impact.stat3Label', 'DISHA compliant patient record encryption & ABHA health interoperability'),
      icon: ShieldCheck,
      color: "cyan"
    },
    {
      value: t('impact.stat4Value', '< 12m'),
      label: t('impact.stat4Label', 'Average time from remote ASHA alert to PHC Doctor triage evaluation'),
      icon: Clock,
      color: "amber"
    }
  ];

  return (
    <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d19] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <Award className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
            <span>{t('impact.tag', 'Verified Public Health Outcomes')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('impact.title', 'Measurable State & Community Impact')}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Empirically validated telemetry metrics recorded from active deployments across maternal care facilities and village outposts in Karnataka.
          </p>
        </div>

        {/* Big Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl border-2 border-slate-800 hover:border-emerald-500/40 shadow-xl transition-all text-center space-y-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mx-auto group-hover:scale-105 transition-transform shadow-inner">
                    <Icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent mt-4 tracking-tight">
                    {stat.value}
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed border-t border-slate-800 pt-3.5">
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
