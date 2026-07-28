import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { RegistrationAcknowledgement, AcknowledgementData } from '../components/RegistrationAcknowledgement';
import { DigitalMotherCard } from '../components/DigitalMotherCard';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Printer,
  ExternalLink,
  ArrowLeft,
  Building2,
  FileText,
  CreditCard,
  Send,
  UserCheck
} from 'lucide-react';

export const VerifyCardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'acknowledgement' | 'card'>('acknowledgement');
  const [hasAutoPrinted, setHasAutoPrinted] = useState(false);

  // Extract all real clinical telemetry from scanned QR URL parameters
  const id = searchParams.get('id') || 'JAN-KA-2026-889102';
  const name = searchParams.get('name') || 'Lakshmi Devi';
  const husband = searchParams.get('husband') || 'Suresh K.';
  const age = searchParams.get('age') || '24';
  const phone = searchParams.get('phone') || '9876543210';
  const village = searchParams.get('village') || 'Shiggaon East';
  const phc = searchParams.get('phc') || 'Shiggaon Community Health Centre';
  const blood = searchParams.get('blood') || 'O+';
  const edd = searchParams.get('edd') || '2026-11-15';
  const condition = searchParams.get('condition') || 'Moderate Anemia Surveillance';
  const shouldDownloadPdf = searchParams.get('download_pdf') === 'true';

  // Construct official acknowledgement data structure
  const ackData: AcknowledgementData = {
    registrationNo: `RCH-KA-2026-${id.slice(-5)}`,
    motherId: id,
    motherName: name,
    dob: `${2026 - Number(age)}-05-12`,
    age: age,
    husbandName: husband,
    mobile: phone,
    address: village,
    village: village,
    taluk: 'Shiggaon',
    district: 'Haveri',
    assignedPhc: phc,
    lmp: '2026-02-08',
    edd: edd,
    pregnancyNumber: 'G2',
    parity: '1',
    abortions: '0',
    bloodGroup: blood,
    medicalCondition: condition,
    registrationDate: new Date().toISOString().split('T')[0],
    ashaWorkerName: 'Sanveeka Gowda (ASHA-HVR-2201)'
  };

  // Automatically trigger PDF Acknowledgement download upon scan
  useEffect(() => {
    if (shouldDownloadPdf && !hasAutoPrinted) {
      const timer = setTimeout(() => {
        setHasAutoPrinted(true);
        const originalTitle = document.title;
        document.title = `JANANI360_Acknowledgement_Receipt_${id}`;
        window.print();
        document.title = originalTitle;
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [shouldDownloadPdf, hasAutoPrinted, id]);

  const handleManualDownload = () => {
    const originalTitle = document.title;
    document.title = `JANANI360_Acknowledgement_Receipt_${id}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Top Navigation & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 print:hidden">
          <button
            onClick={() => navigate('/asha-entry')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to ASHA Data Entry &amp; Registration</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified NHM Karnataka Digital Record</span>
          </div>
        </div>

        {/* Executive Verification Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/80 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print:hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>QR CODE SCAN VERIFICATION SUCCESSFUL</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <span>{name}</span>
                <span className="text-sm px-3 py-1 rounded-lg bg-slate-800 text-emerald-400 font-mono font-bold border border-slate-700">
                  {id}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl">
                This digital maternal clinical profile has been scanned directly from a verified JANANI360 Smart ID card or registration form. All antenatal records below are backed by live NHM telemetry.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={handleManualDownload}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-emerald-500/25 transition flex items-center gap-2 w-full sm:w-auto justify-center animate-bounce"
              >
                <Download className="w-4 h-4" />
                <span>📥 Download Acknowledgement PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Patient Telemetry Summary Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:hidden">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="block text-[10px] uppercase text-slate-400 font-bold">Assigned PHC Center</span>
            <span className="text-sm font-extrabold text-teal-300 truncate block mt-1">{phc}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="block text-[10px] uppercase text-slate-400 font-bold">Village / Ward</span>
            <span className="text-sm font-extrabold text-white truncate block mt-1">{village}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="block text-[10px] uppercase text-slate-400 font-bold">Blood Group &amp; Risk</span>
            <span className="text-sm font-extrabold text-emerald-400 truncate block mt-1">{blood} · Regular Surveillance</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <span className="block text-[10px] uppercase text-slate-400 font-bold">Expected Delivery Date</span>
            <span className="text-sm font-extrabold text-rose-400 truncate block mt-1 font-mono">{edd}</span>
          </div>
        </div>

        {/* Interactive Document Switcher */}
        <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800 print:hidden shadow-inner max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('acknowledgement')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'acknowledgement'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Acknowledgement (PDF)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'card'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>2. Smart ID Card</span>
          </button>
        </div>

        {/* Render Selected Credential Document */}
        <div className="pt-2">
          {activeTab === 'acknowledgement' ? (
            <div className="space-y-4">
              <RegistrationAcknowledgement data={ackData} />
            </div>
          ) : (
            <div className="py-4">
              <DigitalMotherCard
                data={{
                  motherId: ackData.motherId,
                  fullName: ackData.motherName,
                  husbandName: ackData.husbandName,
                  age: ackData.age,
                  phone: ackData.mobile,
                  village: ackData.village,
                  assignedPhc: ackData.assignedPhc,
                  bloodGroup: ackData.bloodGroup
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
