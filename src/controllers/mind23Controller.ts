import { NextFunction, Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { Mind23Service } from '../services';
import { Types } from 'mongoose';
import { QuestionResponseDto } from '../intefaces/mind23/QuestionResponseDto';

/**
 *  @route /mind23/api/questions
 *  @desc mind23 용 질문을 조회합니다.
 *  @access Public
 */
const getQuestionList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: QuestionResponseDto = await Mind23Service.findQuestionList();
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.READ_MIND23_QUESTIONS_SUCCESS, data)
      );
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /mind23/api/comments
 *  @desc mind23 용 댓글을 조회합니다.
 *  @access Public
 */
const getCommentList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionId = new Types.ObjectId(req.params.questionId);
    const comments = await Mind23Service.findCommentsList(questionId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.READ_MIND23_COMMENTS_SUCCESS,
          comments
        )
      );
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /mind23/api/comments?questionId=
 *  @desc mind23 용 댓글을 등록합니다.
 *  @access Public
 */
const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: Types.ObjectId | undefined = req.user?.id;
    const questionId: Types.ObjectId | undefined = new Types.ObjectId(
      req.params.questionId
    );
    const comment: string = req.body.content;
    await Mind23Service.createComment(userId, questionId, comment);
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, '마인드 23 댓글 등록 성공'));
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /mind23/api/prize-entry
 *  @desc mind23 용 경품 응모를 등록합니다.
 *  @access Public
 */
const createPrizeEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: Types.ObjectId | undefined = req.user?.id;
    await Mind23Service.createPrizeEntry(userId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.CREATE_MIND23_PRIZE_ENTRY_SUCCESS)
      );
  } catch (err) {
    next(err);
  }
};

export { getQuestionList, getCommentList, createComment, createPrizeEntry };
