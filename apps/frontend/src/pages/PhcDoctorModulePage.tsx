import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { doctorService, DoctorMotherProfile, AncVisitHistoryItem } from '../services/doctorService';

interface DeliveryRecord {
  id: string;
  motherName: string;
  motherId: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryMode: string;
  gender: string;
  birthWeight: string;
  apgarScore: string;
  vitalStatus: string;
  doctorName: string;
}

export const PhcDoctorModulePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Search State
  const [searchInput, setSearchInput] = useState('JAN-KA-HVR-2026-000001');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [motherFound, setMotherFound] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // QR Modal State
  const [showQrModal, setShowQrModal] = useState(false);

  // Labor Ward & Delivery Modal State
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedLaborBed, setSelectedLaborBed] = useState<string | null>(null);
  const [deliverySuccessMessage, setDeliverySuccessMessage] = useState<string | null>(null);

  // New Delivery Form State
  const [deliveryForm, setDeliveryForm] = useState({
    motherId: 'JAN-KA-HVR-2026-000088',
    motherName: 'Meena Kumari',
    deliveryMode: 'NORMAL_VAGINAL',
    babyGender: 'FEMALE',
    birthWeight: '2.95',
    apgarScore: '9/10',
    vitaminKGiven: true,
    bcgVaccineGiven: true,
    deliveryNotes: 'Normal spontaneous vaginal delivery without complications. Perineum intact.'
  });

  // Loaded Mother Data (Read Only)
  const [mother, setMother] = useState<DoctorMotherProfile | null>(null);
  const [ancHistory, setAncHistory] = useState<AncVisitHistoryItem[]>([]);

  // ANC Examination Form State
  const defaultNextVisit = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [form, setForm] = useState({
    bloodPressure: '120/80',
    weight: '55.0',
    hbLevel: '11.5',
    doctorNotes: '',
    nextVisitDate: defaultNextVisit
  });

  const [formErrors, setFormErrors] = useState<{ bloodPressure?: string; weight?: string; hbLevel?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Mock Delivery Records State
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([
    {
      id: 'DEL-2026-042',
      motherName: 'Savitha R.',
      motherId: 'JAN-KA-HVR-2026-000074',
      deliveryDate: '2026-07-27',
      deliveryTime: '04:45 AM',
      deliveryMode: 'Normal Vaginal Delivery',
      gender: 'Female',
      birthWeight: '2.95 kg',
      apgarScore: '9/10',
      vitalStatus: 'Healthy (Post-Natal Recovery)',
      doctorName: 'Dr. Ananya Rao (PHC MO)'
    },
    {
      id: 'DEL-2026-041',
      motherName: 'Rajeshwari K.',
      motherId: 'JAN-KA-HVR-2026-000062',
      deliveryDate: '2026-07-26',
      deliveryTime: '11:20 PM',
      deliveryMode: 'Normal Vaginal Delivery',
      gender: 'Male',
      birthWeight: '3.10 kg',
      apgarScore: '8/10',
      vitalStatus: 'Discharged in Good Health',
      doctorName: 'Dr. Ananya Rao (PHC MO)'
    },
    {
      id: 'DEL-2026-040',
      motherName: 'Deepa M.',
      motherId: 'JAN-KA-HVR-2026-000055',
      deliveryDate: '2026-07-25',
      deliveryTime: '02:15 PM',
      deliveryMode: 'Referred for Emergency LSCS',
      gender: 'Male',
      birthWeight: '3.30 kg',
      apgarScore: '7/10',
      vitalStatus: 'Transferred to Haveri District Hospital',
      doctorName: 'Dr. Ananya Rao (PHC MO)'
    }
  ]);

  // Auto-load default test mother profile JAN-KA-HVR-2026-000001 on initial load or from URL
  useEffect(() => {
    const idFromParam = searchParams.get('id') || 'JAN-KA-HVR-2026-000001';
    setSearchInput(idFromParam);
    handleExecuteSearch(idFromParam);
  }, [searchParams]);

  // Execute Mother Search
  const handleExecuteSearch = async (idToSearch: string) => {
    const trimmedId = idToSearch.trim();
    if (!trimmedId) {
      setSearchError('Please enter a valid Mother ID.');
      setMotherFound(false);
      setSearchExecuted(true);
      return;
    }

    setLoadingSearch(true);
    setSearchError(null);
    setSaveSuccessMessage(null);
    setSaveError(null);
    setSearchExecuted(true);

    const res = await doctorService.searchMother(trimmedId);

    if (res.success && res.mother) {
      setMother(res.mother);
      setMotherFound(true);
      const visits = res.mother.pregnancy?.recentVisits || [];
      setAncHistory(visits.slice(0, 5));

      if (visits[0]?.weight) {
        const cleanWeight = visits[0].weight.replace(/[^\d.]/g, '');
        if (cleanWeight) {
          setForm((prev) => ({ ...prev, weight: cleanWeight }));
        }
      }
    } else {
      setMother(null);
      setMotherFound(false);
      setAncHistory([]);
      setSearchError('❌ Mother Record Not Found');
    }

    setLoadingSearch(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setMother(null);
    setMotherFound(false);
    setSearchExecuted(false);
    setSearchError(null);
    setSaveSuccessMessage(null);
    setAncHistory([]);
    handleResetCheckupForm();
  };

  const handleBackToSearch = () => {
    setSearchInput('');
    setSearchError(null);
    setSearchExecuted(false);
    setMother(null);
    setMotherFound(false);
  };

  const handleResetCheckupForm = () => {
    setForm({
      bloodPressure: '120/80',
      weight: '55.0',
      hbLevel: '11.5',
      doctorNotes: '',
      nextVisitDate: defaultNextVisit
    });
    setFormErrors({});
    setSaveError(null);
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errs: { bloodPressure?: string; weight?: string; hbLevel?: string } = {};

    if (!form.bloodPressure.trim()) {
      errs.bloodPressure = 'Blood pressure is required (e.g. 120/80)';
    }

    if (!form.weight) {
      errs.weight = 'Weight is required';
    }

    if (!form.hbLevel) {
      errs.hbLevel = 'Hemoglobin level is required';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save Checkup Handler
  const handleSaveCheckup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mother) {
      setSaveError('Please search and select a registered mother first.');
      return;
    }

    if (!validateForm()) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccessMessage(null);

    const activeMotherId = mother.motherId || mother.id;

    const res = await doctorService.recordAncCheckup({
      motherId: activeMotherId,
      pregnancyId: mother.pregnancy?.id,
      bloodPressure: form.bloodPressure.trim(),
      weight: form.weight,
      hbLevel: form.hbLevel,
      doctorNotes: form.doctorNotes.trim() || 'Routine PHC ANC Examination completed.',
      nextVisitDate: form.nextVisitDate
    });

    if (res.success) {
      setSaveSuccessMessage('✅ ANC Checkup Saved Successfully.');

      if (res.recentVisits) {
        setAncHistory(res.recentVisits.slice(0, 5));
      } else {
        handleExecuteSearch(activeMotherId);
      }
    } else {
      setSaveError(res.message || 'Failed to save ANC checkup record.');
    }

    setSaving(false);
  };

  const handleSelectQrMother = (id: string) => {
    setShowQrModal(false);
    setSearchInput(id);
    handleExecuteSearch(id);
  };

  // Record New Delivery Demo Handler
  const handleSaveDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const newDelivery: DeliveryRecord = {
      id: `DEL-2026-0${Math.floor(43 + Math.random() * 50)}`,
      motherName: deliveryForm.motherName,
      motherId: deliveryForm.motherId,
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryMode: deliveryForm.deliveryMode === 'NORMAL_VAGINAL' ? 'Normal Vaginal Delivery' : 'LSCS Delivery',
      gender: deliveryForm.babyGender === 'FEMALE' ? 'Female' : 'Male',
      birthWeight: `${deliveryForm.birthWeight} kg`,
      apgarScore: deliveryForm.apgarScore,
      vitalStatus: 'Healthy Mother & Infant (Vitamin K & BCG Administered)',
      doctorName: 'Dr. Ananya Rao (PHC MO)'
    };

    setDeliveries([newDelivery, ...deliveries]);
    setDeliverySuccessMessage('✅ Delivery Information & Infant Registration Saved Successfully.');
    setShowDeliveryModal(false);

    setTimeout(() => {
      setDeliverySuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans pb-12">
      <Navbar />

      <main className="container-lg max-w-6xl mx-auto px-3 sm:px-4 pt-4 space-y-5">
        {/* GOVERNMENT HEALTHCARE TITLE BANNER */}
        <div className="card rounded-4 border-0 bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white shadow-lg p-4 sm:p-5">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="w-12 h-12 rounded-3 bg-emerald-500 text-slate-950 p-2 shadow-sm d-flex align-items-center justify-center shrink-0 fs-3">
                <i className="bi bi-hospital" />
              </div>
              <div>
                <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-uppercase px-2.5 py-1 mb-1">
                  Primary Health Centre (PHC) · Karnataka Health Services
                </span>
                <h1 className="h4 font-extrabold text-white mb-0 tracking-tight">
                  ANC Examination &amp; Labor Ward Module
                </h1>
                <p className="small text-slate-200 mb-0">
                  Search Registered Mother · View ASHA Worker Data · Record ANC Checkup · Monitor Active Labor Wards
                </p>
              </div>
            </div>
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-3 px-3 py-2 text-sm-end w-100 w-sm-auto">
              <span className="d-block text-uppercase text-slate-400 font-bold text-[10px]">Clinical Module</span>
              <span className="font-mono text-emerald-400 font-bold small">PHC Doctor Portal</span>
            </div>
          </div>
        </div>

        {/* 1. SEARCH MOTHER SECTION (TOP CARD) */}
        <div className="card rounded-4 border-0 bg-white text-slate-900 shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
            <h2 className="h6 font-bold text-slate-900 mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-search text-success fs-5" />
              1. Search Mother
            </h2>
            <span className="text-muted font-mono text-xs">
              Example Test Mother ID: <strong className="text-emerald-700">JAN-KA-HVR-2026-000001</strong>
            </span>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div className="row g-2">
              {/* Search Bar Input */}
              <div className="col-12 col-md">
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-slate-100 text-slate-500 border-slate-300">
                    <i className="bi bi-person-badge" />
                  </span>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter Mother ID"
                    className="form-control bg-white text-slate-900 border-slate-300 font-mono text-sm shadow-none"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="btn btn-outline-secondary border-slate-300 text-slate-500"
                    >
                      <i className="bi bi-x-circle-fill" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="col-12 col-md-auto d-flex gap-2 flex-wrap">
                {/* Search Button */}
                <button
                  type="submit"
                  disabled={loadingSearch}
                  className="btn btn-success btn-lg px-4 font-bold text-xs uppercase tracking-wider shadow-sm d-flex align-items-center gap-2"
                >
                  {loadingSearch ? (
                    <>
                      <i className="bi bi-arrow-repeat spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search" />
                      Search Button
                    </>
                  )}
                </button>

                {/* QR Scan Button */}
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="btn btn-outline-dark btn-lg px-3 text-xs font-bold d-flex align-items-center gap-2"
                >
                  <i className="bi bi-qr-code-scan text-success fs-6" />
                  QR Scan Button
                </button>

                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn btn-outline-secondary btn-lg px-3 text-xs font-bold d-flex align-items-center gap-1.5"
                >
                  <i className="bi bi-x-circle" />
                  Clear Button
                </button>
              </div>
            </div>
          </form>

          {/* MOTHER FOUND SUCCESS BANNER */}
          {searchExecuted && motherFound && mother && (
            <div className="alert alert-success bg-emerald-50 border-emerald-200 text-emerald-900 rounded-3 mt-3 mb-0 p-3 d-flex align-items-center gap-3">
              <i className="bi bi-check-circle-fill text-success fs-4 shrink-0" />
              <div>
                <strong className="d-block font-bold">✓ Mother Registration Data Fetched from ASHA Worker</strong>
                <span className="small text-slate-700">
                  Loaded profile for <strong className="text-slate-900">{mother.fullName}</strong> (Mother ID:{' '}
                  <span className="font-mono text-emerald-800 font-bold">{mother.motherId}</span>)
                </span>
              </div>
            </div>
          )}

          {/* INVALID MOTHER ID: DISPLAY ❌ Mother Record Not Found & Back to Search Button */}
          {searchExecuted && !motherFound && searchError && (
            <div className="alert alert-danger bg-red-50 border-red-200 text-red-900 rounded-3 mt-3 mb-0 p-4 d-flex align-items-center justify-content-between gap-3 flex-wrap shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-x-circle-fill text-danger fs-3 shrink-0" />
                <div>
                  <h3 className="h6 font-bold text-danger mb-0">{searchError}</h3>
                  <span className="small text-slate-700">
                    The entered Mother ID <span className="font-mono font-bold text-slate-900">"{searchInput}"</span> is not registered in the ASHA database.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBackToSearch}
                className="btn btn-dark btn-sm px-3 font-bold d-flex align-items-center gap-1.5 shadow-sm"
              >
                <i className="bi bi-arrow-left" />
                Back to Search
              </button>
            </div>
          )}
        </div>

        {/* SUCCESS CHECKUP SAVED BANNER */}
        {saveSuccessMessage && (
          <div className="alert alert-success bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-4 p-4 shadow-sm d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="w-10 h-10 rounded-3 bg-emerald-500 text-white d-flex align-items-center justify-center fs-4 shrink-0 shadow-sm">
                <i className="bi bi-check-lg" />
              </div>
              <div>
                <h3 className="h5 font-bold text-emerald-900 mb-0">{saveSuccessMessage}</h3>
                <p className="small text-slate-700 mb-0 mt-0.5">
                  ANC examination saved and linked to Mother ID:{' '}
                  <strong className="font-mono text-slate-900">{mother?.motherId}</strong>.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMessage(null)}
              className="btn-close"
              aria-label="Close"
            />
          </div>
        )}

        {/* SUCCESS DELIVERY RECORD SAVED BANNER */}
        {deliverySuccessMessage && (
          <div className="alert alert-success bg-emerald-50 border-2 border-emerald-500 text-emerald-900 rounded-4 p-4 shadow-sm d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="w-10 h-10 rounded-3 bg-emerald-600 text-white d-flex align-items-center justify-center fs-4 shrink-0 shadow-sm">
                <i className="bi bi-balloon-heart-fill" />
              </div>
              <div>
                <h3 className="h5 font-bold text-emerald-900 mb-0">{deliverySuccessMessage}</h3>
                <p className="small text-slate-700 mb-0 mt-0.5">
                  Delivery record &amp; infant immunizations updated in PHC registry.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDeliverySuccessMessage(null)}
              className="btn-close"
              aria-label="Close"
            />
          </div>
        )}

        {/* WORKFLOW CONTENT: 2-COLUMN RESPONSIVE LAYOUT */}
        <div className="row g-4 items-start">
          {/* 2. MOTHER DETAILS (READ ONLY) */}
          <div className="col-12 col-lg-5">
            <div className="card rounded-4 border-0 bg-white text-slate-900 shadow-sm p-4 h-100">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <h2 className="h6 font-bold text-slate-900 mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-person-vcard text-success fs-5" />
                  2. Mother Details (Read Only)
                </h2>
                <span className="badge bg-slate-100 text-slate-600 border border-slate-300 font-mono">
                  <i className="bi bi-lock-fill text-slate-400 me-1" />
                  Read Only
                </span>
              </div>

              {mother ? (
                <div className="space-y-3">
                  {/* Mother ID Badge */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-3 p-3 d-flex justify-content-between align-items-center">
                    <span className="text-slate-600 text-xs font-semibold">Mother ID:</span>
                    <span className="font-mono font-bold text-emerald-800 fs-6">{mother.motherId}</span>
                  </div>

                  {/* Read-Only Details Grid */}
                  <div className="bg-slate-50 rounded-3 border border-slate-200 p-3 space-y-2 text-xs">
                    <div className="d-flex justify-content-between py-1.5 border-bottom border-slate-200">
                      <span className="text-slate-500 font-semibold">Mother Name:</span>
                      <strong className="text-slate-900">{mother.fullName}</strong>
                    </div>

                    <div className="d-flex justify-content-between py-1.5 border-bottom border-slate-200">
                      <span className="text-slate-500 font-semibold">Age:</span>
                      <strong className="text-slate-800">{mother.age} Years</strong>
                    </div>

                    <div className="d-flex justify-content-between py-1.5 border-bottom border-slate-200">
                      <span className="text-slate-500 font-semibold">Mobile Number:</span>
                      <strong className="font-mono text-slate-800">{mother.mobileNumber}</strong>
                    </div>

                    <div className="d-flex justify-content-between py-1.5 border-bottom border-slate-200">
                      <span className="text-slate-500 font-semibold">Village:</span>
                      <strong className="text-slate-800">{mother.village}</strong>
                    </div>

                    <div className="d-flex justify-content-between py-1.5 border-bottom border-slate-200">
                      <span className="text-slate-500 font-semibold">Pregnancy Number:</span>
                      <strong className="text-emerald-700">
                        G{mother.pregnancy?.gravida || 2}{' '}
                        <span className="text-slate-500 font-normal">
                          ({mother.pregnancy?.gravida === 1 ? 'Primi' : `Gravida ${mother.pregnancy?.gravida || 2}`})
                        </span>
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between py-1.5 border-bottom border-slate-200">
                      <span className="text-slate-500 font-semibold">LMP:</span>
                      <strong className="font-mono text-slate-800">{mother.pregnancy?.lmpDate || '12-Jan-2026'}</strong>
                    </div>

                    <div className="d-flex justify-content-between py-1.5 border-bottom border-slate-200">
                      <span className="text-slate-500 font-semibold">Expected Delivery Date (EDD):</span>
                      <strong className="font-mono text-emerald-800">{mother.pregnancy?.eddDate || '19-Oct-2026'}</strong>
                    </div>

                    <div className="d-flex justify-content-between py-1.5 border-bottom border-slate-200">
                      <span className="text-slate-500 font-semibold">Assigned ASHA Worker:</span>
                      <strong className="text-emerald-700">{mother.assignedAsha}</strong>
                    </div>

                    <div className="d-flex justify-content-between py-1.5">
                      <span className="text-slate-500 font-semibold">Assigned PHC:</span>
                      <strong className="text-slate-800 text-end text-truncate ms-2" style={{ maxWidth: '180px' }}>
                        {mother.assignedPhc}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty state prior to searching */
                <div className="text-center py-5 space-y-3 text-slate-400">
                  <i className="bi bi-person-vcard fs-1 d-block text-slate-300" />
                  <p className="small mb-0 font-semibold text-slate-600">No Mother Record Selected</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mb-0">
                    Search Mother ID above or click QR Scan to fetch registration data.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: 3. ANC CHECKUP FORM & 4. PREVIOUS ANC HISTORY */}
          <div className="col-12 col-lg-7 space-y-5">
            {/* 3. ANC CHECKUP FORM CARD */}
            <div className="card rounded-4 border-0 bg-white text-slate-900 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <h2 className="h6 font-bold text-slate-900 mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-heart-pulse-fill text-success fs-5" />
                  3. ANC Checkup Form
                </h2>
                <span className="badge bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Clinical Examination
                </span>
              </div>

              {saveError && (
                <div className="alert alert-danger bg-red-50 border-red-200 text-red-900 rounded-3 p-3 small mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2" />
                  {saveError}
                </div>
              )}

              <form onSubmit={handleSaveCheckup} className="space-y-3">
                <div className="row g-3">
                  {/* Blood Pressure */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label text-xs font-semibold text-slate-700 mb-1">
                      Blood Pressure <span className="text-slate-400">(mmHg)</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-slate-100 border-slate-300 text-slate-500">
                        <i className="bi bi-heart-pulse" />
                      </span>
                      <input
                        type="text"
                        value={form.bloodPressure}
                        onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })}
                        placeholder="e.g. 120/80"
                        className={`form-control bg-white border-slate-300 text-slate-900 font-mono text-sm ${
                          formErrors.bloodPressure ? 'is-invalid' : ''
                        }`}
                      />
                    </div>
                    {formErrors.bloodPressure && (
                      <div className="text-danger text-[11px] mt-1">{formErrors.bloodPressure}</div>
                    )}
                  </div>

                  {/* Weight */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label text-xs font-semibold text-slate-700 mb-1">
                      Weight <span className="text-slate-400">(kg)</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-slate-100 border-slate-300 text-slate-500">
                        <i className="bi bi-speedometer2" />
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        min={30}
                        max={150}
                        value={form.weight}
                        onChange={(e) => setForm({ ...form, weight: e.target.value })}
                        placeholder="e.g. 55.0"
                        className={`form-control bg-white border-slate-300 text-slate-900 font-mono text-sm ${
                          formErrors.weight ? 'is-invalid' : ''
                        }`}
                      />
                      <span className="input-group-text bg-slate-100 border-slate-300 text-slate-600 text-xs font-bold">
                        kg
                      </span>
                    </div>
                    {formErrors.weight && (
                      <div className="text-danger text-[11px] mt-1">{formErrors.weight}</div>
                    )}
                  </div>

                  {/* Hemoglobin (Hb) */}
                  <div className="col-12">
                    <label className="form-label text-xs font-semibold text-slate-700 mb-1">
                      Hemoglobin (Hb) <span className="text-slate-400">(g/dL)</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-slate-100 border-slate-300 text-slate-500">
                        <i className="bi bi-droplet-half" />
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        min={3}
                        max={20}
                        value={form.hbLevel}
                        onChange={(e) => setForm({ ...form, hbLevel: e.target.value })}
                        placeholder="e.g. 11.5"
                        className={`form-control bg-white border-slate-300 text-slate-900 font-mono text-sm ${
                          formErrors.hbLevel ? 'is-invalid' : ''
                        }`}
                      />
                      <span className="input-group-text bg-slate-100 border-slate-300 text-slate-600 text-xs font-bold">
                        g/dL
                      </span>
                    </div>
                    {formErrors.hbLevel && (
                      <div className="text-danger text-[11px] mt-1">{formErrors.hbLevel}</div>
                    )}
                  </div>

                  {/* Doctor Notes */}
                  <div className="col-12">
                    <label className="form-label text-xs font-semibold text-slate-700 mb-1">
                      Doctor Notes
                    </label>
                    <textarea
                      rows={3}
                      value={form.doctorNotes}
                      onChange={(e) => setForm({ ...form, doctorNotes: e.target.value })}
                      placeholder="Enter clinical observations, prescribed medications, or recommendations..."
                      className="form-control bg-white border-slate-300 text-slate-900 text-sm"
                    />
                  </div>

                  {/* Next Visit Date */}
                  <div className="col-12">
                    <label className="form-label text-xs font-semibold text-slate-700 mb-1">
                      Next Visit Date
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-slate-100 border-slate-300 text-slate-500">
                        <i className="bi bi-calendar-event" />
                      </span>
                      <input
                        type="date"
                        value={form.nextVisitDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setForm({ ...form, nextVisitDate: e.target.value })}
                        className="form-control bg-white border-slate-300 text-slate-900 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* FORM BUTTONS: Save Checkup (Green), Reset, Cancel */}
                <div className="pt-3 border-top d-flex flex-wrap align-items-center justify-content-end gap-2">
                  {/* Save Checkup Button */}
                  <button
                    type="submit"
                    disabled={saving || !mother}
                    className="btn btn-success px-4 py-2.5 font-bold uppercase tracking-wider text-xs d-flex align-items-center gap-2 shadow-sm"
                  >
                    {saving ? (
                      <>
                        <i className="bi bi-arrow-repeat spin" />
                        Saving Checkup...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill" />
                        Save Checkup
                      </>
                    )}
                  </button>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={handleResetCheckupForm}
                    disabled={saving}
                    className="btn btn-outline-secondary px-3 py-2.5 text-xs font-bold d-flex align-items-center gap-1.5"
                  >
                    <i className="bi bi-arrow-clockwise" />
                    Reset
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    disabled={saving}
                    className="btn btn-outline-danger px-3 py-2.5 text-xs font-bold d-flex align-items-center gap-1.5"
                  >
                    <i className="bi bi-x-circle" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* 4. PREVIOUS ANC HISTORY TABLE (LAST 5 VISITS) */}
            <div className="card rounded-4 border-0 bg-white text-slate-900 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                <h2 className="h6 font-bold text-slate-900 mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history text-success fs-5" />
                  4. Previous ANC History
                </h2>
                <span className="badge bg-slate-100 text-slate-600 border border-slate-300">
                  Last 5 Visits
                </span>
              </div>

              {ancHistory.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 text-xs">
                    <thead className="table-light">
                      <tr className="text-slate-600 text-uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3">Visit Date</th>
                        <th className="py-2.5 px-3">BP</th>
                        <th className="py-2.5 px-3">Weight</th>
                        <th className="py-2.5 px-3">Hb</th>
                        <th className="py-2.5 px-3">Doctor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {ancHistory.map((visit, idx) => (
                        <tr key={visit.id || idx}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{visit.visitDate}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{visit.bloodPressure}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">{visit.weight}</td>
                          <td className="py-2.5 px-3 font-mono text-teal-700 font-bold">{visit.hbLevel}</td>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">{visit.doctorName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500 text-xs">
                  {mother ? 'No previous ANC visits recorded yet.' : 'Search a Mother Record to view ANC History.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NEW DEMO SECTION: ACTIVE LABOR WARDS & DELIVERY INFORMATION SUMMARY       */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-4 border-top border-slate-800">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
            <div>
              <h2 className="h5 font-extrabold text-white mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-activity text-emerald-400" />
                Active Labor Wards &amp; Delivery Information (Live Status)
              </h2>
              <p className="small text-slate-300 mb-0">
                Monitor real-time labor bed occupancy, WHO Partograph alerts, and recent birth delivery logs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeliveryModal(true)}
              className="btn btn-success font-bold text-xs px-3 py-2 rounded-3 d-flex align-items-center gap-1.5 shadow-sm"
            >
              <i className="bi bi-plus-circle-fill" />
              Record Delivery
            </button>
          </div>

          {/* ACTIVE LABOR BEDS GRID (4 BEDS) */}
          <div className="row g-3">
            {/* BED 1 - Active Stage 2 Labor */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card rounded-4 border-0 bg-white text-slate-900 shadow-sm p-3.5 h-100 position-relative overflow-hidden">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                  <span className="badge bg-emerald-100 text-emerald-900 font-mono font-bold">
                    <i className="bi bi-[#bed] text-success me-1" />
                    BED #1
                  </span>
                  <span className="badge bg-success text-white font-bold animate-pulse">
                    Stage 2 Active Labor
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 fs-6">Meena Kumari (26Y, G2)</div>
                  <div className="text-muted font-mono">ID: JAN-KA-HVR-2026-000088</div>

                  <div className="bg-slate-50 p-2 rounded-3 border border-slate-200 space-y-1 mt-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Cervical Dilation:</span>
                      <strong className="text-emerald-700 font-mono">8.5 cm (Fully Effaced)</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Fetal Heart Rate:</span>
                      <strong className="text-slate-900 font-mono">142 bpm (Normal)</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Contractions:</span>
                      <strong className="text-slate-800 font-mono">4 / 10 min (45s)</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Admitted:</span>
                      <span className="text-slate-700">Today, 03:30 AM (4h 15m)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-top d-flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveryForm({
                        motherId: 'JAN-KA-HVR-2026-000088',
                        motherName: 'Meena Kumari',
                        deliveryMode: 'NORMAL_VAGINAL',
                        babyGender: 'FEMALE',
                        birthWeight: '2.95',
                        apgarScore: '9/10',
                        vitaminKGiven: true,
                        bcgVaccineGiven: true,
                        deliveryNotes: 'Normal spontaneous vaginal delivery complete.'
                      });
                      setShowDeliveryModal(true);
                    }}
                    className="btn btn-sm btn-success w-100 font-bold text-xs rounded-3"
                  >
                    <i className="bi bi-box-arrow-in-down me-1" />
                    Deliver &amp; Log
                  </button>
                </div>
              </div>
            </div>

            {/* BED 2 - Active Stage 1 Latent Labor */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card rounded-4 border-0 bg-white text-slate-900 shadow-sm p-3.5 h-100">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                  <span className="badge bg-teal-100 text-teal-900 font-mono font-bold">
                    BED #2
                  </span>
                  <span className="badge bg-teal-700 text-white font-bold">
                    Stage 1 Active Phase
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 fs-6">Shruti Gowda (22Y, G1)</div>
                  <div className="text-muted font-mono">ID: JAN-KA-HVR-2026-000092</div>

                  <div className="bg-slate-50 p-2 rounded-3 border border-slate-200 space-y-1 mt-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Cervical Dilation:</span>
                      <strong className="text-teal-700 font-mono">4.0 cm (Partograph Alert Line)</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Fetal Heart Rate:</span>
                      <strong className="text-slate-900 font-mono">138 bpm (Normal)</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Contractions:</span>
                      <strong className="text-slate-800 font-mono">2 / 10 min (30s)</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Admitted:</span>
                      <span className="text-slate-700">Today, 05:15 AM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-top">
                  <button
                    type="button"
                    onClick={() => navigate('/labor-dashboard')}
                    className="btn btn-sm btn-outline-teal w-100 font-bold text-xs rounded-3 text-teal-800 border-teal-300"
                  >
                    <i className="bi bi-graph-up me-1" />
                    WHO Partograph
                  </button>
                </div>
              </div>
            </div>

            {/* BED 3 - Post-Delivery Recovery */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card rounded-4 border-0 bg-white text-slate-900 shadow-sm p-3.5 h-100">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                  <span className="badge bg-blue-100 text-blue-900 font-mono font-bold">
                    BED #3
                  </span>
                  <span className="badge bg-primary text-white font-bold">
                    Post-Delivery (Recovery)
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 fs-6">Savitha R. (25Y, G2)</div>
                  <div className="text-muted font-mono">ID: JAN-KA-HVR-2026-000074</div>

                  <div className="bg-slate-50 p-2 rounded-3 border border-slate-200 space-y-1 mt-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Delivery Time:</span>
                      <strong className="text-slate-900 font-mono">Today, 04:45 AM</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Newborn:</span>
                      <strong className="text-primary font-mono">Baby Girl (2.95 kg)</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">APGAR Score:</span>
                      <strong className="text-success font-mono">9/10 (Healthy)</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-slate-500">Immunization:</span>
                      <span className="text-emerald-700 font-bold">BCG &amp; Vit-K Given</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-top">
                  <button
                    type="button"
                    onClick={() => navigate('/child-profile')}
                    className="btn btn-sm btn-outline-primary w-100 font-bold text-xs rounded-3"
                  >
                    <i className="bi bi-person-heart me-1" />
                    Newborn Profile
                  </button>
                </div>
              </div>
            </div>

            {/* BED 4 - Available / Sanitized */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="card rounded-4 border-2 border-dashed border-slate-300 bg-slate-50 text-slate-700 p-3.5 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center border-bottom border-slate-300 pb-2 mb-2">
                    <span className="badge bg-slate-200 text-slate-700 font-mono font-bold">
                      BED #4
                    </span>
                    <span className="badge bg-emerald-600 text-white font-bold">
                      Available / Ready
                    </span>
                  </div>

                  <div className="text-center py-3 space-y-1">
                    <i className="bi bi-[#bed] text-slate-400 fs-1 d-block" />
                    <div className="font-bold text-slate-800 text-xs">Sanitized &amp; Equipped</div>
                    <div className="text-[11px] text-slate-500">
                      Fetal Doppler, Oxygen point, Warmer ready
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (mother) {
                      setDeliveryForm((prev) => ({
                        ...prev,
                        motherId: mother.motherId,
                        motherName: mother.fullName
                      }));
                    }
                    setShowDeliveryModal(true);
                  }}
                  className="btn btn-sm btn-outline-success w-100 font-bold text-xs rounded-3 bg-white"
                >
                  <i className="bi bi-person-plus-fill me-1" />
                  Admit Mother to Ward
                </button>
              </div>
            </div>
          </div>

          {/* RECENT DELIVERY LOGS TABLE */}
          <div className="card rounded-4 border-0 bg-white text-slate-900 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <h2 className="h6 font-bold text-slate-900 mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-[#award] text-success fs-5" />
                Recent Delivery Records Log (PHC Kaginele)
              </h2>
              <span className="badge bg-slate-100 text-slate-600 border border-slate-300">
                Total Deliveries: {deliveries.length}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-xs">
                <thead className="table-light">
                  <tr className="text-slate-600 text-uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Delivery ID</th>
                    <th className="py-2.5 px-3">Mother Name &amp; ID</th>
                    <th className="py-2.5 px-3">Date &amp; Time</th>
                    <th className="py-2.5 px-3">Delivery Mode</th>
                    <th className="py-2.5 px-3">Baby Details</th>
                    <th className="py-2.5 px-3">APGAR</th>
                    <th className="py-2.5 px-3">Status / Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {deliveries.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{item.id}</td>
                      <td className="py-2.5 px-3">
                        <strong className="d-block text-slate-900">{item.motherName}</strong>
                        <span className="font-mono text-slate-500 text-[11px]">{item.motherId}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="d-block font-mono text-slate-800">{item.deliveryDate}</span>
                        <span className="text-slate-500 text-[11px]">{item.deliveryTime}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{item.deliveryMode}</td>
                      <td className="py-2.5 px-3">
                        <span className="fw-bold text-slate-900 me-1">{item.gender}</span>
                        <span className="text-slate-600">({item.birthWeight})</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-success">{item.apgarScore}</td>
                      <td className="py-2.5 px-3 text-slate-700">{item.vitalStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* RECORD DELIVERY MODAL (DEMO) */}
      {showDeliveryModal && (
        <div className="modal d-block bg-black/80 backdrop-blur-sm" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-white text-slate-900 border-0 rounded-4 shadow-2xl">
              <div className="modal-header border-bottom">
                <h5 className="modal-title h6 font-bold d-flex align-items-center gap-2">
                  <i className="bi bi-box-arrow-in-down text-success" />
                  Record Delivery Outcome &amp; Infant Birth Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeliveryModal(false)}
                />
              </div>

              <form onSubmit={handleSaveDelivery}>
                <div className="modal-body space-y-3 p-4">
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label text-xs font-semibold text-slate-700 mb-1">Mother Name</label>
                      <input
                        type="text"
                        value={deliveryForm.motherName}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, motherName: e.target.value })}
                        className="form-control bg-white border-slate-300 text-slate-900 text-sm"
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-xs font-semibold text-slate-700 mb-1">Mother ID</label>
                      <input
                        type="text"
                        value={deliveryForm.motherId}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, motherId: e.target.value })}
                        className="form-control bg-white border-slate-300 font-mono text-slate-900 text-sm"
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-xs font-semibold text-slate-700 mb-1">Delivery Mode</label>
                      <select
                        value={deliveryForm.deliveryMode}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryMode: e.target.value })}
                        className="form-select bg-white border-slate-300 text-slate-900 text-sm"
                      >
                        <option value="NORMAL_VAGINAL">Normal Spontaneous Vaginal Delivery</option>
                        <option value="LSCS_EMERGENCY">Emergency LSCS (Transferred)</option>
                        <option value="ASSISTED_VACUUM">Assisted Vacuum Delivery</option>
                      </select>
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-xs font-semibold text-slate-700 mb-1">Baby Gender</label>
                      <select
                        value={deliveryForm.babyGender}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, babyGender: e.target.value })}
                        className="form-select bg-white border-slate-300 text-slate-900 text-sm"
                      >
                        <option value="FEMALE">Female (Girl)</option>
                        <option value="MALE">Male (Boy)</option>
                      </select>
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-xs font-semibold text-slate-700 mb-1">Birth Weight (kg)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={deliveryForm.birthWeight}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, birthWeight: e.target.value })}
                        className="form-control bg-white border-slate-300 font-mono text-slate-900 text-sm"
                        required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label text-xs font-semibold text-slate-700 mb-1">APGAR Score (1m / 5m)</label>
                      <input
                        type="text"
                        value={deliveryForm.apgarScore}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, apgarScore: e.target.value })}
                        className="form-control bg-white border-slate-300 font-mono text-slate-900 text-sm"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-xs font-semibold text-slate-700 mb-1">Immediate Immunization Given</label>
                      <div className="d-flex gap-4 border p-2.5 rounded-3 bg-slate-50">
                        <label className="form-check-label text-xs font-bold text-slate-800 d-flex align-items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={deliveryForm.vitaminKGiven}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, vitaminKGiven: e.target.checked })}
                            className="form-check-input"
                          />
                          Vitamin K1 Dose (1 mg IM)
                        </label>
                        <label className="form-check-label text-xs font-bold text-slate-800 d-flex align-items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={deliveryForm.bcgVaccineGiven}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, bcgVaccineGiven: e.target.checked })}
                            className="form-check-input"
                          />
                          BCG &amp; OPV-0 Vaccine
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label text-xs font-semibold text-slate-700 mb-1">Delivery Notes</label>
                      <textarea
                        rows={2}
                        value={deliveryForm.deliveryNotes}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryNotes: e.target.value })}
                        className="form-control bg-white border-slate-300 text-slate-900 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm rounded-3 px-3"
                    onClick={() => setShowDeliveryModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-sm rounded-3 px-4 font-bold"
                  >
                    Save Delivery Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QR CODE SCANNER MODAL */}
      {showQrModal && (
        <div className="modal d-block bg-black/80 backdrop-blur-sm" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-white text-slate-900 border-0 rounded-4 shadow-2xl">
              <div className="modal-header border-bottom">
                <h5 className="modal-title h6 font-bold d-flex align-items-center gap-2">
                  <i className="bi bi-qr-code-scan text-success" />
                  Scan Mother Smart QR Card
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowQrModal(false)}
                />
              </div>
              <div className="modal-body text-center py-4 space-y-3">
                <div className="w-24 h-24 mx-auto rounded-3 bg-slate-50 border-2 border-dashed border-emerald-500 d-flex align-items-center justify-center text-success fs-1">
                  <i className="bi bi-qr-code" />
                </div>
                <p className="text-xs text-slate-600 max-w-xs mx-auto mb-0">
                  Select a registered test mother QR code to fetch ASHA registration data immediately.
                </p>

                <div className="d-grid gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectQrMother('JAN-KA-HVR-2026-000001')}
                    className="btn btn-outline-success text-start p-3 rounded-3 d-flex align-items-center justify-content-between"
                  >
                    <div>
                      <strong className="d-block text-slate-900 text-xs">Lakshmi Devi (G2)</strong>
                      <span className="font-mono text-emerald-700 text-[11px]">JAN-KA-HVR-2026-000001</span>
                    </div>
                    <span className="badge bg-emerald-100 text-emerald-800">Scan QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectQrMother('JAN-KA-HVR-000001')}
                    className="btn btn-outline-dark text-start p-3 rounded-3 d-flex align-items-center justify-content-between"
                  >
                    <div>
                      <strong className="d-block text-slate-900 text-xs">Sunita Devi (G1 Primi)</strong>
                      <span className="font-mono text-slate-600 text-[11px]">JAN-KA-HVR-000001</span>
                    </div>
                    <span className="badge bg-slate-200 text-slate-800">Scan QR</span>
                  </button>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-3 px-3"
                  onClick={() => setShowQrModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhcDoctorModulePage;
