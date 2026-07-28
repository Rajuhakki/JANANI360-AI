import { Router } from 'express';
import {
  recordPncVisit,
  recordVaccineAdministration,
  recordChildGrowth,
  getChildProfileHub,
  listAllChildren
} from '../controllers/childController';
import { authenticateJWT, requirePermissions } from '../middleware/rbac';

const router = Router();

router.use(authenticateJWT);

router.post('/pnc-visits', requirePermissions('ANC_VITALS_WRITE'), recordPncVisit);
router.post('/vaccines', requirePermissions('ANC_VITALS_WRITE'), recordVaccineAdministration);
router.post('/growth', requirePermissions('ANC_VITALS_WRITE'), recordChildGrowth);
router.get('/', listAllChildren);
router.get('/list', listAllChildren);
router.get('/:id', getChildProfileHub);

export default router;
