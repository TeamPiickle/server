import { hashSync, compare } from 'bcrypt';
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

  const bookmarks = user.cardIdList.map((card: any) => {
    const result = {
      cardId: card._id,
      content: card.content
    };
    return result;
  });
  return bookmarks;
};

/**
 *
 * 1. userId로 유저를 먼저 찾는다
 * 1-2. user가 존재하는지 체크
 * 2. 유저의 카드리스트에 이미 존재하는지 중복 검사.
 * 3. 존재하면 삭제 존재하지 않으면 추가 추가할 때 유저에 카드 아이디 리스트에 카드 아이디를 추가하고 북마크에 카드아이디와 유저 아이디를 저장한 도큐먼트를 추가한다.
 */
const createBookmark = async (input: UserBookmarkInfo) => {
  const { userId, cardId } = input;
  const user = await User.findById(userId);
  if (user == null) {
    throw new IllegalArgumentException('해당 id의 유저가 존재하지 않습니다.');
  }
  const card = user.cardIdList;
  const cardIndex = card.indexOf(cardId);
  // 1. 카드아이디의 인덱스를 찾는다. indexOf로 그리고 찾은 후 저장해둔다.
  if (cardIndex == -1) {
    // 카드를 유저 카드리스트에 추가
    user.cardIdList.push(cardId);
    await user.save();
    // 새로운 북마크 도큐먼트를 저장
    const newBookmark = new Bookmark({
      user: user._id,
      card: cardId
    });
    await newBookmark.save();
    return 1;
  } else {
    user.cardIdList.splice(cardIndex);
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
  createBookmark
};
