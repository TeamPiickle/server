import { Types } from 'mongoose';

export default interface ICardMedley {
  title: string;
  sticker: string;
  description?: string;
  previewCards: Types.ObjectId[];
}
