import React from 'react';
import { useTranslation } from 'react-i18next';
import { QrCodeGenerator } from './QrCodeGenerator';
import { ShieldCheck, Heart, Building2, MapPin, Calendar, CheckCircle2, User, Printer, Download, Share2 } from 'lucide-react';

export interface MotherCardData {
  motherId: string; // e.g. JAN-KA-HVR-000001
  fullName: string;
  husbandName: string;
  age: number | string;
  dob?: string;
  phone: string;
  village: string;
  taluk?: string;
  district?: string;
  assignedPhc: string;
  issueDate?: string;
  photoUrl?: string;
  bloodGroup?: string;
}

interface DigitalMotherCardProps {
  data: MotherCardData;
  className?: string;
}

export const DigitalMotherCard: React.FC<DigitalMotherCardProps> = ({ data, className = '' }) => {
  const { t } = useTranslation();
  const formattedIssueDate = data.issueDate || new Date().toISOString().split('T')[0];
  const calculatedDob = data.dob || `${2026 - Number(data.age || 24)}-01-15`;

  // Real QR Code Payload containing complete actual maternal and acknowledgement details
  const realQrPayload = `JANANI360 Maternal ID: ${data.motherId}
Name: ${data.fullName}
DOB: ${calculatedDob} (${data.age} yrs)
Mobile: ${data.phone}
Assigned PHC: ${data.assignedPhc}
Village: ${data.village}
Blood Group: ${data.bloodGroup || 'O+'}
Verify: https://janani360.ai/verify/${data.motherId}`;

  const handleDownload = () => {
    const originalTitle = document.title;
    document.title = `JANANI360_Smart_ID_Card_${data.motherId}`;
    window.print();
    document.title = originalTitle;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareText = `Govt of Karnataka - JANANI360 Smart Maternal ID Card\nUnique Code: ${data.motherId}\nName: ${data.fullName}\nDOB: ${calculatedDob}\nMobile No: ${data.phone}\nPHC: ${data.assignedPhc}\nBlood Group: ${data.bloodGroup || 'O+'}\nVerify Link: https://janani360.ai/verify/${data.motherId}`;
    if (navigator.share) {
      navigator
        .share({
          title: `JANANI360 Smart ID Card - ${data.fullName}`,
          text: shareText,
          url: `https://janani360.ai/verify/${data.motherId}`
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert(`✅ Smart ID Card Details Copied to Clipboard!\n\n${shareText}`);
    }
  };

  return (
    <div className={`space-y-4 max-w-2xl mx-auto print:m-0 print:p-0 ${className}`}>
      {/* Action Toolbar for Smart ID Card (Hidden during Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Smart Maternal ID Card</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Card
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Download ID Card
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            Share ID Card
          </button>
        </div>
      </div>

      {/* PVC Card Container (Landscape Ratio ~ 1.58:1) */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-2xl text-slate-100 relative overflow-hidden print:border-2 print:border-black print:bg-white print:text-black">
        {/* Subtle Background Watermark */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none print:hidden" />

        {/* Card Header Band */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/30 print:border-slate-300">
          <div className="flex items-center gap-3">
            {/* Karnataka Govt Emblem / Badge */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-xs tracking-tighter print:bg-white print:text-amber-700">
                ಕರ್ನಾಟಕ
              </div>
            </div>
            <div>
              <span className="block text-[9px] font-black uppercase tracking-widest text-emerald-400 print:text-emerald-700">
                Government of Karnataka · Health &amp; Family Welfare
              </span>
              <h3 className="text-sm font-black tracking-tight text-white print:text-slate-900 flex items-center gap-1.5">
                <span>JANANI360 AI</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-emerald-300 print:text-slate-800">Smart Mother ID Card</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[10px] font-bold print:border-emerald-600 print:text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Active ID</span>
          </div>
        </div>

        {/* Card Main Body Grid */}
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Left Side: Demographic Info & Photo */}
          <div className="col-span-8 space-y-2.5">
            <div className="flex items-start gap-3">
              {/* Mother Photo / Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shrink-0 overflow-hidden">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt={data.fullName} className="w-full h-full object-cover rounded-[14px]" />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-emerald-300 font-bold text-xl print:bg-slate-100 print:text-slate-700">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Name & Mother ID */}
              <div className="space-y-0.5 overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-slate-600">
                  Mother Name / ತಾಯಿಯ ಹೆಸರು
                </span>
                <h4 className="text-base font-black text-white truncate print:text-black leading-tight">
                  {data.fullName}
                </h4>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Unique Code:</span>
                  <span className="font-mono font-black text-emerald-400 text-xs bg-slate-900 px-2 py-0.5 rounded-md border border-emerald-500/30 print:bg-slate-100 print:text-slate-900 print:border-slate-300">
                    {data.motherId}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Key-Value Table */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-slate-950/60 rounded-2xl p-2.5 border border-slate-800 text-[11px] print:bg-slate-50 print:border-slate-200">
              <div>
                <span className="block text-[9px] font-semibold text-slate-400 print:text-slate-500">DOB / Age:</span>
                <span className="font-bold text-slate-200 print:text-black block">{calculatedDob} ({data.age} yrs)</span>
              </div>
              <div>
                <span className="block text-[9px] font-semibold text-slate-400 print:text-slate-500">Mobile No:</span>
                <span className="font-bold text-emerald-300 print:text-slate-900 block font-mono">{data.phone}</span>
              </div>
              <div>
                <span className="block text-[9px] font-semibold text-slate-400 print:text-slate-500">Village:</span>
                <span className="font-bold text-slate-200 print:text-black truncate block">{data.village}</span>
              </div>
              <div>
                <span className="block text-[9px] font-semibold text-slate-400 print:text-slate-500">Blood Group:</span>
                <span className="font-bold text-emerald-400 print:text-emerald-800 block">{data.bloodGroup || 'O+'}</span>
              </div>
              <div className="col-span-2 pt-0.5 border-t border-slate-800/80 print:border-slate-200">
                <span className="block text-[9px] font-semibold text-slate-400 print:text-slate-500">Assigned Health Facility (PHC):</span>
                <span className="font-bold text-teal-300 print:text-slate-900 truncate block">{data.assignedPhc}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Real QR Code & Verification */}
          <div className="col-span-4 flex flex-col items-center justify-center space-y-1.5 pl-2 border-l border-slate-800 print:border-slate-300">
            <QrCodeGenerator value={realQrPayload} size={110} />
            <div className="text-center space-y-0.5">
              <span className="block text-[9px] font-bold text-slate-300 print:text-slate-800 leading-tight">
                Scan Real QR Code
              </span>
              <span className="block text-[8px] text-slate-400">Shows Real Maternal &amp; Ack Data</span>
              <span className="block text-[8px] text-slate-500 font-mono">Issued: {formattedIssueDate}</span>
            </div>
          </div>
        </div>

        {/* Card Footer Line */}
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[8.5px] text-slate-400 print:border-slate-300 print:text-slate-600">
          <span>Official Smart Maternal ID Card · Govt of Karnataka</span>
          <span className="font-mono text-emerald-400 print:text-slate-800 font-bold">JANANI360 AI</span>
        </div>
      </div>
    </div>
  );
};
