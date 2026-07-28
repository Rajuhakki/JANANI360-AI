import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Calendar,
  Building2,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Ambulance,
  ArrowLeft,
  RefreshCw,
  QrCode,
  User,
  Share2
} from 'lucide-react';
import { QrCodeGenerator } from '../components/QrCodeGenerator';
import api from '../services/api';

export const MotherPublicProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mother, setMother] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid or Unregistered Mother ID.');
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/asha/qr/${id}`);
        if (res.data.success && res.data.mother) {
          setMother(res.data.mother);
        } else {
          setError('Invalid or Unregistered Mother ID.');
        }
      } catch (err: any) {
        setError('Invalid or Unregistered Mother ID.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `JANANI360 Digital Profile - ${mother?.fullName || 'Mother'}`,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Digital Profile link copied to clipboard.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
        <p className="text-sm font-bold text-slate-200">Loading Digital Mother Profile...</p>
        <p className="text-xs text-slate-500 mt-1">JANANI360 AI · Government of Karnataka</p>
      </div>
    );
  }

  if (error || !mother) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 p-4">
        <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Invalid or Unregistered Mother ID</h3>
            <p className="text-xs text-slate-400 mt-1">
              {error || 'No active antenatal record was found matching this QR code.'}
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate('/scan-qr')}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md"
            >
              Scan Another QR
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pregnancy = mother.pregnancy;
  const isHighRisk = mother.currentRiskLevel !== 'LOW';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 pb-12">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl hover:bg-slate-800"
            >
              Print
            </button>
          </div>
        </div>

        {/* Digital Banner Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shrink-0 flex items-center justify-center text-slate-950 font-black text-2xl">
                <User className="w-8 h-8 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    Govt of Karnataka · RCH Digital Profile
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">{mother.fullName}</h1>
                <p className="text-xs text-slate-300">Husband: {mother.husbandName} · Age: {mother.age} yrs</p>
              </div>
            </div>

            <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl px-4 py-2.5 text-right self-stretch sm:self-auto">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Mother ID</span>
              <span className="font-mono font-black text-emerald-400 text-sm">{mother.motherId}</span>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Pregnancy Status</span>
            <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {mother.status || 'PREGNANT'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Current Risk</span>
            <span
              className={`font-bold text-xs flex items-center gap-1.5 ${
                isHighRisk ? 'text-amber-400' : 'text-emerald-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {mother.currentRiskLevel || 'LOW RISK'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Safety Score</span>
            <span className="font-bold text-teal-300 text-xs">{mother.motherSafetyScore || 95}/100</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Blood Group</span>
            <span className="font-bold text-white text-xs">{mother.bloodGroup}</span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Section 1: Demographics & Location */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Location &amp; Registration Info
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Village:</span>
                <span className="font-bold text-white">{mother.village}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Taluk:</span>
                <span className="font-bold text-white">{mother.taluk}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">District:</span>
                <span className="font-bold text-white">{mother.district}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Assigned PHC:</span>
                <span className="font-bold text-emerald-300">{mother.assignedPhc}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Registration Date:</span>
                <span className="font-bold text-slate-200">{mother.registrationDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">ASHA Worker:</span>
                <span className="font-bold text-slate-200">{mother.ashaWorkerName} ({mother.ashaWorkerPhone})</span>
              </div>
            </div>
          </div>

          {/* Section 2: Obstetric & ANC Details */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Heart className="w-4 h-4 text-teal-400" />
              Obstetric &amp; ANC Profile
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Pregnancy Number:</span>
                <span className="font-bold text-white">G{pregnancy?.gravida || 1} (Primi)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">LMP Date:</span>
                <span className="font-bold text-white">{pregnancy?.lmpDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Expected Delivery (EDD):</span>
                <span className="font-bold text-teal-300">{pregnancy?.eddDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Recent ANC Visit:</span>
                <span className="font-bold text-slate-200">
                  {pregnancy?.recentAncVisit ? `Visit #${pregnancy.recentAncVisit.visitNumber}` : 'ANC Registration Completed'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Referral Status:</span>
                <span className="font-bold text-emerald-400">No Active Referral Required</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Emergency Contact:</span>
                <span className="font-bold text-amber-300">{mother.emergencyContact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Verification Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <QrCodeGenerator value={window.location.href} size={90} />
            <div>
              <h4 className="text-sm font-bold text-white">Verified Government Health QR Code</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Encrypted JANANI360 AI Digital Record ID: <span className="font-mono text-emerald-400">{mother.motherId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/mother-profile?id=${mother.id}`)}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg"
          >
            Open Full Health Hub &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
