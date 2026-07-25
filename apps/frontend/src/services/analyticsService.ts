import api from './api';

export const analyticsService = {
  getDistrictKpis: async (districtId: string = 'DIST-HAV') => {
    const res = await api.get(`/analytics/district-kpis/${districtId}`);
    return res.data;
  },

  getGisHeatmap: async () => {
    const res = await api.get('/analytics/gis-heatmap');
    return res.data;
  },

  getHospitalResources: async () => {
    const res = await api.get('/analytics/hospital-resources');
    return res.data;
  }
};
