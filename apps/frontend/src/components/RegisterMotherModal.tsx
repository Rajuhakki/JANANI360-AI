import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, ShieldAlert } from 'lucide-react';
import { KARNATAKA_DISTRICTS } from '../data/karnatakaGeoData';
import api from '../services/api';

interface RegisterMotherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterMotherModal: React.FC<RegisterMotherModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [rchId, setRchId] = useState(`KA-RCH-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [abhaNumber, setAbhaNumber] = useState('');
  const [age, setAge] = useState(25);
  const [phone, setPhone] = useState('');
  const [husbandName, setHusbandName] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [taluk, setTaluk] = useState('Mahadevapura');
  const [pinCode, setPinCode] = useState('560087');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [lmpDate, setLmpDate] = useState('2026-02-01');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected District object & available Taluks
  const currentDistrictObj = KARNATAKA_DISTRICTS.find(d => d.name === district) || KARNATAKA_DISTRICTS[0];
  const availableTaluks = currentDistrictObj.taluks.map(t => t.name);

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const dObj = KARNATAKA_DISTRICTS.find(d => d.name === newDist);
    if (dObj && dObj.taluks.length > 0) {
      setTaluk(dObj.taluks[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/patients', {
        rchId,
        abhaNumber,
        fullName,
        age: Number(age),
        phone,
        husbandName,
        village,
        taluk,
        district,
        pinCode,
        bloodGroup,
        lmpDate
      });
      setIsLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Registration failed');
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
            <div className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-slate-100">Register Pregnant Mother (RCH EHR)</h3>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">RCH-ID (Karnataka e-Swasthya)</label>
                <input
                  type="text"
                  required
                  value={rchId}
                  onChange={(e) => setRchId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ABHA Health ID (Optional)</label>
                <input
                  type="text"
                  placeholder="91-XXXX-XXXX-XXXX"
                  value={abhaNumber}
                  onChange={(e) => setAbhaNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mother Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Saraswathi Gowda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  required
                  min={14}
                  max={50}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Husband / Guardian Name</label>
                <input
                  type="text"
                  placeholder="e.g. Manjunath Gowda"
                  value={husbandName}
                  onChange={(e) => setHusbandName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">LMP Date (Last Period)</label>
                <input
                  type="date"
                  required
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Dynamic Karnataka Geographical Selection Dropdowns */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">District (Karnataka)</label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {KARNATAKA_DISTRICTS.map(d => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Taluk</label>
                <select
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {availableTaluks.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Village / Locality</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varthur Koti"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Register Mother & Generate EHR</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
