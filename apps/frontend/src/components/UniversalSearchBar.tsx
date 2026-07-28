import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, User, MapPin, Phone, ShieldAlert, Loader2 } from 'lucide-react';
import { maternalService } from '../services/maternalService';

interface Props {
  onSelectMother?: (motherId: string) => void;
  language?: 'kn' | 'en';
}

export const UniversalSearchBar: React.FC<Props> = ({ onSelectMother, language = 'kn' }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await maternalService.searchMothers(query);
        if (res.success) {
          setResults(res.data || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={
            language === 'kn'
              ? 'ಹೆಸರು, ಮೊಬೈಲ್, RCH ID, ABHA ID ಅಥವಾ ಗ್ರಾಮದ ಮೂಲಕ ಹುಡುಕಿ...'
              : 'Search Mother by Name, Mobile, RCH ID, ABHA ID or Village...'
          }
          className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 rounded-xl pl-11 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
        />
        {loading && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin absolute right-3" />}
      </div>

      {/* Results Dropdown */}
      {isFocused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
          {results.map((m) => (
            <div
              key={m.id}
              onClick={() => {
                if (onSelectMother) onSelectMother(m.id);
                setIsFocused(false);
              }}
              className="p-3 hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{m.fullName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">RCH: {m.rchId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {m.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {m.village?.nameEn || 'Kaginele'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.motherSafetyScore < 40
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : m.motherSafetyScore < 60
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  Safety: {m.motherSafetyScore}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
