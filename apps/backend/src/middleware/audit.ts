import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { AuditLog } from '../models/AuditLog';

export const auditLogger = (action: string, resource: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function (body: any): Response {
      const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
      
      AuditLog.create({
        userId: req.user?.userId,
        userRole: req.user?.role,
        action,
        resource,
        ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
        status: isSuccess ? 'SUCCESS' : 'FAILURE',
        details: { statusCode: res.statusCode }
      }).catch(err => console.error('Failed to log audit entry:', err));

      return originalSend.call(this, body);
    };

    next();
  };
};
