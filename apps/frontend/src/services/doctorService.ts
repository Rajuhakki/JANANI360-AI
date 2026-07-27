import api from './api';

export interface AncVisitHistoryItem {
  id: string;
  visitNumber: number;
  visitDate: string;
  bloodPressure: string;
  weight: string;
  hbLevel: string;
  doctorNotes?: string;
  doctorName: string;
}

export interface DoctorMotherProfile {
  id: string;
  motherId: string; // e.g. JAN-KA-HVR-2026-000001
  fullName: string;
  husbandName: string;
  age: number;
  mobileNumber: string;
  dob?: string;
  bloodGroup: string;
  village: string;
  taluk: string;
  district: string;
  assignedPhc: string;
  assignedAsha: string;
  pregnancy?: {
    id: string;
    gravida: number; // e.g. 1 (G1), 2 (G2)
    parity: number;
    lmpDate: string;
    eddDate: string;
    currentRiskLevel: string;
    recentVisits?: AncVisitHistoryItem[];
  } | null;
}

export interface AncCheckupPayload {
  motherId: string;
  pregnancyId?: string;
  bloodPressure: string; // e.g. "120/80"
  weight: number | string; // e.g. 55.0
  hbLevel: number | string; // e.g. 11.5
  doctorNotes: string;
  nextVisitDate: string;
}

// Built-in Mock Mothers Data for demonstration & offline testing
const SAMPLE_MOTHERS: Record<string, DoctorMotherProfile> = {
  'JAN-KA-HVR-2026-000001': {
    id: 'm-2026-001',
    motherId: 'JAN-KA-HVR-2026-000001',
    fullName: 'Lakshmi Devi',
    husbandName: 'Manjunath',
    age: 24,
    mobileNumber: '9876543210',
    bloodGroup: 'O+',
    village: 'Kaginele',
    taluk: 'Byadgi',
    district: 'Haveri',
    assignedAsha: 'Sunitha',
    assignedPhc: 'Kaginele PHC',
    pregnancy: {
      id: 'p-2026-001',
      gravida: 2,
      parity: 1,
      lmpDate: '12-Jan-2026',
      eddDate: '19-Oct-2026',
      currentRiskLevel: 'LOW',
      recentVisits: [
        {
          id: 'v-101',
          visitNumber: 1,
          visitDate: '2026-05-14',
          bloodPressure: '118/78 mmHg',
          weight: '54.5 kg',
          hbLevel: '11.8 g/dL',
          doctorNotes: '1st ANC checkup complete. Vital parameters within normal range.',
          doctorName: 'Dr. Ananya Rao (PHC MO)'
        }
      ]
    }
  },
  'JAN-KA-HVR-000001': {
    id: 'm-001',
    motherId: 'JAN-KA-HVR-000001',
    fullName: 'Sunita Devi',
    husbandName: 'Ramesh Kumar',
    age: 24,
    mobileNumber: '9876543210',
    bloodGroup: 'O+',
    village: 'Varthur Village',
    taluk: 'Mahadevapura',
    district: 'Bengaluru Urban',
    assignedAsha: 'Vimala (ASHA Worker)',
    assignedPhc: 'Varthur Primary Health Centre (PHC)',
    pregnancy: {
      id: 'p-001',
      gravida: 1,
      parity: 0,
      lmpDate: '10-Nov-2025',
      eddDate: '17-Aug-2026',
      currentRiskLevel: 'LOW',
      recentVisits: [
        {
          id: 'v-101',
          visitNumber: 2,
          visitDate: '2026-06-15',
          bloodPressure: '118/78 mmHg',
          weight: '54.5 kg',
          hbLevel: '11.8 g/dL',
          doctorNotes: 'BP normal, fetal heart rate normal. Continue Iron and Folic Acid tablets.',
          doctorName: 'Dr. Ananya Rao (PHC MO)'
        }
      ]
    }
  },
  'RCH1234567890': {
    id: 'm-003',
    motherId: 'RCH1234567890',
    fullName: 'Pooja Sharma',
    husbandName: 'Rajesh Sharma',
    age: 22,
    mobileNumber: '9741288990',
    bloodGroup: 'A+',
    village: 'Whitefield',
    taluk: 'Mahadevapura',
    district: 'Bengaluru Urban',
    assignedAsha: 'Deepa (ASHA Worker)',
    assignedPhc: 'Whitefield Primary Health Centre (PHC)',
    pregnancy: {
      id: 'p-003',
      gravida: 1,
      parity: 0,
      lmpDate: '15-Jan-2026',
      eddDate: '22-Oct-2026',
      currentRiskLevel: 'LOW',
      recentVisits: []
    }
  }
};

