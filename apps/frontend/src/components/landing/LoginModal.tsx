import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Stethoscope, 
  HeartHandshake, 
  UserCheck, 
  Building2, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { loginUser, registerUser, clearAuthError, UserRole } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialRole = UserRole.ASHA_WORKER }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    if (initialRole) {
      handleRoleQuickSelect(initialRole);
    }
  }, [initialRole]);

  const handleRoleQuickSelect = (role: UserRole) => {
    setSelectedRole(role);
    dispatch(clearAuthError());
    switch (role) {
      case UserRole.PATIENT:
        setEmail('mother.lakshmi@gmail.com');
        setPassword('Mother@12345');
        break;
      case UserRole.ASHA_WORKER:
        setEmail('asha.manjula@karnataka.gov.in');
        setPassword('Asha@12345');
        break;
      case UserRole.DOCTOR:
        setEmail('doctor.ananth@karnataka.gov.in');
        setPassword('Doctor@12345');
        break;
      case UserRole.HOSPITAL_ADMIN:
        setEmail('admin.suresh@karnataka.gov.in');
        setPassword('Admin@12345');
        break;
      case UserRole.DISTRICT_OFFICER:
        setEmail('dho.mahesh@karnataka.gov.in');
        setPassword('Dho@12345');
        break;
      default:
        setEmail('asha.manjula@karnataka.gov.in');
        setPassword('Asha@12345');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        onClose();
        navigate('/dashboard');
      }
    } else {
      const result = await dispatch(registerUser({
        name,
        email,
        password,
        phone,
        role: selectedRole,
        district
      }));
      if (registerUser.fulfilled.match(result)) {
        setShowOtpModal(true);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 relative border-2 border-emerald-500/35 shadow-2xl my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-sm z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Quick Persona Selector */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
              <span>{t('hero.badge', 'Official Access Portal')}</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-white tracking-tight">JANANI360 AI</h3>
              <p className="text-xs font-medium text-slate-300">{t('auth.personaTitle', 'Select a role below to auto-populate test credentials:')}</p>
            </div>

            {/* Quick 1-Click Role Switcher */}
            <div className="space-y-2.5">
              {[
                { role: UserRole.ASHA_WORKER, title: t('stakeholders.ashaRole'), name: 'Manjula G.', icon: HeartHandshake },
                { role: UserRole.DOCTOR, title: t('stakeholders.moRole'), name: 'Dr. Ananth V.', icon: Stethoscope },
                { role: UserRole.HOSPITAL_ADMIN, title: t('stakeholders.adminRole'), name: 'Dr. Suresh G.', icon: Building2 },
                { role: UserRole.DISTRICT_OFFICER, title: t('stakeholders.dhoRole'), name: 'Dr. Mahesh P.', icon: Building2 },
                { role: UserRole.PATIENT, title: t('stakeholders.motherRole'), name: 'Lakshmi Devi', icon: UserCheck }
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = selectedRole === p.role;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleRoleQuickSelect(p.role)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 shadow-sm ${
                      isSelected 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/15 border-emerald-400 text-white font-bold scale-[1.01]' 
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 font-normal'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold tracking-tight">{p.title}</p>
                        <p className={`text-[11px] ${isSelected ? 'text-emerald-300 font-medium' : 'text-slate-400'}`}>{p.name}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-scale-in" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('auth.compliantBadge', 'ICMR Verified')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{t('auth.encryptedBadge', 'DISHA 256-Bit')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Form */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-slate-950 p-1.5 border border-slate-800 shadow-inner">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); dispatch(clearAuthError()); }}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'login' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('auth.tabLogin', 'Sign In')}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); dispatch(clearAuthError()); }}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'register' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('auth.tabRegister', 'New Official Registration')}
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2.5 shadow-sm">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">{t('auth.nameLabel', 'Full Official Name')}</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sanveeka Gowda"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">{t('auth.emailLabel', 'Official Department Email ID')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@karnataka.gov.in"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">{t('auth.phoneLabel', 'Mobile Phone Number (SMS / WhatsApp)')}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">{t('auth.passwordLabel', 'Secure Password / Security Key')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">{t('auth.districtLabel', 'Assigned State Health District')}</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                  >
                    <option value="Bengaluru Urban">Bengaluru Urban District</option>
                    <option value="Mysuru">Mysuru District</option>
                    <option value="Belagavi">Belagavi Division</option>
                    <option value="Kalaburagi">Kalaburagi Division</option>
                    <option value="Dakshina Kannada">Dakshina Kannada District</option>
                    <option value="Shivamogga">Shivamogga District</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 active:scale-98"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{activeTab === 'login' ? t('auth.loginSubmit', 'Authenticate Official Access') : t('auth.registerSubmit', 'Complete Registration & Verify')}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
            </form>

          </div>

        </div>

      </motion.div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-slate-900/95 p-7 rounded-3xl max-w-sm w-full space-y-5 text-center border-2 border-emerald-500/45 shadow-2xl">
              <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-white">{t('auth.otpTitle', 'Two-Factor OTP Verification')}</h3>
                <p className="text-xs font-medium text-slate-300">{t('auth.otpDesc', 'Enter the 6-digit verification code sent via SMS to your registered official phone number.')}</p>
              </div>
              <input
                type="text"
                maxLength={6}
                defaultValue="123456"
                aria-label="OTP 6-digit Code"
                className="w-full bg-slate-950 border-2 border-emerald-500/50 rounded-xl py-3 text-center text-xl font-mono font-extrabold tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-400 shadow-inner"
              />
              <button
                type="button"
                onClick={() => { setShowOtpModal(false); onClose(); navigate('/dashboard'); }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl hover:from-emerald-400 hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/20 active:scale-98"
              >
                {t('auth.otpVerify', 'Verify OTP & Launch Dashboard')}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
