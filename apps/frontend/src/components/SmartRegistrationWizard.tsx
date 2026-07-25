import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, User, Heart, Calendar, MapPin, FileCheck, X } from 'lucide-react';
import { LocationHierarchyPicker } from './LocationHierarchyPicker';
import { maternalService } from '../services/maternalService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mother: any) => void;
  language?: 'kn' | 'en';
}

export const SmartRegistrationWizard: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  language = 'kn'
}) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Lakshmi Devi',
    age: 23,
    phone: '+919845099000',
    abhaId: '91-8845-1234-5678',
    husbandName: 'Basavaraj Gowda',
    husbandPhone: '+919845099001',
    emergencyPhone: '+919845099001',
    bloodGroup: 'O+',
    bplCardNumber: 'BPL-HAV-581106-992',
    lmpDate: '2026-01-10',
    gravida: 1,
    parity: 0,
    abortions: 0,
    districtId: '',
    talukId: '',
    hobliId: '',
    villageId: '',
    facilityId: '',
    subCenterId: '',
    catchmentId: ''
  });

  if (!isOpen) return null;

  const handleLocationSelect = (loc: any) => {
    setFormData((prev) => ({
      ...prev,
      districtId: loc.districtId || prev.districtId,
      talukId: loc.talukId || prev.talukId,
      hobliId: loc.hobliId || prev.hobliId,
      villageId: loc.villageId || prev.villageId,
      facilityId: loc.facilityId || prev.facilityId,
      subCenterId: loc.subCenterId || prev.subCenterId,
      catchmentId: loc.catchmentId || prev.catchmentId
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await maternalService.registerMother(formData);
      if (res.success) {
        onSuccess(res.mother);
        onClose();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="mb-6 border-b border-slate-800 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
            7-Step Smart Wizard (7-ಹಂತದ ಸ್ಮಾರ್ಟ್ ನಂದಣಿ)
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-2">
            {language === 'kn' ? 'ಗರ್ಭಿಣಿ ತಾಯಿಯ ನೊಂದಣಿ' : 'Register Pregnant Mother'}
          </h2>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step === s
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                    : step > s
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 7 && <div className={`w-4 sm:w-8 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> Step 1: Personal Identity
            </h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name (ಪೂರ್ಣ ಹೆಸರು)</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Age (ವಯಸ್ಸು)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Mobile Phone (ಮೊಬೈಲ್ ಸಂಖ್ಯೆ)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">ABHA ID (ABHA ಸಂಖ್ಯೆ)</label>
              <input
                type="text"
                value={formData.abhaId}
                onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono"
              />
            </div>
          </div>
        )}

        {/* Step 2: Family */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-400" /> Step 2: Family Details
            </h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Husband Name (ಪತಿಯ ಹೆಸರು)</label>
              <input
                type="text"
                value={formData.husbandName}
                onChange={(e) => setFormData({ ...formData, husbandName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Husband Mobile</label>
                <input
                  type="text"
                  value={formData.husbandPhone}
                  onChange={(e) => setFormData({ ...formData, husbandPhone: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pregnancy */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Step 3: Pregnancy Info
            </h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">LMP Date (ಕಡೆ ಋತುಸ್ರಾವದ ದಿನಾಂಕ)</label>
              <input
                type="date"
                value={formData.lmpDate}
                onChange={(e) => setFormData({ ...formData, lmpDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Gravida</label>
                <input
                  type="number"
                  value={formData.gravida}
                  onChange={(e) => setFormData({ ...formData, gravida: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Parity</label>
                <input
                  type="number"
                  value={formData.parity}
                  onChange={(e) => setFormData({ ...formData, parity: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Abortions</label>
                <input
                  type="number"
                  value={formData.abortions}
                  onChange={(e) => setFormData({ ...formData, abortions: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Medical History */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Step 4: Medical History</h3>
            <div className="p-4 bg-slate-800/50 rounded-xl text-xs text-slate-300 space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 text-emerald-500" />
                <span>Nutritional Anemia Watch</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-700 text-emerald-500" />
                <span>Pre-existing Hypertension</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-700 text-emerald-500" />
                <span>Gestational Diabetes</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 5: Location Selector */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Step 5: Karnataka Master Location Hierarchy
            </h3>
            <LocationHierarchyPicker onSelectLocation={handleLocationSelect} />
          </div>
        )}

        {/* Step 6: Review */}
        {step === 6 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" /> Step 6: Review Details
            </h3>
            <div className="bg-slate-800/60 p-4 rounded-xl text-xs text-slate-300 space-y-2 border border-slate-700">
              <p><strong>Mother Name:</strong> {formData.fullName}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Husband:</strong> {formData.husbandName}</p>
              <p><strong>LMP Date:</strong> {formData.lmpDate}</p>
              <p><strong>Assigned Facility:</strong> Byadgi Primary Health Center</p>
            </div>
          </div>
        )}

        {/* Step 7: Confirm */}
        {step === 7 && (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-100">Ready to Register</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Clicking below will generate a unique 12-digit RCH ID, trigger AI baseline scoring, and dispatch welcome SMS.
            </p>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between mt-8 border-t border-slate-800 pt-4">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {step < 7 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition"
            >
              {submitting ? 'Registering...' : 'Confirm & Register Mother'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
