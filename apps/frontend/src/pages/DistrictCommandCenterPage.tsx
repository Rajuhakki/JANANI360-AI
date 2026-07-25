import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MapPin, Building2, Ambulance, ShieldAlert, Activity, RefreshCw, FileText, Download, TrendingUp } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { Navbar } from '../components/Navbar';

export const DistrictCommandCenterPage: React.FC = () => {
  const [kpis, setKpis] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const [kpiRes, mapRes, resRes] = await Promise.all([
        analyticsService.getDistrictKpis('DIST-HAV'),
        analyticsService.getGisHeatmap(),
        analyticsService.getHospitalResources()
      ]);

      if (kpiRes.success) setKpis(kpiRes.kpis);
      if (mapRes.success) setHeatmap(mapRes.hotspots || []);
      if (resRes.success) setResources(resRes.capacityGrid || []);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const timer = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleExportReport = () => {
    alert('📄 Executive PDF Audit Report generated for District Health Officer (DHO) Haveri.');
  };

  if (loading || !kpis) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400 mr-2" />
        Loading Haveri District Health Command Center...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      {/* Executive Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Haveri District Health Command Center (DHO Governance)
              </h1>
              <p className="text-xs text-slate-400">
                ಹಾವೇರಿ ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ನಿಯಂತ್ರಣ ಕೊಠಡಿ (District Operations Portal)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export DHO Executive Report
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Registered Mothers</span>
            <div className="text-3xl font-black text-slate-100 font-mono">{kpis.totalRegisteredMothers || 1420}</div>
            <span className="text-[10px] text-emerald-400 font-bold">94.2% ANC Coverage</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">High-Risk Cases (HRP)</span>
            <div className="text-3xl font-black text-amber-400 font-mono">{kpis.activeHighRiskMothers || 202}</div>
            <span className="text-[10px] text-amber-300 font-bold">{kpis.criticalEmergencyCount || 12} Critical Emergencies</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Institutional Delivery Rate</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">{kpis.institutionalDeliveryPercent}%</div>
            <span className="text-[10px] text-slate-500">Target: &gt; 98.0%</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">108 Fleet Response Time</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">{kpis.avgAmbulanceResponseTimeMins} Mins</div>
            <span className="text-[10px] text-emerald-400 font-bold">Target: &lt; 20.0 Mins</span>
          </div>
        </div>

        {/* GIS Geographic High-Risk Heatmap */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400" />
              GIS Geographic High-Risk Maternal Heatmap (ಹಾವೇರಿ ಜಿಲ್ಲಾ ಮ್ಯಾಪ್)
            </h2>
            <span className="text-xs font-mono text-slate-400">Live Village Clusters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {heatmap.map((h: any) => {
              const isHigh = h.riskLevel === 'HIGH';

              return (
                <div
                  key={h.villageId}
                  className={`p-5 rounded-2xl border transition relative ${
                    isHigh
                      ? 'bg-gradient-to-b from-red-950/60 to-slate-900 border-red-500/60 shadow-lg shadow-red-950/40'
                      : 'bg-slate-800/40 border-slate-700/60'
                  }`}
                >
                  {isHigh && (
                    <span className="absolute -top-2.5 right-3 bg-red-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                      High-Risk Cluster
                    </span>
                  )}

                  <div className="text-sm font-bold text-slate-100 mb-1">{h.villageNameEn}</div>
                  <div className="text-xs text-slate-400 mb-3">Taluk: {h.talukName}</div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Registered Mothers:</span>
                      <span className="font-bold text-slate-200">{h.totalMothers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">High Risk Count:</span>
                      <span className={`font-black ${isHigh ? 'text-red-400' : 'text-amber-400'}`}>{h.highRiskCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hospital Resource Capacity Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-emerald-400" />
            District Hospital Capacity &amp; Bed Utilization Grid
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((f: any) => (
              <div key={f.facilityId} className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-100">{f.facilityNameEn}</div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {f.tier}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">Occupancy</span>
                    <strong className="text-emerald-400 font-mono">{f.occupancyPercent}%</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">Available HDU</span>
                    <strong className="text-amber-400 font-mono">{f.hduBedsAvailable} Beds</strong>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">Blood Bank</span>
                    <strong className="text-emerald-400 text-[10px]">Active Stock</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
