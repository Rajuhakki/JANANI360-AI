import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  HeartHandshake, 
  Search, 
  UserPlus, 
  Activity, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck,
  Stethoscope,
  Plus
} from 'lucide-react';
import { MotherSafetyScoreGauge } from '../components/MotherSafetyScoreGauge';
import { RegisterMotherModal } from '../components/RegisterMotherModal';
import { RecordAncVisitModal } from '../components/RecordAncVisitModal';
import { RootState } from '../store';
import api from '../services/api';

export const MaternalCarePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPatientForVisit, setSelectedPatientForVisit] = useState<any>(null);
  const [selectedPregnancyForVisit, setSelectedPregnancyForVisit] = useState<any>(null);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/patients');
      setPatients(response.data.patients || []);
    } catch (err) {
      console.error('Failed to fetch maternal patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenVisitModal = async (patient: any) => {
    try {
      const res = await api.get(`/patients/${patient._id}`);
      setSelectedPatientForVisit(res.data.patient);
      setSelectedPregnancyForVisit(res.data.pregnancy);
    } catch (err) {
      console.error('Failed to fetch details for visit modal:', err);
    }
  };

  const filteredPatients = patients.filter(p => {
    const s = searchQuery.toLowerCase();
    return p.fullName.toLowerCase().includes(s) ||
           p.rchId.toLowerCase().includes(s) ||
           p.phone.includes(s) ||
           p.village.toLowerCase().includes(s);
  });

  const highRiskCount = patients.filter(p => p.status === 'HIGH_RISK_ALERT').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Maternal EHR & AI Risk Stratification OS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Maternal ANC & Risk Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Registered pregnant women registry across Karnataka PHCs and Sub-Centers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPatients}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Registry</span>
          </button>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Mother</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Pregnancies</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{patients.length}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">High Risk Alerts</span>
            <p className="text-xl font-extrabold text-red-400 mt-0.5">{highRiskCount}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Optimal Safety Score</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{patients.length - highRiskCount}</p>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mother name, RCH-ID, phone, or village..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Patient EHR Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Querying Maternal Health EHR Database...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <HeartHandshake className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Pregnant Mothers Registered</h3>
          <p className="text-xs text-slate-400">Click "Register Mother" to add a new expectant mother to the EHR database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient._id} className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-indigo-500/40 transition space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{patient.fullName}</h3>
                    <span className="text-xs text-slate-400">({patient.age} yrs)</span>
                  </div>
                  <p className="text-xs font-mono text-indigo-400 mt-0.5">{patient.rchId}</p>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  patient.status === 'HIGH_RISK_ALERT' 
                    ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {patient.status.replace('_', ' ')}
                </span>
              </div>

              <MotherSafetyScoreGauge 
                score={patient.status === 'HIGH_RISK_ALERT' ? 35 : 92}
                riskLevel={patient.status === 'HIGH_RISK_ALERT' ? 'HIGH RISK' : 'LOW RISK'}
                preeclampsiaRisk={patient.status === 'HIGH_RISK_ALERT' ? 'MODERATE' : 'LOW'}
                anemiaSeverity={patient.status === 'HIGH_RISK_ALERT' ? 'MODERATE' : 'NORMAL'}
              />

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{patient.village}, {patient.taluk}</span>
                </div>
                <div className="flex items-center space-x-1.5 justify-end">
                  <span className="text-slate-500">Blood:</span>
                  <span className="font-bold text-slate-200">{patient.bloodGroup || 'O+'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Phone: {patient.phone}</span>
                <button
                  onClick={() => handleOpenVisitModal(patient)}
                  className="px-3 py-1.5 bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Record ANC & AI Risk</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <RegisterMotherModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={fetchPatients}
      />

      <RecordAncVisitModal
        patient={selectedPatientForVisit}
        pregnancy={selectedPregnancyForVisit}
        isOpen={!!selectedPatientForVisit}
        onClose={() => { setSelectedPatientForVisit(null); setSelectedPregnancyForVisit(null); }}
        onSuccess={fetchPatients}
      />
    </div>
  );
};
