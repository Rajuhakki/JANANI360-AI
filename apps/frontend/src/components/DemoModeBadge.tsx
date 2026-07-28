import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface DemoModeBadgeProps {
  currentRole?: string;
  onSwitchRole?: (role: string) => void;
}

export const DemoModeBadge: React.FC<DemoModeBadgeProps> = ({ currentRole, onSwitchRole }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-xs flex flex-wrap items-center justify-between text-amber-200">
      <div className="flex items-center gap-2 font-medium">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span className="bg-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
          Hackathon Demo Mode Active
        </span>
        <span>
          Real Karnataka Master Data & Role-Based RBAC Connected
        </span>
      </div>

      {currentRole && (
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Active Role:</span>
          <span className="font-bold text-emerald-400">{currentRole}</span>
        </div>
      )}
    </div>
  );
};
