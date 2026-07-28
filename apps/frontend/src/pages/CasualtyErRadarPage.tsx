import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Ambulance, 
  Clock, 
  Building2, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Heart,
  Activity,
  FileText,
  Printer,
  Download,
  Share2,
  Stethoscope,
  Syringe,
  QrCode,
  Search,
  Filter,
  Check,
  Award,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Bed,
  Droplets,
  Zap
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

interface HospitalTransfer {
  id: string;
  referralCode: string;
  ancNumber: string;
  motherName: string;
  age: number | string;
  mobile: string;
  village: string;
  originPhc: string;
  bloodGroup: string;
  gravida: number | string;
  parity: number | string;
  lmp?: string;
  edd?: string;
  clinicalReason: string;
  doctorNotes: string;
  ashaWorkerName: string;
  triagePriority: 'PRIORITY_1_EMERGENCY' | 'PRIORITY_2_OBSERVATION';
  etaMinutes: number;
  ambulanceUnit: {
    vehicleNumber: string;
    driverName: string;
    driverPhone: string;
    oxygenActive?: boolean;
  };
  reservedBed: {
    bedNumber: string;
  };
  transferTimestamp: string;
  hospitalAdminStatus: 'EN_ROUTE' | 'BED_LOCKED' | 'ADMITTED_IN_WARD' | 'DISCHARGED';
  benefitScheme: string;
  dhoEscalated?: boolean;
}

const INITIAL_TRANSFERS: HospitalTransfer[] = [
  {
    id: 'TRF-84192',
    referralCode: 'JAN-KA-VTR-0042',
    ancNumber: 'RCH-982140',
    motherName: 'Meenakshi Sundaram',
    age: 26,
    mobile: '+91 98450 67123',
    village: 'Somwarpet Village',
    originPhc: 'Varthur Primary Health Centre (PHC)',
    bloodGroup: 'O+',
    gravida: 2,
    parity: 1,
    lmp: '2025-10-15',
    edd: '2026-07-22',
    clinicalReason: 'Severe Pre-Eclampsia (BP 168/112 mmHg, Proteinuria +++)',
    doctorNotes: 'Emergency IV MgSO4 4g loading dose administered at PHC per NHM protocols. Imminent seizure risk. Requires immediate Obstetric ICU admission and constant fetal telemetry.',
    ashaWorkerName: 'Sanveeka Gowda (ASHA Facilitator)',
    triagePriority: 'PRIORITY_1_EMERGENCY',
    etaMinutes: 14,
    ambulanceUnit: {
      vehicleNumber: 'KA-27-F-1084',
      driverName: 'Ramesh K.',
      driverPhone: '+91 98450 88108',
      oxygenActive: true
    },
    reservedBed: {
      bedNumber: 'ICU-02'
    },
    transferTimestamp: '03:42 PM',
    hospitalAdminStatus: 'EN_ROUTE',
    benefitScheme: 'JSY_PMMVY_VERIFIED'
  },
  {
    id: 'TRF-84195',
    referralCode: 'JAN-KA-VTR-0089',
    ancNumber: 'RCH-774120',
    motherName: 'Kavitha R.',
    age: 22,
    mobile: '+91 97410 22314',
    village: 'Hoskote Outpost',
    originPhc: 'Hoskote Primary Health Centre (PHC)',
    bloodGroup: 'B-',
    gravida: 1,
    parity: 0,
    lmp: '2025-11-02',
    edd: '2026-08-09',
    clinicalReason: 'Severe Anemia (Hb 6.8 g/dL) with Moderate Fatigue',
    doctorNotes: 'IFA injection regimen started at PHC. Recommended hospital High Dependency Unit for packed red blood cell (PRBC) transfusion assessment prior to labor initiation.',
    ashaWorkerName: 'Manjula G. (ASHA Worker)',
    triagePriority: 'PRIORITY_2_OBSERVATION',
    etaMinutes: 28,
    ambulanceUnit: {
      vehicleNumber: 'KA-27-F-1089',
      driverName: 'Basava Lingad',
      driverPhone: '+91 98450 12879',
      oxygenActive: false
    },
    reservedBed: {
      bedNumber: 'HDU-04'
    },
    transferTimestamp: '03:15 PM',
    hospitalAdminStatus: 'BED_LOCKED',
    benefitScheme: 'JSY_PMMVY_VERIFIED'
  },
  {
    id: 'TRF-84198',
    referralCode: 'JAN-KA-VTR-0105',
    ancNumber: 'RCH-331209',
    motherName: 'Sunitha M.',
    age: 29,
    mobile: '+91 99012 55431',
    village: 'Whitefield Peripheral',
    originPhc: 'Varthur Primary Health Centre (PHC)',
    bloodGroup: 'AB+',
    gravida: 3,
    parity: 2,
    lmp: '2025-10-01',
    edd: '2026-07-08',
    clinicalReason: 'Obstructed Labor Initial Signs (Cervical Dilatation Plateau 6cm)',
    doctorNotes: 'Partograph alerts crossed action line at hour 4. Vacuum assisted or emergency C-Section standby team required immediately upon arrival.',
    ashaWorkerName: 'Sanveeka Gowda (ASHA Facilitator)',
    triagePriority: 'PRIORITY_1_EMERGENCY',
    etaMinutes: 6,
    ambulanceUnit: {
      vehicleNumber: 'KA-27-F-1081',
      driverName: 'Suresh N.',
      driverPhone: '+91 98450 99421',
      oxygenActive: true
    },
    reservedBed: {
      bedNumber: 'ICU-01'
    },
    transferTimestamp: '03:50 PM',
    hospitalAdminStatus: 'EN_ROUTE',
    benefitScheme: 'JSY_PMMVY_VERIFIED'
  }
];

