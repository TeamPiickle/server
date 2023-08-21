import { Types } from 'mongoose';

export interface Mind23CardResponseDto {
  _id: Types.ObjectId;
  content: string;
  tags: string[];
  category: Types.ObjectId[];
  filter: string[];
  isBookmark?: boolean;
  essential: Boolean;
}
