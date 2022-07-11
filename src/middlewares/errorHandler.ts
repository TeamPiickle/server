import { NextFunction, Response } from 'express';
import Request, {
  IllegalArgumentException,
  PiickleException
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
        .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    if (err instanceof NullDataException) {
      return res
        .status(statusCode.NO_CONTENT)
        .send(util.fail(statusCode.NO_CONTENT, err.message));
    }
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, err.message));
  }
  return res
    .status(statusCode.INTERNAL_SERVER_ERROR)
    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, err.message));
};
