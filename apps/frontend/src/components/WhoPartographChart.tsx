import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, TrendingUp } from 'lucide-react';

interface PartographPoint {
  cervicalDilationCm: number;
  fetalHeartRateBpm: number;
  contractionsPer10Min: number;
  observationDateTime: string;
}

interface Props {
  observations: PartographPoint[];
  language?: 'kn' | 'en';
}

export const WhoPartographChart: React.FC<Props> = ({ observations, language = 'kn' }) => {
  const { t } = useTranslation();
  if (!observations || observations.length === 0) return null;

  const sortedObs = [...observations].reverse();
  const latest = sortedObs[sortedObs.length - 1];
  const isAlert = latest?.cervicalDilationCm < 4 && sortedObs.length > 3;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            {language === 'kn' ? 'ಡಿಸಿಟಲ್ WHO ಪಾರ್ಟೋಗ್ರಾಫ್' : 'Digital WHO Partograph Progress'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {language === 'kn' ? 'ಗರ್ಭಕಂಠದ ಹಿಗ್ಗುವಿಕೆ ಮತ್ತು ಗರ್ಭಸ್ಥ ಶಿಶುವಿನ ದರ' : 'Cervical dilation (1-10cm) & Fetal Heart Rate tracking'}
          </p>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
          Current Dilation: {latest?.cervicalDilationCm || 4} cm
        </span>
      </div>

      {/* SVG Dilation Curve Plot */}
      <div className="h-36 w-full relative flex items-end justify-between px-6 pt-6 pb-2 bg-slate-950/80 rounded-xl border border-slate-800">
        {/* Alert & Action Lines */}
        <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-amber-500/40 z-0">
          <span className="text-[9px] font-mono text-amber-400 absolute right-2 -top-4">
            WHO Alert Line (4cm)
          </span>
        </div>
        <div className="absolute left-0 right-0 top-1/6 border-t border-dashed border-red-500/40 z-0">
          <span className="text-[9px] font-mono text-red-400 absolute right-2 -top-4">
            WHO Action Line (8cm)
          </span>
        </div>

        {sortedObs.map((obs, idx) => {
          const heightPercent = Math.min(100, Math.max(10, (obs.cervicalDilationCm / 10) * 100));

          return (
            <div key={idx} className="flex flex-col items-center gap-2 z-10">
              <span className="text-[10px] font-bold text-emerald-400">
                {obs.cervicalDilationCm}cm
              </span>
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-6 rounded-t-lg bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-all duration-500"
              />
              <span className="text-[9px] font-mono text-slate-400">
                {obs.fetalHeartRateBpm} BPM
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
