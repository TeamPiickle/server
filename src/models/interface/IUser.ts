import { Types } from 'mongoose';

interface IUser {
  email: string;
  name: string;
  nickname: string;
  hashedPassword: string;
  profileImageUrl: string;
  cardIdList: Types.ObjectId[];
}

export default IUser;
