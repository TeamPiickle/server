import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import Request, { IllegalArgumentException } from '../intefaces/common';
import CategoryResponseDto from '../intefaces/CategoryResponseDto';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { CategoryService } from '../services';

/**
 *  @route Get /category
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

export default {
  getCategory
};
