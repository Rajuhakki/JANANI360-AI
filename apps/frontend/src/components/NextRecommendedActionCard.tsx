import React from 'react';
import { Lightbulb, AlertTriangle, ShieldCheck, ArrowRight, PhoneCall, Ambulance } from 'lucide-react';

export interface NextActionData {
  actionTitleEn: string;
  actionTitleKn: string;
  urgency: 'NORMAL' | 'HIGH' | 'CRITICAL';
  reasoningEn: string;
  reasoningKn: string;
  targetFacility: string;
  actionButtonLabelEn: string;
  actionButtonLabelKn: string;
}

interface Props {
  actionData: NextActionData;
  language?: 'kn' | 'en';
  onExecuteAction?: () => void;
}

export const NextRecommendedActionCard: React.FC<Props> = ({
  actionData,
  language = 'kn',
  onExecuteAction
}) => {
  const isCritical = actionData.urgency === 'CRITICAL';
  const isHigh = actionData.urgency === 'HIGH';

  return (
    <div
      className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden transition ${
        isCritical
          ? 'bg-gradient-to-r from-red-950/90 via-slate-900 to-red-950/90 border-red-500/50 shadow-red-950/50'
          : isHigh
          ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-amber-500/50 shadow-amber-950/50'
          : 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-emerald-500/40'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isCritical
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                : isHigh
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {isCritical ? (
              <AlertTriangle className="w-6 h-6" />
            ) : isHigh ? (
              <Lightbulb className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                💡 {language === 'kn' ? 'ಮುಂದಿನ ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ' : 'Next Recommended Action'}
              </span>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isCritical
                    ? 'bg-red-500 text-white animate-bounce'
                    : isHigh
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-500/30 text-emerald-300'
                }`}
              >
                {actionData.urgency}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-100 leading-tight">
              {language === 'kn' ? actionData.actionTitleKn : actionData.actionTitleEn}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
              {language === 'kn' ? actionData.reasoningKn : actionData.reasoningEn}
            </p>

            <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="font-semibold text-slate-300">
                {language === 'kn' ? 'ಉದ್ದೇಶಿತ ಸೌಲಭ್ಯ:' : 'Target Facility:'}
              </span>
              <span className="text-emerald-400 font-bold">{actionData.targetFacility}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[200px]">
          <button
            onClick={onExecuteAction}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition ${
              isCritical
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse'
                : isHigh
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isCritical ? <Ambulance className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            {language === 'kn' ? actionData.actionButtonLabelKn : actionData.actionButtonLabelEn}
          </button>

          <button className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            {language === 'kn' ? 'ASHA ಕರೆ ಮಾಡಿ' : 'Call ASHA Worker'}
          </button>
        </div>
      </div>
    </div>
  );
};
