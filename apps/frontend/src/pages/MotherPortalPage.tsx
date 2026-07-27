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
  RefreshCw,
  Baby,
  Syringe,
  CheckCircle2,
  AlertCircle,
  FileText,
  Scale,
  Award
} from 'lucide-react';
import { MotherSafetyScoreGauge } from '../components/MotherSafetyScoreGauge';
import { SosDistressButton } from '../components/SosDistressButton';
import { RootState } from '../store';
import api from '../services/api';

export const MotherPortalPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activePortalTab, setActivePortalTab] = useState<'maternal' | 'child'>('maternal');
  const [patientData, setPatientData] = useState<any>(null);
  const [pregnancyData, setPregnancyData] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [pncVisits, setPncVisits] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [ashaWorker, setAshaWorker] = useState<any>(null);
  const [phcFacility, setPhcFacility] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Fetch from Backend API
  const fetchMotherProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/patients/me');
      if (res.data) {
        setPatientData(res.data.patient || res.data);
        setPregnancyData(res.data.pregnancy || res.data.pregnancies?.[0]);
        setVisits(res.data.visits || res.data.pregnancy?.ancVisits || []);
        setPncVisits(res.data.pncVisits || []);
        setChildren(res.data.children || res.data.childProfiles || []);
        if (res.data.ashaWorker) setAshaWorker(res.data.ashaWorker);
        if (res.data.phcFacility) setPhcFacility(res.data.phcFacility);
      }
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

  // Dynamic Baby Milestone Engine based on gestational week
  const getBabyDevelopmentMilestone = (week: number) => {
    if (week <= 4) return { size: 'Poppy Seed 🫐', weight: '< 1 g', length: '2 mm', desc: 'Neural tube and primitive heart structures are beginning to form.' };
    if (week <= 8) return { size: 'Raspberry 🍓', weight: '1 g', length: '1.6 cm', desc: 'Baby’s heartbeat is active, tiny arm and leg buds are forming.' };
    if (week <= 12) return { size: 'Lime 🍋', weight: '14 g', length: '5.4 cm', desc: 'Fingers and toes distinct, facial features developing.' };
    if (week <= 16) return { size: 'Avocado 🥑', weight: '100 g', length: '11.6 cm', desc: 'Baby is developing hearing abilities and active movements.' };
    if (week <= 20) return { size: 'Banana 🍌', weight: '300 g', length: '25.6 cm', desc: 'Mother can feel active kicks! Hair and protective skin layer forming.' };
    if (week <= 24) return { size: 'Papaya 🍈', weight: '600 g', length: '30 cm', desc: 'Lungs are developing air sacs. Baby responds to mother’s voice.' };
    if (week <= 28) return { size: 'Eggplant 🍆', weight: '1.0 kg', length: '37.6 cm', desc: 'Eyes are opening, brain is rapidly creating neural connections.' };
    if (week <= 32) return { size: 'Squash 🎃', weight: '1.7 kg', length: '42 cm', desc: 'Bones are fully formed, gaining protective body fat layer.' };
    if (week <= 36) return { size: 'Honeydew Melon 🍈', weight: '2.6 kg', length: '47 cm', desc: 'Immune system maturing, preparing for breathing air at birth.' };
    return { size: 'Watermelon 🍉', weight: '3.2 kg', length: '50 cm', desc: 'Fully developed baby, ready for delivery at any time!' };
  };

  const babyMilestone = getBabyDevelopmentMilestone(currentWeek);

  // Latest ANC Visit Vitals & Risk Calculations
  const latestVisit = visits.length > 0 ? visits[visits.length - 1] : null;
  const sysBp = latestVisit?.systolicBp || 120;
  const diaBp = latestVisit?.diastolicBp || 80;
  const hbVal = latestVisit?.hbLevel || 10.5;

  const preeclampsiaRisk = (sysBp >= 140 || diaBp >= 90) ? 'HIGH' : (sysBp >= 130 || diaBp >= 85) ? 'MODERATE' : 'LOW';
  const anemiaSeverity = hbVal < 7 ? 'SEVERE' : hbVal < 10 ? 'MODERATE' : hbVal < 11 ? 'MILD' : 'NORMAL';

  // Dynamic Healthcare Support Team Details
  const ashaName = ashaWorker?.name || patientData?.registeredByUser?.name || 'Sanveeka Gowda (ASHA)';
  const ashaPhone = ashaWorker?.phone || patientData?.registeredByUser?.phone || '+91 98450 77889';
  const phcName = phcFacility?.name || patientData?.facility?.nameEn || 'Varthur Primary Health Centre (PHC)';
  const phcPhone = phcFacility?.phone || patientData?.facility?.contactPhone || '+91 80 2845 2200';

  // Dynamic Next Visit Calculation
  const getNextScheduledVisit = () => {
    if (latestVisit?.visitDate) {
      const lastDate = new Date(latestVisit.visitDate);
      const nextDate = new Date(lastDate.getTime() + 28 * 24 * 60 * 60 * 1000);
      return nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return '28th July 2026';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Welcome Banner for Mother & Family Passbook */}
      <div className="glass-panel-accent rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-rose-500/30">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>Karnataka Mother & Child Personal Health Passbook (RCH-ID)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Namaste, {patientData?.fullName || user?.name || 'Lakshmi Devi'} 🙏
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            Your live maternal health passbook & child immunization schedule tracked under Ayushman Bharat Digital Mission (ABDM).
          </p>
        </div>

        {/* Action Controls & Emergency SOS Button */}
        <div className="z-10 shrink-0 flex items-center space-x-3">
          <button
            onClick={fetchMotherProfile}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition flex items-center space-x-1.5 text-xs font-semibold"
            title="Refresh Live Health Passbook"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <SosDistressButton patientId={patientData?.id || patientData?._id} />
        </div>
      </div>

      {/* Sub-Navigation Bar: Mother Passbook vs Child & Family Passbook */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActivePortalTab('maternal')}
          className={`pb-3 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition ${
            activePortalTab === 'maternal'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Maternal Care & Pregnancy Passbook</span>
        </button>

        <button
          onClick={() => setActivePortalTab('child')}
          className={`pb-3 text-xs font-extrabold flex items-center space-x-2 border-b-2 transition ${
            activePortalTab === 'child'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Baby className="w-4 h-4" />
          <span>Family & Child Immunization Passbook ({children.length})</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Fetching Live Maternal EHR & CDSS Data...</p>
        </div>
      ) : activePortalTab === 'maternal' ? (
        <>
          {/* Pregnancy Countdown & Dynamic Milestone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Countdown Badge */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Delivery (EDD)</span>
                <Calendar className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{daysLeft} Days</p>
                <p className="text-xs text-rose-400 font-bold mt-1">
                  Week {currentWeek} of 40 ({currentWeek <= 12 ? '1st Trimester' : currentWeek <= 27 ? '2nd Trimester' : '3rd Trimester'})
                </p>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full rounded-full" style={{ width: `${(currentWeek / 40) * 100}%` }}></div>
              </div>
            </div>

            {/* Baby Development Milestone */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Baby Development Milestone</span>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">Size of a {babyMilestone.size}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{babyMilestone.desc}</p>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-indigo-300 font-mono">
                <span>Est. Weight: {babyMilestone.weight}</span>
                <span>•</span>
                <span>Length: {babyMilestone.length}</span>
              </div>
            </div>

            {/* Personal Health ID Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Karnataka RCH Digital ID</span>
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-mono font-extrabold text-emerald-400">{patientData?.rchId || '129004812749'}</p>
                <p className="text-xs text-slate-400 mt-1">ABHA: {patientData?.abhaId || patientData?.abhaNumber || '91-8845-1234-5678'}</p>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500">Blood Group: </span>
                  <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {patientData?.bloodGroup || 'O+'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Village: </span>
                  <span className="font-semibold text-slate-200">{patientData?.village?.nameEn || patientData?.village || 'Kaginele'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Score & AI Clinical Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Your AI Mother Safety Score & Clinical Vitals</span>
              </h3>

              <MotherSafetyScoreGauge 
                score={pregnancyData?.motherSafetyScore || 94}
                riskLevel={pregnancyData?.currentRiskLevel !== 'LOW' && pregnancyData?.currentRiskLevel ? 'HIGH RISK' : 'OPTIMAL SAFETY'}
                preeclampsiaRisk={preeclampsiaRisk}
                anemiaSeverity={anemiaSeverity}
              />

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-bold text-slate-200">Personalized Clinical Guidance:</p>
                <div className="flex items-center space-x-2 text-emerald-400 pt-0.5">
                  <Pill className="w-4 h-4 shrink-0" />
                  <span>1 Iron & Folic Acid (IFA) Tablet daily after main meal</span>
                </div>
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Pill className="w-4 h-4 shrink-0" />
                  <span>2 Calcium D3 Tablets daily after breakfast</span>
                </div>
                {anemiaSeverity !== 'NORMAL' && (
                  <div className="flex items-center space-x-2 text-amber-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Increase iron-rich foods (green leafy vegetables, jaggery, pulses)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Contacts: Assigned ASHA & PHC Hospital */}
            <div className="md:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Phone className="w-5 h-5 text-indigo-400" />
                <span>Assigned Primary Healthcare Team</span>
              </h3>

              {/* ASHA Facilitator */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    A
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Your Village ASHA Facilitator</span>
                    <h4 className="text-sm font-bold text-slate-100">{ashaName}</h4>
                    <p className="text-xs text-slate-400 font-mono">{ashaPhone}</p>
                  </div>
                </div>

                <a 
                  href={`tel:${ashaPhone.replace(/\s+/g, '')}`}
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
                    <h4 className="text-sm font-bold text-slate-100">{phcName}</h4>
                    <p className="text-xs text-slate-400 font-mono">{phcPhone}</p>
                  </div>
                </div>

                <a 
                  href={`tel:${phcPhone.replace(/\s+/g, '')}`}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call PHC</span>
                </a>
              </div>
            </div>
          </div>

          {/* Antenatal Care (ANC) & Postnatal Care (PNC) Medical Visit Passbook */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Live Clinical Visit History (ANC & PNC)</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 w-fit">
                Next Scheduled Checkup: {getNextScheduledVisit()}
              </span>
            </div>

            {visits.length === 0 && pncVisits.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-900 text-center space-y-2">
                <Stethoscope className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No recorded ANC/PNC visits yet. Visit your assigned PHC for regular checkups.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visits.map((v, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-indigo-300">ANC Visit #{v.visitNumber}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 font-mono">
                          {v.visitDate ? new Date(v.visitDate).toLocaleDateString('en-IN') : 'Completed'}
                        </span>
                        {v.aiSafetyScore && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Safety Score: {v.aiSafetyScore}/100
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 font-medium">Notes: {v.doctorNotes || v.aiReasoning || 'Routine ANC checkup completed successfully.'}</p>
                    </div>

                    <div className="flex items-center space-x-4 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
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

                {pncVisits.map((pnc, i) => (
                  <div key={`pnc-${i}`} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-rose-300">PNC Visit #{pnc.visitNumber}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 font-mono">
                          {pnc.visitDate ? new Date(pnc.visitDate).toLocaleDateString('en-IN') : 'Completed'}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Postnatal Checkup
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium">Breastfeeding: {pnc.breastfeedingStatus || 'Exclusive'} • Pulse: {pnc.maternalPulse || 78} bpm</p>
                    </div>

                    <div className="flex items-center space-x-4 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Blood Pressure</span>
                        <p className="font-mono font-bold text-slate-200">{pnc.systolicBp}/{pnc.diastolicBp} mmHg</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Temperature</span>
                        <p className="font-mono font-bold text-indigo-400">{pnc.temperatureF || 98.4} °F</p>
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
              <span>MATERNAL DANGER SIGNS: Press SOS Button Immediately if you experience any of these:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-200">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">1. Severe Headache or Blurred Vision</div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">2. Vaginal Bleeding</div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">3. Sudden Swelling of Face & Hands</div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">4. Decreased Fetal Movement</div>
            </div>
          </div>
        </>
      ) : (
        /* Family & Child Immunization Passbook Tab */
        <div className="space-y-6">
          {children.length === 0 ? (
            <div className="p-12 glass-panel rounded-3xl text-center space-y-3 border border-slate-800">
              <Baby className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No Child Records Registered Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Once delivery is completed at the hospital, your newborn baby’s National Immunization Schedule & WHO Growth Passbook will be tracked live here.
              </p>
            </div>
          ) : (
            children.map((child, idx) => (
              <div key={idx} className="space-y-6">
                {/* Child Overview Header Card */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Baby className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-white">{child.fullName || 'Baby Girl of Lakshmi Devi'}</h3>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {child.gender || 'FEMALE'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Child RCH ID: <span className="font-mono text-slate-200">{child.childRchId || '129004812749-C1'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Birth Weight</span>
                      <span className="font-bold text-emerald-400">{child.birthWeightKg || 2.95} kg</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">APGAR Score</span>
                      <span className="font-bold text-indigo-400">{child.apgarScore5Min || 9}/10</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Newborn Status</span>
                      <span className="font-bold text-teal-400">{child.newbornRiskCategory || 'HEALTHY'}</span>
                    </div>
                  </div>
                </div>

                {/* Immunization Schedule Passbook */}
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Syringe className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-base font-bold text-slate-100">National Immunization Schedule (0-5 Years)</h3>
                    </div>
                    <span className="text-xs text-slate-400">Government of India Standard Schedule</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(child.immunizationRecords || []).map((vac: any, vIdx: number) => (
                      <div 
                        key={vIdx}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                          vac.status === 'GIVEN'
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-200">{vac.vaccineName}</span>
                            <span className="font-mono text-[10px] text-slate-500">[{vac.vaccineCode}]</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Due Age: {vac.dueAgeWeeks === 0 ? 'At Birth' : `${vac.dueAgeWeeks} Weeks`}
                          </p>
                        </div>

                        <div>
                          {vac.status === 'GIVEN' ? (
                            <div className="flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>GIVEN</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30 text-[11px]">
                              <Clock className="w-3.5 h-3.5" />
                              <span>DUE</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
