import React, { useState, useEffect } from 'react';
import { Ambulance, MapPin, Phone, Building2, Clock, ShieldCheck, Heart, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { referralService } from '../services/referralService';

export const FamilyTrackingPage: React.FC = () => {
  const { code = 'REF-HAV-8849' } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortal = async () => {
      try {
        const res = await referralService.getFamilyPortal(code);
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching family portal:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortal();
    const timer = setInterval(fetchPortal, 5000);
    return () => clearInterval(timer);
  }, [code]);

  if (loading || !data?.referral) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        ಜನನಿ360 ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...
      </div>
    );
  }

  const referral = data.referral;
  const mother = referral.mother;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center font-black text-slate-950 text-xl shadow-xl shadow-emerald-500/20">
          J
        </div>
        <h1 className="text-xl font-bold text-slate-100">JANANI360 Live Referral Tracking</h1>
        <p className="text-xs text-emerald-400 font-medium">ಕರ್ನಾಟಕ ತುರ್ತು 108 ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್</p>
      </div>

      {/* Kannada SMS Preview Box */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 text-xs text-emerald-200 leading-relaxed shadow-xl">
        <span className="font-bold text-emerald-400 block mb-1">💬 SMS Notification (ಕುಟುಂಬದ ಸಂದೇಶ):</span>
        {data.kannadaSmsPreview}
      </div>

      {/* Main Referral Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">{mother?.fullName}</h2>
            <span className="text-xs text-slate-400">Husband: {mother?.husbandName}</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {referral.status}
          </span>
        </div>

        {/* ETA Counter */}
        <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-bold block">Estimated Arrival at Hospital</span>
          <div className="text-4xl font-black text-amber-400 font-mono flex items-center justify-center gap-2">
            <Clock className="w-8 h-8 text-amber-400 animate-spin" />
            ~{referral.etaMinutes || 18} Mins
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Destination Hospital:</span>
            </div>
            <strong className="text-slate-100 font-bold">{referral.destinationFacility?.nameEn}</strong>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Reserved HDU Bed:</span>
            </div>
            <strong className="text-emerald-400 font-bold">{referral.reservedBed?.bedNumber || 'HDU-04'}</strong>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-emerald-400" />
              <span>108 Ambulance Vehicle:</span>
            </div>
            <strong className="text-slate-100 font-mono font-bold">{referral.ambulanceUnit?.vehicleNumber || 'KA-27-F-1080'}</strong>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Driver Ramesh:</span>
            </div>
            <a href={`tel:${referral.ambulanceUnit?.driverPhone || '+919845088108'}`} className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {referral.ambulanceUnit?.driverPhone || '+919845088108'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
