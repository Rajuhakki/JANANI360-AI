import api from './api';

export interface MotherRegistrationPayload {
  rchId?: string;
  abhaId?: string;
  fullName: string;
  age: number;
  phone: string;
  husbandName: string;
  husbandPhone?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  bplCardNumber?: string;
  lmpDate: string;
  gravida?: number;
  parity?: number;
  abortions?: number;
  medicalHistory?: string[];
  highRiskFactors?: string[];
  districtId: string;
  talukId: string;
  hobliId: string;
  villageId: string;
  facilityId: string;
  subCenterId: string;
  catchmentId: string;
}

export interface AncVisitPayload {
  motherId: string;
  pregnancyId: string;
  visitNumber: number;
  gestationalAgeWeeks: number;
  systolicBp: number;
  diastolicBp: number;
  hbLevel: number;
  weightKg: number;
  temperatureF?: number;
  urineProtein?: 'Nil' | '+1' | '+2' | '+3';
  randomBloodSugar?: number;
  fetalHeartRate?: number;
  complaints?: string;
  ifaTabletsDistributed?: number;
}

export const maternalService = {
  registerMother: async (payload: MotherRegistrationPayload) => {
    const res = await api.post('/maternal/mothers', payload);
    return res.data;
  },

  recordAncVisit: async (payload: AncVisitPayload) => {
    const res = await api.post('/maternal/anc-visits', payload);
    return res.data;
  },

  getMotherProfile: async (idOrRch: string) => {
    const res = await api.get(`/maternal/mothers/${idOrRch}`);
    return res.data;
  },

  searchMothers: async (query: string) => {
    const res = await api.get(`/maternal/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },

  getWorkQueue: async () => {
    const res = await api.get('/maternal/work-queue');
    return res.data;
  }
};
