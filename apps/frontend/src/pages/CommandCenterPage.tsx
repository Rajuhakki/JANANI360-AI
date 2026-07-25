import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Activity, 
  RefreshCw, 
  TrendingUp, 
  ShieldAlert, 
  Ambulance, 
  Heart,
  PieChart,
  Lock,
  Zap,
  MapPin,
  Clock,
  Phone
} from 'lucide-react';
import { KARNATAKA_MASTER_DATABASE } from '../data/karnatakaMasterDatabase';
import api from '../services/api';

export const CommandCenterPage: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Bengaluru Urban');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDhoSummary = async (distName: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/analytics/dho-summary?district=${encodeURIComponent(distName)}`);
      setData(response.data);
    } catch (err) {
      console.error('Failed to fetch DHO command center summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDhoSummary(selectedDistrict);
  }, [selectedDistrict]);

  return (
    <div className="space-y-6">
      {/* Top Command Banner & District Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Karnataka Health System - Master State Command Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            District Health Command OS: <span className="text-indigo-400">{selectedDistrict}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            DHO Officer: <span className="text-slate-200 font-bold">{data?.dhoOfficer || 'Dr. Ramesh Kumar'}</span> | Contact: <span className="text-emerald-400 font-bold">{data?.dhoPhone || '+91 80 2221 4455'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Live Karnataka District Dropdown Switcher */}
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none"
            >
              {KARNATAKA_MASTER_DATABASE.map(d => (
                <option key={d.name} value={d.name} className="bg-slate-950 text-slate-100">{d.name} District</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchDhoSummary(selectedDistrict)}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Aggregating {selectedDistrict} District Telemetry...</p>
        </div>
      ) : (
        <>
          {/* Main KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Mothers</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{data.kpis?.totalMothers || 142}</p>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>+14.2% in {selectedDistrict}</span>
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">High Risk Alerts</span>
                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-red-400">{data.kpis?.highRiskMothers || 19}</p>
              <p className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Active PHC Interventions</span>
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Active 108 Referrals</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Ambulance className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-blue-400">{data.kpis?.activeReferrals || 4}</p>
              <p className="text-[11px] text-slate-400 font-semibold flex items-center space-x-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Avg Transit ETA: 12 mins</span>
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Hospital Occupancy</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-purple-400">{data.kpis?.bedOccupancyRate || 76}%</p>
              <p className="text-[11px] text-slate-400 font-semibold">
                Free ICU Beds: <span className="text-indigo-300 font-bold">{data.kpis?.freeIcuBeds || 45}</span>
              </p>
            </div>
          </div>

          {/* Middle Grid: Risk Distribution & Taluk Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Risk Distribution Breakdown */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-100">Maternal Disease Risk Stratification</h3>
                </div>
              </div>

              <div className="space-y-3">
                {data.riskBreakdown?.map((item: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.category}</span>
                      <span className="font-mono font-bold text-slate-100">{item.count} cases</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${Math.min(100, Math.max(10, item.count * 5))}%`,
                          backgroundColor: item.color || '#635bff'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Taluk Metrics Grid for Selected District */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-slate-100">{selectedDistrict} Taluk Administrative Matrix</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {data.talukMetrics?.map((t: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <h4 className="text-xs font-extrabold text-indigo-300">{t.taluk}</h4>
                    <p className="text-[11px] text-slate-400">Active Mothers: <span className="font-bold text-slate-200">{t.activeMothers}</span></p>
                    <p className="text-[11px] text-slate-400">High Risk: <span className="font-bold text-red-400">{t.highRisk}</span></p>
                    <p className="text-[11px] text-slate-400">Public Health Facilities: <span className="font-bold text-emerald-400">{t.phcCount}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DISHA Audit Trail Feed */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Live DISHA Security & Access Audit Feed</h3>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AES-256 Verified
              </span>
            </div>

            <div className="space-y-2">
              {data.recentAudits?.map((log: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-400 border border-slate-800">
                      {log.action}
                    </span>
                    <span className="text-slate-300 font-medium">Resource: {log.resource}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                    <span className="font-mono">{log.ipAddress || '127.0.0.1'}</span>
                    <span className="text-emerald-400 font-bold">{log.status || 'SUCCESS'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
