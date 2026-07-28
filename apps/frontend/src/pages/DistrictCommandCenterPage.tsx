import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Building2, 
  Ambulance, 
  ShieldAlert, 
  Activity, 
  RefreshCw, 
  FileText, 
  Download, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Share2, 
  Printer, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Bed, 
  Droplets, 
  Zap, 
  Send, 
  ExternalLink, 
  Globe, 
  Radio,
  Video
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

interface DhoEscalation {
  id: string;
  referralCode: string;
  ancNumber: string;
  motherName: string;
  age: number | string;
  mobile: string;
  village: string;
  originPhc: string;
  bloodGroup?: string;
  gravida?: number | string;
  parity?: number | string;
  clinicalReason: string;
  doctorNotes: string;
  ashaWorkerName: string;
  triagePriority: string;
  etaMinutes?: number;
  ambulanceUnit?: {
    vehicleNumber: string;
    driverName: string;
    driverPhone: string;
    oxygenActive?: boolean;
  };
  reservedBed?: {
    bedNumber: string;
  };
  escalationTimestamp: string;
  escalatedBy: string;
  requestedSupport: string;
  dhoActionStatus: 'PENDING_DHO_REVIEW' | 'FUND_APPROVED' | 'AIR_AMBULANCE_DISPATCHED' | 'RESOLVED';
}

const INITIAL_DHO_ESCALATIONS: DhoEscalation[] = [
  {
    id: 'DHO-ESC-9102',
    referralCode: 'JAN-KA-VTR-0042',
    ancNumber: 'RCH-982140',
    motherName: 'Meenakshi Sundaram',
    age: 26,
    mobile: '+91 98450 67123',
    village: 'Somwarpet Village (Haveri Block)',
    originPhc: 'Varthur Primary Health Centre (PHC)',
    bloodGroup: 'O+',
    gravida: 2,
    parity: 1,
    clinicalReason: 'Severe Pre-Eclampsia with Acute Imminent Eclampsia Seizure Risk (BP 168/112)',
    doctorNotes: 'Emergency loading MgSO4 dose administered at PHC. Escalated by Hospital Admin for state emergency ICU relief grant and cardiovascular surgical specialist consultation.',
    ashaWorkerName: 'Sanveeka Gowda (ASHA Facilitator)',
    triagePriority: 'PRIORITY_1_EMERGENCY',
    etaMinutes: 12,
    ambulanceUnit: {
      vehicleNumber: 'KA-27-F-1084',
      driverName: 'Ramesh K.',
      driverPhone: '+91 98450 88108',
      oxygenActive: true
    },
    reservedBed: {
      bedNumber: 'ICU-02 (Haveri District Hospital)'
    },
    escalationTimestamp: '04:10 PM',
    escalatedBy: 'Haveri District Hospital Medical ER Admin (108 Command)',
    requestedSupport: 'Specialized Medical College Consultation & ₹25,000 State CM Critical Care Grant',
    dhoActionStatus: 'PENDING_DHO_REVIEW'
  },
  {
    id: 'DHO-ESC-9105',
    referralCode: 'JAN-KA-VTR-0105',
    ancNumber: 'RCH-331209',
    motherName: 'Sunitha M.',
    age: 29,
    mobile: '+91 99012 55431',
    village: 'Whitefield Peripheral Outpost',
    originPhc: 'Varthur Primary Health Centre (PHC)',
    bloodGroup: 'AB+',
    gravida: 3,
    parity: 2,
    clinicalReason: 'Obstructed Labor crossing Partograph Action Line with Fetal Distress',
    doctorNotes: 'Emergency vacuum and C-section standby initiated at ER. Escalated to DHO for priority blood bank depot reservation and pediatric neonatologist team clearance.',
    ashaWorkerName: 'Sanveeka Gowda (ASHA Facilitator)',
    triagePriority: 'PRIORITY_1_EMERGENCY',
    etaMinutes: 5,
    ambulanceUnit: {
      vehicleNumber: 'KA-27-F-1081',
      driverName: 'Suresh N.',
      driverPhone: '+91 98450 99421',
      oxygenActive: true
    },
    reservedBed: {
      bedNumber: 'ICU-01 (Haveri District Hospital)'
    },
    escalationTimestamp: '04:22 PM',
    escalatedBy: 'Haveri District Hospital Medical ER Admin (108 Command)',
    requestedSupport: 'Priority Blood Depot Override & Emergency NICU Team Deployment',
    dhoActionStatus: 'FUND_APPROVED'
  },
  {
    id: 'DHO-ESC-9109',
    referralCode: 'JAN-KA-RNR-0412',
    ancNumber: 'RCH-661092',
    motherName: 'Lakshmi Narayan',
    age: 23,
    mobile: '+91 98451 34188',
    village: 'Halageri Tribal Sector (Ranebennur Taluk)',
    originPhc: 'Halageri Rural Sub-Center',
    bloodGroup: 'A-',
    gravida: 1,
    parity: 0,
    clinicalReason: 'Postpartum Hemorrhage (PPH) Risk with Severe Hypovolemia (Hb 5.9 g/dL)',
    doctorNotes: 'Emergency Oxytocin administered. Terrain barriers impeding standard ambulance speed. Air/Advanced Green Corridor evacuation requested immediately.',
    ashaWorkerName: 'Pooja M. (Senior ASHA Supervisor)',
    triagePriority: 'PRIORITY_1_EMERGENCY',
    etaMinutes: 24,
    ambulanceUnit: {
      vehicleNumber: 'KA-27-F-1099',
      driverName: 'Manisha Patil',
      driverPhone: '+91 98452 77112',
      oxygenActive: true
    },
    reservedBed: {
      bedNumber: 'ICU-05 (Ranebennur CHC)'
    },
    escalationTimestamp: '03:55 PM',
    escalatedBy: 'Ranebennur Community Health Center Administrator',
    requestedSupport: 'Advanced 108 Green-Corridor Evacuation & Urgent A- Negative Blood Supply Indent',
    dhoActionStatus: 'AIR_AMBULANCE_DISPATCHED'
  }
];

