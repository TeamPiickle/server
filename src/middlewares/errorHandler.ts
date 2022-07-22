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
import { slackMessage } from '../modules/returnToSlack';
import { sendMessagesToSlack } from '../modules/slackAPI';

const errHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof PiickleException) {
    if (err instanceof IllegalArgumentException) {
      const errorMessage: string = slackMessage(
        req.method.toUpperCase(),
        req.originalUrl,
        err,
        req.user?.id
      );
      sendMessagesToSlack(errorMessage);
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, err.message));
    }
    if (err instanceof NullDataException) {
      const errorMessage: string = slackMessage(
        req.method.toUpperCase(),
        req.originalUrl,
        err,
        req.user?.id
      );
      sendMessagesToSlack(errorMessage);
      return res
        .status(statusCode.NO_CONTENT)
        .send(util.fail(statusCode.NO_CONTENT, err.message));
    }
    if (err instanceof BadCredentialException) {
      const errorMessage: string = slackMessage(
        req.method.toUpperCase(),
        req.originalUrl,
        err,
        req.user?.id
      );
      sendMessagesToSlack(errorMessage);
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, err.message));
    }
    if (err instanceof InternalAuthenticationServiceException) {
      const errorMessage: string = slackMessage(
        req.method.toUpperCase(),
        req.originalUrl,
        err,
        req.user?.id
      );
      sendMessagesToSlack(errorMessage);
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, err.message));
    }
    if (err instanceof DuplicateException) {
      const errorMessage: string = slackMessage(
        req.method.toUpperCase(),
        req.originalUrl,
        err,
        req.user?.id
      );
      sendMessagesToSlack(errorMessage);
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, err.message));
    }
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, err.message));
  }
  const errorMessage: string = slackMessage(
    req.method.toUpperCase(),
    req.originalUrl,
    err,
    req.user?.id
  );
  sendMessagesToSlack(errorMessage);
  return res
    .status(statusCode.INTERNAL_SERVER_ERROR)
    .send(util.fail(statusCode.INTERNAL_SERVER_ERROR, (err as Error).message));
};

export default errHandler;
