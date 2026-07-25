import { Router } from 'express';
import {
  initiateReferral,
  acceptReferral,
  updateAmbulanceTelemetry,
  casualtyHandover,
  getCasualtyRadar,
  getFamilyPortal
} from '../controllers/referralController';
import { authenticateJWT, requirePermissions } from '../middleware/rbac';

const router = Router();

// Public Family Portal Route (No Auth required for family 1-click tracking)
router.get('/family-portal/:code', getFamilyPortal);

// Authenticated Referral Control Room Routes
router.use(authenticateJWT);

router.post('/initiate', requirePermissions('REFERRAL_CREATE'), initiateReferral);
router.post('/accept', requirePermissions('BED_MANAGE', 'STAFF_MANAGE'), acceptReferral);
router.post('/telemetry', updateAmbulanceTelemetry);
router.post('/casualty-handover', requirePermissions('BED_MANAGE'), casualtyHandover);
router.get('/casualty-radar/:facilityId', getCasualtyRadar);

export default router;
