import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

export const authorize = (...allowedTiers: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (allowedTiers.length > 0 && !allowedTiers.includes(req.user.membershipTier)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for your membership tier.'
      });
    }

    next();
  };
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
      return;
    }

    // Use the role field from the user model
    const userRole = req.user.role || 'user';
    
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${allowedRoles.join(' or ')}, Your role: ${userRole}`
      });
      return;
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token is provided
export const optionalAuthenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      // No token provided, continue without user
      req.user = undefined;
      next();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      // Invalid token, continue without user
      req.user = undefined;
      next();
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    // Token verification failed, continue without user
    req.user = undefined;
    next();
  }
};
