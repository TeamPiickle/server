import { Schema, model } from 'mongoose';
import IDocument from './interface/Document';
import IBallotTopic from './interface/IBallotTopic';

type BallotTopicDocument = IBallotTopic & IDocument;

const ballotTopicSchema = new Schema<BallotTopicDocument>({
  topic: {
    type: String,
    required: true
  },

  /**
   * This field is not auto-incremented and must be inserted manually.
   */
  order: {
    type: Number,
    unique: true
  }
});

const BallotTopic = model<BallotTopicDocument>(
  'BallotTopic',
  ballotTopicSchema
);

export { BallotTopic, BallotTopicDocument };
