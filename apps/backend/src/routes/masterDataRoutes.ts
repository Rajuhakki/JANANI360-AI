import { Router } from 'express';
import {
  getDistricts,
  getTaluks,
  getHoblis,
  getVillages,
  getFacilities,
  getSubCenters,
  getCatchments
} from '../controllers/masterDataController';

const router = Router();

// Master Data Location Hierarchy Routes
router.get('/districts', getDistricts);
router.get('/taluks', getTaluks);
router.get('/hoblis', getHoblis);
router.get('/villages', getVillages);
router.get('/facilities', getFacilities);
router.get('/sub-centers', getSubCenters);
router.get('/catchments', getCatchments);

export default router;
