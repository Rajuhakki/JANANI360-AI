import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Baby,
  Activity,
  Heart,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Plus,
  RefreshCw,
  X,
  FileText,
  Search,
  Filter,
  Clock,
  UserCheck,
  UserPlus,
  Sparkles,
  Building2,
  Stethoscope,
  ArrowRight,
  Phone,
  MapPin,
  Ambulance
} from 'lucide-react';
import { laborService } from '../services/laborService';
import { Navbar } from '../components/Navbar';
import { WhoPartographChart } from '../components/WhoPartographChart';

interface PhcReferral {
  id: string;
  ancNumber: string;
  motherName: string;
  dob: string;
  age: number | string;
  husbandName: string;
  mobile: string;
  address?: string;
  village: string;
  taluk?: string;
  district?: string;
  assignedPhc: string;
  lmp: string;
  edd: string;
  gravida: number | string;
  parity?: number | string;
  abortions?: number | string;
  bloodGroup?: string;
  heightCm?: number | string;
  weightKg?: number | string;
  medicalCondition?: string;
  registrationDate: string;
  ashaWorkerName: string;
  status: 'PENDING_DOCTOR_REVIEW' | 'EVALUATED_BY_DOCTOR' | 'ADMITTED_TO_WARD' | 'TRANSFERRED_TO_HOSPITAL_ADMIN';
  sentAt?: string;
  doctorNotes?: string;
}

const INITIAL_PHC_REFERRALS: PhcReferral[] = [
  {
    id: 'JAN-KA-VTR-0042',
    ancNumber: 'RCH-982140',
    motherName: 'Meenakshi Sundaram',
    dob: '1999-06-12',
    age: 26,
    husbandName: 'Karthick Sundaram',
    mobile: '9845012345',
    address: 'Block 4, Varthur Main Road',
    village: 'Varthur',
    taluk: 'Mahadevapura',
    district: 'Bengaluru Urban',
    assignedPhc: 'Varthur Primary Health Centre (PHC)',
    lmp: '2025-09-01',
    edd: '2026-06-08',
    gravida: 2,
    parity: 1,
    abortions: 0,
    bloodGroup: 'B+',
    heightCm: 158,
    weightKg: 56,
    medicalCondition: 'Moderate Anemia (Hb 9.4 g/dL)',
    registrationDate: '2026-07-27',
    ashaWorkerName: 'Sanveeka Gowda (KA-ASHA-560087)',
    status: 'PENDING_DOCTOR_REVIEW',
    sentAt: '09:15 AM'
  },
  {
    id: 'JAN-KA-VTR-0043',
    ancNumber: 'RCH-982188',
    motherName: 'Deepa Kulkarni',
    dob: '2001-02-18',
    age: 25,
    husbandName: 'Prakash Kulkarni',
    mobile: '9741298765',
    address: 'Near Shiva Temple, Gunjur Village',
    village: 'Gunjur',
    taluk: 'Mahadevapura',
    district: 'Bengaluru Urban',
    assignedPhc: 'Varthur Primary Health Centre (PHC)',
    lmp: '2025-08-15',
    edd: '2026-05-22',
    gravida: 1,
    parity: 0,
    abortions: 0,
    bloodGroup: 'O+',
    heightCm: 152,
    weightKg: 50,
    medicalCondition: 'Normal / Regular Course',
    registrationDate: '2026-07-27',
    ashaWorkerName: 'Lakshmi N (KA-ASHA-560089)',
    status: 'EVALUATED_BY_DOCTOR',
    sentAt: '10:45 AM',
    doctorNotes: 'Vitals verified normal. Prescribed routine IFA and iron folic acid supplements.'
  },
  {
    id: 'JAN-KA-VTR-0044',
    ancNumber: 'RCH-982201',
    motherName: 'Shruthi Reddy',
    dob: '1998-11-20',
    age: 27,
    husbandName: 'Mahesh Reddy',
    mobile: '9900187654',
    address: 'Dommasandra Cross Road',
    village: 'Dommasandra',
    taluk: 'Sarjapur',
    district: 'Bengaluru Urban',
    assignedPhc: 'Varthur Primary Health Centre (PHC)',
    lmp: '2025-07-10',
    edd: '2026-04-17',
    gravida: 3,
    parity: 1,
    abortions: 1,
    bloodGroup: 'AB-',
    heightCm: 160,
    weightKg: 62,
    medicalCondition: 'High Risk: Gestational Hypertension (140/92 mmHg)',
    registrationDate: '2026-07-27',
    ashaWorkerName: 'Sanveeka Gowda (KA-ASHA-560087)',
    status: 'PENDING_DOCTOR_REVIEW',
    sentAt: '11:20 AM'
  }
];

