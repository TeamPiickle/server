import { hashSync, compare } from 'bcryptjs';
import config from '../config';
import CreateUserCommand from '../intefaces/createUserCommand';
import User from '../models/user';
import {
  IllegalArgumentException,
  InternalAuthenticationServiceException,
  BadCredentialException,
  DuplicateException
} from '../intefaces/exception';
import { UserLoginDto } from '../intefaces/user/UserLoginDto';
import { PostBaseResponseDto } from '../intefaces/PostBaseResponseDto';
import { UserProfileResponseDto } from '../intefaces/user/UserProfileResponseDto';
import { UserProfileImageUrlDto } from '../intefaces/user/UserProfileImageUrlDto';
import { Types } from 'mongoose';
import { UserBookmarkDto } from '../intefaces/user/UserBookmarkDto';
import { UserBookmarkInfo } from '../intefaces/user/UserBookmarkInfo';
import Bookmark from '../models/bookmark';
import Card from '../models/card';

const createUser = async (command: CreateUserCommand) => {
  const alreadyUser = await User.findOne({
    email: command.email
  });
  if (alreadyUser) {
    throw new IllegalArgumentException('이미 존재하는 이메일입니다.');
  }
  const alreadyNickname = await User.findOne({
    nickname: command.nickname
  });
  if (alreadyNickname) {
    throw new DuplicateException('이미 존재하는 닉네임입니다.');
  }
  const hashedPassword = hashSync(command.password, 10);
  const user = new User({
    name: command.name,
    email: command.email,
    hashedPassword: hashedPassword,
    nickname: command.nickname,
    profileImageUrl: config.defaultProfileImgUrl
  });
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
    name: user.name,
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
        category: item.Category,
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
    return 1;
  } else {
    user.cardIdList.splice(cardIndex, 1);
    await user.save();
    await Bookmark.findOneAndDelete({ user: userId, card: cardId });
    return 0;
  }
};

export {
  createUser,
  loginUser,
  findUserById,
  updateNickname,
  updateUserProfileImage,
  getBookmarks,
  createdeleteBookmark
};
