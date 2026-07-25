import api from './api';

export interface PncVisitPayload {
  motherId: string;
  visitNumber: number;
  maternalPulse: number;
  systolicBp: number;
  diastolicBp: number;
  temperatureF?: number;
  excessiveBleeding?: boolean;
  foulLochia?: boolean;
  breastfeedingStatus?: 'EXCLUSIVE' | 'PARTIAL' | 'NONE';
}

export interface VaccinePayload {
  immunizationRecordId: string;
  batchNumber: string;
}

export interface GrowthPayload {
  childId: string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  muacCm?: number;
}

export const childService = {
  recordPncVisit: async (payload: PncVisitPayload) => {
    const res = await api.post('/children/pnc-visits', payload);
    return res.data;
  },

  recordVaccineAdministration: async (payload: VaccinePayload) => {
    const res = await api.post('/children/vaccines', payload);
    return res.data;
  },

  recordChildGrowth: async (payload: GrowthPayload) => {
    const res = await api.post('/children/growth', payload);
    return res.data;
  },

  getChildProfileHub: async (id: string) => {
    const res = await api.get(`/children/${id}`);
    return res.data;
  }
};
