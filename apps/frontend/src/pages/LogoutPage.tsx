import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle2, ArrowRight } from 'lucide-react';
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store';

export const LogoutPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-6 relative">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-100">Logged Out Successfully</h2>
          <p className="text-xs text-slate-400 mt-1">
            Your JWT session has been terminated and security tokens cleared.
          </p>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
        >
          Return to Login <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
