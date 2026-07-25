import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Heart, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  Phone, 
  Clock, 
  Activity, 
  Sparkles, 
  Pill, 
  User, 
  Building2, 
  AlertTriangle,
  Stethoscope,
  RefreshCw
} from 'lucide-react';
import { MotherSafetyScoreGauge } from '../components/MotherSafetyScoreGauge';
import { SosDistressButton } from '../components/SosDistressButton';
import { RootState } from '../store';
import api from '../services/api';

export const MotherPortalPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [patientData, setPatientData] = useState<any>(null);
  const [pregnancyData, setPregnancyData] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Fetch from Backend API
  const fetchMotherProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/patients/me');
      setPatientData(res.data.patient);
      setPregnancyData(res.data.pregnancy);
      setVisits(res.data.visits || []);
    } catch (err) {
      console.error('Failed to load mother profile data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMotherProfile();
  }, []);

  // EDD Days Calculation
  const calculateDaysToEdd = (eddStr?: string) => {
    if (!eddStr) return 120;
    const edd = new Date(eddStr);
    const today = new Date();
    const diffTime = edd.getTime() - today.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = calculateDaysToEdd(pregnancyData?.eddDate);
  const currentWeek = Math.min(40, Math.max(1, 40 - Math.floor(daysLeft / 7)));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Welcome Banner for Pregnant Mother */}
      <div className="glass-panel-accent rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-rose-500/30">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>Karnataka Mother & Child Personal Health Passbook</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Namaste, {patientData?.fullName || user?.name || 'Lakshmi Devi'} 🙏
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            Your pregnancy care is tracked live with your assigned ASHA Facilitator & PHC Doctor under Ayushman Bharat Digital Mission (ABDM).
          </p>
        </div>

        {/* SOS Emergency Trigger Button */}
        <div className="z-10 shrink-0 flex items-center space-x-3">
          <button
            onClick={fetchMotherProfile}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            title="Refresh Live Health Passbook"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <SosDistressButton patientId={patientData?._id} />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Loading Your Dynamic Maternal Passbook...</p>
        </div>
      ) : (
        <>
          {/* Pregnancy Countdown & Milestone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Countdown Badge */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Delivery (EDD)</span>
                <Calendar className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{daysLeft} Days</p>
                <p className="text-xs text-rose-400 font-bold mt-1">Week {currentWeek} of Pregnancy</p>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full rounded-full" style={{ width: `${(currentWeek / 40) * 100}%` }}></div>
              </div>
            </div>

            {/* Baby Size Milestone */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Baby Development</span>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">Size of a Papaya 🍈</p>
                <p className="text-xs text-slate-400 mt-1">Baby is developing hearing and active movements!</p>
              </div>
              <div className="inline-block text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                2nd Trimester Care Phase
              </div>
            </div>

            {/* Personal Health ID Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Karnataka RCH ID</span>
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-mono font-extrabold text-emerald-400">{patientData?.rchId || 'KA-RCH-2026-98124'}</p>
                <p className="text-xs text-slate-400 mt-1">ABHA: {patientData?.abhaNumber || '91-8845-1234-5678'}</p>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-300">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {patientData?.bloodGroup || 'O+'}
                </span>
              </div>
            </div>
          </div>

          {/* Safety Score & AI Clinical Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Your AI Mother Safety Score</span>
              </h3>

              <MotherSafetyScoreGauge 
                score={pregnancyData?.motherSafetyScore || 92}
                riskLevel={pregnancyData?.highRiskCategory !== 'NONE' ? 'HIGH RISK' : 'OPTIMAL SAFETY'}
                preeclampsiaRisk="LOW"
                anemiaSeverity="NORMAL"
              />

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-slate-200">Daily Supplement Checklist:</p>
                <div className="flex items-center space-x-2 text-emerald-400 pt-1">
                  <Pill className="w-4 h-4 shrink-0" />
                  <span>1 Iron & Folic Acid (IFA) Tablet daily after lunch</span>
                </div>
                <div className="flex items-center space-x-2 text-indigo-400 pt-1">
                  <Pill className="w-4 h-4 shrink-0" />
                  <span>2 Calcium D3 Tablets daily after breakfast</span>
                </div>
              </div>
            </div>

            {/* Quick Contacts: Assigned ASHA & PHC Hospital */}
            <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-indigo-400" />
                <span>Assigned Health Support Team</span>
              </h3>

              {/* ASHA Facilitator */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    A
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Your Village ASHA Facilitator</span>
                    <h4 className="text-sm font-bold text-slate-100">Sanveeka Gowda</h4>
                    <p className="text-xs text-slate-400">+91 98450 77889</p>
                  </div>
                </div>

                <a 
                  href="tel:+919845077889"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call ASHA</span>
                </a>
              </div>

              {/* Assigned PHC */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Assigned Primary Health Center</span>
                    <h4 className="text-sm font-bold text-slate-100">Varthur PHC</h4>
                    <p className="text-xs text-slate-400">+91 80 2845 2200</p>
                  </div>
                </div>

                <a 
                  href="tel:+918028452200"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call PHC</span>
                </a>
              </div>
            </div>
          </div>

          {/* Antenatal Care (ANC) Medical Visit Passbook */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Your Live Antenatal Care (ANC) Doctor Visit History</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Next Scheduled Visit: 28th July 2026
              </span>
            </div>

            {visits.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-900 text-center space-y-2">
                <Stethoscope className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No recorded ANC visits yet. Schedule your first visit at Varthur PHC.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visits.map((v, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-indigo-300">ANC Visit #{v.visitNumber}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 font-mono">{new Date(v.visitDate).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-300 font-medium">Notes: {v.doctorNotes || 'Routine ANC Checkup completed cleanly.'}</p>
                    </div>

                    <div className="flex items-center space-x-4 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Blood Pressure</span>
                        <p className="font-mono font-bold text-slate-200">{v.systolicBp}/{v.diastolicBp} mmHg</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Hemoglobin</span>
                        <p className="font-mono font-bold text-emerald-400">{v.hbLevel} g/dL</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Weight</span>
                        <p className="font-mono font-bold text-indigo-400">{v.weightKg} kg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Maternal Warning Signs Guidance */}
          <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-2">
            <div className="flex items-center space-x-2 font-extrabold text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>DANGER SIGNS: Trigger SOS Immediately if you experience any of these:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-200">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">1. Severe Headache or Blurred Vision</div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">2. Vaginal Bleeding</div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">3. Sudden Swelling of Face & Hands</div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">4. Decreased Fetal Movement</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
