import { NextFunction, Response } from 'express';
import Request, { PiickleError } from '../intefaces/common';
import statusCode from '../modules/statusCode';
import util from '../modules/util';

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  console.log(err);
  if (err instanceof PiickleError) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, err.message));
  }
  return res
    .status(statusCode.INTERNAL_SERVER_ERROR)
    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
};
