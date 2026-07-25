export interface TalukFacility {
  name: string;
  facilities: { name: string; type: 'PHC' | 'CHC' | 'SDH' | 'DH' | 'MEDICAL_COLLEGE'; lat: number; lng: number }[];
}

export interface DistrictGeo {
  name: string;
  code: string;
  taluks: TalukFacility[];
}

export const KARNATAKA_DISTRICTS: DistrictGeo[] = [
  {
    name: 'Bengaluru Urban',
    code: 'KA-BNU',
    taluks: [
      {
        name: 'Mahadevapura',
        facilities: [
          { name: 'Varthur Primary Health Centre', type: 'PHC', lat: 12.9389, lng: 77.7499 },
          { name: 'Whitefield Community Health Centre', type: 'CHC', lat: 12.9698, lng: 77.7499 },
          { name: 'Kadugodi Primary Health Centre', type: 'PHC', lat: 12.9984, lng: 77.7612 }
        ]
      },
      {
        name: 'Bangalore East / Fort',
        facilities: [
          { name: 'Victoria Tertiary Medical College Hospital', type: 'MEDICAL_COLLEGE', lat: 12.9632, lng: 77.5739 },
          { name: 'Vani Vilas Maternal & Child Hospital', type: 'DH', lat: 12.9620, lng: 77.5750 },
          { name: 'Bowring and Lady Curzon Hospital', type: 'MEDICAL_COLLEGE', lat: 12.9825, lng: 77.6045 }
        ]
      },
      {
        name: 'Yelahanka',
        facilities: [
          { name: 'Yelahanka General Hospital', type: 'SDH', lat: 13.1007, lng: 77.5963 },
          { name: 'Bagalur Primary Health Centre', type: 'PHC', lat: 13.1345, lng: 77.6654 }
        ]
      },
      {
        name: 'Anekal',
        facilities: [
          { name: 'Anekal Taluk Hospital', type: 'SDH', lat: 12.7113, lng: 77.6966 },
          { name: 'Attibele Community Health Centre', type: 'CHC', lat: 12.7785, lng: 77.7712 },
          { name: 'Chandapura PHC', type: 'PHC', lat: 12.7984, lng: 77.7012 }
        ]
      }
    ]
  },
  {
    name: 'Mysuru',
    code: 'KA-MYS',
    taluks: [
      {
        name: 'Mysuru City',
        facilities: [
          { name: 'KR Hospital & Mysore Medical College', type: 'MEDICAL_COLLEGE', lat: 12.3164, lng: 76.6501 },
          { name: 'Cheluvamba Maternal Hospital Mysuru', type: 'DH', lat: 12.3175, lng: 76.6495 },
          { name: 'Jayadeva Cardiology Satellite Center', type: 'DH', lat: 12.3210, lng: 76.6450 }
        ]
      },
      {
        name: 'Nanjangud',
        facilities: [
          { name: 'Nanjangud Taluk General Hospital', type: 'SDH', lat: 12.1189, lng: 76.6812 },
          { name: 'Hullahalli Primary Health Centre', type: 'PHC', lat: 12.0520, lng: 76.5412 }
        ]
      },
      {
        name: 'Hunsur',
        facilities: [
          { name: 'Hunsur Community Health Centre', type: 'CHC', lat: 12.3089, lng: 76.2890 },
          { name: 'Gawdagere PHC', type: 'PHC', lat: 12.3512, lng: 76.3210 }
        ]
      }
    ]
  },
  {
    name: 'Belagavi',
    code: 'KA-BLG',
    taluks: [
      {
        name: 'Belagavi City',
        facilities: [
          { name: 'BIMS Belagavi Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', lat: 15.8497, lng: 74.4977 },
          { name: 'Belagavi District Hospital', type: 'DH', lat: 15.8520, lng: 74.5012 }
        ]
      },
      {
        name: 'Gokak',
        facilities: [
          { name: 'Gokak Taluk Hospital', type: 'SDH', lat: 16.1689, lng: 74.8312 },
          { name: 'Koujalgi PHC', type: 'PHC', lat: 16.1210, lng: 74.9120 }
        ]
      },
      {
        name: 'Chikkodi',
        facilities: [
          { name: 'Chikkodi Sub-Divisional Hospital', type: 'SDH', lat: 16.4312, lng: 74.5984 },
          { name: 'Nipani Community Health Centre', type: 'CHC', lat: 16.5689, lng: 74.3789 }
        ]
      }
    ]
  },
  {
    name: 'Kalaburagi',
    code: 'KA-KLB',
    taluks: [
      {
        name: 'Kalaburagi City',
        facilities: [
          { name: 'GIMS Kalaburagi Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', lat: 17.3297, lng: 76.8343 },
          { name: 'Kalaburagi District Maternity Hospital', type: 'DH', lat: 17.3350, lng: 76.8410 }
        ]
      },
      {
        name: 'Sedam',
        facilities: [
          { name: 'Sedam Taluk Hospital', type: 'SDH', lat: 17.1789, lng: 77.2812 },
          { name: 'Malkhed PHC', type: 'PHC', lat: 17.1890, lng: 77.1654 }
        ]
      }
    ]
  },
  {
    name: 'Dakshina Kannada',
    code: 'KA-DKN',
    taluks: [
      {
        name: 'Mangaluru',
        facilities: [
          { name: 'Wenlock District Hospital Mangaluru', type: 'DH', lat: 12.8689, lng: 74.8422 },
          { name: 'Lady Goschen Maternal Hospital', type: 'DH', lat: 12.8665, lng: 74.8410 }
        ]
      },
      {
        name: 'Bantwal',
        facilities: [
          { name: 'Bantwal Community Health Centre', type: 'CHC', lat: 12.8912, lng: 75.0312 }
        ]
      }
    ]
  },
  {
    name: 'Hassan',
    code: 'KA-HSN',
    taluks: [
      {
        name: 'Hassan City',
        facilities: [
          { name: 'HIMS Hassan Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', lat: 13.0089, lng: 76.1022 }
        ]
      },
      {
        name: 'Arsikere',
        facilities: [
          { name: 'Arsikere Taluk Hospital', type: 'SDH', lat: 13.3120, lng: 76.2589 }
        ]
      }
    ]
  },
  {
    name: 'Mandya',
    code: 'KA-MND',
    taluks: [
      {
        name: 'Mandya City',
        facilities: [
          { name: 'MIMS Mandya Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', lat: 12.5289, lng: 76.8984 }
        ]
      },
      {
        name: 'Maddur',
        facilities: [
          { name: 'Maddur Community Health Centre', type: 'CHC', lat: 12.5890, lng: 77.0412 }
        ]
      }
    ]
  },
  {
    name: 'Tumakuru',
    code: 'KA-TMK',
    taluks: [
      {
        name: 'Tumakuru City',
        facilities: [
          { name: 'Tumakuru District Hospital', type: 'DH', lat: 13.3389, lng: 77.1012 }
        ]
      },
      {
        name: 'Sira',
        facilities: [
          { name: 'Sira Taluk Hospital', type: 'SDH', lat: 13.7412, lng: 76.9084 }
        ]
      }
    ]
  },
  {
    name: 'Shivamogga',
    code: 'KA-SMG',
    taluks: [
      {
        name: 'Shivamogga City',
        facilities: [
          { name: 'SIMS Shivamogga Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', lat: 13.9312, lng: 75.5689 }
        ]
      },
      {
        name: 'Bhadravathi',
        facilities: [
          { name: 'Bhadravathi General Hospital', type: 'SDH', lat: 13.8412, lng: 75.7012 }
        ]
      }
    ]
  },
  {
    name: 'Ballari',
    code: 'KA-BLR',
    taluks: [
      {
        name: 'Ballari City',
        facilities: [
          { name: 'VIMS Vijayanagar Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', lat: 15.1489, lng: 76.9212 }
        ]
      }
    ]
  }
];
