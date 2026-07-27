import { Router } from 'express';
import {
  getFormOptions,
  listMothers,
  registerMother,
  recordHomeVisit,
  scanAntenatalCard,
  getMotherProfileByQr
} from '../controllers/ashaController';
import { authenticateJWT, requirePermissions } from '../middleware/rbac';

const router = Router();

// Public QR Code Lookup (Unauthenticated for emergency scan access)
router.get('/qr/:id', getMotherProfileByQr);

// Protect remaining routes with JWT Authentication
router.use(authenticateJWT);

// ASHA Worker Data Entry Routes
router.get('/form-options', getFormOptions);
router.get('/mothers', listMothers);
router.post('/mothers', requirePermissions('PATIENT_REGISTER'), registerMother);
router.post('/home-visits', requirePermissions('PATIENT_REGISTER'), recordHomeVisit);
router.post('/ocr-scan', scanAntenatalCard);

export default router;
