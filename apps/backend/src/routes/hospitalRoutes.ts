import { Router } from 'express';
import { 
  getAllHospitals, 
  getHospitalById, 
  createHospital, 
  updateCapacity, 
  getNearbyHospitals 
} from '../controllers/hospitalController';
import { authenticateJWT, requireRoles } from '../middleware/auth';
import { auditLogger } from '../middleware/audit';
import { validateRequest } from '../middleware/validate';
import { createHospitalSchema, updateCapacitySchema } from '../validators/hospitalValidator';
import { UserRole } from '../types';

const router = Router();

// Public / Authenticated Read Operations
router.get('/', authenticateJWT, getAllHospitals);
router.get('/nearby', authenticateJWT, getNearbyHospitals);
router.get('/:id', authenticateJWT, getHospitalById);

// Admin & DHO Hospital Onboarding
router.post(
  '/',
  authenticateJWT,
  requireRoles(UserRole.SUPER_ADMIN, UserRole.DISTRICT_OFFICER),
  validateRequest(createHospitalSchema),
  auditLogger('CREATE_HOSPITAL', 'HOSPITALS'),
  createHospital
);

// Doctor & Admin Live Capacity Update
router.put(
  '/:id/capacity',
  authenticateJWT,
  requireRoles(UserRole.SUPER_ADMIN, UserRole.DISTRICT_OFFICER, UserRole.DOCTOR),
  validateRequest(updateCapacitySchema),
  auditLogger('UPDATE_HOSPITAL_CAPACITY', 'HOSPITALS'),
  updateCapacity
);

export default router;
