import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, AlertTriangle, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import api from '../services/api';

interface SosDistressButtonProps {
  patientId?: string;
  onSuccess?: () => void;
}

export const SosDistressButton: React.FC<SosDistressButtonProps> = ({ patientId, onSuccess }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [distressType, setDistressType] = useState<'ECLAMPSIA_SEIZURE' | 'POSTPARTUM_HEMORRHAGE' | 'SEVERE_HYPERTENSION' | 'OBSTRUCTED_LABOR' | 'GENERAL_DISTRESS'>('ECLAMPSIA_SEIZURE');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sosResult, setSosResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTriggerSos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/referrals/sos', {
        patientId: patientId || '66a0f1234567890123456790',
        distressType,
        latitude: 12.9389,
        longitude: 77.7499,
        notes
      });
      setSosResult(res.data);
      setIsLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Failed to trigger SOS emergency beacon');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/40 flex items-center space-x-2 transition animate-pulse"
      >
        <Siren className="w-4 h-4" />
        <span>ONE-TOUCH 108 SOS BEACON</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-6 rounded-3xl max-w-md w-full border border-red-500/40 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Siren className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Emergency 108 SOS Distress Beacon</h3>
                    <p className="text-[11px] text-red-400">Immediate Ambulance & Obstetric Trauma Broadcast</p>
                  </div>
                </div>
                <button onClick={() => { setIsOpen(false); setSosResult(null); }} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {sosResult ? (
                <div className="p-5 rounded-2xl bg-red-950/60 border border-red-500/40 space-y-3 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white">108 AMBULANCE DISPATCHED</h4>
                  <p className="text-xs text-slate-300">{sosResult.message}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Ambulance No</span>
                      <p className="font-mono font-bold text-indigo-400">{sosResult.ambulanceDispatched}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated ETA</span>
                      <p className="font-mono font-bold text-emerald-400">{sosResult.etaMinutes} mins</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { setIsOpen(false); setSosResult(null); }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition mt-2"
                  >
                    Close Emergency Beacon
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Maternal Obstetric Distress Condition</label>
                    <select
                      value={distressType}
                      onChange={(e) => setDistressType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    >
                      <option value="ECLAMPSIA_SEIZURE">⚡ Eclampsia Seizures / Severe BP Drop</option>
                      <option value="POSTPARTUM_HEMORRHAGE">🩸 Severe Postpartum Hemorrhage (PPH)</option>
                      <option value="SEVERE_HYPERTENSION">⚠️ Severe Hypertensive Crisis (&gt;160/110)</option>
                      <option value="OBSTRUCTED_LABOR">👶 Obstructed Labor / Fetal Distress</option>
                      <option value="GENERAL_DISTRESS">🚨 General Maternal SOS Distress</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Live Clinical Location / Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Specify village milestone, mother condition..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleTriggerSos}
                      disabled={isLoading}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/40 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>DISPATCH 108 NOW</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
