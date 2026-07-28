import { Router } from 'express';
import { searchMotherForCheckup, recordAncCheckup } from '../controllers/doctorController';
import { authenticateJWT } from '../middleware/rbac';

const router = Router();

// Protect doctor routes with JWT
router.use(authenticateJWT);

// Doctor Search & ANC Examination Routes
router.get('/mother/:id', searchMotherForCheckup);
router.post('/anc-checkup', recordAncCheckup);

export default router;
