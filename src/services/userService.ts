import { hashSync } from 'bcrypt';
import config from '../config';
import CreateUserCommand from '../intefaces/createUserCommand';
import User from '../models/user';

const createUser = async (command: CreateUserCommand) => {
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

export default { createUser };
