import { Types } from 'mongoose';
import { CardResponseDto } from './CardResponseDto';

export default interface CardMedleyDto {
  _id: Types.ObjectId;
  title: string;
  sticker: string;
  description?: string;
  previewCards: Types.ObjectId[];
  cards: CardResponseDto[];
}
