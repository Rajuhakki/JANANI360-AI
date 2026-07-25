import React from 'react';
import { Building2, MapPin, Phone, Activity, Heart, ShieldCheck, Edit3 } from 'lucide-react';

export interface HospitalData {
  _id: string;
  name: string;
  facilityCode: string;
  type: 'PHC' | 'CHC' | 'SDH' | 'DISTRICT_HOSPITAL' | 'TERTIARY_MEDICAL_COLLEGE';
  district: string;
  taluk: string;
  totalBeds: number;
  availableIcuBeds: number;
  availableMaternityBeds: number;
  bloodBankAvailable: boolean;
  ventilatorsAvailable: number;
  geoCoordinates: { latitude: number; longitude: number };
  contactPhone: string;
  emergencyHelpline: string;
}

interface HospitalCardProps {
  hospital: HospitalData;
  userRole?: string;
  onUpdateCapacity: (hospital: HospitalData) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, userRole, onUpdateCapacity }) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'TERTIARY_MEDICAL_COLLEGE':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'DISTRICT_HOSPITAL':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'CHC':
      case 'SDH':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_OFFICER' || userRole === 'DOCTOR';

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between space-y-4">
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeBadge(hospital.type)}`}>
                {hospital.type.replace('_', ' ')}
              </span>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{hospital.facilityCode}</p>
            </div>
          </div>

          {canEdit && (
            <button
              onClick={() => onUpdateCapacity(hospital)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 border border-slate-800 transition"
              title="Update Live Capacity"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-100 line-clamp-1">{hospital.name}</h3>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{hospital.taluk}, {hospital.district}</span>
        </div>
      </div>

      {/* Live Capacity Grid */}
      <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-slate-950/60 border border-slate-900 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Maternity</span>
          <p className="text-sm font-extrabold text-emerald-400 mt-0.5">{hospital.availableMaternityBeds} / {hospital.totalBeds}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">ICU Beds</span>
          <p className={`text-sm font-extrabold mt-0.5 ${hospital.availableIcuBeds > 0 ? 'text-indigo-400' : 'text-red-400'}`}>
            {hospital.availableIcuBeds}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Ventilators</span>
          <p className="text-sm font-extrabold text-blue-400 mt-0.5">{hospital.ventilatorsAvailable || 0}</p>
        </div>
      </div>

      {/* Footer Indicators */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 text-slate-400">
        <div className="flex items-center space-x-1">
          <Phone className="w-3 h-3 text-slate-500" />
          <span className="text-[11px] font-mono">{hospital.contactPhone}</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${hospital.bloodBankAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
          <span className="text-[11px] text-slate-300 font-medium">
            {hospital.bloodBankAvailable ? 'Blood Bank Active' : 'No Blood Bank'}
          </span>
        </div>
      </div>
    </div>
  );
};
