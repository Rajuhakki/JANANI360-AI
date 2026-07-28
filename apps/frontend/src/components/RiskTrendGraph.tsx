import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface AncPoint {
  visitNumber: number;
  visitDate: string;
  safetyScore: number;
  gestationalAgeWeeks: number;
  systolicBp: number;
  hbLevel: number;
}

interface Props {
  visits: AncPoint[];
  language?: 'kn' | 'en';
}

export const RiskTrendGraph: React.FC<Props> = ({ visits, language = 'kn' }) => {
  const { t } = useTranslation();
  if (!visits || visits.length === 0) return null;

  const latestScore = visits[visits.length - 1]?.safetyScore || 100;
  const isDeteriorating = visits.length > 1 && latestScore < (visits[0]?.safetyScore || 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            {isDeteriorating ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            )}
            {language === 'kn' ? 'ತಾಯಿಯ ಭದ್ರತಾ ಸ್ಕೋರ್ ರೇಖಾಚಿತ್ರ' : 'Longitudinal Safety Score Trend'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {language === 'kn' ? 'ಪ್ರತಿ ANC ಭೇಟಿಯಲ್ಲಿ ಸ್ಕೋರ್ ಬದಲಾವಣೆ' : 'Deterioration tracking across ANC visits'}
          </p>
        </div>

        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
            isDeteriorating
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isDeteriorating ? 'Deterioration Alert' : 'Stable Trend'}
        </span>
      </div>

      {/* SVG Trend Chart */}
      <div className="h-32 w-full relative flex items-end justify-between px-6 pt-6 pb-2 bg-slate-950/60 rounded-xl border border-slate-800">
        {/* Horizontal Threshold Line (Score 40 Critical Floor) */}
        <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-red-500/40 z-0">
          <span className="text-[9px] font-mono text-red-400 absolute right-2 -top-4">
            Critical Floor (Score 40)
          </span>
        </div>

        {visits.map((v, idx) => {
          const heightPercent = Math.max(10, v.safetyScore);
          const isCrit = v.safetyScore < 40;

          return (
            <div key={idx} className="flex flex-col items-center gap-2 z-10">
              <span className={`text-[10px] font-bold ${isCrit ? 'text-red-400' : 'text-emerald-400'}`}>
                {v.safetyScore}
              </span>
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-8 rounded-t-lg transition-all duration-500 ${
                  isCrit ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-emerald-500'
                }`}
              />
              <span className="text-[10px] font-mono text-slate-400">ANC-{v.visitNumber}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
