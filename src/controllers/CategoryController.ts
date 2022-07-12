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
 * @route GET /category?search=&option
 * @desc Get Search Cards
 * @access public
 */
const getCardsBySearch = async (req: Request, res: Response) => {
  const { search, option } = req.query;

  const isOptionType = (option: string): option is MovieOptionType => {
    return ['title', 'director', 'title_director'].indexOf(option) !== -1;
  };

  if (!isOptionType(option as string)) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  try {
    const data = await MovieService.getMoviesBySearch(
      search as string,
      option as MovieOptionType,
      page
    );

    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.SEARCH_CARD_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export default {
  getCategory,
  getCards,
  getCardsBySearch
};
