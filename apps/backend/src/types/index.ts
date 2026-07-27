export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DISTRICT_OFFICER = 'DISTRICT_OFFICER',
  DOCTOR = 'DOCTOR',
  ASHA_WORKER = 'ASHA_WORKER',
  PATIENT = 'PATIENT'
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
