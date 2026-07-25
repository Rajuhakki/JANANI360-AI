import { Router } from 'express';
import {
  admitLaborCase,
  addPartographObservation,
  recordDelivery,
  getLaborRoomDashboard
} from '../controllers/laborController';
import { authenticateJWT, requirePermissions } from '../middleware/rbac';

const router = Router();

router.use(authenticateJWT);

router.post('/admit', requirePermissions('PATIENT_REGISTER', 'BED_MANAGE'), admitLaborCase);
router.post('/partograph', requirePermissions('ANC_VITALS_WRITE'), addPartographObservation);
router.post('/deliveries', requirePermissions('PRESCRIPTION_WRITE', 'BED_MANAGE'), recordDelivery);
router.get('/dashboard/:facilityId', getLaborRoomDashboard);

export default router;
