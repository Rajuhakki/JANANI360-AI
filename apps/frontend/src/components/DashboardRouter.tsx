import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

export const DashboardRouter: React.FC = () => {
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
      return <Navigate to="/mother-profile" replace />;
    case 'PATIENT':
      return <Navigate to="/mother-profile" replace />;
    case 'FAMILY':
      return <Navigate to="/track" replace />;
    case 'AMBULANCE_DRIVER':
      return <Navigate to="/referrals" replace />;
    case 'ANM':
    case 'ASHA_WORKER':
      return <Navigate to="/asha-entry" replace />;
    case 'LAB_TECH':
    case 'PHARMACIST':
    default:
      return <Navigate to="/mother-profile" replace />;
  }
};
