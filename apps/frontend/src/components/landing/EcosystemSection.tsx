import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Network, ShieldCheck, Database, Server } from 'lucide-react';

export const EcosystemSection: React.FC = () => {
  const { t } = useTranslation();

  const Integrations = [
    {
      title: t('initiatives.abdmTitle'),
      desc: t('initiatives.abdmDesc'),
      icon: Database,
      tag: "ABHA Health ID"
    },
    {
      title: t('initiatives.dishaTitle'),
      desc: t('initiatives.dishaDesc'),
      icon: ShieldCheck,
      tag: "AES-256 Encrypted"
    },
    {
      title: t('initiatives.eswasthyaTitle'),
      desc: t('initiatives.eswasthyaDesc'),
      icon: Server,
      tag: "RCH 2.0 Bi-directional"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070a12] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('header.nav.ecosystem')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            {t('initiatives.title')}
          </h2>
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
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 glass-card-hover space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-700">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
