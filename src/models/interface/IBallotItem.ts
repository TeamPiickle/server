import { Types } from 'mongoose';

export default interface IBallotItem {
  name: string;
  ballotTopicId: Types.ObjectId;
}
