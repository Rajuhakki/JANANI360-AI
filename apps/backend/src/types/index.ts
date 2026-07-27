export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DISTRICT_OFFICER = 'DISTRICT_OFFICER',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  ANM = 'ANM',
  ASHA_WORKER = 'ASHA_WORKER',
  PATIENT = 'PATIENT',
  FAMILY = 'FAMILY',
  AMBULANCE_DRIVER = 'AMBULANCE_DRIVER',
  LAB_TECH = 'LAB_TECH',
  PHARMACIST = 'PHARMACIST'
}

export interface IUserTokenPayload {
  userId: string;
  role: UserRole;
  email: string;
  name: string;
  hospitalId?: string;
  district?: string;
}

export interface IAuditLogPayload {
  userId?: string;
  userRole?: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE';
  details?: Record<string, any>;
}
