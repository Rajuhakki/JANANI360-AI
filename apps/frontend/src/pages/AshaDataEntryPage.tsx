import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  UserPlus,
  Home,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HeartHandshake,
  BadgeCheck,
  ArrowLeft
} from 'lucide-react';
import {
  ashaService,
  AshaVillageOption,
  AshaFacilityOption,
  AshaMotherListItem
} from '../services/ashaService';
import { RootState } from '../store';

type TabKey = 'register' | 'home-visit';

interface Banner {
  type: 'success' | 'error';
  text: string;
}

const inputClass =
  'w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition';

const labelClass = 'block text-xs font-semibold text-slate-300 mb-1.5';

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {msg}
    </p>
  ) : null;

export const AshaDataEntryPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>(((location.state as any)?.tab as TabKey) || 'register');

  // Dropdown data
  const [villages, setVillages] = useState<AshaVillageOption[]>([]);
  const [facilities, setFacilities] = useState<AshaFacilityOption[]>([]);
  const [mothers, setMothers] = useState<AshaMotherListItem[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Register Mother form state
  const [regForm, setRegForm] = useState({
    fullName: '',
    age: '',
    phone: '',
    villageId: '',
    facilityId: '',
    lmpDate: '',
    gravida: '1'
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regBanner, setRegBanner] = useState<Banner | null>(null);
  const [regSaving, setRegSaving] = useState(false);

  // Home Visit form state
  const [visitForm, setVisitForm] = useState({
    motherId: '',
    visitDate: '',
    dangerSigns: '',
    remarks: '',
    nextVisitDate: ''
  });
  const [visitErrors, setVisitErrors] = useState<Record<string, string>>({});
  const [visitBanner, setVisitBanner] = useState<Banner | null>(null);
  const [visitSaving, setVisitSaving] = useState(false);

  const loadMothers = async () => {
    try {
      const list = await ashaService.listMothers();
      setMothers(list);
    } catch {
      // list refresh failure is non-blocking
    }
  };

  useEffect(() => {
    (async () => {
      setOptionsLoading(true);
      try {
        const opts = await ashaService.getFormOptions();
        setVillages(opts.villages);
        setFacilities(opts.facilities);
      } catch {
        setRegBanner({ type: 'error', text: 'Failed to load villages / PHC list. Check your connection.' });
      } finally {
        setOptionsLoading(false);
      }
      loadMothers();
    })();
  }, []);

  // ---------- Register Mother ----------
  const validateRegister = (): boolean => {
    const errs: Record<string, string> = {};
    if (!regForm.fullName.trim() || regForm.fullName.trim().length < 2) errs.fullName = 'Full name is required';
    const age = Number(regForm.age);
    if (!regForm.age || isNaN(age) || age < 12 || age > 60) errs.age = 'Enter a valid age (12–60)';
    if (!/^\d{10}$/.test(regForm.phone.trim())) errs.phone = 'Enter a valid 10-digit mobile number';
    if (!regForm.villageId) errs.villageId = 'Select a village';
    if (!regForm.facilityId) errs.facilityId = 'Select the assigned PHC';
    if (!regForm.lmpDate) errs.lmpDate = 'LMP date is required';
    else if (new Date(regForm.lmpDate) > new Date()) errs.lmpDate = 'LMP date cannot be in the future';
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetRegister = () => {
    setRegForm({ fullName: '', age: '', phone: '', villageId: '', facilityId: '', lmpDate: '', gravida: '1' });
    setRegErrors({});
    setRegBanner(null);
  };

  const handleRegisterSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegBanner(null);
    if (!validateRegister()) return;

    setRegSaving(true);
    try {
      const res = await ashaService.registerMother({
        fullName: regForm.fullName.trim(),
        age: Number(regForm.age),
        phone: regForm.phone.trim(),
        villageId: regForm.villageId,
        facilityId: regForm.facilityId,
        lmpDate: regForm.lmpDate,
        gravida: Number(regForm.gravida)
      });
      setRegBanner({
        type: 'success',
        text: `Mother registered successfully. Mother ID: ${res.motherId}`
      });
      setRegForm({ fullName: '', age: '', phone: '', villageId: '', facilityId: '', lmpDate: '', gravida: '1' });
      setRegErrors({});
      loadMothers();
    } catch (err: any) {
      setRegBanner({
        type: 'error',
        text: err.response?.data?.message || 'Failed to register mother. Please try again.'
      });
    } finally {
      setRegSaving(false);
    }
  };

  // ---------- Home Visit ----------
  const validateVisit = (): boolean => {
    const errs: Record<string, string> = {};
    if (!visitForm.motherId) errs.motherId = 'Select a mother';
    if (!visitForm.visitDate) errs.visitDate = 'Visit date is required';
    else if (new Date(visitForm.visitDate) > new Date()) errs.visitDate = 'Visit date cannot be in the future';
    if (visitForm.dangerSigns !== 'yes' && visitForm.dangerSigns !== 'no') errs.dangerSigns = 'Select Yes or No';
    if (visitForm.nextVisitDate && visitForm.visitDate && visitForm.nextVisitDate < visitForm.visitDate) {
      errs.nextVisitDate = 'Next visit must be after the visit date';
    }
    setVisitErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetVisit = () => {
    setVisitForm({ motherId: '', visitDate: '', dangerSigns: '', remarks: '', nextVisitDate: '' });
    setVisitErrors({});
    setVisitBanner(null);
  };

  const handleVisitSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisitBanner(null);
    if (!validateVisit()) return;

    setVisitSaving(true);
    try {
      await ashaService.recordHomeVisit({
        motherId: visitForm.motherId,
        visitDate: visitForm.visitDate,
        dangerSigns: visitForm.dangerSigns === 'yes',
        remarks: visitForm.remarks.trim() || undefined,
        nextVisitDate: visitForm.nextVisitDate || undefined
      });
      setVisitBanner({ type: 'success', text: 'Home visit saved successfully.' });
      setVisitForm({ motherId: '', visitDate: '', dangerSigns: '', remarks: '', nextVisitDate: '' });
      setVisitErrors({});
    } catch (err: any) {
      setVisitBanner({
        type: 'error',
        text: err.response?.data?.message || 'Failed to save home visit. Please try again.'
      });
    } finally {
      setVisitSaving(false);
    }
  };

  const BannerView: React.FC<{ banner: Banner | null }> = ({ banner }) =>
    banner ? (
      <div
        className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
          banner.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            : 'bg-red-500/10 border-red-500/40 text-red-400'
        }`}
        role="alert"
      >
        {banner.type === 'success' ? (
          <BadgeCheck className="w-4 h-4 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 shrink-0" />
        )}
        <span className="font-semibold">{banner.text}</span>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Navigation back to Dashboard */}
        <div>
          <button
            onClick={() => navigate('/asha-dashboard')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-extrabold transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Field Dashboard</span>
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-tight">ASHA Data Entry</h1>
            <p className="text-xs text-slate-400">
              {user?.name ? `${user.name} · ` : ''}Field registration &amp; home visit records
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-900/80 p-1.5 border border-slate-800 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register Mother
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('home-visit')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'home-visit'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4" />
            Home Visit
          </button>
        </div>

        {/* ---------- Form 1: Register Mother ---------- */}
        {activeTab === 'register' && (
          <form
            onSubmit={handleRegisterSave}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl"
            noValidate
          >
            <BannerView banner={regBanner} />

            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                type="text"
                value={regForm.fullName}
                onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                placeholder="e.g. Savitha Kumari"
                className={inputClass}
              />
              <FieldError msg={regErrors.fullName} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Age *</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={12}
                  max={60}
                  value={regForm.age}
                  onChange={(e) => setRegForm({ ...regForm, age: e.target.value })}
                  placeholder="e.g. 24"
                  className={inputClass}
                />
                <FieldError msg={regErrors.age} />
              </div>
              <div>
                <label className={labelClass}>Mobile Number *</label>
                <input
                  type="tel"
                  inputMode="tel"
                  maxLength={10}
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="10-digit number"
                  className={inputClass}
                />
                <FieldError msg={regErrors.phone} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Village *</label>
              <select
                value={regForm.villageId}
                onChange={(e) => setRegForm({ ...regForm, villageId: e.target.value })}
                className={inputClass}
                disabled={optionsLoading}
              >
                <option value="">{optionsLoading ? 'Loading villages…' : 'Select village'}</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nameEn} ({v.nameKn})
                  </option>
                ))}
              </select>
              <FieldError msg={regErrors.villageId} />
            </div>

            <div>
              <label className={labelClass}>Assigned PHC *</label>
              <select
                value={regForm.facilityId}
                onChange={(e) => setRegForm({ ...regForm, facilityId: e.target.value })}
                className={inputClass}
                disabled={optionsLoading}
              >
                <option value="">{optionsLoading ? 'Loading PHCs…' : 'Select PHC'}</option>
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nameEn}
                  </option>
                ))}
              </select>
              <FieldError msg={regErrors.facilityId} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Last Menstrual Period (LMP) *</label>
                <input
                  type="date"
                  value={regForm.lmpDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setRegForm({ ...regForm, lmpDate: e.target.value })}
                  className={inputClass}
                />
                <FieldError msg={regErrors.lmpDate} />
              </div>
              <div>
                <label className={labelClass}>Pregnancy Number *</label>
                <select
                  value={regForm.gravida}
                  onChange={(e) => setRegForm({ ...regForm, gravida: e.target.value })}
                  className={inputClass}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                    <option key={g} value={g}>
                      G{g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={regSaving}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {regSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {regSaving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetRegister}
                disabled={regSaving}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ---------- Form 2: Home Visit ---------- */}
        {activeTab === 'home-visit' && (
          <form
            onSubmit={handleVisitSave}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl"
            noValidate
          >
            <BannerView banner={visitBanner} />

            <div>
              <label className={labelClass}>Select Mother *</label>
              <select
                value={visitForm.motherId}
                onChange={(e) => setVisitForm({ ...visitForm, motherId: e.target.value })}
                className={inputClass}
              >
                <option value="">Select mother</option>
                {mothers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} · {m.rchId}
                    {m.village?.nameEn ? ` · ${m.village.nameEn}` : ''}
                  </option>
                ))}
              </select>
              <FieldError msg={visitErrors.motherId} />
            </div>

            <div>
              <label className={labelClass}>Visit Date *</label>
              <input
                type="date"
                value={visitForm.visitDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                className={inputClass}
              />
              <FieldError msg={visitErrors.visitDate} />
            </div>

            <div>
              <label className={labelClass}>Any Danger Signs? *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisitForm({ ...visitForm, dangerSigns: 'yes' })}
                  className={`py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    visitForm.dangerSigns === 'yes'
                      ? 'bg-red-500/15 border-red-500 text-red-300'
                      : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setVisitForm({ ...visitForm, dangerSigns: 'no' })}
                  className={`py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    visitForm.dangerSigns === 'no'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  No
                </button>
              </div>
              <FieldError msg={visitErrors.dangerSigns} />
            </div>

            <div>
              <label className={labelClass}>Remarks</label>
              <textarea
                rows={3}
                value={visitForm.remarks}
                onChange={(e) => setVisitForm({ ...visitForm, remarks: e.target.value })}
                placeholder="Observations during the visit (optional)"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Next Visit Date</label>
              <input
                type="date"
                value={visitForm.nextVisitDate}
                min={visitForm.visitDate || undefined}
                onChange={(e) => setVisitForm({ ...visitForm, nextVisitDate: e.target.value })}
                className={inputClass}
              />
              <FieldError msg={visitErrors.nextVisitDate} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={visitSaving}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {visitSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {visitSaving ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetVisit}
                disabled={visitSaving}
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
