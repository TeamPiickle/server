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
const getCategory = async (req: Request, res: Response) => {
  try {
    const data = await CategoryService.getCategory();
    if (!data)
      res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));

    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_CATEGORY_SUCCESS, data));
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
  getCategory
};
