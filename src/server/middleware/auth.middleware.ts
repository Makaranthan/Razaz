import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('Not authorized to access this route') as AppError;
      error.statusCode = 401;
      return next(error);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };

    // Check if user still exists
    const user = await db.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      const error = new Error('The user belonging to this token no longer exists.') as AppError;
      error.statusCode = 401;
      return next(error);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    const err = new Error('Not authorized to access this route') as AppError;
    err.statusCode = 401;
    next(err);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(`User role ${req.user.role} is not authorized to access this route`) as AppError;
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
