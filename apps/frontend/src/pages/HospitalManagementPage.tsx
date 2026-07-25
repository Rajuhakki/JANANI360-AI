import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Activity, 
  RefreshCw, 
  MapPin, 
  ShieldCheck,
  BedDouble,
  Heart
} from 'lucide-react';
import { HospitalCard, HospitalData } from '../components/HospitalCard';
import { UpdateCapacityModal } from '../components/UpdateCapacityModal';
import { RootState } from '../store';
import api from '../services/api';

export const HospitalManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedHospitalForUpdate, setSelectedHospitalForUpdate] = useState<HospitalData | null>(null);

  const fetchHospitals = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/hospitals');
      setHospitals(response.data.hospitals || []);
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.facilityCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.taluk.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || h.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalMaternityBeds = hospitals.reduce((acc, h) => acc + (h.availableMaternityBeds || 0), 0);
  const totalIcuBeds = hospitals.reduce((acc, h) => acc + (h.availableIcuBeds || 0), 0);
  const activeBloodBanks = hospitals.filter(h => h.bloodBankAvailable).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Karnataka Facility Directory & GIS Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Hospital & Facility Operating System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time capacity tracking across Karnataka PHCs, CHCs, District Hospitals & Medical Colleges.
          </p>
        </div>

        <button
          onClick={fetchHospitals}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Matrix</span>
        </button>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Onboarded Facilities</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{hospitals.length}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Maternity Beds Free</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{totalMaternityBeds}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">ICU Beds Available</span>
            <p className="text-xl font-extrabold text-blue-400 mt-0.5">{totalIcuBeds}</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Blood Banks Active</span>
            <p className="text-xl font-extrabold text-rose-400 mt-0.5">{activeBloodBanks}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facility name, code, or taluk..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto custom-scrollbar pb-1 md:pb-0">
          {['ALL', 'PHC', 'CHC', 'DISTRICT_HOSPITAL', 'TERTIARY_MEDICAL_COLLEGE'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition whitespace-nowrap ${
                selectedType === t
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Tiers' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Cards Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Loading Karnataka GIS Hospital Network...</p>
        </div>
      ) : filteredHospitals.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Hospitals Found</h3>
          <p className="text-xs text-slate-400">No hospital facilities matching your current filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital._id}
              hospital={hospital}
              userRole={user?.role}
              onUpdateCapacity={(h) => setSelectedHospitalForUpdate(h)}
            />
          ))}
        </div>
      )}

      {/* Update Capacity Modal */}
      <UpdateCapacityModal
        hospital={selectedHospitalForUpdate}
        onClose={() => setSelectedHospitalForUpdate(null)}
        onSuccess={fetchHospitals}
      />
    </div>
  );
};
