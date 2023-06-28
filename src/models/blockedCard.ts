import IBlockedCard from './interface/IBlockedCard';
import Document from './interface/Document';
import { model, Schema } from 'mongoose';

type BlockedCardDocument = IBlockedCard & Document;

const blockedCardSchema = new Schema<BlockedCardDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  card: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  }
});

blockedCardSchema.index({ user: 1, card: 1 }, { unique: true });

const BlockedCard = model<BlockedCardDocument>(
  'BlockedCard',
  blockedCardSchema
);

export { BlockedCardDocument, BlockedCard };
