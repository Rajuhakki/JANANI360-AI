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
      title: t('stakeholders.ashaRole', 'ASHA Health Worker'),
      desc: t('stakeholders.ashaDesc', 'Community workers leveraging mobile checklists and automated high-risk triage in rural villages.'),
      icon: HeartHandshake,
      badge: "42,000+ Active Workers",
      color: "emerald",
      features: [
        "Offline-first mobile checklists for ANC visits & mother registration",
        "Instant smart ID Card generation with real QR Code verification",
        "Automated High-Risk pregnant mother clinical flagging",
        "Direct one-click referral transmission to PHC Medical Officers"
      ]
    },
    {
      role: UserRole.DOCTOR,
      title: t('stakeholders.moRole', 'PHC Medical Officer'),
      desc: t('stakeholders.moDesc', 'Primary Health Care doctors evaluating real-time patient referrals and clinical AI risk evaluations.'),
      icon: Stethoscope,
      badge: "3,420+ PHC Officers",
      color: "teal",
      features: [
        "Line-by-line real-time Roster of ASHA worker referrals",
        "AI clinical triage analysis (Anemia severity, Pre-eclampsia risks)",
        "WHO Partograph active labor ward admission & tracking",
        "Direct evaluation feedback loops back to field ASHA workers"
      ]
    },
    {
      role: UserRole.HOSPITAL_ADMIN,
      title: t('stakeholders.adminRole', 'Hospital Administrator'),
      desc: t('stakeholders.adminDesc', 'Managing emergency labor room capacity, NICU telemetry, and incoming 108 ambulance referrals.'),
      icon: Building2,
      badge: "180+ District Hospitals",
      color: "indigo",
      features: [
        "Real-time ICU & Labor room bed telemetry dashboards",
        "Blood bank reserve monitoring & emergency reservations",
        "Ambulance casualty triage pre-arrival notifications",
        "Staff shift rosters and emergency specialist dispatch"
      ]
    },
    {
      role: UserRole.DISTRICT_OFFICER,
      title: t('stakeholders.dhoRole', 'District Health Officer (DHO)'),
      desc: t('stakeholders.dhoDesc', 'Macro surveillance across state health districts for public maternal protection policy enforcement.'),
      icon: Building2,
      badge: "31 District Command Centers",
      color: "cyan",
      features: [
        "Macro district-wide maternal & infant health analytics",
        "Facility performance audits & emergency response latency checks",
        "Government scheme compliance & benefit transfer validation",
        "Automated State Health Department directive synchronization"
      ]
    },
    {
      role: UserRole.PATIENT,
      title: t('stakeholders.motherRole', 'Mother & Family Citizen Portal'),
      desc: t('stakeholders.motherDesc', 'Empowering families with digital health records, QR verification, and real-time emergency care linkage.'),
      icon: UserCheck,
      badge: "2.4M+ Registered Families",
      color: "rose",
      features: [
        "Digital Mother & Child Health Passport with QR Code lookup",
        "Emergency SOS 108 rapid ambulance request interface",
        "Child vaccination calendar & developmental milestone logs",
        "Automated SMS and WhatsApp health checkup reminders"
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{t('stakeholders.tag', 'Multi-Persona Ecosystem')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('stakeholders.title', 'Tailored Portals for Every Stakeholder')}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Switch tabs below to inspect how JANANI360 AI streamlines healthcare operations for frontline community workers, medical doctors, hospital administrators, and expectant families.
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800/90 max-w-5xl mx-auto shadow-xl">
          {personas.map((p) => {
            const TabIcon = p.icon;
            const isSelected = activeTab === p.role;
            return (
              <button
                key={p.role}
                type="button"
                onClick={() => setActiveTab(p.role)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <TabIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
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
          className="bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-950/95 rounded-3xl p-6 sm:p-10 border-2 border-emerald-500/35 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl"
        >
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-inner">
                <Icon className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{currentPersona.title}</h3>
                <span className="inline-block text-xs font-black text-emerald-400 mt-0.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30">
                  {currentPersona.badge}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {currentPersona.desc}
            </p>

            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Key Functional Capabilities</h4>
              {currentPersona.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onOpenLoginWithRole(currentPersona.role)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2.5 active:scale-98"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Launch {currentPersona.title} Portal</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Persona Badge Card */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full bg-slate-950/90 p-7 rounded-2xl border-2 border-slate-800 text-center space-y-5 shadow-inner">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-2xl">
                <Icon className="w-12 h-12 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-white">{currentPersona.title}</h4>
                <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">{currentPersona.role}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium">
                Official Karnataka MCH OS Security Clearance
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
