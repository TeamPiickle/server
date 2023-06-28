import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  EmptyMailCodeException,
  IllegalArgumentException,
  IllegalStateException
} from '../intefaces/exception';
import {
  CreateUserCommand,
  CreateUserReq
} from '../intefaces/createUserCommand';
import { PostBaseResponseDto } from '../intefaces/PostBaseResponseDto';
import { UserLoginDto } from '../intefaces/user/UserLoginDto';
import getToken from '../modules/jwtHandler';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import {
  UserService,
  PreUserService,
  AuthService,
  SocialAuthService,
  NaverLoginService,
  BlockCardService
} from '../services';
import { UserProfileResponseDto } from '../intefaces/user/UserProfileResponseDto';
import { UserUpdateNicknameDto } from '../intefaces/user/UserUpdateNicknameDto';
import { UserBookmarkDto } from '../intefaces/user/UserBookmarkDto';
import { UserBookmarkInfo } from '../intefaces/user/UserBookmarkInfo';
import { Types } from 'mongoose';
import { TypedRequest } from '../types/TypedRequest';
import EmailVerificationReqDto from '../intefaces/user/EmailVerificationReqDto';
import config from '../config';
import SocialLoginDto from '../intefaces/user/SocialLoginDto';
import LoginResponseDto from '../intefaces/user/LoginResponseDto';
import { UserDocument } from '../models/user/user';
import { SocialVendor } from '../models/socialVendor';
import card from '../models/card';

/**
 * @route GET /email
 * @desc 메일 중복 확인 api
 * @access public
 */
const readEmailIsExisting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.query;
    if (!email) {
      throw new IllegalArgumentException('이메일 값을 입력해주세요.');
    }
    const isAlreadyExisting = await UserService.isEmailExisting(<string>email);
    res.status(statusCode.OK).send(
      util.success(statusCode.OK, '이메일 중복 조회 성공', {
        isAlreadyExisting
      })
    );
  } catch (err) {
    next(err);
  }
};

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
      throw new IllegalArgumentException('필요한 값이 없습니다');
    }
    const { email } = req.body;
    const { preUser, isNew } = await PreUserService.createPreUser(email);
    const isDev = req.header('Origin') != 'https://www.piickle.link';
    await AuthService.sendEmail(preUser.email, preUser.password, isNew, isDev);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, '인증메일 발송 성공', email));
  } catch (err) {
    next(err);
  }
};

/**
 *  @route GET /users/nickname
 *  @desc 닉네임 중복 체크 api
 *  @access Public
 */
const nicknameDuplicationCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nickname } = req.query;
    if (!nickname) {
      throw new IllegalArgumentException('필요한 값이 없습니다.');
    }
    const result = await UserService.nicknameAlreadyExists(<string>nickname);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, '닉네임 중복 체크 성공', result));
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
const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.query;
    if (!email) {
      throw new EmptyMailCodeException(
        '유저 정보를 알 수 없습니다. 인증 메일을 새로 전송해주세요.'
      );
    }
    const preUser = await AuthService.confirmEmailVerification(<string>email);
    res.redirect(`${config.emailRedirectionUrl.prod}?email=${preUser.email}`);
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @method GET
 * @route /email-check/test
 * @desc 이메일 인증하기 api
 * @access Public
 */
const verifyEmailTest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.query;
    if (!email) {
      throw new EmptyMailCodeException(
        '유저 정보를 알 수 없습니다. 인증 메일을 새로 전송해주세요.'
      );
    }
    const preUser = await AuthService.confirmEmailVerification(<string>email);
    res.redirect(`${config.emailRedirectionUrl.dev}?email=${preUser.email}`);
  } catch (err) {
    next(err);
  }
};

/**
 *  @route /users
 *  @desc 회원가입 api
 *  @access Public
 */
const postUser = async (
  req: TypedRequest<CreateUserReq>,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new IllegalArgumentException('필요한 값이 없습니다.');
    }

    const createUserCommand: CreateUserCommand = {
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname,
      birthday: req.body.birthday,
      gender: req.body.gender,
      profileImgUrl: (req?.file as Express.MulterS3.File)?.location
    };

    const createdUser = await UserService.createUser(createUserCommand);

    const jwt = getToken(createdUser._id);

    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.USER_CREATED, { jwt }));
  } catch (err) {
    next(err);
  }
};

/**
 * @method PATCH
 * @route /users
 * @access Public
 */
