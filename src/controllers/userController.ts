import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IllegalArgumentException } from '../intefaces/exception';
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
import { UserBookmarkDto } from '../intefaces/user/UserBookmarkDto';
import { UserBookmarkInfo } from '../intefaces/user/UserBookmarkInfo';
import { Types } from 'mongoose';
import { TypedRequest } from '../types/TypedRequest';
import Bookmark from '../models/bookmark';
import { slackMessage } from '../modules/returnToSlack';
import { sendMessagesToSlack } from '../modules/slackApi';

/**
 *  @route /users
 *  @desc 회원가입 api
 *  @access Public
 */
const postUser = async (
  req: TypedRequest<CreateUserCommand>,
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    next(err);
  }
};

/**
 *  @route /users/login
 *  @desc 로그인 api
 *  @access Public
 */
const loginUser = async (
  req: TypedRequest<UserLoginDto>,
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
  const userId = req.user.id as Types.ObjectId;
  try {
    const data: UserProfileResponseDto = await UserService.findUserById(userId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.USER_PROFILE_VIEW_SUCCESS, data)
      );
  } catch (err) {
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    next(err);
  }
};

/**
 *  @route patch /users/nickname
 *  @desc 유저 닉네임 변경
 *  @access
 */
const updateUserNickname = async (
  req: TypedRequest<UserUpdateNicknameDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new IllegalArgumentException('필요한 값이 없습니다.');
    }
    const userId = req.user.id as Types.ObjectId;
    const { nickname } = req.body;
    await UserService.updateNickname(userId, nickname);
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.USER_NICKNAME_UPDATE_SUCCESS));
  } catch (err) {
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
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
    const image = req.file as Express.MulterS3.File;
    const { location } = image;
    const data = await UserService.updateUserProfileImage(
      req.user.id as Types.ObjectId,
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
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    next(err);
  }
};

/**
 *  @route get /users/bookmarks
 *  @desc 유저 북마크 조회
 *  @access
 */
const getBookmarks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user.id as Types.ObjectId;
  try {
    const data: UserBookmarkDto[] = await UserService.getBookmarks(userId);
    return res
      .status(statusCode.OK)
      .send(
        util.success(statusCode.OK, message.USER_BOOKMARKS_VIEW_SUCCESS, data)
      );
  } catch (err) {
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    next(err);
  }
};

/**
 *  @route PUT /users/bookmarks
 *  @desc 유저 북마크 생성
 *  @access Public
 */

const createdeleteBookmark = async (
  req: TypedRequest<{ cardId: Types.ObjectId }>,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
  const userId = req.user.id as Types.ObjectId;
  const cardId = req.body.cardId;

  const input: UserBookmarkInfo = {
    userId,
    cardId
  };
  try {
    const created = await UserService.createdeleteBookmark(input);
    res
      .status(statusCode.CREATED)
      .send(
        util.success(
          statusCode.CREATED,
          created
            ? message.USER_BOOKMARK_CREATE_SUCCESS
            : message.USER_BOOKMARK_DELETE_SUCCESS
        )
      );
  } catch (err) {
    const errorMessage: string = slackMessage(
      req.method.toUpperCase(),
      req.originalUrl,
      err,
      req.user?.id
    );
    sendMessagesToSlack(errorMessage);
    next(err);
  }
};

export {
  postUser,
  loginUser,
  getUserProfile,
  updateUserNickname,
  updateUserProfileImage,
  getBookmarks,
  createdeleteBookmark
};
