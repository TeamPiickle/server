import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  checkActionCode
} from 'firebase/auth';
import {
  IllegalStateException,
  InternalServerError
} from '../intefaces/exception';
import firebase from '../loaders/firebase';
import PreUser from '../models/preUser';

const sendEmail = async (
  email: string,
  randomPassword: string,
  isNew: boolean
) => {
  const auth = getAuth(firebase);

  const signIn = isNew
    ? createUserWithEmailAndPassword
    : signInWithEmailAndPassword;

  const userCredential = await signIn(auth, email, randomPassword);
  await sendEmailVerification(userCredential.user);
};

const confirmEmailVerification = async (oobCode: string) => {
  const auth = getAuth();
  const actionCodeInfo = await checkActionCode(auth, oobCode);
  const preUser = await PreUser.findOne({ email: actionCodeInfo.data.email });
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

export { sendEmail, isUserEmailVerified, confirmEmailVerification };
