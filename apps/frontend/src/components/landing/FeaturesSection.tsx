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
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: FileSpreadsheet,
      title: t('features.smartAncTitle', 'Smart Antenatal (ANC) Intake Hub'),
      desc: t('features.smartAncDesc', 'AI-assisted clinical intake that automatically flags underlying comorbidities, anemia severity, and pre-eclampsia risks during check-ups.'),
      highlight: "Automated Trimester Calculation"
    },
    {
      icon: Baby,
      title: t('features.laborWardTitle', 'Real-Time Labor Room Partograph'),
      desc: t('features.laborWardDesc', 'Dynamic WHO electronic partograph monitoring cervical dilation, fetal heart rates, and maternal contractions with automated emergency intervention triggers.'),
      highlight: "ICMR & WHO Guideline Compliant"
    },
    {
      icon: Ambulance,
      title: t('features.casualtyRadarTitle', 'Emergency Casualty ER Radar'),
      desc: t('features.casualtyRadarDesc', 'Pre-hospital triage synchronization providing incoming OBGYN casualty alerts with patient clinical history to hospital emergency teams before arrival.'),
      highlight: "Live GPRS Ambulance Tracking"
    },
    {
      icon: ShieldCheck,
      title: t('features.childHubTitle', 'Comprehensive Newborn & Child Hub'),
      desc: t('features.childHubDesc', 'Generates permanent RCH tracking codes upon birth, monitoring birth weight, APGAR scores, developmental milestones, and immunization schedules.'),
      highlight: "Growth Chart Analytics"
    },
    {
      icon: Video,
      title: t('features.teleIcuTitle', 'Statewide Specialist Tele-Consultation'),
      desc: t('features.teleIcuDesc', 'Connects remote primary health centers with tertiary hospital OBGYN specialists for emergency real-time clinical guidance and tele-ICU reviews.'),
      highlight: "Virtual Rounds by Specialist Doctors"
    },
    {
      icon: CheckCircle2,
      title: "Line-by-Line PHC Medical Officer Model",
      desc: "Instant live queue linking ASHA field submissions directly to PHC doctor dashboards for official clinical evaluation and hospital ward admission.",
      highlight: "Direct ASHA-to-Doctor Queue"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070a12] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('features.tag', 'Advanced Platform Capabilities')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t('features.title', 'Next-Gen Operational Capabilities')}
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-300 font-medium max-w-md leading-relaxed">
            Engineered to operate seamlessly across high-volume tertiary district medical centers as well as bandwidth-constrained remote primary health facilities.
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
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-slate-900/85 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-emerald-500/45 shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-5 right-5 text-slate-700 group-hover:text-emerald-400/40 transition-colors">
                  <ArrowUpRight className="w-6 h-6" />
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-slate-800 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 shrink-0" />
                  </div>

                  <span className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-xl bg-slate-950 text-emerald-300 border border-slate-800 shadow-sm">
                    {feature.highlight}
                  </span>

                  <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
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
