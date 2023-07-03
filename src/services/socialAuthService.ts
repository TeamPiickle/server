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

const join = async (socialMember: IUser): Promise<UserDocument> => {
  if (socialMember.email) {
    const alreadyEmail = await UserService.isEmailExisting(socialMember.email);
    if (alreadyEmail) {
      throw new IllegalArgumentException(
        `같은 이메일로 가입된 유저가 있습니다. email: ${socialMember.email}`
      );
    }
  }
  socialMember.nickname = await UserService.autoGenerateNicknameFrom(
    socialMember.nickname
  );
  const newMember = new User(socialMember);
  await newMember.save();
  return newMember;
};

const findOrCreateUserBySocialToken = async (vendor: string, token: string) => {
  const response: SocialLoginResponse = await getUserFromSocialVendor(
    token,
    vendor
  );
  const socialVendor = SocialVendorExtension.getVendorByValue(vendor);
  const socialMember: IUser = convertSocialToPiickle(socialVendor, response);
  const isAlreadyMember = await isAlreadySocialMember(socialMember);
  if (isAlreadyMember) {
    const alreadyMember = await findUserBySocial(
      socialVendor,
      socialMember.socialId!
    );
    return alreadyMember;
  }
  return join(socialMember);
};

export { findOrCreateUserBySocialToken, findUserBySocial };
