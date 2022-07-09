import { Types} from 'mongoose';

export default interface IBallotResult {
  ballotTopicId: Types.ObjectId;
  ballotItemId: Types.ObjectId;
  userId: Types.ObjectId;
}