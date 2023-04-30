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
    command.userId = req.user?.id;
    command.guestId = req.guestId;
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
    const userId = req.user?.id;
    const guestId = req.guestId;
    const ballotId = new Types.ObjectId(req.params.ballotTopicId);
    const data = await BallotService.getBallotStatusAndUserSelect(
      ballotId,
      userId,
      guestId
    );
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.BALLOT_STATUS_VIEW_SUCCESS, data)
      );
  } catch (err) {
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
    const userId = req.user?.id;
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
    next(err);
  }
};

export { postBallotResult, getBallotStatus, getMainBallotList };
