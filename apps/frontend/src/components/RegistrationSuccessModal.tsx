import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  CreditCard,
  FileText,
  Printer,
  Download,
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
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-3xl w-full p-5 sm:p-6 space-y-5 shadow-2xl relative my-8 print:p-0 print:border-none print:bg-white">
        {/* Top Title & Close (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                ✅ Mother Registration Successful
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">
                The mother has been successfully registered into the JANANI360 AI Maternal Healthcare Platform.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: PVC Digital Card vs Acknowledgement Receipt (Hidden in Print) */}
        <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800 print:hidden">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'card'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Digital PVC Mother Card
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('receipt')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'receipt'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Printable Receipt
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

        {/* Four Primary Buttons (Hidden in Print) */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-400 font-mono">
            Unique Mother ID: <span className="text-emerald-400 font-bold">{motherId}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Button 1: View Mother Profile */}
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Mother Profile
            </button>

            {/* Button 2: Download Acknowledgement (PDF) */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Download PDF
            </button>

            {/* Button 3: Print Mother Card */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              Print Mother Card
            </button>

            {/* Button 4: Done */}
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs rounded-xl border border-slate-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
