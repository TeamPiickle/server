import { NextFunction, Request, Response } from 'express';
import { NullDataException } from '../intefaces/exception';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { CategoryService } from '../services';
import { getCardsWithIsBookmark } from '../services/CategoryService';

/**
 *  @route Get /categories
 *  @desc Get Category
 *  @access Public
 */
const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const data = await CategoryService.getCategory();
    if (!data) {
      throw new NullDataException('데이터가 없습니다.');
    }
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_CATEGORY_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

/**
 *  @route GET /categories/:categoryId
 *  @desc Get Category Card
 *  @access Public
 */
const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { categoryId } = req.params;
  const userId = req.user?.id;
  try {
    const data = await getCardsWithIsBookmark(categoryId, userId);

    if (!data) {
      throw new NullDataException('데이터가 없습니다.');
    }
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_CARD_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /categories/cards?search=
 * @desc Get filter cards
 * @access public
 */
const getCardsBySearch = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { search } = req.query;
  const userId = req.user?.id;
  try {
    const data = await CategoryService.getFilteredCards(
      search as string[],
      userId
    );
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.SEARCH_CARDS_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

export { getCategory, getCards, getCardsBySearch };
