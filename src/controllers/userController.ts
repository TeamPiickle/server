import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import Request, { IllegalArgumentException } from '../intefaces/common';
import CreateUserCommand from '../intefaces/createUserCommand';
import { PostBaseResponseDto } from '../intefaces/PostBaseResponseDto';
import { UserLoginDto } from '../intefaces/UserLoginDto';
import User from '../models/user';
import getToken from '../modules/jwtHandler';
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
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new IllegalArgumentException('필요한 값이 없습니다.');
    }
    const createUserCommand: CreateUserCommand = req.body;
    await UserService.createUser(createUserCommand);
    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.USER_CREATED));
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /users/login
 *  @desc 로그인 api
 *  @access Public
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);

  if (!error.isEmpty) {
    throw new IllegalArgumentException('필요한 값이 없습니다.');
  }

  const userLoginDto: UserLoginDto = req.body;
  try {
    const result: PostBaseResponseDto = await UserService.loginUser(
      userLoginDto
    );
    const accessToken = getToken((result as PostBaseResponseDto)._id);
    const data = {
      _id: (result as PostBaseResponseDto)._id,
      accessToken
    };
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.USER_LOGIN_SUCCESS, data));
  } catch (err) {
    next(err);
  }
};
export default { postUser, loginUser };
