import { NextFunction, Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { CardService } from '../services';

/**
 *  @route /cards/best
 *  @desc 이번 달의 베스트 피클 30개를 가져옵니다.
 *  @access Public
 */
const getBestCardList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await CardService.findBestCards(30);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.READ_BEST_CARDS_SUCCESS, cards)
      );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export { getBestCardList };
