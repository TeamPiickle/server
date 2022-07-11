import { hashSync } from 'bcrypt';
import { compare } from 'bcrypt';
import config from '../config';
import CreateUserCommand from '../intefaces/createUserCommand';
import User from '../models/user';
import {
  IllegalArgumentException,
  InternalAuthenticationServiceException,
  BadCredentialException
} from '../intefaces/common';
import { UserLoginDto } from '../intefaces/UserLoginDto';
import { PostBaseResponseDto } from '../intefaces/PostBaseResponseDto';

const createUser = async (command: CreateUserCommand) => {
  const alreadyUser = await User.findOne({
    email: command.email
  });
  if (alreadyUser) {
    throw new IllegalArgumentException('이미 존재하는 이메일입니다.');
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

export default { createUser, loginUser };
