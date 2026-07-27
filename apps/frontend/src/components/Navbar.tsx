import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LogOut, ShieldCheck, Heart, LayoutDashboard, Baby, Ambulance } from 'lucide-react';
import { logout } from '../store/authSlice';
import { AppDispatch, RootState } from '../store';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-50 backdrop-blur-md px-6 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-emerald-500/20">
            J
          </div>
          <div>
            <span className="text-base font-bold text-slate-100 flex items-center gap-2">
              JANANI360 AI
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {t('common.officialOs')}
              </span>
            </span>
            <span className="text-[11px] text-slate-400 block -mt-0.5">
              {t('common.karnatakaGovt')}
            </span>
          </div>
        </div>

        {/* Dynamic Role-Scoped Navigation Links */}
        <nav className="flex items-center gap-1 text-xs">
          {(() => {
            const role = user?.role;
            let navs = [
              { path: '/mother-profile', label: 'Maternal Clinical Care', icon: Heart, color: 'text-emerald-400' },
              { path: '/casualty-radar', label: 'Casualty Triage', icon: Ambulance, color: 'text-red-400' },
              { path: '/labor-dashboard', label: 'Labor Room Care', icon: Baby, color: 'text-amber-400' },
              { path: '/child-profile', label: 'Child Immunization', icon: ShieldCheck, color: 'text-teal-400' },
              { path: '/command-center', label: 'District Command Center', icon: LayoutDashboard, color: 'text-indigo-400' }
            ];

            if (role === 'PATIENT') {
              navs = [{ path: '/mother-profile', label: 'My Maternal & Child Passbook', icon: Heart, color: 'text-rose-400' }];
            } else if (role === 'FAMILY') {
              navs = [{ path: '/track', label: 'Family Care Tracker', icon: Heart, color: 'text-rose-400' }];
            } else if (role === 'ASHA_WORKER') {
              navs = [
                { path: '/mother-profile', label: 'Community Field Care', icon: Heart, color: 'text-emerald-400' },
                { path: '/referrals', label: 'Emergency 108 Dispatch', icon: Ambulance, color: 'text-red-400' }
              ];
            } else if (role === 'ANM') {
              navs = [
                { path: '/mother-profile', label: 'Sub-Center Clinical Care', icon: Heart, color: 'text-indigo-400' },
                { path: '/child-profile', label: 'Immunization Drive', icon: ShieldCheck, color: 'text-teal-400' },
                { path: '/referrals', label: 'Emergency Referrals', icon: Ambulance, color: 'text-red-400' }
              ];
            } else if (role === 'DOCTOR') {
              navs = [
                { path: '/mother-profile', label: 'Obstetric Clinical Care', icon: Heart, color: 'text-indigo-400' },
                { path: '/labor-dashboard', label: 'Labor Room & Delivery', icon: Baby, color: 'text-amber-400' },
                { path: '/casualty-radar', label: 'Casualty Emergency Triage', icon: Ambulance, color: 'text-red-400' },
                { path: '/child-profile', label: 'Child Health Hub', icon: ShieldCheck, color: 'text-emerald-400' }
              ];
            } else if (role === 'HOSPITAL_ADMIN') {
              navs = [
                { path: '/casualty-radar', label: 'Casualty & Bed Triage', icon: Ambulance, color: 'text-red-400' },
                { path: '/labor-dashboard', label: 'Labor Room Capacity', icon: Baby, color: 'text-amber-400' }
              ];
            } else if (role === 'AMBULANCE_DRIVER') {
              navs = [{ path: '/referrals', label: '108 Emergency Navigation', icon: Ambulance, color: 'text-red-400' }];
            } else if (role === 'LAB_TECH') {
              navs = [{ path: '/mother-profile', label: 'Clinical Diagnostics & Lab', icon: Heart, color: 'text-teal-400' }];
            } else if (role === 'PHARMACIST') {
              navs = [{ path: '/mother-profile', label: 'Medication Dispensing', icon: Heart, color: 'text-indigo-400' }];
            } else if (role === 'DISTRICT_OFFICER') {
              navs = [
                { path: '/command-center', label: 'District Health Command Center', icon: LayoutDashboard, color: 'text-teal-400' },
                { path: '/mother-profile', label: 'Maternal Risk Overview', icon: Heart, color: 'text-indigo-400' },
                { path: '/casualty-radar', label: 'Casualty & Emergency Triage', icon: Ambulance, color: 'text-red-400' }
              ];
            }

            return navs.map((n) => {
              const Icon = n.icon;
              const active = isActive(n.path);
              return (
                <button
                  key={n.path}
                  onClick={() => navigate(n.path)}
                  className={`px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                    active
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${n.color}`} />
                  <span>{n.label}</span>
                </button>
              );
            });
          })()}
        </nav>

        {/* Global Language Selector & User Profile & Logout */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <LanguageSelector variant="navbar" />

          <div className="text-right text-xs">
            <span className="font-bold text-slate-100 block">{user?.name || 'Authorized Official'}</span>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
              {user?.role || 'ASHA_WORKER'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-950/50"
            title="Logout of JANANI360 OS"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            {t('common.logout')}
          </button>
        </div>
      </div>
    </header>
  );
};
