import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import Request, { IllegalArgumentException } from '../intefaces/common';
import CreateUserCommand from '../intefaces/createUserCommand';
import { PostBaseResponseDto } from '../intefaces/PostBaseResponseDto';
import { UserLoginDto } from '../intefaces/user/UserLoginDto';
import getToken from '../modules/jwtHandler';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService } from '../services';
import { UserProfileResponseDto } from '../intefaces/user/UserProfileResponseDto';
import { UserUpdateNicknameDto } from '../intefaces/user/UserUpdateNicknameDto';

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
const loginUser = async (
  req: Request<UserLoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new IllegalArgumentException('필요한 값이 없습니다.');
    }
    const userLoginDto: UserLoginDto = req.body;
    const result: PostBaseResponseDto = await UserService.loginUser(
      userLoginDto
    );
    const accessToken = getToken(result._id);
    const data = {
      _id: result._id,
      accessToken
    };
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.USER_LOGIN_SUCCESS, data));
  } catch (err) {
    next(err);
  }
};

/**
 *  @route get /users
 *  @desc 유저 프로필 조회
 *  @access
 */
const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id;
  try {
    const data: UserProfileResponseDto = await UserService.findUserById(userId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.USER_PROFILE_VIEW_SUCCESS, data)
      );
  } catch (err) {
    next(err);
  }
};

/**
 *  @route patch /users/nickname
 *  @desc 유저 닉네임 변경
 *  @access
 */
const updateUserNickname = async (
  req: Request<UserUpdateNicknameDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new IllegalArgumentException('필요한 값이 없습니다.');
    }
    const userId = req.user.id;
    const { nickname } = req.body;
    await UserService.updateNickname(userId, nickname);
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.USER_NICKNAME_UPDATE_SUCCESS));
  } catch (err) {
    next(err);
  }
};

/**
 *  @route patch /profile-image
 *  @desc 유저 프로필 이미지 수정
 *  @access
 */
const updateUserProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new IllegalArgumentException('필요한 값이 없습니다.');
    }
    const image: Express.MulterS3.File = req.file;
    const { location } = image;
    const data = await UserService.updateUserProfileImage(
      req.user.id,
      location
    );
    return res
      .status(statusCode.OK)
      .send(
        util.success(
          statusCode.OK,
          message.USER_PROFILEIMAGE_UPDATE_SUCCESS,
          data
        )
      );
  } catch (err) {
    next(err);
  }
};

export default {
  postUser,
  loginUser,
  getUserProfile,
  updateUserNickname,
  updateUserProfileImage
};
