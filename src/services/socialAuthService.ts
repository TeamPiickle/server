import axios, { AxiosResponse } from 'axios';
import { SocialVendor, SocialVendorExtension } from '../models/socialVendor';
import { SocialLoginResponse } from './dto/socialLoginResponse';
import IUser from '../models/interface/IUser';
import User, { UserDocument } from '../models/user/user';
import { Nullable } from '../types/types';
import {
  IllegalArgumentException,
  IllegalStateException
} from '../intefaces/exception';
import { UserService } from './index';

const getUserFromSocialVendor = async (token: string, vendor: string) => {
  const response: AxiosResponse<any> = await axios({
    method: 'get',
    url: SocialVendorExtension.getUrlByVendor(vendor),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response as SocialLoginResponse;
};

const convertSocialToPiickle = (
  socialVendor: SocialVendor,
  response: AxiosResponse<{ data: any }>
) => {
  const piickleUserMaker: (response: SocialLoginResponse) => IUser =
    SocialVendorExtension.socialUserConverter.get(socialVendor)!;
  return piickleUserMaker(response);
};

const isAlreadySocialMember = async (socialMember: IUser): Promise<boolean> => {
  const isExisting = await User.exists({
    socialVendor: socialMember.socialVendor!,
    socialId: socialMember.socialId!
  });
  if (isExisting) {
    return true;
  }
  return false;
};

const findUserBySocial = async (
  vendor: SocialVendor,
  socialId: string
): Promise<UserDocument> => {
  const user: Nullable<UserDocument> = await User.findOne({
    socialId: socialId
  });
  if (!user) {
    throw new IllegalArgumentException(
      `User not found. vendor: ${vendor}, socialId: ${socialId}`
    );
  }
  if (user.socialVendor !== vendor) {
    throw new IllegalStateException(
      `Invalid Vendor: ${vendor}. Use '${
        user?.socialVendor || 'local login'
      }' instead.`
    );
  }
  return user;
};

const validateMemberState = async (preMember: IUser) => {
  const alreadyUser = await User.findOne({
    socialVendor: '$preMember.socialVendor',
    socialId: '$preMember.socialId'
  });
  if (alreadyUser) {
    throw new IllegalArgumentException(
      `해당 소셜에 같은 이메일로 가입된 유저가 있습니다. email: ${
        preMember.email || '이메일 알 수 없음'
      }`
    );
  }
};

const join = async (socialMember: IUser): Promise<UserDocument> => {
  await validateMemberState(socialMember);
  socialMember.nickname = await UserService.autoGenerateNicknameFrom(
    socialMember.nickname
  );
  const newMember = new User(socialMember);
  await newMember.save();
  return newMember;
};

const getPiickleUser = async (vendor: string, token: string) => {
  const response: SocialLoginResponse = await getUserFromSocialVendor(
    token,
    vendor
  );
  const socialVendor = SocialVendorExtension.getVendorByValue(vendor);
  const socialMember: IUser = convertSocialToPiickle(socialVendor, response);
  return socialMember;
};

const findSocialUser = async (socialMember: IUser) => {
  const alreadyMember = await findUserBySocial(
    SocialVendorExtension.getVendorByValue(socialMember.socialVendor!),
    socialMember.socialId!
  );
  return alreadyMember;
};

export {
  findUserBySocial,
  getPiickleUser,
  isAlreadySocialMember,
  join,
  findSocialUser
};
