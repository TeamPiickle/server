import { NextFunction, Request, Response } from 'express';
import { PiickleException } from '../intefaces/exception';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import * as slackMessenger from '../modules/SlackMessenger';

const errHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof PiickleException) {
    return res
      .status(err.statusCode)
      .send(util.fail(err.statusCode, err.message));
  }
  await slackMessenger.send(req, err);
  return res
    .status(statusCode.INTERNAL_SERVER_ERROR)
    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, (err as Error).message));
};

export default errHandler;
