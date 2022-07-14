import { NextFunction, Request, Response } from 'express';
import {
  IllegalArgumentException,
  BadCredentialException,
  InternalAuthenticationServiceException,
  NullDataException,
  PiickleException,
  DuplicateException
} from '../intefaces/exception';
import statusCode from '../modules/statusCode';
import util from '../modules/util';

const errHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof PiickleException) {
    if (err instanceof IllegalArgumentException) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, err.message));
    }
    if (err instanceof NullDataException) {
      return res
        .status(statusCode.NO_CONTENT)
        .send(util.fail(statusCode.NO_CONTENT, err.message));
    }
    if (err instanceof BadCredentialException) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, err.message));
    }
    if (err instanceof InternalAuthenticationServiceException) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, err.message));
    }
    if (err instanceof DuplicateException) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, err.message));
    }
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, err.message));
  }
  return res
    .status(statusCode.INTERNAL_SERVER_ERROR)
    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, (err as Error).message));
};

export default errHandler;
