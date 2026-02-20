import { Request, Response, NextFunction } from 'express';

export function logMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`Request log: ${req.method} ${req.url}`);
  next();
}