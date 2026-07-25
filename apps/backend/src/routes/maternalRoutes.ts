import { Router } from 'express';
import {
  registerMother,
  recordAncVisit,
  getMotherProfile,
  searchMothers,
  getWorkQueue,
  overrideAiRecommendation
} from '../controllers/maternalController';
import { authenticateJWT, requirePermissions, enforceJurisdiction } from '../middleware/rbac';

const router = Router();

// Protect all routes with JWT Authentication
router.use(authenticateJWT);
router.use(enforceJurisdiction);

// Mother Case Management & CDSS Routes
router.post('/mothers', requirePermissions('PATIENT_REGISTER'), registerMother);
router.post('/anc-visits', requirePermissions('ANC_VITALS_WRITE'), recordAncVisit);
router.post('/ai-override', requirePermissions('ANC_VALIDATE', 'PRESCRIPTION_WRITE'), overrideAiRecommendation);
router.get('/mothers/:id', getMotherProfile);
router.get('/search', searchMothers);
router.get('/work-queue', getWorkQueue);

export default router;
