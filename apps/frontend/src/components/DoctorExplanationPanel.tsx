import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Building2, Stethoscope, Lock, FileText, X } from 'lucide-react';
import api from '../services/api';

interface GuidelineItem {
  guideline: string;
  rule: string;
  reason: string;
}

interface HospitalItem {
  rank: number;
  facilityId: string;
  facilityNameEn: string;
  facilityTier: string;
  distanceKm: number;
  travelTimeMins: number;
  capabilityScore: number;
  hduBedsAvailable: number;
  reasons: string[];
}

interface Props {
  cdssResult: any;
  motherId: string;
  predictionId?: string;
  language?: 'kn' | 'en';
  onOverrideSuccess?: () => void;
}

export const DoctorExplanationPanel: React.FC<Props> = ({
  cdssResult,
  motherId,
  predictionId,
  language = 'kn',
  onOverrideSuccess
}) => {
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideForm, setOverrideForm] = useState({
    doctorDecisionAction: 'Conservative Management at PHC with Daily BP Monitoring',
    overrideReason: 'Patient refuses referral to District Hospital; family agrees to strict PHC outpatient monitoring.'
  });
  const [submitting, setSubmitting] = useState(false);

  if (!cdssResult) return null;

  const isCritical = cdssResult.safetyScore < 40;
  const guidelines: GuidelineItem[] = cdssResult.triggeredGuidelines || [];
  const topHospitals: HospitalItem[] = cdssResult.topRankedHospitals || [];
  const actionPlan = cdssResult.actionPlan || {};

  const handleOverrideSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/maternal/ai-override', {
        predictionId: predictionId || 'pred-demo-01',
        motherId,
        originalAiAction: cdssResult.reasons?.join(' | ') || 'Emergency Referral',
        doctorDecisionAction: overrideForm.doctorDecisionAction,
        overrideReason: overrideForm.overrideReason
      });

      if (res.data.success) {
        setShowOverrideModal(false);
        if (onOverrideSuccess) onOverrideSuccess();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record override');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header & Reliability Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              JANANI360 Clinical Decision Support Panel (CDSS v3.0)
            </h3>
            <span className="text-xs text-slate-400">
              AI Version: <span className="font-mono text-emerald-400">{cdssResult.aiVersion || 'v3.0.0-cdss'}</span> | Rule Engine: {cdssResult.ruleVersion || '2026.1-WHO-GOI'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Prediction Reliability
            </span>
            <span className="text-xs font-black text-emerald-400">
              {cdssResult.predictionReliability || 'HIGH'} ({cdssResult.dataCompletenessPercent || 83}% Vitals Completeness)
            </span>
          </div>

          <button
            onClick={() => setShowOverrideModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Stethoscope className="w-4 h-4 text-amber-400" />
            Doctor Override
          </button>
        </div>
      </div>

      {/* Mandatory Ethical Clinical Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 uppercase text-[10px] tracking-wider block mb-0.5">
            ⚠️ CLINICAL DISCLAIMER (ವೈದ್ಯಕೀಯ ಜವಾಬ್ದಾರಿ)
          </span>
          {cdssResult.disclaimer}
        </div>
      </div>

      {/* Triggered Clinical Guidelines */}
      {guidelines.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-400" /> Triggered Medical Guidelines (ಸೂಚಿಸಿದ ಮಾರ್ಗಸೂಚಿಗಳು)
          </h4>
          <div className="space-y-2">
            {guidelines.map((g, idx) => (
              <div key={idx} className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300">{g.guideline}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Rule: {g.rule}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">{g.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Action Plan */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Structured Action Plan (ಆರೈಕೆ ಯೋಜನೆ)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl">
            <span className="text-[10px] font-black uppercase text-red-400 block mb-1">
              ⚡ Immediate (30 Mins)
            </span>
            <p className="text-slate-200 font-semibold">{actionPlan.immediateWithin30Mins}</p>
          </div>

          <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-xl">
            <span className="text-[10px] font-black uppercase text-amber-400 block mb-1">
              📅 Today (24 Hours)
            </span>
            <p className="text-slate-200 font-semibold">{actionPlan.withinToday}</p>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700 rounded-xl">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              🗓️ Next Review Date
            </span>
            <p className="text-emerald-400 font-bold font-mono">{actionPlan.nextAncDate}</p>
          </div>
        </div>
      </div>

      {/* Top 3 Ranked Smart Hospital Recommendation Capability Matrix */}
      {topHospitals.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-400" /> Top 3 Ranked Hospital Capabilities (ಆಸ್ಪತ್ರೆ ಶಿಫಾರಸು ಶ್ರೇಣಿ)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topHospitals.map((h) => (
              <div
                key={h.facilityId}
                className={`p-4 rounded-2xl border transition relative ${
                  h.rank === 1
                    ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                {h.rank === 1 && (
                  <span className="absolute -top-2.5 right-3 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    Top Recommendation
                  </span>
                )}

                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">
                    #{h.rank}
                  </span>
                  <span>{h.facilityNameEn}</span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-3">
                  <span>{h.distanceKm} km</span>
                  <span>•</span>
                  <span>~{h.travelTimeMins} mins travel</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-700/60 pt-2 text-xs">
                  <span className="text-slate-400">Capability Score:</span>
                  <span className="font-black text-emerald-400">{h.capabilityScore} / 100</span>
                </div>

                <ul className="mt-2 text-[10px] text-slate-300 space-y-1">
                  {(h.reasons || []).map((r, i) => (
                    <li key={i} className="flex items-center gap-1 text-slate-300">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button onClick={() => setShowOverrideModal(false)} className="absolute top-5 right-5 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-amber-400" /> Doctor Clinical Override Log
            </h3>

            <p className="text-xs text-slate-400">
              Medical professionals can override AI recommendations. Overrides are recorded in the audit log for accountability.
            </p>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Doctor Decision / Action</label>
              <input
                type="text"
                value={overrideForm.doctorDecisionAction}
                onChange={(e) => setOverrideForm({ ...overrideForm, doctorDecisionAction: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Clinical Rationale for Override</label>
              <textarea
                rows={3}
                value={overrideForm.overrideReason}
                onChange={(e) => setOverrideForm({ ...overrideForm, overrideReason: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleOverrideSubmit}
                className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold"
              >
                {submitting ? 'Recording...' : 'Confirm Override'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
