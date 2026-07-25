import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// Lê o JWT do header Authorization: Bearer <token> e injeta req.userId.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente.' });
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as unknown as {
      sub: number;
    };
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}
