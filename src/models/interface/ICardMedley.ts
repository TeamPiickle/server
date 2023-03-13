import { Types } from 'mongoose';

export default interface ICardMedley {
  title: string;
  coverTitle: string;
  sticker: string;
  description?: string;
  previewCards: Types.ObjectId[];
  cards: Types.ObjectId[];
}
