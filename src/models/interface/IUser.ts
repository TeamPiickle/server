import { Types } from 'mongoose';

interface IUser {
  email: string;
  nickname: string;
  hashedPassword: string;
  birthday: Date;
  gender: string;
  profileImageUrl: string;
  cardIdList: Types.ObjectId[];
}

export default IUser;
