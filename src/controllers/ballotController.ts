import { Types } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import CreateBallotResultDto from '../intefaces/CreateBallotResultDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { BallotService } from '../services';
import { TypedRequest } from '../types/TypedRequest';
import { slackMessage } from '../modules/returnToSlack';
import { sendMessagesToSlack } from '../modules/slackAPI';

/**
 *  @route POST /ballots
 *  @desc 투표하기 api
 *  @access Public
 */
const postBallotResult = async (
  req: TypedRequest<CreateBallotResultDto>,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const command: CreateBallotResultDto = req.body;
    command.userId = req.user.id as Types.ObjectId;
    await BallotService.createBallotResult(command);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.BALLOT_RESULT_CREATED));
  } catch (err) {
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    next(err);
  }
};

/**
 *  @route Get /ballots/:ballotTopicId
 *  @desc 투표현황 조회 api
 *  @access Public
 */
const getBallotStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const userId = <Types.ObjectId | undefined>req.user?.id;
    const ballotId = new Types.ObjectId(req.params.ballotTopicId);
    const getStatus = async (
      userId: Types.ObjectId | undefined,
      ballotId: Types.ObjectId
    ) => {
      return BallotService.getBallotStatusAndUserSelect(userId, ballotId);
    };
    const data = await getStatus(userId, ballotId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.BALLOT_STATUS_VIEW_SUCCESS, data)
      );
  } catch (err) {
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    next(err);
  }
};

/**
 *  @route GET /ballots
 *  @desc 메인 투표 주제 리스트 조회
 *  @access Public
 */
const getMainBallotList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?.id;
    const ballotList = await BallotService.getMainBallotList(userId);
    res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.READ_MAIN_BALLOTS_SUCCESS,
          ballotList
        )
      );
  } catch (err) {
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    next(err);
  }
};

export { postBallotResult, getBallotStatus, getMainBallotList };
