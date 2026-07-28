import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Quote, Heart, Stethoscope, HeartHandshake } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: "During my home visit in Somwarpet village, the app flagged severe hypertension in Lakshmi, a 7-month pregnant mother. Within 5 minutes, an ambulance was dispatched to the district hospital. Her life and baby were saved.",
      name: "Manjula G.",
      title: "ASHA Facilitator, Kodagu District",
      icon: HeartHandshake,
      badge: "ASHA Field Hero"
    },
    {
      quote: "As a PHC Medical Officer, the automated WHO partograph and pre-eclampsia CDSS give me immediate clinical clarity. We reduced our emergency referral turnaround time from 35 minutes down to 6 minutes.",
      name: "Dr. Ananth V.",
      title: "Medical Officer, PHC Hoskote",
      icon: Stethoscope,
      badge: "PHC Medical Officer"
    },
    {
      quote: "When I had severe pain at midnight, my family received an instant SMS alert with the nearest open hospital bed and ambulance number. I delivered a healthy baby girl safely at the district hospital.",
      name: "Lakshmi Devi",
      title: "Mother, Mysuru District",
      icon: Heart,
      badge: "Mother & Family"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d19] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-3.5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <Quote className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Field Testimonials &amp; Impact Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Voices from Karnataka's Healthcare Frontlines
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Direct reports from ASHA workers, medical officers, and mothers whose lives and professional workflows have been enhanced by JANANI360 AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-indigo-500/40 shadow-xl transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-xl bg-slate-950 text-indigo-300 border border-slate-800 shadow-sm shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-normal">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs shrink-0">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{item.title}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
