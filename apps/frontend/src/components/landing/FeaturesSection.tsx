import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  FileSpreadsheet, 
  Baby, 
  Ambulance, 
  ShieldCheck, 
  Video, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: FileSpreadsheet,
      title: t('features.smartAncTitle'),
      desc: t('features.smartAncDesc'),
      highlight: "Automated Trimester Calculation"
    },
    {
      icon: Baby,
      title: t('features.laborWardTitle'),
      desc: t('features.laborWardDesc'),
      highlight: "ICMR & WHO Guideline Compliant"
    },
    {
      icon: Ambulance,
      title: t('features.casualtyRadarTitle'),
      desc: t('features.casualtyRadarDesc'),
      highlight: "Live GPRS Ambulance Tracking"
    },
    {
      icon: ShieldCheck,
      title: t('features.childHubTitle'),
      desc: t('features.childHubDesc'),
      highlight: "Growth Chart Analytics"
    },
    {
      icon: Video,
      title: t('features.teleIcuTitle'),
      desc: t('features.teleIcuDesc'),
      highlight: "Virtual Rounds by Specialist Doctors"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070a12] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('features.tag')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {t('features.title')}
            </h2>
          </div>
          <div className="text-xs text-slate-400 max-w-sm">
            Engineered to operate seamlessly across high-volume tertiary hospitals as well as bandwidth-constrained primary health centers.
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 glass-card-hover group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 text-slate-800 group-hover:text-emerald-500/20 transition-colors">
                  <ArrowUpRight className="w-8 h-8" />
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {feature.highlight}
                  </span>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
