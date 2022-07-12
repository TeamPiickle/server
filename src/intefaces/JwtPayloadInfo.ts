import { Types } from 'mongoose';

interface JwtPayloadInfo {
  user: {
    id: Types.ObjectId;
  };
}

interface User {
  id: Types.ObjectId;
}

export { JwtPayloadInfo, User };
