import { Types } from 'mongoose';

export default interface CardMedleyPreviewDto {
  _id: Types.ObjectId;
  coverTitle: string;
  title: string;
  sticker: string;
  description?: string;
  previewCards: Types.ObjectId[];
}
