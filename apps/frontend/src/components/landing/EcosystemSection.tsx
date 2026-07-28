import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Network, ShieldCheck, Database, Server, Check } from 'lucide-react';

export const EcosystemSection: React.FC = () => {
  const { t } = useTranslation();

  const Integrations = [
    {
      title: t('initiatives.abdmTitle', 'ABDM & Ayushman Bharat ID'),
      desc: t('initiatives.abdmDesc', 'Native bi-directional synchronization with ABHA health accounts for seamless inter-hospital EHR portability across India.'),
      icon: Database,
      tag: "ABHA Health ID"
    },
    {
      title: t('initiatives.dishaTitle', 'DISHA Privacy & Data Protection'),
      desc: t('initiatives.dishaDesc', 'End-to-end AES-256 encrypted data pipelines adhering strictly to the National Digital Health Data Security Act standards.'),
      icon: ShieldCheck,
      tag: "AES-256 Encrypted"
    },
    {
      title: t('initiatives.eswasthyaTitle', 'RCH 2.0 & e-Swasthya Interop'),
      desc: t('initiatives.eswasthyaDesc', 'Direct connectivity with existing State and Central HMIS registries to eliminate duplicate manual data entry for health officers.'),
      icon: Server,
      tag: "RCH 2.0 Bi-directional"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070a12] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <Network className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{t('header.nav.ecosystem', 'Interoperability Grid')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('initiatives.title', 'Native Integration with National Standards')}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            JANANI360 AI integrates cleanly into existing Government health infrastructure without breaking legacy workflows or requiring parallel documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Integrations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-cyan-500/50 shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 shadow-sm shrink-0">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{item.desc}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800 flex items-center gap-2 text-[11px] font-bold text-slate-400">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>State Registry Compatible</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
