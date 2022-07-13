import { NextFunction, Response } from 'express';
import Request from '../intefaces/common';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { CardService } from '../services';

/**
 *  @route /cards/best-5
 *  @desc 이번 달의 베스트 피클을 가져옵니다.
 *  @access Public
 */
const getBest5 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await CardService.findBestCards();
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

export default { getBest5 };
