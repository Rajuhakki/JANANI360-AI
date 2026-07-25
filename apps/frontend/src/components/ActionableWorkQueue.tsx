import React from 'react';
import { AlertCircle, Clock, ChevronRight, Activity, ShieldAlert } from 'lucide-react';

export interface WorkQueueItem {
  id: string;
  motherName: string;
  rchId: string;
  village: string;
  safetyScore: number;
  riskLevel: string;
  caseStatus: string;
  requiredAction: string;
}

interface Props {
  role?: string;
  items: WorkQueueItem[];
  onSelectQueueItem?: (motherId: string) => void;
  language?: 'kn' | 'en';
}

export const ActionableWorkQueue: React.FC<Props> = ({
  role = 'ASHA_WORKER',
  items,
  onSelectQueueItem,
  language = 'kn'
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              {language === 'kn' ? 'ಸಕ್ರಿಯ ಕಾರ್ಯಾಚರಣೆಗಳ ಸರತಿ ಸಾಲು' : 'Actionable Work Queue'}
            </h3>
            <span className="text-[11px] text-slate-400">
              Role: <strong className="text-emerald-400">{role}</strong> | {items.length} Pending Tasks
            </span>
          </div>
        </div>

        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
          Live Sync Active
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs">
          {language === 'kn' ? 'ಯಾವುದೇ ಕಾರ್ಯಗಳು ಬಾಕಿ ಇಲ್ಲ' : 'No urgent tasks pending in queue.'}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isCritical = item.riskLevel === 'CRITICAL' || item.safetyScore < 40;

            return (
              <div
                key={item.id}
                onClick={() => onSelectQueueItem && onSelectQueueItem(item.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-wrap items-center justify-between gap-4 ${
                  isCritical
                    ? 'bg-red-950/30 border-red-500/40 hover:border-red-500'
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-emerald-500/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCritical ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{item.motherName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">RCH: {item.rchId}</span>
                      <span className="text-[10px] text-slate-500">• {item.village}</span>
                    </div>

                    <p className="text-xs font-semibold text-amber-300 mt-1 flex items-center gap-1">
                      <span>Action Required:</span>
                      <span className="text-slate-200">{item.requiredAction}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${
                        isCritical
                          ? 'bg-red-500 text-white'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      Safety: {item.safetyScore}/100
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{item.caseStatus}</div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
