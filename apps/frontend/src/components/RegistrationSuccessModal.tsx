import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Printer,
  Download,
  ExternalLink,
  X,
  Sparkles,
  FileText,
  CreditCard
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
    village: string;
    taluk: string;
    district: string;
    assignedPhc: string;
    lmpDate: string;
    eddDate: string;
    gravida: number | string;
    bloodGroup?: string;
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
    village: motherData.village,
    taluk: motherData.taluk,
    district: motherData.district,
    assignedPhc: motherData.assignedPhc,
    lmp: motherData.lmpDate,
    edd: motherData.eddDate,
    pregnancyNumber: motherData.gravida,
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
      <div className="bg-slate-900 border border-emerald-500/40 rounded-[20px] max-w-6xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative my-6 print:p-0 print:border-none print:bg-white">
        {/* Header Success Animation */}
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
                Generated unique Mother ID <span className="font-mono text-emerald-400 font-bold">{motherId}</span>. Digital profile, QR code, acknowledgement receipt, and PVC card created.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TWO LARGE SIDE-BY-SIDE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT CARD: Registration Acknowledgement */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-[20px] p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Registration Acknowledgement
              </h4>
              <span className="text-[10px] font-mono text-slate-400">{ancNumber}</span>
            </div>

            <RegistrationAcknowledgement data={acknowledgementPayload} />

            {/* Left Card Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-teal-400" />
                Print Receipt
              </button>
            </div>
          </div>

          {/* RIGHT CARD: Aadhaar/ABHA Style Mother ID Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-[20px] p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Mother ID Card (PVC Format)
              </h4>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                ACTIVE
              </span>
            </div>

            <DigitalMotherCard data={cardPayload} />

            {/* Right Card Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download ID Card (PDF)
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-teal-400" />
                Print Card
              </button>
            </div>
          </div>
        </div>

        {/* Global Bottom Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-400 font-mono">
            Mother ID: <span className="text-emerald-400 font-bold">{motherId}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleViewProfile}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Mother Profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
