import { Types } from 'mongoose';
export interface UserBookmarkDto {
  cardId: Types.ObjectId;
  content: string;
  tags: string[];
  category: Types.ObjectId[];
  filter: string[];
  isBookmark: boolean;
}
