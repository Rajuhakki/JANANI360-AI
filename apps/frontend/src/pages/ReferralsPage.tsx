import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Ambulance, 
  Building2, 
  Activity, 
  RefreshCw, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  BedDouble,
  FileText
} from 'lucide-react';
import { SosDistressButton } from '../components/SosDistressButton';
import { RootState } from '../store';
import api from '../services/api';

export const ReferralsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/referrals');
      setReferrals(response.data.referrals || []);
    } catch (err) {
      console.error('Failed to fetch referral pipeline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/referrals/${id}/status`, { status: newStatus });
      fetchReferrals();
    } catch (err) {
      console.error('Failed to update referral status:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'IN_TRANSIT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse';
      case 'COMPLETED':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const activeTransfers = referrals.filter(r => r.status === 'IN_TRANSIT' || r.status === 'ACCEPTED').length;
  const icuReserved = referrals.filter(r => r.reservedBedType === 'ICU').length;

  return (
    <div className="space-y-6">
      {/* Header & SOS Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            <Ambulance className="w-3.5 h-3.5" />
            <span>Karnataka 108 Emergency Referral Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Maternal Referral Pipeline & 108 Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time bed reservation matrix connecting PHC Sub-Centers with District & Tertiary Medical Colleges.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReferrals}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Logistics</span>
          </button>

          <SosDistressButton onSuccess={fetchReferrals} />
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Ambulance className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Transfers</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{activeTransfers}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">ICU Beds Reserved</span>
            <p className="text-xl font-extrabold text-indigo-400 mt-0.5">{icuReserved}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Completed Transfers</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{referrals.filter(r => r.status === 'COMPLETED').length}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Avg Transit Time</span>
            <p className="text-xl font-extrabold text-red-400 mt-0.5">18 mins</p>
          </div>
        </div>
      </div>

      {/* Referrals Cards List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Querying 108 Emergency Referral Logistics...</p>
        </div>
      ) : referrals.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Ambulance className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Active Emergency Referrals</h3>
          <p className="text-xs text-slate-400">Click "ONE-TOUCH 108 SOS BEACON" or record high-risk ANC visits to initiate transfers.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map((ref) => (
            <div key={ref._id} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-extrabold">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-extrabold text-white">
                        {ref.patientId?.fullName || 'Lakshmi Devi'}
                      </span>
                      <span className="text-xs font-mono text-indigo-400">({ref.patientId?.rchId || 'KA-RCH-2026-98124'})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Ambulance: <span className="font-mono font-bold text-emerald-400">{ref.ambulanceNumber || 'KA-108-AMB-42'}</span></p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${getStatusBadge(ref.status)}`}>
                    {ref.status}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                    Bed: {ref.reservedBedType || 'ICU'}
                  </span>
                </div>
              </div>

              {/* Transfer Route */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 px-4 rounded-xl bg-slate-950/60 border border-slate-900 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Source Facility</span>
                  <p className="font-bold text-slate-200 mt-0.5">{ref.sourceHospitalId?.name || 'Varthur Primary Health Centre (PHC)'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Destination Facility</span>
                  <p className="font-bold text-indigo-300 mt-0.5">{ref.targetHospitalId?.name || 'Victoria Hospital (BMCRI Tertiary Medical College)'}</p>
                </div>
              </div>

              {/* Clinical Summary */}
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-slate-200">Clinical Reason & Vitals Summary:</p>
                <p className="text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                  {ref.referralReason}
                </p>
              </div>

              {/* Status Update Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <div className="text-[11px] text-slate-500">
                  Mother Safety Score: <span className="font-bold text-red-400">{ref.clinicalSummary?.motherSafetyScore || 30} / 100</span>
                </div>

                <div className="flex items-center space-x-2">
                  {ref.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(ref._id, 'IN_TRANSIT')}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-lg transition"
                    >
                      Dispatch & Mark In Transit
                    </button>
                  )}
                  {ref.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => handleUpdateStatus(ref._id, 'COMPLETED')}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg transition"
                    >
                      Confirm Hospital Admission
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
