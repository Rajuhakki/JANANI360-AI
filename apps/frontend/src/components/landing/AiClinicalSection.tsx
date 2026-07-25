import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  FileCheck,
  Stethoscope
} from 'lucide-react';

export const AiClinicalSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    t('aiSupport.feature1'),
    t('aiSupport.feature2'),
    t('aiSupport.feature3'),
    t('aiSupport.feature4')
  ];

  return (
    <section id="ai-support" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d19] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Clinical CDSS Explanations */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('aiSupport.tag')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {t('aiSupport.title')}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              {t('aiSupport.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 space-x-reverse">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-200 leading-snug">{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4 space-x-reverse pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5 space-x-reverse">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DISHA Data Privacy</span>
              </div>
              <div className="flex items-center space-x-1.5 space-x-reverse">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>ICMR Standard Guidelines</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive AI Clinical Card Simulation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="glass-panel-accent rounded-3xl p-6 border border-teal-500/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-slate-100">CDSS Live Triage Analysis</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                  High Risk (Priority 1)
                </span>
              </div>

              {/* Patient Vitals Simulation */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Patient ID:</span>
                  <span className="font-mono text-slate-200 font-bold">KA-2026-89412</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Gestational Age:</span>
                  <span className="text-slate-200 font-bold">34 Weeks 2 Days</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Blood Pressure:</span>
                  <span className="text-red-400 font-bold font-mono">168 / 112 mmHg (Severe)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Proteinuria:</span>
                  <span className="text-amber-400 font-bold">+++ Positive</span>
                </div>
              </div>

              {/* Explainable AI Rationale */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-1.5 space-x-reverse text-xs font-bold text-teal-300">
                  <FileCheck className="w-4 h-4 text-teal-400" />
                  <span>Clinical Rationale & Directive:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Severe Pre-Eclampsia trigger criteria met (Systolic &gt; 160 &amp; Proteinuria &gt; 2+). High risk of eclamptic seizures.
                </p>
                <div className="text-[10px] font-bold text-emerald-400 pt-1">
                  Recommended Intervention: Administer MgSO4 loading dose per NHM protocol &amp; initiate emergency ICU referral.
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
