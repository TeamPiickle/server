import { Types } from 'mongoose';

export interface JwtPayloadInfo {
  user: {
    id: Types.ObjectId;
  };
}
