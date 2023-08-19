import { model, Schema } from 'mongoose';
import IDocument from '../interface/Document';

interface IPrizeEntry {
  user: Schema.Types.ObjectId;
}

type PrizeEntryDocument = IPrizeEntry & IDocument;

const prizeEntrySchema = new Schema<PrizeEntryDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const PrizeEntry = model<PrizeEntryDocument>('PrizeEntry', prizeEntrySchema);

export default PrizeEntry;

export { PrizeEntryDocument };
