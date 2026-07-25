import api from './api';

export interface InitiateReferralPayload {
  motherId: string;
  destinationFacilityId: string;
  clinicalReason: string;
  priority?: 'ROUTINE' | 'URGENT' | 'EMERGENCY' | 'LIFE_THREATENING';
}

export interface AcceptReferralPayload {
  referralId: string;
  action: 'ACCEPT' | 'REJECT';
  rejectionReason?: string;
}

export interface TelemetryPayload {
  referralId: string;
  currentLat: number;
  currentLng: number;
  etaMinutes: number;
  status?: 'EN_ROUTE' | 'IN_TRANSIT' | 'ARRIVED';
}

export const referralService = {
  initiateReferral: async (payload: InitiateReferralPayload) => {
    const res = await api.post('/referrals/initiate', payload);
    return res.data;
  },

  acceptReferral: async (payload: AcceptReferralPayload) => {
    const res = await api.post('/referrals/accept', payload);
    return res.data;
  },

  updateTelemetry: async (payload: TelemetryPayload) => {
    const res = await api.post('/referrals/telemetry', payload);
    return res.data;
  },

  casualtyHandover: async (referralId: string) => {
    const res = await api.post('/referrals/casualty-handover', { referralId });
    return res.data;
  },

  getCasualtyRadar: async (facilityId: string) => {
    const res = await api.get(`/referrals/casualty-radar/${facilityId}`);
    return res.data;
  },

  getFamilyPortal: async (code: string) => {
    const res = await api.get(`/referrals/family-portal/${code}`);
    return res.data;
  }
};
