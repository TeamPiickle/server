import { Types } from 'mongoose';

interface IUser {
  email?: string;
  socialId?: string;
  socialVendor?: string;
  nickname: string;
  hashedPassword?: string;
  ageGroup?: string;
  gender: string;
  profileImageUrl: string;
  cardIdList: Types.ObjectId[];
}

export default IUser;
