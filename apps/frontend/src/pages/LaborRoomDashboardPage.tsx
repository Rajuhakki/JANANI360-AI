import React, { useState, useEffect, useMemo } from 'react';
import { Baby, Activity, Heart, CheckCircle2, AlertTriangle, ShieldAlert, Plus, RefreshCw, X, FileText, Search, UserCheck, Phone, MapPin } from 'lucide-react';
import { laborService } from '../services/laborService';
import { Navbar } from '../components/Navbar';
import { WhoPartographChart } from '../components/WhoPartographChart';

export const LaborRoomDashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedLaborCaseId, setSelectedLaborCaseId] = useState<string | null>(null);

  // Search & Filter State for Labor Ward Search Engine
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [deliveryForm, setDeliveryForm] = useState({
    deliveryMode: 'NORMAL_VAGINAL' as const,
    deliveryIndication: 'Spontaneous Normal Vaginal Delivery',
    estimatedBloodLossMl: 220,
    gender: 'FEMALE' as const,
    birthWeightKg: 2.95,
    apgarScore1Min: 8,
    apgarScore5Min: 9,
    bcgVaccineGiven: true,
    opv0Given: true,
    hepB0Given: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await laborService.getLaborDashboard('fac-dh-hav');
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Error loading labor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const timer = setInterval(fetchDashboard, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDeliverySubmit = async () => {
    if (!selectedLaborCaseId) return;
    setSubmitting(true);
    try {
      const res = await laborService.recordDelivery({
        laborCaseId: selectedLaborCaseId,
        deliveryMode: deliveryForm.deliveryMode,
        deliveryIndication: deliveryForm.deliveryIndication,
        estimatedBloodLossMl: deliveryForm.estimatedBloodLossMl,
        child: {
          gender: deliveryForm.gender,
          birthWeightKg: deliveryForm.birthWeightKg,
          apgarScore1Min: deliveryForm.apgarScore1Min,
          apgarScore5Min: deliveryForm.apgarScore5Min,
          bcgVaccineGiven: deliveryForm.bcgVaccineGiven,
          opv0Given: deliveryForm.opv0Given,
          hepB0Given: deliveryForm.hepB0Given
        }
      });

      if (res.success) {
        setShowDeliveryModal(false);
        fetchDashboard();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to log delivery');
    } finally {
      setSubmitting(false);
    }
  };

  // Search Engine Filtering Logic
  const allCases = dashboardData?.activeLaborCases || [];

  const filteredCases = useMemo(() => {
    return allCases.filter((lc: any) => {
      const q = searchQuery.toLowerCase().trim();

      // Search match against Mother ID, Mother Name, ASHA Name, ASHA ID, Village, or Room Number
      const motherName = lc.mother?.fullName?.toLowerCase() || '';
      const motherId = lc.mother?.rchId?.toLowerCase() || '';
      const ashaName = lc.mother?.registeredByUser?.name?.toLowerCase() || 'vimala (asha worker)';
      const ashaId = (lc.mother?.registeredByUser?.staffId || lc.mother?.registeredByUser?.id || 'asha-hvr-104').toLowerCase();
      const village = lc.mother?.village?.nameEn?.toLowerCase() || 'varthur';
      const room = (lc.laborRoomNumber || '').toLowerCase();

      const matchesSearch =
        !q ||
        motherName.includes(q) ||
        motherId.includes(q) ||
        ashaName.includes(q) ||
        ashaId.includes(q) ||
        village.includes(q) ||
        room.includes(q);

      const matchesStatus = statusFilter === 'ALL' || lc.laborStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allCases, searchQuery, statusFilter]);

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
        Loading Digital Labor Room Control Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10 shrink-0">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-100 tracking-tight">
                Haveri District Hospital Digital Labor Room Dashboard
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                ಹಾವೇರಿ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ ಹೆರಿಗೆ ಕೊಠಡಿ ನಿಯಂತ್ರಣ ಘಟಕ (Labor Ward Operations)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase flex items-center gap-1.5 font-mono">
              Active Cases: {dashboardData.activeLaborCasesCount || 0}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* LABOR WARD SEARCH ENGINE BAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-emerald-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Mother ID (Example: JAN-KA-HVR-000001), Mother Name, ASHA Worker Name / ID, or Village..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-11 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  statusFilter === 'ALL'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({allCases.length})
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE_LABOR')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  statusFilter === 'ACTIVE_LABOR'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Active Labor
              </button>
              <button
                onClick={() => setStatusFilter('DELIVERY_IN_PROGRESS')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  statusFilter === 'DELIVERY_IN_PROGRESS'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setStatusFilter('POSTPARTUM_OBSERVATION')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  statusFilter === 'POSTPARTUM_OBSERVATION'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Postpartum
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Labor Cases Column */}
          <div className="lg:col-span-8 space-y-6">
            {filteredCases.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 text-xs space-y-2">
                <Search className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="font-bold text-slate-400">No matching labor ward cases found.</p>
                <p className="text-[11px]">Try clearing search or status filters.</p>
              </div>
            ) : (
              filteredCases.map((lc: any) => {
                const child = lc.deliveryRecord?.childProfiles?.[0];
                const ashaName = lc.mother?.registeredByUser?.name || 'Vimala (ASHA Worker)';
                const ashaId = lc.mother?.registeredByUser?.staffId || lc.mother?.registeredByUser?.id || 'ASHA-HVR-104';
                const ashaPhone = lc.mother?.registeredByUser?.phone || '+91 98765 43210';
                const villageName = lc.mother?.village?.nameEn || 'Varthur Village';

                return (
                  <div
                    key={lc.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5"
                  >
                    {/* Header: Mother & ASHA Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base font-bold text-slate-100">{lc.mother?.fullName}</h2>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                            Room: {lc.laborRoomNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                          <span>Mother ID: <strong className="text-emerald-400">{lc.mother?.rchId}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {villageName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between">
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase font-mono">
                          {lc.laborStatus}
                        </span>

                        {lc.laborStatus !== 'POSTPARTUM_OBSERVATION' && (
                          <button
                            onClick={() => {
                              setSelectedLaborCaseId(lc.id);
                              setShowDeliveryModal(true);
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 shrink-0"
                          >
                            <Baby className="w-4 h-4" /> Log Delivery
                          </button>
                        )}
                      </div>
                    </div>

                    {/* PROMINENT ASHA WORKER BADGE */}
                    <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned ASHA Worker</span>
                          <span className="font-bold text-white text-xs">{ashaName}</span>
                          <span className="text-slate-400 text-[11px] font-mono ml-2">(ID: {ashaId})</span>
                        </div>
                      </div>

                      <a
                        href={`tel:${ashaPhone}`}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 rounded-xl text-[11px] font-mono font-semibold transition flex items-center gap-1.5 self-end sm:self-auto"
                      >
                        <Phone className="w-3 h-3" />
                        {ashaPhone}
                      </a>
                    </div>

                    {/* WHO Partograph Chart */}
                    <WhoPartographChart observations={lc.partographEntries || []} />

                    {/* Delivered Newborn Details */}
                    {child && (
                      <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <Baby className="w-4 h-4 text-emerald-400" />
                            {child.fullName} (Gender: {child.gender})
                          </span>
                          <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded">
                            Child RCH: {child.childRchId}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono">
                          <span>Weight: <strong>{child.birthWeightKg} kg</strong></span>
                          <span>•</span>
                          <span>APGAR: <strong>{child.apgarScore1Min}/{child.apgarScore5Min}</strong></span>
                          <span>•</span>
                          <span>Vaccines: <strong>BCG ✓ | OPV-0 ✓ | HepB-0 ✓</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Info & Guidelines Side Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                Karnataka Labor Ward Guidelines
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>WHO Partograph activation mandatory when cervical dilation &ge; 4cm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>Administer AMTSL Oxytocin 10 IU within 1 min of delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>Administer birth doses (BCG, OPV-0, HepB-0) &amp; Vitamin K before discharge.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Log Delivery Modal */}
        {showDeliveryModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
              <button onClick={() => setShowDeliveryModal(false)} className="absolute top-5 right-5 text-slate-400">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Baby className="w-5 h-5 text-emerald-400" /> Log Delivery &amp; Create Child RCH ID
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Delivery Mode</label>
                  <select
                    value={deliveryForm.deliveryMode}
                    onChange={(e: any) => setDeliveryForm({ ...deliveryForm, deliveryMode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                  >
                    <option value="NORMAL_VAGINAL">Normal Vaginal Delivery</option>
                    <option value="LSCS_EMERGENCY">Emergency LSCS</option>
                    <option value="ASSISTED_VACUUM">Assisted Vacuum Delivery</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Newborn Gender</label>
                    <select
                      value={deliveryForm.gender}
                      onChange={(e: any) => setDeliveryForm({ ...deliveryForm, gender: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    >
                      <option value="FEMALE">Female (Baby Girl)</option>
                      <option value="MALE">Male (Baby Boy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Birth Weight (kg)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={deliveryForm.birthWeightKg}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, birthWeightKg: parseFloat(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-emerald-300">
                  ⚡ Auto-generates Child RCH ID (129004812749-C1) &amp; schedules 6 HBNC visits for ASHA worker.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDeliveryModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  onClick={handleDeliverySubmit}
                  className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  {submitting ? 'Logging...' : 'Confirm Delivery'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
