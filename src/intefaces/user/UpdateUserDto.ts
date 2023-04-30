import { Types } from 'mongoose';

export interface UpdateUserDto {
  id: Types.ObjectId;
  nickname: string;
  profileImgUrl?: string;
  birthday: string;
  gender: string;
}