interface BedResource {
  id: string;
  bedNumber: string;
  ward: 'ICU' | 'HDU' | 'LDR';
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE';
  patientName?: string;
  condition?: string;
  ventilatorActive?: boolean;
}

const INITIAL_BEDS: BedResource[] = [
  { id: 'b1', bedNumber: 'ICU-01', ward: 'ICU', status: 'RESERVED', patientName: 'Sunitha M. (En Route)', condition: 'Obstructed Labor', ventilatorActive: true },
  { id: 'b2', bedNumber: 'ICU-02', ward: 'ICU', status: 'RESERVED', patientName: 'Meenakshi Sundaram', condition: 'Severe Pre-Eclampsia', ventilatorActive: true },
  { id: 'b3', bedNumber: 'ICU-03', ward: 'ICU', status: 'AVAILABLE' },
  { id: 'b4', bedNumber: 'ICU-04', ward: 'ICU', status: 'OCCUPIED', patientName: 'Deepa K.', condition: 'Post-C Section Recovery', ventilatorActive: false },
  { id: 'b5', bedNumber: 'ICU-05', ward: 'ICU', status: 'AVAILABLE' },
  { id: 'b6', bedNumber: 'ICU-06', ward: 'ICU', status: 'MAINTENANCE' },
  { id: 'b7', bedNumber: 'HDU-01', ward: 'HDU', status: 'AVAILABLE' },
  { id: 'b8', bedNumber: 'HDU-02', ward: 'HDU', status: 'OCCUPIED', patientName: 'Radha V.', condition: 'Gestational Diabetes Triage' },
  { id: 'b9', bedNumber: 'HDU-03', ward: 'HDU', status: 'AVAILABLE' },
  { id: 'b10', bedNumber: 'HDU-04', ward: 'HDU', status: 'RESERVED', patientName: 'Kavitha R. (En Route)', condition: 'Severe Anemia Transfusion' },
  { id: 'b11', bedNumber: 'HDU-05', ward: 'HDU', status: 'AVAILABLE' },
  { id: 'b12', bedNumber: 'HDU-06', ward: 'HDU', status: 'AVAILABLE' },
  { id: 'b13', bedNumber: 'LDR-01', ward: 'LDR', status: 'OCCUPIED', patientName: 'Shweta P.', condition: 'Active Labor Phase' },
  { id: 'b14', bedNumber: 'LDR-02', ward: 'LDR', status: 'AVAILABLE' },
  { id: 'b15', bedNumber: 'LDR-03', ward: 'LDR', status: 'AVAILABLE' },
  { id: 'b16', bedNumber: 'LDR-04', ward: 'LDR', status: 'OCCUPIED', patientName: 'Anju B.', condition: 'Normal Delivery Monitoring' },
  { id: 'b17', bedNumber: 'LDR-05', ward: 'LDR', status: 'AVAILABLE' },
  { id: 'b18', bedNumber: 'LDR-06', ward: 'LDR', status: 'AVAILABLE' }
];

