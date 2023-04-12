import { Schema, model } from 'mongoose';
import IDocument from './interface/Document';
import IBallotItem from './interface/IBallotItem';

type BallotItemDocument = IBallotItem & IDocument;

const ballotItemSchema = new Schema<BallotItemDocument>({
  name: {
    type: String,
    required: true
  },
  ballotTopicId: {
    type: Schema.Types.ObjectId,
    ref: 'BallotTopic',
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

const BallotItem = model<BallotItemDocument>('BallotItem', ballotItemSchema);

export default BallotItem;
