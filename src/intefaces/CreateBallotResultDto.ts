import { Types } from 'mongoose';
export default interface CreateBallotResultDto {
  userId?: Types.ObjectId;
  guestId?: string;
  ballotTopicId: Types.ObjectId;
  ballotItemId: Types.ObjectId;
}
