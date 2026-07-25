import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Baby, 
  Search, 
  RefreshCw, 
  Syringe, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2,
  Activity,
  Plus
} from 'lucide-react';
import { RootState } from '../store';
import api from '../services/api';

export const PediatricCarePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [growthHistory, setGrowthHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChildren = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/children');
      const list = response.data.children || [];
      setChildren(list);
      if (list.length > 0) {
        fetchChildDetails(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch children registry:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChildDetails = async (id: string) => {
    try {
      const res = await api.get(`/children/${id}`);
      setSelectedChild(res.data.child);
      setVaccinations(res.data.vaccinations || []);
      setGrowthHistory(res.data.growthHistory || []);
    } catch (err) {
      console.error('Failed to fetch child details:', err);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleAdministerVaccine = async (vaccineCode: string) => {
    if (!selectedChild) return;
    try {
      await api.post(`/children/${selectedChild._id}/vaccinations`, { vaccineCode });
      fetchChildDetails(selectedChild._id);
    } catch (err) {
      console.error('Failed to administer vaccine:', err);
    }
  };

  const filteredChildren = children.filter(c => {
    const s = searchQuery.toLowerCase();
    return c.fullName.toLowerCase().includes(s) || c.childRchId.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Baby className="w-3.5 h-3.5" />
            <span>Karnataka Pediatric EHR & WHO Growth OS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Child EHR & Immunization Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            National Immunization Schedule (NIS) tracking & WHO Growth Z-Score monitoring across Karnataka Health Centers.
          </p>
        </div>

        <button
          onClick={fetchChildren}
          className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Registry</span>
        </button>
      </div>

      {/* Main Grid: Children List + Selected Child Vaccine & Growth Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Children List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search child name or RCH-ID..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
            {filteredChildren.map((c) => (
              <button
                key={c._id}
                onClick={() => fetchChildDetails(c._id)}
                className={`w-full p-4 rounded-2xl border text-left transition ${
                  selectedChild?._id === c._id
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                      <Baby className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{c.fullName}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{c.childRchId}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    c.status === 'SAM_ALERT'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Immunization Schedule & WHO Growth Chart */}
        <div className="lg:col-span-8 space-y-6">
          {selectedChild ? (
            <>
              {/* Selected Child Header */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-extrabold text-white">{selectedChild.fullName}</h2>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      {selectedChild.childRchId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Gender: <span className="text-slate-200 font-semibold">{selectedChild.gender}</span> | Birth Weight: <span className="text-emerald-400 font-semibold">{selectedChild.birthWeightKg} kg</span> | Delivery: <span className="text-slate-200 font-semibold">{selectedChild.deliveryType}</span>
                  </p>
                </div>

                <div className="px-4 py-2 bg-slate-900 rounded-2xl border border-slate-800 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Apgar Score</span>
                  <p className="text-base font-extrabold text-indigo-400">{selectedChild.apgarScore || 9} / 10</p>
                </div>
              </div>

              {/* Immunization Schedule Tracker */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Syringe className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-100">National Immunization Schedule (NIS)</h3>
                </div>

                <div className="space-y-3">
                  {vaccinations.map((v) => (
                    <div key={v._id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${v.status === 'ADMINISTERED' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></div>
                        <div>
                          <p className="font-bold text-slate-200">{v.vaccineName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">Code: {v.vaccineCode}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {v.status === 'ADMINISTERED' ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Administered</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAdministerVaccine(v.vaccineCode)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
                          >
                            Mark Administered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <Baby className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">Select a Child Record</h3>
              <p className="text-xs text-slate-400">Click on any child from the left panel to inspect immunization status and WHO growth charts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
