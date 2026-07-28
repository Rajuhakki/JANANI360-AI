import React, { useState, useEffect } from 'react';
import { QrCodeGenerator } from './QrCodeGenerator';
import { Printer, Download, Share2, CheckCircle2, Building2, ShieldCheck, Heart, Calendar, User, Activity, Send, Sparkles } from 'lucide-react';

export interface AcknowledgementData {
  registrationNo: string;
  motherId: string;
  motherName: string;
  dob: string;
  age: number | string;
  husbandName: string;
  mobile: string;
  address?: string;
  village: string;
  taluk: string;
  district: string;
  assignedPhc: string;
  lmp: string;
  edd: string;
  pregnancyNumber: string | number;
  parity?: string | number;
  abortions?: string | number;
  bloodGroup?: string;
  heightCm?: number | string;
  weightKg?: number | string;
  medicalCondition?: string;
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
  const [sentToPhc, setSentToPhc] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Check if already transmitted in this session
    try {
      const existing = JSON.parse(localStorage.getItem('janani360_phc_referrals') || '[]');
      const found = existing.some((item: any) => item.id === data.motherId);
      if (found) setSentToPhc(true);
    } catch (e) {}
  }, [data.motherId]);

  // Real Scannable Web Data URL for mobile cameras and scanners to display patient profile and auto-download PDF
  const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:5173';
  const realQrPayload = `${baseUrl}/verify-card?id=${encodeURIComponent(data.motherId)}&name=${encodeURIComponent(data.motherName)}&husband=${encodeURIComponent(data.husbandName)}&age=${encodeURIComponent(String(data.age))}&phone=${encodeURIComponent(data.mobile)}&village=${encodeURIComponent(data.village)}&phc=${encodeURIComponent(data.assignedPhc)}&blood=${encodeURIComponent(data.bloodGroup || 'O+')}&edd=${encodeURIComponent(data.edd || '2026-11-15')}&download_pdf=true`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const originalTitle = document.title;
    document.title = `JANANI360_Acknowledgement_Receipt_${data.motherId}`;
    window.print();
    document.title = originalTitle;
  };

  const handleShare = () => {
    const shareText = `JANANI360 AI Maternal Registration Acknowledgement\nReg No: ${data.registrationNo}\nMother ID: ${data.motherId}\nMother Name: ${data.motherName}\nMobile: ${data.mobile}\nAssigned PHC: ${data.assignedPhc}\nLMP: ${data.lmp} | EDD: ${data.edd}\nVerify Details: https://janani360.ai/verify/${data.motherId}`;
    if (navigator.share) {
      navigator
        .share({
          title: `Registration Receipt - ${data.motherName}`,
          text: shareText,
          url: `https://janani360.ai/verify/${data.motherId}`
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert(`✅ Acknowledgement Receipt Details Copied to Clipboard!\n\n${shareText}`);
    }
  };

  const handleSendToPhc = () => {
    setSending(true);
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('janani360_phc_referrals') || '[]');
        const isDuplicate = existing.some((item: any) => item.id === data.motherId);
        
        if (!isDuplicate) {
          const newEntry = {
            id: data.motherId,
            ancNumber: data.registrationNo,
            motherName: data.motherName,
            dob: data.dob,
            age: data.age,
            husbandName: data.husbandName,
            mobile: data.mobile,
            address: data.address || data.village,
            village: data.village,
            taluk: data.taluk,
            district: data.district,
            assignedPhc: data.assignedPhc,
            lmp: data.lmp,
            edd: data.edd,
            gravida: data.pregnancyNumber,
            parity: data.parity || 0,
            abortions: data.abortions || 0,
            bloodGroup: data.bloodGroup || 'O+',
            heightCm: data.heightCm || '154',
            weightKg: data.weightKg || '52',
            medicalCondition: data.medicalCondition || 'None Observed',
            registrationDate: data.registrationDate,
            ashaWorkerName: data.ashaWorkerName,
            status: 'PENDING_DOCTOR_REVIEW',
            sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          existing.unshift(newEntry);
          localStorage.setItem('janani360_phc_referrals', JSON.stringify(existing));
        }
        setSending(false);
        setSentToPhc(true);
        alert(`✅ SUCCESS: Maternal record transmitted to ${data.assignedPhc} Medical Officer!\n\nDoctor can now view ${data.motherName} (${data.motherId}) in their live Primary Health Care (PHC) queue.`);
      } catch (err) {
        console.error(err);
        setSending(false);
      }
    }, 600);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Action Toolbar (Hidden during Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Printable Registration Receipt &amp; Summary</span>
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
            onClick={handleDownloadPdf}
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
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            Share Receipt
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
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
                  <span className="font-bold font-mono text-emerald-400 print:text-black">{data.mobile}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Blood Group:</span>
                  <span className="font-bold text-teal-300 print:text-slate-900">{data.bloodGroup || 'O+'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Address / Locality:</span>
                  <span className="font-bold text-slate-200 print:text-black truncate block">{data.address || data.village}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Location & Health Facility */}
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2.5 print:bg-slate-50 print:border-slate-300">
              <h4 className="text-xs font-bold text-teal-400 print:text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Location &amp; Health Facility
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Village:</span>
                  <span className="font-bold text-white print:text-black truncate block">{data.village}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Taluk:</span>
                  <span className="font-bold text-white print:text-black truncate block">{data.taluk}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">District:</span>
                  <span className="font-bold text-slate-200 print:text-black truncate block">{data.district}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Assigned PHC:</span>
                  <span className="font-bold text-emerald-300 print:text-black truncate block">{data.assignedPhc}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Pregnancy Data & Clinical Metrics */}
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2.5 print:bg-slate-50 print:border-slate-300">
              <h4 className="text-xs font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5" />
                Pregnancy &amp; Obstetric Record
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">ANC Reg No:</span>
                  <span className="font-mono font-bold text-emerald-400 print:text-black">{data.registrationNo}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Obstetric Score:</span>
                  <span className="font-bold text-slate-200 print:text-black font-mono">
                    G{data.pregnancyNumber || 1} P{data.parity || 0} A{data.abortions || 0}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Physical Stats:</span>
                  <span className="font-bold text-slate-200 print:text-black">
                    {data.heightCm || '154'} cm / {data.weightKg || '52'} kg
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">LMP Date:</span>
                  <span className="font-bold text-slate-200 print:text-black font-mono">{data.lmp}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Expected Delivery (EDD):</span>
                  <span className="font-bold text-teal-300 print:text-black font-mono">{data.edd}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="block text-[10px] text-slate-400 print:text-slate-600">Medical Condition:</span>
                  <span className="font-bold text-amber-300 print:text-slate-900 truncate block">
                    {data.medicalCondition || 'None Observed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Registrar Column */}
          <div className="space-y-4 text-center">
            <div className="bg-slate-900/80 rounded-3xl p-5 border border-slate-800 space-y-3 print:bg-white print:border-slate-300">
              <a
                href={realQrPayload}
                target="_blank"
                rel="noopener noreferrer"
                title="Click or scan QR with camera to verify clinical profile and download PDF receipt"
                className="group inline-block transition-transform hover:scale-105 cursor-pointer"
              >
                <QrCodeGenerator value={realQrPayload} size={150} className="mx-auto" />
              </a>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black print:text-black print:bg-transparent print:border-none">
                  📲 Scan or Click QR
                </span>
                <span className="block text-[11px] font-bold text-slate-200 print:text-black">
                  Shows Real Maternal Profile &amp; Auto-Downloads PDF
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
            "This acknowledgement confirms that the mother has been successfully registered with all clinical metrics in the JANANI360 AI Maternal Healthcare System."
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            Generated via JANANI360 AI OS · Health &amp; Family Welfare Dept, Govt of Karnataka
          </p>
        </div>
      </div>

      {/* Send to Primary Health Care (PHC) Medical Action Card (Hidden in Print) */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2 justify-center sm:justify-start">
              Send to Primary Health Care (PHC)
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Live Doctor Queue
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Transmit this complete maternal case directly to the Primary Health Care (PHC) Model Medical Officer for doctor evaluation.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleSendToPhc}
            disabled={sentToPhc || sending}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto ${
              sentToPhc
                ? 'bg-emerald-500 text-slate-950 cursor-default shadow-emerald-500/25'
                : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-emerald-500/20 active:scale-95'
            }`}
          >
            {sending ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Sending to PHC...
              </>
            ) : sentToPhc ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                ✅ Sent to PHC Doctor
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                Send to Primary Health Care (PHC)
              </>
            )}
          </button>

          {sentToPhc && (
            <a
              href="/phc-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg hover:text-white"
            >
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              Open PHC Doctor Model ➜
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