export const LaborRoomDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'phc_model' | 'labor_ward'>('phc_model');
  const [phcList, setPhcList] = useState<PhcReferral[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_DOCTOR_REVIEW' | 'EVALUATED_BY_DOCTOR' | 'HIGH_RISK'>('ALL');
  const [selectedReviewMother, setSelectedReviewMother] = useState<PhcReferral | null>(null);
  const [evaluationNote, setEvaluationNote] = useState('');

  // Labor Dashboard States
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedLaborCaseId, setSelectedLaborCaseId] = useState<string | null>(null);

  const [deliveryForm, setDeliveryForm] = useState({
    deliveryMode: 'NORMAL_VAGINAL' as const,
    deliveryIndication: 'Spontaneous Normal Vaginal Delivery',
    estimatedBloodLossMl: 220,
    gender: 'FEMALE' as const,
    birthWeightKg: 2.95,
    apgarScore1Min: 8,
    apgarScore5Min: 9,
    bcgVaccineGiven: true,
    opv0Given: true,
    hepB0Given: true
  });
  const [submitting, setSubmitting] = useState(false);

  // Load PHC Queue from localStorage or seed initial
  const loadPhcQueue = () => {
    try {
      const stored = localStorage.getItem('janani360_phc_referrals');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          setPhcList(parsed);
          return;
        }
      }
      localStorage.setItem('janani360_phc_referrals', JSON.stringify(INITIAL_PHC_REFERRALS));
      setPhcList(INITIAL_PHC_REFERRALS);
    } catch (e) {
      setPhcList(INITIAL_PHC_REFERRALS);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await laborService.getLaborDashboard('fac-dh-hav');
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Error loading labor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhcQueue();
    fetchDashboard();
    const timer = setInterval(() => {
      loadPhcQueue();
      fetchDashboard();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = (id: string, newStatus: any, note?: string) => {
    const updated = phcList.map((m) =>
      m.id === id
        ? { ...m, status: newStatus, doctorNotes: note || m.doctorNotes || 'Case evaluated by PHC Medical Officer.' }
        : m
    );
    setPhcList(updated);
    localStorage.setItem('janani360_phc_referrals', JSON.stringify(updated));
    setSelectedReviewMother(null);
    setEvaluationNote('');
    alert(`✅ Maternal profile ${id} successfully marked as ${newStatus.replace(/_/g, ' ')}!`);
  };

  const handleTransferToHospitalAdmin = (mother: PhcReferral) => {
    // 1. Mark status as TRANSFERRED in PHC queue
    const updatedPhc = phcList.map((m) =>
      m.id === mother.id
        ? { ...m, status: 'TRANSFERRED_TO_HOSPITAL_ADMIN' as const, doctorNotes: m.doctorNotes || 'Emergency clinical referral initiated by PHC Medical Officer to District Hospital Administrator.' }
        : m
    );
    setPhcList(updatedPhc);
    localStorage.setItem('janani360_phc_referrals', JSON.stringify(updatedPhc));

    // 2. Generate and push real transfer object for Hospital Administrator Suite
    const existingTransfersRaw = localStorage.getItem('janani360_hospital_transfers');
    const existingTransfers = existingTransfersRaw ? JSON.parse(existingTransfersRaw) : [];

    const isEmergency = mother.medicalCondition && (mother.medicalCondition.toLowerCase().includes('risk') || mother.medicalCondition.toLowerCase().includes('anemia') || mother.medicalCondition.toLowerCase().includes('hypertension') || mother.medicalCondition.toLowerCase().includes('pph') || mother.medicalCondition.toLowerCase().includes('eclampsia'));
    
    const newTransfer = {
      id: `TRF-${Math.floor(10000 + Math.random() * 90000)}`,
      referralCode: mother.id,
      ancNumber: mother.ancNumber,
      motherName: mother.motherName,
      age: mother.age,
      mobile: mother.mobile,
      village: mother.village,
      originPhc: mother.assignedPhc || 'Varthur Primary Health Centre (PHC)',
      bloodGroup: mother.bloodGroup || 'O+',
      gravida: mother.gravida || 1,
      parity: mother.parity || 0,
      lmp: mother.lmp,
      edd: mother.edd,
      clinicalReason: mother.medicalCondition || 'High Risk Obstetric Observation Required',
      doctorNotes: mother.doctorNotes || 'Emergency clinical triage transfer initiated by PHC Medical Officer.',
      ashaWorkerName: mother.ashaWorkerName,
      triagePriority: isEmergency ? 'PRIORITY_1_EMERGENCY' : 'PRIORITY_2_OBSERVATION',
      etaMinutes: Math.floor(12 + Math.random() * 15),
      ambulanceUnit: {
        vehicleNumber: `KA-27-F-108${Math.floor(1 + Math.random() * 8)}`,
        driverName: ['Ramesh K.', 'Basava Lingad', 'Prakash M.', 'Suresh N.', 'Shivakumar T.'][Math.floor(Math.random() * 5)],
        driverPhone: '+919845088108',
        oxygenActive: isEmergency
      },
      reservedBed: {
        bedNumber: isEmergency ? `HDU-0${Math.floor(1 + Math.random() * 5)}` : `LDR-0${Math.floor(1 + Math.random() * 5)}`
      },
      transferTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      hospitalAdminStatus: 'EN_ROUTE',
      benefitScheme: 'JSY_PMMVY_VERIFIED'
    };

    // Replace if same referralCode already exists, or unshift to front
    const filtered = existingTransfers.filter((t: any) => t.referralCode !== mother.id);
    filtered.unshift(newTransfer);
    localStorage.setItem('janani360_hospital_transfers', JSON.stringify(filtered));

    alert(`🚑 EMERGENCY REFERRAL DISPATCHED!\n\nPatient ${mother.motherName} has been immediately transmitted to the District Health Administrator & Casualty ER Radar.\n108 Ambulance Unit: ${newTransfer.ambulanceUnit.vehicleNumber}\nAssigned Bed Triage: ${newTransfer.reservedBed.bedNumber}`);
  };

  const handleDeliverySubmit = async () => {
    if (!selectedLaborCaseId) return;
    setSubmitting(true);
    try {
      const res = await laborService.recordDelivery({
        laborCaseId: selectedLaborCaseId,
        deliveryMode: deliveryForm.deliveryMode,
        deliveryIndication: deliveryForm.deliveryIndication,
        estimatedBloodLossMl: deliveryForm.estimatedBloodLossMl,
        child: {
          gender: deliveryForm.gender,
          birthWeightKg: deliveryForm.birthWeightKg,
          apgarScore1Min: deliveryForm.apgarScore1Min,
          apgarScore5Min: deliveryForm.apgarScore5Min,
          bcgVaccineGiven: deliveryForm.bcgVaccineGiven,
          opv0Given: deliveryForm.opv0Given,
          hepB0Given: deliveryForm.hepB0Given
        }
      });

      if (res.success) {
        setShowDeliveryModal(false);
        fetchDashboard();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to log delivery');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter & search logic for line by line table
  const filteredPhcList = useMemo(() => {
    return phcList.filter((m) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        m.motherName.toLowerCase().includes(query) ||
        m.id.toLowerCase().includes(query) ||
        m.mobile.includes(query) ||
        m.village.toLowerCase().includes(query) ||
        (m.ashaWorkerName && m.ashaWorkerName.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'PENDING_DOCTOR_REVIEW') return m.status === 'PENDING_DOCTOR_REVIEW';
      if (statusFilter === 'EVALUATED_BY_DOCTOR') return m.status === 'EVALUATED_BY_DOCTOR';
      if (statusFilter === 'HIGH_RISK') {
        return (
          m.medicalCondition &&
          (m.medicalCondition.toLowerCase().includes('risk') ||
            m.medicalCondition.toLowerCase().includes('anemia') ||
            m.medicalCondition.toLowerCase().includes('hypertension'))
        );
      }
      return true;
    });
  }, [phcList, searchQuery, statusFilter]);

  const pendingCount = phcList.filter((m) => m.status === 'PENDING_DOCTOR_REVIEW').length;
  const evaluatedCount = phcList.filter((m) => m.status === 'EVALUATED_BY_DOCTOR').length;
  const highRiskCount = phcList.filter(
    (m) =>
      m.medicalCondition &&
      (m.medicalCondition.toLowerCase().includes('risk') ||
        m.medicalCondition.toLowerCase().includes('anemia') ||
        m.medicalCondition.toLowerCase().includes('hypertension'))
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      {/* Header Band */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {t('laborWard.govBadge')}
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                {t('laborWard.headerTitle')}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                {t('laborWard.headerSubtitle')}
              </p>
            </div>
          </div>

          {/* Master View Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('phc_model')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-2 ${
                activeTab === 'phc_model'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              {t('laborWard.tabPhcModel')} ({phcList.length} Mothers)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('labor_ward')}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-2 ${
                activeTab === 'labor_ward'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Baby className="w-4 h-4" />
              2. Active Labor Room &amp; Wards
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'phc_model' ? (
          /* ==================================================================== */
          /* TAB 1: PRIMARY HEALTH CARE (PHC) MEDICAL OFFICER MODEL (LINE BY LINE) */
          /* ==================================================================== */
          <div className="space-y-6 animate-fade-in">
            {/* KPI Overview Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('laborWard.totalAshaReferrals')}</span>
                  <div className="text-2xl font-black text-white">{phcList.length}</div>
                  <span className="text-[10px] text-emerald-400 font-medium">⚡ Live sync via ASHA Acknowledgement</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <UserPlus className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t('laborWard.pendingReview')}</span>
                  <div className="text-2xl font-black text-amber-300">{pendingCount}</div>
                  <span className="text-[10px] text-slate-400">Requires Doctor verification</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">High Risk / Urgent Cases</span>
                  <div className="text-2xl font-black text-red-300">{highRiskCount}</div>
                  <span className="text-[10px] text-red-400 font-semibold">Anemia / Hypertension identified</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl shadow-xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Doctor Evaluated</span>
                  <div className="text-2xl font-black text-emerald-300">{evaluatedCount}</div>
                  <span className="text-[10px] text-slate-400">Approved for scheduled care</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Search and Line-by-Line Filter Controls */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Mother Name, Unique ID, Mobile, or ASHA Worker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filter:
                </span>
                {(['ALL', 'PENDING_DOCTOR_REVIEW', 'EVALUATED_BY_DOCTOR', 'HIGH_RISK'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                      statusFilter === tab
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {tab === 'ALL' && 'All Mothers'}
                    {tab === 'PENDING_DOCTOR_REVIEW' && 'Pending Review'}
                    {tab === 'EVALUATED_BY_DOCTOR' && 'Evaluated'}
                    {tab === 'HIGH_RISK' && '⚠️ High Risk'}
                  </button>
                ))}
              </div>
            </div>

            {/* Professional Line-by-Line Medical Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Line-by-Line ASHA Worker Maternal Case Roster ({filteredPhcList.length} Records)
                </h2>
                <span className="text-xs text-slate-400 font-mono">Real-time PHC Doctor Sync Enabled</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-black uppercase tracking-wider text-[11px]">
                      <th className="p-4 w-12">#</th>
                      <th className="p-4">Mother Profile &amp; Unique ID</th>
                      <th className="p-4">Age / Contact &amp; Village</th>
                      <th className="p-4">Obstetric Score (G-P-A) &amp; Stats</th>
                      <th className="p-4">LMP / EDD Timeline</th>
                      <th className="p-4">AI Risk &amp; Clinical Condition</th>
                      <th className="p-4">Referred By (ASHA)</th>
                      <th className="p-4 text-center">Medical Officer Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                    {filteredPhcList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-12 text-center text-slate-500 font-semibold">
                          No maternal cases found matching your criteria in the Primary Health Care (PHC) Model.
                        </td>
                      </tr>
                    ) : (
                      filteredPhcList.map((motherItem, idx) => {
                        const isHighRisk =
                          motherItem.medicalCondition &&
                          (motherItem.medicalCondition.toLowerCase().includes('risk') ||
                            motherItem.medicalCondition.toLowerCase().includes('anemia') ||
                            motherItem.medicalCondition.toLowerCase().includes('hypertension'));

                        return (
                          <tr key={motherItem.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="p-4 font-mono font-bold text-slate-500">{idx + 1}</td>
                            <td className="p-4 space-y-1">
                              <div className="font-black text-white text-sm group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                                <span>{motherItem.motherName}</span>
                                {isHighRisk && (
                                  <span title="High Risk Clinical Condition">
                                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0 inline" />
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                <span className="font-mono bg-slate-950 px-2 py-0.5 rounded text-emerald-400 border border-slate-800 font-bold">
                                  {motherItem.id}
                                </span>
                                <span className="text-slate-400 font-mono">ANC: {motherItem.ancNumber || 'RCH-Pending'}</span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Husband: <span className="text-slate-300 font-semibold">{motherItem.husbandName}</span>
                              </div>
                            </td>

                            <td className="p-4 space-y-1">
                              <div>
                                <span className="font-bold text-white">{motherItem.age} yrs</span>
                                <span className="text-[11px] text-slate-400"> ({motherItem.dob || 'DOB N/A'})</span>
                              </div>
                              <div className="font-mono font-bold text-emerald-400 text-xs">📞 {motherItem.mobile}</div>
                              <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                                📍 {motherItem.village} ({motherItem.assignedPhc})
                              </div>
                            </td>

                            <td className="p-4 space-y-1 font-mono">
                              <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded text-center inline-block font-black text-emerald-300">
                                G{motherItem.gravida || 1} P{motherItem.parity || 0} A{motherItem.abortions || 0}
                              </div>
                              <div className="text-slate-300 text-[11px] block">
                                Blood Group: <span className="text-teal-400 font-bold">{motherItem.bloodGroup || 'O+'}</span>
                              </div>
                              <div className="text-slate-400 text-[11px]">
                                Ht/Wt: {motherItem.heightCm || 154}cm / {motherItem.weightKg || 52}kg
                              </div>
                            </td>

                            <td className="p-4 space-y-1 font-mono text-[11px]">
                              <div>
                                <span className="text-slate-500 font-semibold uppercase block text-[9px]">LMP Date:</span>
                                <span className="text-slate-200 font-bold">{motherItem.lmp || 'N/A'}</span>
                              </div>
                              <div className="pt-0.5 border-t border-slate-800/80">
                                <span className="text-emerald-500 font-semibold uppercase block text-[9px]">
                                  Expected Delivery (EDD):
                                </span>
                                <span className="text-teal-300 font-black">{motherItem.edd || 'N/A'}</span>
                              </div>
                            </td>

                            <td className="p-4">
                              <div className="space-y-1.5 max-w-[200px]">
                                {isHighRisk ? (
                                  <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 border border-red-500/40 font-bold text-[11px] px-2.5 py-1 rounded-xl">
                                    <AlertTriangle className="w-3 h-3 shrink-0 text-red-400" />
                                    {motherItem.medicalCondition}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px] px-2.5 py-1 rounded-xl">
                                    <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-400" />
                                    {motherItem.medicalCondition || 'Normal Course'}
                                  </span>
                                )}
                                {motherItem.doctorNotes && (
                                  <p className="text-[10px] text-slate-400 italic leading-snug bg-slate-950 p-1.5 rounded border border-slate-800">
                                    "Doctor Note: {motherItem.doctorNotes}"
                                  </p>
                                )}
                              </div>
                            </td>

                            <td className="p-4 space-y-0.5 text-xs">
                              <span className="font-bold text-white block">{motherItem.ashaWorkerName}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">Date: {motherItem.registrationDate}</span>
                              {motherItem.sentAt && (
                                <span className="text-[10px] text-teal-400 font-mono block">Sent: {motherItem.sentAt}</span>
                              )}
                            </td>

                            <td className="p-4 text-center">
                              <div className="flex flex-col gap-2 items-center justify-center">
                                {motherItem.status === 'PENDING_DOCTOR_REVIEW' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedReviewMother(motherItem);
                                      setEvaluationNote('Clinical indicators reviewed. Vitals stable, IFA supplements advised.');
                                    }}
                                    className="w-full px-3 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-[11px] rounded-xl shadow-md transition flex items-center justify-center gap-1"
                                  >
                                    <Stethoscope className="w-3.5 h-3.5" />
                                    Evaluate Case
                                  </button>
                                ) : (
                                  <div className="w-full py-1.5 px-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl font-black text-[11px] flex items-center justify-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    Verified &amp; Evaluated
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(motherItem.id, 'ADMITTED_TO_WARD')}
                                  className="w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-[11px] rounded-xl border border-slate-700 transition flex items-center justify-center gap-1"
                                >
                                  <Building2 className="w-3 h-3 text-emerald-400" />
                                  Admit to Ward
                                </button>

                                {motherItem.status !== 'TRANSFERRED_TO_HOSPITAL_ADMIN' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleTransferToHospitalAdmin(motherItem)}
                                    className="w-full px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-[11px] rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-1.5 transform active:scale-95"
                                  >
                                    <Ambulance className="w-3.5 h-3.5 animate-pulse shrink-0" />
                                    <span>Transfer to Hospital Admin (108 ER)</span>
                                  </button>
                                ) : (
                                  <div className="w-full py-1.5 px-2 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl font-black text-[10px] flex items-center justify-center gap-1 shadow-inner">
                                    <Ambulance className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                    <span>Transferred to Hospital Admin ER</span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-center text-xs text-slate-400">
                Primary Health Centre (PHC) Medical Officer Roster · Real-Time ASHA Integration · Govt of Karnataka RCH Portal
              </div>
            </div>

            {/* Medical Evaluation Dialog Modal */}
            {selectedReviewMother && (
              <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Stethoscope className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">PHC Medical Officer Evaluation</h3>
                        <p className="text-xs text-slate-400">Validate maternal vitals &amp; record clinical direction.</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setSelectedReviewMother(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-white text-sm">
                      <span>{selectedReviewMother.motherName}</span>
                      <span className="font-mono text-emerald-400">{selectedReviewMother.id}</span>
                    </div>
                    <div className="text-slate-400">
                      Age: <strong className="text-slate-200">{selectedReviewMother.age} yrs</strong> | Village:{' '}
                      <strong className="text-slate-200">{selectedReviewMother.village}</strong> | Mobile:{' '}
                      <strong className="text-slate-200 font-mono">{selectedReviewMother.mobile}</strong>
                    </div>
                    <div className="text-slate-400 font-mono">
                      Obstetrics:{' '}
                      <strong className="text-emerald-400">
                        G{selectedReviewMother.gravida} P{selectedReviewMother.parity} A{selectedReviewMother.abortions}
                      </strong>{' '}
                      | EDD: <strong className="text-teal-400">{selectedReviewMother.edd}</strong>
                    </div>
                    {selectedReviewMother.medicalCondition && (
                      <div className="pt-2 border-t border-slate-900 text-amber-300 font-semibold flex items-center gap-1.5">
                        <span>AI Condition Flag: {selectedReviewMother.medicalCondition}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Medical Officer Clinical Prescription &amp; Remarks:
                    </label>
                    <textarea
                      rows={3}
                      value={evaluationNote}
                      onChange={(e) => setEvaluationNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      placeholder="Enter clinical assessment, dietary guidance, or required hospital follow-up..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedReviewMother(null)}
                      className="w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedReviewMother.id, 'EVALUATED_BY_DOCTOR', evaluationNote)}
                      className="w-1/2 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
                    >
                      Verify &amp; Save Evaluation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ==================================================================== */
          /* TAB 2: ACTIVE LABOR ROOM WARD & HOSPITAL DELIVERY DASHBOARD         */
          /* ==================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Active Labor Cases Column */}
            <div className="lg:col-span-2 space-y-6">
              {!dashboardData?.activeLaborCases || dashboardData.activeLaborCases.length === 0 ? (
                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 text-xs font-medium">
                  No mothers currently admitted in active labor rooms. Promote evaluated mothers from the PHC Doctor Model to start partograph monitoring.
                </div>
              ) : (
                dashboardData.activeLaborCases.map((lc: any) => {
                  const child = lc.deliveryRecord?.childProfiles?.[0];

                  return (
                    <div
                      key={lc.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
                    >
                      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-slate-100">{lc.mother?.fullName}</h2>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                              Room: {lc.laborRoomNumber}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">RCH: {lc.mother?.rchId}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase font-mono">
                            {lc.laborStatus}
                          </span>

                          {lc.laborStatus !== 'POSTPARTUM_OBSERVATION' && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLaborCaseId(lc.id);
                                setShowDeliveryModal(true);
                              }}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                            >
                              <Baby className="w-4 h-4" /> Log Hospital Delivery
                            </button>
                          )}
                        </div>
                      </div>

                      {/* WHO Partograph Chart */}
                      <WhoPartographChart observations={lc.partographEntries || []} />

                      {/* Delivered Newborn Details */}
                      {child && (
                        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                              <Baby className="w-4 h-4 text-emerald-400" />
                              {child.fullName} (Gender: {child.gender})
                            </span>
                            <span className="font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-0.5 rounded">
                              RCH: {child.childRchId}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono">
                            <span>Weight: <strong>{child.birthWeightKg} kg</strong></span>
                            <span>•</span>
                            <span>APGAR: <strong>{child.apgarScore1Min}/{child.apgarScore5Min}</strong></span>
                            <span>•</span>
                            <span>Vaccines: <strong>BCG ✓ | OPV-0 ✓ | HepB-0 ✓</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Info & Guidelines Side Panel */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Karnataka Labor Ward &amp; PHC Guidelines
                </h3>
                <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>Every mother transmitted via ASHA Acknowledgement requires Medical Officer digital validation within 24 hours.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>WHO Partograph activation mandatory when cervical dilation &ge; 4cm upon hospital ward admission.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>Administer AMTSL Oxytocin 10 IU within 1 min of delivery &amp; log all birth vaccine doses.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Log Delivery Modal */}
        {showDeliveryModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
              <button onClick={() => setShowDeliveryModal(false)} className="absolute top-5 right-5 text-slate-400">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Baby className="w-5 h-5 text-emerald-400" /> Log Delivery &amp; Create Child RCH ID
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Delivery Mode</label>
                  <select
                    value={deliveryForm.deliveryMode}
                    onChange={(e: any) => setDeliveryForm({ ...deliveryForm, deliveryMode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                  >
                    <option value="NORMAL_VAGINAL">Normal Vaginal Delivery</option>
                    <option value="LSCS_EMERGENCY">Emergency LSCS</option>
                    <option value="ASSISTED_VACUUM">Assisted Vacuum Delivery</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Newborn Gender</label>
                    <select
                      value={deliveryForm.gender}
                      onChange={(e: any) => setDeliveryForm({ ...deliveryForm, gender: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    >
                      <option value="FEMALE">Female (Baby Girl)</option>
                      <option value="MALE">Male (Baby Boy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Birth Weight (kg)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={deliveryForm.birthWeightKg}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, birthWeightKg: parseFloat(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-emerald-300">
                  ⚡ Auto-generates Child RCH ID (129004812749-C1) &amp; schedules 6 HBNC visits for ASHA worker.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeliveryModal(false)}
                  className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleDeliverySubmit}
                  className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold"
                >
                  {submitting ? 'Logging...' : 'Confirm Delivery'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LaborRoomDashboardPage;
