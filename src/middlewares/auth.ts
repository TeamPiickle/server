import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import message from '../modules/responseMessage';
import {
  JwtNotDecodedException,
  NullJwtException
} from '../intefaces/exception';
import { JwtPayloadInfo } from '../intefaces/JwtPayloadInfo';

interface JwtError extends Error {
  name: string;
}

const extractJwt = (req: Request) => req.header('x-auth-token')?.split(' ')[1];

const decodeJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = extractJwt(req);
  if (!token) {
    throw new NullJwtException(message.NULL_VALUE_TOKEN);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayloadInfo;
    req.user = decoded.user;
    next();
  } catch (error) {
    if ((error as JwtError).name == 'TokenExpiredError') {
      throw new JwtNotDecodedException(message.EXPIRED_TOKEN);
    }
    throw error;
  }
};

export default decodeJwt;
