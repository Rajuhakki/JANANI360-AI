import React, { useState, useEffect } from 'react';
import { ShieldAlert, Ambulance, Clock, Building2, User, Phone, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { referralService } from '../services/referralService';
import { Navbar } from '../components/Navbar';

export const CasualtyErRadarPage: React.FC = () => {
  const [radarData, setRadarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const fetchRadar = async () => {
    try {
      const res = await referralService.getCasualtyRadar('fac-dh-hav');
      if (res.success) {
        setRadarData(res);
      }
    } catch (err) {
      console.error('Error loading casualty radar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
    const timer = setInterval(fetchRadar, 5000); // 5-second live refresh
    return () => clearInterval(timer);
  }, []);

  const handleAcceptReferral = async (referralId: string) => {
    setActionSubmitting(true);
    try {
      const res = await referralService.acceptReferral({ referralId, action: 'ACCEPT' });
      if (res.success) {
        fetchRadar();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Acceptance failed');
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleHandover = async (referralId: string) => {
    setActionSubmitting(true);
    try {
      const res = await referralService.casualtyHandover(referralId);
      if (res.success) {
        fetchRadar();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Handover failed');
    } finally {
      setActionSubmitting(false);
    }
  };

  if (loading || !radarData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
        Loading Haveri ER Control Radar...
      </div>
    );
  }

  const incoming = radarData.incomingTransfers || [];
  const beds = radarData.bedGrid || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Haveri District Hospital Casualty ER Control Radar
              </h1>
              <p className="text-xs text-slate-400">
                ಹಾವೇರಿ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ ತುರ್ತು ನಿಗಾ ಘಟಕ (Emergency Control Center)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              Live ER Radar Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Incoming Transfers Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-red-400" />
              Incoming 108 Emergency Referrals ({incoming.length} En Route)
            </h2>
            <span className="text-xs text-slate-400 font-mono">Auto-refreshes every 5s</span>
          </div>

          {incoming.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No active incoming 108 emergency transfers currently.
            </div>
          ) : (
            <div className="space-y-4">
              {incoming.map((item: any) => {
                const isAccepted = item.status !== 'CREATED' && item.status !== 'UNDER_REVIEW';

                return (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-red-500/40 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold flex-shrink-0 animate-pulse">
                        <Ambulance className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-100">{item.mother?.fullName}</span>
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Code: {item.referralCode}
                          </span>
                          <span className="text-xs font-mono text-slate-400">RCH: {item.mother?.rchId}</span>
                        </div>

                        <p className="text-xs text-red-300 font-semibold mt-1">
                          Reason: {item.clinicalReason}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                          <span>Origin: <strong className="text-slate-200">{item.originFacility?.nameEn}</strong></span>
                          <span>•</span>
                          <span>108 Vehicle: <strong className="text-emerald-400">{item.ambulanceUnit?.vehicleNumber || 'KA-27-F-1080'}</strong></span>
                          <span>•</span>
                          <span>Driver: <strong className="text-slate-200">{item.ambulanceUnit?.driverName || 'Ramesh'} ({item.ambulanceUnit?.driverPhone || '+919845088108'})</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Arrival (ETA)</div>
                        <div className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1">
                          <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                          {item.etaMinutes || 18} Mins
                        </div>
                        <div className="text-xs font-bold text-emerald-400 mt-1">
                          Bed Assigned: {item.reservedBed?.bedNumber || 'HDU-04'}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!isAccepted ? (
                          <button
                            disabled={actionSubmitting}
                            onClick={() => handleAcceptReferral(item.id)}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition"
                          >
                            Accept & Lock HDU Bed
                          </button>
                        ) : (
                          <button
                            disabled={actionSubmitting}
                            onClick={() => handleHandover(item.id)}
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/30 transition"
                          >
                            Confirm Patient ER Admission
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Hospital Bed Resource Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Haveri ER HDU & ICU Bed Resource Grid
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {beds.map((b: any) => {
              const isRes = b.status === 'RESERVED';
              const isOcc = b.status === 'OCCUPIED';

              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border text-center transition ${
                    isRes
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                      : isOcc
                      ? 'bg-slate-800/60 border-slate-700 text-slate-400'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{b.bedNumber}</div>
                  <div className="text-[10px] font-semibold uppercase mt-1">{b.bedType}</div>
                  <div className="text-[10px] font-black uppercase mt-2">{b.status}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
