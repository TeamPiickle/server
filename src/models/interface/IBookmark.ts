import { Types } from 'mongoose';

export default interface IBookmark {
  card: Types.ObjectId;
  user: Types.ObjectId;
}
