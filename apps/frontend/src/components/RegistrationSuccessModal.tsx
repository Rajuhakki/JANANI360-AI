import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  CreditCard,
  FileText,
  ExternalLink,
  X,
  Sparkles
} from 'lucide-react';
import { DigitalMotherCard, MotherCardData } from './DigitalMotherCard';
import { RegistrationAcknowledgement, AcknowledgementData } from './RegistrationAcknowledgement';

interface RegistrationSuccessModalProps {
  motherId: string; // e.g. JAN-KA-HVR-000001
  ancNumber: string;
  motherData: {
    fullName: string;
    husbandName: string;
    age: number | string;
    phone: string;
    address?: string;
    village: string;
    taluk: string;
    district: string;
    assignedPhc: string;
    lmpDate: string;
    eddDate: string;
    gravida: number | string;
    parity?: number | string;
    abortions?: number | string;
    bloodGroup?: string;
    heightCm?: number | string;
    weightKg?: number | string;
    medicalCondition?: string;
    ashaWorkerName?: string;
  };
  onClose: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  motherId,
  ancNumber,
  motherData,
  onClose
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'card' | 'receipt'>('card');

  const cardPayload: MotherCardData = {
    motherId,
    fullName: motherData.fullName,
    husbandName: motherData.husbandName,
    age: motherData.age,
    phone: motherData.phone,
    village: motherData.village,
    assignedPhc: motherData.assignedPhc,
    bloodGroup: motherData.bloodGroup || 'O+'
  };

  const acknowledgementPayload: AcknowledgementData = {
    registrationNo: ancNumber,
    motherId,
    motherName: motherData.fullName,
    dob: `${2026 - Number(motherData.age || 24)}-01-15`,
    age: motherData.age,
    husbandName: motherData.husbandName,
    mobile: motherData.phone,
    address: motherData.address,
    village: motherData.village,
    taluk: motherData.taluk,
    district: motherData.district,
    assignedPhc: motherData.assignedPhc,
    lmp: motherData.lmpDate,
    edd: motherData.eddDate,
    pregnancyNumber: motherData.gravida,
    parity: motherData.parity,
    abortions: motherData.abortions,
    bloodGroup: motherData.bloodGroup,
    heightCm: motherData.heightCm,
    weightKg: motherData.weightKg,
    medicalCondition: motherData.medicalCondition,
    registrationDate: new Date().toISOString().split('T')[0],
    ashaWorkerName: motherData.ashaWorkerName || 'Sanveeka Gowda (ASHA)'
  };

  const handleViewProfile = () => {
    navigate(`/mother-profile?id=${motherId}`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-4xl w-full p-5 sm:p-6 space-y-5 shadow-2xl relative my-8 print:p-0 print:border-none print:bg-white print:max-w-none">
        {/* Top Title & Close (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                ✅ Mother Registration &amp; Case Generation Successful
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Generate and share official maternal credentials and clinical acknowledgement records below.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Smart ID Card vs Acknowledgement Receipt (Hidden in Print) */}
        <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800 print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'card'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            2. Smart ID Card (Real QR)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receipt')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'receipt'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            1. Acknowledgement (All Form Data)
          </button>
        </div>

        {/* Active Content Preview */}
        <div className="py-1">
          {activeTab === 'card' ? (
            <DigitalMotherCard data={cardPayload} />
          ) : (
            <RegistrationAcknowledgement data={acknowledgementPayload} />
          )}
        </div>

        {/* Bottom Bar (Hidden in Print) */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-400 font-mono">
            Generated Mother Code: <span className="text-emerald-400 font-bold">{motherId}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* View Mother Profile */}
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Mother Case Profile
            </button>

            {/* Done / Close */}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
