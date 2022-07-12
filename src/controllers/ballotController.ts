import { NextFunction, Response } from 'express';
import Request from '../intefaces/common';
import CreateBallotResultDto from '../intefaces/CreateBallotResultDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { BallotService } from '../services';

/**
 *  @route POST /ballots
 *  @desc 투표하기 api
 *  @access Public
 */
const postBallotResult = async (
  req: Request<CreateBallotResultDto>,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const command: CreateBallotResultDto = req.body;
    command.userId = req.user.id;
    await BallotService.createBallotResult(command);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.BALLOT_RESULT_CREATED));
  } catch (err) {
    next(err);
  }
};

export default {
  postBallotResult
};
