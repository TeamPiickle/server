import { NextFunction, Request, Response } from 'express';

const guestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    if (!req.session.uid) {
      req.session.uid = req.sessionID;
      req.session.save();
    }
    req.guestId = req.session.uid;
  }
  next();
};

export default guestHandler;
