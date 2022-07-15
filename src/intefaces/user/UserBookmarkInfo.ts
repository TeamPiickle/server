import { Types } from 'mongoose';
export interface UserBookmarkInfo {
  userId: Types.ObjectId;
  cardId: Types.ObjectId;
}
