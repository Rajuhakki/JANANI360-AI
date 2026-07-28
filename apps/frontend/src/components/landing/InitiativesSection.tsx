import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Building2, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const InitiativesSection: React.FC = () => {
  const { t } = useTranslation();

  const districts = [
    { name: "Bengaluru Urban", status: "Zero MMR Benchmark", count: "142 Facilities", active: true },
    { name: "Mysuru District", status: "100% ANC Digitized", count: "118 Facilities", active: true },
    { name: "Belagavi Division", status: "24/7 Tele-ICU Active", count: "156 Facilities", active: true },
    { name: "Kalaburagi Division", status: "High Risk Triage Active", count: "134 Facilities", active: true },
    { name: "Dakshina Kannada", status: "Pediatric Hub Sync", count: "98 Facilities", active: true },
    { name: "Shivamogga District", status: "108 Telemetry Lock", count: "84 Facilities", active: true }
  ];

  return (
    <section id="initiatives" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#070a12] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('header.nav.initiatives', 'Statewide Deployment')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Karnataka District Command Coverage
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            All 31 operational districts synchronized into the unified JANANI360 AI Public Health Grid, ensuring seamless rural-to-urban care transfers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {districts.map((d, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-slate-900/85 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-4 group shadow-md"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">{d.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] font-bold text-emerald-400">{d.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 shadow-sm block">
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
