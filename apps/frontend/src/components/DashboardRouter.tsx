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
      return <Navigate to="/labor-dashboard" replace />;
    case 'PATIENT':
      return <Navigate to="/child-profile" replace />;
    case 'ASHA_WORKER':
    case 'ANM':
    default:
      return <Navigate to="/mother-profile" replace />;
  }
};
