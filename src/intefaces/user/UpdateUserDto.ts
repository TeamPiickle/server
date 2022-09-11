import { ObjectId } from 'mongoose';

export interface UpdateUserDto {
  id: ObjectId;
  nickname: string;
  profileImgUrl?: string;
  birthday: string;
  gender: string;
}