// const patchUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       throw new IllegalArgumentException('로그인이 필요합니다.');
//     }
//     const reqErr = validationResult(req);
//
//     if (!reqErr.isEmpty()) {
//       throw new IllegalArgumentException('필요한 값이 없습니다.');
//     }
//
//     const input: UpdateUserDto = {
//       id: userId,
//       nickname: req.body.nickname,
//       birthday: req.body.birthday,
//       gender: req.body.gender,
//       profileImgUrl: (req?.file as Express.MulterS3.File)?.location
//     };
//
//     await UserService.patchUser(input);
//
//     res
//       .status(statusCode.OK)
//       .send(util.success(statusCode.OK, message.USER_UPDATE_SUCCESS));
//   } catch (err) {
//     next(err);
//   }
// };

/**
 *  @route /users/login
 *  @desc 로그인 api
 *  @access Public
 */
const postUserLogin = async (
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
    const data: LoginResponseDto = {
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

const getAccessToken = async (
  req: TypedRequest<SocialLoginDto>
): Promise<string> => {
  const { vendor } = req.body;
  let accessToken = req.body.accessToken;

  if (vendor == SocialVendor.NAVER) {
    const { code, state } = req.body;
    if (!code || !state) {
      throw new IllegalArgumentException(
        `${SocialVendor.NAVER}는 code와 state가 필요합니다.`
      );
    }
    accessToken = await NaverLoginService.getToken(code, state);
  }
  if (!accessToken) {
    throw new IllegalStateException('accessToken이 없습니다.');
  }
  return accessToken;
};

const socialLogin = async (
  req: TypedRequest<SocialLoginDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vendor } = req.body;
    const accessToken = await getAccessToken(req);
    const socialUser: UserDocument =
      await SocialAuthService.findOrCreateUserBySocialToken(
        vendor,
        accessToken
      );

    const piickleJwt = getToken(socialUser._id);
    return res.status(statusCode.OK).send(
      util.success(statusCode.OK, message.USER_LOGIN_SUCCESS, {
        _id: socialUser._id,
        accessToken: piickleJwt
      })
    );
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
  const userId = req.user?.id;
  if (!userId) {
    throw new IllegalArgumentException('로그인이 필요합니다.');
  }
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
    const userId = req.user?.id;
    if (!userId) {
      throw new IllegalArgumentException('로그인이 필요합니다.');
    }
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
    const userId = req.user?.id;
    if (!userId) {
      throw new IllegalArgumentException('로그인이 필요합니다.');
    }
    const data = await UserService.updateUserProfileImage(userId, location);
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
  const userId = req.user?.id;
  if (!userId) {
    throw new IllegalArgumentException('로그인이 필요합니다.');
  }
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
  const userId = req.user?.id;
  if (!userId) {
    throw new IllegalArgumentException('로그인이 필요합니다.');
  }
  const cardId = req.body.cardId;

  const input: UserBookmarkInfo = {
    userId,
    cardId
  };
  try {
    const created: boolean = await UserService.createOrDeleteBookmark(input);
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

/**
 *  @route PUT /users/me
 *  @desc 회원탈퇴
 *  @access Public
 */
const deleteUser = async (
  req: TypedRequest<{ reasons: string[] }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: Types.ObjectId | undefined = req.user?.id;
    if (!userId) {
      throw new IllegalArgumentException('로그인이 필요한 기능입니다.');
    }
    const { reasons } = req.body;
    await UserService.deleteUser(userId, reasons);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_USER_SUCCESS));
  } catch (err) {
    next(err);
  }
};

/**
 * @route POST /users/cards/blacklist
 * @desc 카드 블랙리스트 추가
 * @access public
 */
const blockCard = async (
  req: TypedRequest<{ cardId: Types.ObjectId }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new IllegalArgumentException('유저 아이디가 없습니다.');
    }
    const { cardId } = req.body;
    await BlockCardService.blockCard(userId, cardId);
    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.BLOCK_CARD_SUCCESS));
  } catch (e) {
    console.error(e);
    next(e);
  }
};

/**
 * @route DELETE /users/cards/blacklist/:cardId
 * @desc 카드 블랙리스트 추가
 * @access public
 */
const cancelToBlock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new IllegalArgumentException('유저 아이디가 없습니다.');
    }
    const cardId = new Types.ObjectId(req.params.cardId);
    if (!cardId) {
      throw new IllegalArgumentException('카드 아이디가 없습니다.');
    }
    await BlockCardService.cancelToBlockCard(userId, cardId);
    return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.CANCEL_BLOCK_CARD_SUCCESS));
  } catch (e) {
    next(e);
  }
};

export {
  readEmailIsExisting,
  socialLogin,
  postUser,
  // patchUser,
  postUserLogin,
  getUserProfile,
  updateUserNickname,
  updateUserProfileImage,
  getBookmarks,
  createdeleteBookmark,
  sendEmailVerification,
  verifyEmail,
  verifyEmailTest,
  nicknameDuplicationCheck,
  deleteUser,
  blockCard,
  cancelToBlock
};
