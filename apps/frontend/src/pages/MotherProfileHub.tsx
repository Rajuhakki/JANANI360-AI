import React, { useState, useEffect } from 'react';
import {
  User, Heart, Activity, Calendar, ShieldAlert, FileText, Phone, MapPin, Plus, RefreshCw, AlertTriangle, CheckCircle2, Clock, Ambulance, ChevronRight
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { NextRecommendedActionCard } from '../components/NextRecommendedActionCard';
import { ActionableWorkQueue } from '../components/ActionableWorkQueue';
import { SmartRegistrationWizard } from '../components/SmartRegistrationWizard';
import { DoctorExplanationPanel } from '../components/DoctorExplanationPanel';
import { RiskTrendGraph } from '../components/RiskTrendGraph';
import { maternalService } from '../services/maternalService';

export const MotherProfileHub: React.FC = () => {
  const [motherData, setMotherData] = useState<any>(null);
  const [workQueueData, setWorkQueueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [language] = useState<'kn' | 'en'>('kn');
  const [activeTab, setActiveTab] = useState<'timeline' | 'ai' | 'referral' | 'documents'>('timeline');
  const [showRegisterWizard, setShowRegisterWizard] = useState(false);

  // ANC Vitals Entry Modal State
  const [showAncModal, setShowAncModal] = useState(false);
  const [ancForm, setAncForm] = useState({
    visitNumber: 2,
    gestationalAgeWeeks: 28,
    systolicBp: 165,
    diastolicBp: 110,
    hbLevel: 6.8,
    weightKg: 42.5,
    urineProtein: '+2',
    complaints: 'Severe headache and blurred vision'
  });
  const [ancSubmitting, setAncSubmitting] = useState(false);

  const fetchMotherProfile = async (idOrRch = '129004812749') => {
    setLoading(true);
    try {
      const res = await maternalService.getMotherProfile(idOrRch);
      if (res.success) {
        setMotherData(res);
      }
      const queueRes = await maternalService.getWorkQueue();
      if (queueRes.success) {
        setWorkQueueData(queueRes.workQueue || []);
      }
    } catch (err) {
      console.error('Error fetching mother profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotherProfile();
  }, []);

  const handleRecordAncVisit = async () => {
    if (!motherData?.mother) return;
    setAncSubmitting(true);
    try {
      const pregnancyId = motherData.mother.pregnancies[0]?.id;
      const res = await maternalService.recordAncVisit({
        motherId: motherData.mother.id,
        pregnancyId,
        visitNumber: ancForm.visitNumber,
        gestationalAgeWeeks: ancForm.gestationalAgeWeeks,
        systolicBp: Number(ancForm.systolicBp),
        diastolicBp: Number(ancForm.diastolicBp),
        hbLevel: Number(ancForm.hbLevel),
        weightKg: Number(ancForm.weightKg),
        urineProtein: ancForm.urineProtein as any,
        complaints: ancForm.complaints
      });

      if (res.success) {
        setShowAncModal(false);
        fetchMotherProfile(motherData.mother.id);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record ANC visit');
    } finally {
      setAncSubmitting(false);
    }
  };

  if (loading || !motherData?.mother) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
        Loading Mother Profile Hub (ಲಕ್ಷ್ಮಿ ದೇವಿ)...
      </div>
    );
  }

  const mother = motherData.mother;
  const latestPregnancy = mother.pregnancies[0];
  const visits = latestPregnancy?.ancVisits || [];
  const nextAction = motherData.nextRecommendedAction;
  const isCritical = mother.motherSafetyScore < 40;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Sticky Summary & Mother Profile Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-700 flex items-center justify-center text-slate-300 text-2xl font-bold shadow-xl overflow-hidden">
                  {mother.photoUrl ? (
                    <img src={mother.photoUrl} alt={mother.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <span
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isCritical
                      ? 'bg-red-500 text-white animate-bounce'
                      : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {mother.currentRiskLevel}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-100">{mother.fullName}</h2>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    RCH ID: {mother.rchId}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ABHA: {mother.abhaId || '91-8845-1234-5678'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Age: {mother.age} Yrs
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> {mother.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Husband: {mother.husbandName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {mother.village?.nameEn}, Haveri
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Assigned Facility:</span>
                  <span className="text-slate-200 font-bold">{mother.facility?.nameEn}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">ASHA:</span>
                  <span className="text-emerald-400 font-semibold">{mother.registeredByUser?.name}</span>
                </div>
              </div>
            </div>

            {/* Mother Safety Score Gauge & Status Badges */}
            <div className="flex items-center gap-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Mother Safety Score
                </div>
                <div
                  className={`text-3xl font-black ${
                    isCritical
                      ? 'text-red-400 animate-pulse'
                      : mother.motherSafetyScore < 60
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {mother.motherSafetyScore}
                  <span className="text-xs text-slate-500 font-normal"> / 100</span>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800" />

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Live Case Status
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase inline-block ${
                    isCritical
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {mother.caseStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Recommended Action Card */}
        {nextAction && (
          <NextRecommendedActionCard
            actionData={nextAction}
            language={language}
            onExecuteAction={() => setShowAncModal(true)}
          />
        )}

        {/* Actionable Work Queue & Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Tabbed Navigation Bar */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'timeline'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                {language === 'kn' ? 'ANC ಭೇಟಿಗಳ ಕಾಲಸೂಚಿ' : 'Timeline & ANC Visits'}
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'ai'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                {language === 'kn' ? 'AI ಭದ್ರತಾ ಮ್ಯಾಟ್ರಿಕ್ಸ್' : 'AI Safety Matrix'}
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'documents'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                {language === 'kn' ? 'ದಾಖಲೆಗಳು' : 'Documents'}
              </button>

              <button
                onClick={() => setShowAncModal(true)}
                className="ml-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                {language === 'kn' ? 'ANC ಭೇಟಿ ದಾಖಲಿಸಿ' : 'Record ANC Visit'}
              </button>
            </div>

            {/* TAB CONTENT 2: AI Safety Matrix & CDSS Explanation Panel */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <RiskTrendGraph visits={visits} language={language} />
                <DoctorExplanationPanel
                  cdssResult={motherData.cdssResult}
                  motherId={mother.id}
                  predictionId={mother.aiPredictionLogs?.[0]?.id}
                  language={language}
                  onOverrideSuccess={() => fetchMotherProfile(mother.id)}
                />
              </div>
            )}

            {/* TAB CONTENT 1: Longitudinal Timeline & ANC Visits */}
            {activeTab === 'timeline' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  {language === 'kn' ? 'ಅನುಕ್ರಮ ಆಡಳಿತಾತ್ಮಕ ಕಾಲಸೂಚಿ' : 'Chronological Care Timeline'}
                </h3>

                <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {/* ANC Visits Render */}
                  {visits.map((v: any, idx: number) => (
                    <div key={v.id} className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900" />
                      <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-emerald-400">
                            ANC-{v.visitNumber} Visit (Gestational Week {v.gestationalAgeWeeks})
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(v.visitDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Blood Pressure</span>
                            <strong className={v.systolicBp >= 140 ? 'text-red-400 font-bold' : ''}>
                              {v.systolicBp}/{v.diastolicBp} mmHg
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Hemoglobin</span>
                            <strong className={v.hbLevel < 9.0 ? 'text-red-400 font-bold' : ''}>
                              {v.hbLevel} g/dL
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Weight</span>
                            <strong>{v.weightKg} kg</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Urine Protein</span>
                            <strong>{v.urineProtein}</strong>
                          </div>
                        </div>

                        {v.aiReasoning && (
                          <div className="mt-3 pt-2 border-t border-slate-700/60 text-xs text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <span>{v.aiReasoning}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Activity Logs Render */}
                  {(mother.activityLogs || []).map((log: any) => (
                    <div key={log.id} className="relative pl-10">
                      <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-slate-700 border-4 border-slate-900" />
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-400">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{log.eventType}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-300">{log.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actionable Work Queue Sidebar */}
          <div className="space-y-6">
            <ActionableWorkQueue
              role={mother.registeredByUser?.role || 'ASHA_WORKER'}
              items={workQueueData}
              language={language}
              onSelectQueueItem={(id) => fetchMotherProfile(id)}
            />
          </div>
        </div>
      </main>

      {/* ANC Vitals Modal */}
      {showAncModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> Record ANC Vitals (ANC ಭೇಟಿ ದಾಖಲಿಸಿ)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={ancForm.systolicBp}
                  onChange={(e) => setAncForm({ ...ancForm, systolicBp: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={ancForm.diastolicBp}
                  onChange={(e) => setAncForm({ ...ancForm, diastolicBp: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Hemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={ancForm.hbLevel}
                  onChange={(e) => setAncForm({ ...ancForm, hbLevel: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={ancForm.weightKg}
                  onChange={(e) => setAncForm({ ...ancForm, weightKg: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block text-xs mb-1">Urine Protein</label>
              <select
                value={ancForm.urineProtein}
                onChange={(e) => setAncForm({ ...ancForm, urineProtein: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              >
                <option value="Nil">Nil (Normal)</option>
                <option value="+1">+1 (Trace)</option>
                <option value="+2">+2 (High)</option>
                <option value="+3">+3 (Severe Preeclampsia)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAncModal(false)}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={ancSubmitting}
                onClick={handleRecordAncVisit}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                {ancSubmitting ? 'Analyzing AI...' : 'Save & Trigger AI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Registration Wizard Modal */}
      <SmartRegistrationWizard
        isOpen={showRegisterWizard}
        onClose={() => setShowRegisterWizard(false)}
        onSuccess={(m) => fetchMotherProfile(m.id)}
        language={language}
      />
    </div>
  );
};
