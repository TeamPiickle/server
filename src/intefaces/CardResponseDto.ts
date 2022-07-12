import { Types } from 'mongoose';

export interface CardResponseDto {
  content: {
    type: string;
    required: true;
  };
  tags: [string];
  category: Types.ObjectId;
  intimacy: {
    type: number;
    required: true;
  };
}
