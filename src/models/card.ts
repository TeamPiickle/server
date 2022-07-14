import { model, Schema } from 'mongoose';
import IDocument from './interface/Document';
import ICard from './interface/ICard';

type CardDocument = ICard & IDocument;

const cardSchema = new Schema<CardDocument>({
  content: {
    type: String,
    required: true
  },
  tags: [String],
  category: [Schema.Types.ObjectId],
  filter: [String]
});

const Card = model<CardDocument>('Card', cardSchema);

export default Card;
