import { NextFunction, Response } from 'express';
import Request, {
  IllegalArgumentException,
  BadCredentialException,
  InternalAuthenticationServiceException,
  NullDataException,
  PiickleException,
  DuplicateException
} from '../intefaces/common';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
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
    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
};
