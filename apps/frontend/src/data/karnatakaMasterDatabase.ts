export interface FacilityInfo {
  name: string;
  type: 'PHC' | 'CHC' | 'SDH' | 'DH' | 'MEDICAL_COLLEGE';
  address: string;
  lat: number;
  lng: number;
  contactPhone: string;
  totalBeds: number;
  availableMaternityBeds: number;
  availableIcuBeds: number;
}

export interface DoctorInfo {
  name: string;
  designation: string;
  registrationNo: string;
  email: string;
  phone: string;
  facilityName: string;
}

export interface TalukMaster {
  name: string;
  facilities: FacilityInfo[];
}

export interface DistrictMaster {
  name: string;
  code: string;
  dhoName: string;
  dhoEmail: string;
  dhoPhone: string;
  dhoOfficeAddress: string;
  taluks: TalukMaster[];
  doctors: DoctorInfo[];
}

export const KARNATAKA_MASTER_DATABASE: DistrictMaster[] = [
  {
    name: 'Bengaluru Urban',
    code: 'KA-BNU',
    dhoName: 'Dr. Ramesh Kumar, MBBS, DPH',
    dhoEmail: 'dho.bengaluruurban@karnataka.gov.in',
    dhoPhone: '+91 80 2221 4455',
    dhoOfficeAddress: 'District Health Office, Anand Rao Circle, Bengaluru - 560009',
    taluks: [
      {
        name: 'Mahadevapura',
        facilities: [
          { name: 'Varthur Primary Health Centre', type: 'PHC', address: 'Main Road, Varthur, Bengaluru 560087', lat: 12.9389, lng: 77.7499, contactPhone: '+91 80 2845 2200', totalBeds: 30, availableMaternityBeds: 12, availableIcuBeds: 2 },
          { name: 'Whitefield Community Health Centre', type: 'CHC', address: 'ECC Road, Whitefield, Bengaluru 560066', lat: 12.9698, lng: 77.7499, contactPhone: '+91 80 2845 1199', totalBeds: 60, availableMaternityBeds: 22, availableIcuBeds: 6 },
          { name: 'Kadugodi Primary Health Centre', type: 'PHC', address: 'Kadugodi Colony, Bengaluru 560067', lat: 12.9984, lng: 77.7612, contactPhone: '+91 80 2845 3344', totalBeds: 20, availableMaternityBeds: 8, availableIcuBeds: 0 }
        ]
      },
      {
        name: 'Bangalore East / Fort',
        facilities: [
          { name: 'Victoria Hospital (BMCRI Medical College)', type: 'MEDICAL_COLLEGE', address: 'Fort Road, Near City Market, Bengaluru 560002', lat: 12.9632, lng: 77.5739, contactPhone: '+91 80 2670 1150', totalBeds: 1200, availableMaternityBeds: 250, availableIcuBeds: 85 },
          { name: 'Vani Vilas Maternal & Children Hospital', type: 'DH', address: 'KR Road, Kalasipalya, Bengaluru 560002', lat: 12.9620, lng: 77.5750, contactPhone: '+91 80 2670 5432', totalBeds: 500, availableMaternityBeds: 180, availableIcuBeds: 40 },
          { name: 'Bowring and Lady Curzon Hospital', type: 'MEDICAL_COLLEGE', address: 'Lady Curzon Road, Shivajinagar, Bengaluru 560001', lat: 12.9825, lng: 77.6045, contactPhone: '+91 80 2559 1325', totalBeds: 700, availableMaternityBeds: 140, availableIcuBeds: 35 }
        ]
      },
      {
        name: 'Yelahanka',
        facilities: [
          { name: 'Yelahanka General Sub-Divisional Hospital', type: 'SDH', address: 'BB Road, Yelahanka Old Town, Bengaluru 560064', lat: 13.1007, lng: 77.5963, contactPhone: '+91 80 2856 2233', totalBeds: 150, availableMaternityBeds: 45, availableIcuBeds: 10 },
          { name: 'Bagalur Primary Health Centre', type: 'PHC', address: 'Main Road, Bagalur, Bengaluru 562149', lat: 13.1345, lng: 77.6654, contactPhone: '+91 80 2847 4411', totalBeds: 25, availableMaternityBeds: 10, availableIcuBeds: 0 }
        ]
      },
      {
        name: 'Anekal',
        facilities: [
          { name: 'Anekal Taluk General Hospital', type: 'SDH', address: 'Thally Road, Anekal, Bengaluru Rural 562106', lat: 12.7113, lng: 77.6966, contactPhone: '+91 80 2784 2345', totalBeds: 100, availableMaternityBeds: 35, availableIcuBeds: 8 },
          { name: 'Attibele Community Health Centre', type: 'CHC', address: 'NH 44, Attibele, Bengaluru 562107', lat: 12.7785, lng: 77.7712, contactPhone: '+91 80 2782 0022', totalBeds: 50, availableMaternityBeds: 18, availableIcuBeds: 4 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Ananth Viswanath, MD (OBG)', designation: 'Senior Medical Officer', registrationNo: 'KMC-45892', email: 'doctor.ananth@karnataka.gov.in', phone: '+91 98450 44556', facilityName: 'Varthur Primary Health Centre' },
      { name: 'Dr. Savitha Sharma, MS (Obstetrics)', designation: 'Head of Department Maternal Care', registrationNo: 'KMC-38912', email: 'savitha.vvh@karnataka.gov.in', phone: '+91 98450 11990', facilityName: 'Vani Vilas Maternal & Children Hospital' },
      { name: 'Dr. Venkatesh Naik, MD (Pediatrics)', designation: 'Chief Pediatrician', registrationNo: 'KMC-51204', email: 'venkatesh.bmcri@karnataka.gov.in', phone: '+91 98450 33441', facilityName: 'Victoria Hospital (BMCRI Medical College)' }
    ]
  },
  {
    name: 'Mysuru',
    code: 'KA-MYS',
    dhoName: 'Dr. K.H. Prasad, MBBS, MD',
    dhoEmail: 'dho.mysuru@karnataka.gov.in',
    dhoPhone: '+91 821 242 1200',
    dhoOfficeAddress: 'Nazarbad, Mysuru - 570010',
    taluks: [
      {
        name: 'Mysuru City',
        facilities: [
          { name: 'Cheluvamba Maternal Hospital & MMCRI', type: 'MEDICAL_COLLEGE', address: 'Irwin Road, Mysuru 570001', lat: 12.3164, lng: 76.6501, contactPhone: '+91 821 242 0555', totalBeds: 600, availableMaternityBeds: 160, availableIcuBeds: 40 },
          { name: 'KR Hospital Mysuru', type: 'DH', address: 'Sayyaji Rao Road, Mysuru 570001', lat: 12.3175, lng: 76.6495, contactPhone: '+91 821 242 3400', totalBeds: 1050, availableMaternityBeds: 210, availableIcuBeds: 65 }
        ]
      },
      {
        name: 'Nanjangud',
        facilities: [
          { name: 'Nanjangud Sub-Divisional Hospital', type: 'SDH', address: 'RP Road, Nanjangud 571301', lat: 12.1189, lng: 76.6812, contactPhone: '+91 8221 226 234', totalBeds: 100, availableMaternityBeds: 30, availableIcuBeds: 6 }
        ]
      },
      {
        name: 'Hunsur',
        facilities: [
          { name: 'Hunsur Community Health Centre', type: 'CHC', address: 'BM Road, Hunsur 571105', lat: 12.3089, lng: 76.2890, contactPhone: '+91 8222 252 100', totalBeds: 60, availableMaternityBeds: 20, availableIcuBeds: 4 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Rajeshwari Amma, MD (OBG)', designation: 'District Gynecologist Specialist', registrationNo: 'KMC-29401', email: 'rajeshwari.cheluvamba@karnataka.gov.in', phone: '+91 94480 12345', facilityName: 'Cheluvamba Maternal Hospital & MMCRI' },
      { name: 'Dr. Suresh Kumar, DCH', designation: 'Pediatric Specialist', registrationNo: 'KMC-41290', email: 'suresh.nanjangud@karnataka.gov.in', phone: '+91 94480 54321', facilityName: 'Nanjangud Sub-Divisional Hospital' }
    ]
  },
  {
    name: 'Belagavi',
    code: 'KA-BLG',
    dhoName: 'Dr. Mahesh Koni, MBBS, DGO',
    dhoEmail: 'dho.belagavi@karnataka.gov.in',
    dhoPhone: '+91 831 240 5000',
    dhoOfficeAddress: 'Civil Hospital Campus, Belagavi - 590001',
    taluks: [
      {
        name: 'Belagavi City',
        facilities: [
          { name: 'BIMS Belagavi Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', address: 'Dr. BR Ambedkar Road, Belagavi 590001', lat: 15.8497, lng: 74.4977, contactPhone: '+91 831 240 5100', totalBeds: 800, availableMaternityBeds: 190, availableIcuBeds: 50 },
          { name: 'Belagavi District Maternity Hospital', type: 'DH', address: 'Club Road, Belagavi 590001', lat: 15.8520, lng: 74.5012, contactPhone: '+91 831 240 5200', totalBeds: 350, availableMaternityBeds: 90, availableIcuBeds: 25 }
        ]
      },
      {
        name: 'Gokak',
        facilities: [
          { name: 'Gokak Taluk General Hospital', type: 'SDH', address: 'Court Road, Gokak 591307', lat: 16.1689, lng: 74.8312, contactPhone: '+91 8332 225 300', totalBeds: 120, availableMaternityBeds: 35, availableIcuBeds: 8 }
        ]
      },
      {
        name: 'Chikkodi',
        facilities: [
          { name: 'Chikkodi Sub-Divisional Hospital', type: 'SDH', address: 'Station Road, Chikkodi 591201', lat: 16.4312, lng: 74.5984, contactPhone: '+91 8338 272 150', totalBeds: 100, availableMaternityBeds: 30, availableIcuBeds: 6 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Prabhakar Patil, MS', designation: 'Medical Superintendent BIMS', registrationNo: 'KMC-18920', email: 'prabhakar.bims@karnataka.gov.in', phone: '+91 94481 22334', facilityName: 'BIMS Belagavi Institute of Medical Sciences' }
    ]
  },
  {
    name: 'Kalaburagi',
    code: 'KA-KLB',
    dhoName: 'Dr. Rajashekhar Mali, MBBS, MD',
    dhoEmail: 'dho.kalaburagi@karnataka.gov.in',
    dhoPhone: '+91 8472 278 600',
    dhoOfficeAddress: 'Sedam Road, Kalaburagi - 585105',
    taluks: [
      {
        name: 'Kalaburagi City',
        facilities: [
          { name: 'GIMS Kalaburagi Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', address: 'Sedam Road, Kalaburagi 585105', lat: 17.3297, lng: 76.8343, contactPhone: '+91 8472 278 650', totalBeds: 750, availableMaternityBeds: 175, availableIcuBeds: 45 }
        ]
      },
      {
        name: 'Sedam',
        facilities: [
          { name: 'Sedam Sub-Divisional Hospital', type: 'SDH', address: 'Main Road, Sedam 585222', lat: 17.1789, lng: 77.2812, contactPhone: '+91 8474 220 120', totalBeds: 80, availableMaternityBeds: 25, availableIcuBeds: 5 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Sharanabasappa Biradar, MD', designation: 'Senior Obstetric Specialist', registrationNo: 'KMC-34190', email: 'sharanu.gims@karnataka.gov.in', phone: '+91 94482 33445', facilityName: 'GIMS Kalaburagi Institute of Medical Sciences' }
    ]
  },
  {
    name: 'Dakshina Kannada',
    code: 'KA-DKN',
    dhoName: 'Dr. Kishore Kumar, MBBS, DPH',
    dhoEmail: 'dho.dakshinakannada@karnataka.gov.in',
    dhoPhone: '+91 824 242 4321',
    dhoOfficeAddress: 'Hampankatta, Mangaluru - 575001',
    taluks: [
      {
        name: 'Mangaluru',
        facilities: [
          { name: 'Lady Goschen Maternal Hospital Mangaluru', type: 'DH', address: 'Hampankatta, Mangaluru 575001', lat: 12.8665, lng: 74.8410, contactPhone: '+91 824 242 4455', totalBeds: 500, availableMaternityBeds: 180, availableIcuBeds: 35 },
          { name: 'Wenlock District Government Hospital', type: 'DH', address: 'KSR Road, Mangaluru 575001', lat: 12.8689, lng: 74.8422, contactPhone: '+91 824 242 4100', totalBeds: 1000, availableMaternityBeds: 200, availableIcuBeds: 60 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Durgesh Naik, MD (OBG)', designation: 'Maternal Specialist Lady Goschen', registrationNo: 'KMC-48190', email: 'durgesh.ladygoschen@karnataka.gov.in', phone: '+91 94483 44556', facilityName: 'Lady Goschen Maternal Hospital Mangaluru' }
    ]
  },
  {
    name: 'Udupi',
    code: 'KA-UDP',
    dhoName: 'Dr. Nagabhushana Udupa, MBBS',
    dhoEmail: 'dho.udupi@karnataka.gov.in',
    dhoPhone: '+91 820 252 0555',
    dhoOfficeAddress: 'Ajjarkad, Udupi - 576101',
    taluks: [
      {
        name: 'Udupi',
        facilities: [
          { name: 'District Government Maternity Hospital Udupi', type: 'DH', address: 'Ajjarkad, Udupi 576101', lat: 13.3412, lng: 74.7489, contactPhone: '+91 820 252 0100', totalBeds: 250, availableMaternityBeds: 80, availableIcuBeds: 20 }
        ]
      },
      {
        name: 'Kundapura',
        facilities: [
          { name: 'Kundapura Sub-Divisional Hospital', type: 'SDH', address: 'Main Road, Kundapura 576201', lat: 13.6289, lng: 74.6912, contactPhone: '+91 8254 230 220', totalBeds: 100, availableMaternityBeds: 30, availableIcuBeds: 6 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Vasudeva Prabhu, MS', designation: 'Chief Medical Officer', registrationNo: 'KMC-31294', email: 'vasudeva.udupi@karnataka.gov.in', phone: '+91 94484 55667', facilityName: 'District Government Maternity Hospital Udupi' }
    ]
  },
  {
    name: 'Hassan',
    code: 'KA-HSN',
    dhoName: 'Dr. Shivakumar, MBBS, MD',
    dhoEmail: 'dho.hassan@karnataka.gov.in',
    dhoPhone: '+91 8172 268 400',
    dhoOfficeAddress: 'BM Road, Hassan - 573201',
    taluks: [
      {
        name: 'Hassan City',
        facilities: [
          { name: 'HIMS Hassan Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', address: 'BM Road, Hassan 573201', lat: 13.0089, lng: 76.1022, contactPhone: '+91 8172 268 450', totalBeds: 650, availableMaternityBeds: 150, availableIcuBeds: 35 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Chandrashekhar H, MD', designation: 'HIMS Gynecological Chief', registrationNo: 'KMC-27891', email: 'chandra.hims@karnataka.gov.in', phone: '+91 94485 66778', facilityName: 'HIMS Hassan Institute of Medical Sciences' }
    ]
  },
  {
    name: 'Mandya',
    code: 'KA-MND',
    dhoName: 'Dr. Bhavani Shankar, MBBS',
    dhoEmail: 'dho.mandya@karnataka.gov.in',
    dhoPhone: '+91 8232 224 100',
    dhoOfficeAddress: 'MC Road, Mandya - 571401',
    taluks: [
      {
        name: 'Mandya City',
        facilities: [
          { name: 'MIMS Mandya Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', address: 'MC Road, Mandya 571401', lat: 12.5289, lng: 76.8984, contactPhone: '+91 8232 224 150', totalBeds: 700, availableMaternityBeds: 160, availableIcuBeds: 40 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Gayatri Devi, MD (OBG)', designation: 'MIMS Maternal Care Lead', registrationNo: 'KMC-39102', email: 'gayatri.mims@karnataka.gov.in', phone: '+91 94486 77889', facilityName: 'MIMS Mandya Institute of Medical Sciences' }
    ]
  },
  {
    name: 'Tumakuru',
    code: 'KA-TMK',
    dhoName: 'Dr. Manjunath Swamy, MBBS, DGO',
    dhoEmail: 'dho.tumakuru@karnataka.gov.in',
    dhoPhone: '+91 816 227 8800',
    dhoOfficeAddress: 'BH Road, Tumakuru - 572101',
    taluks: [
      {
        name: 'Tumakuru City',
        facilities: [
          { name: 'Tumakuru District General Hospital', type: 'DH', address: 'BH Road, Tumakuru 572101', lat: 13.3389, lng: 77.1012, contactPhone: '+91 816 227 8850', totalBeds: 500, availableMaternityBeds: 130, availableIcuBeds: 30 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Lokeshappa, MS', designation: 'District Surgeon', registrationNo: 'KMC-21904', email: 'lokesh.tumkur@karnataka.gov.in', phone: '+91 94487 88990', facilityName: 'Tumakuru District General Hospital' }
    ]
  },
  {
    name: 'Shivamogga',
    code: 'KA-SMG',
    dhoName: 'Dr. Rajesh Suragihalli, MBBS',
    dhoEmail: 'dho.shivamogga@karnataka.gov.in',
    dhoPhone: '+91 8182 222 300',
    dhoOfficeAddress: 'Mc Gann Hospital Campus, Shivamogga - 577201',
    taluks: [
      {
        name: 'Shivamogga City',
        facilities: [
          { name: 'SIMS McGann Teaching Hospital Shivamogga', type: 'MEDICAL_COLLEGE', address: 'Jail Road, Shivamogga 577201', lat: 13.9312, lng: 75.5689, contactPhone: '+91 8182 222 350', totalBeds: 750, availableMaternityBeds: 170, availableIcuBeds: 45 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Siddaramappa, MD', designation: 'SIMS Medical Officer', registrationNo: 'KMC-35912', email: 'siddaramappa.sims@karnataka.gov.in', phone: '+91 94488 99001', facilityName: 'SIMS McGann Teaching Hospital Shivamogga' }
    ]
  },
  {
    name: 'Ballari',
    code: 'KA-BLR',
    dhoName: 'Dr. Janardhan, MBBS, MD',
    dhoEmail: 'dho.ballari@karnataka.gov.in',
    dhoPhone: '+91 8392 272 100',
    dhoOfficeAddress: 'Cantonment, Ballari - 583104',
    taluks: [
      {
        name: 'Ballari City',
        facilities: [
          { name: 'VIMS Vijayanagar Institute of Medical Sciences', type: 'MEDICAL_COLLEGE', address: 'Cantonment, Ballari 583104', lat: 15.1489, lng: 76.9212, contactPhone: '+91 8392 272 150', totalBeds: 900, availableMaternityBeds: 210, availableIcuBeds: 55 }
        ]
      }
    ],
    doctors: [
      { name: 'Dr. Hanumanthappa, MS', designation: 'VIMS Maternal Unit Head', registrationNo: 'KMC-28491', email: 'hanumanthu.vims@karnataka.gov.in', phone: '+91 94489 00112', facilityName: 'VIMS Vijayanagar Institute of Medical Sciences' }
    ]
  }
];
