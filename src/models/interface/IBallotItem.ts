import { Types } from 'mongoose';

export default interface IBallotItem {
  name: string;
  ballotCount: number;
  ballotTopicId: Types.ObjectId;
};