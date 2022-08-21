import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  IllegalArgumentException,
  IllegalStateException
} from '../intefaces/exception';
import CreateUserCommand from '../intefaces/createUserCommand';
import { PostBaseResponseDto } from '../intefaces/PostBaseResponseDto';
import { UserLoginDto } from '../intefaces/user/UserLoginDto';
import getToken from '../modules/jwtHandler';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import { UserService, PreUserService, AuthService } from '../services';
import { UserProfileResponseDto } from '../intefaces/user/UserProfileResponseDto';
import { UserUpdateNicknameDto } from '../intefaces/user/UserUpdateNicknameDto';
import { UserBookmarkDto } from '../intefaces/user/UserBookmarkDto';
import { UserBookmarkInfo } from '../intefaces/user/UserBookmarkInfo';
import { Types } from 'mongoose';
import { TypedRequest } from '../types/TypedRequest';
import EmailVerificationReqDto from '../intefaces/user/EmailVerificationReqDto';
import PreUser from '../models/preUser';

/**
 *  @route POST /email-verification
 *  @desc 인증메일 전송 api
 *  @access Public
 */
const sendEmailVerification = async (
  req: TypedRequest<EmailVerificationReqDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new IllegalArgumentException('필요한 값이 없습니다.');
    }
    const { email } = req.body;
    const { preUser, isNew } = await PreUserService.createPreUser(email);
    await AuthService.sendEmail(preUser.email, preUser.password, isNew);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, '인증메일 발송 성공', email));
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @method GET
 * @route /email-check
 * @desc 이메일 인증하기 api
 * @access Public
 */
const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oobCode } = req.query;
    if (!oobCode) {
      throw new IllegalArgumentException('히이잉');
    }
    const preUser = await AuthService.confirmEmailVerification(<string>oobCode);
    res.redirect(`http://www.piickle.link?kayoung=god&email=${preUser.email}`); // TODO: 웹에서 화면 만들어주면 붙이기
  } catch (err) {
    next(err);
  }
};

/**
 *
 * 이메일 인증 여부를 체크하는 함수, 회원가입 api 에서 유효한 이메일인지 알기 위해 사용한다.
 * @param email fcm 인증 여부를 확인할 이메일 주소
 */
const checkIfEmailIsVerified = async (email: string) => {
  const preUser = await PreUser.findOne({ email });
  if (!preUser) {
    throw new IllegalStateException('인증 메일을 전송하세요.');
  }
  const isUserEmailVerified = await AuthService.isUserEmailVerified(
    preUser.email
  );
  if (!isUserEmailVerified) {
    throw new IllegalStateException('인증이 완료되지 않은 이메일입니다.');
  }
  if (!preUser.emailVerified) {
    preUser.emailVerified = true;
    await preUser.save();
  }
};

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
    const { email } = req.body;
    await checkIfEmailIsVerified(email);
    await UserService.createUser(req.body);

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
  createdeleteBookmark,
  sendEmailVerification,
  verifyEmail
};
