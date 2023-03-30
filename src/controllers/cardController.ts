import { NextFunction, Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { CardService } from '../services';
import { Types } from 'mongoose';
import { findBestCards } from '../services/cardService';

const BEST_PIICKLE_SIZE = 30;
/**
 *  @route /cards/best
 *  @desc 베스트 피클 30개를 가져옵니다.
 *  @access Public
 */
const getBestCardList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: Types.ObjectId | undefined = req.user?.id;
    const cards = await CardService.findBestCards(BEST_PIICKLE_SIZE, userId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.READ_BEST_CARDS_SUCCESS, cards)
      );
  } catch (err) {
    next(err);
  }
};

export { getBestCardList };
