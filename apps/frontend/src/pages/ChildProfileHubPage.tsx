import React, { useState, useEffect } from 'react';
import { Baby, Syringe, Activity, ShieldCheck, Heart, User, Calendar, Plus, RefreshCw, X, CheckCircle2, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { childService } from '../services/childService';
import { Navbar } from '../components/Navbar';

export const ChildProfileHubPage: React.FC = () => {
  const { id = '129004812749-C1' } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);
  const [batchNumber, setBatchNumber] = useState('VAC-2026-99');
  const [submitting, setSubmitting] = useState(false);

  const fetchChild = async () => {
    try {
      const res = await childService.getChildProfileHub(id);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Error loading child profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChild();
  }, [id]);

  const handleAdministerVaccine = async () => {
    if (!selectedVaccine) return;
    setSubmitting(true);
    try {
      const res = await childService.recordVaccineAdministration({
        immunizationRecordId: selectedVaccine.id,
        batchNumber
      });
      if (res.success) {
        setShowVaccineModal(false);
        fetchChild();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Vaccine administration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !data?.child) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
        Loading Child Health & Immunization Profile Hub...
      </div>
    );
  }

  const child = data.child;
  const mother = child.mother;
  const immunizations = child.immunizationRecords || [];
  const growths = child.growthRecords || [];
  const latestGrowth = growths[growths.length - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {child.fullName}
              </h1>
              <p className="text-xs text-slate-400">
                Mother: <strong className="text-slate-200">{mother?.fullName}</strong> (RCH: {mother?.rchId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Child RCH ID: {child.childRchId}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Birth Weight</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{child.birthWeightKg} kg</div>
            <span className="text-[10px] text-slate-500">{child.newbornRiskCategory}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">APGAR Score</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{child.apgarScore1Min} / {child.apgarScore5Min}</div>
            <span className="text-[10px] text-slate-500">1 Min / 5 Min Score</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Immunization Coverage</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{data.immunizationCoveragePercent}%</div>
            <span className="text-[10px] text-slate-500">0-5 Years Schedule</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">WHO Growth Z-Score</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{latestGrowth?.whoWeightForAgeZScore || 0.15}</div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">{latestGrowth?.malnutritionStatus || 'NORMAL'}</span>
          </div>
        </div>

        {/* 0-5 Years National Immunization Schedule Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Syringe className="w-5 h-5 text-emerald-400" />
              Government of India 0–5 Years National Immunization Schedule
            </h2>
            <span className="text-xs font-mono text-slate-400">Coverage: {data.immunizationCoveragePercent}%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {immunizations.map((v: any) => {
              const isGiven = v.status === 'GIVEN';

              return (
                <div
                  key={v.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isGiven
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-100">{v.vaccineName}</div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Code: <span className="text-emerald-400">{v.vaccineCode}</span> | Due: {v.dueAgeWeeks === 0 ? 'Birth' : `${v.dueAgeWeeks} Wks`}
                    </div>
                    {isGiven && (
                      <div className="text-[10px] font-mono text-emerald-400">
                        Batch: {v.batchNumber} (Given ✓)
                      </div>
                    )}
                  </div>

                  <div>
                    {isGiven ? (
                      <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedVaccine(v);
                          setShowVaccineModal(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl shadow transition"
                      >
                        Administer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vaccine Modal */}
        {showVaccineModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
              <button onClick={() => setShowVaccineModal(false)} className="absolute top-5 right-5 text-slate-400">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-400" /> Administer Vaccine: {selectedVaccine?.vaccineCode}
              </h3>

              <div className="text-xs text-slate-300 space-y-3">
                <p>Vaccine: <strong>{selectedVaccine?.vaccineName}</strong></p>

                <div>
                  <label className="text-slate-400 block mb-1">Vaccine Batch Number</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowVaccineModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  onClick={handleAdministerVaccine}
                  className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  {submitting ? 'Recording...' : 'Confirm Vaccine'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
