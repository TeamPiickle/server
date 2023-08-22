import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const cookieCors = cors({
  origin: 'https://client-wheat-three.vercel.app',
  credentials: true
});

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.match(/^\/ballots/)) {
    return cookieCors(req, res, next);
  }
  return cors()(req, res, next);
};

export default corsMiddleware;
