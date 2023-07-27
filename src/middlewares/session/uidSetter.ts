import { NextFunction, Request, Response } from 'express';

const uidSetter = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.uid) {
    req.session.uid = req.sessionID;
    req.session.save();
  }
  next();
};

export default uidSetter;
