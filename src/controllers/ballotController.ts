import { Types } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import CreateBallotResultDto from '../intefaces/CreateBallotResultDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { BallotService } from '../services';
import { TypedRequest } from '../types/TypedRequest';

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
    const userId = req.user.id as Types.ObjectId;
    const ballotId = new Types.ObjectId(req.params.ballotTopicId);
    const getStatus = async (
      userId: Types.ObjectId,
      ballotId: Types.ObjectId
    ) => {
      if (!userId) {
        return await BallotService.getBallotStatus(ballotId);
      }
      return await BallotService.getBallotStatusAndUserSelect(userId, ballotId);
    };
    const data = await getStatus(userId, ballotId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.BALLOT_STATUS_VIEW_SUCCESS, data)
      );
  } catch (err) {
    next(err);
  }
};
export { postBallotResult, getBallotStatus };
