import { Types } from 'mongoose';
export interface UserCreateBookmarkDto {
  userId: Types.ObjectId;
  cardId: Types.ObjectId;
}
