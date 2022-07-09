import { Schema, model } from 'mongoose';
import IDocument from './interface/Document';
import IBallotResult from './interface/IBallotResult';

type BallotResultDocument = IBallotResult & IDocument;

const ballotResultSchema = new Schema<BallotResultDocument>({
  ballotTopicId: {
    type: Schema.Types.ObjectId,
    ref: 'BallotTopic',
    required: true
  },
  ballotItemId: {
    type: Schema.Types.ObjectId,
    ref: 'BallotItem',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    requried: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const BallotResult = model<BallotResultDocument>(
  'BallotResult',
  ballotResultSchema
);

export { IBallotResult, BallotResult };
