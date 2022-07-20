import Types from 'mongoose';
export interface UserBookmarkDto {
  cardId: Types.ObjectId;
  content: {
    type: string;
    required: true;
  };
  tags: [String];
  category: [Types.ObjectId];
  filter: [String];
}
