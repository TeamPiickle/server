import { Types } from 'mongoose';
export default interface CreateBallotResultDto {
  userId: Types.ObjectId;
  ballotTopicId: Types.ObjectId;
  ballotItemId: Types.ObjectId;
}
