import api from './api';

export interface AshaVillageOption {
  id: string;
  nameEn: string;
  nameKn: string;
  hobli?: {
    nameEn: string;
    taluk?: {
      nameEn: string;
      district?: { nameEn: string };
    };
  };
}

export interface AshaFacilityOption {
  id: string;
  nameEn: string;
  nameKn: string;
  tier: string;
}

export interface AshaMotherListItem {
  id: string;
  rchId: string;
  fullName: string;
  phone: string;
  village?: { nameEn: string } | null;
}

export interface AshaRegisterMotherPayload {
  fullName: string;
  husbandName: string;
  age: number;
  phone: string;
  address?: string;
  villageId: string;
  facilityId: string;
  lmpDate: string;
  gravida: number;
  parity?: number;
  abortions?: number;
  heightCm?: number;
  weightKg?: number;
  bloodGroup?: string;
  medicalCondition?: string;
}

export interface AshaHomeVisitPayload {
  motherId: string;
  visitDate: string;
  dangerSigns: boolean;
  remarks?: string;
  nextVisitDate?: string;
}

export interface AshaOcrResult {
  motherName?: string;
  husbandName?: string;
  age?: string;
  mobile?: string;
  address?: string;
  village?: string;
  taluk?: string;
  district?: string;
  lmp?: string;
  edd?: string;
  pregnancyNumber?: string;
  parity?: string;
  abortions?: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  medicalCondition?: string;
}

export const ashaService = {
  getFormOptions: async (): Promise<{ villages: AshaVillageOption[]; facilities: AshaFacilityOption[] }> => {
    const res = await api.get('/asha/form-options');
    return { villages: res.data.villages, facilities: res.data.facilities };
  },

  listMothers: async (): Promise<AshaMotherListItem[]> => {
    const res = await api.get('/asha/mothers');
    return res.data.data;
  },

  registerMother: async (payload: AshaRegisterMotherPayload) => {
    const res = await api.post('/asha/mothers', payload);
    return res.data;
  },

  recordHomeVisit: async (payload: AshaHomeVisitPayload) => {
    const res = await api.post('/asha/home-visits', payload);
    return res.data;
  },

  scanAntenatalCard: async (imageBase64?: string, filename?: string, mimeType?: string) => {
    const res = await api.post('/asha/ocr-scan', { imageBase64, filename, mimeType });
    return res.data as {
      success: boolean;
      data: AshaOcrResult;
      confidenceScores: Record<string, number>;
      message?: string;
    };
  }
};
