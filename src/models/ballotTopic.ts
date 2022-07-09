import { Schema, model } from 'mongoose';
import IDocument from './interface/Document';
import IBallotTopic from './interface/IBallotTopic';

type BallotTopicDocument = IBallotTopic & IDocument;

const ballotTopicSchema = new Schema<BallotTopicDocument>({
  topic: {
    type: String,
    required: true
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

const BallotTopic = model<BallotTopicDocument>(
  'BallotTopic',
  ballotTopicSchema
);

export default BallotTopic;
