import api from './api';

export interface PartographPayload {
  laborCaseId: string;
  cervicalDilationCm: number;
  fetalHeartRateBpm: number;
  maternalPulseBpm: number;
  systolicBp: number;
  diastolicBp: number;
  contractionsPer10Min: number;
  membraneStatus?: 'INTACT' | 'RUPTURED_CLEAR' | 'MECONIUM_STAINED';
  dangerSigns?: string;
}

export interface DeliveryPayload {
  laborCaseId: string;
  deliveryMode: 'NORMAL_VAGINAL' | 'LSCS_EMERGENCY' | 'LSCS_ELECTIVE' | 'ASSISTED_VACUUM' | 'ASSISTED_FORCEPS';
  deliveryIndication?: string;
  estimatedBloodLossMl?: number;
  child: {
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    birthWeightKg: number;
    headCircumferenceCm?: number;
    apgarScore1Min?: number;
    apgarScore5Min?: number;
    vitaminKGiven?: boolean;
    bcgVaccineGiven?: boolean;
    opv0Given?: boolean;
    hepB0Given?: boolean;
  };
}

export const laborService = {
  admitLaborCase: async (payload: { motherId: string; pregnancyId: string; facilityId: string; laborRoomNumber?: string }) => {
    const res = await api.post('/labor/admit', payload);
    return res.data;
  },

  addPartographObservation: async (payload: PartographPayload) => {
    const res = await api.post('/labor/partograph', payload);
    return res.data;
  },

  recordDelivery: async (payload: DeliveryPayload) => {
    const res = await api.post('/labor/deliveries', payload);
    return res.data;
  },

  getLaborDashboard: async (facilityId: string) => {
    const res = await api.get(`/labor/dashboard/${facilityId}`);
    return res.data;
  }
};
