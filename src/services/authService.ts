import { InternalServerError } from '../intefaces/exception';
import PreUser from '../models/preUser';

const confirmEmailVerification = async (email: string) => {
  const preUser = await PreUser.findOne({ email });
  if (!preUser) {
    throw new InternalServerError('이메일 인증 정보를 찾을 수 없습니다.');
  }
  preUser.emailVerified = true;
  await preUser.save();
  return preUser;
};

const isUserEmailVerified = async (email: string): Promise<boolean> => {
  const preUser = await PreUser.findOne({ email });
  if (!preUser) return false;
  return preUser.emailVerified;
};

export { isUserEmailVerified, confirmEmailVerification };
