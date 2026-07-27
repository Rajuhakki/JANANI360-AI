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
      case UserRole.DISTRICT_OFFICER:
        setEmail('dho.mahesh@karnataka.gov.in');
        setPassword('Dho@12345');
        break;
      case UserRole.HOSPITAL_ADMIN:
        setEmail('admin.suresh@karnataka.gov.in');
        setPassword('Admin@12345');
        break;
      case UserRole.DOCTOR:
        setEmail('doctor.ananth@karnataka.gov.in');
        setPassword('Doctor@12345');
        break;
      case UserRole.ASHA_WORKER:
        setEmail('asha.manjula@karnataka.gov.in');
        setPassword('Asha@12345');
        break;
      case UserRole.PATIENT:
        setEmail('mother.lakshmi@gmail.com');
        setPassword('Mother@12345');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl glass-panel-accent rounded-3xl p-6 sm:p-8 relative border border-emerald-500/30 shadow-2xl my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Persona Selector */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.badge')}</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">JANANI360 AI</h3>
              <p className="text-xs text-slate-400">{t('auth.personaTitle')}</p>
            </div>

            {/* Quick 1-Click Role Switcher */}
            <div className="space-y-2">
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
                    className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected 
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold">{p.title}</p>
                        <p className="text-[10px] text-slate-400">{p.name}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center space-x-4 space-x-reverse text-[11px] text-slate-400">
              <div className="flex items-center space-x-1 space-x-reverse">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('auth.compliantBadge')}</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('auth.encryptedBadge')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Form */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); dispatch(clearAuthError()); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === 'login' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('auth.tabLogin')}
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); dispatch(clearAuthError()); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === 'register' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('auth.tabRegister')}
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2 space-x-reverse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('auth.nameLabel')}</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sanveeka Gowda"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('auth.emailLabel')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@karnataka.gov.in"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('auth.phoneLabel')}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('auth.passwordLabel')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t('auth.districtLabel')}</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="Bengaluru Urban">Bengaluru Urban</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Belagavi">Belagavi</option>
                    <option value="Kalaburagi">Kalaburagi</option>
                    <option value="Dakshina Kannada">Dakshina Kannada</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{activeTab === 'login' ? t('auth.loginSubmit') : t('auth.registerSubmit')}</span>
                    <ArrowRight className="w-4 h-4" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="glass-panel p-6 rounded-3xl max-w-sm w-full space-y-4 text-center border border-emerald-500/40">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">{t('auth.otpTitle')}</h3>
              <p className="text-xs text-slate-400">{t('auth.otpDesc')}</p>
              <input
                type="text"
                maxLength={6}
                defaultValue="123456"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 text-center text-lg font-mono tracking-widest text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => { setShowOtpModal(false); onClose(); navigate('/dashboard'); }}
                className="w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition"
              >
                {t('auth.otpVerify')}
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
