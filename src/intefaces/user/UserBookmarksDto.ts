import Types from 'mongoose';
export interface UserBookmarksDto {
  cardId: Types.ObjectId;
  content: {
    type: string;
    required: true;
  };
}
