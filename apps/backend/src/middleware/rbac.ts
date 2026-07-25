import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PermissionKey, ROLE_PERMISSIONS } from '../types/permissions';

export interface AuthenticatedUserPayload {
  userId: string;
  role: string;
  email?: string;
  phone: string;
  name: string;
  districtId?: string;
  talukId?: string;
  facilityId?: string;
  subCenterId?: string;
  catchmentId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUserPayload;
}

/**
 * Middleware: Verifies Bearer JWT Access Token
 */
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access token missing or invalid format'
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const accessSecret = process.env.JWT_ACCESS_SECRET || 'janani360_super_secret_access_key_2026';

  try {
    const decoded = jwt.verify(token, accessSecret) as AuthenticatedUserPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'TOKEN_EXPIRED',
        message: 'JWT session expired. Please refresh session.'
      });
      return;
    }
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Invalid access token'
    });
  }
};

/**
 * Middleware: Enforces Granular Permission Matrix (RBAC)
 */
export const requirePermissions = (...requiredPermissions: PermissionKey[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'User unauthenticated' });
      return;
    }

    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `Role ${userRole} lacks required permissions: [${requiredPermissions.join(', ')}]`,
        userRole,
        requiredPermissions
      });
      return;
    }

    next();
  };
};

/**
 * Middleware: Enforces Geographic Jurisdiction Isolation
 */
export const enforceJurisdiction = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
    return;
  }

  const { role, districtId, facilityId, subCenterId, catchmentId } = req.user;

  // Append jurisdiction filters directly to request query or locals
  req.body._jurisdiction = {
    role,
    districtId,
    facilityId,
    subCenterId,
    catchmentId
  };

  next();
};
