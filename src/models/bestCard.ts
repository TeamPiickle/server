import { model, Schema, Types } from 'mongoose';
import IDocument from './interface/Document';

type BestCardDocument = { card: Types.ObjectId } & IDocument;

const bestCardSchema = new Schema<BestCardDocument>(
  {
    card: {
      type: Schema.Types.ObjectId,
      ref: 'Card'
    }
  },
  {
    timestamps: true
  }
);

const BestCard = model<BestCardDocument>('BestCard', bestCardSchema);

export default BestCard;
