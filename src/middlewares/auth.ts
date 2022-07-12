import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import statusCode from '../modules/statusCode';
import message from '../modules/responseMessage';
import util from '../modules/util';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token')?.split(' ').reverse()[0];

  if (!token) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(util.fail(statusCode.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = (decoded as any).user;
    next();
  } catch (error: any) {
    console.log(error);
    if (error.name == 'TokenExpiredError') {
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
