import {NextFunction, Request, Response} from 'express';

const uidSetter = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.uid) {
        req.session.uid = req.sessionID;
        await req.session.save();
    }
    next();
};

export default uidSetter;