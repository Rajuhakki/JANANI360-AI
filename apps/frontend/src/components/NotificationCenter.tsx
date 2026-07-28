import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, AlertTriangle, ShieldCheck, CheckCircle2, Clock, X } from 'lucide-react';

export interface SystemNotification {
  id: string;
  titleEn: string;
  titleKn: string;
  messageEn: string;
  messageKn: string;
  type: 'CRITICAL_RISK' | 'REFERRAL_ALERT' | 'APPOINTMENT' | 'IMMUNIZATION_DUE';
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  language?: 'kn' | 'en';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ language = 'kn' }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-1',
      titleEn: 'HIGH RISK ALERT: Lakshmi Devi',
      titleKn: 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಎಚ್ಚರಿಕೆ: ಲಕ್ಷ್ಮಿ ದೇವಿ',
      messageEn: 'Severe Preeclampsia (BP 165/110) & Hb 6.8 g/dL detected by AI Engine.',
      messageKn: 'ತೀವ್ರ ಪ್ರಿಎಕ್ಲಾಂಪ್ಸಿಯಾ (BP 165/110) ಮತ್ತು Hb 6.8 ಗ್ರಾಂ/ಡೆಸಿಲೀಟರ್ ಪತ್ತೆಯಾಗಿದೆ.',
      type: 'CRITICAL_RISK',
      timestamp: '10 mins ago',
      read: false
    },
    {
      id: 'notif-2',
      titleEn: '108 Ambulance Dispatch',
      titleKn: '108 ಆಂಬ್ಯುಲೆನ್ಸ್ ರವಾನೆ',
      messageEn: 'Vehicle KA-27-F-1080 assigned for transfer to Haveri District Hospital.',
      messageKn: 'ವಾಹನ KA-27-F-1080 ಹಾವೇರಿ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ವರ್ಗಾವಣೆಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ.',
      type: 'REFERRAL_ALERT',
      timestamp: '5 mins ago',
      read: false
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-slate-100 text-sm">
                {language === 'kn' ? 'ಸೂಚನಾ ಕೇಂದ್ರ (Notifications)' : 'Notification Center'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  {language === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ಓದಲಾಗಿದೆ' : 'Mark all read'}
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 transition ${n.read ? 'bg-slate-900/50' : 'bg-slate-800/40 border-l-4 border-emerald-500'}`}
              >
                <div className="flex items-start gap-3">
                  {n.type === 'CRITICAL_RISK' ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-200">
                      {language === 'kn' ? n.titleKn : n.titleEn}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {language === 'kn' ? n.messageKn : n.messageEn}
                    </p>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
