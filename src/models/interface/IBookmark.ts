import { Types } from 'mongoose';

export default interface IBookmark {
  userId: Types.ObjectId;
  cardId: Types.ObjectId;
}
