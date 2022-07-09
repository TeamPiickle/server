import { Schema, model } from "mongoose";
import IDocument from "./interface/Document";
import IBallotItem from "./interface/IBallotItem";

type BallotItemDocument = IBallotItem & IDocument;

const ballotItemSchema = new Schema<BallotItemDocument>({
  name: {
    type: String,
    required: true,
  },
  ballotCount: {
    type: Number,
    required: true,
    default: 0
  },
  ballotTopicId: {
    type: Schema.Types.ObjectId,
    ref: 'BallotTopic',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const BallotItem = model<BallotItemDocument>('BallotItem', ballotItemSchema);

export default BallotItem;