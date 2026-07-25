import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Cpu, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import api from '../services/api';

interface RecordAncVisitModalProps {
  patient: any;
  pregnancy: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecordAncVisitModal: React.FC<RecordAncVisitModalProps> = ({
  patient,
  pregnancy,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen || !patient || !pregnancy) return null;

  const [visitNumber, setVisitNumber] = useState(1);
  const [systolicBp, setSystolicBp] = useState(120);
  const [diastolicBp, setDiastolicBp] = useState(80);
  const [hbLevel, setHbLevel] = useState(11.2);
  const [weightKg, setWeightKg] = useState(54.0);
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState(24);
  const [urineProtein, setUrineProtein] = useState('Nil');
  const [randomBloodSugar, setRandomBloodSugar] = useState(100);
  const [doctorNotes, setDoctorNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/patients/visits', {
        patientId: patient._id,
        pregnancyId: pregnancy._id,
        visitNumber: Number(visitNumber),
        systolicBp: Number(systolicBp),
        diastolicBp: Number(diastolicBp),
        hbLevel: Number(hbLevel),
        weightKg: Number(weightKg),
        gestationalAgeWeeks: Number(gestationalAgeWeeks),
        urineProtein,
        randomBloodSugar: Number(randomBloodSugar),
        doctorNotes
      });

      setAiPrediction(res.data.aiRiskPrediction);
      setIsLoading(false);
      onSuccess();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Failed to record ANC visit');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel p-6 rounded-3xl max-w-lg w-full border border-indigo-500/30 space-y-5 my-8"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">Record ANC Visit & Run AI Risk Check</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Mother: <span className="text-indigo-300 font-semibold">{patient.fullName}</span> (RCH: {patient.rchId})</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Result Card Banner */}
          {aiPrediction && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border space-y-3 ${
                aiPrediction.mother_safety_score < 40 
                  ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">JANANI360 AI Prediction Completed</span>
                </div>
                <span className="text-sm font-black font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  Score: {aiPrediction.mother_safety_score} / 100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Risk Status: <span className="font-bold">{aiPrediction.risk_level}</span></div>
                <div>Preeclampsia: <span className="font-bold">{aiPrediction.preeclampsia_risk}</span></div>
                <div>Anemia Severity: <span className="font-bold">{aiPrediction.anemia_severity}</span></div>
                <div>Target Tier: <span className="font-bold">{aiPrediction.target_facility_type}</span></div>
              </div>

              {aiPrediction.clinical_recommendations?.length > 0 && (
                <div className="text-[11px] pt-2 border-t border-slate-800/80 space-y-1">
                  <p className="font-bold text-slate-200">Clinical Protocol Interventions:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                    {aiPrediction.clinical_recommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ANC Visit #</label>
                <select
                  value={visitNumber}
                  onChange={(e) => setVisitNumber(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>Visit 1 (1st Trimester)</option>
                  <option value={2}>Visit 2 (2nd Trimester)</option>
                  <option value={3}>Visit 3 (3rd Trimester)</option>
                  <option value={4}>Visit 4 (Pre-Delivery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  required
                  min={60}
                  max={240}
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  required
                  min={40}
                  max={160}
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min={3.0}
                  max={20.0}
                  value={hbLevel}
                  onChange={(e) => setHbLevel(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min={30}
                  max={150}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gestational (Weeks)</label>
                <input
                  type="number"
                  required
                  min={4}
                  max={42}
                  value={gestationalAgeWeeks}
                  onChange={(e) => setGestationalAgeWeeks(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Urine Protein</label>
                <select
                  value={urineProtein}
                  onChange={(e) => setUrineProtein(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Nil">Nil / Traces</option>
                  <option value="+1">+1 (Mild Risk)</option>
                  <option value="+2">+2 (Moderate Risk)</option>
                  <option value="+3">+3 (Severe Preeclampsia Risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Random Blood Sugar (mg/dL)</label>
                <input
                  type="number"
                  value={randomBloodSugar}
                  onChange={(e) => setRandomBloodSugar(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Doctor / Health Worker Notes</label>
              <textarea
                rows={2}
                placeholder="Observed clinical symptoms, prescribed IFA tablets..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Run AI Analysis & Store ANC</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
