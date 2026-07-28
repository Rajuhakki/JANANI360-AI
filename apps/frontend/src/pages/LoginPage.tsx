import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingPage } from './LandingPage';
import { GovernmentHeader } from '../components/landing/GovernmentHeader';
import { HeroSection } from '../components/landing/HeroSection';
import { OverviewSection } from '../components/landing/OverviewSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { StakeholdersSection } from '../components/landing/StakeholdersSection';
import { ReferralWorkflowSection } from '../components/landing/ReferralWorkflowSection';
import { AiClinicalSection } from '../components/landing/AiClinicalSection';
import { EcosystemSection } from '../components/landing/EcosystemSection';
import { ImpactSection } from '../components/landing/ImpactSection';
import { InitiativesSection } from '../components/landing/InitiativesSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { GovernmentFooter } from '../components/landing/GovernmentFooter';
import { LoginModal } from '../components/landing/LoginModal';
import { UserRole } from '../store/authSlice';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [initialRole, setInitialRole] = useState<UserRole>(UserRole.ASHA_WORKER);

  const handleOpenLogin = (role?: UserRole) => {
    if (role) {
      setInitialRole(role);
    }
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <GovernmentHeader onOpenLogin={() => handleOpenLogin()} />

      <main className="flex-grow space-y-0">
        <HeroSection onOpenLogin={() => handleOpenLogin()} />
        <OverviewSection />
        <FeaturesSection />
        <StakeholdersSection onOpenLoginWithRole={(role) => handleOpenLogin(role)} />
        <ReferralWorkflowSection />
        <AiClinicalSection />
        <EcosystemSection />
        <ImpactSection />
        <InitiativesSection />
        <TestimonialsSection />
      </main>

      <GovernmentFooter />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        initialRole={initialRole}
      />
    </div>
  );
};
