import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, 
  Stethoscope, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../../store/authSlice';

interface StakeholdersSectionProps {
  onOpenLoginWithRole: (role: UserRole) => void;
}

export const StakeholdersSection: React.FC<StakeholdersSectionProps> = ({ onOpenLoginWithRole }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.ASHA_WORKER);

  const personas = [
    {
      role: UserRole.ASHA_WORKER,
      title: t('stakeholders.ashaRole'),
      desc: t('stakeholders.ashaDesc'),
      icon: HeartHandshake,
      badge: "42,000+ Active Workers",
      color: "emerald",
      features: [
        "Offline-first mobile checklists for ANC visits",
        "Voice-guided vernacular prompts",
        "Automated High-Risk pregnant mother flags",
        "Direct SMS referral dispatch to nearest PHC"
      ]
    },
    {
      role: UserRole.DOCTOR,
      title: t('stakeholders.moRole'),
      desc: t('stakeholders.moDesc'),
      icon: Stethoscope,
      badge: "3,420+ PHC Officers",
      color: "teal",
      features: [
        "Instant CDSS risk explanations (PPH, Pre-Eclampsia)",
        "Integrated E-Prescription templates",
        "WHO Partograph intrapartum monitoring",
        "Tele-ICU specialist consultation portal"
      ]
    },
    {
      role: UserRole.HOSPITAL_ADMIN,
      title: t('stakeholders.adminRole'),
      desc: t('stakeholders.adminDesc'),
      icon: Building2,
      badge: "180+ District Hospitals",
      color: "indigo",
      features: [
        "Real-time ICU & Labor room bed telemetry",
        "Blood bank stock monitoring & reservations",
        "Ambulance casualty triage pre-notifications",
        "Staff shift rosters and emergency dispatch"
      ]
    },
    {
      role: UserRole.DISTRICT_OFFICER,
      title: t('stakeholders.dhoRole'),
      desc: t('stakeholders.dhoDesc'),
      icon: Building2,
      badge: "31 District Command Centers",
      color: "cyan",
      features: [
        "Macro district-wide maternal mortality heatmaps",
        "Facility performance & delay bottleneck audits",
        "Government scheme compliance monitoring",
        "Automated state health directive reporting"
      ]
    },
    {
      role: UserRole.PATIENT,
      title: t('stakeholders.motherRole'),
      desc: t('stakeholders.motherDesc'),
      icon: UserCheck,
      badge: "2.4M+ Registered Families",
      color: "rose",
      features: [
        "Multilingual digital health passport",
        "Emergency SOS 108 one-click distress button",
        "Immunization & WHO child growth tracker",
        "Family WhatsApp health updates"
      ]
    }
  ];

  const currentPersona = personas.find(p => p.role === activeTab) || personas[0];
  const Icon = currentPersona.icon;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#090d19] relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('stakeholders.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            {t('stakeholders.title')}
          </h2>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-4xl mx-auto">
          {personas.map((p) => {
            const TabIcon = p.icon;
            const isSelected = activeTab === p.role;
            return (
              <button
                key={p.role}
                type="button"
                onClick={() => setActiveTab(p.role)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 space-x-reverse ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Detail View */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel-accent rounded-3xl p-6 sm:p-10 border border-emerald-500/30 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
        >
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">{currentPersona.title}</h3>
                <span className="text-[11px] font-bold text-emerald-400">{currentPersona.badge}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentPersona.desc}
            </p>

            <div className="space-y-2.5 pt-2">
              {currentPersona.features.map((feat, i) => (
                <div key={i} className="flex items-start space-x-2 space-x-reverse text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onOpenLoginWithRole(currentPersona.role)}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-2 space-x-reverse"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch {currentPersona.title} Portal</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Persona Badge Card */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full glass-panel p-6 rounded-2xl border border-slate-700/60 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                <Icon className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">{currentPersona.title}</h4>
                <p className="text-[11px] font-mono text-emerald-400 uppercase mt-0.5">{currentPersona.role}</p>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                Authorized Karnataka Health OS Access Level
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
