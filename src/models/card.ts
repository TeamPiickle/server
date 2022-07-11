import { model, Schema } from 'mongoose';
import IDocument from './interface/Document';
import ICard from './interface/ICard';

type CardDocument = ICard & IDocument;

const cardSchema = new Schema<CardDocument>({
  content: {
    type: String,
    required: true
  },
  category: Schema.Types.ObjectId,
  tags: {
    type: [String]
  },
  intimacy: {
    type: Number,
    required: true
  }
});

const Card = model<CardDocument>('Card', cardSchema);

export default Card;
