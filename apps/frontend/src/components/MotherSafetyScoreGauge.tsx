import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface MotherSafetyScoreGaugeProps {
  score: number;
  riskLevel: string;
  preeclampsiaRisk?: string;
  anemiaSeverity?: string;
}

export const MotherSafetyScoreGauge: React.FC<MotherSafetyScoreGaugeProps> = ({
  score,
  riskLevel,
  preeclampsiaRisk,
  anemiaSeverity
}) => {
  const { t } = useTranslation();
  const getTheme = (s: number) => {
    if (s < 40) return { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'CRITICAL RISK', icon: ShieldAlert };
    if (s < 60) return { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', label: 'HIGH RISK', icon: AlertTriangle };
    if (s < 80) return { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'MODERATE RISK', icon: AlertTriangle };
    return { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'OPTIMAL SAFETY', icon: ShieldCheck };
  };

  const theme = getTheme(score);
  const Icon = theme.icon;

  return (
    <div className={`p-4 rounded-2xl border ${theme.bg} flex items-center justify-between`}>
      <div className="flex items-center space-x-3.5">
        <div className="relative flex items-center justify-center">
          <svg className="w-14 h-14 transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="22"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={138}
              strokeDashoffset={138 - (138 * Math.min(100, Math.max(0, score))) / 100}
              className={theme.color}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className={`absolute text-sm font-extrabold font-mono ${theme.color}`}>
            {score}
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-1.5">
            <Icon className={`w-4 h-4 ${theme.color}`} />
            <span className={`text-xs font-extrabold uppercase tracking-wider ${theme.color}`}>
              {riskLevel || theme.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            AI Mother Safety Index (Base 100)
          </p>
        </div>
      </div>

      <div className="text-right text-[11px] space-y-1 hidden sm:block">
        <div>
          <span className="text-slate-500">Preeclampsia: </span>
          <span className="font-bold text-slate-200">{preeclampsiaRisk || 'LOW'}</span>
        </div>
        <div>
          <span className="text-slate-500">Anemia: </span>
          <span className="font-bold text-slate-200">{anemiaSeverity || 'NORMAL'}</span>
        </div>
      </div>
    </div>
  );
};
