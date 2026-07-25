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
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Quote className="w-3.5 h-3.5 text-indigo-400" />
            <span>Field Testimonials &amp; Impact Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Voices from Karnataka's Healthcare Frontlines
          </h2>
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
                className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-indigo-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">{item.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
