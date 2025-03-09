import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { User } from '../database';
import { UnauthorizedError } from '../lib/error';
export interface DecodedToken {
  id: number;
  email: string;
  roleId: number;
  fullname: string;
}

declare global {
  namespace Express {
    interface Request {
      tokenUser?: DecodedToken;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      config.jwtSecret || 'your-secret-key'
    ) as DecodedToken;
    
    if(decoded) {
      const user = await User.findByPk(decoded.id);
      if(!user) {
        throw new UnauthorizedError('Invalid token');
      }
    }
    req.tokenUser = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};