interface TalukGisNode {
  id: string;
  talukName: string;
  activeMothers: number;
  highRiskCount: number;
  anemiaPrevalence: string;
  institutionalDeliveryRate: string;
  phcCount: number;
  ashaCoverage: string;
  status: 'Optimal' | 'Monitor' | 'High Risk Zone';
}

const TALUK_NODES: TalukGisNode[] = [
  { id: 't1', talukName: 'Haveri District HQ Block', activeMothers: 342, highRiskCount: 41, anemiaPrevalence: '11.4%', institutionalDeliveryRate: '99.2%', phcCount: 6, ashaCoverage: '99.5%', status: 'Optimal' },
  { id: 't2', talukName: 'Ranebennur Taluk Block', activeMothers: 410, highRiskCount: 68, anemiaPrevalence: '15.8%', institutionalDeliveryRate: '97.4%', phcCount: 8, ashaCoverage: '98.1%', status: 'High Risk Zone' },
  { id: 't3', talukName: 'Hangal Tribal Sector', activeMothers: 218, highRiskCount: 35, anemiaPrevalence: '16.2%', institutionalDeliveryRate: '96.5%', phcCount: 4, ashaCoverage: '97.0%', status: 'High Risk Zone' },
  { id: 't4', talukName: 'Shiggaon Agri Sector', activeMothers: 195, highRiskCount: 22, anemiaPrevalence: '12.0%', institutionalDeliveryRate: '98.5%', phcCount: 5, ashaCoverage: '98.9%', status: 'Optimal' },
  { id: 't5', talukName: 'Savanur Central Block', activeMothers: 160, highRiskCount: 19, anemiaPrevalence: '13.1%', institutionalDeliveryRate: '98.0%', phcCount: 4, ashaCoverage: '98.4%', status: 'Monitor' },
  { id: 't6', talukName: 'Hirekerur Southern Block', activeMothers: 184, highRiskCount: 21, anemiaPrevalence: '12.5%', institutionalDeliveryRate: '98.2%', phcCount: 5, ashaCoverage: '99.0%', status: 'Optimal' },
  { id: 't7', talukName: 'Byadgi Commercial Block', activeMothers: 147, highRiskCount: 16, anemiaPrevalence: '11.9%', institutionalDeliveryRate: '99.0%', phcCount: 3, ashaCoverage: '99.4%', status: 'Optimal' },
];

