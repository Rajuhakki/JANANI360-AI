import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Building2, MapPin, Award, CheckCircle } from 'lucide-react';

export const InitiativesSection: React.FC = () => {
  const { t } = useTranslation();

  const districts = [
    { name: "Bengaluru Urban", status: "Zero MMR Benchmark", count: "142 Facilities" },
    { name: "Mysuru", status: "100% ANC Digitized", count: "118 Facilities" },
    { name: "Belagavi", status: "24/7 Tele-ICU Active", count: "156 Facilities" },
    { name: "Kalaburagi", status: "High Risk Triage Active", count: "134 Facilities" },
    { name: "Dakshina Kannada", status: "Pediatric Hub Sync", count: "98 Facilities" },
    { name: "Shivamogga", status: "108 Telemetry Lock", count: "84 Facilities" }
  ];

  return (
    <section id="initiatives" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070a12] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('header.nav.initiatives')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Karnataka District Command Coverage
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            31 Districts synchronized into the unified JANANI360 AI Public Health Grid.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((d, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{d.name}</h4>
                  <span className="text-[11px] font-semibold text-emerald-400 block">{d.status}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {d.count}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
