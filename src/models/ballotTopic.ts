import { Schema, model } from 'mongoose';
import IDocument from './interface/Document';
import IBallotTopic from './interface/IBallotTopic';

type BallotTopicDocument = IBallotTopic & IDocument;

const ballotTopicSchema = new Schema<BallotTopicDocument>({
  topic: {
    type: String,
    required: true
  }
});

const BallotTopic = model<BallotTopicDocument>(
  'BallotTopic',
  ballotTopicSchema
);

export { BallotTopic, BallotTopicDocument };
