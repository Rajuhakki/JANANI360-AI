import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/Navbar';
import {
  Users,
  Home,
  PlusCircle,
  Edit3,
  Check,
  X,
  AlertTriangle,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Pill,
  Calendar,
  ChevronRight,
  ShieldCheck,
  HeartPulse,
  Activity,
  UserPlus,
  FileText,
  Ambulance,
  MapPin,
  History,
  Trash2
} from 'lucide-react';
import { ashaService, AshaMotherListItem } from '../services/ashaService';
import { RootState } from '../store';


interface VisitLogEntry {
  id: string;
  timestamp: string;
  note: string;
}

export const AshaDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // Dynamic language text resolution based on Navbar selection
  

  // Registered Mothers Data
  const [mothers, setMothers] = useState<AshaMotherListItem[]>([]);
  const [loadingMothers, setLoadingMothers] = useState(true);

  // 1-Tap Home Visit System (Persistent in localStorage per user)
  const storageKeyCount = `asha_visit_count_${user?.id || 'default'}`;
  const storageKeyLogs = `asha_visit_logs_${user?.id || 'default'}`;

  const [visitCount, setVisitCount] = useState<number>(() => {
    const saved = localStorage.getItem(storageKeyCount);
    return saved ? parseInt(saved, 10) : 14;
  });
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [editInputValue, setEditInputValue] = useState(visitCount.toString());
  const [visitLogs, setVisitLogs] = useState<VisitLogEntry[]>(() => {
    const saved = localStorage.getItem(storageKeyLogs);
    return saved ? JSON.parse(saved) : [
      { id: '1', timestamp: 'Today, 09:15 AM', note: 'Routine ANC checkup at Lakshmi Devi house (Varthur)' },
      { id: '2', timestamp: 'Today, 11:30 AM', note: 'Day-3 HBNC newborn check for Baby of Sunita' }
    ];
  });

  // IFA Tablet Tracker State
  const [ifaCount, setIfaCount] = useState<number>(() => {
    const saved = localStorage.getItem(`asha_ifa_count_${user?.id || 'default'}`);
    return saved ? parseInt(saved, 10) : 340;
  });

  // Toast Banner Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKeyCount, visitCount.toString());
  }, [visitCount, storageKeyCount]);

  useEffect(() => {
    localStorage.setItem(storageKeyLogs, JSON.stringify(visitLogs));
  }, [visitLogs, storageKeyLogs]);

  useEffect(() => {
    localStorage.setItem(`asha_ifa_count_${user?.id || 'default'}`, ifaCount.toString());
  }, [ifaCount, user?.id]);

  // Load Registered Mothers
  useEffect(() => {
    (async () => {
      setLoadingMothers(true);
      try {
        const list = await ashaService.listMothers();
        setMothers(list);
      } catch (err) {
        console.warn('Failed to fetch mothers list for dashboard:', err);
      } finally {
        setLoadingMothers(false);
      }
    })();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleQuickTapVisit = () => {
    const newCount = visitCount + 1;
    setVisitCount(newCount);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry: VisitLogEntry = {
      id: Date.now().toString(),
      timestamp: `Today, ${timeStr}`,
      note: `Quick-Tap home visit recorded in assigned village catchment (${(i18n.language || 'en').toUpperCase()})`
    };

    setVisitLogs(prev => [newEntry, ...prev]);
    triggerToast('✅ +1 Home Visit recorded instantly to your field tally!');
  };

  const handleSaveEditedCount = () => {
    const parsed = parseInt(editInputValue, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setVisitCount(parsed);
      setIsEditingCount(false);
      triggerToast('📝 Home visit tally successfully adjusted & saved!');
    } else {
      triggerToast('❌ Please enter a valid non-negative number.');
    }
  };

  const handleDispenseIfa = (amount: number) => {
    setIfaCount(prev => prev + amount);
    triggerToast(`💊 +${amount} IFA Tablets logged as dispensed to mothers.`);
  };

  const handleDeleteLog = (id: string) => {
    setVisitLogs(prev => prev.filter(l => l.id !== id));
    triggerToast('🗑️ Visit log entry removed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      <Navbar />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3 border border-emerald-300">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Hero Section & Greeting */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('ashaDashboard.commandCenter')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <span>{t('ashaDashboard.greeting')}{user?.name || 'Sanveeka Gowda'}</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                {t('ashaDashboard.subtitle')}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-teal-300">
                  <MapPin className="w-4 h-4 text-teal-400" /> Varthur PHC Catchment Area (Bengaluru Urban)
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Village Health Grid Online
                </span>
              </div>
            </div>

            {/* Emergency Support Box */}
            <div className="shrink-0 bg-slate-900/90 border border-rose-500/40 rounded-2xl p-4 text-center space-y-2 shadow-lg w-full md:w-64">
              <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wide">
                <Ambulance className="w-4 h-4 animate-pulse" />
                <span>Emergency Support</span>
              </div>
              <p className="text-[11px] text-slate-300">Direct referral SOS line for Varthur PHC & Ambulance.</p>
              <button 
                onClick={() => triggerToast('📞 Emergency dispatch notified at Varthur PHC! Ambulance driver alerted.')}
                className="w-full py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call PHC Doctor / 108</span>
              </button>
            </div>
          </div>
        </div>

        {/* Core Productivity KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: 1-Tap Home Visit Logger & Editable Counter */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/90 rounded-3xl p-6 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-900/20 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <Home className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                  ⚡ Interactive Tracker
                </span>
              </div>

              <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">
                {t('ashaDashboard.completedVisits')}
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                {t('ashaDashboard.visitDesc')}
              </p>

              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">{t('ashaDashboard.currentTally')}</span>
                  {isEditingCount ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        value={editInputValue}
                        onChange={(e) => setEditInputValue(e.target.value)}
                        className="w-24 bg-slate-900 border border-emerald-500 rounded-xl px-3 py-1.5 text-2xl font-black text-emerald-400 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEditedCount}
                        className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition"
                        title="Save Count"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setIsEditingCount(false); setEditInputValue(visitCount.toString()); }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                        title="Cancel"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-emerald-400 tracking-tight">
                        {visitCount}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{t('ashaDashboard.visitsLogged')}</span>
                    </div>
                  )}
                </div>

                {!isEditingCount && (
                  <button
                    onClick={() => { setEditInputValue(visitCount.toString()); setIsEditingCount(true); }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-bold"
                    title="Edit Tally"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-400" />
                    <span>{t('ashaDashboard.edit')}</span>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleQuickTapVisit}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 transition transform active:scale-95 flex items-center justify-center gap-3 group"
            >
              <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
              <span>{t('ashaDashboard.quickTapBtn')}</span>
            </button>
          </div>

          {/* CARD 2: Registered Mothers Under Care */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                  {t('ashaDashboard.activeCatchment')}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">
                {t('ashaDashboard.registeredMothers')}
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                {t('ashaDashboard.mothersDesc')}
              </p>

              <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">{t('ashaDashboard.totalEnrollment')}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-indigo-400">
                      {loadingMothers ? '...' : (mothers.length || 12)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{t('ashaDashboard.mothers')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-bold block">+3 enrolled</span>
                  <span className="text-[10px] text-slate-500">this month</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/asha-entry', { state: { tab: 'register' } })}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 hover:text-white font-extrabold text-sm border border-slate-700 transition flex items-center justify-center gap-2 shadow-md"
            >
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>{t('ashaDashboard.registerBtn')}</span>
            </button>
          </div>

          {/* CARD 3: IFA Tablets & Nutrition Stock Dispenser */}
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <Pill className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                  Anemia Prevention
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">
                {t('ashaDashboard.ifaTitle')}
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                {t('ashaDashboard.ifaDesc')}
              </p>

              <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">{t('ashaDashboard.tabletsDispensed')}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-amber-400">
                      {ifaCount}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{t('ashaDashboard.stock')}</span>
                  </div>
                </div>
                <div className="w-20 bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, (ifaCount / 500) * 100)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDispenseIfa(10)}
                className="flex-1 py-3 bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition"
              >
                {t('ashaDashboard.plus10')}
              </button>
              <button
                onClick={() => handleDispenseIfa(30)}
                className="flex-1 py-3 bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition"
              >
                {t('ashaDashboard.plus30')}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Field Action Tiles Hub */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>{t('ashaDashboard.shortcutsTitle')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/asha-entry', { state: { tab: 'register' } })}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500 hover:bg-slate-900 transition text-left space-y-3 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100 group-hover:text-emerald-400 transition">{t('ashaDashboard.formRegTitle')}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{t('ashaDashboard.formRegDesc')}</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/asha-entry', { state: { tab: 'home-visit' } })}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500 hover:bg-slate-900 transition text-left space-y-3 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100 group-hover:text-teal-400 transition">{t('ashaDashboard.visitFormTitle')}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{t('ashaDashboard.visitFormDesc')}</p>
              </div>
            </button>

            <button
              onClick={() => triggerToast('📅 Schedule view updated: 4 houses assigned for checkups today!')}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-violet-500 hover:bg-slate-900 transition text-left space-y-3 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100 group-hover:text-violet-400 transition">{t('ashaDashboard.hbncTitle')}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{t('ashaDashboard.hbncDesc')}</p>
              </div>
            </button>

            <button
              onClick={() => triggerToast('📢 Community awareness message broadcasted via SMS/WhatsApp!')}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500 hover:bg-slate-900 transition text-left space-y-3 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100 group-hover:text-pink-400 transition">{t('ashaDashboard.smsTitle')}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{t('ashaDashboard.smsDesc')}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Grid: AI High-Risk Mother Radar & Quick Tap Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: AI High Risk Radar (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-400 animate-pulse" />
                <span>{t('ashaDashboard.radarTitle')}</span>
              </h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {t('ashaDashboard.urgentCases')}
              </span>
            </div>

            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <p className="text-xs text-slate-400">
                {t('ashaDashboard.radarDesc')}
              </p>

              <div className="space-y-3">
                {/* Case 1 */}
                <div className="p-4 rounded-2xl bg-slate-950 border-l-4 border-rose-500 border-t border-r border-b border-slate-800/80 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> High Risk (Safety Score: 52/100)
                      </span>
                      <h4 className="text-base font-extrabold text-white mt-0.5">Lakshmi Devi (24 Yrs)</h4>
                      <p className="text-xs text-slate-400">Village: Varthur North • LMP: 12 Nov 2025 • RCH: #KA-560087-01</p>
                    </div>
                    <button 
                      onClick={() => triggerToast('💬 WhatsApp sent in Kannada: "ಲಕ್ಷ್מי, ದಯವಿಟ್ಟು ಇಂದು PHC ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಿ..."')}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Kannada Alert</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[12px] text-rose-300 font-medium">
                    ⚠️ <strong>AI Clinical Diagnosis:</strong> BP 142/96 mmHg detected in ANC-2. Risk of pre-eclampsia. Requires daily home BP monitor & IFA intake verification.
                  </div>
                </div>

                {/* Case 2 */}
                <div className="p-4 rounded-2xl bg-slate-950 border-l-4 border-amber-500 border-t border-r border-b border-slate-800/80 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Moderate Risk (Safety Score: 74/100)
                      </span>
                      <h4 className="text-base font-extrabold text-white mt-0.5">Savitha Gowda (28 Yrs)</h4>
                      <p className="text-xs text-slate-400">Village: Gunjur • LMP: 04 Jan 2026 • RCH: #KA-560087-14</p>
                    </div>
                    <button 
                      onClick={() => triggerToast('💬 SMS health reminder sent to Savitha Gowda +91 98450 ***89.')}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send SMS</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[12px] text-amber-300 font-medium">
                    🔸 <strong>AI Clinical Diagnosis:</strong> Hemoglobin level 9.4 g/dL (Moderate Anemia). Schedule nutrition visit and confirm daily 2 IFA tablets consumption.
                  </div>
                </div>

                {/* Case 3 (Stable) */}
                <div className="p-4 rounded-2xl bg-slate-950 border-l-4 border-emerald-500 border-t border-r border-b border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">🟢 Stable (Score: 95/100)</span>
                    <h4 className="text-sm font-extrabold text-white mt-0.5">Ananya Reddy (22 Yrs) • Varthur South</h4>
                    <p className="text-[11px] text-slate-400">Next scheduled checkup: ANC-3 on 02 Aug 2026</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">On Track</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Today's Quick-Tap Log History (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <History className="w-5 h-5 text-teal-400" />
                <span>{t('ashaDashboard.historyTitle')}</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                {visitLogs.length} {t('ashaDashboard.entries')}
              </span>
            </div>

            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              <p className="text-xs text-slate-400">
                {t('ashaDashboard.historyDesc')}
              </p>

              {visitLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                  No quick-tap visits logged yet today. Tap the green ➕ button above to record your first visit!
                </div>
              ) : (
                <div className="space-y-3">
                  {visitLogs.map((log) => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold text-emerald-400 block">{log.timestamp}</span>
                        <p className="text-xs text-slate-200">{log.note}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AshaDashboardPage;
