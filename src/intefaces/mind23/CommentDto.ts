import { Types } from 'mongoose';

export interface CommentDto {
  _id: Types.ObjectId;
  content: String;
  profileImageUrl: string;
}
