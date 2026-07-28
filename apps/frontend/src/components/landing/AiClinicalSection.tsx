import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  FileCheck,
  Stethoscope,
  Activity
} from 'lucide-react';

export const AiClinicalSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    t('aiSupport.feature1', 'Predictive Gestational Diabetes & Anemia Flagging'),
    t('aiSupport.feature2', 'Automated Postpartum Hemorrhage (PPH) Early Warning'),
    t('aiSupport.feature3', 'Vernacular Voice Prompt Summarization for ASHAs'),
    t('aiSupport.feature4', 'Real-time Tele-Consultation Triage Escalation')
  ];

  return (
    <section id="ai-support" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d19] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Clinical CDSS Explanations */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <BrainCircuit className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{t('aiSupport.tag', 'Clinical Decision Support (CDSS)')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t('aiSupport.title', 'Explainable AI for Maternal Mortality Risk Prevention')}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              {t('aiSupport.subtitle', 'Our AI engines constantly monitor longitudinal obstetric markers, generating actionable clinical directives that help medical officers initiate life-saving treatments hours ahead of acute deterioration.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 shadow-md">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-slate-200 leading-snug">{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DISHA Data Privacy Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400 shrink-0" />
                <span>ICMR & WHO Guideline Standardized</span>
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
            <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-teal-500/35 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-sm font-extrabold text-white">CDSS Live Triage Telemetry</span>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/35 shadow-sm animate-pulse">
                  High Risk (Priority 1)
                </span>
              </div>

              {/* Patient Vitals Simulation */}
              <div className="space-y-2.5 text-xs font-medium bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-850/50">
                  <span>Patient Identifier:</span>
                  <span className="font-mono text-slate-200 font-bold">KA-2026-89412</span>
                </div>
                <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-850/50">
                  <span>Gestational Age:</span>
                  <span className="text-slate-200 font-bold">34 Weeks 2 Days</span>
                </div>
                <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-850/50">
                  <span>Blood Pressure (Vitals):</span>
                  <span className="text-red-400 font-bold font-mono">168 / 112 mmHg (Severe)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Proteinuria Marker:</span>
                  <span className="text-amber-400 font-bold">+++ Positive</span>
                </div>
              </div>

              {/* Explainable AI Rationale */}
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-teal-950/40 to-slate-900 border border-teal-500/40 space-y-2.5 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-extrabold text-teal-300">
                  <FileCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>AI Clinical Rationale & Directive:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Severe Pre-Eclampsia criteria met (Systolic &gt; 160 &amp; Proteinuria &gt; 2+). Imminent risk of eclamptic seizures without interventions.
                </p>
                <div className="text-[11px] font-extrabold text-emerald-400 pt-2 border-t border-teal-500/20 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Directive: Administer MgSO4 loading dose per NHM protocol &amp; initiate emergency hospital transfer.</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
