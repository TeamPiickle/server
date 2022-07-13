import { Types } from 'mongoose';

export interface CardResponseDto {
  content: string;
  tags: string[];
  category: Types.ObjectId[];
  filter: string[];
  bookmarkUser: Types.ObjectId[];
}