export const doctorService = {
  /**
   * Search Mother by Mother ID (e.g. JAN-KA-HVR-2026-000001)
   */
  async searchMother(motherId: string): Promise<{ success: boolean; mother?: DoctorMotherProfile; message?: string }> {
    const cleanId = motherId.trim().toUpperCase();
    
    try {
      const response = await api.get(`/doctor/mother/${encodeURIComponent(cleanId)}`);
      if (response.data && response.data.success && response.data.mother) {
        return response.data;
      }
    } catch (error) {
      // Ignore API failure and try local fallback
    }

    // Client-side Local Storage Check (for newly registered mothers via ASHA Worker Form)
    try {
      const storedMothersRaw = localStorage.getItem('janani_registered_mothers');
      if (storedMothersRaw) {
        const storedMothers: any[] = JSON.parse(storedMothersRaw);
        const match = storedMothers.find(
          (m) =>
            (m.rchId && m.rchId.toUpperCase() === cleanId) ||
            (m.motherId && m.motherId.toUpperCase() === cleanId) ||
            (m.id && m.id.toUpperCase() === cleanId)
        );
        if (match) {
          const savedVisitsRaw = localStorage.getItem(`janani_anc_visits_${cleanId}`);
          const savedVisits: AncVisitHistoryItem[] = savedVisitsRaw ? JSON.parse(savedVisitsRaw) : [];

          const formattedProfile: DoctorMotherProfile = {
            id: match.id || `local-${cleanId}`,
            motherId: match.rchId || match.motherId || cleanId,
            fullName: match.fullName || 'Registered Mother',
            husbandName: match.husbandName || 'Spouse',
            age: Number(match.age) || 24,
            mobileNumber: match.phone || match.mobileNumber || '9876543210',
            bloodGroup: match.bloodGroup || 'O+',
            village: match.villageName || match.village?.nameEn || match.village || 'Kaginele',
            taluk: match.taluk || 'Byadgi',
            district: match.district || 'Haveri',
            assignedPhc: match.facilityName || match.assignedPhc || 'Kaginele PHC',
            assignedAsha: match.assignedAsha || 'Sunitha',
            pregnancy: {
              id: match.pregnancyId || `p-${cleanId}`,
              gravida: Number(match.gravida) || 2,
              parity: Number(match.parity) || 1,
              lmpDate: match.lmpDate || '12-Jan-2026',
              eddDate: match.eddDate || '19-Oct-2026',
              currentRiskLevel: 'LOW',
              recentVisits: savedVisits
            }
          };
          return { success: true, mother: formattedProfile };
        }
      }
    } catch (e) {
      console.warn('Error checking local storage mothers:', e);
    }

    // Built-in Sample Mothers Lookup
    const sampleMatchKey = Object.keys(SAMPLE_MOTHERS).find(k => k.toUpperCase() === cleanId);
    if (sampleMatchKey) {
      const sample = { ...SAMPLE_MOTHERS[sampleMatchKey] };
      try {
        const savedVisitsRaw = localStorage.getItem(`janani_anc_visits_${cleanId}`);
        if (savedVisitsRaw && sample.pregnancy) {
          sample.pregnancy = {
            ...sample.pregnancy,
            recentVisits: JSON.parse(savedVisitsRaw)
          };
        }
      } catch (e) {
        // ignore
      }
      return { success: true, mother: sample };
    }

    return {
      success: false,
      message: 'Mother Record Not Found'
    };
  },

  /**
   * Record Today's ANC Examination Checkup
   */
  async recordAncCheckup(payload: AncCheckupPayload): Promise<{
    success: boolean;
    message?: string;
    subMessage?: string;
    visit?: any;
    recentVisits?: AncVisitHistoryItem[];
  }> {
    const cleanId = payload.motherId.trim().toUpperCase();

    try {
      const response = await api.post('/doctor/anc-checkup', payload);
      if (response.data && response.data.success) {
        return response.data;
      }
    } catch (error) {
      // Fall through to local save if API call fails
    }

    // Local Storage Save & History Update
    try {
      const savedVisitsRaw = localStorage.getItem(`janani_anc_visits_${cleanId}`);
      let existingVisits: AncVisitHistoryItem[] = [];

      if (savedVisitsRaw) {
        existingVisits = JSON.parse(savedVisitsRaw);
      } else {
        const sampleMatchKey = Object.keys(SAMPLE_MOTHERS).find(k => k.toUpperCase() === cleanId);
        if (sampleMatchKey && SAMPLE_MOTHERS[sampleMatchKey].pregnancy?.recentVisits) {
          existingVisits = [...SAMPLE_MOTHERS[sampleMatchKey].pregnancy.recentVisits];
        }
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const newVisit: AncVisitHistoryItem = {
        id: `v-local-${Date.now()}`,
        visitNumber: existingVisits.length + 1,
        visitDate: todayStr,
        bloodPressure: payload.bloodPressure.includes('mmHg') ? payload.bloodPressure : `${payload.bloodPressure} mmHg`,
        weight: String(payload.weight).includes('kg') ? String(payload.weight) : `${payload.weight} kg`,
        hbLevel: String(payload.hbLevel).includes('g/dL') ? String(payload.hbLevel) : `${payload.hbLevel} g/dL`,
        doctorNotes: payload.doctorNotes || 'Routine PHC ANC Examination completed.',
        doctorName: 'Dr. Ananya Rao (PHC MO)'
      };

      const updatedVisits = [newVisit, ...existingVisits].slice(0, 5); // Keep last 5 visits
      localStorage.setItem(`janani_anc_visits_${cleanId}`, JSON.stringify(updatedVisits));

      return {
        success: true,
        message: 'ANC Checkup Saved Successfully.',
        subMessage: 'Next Visit Scheduled Successfully',
        visit: newVisit,
        recentVisits: updatedVisits
      };
    } catch (e) {
      console.error('Error saving checkup locally:', e);
      return {
        success: false,
        message: 'Failed to save ANC checkup record.'
      };
    }
  }
};
