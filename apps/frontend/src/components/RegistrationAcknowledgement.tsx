import React from 'react';
import { QrCodeGenerator } from './QrCodeGenerator';
import { Printer, Download, Share2, CheckCircle2, Building2, ShieldCheck, Heart, Calendar, User } from 'lucide-react';

export interface AcknowledgementData {
  registrationNo: string;
  motherId: string;
  motherName: string;
  dob: string;
  age: number | string;
  husbandName: string;
  mobile: string;
  village: string;
  taluk: string;
  district: string;
  assignedPhc: string;
  lmp: string;
  edd: string;
  pregnancyNumber: string | number;
  registrationDate: string;
  ashaWorkerName: string;
  ashaId?: string;
}

interface RegistrationAcknowledgementProps {
  data: AcknowledgementData;
  onClose?: () => void;
}

export const RegistrationAcknowledgement: React.FC<RegistrationAcknowledgementProps> = ({
  data,
  onClose
}) => {
  const qrUrl = `https://janani360.ai/mother/${data.motherId}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `JANANI360 Mother Registration - ${data.motherName}`,
          text: `Mother ID: ${data.motherId} registered in JANANI360 AI Platform.`,
          url: qrUrl
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(qrUrl);
      alert(`Profile link copied to clipboard:\n${qrUrl}`);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Action Toolbar (Hidden during Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Printable Registration Receipt</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Receipt
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Download PDF
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:p-2 print:m-0">
        {/* Header Band */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-5 border-b-2 border-emerald-500/40 text-center sm:text-left gap-4 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-xs tracking-tighter print:bg-white print:text-amber-800">
                ಕರ್ನಾಟಕ
              </div>
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400 print:text-emerald-800">
                Government of Karnataka
              </h2>
              <h3 className="text-sm font-bold text-slate-300 print:text-slate-700">
                Health &amp; Family Welfare Department
              </h3>
              <h1 className="text-lg font-black text-white print:text-black tracking-tight mt-0.5">
                JANANI360 AI · Mother Registration Acknowledgement
              </h1>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-xs px-3 py-1 rounded-full print:bg-slate-100 print:text-slate-900 print:border-slate-400">
              Mother ID: {data.motherId}
            </span>
            <span className="block text-[10px] text-slate-400 font-mono">Date: {data.registrationDate}</span>
          </div>
        </div>

        {/* Form Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Main Attributes */}
          <div className="md:col-span-2 space-y-4">
            {/* Section 1: Demographics */}
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2.5 print:bg-slate-50 print:border-slate-300">
              <h4 className="text-xs font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Mother Demographic Information
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Full Name:</span>
                  <span className="font-bold text-white print:text-black">{data.motherName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Husband Name:</span>
                  <span className="font-bold text-white print:text-black">{data.husbandName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Age / DOB:</span>
                  <span className="font-bold text-slate-200 print:text-black">{data.age} yrs ({data.dob})</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Mobile Number:</span>
                  <span className="font-bold text-slate-200 print:text-black">{data.mobile}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Location & Health Facility */}
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2.5 print:bg-slate-50 print:border-slate-300">
              <h4 className="text-xs font-bold text-teal-400 print:text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Location &amp; Health Facility
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Village:</span>
                  <span className="font-bold text-white print:text-black">{data.village}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Taluk:</span>
                  <span className="font-bold text-white print:text-black">{data.taluk}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">District:</span>
                  <span className="font-bold text-slate-200 print:text-black">{data.district}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Assigned PHC:</span>
                  <span className="font-bold text-emerald-300 print:text-black">{data.assignedPhc}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Pregnancy Data */}
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2.5 print:bg-slate-50 print:border-slate-300">
              <h4 className="text-xs font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Pregnancy &amp; Obstetric Record
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">ANC Reg No:</span>
                  <span className="font-mono font-bold text-emerald-400 print:text-black">{data.registrationNo}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">LMP Date:</span>
                  <span className="font-bold text-slate-200 print:text-black">{data.lmp}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Expected Delivery (EDD):</span>
                  <span className="font-bold text-teal-300 print:text-black">{data.edd}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Registrar Column */}
          <div className="space-y-4 text-center">
            <div className="bg-slate-900/80 rounded-3xl p-5 border border-slate-800 space-y-3 print:bg-white print:border-slate-300">
              <QrCodeGenerator value={qrUrl} size={150} className="mx-auto" />
              <div className="space-y-1">
                <span className="block text-xs font-bold text-white print:text-black">Scan Digital QR</span>
                <span className="block text-[10px] text-slate-400 print:text-slate-600">
                  Instantly opens Mother Profile Hub
                </span>
              </div>
            </div>

            {/* ASHA Registrar Info */}
            <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800 text-left text-xs space-y-1 print:bg-slate-50 print:border-slate-300">
              <span className="block text-[10px] uppercase font-bold text-slate-400 print:text-slate-600">Registered By</span>
              <span className="block font-bold text-white print:text-black">{data.ashaWorkerName}</span>
              <span className="block text-[10px] text-slate-400 print:text-slate-600">
                ASHA Facilitator · ID: {data.ashaId || 'KA-ASHA-560087'}
              </span>
            </div>
          </div>
        </div>

        {/* Official Footer Statement */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-1 print:border-black">
          <p className="text-xs font-semibold text-emerald-300 print:text-black">
            "This acknowledgement confirms that the mother has been successfully registered in the JANANI360 AI Maternal Healthcare System."
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            Generated via JANANI360 AI OS · Health &amp; Family Welfare Dept, Govt of Karnataka
          </p>
        </div>
      </div>
    </div>
  );
};
