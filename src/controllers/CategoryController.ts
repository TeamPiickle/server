import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import Request, { NullDataException } from '../intefaces/common';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { CategoryService } from '../services';

/**
 *  @route Get /categories
 *  @desc Get Category
 *  @access Public
 */
const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CategoryService.getCategory();
    if (!data) {
      throw new NullDataException('데이터가 없습니다.');
    }

    res
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
const getCards = async (req: Request, res: Response, next: NextFunction) => {
  const { categoryId } = req.params;

  try {
    const data = await CategoryService.getCards(categoryId);
    if (!data) {
      throw new NullDataException('데이터가 없습니다.');
    }
    res
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
) => {
  const { search } = req.query;

  try {
    const data = await CategoryService.getCardsBySearch(search);
    if (!data) {
      throw new NullDataException('데이터가 없습니다.');
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.SEARCH_CARDS_SUCCESS, data));
  } catch (error) {
    next(error);
  }
};

export default {
  getCategory,
  getCards,
  getCardsBySearch
};
