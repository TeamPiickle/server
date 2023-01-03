import { hashSync, compare } from 'bcryptjs';
import { CreateUserCommand } from '../intefaces/createUserCommand';
import User from '../models/user';
import {
  IllegalArgumentException,
  InternalAuthenticationServiceException,
  BadCredentialException,
  DuplicateException,
  IllegalStateException
} from '../intefaces/exception';
import { UserLoginDto } from '../intefaces/user/UserLoginDto';
import { PostBaseResponseDto } from '../intefaces/PostBaseResponseDto';
import { UserProfileResponseDto } from '../intefaces/user/UserProfileResponseDto';
import { UserProfileImageUrlDto } from '../intefaces/user/UserProfileImageUrlDto';
import { Types } from 'mongoose';
import { UserBookmarkDto } from '../intefaces/user/UserBookmarkDto';
import { UserBookmarkInfo } from '../intefaces/user/UserBookmarkInfo';
import Bookmark from '../models/bookmark';
import PreUser from '../models/preUser';
import Card from '../models/card';
import { UpdateUserDto } from '../intefaces/user/UpdateUserDto';
import util from '../modules/util';
import QuitLog from '../models/quitLog';

const isEmailExisting = async (email: string): Promise<boolean> => {
  const alreadyUser = await User.findOne({
    email
  });
  if (alreadyUser) {
    return true;
  }
  return false;
};

const validateEmail = async (email: string) => {
  const alreadyUser = await User.findOne({
    email
  });
  if (alreadyUser) {
    throw new IllegalArgumentException('이미 존재하는 이메일입니다.');
  }
};

const createUser = async (command: CreateUserCommand) => {
  const {
    email,
    password,
    nickname,
    birthday: birthStr,
    gender,
    profileImgUrl: profileImageUrl
  } = command;
  await validateEmail(email);

  const user = new User({
    email,
    hashedPassword: hashSync(password, 10),
    nickname,
    birthday: util.stringToDate(birthStr),
    gender,
    profileImageUrl
  });
  await user.save();
  return user;
};

const patchUser = async (updateUserDto: UpdateUserDto) => {
  const user = await User.findById(updateUserDto.id);
  if (!user) {
    throw new IllegalArgumentException('해당 id의 유저가 존재하지 않습니다.');
  }
  const { nickname, profileImgUrl, birthday, gender } = updateUserDto;
  user.nickname = nickname;
  user.birthday = util.stringToDate(birthday);
  user.profileImageUrl = profileImgUrl ? profileImgUrl : user.profileImageUrl;
  user.gender = gender ? gender : '기타';
  await user.save();
};

const loginUser = async (
  userLoginDto: UserLoginDto
): Promise<PostBaseResponseDto> => {
  const user = await User.findOne({
    email: userLoginDto.email
  });

  if (!user) {
    throw new InternalAuthenticationServiceException(
      '존재하지 않는 email 입니다.'
    );
  }
  const isMatch = await compare(userLoginDto.password, user.hashedPassword);
  if (!isMatch) {
    throw new BadCredentialException('비밀번호가 일치하지 않습니다.');
  }

  const data = {
    _id: user._id
  };
  return data;
};

const findUserById = async (
  userId: Types.ObjectId
): Promise<UserProfileResponseDto> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new IllegalArgumentException('존재하지 않는 유저 입니다.');
  }
  const userProfileResponseDto: UserProfileResponseDto = {
    name: '김피클',
    nickname: user.nickname,
    email: user.email,
    profileImageUrl: user.profileImageUrl
  };
  return userProfileResponseDto;
};

const updateNickname = async (userId: Types.ObjectId, nickname: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new IllegalArgumentException('존재하지 않는 사용자 입니다.');
  }

  const alreadyUseNickname = await User.findOne({
    nickname: nickname
  });

  if (alreadyUseNickname) {
    throw new DuplicateException('이미 사용중인 닉네임 입니다.');
  }

  await user.updateOne({
    nickname: nickname
  });
};

const updateUserProfileImage = async (
  userId: Types.ObjectId,
  location: string
): Promise<UserProfileImageUrlDto> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new IllegalArgumentException('존재하지 않는 유저 입니다.');
  }
  await user.updateOne({ profileImageUrl: location });
  return { profileImageUrl: location };
};

const getBookmarks = async (
  userId: Types.ObjectId
): Promise<UserBookmarkDto[]> => {
  const user = await User.findById(userId).populate('cardIdList');

  if (!user) {
    throw new IllegalArgumentException('존재하지 않는 유저 입니다.');
  }

  const bookmarks = await Promise.all(
    user.cardIdList.map(async (item: any) => {
      const isBookmark =
        (await Bookmark.find({ user: userId, card: item._id }).count()) > 0
          ? true
          : false;
      return {
        cardId: item._id,
        content: item.content,
        tags: item.tags,
        category: item.category,
        filter: item.filter,
        isBookmark: isBookmark
      };
    })
  );

  return bookmarks;
};

const createdeleteBookmark = async (input: UserBookmarkInfo) => {
  const { userId, cardId } = input;
  const user = await User.findById(userId);
  if (user == null) {
    throw new IllegalArgumentException('해당 id의 유저가 존재하지 않습니다.');
  }
  const cardCheck = await Card.findById(cardId);
  if (cardCheck == null) {
    throw new IllegalArgumentException('해당 id의 카드가 존재하지 않습니다.');
  }
  const card = user.cardIdList;
  const cardIndex = card.indexOf(cardId);

  if (cardIndex == -1) {
    user.cardIdList.push(cardId);
    await user.save();

    const newBookmark = new Bookmark({
      user: user._id,
      card: cardId
    });
    await newBookmark.save();
    console.log(newBookmark);
    return 1;
  } else {
    user.cardIdList.splice(cardIndex, 1);
    await user.save();
    await Bookmark.findOneAndDelete({ user: userId, card: cardId });
    return 0;
  }
};

const nicknameDuplicationCheck = async (nickname: string) => {
  const user = await User.findOne({
    nickname: nickname
  });
  if (user) {
    return true;
  }
  return false;
};

const deleteUser = async (userId: Types.ObjectId, reasons: string[]) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new IllegalStateException('존재하지 않는 유저입니다.');
  }
  await Bookmark.deleteMany({ user: userId });
  const preUser = await PreUser.findOne({ email: user.email });
  if (preUser) {
    preUser.emailVerified = false;
    await preUser.save();
  }
  await user.delete();

  const quitLog = new QuitLog({
    reasons
  });
  await quitLog.save();
};

export {
  isEmailExisting,
  createUser,
  patchUser,
  loginUser,
  findUserById,
  updateNickname,
  updateUserProfileImage,
  getBookmarks,
  createdeleteBookmark,
  nicknameDuplicationCheck,
  deleteUser
};
