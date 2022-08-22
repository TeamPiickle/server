import { NextFunction, Request, Response } from 'express';
import { PiickleException } from '../intefaces/exception';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { slackMessage } from '../modules/returnToSlack';
import { sendMessagesToSlack } from '../modules/slackApi';

const errHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage: string = slackMessage(
    req.method.toUpperCase(),
    req.originalUrl,
    err,
    req.user?.id as string
  );

  await sendMessagesToSlack(errorMessage);

  if (err instanceof PiickleException) {
    return res
      .status(err.statusCode)
      .send(util.fail(err.statusCode, err.message));
  }
  return res
    .status(statusCode.INTERNAL_SERVER_ERROR)
    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, (err as Error).message));
};

export default errHandler;