export const DistrictCommandCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'escalations_sync' | 'gis_heatmap' | 'fleet_resources' | 'staff_audit' | 'policy_sdg'>('escalations_sync');
  const [escalations, setEscalations] = useState<DhoEscalation[]>([]);
  const [hospitalTransfersCount, setHospitalTransfersCount] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedTeleConsult, setSelectedTeleConsult] = useState<DhoEscalation | null>(null);

  // Load escalations and monitor Hospital Admin live feed
  const loadDhoData = () => {
    try {
      // 1. Sync Hospital Admin general transfers count
      const hospRaw = localStorage.getItem('janani360_hospital_transfers');
      if (hospRaw) {
        const parsedHosp = JSON.parse(hospRaw);
        setHospitalTransfersCount(parsedHosp.length);
      }

      // 2. Load DHO escalations from localStorage
      const escRaw = localStorage.getItem('janani360_dho_escalations');
      if (escRaw) {
        const parsedEsc = JSON.parse(escRaw);
        if (parsedEsc.length > 0) {
          setEscalations(parsedEsc);
          return;
        }
      }
      localStorage.setItem('janani360_dho_escalations', JSON.stringify(INITIAL_DHO_ESCALATIONS));
      setEscalations(INITIAL_DHO_ESCALATIONS);
    } catch (err) {
      console.error('Error synchronizing DHO state command telemetry:', err);
      setEscalations(INITIAL_DHO_ESCALATIONS);
    }
  };

  useEffect(() => {
    loadDhoData();
    // Auto-sync polling every 4.5 seconds
    const timer = setInterval(() => {
      loadDhoData();
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadDhoData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleActionUpdate = (id: string, newAction: 'PENDING_DHO_REVIEW' | 'FUND_APPROVED' | 'AIR_AMBULANCE_DISPATCHED' | 'RESOLVED') => {
    const updated = escalations.map(e => e.id === id ? { ...e, dhoActionStatus: newAction } : e);
    setEscalations(updated);
    localStorage.setItem('janani360_dho_escalations', JSON.stringify(updated));
    alert(`🏛️ STATE DHO GOVERNANCE ORDER EXECUTED:\n\nEscalate case ${id} status transitioned to [${newAction.replace(/_/g, ' ')}].\nNotification transmitted to Hospital Administrator & Regional Treasury!`);
  };

  const handleDeployCaravan = (talukName: string) => {
    alert(`🚚 MOBILE MEDICAL & IFA CARAVAN DEPLOYED!\n\nTarget Block: ${talukName}\nMission Details:\n• Dispatched 2 National Health Mission (NHM) mobile diagnostics vans.\n• 5,000 Iron-Folic Acid (IFA) tablets and prenatal ultrasound units onboard.\n• ASHA facilitators instructed to organize village maternal testing clinic tomorrow at 08:00 AM.`);
  };

  const handleResourceRedirect = (resourceType: string, fromFacility: string, toFacility: string) => {
    alert(`⚡ INTER-HOSPITAL RESOURCE RE-ALLOCATION ORDERED!\n\nTransfer Type: ${resourceType}\nSource Depot: ${fromFacility}\nDestination ER: ${toFacility}\n\n108 Express Courier dispatched via regional highway corridor. Estimated arrival: 18 minutes.`);
  };

  const handleDisburseIncentive = (workerName: string, amount: number) => {
    alert(`🎉 DIRECT BENEFIT INCENTIVE DISBURSED!\n\nRecipient: ${workerName}\nReward Amount: ₹${amount.toLocaleString('en-IN')} (NHM Maternal Excellence Bonus)\nTransaction ID: NHM-DBT-2026-88129\n\nDirect deposit finalized into employee Aadhaar-seeded SBI Bank Account.`);
  };

  const handleExportDossier = () => {
    alert(`📑 DOWNLOADING OFFICIAL DHO EXECUTIVE STATE DOSSIER...\n\nGenerated comprehensive digital signed dossier containing:\n• Real-Time Inter-Hospital & ER Occupancy Telemetry\n• High-Risk Obstetric Escalations & Relief Fund Audits (${escalations.length} Cases)\n• Taluk-wise Epidemiological Anemia & GIS Risk Matrix\n• UN Sustainable Development Goal (SDG 3.1) MMR Verification\n\nFormat: Official Government of Karnataka Sealed PDF & CSV.`);
  };

  const filteredEscalations = escalations.filter(item => {
    const matchesStatus = statusFilter === 'ALL' ? true : item.dhoActionStatus === statusFilter;
    const matchesSearch = item.motherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ancNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.originPhc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRegisteredMothers = TALUK_NODES.reduce((acc, t) => acc + t.activeMothers, 0) + 48;
  const totalHighRisk = TALUK_NODES.reduce((acc, t) => acc + t.highRiskCount, 0);
  const pendingReviewCount = escalations.filter(e => e.dhoActionStatus === 'PENDING_DHO_REVIEW').length;

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 font-sans pb-20">
      <Navbar />

      {/* Top DHO State Governance Command Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-40 backdrop-blur-md px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 animate-pulse shrink-0">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  District Health Officer (DHO) State Command Suite &amp; Inter-Hospital Radar
                </h1>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/35 hidden sm:inline-block shadow-sm">
                  NHM / ABDM LEVEL-4 STATE GOVERNANCE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                ಹಾವೇರಿ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ನಿರ್ದೇಶನಾಲಯ ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ (Haveri Regional Public Health Directorate)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleManualRefresh}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 shadow-md active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync Inter-Hospital Telemetry</span>
            </button>
            <button
              type="button"
              onClick={handleExportDossier}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Export DHO State Dossier</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Executive KPI Governance Strip */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1: Active District Registry */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-emerald-500/40 transition">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">District Active Registry</span>
              <div className="text-3xl font-black text-white font-mono">{totalRegisteredMothers.toLocaleString()} <span className="text-xs text-emerald-400 font-bold">Mothers</span></div>
              <p className="text-[10px] text-slate-400">Across 35 PHCs &amp; 7 Regional Taluks</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 2: Hospital Admin ER Connection */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-3xl border border-indigo-500/35 shadow-xl flex items-center justify-between hover:border-indigo-400 transition">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wider block">Hospital Admin ER Radar Sync</span>
              <div className="text-3xl font-black text-white font-mono">{hospitalTransfersCount} <span className="text-xs text-indigo-300 font-bold">In-Patient Loads</span></div>
              <p className="text-[10px] text-emerald-400 font-bold">✓ Live Bi-Directional ER Sync Active</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 3: Critical High Risk & Escalations */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-3xl border border-amber-500/35 shadow-xl flex items-center justify-between hover:border-amber-400 transition">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider block">DHO Emergency Escalations</span>
              <div className="text-3xl font-black text-white font-mono">{escalations.length} <span className="text-xs text-red-400 font-bold">Critical Cases</span></div>
              <p className="text-[10px] text-slate-400">{pendingReviewCount} pending immediate DHO fund approval</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 4: Institutional Delivery Target */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-5 rounded-3xl border border-cyan-500/35 shadow-xl flex items-center justify-between hover:border-cyan-400 transition">
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider block">Institutional Delivery Rate</span>
              <div className="text-3xl font-black text-white font-mono">98.2% <span className="text-xs text-cyan-400 font-bold">Gold Standard</span></div>
              <p className="text-[10px] text-emerald-400 font-bold">✓ MMR Reduced to 42 / 100k Live Births</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Executive Module Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/95 p-2 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('escalations_sync')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'escalations_sync' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${activeTab === 'escalations_sync' ? 'text-slate-950 animate-pulse' : 'text-amber-400'}`} />
              <span>1. Hospital Admin &amp; DHO Escalations ({escalations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('gis_heatmap')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'gis_heatmap' ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>2. Taluk GIS Risk &amp; Epidemiology</span>
            </button>
            <button
              onClick={() => setActiveTab('fleet_resources')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'fleet_resources' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Ambulance className="w-4 h-4 text-indigo-300" />
              <span>3. 108 Fleet &amp; Resource Routing</span>
            </button>
            <button
              onClick={() => setActiveTab('staff_audit')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'staff_audit' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4 text-purple-300" />
              <span>4. ASHA &amp; PHC Doctor KPI Audit</span>
            </button>
            <button
              onClick={() => setActiveTab('policy_sdg')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 ${
                activeTab === 'policy_sdg' ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-300" />
              <span>5. UN SDG 3.1 Policy &amp; MMR Panel</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-2 text-xs font-mono text-cyan-400 font-bold">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
            <span>Govt of Karnataka Integrated Gateway</span>
          </div>
        </div>

        {/* TAB 1: HOSPITAL ADMIN SYNC & DHO CASE ESCALATION REGISTRY */}
        {activeTab === 'escalations_sync' && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                  <ShieldAlert className="w-6 h-6 text-amber-400 animate-pulse" />
                  <span>Critical High-Risk Escalations from Hospital Administrators (108 ER Command)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Direct connection to District Hospital ER Radars. Authorize emergency financial grants and special medical college evacuation orders.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search box */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search patient, hospital, ANC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
                  />
                </div>

                {/* Action status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-500 transition shadow-inner"
                >
                  <option value="ALL">All DHO Action States</option>
                  <option value="PENDING_DHO_REVIEW">Pending Review &amp; Grant</option>
                  <option value="FUND_APPROVED">CM Relief Fund Approved</option>
                  <option value="AIR_AMBULANCE_DISPATCHED">Air/Advanced Evacuation Active</option>
                </select>
              </div>
            </div>

            {filteredEscalations.length === 0 ? (
              <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                <h3 className="text-base font-bold text-slate-200">No matching escalated high-risk emergencies currently pending</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When a Hospital Administrator clicks "Escalate to DHO State Command" on their ER Radar, the patient records instantly transmit into this state oversight queue.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEscalations.map((item) => {
                  const isPending = item.dhoActionStatus === 'PENDING_DHO_REVIEW';
                  const isFunded = item.dhoActionStatus === 'FUND_APPROVED';
                  const isEvac = item.dhoActionStatus === 'AIR_AMBULANCE_DISPATCHED';

                  return (
                    <div
                      key={item.id}
                      className={`bg-gradient-to-r ${
                        isPending 
                          ? 'from-slate-900 via-slate-900/95 to-amber-950/30 border-amber-500/45 hover:border-amber-400' 
                          : isEvac
                          ? 'from-slate-900 via-slate-900/95 to-red-950/30 border-red-500/45 hover:border-red-400'
                          : 'from-slate-900 via-slate-900/90 to-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                      } border-2 rounded-3xl p-6 shadow-2xl transition-all space-y-5 group`}
                    >
                      {/* Top Header of Escalated Card */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg shrink-0 ${
                            isPending ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 shadow-amber-500/25 animate-pulse' : 
                            isEvac ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-red-500/30' : 
                            'bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-emerald-500/20'
                          }`}>
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="text-lg font-black text-white tracking-tight">{item.motherName}</span>
                              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 shadow-sm">
                                Age {item.age} · G{item.gravida || 2} P{item.parity || 1}
                              </span>
                              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 font-mono">
                                ESCALATED BY HOSPITAL ADMIN
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                              <span>ANC ID: <strong className="text-white font-mono">{item.ancNumber}</strong></span>
                              <span className="text-slate-700">•</span>
                              <span>Village Block: <strong className="text-slate-200">{item.village}</strong></span>
                              <span className="text-slate-700">•</span>
                              <span className="text-cyan-400 font-bold">Escalation Ref: {item.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* DHO Status Badge */}
                        <div className="text-right">
                          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Current DHO Governance Status</div>
                          <div className={`mt-1 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider inline-block border shadow-sm ${
                            isPending ? 'bg-amber-500/20 text-amber-300 border-amber-500/45 animate-pulse' :
                            isFunded ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/45' :
                            isEvac ? 'bg-red-500/20 text-red-300 border-red-500/45' : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}>
                            {item.dhoActionStatus.replace(/_/g, ' ')}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 mt-1">
                            Logged at {item.escalationTimestamp}
                          </div>
                        </div>
                      </div>

                      {/* Middle Clinical Reason & Hospital Connection Matrix */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 shadow-inner">
                        <div className="lg:col-span-6 space-y-2.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Clinical Severity &amp; Obstetric Risk Trigger:</span>
                          </div>
                          <p className="text-sm font-extrabold text-white leading-snug">
                            {item.clinicalReason}
                          </p>
                          <div className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-850 space-y-1">
                            <div className="text-[11px] font-bold text-teal-300 uppercase">Hospital Admin Triage Report:</div>
                            <p className="italic">"{item.doctorNotes}"</p>
                          </div>
                        </div>

                        <div className="lg:col-span-6 space-y-2.5 text-xs text-slate-300 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-5">
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-850">
                            <span className="text-slate-400 font-medium">Referring Medical Facility:</span>
                            <span className="font-extrabold text-indigo-300 text-right">{item.escalatedBy}</span>
                          </div>
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-850">
                            <span className="text-slate-400 font-medium">Assigned Hospital Ward Bed:</span>
                            <span className="font-extrabold text-amber-400 font-mono text-right">{item.reservedBed?.bedNumber || 'ICU-02'}</span>
                          </div>
                          <div className="flex justify-between items-center pb-1.5 border-b border-slate-850">
                            <span className="text-slate-400 font-medium">108 Ambulance Telemetry:</span>
                            <span className="font-extrabold font-mono text-emerald-400 text-right">
                              {item.ambulanceUnit?.vehicleNumber || 'KA-27-F-1084'} ({item.ambulanceUnit?.driverName || 'Ramesh K.'})
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Requested State Governance Action:</span>
                            <span className="font-black text-rose-300 text-right max-w-[220px] truncate" title={item.requestedSupport}>
                              {item.requestedSupport}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Command Strip for DHO */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Origin ASHA: <strong className="text-white">{item.ashaWorkerName}</strong></span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* Tele-Consultation Trigger */}
                          <button
                            type="button"
                            onClick={() => setSelectedTeleConsult(item)}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/35 transition flex items-center gap-1.5 active:scale-95 shadow-sm"
                          >
                            <Video className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                            <span>Live ER Tele-Consultation</span>
                          </button>

                          {/* Action Buttons */}
                          {item.dhoActionStatus !== 'FUND_APPROVED' && (
                            <button
                              type="button"
                              onClick={() => handleActionUpdate(item.id, 'FUND_APPROVED')}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center gap-1.5 active:scale-95"
                            >
                              <Award className="w-4 h-4 text-white shrink-0" />
                              <span>Authorize ₹25,000 CM Relief Fund</span>
                            </button>
                          )}

                          {item.dhoActionStatus !== 'AIR_AMBULANCE_DISPATCHED' && (
                            <button
                              type="button"
                              onClick={() => handleActionUpdate(item.id, 'AIR_AMBULANCE_DISPATCHED')}
                              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition flex items-center gap-1.5 active:scale-95"
                            >
                              <Ambulance className="w-4 h-4 animate-bounce shrink-0" />
                              <span>Order Advanced Air/Evacuation</span>
                            </button>
                          )}

                          {item.dhoActionStatus !== 'RESOLVED' && (
                            <button
                              type="button"
                              onClick={() => handleActionUpdate(item.id, 'RESOLVED')}
                              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition"
                            >
                              Mark Case Resolved
                            </button>
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

        {/* TAB 2: DISTRICT GIS MATERNAL RISK HEATMAP & EPIDEMIOLOGICAL SURVEILLANCE */}
        {activeTab === 'gis_heatmap' && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                  <span>Haveri District 7-Taluk Geographical Risk Matrix &amp; Epidemiological Radar</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Empirical block-wise vulnerability profiling. Deploy National Health Mission (NHM) Mobile Medical Caravans directly to high-risk zones.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-bold text-emerald-300">
                <Globe className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Real-Time GIS Satellite Coordinates Locked</span>
              </div>
            </div>

            {/* Taluk Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {TALUK_NODES.map((taluk) => {
                const isHigh = taluk.status === 'High Risk Zone';
                const isMon = taluk.status === 'Monitor';

                return (
                  <div
                    key={taluk.id}
                    className={`p-5 rounded-3xl border-2 transition-all shadow-xl flex flex-col justify-between space-y-4 hover:scale-[1.02] ${
                      isHigh 
                        ? 'bg-gradient-to-b from-slate-900 to-red-950/40 border-red-500/50 hover:border-red-400' 
                        : isMon 
                        ? 'bg-gradient-to-b from-slate-900 to-amber-950/40 border-amber-500/45 hover:border-amber-400'
                        : 'bg-gradient-to-b from-slate-900 to-emerald-950/25 border-emerald-500/35 hover:border-emerald-400'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-base font-black text-white tracking-tight leading-snug">{taluk.talukName}</span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 shadow-sm ${
                          isHigh ? 'bg-red-500 text-white font-black animate-pulse' : isMon ? 'bg-amber-500 text-slate-950 font-black' : 'bg-emerald-500 text-slate-950 font-black'
                        }`}>
                          {taluk.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">Active Mothers</span>
                          <span className="text-xl font-black text-white">{taluk.activeMothers}</span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] text-slate-400 block uppercase font-sans font-bold">High Risk (HRP)</span>
                          <span className={`text-xl font-black ${isHigh ? 'text-red-400' : 'text-amber-400'}`}>{taluk.highRiskCount}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 pt-1 font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Severe Anemia Prevalence:</span>
                          <span className="font-bold font-mono text-amber-300">{taluk.anemiaPrevalence}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Institutional Childbirth:</span>
                          <span className="font-bold font-mono text-emerald-400">{taluk.institutionalDeliveryRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Regional PHC Network:</span>
                          <span className="font-bold text-cyan-300">{taluk.phcCount} Connected Clinics</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ASHA Facilitator App Use:</span>
                          <span className="font-bold font-mono text-white">{taluk.ashaCoverage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => handleDeployCaravan(taluk.talukName)}
                        className={`w-full py-2 px-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
                          isHigh 
                            ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-600/30' 
                            : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/35'
                        }`}
                      >
                        <Zap className="w-4 h-4 shrink-0" />
                        <span>Deploy Mobile IFA Caravan</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* District Overview Summary Card */}
              <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 p-6 rounded-3xl border-2 border-indigo-500/45 shadow-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold">
                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">District Epidemiological Summary</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Overall maternal anemia prevalence has dropped by <strong>3.4%</strong> across Haveri following JANANI360 automated ASHA follow-ups and targeted nutrition intervention.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs font-bold text-indigo-300 flex items-center justify-between">
                  <span>UN WHO Benchmark Status:</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-black uppercase text-[10px]">
                    ✓ On Track for 2030
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 108 AMBULANCE FLEET & INTER-HOSPITAL RESOURCE ROUTING */}
        {activeTab === 'fleet_resources' && (
          <div className="space-y-6">
            
            {/* 108 Ambulance Green-Corridor Fleet */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Ambulance className="w-5 h-5 text-indigo-400" />
                    <span>Active 108 Emergency Green-Corridor Obstetric Fleet (Live Telemetry)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time GPS tracking and in-transit patient oxygen cylinder monitoring across district highway corridors.</p>
                </div>

                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-3 py-1 rounded-xl text-xs font-mono font-black self-start sm:self-auto shadow-sm">
                  14 / 16 Ambulances Active on Mission
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { unit: 'KA-27-F-1084', driver: 'Ramesh K.', phone: '+91 98450 88108', speed: '62 km/h', route: 'Somwarpet -> Haveri DH ER', o2: '1,840 PSI (Stable)', status: 'On Emergency Transit' },
                  { unit: 'KA-27-F-1089', driver: 'Basava Lingad', phone: '+91 98450 12879', speed: '48 km/h', route: 'Hoskote PHC -> Ranebennur CHC', o2: '2,100 PSI (Full)', status: 'En Route to PHC' },
                  { unit: 'KA-27-F-1081', driver: 'Suresh N.', phone: '+91 98450 99421', speed: '55 km/h', route: 'Whitefield -> Haveri ICU', o2: '1,520 PSI (Active Consumption)', status: 'Arriving in 5 Mins' },
                ].map((amb, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md hover:border-indigo-500/40 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black font-mono text-indigo-300">{amb.unit}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 uppercase">
                        {amb.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div>Driver: <strong className="text-white">{amb.driver}</strong> (<span className="text-slate-400 font-mono">{amb.phone}</span>)</div>
                      <div>Active Corridor: <strong className="text-amber-300">{amb.route}</strong></div>
                      <div className="flex justify-between pt-1 border-t border-slate-850 font-mono text-[11px]">
                        <span>Speed: <strong className="text-emerald-400">{amb.speed}</strong></span>
                        <span>O2 Tank: <strong className="text-cyan-300">{amb.o2}</strong></span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => alert(`📡 EMERGENCY RADIO BROADCAST DISPATCHED!\n\nUnit: ${amb.unit} (${amb.driver})\nTraffic police alerted along regional highway corridor for signal override and immediate zero-stop ICU arrival.`)}
                        className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                      >
                        <Radio className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>Send Traffic Override Signal</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inter-Hospital Oxygen & Blood Bank Reserve Balancing Matrix */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-cyan-400" />
                    <span>Inter-Hospital Oxygen Cylinder &amp; Blood Bank Balance Radar</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Identify regional surpluses and immediately re-allocate life-saving supplies between medical institutions.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5">Medical Care Facility &amp; Taluk</th>
                      <th className="p-3.5">Facility Classification</th>
                      <th className="p-3.5">Medical O2 Cylinder Reserve</th>
                      <th className="p-3.5">PRBC &amp; Whole Blood Depot</th>
                      <th className="p-3.5">ICU Ventilator Status</th>
                      <th className="p-3.5 text-center">Inter-Hospital Re-Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {[
                      { name: 'Haveri District Hospital HQ', type: 'District Level Hospital', o2: '142 Cylinders (Surplus)', blood: '48 Units (Optimal)', vent: '12 / 12 Functional', action: 'Optimal Balance' },
                      { name: 'Ranebennur Sub-District CHC', type: 'Community Health Center', o2: '34 Cylinders (Stable)', blood: '12 Units (Moderate)', vent: '4 / 6 Operational', action: 'Optimal Balance' },
                      { name: 'Varthur Primary Health Center', type: 'Primary Health Center (PHC)', o2: '18 Cylinders (Stable)', blood: '4 Units (Low Alert)', vent: '2 / 2 Functional', action: 'Need Blood Replenishment' },
                      { name: 'Hangal Rural Hospital', type: 'Community Health Center', o2: '8 Cylinders (Urgent Deficit)', blood: '6 Units (Moderate)', vent: '3 / 3 Functional', action: 'Need O2 Supply Indent' },
                    ].map((fac, idx) => {
                      const isDeficit = fac.o2.includes('Deficit') || fac.blood.includes('Low Alert');

                      return (
                        <tr key={idx} className="hover:bg-slate-850/50 transition">
                          <td className="p-3.5 font-extrabold text-white">{fac.name}</td>
                          <td className="p-3.5 text-cyan-300 font-medium">{fac.type}</td>
                          <td className={`p-3.5 font-mono font-bold ${fac.o2.includes('Deficit') ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>{fac.o2}</td>
                          <td className={`p-3.5 font-mono font-bold ${fac.blood.includes('Low Alert') ? 'text-amber-400' : 'text-emerald-400'}`}>{fac.blood}</td>
                          <td className="p-3.5 text-slate-300 font-mono">{fac.vent}</td>
                          <td className="p-3.5 text-center">
                            {isDeficit ? (
                              <button
                                type="button"
                                onClick={() => handleResourceRedirect('Medical O2 & PRBC Blood Units', 'Haveri District Hospital Depot', fac.name)}
                                className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-[11px] rounded-xl shadow-md transition transform hover:scale-105 active:scale-95"
                              >
                                Redirect Surplus Supplies
                              </button>
                            ) : (
                              <span className="text-slate-500 text-[11px] font-semibold">Reserves Stable</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ASHA & PHC MEDICAL OFFICER GOVERNANCE AUDIT */}
        {activeTab === 'staff_audit' && (
          <div className="space-y-6">
            
            {/* ASHA Facilitator Performance Registry */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span>District ASHA Facilitator Honor Roll &amp; NHM Incentive Registry</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Real-time mobile app field tracking</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { name: 'Sanveeka Gowda', taluk: 'Haveri HQ & Somwarpet', cases: 48, visits: '99.4% Compliance', risk: 8, rating: '5.0 ⭐ (Gold Tier)' },
                  { name: 'Manjula G.', taluk: 'Ranebennur & Hoskote Outpost', cases: 54, visits: '98.2% Compliance', risk: 11, rating: '4.9 ⭐ (Gold Tier)' },
                  { name: 'Pooja M.', taluk: 'Hangal Tribal Sector', cases: 42, visits: '97.5% Compliance', risk: 9, rating: '4.8 ⭐ (Silver Tier)' },
                ].map((asha, idx) => (
                  <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between hover:border-purple-500/40 transition">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-white">{asha.name}</span>
                        <span className="text-xs font-extrabold text-amber-400">{asha.rating}</span>
                      </div>
                      <p className="text-xs text-purple-300 font-bold">{asha.taluk}</p>
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-center text-xs">
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-sans">Active Registry</span>
                          <strong className="text-emerald-400">{asha.cases} Mothers</strong>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-sans">ANC Visits</span>
                          <strong className="text-cyan-300">{asha.visits}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleDisburseIncentive(asha.name, 2500)}
                        className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Award className="w-4 h-4 shrink-0" />
                        <span>Disburse ₹2,500 NHM Bonus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHC Medical Officer Zero-Mortality Audit */}
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>PHC Medical Officer Clinical Velocity &amp; Triage Audit</span>
                </h3>
                <span className="text-xs text-emerald-400 font-bold font-mono">100% Zero Maternal Mortality Achieved</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3.5">Primary Health Care (PHC) Unit</th>
                      <th className="p-3.5">Attending Medical Officer</th>
                      <th className="p-3.5">Avg Case Evaluation Speed</th>
                      <th className="p-3.5">Referral Accuracy to DH</th>
                      <th className="p-3.5">Maternal Mortality Rate (MMR)</th>
                      <th className="p-3.5 text-center">Governance Recognition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {[
                      { phc: 'Varthur Primary Health Centre (PHC)', doc: 'Dr. Anoop Kumar S.', speed: '3.8 Minutes', accuracy: '99.5% (High Precision)', mmr: '0 (Zero Death Flag)' },
                      { phc: 'Hoskote Primary Health Centre (PHC)', doc: 'Dr. Priya V. Mathur', speed: '4.2 Minutes', accuracy: '98.9% (Optimal)', mmr: '0 (Zero Death Flag)' },
                      { phc: 'Shiggaon Primary Health Centre (PHC)', doc: 'Dr. Naveen Deshpande', speed: '4.0 Minutes', accuracy: '99.1% (Optimal)', mmr: '0 (Zero Death Flag)' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-850/50 transition">
                        <td className="p-3.5 font-bold text-white">{row.phc}</td>
                        <td className="p-3.5 text-cyan-300 font-semibold">{row.doc}</td>
                        <td className="p-3.5 font-mono text-amber-300 font-bold">{row.speed}</td>
                        <td className="p-3.5 text-emerald-400 font-extrabold">{row.accuracy}</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{row.mmr}</span>
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => alert(`📜 ZERO-MORTALITY EXCELLENCE CERTIFICATE ISSUED!\n\nRecipient: ${row.doc} (${row.phc})\nAwarded by District Health Officer, Haveri under National Health Mission guidelines for maintaining zero maternal & neonatal mortality during FY 2025-2026.`)}
                            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-xl border border-slate-700 transition"
                          >
                            Issue Excellence Certificate
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

        {/* TAB 5: UN SDG 3.1 POLICY CENTER & MMR REVIEW PANEL */}
        {activeTab === 'policy_sdg' && (
          <div className="space-y-6">
            
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2.5">
                    <Globe className="w-6 h-6 text-cyan-400" />
                    <span>United Nations Sustainable Development Goal (SDG 3.1) Policy Center</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    State governance policy radar benchmarking Haveri District maternal care against international UN and National Health Authority (NHA) targets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportDossier}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 shrink-0 active:scale-95"
                >
                  <Download className="w-4 h-4 text-white shrink-0" />
                  <span>Download Complete Policy Dossier</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl relative overflow-hidden">
                  <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Maternal Mortality Ratio (MMR)</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">42 / 100k <span className="text-xs text-slate-400 font-normal">Live Births</span></div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Current empirical MMR across Haveri District. UN SDG Target 3.1 requires all regions to achieve MMR &lt; 70 per 100,000 live births by 2030.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-black text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ UN 2030 Target Surpassed by 40%</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl relative overflow-hidden">
                  <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Infant Mortality Rate (IMR)</div>
                  <div className="text-3xl font-black text-cyan-300 font-mono">14 / 1,000 <span className="text-xs text-slate-400 font-normal">Live Births</span></div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Neonatal survival velocity enhanced via automated Agar score tracking and real-time Partograph intervention during labor stages.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>State Health Mission Gold Medal Benchmark</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl relative overflow-hidden">
                  <div className="text-xs font-black uppercase text-slate-400 tracking-wider">Antenatal Care (4+ ANC Visits)</div>
                  <div className="text-3xl font-black text-indigo-300 font-mono">96.8% <span className="text-xs text-slate-400 font-normal">Compliance</span></div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Percentage of registered rural mothers completing at least 4 mandatory antenatal doctor examinations prior to childbirth.
                  </p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>100% Aadhaar ABDM Seeding Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">State District Directorate Compliance Verification Complete</h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                This executive operations portal is synchronized with National Health Mission (NHM) Karnataka cloud architecture and Ayushman Bharat Digital Mission (ABDM) electronic health registries. All data transmissions meet military-grade FHIR standards.
              </p>
            </div>

          </div>
        )}

      </main>

      {/* LIVE TELE-CONSULTATION MODAL SIMULATION */}
      {selectedTeleConsult && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl max-w-3xl w-full p-7 shadow-2xl space-y-6 relative my-8">
            <button
              type="button"
              onClick={() => setSelectedTeleConsult(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold shadow-lg animate-pulse">
                <Video className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Live Secure Emergency Tele-Consultation Command</h3>
                <p className="text-xs text-slate-400 font-bold">Connecting DHO HQ with Attending ER Surgeon &amp; Hospital Administrator</p>
              </div>
            </div>

            <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-inner">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-ping">
                <Radio className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-1 z-10">
                <div className="text-base font-black text-white">Encrypted FHIR Video Feed Active</div>
                <div className="text-xs text-cyan-300 font-bold">Connected to: Haveri District Hospital (Ward Bed: {selectedTeleConsult.reservedBed?.bedNumber || 'ICU-02'})</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Attending obstetricians and emergency staff have received DHO override directives for patient <strong className="text-white">{selectedTeleConsult.motherName}</strong> ({selectedTeleConsult.ancNumber}).
                </p>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold">
                <span>Audio/Video Quality: HD 1080p (Secured)</span>
                <span>Session ID: DHO-LIVE-9041</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-4 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  handleActionUpdate(selectedTeleConsult.id, 'FUND_APPROVED');
                  setSelectedTeleConsult(null);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95"
              >
                Approve Relief Grant &amp; Conclude Call
              </button>
              <button
                type="button"
                onClick={() => setSelectedTeleConsult(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
              >
                End Tele-Consultation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
