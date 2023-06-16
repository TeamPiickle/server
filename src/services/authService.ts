import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { InternalServerError } from '../intefaces/exception';
import firebase from '../loaders/firebase';
import PreUser from '../models/preUser';
import axios from 'axios';
import { SocialVendorToUrl } from '../models/socialVendor';

const EMAIL_CHECK_URL = 'http://server.piickle.link/users/email-check';

const sendEmail = async (
  email: string,
  randomPassword: string,
  isNew: boolean,
  isDev?: boolean
) => {
  const auth = getAuth(firebase);

  const signIn = isNew
    ? createUserWithEmailAndPassword
    : signInWithEmailAndPassword;

  const userCredential = await signIn(auth, email, randomPassword);
  const url = isDev
    ? `${EMAIL_CHECK_URL}/test?email=${email}`
    : `${EMAIL_CHECK_URL}?email=${email}`;
  await sendEmailVerification(userCredential.user, {
    url,
    handleCodeInApp: false
  });
};

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

const getUserFromThirdService = async (token: string, vendor: string) => {
  const response = await axios({
    method: 'get',
    url: SocialVendorToUrl.fromVendorValue(vendor),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response;
};

export {
  sendEmail,
  isUserEmailVerified,
  confirmEmailVerification,
  getUserFromThirdService
};
