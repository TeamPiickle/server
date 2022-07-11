import { Types } from 'mongoose';
import { JwtPayloadInfo } from './JwtPayloadInfo';
export default interface CreateBallotResultDto extends JwtPayloadInfo {
  ballotTopicId: Types.ObjectId;
  ballotItemId: Types.ObjectId;
}
