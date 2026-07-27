import { Router } from 'express';
import {
  getFormOptions,
  listMothers,
  registerMother,
  recordHomeVisit
} from '../controllers/ashaController';
import { authenticateJWT, requirePermissions } from '../middleware/rbac';

const router = Router();

// Protect all routes with JWT Authentication
router.use(authenticateJWT);

// ASHA Worker Data Entry Routes
router.get('/form-options', getFormOptions);
router.get('/mothers', listMothers);
router.post('/mothers', requirePermissions('PATIENT_REGISTER'), registerMother);
router.post('/home-visits', requirePermissions('PATIENT_REGISTER'), recordHomeVisit);

export default router;
