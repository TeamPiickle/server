import { Types } from 'mongoose';

export interface CardResponseDto {
  _id: Types.ObjectId;
  content: string;
  tags: string[];
  category: Types.ObjectId[];
  filter: string[];
  isBookmark?: boolean;
}
