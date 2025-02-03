// utils/auth.ts

import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { isTokenBlacklisted } from './tokenBlacklist';

export interface NextApiRequestWithUser extends NextApiRequest {
  user: JwtPayload | undefined
}

export const authenticateJWT = async (req: NextApiRequestWithUser, res: NextApiResponse, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  // Check if the token is blacklisted
  if (await isTokenBlacklisted(token)) {
    return res.status(401).json({ message: 'Token is invalidated' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token is not valid' });
      }
      if (typeof user !== 'string') {
        req.user = user;
      } else {
        return res.status(403).json({ message: 'Token is not valid' });
      }
      next();
    });
  } catch (error) {
    return res.status(403).json({ message: 'Token verification failed' });
  }
};