import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  Download,
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
  const { t } = useTranslation();
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-5xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative my-6 print:p-0 print:border-none print:bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                ✅ Mother Registered Successfully
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Generated unique Mother ID <span className="font-mono text-emerald-400 font-bold">{motherId}</span>. Digital profile, QR code, and credentials generated.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher: Smart ID Card vs Acknowledgement Receipt */}
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
            1. Smart Mother ID Card (PVC Format)
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
            2. Registration Acknowledgement
          </button>
        </div>

        {/* Active Content Preview */}
        <div className="py-2">
          {activeTab === 'card' ? (
            <DigitalMotherCard data={cardPayload} />
          ) : (
            <RegistrationAcknowledgement data={acknowledgementPayload} />
          )}
        </div>

        {/* Action Buttons & Bottom Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-400 font-mono">
            Mother ID: <span className="text-emerald-400 font-bold">{motherId}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              Print Document
            </button>
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Mother Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessModal;
