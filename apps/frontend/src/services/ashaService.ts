import api from './api';

export interface AshaVillageOption {
  id: string;
  nameEn: string;
  nameKn: string;
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
  age: number;
  phone: string;
  villageId: string;
  facilityId: string;
  lmpDate: string;
  gravida: number;
}

export interface AshaHomeVisitPayload {
  motherId: string;
  visitDate: string;
  dangerSigns: boolean;
  remarks?: string;
  nextVisitDate?: string;
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
  }
};
