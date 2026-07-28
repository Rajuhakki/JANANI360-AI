import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Ambulance, 
  Radio, 
  Syringe, 
  ArrowRight,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';

export const ReferralWorkflowSection: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      stepNum: "01",
      icon: AlertTriangle,
      title: t('referralWorkflow.step1', 'ASHA Worker Identification & AI Flag'),
      desc: t('referralWorkflow.step1Desc', 'ASHA registers high-risk symptoms during village ANC rounds and clicks send referral.'),
      color: "red",
      badge: "Field Triage"
    },
    {
      stepNum: "02",
      icon: Radio,
      title: t('referralWorkflow.step2', 'PHC Medical Officer Live Roster'),
      desc: t('referralWorkflow.step2Desc', 'Referral instantly populates line-by-line on the PHC Doctor Model dashboard with diagnostic markers.'),
      color: "amber",
      badge: "Doctor Evaluation"
    },
    {
      stepNum: "03",
      icon: Ambulance,
      title: t('referralWorkflow.step3', '108 Ambulance GPS Synchronized Dispatch'),
      desc: t('referralWorkflow.step3Desc', 'Upon admission determination, GPS telemetry locates and dispatches the nearest equipped ambulance.'),
      color: "emerald",
      badge: "Transit Lock"
    },
    {
      stepNum: "04",
      icon: Syringe,
      title: t('referralWorkflow.step4', 'District Labor Ward Partograph Intake'),
      desc: t('referralWorkflow.step4Desc', 'Hospital obstetrics teams receive patient history prior to arrival and monitor delivery via electronic partograph.'),
      color: "teal",
      badge: "Ward Care"
    }
  ];

  return (
    <section id="referral-radar" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070a12] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{t('referralWorkflow.tag', 'Emergency Telemetry Protocol')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('referralWorkflow.title', 'Zero-Delay Referral to Labor Room Pipeline')}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            A continuous four-stage telemetry circuit ensuring high-risk mothers identified in remote villages receive immediate hospital ward intervention without paperwork delays.
          </p>
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
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hover:border-red-500/50 shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
                    <span className="text-3xl font-black text-slate-600 group-hover:text-red-400 transition-colors font-mono">
                      {step.stepNum}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-inner group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 shrink-0" />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 border border-slate-800 shadow-sm">
                    {step.badge}
                  </span>

                  <h3 className="text-lg font-black text-white leading-tight group-hover:text-red-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-bold text-slate-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Protocol Automated</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
