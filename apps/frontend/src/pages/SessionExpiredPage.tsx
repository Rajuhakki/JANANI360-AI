import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SessionExpiredPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-amber-950/80 border border-amber-800/80 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-amber-400" />
        </div>

        <h1 className="text-2xl font-bold text-slate-100 mb-2">Session Expired</h1>
        <h2 className="text-sm font-semibold text-amber-400 mb-4">ಅವಧಿ ಮುಗಿದಿದೆ (Session Expired)</h2>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Your security session has expired for safety. Please log in again to continue accessing JANANI360 AI.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <LogIn className="w-4 h-4" />
          Log In Again (ಮತ್ತೆ ಲಾಗಿನ್ ಮಾಡಿ)
        </button>
      </div>
    </div>
  );
};
