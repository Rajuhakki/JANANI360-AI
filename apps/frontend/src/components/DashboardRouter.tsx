import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

export const DashboardRouter: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'DISTRICT_OFFICER':
      return <Navigate to="/command-center" replace />;
    case 'HOSPITAL_ADMIN':
      return <Navigate to="/casualty-radar" replace />;
    case 'DOCTOR':
      return <Navigate to="/labor-dashboard" replace />;
    case 'PATIENT':
      return <Navigate to="/mother-profile" replace />;
    case 'ANM':
    case 'ASHA_WORKER':
      return <Navigate to="/asha-dashboard" replace />;
    default:
      return <Navigate to="/mother-profile" replace />;
  }
};
