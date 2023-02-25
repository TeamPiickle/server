import { Types } from 'mongoose';

export default interface CardMedleyDto {
  _id: Types.ObjectId;
  title: string;
  sticker: string;
  description?: string;
  previewCards: Types.ObjectId[];
  cards: Types.ObjectId[];
}
