export type PermissionKey =
  | 'PATIENT_REGISTER'
  | 'ANC_VITALS_WRITE'
  | 'ANC_VALIDATE'
  | 'PRESCRIPTION_WRITE'
  | 'REFERRAL_CREATE'
  | 'BED_MANAGE'
  | 'BLOOD_REQUISITION'
  | 'LAB_RESULT_WRITE'
  | 'DRUG_DISPENSE'
  | 'TRIP_NAVIGATE'
  | 'DISTRICT_ANALYTICS'
  | 'PATIENT_SELF_VIEW'
  | 'STAFF_MANAGE';

export interface MenuItem {
  id: string;
  labelEn: string;
  labelKn: string;
  path: string;
  iconName: string;
  requiredPermissions: PermissionKey[];
}

export const MASTER_MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    labelEn: 'Dashboard Overview',
    labelKn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    path: '/dashboard',
    iconName: 'LayoutDashboard',
    requiredPermissions: [] // Available to all authenticated roles
  },
  {
    id: 'maternal-care',
    labelEn: 'Maternal Care & Vitals',
    labelKn: 'ತಾಯಂದಿರ ಪಾಲನೆ',
    path: '/maternal-care',
    iconName: 'HeartHandshake',
    requiredPermissions: ['ANC_VITALS_WRITE']
  },
  {
    id: 'referrals',
    labelEn: 'Emergency Referrals & 108',
    labelKn: 'ತುರ್ತು ವರ್ಗಾವಣೆ 108',
    path: '/referrals',
    iconName: 'Ambulance',
    requiredPermissions: ['REFERRAL_CREATE']
  },
  {
    id: 'hospital-management',
    labelEn: 'Casualty & Bed Management',
    labelKn: 'ಆಸ್ಪತ್ರೆ ಹಾಸಿಗೆ ನಿರ್ವಹಣೆ',
    path: '/hospital-management',
    iconName: 'Building2',
    requiredPermissions: ['BED_MANAGE']
  },
  {
    id: 'pediatric-care',
    labelEn: 'Child Health & Immunization',
    labelKn: 'ಮಕ್ಕಳ ಆರೋಗ್ಯ ಮತ್ತು ಲಸಿಕೆ',
    path: '/pediatric-care',
    iconName: 'Baby',
    requiredPermissions: ['PATIENT_REGISTER']
  },
  {
    id: 'command-center',
    labelEn: 'District Command Center',
    labelKn: 'ಜಿಲ್ಲಾ ಕಮಾಂಡ್ ಸೆಂಟರ್',
    path: '/command-center',
    iconName: 'ShieldAlert',
    requiredPermissions: ['DISTRICT_ANALYTICS']
  },
  {
    id: 'mother-portal',
    labelEn: 'Mother Personal Health Portal',
    labelKn: 'ತಾಯಿಯ ವೈಯಕ್ತಿಕ ಪೋರ್ಟಲ್',
    path: '/mother-portal',
    iconName: 'User',
    requiredPermissions: ['PATIENT_SELF_VIEW']
  }
];

export const ROLE_PERMISSIONS_MAP: Record<string, PermissionKey[]> = {
  ASHA_WORKER: ['PATIENT_REGISTER', 'ANC_VITALS_WRITE', 'REFERRAL_CREATE'],
  ANM: ['PATIENT_REGISTER', 'ANC_VITALS_WRITE', 'ANC_VALIDATE', 'REFERRAL_CREATE'],
  DOCTOR: [
    'PATIENT_REGISTER', 
    'ANC_VITALS_WRITE', 
    'ANC_VALIDATE', 
    'PRESCRIPTION_WRITE', 
    'REFERRAL_CREATE', 
    'BED_MANAGE', 
    'BLOOD_REQUISITION'
  ],
  HOSPITAL_ADMIN: ['BED_MANAGE', 'BLOOD_REQUISITION', 'STAFF_MANAGE'],
  DISTRICT_OFFICER: ['DISTRICT_ANALYTICS', 'STAFF_MANAGE'],
  PATIENT: ['PATIENT_SELF_VIEW'],
  FAMILY: ['PATIENT_SELF_VIEW'],
  LAB_TECH: ['LAB_RESULT_WRITE'],
  PHARMACIST: ['DRUG_DISPENSE'],
  AMBULANCE_DRIVER: ['TRIP_NAVIGATE'],
  SUPER_ADMIN: [
    'PATIENT_REGISTER', 
    'ANC_VITALS_WRITE', 
    'ANC_VALIDATE', 
    'PRESCRIPTION_WRITE', 
    'REFERRAL_CREATE', 
    'BED_MANAGE', 
    'BLOOD_REQUISITION', 
    'LAB_RESULT_WRITE', 
    'DRUG_DISPENSE', 
    'TRIP_NAVIGATE', 
    'DISTRICT_ANALYTICS', 
    'PATIENT_SELF_VIEW', 
    'STAFF_MANAGE'
  ]
};

/**
 * Dynamically filters sidebar menu items based on user's granted permissions
 */
export const getFilteredMenuItems = (userRole?: string): MenuItem[] => {
  if (!userRole) return [];
  const userPermissions = ROLE_PERMISSIONS_MAP[userRole] || [];

  return MASTER_MENU_ITEMS.filter((item) => {
    if (item.requiredPermissions.length === 0) return true;
    return item.requiredPermissions.some((perm) => userPermissions.includes(perm));
  });
};
