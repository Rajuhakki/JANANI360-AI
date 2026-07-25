import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Ambulance, 
  Radio, 
  Syringe, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const ReferralWorkflowSection: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      stepNum: "01",
      icon: AlertTriangle,
      title: t('referralWorkflow.step1'),
      desc: t('referralWorkflow.step1Desc'),
      color: "red"
    },
    {
      stepNum: "02",
      icon: Ambulance,
      title: t('referralWorkflow.step2'),
      desc: t('referralWorkflow.step2Desc'),
      color: "amber"
    },
    {
      stepNum: "03",
      icon: Radio,
      title: t('referralWorkflow.step3'),
      desc: t('referralWorkflow.step3Desc'),
      color: "emerald"
    },
    {
      stepNum: "04",
      icon: Syringe,
      title: t('referralWorkflow.step4'),
      desc: t('referralWorkflow.step4Desc'),
      color: "teal"
    }
  ];

  return (
    <section id="referral-radar" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070a12] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>{t('referralWorkflow.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            {t('referralWorkflow.title')}
          </h2>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-red-500/40 glass-card-hover relative space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-700 font-mono">
                    {step.stepNum}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-slate-700" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
