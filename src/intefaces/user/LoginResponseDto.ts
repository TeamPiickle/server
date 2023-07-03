import { Types } from 'mongoose';

export default interface LoginResponseDto {
  _id: Types.ObjectId;
  accessToken: string;
}
