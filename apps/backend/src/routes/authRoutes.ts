import { Router } from 'express';
import { register, login, refreshToken, getMe, verifyOtp, logout } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';
import { authenticateJWT } from '../middleware/auth';
import { auditLogger } from '../middleware/audit';
import { registerSchema, loginSchema, otpVerifySchema, refreshTokenSchema } from '../validators/authValidator';

const router = Router();

router.post('/register', validateRequest(registerSchema), auditLogger('USER_REGISTER', 'AUTH'), register);
router.post('/login', validateRequest(loginSchema), auditLogger('USER_LOGIN', 'AUTH'), login);
router.post('/refresh', validateRequest(refreshTokenSchema), refreshToken);
router.post('/verify-otp', validateRequest(otpVerifySchema), verifyOtp);
router.get('/me', authenticateJWT, getMe);
router.post('/logout', authenticateJWT, auditLogger('USER_LOGOUT', 'AUTH'), logout);

export default router;
