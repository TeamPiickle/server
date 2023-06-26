import User from '../models/user/user';
import PreUser from '../models/preUser';
import { IllegalStateException } from '../intefaces/exception';

const createPreUser = async (email: string) => {
  const alreadyUser = await User.findOne({ email });
  if (alreadyUser) {
    throw new IllegalStateException('이미 가입된 메일입니다.');
  }

  const alreadyEmail = await PreUser.findOne({ email });
  if (alreadyEmail) {
    alreadyEmail.emailVerified = false;
    await alreadyEmail.save();
    return {
      preUser: alreadyEmail,
      isNew: false
    };
  }

  const randomPassword = Math.random().toString(36).substring(2, 12);
  const newPreUser = new PreUser({
    email,
    password: randomPassword
  });
  await newPreUser.save();
  return {
    preUser: newPreUser,
    isNew: true
  };
};

export { createPreUser };
