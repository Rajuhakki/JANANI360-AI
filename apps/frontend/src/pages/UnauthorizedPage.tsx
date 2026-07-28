import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldX, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-950/80 border border-red-800/80 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-slate-100 mb-2">403 - Access Forbidden</h1>
        <h2 className="text-sm font-semibold text-red-400 mb-4">ಅನಧಿಕೃತ ಪ್ರವೇಶ (Jurisdiction / Permission Restriction)</h2>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Your account does not have permission or geographic jurisdiction to access this resource. All unauthorized access attempts are logged for security auditing.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition"
          >
            <Lock className="w-4 h-4" />
            Re-authenticate
          </button>
        </div>
      </div>
    </div>
  );
};
