import api from './api';

export interface DistrictItem {
  id: string;
  code: string;
  nameEn: string;
  nameKn: string;
}

export interface TalukItem {
  id: string;
  code: string;
  nameEn: string;
  nameKn: string;
  districtId: string;
}

export interface HobliItem {
  id: string;
  code: string;
  nameEn: string;
  nameKn: string;
  talukId: string;
}

export interface VillageItem {
  id: string;
  code: string;
  nameEn: string;
  nameKn: string;
  pincode: string;
  hobliId: string;
}

export interface FacilityItem {
  id: string;
  code: string;
  nameEn: string;
  nameKn: string;
  tier: string;
  latitude: number;
  longitude: number;
  emergencyPhone: string;
  talukId: string;
}

export interface SubCenterItem {
  id: string;
  code: string;
  nameEn: string;
  nameKn: string;
  facilityId: string;
}

export interface CatchmentItem {
  id: string;
  code: string;
  name: string;
  population: number;
  subCenterId: string;
  villageId: string;
}

export const masterDataService = {
  fetchDistricts: async (): Promise<DistrictItem[]> => {
    const response = await api.get('/master/districts');
    return response.data.data;
  },

  fetchTaluks: async (districtId: string): Promise<TalukItem[]> => {
    const response = await api.get('/master/taluks', { params: { districtId } });
    return response.data.data;
  },

  fetchHoblis: async (talukId: string): Promise<HobliItem[]> => {
    const response = await api.get('/master/hoblis', { params: { talukId } });
    return response.data.data;
  },

  fetchVillages: async (hobliId: string): Promise<VillageItem[]> => {
    const response = await api.get('/master/villages', { params: { hobliId } });
    return response.data.data;
  },

  fetchFacilities: async (talukId: string, tier?: string): Promise<FacilityItem[]> => {
    const response = await api.get('/master/facilities', { params: { talukId, tier } });
    return response.data.data;
  },

  fetchSubCenters: async (facilityId: string): Promise<SubCenterItem[]> => {
    const response = await api.get('/master/sub-centers', { params: { facilityId } });
    return response.data.data;
  },

  fetchCatchments: async (subCenterId: string): Promise<CatchmentItem[]> => {
    const response = await api.get('/master/catchments', { params: { subCenterId } });
    return response.data.data;
  }
};
