import { model, Schema } from 'mongoose';
import IDocument from './interface/Document';
import ICard from './interface/ICard';

type CardDocument = ICard & IDocument;

const cardSchema = new Schema<CardDocument>({
  content: {
    type: String,
    required: true
  },
  gender: [Number],
  ageGroup: [Number],
  category: [Schema.Types.ObjectId],
  intimacy: {
    type: Number,
    required: true
  }
});

const Card = model<CardDocument>('Card', cardSchema);

export default Card;
