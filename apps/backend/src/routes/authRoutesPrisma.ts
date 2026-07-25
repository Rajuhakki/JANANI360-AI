import { Router } from 'express';
import {
  login,
  logout,
  logoutAll,
  refreshToken,
  changePassword,
  getMe
} from '../controllers/authControllerPrisma';
import { authenticateJWT } from '../middleware/rbac';

const router = Router();

// Public Auth Routes
router.post('/login', login);
router.post('/refresh', refreshToken);

// Authenticated User Routes (Requires Valid Access Token)
router.get('/me', authenticateJWT, getMe);
router.post('/logout', authenticateJWT, logout);
router.post('/logout-all', authenticateJWT, logoutAll);
router.post('/change-password', authenticateJWT, changePassword);

export default router;
