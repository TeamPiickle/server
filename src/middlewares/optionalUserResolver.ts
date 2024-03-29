import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';
import { JwtPayloadInfo } from '../intefaces/JwtPayloadInfo';

interface JwtError extends Error {
  name: string;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token')?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayloadInfo;
    req.user = decoded.user;
    next();
  } catch (error) {
    if ((error as Error).message == 'jwt malformed') {
      next();
      return;
    }
    if ((error as JwtError).name == 'TokenExpiredError') {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, message.EXPIRED_TOKEN));
    }
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};
