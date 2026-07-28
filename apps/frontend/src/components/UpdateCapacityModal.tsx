import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Activity, ShieldAlert } from 'lucide-react';
import { HospitalData } from './HospitalCard';
import api from '../services/api';

interface UpdateCapacityModalProps {
  hospital: HospitalData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateCapacityModal: React.FC<UpdateCapacityModalProps> = ({ hospital, onClose, onSuccess }) => {
  const { t } = useTranslation();
  if (!hospital) return null;

  const [availableMaternityBeds, setAvailableMaternityBeds] = useState(hospital.availableMaternityBeds);
  const [availableIcuBeds, setAvailableIcuBeds] = useState(hospital.availableIcuBeds);
  const [ventilatorsAvailable, setVentilatorsAvailable] = useState(hospital.ventilatorsAvailable);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await api.put(`/hospitals/${hospital._id}/capacity`, {
        availableMaternityBeds,
        availableIcuBeds,
        ventilatorsAvailable
      });
      setIsLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Failed to update capacity');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel p-6 rounded-3xl max-w-md w-full border border-indigo-500/30 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-slate-100">Live Bed & ICU Capacity Manager</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Updating metrics for <span className="text-indigo-300 font-semibold">{hospital.name}</span>. Real-time Socket.IO telemetry will immediately broadcast updates to Karnataka Command Center.
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Available Maternity Beds</label>
              <input
                type="number"
                min={0}
                max={hospital.totalBeds}
                value={availableMaternityBeds}
                onChange={(e) => setAvailableMaternityBeds(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Available ICU Beds</label>
              <input
                type="number"
                min={0}
                value={availableIcuBeds}
                onChange={(e) => setAvailableIcuBeds(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Available Ventilators</label>
              <input
                type="number"
                min={0}
                value={ventilatorsAvailable}
                onChange={(e) => setVentilatorsAvailable(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Broadcast Update</span>
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
