import { NextFunction, Response } from 'express';
import Request from '../intefaces/common';
import CreateUserCommand from '../intefaces/createUserCommand';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService } from '../services';

/**
 *  @route /users
 *  @desc 회원가입 api
 *  @access Public
 */
const postUser = async (
  req: Request<CreateUserCommand>,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const createUserCommand: CreateUserCommand = req.body;
    await UserService.createUser(createUserCommand);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.USER_CREATED));
  } catch (err) {
    next(err);
  }
};

export default { postUser };
