import { Router } from 'express';
import { 
  createPatient, 
  getAllPatients, 
  getPatientDetails, 
  getPatientMe,
  recordVisit 
} from '../controllers/patientController';
import { authenticateJWT, requireRoles } from '../middleware/auth';
import { auditLogger } from '../middleware/audit';
import { validateRequest } from '../middleware/validate';
import { createPatientSchema, recordVisitSchema } from '../validators/patientValidator';
import { UserRole } from '../types';

const router = Router();

// Authenticated Patient Self Profile Lookup
router.get('/me', authenticateJWT, getPatientMe);

// Public / Authenticated Patient Lookups
router.get('/', authenticateJWT, getAllPatients);
router.get('/:id', authenticateJWT, getPatientDetails);

// Maternal Registration (ASHA Workers, Doctors, Admins)
router.post(
  '/',
  authenticateJWT,
  requireRoles(UserRole.SUPER_ADMIN, UserRole.DISTRICT_OFFICER, UserRole.DOCTOR, UserRole.ASHA_WORKER),
  validateRequest(createPatientSchema),
  auditLogger('REGISTER_PATIENT', 'PATIENTS'),
  createPatient
);

// ANC Visit Recording & AI Risk Stratification Trigger
router.post(
  '/visits',
  authenticateJWT,
  requireRoles(UserRole.SUPER_ADMIN, UserRole.DISTRICT_OFFICER, UserRole.DOCTOR, UserRole.ASHA_WORKER),
  validateRequest(recordVisitSchema),
  auditLogger('RECORD_ANC_VISIT', 'VISITS'),
  recordVisit
);

export default router;
