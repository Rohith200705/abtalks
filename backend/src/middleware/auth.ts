import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'abtalks-jwt-secret-2024';

export interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided, authorization denied' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { userId: decoded.userId, email: decoded.email, username: decoded.username };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export function getUserId(req: any): string {
  if (!req.user || !req.user.userId) {
    throw new Error('User not authenticated');
  }
  return req.user.userId;
}
