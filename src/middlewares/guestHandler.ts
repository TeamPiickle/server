import { NextFunction, Request, Response } from 'express';

const guestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    req.guestId = req.session.id;
  }
  next();
};

export default guestHandler;
