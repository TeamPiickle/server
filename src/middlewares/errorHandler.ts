import { NextFunction, Request, Response } from 'express';
import { PiickleException } from '../intefaces/exception';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { generateBlock } from '../modules/returnToSlack';
import { IncomingWebhook } from '@slack/webhook';
import config from '../config';

const webhook = new IncomingWebhook(config.slackWebHookUrl);
const errHandler = (
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

  webhook
    .send(generateBlock(req, err))
    .then(() => {})
    .catch(error => {
      console.error(error);
    })
    .finally(() => {
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(statusCode.INTERNAL_SERVER_ERROR, (err as Error).message)
        );
    });
};

export default errHandler;
