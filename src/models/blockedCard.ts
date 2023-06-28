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

const BlockedCard = model<BlockedCardDocument>(
  'BlockedCard',
  blockedCardSchema
);

export { BlockedCardDocument, BlockedCard };
