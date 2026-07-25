import { Router } from 'express';
import {
  getDistrictKpis,
  getGisHeatmap,
  getHospitalResourceGrid
} from '../controllers/analyticsController';
import { authenticateJWT, requirePermissions } from '../middleware/rbac';

const router = Router();

router.use(authenticateJWT);

router.get('/district-kpis/:districtId', requirePermissions('DISTRICT_ANALYTICS'), getDistrictKpis);
router.get('/gis-heatmap', getGisHeatmap);
router.get('/hospital-resources', getHospitalResourceGrid);

export default router;