export const CasualtyErRadarPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'referrals_radar' | 'bed_matrix' | 'blood_bank' | 'audit_analytics'>('referrals_radar');
  const [transfers, setTransfers] = useState<HospitalTransfer[]>([]);
  const [beds, setBeds] = useState<BedResource[]>(INITIAL_BEDS);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bedWardFilter, setBedWardFilter] = useState<string>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<HospitalTransfer | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync transfers from localStorage or initialize from seed
  const loadTransfers = () => {
    try {
      const stored = localStorage.getItem('janani360_hospital_transfers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setTransfers(parsed);
          return;
        }
      }
      localStorage.setItem('janani360_hospital_transfers', JSON.stringify(INITIAL_TRANSFERS));
      setTransfers(INITIAL_TRANSFERS);
    } catch (err) {
      console.error('Error loading Hospital Admin transfers:', err);
      setTransfers(INITIAL_TRANSFERS);
    }
  };

  useEffect(() => {
    loadTransfers();
    // Auto sync timer to listen to PHC doctor submissions
    const timer = setInterval(() => {
      loadTransfers();
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadTransfers();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleStatusUpdate = (id: string, newStatus: 'EN_ROUTE' | 'BED_LOCKED' | 'ADMITTED_IN_WARD' | 'DISCHARGED') => {
    const updated = transfers.map(t => t.id === id ? { ...t, hospitalAdminStatus: newStatus } : t);
    setTransfers(updated);
    localStorage.setItem('janani360_hospital_transfers', JSON.stringify(updated));
    alert(`✅ Hospital Administrator records updated:\n\nPatient transfer ${id} successfully marked as ${newStatus.replace(/_/g, ' ')}!`);
  };

  const handleEscalateToDho = (item: HospitalTransfer) => {
    // 1. Mark as escalated in local transfers state & storage
    const updated = transfers.map(t => t.id === item.id ? { ...t, dhoEscalated: true } : t);
    setTransfers(updated);
    localStorage.setItem('janani360_hospital_transfers', JSON.stringify(updated));

    // 2. Push to DHO escalations registry in localStorage
    const existingRaw = localStorage.getItem('janani360_dho_escalations');
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    
    const escalationRecord = {
      ...item,
      dhoEscalated: true,
      escalationTimestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      escalatedBy: 'Haveri District Hospital Medical ER Admin (108 Command)',
      requestedSupport: 'Specialized Medical College Air/Ambulance Evacuation & ₹25,000 State CM Critical Relief Grant',
      dhoActionStatus: 'PENDING_DHO_REVIEW'
    };

    const filtered = existing.filter((e: any) => e.id !== item.id);
    filtered.unshift(escalationRecord);
    localStorage.setItem('janani360_dho_escalations', JSON.stringify(filtered));

    alert(`🚨 EMERGENCY ESCALATION TRANSMITTED TO DHO!\n\nPatient ${item.motherName} (${item.ancNumber}) has been explicitly escalated to the District Health Officer (DHO) Command Suite for specialized high-risk state intervention & financial grant approval.`);
  };

  const handleBedClick = (bed: BedResource) => {
    if (bed.status === 'AVAILABLE') {
      alert(`🏥 Ward Bed ${bed.bedNumber} (${bed.ward} Unit)\nStatus: AVAILABLE\nReady for emergency patient allocation upon 108 ambulance arrival.`);
    } else {
      alert(`🏥 Ward Bed ${bed.bedNumber} (${bed.ward} Unit)\nStatus: ${bed.status}\nAssigned Patient: ${bed.patientName || 'N/A'}\nClinical Status: ${bed.condition || 'Monitoring'}\nVentilator / Telemetry Active: ${bed.ventilatorActive ? 'YES' : 'NO'}`);
    }
  };

  const handleBloodReserve = (bloodGroup: string) => {
    alert(`🩸 EMERGENCY BLOOD RESERVE TRIGGERED!\n\nReserved 2 Units of Packed Red Blood Cells (PRBC) and Fresh Frozen Plasma (FFP) for Blood Group [${bloodGroup}].\nBlood Bank Technicians alerted in Haveri Medical Depot.`);
  };

  const handleDownloadReport = () => {
    alert(`📥 DOWNLOADING EXECUTIVE HEALTH ADMINISTRATOR AUDIT...\n\nGenerated comprehensive Government compliance matrix including:\n• Real-Time PHC Referral Logs (${transfers.length} records)\n• WHO 3-Delay Bottleneck Velocity Metrics\n• JSY / PMMVY Direct Benefit Verification Roster\n\nFormat: Official Signed PDF & CSV exported.`);
  };

  const filteredTransfers = transfers.filter(item => {
    const matchesPriority = filterPriority === 'ALL' ? true : item.triagePriority === filterPriority;
    const matchesSearch = item.motherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ancNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.originPhc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const filteredBeds = beds.filter(b => {
    if (bedWardFilter === 'ALL') return true;
    return b.ward === bedWardFilter;
  });

  const activeEnRouteCount = transfers.filter(t => t.hospitalAdminStatus === 'EN_ROUTE').length;
  const lockedBedCount = transfers.filter(t => t.hospitalAdminStatus === 'BED_LOCKED' || t.hospitalAdminStatus === 'ADMITTED_IN_WARD').length;
  const availableBedCount = beds.filter(b => b.status === 'AVAILABLE').length;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans pb-16">
      <Navbar />

      {/* Top Health Administrator Command Header */}
      <header className="border-b border-slate-800 bg-slate-900/85 sticky top-0 z-40 backdrop-blur-md px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-500/25 animate-pulse shrink-0">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  District Health Administrator Command Suite &amp; Casualty ER Radar
                </h1>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 hidden sm:inline-block shadow-sm">
                  PHC DIRECT SYNC ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                ಹಾವೇರಿ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಜಿಲ್ಲാ ಆಸ್ಪತ್ರೆ ತುರ್ತು ನಿಗಾ ಘಟಕ (Haveri District Hospital Medical Administration Portal)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleManualRefresh}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 shadow-md active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync PHC Telemetry</span>
            </button>
            <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black px-3.5 py-2 rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
              Live ER Command Active
            </span>
          </div>
        </div>
      </header>

      {/* Top Telemetry Stat KPI Bar */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-2xl border border-red-500/35 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Active PHC Referrals En Route</span>
              <div className="text-3xl font-black text-white">{activeEnRouteCount} <span className="text-xs text-red-400 font-bold">Priority 1 &amp; 2</span></div>
              <p className="text-[10px] text-slate-400">Direct transmission from ASHA &amp; PHC Doctors</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Ambulance className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-2xl border border-emerald-500/35 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Available ER &amp; ICU Beds</span>
              <div className="text-3xl font-black text-white">{availableBedCount} <span className="text-xs text-emerald-400 font-bold">/ 18 Specialized</span></div>
              <p className="text-[10px] text-slate-400">ICU, High Dependency (HDU) &amp; LDR Suites</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Bed className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-2xl border border-cyan-500/35 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Blood Bank Reserve Depot</span>
              <div className="text-3xl font-black text-white">48 Units <span className="text-xs text-cyan-400 font-bold">Ready</span></div>
              <p className="text-[10px] text-slate-400">O- &amp; PRBC reserves unlocked for hemorrhage</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-2xl border border-amber-500/35 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Door-to-Triage Velocity</span>
              <div className="text-3xl font-black text-white font-mono">&lt; 5.2m <span className="text-xs text-amber-400 font-bold">Avg</span></div>
              <p className="text-[10px] text-emerald-400 font-bold">✓ Zero-Delay WHO 3-Delay Target Achieved</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Module Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('referrals_radar')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'referrals_radar' ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Ambulance className="w-4 h-4 text-white animate-bounce" />
              <span>1. Live PHC Referral Radar ({transfers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bed_matrix')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'bed_matrix' ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bed className="w-4 h-4 text-white" />
              <span>2. ICU &amp; HDU Bed Resource Grid</span>
            </button>
            <button
              onClick={() => setActiveTab('blood_bank')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'blood_bank' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Droplets className="w-4 h-4 text-white" />
              <span>3. Blood Bank &amp; Specialist Roster</span>
            </button>
            <button
              onClick={() => setActiveTab('audit_analytics')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'audit_analytics' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className={`w-4 h-4 ${activeTab === 'audit_analytics' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>4. WHO 3-Delay &amp; JSY Benefit Audit</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-2 text-xs font-mono text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ABDM National Interoperability Ready</span>
          </div>
        </div>

        {/* TAB 1: LIVE PHC REFERRAL RADAR (DIRECT PHC CONNECTION) */}
        {activeTab === 'referrals_radar' && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                  <Ambulance className="w-6 h-6 text-red-400 animate-pulse" />
                  <span>Incoming 108 Emergency Referrals from Primary Health Centers (PHCs)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Bi-directional synchronization with ASHA field workers and PHC Medical Officers. Accept transfers to lock ER beds instantly.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search box */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search patient, PHC, village..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition shadow-inner"
                  />
                </div>

                {/* Priority filter */}
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:border-red-500 transition shadow-inner"
                >
                  <option value="ALL">All Triage Priorities</option>
                  <option value="PRIORITY_1_EMERGENCY">Priority 1 (High Risk Emergency)</option>
                  <option value="PRIORITY_2_OBSERVATION">Priority 2 (Obstetric Observation)</option>
                </select>
              </div>
            </div>

            {filteredTransfers.length === 0 ? (
              <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                <h3 className="text-base font-bold text-slate-200">No matching PHC referral transfers currently en route</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When a PHC Medical Officer clicks "Transfer to Hospital Admin (108 ER Command)", the patient records immediately synchronize into this live administrative queue.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransfers.map((item) => {
                  const isP1 = item.triagePriority === 'PRIORITY_1_EMERGENCY';
                  const isLocked = item.hospitalAdminStatus === 'BED_LOCKED';
                  const isAdmitted = item.hospitalAdminStatus === 'ADMITTED_IN_WARD';

                  return (
                    <div
                      key={item.id}
                      className={`bg-gradient-to-r ${
                        isP1 
                          ? 'from-slate-900 via-slate-900/95 to-red-950/30 border-red-500/45 hover:border-red-500' 
                          : 'from-slate-900 via-slate-900/90 to-slate-900 border-amber-500/35 hover:border-amber-400'
                      } border-2 rounded-3xl p-6 shadow-2xl transition-all space-y-5 group`}
                    >
                      {/* Top Bar of Card */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-lg shrink-0 ${
                            isP1 ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse' : 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                          }`}>
                            <Ambulance className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="text-lg font-black text-white tracking-tight">{item.motherName}</span>
                              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 shadow-sm">
                                Age {item.age} · G{item.gravida || 1} P{item.parity || 0}
                              </span>
                              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30">
                                Blood Group: {item.bloodGroup || 'O+'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                              <span>ANC ID: <strong className="text-white font-mono">{item.ancNumber}</strong></span>
                              <span className="text-slate-700">•</span>
                              <span>Village: <strong className="text-slate-200">{item.village}</strong></span>
                              <span className="text-slate-700">•</span>
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>ABDM Record Verified</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status & ETA Badge */}
                        <div className="flex items-center gap-4 text-right">
                          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">108 Ambulance ETA</div>
                            <div className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5 justify-end">
                              <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                              <span>{item.etaMinutes || 15} Mins</span>
                            </div>
                            <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
                              Assigned Ward: {item.reservedBed?.bedNumber || 'HDU-01'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Clinical Reason & PHC Connection Details */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90 shadow-inner">
                        <div className="lg:col-span-6 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            <span>Clinical Diagnosis &amp; Emergency Trigger:</span>
                          </div>
                          <p className="text-sm font-extrabold text-white leading-snug">
                            {item.clinicalReason}
                          </p>
                          <div className="text-xs text-slate-300 italic leading-relaxed pt-1 border-t border-slate-850">
                            <span className="font-bold text-teal-300 not-italic">PHC Doctor Evaluation Note: </span>
                            "{item.doctorNotes}"
                          </div>
                        </div>

                        <div className="lg:col-span-6 space-y-2.5 text-xs text-slate-300 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-5">
                          <div className="flex justify-between items-center pb-1 border-b border-slate-850">
                            <span className="text-slate-400 font-medium">Origin PHC Medical Facility:</span>
                            <span className="font-bold text-cyan-300 text-right">{item.originPhc}</span>
                          </div>
                          <div className="flex justify-between items-center pb-1 border-b border-slate-850">
                            <span className="text-slate-400 font-medium">Referring ASHA Worker:</span>
                            <span className="font-bold text-white text-right">{item.ashaWorkerName}</span>
                          </div>
                          <div className="flex justify-between items-center pb-1 border-b border-slate-850">
                            <span className="text-slate-400 font-medium">108 Ambulance Vehicle &amp; Driver:</span>
                            <span className="font-bold font-mono text-emerald-400 text-right">
                              {item.ambulanceUnit.vehicleNumber} ({item.ambulanceUnit.driverName})
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">In-Transit Oxygen &amp; Vitals Telemetry:</span>
                            <span className={`font-black uppercase px-2 py-0.5 rounded text-[10px] ${item.ambulanceUnit.oxygenActive ? 'bg-red-500/20 text-red-300 border border-red-500/35 animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
                              {item.ambulanceUnit.oxygenActive ? '🔥 O2 & IV Drip Active' : 'Normal Transit Vitals'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Command Strip for Hospital Admin */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">Current Hospital Admin Status:</span>
                          <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm ${
                            isAdmitted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                            isLocked ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' :
                            'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}>
                            {item.hospitalAdminStatus.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* Emergency Blood Reserve trigger */}
                          <button
                            type="button"
                            onClick={() => handleBloodReserve(item.bloodGroup || 'O+')}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/35 transition flex items-center gap-1.5 active:scale-95 shadow-sm"
                          >
                            <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>Reserve Blood Unit ({item.bloodGroup || 'O+'})</span>
                          </button>

                          {/* Action state machine */}
                          {item.hospitalAdminStatus === 'EN_ROUTE' && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(item.id, 'BED_LOCKED')}
                              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/30 transition flex items-center gap-2 transform active:scale-95"
                            >
                              <Bed className="w-4 h-4 text-white shrink-0" />
                              <span>Accept &amp; Lock Ward Bed ({item.reservedBed?.bedNumber})</span>
                            </button>
                          )}

                          {item.hospitalAdminStatus === 'BED_LOCKED' && (
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(item.id, 'ADMITTED_IN_WARD')}
                              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition flex items-center gap-2 transform active:scale-95"
                            >
                              <Building2 className="w-4 h-4 text-slate-950 shrink-0" />
                              <span>Confirm Hospital Ward Admission</span>
                            </button>
                          )}

                          {item.hospitalAdminStatus === 'ADMITTED_IN_WARD' && (
                            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-2 shadow-inner">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Patient Admitted in Ward</span>
                            </div>
                          )}

                          {/* Generate In-Patient Admission Ticket Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedTicket(item)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/25 transition flex items-center gap-2 active:scale-95"
                          >
                            <QrCode className="w-4 h-4 shrink-0" />
                            <span>In-Patient Ticket &amp; QR</span>
                          </button>

                          {!item.dhoEscalated ? (
                            <button
                              type="button"
                              onClick={() => handleEscalateToDho(item)}
                              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-[11px] rounded-xl shadow-md shadow-red-600/30 transition flex items-center gap-1.5 active:scale-95 transform hover:scale-[1.02]"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 animate-bounce shrink-0 text-amber-300" />
                              <span>Escalate to DHO Command</span>
                            </button>
                          ) : (
                            <div className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-[11px] flex items-center gap-1.5 shadow-inner">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Escalated to DHO Command</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADVANCED ICU, HDU & LABOR ROOM BED CAPACITY MATRIX */}
        {activeTab === 'bed_matrix' && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                  <Bed className="w-6 h-6 text-emerald-400" />
                  <span>Haveri Hospital Specialized Maternal &amp; Neonatal Ward Capacity Matrix</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Real-time bed lock registry with automated vital sign telemetry &amp; ventilator tracking across ICU, High Dependency (HDU), and LDR units.
                </p>
              </div>

              {/* Ward filter tab */}
              <div className="flex rounded-xl bg-slate-950 p-1.5 border border-slate-800 shadow-inner">
                {['ALL', 'ICU', 'HDU', 'LDR'].map((ward) => (
                  <button
                    key={ward}
                    type="button"
                    onClick={() => setBedWardFilter(ward)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                      bedWardFilter === ward ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ward === 'ALL' ? 'All Wards (18)' : `${ward} Suite (6)`}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Beds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {filteredBeds.map((b) => {
                const isAvail = b.status === 'AVAILABLE';
                const isRes = b.status === 'RESERVED';
                const isOcc = b.status === 'OCCUPIED';

                return (
                  <div
                    key={b.id}
                    onClick={() => handleBedClick(b)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-xl flex flex-col justify-between space-y-4 group hover:scale-[1.03] ${
                      isAvail ? 'bg-emerald-950/40 border-emerald-500/45 hover:border-emerald-400 text-emerald-300' :
                      isRes ? 'bg-amber-950/50 border-amber-500/50 hover:border-amber-400 text-amber-300 animate-pulse' :
                      isOcc ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300' :
                      'bg-red-950/30 border-red-500/35 text-red-300 opacity-60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black font-mono tracking-tight text-white">{b.bedNumber}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isAvail ? 'bg-emerald-500 text-slate-950 font-black' :
                          isRes ? 'bg-amber-500 text-slate-950 font-black' :
                          isOcc ? 'bg-slate-800 text-slate-300' : 'bg-red-500 text-white'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="text-xs font-extrabold text-slate-200 mt-2">
                        {b.patientName || 'Vacant & Sanitized'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {b.condition || 'Ready for 108 Emergency transfer'}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>Unit: {b.ward} Ward</span>
                      {b.ventilatorActive && (
                        <span className="text-red-400 flex items-center gap-1 font-extrabold">
                          <Activity className="w-3 h-3 text-red-400 animate-bounce" />
                          <span>Ventilator O2</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
              <span className="font-semibold text-slate-300">💡 Administrator Tip: Click any bed above to trigger immediate patient allocation or review live ICU ventilator vitals.</span>
              <button
                type="button"
                onClick={() => alert('🧹 WARD SANITIZATION LOG GED!\nAll 6 LDR recovery beds certified by Hospital Hygiene Supervisor per National Health Mission guidelines.')}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
              >
                Log Ward Sanitation Certificate
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BLOOD BANK RESERVE & SPECIALIST ROSTER COMMAND */}
        {activeTab === 'blood_bank' && (
          <div className="space-y-6">
            
            {/* Blood Bank Depot */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                    <Droplets className="w-6 h-6 text-cyan-400" />
                    <span>Haveri District Hospital Medical Blood Bank Inventory &amp; Emergency Reserves</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Live tracking of Whole Blood, Packed Red Blood Cells (PRBC), FFP, and Platelets for instant postpartum hemorrhage (PPH) mitigation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => alert('🚨 REPLENISHMENT DISPATCHED!\nUrgent indent sent to Hubballi Regional Medical Blood Depot for 15 units of O- and B- Packed Red Blood Cells (PRBC).')}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition active:scale-95"
                >
                  Trigger Blood Depot Replenishment
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {[
                  { group: 'O+', units: 18, prbc: 12, ffp: 8, status: 'Optimal' },
                  { group: 'A+', units: 14, prbc: 9, ffp: 6, status: 'Optimal' },
                  { group: 'B+', units: 11, prbc: 7, ffp: 5, status: 'Optimal' },
                  { group: 'AB+', units: 6, prbc: 4, ffp: 3, status: 'Moderate' },
                  { group: 'O-', units: 3, prbc: 2, ffp: 2, status: 'Low Alert' },
                  { group: 'A-', units: 4, prbc: 2, ffp: 2, status: 'Moderate' },
                  { group: 'B-', units: 2, prbc: 1, ffp: 1, status: 'Urgent Indent' },
                  { group: 'AB-', units: 3, prbc: 2, ffp: 1, status: 'Moderate' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2.5 hover:border-cyan-500/50 transition-all shadow-inner">
                    <div className="text-2xl font-black font-mono text-cyan-300">{item.group}</div>
                    <div className="text-3xl font-black text-white">{item.units} <span className="text-[10px] font-normal text-slate-400">Units</span></div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      PRBC: {item.prbc} | FFP: {item.ffp}
                    </div>
                    <div className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      item.status === 'Optimal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35' :
                      item.status === 'Moderate' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/35' :
                      'bg-red-500/25 text-red-300 border border-red-500/40 animate-pulse'
                    }`}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist Doctor On-Call Roster */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-400" />
                  <span>24/7 Obstetric &amp; Neonatal Emergency Specialist Fleet (On-Duty Roster)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { name: 'Dr. Srinivas Shastry', role: 'Chief Obstetrician & Gynecologist (OB-GYN)', ward: 'ICU / LDR Suite', contact: '+91 98450 11200', status: 'In Operating Theatre (OT-1)' },
                  { name: 'Dr. Ananth Vishy', role: 'PHC Triage Liaison & ER Consultant', ward: 'Casualty ER Radar', contact: '+91 98450 22340', status: 'On Active Command Standby' },
                  { name: 'Dr. Preethi K. Rao', role: 'Senior Pediatrician & Neonatologist (NICU)', ward: 'Neonatal ICU', contact: '+91 98450 44512', status: 'Available for Emergency' }
                ].map((doc, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-white">{doc.name}</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      </div>
                      <p className="text-xs text-emerald-400 font-bold">{doc.role}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Assigned Post: {doc.ward}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                      <span className="text-[11px] font-bold text-slate-300">{doc.status}</span>
                      <button
                        type="button"
                        onClick={() => alert(`📞 CONNECTING EMERGENCY VOICE CALL...\n\nCalling ${doc.name} (${doc.role}) at ${doc.contact}.\nAutomated SMS with PHC maternal EHR summary transmitted simultaneously!`)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center gap-1.5 shrink-0 shadow-md active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Doctor</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: WHO 3-DELAY ANALYTICS & JSY / PMMVY BENEFIT AUDIT */}
        {activeTab === 'audit_analytics' && (
          <div className="space-y-6">
            
            {/* WHO 3-Delay Bottleneck Analyzer */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                    <TrendingUp className="w-6 h-6 text-amber-400" />
                    <span>WHO 3-Delay Maternal Survival Bottleneck Analyzer</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Empirical latency breakdown monitoring every critical second from village symptom identification to tertiary ER treatment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition flex items-center gap-2 shrink-0 active:scale-95"
                >
                  <Download className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Download Executive Audit Report (PDF/CSV)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden shadow-xl">
                  <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Delay 1: Decision to Seek Care</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">4.2 Mins <span className="text-xs text-slate-400 font-normal">Avg</span></div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Time from initial onset of obstetric distress in village to ASHA worker registering diagnostic risk on JANANI360 AI app.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>68% Faster than previous year baseline</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden shadow-xl">
                  <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Delay 2: Reaching Medical Facility</div>
                  <div className="text-3xl font-black text-amber-400 font-mono">18.5 Mins <span className="text-xs text-slate-400 font-normal">Avg</span></div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Transit speed of 108 Emergency ambulance from village Sub-Center / PHC clinic to Haveri District Hospital ER radar.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>GPS Green-Corridor routing active</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden shadow-xl">
                  <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Delay 3: Receiving Adequate Care at ER</div>
                  <div className="text-3xl font-black text-cyan-400 font-mono">5.1 Mins <span className="text-xs text-slate-400 font-normal">Avg</span></div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Door-to-treatment speed at Haveri ER due to advance bed locking and instant clinical EHR transmission from PHC doctor.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>State Health Mission Gold Standard Achieved</span>
                  </div>
                </div>
              </div>
            </div>

            {/* JSY & PMMVY Government Scheme Compliance Audit Table */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Direct Benefit Transfer (DBT) Compliance Registry (JSY &amp; PMMVY)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">100% Aadhaar Bank Seeding Verified</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5">Patient Name &amp; ANC ID</th>
                      <th className="p-3.5">Origin PHC &amp; ASHA</th>
                      <th className="p-3.5">Janani Suraksha Yojana (JSY)</th>
                      <th className="p-3.5">Matru Vandana Yojana (PMMVY)</th>
                      <th className="p-3.5">Bank Seeding &amp; DBT Status</th>
                      <th className="p-3.5 text-center">Audit Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {transfers.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-850/50 transition">
                        <td className="p-3.5 font-bold text-white">
                          <div>{t.motherName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{t.ancNumber}</div>
                        </td>
                        <td className="p-3.5 text-xs">
                          <div className="text-cyan-300 font-semibold">{t.originPhc}</div>
                          <div className="text-[10px] text-slate-400">{t.ashaWorkerName}</div>
                        </td>
                        <td className="p-3.5 font-mono font-extrabold text-emerald-400">
                          ₹1,400.00 (Rural Institutional)
                        </td>
                        <td className="p-3.5 font-mono font-extrabold text-teal-300">
                          ₹5,000.00 (Installment Verified)
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>DBT Disbursed &amp; Locked</span>
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => alert(`📜 DBT AUDIT CERTIFICATE GENERATED!\n\nPatient: ${t.motherName}\nJSY Voucher Number: KA-JSY-2026-9912\nBank IFSC: SBIN0001842\nDirect deposit confirmed under National Health Authority (NHA) protocol.`)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-xl border border-slate-700 transition"
                          >
                            Verify Voucher
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* IN-PATIENT ADMISSION TICKET & QR CODE MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-3xl max-w-2xl w-full p-7 shadow-2xl space-y-6 relative my-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Official Hospital In-Patient Admission Card</h3>
                  <p className="text-xs font-bold text-slate-400">Department of Health &amp; Family Welfare, Govt. of Karnataka</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-3 py-1 rounded-full font-black uppercase">
                  TICKET: {selectedTicket.id}
                </span>
              </div>
            </div>

            {/* Card Content Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner">
              
              {/* Left Details */}
              <div className="sm:col-span-8 space-y-3.5 text-xs font-medium text-slate-300">
                <div className="flex justify-between border-b border-slate-850 pb-1.5">
                  <span className="text-slate-400">Patient Full Name:</span>
                  <span className="font-extrabold text-white text-base">{selectedTicket.motherName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-1.5">
                  <span className="text-slate-400">ANC / RCH Identifier:</span>
                  <span className="font-bold font-mono text-emerald-400">{selectedTicket.ancNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-1.5">
                  <span className="text-slate-400">Assigned Ward Bed Lock:</span>
                  <span className="font-extrabold text-amber-300 text-sm font-mono">{selectedTicket.reservedBed?.bedNumber || 'ICU-01'} (Immediate Triage)</span>
                </div>
                <div className="flex justify-between border-b border-slate-850 pb-1.5">
                  <span className="text-slate-400">Origin PHC &amp; Medical Officer Note:</span>
                  <span className="font-bold text-cyan-300 text-right max-w-[220px] truncate">{selectedTicket.originPhc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Triage Emergency Priority:</span>
                  <span className="font-black text-red-400">{selectedTicket.triagePriority === 'PRIORITY_1_EMERGENCY' ? 'Priority 1 (Acute High Risk)' : 'Priority 2 (Observation)'}</span>
                </div>
              </div>

              {/* Right Real QR Code Simulation */}
              <div className="sm:col-span-4 bg-white p-4 rounded-2xl flex flex-col items-center justify-center text-slate-950 text-center shadow-lg space-y-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                    `JANANI360-TICKET:${selectedTicket.id}|MOTHER:${selectedTicket.motherName}|ANC:${selectedTicket.ancNumber}|BED:${selectedTicket.reservedBed?.bedNumber}|PHC:${selectedTicket.originPhc}`
                  )}`}
                  alt="In-Patient Ticket Real QR Code"
                  className="w-28 h-28 object-contain rounded-lg border border-slate-200 shadow-sm"
                />
                <span className="text-[10px] font-black uppercase text-slate-700 font-mono">Scan for Ward Bed Entry</span>
              </div>

            </div>

            {/* Doctor & ASHA Audit Trail */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-teal-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Clinical Triage Rationale &amp; Treatment Directives:</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed italic">
                "{selectedTicket.doctorNotes}" — Transmitted directly by {selectedTicket.originPhc} via JANANI360 AI ABDM Gateway.
              </p>
            </div>

            {/* Modal Bottom Action Strip */}
            <div className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  alert(`🖨️ PRINTING IN-PATIENT ADMISSION TICKET...\n\nSending formatting instructions to Haveri District Hospital ER Thermal Ward Printer.\nTicket ${selectedTicket.id} for ${selectedTicket.motherName} generated successfully!`);
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2 shadow-md active:scale-95"
              >
                <Printer className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Print Official Ward Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`📲 SHAREABLE ADMISSION LINK GENERATED!\n\nEncrypted admission details shared to WhatsApp of ASHA Facilitator (${selectedTicket.ashaWorkerName}) and mother's registered family number.`);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 active:scale-95"
              >
                <Share2 className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Share Admission Ticket &amp; QR</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
