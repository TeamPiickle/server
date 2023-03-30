import { model, Schema } from 'mongoose';
import ICardMedley from './interface/ICardMedley';
import IDocument from './interface/Document';

type CardMedleyDocument = ICardMedley & IDocument;

const cardMedleySchema = new Schema<CardMedleyDocument>({
  title: {
    type: String,
    required: true
  },
  coverTitle: {
    type: String,
    required: true
  },
  sticker: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  previewCards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Card'
    }
  ],
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Card'
    }
  ]
});

const CardMedley = model<CardMedleyDocument>('CardMedley', cardMedleySchema);

export default CardMedley;

export { CardMedleyDocument };
